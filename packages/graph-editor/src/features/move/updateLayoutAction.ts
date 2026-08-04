import type { Action } from "sprotty-protocol";
import type { GraphLayout } from "../../gropiusModel.js";

export interface UpdateLayoutAction extends Action {
    kind: typeof UpdateLayoutAction.KIND;
    partialLayout: GraphLayout;
}

export namespace UpdateLayoutAction {
    export const KIND = "updatelayout";

    export function is(action: Action): action is UpdateLayoutAction {
        return action.kind === KIND;
    }
}
