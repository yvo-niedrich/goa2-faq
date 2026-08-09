<script setup lang="ts">
withDefaults(defineProps<{
    icon: 'favorite' | 'reset';
    label: string;
    active?: boolean;
    disabled?: boolean;
}>(), { active: false, disabled: false });

defineEmits<{ click: [] }>();
</script>

<template>
    <button type="button" class="hero-action" :class="[`icon-${icon}`, { 'is-active': active }]" :disabled="disabled"
        :title="label" :aria-label="label" :aria-pressed="icon === 'favorite' ? active : undefined"
        @click.stop="$emit('click')">

        <svg v-if="icon === 'favorite'" viewBox="0 0 24 24" aria-hidden="true" :fill="active ? 'currentColor' : 'none'"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>

        <svg v-else viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 2v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L3 8" />
        </svg>
    </button>
</template>

<style scoped lang="scss">
.hero-action {
    /* sized in rem on purpose: the portrait scales its own font-size with its
       height, which used to make this button huge on desktop and tiny on phones */
    --size: 2.15rem;
    --accent: #f0f0f0;

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: var(--size);
    height: var(--size);
    padding: 0;
    margin: 0;

    border: 1px solid rgba(255, 255, 255, .35);
    border-radius: 50%;
    background: rgba(10, 16, 20, .55);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    box-shadow:
        0 2px 6px rgba(0, 0, 0, .55),
        inset 0 1px 0 rgba(255, 255, 255, .12);

    color: var(--accent);
    cursor: pointer;
    z-index: 10;
    transition: background-color .2s ease, border-color .2s ease, color .2s ease, transform .2s ease;

    @media (pointer: coarse) {
        --size: 2.4rem;
    }

    /* keeps the visual size modest while giving fingers a comfortable target */
    &::after {
        content: "";
        position: absolute;
        inset: -5px;
        border-radius: 50%;
    }

    svg {
        width: 56%;
        height: 56%;
        display: block;
        overflow: visible;
    }

    &:hover:not(:disabled) {
        background: rgba(10, 16, 20, .75);
        border-color: rgba(255, 255, 255, .6);
    }

    &:active:not(:disabled) {
        transform: scale(.96);
    }

    &:disabled {
        opacity: .3;
        cursor: default;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
    }

    /* favourited: a filled red heart reads as "on" at a glance */
    &.icon-favorite.is-active {
        --accent: rgb(255, 78, 78);
        border-color: rgba(255, 78, 78, .65);
        background: rgba(40, 8, 12, .65);
    }

    &.icon-favorite:hover:not(:disabled) {
        --accent: rgb(255, 120, 120);
    }

    &.icon-reset:hover:not(:disabled) svg {
        transform: rotate(-35deg);
    }

    &.icon-reset svg {
        transition: transform .3s ease;
    }
}
</style>
