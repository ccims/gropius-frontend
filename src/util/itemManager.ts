import { type OrderDirection } from "@/gql/graphql";
import { ref, type Ref } from "vue";

export abstract class ItemManager<I, J> {
    cachedItems: Ref<[I[], number] | undefined> = ref(undefined);

    protected abstract fetchItems(
        filter: string | undefined,
        orderBy: { field: J; direction: OrderDirection }[],
        count: number,
        page: number
    ): Promise<[I[], number]>;

    fetchItemsCaching(
        filter: string | undefined,
        orderBy: { field: J; direction: OrderDirection }[],
        count: number,
        page: number
    ): Promise<[I[], number]> {
        return this.fetchItems(filter, orderBy, count, page).then((result) => {
            this.cachedItems.value = result;
            return result;
        });
    }
}
