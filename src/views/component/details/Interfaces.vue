<template>
    <PaginatedList
        name="interface specifications"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="(interfaceSpecification: InterfaceSpecification) => interfaceSpecificationRoute(interfaceSpecification)"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            />
        </template>
        <CreateInterfaceSpecificationDialog
            :component="trackableId"
            :component-template="componentTemplateInfo?.template?.id"
            allow-invisible
            @created-interface-specification="
                (interfaceSpecification: IdObject) => selectInterfaceSpecification(interfaceSpecification)
            "
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { NodeReturnType, useClient } from "@/graphql/client";
import { InterfaceSpecificationOrder, InterfaceSpecificationOrderField } from "@/graphql/generated";
import { RouteLocationRaw, useRoute, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import CreateInterfaceSpecificationDialog from "@/components/dialog/CreateInterfaceSpecificationDialog.vue";
import { IdObject } from "@/util/types";
import { computed } from "vue";
import { computedAsync } from "@vueuse/core";
import { withErrorMessage } from "@/util/withErrorMessage";
import { ItemManager } from "@/util/itemManager";

type InterfaceSpecification = NodeReturnType<
    "getInterfaceSpecificationList",
    "Component"
>["interfaceSpecifications"]["nodes"][0];

const client = useClient();
const router = useRouter();
const route = useRoute();
const trackableId = computed(() => route.params.trackable as string);

const componentTemplateInfo = computedAsync(
    async () => {
        const templateRes = await withErrorMessage(async () => {
            return client.getComponentTemplateDetails({ id: trackableId.value });
        }, "Error loading component template info");
        return templateRes.node as NodeReturnType<"getComponentTemplateDetails", "Component">;
    },
    null,
    { shallow: false }
);

const sortFields = {
    Name: InterfaceSpecificationOrderField.Name,
    Template: [InterfaceSpecificationOrderField.TemplateName, InterfaceSpecificationOrderField.TemplateId],
    "[Default]": InterfaceSpecificationOrderField.Id
};

class InterfaceItemManager extends ItemManager<InterfaceSpecification, InterfaceSpecificationOrderField> {
    protected async fetchItems(
        filter: string,
        orderBy: InterfaceSpecificationOrder[],
        count: number,
        page: number
    ): Promise<[InterfaceSpecification[], number]> {
        if (filter == undefined) {
            const res = (
                await client.getInterfaceSpecificationList({
                    orderBy,
                    count,
                    skip: page * count,
                    component: trackableId.value
                })
            ).node as NodeReturnType<"getInterfaceSpecificationList", "Component">;
            return [res.interfaceSpecifications.nodes, res.interfaceSpecifications.totalCount];
        } else {
            const res = await client.getFilteredInterfaceSpecificationList({
                query: filter,
                count,
                component: trackableId.value
            });
            return [res.searchInterfaceSpecifications, res.searchInterfaceSpecifications.length];
        }
    }
}

const itemManager: ItemManager<InterfaceSpecification, InterfaceSpecificationOrderField> = new InterfaceItemManager();

function selectInterfaceSpecification(interfaceSpecification: IdObject) {
    router.push(interfaceSpecificationRoute(interfaceSpecification));
}

function interfaceSpecificationRoute(interfaceSpecification: IdObject): RouteLocationRaw {
    return {
        name: "interface-specification-versions",
        params: {
            interfaceSpecification: interfaceSpecification.id
        }
    };
}
</script>
