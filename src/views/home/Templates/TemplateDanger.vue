<template>
    <div class="pa-4 h-100 overflow-y-auto">
        <TemplateDangerZone :template-id="templateId" :entity-name="templateKindInfos[kind].entityName" />
    </div>
</template>

<script lang="ts" setup>
import TemplateDangerZone from "@/components/TemplateDangerZone.vue";
import { templateKindInfos, useTemplateId, type TemplateKind } from "@/util/templates";
import type { PropType } from "vue";

defineProps({
    kind: {
        type: String as PropType<TemplateKind>,
        required: true
    }
});

const templateId = useTemplateId();
</script>
