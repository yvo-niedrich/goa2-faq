<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{
    title: string;
    open?: boolean;
}>(), { open: false });

let uid = 0;
const panelId = `collapsible-panel-${++uid}-${Math.random().toString(36).slice(2, 8)}`;
const triggerId = `${panelId}-trigger`;

const isOpen = ref(props.open);
</script>

<template>
    <div class="collapsible" :class="{ 'is-open': isOpen }">
        <button :id="triggerId" type="button" class="collapsible__trigger" :aria-expanded="isOpen"
            :aria-controls="panelId" @click="isOpen = !isOpen">
            <span class="collapsible__title">{{ title }}</span>
            <span class="collapsible__chevron" aria-hidden="true">▾</span>
        </button>

        <div :id="panelId" class="collapsible__panel" role="region" :aria-labelledby="triggerId"
            :aria-hidden="!isOpen" :inert="!isOpen">
            <div class="collapsible__inner">
                <div class="collapsible__content">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.collapsible {
    border: 1px solid var(--color-border);
    border-radius: .75em;
    background-color: rgba(0, 0, 0, 0.35);
    overflow: hidden;
}

.collapsible__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .75em;

    width: 100%;
    min-height: 2.25rem;
    padding: .5em .85em;

    border: 0;
    background: none;
    color: var(--color-text);
    font-family: inherit;
    font-size: 1em;
    text-align: left;
    cursor: pointer;

    transition: background-color .2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, .06);
    }
}

.collapsible__title {
    font-weight: bold;
    letter-spacing: .02em;
}

.collapsible__chevron {
    flex: none;
    font-size: .9em;
    line-height: 1;
    color: var(--color-text-muted);
    transition: transform .28s ease, color .2s ease;
}

.collapsible.is-open .collapsible__chevron {
    transform: rotate(180deg);
    color: var(--color-text);
}

/* animating grid-template-rows expands to the content's own height,
   with no need to measure it in JS */
.collapsible__panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows .28s ease;
}

.collapsible.is-open .collapsible__panel {
    grid-template-rows: 1fr;
}

.collapsible__inner {
    overflow: hidden;
    min-height: 0;
}

.collapsible__content {
    padding: .75em .85em;
    border-top: 1px solid var(--color-border);
}
</style>
