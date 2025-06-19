<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useViewport } from '@/viewport';
import FaqPopup from './components/popups/FaqPopup.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { useCompanionStore } from './stores/companion';
import { computed } from 'vue';
import { get } from './data/heroes';

const { width, height, isMobile, isTablet, isDesktop } = useViewport();

const store = useCompanionStore();
const selectedHeroName = computed(() => store.id ? get(store.id)?.name : null);
const debug = false;

</script>

<template>
    <header>
        <nav>
            <RouterLink to="/hero">{{ $t('app.header.overview') }}</RouterLink>
            <RouterLink to="/me" :class="{ disabled: !selectedHeroName }">
                {{ $t('app.header.dashboard') }}
                <span v-if="selectedHeroName">[{{ selectedHeroName }}]</span>
            </RouterLink>


            <div style="position: absolute; top: 3px; right: 5px;">
                <LanguageSwitcher />
            </div>

        </nav>
    </header>

    <div v-if="debug" class="debug">
        <p>Width: {{ width }}</p>
        <p>Height: {{ height }}</p>
        <p>Mobile: {{ isMobile }}</p>
        <p>Tablet: {{ isTablet }}</p>
        <p>Desktop: {{ isDesktop }}</p>
    </div>

    <div class="content">
        <RouterView />
        <FaqPopup />
    </div>
</template>

<style lang="scss" scoped>
header {
    height: 2.5rem;
    text-align: center;

    width: 100%;
    position: sticky;
    top: 0;
    background: rgba(var(--color-background-soft-rgb), .8);

    z-index: 10;
    border-bottom: 1px solid black;
    box-shadow: 0 1px 0 rgba(180, 180, 180, .5);

    .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }

    .logo {
        display: inline-block;
    }

    nav {
        padding: .2rem;
        width: 100%;
        height: 100%;
        text-align: center;
        background: radial-gradient(circle, rgba(0, 0, 0, 0.25) 25%, rgba(0, 0, 0, 0) 95%);

        a.disabled {
            opacity: 0.5;
            pointer-events: none;
        }

        a.router-link-exact-active {
            color: var(--color-text);
        }

        a.router-link-exact-active:hover {
            background-color: transparent;
        }

        a {
            display: inline-block;
            height: 100%;
            padding: .2em 1rem;
            border-left: 1px solid var(--color-border);
            vertical-align: top;
        }

        a:first-of-type {
            border: 0;
        }

        @media (max-width: 500px) {
            text-align: left;
            padding-left: 1em;
        }
    }
}

.content {
    position: relative;
    transition: 0.2s ease;
    padding: 1rem 2rem 2rem 2rem;

    @media (max-width: 1280px) {
        padding: 1rem;
    }

    @media (max-width: 900px) {
        padding: 1rem .5rem;
    }

    @media (max-width: 600px) {
        padding: 1rem .25rem;
    }
}

.debug {
    position: fixed;
    top: 5px;
    right: 5px;
    z-index: 20;

    opacity: .75;

    background: var(--color-background);
    border: 1px solid var(--color-border);
    padding: 4px 6px;
    border-radius: 1em;
    font-size: 12px;
}
</style>
