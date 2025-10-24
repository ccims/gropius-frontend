import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";

export function useFilterOption(id: string, useQueryForFilter: boolean) {
    const route = useRoute();
    const router = useRouter();
    return useQueryForFilter ? computed({
        get: () => {
            const filter = route.query[id];
            const result = Array.isArray(filter) ? filter : filter ? [filter] : [];
            return result.filter((v) => !!v).map((v) => v as string);
        },
        set: (value: string[]) => {
            const query = { ...route.query };
            if (value.length > 0) {
                query[id] = value.length === 1 ? value[0] : value;
            } else {
                delete query[id];
            }
            router.replace({ query });
        }
    }) : ref([]);
}
