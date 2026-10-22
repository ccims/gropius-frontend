# Project Issues

The project has a single Issues tab. All sources includes issues assigned to the project and issues on any component included in the project. Sources can be restricted to This project, Components, or a custom combination. The legacy Component Issues URL redirects to the Components scope.

In Custom selection, selecting versions restricts the relevant component branch using existing `aggregatedBy` filters. Version relevance follows the architecture graph's semantics: explicit version impact, component-wide impact, or component issues without affected entities. Project membership is independent if This project is checked. Affects remains an additional exact impact filter.

No backend changes are required. Browsing reuses `Project.issues` and `Project.componentIssues`. For a mixed scope the component stream excludes direct project membership, so each issue appears once and the two counts can be added. `MergedConnectionPager` uses independent offsets and bounded buffers; cached merged prefixes support backwards pagination and deep jumps. An uncached jump must process preceding results. The comparator matches Neo4j's null, Unicode, timestamp, and ID ordering, and uses every field in the requested order tuple.

Search reuses `searchIssues` with the same scope filter. It uses `skip`, requests one extra result for lookahead, and displays Previous/Next controls. The API provides relevance order and no exact total; browse sorting returns when search is cleared.

Filter metadata is loaded independently of displayed issue pages, using paginated existing Trackable aggregation fields across the selected source trackables. These options are source-scoped, not restricted to the selected versions or current attribute filters. They can therefore offer a value with no matches under the remaining filters.

## Checks

```sh
npm run test:project-issues
npx vue-tsc --noEmit
npm run build
```

To regenerate GraphQL clients from an existing schema snapshot without starting a backend:

```sh
GROPIUS_GRAPHQL_SCHEMA=/absolute/path/to/schema.json npx graphql-codegen --config codegen.ts
```

The default codegen endpoint and `npm run codegen` workflow are unchanged.
