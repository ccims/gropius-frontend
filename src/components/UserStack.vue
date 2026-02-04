<template>
    <div
        class="d-flex user-stack flex-row-reverse"
        :class="{
            [`user-stack--size-${size}`]: true
        }"
    >
        <User
            v-for="(user, idx) in users"
            :key="idx"
            :user="user"
            :show-name="false"
            :size="size"
            class="user"
            :class="{
                'first-user': idx === 0
            }"
        />
    </div>
</template>
<script setup lang="ts">
import { DefaultUserInfoFragment } from "@/gql/graphql";
import { PropType } from "vue";
import User from "./info/User.vue";

defineProps({
    users: {
        type: Array as PropType<DefaultUserInfoFragment[]>,
        required: true
    },
    size: {
        type: String,
        required: false,
        default: "default"
    }
});
</script>
<style scoped lang="scss">
@use "@/styles/settings.scss";

.user-stack {
    background: transparent;
    .user {
        transition: margin 200ms;
    }
    @each $name, $value in settings.$avatar-sizes {
        &--size-#{$name} {
            .user {
                margin-right: calc($value / -2);
            }
            &:hover {
                .user {
                    margin-right: calc($value / 4);
                }
            }
        }
    }
    .first-user {
        margin-right: 0 !important;
    }
}
</style>
