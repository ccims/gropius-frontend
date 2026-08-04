<template>
    <PaginatedList
        name="versions"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="
            (interfaceSpecificationVersion: InterfaceSpecificationVersion) =>
                interfaceSpecificationVersionRoute(interfaceSpecificationVersion)
        "
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="`v${item.version}`"
                :subtitle="item.tags.length == 0 ? 'No tags provided' : undefined"
                italic-subtitle
            >
                <template #subtitle v-if="item.tags.length > 0">
                    <div class="d-flex flex-wrap chip-container mt-1">
                        <v-chip
                            v-for="(tag, index) in item.tags"
                            :key="index"
                            color="primary"
                            size="small"
                            class="flex-shrink-0"
                        >
                            {{ tag }}
                        </v-chip>
                    </div>
                </template>
            </ListItem>
        </template>
        <CreateInterfaceSpecificationVersionDialog
            :interfaceSpecification="interfaceSpecificationId"
            @created-interface-specification-version="
                (interfaceSpecificationVersion: IdObject) =>
                    selectInterfaceSpecificationVersion(interfaceSpecificationVersion)
            "
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { request, queryNode } from "@/gql/client";
import { graphql } from "@/gql";
import {
    type InterfaceSpecificationVersionOrder,
    type InterfaceSpecificationVersionOrderField,
    type InterfaceSpecificationVersionListItemInfoFragment
} from "@/gql/graphql";
import { type RouteLocationRaw, useRoute, useRouter } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import { computed } from "vue";
import CreateInterfaceSpecificationVersionDialog from "@/components/dialog/CreateInterfaceSpecificationVersionDialog.vue";
import type { IdObject } from "@/util/types";
import { ItemManager } from "@/util/itemManager";

type InterfaceSpecificationVersion = InterfaceSpecificationVersionListItemInfoFragment;

const getInterfaceSpecificationVersionListQuery = graphql(`
    query getInterfaceSpecificationVersionList(
        $orderBy: [InterfaceSpecificationVersionOrder!]!
        $count: Int!
        $skip: Int!
        $interfaceSpecification: ID!
    ) {
        node(id: $interfaceSpecification) {
            ... on InterfaceSpecification {
                versions(orderBy: $orderBy, first: $count, skip: $skip) {
                    nodes {
                        ...InterfaceSpecificationVersionListItemInfo
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredInterfaceSpecificationVersionListQuery = graphql(`
    query getFilteredInterfaceSpecificationVersionList($query: String!, $count: Int!, $interfaceSpecification: ID!) {
        searchInterfaceSpecificationVersions(
            query: $query
            first: $count
            filter: { interfaceSpecification: { id: { eq: $interfaceSpecification } } }
        ) {
            ...InterfaceSpecificationVersionListItemInfo
        }
    }
`);

const router = useRouter();
const route = useRoute();
const interfaceSpecificationId = computed(() => route.params.interfaceSpecification as string);

const sortFields: Record<string, InterfaceSpecificationVersionOrderField | InterfaceSpecificationVersionOrderField[]> =
    {
        Version: "VERSION",
        "[Default]": "ID"
    };

class InterfaceSpecificationItemManager extends ItemManager<
    InterfaceSpecificationVersion,
    InterfaceSpecificationVersionOrderField
> {
    protected async fetchItems(
        filter: string | undefined,
        orderBy: InterfaceSpecificationVersionOrder[],
        count: number,
        page: number
    ): Promise<[InterfaceSpecificationVersion[], number]> {
        if (filter == undefined) {
            const interfaceSpecification = await queryNode(
                getInterfaceSpecificationVersionListQuery,
                "InterfaceSpecification",
                {
                    orderBy,
                    count,
                    skip: page * count,
                    interfaceSpecification: interfaceSpecificationId.value
                }
            );
            if (interfaceSpecification) {
                return [interfaceSpecification.versions.nodes, interfaceSpecification.versions.totalCount];
            }
        } else {
            const res = await request(getFilteredInterfaceSpecificationVersionListQuery, {
                query: filter,
                count,
                interfaceSpecification: interfaceSpecificationId.value
            });
            if (res) {
                return [res.searchInterfaceSpecificationVersions, res.searchInterfaceSpecificationVersions.length];
            }
        }
        return [[], 0];
    }
}
const itemManager = new InterfaceSpecificationItemManager() as ItemManager<
    InterfaceSpecificationVersion,
    InterfaceSpecificationVersionOrderField
>;

function selectInterfaceSpecificationVersion(interfaceSpecificationVersion: IdObject) {
    router.push(interfaceSpecificationVersionRoute(interfaceSpecificationVersion));
}

function interfaceSpecificationVersionRoute(interfaceSpecificationVersion: IdObject): RouteLocationRaw {
    return {
        name: "interface-specification-version-general",
        params: {
            interfaceSpecificationVersion: interfaceSpecificationVersion.id
        }
    };
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
