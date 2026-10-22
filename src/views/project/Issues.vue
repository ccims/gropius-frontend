<template>
    <div v-if="!ready" class="pa-4">
        <v-progress-linear v-if="!catalogError" indeterminate />
        <v-alert v-else type="error">Could not load project sources. <v-btn @click="loadSources">Retry</v-btn></v-alert>
    </div>
    <PaginatedList
        v-else
        name="issues"
        :item-manager="itemManager"
        :sort-fields="issueSortFields"
        :to="issueRoute"
        :sort-ascending-initially="false"
        :dependencies="[projectId, scopeFilter, ...(filterDropdowns?.dependencyArray ?? [])]"
        query-param-prefix=""
    >
        <template #item="{ item }"
            ><IssueListItem :item="item" :context-project-id="projectId" :hide-details="smAndDown"
        /></template>
        <template #search-append>
            <v-select
                :model-value="scope"
                @update:model-value="setScope"
                label="Sources"
                :items="scopeOptions"
                item-title="title"
                item-value="value"
                density="comfortable"
                hide-details
                class="ml-2 source-select"
            />
            <IssueStateSegmentedButton v-model="issueStateIndices" class="ml-2" />
        </template>
        <template #additional-filter>
            <div v-if="scope === 'custom'" class="d-flex flex-wrap align-center ga-2 mb-2">
                <v-checkbox
                    :model-value="includeProject"
                    @update:model-value="setProjectIncluded"
                    label="This project"
                    density="compact"
                    hide-details
                />
                <v-autocomplete
                    :model-value="componentIds"
                    @update:model-value="setComponents"
                    label="Components"
                    :items="components"
                    item-title="name"
                    item-value="id"
                    multiple
                    chips
                    closable-chips
                    clearable
                    density="compact"
                    hide-details
                    class="component-select"
                />
                <v-autocomplete
                    :model-value="versionIds"
                    @update:model-value="setVersions"
                    label="Relevant to versions"
                    :items="availableVersions"
                    item-title="name"
                    item-value="id"
                    multiple
                    chips
                    closable-chips
                    clearable
                    density="compact"
                    hide-details
                    class="component-select"
                    :disabled="componentIds.length === 0"
                />
                <v-tooltip
                    text="Versions restrict their component's issues. Component-wide issues and issues without affected entities are included. This project remains an independent source."
                >
                    <template #activator="{ props }"><v-icon v-bind="props" icon="mdi-information-outline" /></template>
                </v-tooltip>
                <v-btn variant="text" size="small" @click="setScope('all')">All sources</v-btn>
            </div>
            <v-alert v-if="invalidSelection" type="warning" density="compact" class="mb-2">
                A selected component or version is no longer in this project. Update Sources or choose All sources.
            </v-alert>
            <v-alert v-if="optionsError" type="warning" density="compact" class="mb-2">
                Some filter options could not be loaded. <v-btn variant="text" @click="loadOptions">Retry</v-btn>
            </v-alert>
            <IssueFilterDropdowns
                :options="options"
                :item-manager="itemManager"
                :state-indices="issueStateIndices"
                ref="filterDropdowns"
            />
        </template>
        <IssueDialogs />
    </PaginatedList>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, useTemplateRef, watch } from "vue";
import { useRoute, useRouter, type RouteLocationRaw } from "vue-router";
import { useDisplay } from "vuetify";
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import type { IssueFilterInput, IssueOrder, IssueOrderField, ProjectIssueListItemInfoFragment } from "@/gql/graphql";
import PaginatedList from "@/components/PaginatedList.vue";
import IssueListItem from "@/components/IssueListItem.vue";
import IssueStateSegmentedButton from "@/components/input/IssueStateSegmentedButton.vue";
import IssueFilterDropdowns from "@/components/input/IssueFilterDropdowns.vue";
import IssueDialogs from "@/components/IssueDialogs.vue";
import { ItemManager, type ItemPage } from "@/util/itemManager";
import { issueSortFields } from "@/util/issueSortFields";
import { MergedConnectionPager } from "@/util/mergedConnectionPager";
import {
    compareProjectIssues,
    directProjectIssues,
    projectIssueScopeFilter,
    type ProjectIssueComponent,
    type ProjectIssueScope
} from "@/util/projectIssueScope";
import { emptyIssueFilterOptions, type IssueFilterOptions } from "@/util/issueFilterOptions";

