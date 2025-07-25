/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import pinia from "../store";
import router from "../router";
import mdEditor from "./mdEditor";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
    app.use(vuetify).use(router).use(pinia).use(mdEditor);
}
