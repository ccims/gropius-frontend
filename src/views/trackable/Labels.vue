<template>
    <PaginatedList
        name="labels"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="() => undefined"
        :dependencies="modifiedLabels"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #prepend>
                    <v-icon :color="item.color" class="mr-2" icon="mdi-circle" />
                </template>
                <template #append>
                    <IconButton
                        :disabled="!(trackable?.manageLabels ?? false)"
                        @click="labelToUpdate = item"
                        class="mr-2"
                    >
                        <v-icon icon="mdi-pencil" />
                        <v-tooltip activator="parent" location="bottom">Edit label</v-tooltip>
                    </IconButton>
                    <IconButton :disabled="!(trackable?.manageLabels ?? false)">
                        <v-icon icon="mdi-close" />
                        <ConfirmationDialog
                            :title="`Remove label from ${nodeName}?`"
                            :message="`Are you sure you want to remove the label from this ${nodeName}?`"
                            confirm-text="Remove"
                            @confirm="removeLabel(item.id)"
                        />
                        <v-tooltip activator="parent" location="bottom">Remove label from {{ nodeName }}</v-tooltip>
                    </IconButton>
                </template>
            </ListItem>
        </template>
        <CreateLabelDialog :trackable="trackableId" @created-label="modifiedLabels.push($event.id)" />
        <UpdateLabelDialog
            :trackable="trackableId"
            v-model="labelToUpdate"
            @updated-label="modifiedLabels.push($event.id)"
        />
        <ImportLabelDialog :trackable="trackableId" @imported-label="modifiedLabels.push($event.id)" />
    </PaginatedList>
</template>
<script lang="ts" setup>
import ListItem from "@/components/ListItem.vue";
import PaginatedList from "@/components/PaginatedList.vue";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import CreateLabelDialog from "@/components/dialog/CreateLabelDialog.vue";
import ImportLabelDialog from "@/components/dialog/ImportLabelDialog.vue";
import UpdateLabelDialog from "@/components/dialog/UpdateLabelDialog.vue";
import { queryNode, request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { type LabelOrder, LabelOrderField, type DefaultLabelInfoFragment } from "@/gql/graphql";
import { ItemManager } from "@/util/itemManager";
import { trackableKey } from "@/util/keys";
import { inject } from "vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { withErrorMessage } from "@/util/withErrorMessage";

const getLabelListQuery = graphql(`
    query getLabelList($orderBy: [LabelOrder!]!, $count: Int!, $skip: Int!, $trackable: ID!) {
        node(id: $trackable) {
            __typename
            ... on Trackable {
                labels(orderBy: $orderBy, first: $count, skip: $skip) {
                    nodes {
                        ...DefaultLabelInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredLabelListQuery = graphql(`
    query getFilteredLabelList($query: String!, $count: Int!, $trackable: ID!) {
        searchLabels(query: $query, first: $count, filter: { trackables: { any: { id: { eq: $trackable } } } }) {
            ...DefaultLabelInfo
        }
    }
`);

const removeLabelFromTrackableMutation = graphql(`
    mutation removeLabelFromTrackable($trackable: ID!, $label: ID!) {
        removeLabelFromTrackable(input: { label: $label, trackable: $trackable }) {
            __typename
        }
    }
`);

type Label = DefaultLabelInfoFragment;

const route = useRoute();

const trackableId = computed(() => route.params.trackable as string);
const trackable = inject(trackableKey);
const modifiedLabels = ref<string[]>([]);
const labelToUpdate = ref<Label | undefined>();

const nodeName = computed(() => {
    if (route.name?.toString().startsWith("component")) {
        return "component";
    } else {
        return "project";
    }
});

const sortFields = {
    Name: LabelOrderField.Name,
    Color: LabelOrderField.Color
};

class LabelItemManager extends ItemManager<Label, LabelOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: LabelOrder[],
        count: number,
        page: number
    ): Promise<[Label[], number]> {
        if (filter == undefined) {
            const res = await queryNode(getLabelListQuery, "Component", {
                orderBy,
                count,
                skip: page * count,
                trackable: trackableId.value
            });
            if (res) {
                return [res.labels.nodes, res.labels.totalCount];
            }
        } else {
            const res = await request(getFilteredLabelListQuery, {
                query: filter,
                count,
                trackable: trackableId.value
            });
            if (res) {
                return [res.searchLabels, res.searchLabels.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<Label, LabelOrderField> = new LabelItemManager();

async function removeLabel(labelId: string) {
    await withErrorMessage(async () => {
        await requestThrow(removeLabelFromTrackableMutation, {
            label: labelId,
            trackable: trackableId.value
        });
    }, "Error removing label from trackable");
    modifiedLabels.value.push(labelId);
}
</script>
