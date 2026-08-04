<template>
    <BaseLayoutWithError
        :title-segments="titleSegments"
        :tabs="[]"
        :right-sidebar-items="[]"
        :left-sidebar-items="leftSidebarItems"
        :data-present="!!template"
        :evaluating="evaluating"
    >
        <template #content>
            <router-view />
        </template>
    </BaseLayoutWithError>
</template>

<script lang="ts" setup>
import BaseLayoutWithError from "@/components/BaseLayoutWithError.vue";
import { graphql } from "@/gql";
import { requestThrow } from "@/gql/client";
import { useAppStore } from "@/store/app";
import { onEvent } from "@/util/eventBus";
import { templateKindInfos, useTemplateRoutes, type TemplateKind } from "@/util/templates";
import { withErrorMessage } from "@/util/withErrorMessage";
import { computedAsync } from "@vueuse/core";
import { computed, ref, shallowRef, type PropType } from "vue";

const getTemplateNameQuery = graphql(`
    query getTemplateName($id: ID!) {
        node(id: $id) {
            __typename
            id
            ... on Template {
                name
            }
        }
    }
`);

const props = defineProps({
    kind: {
        type: String as PropType<TemplateKind>,
        required: true
    }
});

const store = useAppStore();
const { templateId, templateRoute } = useTemplateRoutes();

const kindInfo = computed(() => templateKindInfos[props.kind]);

const titleSegmentDependency = ref(0);
onEvent("title-segment-changed", () => {
    titleSegmentDependency.value++;
});

const evaluating = shallowRef(false);
const template = computedAsync(
    async () => {
        if (!templateId.value) {
            return null;
        }
        titleSegmentDependency.value;
        const res = await withErrorMessage(
            () => requestThrow(getTemplateNameQuery, { id: templateId.value }),
            `Error loading ${kindInfo.value.name} template`
        );
        // the node query can return any node, only templates have a name here
        return res.node != undefined && "name" in res.node ? res.node : null;
    },
    null,
    { shallow: false, evaluating }
);

function detailsRoute(page: string) {
    return templateRoute(`${props.kind}-template-details-${page}`);
}

const titleSegments = computed(() => [
    { icon: "mdi-file-document-outline", path: { name: `templates-${props.kind}` } },
    { name: template.value?.name ?? "", path: detailsRoute("general") }
]);

const leftSidebarItems = computed(() => [
    kindInfo.value.pages.map((page) => ({
        icon: page.icon,
        name: page.name,
        color: "secondary",
        to: detailsRoute(page.route)
    })),
    [
        {
            icon: "mdi-alert",
            name: "Danger",
            color: "error",
            to: detailsRoute("danger"),
            disabled: !(store.user?.canCreateTemplates ?? false)
        }
    ]
]);
</script>
