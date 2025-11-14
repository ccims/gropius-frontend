<template>
    <PaginatedList
        name="issueTemplates"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(template: IssueTemplate) => templateRoute(template)"
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
                        <v-icon icon="mdi-file-outline" />
                        {{ item.templateFieldSpecifications.length }} fields
                    </div>
                </template>
            </ListItem>
        </template>

        <CreateIssueTemplateDialog @created-template="(template: IdObject) => selectTemplate(template)" />
    </PaginatedList>
</template>

<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { ItemManager } from "@/util/itemManager";
import { ClientReturnType, useClient } from "@/graphql/client";
import { RouteLocationRaw, useRouter } from "vue-router";
import { IssueTemplateOrder, IssueTemplateOrderField } from "@/graphql/generated";
import ListItem from "@/components/ListItem.vue";
import CreateIssueTemplateDialog from "@/components/dialog/CreateIssueTemplateDialog.vue";
import { IdObject } from "@/util/types";

type IssueTemplate = ClientReturnType<"firstIssueTemplates">["issueTemplates"]["nodes"][0];

const client = useClient();
const router = useRouter();

const sortFields = {
    Name: "NAME",
    "[Default]": "ID"
};

class IssueTemplateItemManager extends ItemManager<IssueTemplate, IssueTemplateOrderField> {
    protected async fetchItems(
        filter: string,
        orderBy: IssueTemplateOrder[],
        count: number,
        page: number
    ): Promise<[IssueTemplate[], number]> {
        if (!filter) {
            const res = await client.firstIssueTemplates({ count });
            return [res.issueTemplates.nodes, res.issueTemplates.nodes.length];
        } else {
            const res = await client.searchIssueTemplates({ query: filter, count });
            return [res.searchIssueTemplates, res.searchIssueTemplates.length];
        }
    }
}

const itemManager: ItemManager<IssueTemplate, IssueTemplateOrderField> = new IssueTemplateItemManager();


function selectTemplate(template: IdObject) {
    router.push(templateRoute(template));
}

function templateRoute(template: IdObject): RouteLocationRaw {
    return {
        name: "templates-issue",
        params: {
            trackable: template.id
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
