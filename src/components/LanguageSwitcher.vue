<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLanguageStore, locales } from '@/stores/language'
import { useViewport } from '@/viewport';

const store = useLanguageStore();
const open = ref(false);
const dropdownRef = ref(null);
const { isMobile } = useViewport();

function toggle() {
    open.value = !open.value;
}

function select(code: string) {
    store.language = code;
    open.value = false;
}

function handleClickOutside(event) {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        open.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div ref="dropdownRef" class="language-selector">
        <button class="selector-button" @click="toggle">
            <span class="flag">{{ locales[store.language].flag }}</span>
            <span v-if="!isMobile" class="label">{{ locales[store.language].label }}</span>
            <span class="chevron">▾</span>
        </button>

        <div v-if="open" class="dropdown">
            <button v-for="(lang, code) in locales" :key="code" class="dropdown-item" @click="select(code)">
                <span class="flag">{{ lang.flag }}</span>
                <span v-if="!isMobile" class="label">{{ lang.label }}</span>
            </button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.language-selector {
    position: relative;
    display: inline-block;
    font-family: sans-serif;

    button {
        line-height: 1.15rem;
    }
}

.selector-button {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em 0.8em;
    background-color: var(--color-background-mute);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    cursor: pointer;
    color: var(--color-text);
}

.selector-button:hover {
    background-color: var(--color-background-soft);
    border: 1px solid var(--color-border-hover);
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--color-background-mute);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    margin-top: 0.2em;
    padding-bottom: .15em;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    z-index: 1000;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em 0.8em;
    width: 100%;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: var(--color-text);
}

.dropdown-item:first-of-type {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.dropdown-item:last-of-type {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

.dropdown-item:hover {
    background-color: var(--color-background-soft);
}

.flag {
    font-size: 1.4em;

    @media (max-width: 768px) {
        font-size: 1.8em;
        padding: 0 .25em 0 .1em;
    }
}

.label {
    font-size: 1em;
}

.chevron {
    font-size: 0.8em;
}
</style>
