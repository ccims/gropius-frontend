<template>
    <PermissionList
        ref="permissionList"
        :permission-entries="permissionEntries"
        :item-manager="itemManager"
        node-name="project"
        :remove-permission="removePermission"
        :update-permission="updatePermission"
        :create-permission="createPermission"
    >
        <template #import-dialog="{ importedPermission }">
            <ImportProjectPermissionDialog :project="projectId" @imported-project-permission="importedPermission" />
        </template>
    </PermissionList>
</template>
<script lang="ts" setup>
import PermissionList, {
    type CreatePermissionFunctionInput,
    type UpdatePermissionFunctionInput
} from "@/components/PermissionList.vue";
import ImportProjectPermissionDialog from "@/components/dialog/ImportProjectPermissionDialog.vue";
import { request, queryNode } from "@/gql/client";
import { graphql } from "@/gql";
import {
    type ProjectPermissionOrderField,
    type DefaultProjectPermissionInfoFragment,
    type ProjectPermissionOrder
} from "@/gql/graphql";
import { ProjectPermissionEntry } from "@/gql/enums";
import type { IdObject } from "@/util/types";
import { computed, useTemplateRef } from "vue";
import { useRoute } from "vue-router";
import { ItemManager } from "@/util/itemManager";

const route = useRoute();

const projectId = computed(() => route.params.trackable as string);
const permissionList = useTemplateRef("permissionList");

const permissionEntries = Object.values(ProjectPermissionEntry);

const getProjectPermissionListQuery = graphql(`
    query getProjectPermissionList(
        $orderBy: [ProjectPermissionOrder!]!
        $count: Int!
        $skip: Int!
        $project: ID!
        $filter: ProjectPermissionFilterInput!
    ) {
        node(id: $project) {
            ... on Project {
                permissions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
                    nodes {
                        ...DefaultProjectPermissionInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredProjectPermissionListQuery = graphql(`
    query getFilteredProjectPermissionList($query: String!, $count: Int!, $filter: ProjectPermissionFilterInput!) {
        searchProjectPermissions(query: $query, first: $count, filter: $filter) {
            ...DefaultProjectPermissionInfo
        }
    }
`);

const removeProjectPermissionFromProjectMutation = graphql(`
    mutation removeProjectPermissionFromProject($project: ID!, $projectPermission: ID!) {
        updateProject(input: { id: $project, removedPermissions: [$projectPermission] }) {
            __typename
        }
    }
`);

const updateProjectPermissionMutation = graphql(`
    mutation updateProjectPermission($input: UpdateProjectPermissionInput!) {
        updateProjectPermission(input: $input) {
            __typename
        }
    }
`);

const createProjectPermissionMutation = graphql(`
    mutation createProjectPermission($input: CreateProjectPermissionInput!) {
        createProjectPermission(input: $input) {
            projectPermission {
                id
            }
        }
    }
`);

class ProjectPermissionItemManager extends ItemManager<
    DefaultProjectPermissionInfoFragment,
    ProjectPermissionOrderField
> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ProjectPermissionOrder[],
        count: number,
        page: number
    ): Promise<[DefaultProjectPermissionInfoFragment[], number]> {
        if (filter == undefined) {
            const project = await queryNode(getProjectPermissionListQuery, "Project", {
                orderBy,
                count,
                skip: page * count,
                project: projectId.value,
                filter: permissionList.value?.userFilter ?? {}
            });
            if (project) {
                return [project.permissions.nodes, project.permissions.totalCount];
            }
        } else {
            const res = await request(getFilteredProjectPermissionListQuery, {
                query: filter,
                count,
                filter: {
                    ...permissionList.value?.userFilter,
                    nodesWithPermission: { any: { id: { eq: projectId.value } } }
                }
            });
            if (res) {
                return [res.searchProjectPermissions, res.searchProjectPermissions.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<DefaultProjectPermissionInfoFragment, ProjectPermissionOrderField> =
    new ProjectPermissionItemManager();

async function removePermission(id: string): Promise<void> {
    await request(removeProjectPermissionFromProjectMutation, {
        project: projectId.value,
        projectPermission: id
    });
}

async function updatePermission(input: UpdatePermissionFunctionInput<ProjectPermissionEntry>): Promise<void> {
    await request(updateProjectPermissionMutation, { input });
}

async function createPermission(input: CreatePermissionFunctionInput<ProjectPermissionEntry>): Promise<IdObject> {
    const res = await request(createProjectPermissionMutation, {
        input: { nodesWithPermission: [projectId.value], ...input }
    });
    if (!res) {
        throw new Error("Failed to create permission");
    }
    return res.createProjectPermission.projectPermission;
}
</script>
