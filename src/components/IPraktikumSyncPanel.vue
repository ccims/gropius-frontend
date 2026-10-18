<template>
    <DetailCompartment name="iPraktikum synchronization">
        <v-alert v-if="error" type="error" class="mb-3">{{ error }}</v-alert>
        <v-alert v-if="status" :type="status.ready ? 'success' : 'info'" class="mb-3">
            {{ status.dryRun ? "Dry run" : "Live sync" }} · {{ status.issues ?? 0 }} issues ·
            {{ status.writes ?? 0 }} writes · {{ status.at }}
            <div v-for="message in status.messages" :key="message">{{ message }}</div>
        </v-alert>
        <p class="mb-3">
            All issues in this cohort are enrolled automatically. Components and vocabulary are discovered from Gropius.
        </p>
        <v-text-field v-model.number="projectId" label="Numeric GitLab project ID" type="number" :readonly="readonly" />
        <v-switch v-model="profile.enabled" label="Enable synchronization" :disabled="readonly" />
        <v-switch v-model="profile.dryRun" label="Dry run (discover without changing issues)" :disabled="readonly" />
        <v-select
            v-model="profile.defaultTemplate"
            :items="templates"
            item-title="name"
            item-value="key"
            label="Default template for GitLab issues"
            :disabled="readonly"
            clearable
        />
        <v-select
            v-model="profile.excludedComponents"
            :items="components"
            item-title="name"
            item-value="id"
            label="Exclude components"
            multiple
            chips
            :disabled="readonly"
        />
        <v-card v-for="template in templates" :key="template.key" variant="outlined" class="pa-3 mb-3">
            <div class="text-subtitle-1">{{ template.name }}</div>
            <v-checkbox
                :model-value="!!profile.templates[template.key]"
                label="Use this template"
                :disabled="readonly"
                @update:model-value="configure(template.key, !!$event)"
            />
            <template v-if="profile.templates[template.key]">
                <v-select
                    v-model="profile.templates[template.key].defaultType"
                    :items="values('type', template.key)"
                    item-title="name"
                    item-value="key"
                    label="Default issue type"
                    :disabled="readonly"
                />
                <v-select
                    v-model="profile.templates[template.key].initialState"
                    :items="states(template.key, true)"
                    item-title="name"
                    item-value="key"
                    label="Initial open state"
                    :disabled="readonly"
                />
                <v-select
                    v-model="profile.templates[template.key].closedState"
                    :items="states(template.key, false)"
                    item-title="name"
                    item-value="key"
                    label="Default closed state"
                    :disabled="readonly"
                />
                <v-select
                    v-model="profile.templates[template.key].reopenState"
                    :items="states(template.key, true)"
                    item-title="name"
                    item-value="key"
                    label="Reopen state"
                    :disabled="readonly"
                />
                <v-switch
                    v-model="profile.templates[template.key].nativeAssignmentEnabled"
                    label="Map one primary assignment to GitLab's assignee"
                    :disabled="readonly"
                />
                <v-select
                    v-if="profile.templates[template.key].nativeAssignmentEnabled"
                    v-model="profile.templates[template.key].nativeAssignmentRole"
                    :items="nullableValues('role', template.key)"
                    item-title="name"
                    item-value="key"
                    label="Native assignee role"
                    :disabled="readonly"
                />
                <v-switch
                    v-model="profile.templates[template.key].genericRelationEnabled"
                    label="Map a symmetric relation to native GitLab links"
                    :disabled="readonly"
                />
                <v-select
                    v-if="profile.templates[template.key].genericRelationEnabled"
                    v-model="profile.templates[template.key].genericRelationType"
                    :items="nullableValues('relation', template.key)"
                    item-title="name"
                    item-value="key"
                    label="Symmetric relation (confirm its semantics)"
                    :disabled="readonly"
                />
                <p class="text-body-2">
                    States use individual workflow labels by default. Group them into coarser columns using
                    <code>states</code> and <code>bucketDefaults</code> below. Required field defaults belong in
                    <code>requiredFields</code>.
                </p>
            </template>
        </v-card>
        <v-expansion-panels class="mb-3">
            <v-expansion-panel title="Advanced profile, primary assignments and conflict resolution">
                <v-expansion-panel-text>
                    <p class="mb-2">
                        Edit the runtime profile for grouped workflows, required field defaults, primary selections,
                        conflict resolutions, detachment, and copied-issue adoption. The catalog below supplies stable
                        keys.
                    </p>
                    <v-textarea v-model="advanced" label="Profile JSON" rows="16" :readonly="readonly" />
                    <v-btn @click="applyAdvanced" :disabled="readonly">Apply JSON to form</v-btn>
                    <v-btn variant="text" @click="advanced = JSON.stringify(profile, null, 2)"
                        >Refresh JSON from form</v-btn
                    >
                </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel title="Discovered components and template vocabulary">
                <v-expansion-panel-text>
                    <pre class="catalog">{{ JSON.stringify(catalog, null, 2) }}</pre>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-btn color="primary" :disabled="readonly || saving" :loading="saving" @click="persist"
            >Save sync settings</v-btn
        >
        <v-btn variant="text" @click="$emit('refresh')">Refresh discovery/status</v-btn>
    </DetailCompartment>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import DetailCompartment from "./DetailCompartment.vue";

