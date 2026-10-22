import { type OrderDirection } from "@/gql/graphql";
import { ref, type Ref } from "vue";

export type PaginationInfo = number | { hasNextPage: boolean };
export type ItemPage<I> = [I[], PaginationInfo];

export abstract class ItemManager<I, J> {
    cachedItems: Ref<ItemPage<I> | undefined> = ref(undefined);
    private generation = 0;

    protected abstract fetchItems(
        filter: string | undefined,
        orderBy: { field: J; direction: OrderDirection }[],
        count: number,
        page: number
    ): Promise<ItemPage<I>>;

    fetchItemsCaching(
        filter: string | undefined,
        orderBy: { field: J; direction: OrderDirection }[],
        count: number,
        page: number
    ): Promise<ItemPage<I>> {
        const generation = ++this.generation;
        return this.fetchItems(filter, orderBy, count, page).then((result) => {
            if (generation === this.generation) this.cachedItems.value = result;
            return result;
        });
    }
}
