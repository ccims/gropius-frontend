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
                        <v-text-field
                            v-model="templateName"
                            v-bind="templateNameProps"
                            label="Name"
                            class="mb-2"
                            :messages="templateAlreadyExists ? ['⚠️ A template with this name already exists'] : []"
                            :class="{ 'text-warning': templateAlreadyExists }"
                        />
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
                                            createIssueTypeInput('', '', '', '');
                                            expandedCardKey = { nameID: '', type: 'type' };
                                        }
                                    "
                                    >+ Add Issue Type
                                </v-btn>
                                <ExpandableCard
                                    v-for="IssueTypeInput in IssueTypes"
                                    :key="IssueTypeInput.name"
                                    :name="IssueTypeInput.name"
                                    :description="IssueTypeInput.description"
                                    :expandedCardKey="expandedCardKey"
                                    type="type"
                                    :nameErrorMessage="nameErrorMessage"
                                    @expand="
                                        () => {
                                            expandedCardKey = { nameID: IssueTypeInput.name, type: 'type' };
                                            selectedIcon =
                                                iconList.find((icon) => icon.iconPath === IssueTypeInput.iconPath) ??
                                                null;
                                            currentEditedName = IssueTypeInput.name;
                                            currentEditedDescription = IssueTypeInput.description;
                                            nameErrorMessage = '';
                                        }
                                    "
                                    @cancel="cancelCreateCard()"
                                    @delete="deleteIssueTypeInputByName(IssueTypeInput.name)"
                                    @confirm="
                                        ({ name, description }) => {
                                            if (!name) {
                                                nameErrorMessage = 'Name is required';
                                                return;
                                            }
                                            createIssueTypeInput(
                                                IssueTypeInput.name,
                                                name,
                                                description,
                                                selectedIcon?.iconPath ?? ''
                                            );
                                        }
                                    "
                                >
                                    <template #previewLeft>
                                        <div class="border rounded d-flex align-center mx-2 my-1">
                                            <SvgWrapper :path="IssueTypeInput.iconPath" />
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

                                                <div class="icon-container mx-n2" v-if="activeTab === 'select'">
                                                    <v-lazy
                                                        v-for="icon in filteredIcons"
                                                        :key="icon.name"
                                                        min-height="48"
                                                        transition="fade-transition"
                                                    >
                                                        <IconButton
                                                            color=""
                                                            class="icon-wrapper"
                                                            :class="{ selected: selectedIcon?.name === icon.name }"
                                                            @click="selectIcon(icon)"
                                                        >
                                                            <SvgWrapper :path="icon.iconPath" />
                                                            <v-tooltip activator="parent" location="top">
                                                                {{ icon.name }}
                                                            </v-tooltip>
                                                        </IconButton>
                                                    </v-lazy>
                                                </div>
                                            </v-window-item>

                                            <v-window-item value="add">
                                                <div class="d-flex flex-column" v-if="activeTab === 'add'">
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
                                                            :disabled="
                                                                !newIcon.name ||
                                                                !newIcon.iconPath ||
                                                                !allowedPathElements
                                                            "
                                                            @click="confirmAddIcon"
                                                        >
                                                            Add
                                                        </v-btn>
                                                    </div>

                                                    <div class="text-warning text-caption">
                                                        Expected: 24x24, fill color, no stroke
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
                                    <template #previewRight>
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
                                    <template #previewLeft>
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
                        <v-combobox
                            v-model="issueStates"
                            label="Template Field Specifications"
                            multiple
                            chips
                            clearable
                            class="mb-2"
                        />
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
import { ref, watch, nextTick } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { useClient } from "@/graphql/client";
import { onEvent } from "@/util/eventBus";
import { computed } from "vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import ExpandableCard from "../ExpandableCard.vue";

import { iconList as baseIconList } from "../icons";
import SvgWrapper from "../SvgWrapper.vue";

import type {
    IssueTypeInput,
    IssuePriorityInput,
    IssueStateInput,
    AssignmentTypeInput,
    IssueRelationTypeInput
} from "@/graphql/generated.ts";

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

const client = useClient();

