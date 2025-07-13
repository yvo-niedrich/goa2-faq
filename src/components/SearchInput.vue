<script setup lang="ts">

import { expansions as expansionsAvailable } from '@/data/heroes'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{ placeholder?: string; }>();

const name = defineModel<string>('name', { required: true });
const expansions = defineModel<string[] | null>('expansions', { required: false, default: null });

const open = ref(false);
const dropdownRef = ref(null);
const count = computed(() => expansionsAvailable.filter(v => expansions.value.includes(v)).length);

function toggle() {
    open.value = !open.value;
}

function selectExpansion(exp: string) {
    if (expansions.value === null) return;

    const idx = expansions.value.indexOf(exp)
    if (idx >= 0) {
        expansions.value.splice(idx, 1);
    } else {
        expansions.value.push(exp);
    }
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
    <div class="search-input">
        <div class="search-input__wrapper">

            <div v-if="expansions !== null" class="search-input__selector">
                <div ref="dropdownRef" class="selector">
                    <button class="selector-button" @click="toggle">
                        <span class="icon" :class="{ 'muted': count === 0 }"><img src="@/assets/stack.svg"></span>
                        <span class="label">{{ count || '\xA0' }}</span>
                        <span class="chevron">▾</span>
                    </button>

                    <div v-if="open" class="dropdown">
                        <button v-for="exp in expansionsAvailable" :key="exp" class="dropdown-item"
                            :class="{ 'active': expansions.includes(exp) }" @click="selectExpansion(exp)">
                            <span class="label">{{ exp }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <input type="text" v-model="name" class="search-input__field" :placeholder="placeholder ?? 'Search...'" />

            <svg class="search-input__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    fill="currentColor" stroke="currentColor" />
            </svg>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.search-input {
    width: 100%;
    max-width: 32rem;

    &__wrapper {
        display: flex;
        align-items: center;
        position: relative;
    }

    &__field {
        flex: 1;
        height: 2.5em;
        padding: 0.5em 1.5em 0.5em 1em;
        border: 1px solid var(--color-border-shadow);
        border-radius: .65em;
        outline: none;

        padding-left: 4.25em;
        &:focus {
            border-color: var(--color-border);
        }
    }

    &__icon {
        position: absolute;
        left: auto;
        right: 1em;
        top: 50%;
        transform: translateY(-50%);
        width: 1.5em;
        height: 1.5em;
        color: #9ca3af;
        pointer-events: none;
    }
&__selector {
    position: absolute;
    left: 0;
    top: 0;


    .selector {
        position: relative;
        display: inline-block;
        font-family: sans-serif;
    }

    .selector-button {
        height: 2.5em;
        display: flex;
        align-items: center;
        padding: 0.2em 0.4em;
        border: none;
        background: none;
        cursor: pointer;

        border-right: 1px solid var(--color-border);
        box-shadow: 0 1px 2px var(--color-background-mute);
        width: 3.4em;
    }

    .selector-button:hover {
        // background-color: var(--color-background-soft);
        // border: 1px solid var(--color-border-hover);
    }

    .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background-color: var(--color-background-mute);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        margin-top: 0.2em;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
        z-index: 1000;
    }

    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.5em;
        padding: 0.75em 1em;
        width: 100%;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-border);

        &.active {
            color: var(--color-text);
        }

        &:last-of-type {
            border: none;
        }

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

    .icon {

        &.muted {
            opacity: .5;
        }

        img {
            margin: .25em .25em 0 0;
            width: 1.25em;
        }
    }

    .label {
        font-size: 0.9em;
    }

    .chevron {
        font-size: 0.8em;
    }
}
}
</style>
