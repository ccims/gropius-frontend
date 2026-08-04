<template>
    <div v-if="templates.length == 0" class="text-medium-emphasis">{{ emptyMessage }}</div>
    <CustomList v-else :items="templates" :to="(template) => routeOf(template)">
        <template #item="{ item }">
            <ListItem
                :title="item.name"
                :subtitle="item.description || 'No description provided'"
                :italic-subtitle="!item.description"
            >
                <template #prepend>
                    <v-icon :icon="iconOf(item)" class="mr-3 flex-0-0 template-icon" />
                </template>
            </ListItem>
        </template>
    </CustomList>
</template>

<script lang="ts" setup>
import { templateDetailsRoute, templateKindFromTypename, templateKindInfos, type TemplateKind } from "@/util/templates";
import type { PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";
import CustomList from "./CustomList.vue";
import ListItem from "./ListItem.vue";

interface TemplateReference {
    id: string;
    name: string;
    description: string;
    __typename?: string;
}

const props = defineProps({
    templates: {
        type: Array as PropType<TemplateReference[]>,
        required: true
    },
    /** The kind of all listed templates, omitted if they can be of different kinds */
    kind: {
        type: String as PropType<TemplateKind>,
        required: false
    },
    emptyMessage: {
        type: String,
        required: true
    }
});

function kindOf(template: TemplateReference): TemplateKind | undefined {
    return props.kind ?? (template.__typename ? templateKindFromTypename(template.__typename) : undefined);
}

function routeOf(template: TemplateReference): RouteLocationRaw | undefined {
    const kind = kindOf(template);
    return kind != undefined ? templateDetailsRoute(kind, template.id) : undefined;
}

function iconOf(template: TemplateReference): string {
    const kind = kindOf(template);
    return kind != undefined ? templateKindInfos[kind].icon : "mdi-file-document-outline";
}
</script>

<style scoped lang="scss">
.template-icon {
    color: rgb(var(--v-theme-primary));
}
</style>
