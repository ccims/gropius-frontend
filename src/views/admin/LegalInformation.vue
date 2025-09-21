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
            <ListItem
                :title="item.label"
                :subtitle="`Priority: ${item.priority}`"
            >
                <template #append>
                    <IconButton
                        @click="legalInformationToUpdate = item"
                        class="mr-2"
                    >
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
        <!-- TODO: Add dialogs when they are created -->
        <!-- <CreateLegalInformationDialog @created-legal-information="refreshList" /> -->
        <!-- <UpdateLegalInformationDialog -->
        <!--     v-model="legalInformationToUpdate" -->
        <!--     @updated-legal-information="refreshList" -->
        <!-- /> -->
    </PaginatedList>
</template>
<script lang="ts" setup>
import ListItem from "@/components/ListItem.vue";
import PaginatedList from "@/components/PaginatedList.vue";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import { useClient } from "@/graphql/client";
import { LegalInformationOrder, LegalInformationOrderField } from "@/graphql/generated";
import { ItemManager } from "@/util/itemManager";
import { withErrorMessage } from "@/util/withErrorMessage";
import { ref } from "vue";

type LegalInformation = {
    id: string;
    label: string;
    priority: number;
};

const client = useClient();

const legalInformationToUpdate = ref<LegalInformation | undefined>();
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
            const res = await client.getLegalInformationList({
                orderBy,
                count,
                skip: page * count
            });
            const legalInformation = res.legalInformation;
            return [legalInformation.nodes, legalInformation.totalCount];
        } else {
            const res = await client.getFilteredLegalInformationList({
                query: filter,
                count
            });
            return [res.searchLegalInformation, res.searchLegalInformation.length];
        }
    }
}
const itemManager: ItemManager<LegalInformation, LegalInformationOrderField> = new LegalInformationItemManager();

async function deleteLegalInformation(legalInformationId: string) {
    await withErrorMessage(async () => {
        await client.deleteLegalInformation({
            id: legalInformationId
        });
    }, "Error deleting legal information");
    modifiedLegalInformation.value.push(legalInformationId);
}
</script>