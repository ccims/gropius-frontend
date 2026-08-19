import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "http://localhost:8082/graphql",
    documents: ["src/**/*.vue", "src/**/*.graphql", "src/**/*.ts", "!src/gql/**"],
    generates: {
        "src/gql/": {
            preset: "client",
            config: {
                useTypeImports: true,
                // custom scalars have no runtime mapping, unknown would only force casts at every use
                defaultScalarType: "any",
                scalars: {
                    ID: { input: "string", output: "string" }
                }
            },
            presetConfig: {
                fragmentMasking: false
            },
            // queryNode discriminates the node union by __typename, so the documents have to request it
            documentTransforms: [addTypenameSelectionDocumentTransform]
        },
        // the client preset emits enums as string unions, which have no runtime representation -
        // this is for the few places that need to enumerate the values
        "src/gql/enums.ts": {
            plugins: ["typescript"],
            config: {
                onlyEnums: true,
                enumsAsConst: true,
                useTypeImports: true
            }
        }
    },
    hooks: {
        afterAllFileWrite: ["prettier --write"]
    },
    // opt in, so a plain run regenerates once and exits, which is what scripts/codegen.sh needs
    watch: process.argv.includes("--watch")
};
export default config;
