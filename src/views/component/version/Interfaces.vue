<template>
    <PaginatedList
        name="interface definitions"
        :item-manager="itemManager"
        :sort-fields="sortFields"
        :to="() => undefined"
        :dependencies="dependencyArray"
        query-param-prefix=""
    >
        <template #item="{ item }">
            <ListItem
                :title="`${item.name} (v${item.version})`"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #append>
                    <v-chip
                        v-if="item.visibleSelfDefined || item.visibleDerivedBy.totalCount > 0"
                        color="primary"
                        size="small"
                        class="flex-shrink-0 mr-5"
                        >Visible</v-chip
                    >
                    <v-chip
                        v-if="item.invisibleSelfDefined || item.invisibleDerivedBy.totalCount > 0"
                        color="primary"
                        size="small"
                        class="flex-shrink-0 mr-5"
                        >Invisible</v-chip
                    >
                    <v-chip
                        v-if="item.visibleDerivedBy.totalCount > 0"
                        color="primary"
                        size="small"
                        class="flex-shrink-0 mr-5"
                        >Visibly derived</v-chip
                    >
                    <v-chip
                        v-if="item.invisibleDerivedBy.totalCount > 0"
                        color="primary"
                        size="small"
                        class="flex-shrink-0 mr-5"
                        >Invisibly derived</v-chip
                    >
                    <IconButton
                        :disabled="!(trackable?.admin ?? false)"
                        @click="interfaceDefinitionToUpdate = item"
                        class="mr-2"
                    >
                        <v-icon icon="mdi-pencil" />
                        <v-tooltip activator="parent" location="bottom">Edit label</v-tooltip>
                    </IconButton>
                    <IconButton
                        :disabled="
                            !(trackable?.admin ?? false) ||
                            item.visibleDerivedBy.totalCount > 0 ||
                            item.invisibleDerivedBy.totalCount > 0
                        "
                    >
                        <v-icon icon="mdi-delete" />
                        <ConfirmationDialog
                            :title="`Delete interface definition?`"
                            message="
                                Are you sure you want to delete the interface definition?
                                This will delete all adjacent relations, and potentially stop interfaces from propagating to other components.
                            "
                            confirm-text="Delete"
                            @confirm="
                                deleteInterfaceDefinition(
                                    item.interfaceSpecificationVersion,
                                    item.visibleSelfDefined,
                                    item.invisibleSelfDefined
                                )
                            "
                        />
                        <v-tooltip activator="parent" location="bottom">Delete interface definition</v-tooltip>
                    </IconButton>
                </template>
            </ListItem>
        </template>
        <template #additional-filter>
            <div class="d-flex ga-2 align-center h-100">
                <FilterDropdown
                    v-model="templateIds"
                    :item-manager="itemManager"
                    :mapper="(item) => item.template"
                    label="Template"
                    :fetch-on-search="templateFetch"
                />
                <FilterDropdown
                    v-model="interfaceSpecificationIds"
                    :item-manager="itemManager"
                    :mapper="(item) => item.interfaceSpecificationData"
                    label="Interface Specification"
                    :fetch-on-search="interfaceSpecificationFetch"
                />
            </div>
        </template>
        <AddInterfaceSpecificationVersionToComponentVersionDialog
            :component="componentId"
            :component-version="componentVersionId"
            :component-template="componentTemplateInfo?.template?.id"
            @added-interface-specification-version-to-component-version="modifiedIds.push($event.id)"
        />
        <EditInterfaceDefinitionDialog
            :update-interface-definition="updateInterfaceDefinition"
            :component-template="componentTemplateInfo?.template?.id"
            v-model="interfaceDefinitionToUpdate"
        />
    </PaginatedList>
</template>
<script lang="ts" setup>
import PaginatedList from "@/components/PaginatedList.vue";
import { queryNode, queryNodeThrow, request, requestThrow } from "@/gql/client";
import { graphql } from "@/gql";
import {
    DefaultInterfaceDefinitionInfoFragment,
    InterfaceDefinitionFilterInput,
    InterfaceDefinitionOrder,
    InterfaceDefinitionOrderField,
    InterfaceSpecificationFilterInput,
    InterfaceSpecificationVersionFilterInput
} from "@/gql/graphql";
import { useRoute } from "vue-router";
import ListItem from "@/components/ListItem.vue";
import { computed, inject, ref } from "vue";
import AddInterfaceSpecificationVersionToComponentVersionDialog from "@/components/dialog/AddInterfaceSpecificationVersionToComponentVersionDialog.vue";
import { computedAsync } from "@vueuse/core";
import { withErrorMessage } from "@/util/withErrorMessage";
import { trackableKey } from "@/util/keys";
import ConfirmationDialog from "@/components/dialog/ConfirmationDialog.vue";
import EditInterfaceDefinitionDialog from "@/components/dialog/EditInterfaceDefinitionDialog.vue";
import { ItemManager } from "@/util/itemManager";
import { useFilterOption } from "@/util/useFilterOption";
import FilterDropdown from "@/components/input/FilterDropdown.vue";

