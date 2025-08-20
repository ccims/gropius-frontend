<template>
    <div class="d-flex ga-4 align-center h-100">
        <FilterDropdown
            v-model="templateIds"
            label="Template"
            :item-manager="itemManager"
            :mapper="(item) => item.template"
            :fetch-on-search="
                async (search: string) =>
                    client
                        .getUsedIssueTemplates({ trackable: trackableId, filter: search })
                        .then(
                            (res) =>
                                (res.node as NodeReturnType<'getUsedIssueTemplates', 'Component'>).usedIssueTemplates
                                    .nodes
                        )
            "
        />
        <FilterDropdown
            v-model="labelIds"
            label="Label"
            :item-manager="itemManager"
            :mapper="(item) => item.labels.nodes"
            :additional-initial-values="
                async () =>
                    client
                        .firstTrackableLabels({ trackable: trackableId, count: 100 })
                        .then((res) => (res.node as NodeReturnType<'firstTrackableLabels', 'Component'>).labels.nodes)
            "
            :fetch-on-search="
                async (search: string) =>
                    client
                        .getUsedLabels({ trackable: trackableId, filter: search })
                        .then((res) => (res.node as NodeReturnType<'getUsedLabels', 'Component'>).usedLabels.nodes)
            "
        >
            <template #default="{ item }">
                <!-- TODO improve typing -->
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
            :fetch-on-search="
                async (search: string) =>
                    client
                        .getUsedIssuePriorities({ trackable: trackableId, filter: search })
                        .then(
                            (res) =>
                                (res.node as NodeReturnType<'getUsedIssuePriorities', 'Component'>).usedIssuePriorities
                                    .nodes
                        )
            "
        />
        <FilterDropdown
            v-model="typeIds"
            label="Type"
            :item-manager="itemManager"
            :mapper="(item) => item.type"
            :fetch-on-search="
                async (search: string) =>
                    client
                        .getUsedIssueTypes({ trackable: trackableId, filter: search })
                        .then(
                            (res) => (res.node as NodeReturnType<'getUsedIssueTypes', 'Component'>).usedIssueTypes.nodes
                        )
            "
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
            :mapper="
                (item) =>
                    item.assignments.nodes.map((node) => {
                        const name = node.user.id == store.user?.id ? 'Me' : node.user.displayName;
                        return {
                            ...node.user,
                            displayName: name,
                            name
                        };
                    })
            "
            :sorter="assignedToSorter"
            :fetch-on-search="
                async (search: string) =>
                    client.getAssignedUsers({ trackable: trackableId, filter: search }).then((res) =>
                        (res.node as NodeReturnType<'getAssignedUsers', 'Component'>).assignedUsers.nodes.map(
                            (node) => {
                                const name = node.id == store.user?.id ? 'Me' : node.displayName;
                                return {
                                    ...node,
                                    displayName: name,
                                    name
                                };
                            }
                        )
                    )
            "
        >
            <template #default="{ item }">
                <User :user="item" />
            </template>
        </FilterDropdown>
        <FilterDropdown
            v-model="stateIds"
            label="State"
            :mapper="(item) => item.state"
            :item-manager="itemManager"
            :fetch-on-search="
                async (search: string) =>
                    client
                        .getUsedIssueStates({ trackable: trackableId, filter: search })
                        .then(
                            (res) =>
                                (res.node as NodeReturnType<'getUsedIssueStates', 'Component'>).usedIssueStates.nodes
                        )
            "
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
    </div>
</template>

<script setup lang="ts" generic="T extends IssueListItemInfoFragment, S extends IssueOrderField">
import { NodeReturnType, useClient } from "@/graphql/client";
import FilterDropdown from "@/components/input/FilterDropdown.vue";
import IssueTypeIcon from "@/components/IssueTypeIcon.vue";
import User from "@/components/info/User.vue";
import { computed, PropType } from "vue";
import { ItemManager } from "@/util/itemManager";
import { IssueListItemInfoFragment, IssueOrderField } from "@/graphql/generated";
import { useFilterOption } from "@/util/useFilterOption";
import { IdObject } from "@/util/types";
import { useAppStore } from "@/store/app";

defineProps({
    itemManager: {
        type: Object as PropType<ItemManager<T, S>>,
        required: true
    },
    trackableId: {
        type: String,
        required: true
    }
});

const client = useClient();
const store = useAppStore();

const templateIds = useFilterOption("template");
const templateInput = computed(() => {
    return templateIds.value.length > 0 ? { id: { in: templateIds.value } } : undefined;
});
const labelIds = useFilterOption("label");
const labelInput = computed(() => {
    return labelIds.value.length > 0 ? { any: { id: { in: labelIds.value } } } : undefined;
});
const priorityIds = useFilterOption("priority");
const priorityInput = computed(() => {
    return priorityIds.value.length > 0 ? { id: { in: priorityIds.value } } : undefined;
});
const typeIds = useFilterOption("type");
const typeInput = computed(() => {
    return typeIds.value.length > 0 ? { id: { in: typeIds.value } } : undefined;
});
const assignedToIds = useFilterOption("assignedTo");
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
    const isAssignedToMeA = store.user?.id == a.id;
    const isAssignedToMeB = store.user?.id == b.id;
    if (isAssignedToMeA && !isAssignedToMeB) return -1;
    if (!isAssignedToMeA && isAssignedToMeB) return 1;
    return a.name.localeCompare(b.name);
};

const stateIds = useFilterOption("concretestate");

const dependencyArray = computed(() => {
    return [templateIds, labelIds, priorityIds, typeIds, assignedToIds, stateIds];
});

defineExpose({
    templateInput,
    labelInput,
    priorityInput,
    typeInput,
    assignedToInput,
    stateIds,
    dependencyArray
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
