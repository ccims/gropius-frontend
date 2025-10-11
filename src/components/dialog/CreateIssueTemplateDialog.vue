<template>
    <v-dialog v-model="createIssueTemplateDialog" persistent width="auto">
        <v-card color="surface-elevated-3" rounded="lger" class="pa-3" elevation="0">
            <v-card-title class="pl-4">Create Issue Template</v-card-title>
            <v-stepper
                class="d-flex flex-column"
                v-model="step"
                :items="stepLabels"
                hide-actions
                bg-color="surface-elevated-3"
                flat
            >
                <template v-slot:item.1>
                    <v-form v-model="formGeneralValid" validate-on="blur">
                        <v-text-field v-model="templateName" v-bind="templateNameProps" label="Name" class="mb-2" />
                        <v-textarea
                            v-model="templateDescription"
                            v-bind="templateDescriptionProps"
                            label="Description"
                            class="mb-2"
                        />
                        <v-text-field
                            v-model="repositoryURL"
                            v-bind="repositoryURLProps"
                            label="Repository URL"
                            class="mb-2"
                        />
                    </v-form>
                </template>

                <template v-slot:item.2>
                    <v-form v-model="formIssueTypesValid">
                        <v-row>
                            <v-col cols="4">
                                <v-btn
                                    variant="outlined"
                                    block
                                    color="primary"
                                    class="bg-white text-primary rounded-sm px-4 py-2"
                                    @click="
                                        () => {
                                            createIssueType('', '', '', '');
                                            expandedCardKey = { nameID: '', type: 'type' };
                                        }
                                    "
                                    >+ Add Issue Type
                                </v-btn>
                                <ExpandableCard
                                    v-for="issueType in issueTypes"
                                    :key="issueType.name"
                                    :name="issueType.name"
                                    :description="issueType.description"
                                    :expandedCardKey="expandedCardKey"
                                    type="type"
                                    :nameErrorMessage="nameErrorMessage"
                                    @expand="
                                        () => {
                                            expandedCardKey = { nameID: issueType.name, type: 'type' };
                                            selectedIcon =
                                                iconList.find((icon) => icon.iconPath === issueType.iconPath) ?? null;
                                            currentEditedName = issueType.name;
                                            currentEditedDescription = issueType.description;
                                            nameErrorMessage = '';
                                        }
                                    "
                                    @cancel="cancelCreateCard()"
                                    @delete="deleteIssueTypeByName(issueType.name)"
                                    @confirm="
                                        ({ name, description }) => {
                                            if (!name) {
                                                nameErrorMessage = 'Name is required';
                                                return;
                                            }
                                            createIssueType(
                                                issueType.name,
                                                name,
                                                description,
                                                selectedIcon?.iconPath ?? ''
                                            );
                                        }
                                    "
                                >
                                    <template #preview1>
                                        <div class="border rounded d-flex align-center mx-2 my-1">
                                            <SvgWrapper :path="issueType.iconPath" />
                                        </div>
                                    </template>

                                    <template #extra>
                                        <div class="d-flex align-center justify-center">
                                            <v-tabs v-model="activeTab" density="compact" class="flex-grow-1">
                                                <v-tab value="select" class="flex-grow-1">Select Icon</v-tab>
                                                <v-tab value="add" class="flex-grow-1">Add Icon</v-tab>
                                            </v-tabs>
                                        </div>

                                        <v-window v-model="activeTab">
                                            <v-window-item value="select">
                                                <v-text-field
                                                    v-model="iconSearch"
                                                    label="Search"
                                                    density="compact"
                                                    hide-details
                                                    rounded
                                                    class="mb-2"
                                                    prepend-inner-icon="mdi-magnify"
                                                    clearable
                                                >
                                                </v-text-field>
                                                <div class="icon-container mx-n2">
                                                    <IconButton
                                                        v-for="icon in filteredIcons"
                                                        :key="icon.name"
                                                        color=""
                                                        class="icon-wrapper"
                                                        :class="{ selected: selectedIcon?.name === icon.name }"
                                                        @click="selectIcon(icon)"
                                                    >
                                                        <SvgWrapper :path="icon.iconPath" />
                                                    </IconButton>
                                                </div>
                                            </v-window-item>

                                            <v-window-item value="add">
                                                <div class="d-flex flex-column">
                                                    <v-text-field
                                                        v-model="newIcon.name"
                                                        label="Icon Name"
                                                        density="compact"
                                                        hide-details
                                                        class="mb-6"
                                                    />

                                                    <v-text-field
                                                        v-model="newIcon.iconPath"
                                                        label="SVG Path (24x24)"
                                                        density="compact"
                                                        hide-details
                                                        class="scroll-x mb-4"
                                                        clearable
                                                        @click:clear="clearNewIconPath"
                                                    />

                                                    <div class="d-flex align-center">
                                                        <v-text class="mr-2">Preview:</v-text>
                                                        <div
                                                            class="preview-box border rounded mr-2 d-flex align-center justify-center"
                                                        >
                                                            <SvgWrapper :path="newIcon.iconPath" />
                                                        </div>

                                                        <v-btn
                                                            color="primary"
                                                            size="small"
                                                            :disabled="!newIcon.name || !newIcon.iconPath"
                                                            @click="confirmAddIcon"
                                                        >
                                                            Add
                                                        </v-btn>
                                                    </div>

                                                    <div v-if="newIcon.iconPath" class="text-warning text-caption">
                                                        24x24 Icon is required
                                                    </div>
                                                </div>
                                            </v-window-item>
                                        </v-window>
                                    </template>
                                </ExpandableCard>
                            </v-col>
                            <v-col cols="4">
                                <v-btn
                                    variant="outlined"
                                    block
                                    color="primary"
                                    class="bg-white text-primary rounded-sm px-4 py-2"
                                    @click="
                                        () => {
                                            createIssuePriority('', '', '', 0);
                                            expandedCardKey = { nameID: '', type: 'priority' };
                                        }
                                    "
                                    >+ Add Issue Priority
                                </v-btn>
                                <ExpandableCard
                                    v-for="issuePriority in issuePriorities"
                                    :key="issuePriority.name"
                                    :name="issuePriority.name"
                                    :description="issuePriority.description"
                                    :expandedCardKey="expandedCardKey"
                                    type="priority"
                                    :nameErrorMessage="nameErrorMessage"
                                    @expand="
                                        () => {
                                            expandedCardKey = { nameID: issuePriority.name, type: 'priority' };
                                            currentEditedName = issuePriority.name;
                                            currentEditedDescription = issuePriority.description;
                                            currentEditedValue = issuePriority.value;
                                            nameErrorMessage = '';
                                        }
                                    "
                                    @cancel="
                                        () => {
                                            cancelCreateCard();
                                            issuePriority.value = currentEditedValue;
                                        }
                                    "
                                    @delete="deleteIssuePriorityByName(issuePriority.name)"
                                    @confirm="
                                        ({ name, description }) => {
                                            if (!name) {
                                                nameErrorMessage = 'Name is required';
                                                return;
                                            }
                                            createIssuePriority(
                                                issuePriority.name,
                                                name,
                                                description,
                                                issuePriority.value
                                            );
                                        }
                                    "
                                >
                                    <template #preview2>
                                        <div class="border rounded d-flex align-center mr-4 my-1">
                                            <span class="text-h6 mx-1">
                                                {{
                                                    issuePriority.value.toString().length > 3
                                                        ? issuePriority.value.toString().slice(0, 3) + "…"
                                                        : issuePriority.value.toString()
                                                }}
                                            </span>
                                        </div>
                                    </template>

                                    <template #extra>
                                        <v-text-field
                                            v-model.number="issuePriority.value"
                                            label="Value"
                                            class="mx-2 mb-2"
                                            density="compact"
                                            type="number"
                                            :error="!!valueErrorMessage"
                                            :error-messages="valueErrorMessage"
                                        />
                                    </template>
                                </ExpandableCard>
                            </v-col>
                            <v-col cols="4">
                                <v-btn
                                    variant="outlined"
                                    block
                                    color="primary"
                                    class="bg-white text-primary rounded-sm px-4 py-2"
                                    @click="
                                        () => {
                                            createIssueState('', '', '', true);
                                            expandedCardKey = { nameID: '', type: 'state' };
                                        }
                                    "
                                    >+ Add Issue State
                                </v-btn>
                                <ExpandableCard
                                    v-for="issueState in issueStates"
                                    :key="issueState.name"
                                    :name="issueState.name"
                                    :description="issueState.description"
                                    :expandedCardKey="expandedCardKey"
                                    type="state"
                                    :nameErrorMessage="nameErrorMessage"
                                    @expand="
                                        () => {
                                            expandedCardKey = { nameID: issueState.name, type: 'state' };
                                            currentEditedName = issueState.name;
                                            currentEditedDescription = issueState.description;
                                            currentEditedIsOpen = issueState.isOpen;
                                            nameErrorMessage = '';
                                        }
                                    "
                                    @cancel="
                                        () => {
                                            cancelCreateCard();
                                            issueState.isOpen = currentEditedIsOpen;
                                        }
                                    "
                                    @delete="deleteIssueStateByName(issueState.name)"
                                    @confirm="
                                        ({ name, description }) => {
                                            if (!name) {
                                                nameErrorMessage = 'Name is required';
                                                return;
                                            }
                                            createIssueState(issueState.name, name, description, issueState.isOpen);
                                        }
                                    "
                                >
                                    <template #preview1>
                                        <div class="mx-2">
                                            <v-icon :color="issueState.isOpen ? 'success' : 'error'">mdi-circle</v-icon>
                                        </div>
                                    </template>

                                    <template #extra>
                                        <v-checkbox v-model="issueState.isOpen" label="Open?" />
                                    </template>
                                </ExpandableCard>
                            </v-col>
                        </v-row>
                    </v-form>
                </template>

                <template v-slot:item.3>
                    <v-form v-model="formIssuePrioritiesValid">
                        <v-row>
                            <v-col cols="6">
                                <v-btn
                                    variant="outlined"
                                    block
                                    color="primary"
                                    class="bg-white text-primary rounded-sm px-4 py-2"
                                    @click="
                                        () => {
                                            createAssignmentType('', '', '');
                                            expandedCardKey = { nameID: '', type: 'assignment' };
                                        }
                                    "
                                    >+ Add Assignment Type
                                </v-btn>
                                <ExpandableCard
                                    v-for="assignmentType in assignmentTypes"
                                    :key="assignmentType.name"
                                    :name="assignmentType.name"
                                    :description="assignmentType.description"
                                    :expandedCardKey="expandedCardKey"
                                    type="assignment"
                                    :nameErrorMessage="nameErrorMessage"
                                    @expand="
                                        () => {
                                            expandedCardKey = { nameID: assignmentType.name, type: 'assignment' };
                                            currentEditedName = assignmentType.name;
                                            currentEditedDescription = assignmentType.description;
                                            nameErrorMessage = '';
                                        }
                                    "
                                    @cancel="
                                        () => {
                                            cancelCreateCard();
                                            assignmentType.name = currentEditedName;
                                            assignmentType.description = currentEditedDescription;
                                        }
                                    "
                                    @delete="deleteAssignmentTypeByName(assignmentType.name)"
                                    @confirm="
                                        ({ name, description }) => {
                                            if (!name) {
                                                nameErrorMessage = 'Name is required';
                                                return;
                                            }
                                            createAssignmentType(assignmentType.name, name, description);
                                        }
                                    "
                                >
                                </ExpandableCard>
                            </v-col>
                            <v-col cols="6">
                                <v-btn
                                    variant="outlined"
                                    block
                                    color="primary"
                                    class="bg-white text-primary rounded-sm px-4 py-2"
                                    @click="
                                        () => {
                                            createRelationType('', '', '', '');
                                            expandedCardKey = { nameID: '', type: 'relation' };
                                        }
                                    "
                                    >+ Add Relation Type
                                </v-btn>
                                <ExpandableCard
                                    v-for="relationType in relationTypes"
                                    :key="relationType.name"
                                    :name="relationType.name"
                                    :description="relationType.description"
                                    :expandedCardKey="expandedCardKey"
                                    type="relation"
                                    :nameErrorMessage="nameErrorMessage"
                                    @expand="
                                        () => {
                                            expandedCardKey = { nameID: relationType.name, type: 'relation' };
                                            currentEditedName = relationType.name;
                                            currentEditedDescription = relationType.description;
                                            currentEditedInverseName = relationType.inverseName;
                                            nameErrorMessage = '';
                                            inverseNameErrorMessage = '';
                                        }
                                    "
                                    @cancel="
                                        () => {
                                            cancelCreateCard();
                                            relationType.inverseName = currentEditedInverseName;
                                        }
                                    "
                                    @delete="deleteRelationTypeByName(relationType.name)"
                                    @confirm="
                                        ({ name, description }) => {
                                            if (!name) {
                                                nameErrorMessage = 'Name is required';
                                                return;
                                            }
                                            if (!relationType.inverseName) {
                                                inverseNameErrorMessage = 'Inverse Name is required';
                                                return;
                                            }
                                            createRelationType(
                                                relationType.name,
                                                name,
                                                relationType.inverseName,
                                                description
                                            );
                                        }
                                    "
                                >
                                    <template #extra>
                                        <v-text-field
                                            v-model="relationType.inverseName"
                                            label="Inverse Name"
                                            class="mx-2 mb-2"
                                            density="compact"
                                            :error="!!inverseNameErrorMessage"
                                            :error-messages="inverseNameErrorMessage"
                                        />
                                    </template>
                                </ExpandableCard>
                            </v-col>
                        </v-row>
                    </v-form>
                </template>

                <template v-slot:item.4>
                    <v-form v-model="formIssueStatesValid">
                        <v-combobox v-model="issueStates" label="Issue States" multiple chips clearable class="mb-2" />
                    </v-form>
                </template>
            </v-stepper>

            <v-card-actions>
                <DefaultButton variant="text" :disabled="step === 1" @click="previous">Previous</DefaultButton>
                <v-spacer />
                <DefaultButton variant="text" color="" @click="!isDirty && cancelCreateIssueTemplate()">
                    Cancel
                    <ConfirmationDialog
                        v-if="isDirty"
                        :title="`Discard Issue Template?`"
                        :message="`Are you sure you want to discard this issue template?`"
                        confirm-text="Discard"
                        @confirm="cancelCreateIssueTemplate"
                    />
                </DefaultButton>
                <DefaultButton variant="text" color="primary" @click="next">{{
                    step === stepLabels.length ? "Create" : "Next"
                }}</DefaultButton>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useForm, defineField } from "vee-validate";