type InterfaceDefinition = DefaultInterfaceDefinitionInfoFragment & {
    name: string;
    version: string;
    interfaceSpecification: string;
    interfaceSpecificationVersion: string;
    description?: string;
    interfaceSpecificationData: { id: string; name: string; description: string };
    template: { id: string; name: string; description: string };
};

const getComponentTemplateDetailsQuery = graphql(`
    query getComponentTemplateDetails($id: ID!) {
        node(id: $id) {
            id
            ... on Component {
                template {
                    id
                }
            }
        }
    }
`);

const getInterfaceDefinitionListQuery = graphql(`
    query getInterfaceDefinitionList(
        $orderBy: [InterfaceDefinitionOrder!]!
        $count: Int!
        $skip: Int!
        $componentVersion: ID!
        $filter: InterfaceDefinitionFilterInput!
    ) {
        node(id: $componentVersion) {
            ... on ComponentVersion {
                interfaceDefinitions(orderBy: $orderBy, first: $count, skip: $skip, filter: $filter) {
                    nodes {
                        ...DefaultInterfaceDefinitionInfo
                        interfaceSpecificationVersion {
                            id
                            version
                            interfaceSpecification {
                                id
                                name
                                description
                                template {
                                    id
                                    name
                                    description
                                }
                            }
                        }
                    }
                    totalCount
                }
            }
        }
    }
`);

const getFilteredInterfaceDefinitionListQuery = graphql(`
    query getFilteredInterfaceDefinitionList(
        $query: String!
        $count: Int!
        $specificationFilter: InterfaceSpecificationFilterInput!
        $versionFilter: InterfaceSpecificationVersionFilterInput!
        $definitionFilter: InterfaceDefinitionFilterInput!
    ) {
        searchInterfaceSpecifications(query: $query, first: $count, filter: $specificationFilter) {
            id
            name
            description
            template {
                id
                name
                description
            }
            versions(filter: $versionFilter, first: $count) {
                nodes {
                    id
                    version
                    interfaceDefinitions(filter: $definitionFilter) {
                        nodes {
                            ...DefaultInterfaceDefinitionInfo
                        }
                    }
                }
            }
        }
    }
`);

const searchInterfaceSpecificationsQuery = graphql(`
    query searchInterfaceSpecificationsForVersionInterfaces($query: String!, $count: Int!, $component: ID!) {
        searchInterfaceSpecifications(query: $query, first: $count, filter: { component: { id: { eq: $component } } }) {
            id
            name
            description
        }
    }
`);

const searchInterfaceSpecificationTemplatesQuery = graphql(`
    query searchInterfaceSpecificationTemplatesForVersionInterfaces($query: String!, $count: Int!) {
        searchInterfaceSpecificationTemplates(query: $query, first: $count) {
            id
            name
            description
        }
    }
`);

const removeInterfaceSpecificationVersionFromComponentVersionMutation = graphql(`
    mutation removeInterfaceSpecificationVersionFromComponentVersion(
        $input: RemoveInterfaceSpecificationVersionFromComponentVersionInput!
    ) {
        removeInterfaceSpecificationVersionFromComponentVersion(input: $input) {
            __typename
        }
    }
`);

const addInterfaceSpecificationVersionToComponentVersionMutation = graphql(`
    mutation addInterfaceSpecificationVersionToComponentVersion(
        $input: AddInterfaceSpecificationVersionToComponentVersionInput!
    ) {
        addInterfaceSpecificationVersionToComponentVersion(input: $input) {
            __typename
        }
    }
`);

const route = useRoute();
const componentVersionId = computed(() => route.params.version as string);
const componentId = computed(() => route.params.trackable as string);
const trackable = inject(trackableKey);
const modifiedIds = ref<string[]>([]);
const interfaceDefinitionToUpdate = ref<InterfaceDefinition | undefined>();

const sortFields = {
    Version: InterfaceDefinitionOrderField.InterfaceSpecificationVersionVersion,
    "[Default]": InterfaceDefinitionOrderField.Id
};

const interfaceSpecificationIds = useFilterOption("interfacespecification", true);
const interfaceSpecificationInput = computed(() => {
    if (interfaceSpecificationIds.value.length === 0) {
        return undefined;
    }
    return {
        in: interfaceSpecificationIds.value
    };
});
const interfaceSpecificationFetch = async (search: string) => {
    const res = await requestThrow(searchInterfaceSpecificationsQuery, {
        query: search,
        count: 100,
        component: componentId.value
    });
    return res.searchInterfaceSpecifications.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description
    }));
};
const templateIds = useFilterOption("template", true);
const templateInput = computed(() => {
    if (templateIds.value.length === 0) {
        return undefined;
    }
    return {
        id: { in: templateIds.value }
    };
});
const templateFetch = async (search: string) => {
    const res = await requestThrow(searchInterfaceSpecificationTemplatesQuery, {
        query: search,
        count: 100
    });
    return res.searchInterfaceSpecificationTemplates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description
    }));
};

