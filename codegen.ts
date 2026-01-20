import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://localhost:8082/graphql",
    documents: ["src/**/*.vue", "src/**/*.graphql"],
    generates: {
        "src/gql/": {
            preset: "client",
            config: {
                useTypeImports: true
            },
            presetConfig: {
                fragmentMasking: false
            }
        },
    },
    watch: true
};
export default config;
