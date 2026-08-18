<template>
    <CreateTemplateDialog
        v-model="dialog"
        v-model:extended-template-ids="extendedTemplateIds"
        title="Create Issue Template"
        entity-name="issue template"
        type="issue"
        :steps="steps"
        :submit-disabled="submitDisabled"
        :inheritance-error="inheritanceError"
        @create="createIssueTemplate"
    >
        <template #issueAttributes>
            <v-row>
                <v-col cols="4">
                    <NamedNodeListInput
                        v-model="issueTypes.entries"
                        type="issueType"
                        add-label="Add Issue Type"
                        add-icon="$issue"
                        :inherited-names="issueTypes.inheritedNames"
                        :new-entry="() => ({ name: '', description: '', iconPath: '' })"
                    >
                        <template #previewLeft="{ entry }">
                            <div class="d-flex align-center mr-2">
                                <SvgWrapper :path="entry.iconPath" />
                            </div>
                        </template>
                        <template #extra="{ entry }">
                            <IconPicker v-model="entry.iconPath" />
                        </template>
                    </NamedNodeListInput>
                </v-col>
                <v-col cols="4">
                    <NamedNodeListInput
                        v-model="issuePriorities.entries"
                        type="issuePriority"
                        add-label="Add Issue Priority"
                        add-icon="mdi-priority-high"
                        :inherited-names="issuePriorities.inheritedNames"
                        :new-entry="() => ({ name: '', description: '', value: 0, iconPath: '' })"
                        :validate="(entry) => (entry.value == undefined ? 'Value is required' : undefined)"
                    >
                        <template #previewLeft="{ entry }">
                            <div class="d-flex align-center mr-2">
                                <SvgWrapper :path="entry.iconPath" />
                            </div>
                        </template>
                        <template #previewRight="{ entry }">
                            <div class="d-flex align-center mr-2">
                                <span class="text-h6 mx-1">{{ shortened(entry.value) }}</span>
                            </div>
                        </template>
                        <template #extra="{ entry, error }">
                            <v-number-input
                                v-model="entry.value"
                                :precision="null"
                                label="Value"
                                class="mb-2"
                                density="compact"
                                :error="!!error"
                                :error-messages="error"
                            />
                            <IconPicker v-model="entry.iconPath" />
                        </template>
                    </NamedNodeListInput>
                </v-col>
                <v-col cols="4">
                    <NamedNodeListInput
                        v-model="issueStates.entries"
                        type="issueState"
                        add-label="Add Issue State"
                        add-icon="mdi-circle"
                        :inherited-names="issueStates.inheritedNames"
                        :new-entry="() => ({ name: '', description: '', isOpen: true })"
                    >
                        <template #previewLeft="{ entry }">
                            <div class="mr-2">
                                <v-icon :color="entry.isOpen ? 'success' : 'error'">mdi-circle</v-icon>
                            </div>
                        </template>
                        <template #details="{ entry }">
                            <div class="text-body-2 text-medium-emphasis">
                                Issues in this state count as {{ entry.isOpen ? "open" : "closed" }}
                            </div>
                        </template>
                        <template #extra="{ entry }">
                            <v-checkbox v-model="entry.isOpen" label="Open?" />
                        </template>
                    </NamedNodeListInput>
                </v-col>
            </v-row>
        </template>

        <template #linkageAttributes>
            <v-row>
                <v-col cols="6">
                    <NamedNodeListInput
                        v-model="assignmentTypes.entries"
                        type="assignmentType"
                        add-label="Add Assignment Type"
                        add-icon="mdi-account"
                        :inherited-names="assignmentTypes.inheritedNames"
                    />
                </v-col>
                <v-col cols="6">
                    <NamedNodeListInput
                        v-model="relationTypes.entries"
                        type="relationType"
                        add-label="Add Relation Type"
                        add-icon="mdi-arrow-right"
                        :inherited-names="relationTypes.inheritedNames"
                        :new-entry="() => ({ name: '', description: '', inverseName: '' })"
                        :validate="(entry) => (entry.inverseName.trim() ? undefined : 'Inverse Name is required')"
                    >
                        <template #details="{ entry }">
                            <div class="text-body-2 text-medium-emphasis">
                                Inverse name: {{ entry.inverseName || "not set" }}
                            </div>
                        </template>
                        <template #extra="{ entry, error }">
                            <v-text-field
                                v-model="entry.inverseName"
                                label="Inverse Name"
                                class="mb-2"
                                density="compact"
                                :error="!!error"
                                :error-messages="error"
                            />
                        </template>
                    </NamedNodeListInput>
                </v-col>
            </v-row>
        </template>
    </CreateTemplateDialog>
</template>

<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import type {
    AssignmentTypeInput,
    CreateIssueTemplateInput,
    IssuePriorityInput,
    IssueRelationTypeInput,
    IssueStateInput,
    IssueTemplateFieldsFragment,
    IssueTypeInput
} from "@/gql/graphql";
import { onEvent } from "@/util/eventBus";
import type { IdObject } from "@/util/types";
import { useBlockingWithErrorMessage, withErrorMessage } from "@/util/withErrorMessage";
import { computed, reactive, ref, watch, type Ref } from "vue";
import SvgWrapper from "../SvgWrapper.vue";
import IconPicker from "../input/IconPicker.vue";
import NamedNodeListInput from "../input/NamedNodeListInput.vue";
import CreateTemplateDialog, { type CreateTemplateInput, type CreateTemplateStep } from "./CreateTemplateDialog.vue";

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
    (event: "created-template", template: IdObject): void;
}>();