const dependencyArray = computed(() => [modifiedIds, templateInput, interfaceSpecificationInput]);

class InterfaceDefinitionItemManager extends ItemManager<InterfaceDefinition, InterfaceDefinitionOrderField> {
    protected async fetchItems(
        filter: string,
        orderBy: InterfaceDefinitionOrder[],
        count: number,
        page: number
    ): Promise<[InterfaceDefinition[], number]> {
        if (filter == undefined) {
            const componentVersion = await queryNode(getInterfaceDefinitionListQuery, "ComponentVersion", {
                orderBy,
                count,
                skip: page * count,
                componentVersion: componentVersionId.value,
                filter: {
                    interfaceSpecificationVersion: {
                        interfaceSpecification: {
                            id: interfaceSpecificationInput.value,
                            template: templateInput.value
                        }
                    }
                }
            });
            if (componentVersion) {
                return [
                    componentVersion.interfaceDefinitions.nodes.map((definition) => ({
                        ...definition,
                        name: definition.interfaceSpecificationVersion.interfaceSpecification.name,
                        description: definition.interfaceSpecificationVersion.interfaceSpecification.description,
                        version: definition.interfaceSpecificationVersion.version,
                        interfaceSpecificationVersion: definition.interfaceSpecificationVersion.id,
                        interfaceSpecification: definition.interfaceSpecificationVersion.interfaceSpecification.id,
                        interfaceSpecificationData: definition.interfaceSpecificationVersion.interfaceSpecification,
                        template: definition.interfaceSpecificationVersion.interfaceSpecification.template
                    })),
                    componentVersion.interfaceDefinitions.totalCount
                ];
            }
        } else {
            const definitionFilter: InterfaceDefinitionFilterInput = {
                componentVersion: { id: { eq: componentVersionId.value } }
            };
            const versionFilter: InterfaceSpecificationVersionFilterInput = {
                interfaceDefinitions: { any: definitionFilter }
            };
            const specificationFilter: InterfaceSpecificationFilterInput = {
                versions: { any: versionFilter },
                template: templateInput.value,
                id: interfaceSpecificationInput.value
            };
            const res = await request(getFilteredInterfaceDefinitionListQuery, {
                query: filter,
                count,
                specificationFilter,
                versionFilter,
                definitionFilter
            });
            if (res) {
                const definitions: InterfaceDefinition[] = [];
                for (const interfaceSpecification of res.searchInterfaceSpecifications) {
                    for (const version of interfaceSpecification.versions.nodes) {
                        for (const definition of version.interfaceDefinitions.nodes) {
                            definitions.push({
                                ...definition,
                                name: interfaceSpecification.name,
                                description: interfaceSpecification.description,
                                version: version.version,
                                interfaceSpecificationVersion: version.id,
                                interfaceSpecification: interfaceSpecification.id,
                                interfaceSpecificationData: interfaceSpecification,
                                template: interfaceSpecification.template
                            });
                        }
                    }
                }
                return [definitions, res.searchInterfaceSpecifications.length];
            }
        }
        return [[], 0];
    }
}
const itemManager = new InterfaceDefinitionItemManager() as ItemManager<
    InterfaceDefinition,
    InterfaceDefinitionOrderField
>;

const componentTemplateInfo = computedAsync(
    async () => {
        return await withErrorMessage(async () => {
            return queryNodeThrow(getComponentTemplateDetailsQuery, "Component", { id: componentId.value });
        }, "Error loading component template info");
    },
    null,
    { shallow: false }
);

async function deleteInterfaceDefinition(
    interfaceSpecificationVersionId: string,
    visible: boolean,
    invisible: boolean
) {
    await withErrorMessage(async () => {
        await requestThrow(removeInterfaceSpecificationVersionFromComponentVersionMutation, {
            input: {
                interfaceSpecificationVersion: interfaceSpecificationVersionId,
                componentVersion: componentVersionId.value,
                visible,
                invisible
            }
        });
    }, "Error deleting interface definition");
    modifiedIds.value.push(interfaceSpecificationVersionId);
}

async function updateInterfaceDefinition(id: string, visible: boolean, value: boolean) {
    await withErrorMessage(async () => {
        const wrappedValue = {
            visible: visible,
            invisible: !visible,
            componentVersion: componentVersionId.value,
            interfaceSpecificationVersion: id
        };
        if (value) {
            await requestThrow(addInterfaceSpecificationVersionToComponentVersionMutation, {
                input: wrappedValue
            });
        } else {
            await requestThrow(removeInterfaceSpecificationVersionFromComponentVersionMutation, {
                input: wrappedValue
            });
        }
    }, "Error updating interface definition visibility");
    modifiedIds.value.push(id);
}
</script>
