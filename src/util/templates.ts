import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RouteLocationRaw } from "vue-router";

/**
 * The template kinds that have their own list and details pages.
 * The value is the segment used in the route names of those pages.
 */
export const templateKinds = ["issue", "component", "interface-specification", "relation", "artefact"] as const;

export type TemplateKind = (typeof templateKinds)[number];

/**
 * All template details routes share the same parameter, so everything operating on the currently
 * displayed template can be written once instead of once per template kind.
 */
export const templateRouteParam = "template";

/**
 * A details page of a template, shown as an entry in the left sidebar.
 */
export interface TemplatePage {
    /** Appended to `<kind>-template-details-` to get the route name */
    route: string;
    name: string;
    icon: string;
}

export interface TemplateKindInfo {
    /** Singular display name, lowercase, without the "template" suffix */
    name: string;
    /** Short label of the entry in the templates sidebar, where the full name does not fit */
    sidebarName: string;
    /** Plural name of the entities the templates are used for */
    entityName: string;
    /** Icon of the entry in the templates sidebar */
    icon: string;
    /** The details pages, the last group is reserved for the danger zone */
    pages: TemplatePage[];
}

const generalPage: TemplatePage = { route: "general", name: "General", icon: "mdi-home" };
const fieldSpecificationsPage: TemplatePage = {
    route: "field-specifications",
    name: "Field Specs",
    icon: "mdi-form-textbox"
};

export const templateKindInfos: Record<TemplateKind, TemplateKindInfo> = {
    issue: {
        name: "issue",
        sidebarName: "Issue",
        entityName: "issues",
        icon: "$issue",
        pages: [
            generalPage,
            { route: "issue-attributes", name: "Issue Attributes", icon: "mdi-format-list-bulleted-type" },
            { route: "linkage-attributes", name: "Linkage Attributes", icon: "mdi-link-variant" },
            fieldSpecificationsPage
        ]
    },
    component: {
        name: "component",
        sidebarName: "Component",
        entityName: "components",
        icon: "$component",
        pages: [
            generalPage,
            { route: "interface-specifications", name: "Interfaces", icon: "$interface" },
            { route: "dependency-types", name: "Dependency Types", icon: "mdi-arrow-decision" },
            fieldSpecificationsPage,
            { route: "component-version", name: "Versions", icon: "mdi-source-branch" }
        ]
    },
    "interface-specification": {
        name: "interface specification",
        sidebarName: "Interface",
        entityName: "interface specifications",
        icon: "$interface",
        pages: [
            generalPage,
            { route: "components", name: "Components", icon: "$component" },
            fieldSpecificationsPage,
            { route: "interface-specification-version", name: "Versions", icon: "mdi-source-branch" },
            { route: "interface-part", name: "Parts", icon: "mdi-puzzle-outline" }
        ]
    },
    relation: {
        name: "relation",
        sidebarName: "Relation",
        entityName: "relations",
        icon: "mdi-link-variant",
        pages: [
            generalPage,
            { route: "relation-conditions", name: "Conditions", icon: "mdi-arrow-decision" },
            fieldSpecificationsPage
        ]
    },
    artefact: {
        name: "artefact",
        sidebarName: "Artefact",
        entityName: "artefacts",
        icon: "mdi-file-document",
        pages: [generalPage, fieldSpecificationsPage]
    }
};

const templateKindsByTypename: Record<string, TemplateKind> = {
    IssueTemplate: "issue",
    ComponentTemplate: "component",
    InterfaceSpecificationTemplate: "interface-specification",
    RelationTemplate: "relation",
    ArtefactTemplate: "artefact"
};

/**
 * The kind of a template given its GraphQL type name, used where a query returns templates of
 * more than one kind, like the start and end templates of a relation condition.
 */
export function templateKindFromTypename(typename: string): TemplateKind | undefined {
    return templateKindsByTypename[typename];
}

/**
 * The id of the template the current details route is about.
 */
export function useTemplateId() {
    const route = useRoute();
    return computed(() => route.params[templateRouteParam] as string);
}

/**
 * Builds routes to the details pages of the template the current details route is about.
 */
export function useTemplateRoutes() {
    const templateId = useTemplateId();
    function templateRoute(name: string): RouteLocationRaw {
        return { name, params: { [templateRouteParam]: templateId.value } };
    }
    return { templateId, templateRoute };
}

/**
 * Route to the details of a template of the given kind.
 */
export function templateDetailsRoute(kind: TemplateKind, templateId: string): RouteLocationRaw {
    return { name: `${kind}-template`, params: { [templateRouteParam]: templateId } };
}

/**
 * The active/deprecated filter of the template lists.
 * It is kept in the route query so that it survives reloads and navigating back to the list.
 */
export function useShowDeprecated() {
    const route = useRoute();
    const router = useRouter();

    const showDeprecated = computed(() => route.query.deprecated == "true");
    const deprecationIndex = computed({
        get: () => (showDeprecated.value ? 1 : 0),
        set: (value: number) => {
            router.replace({ query: { ...route.query, deprecated: value == 1 ? "true" : undefined } });
        }
    });

    return { showDeprecated, deprecationIndex };
}
