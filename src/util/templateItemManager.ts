import { graphql } from "@/gql";
import { request } from "@/gql/client";
import type { OrderDirection, TemplateListInfoFragment } from "@/gql/graphql";
import { ItemManager } from "@/util/itemManager";
import type { TemplateKind } from "@/util/templates";
import type { Ref } from "vue";

/** Every template type can be ordered by exactly these fields */
export type TemplateOrderField = "NAME" | "ID";

type TemplateOrder = { field: TemplateOrderField; direction: OrderDirection };

const getIssueTemplateListQuery = graphql(`
    query getIssueTemplateList($orderBy: [IssueTemplateOrder!]!, $count: Int!, $skip: Int!, $isDeprecated: Boolean!) {
        issueTemplates(orderBy: $orderBy, first: $count, skip: $skip, filter: { isDeprecated: { eq: $isDeprecated } }) {
            nodes {
                ...TemplateListInfo
            }
            totalCount
        }
    }
`);

const getFilteredIssueTemplateListQuery = graphql(`
    query getFilteredIssueTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {
        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {
            ...TemplateListInfo
        }
    }
`);

const getComponentTemplateListQuery = graphql(`
    query getComponentTemplateList(
        $orderBy: [ComponentTemplateOrder!]!
        $count: Int!
        $skip: Int!
        $isDeprecated: Boolean!
    ) {
        componentTemplates(
            orderBy: $orderBy
            first: $count
            skip: $skip
            filter: { isDeprecated: { eq: $isDeprecated } }
        ) {
            nodes {
                ...TemplateListInfo
            }
            totalCount
        }
    }
`);

const getFilteredComponentTemplateListQuery = graphql(`
    query getFilteredComponentTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {
        searchComponentTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {
            ...TemplateListInfo
        }
    }
`);

const getInterfaceSpecificationTemplateListQuery = graphql(`
    query getInterfaceSpecificationTemplateList(
        $orderBy: [InterfaceSpecificationTemplateOrder!]!
        $count: Int!
        $skip: Int!
        $isDeprecated: Boolean!
    ) {
        interfaceSpecificationTemplates(
            orderBy: $orderBy
            first: $count
            skip: $skip
            filter: { isDeprecated: { eq: $isDeprecated } }
        ) {
            nodes {
                ...TemplateListInfo
            }
            totalCount
        }
    }
`);

const getFilteredInterfaceSpecificationTemplateListQuery = graphql(`
    query getFilteredInterfaceSpecificationTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {
        searchInterfaceSpecificationTemplates(
            query: $query
            first: $count
            filter: { isDeprecated: { eq: $isDeprecated } }
        ) {
            ...TemplateListInfo
        }
    }
`);

const getRelationTemplateListQuery = graphql(`
    query getRelationTemplateList(
        $orderBy: [RelationTemplateOrder!]!
        $count: Int!
        $skip: Int!
        $isDeprecated: Boolean!
    ) {
        relationTemplates(
            orderBy: $orderBy
            first: $count
            skip: $skip
            filter: { isDeprecated: { eq: $isDeprecated } }
        ) {
            nodes {
                ...TemplateListInfo
            }
            totalCount
        }
    }
`);

const getFilteredRelationTemplateListQuery = graphql(`
    query getFilteredRelationTemplateList($query: String!, $count: Int!, $isDeprecated: Boolean!) {
        searchRelationTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: $isDeprecated } }) {
            ...TemplateListInfo
        }
    }
`);

const getArtefactTemplateListQuery = graphql(`
    query getArtefactTemplateList(
        $orderBy: [ArtefactTemplateOrder!]!
        $count: Int!
        $skip: Int!
        $isDeprecated: Boolean!
        $name: String!
    ) {
        artefactTemplates(
            orderBy: $orderBy
            first: $count
            skip: $skip
            filter: { isDeprecated: { eq: $isDeprecated }, name: { contains: $name } }
        ) {
            nodes {
                ...TemplateListInfo
            }
            totalCount
        }
    }
`);

/**
 * ArtefactTemplates have no search query, so the transformed search query has to be turned back
 * into something the `contains` name filter can use.
 */
function searchQueryToName(query: string): string {
    return query.replace(/\*$/, "").replace(/\\(.)/g, "$1").replace(/"/g, "");
}

class TemplateItemManager extends ItemManager<TemplateListInfoFragment, TemplateOrderField> {
    constructor(
        private readonly kind: TemplateKind,
        private readonly showDeprecated: Ref<boolean>
    ) {
        super();
    }

    protected async fetchItems(
        filter: string | undefined,
        orderBy: TemplateOrder[],
        count: number,
        page: number
    ): Promise<[TemplateListInfoFragment[], number]> {
        const isDeprecated = this.showDeprecated.value;
        const skip = page * count;
        switch (this.kind) {
            case "issue": {
                if (filter != undefined) {
                    const res = await request(getFilteredIssueTemplateListQuery, {
                        query: filter,
                        count,
                        isDeprecated
                    });
                    return res ? [res.searchIssueTemplates, res.searchIssueTemplates.length] : [[], 0];
                }
                const res = await request(getIssueTemplateListQuery, { orderBy, count, skip, isDeprecated });
                return res ? [res.issueTemplates.nodes, res.issueTemplates.totalCount] : [[], 0];
            }
            case "component": {
                if (filter != undefined) {
                    const res = await request(getFilteredComponentTemplateListQuery, {
                        query: filter,
                        count,
                        isDeprecated
                    });
                    return res ? [res.searchComponentTemplates, res.searchComponentTemplates.length] : [[], 0];
                }
                const res = await request(getComponentTemplateListQuery, { orderBy, count, skip, isDeprecated });
                return res ? [res.componentTemplates.nodes, res.componentTemplates.totalCount] : [[], 0];
            }
            case "interface-specification": {
                if (filter != undefined) {
                    const res = await request(getFilteredInterfaceSpecificationTemplateListQuery, {
                        query: filter,
                        count,
                        isDeprecated
                    });
                    return res
                        ? [res.searchInterfaceSpecificationTemplates, res.searchInterfaceSpecificationTemplates.length]
                        : [[], 0];
                }
                const res = await request(getInterfaceSpecificationTemplateListQuery, {
                    orderBy,
                    count,
                    skip,
                    isDeprecated
                });
                return res
                    ? [res.interfaceSpecificationTemplates.nodes, res.interfaceSpecificationTemplates.totalCount]
                    : [[], 0];
            }
            case "relation": {
                if (filter != undefined) {
                    const res = await request(getFilteredRelationTemplateListQuery, {
                        query: filter,
                        count,
                        isDeprecated
                    });
                    return res ? [res.searchRelationTemplates, res.searchRelationTemplates.length] : [[], 0];
                }
                const res = await request(getRelationTemplateListQuery, { orderBy, count, skip, isDeprecated });
                return res ? [res.relationTemplates.nodes, res.relationTemplates.totalCount] : [[], 0];
            }
            case "artefact": {
                const res = await request(getArtefactTemplateListQuery, {
                    orderBy,
                    count,
                    skip,
                    isDeprecated,
                    name: filter != undefined ? searchQueryToName(filter) : ""
                });
                return res ? [res.artefactTemplates.nodes, res.artefactTemplates.totalCount] : [[], 0];
            }
        }
    }
}

export function createTemplateItemManager(
    kind: TemplateKind,
    showDeprecated: Ref<boolean>
): ItemManager<TemplateListInfoFragment, TemplateOrderField> {
    return new TemplateItemManager(kind, showDeprecated);
}
