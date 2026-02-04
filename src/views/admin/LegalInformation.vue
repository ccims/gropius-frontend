<template>
    <PaginatedList
        name="legal information documents"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="() => undefined"
        :dependencies="modifiedLegalInformation"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem :title="item.label" :subtitle="`Priority: ${item.priority}`">
                <template #append>
                    <IconButton @click="legalInformationToUpdate = item" class="mr-2">
                        <v-icon icon="mdi-pencil" />
                        <v-tooltip activator="parent" location="bottom">Edit legal information</v-tooltip>
                    </IconButton>
                    <IconButton>
                        <v-icon icon="mdi-delete" />
                        <ConfirmationDialog
                            title="Delete legal information?"
                            message="Are you sure you want to delete this legal information? This action cannot be undone."
                            confirm-text="Delete"
                            @confirm="deleteLegalInformation(item.id)"
                        />
                        <v-tooltip activator="parent" location="bottom">Delete legal information</v-tooltip>
                    </IconButton>
                </template>
            </ListItem>
        </template>
        <CreateLegalInformationDialog @created-legal-information="modifiedLegalInformation.push($event.id)" />
        <UpdateLegalInformationDialog
            v-model="legalInformationToUpdate"
            @updated-legal-information="modifiedLegalInformation.push($event.id)"
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import ListItem from "@/components/ListItem.vue";
import PaginatedList from "@/components/PaginatedList.vue";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import CreateLegalInformationDialog from "@/components/dialog/CreateLegalInformationDialog.vue";
import UpdateLegalInformationDialog from "@/components/dialog/UpdateLegalInformationDialog.vue";
import { request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import { LegalInformationOrder, LegalInformationOrderField, DefaultLegalInformationInfoFragment } from "@/gql/graphql";
import { useAppStore } from "@/store/app";
import { ItemManager } from "@/util/itemManager";
import { ref, watch } from "vue";
import { withErrorMessage } from "@/util/withErrorMessage";

const getLegalInformationListQuery = graphql(`
    query getLegalInformationList($orderBy: [LegalInformationOrder!], $count: Int!, $skip: Int!) {
        legalInformation(orderBy: $orderBy, first: $count, skip: $skip) {
            nodes {
                ...DefaultLegalInformationInfo
            }
            totalCount
        }
    }
`);

const getFilteredLegalInformationListQuery = graphql(`
    query getFilteredLegalInformationList($query: String!, $count: Int!) {
        searchLegalInformation(query: $query, first: $count) {
            ...DefaultLegalInformationInfo
        }
    }
`);

const deleteLegalInformationMutation = graphql(`
    mutation deleteLegalInformation($id: ID!) {
        deleteLegalInformation(input: { id: $id }) {
            __typename
        }
    }
`);

type LegalInformation = DefaultLegalInformationInfoFragment;

const store = useAppStore();

const legalInformationToUpdate = ref<LegalInformation>();
const modifiedLegalInformation = ref<string[]>([]);

const sortFields = {
    Priority: LegalInformationOrderField.Priority
};

class LegalInformationItemManager extends ItemManager<LegalInformation, LegalInformationOrderField> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: LegalInformationOrder[],
        count: number,
        page: number
    ): Promise<[LegalInformation[], number]> {
        if (filter == undefined) {
            const res = await request(getLegalInformationListQuery, {
                orderBy,
                count,
                skip: page * count
            });
            if (res) {
                return [res.legalInformation.nodes as LegalInformation[], res.legalInformation.totalCount];
            }
        } else {
            const res = await request(getFilteredLegalInformationListQuery, {
                query: filter,
                count
            });
            if (res) {
                return [res.searchLegalInformation as LegalInformation[], res.searchLegalInformation.length];
            }
        }
        return [[], 0];
    }
}
const itemManager: ItemManager<LegalInformation, LegalInformationOrderField> = new LegalInformationItemManager();

async function deleteLegalInformation(legalInformationId: string) {
    await withErrorMessage(async () => {
        await requestThrow(deleteLegalInformationMutation, {
            id: legalInformationId
        });
    }, "Error deleting legal information");
    modifiedLegalInformation.value.push(legalInformationId);
}

watch(
    modifiedLegalInformation,
    () => {
        store.updateLegalInformation();
    },
    {
        deep: true
    }
);
</script>
