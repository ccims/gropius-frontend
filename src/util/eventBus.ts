import { inject, onMounted, onUnmounted } from "vue";
import { eventBusKey } from "./keys";

export type Events = {
    "create-issue": undefined;
    "import-issue": undefined;
    "create-project": undefined;
    "create-component": undefined;
    "create-component-version": undefined;
    "create-interface-specification": undefined;
    "create-interface-specification-version": undefined;
    "create-label": undefined;
    "import-label": undefined;
    "create-ims": undefined;
    "create-ims-project": undefined;
    "create-permission": undefined;
    "import-permission": undefined;
    "add-component-version-to-project": undefined;
    "layout-component-graph": undefined;
    "title-segment-changed": undefined;
    "create-strategy-instance": undefined;
    "create-auth-client": undefined;
    "create-view": undefined;
    "add-interface-specification-version-to-component-version": undefined;
    "create-legal-information": undefined;
};

export function onEvent(event: keyof Events, handler: (event: Events[keyof Events]) => void) {
    const eventBus = inject(eventBusKey);
    onMounted(() => {
        eventBus?.on(event, handler);
    });
    onUnmounted(() => {
        eventBus?.off(event, handler);
    });
}
