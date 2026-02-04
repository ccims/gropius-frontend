<template>
    <PaginatedList
        name="versions"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="() => undefined"
        :dependencies="dependencyArray"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #append-line>
                    <div class="d-flex flex-wrap chip-container mt-1">
                        <template v-if="item.filterByTemplate.nodes.length > 0">
                            <v-chip
                                v-for="(entry, index) in item.filterByTemplate.nodes"
                                :key="index"
                                color="primary"
                                size="small"
                                class="flex-shrink-0"
                            >
                                {{ entry.name }}
                            </v-chip>
                        </template>
                        <template v-else>
                            <div class="text-medium-emphasis text-body-2 text-ellipsis font-italic flex-grow-1">
                                <v-icon icon="mdi-filter-off" />
                                No filter configured
                            </div>
                        </template>
                    </div>
                </template>
                <template #append>
                    <IconButton :disabled="!(manageViews ?? false)" @click="updateView(item)" class="mr-2">
                        <v-icon icon="mdi-pencil" />
                        <v-tooltip activator="parent" location="bottom">Edit view</v-tooltip>
                    </IconButton>
                    <IconButton :disabled="!(manageViews ?? false)">
                        <v-icon icon="mdi-delete" />
                        <ConfirmationDialog
                            :title="`Delete view?`"
                            :message="`Are you sure you want to the view?`"
                            confirm-text="Delete"
                            @confirm="deleteView(item.id)"
                        />
                        <v-tooltip activator="parent" location="bottom">Delete view</v-tooltip>
                    </IconButton>
                </template>
            </ListItem>
        </template>
        <template #additional-filter>
            <FilterDropdown
                v-model="templateIds"
                :item-manager="itemManager"
                :mapper="(item) => item.filterByTemplate.nodes"
                label="Template"
                :fetch-on-search="templateFetch"
            />
        </template>
        <CreateViewDialog :project="trackableId" :templates="templates" @created-view="modifiedViews.push($event.id)" />
        <UpdateViewDialog v-model="viewToUpdate" :templates="templates" @updated-view="modifiedViews.push($event.id)" />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { requestThrow, queryNodeThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { ViewOrder, ViewOrderField, DefaultViewInfoFragment } from "@/gql/graphql";
import { useRoute } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import { computed, inject, ref } from "vue";
import CreateViewDialog from "@/components/dialog/CreateViewDialog.vue";
import { trackableKey } from "@/util/keys";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import UpdateViewDialog from "@/components/dialog/UpdateViewDialog.vue";
import { ItemManager } from "@/util/itemManager";
import { useFilterOption } from "@/util/useFilterOption";
import FilterDropdown from "@/components/input/FilterDropdown.vue";

type View = DefaultViewInfoFragment & {
    filterByTemplate: {
        nodes: {
            id: string;
            name: string;
            description: string;
        }[];
    };
};

const getViewListQuery = graphql(`
    query getViewList($orderBy: [ViewOrder!]!, $count: Int!, $skip: Int!, $project: ID!, $filter: ViewFilterInput!) {
        node(id: $project) {
            ... on Project {
                views(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
                    nodes {
                        ...DefaultViewInfo
                        filterByTemplate {
                            nodes {
                                description
                            }
                        }
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredViewListQuery = graphql(`
    query getFilteredViewList($query: String!, $count: Int!, $filter: ViewFilterInput!) {
        searchViews(query: $query, first: $count, filter: $filter) {
            ...DefaultViewInfo
            filterByTemplate {
                nodes {
                    description
                }
            }
        }
    }
`);

const searchComponentTemplatesQuery = graphql(`
    query searchComponentTemplatesForViews($query: String!, $count: Int!) {
        searchComponentTemplates(query: $query, first: $count) {
            id
            name
            description
        }
    }
`);

const getProjectComponentTemplatesQuery = graphql(`
    query getProjectComponentTemplates($project: ID!) {
        node(id: $project) {
            ... on Project {
                components {
                    nodes {
                        component {
                            template {
                                name
                                id
                            }
                        }
                    }
                }
            }
        }
    }
`);

const deleteViewMutation = graphql(`
    mutation deleteView($id: ID!) {
        deleteView(input: { id: $id }) {
            __typename
        }
    }
`);

const route = useRoute();
const trackable = inject(trackableKey);
const trackableId = computed(() => route.params.trackable as string);
const modifiedViews = ref<string[]>([]);
const viewToUpdate = ref<
    | {
          id: string;
          name: string;
          description: string;
          filterByTemplate: string[];
      }
    | undefined
>();

const sortFields = {
    Name: ViewOrderField.Name,
    "[Default]": ViewOrderField.Id
};

const templateIds = useFilterOption("template", true);
const templateInput = computed(() => {
    if (templateIds.value.length === 0) {
        return undefined;
    } else {
        return { any: { id: { in: templateIds.value } } };
    }
});
const templateFetch = async (query: string) => {
    const res = await requestThrow(searchComponentTemplatesQuery, { query: query, count: 100 });
    return res.searchComponentTemplates;
};

const dependencyArray = computed(() => [modifiedViews, templateInput]);

class ViewItemManager extends ItemManager<View, ViewOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: ViewOrder[],
        count: number,
        page: number
    ): Promise<[View[], number]> {
        if (filter == undefined) {
            const project = await queryNodeThrow(getViewListQuery, "Project", {
                orderBy,
                count,
                skip: page * count,
                project: trackableId.value,
                filter: { filterByTemplate: templateInput.value }
            });
            return [project.views.nodes, project.views.totalCount];
        } else {
            const res = await requestThrow(getFilteredViewListQuery, {
                query: filter,
                count,
                filter: { filterByTemplate: templateInput.value, project: { id: { eq: trackableId.value } } }
            });
            return [res.searchViews, res.searchViews.length];
        }
    }
}
const itemManager: ItemManager<View, ViewOrderField> = new ViewItemManager();

const templates = computedAsync(async () => {
    return withErrorMessage(async () => {
        const project = await queryNodeThrow(getProjectComponentTemplatesQuery, "Project", {
            project: trackableId.value
        });
        const templateLookup = new Map<string, { id: string; name: string }>();
        for (const componentVersion of project.components.nodes) {
            const template = componentVersion.component.template;
            templateLookup.set(template.id, { id: template.id, name: template.name });
        }
        const templates = [...templateLookup.values()];
        templates.sort((a, b) => a.name.localeCompare(b.name));
        return templates;
    }, "Error loading templates");
}, []);

const manageViews = computed(() => (trackable!.value as { manageViews: boolean } | undefined)?.manageViews ?? false);

function updateView(view: View) {
    viewToUpdate.value = {
        id: view.id,
        name: view.name,
        description: view.description,
        filterByTemplate: view.filterByTemplate.nodes.map((template) => template.id)
    };
}

async function deleteView(viewId: string) {
    await withErrorMessage(async () => {
        await requestThrow(deleteViewMutation, { id: viewId });
    }, "Error deleting view");
    modifiedViews.value.push(viewId);
}
</script>
<style scoped lang="scss">
@use "@/styles/settings";
.issue-container {
    min-width: settings.$icon-with-number-width;
}

.chip-container {
    row-gap: 0.5rem;
    column-gap: 0.25rem;
}
</style>
