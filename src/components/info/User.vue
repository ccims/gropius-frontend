<template>
    <span class="user-wrapper">
        <img
            v-if="showAvatar"
            :src="displayUser.avatar"
            class="rounded-circle avatar inline-avatar"
            :class="{
                [`avatar--size-${size}`]: true
            }"
        />
        <span v-if="showName" class="text-high-emphasis" :class="{ 'ml-1': showAvatar }">{{
            displayUser.displayName
        }}</span>
        <v-tooltip v-if="showTooltip" activator="parent" location="top" class="rich-tooltip">
            <img :src="displayUser.avatar" class="rounded-circle overlay-avatar" />
            <div class="d-flex text-body-1 text-on-surface">
                <span class="text-on-surface">{{ displayUser.displayName }}</span>
                <span v-if="displayUser.username" class="text-medium-emphasis">
                    &nbsp;·
                    {{ displayUser.username }}
                </span>
            </div>
            <div v-if="linkedUser" class="text-medium-emphasis mt-1">
                Linked external account: {{ user.displayName }}<span v-if="user.username"> (@{{ user.username }})</span>
            </div>
        </v-tooltip>
    </span>
</template>
<script setup lang="ts">
import type { DefaultUserInfoFragment } from "@/gql/graphql";
import { computed, type PropType } from "vue";

const props = defineProps({
    user: {
        type: Object as PropType<DefaultUserInfoFragment>,
        required: true
    },
    showAvatar: {
        type: Boolean,
        required: false,
        default: true
    },
    showName: {
        type: Boolean,
        required: false,
        default: true
    },
    showTooltip: {
        type: Boolean,
        required: false,
        default: true
    },
    size: {
        type: String,
        required: false,
        default: "default"
    }
});
// Preserve the external ID for mutations and attribution; resolve presentation dynamically
// so existing comments also follow account links and unlinking requires no history rewrite.
const linkedUser = computed(() => (props.user.__typename === "IMSUser" ? props.user.gropiusUser : null));
const displayUser = computed(() => linkedUser.value ?? props.user);
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";

.avatar {
    @each $name, $value in settings.$avatar-sizes {
        &--size-#{$name} {
            width: $value;
            height: $value;
        }
    }
}

.overlay-avatar {
    height: 50px;
}

.inline-avatar {
    vertical-align: middle;
    display: inline;
}

.user-wrapper {
    display: inline-block;
}
</style>
