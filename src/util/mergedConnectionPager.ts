export interface ConnectionPage<T> {
    nodes: T[];
    totalCount: number;
}

/** Merge disjoint ordered connections. Each source has its own offset and buffer. */
export class MergedConnectionPager<T> {
    private streams = [0, 1].map(() => ({ buffer: [] as T[], offset: 0, total: undefined as number | undefined }));
    private merged: T[] = [];
    private pending: Promise<unknown> = Promise.resolve();

    private fetch: (source: number, skip: number, count: number) => Promise<ConnectionPage<T>>;
    private compare: (a: T, b: T) => number;
    private chunkSize: number;

    constructor(
        fetch: (source: number, skip: number, count: number) => Promise<ConnectionPage<T>>,
        compare: (a: T, b: T) => number,
        chunkSize = 50
    ) {
        this.fetch = fetch;
        this.compare = compare;
        this.chunkSize = chunkSize;
    }

    page(offset: number, count: number): Promise<[T[], number]> {
        // Shared page requests must not consume the same stream heads concurrently.
        const result = this.pending.then(async (): Promise<[T[], number]> => {
            const fill = async (index: number) => {
                const stream = this.streams[index];
                if (stream.buffer.length || (stream.total !== undefined && stream.offset >= stream.total)) return;
                const result = await this.fetch(index, stream.offset, this.chunkSize);
                stream.total = result.totalCount;
                stream.buffer = result.nodes;
                stream.offset += result.nodes.length;
                if (!result.nodes.length && stream.offset < result.totalCount) {
                    throw new Error("Issue connection changed during pagination. Refresh the list.");
                }
            };
            await Promise.all([fill(0), fill(1)]);
            while (this.merged.length < offset + count) {
                await Promise.all([fill(0), fill(1)]);
                const [a, b] = this.streams;
                if (!a.buffer.length && !b.buffer.length) break;
                const source = !a.buffer.length
                    ? b
                    : !b.buffer.length
                      ? a
                      : this.compare(a.buffer[0], b.buffer[0]) <= 0
                        ? a
                        : b;
                this.merged.push(source.buffer.shift()!);
            }
            return [
                this.merged.slice(offset, offset + count),
                this.streams.reduce((sum, stream) => sum + stream.total!, 0)
            ];
        });
        this.pending = result.catch(() => undefined);
        return result;
    }
}