import * as yup from "yup";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { onEvent } from "@/util/eventBus";
import { computed } from "vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import ExpandableCard from "../ExpandableCard.vue";

import { iconList as baseIconList } from "../icons";
import SvgWrapper from "../SvgWrapper.vue";

const createIssueTemplateDialog = ref(false);
const step = ref(1);
const stepLabels = [
    "General",
    "Issue Types, Priorities & States",
    "Assignment & Relation Types",
    "Template Field Specifications"
];

const formGeneralValid = ref(false);
const formIssueTypesValid = ref(true);
const formIssuePrioritiesValid = ref(true);
const formIssueStatesValid = ref(true);
const formAssignmentTypeValid = ref(true);
const formRelationTypeValid = ref(true);
const formVersionTemplatesValid = ref(true);
const formTemplateFieldsValid = ref(true);

const expandedCardKey = ref<{
    nameID: string;
    type: "type" | "priority" | "state";
} | null>(null);

const currentEditedName = ref<string>("");
const currentEditedDescription = ref<string>("");
const nameErrorMessage = ref<string>("");

const currentEditedValue = ref<number>(0);
const valueErrorMessage = ref<string>("");

const currentEditedIsOpen = ref<boolean>(false);

const currentEditedInverseName = ref<string>("");
const inverseNameErrorMessage = ref<string>("");