const getProjectSources = graphql(`
    query getProjectIssueSources($project: ID!, $skip: Int!, $count: Int!) {
        node(id: $project) {
            ... on Project {
                components(first: $count, skip: $skip, orderBy: [{ field: ID }]) {
                    nodes {
                        id
                        version
                        component {
                            id
                            name
                        }
                    }
                    totalCount
                }
            }
        }
    }
`);
const getComponentIssueList = graphql(`
    query getComponentIssueList(
        $project: ID!
        $filter: IssueFilterInput!
        $orderBy: [IssueOrder!]!
        $count: Int!
        $skip: Int!
        $direct: Boolean!
        $component: Boolean!
    ) {
        node(id: $project) {
            ... on Project {
                issues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip) @include(if: $direct) {
                    nodes {
                        ...ProjectIssueListItemInfo
                    }
                    totalCount
                }
                componentIssues(filter: $filter, orderBy: $orderBy, first: $count, skip: $skip)
                    @include(if: $component) {
                    nodes {
                        ...ProjectIssueListItemInfo
                    }
                    totalCount
                }
            }
        }
    }
`);
const getComponentFilteredIssueList = graphql(`
    query getComponentFilteredIssueList(
        $project: ID!
        $query: String!
        $count: Int!
        $skip: Int!
        $filter: IssueFilterInput!
    ) {
        searchIssues(query: $query, first: $count, skip: $skip, filter: $filter) {
            ...ProjectIssueListItemInfo
        }
    }
`);
const getProjectIssueFilterOptions = graphql(`
    query getProjectIssueFilterOptions($trackable: ID!, $skip: Int!, $count: Int!) {
        node(id: $trackable) {
            ... on Trackable {
                usedIssueTemplates(first: $count, skip: $skip) {
                    nodes {
                        ...DefaultIssueTemplateInfo
                    }
                    totalCount
                }
                usedLabels(first: $count, skip: $skip) {
                    nodes {
                        ...DefaultLabelInfo
                        trackables {
                            nodes {
                                id
                                name
                                description
                            }
                        }
                    }
                    totalCount
                }
                usedIssuePriorities(first: $count, skip: $skip) {
                    nodes {
                        ...DefaultIssuePriorityInfo
                    }
                    totalCount
                }
                usedIssueTypes(first: $count, skip: $skip) {
                    nodes {
                        ...DefaultIssueTypeInfo
                    }
                    totalCount
                }
                usedIssueStates(first: $count, skip: $skip) {
                    nodes {
                        ...DefaultIssueStateInfo
                    }
                    totalCount
                }
                assignedUsers(first: $count, skip: $skip) {
                    nodes {
                        ...DefaultUserInfo
                    }
                    totalCount
                }
                affectedEntities(first: $count, skip: $skip) {
                    nodes {
                        ...DefaultAffectedByIssueInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

type Issue = ProjectIssueListItemInfoFragment;
const { smAndDown } = useDisplay();
const route = useRoute();
const router = useRouter();
const projectId = computed(() => route.params.trackable as string);
const filterDropdowns = useTemplateRef("filterDropdowns");
const components = ref<ProjectIssueComponent[]>([]);
const ready = ref(false);
const catalogError = ref(false);
const optionsError = ref(false);
const options = shallowRef<IssueFilterOptions>(emptyIssueFilterOptions());
const queryIds = (key: string) => {
    const value = route.query[key];
    return (Array.isArray(value) ? value : [value]).filter((id): id is string => typeof id === "string" && !!id);
};
const scope = computed<ProjectIssueScope>(() => {
    const value = route.query.scope;
    return value === "project" || value === "components" || value === "custom" ? value : "all";
});
const componentIds = computed(() => queryIds("component"));
const versionIds = computed(() => queryIds("version"));
const includeProject = computed(() => route.query.includeProject === "true");
const availableVersions = computed(() =>
    components.value
        .filter((component) => componentIds.value.includes(component.id))
        .flatMap((component) =>
            component.versions.map((version) => ({ id: version.id, name: `${component.name} · ${version.version}` }))
        )
);
const invalidSelection = computed(
    () =>
        scope.value === "custom" &&
        (componentIds.value.some((id) => !components.value.some((component) => component.id === id)) ||
            versionIds.value.some((id) => !availableVersions.value.some((version) => version.id === id)))
);
const scopeFilter = computed<IssueFilterInput>(() =>
    invalidSelection.value
        ? { id: { in: [] } }
        : projectIssueScopeFilter(
              projectId.value,
              scope.value,
              includeProject.value,
              componentIds.value,
              versionIds.value,
              components.value
          )
);
const scopeOptions = [
    { title: "All sources", value: "all" },
    { title: "This project", value: "project" },
    { title: "Components", value: "components" },
    { title: "Custom selection", value: "custom" }
];
function updateScope(query: Record<string, string | string[] | undefined>) {
    router.replace({ query: { ...route.query, ...query, page: undefined } });
}
function setScope(value: ProjectIssueScope) {
    updateScope({
        scope: value === "all" ? undefined : value,
        includeProject: value === "custom" ? "true" : undefined,
        component: undefined,
        version: undefined
    });
}
function setProjectIncluded(value: boolean | null) {
    updateScope({ includeProject: String(!!value) });
}
function setComponents(ids: string[]) {
    const values = ids ?? [];
    const remaining = components.value
        .filter((component) => values.includes(component.id))
        .flatMap((component) => component.versions.map((version) => version.id));
    updateScope({ component: values, version: versionIds.value.filter((id) => remaining.includes(id)) });
}
function setVersions(ids: string[]) {
    updateScope({ version: ids ?? [] });
}
const issueStateIndices = computed({
    get: () =>
        route.query.state === "closed" ? [1] : route.query.state && route.query.state !== "open" ? [0, 1] : [0],
    set: (value: number[]) =>
        router.replace({
            query: { ...route.query, state: value.length === 1 ? ["open", "closed"][value[0]] : "all", page: undefined }
        })
});
let catalogGeneration = 0;
async function loadSources() {
    const generation = ++catalogGeneration;
    const project = projectId.value;
    ready.value = false;
    catalogError.value = false;
    try {
        const result = new Map<string, ProjectIssueComponent>();
        let skip = 0;
        while (true) {
            const node = await queryNodeThrow(getProjectSources, "Project", { project, skip, count: 100 });
            for (const version of node.components.nodes) {
                const component = result.get(version.component.id) ?? { ...version.component, versions: [] };
                component.versions.push({ id: version.id, version: version.version });
                result.set(component.id, component);
            }
            skip += node.components.nodes.length;
            if (skip >= node.components.totalCount) break;
            if (!node.components.nodes.length) throw new Error("Could not load all project components");
        }
        if (generation !== catalogGeneration) return;
        components.value = [...result.values()].sort((a, b) => a.name.localeCompare(b.name));
        ready.value = true;
    } catch (error) {
        if (generation === catalogGeneration) catalogError.value = true;
        console.error(error);
    }
}
const optionSources = computed(() => {
    if (!ready.value || invalidSelection.value) return [];
    const ids: string[] = [];
    if (scope.value === "all" || scope.value === "project" || (scope.value === "custom" && includeProject.value))
        ids.push(projectId.value);
    if (scope.value !== "project")
        ids.push(
            ...components.value
                .filter((component) => scope.value !== "custom" || componentIds.value.includes(component.id))
                .map((component) => component.id)
        );
    return [...new Set(ids)];
});
let optionGeneration = 0;
async function loadOptions() {
    const generation = ++optionGeneration;
    optionsError.value = false;
    options.value = emptyIssueFilterOptions();
    try {
        const batches = await Promise.all(
            optionSources.value.map(async (trackable) => {
                const result = emptyIssueFilterOptions();
                let skip = 0;
                while (true) {
                    const node = await queryNodeThrow(getProjectIssueFilterOptions, "Component", {
                        trackable,
                        skip,
                        count: 100
                    });
                    result.templates.push(...node.usedIssueTemplates.nodes);
                    result.labels.push(...node.usedLabels.nodes);
                    result.priorities.push(...node.usedIssuePriorities.nodes);
                    result.types.push(...node.usedIssueTypes.nodes);
                    result.states.push(...node.usedIssueStates.nodes);
                    result.users.push(...node.assignedUsers.nodes);
                    result.affected.push(...node.affectedEntities.nodes);
                    skip += 100;
                    if (
                        Object.values(node).every(
                            (value) =>
                                typeof value !== "object" ||
                                value === null ||
                                !("totalCount" in value) ||
                                value.totalCount <= skip
                        )
                    )
                        break;
                }
                return result;
            })
        );
        if (generation !== optionGeneration) return;
        const result = emptyIssueFilterOptions();
        for (const key of Object.keys(result) as (keyof IssueFilterOptions)[]) {
            // Every option is identified independently of its source trackable.
            const values = batches.flatMap((batch) => batch[key] as { id: string }[]);
            (result[key] as { id: string }[]) = [...new Map(values.map((value) => [value.id, value])).values()];
        }
        options.value = result;
    } catch (error) {
        if (generation === optionGeneration) optionsError.value = true;
        console.error(error);
    }
}
watch(projectId, loadSources, { immediate: true });
watch(() => optionSources.value.join(","), loadOptions);
onBeforeUnmount(() => {
    ++catalogGeneration;
    ++optionGeneration;
});

class ProjectIssueItemManager extends ItemManager<Issue, IssueOrderField> {
    private session?: { key: string; pager: MergedConnectionPager<Issue> };
    protected async fetchItems(
        search: string | undefined,
        orderBy: IssueOrder[],
        count: number,
        page: number
    ): Promise<ItemPage<Issue>> {
        const current = filterDropdowns.value;
        const general: IssueFilterInput = {
            labels: current?.labelInput,
            template: current?.templateInput,
            assignments: current?.assignedToInput,
            priority: current?.priorityInput,
            type: current?.typeInput,
            affects: current?.affectedInput,
            state:
                current?.stateInput ??
                (issueStateIndices.value.length === 1
                    ? { isOpen: { eq: issueStateIndices.value[0] === 0 } }
                    : undefined)
        };
        const project = projectId.value;
        const filter: IssueFilterInput = { and: [scopeFilter.value, general] };
        if (search !== undefined) {
            const res = await requestThrow(getComponentFilteredIssueList, {
                project,
                query: search,
                filter,
                count: count + 1,
                skip: count * page
            });
            return [res.searchIssues.slice(0, count), { hasNextPage: res.searchIssues.length > count }];
        }
        const hasProject =
            scope.value === "all" || scope.value === "project" || (scope.value === "custom" && includeProject.value);
        const hasComponents =
            scope.value === "all" ||
            scope.value === "components" ||
            (scope.value === "custom" && componentIds.value.length > 0);
        if (invalidSelection.value || (!hasProject && !hasComponents)) return [[], 0];
        const fetch = async (source: number, skip: number, size: number) => {
            const sourceFilter =
                source === 1 && hasProject ? { and: [filter, { not: directProjectIssues(project) }] } : filter;
            const res = await queryNodeThrow(getComponentIssueList, "Project", {
                project,
                filter: sourceFilter,
                orderBy,
                count: size,
                skip,
                direct: source === 0,
                component: source === 1
            });
            const connection = source === 0 ? res.issues : res.componentIssues;
            if (!connection) throw new Error("Issue connection missing");
            return connection;
        };
        if (!hasProject || !hasComponents) {
            const connection = await fetch(hasProject ? 0 : 1, page * count, count);
            return [connection.nodes, connection.totalCount];
        }
        const key = JSON.stringify({ project, filter, orderBy, count });
        if (this.session?.key !== key)
            this.session = {
                key,
                pager: new MergedConnectionPager(fetch, (a, b) => compareProjectIssues(a, b, orderBy))
            };
        return this.session.pager.page(page * count, count);
    }
}
const itemManager: ItemManager<Issue, IssueOrderField> = new ProjectIssueItemManager();
function issueRoute(issue: Issue): RouteLocationRaw | undefined {
    const trackables = issue.trackables.nodes;
    const target =
        trackables.find((trackable) => trackable.id === projectId.value) ??
        [...trackables].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))[0];
    if (!target) return undefined;
    return {
        name: target.__typename === "Project" ? "project-issue" : "component-issue",
        params: { issue: issue.id, trackable: target.id }
    };
}
</script>
<style scoped>
.source-select {
    flex: 0 1 200px;
    min-width: 180px;
}
.component-select {
    flex: 1 1 260px;
    min-width: 220px;
    max-width: 500px;
}
</style>
