import { Issue } from "@/views/issue/Issue.vue";
import { Emitter } from "mitt";
import { InjectionKey, Ref } from "vue";
import { Events } from "./eventBus";
import { DefaultTrackableInfoFragment } from "@/graphql/generated";

export const eventBusKey: InjectionKey<Emitter<Events>> = Symbol("eventBus");

export const issueKey: InjectionKey<Ref<Readonly<Issue> | null>> = Symbol("issue");

export const trackableKey: InjectionKey<Ref<Readonly<DefaultTrackableInfoFragment> | null>> = Symbol("trackable");
