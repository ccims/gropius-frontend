# essentials

## Project setup

```
# yarn
yarn

# npm
npm install

# pnpm
pnpm install
```

### Compiles and hot-reloads for development

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev
```

### Compiles and minifies for production

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build
```

### Lints and fixes files

```
# yarn
yarn lint

# npm
npm run lint

# pnpm
pnpm lint
```

### Regenerates the GraphQL types

```
npm run codegen
```

`codegen.ts` introspects the API at `http://localhost:8082/graphql`. Introspection is rejected by an
authenticated backend, so this has to be one started with authentication disabled, next to the regular
one. `scripts/codegen.sh` starts and removes that backend itself, using the testing compose file of the
superrepository - the first run builds the backend image, which takes a while.

If port 8082 already serves such a backend, the script uses it instead of starting one. To run it
yourself, for example from a checkout instead of an image:

```
GROPIUS_API_PUBLIC_DEBUG_NO_AUTHENTICATION=true SERVER_PORT=8082 <start api-public>
```

Append `-- --watch` to keep regenerating on every change to a document.

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).
