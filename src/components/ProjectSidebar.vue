<template>
    <v-slide-x-reverse-transition>
        <v-sheet
            v-if="selectedElementInfo != undefined"
            class="sidebar mt-3 py-2 flex-1-1-0 align-self-stretch d-flex flex-column h-0 pointer-events-all"
            color="surface-elevated-3"
            rounded="xl"
        >
            <div class="d-flex align-center mx-2">
                <span class="text-subtitle-1 text-ellipses flex-grow-1 ml-2">{{
                    selectedElementInfo.componentVersion.component.name
                }}</span>
                <IconButton
                    :to="{
                        name: 'component-issues',
                        params: { trackable: selectedElementInfo!.componentVersion.component.id }
                    }"
                >
                    <v-icon icon="mdi-arrow-right-circle-outline" />
                    <v-tooltip activator="parent">View all issues</v-tooltip>
                </IconButton>
                <IconButton @click="model = undefined">
                    <v-icon icon="mdi-close" />
                </IconButton>
            </div>
            <div class="flex-1-1-0 h-0">
                <PaginatedList
                    name="issues"
                    :item-manager="itemManager"
                    :sort-fields="sortFields"
                    :to="issueRoute"
                    :sort-ascending-initially="false"
                    :dependencies="[selectedElementInfo.componentVersion.id, issueFilter]"
                >
                    <template #item="{ item }">
                        <IssueListItem :item="item" hide-details />
                    </template>
                    <template #additional-filter>
                        <div class="ga-2 d-flex flex-wrap mb-2">
                            <v-chip
                                v-if="issueFilter.affectedEntity != undefined"
                                rounded="lg"
                                variant="outlined"
                                closable
                                close-icon="mdi-close"
                                :prepend-icon="
                                    selectedElementInfo.affectedEntity.__typename == 'ComponentVersion'
                                        ? '$component-version'
                                        : '$interface'
                                "
                                @click:close="issueFilter.affectedEntity = undefined"
                            >
                                {{ selectedElementInfo.affectedEntityName }}
                            </v-chip>
                            <v-chip
                                v-if="issueFilter.type != undefined"
                                rounded="lg"
                                variant="outlined"
                                closable
                                close-icon="mdi-close"
                                @click:close="issueFilter.type = undefined"
                            >
                                {{ issueFilter.type.name }}
                                <template #prepend>
                                    <IssueTypeIcon
                                        :path="issueFilter.type.iconPath"
                                        fill="currentColor"
                                        height="18px"
                                        class="v-icon--start"
                                    />
                                </template>
                            </v-chip>
                            <v-chip
                                v-if="issueFilter.isOpen != undefined"
                                rounded="lg"
                                variant="outlined"
                                closable
                                close-icon="mdi-close"
                                :class="{
                                    'open-issue-chip': issueFilter.isOpen,
                                    'closed-issue-chip': !issueFilter.isOpen
                                }"
                                prepend-icon="mdi-circle"
                                @click:close="issueFilter.isOpen = undefined"
                            >
                                {{ issueFilter.isOpen ? "Open" : "Closed" }}
                            </v-chip>
                        </div>
                    </template>
                </PaginatedList>
            </div>
        </v-sheet>
    </v-slide-x-reverse-transition>
</template>
<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import PaginatedList, { ItemManager } from "@/components/PaginatedList.vue";
import {
    GraphAggregatedIssueInfoFragment,
    GraphComponentVersionInfoFragment,
    GraphRelationPartnerInfoFragment,
    IssueFilterInput,
    IssueListItemInfoFragment,
    IssueOrder,
    IssueOrderField
} from "@/graphql/generated";
import { SelectedElement } from "@gropius/graph-editor";
import { ContextMenuData } from "./GraphEditor.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import IssueListItem from "@/components/IssueListItem.vue";
import IssueTypeIcon from "@/components/IssueTypeIcon.vue";
import { IdObject } from "@/util/types";
import { RouteLocationRaw } from "vue-router";

type ProjectGraph = NodeReturnType<"getProjectGraph", "Project">;
type Issue = IssueListItemInfoFragment;
type Trackable = NodeReturnType<"getIssueList", "Component">;
type AggregatedIssue = NodeReturnType<"getIssueListOnAggregatedIssue", "AggregatedIssue">;

const props = defineProps({
    originalGraph: {
        type: Object as PropType<ProjectGraph>,
        required: false
    }
});

const model = defineModel({
    type: Object as PropType<SelectedElement<ContextMenuData>>,
    required: false
});

const client = useClient();

interface IssueFilterSpec {
    isOpen?: boolean;
    type?: { id: string; name: string; iconPath: string };
    aggregatedIssue?: string;
    affectedEntity?: GraphRelationPartnerInfoFragment;
}

const issueFilter = ref<IssueFilterSpec>({});

interface SelectableElementInfo {
    componentVersion: GraphComponentVersionInfoFragment;
    affectedEntity: GraphRelationPartnerInfoFragment;
    affectedEntityName: string;
    aggregatedIssue?: GraphAggregatedIssueInfoFragment;
}

