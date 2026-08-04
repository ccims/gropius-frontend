import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
import { watchOnce } from "@vueuse/core";

export function useFilterOption(id: string, useQueryForFilter: boolean) {
    const route = useRoute();
    const router = useRouter();
    const storage = ref<string[]>([]);
    if (useQueryForFilter) {
        watchOnce(
            () => route.query[id],
            (value) => {
                if (!value) {
                    return;
                }
                const result = Array.isArray(value) ? value : value ? [value] : [];
                storage.value = result.filter((v) => !!v).map((v) => v as string);
            },
            { immediate: true }
        );
        watch(storage, (value, oldValue) => {
            if (value.length == oldValue.length && value.every((item, index) => item === oldValue[index])) {
                return;
            }
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
