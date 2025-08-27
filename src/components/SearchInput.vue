<script setup lang="ts">

import { expansions as expansionsAvailable } from '@/data/heroes'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

defineProps<{ placeholder?: string; }>();

const name = defineModel<string>('name', { required: true });
const expansions = defineModel<string[] | null>('expansions', { required: false, default: null });
const layout = defineModel<string>('layout', { required: false, default: null });

const expOpen = ref(false);
const layoutOpen = ref(false);
const dropdownExpRef = ref(null);
const dropdownLayoutRef = ref(null);
const count = computed(() => expansionsAvailable.filter(v => expansions.value.includes(v)).length);

function toggleExp() {
    expOpen.value = !expOpen.value;
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

function toggleLayout() {
    layoutOpen.value = !layoutOpen.value;
}

function selectLayout(v: string) {
    layout.value = v;
    layoutOpen.value = false;
}

function handleClickOutside(event) {
    if (dropdownExpRef.value && !dropdownExpRef.value.contains(event.target)) {
        expOpen.value = false;
    }
    if (dropdownLayoutRef.value && !dropdownLayoutRef.value.contains(event.target)) {
        layoutOpen.value = false;
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

            <div v-if="expansions !== null" class="search-input__selector  selector-left">
                <div ref="dropdownExpRef" class="selector">
                    <button class="selector-button" @click="toggleExp">
                        <span class="icon" :class="{ 'muted': count === 0 }"><img src="@/assets/stack.svg"></span>
                        <span class="label">{{ count || '\xA0' }}</span>
                        <span class="chevron">▾</span>
                    </button>

                    <div v-if="expOpen" class="dropdown">
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

            <div v-if="expansions !== null" class="search-input__selector selector-right">
                <div ref="dropdownLayoutRef" class="selector">
                    <button class="selector-button" @click="toggleLayout">
                        <span class="chevron">
                            <svg height="18px" viewBox="5.5 1 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16.0686 15H7.9313C7.32548 15 7.02257 15 6.88231 15.1198C6.76061 15.2238 6.69602 15.3797 6.70858 15.5393C6.72305 15.7232 6.93724 15.9374 7.36561 16.3657L11.4342 20.4344C11.6323 20.6324 11.7313 20.7314 11.8454 20.7685C11.9458 20.8011 12.054 20.8011 12.1544 20.7685C12.2686 20.7314 12.3676 20.6324 12.5656 20.4344L16.6342 16.3657C17.0626 15.9374 17.2768 15.7232 17.2913 15.5393C17.3038 15.3797 17.2392 15.2238 17.1175 15.1198C16.9773 15 16.6744 15 16.0686 15Z"
                                    stroke="#222" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                    fill="#444" />
                                <path
                                    d="M7.9313 9.00005H16.0686C16.6744 9.00005 16.9773 9.00005 17.1175 8.88025C17.2393 8.7763 17.3038 8.62038 17.2913 8.46082C17.2768 8.27693 17.0626 8.06274 16.6342 7.63436L12.5656 3.56573C12.3676 3.36772 12.2686 3.26872 12.1544 3.23163C12.054 3.199 11.9458 3.199 11.8454 3.23163C11.7313 3.26872 11.6323 3.36772 11.4342 3.56573L7.36561 7.63436C6.93724 8.06273 6.72305 8.27693 6.70858 8.46082C6.69602 8.62038 6.76061 8.7763 6.88231 8.88025C7.02257 9.00005 7.32548 9.00005 7.9313 9.00005Z"
                                    stroke="#222" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                                    fill="#444" />
                            </svg>
                        </span>
                    </button>

                    <div v-if="layoutOpen" class="dropdown">
                        <button v-for="l in ['box', 'complexity', 'name']" :key="l" class="dropdown-item"
                            :class="{ 'active': layout === l }" @click="selectLayout(l)">
                            <span class="label">{{ $t('app.sortby.' + l) }}</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.search-input {
    width: 100%;
    max-width: 32rem;

    --border-color: rgb(30, 30, 30);
    --border-color-focus: rgb(0, 0, 0);

    border-radius: .65em;
    box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, .25);

    &__wrapper {
        display: flex;
        align-items: center;
        position: relative;
    }

    &__field {
        flex: 1;
        height: 2.5em;
        padding: 0.5em 1.5em 0.5em 1em;
        border-radius: .65em;
        outline: none;
        line-height: 1.5em;
        padding-left: 4.25em;
        background-color: #FFFFFF;

        border: 1px solid var(--border-color);

        &:focus {
            border: 1px solid var(--border-color-focus);
        }
    }

    &__icon {
        position: absolute;
        left: auto;
        right: 2.75em;
        top: 50%;
        transform: translateY(-50%);
        width: 1.5em;
        height: 1.5em;
        color: #9ca3af;
        pointer-events: none;
    }

    &__selector {
        position: absolute;
        top: 0;

        &.selector-left {
            left: 0;
        }

        &.selector-right {
            right: -1px;

            height: 100%;
            border-top-right-radius: .65em;
            border-bottom-right-radius: .65em;

            background-color: #eeeeee;
            border: 1px solid black;
            border-left: 0;
        }


        .selector {
            position: relative;
            display: inline-block;
            font-family: sans-serif;
        }

        &.selector-left .selector-button {
            // border-right: 1px solid var(--color-border-hover);
            box-shadow: 2px 0 2px -1px var(--color-background-mute);
        }

        &.selector-right .selector-button {
            // border-left: 1px solid var(--color-border);
            box-shadow: -2px 0 3px -1px var(--color-background-mute);
        }

        &.selector-right .chevron {
            padding: 0 .3em 0 .15em;
        }

        .selector-button {
            height: 2.5em;
            display: flex;
            align-items: center;
            padding: 0.2em 0.5em;
            border: none;
            background: none;
            cursor: pointer;
        }

        &.selector-left .dropdown {
            left: 0;
        }

        &.selector-right .dropdown {
            right: 0;
        }

        .dropdown {
            position: absolute;
            top: 100%;
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
            color: var(--color-text-muted);

            &.active {
                color: var(--color-text);
                text-shadow: 0 0 4px #000;
                background-color: rgba(255, 255, 255, 0.1);
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
            font-size: 0.95em;
        }

        .chevron {
            font-size: 0.8em;
        }
    }
}
</style>
