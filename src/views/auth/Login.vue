<template>
    <BaseLayout v-if="store.manuallyLoggedOut">
        <template #content>
            <GropiusCard class="prompt-container mt-5 mb-4">
                <v-card-title class="text-center mb-4">Login</v-card-title>

                <v-card-text
                    >Do you want to login?
                </v-card-text>

                <DefaultButton class="w-100 mb-4" :href="loginURL">Login</DefaultButton>

            </GropiusCard>
        </template>
    </BaseLayout>
    <router-view v-else />
</template>
<script setup lang="ts">
import BaseLayout from "@/components/BaseLayout.vue";
import GropiusCard from "@/components/GropiusCard.vue";
import { buildOAuthUrl, TokenScope } from "@/util/oauth";
import { onMounted } from "vue";
import { useAppStore } from "@/store/app";
import { ref } from "vue";

const store = useAppStore();
const loginURL = ref("");

onMounted(async () => {
    loginURL.value = await buildOAuthUrl([TokenScope.LOGIN_SERVICE, TokenScope.BACKEND]);
    if (!store.manuallyLoggedOut) window.location.href = loginURL.value;
});
</script>
<style scoped>
.prompt-container {
    max-width: 500px;
    margin: 0 auto;
}
</style>