const steps: CreateTemplateStep[] = [
    { label: "General", slot: "general" },
    { label: "Issue Types, Priorities & States", slot: "issueAttributes" },
    { label: "Assignment & Relation Types", slot: "linkageAttributes" },
    { label: "Template Field Specifications", slot: "fieldSpecifications" }
];

const dialog = ref(false);
const [blockWithErrorMessage, submitDisabled] = useBlockingWithErrorMessage();

const extendedTemplateIds = ref<string[]>([]);
const extendedTemplates = ref<IssueTemplateFieldsFragment[]>([]);

watch(extendedTemplateIds, async (ids) => {
    extendedTemplates.value = await withErrorMessage(
        () => Promise.all(ids.map((id) => queryNodeThrow(getIssueTemplateFieldsQuery, "IssueTemplate", { id }))),
        "Error loading extended templates"
    );
});

/**
 * Combines the entries defined here with the ones the extended templates contribute.
 * The inherited entries are shown read only, the backend copies them over on its own,
 * so only the own ones are submitted.
 *
 * @param own the entries defined in this dialog
 * @param select the list of the same kind of an extended template
 * @param label how a single entry is called in the conflict message
 */
function useInheritedEntries<T extends { name: string }>(
    own: Ref<T[]>,
    select: (template: IssueTemplateFieldsFragment) => T[],
    label: string
) {
    /** Entry name to the extended template contributing it */
    const inherited = computed(() => {
        const entries = new Map<string, { entry: T; templateName: string }>();
        for (const template of extendedTemplates.value) {
            for (const entry of select(template)) {
                if (!entries.has(entry.name)) {
                    entries.set(entry.name, { entry, templateName: template.name });
                }
            }
        }
        return entries;
    });

    // the backend requires the entries of all extended templates to be disjoint
    const conflict = computed(() => {
        const definedBy = new Map<string, string>();
        for (const template of extendedTemplates.value) {
            for (const entry of select(template)) {
                const other = definedBy.get(entry.name);
                if (other != undefined) {
                    return `${template.name} and ${other} both define the ${label} "${entry.name}"`;
                }
                definedBy.set(entry.name, template.name);
            }
        }
        for (const entry of own.value) {
            const other = definedBy.get(entry.name);
            if (other != undefined) {
                return `${other} already defines the ${label} "${entry.name}"`;
            }
        }
        return "";
    });

    const entries = computed({
        get: () => [...own.value, ...[...inherited.value.values()].map(({ entry }) => entry)],
        set: (value: T[]) => {
            own.value = value.filter((entry) => !inherited.value.has(entry.name));
        }
    });

    // reactive unwraps the refs, a plain object would hand the template the refs themselves
    return reactive({
        entries,
        inheritedNames: computed(() => [...inherited.value.keys()]),
        conflict
    });
}

const ownIssueTypes = ref<IssueTypeInput[]>([]);
const ownIssuePriorities = ref<IssuePriorityInput[]>([]);
const ownIssueStates = ref<IssueStateInput[]>([]);
const ownAssignmentTypes = ref<AssignmentTypeInput[]>([]);
const ownRelationTypes = ref<IssueRelationTypeInput[]>([]);

const issueTypes = useInheritedEntries(ownIssueTypes, (template) => template.issueTypes.nodes, "issue type");
const issuePriorities = useInheritedEntries(
    ownIssuePriorities,
    (template) => template.issuePriorities.nodes,
    "issue priority"
);
const issueStates = useInheritedEntries(ownIssueStates, (template) => template.issueStates.nodes, "issue state");
const assignmentTypes = useInheritedEntries(
    ownAssignmentTypes,
    (template) => template.assignmentTypes.nodes,
    "assignment type"
);
const relationTypes = useInheritedEntries(
    ownRelationTypes,
    (template) => template.relationTypes.nodes,
    "relation type"
);

const inheritanceError = computed(
    () =>
        [issueTypes, issuePriorities, issueStates, assignmentTypes, relationTypes]
            .map((list) => list.conflict)
            .find((message) => message != "") ?? ""
);

onEvent("create-issue-template", () => {
    extendedTemplates.value = [];
    ownIssueTypes.value = [];
    ownIssuePriorities.value = [];
    ownIssueStates.value = [];
    ownAssignmentTypes.value = [];
    ownRelationTypes.value = [];
    dialog.value = true;
});

async function createIssueTemplate(input: CreateTemplateInput) {
    const template = await blockWithErrorMessage(async () => {
        // the type annotation is what rejects fields the input does not have, requestThrow does not check its variables
        const issueTemplateInput: CreateIssueTemplateInput = {
            ...input,
            isAbstract: false,
            issueTypes: ownIssueTypes.value,
            issuePriorities: ownIssuePriorities.value,
            issueStates: ownIssueStates.value,
            assignmentTypes: ownAssignmentTypes.value,
            relationTypes: ownRelationTypes.value
        };
        const res = await requestThrow(createIssueTemplateMutation, { input: issueTemplateInput });
        return res.createIssueTemplate.issueTemplate;
    }, "Error creating issue template");
    dialog.value = false;
    emit("created-template", template);
}

// the preview only has room for a few characters, the full value is in the editor
function shortened(value: number): string {
    const text = value.toString();
    return text.length > 3 ? text.slice(0, 3) + "…" : text;
}
</script>
