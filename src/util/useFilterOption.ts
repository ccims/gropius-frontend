import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";

export function useFilterOption(id: string, useQueryForFilter: boolean) {
    const route = useRoute();
    const router = useRouter();
    const storage = ref<string[]>([]);
    if (useQueryForFilter) {
        watch(
            () => route.query[id],
            (value) => {
                const result = Array.isArray(value) ? value : value ? [value] : [];
                const next = result.filter((v): v is string => typeof v === "string" && !!v);
                if (JSON.stringify(storage.value) !== JSON.stringify(next)) storage.value = next;
            },
            { immediate: true }
        );
        watch(storage, (value, oldValue) => {
            if (value.length == oldValue.length && value.every((item, index) => item === oldValue[index])) {
                return;
            }
            const raw = route.query[id];
            const current = (Array.isArray(raw) ? raw : raw ? [raw] : []).filter((v) => !!v);
            if (JSON.stringify(current) === JSON.stringify(value)) return;
            const query = { ...route.query };
            if (value.length > 0) {
                query[id] = value.length === 1 ? value[0] : value;
            } else {
                delete query[id];
            }
            router.replace({ query });
        });
    }
    return storage;
}
