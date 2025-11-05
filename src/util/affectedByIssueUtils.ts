import { DefaultAffectedByIssueInfoFragment } from "@/graphql/generated";
import { ClientReturnType } from "@/graphql/client";

export function affectedByIssueName(entity: DefaultAffectedByIssueInfoFragment): string {
    switch (entity.__typename) {
        case "Component":
            return entity.name;
        case "Project":
            return entity.name;
        case "ComponentVersion":
            return `${entity.component.name} (v${entity.version})`;
        case "InterfaceSpecification":
            return entity.name;
        case "InterfaceSpecificationVersion":
            return `${entity.interfaceSpecification.name} (v${entity.version})`;
        case "Interface": {
            const version = entity.interfaceDefinition.interfaceSpecificationVersion;
            return `${version.interfaceSpecification.name} (v${version.version})`;
        }
        case "InterfacePart":
            return entity.name;
    }
}

export function affectedByIssueDescription(entity: DefaultAffectedByIssueInfoFragment): string {
    switch (entity.__typename) {
        case "Component":
            return entity.description;
        case "Project":
            return entity.description;
        case "ComponentVersion":
            return entity.component.description;
        case "InterfaceSpecification":
            return entity.description;
        case "InterfaceSpecificationVersion":
            return entity.interfaceSpecification.description;
        case "Interface":
            return entity.interfaceDefinition.interfaceSpecificationVersion.interfaceSpecification.description;
        case "InterfacePart":
            return entity.description;
    }
}

export function affectedByIssueIcon(type: DefaultAffectedByIssueInfoFragment["__typename"]): string {
    switch (type) {
        case "Component":
            return "$component";
        case "Project":
            return "$project";
        case "ComponentVersion":
            return "$component-version";
        case "Interface":
            return "$interface";
        case "InterfaceSpecification":
            return "$interface-specification";
        case "InterfaceSpecificationVersion":
            return "$interface-specification-version";
        case "InterfacePart":
            return "$interface-part";
        default:
            throw new Error(`Unknown affectedByIssue type: ${type}`);
    }
}

export function expandSearchResult(
    items: ClientReturnType<"searchAffectedByIssues">["searchAffectedByIssues"]
): DefaultAffectedByIssueInfoFragment[] {
    const lookup = new Map<string, DefaultAffectedByIssueInfoFragment>();
    for (const item of items) {
        lookup.set(item.id, item);
        if (item.__typename == "Component") {
            for (const version of item.versions.nodes) {
                lookup.set(version.id, {
                    ...version,
                    __typename: "ComponentVersion",
                    component: item
                });
            }
        }
        if (item.__typename == "InterfaceSpecification") {
            for (const version of item.versions.nodes) {
                const mappedVersion = {
                    ...version,
                    __typename: "InterfaceSpecificationVersion",
                    interfaceSpecification: item
                } as const;
                lookup.set(version.id, mappedVersion);
                for (const definition of version.interfaceDefinitions.nodes) {
                    if (definition.visibleInterface != undefined) {
                        lookup.set(definition.visibleInterface.id, {
                            id: definition.visibleInterface.id,
                            __typename: "Interface",
                            interfaceDefinition: {
                                interfaceSpecificationVersion: mappedVersion
                            }
                        });
                    }
                }
            }
        }
        if (item.__typename == "InterfaceSpecificationVersion") {
            for (const definition of item.interfaceDefinitions.nodes) {
                if (definition.visibleInterface != undefined) {
                    lookup.set(definition.visibleInterface.id, {
                        id: definition.visibleInterface.id,
                        __typename: "Interface",
                        interfaceDefinition: {
                            interfaceSpecificationVersion: item
                        }
                    });
                }
            }
        }
    }
    return [...lookup.values()];
}
