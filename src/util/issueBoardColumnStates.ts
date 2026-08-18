import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";

const addIssueStateToBoardColumnMutation = graphql(`
    mutation addIssueStateToBoardColumn($column: ID!, $state: ID!) {
        addIssueStateToBoardColumn(input: { column: $column, state: $state }) {
            id
        }
    }
`);

const removeIssueStateFromBoardColumnMutation = graphql(`
    mutation removeIssueStateFromBoardColumn($column: ID!, $state: ID!) {
        removeIssueStateFromBoardColumn(input: { column: $column, state: $state }) {
            id
        }
    }
`);

/**
 * Assigns the provided issue states to an issue board column.
 *
 * @param column the id of the issue board column
 * @param states the ids of the issue states to assign
 */
export async function addIssueStatesToColumn(column: string, states: string[]): Promise<void> {
    for (const state of states) {
        await requestThrow(addIssueStateToBoardColumnMutation, { column, state });
    }
}

/**
 * Removes the provided issue states from an issue board column.
 *
 * @param column the id of the issue board column
 * @param states the ids of the issue states to remove
 */
export async function removeIssueStatesFromColumn(column: string, states: string[]): Promise<void> {
    for (const state of states) {
        await requestThrow(removeIssueStateFromBoardColumnMutation, { column, state });
    }
}