type IssueType = {
    name: string;
    description: string;
    iconPath: string;
};

type IssuePriority = {
    name: string;
    description: string;
    value: number;
};

type IssueState = {
    name: string;
    description: string;
    isOpen: boolean;
};

type AssignmentType = {
    name: string;
    description: string;
};

type RelationType = {
    name: string;
    inverseName: string;
    description: string;
};

type Icon = {
    name: string;
    iconPath: string;
};

const iconList = ref<Icon[]>([...baseIconList]);

const newIcon = ref<Icon>({ name: "", iconPath: "" });
const activeTab = ref("select");
const selectedIcon = ref<Icon | null>(null);

function selectIcon(icon: Icon) {
    selectedIcon.value = icon;
}

const iconSearch = ref("");

const filteredIcons = computed(() => {
    if (!iconSearch.value) return iconList.value;
    return iconList.value.filter((icon) => icon.name.toLowerCase().startsWith(iconSearch.value.toLowerCase()));
});

function clearNewIconPath() {
    newIcon.value.iconPath = "";
}

function confirmAddIcon() {
    if (newIcon.value.name && newIcon.value.iconPath) {
        iconList.value.push({ name: newIcon.value.name, iconPath: newIcon.value.iconPath.trim().replace(/\"/g, "") });
        selectedIcon.value = { name: newIcon.value.name, iconPath: newIcon.value.iconPath.trim().replace(/\"/g, "") };
        newIcon.value = { name: "", iconPath: "" };
        activeTab.value = "select";
    }
}

const issueTypes = ref<IssueType[]>([
    {
        name: "Bug",
        description: "A bug in the system",
        iconPath: iconList.value.find((icon) => icon.name === "GropiusBug")?.iconPath ?? ""
    },
    {
        name: "Feature",
        description: "A new feature",
        iconPath: iconList.value.find((icon) => icon.name === "Feature")?.iconPath ?? ""
    },
    {
        name: "Misc",
        description: "Miscellaneous",
        iconPath: iconList.value.find((icon) => icon.name === "Miscellaneous")?.iconPath ?? ""
    },
    {
        name: "Task",
        description: "A task",
        iconPath: iconList.value.find((icon) => icon.name === "Task")?.iconPath ?? ""
    }
]);
const issuePriorities = ref<IssuePriority[]>([
    { name: "High", description: "High priority", value: 3 },
    { name: "Low", description: "Low priority", value: 1 },
    { name: "Medium", description: "Medium priority", value: 2 }
]);
const issueStates = ref<IssueState[]>([
    { name: "Completed", description: "The issue is completed", isOpen: false },
    { name: "Not planned", description: "The issue is not planned", isOpen: false },
    { name: "Open", description: "The issue is open", isOpen: true }
]);
const assignmentTypes = ref<AssignmentType[]>([]);
const relationTypes = ref<RelationType[]>([
    { name: "Depends on", inverseName: "Depended on by", description: "Depends on another issue" },
    { name: "Duplicate", inverseName: "Duplicate", description: "Is a duplicate of another issue" },
    { name: "Part of", inverseName: "Has part", description: "Is part of another issue" }
]);

function createIssueType(previousName: string, newName: string, description: string, iconPath: string) {
    if (newName.trim().length === 0 && previousName.trim().length !== 0) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
        {
            if (issueTypes.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
                nameErrorMessage.value = "Name already exists";
                return;
            } else {
                nameErrorMessage.value = "";
            }
        }
    }

    deleteIssueTypeByName(previousName);
    issueTypes.value.push({ name: newName, description: description, iconPath: iconPath });

    issueTypes.value.sort((a, b) => a.name.localeCompare(b.name));
    expandedCardKey.value = null;
    selectedIcon.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
}

function deleteIssueTypeByName(nameToDelete: string) {
    issueTypes.value = issueTypes.value.filter((t) => t.name !== nameToDelete);
}

function createIssuePriority(previousName: string, newName: string, description: string, value: number) {
    if (newName.trim().length === 0 && previousName.trim().length !== 0) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
        if (issuePriorities.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
            nameErrorMessage.value = "Name already exists";
            return;
        } else {
            nameErrorMessage.value = "";
        }
    }

    if (value === null && previousName.trim() !== "") {
        valueErrorMessage.value = "Value is required";
        return;
    } else if (typeof value !== "number") {
        valueErrorMessage.value = "Value must be a number";
        return;
    } else {
        valueErrorMessage.value = "";
    }

    deleteIssuePriorityByName(previousName);
    issuePriorities.value.push({ name: newName, description, value });

    issuePriorities.value.sort((a, b) => a.name.localeCompare(b.name));
    expandedCardKey.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
    currentEditedValue.value = 0;
}

function deleteIssuePriorityByName(nameToDelete: string) {
    issuePriorities.value = issuePriorities.value.filter((p) => p.name !== nameToDelete);
}

function createIssueState(previousName: string, newName: string, description: string, isOpen: boolean) {
    if (newName.trim().length === 0 && previousName.trim().length !== 0) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
        if (issueStates.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
            nameErrorMessage.value = "Name already exists";
            return;
        } else {
            nameErrorMessage.value = "";
        }
    }

    deleteIssueStateByName(previousName);
    issueStates.value.push({ name: newName, description, isOpen });

    issueStates.value.sort((a, b) => a.name.localeCompare(b.name));
    expandedCardKey.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
    currentEditedIsOpen.value = false;
}

function deleteIssueStateByName(nameToDelete: string) {
    issueStates.value = issueStates.value.filter((s) => s.name !== nameToDelete);
}

function createAssignmentType(previousName: string, newName: string, description: string) {
    if (newName.trim().length === 0 && previousName.trim().length !== 0) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
        if (issueStates.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
            nameErrorMessage.value = "Name already exists";
            return;
        } else {
            nameErrorMessage.value = "";
        }
    }

    deleteAssignmentTypeByName(previousName);
    assignmentTypes.value.push({ name: newName, description });

    assignmentTypes.value.sort((a, b) => a.name.localeCompare(b.name));
    expandedCardKey.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
}

function deleteAssignmentTypeByName(nameToDelete: string) {
    assignmentTypes.value = assignmentTypes.value.filter((s) => s.name !== nameToDelete);
}

function createRelationType(previousName: string, newName: string, inverseName: string, description: string) {
    if (newName.trim().length === 0 && previousName.trim().length !== 0) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
        if (issueStates.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
            nameErrorMessage.value = "Name already exists";
            return;
        } else {
            nameErrorMessage.value = "";
        }
    }

    if (inverseName.trim().length === 0 && previousName.trim().length !== 0) {
        inverseNameErrorMessage.value = "Inverse Name is required";
        return;
    } else {
        inverseNameErrorMessage.value = "";
    }

    deleteRelationTypeByName(previousName);
    relationTypes.value.push({ name: newName, inverseName, description });

    relationTypes.value.sort((a, b) => a.name.localeCompare(b.name));
    expandedCardKey.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
    currentEditedInverseName.value = "";
}

