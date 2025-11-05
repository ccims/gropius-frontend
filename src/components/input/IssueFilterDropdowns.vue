<template>
    <div class="d-flex ga-2 align-center h-100">
        <FilterDropdown
            v-model="templateIds"
            label="Template"
            :item-manager="itemManager"
            :mapper="(item) => item.template"
            :fetch-on-search="templateFetch"
        />
        <FilterDropdown
            v-model="labelIds"
            label="Label"
            :item-manager="itemManager"
            :mapper="(item) => item.labels.nodes"
            :additional-initial-values="labelInitialFetch"
            :fetch-on-search="labelFetch"
        >
            <template #default="{ item }">
                <div class="d-flex align-center">
                    <v-icon :color="item.color" class="opacity-100 mr-1" icon="mdi-circle" />
                    <span>{{ item.name }}</span>
                    <v-chip
                        color="primary"
                        size="small"
                        class="ml-2 flex-shrink-0"
                        v-if="item.trackables.nodes[0].id !== trackableId"
                    >
                        {{ item.trackables.nodes[0].name }}
                        <v-tooltip v-if="item.trackables.nodes[0].description" activator="parent" location="bottom">
                            {{ item.trackables.nodes[0].description }}
                        </v-tooltip>
                    </v-chip>
                </div>
            </template>
        </FilterDropdown>
        <FilterDropdown
            v-model="priorityIds"
            label="Priority"
            :item-manager="itemManager"
            :mapper="(item) => item.priority"
            :sorter="(a, b) => a.value - b.value"
            :fetch-on-search="priorityFetch"
        />
        <FilterDropdown
            v-model="typeIds"
            label="Type"
            :item-manager="itemManager"
            :mapper="(item) => item.type"
            :fetch-on-search="typeFetch"
        >
            <template #default="{ item }">
                <div class="d-flex align-center">
                    <IssueTypeIcon :path="item.iconPath" fill="rgb(var(--v-theme-primary))" class="type-icon mr-1" />
                    {{ item.name }}
                </div>
            </template>
        </FilterDropdown>
        <FilterDropdown
            v-model="assignedToIds"
            label="Assigned to"
            :item-manager="itemManager"
            :mapper="assignedToMapper"
            :sorter="assignedToSorter"
            :fetch-on-search="assignedToFetch"
        >
            <template #default="{ item }">
                <User :user="item" />
            </template>
        </FilterDropdown>
        <FilterDropdown
            v-model="stateIds"
            label="State"
            :filter="stateFilter"
            :mapper="(item) => item.state"
            :item-manager="itemManager"
            :fetch-on-search="stateFetch"
        >
            <template #default="{ item }">
                <span class="d-flex align-center">
                    <v-icon
                        :color="item.isOpen ? 'issue-open' : 'issue-closed'"
                        class="opacity-100 mr-1"
                        icon="mdi-circle"
                    />
                    {{ item.name }}
                </span>
            </template>
        </FilterDropdown>
        <FilterDropdown
            v-model="affectedIds"
            label="Affects"
            :mapper="() => null"
            :item-manager="itemManager"
            :additional-initial-values="affectsInitialFetch"
            :fetch-on-search="affectsFetch"
        >
            <template #default="{ item }">
                <div class="d-flex align-center">
                    <v-icon color="primary" class="opacity-100 mr-1" :icon="affectedByIssueIcon(item.typename)" />
                    {{ item.name }}
                </div>
            </template>
        </FilterDropdown>
    </div>
</template>

<script setup lang="ts" generic="T extends IssueListItemInfoFragment, S extends IssueOrderField">
import { ClientReturnType, NodeReturnType, useClient } from "@/graphql/client";
import FilterDropdown from "@/components/input/FilterDropdown.vue";
import IssueTypeIcon from "@/components/IssueTypeIcon.vue";
import User from "@/components/info/User.vue";
import { computed, PropType, ref, watch } from "vue";
import { ItemManager } from "@/util/itemManager";
import { IssueListItemInfoFragment, IssueOrderField } from "@/graphql/generated";
import { useFilterOption } from "@/util/useFilterOption";
import { IdObject } from "@/util/types";
import { useAppStore } from "@/store/app";
import {
    affectedByIssueDescription,
    affectedByIssueIcon,
    affectedByIssueName,
    expandSearchResult
} from "@/util/affectedByIssueUtils";

