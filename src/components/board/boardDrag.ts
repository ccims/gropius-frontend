import type { IssueBoardItemInfoFragment } from "@/gql/graphql";

/**
 * What is currently dragged on an Issue Board.
 * Cards and columns are both dragged with the HTML drag and drop API, the kind determines
 * which drop targets accept the drag.
 */
export type BoardDragState =
    | { kind: "card"; item: IssueBoardItemInfoFragment; columnId: string | undefined }
    | { kind: "column"; columnId: string };
