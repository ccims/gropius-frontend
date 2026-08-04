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
                        <v-row>
                            <v-col cols="6">
                                <v-text-field
                                    v-model="templateName"
                                    v-bind="templateNameProps"
                                    label="Name"
                                    class="mb-2"
                                    :messages="
                                        templateAlreadyExists ? ['⚠️ A template with this name already exists'] : []
                                    "
                                    :class="{ 'text-warning': templateAlreadyExists }"
                                />
                            </v-col>
                            <v-col cols="6">
                                <IssueTemplateAutocomplete
                                    v-model="selectedTemplates"
                                    multiple
                                    :error-messages="templateInheritanceErrorMessage"
                                />
                            </v-col>
                        </v-row>
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
                    <v-form v-model="formissueTypesValid">
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
                                    v-for="IssueType in issueTypes"
                                    :key="IssueType.name"
                                    :name="IssueType.name"
                                    :description="IssueType.description"
                                    :expandedCardKey="expandedCardKey"
                                    type="type"
                                    :nameErrorMessage="nameErrorMessage"
                                    :editable="
                                        !disabledCards.issueTypes.some((entry) => entry.entry === IssueType.name)
                                    "
                                    @expand="
                                        () => {
                                            expandedCardKey = { nameID: IssueType.name, type: 'type' };
                                            selectedIcon =
                                                iconList.find((icon) => icon.iconPath === IssueType.iconPath) ?? null;
                                            currentEditedName = IssueType.name;
                                            currentEditedDescription = IssueType.description;
                                            nameErrorMessage = '';
                                        }
                                    "
                                    @cancel="cancelCreateCard()"
                                    @delete="deleteIssueTypeInputByName(IssueType.name)"
                                    @confirm="
                                        ({ name, description }) => {
                                            if (!name) {
                                                nameErrorMessage = 'Name is required';
                                                return;
                                            }
                                            createIssueTypeInput(
                                                IssueType.name,
                                                name,
                                                description,
                                                selectedIcon?.iconPath ?? ''
                                            );
                                        }
                                    "
                                >
                                    <template #previewLeft>
                                        <div class="border rounded d-flex align-center mx-2 my-1">
                                            <SvgWrapper :path="IssueType.iconPath" />
                                        </div>
                                    </template>

                                    <template #extra>
                                        <div v-if="expandedCardKey?.nameID === IssueType.name">
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
                                                            <span class="mr-2">Preview:</span>
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
                                        </div>
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
                                            createIssuePriority('', '', '', 0, '');
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
                                    :editable="
                                        !disabledCards.issuePriorities.some(
                                            (entry) => entry.entry === issuePriority.name
                                        )
                                    "
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
                                                issuePriority.value,
                                                selectedIcon?.iconPath ?? ''
                                            );
                                        }
                                    "
                                >
                                    <template #previewLeft>
                                        <div class="border rounded d-flex align-center mx-2 my-1">
                                            <SvgWrapper :path="issuePriority.iconPath" />
                                        </div>
                                    </template>
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
                                        <v-number-input
                                            v-model="issuePriority.value"
                                            :precision="null"
                                            label="Value"
                                            class="mx-2 mb-2"
                                            density="compact"
                                            :error="!!valueErrorMessage"
                                            :error-messages="valueErrorMessage"
                                        />
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
                                                        <span class="mr-2">Preview:</span>
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
                                    :editable="
                                        !disabledCards.issueStates.some((entry) => entry.entry === issueState.name)
                                    "
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
                                    :editable="
                                        !disabledCards.assignmentTypes.some(
                                            (entry) => entry.entry === assignmentType.name
                                        )
                                    "
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
                                    :editable="
                                        !disabledCards.relationTypes.some((entry) => entry.entry === relationType.name)
                                    "
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
                        <v-btn
                            variant="outlined"
                            block
                            color="primary"
                            class="bg-white text-primary rounded-sm px-4 py-2"
                            @click="
                                () => {
                                    createTemplateFieldSpecification('', '', {});
                                    expandedCardKey = { nameID: '', type: 'templateFieldSpecification' };
                                }
                            "
                            >+ Add Template Field Specification
                        </v-btn>
                        <ExpandableCard
                            v-for="specifications in templateFieldSpecifications"
                            :key="specifications.name"
                            :name="specifications.name"
                            :expandedCardKey="expandedCardKey"
                            type="templateFieldSpecification"
                            :nameErrorMessage="nameErrorMessage"
                            :editable="
                                !disabledCards.templateFieldSpecifications.some(
                                    (entry) => entry.entry === specifications.name
                                )
                            "
                            @expand="
                                () => {
                                    expandedCardKey = {
                                        nameID: specifications.name,
                                        type: 'templateFieldSpecification'
                                    };
                                    currentEditedName = specifications.name;
                                    currentEditedTemplatedValue = specifications.value;
                                    nameErrorMessage = '';
                                }
                            "
                            @cancel="
                                () => {
                                    cancelCreateCard();
                                    specifications.name = currentEditedName;
                                    specifications.value = currentEditedTemplatedValue;
                                }
                            "
                            @delete="deleteTemplateFieldSpecificationByName(specifications.name)"
                            @confirm="
                                ({ name }) => {
                                    if (!name) {
                                        nameErrorMessage = 'Name is required';
                                        return;
                                    }
                                    createTemplateFieldSpecification(specifications.name, name, specifications.value);
                                }
                            "
                        >
                            <template #extra>
                                <TemplatedFieldSpecificationsValueBox
                                    v-model="specifications.value"
                                    :rawNode="specifications.value"
                                >
                                </TemplatedFieldSpecificationsValueBox>
                            </template>
                        </ExpandableCard>
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
                <DefaultButton
                    variant="text"
                    color="primary"
                    :disabled="step === stepLabels.length && submitDisabled"
                    @click="next"
                    >{{ step === stepLabels.length ? "Create" : "Next" }}</DefaultButton
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { fieldConfig } from "@/util/vuetifyFormConfig";
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { onEvent } from "@/util/eventBus";
import { useBlockingWithErrorMessage } from "@/util/withErrorMessage";
import { computed } from "vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import IssueTemplateAutocomplete from "../input/IssueTemplateAutocomplete.vue";
import ExpandableCard from "../ExpandableCard.vue";
import TemplatedFieldSpecificationsValueBox from "../TemplatedFieldSpecificationsValueBox.vue";

