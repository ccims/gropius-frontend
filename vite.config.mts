// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import Fonts from "unplugin-fonts/vite";
import $monacoEditorPlugin from "vite-plugin-monaco-editor";
const monacoEditorPlugin = ($monacoEditorPlugin as any).default ?? $monacoEditorPlugin;

// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: {
                transformAssetUrls,
                compilerOptions: {
                    isCustomElement: (tag) => ["task-lists", "relative-time"].includes(tag)
                }
            }
        }),
        // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
        vuetify({
            autoImport: true,
            styles: {
                configFile: "src/styles/settings.scss"
            }
        }),
        Fonts({
            fontsource: {
                families: [
                    {
                        name: "Roboto",
                        weights: [100, 300, 400, 500, 700, 900]
                    }
                ]
            }
        }),
        monacoEditorPlugin({
            languageWorkers: ["editorWorkerService", "json"],
            customWorkers: [
                {
                    label: "graphql",
                    entry: "monaco-graphql/esm/graphql.worker.js"
                }
            ]
        })
    ],
    define: { "process.env": {} },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
    },
    server: {
        port: 4200,
        proxy: {
            "/api/graphql": {
                target: "http://localhost:8080/graphql",
                changeOrigin: true,
                secure: false,
                ws: true,
                ignorePath: true
            },
            "/auth": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
                ws: true
            }
        }
    },
    optimizeDeps: {
        exclude: ["vuetify", "@github/task-lists-element"]
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: "modern-compiler"
            },
            scss: {
                api: "modern-compiler"
            }
        }
    }
});
