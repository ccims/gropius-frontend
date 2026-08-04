<template>
    <PaginatedList
        name="projects"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(project: Project) => projectRoute(project)"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #append>
                    <div class="text-medium-emphasis issue-container">
                        <v-icon icon="mdi-alert-circle-outline" />
                        {{ item.openIssues.totalCount }}
                    </div>
                </template>
            </ListItem>
        </template>
        <CreateProjectDialog @created-project="(project: IdObject) => selectProject(project)" />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { request } from "@/gql/client";
import { graphql } from "@/gql";
import { ProjectOrderField, type ProjectOrder, type ProjectListItemInfoFragment } from "@/gql/graphql";
import { type RouteLocationRaw, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import CreateProjectDialog from "@/components/dialog/CreateProjectDialog.vue";
import type { IdObject } from "@/util/types";
import { ItemManager } from "@/util/itemManager";

const getProjectListQuery = graphql(`
    query getProjectList($orderBy: [ProjectOrder!]!, $count: Int!, $skip: Int!) {
        projects(orderBy: $orderBy, first: $count, skip: $skip) {
            nodes {
                ...ProjectListItemInfo
            }
            totalCount
        }
    }
`);

const getFilteredProjectListQuery = graphql(`
    query getFilteredProjectList($query: String!, $count: Int!) {
        searchProjects(query: $query, first: $count) {
            ...ProjectListItemInfo
        }
    }
`);

type Project = ProjectListItemInfoFragment;

const router = useRouter();

const sortFields = {
    Name: ProjectOrderField.Name,
    "[Default]": ProjectOrderField.Id
};

class ProjectItemManager extends ItemManager<Project, ProjectOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ProjectOrder[],
        count: number,
        page: number
    ): Promise<[Project[], number]> {
        if (filter == undefined) {
            const res = await request(getProjectListQuery, {
                orderBy,
                count,
                skip: page * count
            });
            if (res) {
                return [res.projects.nodes, res.projects.totalCount];
            }
        } else {
            const res = await request(getFilteredProjectListQuery, {
                query: filter,
                count
            });
            if (res) {
                return [res.searchProjects, res.searchProjects.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<Project, ProjectOrderField> = new ProjectItemManager();

function selectProject(project: IdObject) {
    router.push(projectRoute(project));
}

function projectRoute(project: IdObject): RouteLocationRaw {
    return {
        name: "project",
        params: {
            trackable: project.id
        }
    };
}
</script>
<style scoped lang="scss">
@use "@/styles/settings";
.issue-container {
    min-width: settings.$icon-with-number-width;
}
</style>