type Entry = {
    id: string;
    key: string;
    name: string;
    kind: string;
    template?: string;
    open?: boolean;
    creatable?: boolean;
};
type Policy = {
    defaultType: string;
    initialState: string;
    closedState: string;
    reopenState: string;
    states: Record<string, string>;
    bucketDefaults: Record<string, string>;
    autoStates: boolean;
    nativeAssignmentEnabled: boolean;
    nativeAssignmentRole: string | null;
    genericRelationEnabled: boolean;
    genericRelationType: string | null;
    requiredFields: Record<string, unknown>;
};
type Profile = {
    enabled: boolean;
    dryRun: boolean;
    revision: number;
    defaultTemplate: string | null;
    templates: Record<string, Policy>;
    excludedComponents: string[];
    componentLabels: Record<string, string>;
    primary: Record<string, string | null>;
    resolutions: Record<string, { fingerprint: string; side: string }>;
    detached: string[];
    adoptCopies: number[];
    retryCreates: Record<string, string>;
    repairLabels: string[];
};
const props = defineProps<{
    fields: { name: string; value?: unknown }[];
    readonly: boolean;
    save: (input: { templatedFields: { name: string; value: unknown }[] }) => Promise<unknown>;
}>();
defineEmits<{ refresh: [] }>();
const error = ref("");
const saving = ref(false);
const advanced = ref("");
const projectId = ref(Number(props.fields.find((f) => f.name === "gitlab-project-id")?.value ?? 0));
const profile = ref<Profile>({
    enabled: false,
    dryRun: true,
    revision: 1,
    defaultTemplate: null,
    templates: {},
    excludedComponents: [],
    componentLabels: {},
    primary: {},
    resolutions: {},
    detached: [],
    adoptCopies: [],
    retryCreates: {},
    repairLabels: []
});
function parse<T>(name: string, fallback: T): T {
    const value = props.fields.find((f) => f.name === name)?.value;
    if (typeof value !== "string" || !value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
}
const catalog = computed(() => parse<{ entries: Entry[] }>("sync-catalog", { entries: [] }));
const status = computed(() =>
    parse<{ at: string; ready: boolean; dryRun: boolean; issues: number; writes: number; messages: string[] } | null>(
        "sync-status",
        null
    )
);
const templates = computed(() => catalog.value.entries.filter((e) => e.kind === "template" && e.creatable));
const components = computed(() => catalog.value.entries.filter((e) => e.kind === "component"));
function values(kind: string, template: string) {
    return catalog.value.entries.filter((e) => e.kind === kind && e.template === template);
}
function states(template: string, open: boolean) {
    return values("state", template).filter((e) => e.open === open);
}
function nullableValues(kind: string, template: string) {
    return [{ key: null, name: "Untyped" }, ...values(kind, template)];
}
watch(
    () => props.fields.find((f) => f.name === "sync-profile")?.value,
    () => {
        profile.value = { ...profile.value, ...parse<Partial<Profile>>("sync-profile", {}) };
        advanced.value = JSON.stringify(profile.value, null, 2);
    },
    { immediate: true }
);
function configure(key: string, enabled: boolean) {
    if (!enabled) {
        delete profile.value.templates[key];
        return;
    }
    profile.value.templates[key] = {
        defaultType: values("type", key)[0]?.key ?? "",
        initialState: states(key, true)[0]?.key ?? "",
        closedState: states(key, false)[0]?.key ?? "",
        reopenState: states(key, true)[0]?.key ?? "",
        states: {},
        bucketDefaults: {},
        autoStates: true,
        nativeAssignmentEnabled: false,
        nativeAssignmentRole: null,
        genericRelationEnabled: false,
        genericRelationType: null,
        requiredFields: {}
    };
}
function applyAdvanced() {
    try {
        const value = JSON.parse(advanced.value) as Profile;
        if (!value || typeof value !== "object" || !value.templates || typeof value.templates !== "object")
            throw new Error("A profile object with templates is required");
        profile.value = value;
        error.value = "";
    } catch (e) {
        error.value = String(e);
    }
}
async function persist() {
    saving.value = true;
    error.value = "";
    try {
        profile.value.revision = (profile.value.revision ?? 0) + 1;
        if (!Number.isSafeInteger(Number(projectId.value)) || Number(projectId.value) <= 0)
            throw new Error("A positive GitLab project ID is required");
        await props.save({
            templatedFields: [
                { name: "sync-profile", value: JSON.stringify(profile.value) },
                { name: "gitlab-project-id", value: Number(projectId.value) }
            ]
        });
        advanced.value = JSON.stringify(profile.value, null, 2);
    } catch (e) {
        error.value = String(e);
    } finally {
        saving.value = false;
    }
}
</script>
<style scoped>
.catalog {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-size: 12px;
}
</style>
