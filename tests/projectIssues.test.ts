import assert from "node:assert/strict";
import test from "node:test";
import { MergedConnectionPager } from "../src/util/mergedConnectionPager.ts";
import { compareProjectIssues, projectIssueScopeFilter } from "../src/util/projectIssueScope.ts";

for (const direction of [1, -1]) {
    for (const sizes of [
        [0, 0],
        [0, 90],
        [90, 0],
        [200, 3],
        [3, 200],
        [97, 101]
    ]) {
        test(`merge ${sizes} direction ${direction}, deep jump, backwards, concurrent pages`, async () => {
            const streams = sizes.map((size, source) =>
                Array.from({ length: size }, (_, i) => i * 2 + source).sort((a, b) => direction * (a - b))
            );
            const all = streams.flat().sort((a, b) => direction * (a - b));
            const calls: number[][] = [];
            const pager = new MergedConnectionPager(
                async (source, skip, count) => {
                    calls.push([source, skip, count]);
                    await Promise.resolve();
                    return { nodes: streams[source].slice(skip, skip + count), totalCount: streams[source].length };
                },
                (a, b) => direction * (a - b),
                7
            );
            for (const offset of [75, 0, 25, 150, 500]) {
                const [items, total] = await pager.page(offset, 25);
                assert.deepEqual(items, all.slice(offset, offset + 25));
                assert.equal(total, all.length);
            }
            const pages = await Promise.all([pager.page(0, 20), pager.page(20, 20)]);
            assert.deepEqual(
                pages.map(([items]) => items),
                [all.slice(0, 20), all.slice(20, 40)]
            );
            assert.ok(calls.every(([, , count]) => count === 7));
        });
    }
}

test("merge rejects an inconsistent/changed connection instead of spinning", async () => {
    const pager = new MergedConnectionPager(
        async () => ({ nodes: [], totalCount: 10 }),
        () => 0
    );
    await assert.rejects(pager.page(0, 25), /changed during pagination/);
});

test("custom scope keeps project independent and constrains versions on the correct component", () => {
    const components = [
        { id: "c1", name: "One", versions: [{ id: "v1", version: "1" }] },
        { id: "c2", name: "Two", versions: [{ id: "v2", version: "2" }] }
    ];
    const filter = projectIssueScopeFilter("p", "custom", true, ["c1", "c2"], ["v1"], components);
    assert.equal(filter.or?.length, 3);
    assert.deepEqual(filter.or?.[0], { trackables: { any: { id: { eq: "p" } } } });
    assert.deepEqual(filter.or?.[1]?.and?.[1], {
        aggregatedBy: {
            any: { relationPartner: { isComponentVersionAnd: { id: { in: ["v1"] }, partOfProject: "p" } } }
        }
    });
    assert.equal(filter.or?.[2]?.and, undefined);
    assert.deepEqual(projectIssueScopeFilter("p", "custom", false, [], [], components), { id: { in: [] } });
    assert.deepEqual(projectIssueScopeFilter("p", "custom", false, ["obsolete"], [], components), { id: { in: [] } });
});

const issue = (id: string, title = "same", priority: null | number = null) => ({
    id,
    title,
    createdAt: "2026-10-22T10:00:00Z",
    lastUpdatedAt: "2026-10-22T10:00:00Z",
    priority: priority === null ? null : { id: `p${priority}`, name: `Priority ${priority}`, value: priority },
    state: { id: "open", name: "Open", isOpen: true },
    type: { id: "bug", name: "Bug" },
    template: { id: "t", name: "Template" }
});

test("comparison uses ID ties, Neo4j null placement, Unicode code points and nanoseconds", () => {
    assert.ok(compareProjectIssues(issue("a"), issue("b"), [{ field: "ID", direction: "ASC" }]) < 0);
    assert.ok(
        compareProjectIssues(issue("a"), issue("b", "same", 1), [{ field: "PRIORITY_VALUE", direction: "ASC" }]) > 0
    );
    assert.ok(
        compareProjectIssues(issue("a"), issue("b", "same", 1), [{ field: "PRIORITY_VALUE", direction: "DESC" }]) < 0
    );
    assert.ok(
        compareProjectIssues(issue("a", "\u{10000}"), issue("b", "\uE000"), [{ field: "TITLE", direction: "ASC" }]) > 0
    );
    const a = { ...issue("a"), lastUpdatedAt: "2026-10-22T10:00:00.000000001Z" };
    const b = { ...issue("b"), lastUpdatedAt: "2026-10-22T12:00:00.000000002+02:00" };
    assert.ok(compareProjectIssues(a, b, [{ field: "LAST_UPDATED_AT", direction: "ASC" }]) < 0);
});