const templateAlreadyExists = ref<boolean>(false);
watch(templateName, async (newName) => {
    if (!newName) {
        templateAlreadyExists.value = false;
        return;
    }

    const res = await client.searchIssueTemplates({ query: newName, count: 1 });
    templateAlreadyExists.value = res.searchIssueTemplates.some((t: { name: string }) => t.name === newName);
});

const expandedCardKey = ref<{
    nameID: string;
    type: string;
} | null>(null);

const currentEditedName = ref<string>("");
const currentEditedDescription = ref<string>("");
const nameErrorMessage = ref<string>("");

const currentEditedValue = ref<number>(0);
const valueErrorMessage = ref<string>("");

const currentEditedIsOpen = ref<boolean>(false);

const currentEditedInverseName = ref<string>("");
const inverseNameErrorMessage = ref<string>("");

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
    return iconList.value.filter((icon) => icon.name.toLowerCase().includes(iconSearch.value.toLowerCase()));
});

function clearNewIconPath() {
    newIcon.value.iconPath = "";
}

const allowedPathElements = ref<boolean>(false);
const originalAllowedPathElements = (path: string) => /^[MmLlHhVvCcSsQqTtAaZz0-9 ,."\-]+$/g.test(path);

watch(
    () => newIcon.value.iconPath,
    (newPath) => (allowedPathElements.value = originalAllowedPathElements(newPath))
);

function confirmAddIcon() {
    if (newIcon.value.name && newIcon.value.iconPath && allowedPathElements) {
        const newEntry = {
            name: newIcon.value.name,
            iconPath: newIcon.value.iconPath.trim().replace(/\"/g, "")
        };

        iconList.value.unshift(newEntry);
        selectedIcon.value = newEntry;
        iconSearch.value = "";
        newIcon.value = { name: "", iconPath: "" };
        activeTab.value = "select";
    }
}

const IssueTypes = ref<IssueTypeInput[]>([
    {
        name: "Bug",
        description: "A bug in the system",
        iconPath: iconList.value.find((icon) => icon.name === "Gropius-Bug")?.iconPath ?? ""
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
const issuePriorities = ref<IssuePriorityInput[]>([
    { name: "High", description: "High priority", value: 3 },
    { name: "Low", description: "Low priority", value: 1 },
    { name: "Medium", description: "Medium priority", value: 2 }
]);
const issueStates = ref<IssueStateInput[]>([
    { name: "Completed", description: "The issue is completed", isOpen: false },
    { name: "Not planned", description: "The issue is not planned", isOpen: false },
    { name: "Open", description: "The issue is open", isOpen: true }
]);
const assignmentTypes = ref<AssignmentTypeInput[]>([]);
const relationTypes = ref<IssueRelationTypeInput[]>([
    { name: "Depends on", inverseName: "Depended on by", description: "Depends on another issue" },
    { name: "Duplicate", inverseName: "Duplicate", description: "Is a duplicate of another issue" },
    { name: "Part of", inverseName: "Has part", description: "Is part of another issue" }
]);

function createIssueTypeInput(previousName: string, newName: string, description: string, iconPath: string) {
    if (newName.trim().length === 0 && previousName.trim().length !== 0) {
        nameErrorMessage.value = "Name is required";
        return;
    }
    if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
        {
            if (IssueTypes.value.some((item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
                nameErrorMessage.value = "Name already exists";
                return;
            } else {
                nameErrorMessage.value = "";
            }
        }
    }

    deleteIssueTypeInputByName(previousName);
    IssueTypes.value.push({ name: newName, description: description, iconPath: iconPath });

    IssueTypes.value.sort((a, b) => a.name.localeCompare(b.name));
    expandedCardKey.value = null;
    selectedIcon.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
}

function deleteIssueTypeInputByName(nameToDelete: string) {
    IssueTypes.value = IssueTypes.value.filter((t) => t.name !== nameToDelete);
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
    deleteIssueTypeInputByName("");
    deleteIssuePriorityByName("");
    deleteIssueStateByName("");
    deleteAssignmentTypeByName("");
    deleteRelationTypeByName("");
}

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
