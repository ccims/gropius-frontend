<template>
    <FetchingAutocomplete
        mode="add-context"
        :fetch="searchProjectPermissions"
        :context-fetch="searchProjects"
        :label="projectPermission"
        placeholder="Search project"
        :item-title="(item: any) => item.name ?? item.title"
        :initial-context="initialContext"
    >
        <template #item="{ props, item: projectPermission }">
            <v-list-item
                :title="projectPermission.raw.name"
                :subtitle="projectPermission.raw.description"
                v-bind="props"
            />
        </template>
        <template #context-item="{ props, item }">
            <v-list-item :title="item.raw.name" :subtitle="item.raw.description" v-bind="props"> </v-list-item>
        </template>
    </FetchingAutocomplete>
</template>
<script setup lang="ts">
import { graphql } from "@/gql";
import { queryNodeThrow, requestThrow } from "@/gql/client";
import { DefaultProjectPermissionInfoFragment, DefaultTrackableInfoFragment } from "@/gql/graphql";
import { withErrorMessage } from "@/util/withErrorMessage";
import FetchingAutocomplete from "./FetchingAutocomplete.vue";
import { transformSearchQuery } from "@/util/searchQueryTransformer";
import { PropType } from "vue";

const searchProjectPermissionsQuery = graphql(`
    query searchProjectPermissions($project: ID!, $query: String!, $count: Int!) {
        searchProjectPermissions(
            query: $query
            first: $count
            filter: { nodesWithPermission: { any: { id: { eq: $project } } } }
        ) {
            ...DefaultProjectPermissionInfo
        }
    }
`);

const firstProjectPermissionsQuery = graphql(`
    query firstProjectPermissions($project: ID!, $count: Int!) {
        node(id: $project) {
            ... on Project {
                permissions(first: $count, orderBy: [{ field: NAME }]) {
                    nodes {
                        ...DefaultProjectPermissionInfo
                    }
                }
            }
        }
    }
`);

const searchProjectsQuery = graphql(`
    query searchProjectsForPermissionAutocomplete($query: String!, $count: Int!) {
        searchProjects(query: $query, first: $count) {
            ...DefaultTrackableInfo
        }
    }
`);

const firstProjectsQuery = graphql(`
    query firstProjectsForPermissionAutocomplete($count: Int!) {
        projects(first: $count) {
            nodes {
                ...DefaultTrackableInfo
            }
        }
    }
`);

const props = defineProps({
    projectPermission: {
        type: String,
        required: false,
        default: "ProjectPermission"
    },
    initialContext: {
        type: Object as PropType<Readonly<DefaultTrackableInfoFragment>>,
        required: false
    }
});

async function searchProjectPermissions(
    filter: string,
    count: number,
    context?: DefaultTrackableInfoFragment
): Promise<DefaultProjectPermissionInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchProjectPermissionsQuery, { query, count, project: context!.id });
            return res.searchProjectPermissions;
        } else {
            const node = await queryNodeThrow(firstProjectPermissionsQuery, "Project", { project: context!.id, count });
            return node.permissions.nodes;
        }
    }, "Error searching project permissions");
}

async function searchProjects(filter: string, count: number): Promise<DefaultTrackableInfoFragment[]> {
    return await withErrorMessage(async () => {
        const query = transformSearchQuery(filter);
        if (query != undefined) {
            const res = await requestThrow(searchProjectsQuery, { query, count });
            return res.searchProjects;
        } else {
            const res = await requestThrow(firstProjectsQuery, { count });
            return res.projects.nodes;
        }
    }, "Error searching projects");
}
</script>
