import type {
    DefaultIssueTemplateInfoFragment,
    DefaultLabelInfoFragment,
    DefaultIssuePriorityInfoFragment,
    DefaultIssueTypeInfoFragment,
    DefaultIssueStateInfoFragment,
    DefaultUserInfoFragment,
    DefaultAffectedByIssueInfoFragment
} from "@/gql/graphql";

/** Complete options for the selected source trackables, independent of the issue page. */
export interface IssueFilterOptions {
    templates: DefaultIssueTemplateInfoFragment[];
    labels: (DefaultLabelInfoFragment & {
        trackables: { nodes: { id: string; name: string; description: string }[] };
    })[];
    priorities: DefaultIssuePriorityInfoFragment[];
    types: DefaultIssueTypeInfoFragment[];
    states: DefaultIssueStateInfoFragment[];
    users: DefaultUserInfoFragment[];
    affected: DefaultAffectedByIssueInfoFragment[];
}
export function emptyIssueFilterOptions(): IssueFilterOptions {
    return { templates: [], labels: [], priorities: [], types: [], states: [], users: [], affected: [] };
}