const selectableElementLookup = computed(() => {
    const graph = props.originalGraph;
    const lookup = new Map<string, SelectableElementInfo>();
    if (graph != undefined) {
        graph.components.nodes.forEach((component) => {
            const componentName = `${component.component.name} (${component.version})`;
            lookup.set(component.id, {
                componentVersion: component,
                affectedEntity: component,
                affectedEntityName: componentName
            });
            component.aggregatedIssues.nodes.forEach((issue) => {
                lookup.set(issue.id, {
                    componentVersion: component,
                    affectedEntity: component,
                    aggregatedIssue: issue,
                    affectedEntityName: componentName
                });
            });
            component.interfaceDefinitions.nodes.forEach((definition) => {
                const interfaceName = `${definition.interfaceSpecificationVersion.interfaceSpecification.name} (${definition.interfaceSpecificationVersion.version})`;
                if (definition.visibleInterface != undefined) {
                    lookup.set(definition.visibleInterface.id, {
                        componentVersion: component,
                        affectedEntity: definition.visibleInterface,
                        affectedEntityName: interfaceName
                    });
                    definition.visibleInterface.aggregatedIssues.nodes.forEach((issue) => {
                        lookup.set(issue.id, {
                            componentVersion: component,
                            affectedEntity: definition.visibleInterface!,
                            aggregatedIssue: issue,
                            affectedEntityName: interfaceName
                        });
                    });
                }
            });
        });
    }
    return lookup;
});

const selectedElementInfo = computed<SelectableElementInfo | undefined>(() => {
    if (model.value == undefined) {
        return undefined;
    }
    return selectableElementLookup.value.get(model.value.id);
});

watch(selectedElementInfo, (newValue) => {
    if (newValue != undefined) {
        const aggregatedIssue = newValue.aggregatedIssue;
        if (aggregatedIssue != undefined) {
            issueFilter.value = {
                aggregatedIssue: aggregatedIssue.id,
                isOpen: aggregatedIssue.isOpen,
                affectedEntity: newValue.affectedEntity,
                type: aggregatedIssue.type
            };
        } else {
            issueFilter.value = {
                affectedEntity: newValue.affectedEntity
            };
        }
    }
});

const sortFields = {
    Updated: IssueOrderField.LastUpdatedAt
};

const itemManager: ItemManager<Issue, IssueOrderField> = {
    fetchItems: async function (
        filter: string | undefined,
        orderBy: IssueOrder[],
        count: number,
        page: number
    ): Promise<[Issue[], number]> {
        const additionalFilter = issueFilter.value;
        const useAggregatedIssue =
            additionalFilter.aggregatedIssue != undefined &&
            additionalFilter.affectedEntity != undefined &&
            additionalFilter.isOpen != undefined;
        if (filter == undefined) {
            const parameters = {
                orderBy,
                count,
                skip: page * count
            };
            if (!useAggregatedIssue) {
                const filterFields: IssueFilterInput = {};
                if (additionalFilter.isOpen != undefined) {
                    filterFields.state = { isOpen: { eq: additionalFilter.isOpen } };
                }
                if (additionalFilter.type != undefined) {
                    filterFields.type = { id: { eq: additionalFilter.type.id } };
                }
                if (additionalFilter.affectedEntity != undefined) {
                    filterFields.aggregatedBy = {
                        any: { relationPartner: { id: { eq: additionalFilter.affectedEntity.id } } }
                    };
                }
                const res = await client.getIssueList({
                    ...parameters,
                    trackable: selectedElementInfo.value!.componentVersion.component.id,
                    filter: filterFields
                });
                const issues = (res.node as Trackable).issues;
                return [issues.nodes, issues.totalCount];
            } else {
                const res = await client.getIssueListOnAggregatedIssue({
                    ...parameters,
                    aggregatedIssue: additionalFilter.aggregatedIssue!
                });
                const issues = (res.node as AggregatedIssue).issues;
                return [issues.nodes, issues.totalCount];
            }
        } else {
            const filterFields: IssueFilterInput = {};
            if (!useAggregatedIssue) {
                if (additionalFilter.isOpen != undefined) {
                    filterFields.state = { isOpen: { eq: additionalFilter.isOpen } };
                }
                if (additionalFilter.type != undefined) {
                    filterFields.type = { id: { eq: additionalFilter.type.id } };
                }
                if (additionalFilter.affectedEntity != undefined) {
                    filterFields.aggregatedBy = {
                        any: { relationPartner: { id: { eq: additionalFilter.affectedEntity.id } } }
                    };
                }
                filterFields.trackables = {
                    any: { id: { eq: selectedElementInfo.value!.componentVersion.component.id } }
                };
            } else {
                filterFields.aggregatedBy = { any: { id: { eq: additionalFilter.aggregatedIssue } } };
            }
            const res = await client.getFilteredIssueList({
                query: filter,
                count,
                filter: filterFields
            });
            return [res.searchIssues, res.searchIssues.length];
        }
    }
};

function issueRoute(issue: IdObject): RouteLocationRaw {
    return {
        name: "component-issue",
        params: { issue: issue.id, trackable: selectedElementInfo.value!.componentVersion.component.id }
    };
}
</script>
<style scoped>
.sidebar {
    width: 500px;
}

.open-issue-chip :deep(.v-icon:not(.mdi-close)) {
    color: rgb(var(--v-theme-issue-open));
}
.closed-issue-chip :deep(.v-icon:not(.mdi-close)) {
    color: rgb(var(--v-theme-issue-closed));
}
</style>