const props = defineProps({
    itemManager: {
        type: Object as PropType<ItemManager<T, S>>,
        required: true
    },
    trackableId: {
        type: String,
        required: false
    },
    stateIndices: {
        type: Array as PropType<number[]>,
        required: false,
        default: () => [0, 1]
    },
    showOnlyAssignedIssues: {
        type: Boolean,
        required: false,
        default: false
    },
    useQueryForFilter: {
        type: Boolean,
        required: false,
        default: true
    }
});

const client = useClient();
const store = useAppStore();
const userId = computed(() => store.user?.id);

const templateIds = useFilterOption("template", props.useQueryForFilter);
const templateInput = computed(() => {
    return templateIds.value.length > 0 ? { id: { in: templateIds.value } } : undefined;
});
const templateFetch = async (search: string) =>
    props.trackableId
        ? client
              .getUsedIssueTemplates({ trackable: props.trackableId, filter: search })
              .then(
                  (res) => (res.node as NodeReturnType<"getUsedIssueTemplates", "Component">).usedIssueTemplates.nodes
              )
        : [];

const labelIds = useFilterOption("label", props.useQueryForFilter);
const labelInput = computed(() => {
    return labelIds.value.length > 0 ? { any: { id: { in: labelIds.value } } } : undefined;
});
const labelFetch = async (search: string) =>
    props.trackableId
        ? client
              .getUsedLabels({ trackable: props.trackableId, filter: search })
              .then((res) => (res.node as NodeReturnType<"getUsedLabels", "Component">).usedLabels.nodes)
        : [];
const labelInitialFetch = async () =>
    props.trackableId
        ? client
              .firstTrackableLabels({ trackable: props.trackableId, count: 100 })
              .then((res) => (res.node as NodeReturnType<"firstTrackableLabels", "Component">).labels.nodes)
        : [];

const priorityIds = useFilterOption("priority", props.useQueryForFilter);
const priorityInput = computed(() => {
    return priorityIds.value.length > 0 ? { id: { in: priorityIds.value } } : undefined;
});
const priorityFetch = async (search: string) =>
    props.trackableId
        ? client
              .getUsedIssuePriorities({ trackable: props.trackableId, filter: search })
              .then(
                  (res) => (res.node as NodeReturnType<"getUsedIssuePriorities", "Component">).usedIssuePriorities.nodes
              )
        : [];

const typeIds = useFilterOption("type", props.useQueryForFilter);
const typeInput = computed(() => {
    return typeIds.value.length > 0 ? { id: { in: typeIds.value } } : undefined;
});
const typeFetch = async (search: string) =>
    props.trackableId
        ? client
              .getUsedIssueTypes({ trackable: props.trackableId, filter: search })
              .then((res) => (res.node as NodeReturnType<"getUsedIssueTypes", "Component">).usedIssueTypes.nodes)
        : [];

const assignedToIds = useFilterOption("assignedTo", props.useQueryForFilter);
const assignedToInput = computed(() => {
    return assignedToIds.value.length > 0
        ? {
              any: {
                  user: {
                      id: {
                          in: assignedToIds.value
                      }
                  }
              }
          }
        : undefined;
});
const assignedToSorter = (a: IdObject & { name: string }, b: IdObject & { name: string }) => {
    const isAssignedToMeA = userId.value == a.id;
    const isAssignedToMeB = userId.value == b.id;
    if (isAssignedToMeA && !isAssignedToMeB) {
        return -1;
    }
    if (!isAssignedToMeA && isAssignedToMeB) {
        return 1;
    }
    return a.name.localeCompare(b.name);
};
const assignedToMapper = (item: T) =>
    item.assignments.nodes.map((node) => {
        const name = node.user.id == userId.value ? "Me" : node.user.displayName;
        return {
            ...node.user,
            displayName: name,
            name
        };
    });
const assignedToFetch = async (search: string) =>
    props.trackableId
        ? client.getAssignedUsers({ trackable: props.trackableId, filter: search }).then((res) =>
              (res.node as NodeReturnType<"getAssignedUsers", "Component">).assignedUsers.nodes.map((node) => {
                  const name = node.id == userId.value ? "Me" : node.displayName;
                  return {
                      ...node,
                      displayName: name,
                      name
                  };
              })
          )
        : [];