function deleteRelationTypeByName(nameToDelete: string) {
    relationTypes.value = relationTypes.value.filter((s) => s.name !== nameToDelete);
}

function cancelCreateCard() {
    expandedCardKey.value = null;
    nameErrorMessage.value = "";
    inverseNameErrorMessage.value = "";
    valueErrorMessage.value = "";
    deleteIssueTypeByName("");
    deleteIssuePriorityByName("");
    deleteIssueStateByName("");
    deleteAssignmentTypeByName("");
    deleteRelationTypeByName("");
}

const schema = yup.object({
    templateName: yup.string().required("Name is required"),
    templateDescription: yup.string().optional(),
    repositoryURL: yup.string().optional()
});

const { defineField, resetForm, handleSubmit, meta, validate } = useForm({
    validationSchema: schema
});

const [templateName, templateNameProps] = defineField("templateName", fieldConfig);
const [templateDescription, templateDescriptionProps] = defineField("templateDescription", fieldConfig);
const [repositoryURL, repositoryURLProps] = defineField("repositoryURL", fieldConfig);

onEvent("create-issue-template", () => {
    resetForm();
    createIssueTemplateDialog.value = true;
    step.value = 1;
});

function next() {
    if (step.value === 1) {
        if (!meta.value.valid) {
            validate();
            return;
        }
    }
    if (step.value < stepLabels.length) {
        step.value++;
    } else {
        console.log("Submit issue template");
        createIssueTemplateDialog.value = false;
    }
}

function previous() {
    if (step.value > 1) step.value--;
}

function cancelCreateIssueTemplate() {
    createIssueTemplateDialog.value = false;
}

const isDirty = computed(() => {
    return step.value > 1 || meta.value.dirty;
});
</script>

<style scoped>
.pa-3 {
    padding: 1rem;
}

.icon-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    max-width: 260px;
    max-height: 200px;
    overflow-y: auto;

    border: 1px solid rgba(var(--v-theme-on-surface), 0.6);
    border-radius: 8px;
    padding: 8px;
    background-color: rgb(var(--v-theme-elevation));
}

.icon-wrapper {
    width: 48px;
    height: 48px;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-wrapper:hover {
    border-color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.05);
}

.icon-wrapper.selected {
    border-color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.2);
}
</style>
