import type { Emitter } from "mitt";
import type { InjectionKey, Ref } from "vue";
import type { Events } from "./eventBus";
import type { GetIssueQuery, GetProjectQuery, GetComponentQuery } from "@/gql/graphql";
import type { NodeReturnType } from "@/gql/client";

export const eventBusKey: InjectionKey<Emitter<Events>> = Symbol("eventBus");

export const issueKey: InjectionKey<Ref<Readonly<NodeReturnType<GetIssueQuery, "Issue">> | null>> = Symbol("issue");

// Trackable can be either a Project or Component from their respective queries
export type Trackable =
    | NonNullable<NodeReturnType<GetProjectQuery, "Project">>
    | NonNullable<NodeReturnType<GetComponentQuery, "Component">>;

export const trackableKey: InjectionKey<Ref<Readonly<Trackable> | null>> = Symbol("trackable");
