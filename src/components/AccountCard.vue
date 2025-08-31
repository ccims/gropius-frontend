<template>
    <v-card color="surface-elevated-3" rounded="lger" class="mt-2 pa-3 account-card" elevation="4">
        <div class="d-flex flex-column align-center">
            <img :src="user.avatar" class="large-avatar rounded-circle mb-2" />

            <p class="text-h5 text-on-surface text-ellipsis max-width-100">Hi {{ user.displayName }}</p>

            <p class="text-medium-emphasis">
                {{ user.username }}
            </p>

            <p v-if="user.email" class="text-medium-emphasis text-ellipsis">
                {{ user.email }}
            </p>

            <DefaultButton variant="outlined" class="mt-3 w-100" href="/auth/flow/account">
                Manage Account
            </DefaultButton>

            <DefaultButton variant="tonal" class="mt-3 w-100" @click="logout">
                Logout
            </DefaultButton>
        </div>
    </v-card>
</template>
<script setup lang="ts">
import { ClientReturnType } from "@/graphql/client";
import { useAppStore } from "@/store/app";
import { PropType } from "vue";
import { useRoute, useRouter } from "vue-router";

defineProps({
    user: {
        type: Object as PropType<ClientReturnType<"getCurrentUser">["currentUser"] & object>,
        required: true
    }
});

const store = useAppStore();
const route = useRoute();
const router = useRouter();

function logout() {
    store.setNewTokenPair("", "");
    router.push({
        name: "home",
        force: true
    });
}

</script>
<style scoped>
.large-avatar {
    width: 80px;
    height: 80px;
}

.account-card {
    width: 300px;
    overflow: hidden !important;
}

.max-width-100 {
    max-width: 100%;
}
</style>
