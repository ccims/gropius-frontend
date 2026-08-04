import { type Component, type SetupContext, h } from "vue";
import Comment from "./Comment.vue";
import AddedLabelEvent from "./AddedLabelEvent.vue";
import RemovedLabelEvent from "./RemovedLabelEvent.vue";
import TitleChangedEvent from "./TitleChangedEvent.vue";
import TypeChangedEvent from "./TypeChangedEvent.vue";
import StateChangedEvent from "./StateChangedEvent.vue";
import IssueRelation from "./IssueRelation.vue";
import RelatedByIssueEvent from "./RelatedByIssueEvent.vue";
import OutgoingRelationTypeChangedEvent from "./OutgoingRelationTypeChangedEvent.vue";
import IncomingRelationTypeChangedEvent from "./IncomingRelationTypeChangedEvent.vue";
import RemovedOutgoingRelationEvent from "./RemovedOutgoingRelationEvent.vue";
import RemovedIncomingRelationEvent from "./RemovedIncomingRelationEvent.vue";
import Assignment from "./Assignment.vue";
import AssignmentTypeChangedEvent from "./AssignmentTypeChangedEvent.vue";
import RemovedAssignmentEvent from "./RemovedAssignmentEvent.vue";
import PriorityChangedEvent from "./PriorityChangedEvent.vue";
import AddedToTrackableEvent from "./AddedToTrackableEvent.vue";
import RemovedFromTrackableEvent from "./RemovedFromTrackableEvent.vue";
import AddedAffectedEntityEvent from "./AddedAffectedEntityEvent.vue";
import RemovedAffectedEntityEvent from "./RemovedAffectedEntityEvent.vue";

type TimelineItemProps = {
    item: any;
    selected: boolean;
    isModerator: boolean;
};

type TimelineItemEvents = {
    updateItem(newItem: any): void;
};

const timelineItems: Record<string, Component> = {
    IssueComment: Comment,
    Body: Comment,
    AddedLabelEvent: AddedLabelEvent,
    RemovedLabelEvent: RemovedLabelEvent,
    TitleChangedEvent: TitleChangedEvent,
    TypeChangedEvent: TypeChangedEvent,
    StateChangedEvent: StateChangedEvent,
    IssueRelation: IssueRelation,
    RelatedByIssueEvent: RelatedByIssueEvent,
    OutgoingRelationTypeChangedEvent: OutgoingRelationTypeChangedEvent,
    IncomingRelationTypeChangedEvent: IncomingRelationTypeChangedEvent,
    RemovedOutgoingRelationEvent: RemovedOutgoingRelationEvent,
    RemovedIncomingRelationEvent: RemovedIncomingRelationEvent,
    Assignment: Assignment,
    AssignmentTypeChangedEvent: AssignmentTypeChangedEvent,
    RemovedAssignmentEvent: RemovedAssignmentEvent,
    PriorityChangedEvent: PriorityChangedEvent,
    AddedToTrackableEvent: AddedToTrackableEvent,
    RemovedFromTrackableEvent: RemovedFromTrackableEvent,
    AddedAffectedEntityEvent: AddedAffectedEntityEvent,
    RemovedAffectedEntityEvent: RemovedAffectedEntityEvent
};

export default function TimelineItem(props: TimelineItemProps, context: SetupContext<TimelineItemEvents>) {
    const item = props.item;
    const selected = props.selected;
    const isModerator = props.isModerator;
    return h(timelineItems[item.__typename] ?? "TODO", { item, selected, isModerator });
}

TimelineItem.props = {
    item: {
        type: Object,
        required: true
    },
    selected: {
        type: Boolean,
        required: true
    },
    isModerator: {
        type: Boolean,
        required: true
    }
};