import { iconList as baseIconList } from "../icons";
import SvgWrapper from "../SvgWrapper.vue";

import type {
    IssueTypeInput,
    IssuePriorityInput,
    IssueStateInput,
    AssignmentTypeInput,
    IssueRelationTypeInput,
    JsonFieldInput,
    IssueTemplateFieldsFragment,
    DefaultIssueTemplateInfoFragment
} from "@/gql/graphql";

const searchIssueTemplatesByNameQuery = graphql(`
    query searchIssueTemplatesByName($query: String!, $count: Int!) {
        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            id
            name
        }
    }
`);

const getIssueTemplateFieldsQuery = graphql(`
    query getIssueTemplateFields($id: ID!) {
        node(id: $id) {
            __typename
            ... on IssueTemplate {
                ...IssueTemplateFields
            }
        }
    }
`);

const getIssueTemplateNameQuery = graphql(`
    query getIssueTemplateName($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on IssueTemplate {
                name
            }
        }
    }
`);

const createIssueTemplateMutation = graphql(`
    mutation createIssueTemplate($input: CreateIssueTemplateInput!) {
        createIssueTemplate(input: $input) {
            issueTemplate {
                ...DefaultIssueTemplateInfo
            }
        }
    }
`);

const emit = defineEmits<{
    (event: "created-template", template: DefaultIssueTemplateInfoFragment): void;
}>();

const createIssueTemplateDialog = ref(false);
const step = ref(1);
const stepLabels = [
    "General",
    "Issue Types, Priorities & States",
    "Assignment & Relation Types",
    "Template Field Specifications"
];

