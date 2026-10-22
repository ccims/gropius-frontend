import type { IssueFilterInput, IssueOrder, IssueOrderField } from "@/gql/graphql";

export interface ProjectIssueComponent {
    id: string;
    name: string;
    versions: { id: string; version: string }[];
}

export type ProjectIssueScope = "all" | "project" | "components" | "custom";

export function directProjectIssues(project: string): IssueFilterInput {
    return { trackables: { any: { id: { eq: project } } } };
}

export function projectIssueScopeFilter(
    project: string,
    scope: ProjectIssueScope,
    includeProject: boolean,
    componentIds: string[],
    versionIds: string[],
    components: ProjectIssueComponent[]
): IssueFilterInput {
    const branches: IssueFilterInput[] = [];
    if (scope === "all" || scope === "project" || (scope === "custom" && includeProject)) {
        branches.push(directProjectIssues(project));
    }
    const componentMembership = (ids?: string[]): IssueFilterInput => ({
        trackables: {
            any: {
                isComponentAnd: {
                    ...(ids ? { id: { in: ids } } : {}),
                    versions: { any: { partOfProject: project } }
                }
            }
        }
    });
    if (scope === "all" || scope === "components") branches.push(componentMembership());
    if (scope === "custom") {
        for (const component of components.filter((item) => componentIds.includes(item.id))) {
            const selected = component.versions
                .filter((version) => versionIds.includes(version.id))
                .map((version) => version.id);
            const membership = componentMembership([component.id]);
            branches.push(
                selected.length
                    ? {
                          and: [
                              membership,
                              {
                                  aggregatedBy: {
                                      any: {
                                          relationPartner: {
                                              isComponentVersionAnd: { id: { in: selected }, partOfProject: project }
                                          }
                                      }
                                  }
                              }
                          ]
                      }
                    : membership
            );
        }
    }
    // Never depend on an empty OR's interpretation or broaden a stale selection.
    return branches.length ? { or: branches } : { id: { in: [] } };
}

type SortableIssue = {
    id: string;
    title: string;
    createdAt: string;
    lastUpdatedAt: string;
    priority?: { id: string; name: string; value: number } | null;
    state: { id: string; name: string; isOpen: boolean };
    type: { id: string; name: string };
    template: { id: string; name: string };
};

// Neo4j compares Unicode code points, not the browser's locale/collation.
function compareValue(a: unknown, b: unknown): number {
    if (a === b) return 0;
    if (a == null) return b == null ? 0 : 1; // Neo4j ASC puts null last.
    if (b == null) return -1;
    if (typeof a === "string" && typeof b === "string") {
        const left = Array.from(a, (char) => char.codePointAt(0)!);
        const right = Array.from(b, (char) => char.codePointAt(0)!);
        for (let i = 0; i < Math.min(left.length, right.length); i++) {
            if (left[i] !== right[i]) return left[i] < right[i] ? -1 : 1;
        }
        return Math.sign(left.length - right.length);
    }
    return a < b ? -1 : 1;
}

function timestampKey(value: string): [number, string] {
    return [Math.floor(Date.parse(value) / 1000), (value.match(/\.(\d+)/)?.[1] ?? "").padEnd(9, "0")];
}

export function compareProjectIssues(a: SortableIssue, b: SortableIssue, order: IssueOrder[]): number {
    const values = (issue: SortableIssue): Partial<Record<IssueOrderField, unknown>> => ({
        ID: issue.id,
        TITLE: issue.title,
        CREATED_AT: issue.createdAt,
        LAST_UPDATED_AT: issue.lastUpdatedAt,
        PRIORITY_VALUE: issue.priority?.value,
        PRIORITY_ID: issue.priority?.id,
        PRIORITY_NAME: issue.priority?.name,
        STATE_IS_OPEN: issue.state.isOpen,
        STATE_NAME: issue.state.name,
        STATE_ID: issue.state.id,
        TYPE_NAME: issue.type.name,
        TYPE_ID: issue.type.id,
        TEMPLATE_NAME: issue.template.name,
        TEMPLATE_ID: issue.template.id
    });
    const left = values(a),
        right = values(b);
    for (const part of order) {
        const field = part.field ?? "ID";
        let result: number;
        if (field === "CREATED_AT" || field === "LAST_UPDATED_AT") {
            const l = timestampKey(left[field] as string),
                r = timestampKey(right[field] as string);
            result = compareValue(l[0], r[0]) || compareValue(l[1], r[1]);
        } else {
            result = compareValue(left[field], right[field]);
        }
        if (result) return part.direction === "DESC" ? -result : result;
    }
    return 0;
}
