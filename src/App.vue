<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import FaqPopup from './components/popups/FaqPopup.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { useCompanionStore } from './stores/companion';
import { computed, onMounted } from 'vue';
import { get } from './data/heroes';
import TimeIndicator from './components/TimeIndicator.vue';
import { useAppStore } from './stores/app';
import { expansions } from './types/Expansion';
import UpdateNotification from './components/UpdateNotification.vue';

const store = useCompanionStore();
const selectedHeroName = computed(() => store.id ? get(store.id)?.name : null);
const build_date = __APP_BUILD_DATE__;
const version_number = __APP_VERSION__;
const repoURL = __APP_REPO__;

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
    <header class="no-print">
        <nav>
            <RouterLink to="/hero">{{ $t('app.header.overview') }}</RouterLink>
            <RouterLink to="/me" :class="{ disabled: !selectedHeroName, 'multi-line': !!selectedHeroName }">
                {{ $t('app.header.dashboard') }}
                <span v-if="selectedHeroName"><br /></span>
                <span v-if="selectedHeroName" class="selected-hero-name">{{ selectedHeroName }}</span>
            </RouterLink>
            <RouterLink to="/settings"><img style="margin-top: .4rem;" src="@/assets/gear.svg" width="24" />
            </RouterLink>


            <div style="position: absolute; top: 2px; right: 8px;">
                <LanguageSwitcher />
            </div>

        </nav>
    </header>

    <div class="content">
        <RouterView />
        <FaqPopup />

        <div class="footer no-print">
            <a :href="`${repoURL}/releases/tag/v${version_number}`">
                Github <img src="/github-mark-white.svg" width=14 />
            </a> &raquo;
            v{{ version_number }} &raquo;
            {{ $t('app.last-update') }}
            <TimeIndicator :date="build_date" />
        </div>
    </div>

    <UpdateNotification />
</template>

<style scoped lang="scss">
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
        width: 100%;
        height: 100%;
        text-align: center;
        background: radial-gradient(circle, rgba(0, 0, 0, 0.25) 25%, rgba(0, 0, 0, 0) 95%);

        @media (max-width: 500px) {
            text-align: left;
            padding-left: 1em;
        }

        a {
            display: inline-block;
            height: 100%;
            line-height: 2rem;
            padding: 0 1rem;
            border-left: 1px solid var(--color-border);
            vertical-align: top;

            &.disabled {
                opacity: 0.5;
                pointer-events: none;
            }

            &.multi-line {
                padding-top: .15em;
                line-height: 1rem;
            }

            &.router-link-exact-active {
                color: var(--color-text);
            }

            &.router-link-exact-active:hover {
                background-color: transparent;
            }

            &:first-of-type {
                border: 0;
            }

            .selected-hero-name {
                font-size: .75em;

            }
        }
    }
}

.content {
    position: relative;
    transition: 0.2s ease;
    padding: 1rem;

    @media (max-width: 1280px) {
        padding: 1rem;
    }

    @media (max-width: 900px) {
        padding: 1rem .6rem;
    }

    @media (max-width: 600px) {
        padding: 1rem .4rem;
    }

    @media (max-width: 480px) {
        padding: .5rem .3rem;
    }

    .footer {
        color: var(--color-border);
        text-align: right;
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
