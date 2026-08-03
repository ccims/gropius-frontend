<template>
    <PaginatedList
        name="IMS projects"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="
            (imsProject: IMSProject) => (imsProject.ims ? imsProjectRoute(imsProject.id, imsProject.ims.id) : undefined)
        "
        query-param-prefix=""
        :dependencies="dependencyArray"
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #append>
                    <SyncSelfAllowedSwitch :target="item" />
                </template>
            </ListItem>
        </template>
        <template #additional-filter>
            <FilterDropdown
                v-model="templateIds"
                :item-manager="itemManager"
                :mapper="(item) => item.ims?.template"
                label="Template"
                :fetch-on-search="templateFetch"
            />
        </template>
        <CreateIMSProjectDialog
            :trackable="trackable"
            @created-ims-project="(imsProject) => selectIMSProject(imsProject)"
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { queryNode, request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import type { IdObject } from "@/util/types";
import {
    type DefaultImsProjectInfoFragment,
    type ImsProjectFilterInput,
    type ImsProjectOrder,
    ImsProjectOrderField
} from "@/gql/graphql";
import SyncSelfAllowedSwitch from "@/components/input/SyncSelfAllowedSwitch.vue";
import { computed } from "vue";
import CreateIMSProjectDialog from "@/components/dialog/CreateIMSProjectDialog.vue";
import { ItemManager } from "@/util/itemManager";
import { useFilterOption } from "@/util/useFilterOption";
import FilterDropdown from "@/components/input/FilterDropdown.vue";

const getIMSProjectListFromTrackableQuery = graphql(`
    query getIMSProjectListFromTrackable(
        $orderBy: [IMSProjectOrder!]!
        $count: Int!
        $skip: Int!
        $trackable: ID!
        $filter: IMSProjectFilterInput!
    ) {
        node(id: $trackable) {
            __typename
            ... on Trackable {
                syncsTo(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
                    nodes {
                        ...DefaultIMSProjectInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredIMSProjectListQuery = graphql(`
    query getFilteredIMSProjectList($query: String!, $count: Int!, $filter: IMSProjectFilterInput!) {
        searchIMSProjects(query: $query, first: $count, filter: $filter) {
            ...DefaultIMSProjectInfo
        }
    }
`);

const searchIMSTemplatesQuery = graphql(`
    query searchIMSTemplates($query: String!, $count: Int!) {
        searchIMSTemplates(query: $query, first: $count) {
            id
            name
        }
    }
`);

type IMSProject = DefaultImsProjectInfoFragment;

const router = useRouter();
const route = useRoute();

const trackable = computed(() => route.params.trackable as string);

const sortFields = {
    Name: ImsProjectOrderField.Name,
    IMS: [ImsProjectOrderField.ImsName, ImsProjectOrderField.ImsId],
    "[Default]": ImsProjectOrderField.Id
};

const templateIds = useFilterOption("template", true);
const templateInput = computed(() => {
    if (templateIds.value.length == 0) {
        return undefined;
    }
    return { id: { in: templateIds.value } };
});
const templateFetch = async (query: string) => {
    const res = await requestThrow(searchIMSTemplatesQuery, { query: query, count: 100 });
    return res.searchIMSTemplates;
};

const dependencyArray = computed(() => [templateInput]);

class IMSProjectItemManager extends ItemManager<IMSProject, ImsProjectOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ImsProjectOrder[],
        count: number,
        page: number
    ): Promise<[IMSProject[], number]> {
        const generalFilters: ImsProjectFilterInput = {
            ims: {
                template: templateInput.value
            }
        };
        if (filter == undefined) {
            const res = await queryNode(getIMSProjectListFromTrackableQuery, "Component", {
                orderBy,
                count,
                skip: page * count,
                trackable: trackable.value,
                filter: generalFilters
            });
            if (res) {
                return [res.syncsTo.nodes, res.syncsTo.totalCount];
            }
        } else {
            const res = await request(getFilteredIMSProjectListQuery, {
                query: filter,
                count,
                filter: { ...generalFilters, trackable: { id: { eq: trackable.value } } }
            });
            if (res) {
                return [res.searchIMSProjects, res.searchIMSProjects.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<IMSProject, ImsProjectOrderField> = new IMSProjectItemManager();

function selectIMSProject(imsProject: IdObject & { ims: IdObject }) {
    router.push(imsProjectRoute(imsProject.id, imsProject.ims.id));
}

function imsProjectRoute(id: string, ims: string): RouteLocationRaw {
    return {
        name: "ims-project-general",
        params: {
            ims,
            project: id
        }
    };
}
</script>
