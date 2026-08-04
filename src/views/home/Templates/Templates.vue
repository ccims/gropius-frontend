<template>
    <TemplateList
        :key="kind"
        :name="`${kindInfo.name} templates`"
        :item-manager="itemManager"
        :to="(template: TemplateListInfoFragment) => templateDetailsRoute(kind, template.id)"
    >
        <component :is="createDialogs[kind]" @created-template="selectTemplate" />
    </TemplateList>
</template>

<script lang="ts" setup>
import TemplateList from "@/components/TemplateList.vue";
import type { TemplateListInfoFragment } from "@/gql/graphql";
import { createTemplateItemManager } from "@/util/templateItemManager";
import { templateDetailsRoute, templateKindInfos, useShowDeprecated, type TemplateKind } from "@/util/templates";
import type { IdObject } from "@/util/types";
import { computed, defineAsyncComponent, type Component, type PropType } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    kind: {
        type: String as PropType<TemplateKind>,
        required: true
    }
});

const createDialogs: Record<TemplateKind, Component> = {
    issue: defineAsyncComponent(() => import("@/components/dialog/CreateIssueTemplateDialog.vue")),
    component: defineAsyncComponent(() => import("@/components/dialog/CreateComponentTemplateDialog.vue")),
    "interface-specification": defineAsyncComponent(
        () => import("@/components/dialog/CreateInterfaceSpecificationTemplateDialog.vue")
    ),
    relation: defineAsyncComponent(() => import("@/components/dialog/CreateRelationTemplateDialog.vue")),
    artefact: defineAsyncComponent(() => import("@/components/dialog/CreateArtefactTemplateDialog.vue"))
};

const router = useRouter();
const { showDeprecated } = useShowDeprecated();

const kindInfo = computed(() => templateKindInfos[props.kind]);
const itemManager = computed(() => createTemplateItemManager(props.kind, showDeprecated));

function selectTemplate(template: IdObject) {
    router.push(templateDetailsRoute(props.kind, template.id));
}
</script>