const formGeneralValid = ref(false);
const formissueTypesValid = ref(true);
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

const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const templateAlreadyExists = ref<boolean>(false);
watch(templateName, async (newName) => {
    if (!newName) {
        templateAlreadyExists.value = false;
        return;
    }

    const res = await requestThrow(searchIssueTemplatesByNameQuery, { query: newName, count: 1 });
    templateAlreadyExists.value = res.searchIssueTemplates.some((t) => t.name === newName);
});

const selectedTemplates = ref<string[]>([]);

async function loadTemplate(id: string) {
    return await queryNodeThrow(getIssueTemplateFieldsQuery, "IssueTemplate", { id });
}

async function getTemplateName(id: string) {
    const template = await queryNodeThrow(getIssueTemplateNameQuery, "IssueTemplate", { id });
    return template.name;
}

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

const currentEditedTemplatedValue = ref<JsonFieldInput["value"]>();

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

const issueTypes = ref<IssueTypeInput[]>([]);
const issuePriorities = ref<IssuePriorityInput[]>([]);
const issueStates = ref<IssueStateInput[]>([]);
const assignmentTypes = ref<AssignmentTypeInput[]>([]);
const relationTypes = ref<IssueRelationTypeInput[]>([]);
const templateFieldSpecifications = ref<JsonFieldInput[]>([]);

type InheritedEntry = {
    entry: string;
    fromTemplate: string;
};

const disabledCards = ref<Record<string, InheritedEntry[]>>({
    issueTypes: [],
    issuePriorities: [],
    issueStates: [],
    assignmentTypes: [],
    relationTypes: [],
    templateFieldSpecifications: []
});

const templateInheritanceErrorMessage = ref<string>("");
const isInheritanceConflict = ref<boolean>(false);

