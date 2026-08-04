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

`codegen.ts` introspects the API at `http://localhost:8082/graphql`. Introspection needs authentication,
so this has to be a backend started with it disabled, next to the regular one:

```
docker compose -f docker-compose-testing.yaml run --rm -d --name gropius-codegen-api -p 8082:8080 \
    -e GROPIUS_API_PUBLIC_DEBUG_NO_AUTHENTICATION=true api-public

npm run codegen

docker rm -f gropius-codegen-api
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).
