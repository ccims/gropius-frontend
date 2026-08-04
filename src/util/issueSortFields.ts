import type { IssueOrderField } from "@/gql/graphql";

export const issueSortFields: Record<string, IssueOrderField | IssueOrderField[]> = {
    Updated: "LAST_UPDATED_AT",
    Created: "CREATED_AT",
    Title: "TITLE",
    Priority: ["PRIORITY_VALUE", "PRIORITY_ID"],
    State: ["STATE_IS_OPEN", "STATE_NAME", "STATE_ID"],
    Type: ["TYPE_NAME", "TYPE_ID"],
    Template: ["TEMPLATE_NAME", "TEMPLATE_ID"]
};