const stateIds = useFilterOption("concretestate", props.useQueryForFilter);
const stateIndicesMirror = ref<number[]>([]);
watch(
    () => props.stateIndices,
    (value) => {
        const oldValue = stateIndicesMirror.value;
        if (value.length == oldValue.length && value.every((item, index) => item === oldValue[index])) return;
        stateIndicesMirror.value = value;
    },
    { immediate: true }
);
const stateInput = computed(() => {
    const stateIndices = stateIndicesMirror.value;
    const isSingleIssueState = stateIndices.length == 1;
    const customStateSelected = !!stateIds.value.length;
    if (!isSingleIssueState && !customStateSelected) {
        return undefined;
    }
    const state = stateIndices[0] == 0;
    return {
        isOpen: isSingleIssueState ? { eq: state } : undefined,
        id: customStateSelected ? { in: stateIds.value } : undefined
    };
});
const stateFetch = async (search: string) =>
    props.trackableId
        ? client
              .getUsedIssueStates({ trackable: props.trackableId, filter: search })
              .then((res) => (res.node as NodeReturnType<"getUsedIssueStates", "Component">).usedIssueStates.nodes)
        : [];
const stateFilter = (item: { isOpen: boolean }) => {
    if (!props.stateIndices || props.stateIndices.length == 2) {
        return true;
    }
    return item.isOpen == (props.stateIndices[0] == 0);
};

const affectedIds = useFilterOption("affected", props.useQueryForFilter);
const affectedInput = computed(() => {
    return affectedIds.value.length > 0 ? { any: { id: { in: affectedIds.value } } } : undefined;
});
const parseAffectedByIssues = (items: ClientReturnType<"searchAffectedByIssues">["searchAffectedByIssues"]) =>
    expandSearchResult(items).map((itm) => ({
        id: itm.id,
        name: affectedByIssueName(itm),
        description: affectedByIssueDescription(itm),
        typename: itm.__typename
    }));
const affectsInitialFetch = async () =>
    props.trackableId
        ? client
              .firstAffectedByIssues({ trackable: props.trackableId, count: 100, sublistCount: 100 })
              .then((res) =>
                  parseAffectedByIssues(
                      (res.node as NodeReturnType<"firstAffectedByIssues", "Component">).affectedEntities.nodes
                  )
              )
        : [];
const affectsFetch = async (search: string) =>
    props.trackableId
        ? client
              .searchAffectedByIssues({ trackable: props.trackableId, query: search, count: 100 })
              .then((res) => parseAffectedByIssues(res.searchAffectedByIssues))
        : client
              .searchAffectedByIssuesWithoutTrackable({ query: search, count: 100 })
              .then((res) => parseAffectedByIssues(res.searchAffectedByIssues));

watch(
    () => props.stateIndices,
    (newVal, oldVal) => {
        if (!newVal || !oldVal) {
            return;
        }
        if (newVal.length == oldVal.length && newVal[0] === oldVal[0]) {
            return;
        }
        stateIds.value = [];
    }
);
watch(
    () => props.showOnlyAssignedIssues,
    (newVal) => {
        const user = userId.value;
        if (newVal && user) {
            assignedToIds.value = [user];
        } else {
            assignedToIds.value = [];
        }
    },
    { immediate: true }
);

const dependencyArray = computed(() => {
    return [templateInput, labelInput, priorityInput, typeInput, assignedToInput, stateInput, affectedInput];
});

function setSingleFilters({ type }: { type?: string }) {
    if (type !== undefined) {
        typeIds.value = [type];
    }
}

function resetFilters() {
    templateIds.value = [];
    labelIds.value = [];
    priorityIds.value = [];
    typeIds.value = [];
    assignedToIds.value = [];
    stateIds.value = [];
    affectedIds.value = [];
}

defineExpose({
    templateInput,
    labelInput,
    priorityInput,
    typeInput,
    assignedToInput,
    stateInput,
    affectedInput,
    dependencyArray,
    setSingleFilters,
    resetFilters
});
</script>

<style scoped lang="scss">
@use "@/styles/settings.scss";
@use "sass:map";

.type-icon {
    width: map.get(settings.$avatar-sizes, "large");
    height: map.get(settings.$avatar-sizes, "large");
}
</style>