async function handleTemplateInheritance() {
    deleteObsoleteAttributes();
    for (const templateId of selectedTemplates.value) {
        try {
            const templateNode = await loadTemplate(templateId);
            await handleInheritanceConflicts(templateNode);
            if (templateInheritanceErrorMessage.value) {
                isInheritanceConflict.value = true;
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }
    deleteObsoleteAttributes();
    isInheritanceConflict.value = false;
}

watch(selectedTemplates, async () => {
    await handleTemplateInheritance();
});

async function handleInheritanceConflicts(templateNode: IssueTemplateFieldsFragment) {
    for (const issueType of disabledCards.value.issueTypes) {
        if (
            templateNode.id !== issueType.fromTemplate &&
            templateNode.issueTypes.nodes.some((t) => t.name === issueType.entry)
        ) {
            templateInheritanceErrorMessage.value = `${templateNode.name} is in conflict with ${await getTemplateName(issueType.fromTemplate)}`;
            return;
        }
    }
    for (const issuePriority of disabledCards.value.issuePriorities) {
        if (
            templateNode.id !== issuePriority.fromTemplate &&
            templateNode.issuePriorities.nodes.some((t) => t.name === issuePriority.entry)
        ) {
            templateInheritanceErrorMessage.value = `${templateNode.name} is in conflict with ${await getTemplateName(issuePriority.fromTemplate)}`;
            return;
        }
    }
    for (const issueState of disabledCards.value.issueStates) {
        if (
            templateNode.id !== issueState.fromTemplate &&
            templateNode.issueStates.nodes.some((t) => t.name === issueState.entry)
        ) {
            templateInheritanceErrorMessage.value = `${templateNode.name} is in conflict with ${await getTemplateName(issueState.fromTemplate)}`;
            return;
        }
    }
    for (const assignmentType of disabledCards.value.assignmentTypes) {
        if (
            templateNode.id !== assignmentType.fromTemplate &&
            templateNode.assignmentTypes.nodes.some((t) => t.name === assignmentType.entry)
        ) {
            templateInheritanceErrorMessage.value = `${templateNode.name} is in conflict with ${await getTemplateName(assignmentType.fromTemplate)}`;
            return;
        }
    }
    for (const relationType of disabledCards.value.relationTypes) {
        if (
            templateNode.id !== relationType.fromTemplate &&
            templateNode.relationTypes.nodes.some((t) => t.name === relationType.entry)
        ) {
            templateInheritanceErrorMessage.value = `${templateNode.name} is in conflict with ${await getTemplateName(relationType.fromTemplate)}`;
            return;
        }
    }
    for (const templateFieldSpecification of disabledCards.value.templateFieldSpecifications) {
        if (
            templateNode.id !== templateFieldSpecification.fromTemplate &&
            templateNode.templateFieldSpecifications.some((t) => t.name === templateFieldSpecification.entry)
        ) {
            templateInheritanceErrorMessage.value = `${templateNode.name} is in conflict with ${await getTemplateName(templateFieldSpecification.fromTemplate)}`;
            return;
        }
    }
    templateInheritanceErrorMessage.value = "";
    pushAttributes(templateNode);
    pushDisabledCards(templateNode);
}

function pushAttributes(templateNode: IssueTemplateFieldsFragment) {
    issueTypes.value.push(
        ...templateNode.issueTypes.nodes.filter((t) => !issueTypes.value.some((e) => e.name === t.name))
    );
    issueStates.value.push(
        ...templateNode.issueStates.nodes.filter((t) => !issueStates.value.some((e) => e.name === t.name))
    );
    issuePriorities.value.push(
        ...templateNode.issuePriorities.nodes.filter((t) => !issuePriorities.value.some((e) => e.name === t.name))
    );
    assignmentTypes.value.push(
        ...templateNode.assignmentTypes.nodes.filter((t) => !assignmentTypes.value.some((e) => e.name === t.name))
    );
    relationTypes.value.push(
        ...templateNode.relationTypes.nodes.filter((t) => !relationTypes.value.some((e) => e.name === t.name))
    );
    templateFieldSpecifications.value.push(
        ...templateNode.templateFieldSpecifications.filter(
            (t) => !templateFieldSpecifications.value.some((e) => e.name === t.name)
        )
    );
}

function deleteObsoleteAttributes() {
    const isObsolete = (name: string, entries: InheritedEntry[]) => {
        const records = entries.filter((e) => e.entry === name);
        if (records.length === 0) return false;
        return records.every((e) => !selectedTemplates.value.includes(e.fromTemplate));
    };

    issueTypes.value = issueTypes.value.filter((item) => !isObsolete(item.name, disabledCards.value.issueTypes));
    issuePriorities.value = issuePriorities.value.filter(
        (item) => !isObsolete(item.name, disabledCards.value.issuePriorities)
    );
    issueStates.value = issueStates.value.filter((item) => !isObsolete(item.name, disabledCards.value.issueStates));
    assignmentTypes.value = assignmentTypes.value.filter(
        (item) => !isObsolete(item.name, disabledCards.value.assignmentTypes)
    );
    relationTypes.value = relationTypes.value.filter(
        (item) => !isObsolete(item.name, disabledCards.value.relationTypes)
    );
    templateFieldSpecifications.value = templateFieldSpecifications.value.filter(
        (item) => !isObsolete(item.name, disabledCards.value.templateFieldSpecifications)
    );
    deleteObsoleteCards();
}

function pushDisabledCards(templateNode: IssueTemplateFieldsFragment) {
    disabledCards.value.issueTypes.push(
        ...templateNode.issueTypes.nodes.map((t) => ({ entry: t.name, fromTemplate: templateNode.id }))
    );
    disabledCards.value.issuePriorities.push(
        ...templateNode.issuePriorities.nodes.map((t) => ({ entry: t.name, fromTemplate: templateNode.id }))
    );
    disabledCards.value.issueStates.push(
        ...templateNode.issueStates.nodes.map((t) => ({ entry: t.name, fromTemplate: templateNode.id }))
    );
    disabledCards.value.assignmentTypes.push(
        ...templateNode.assignmentTypes.nodes.map((t) => ({ entry: t.name, fromTemplate: templateNode.id }))
    );
    disabledCards.value.relationTypes.push(
        ...templateNode.relationTypes.nodes.map((t) => ({ entry: t.name, fromTemplate: templateNode.id }))
    );
    disabledCards.value.templateFieldSpecifications.push(
        ...templateNode.templateFieldSpecifications.map((t) => ({ entry: t.name, fromTemplate: templateNode.id }))
    );
}

function deleteObsoleteCards() {
    const fromTemplates = [
        ...new Set(
            Object.values(disabledCards.value)
                .flat()
                .map((entry) => entry.fromTemplate)
        )
    ];
    for (const fromTemplate of fromTemplates) {
        if (!selectedTemplates.value.includes(fromTemplate)) {
            disabledCards.value.issueTypes = disabledCards.value.issueTypes.filter(
                (entry) => entry.fromTemplate !== fromTemplate
            );
            disabledCards.value.issuePriorities = disabledCards.value.issuePriorities.filter(
                (entry) => entry.fromTemplate !== fromTemplate
            );
            disabledCards.value.issueStates = disabledCards.value.issueStates.filter(
                (entry) => entry.fromTemplate !== fromTemplate
            );
            disabledCards.value.assignmentTypes = disabledCards.value.assignmentTypes.filter(
                (entry) => entry.fromTemplate !== fromTemplate
            );
            disabledCards.value.relationTypes = disabledCards.value.relationTypes.filter(
                (entry) => entry.fromTemplate !== fromTemplate
            );
            disabledCards.value.templateFieldSpecifications = disabledCards.value.templateFieldSpecifications.filter(
                (entry) => entry.fromTemplate !== fromTemplate
            );
        }
    }
}

function createIssueTypeInput(previousName: string, newName: string, description: string, iconPath: string) {
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

    deleteIssueTypeInputByName(previousName);
    issueTypes.value.push({ name: newName, description: description, iconPath: iconPath });

    issueTypes.value.sort((a, b) => {
        const aDisabled = disabledCards.value.issueTypes.some((entry) => entry.entry === a.name);
        const bDisabled = disabledCards.value.issueTypes.some((entry) => entry.entry === b.name);
        if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
        return a.name.localeCompare(b.name);
    });
    expandedCardKey.value = null;
    selectedIcon.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
}

function deleteIssueTypeInputByName(nameToDelete: string) {
    issueTypes.value = issueTypes.value.filter((t) => t.name !== nameToDelete);
}

function createIssuePriority(
    previousName: string,
    newName: string,
    description: string,
    value: number,
    iconPath: string
) {
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
    } else {
        valueErrorMessage.value = "";
    }

    deleteIssuePriorityByName(previousName);
    issuePriorities.value.push({ name: newName, description, value, iconPath });

    issuePriorities.value.sort((a, b) => {
        const aDisabled = disabledCards.value.issuePriorities.some((entry) => entry.entry === a.name);
        const bDisabled = disabledCards.value.issuePriorities.some((entry) => entry.entry === b.name);
        if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
        return a.name.localeCompare(b.name);
    });
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

    issueStates.value.sort((a, b) => {
        const aDisabled = disabledCards.value.issueStates.some((entry) => entry.entry === a.name);
        const bDisabled = disabledCards.value.issueStates.some((entry) => entry.entry === b.name);
        if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
        return a.name.localeCompare(b.name);
    });
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

    assignmentTypes.value.sort((a, b) => {
        const aDisabled = disabledCards.value.assignmentTypes.some((entry) => entry.entry === a.name);
        const bDisabled = disabledCards.value.assignmentTypes.some((entry) => entry.entry === b.name);
        if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
        return a.name.localeCompare(b.name);
    });
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

    relationTypes.value.sort((a, b) => {
        const aDisabled = disabledCards.value.relationTypes.some((entry) => entry.entry === a.name);
        const bDisabled = disabledCards.value.relationTypes.some((entry) => entry.entry === b.name);
        if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
        return a.name.localeCompare(b.name);
    });
    expandedCardKey.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
    currentEditedInverseName.value = "";
}

function deleteRelationTypeByName(nameToDelete: string) {
    relationTypes.value = relationTypes.value.filter((s) => s.name !== nameToDelete);
}

function createTemplateFieldSpecification(previousName: string, newName: string, value: JsonFieldInput["value"]) {
    if (newName.trim().length === 0 && previousName.trim().length !== 0) {
        nameErrorMessage.value = "Name is required";
        return;
    }

    if (previousName.trim().toLowerCase() !== newName.trim().toLowerCase()) {
        if (
            templateFieldSpecifications.value.some(
                (item) => item.name.trim().toLowerCase() === newName.trim().toLowerCase()
            )
        ) {
            nameErrorMessage.value = "Name already exists";
            return;
        } else {
            nameErrorMessage.value = "";
        }
    }

    deleteTemplateFieldSpecificationByName(previousName);

    templateFieldSpecifications.value.push({
        name: newName,
        value: value
    });

    templateFieldSpecifications.value.sort((a, b) => {
        const aDisabled = disabledCards.value.templateFieldSpecifications.some((entry) => entry.entry === a.name);
        const bDisabled = disabledCards.value.templateFieldSpecifications.some((entry) => entry.entry === b.name);
        if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
        return a.name.localeCompare(b.name);
    });
    expandedCardKey.value = null;
    currentEditedName.value = "";
    currentEditedDescription.value = "";
}

function deleteTemplateFieldSpecificationByName(nameToDelete: string) {
    templateFieldSpecifications.value = templateFieldSpecifications.value.filter((s) => s.name !== nameToDelete);
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
    deleteTemplateFieldSpecificationByName("");
}

/**
 * The backend copies everything defined on the extended templates onto the new template, so only the
 * entries that were added here may be submitted - inherited ones would end up duplicated (and are
 * rejected outright for templateFieldSpecifications, which must be disjoint).
 */
function withoutInherited<T extends { name: string }>(entries: T[], inherited: InheritedEntry[]): T[] {
    return entries.filter((entry) => !inherited.some((e) => e.entry === entry.name));
}

async function createIssueTemplate() {
    const inherited = disabledCards.value;
    const template = await blockWithErrorMessage(async () => {
        const res = await requestThrow(createIssueTemplateMutation, {
            input: {
                name: templateName.value,
                description: templateDescription.value ?? "",
                extends: selectedTemplates.value,
                issueTypes: withoutInherited(issueTypes.value, inherited.issueTypes),
                issuePriorities: withoutInherited(issuePriorities.value, inherited.issuePriorities),
                issueStates: withoutInherited(issueStates.value, inherited.issueStates),
                assignmentTypes: withoutInherited(assignmentTypes.value, inherited.assignmentTypes),
                relationTypes: withoutInherited(relationTypes.value, inherited.relationTypes),
                templateFieldSpecifications: withoutInherited(
                    templateFieldSpecifications.value,
                    inherited.templateFieldSpecifications
                )
            }
        });
        return res.createIssueTemplate.issueTemplate;
    }, "Error creating issue template");
    createIssueTemplateDialog.value = false;
    emit("created-template", template);
}

onEvent("create-issue-template", () => {
    resetForm();
    selectedTemplates.value = [];
    issueTypes.value = [];
    issuePriorities.value = [];
    issueStates.value = [];
    assignmentTypes.value = [];
    relationTypes.value = [];
    templateFieldSpecifications.value = [];
    disabledCards.value = {
        issueTypes: [],
        issuePriorities: [],
        issueStates: [],
        assignmentTypes: [],
        relationTypes: [],
        templateFieldSpecifications: []
    };
    cancelCreateCard();
    templateInheritanceErrorMessage.value = "";
    isInheritanceConflict.value = false;
    createIssueTemplateDialog.value = true;
    step.value = 1;
});

function next() {
    if (step.value === 1) {
        if (!meta.value.valid) {
            validate();
            return;
        }
        if (isInheritanceConflict.value) {
            return;
        }
    }
    if (step.value < stepLabels.length) {
        step.value++;
    } else {
        createIssueTemplate();
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
