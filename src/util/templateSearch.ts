import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import type { AutocompleteTemplateInfoFragment } from "@/gql/graphql";
import { transformSearchQuery } from "@/util/searchQueryTransformer";

/**
 * The template types that can be searched.
 * `relationPartner` covers both template types a Relation can start or end at.
 */
export type SearchableTemplateType =
    "issue" | "component" | "interfaceSpecification" | "relation" | "artefact" | "relationPartner";

const searchIssueTemplatesForListQuery = graphql(`
    query searchIssueTemplatesForList($query: String!, $count: Int!) {
        searchIssueTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            ...AutocompleteTemplateInfo
        }
    }
`);

const firstIssueTemplatesForListQuery = graphql(`
    query firstIssueTemplatesForList($count: Int!) {
        issueTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {
            nodes {
                ...AutocompleteTemplateInfo
            }
        }
    }
`);

const searchComponentTemplatesForListQuery = graphql(`
    query searchComponentTemplatesForList($query: String!, $count: Int!) {
        searchComponentTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            ...AutocompleteTemplateInfo
        }
    }
`);

const firstComponentTemplatesForListQuery = graphql(`
    query firstComponentTemplatesForList($count: Int!) {
        componentTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {
            nodes {
                ...AutocompleteTemplateInfo
            }
        }
    }
`);

const searchInterfaceSpecificationTemplatesForListQuery = graphql(`
    query searchInterfaceSpecificationTemplatesForList($query: String!, $count: Int!) {
        searchInterfaceSpecificationTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            ...AutocompleteTemplateInfo
        }
    }
`);

const firstInterfaceSpecificationTemplatesForListQuery = graphql(`
    query firstInterfaceSpecificationTemplatesForList($count: Int!) {
        interfaceSpecificationTemplates(
            first: $count
            orderBy: [{ field: NAME }]
            filter: { isDeprecated: { eq: false } }
        ) {
            nodes {
                ...AutocompleteTemplateInfo
            }
        }
    }
`);

const searchRelationTemplatesForListQuery = graphql(`
    query searchRelationTemplatesForList($query: String!, $count: Int!) {
        searchRelationTemplates(query: $query, first: $count, filter: { isDeprecated: { eq: false } }) {
            ...AutocompleteTemplateInfo
        }
    }
`);

const firstRelationTemplatesForListQuery = graphql(`
    query firstRelationTemplatesForList($count: Int!) {
        relationTemplates(first: $count, orderBy: [{ field: NAME }], filter: { isDeprecated: { eq: false } }) {
            nodes {
                ...AutocompleteTemplateInfo
            }
        }
    }
`);

// ArtefactTemplates have no search query, so they are filtered by name instead
const artefactTemplatesForListQuery = graphql(`
    query artefactTemplatesForList($name: String!, $count: Int!) {
        artefactTemplates(
            first: $count
            orderBy: [{ field: NAME }]
            filter: { isDeprecated: { eq: false }, name: { contains: $name } }
        ) {
            nodes {
                ...AutocompleteTemplateInfo
            }
        }
    }
`);

/**
 * Searches the non-deprecated templates of the given type.
 *
 * @param type the type of the templates to search
 * @param filter the raw user input to search for, an empty filter returns the first templates by name
 * @param count the maximum number of templates to return, per type for `relationPartner`
 */
export async function searchTemplates(
    type: SearchableTemplateType,
    filter: string,
    count: number
): Promise<AutocompleteTemplateInfoFragment[]> {
    if (type == "relationPartner") {
        const [components, interfaceSpecifications] = await Promise.all([
            searchTemplates("component", filter, count),
            searchTemplates("interfaceSpecification", filter, count)
        ]);
        return [...components, ...interfaceSpecifications];
    }
    const query = transformSearchQuery(filter);
    switch (type) {
        case "issue":
            return query != undefined
                ? (await requestThrow(searchIssueTemplatesForListQuery, { query, count })).searchIssueTemplates
                : (await requestThrow(firstIssueTemplatesForListQuery, { count })).issueTemplates.nodes;
        case "component":
            return query != undefined
                ? (await requestThrow(searchComponentTemplatesForListQuery, { query, count })).searchComponentTemplates
                : (await requestThrow(firstComponentTemplatesForListQuery, { count })).componentTemplates.nodes;
        case "interfaceSpecification":
            return query != undefined
                ? (await requestThrow(searchInterfaceSpecificationTemplatesForListQuery, { query, count }))
                      .searchInterfaceSpecificationTemplates
                : (await requestThrow(firstInterfaceSpecificationTemplatesForListQuery, { count }))
                      .interfaceSpecificationTemplates.nodes;
        case "relation":
            return query != undefined
                ? (await requestThrow(searchRelationTemplatesForListQuery, { query, count })).searchRelationTemplates
                : (await requestThrow(firstRelationTemplatesForListQuery, { count })).relationTemplates.nodes;
        case "artefact":
            return (await requestThrow(artefactTemplatesForListQuery, { name: filter, count })).artefactTemplates.nodes;
    }
}
