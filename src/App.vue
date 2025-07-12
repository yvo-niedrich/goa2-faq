<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useViewport } from '@/viewport';
import FaqPopup from './components/popups/FaqPopup.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { useCompanionStore } from './stores/companion';
import { computed, onMounted } from 'vue';
import { get } from './data/heroes';
import TimeIndicator from './components/TimeIndicator.vue';
import { useAppStore } from './stores/app';
import { expansions } from './types/Expansion';

const { width, height, isMobile, isTablet, isDesktop } = useViewport();

const store = useCompanionStore();
const selectedHeroName = computed(() => store.id ? get(store.id)?.name : null);
const debug = false;
const build_date = __APP_BUILD_DATE__;
const FEATURE_REPORT_FAQS = import.meta.env.DEV;


const router = useRouter();
const route = useRoute();
onMounted(async () => {
    await router.isReady();
    const query = route.query;

    if (Object.keys(query).length <= 0) return;

    let qExpansions: string[];
    if (typeof query.expansions === 'string') {
        qExpansions = query.expansions.split(',')
    } else if (Array.isArray(query.expansions)) {
        qExpansions = query.expansions;
    }

    if (!qExpansions || !qExpansions.length) {
        return;
    }

    qExpansions = qExpansions
        .map(e => e.trim())
        .map(e => e.charAt(0).toUpperCase() + e.slice(1).toLocaleLowerCase())
        .filter(e => expansions.includes(e as any));

    if (!qExpansions.length) return;

    const store = useAppStore();
    store.filteredExpansions = qExpansions;

    if (Object.keys(query).length > 0) {
        router.replace({ query: {} });
    }
});

</script>

<template>
    <header>
        <nav>
            <RouterLink to="/hero">{{ $t('app.header.overview') }}</RouterLink>
            <RouterLink to="/me" :class="{ disabled: !selectedHeroName }">
                {{ $t('app.header.dashboard') }}
                <span v-if="selectedHeroName">[{{ selectedHeroName }}]</span>
            </RouterLink>
            <RouterLink v-if="FEATURE_REPORT_FAQS" to="/contribute">+</RouterLink>


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

        <div class="footer">
            {{ $t('app.last-update') }}
            <TimeIndicator :date="build_date" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    header {
        font-size: 1.1em;
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

        @media (max-width: 480px) {
            padding: .5rem .175rem 1rem;
        }

        .footer {
            position: absolute;
            bottom: 3px;
            right: 1.25em;
            font-size: .6rem;
            color: var(--color-border);
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
