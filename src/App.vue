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
            <RouterLink v-if="selectedHeroName" to="/me" class="multi-line">
                {{ $t('app.header.dashboard') }}
                <br />
                <span class="selected-hero-name">{{ selectedHeroName }}</span>
            </RouterLink>
            <span v-else class="nav-link disabled" aria-disabled="true" :title="$t('app.header.dashboard.hint')">
                {{ $t('app.header.dashboard') }}
            </span>
            <RouterLink to="/settings" class="nav-icon" :aria-label="$t('app.header.settings')"
                :title="$t('app.header.settings')">
                <img src="@/assets/gear.svg" width="24" alt="" />
            </RouterLink>

            <div class="nav-language">
                <LanguageSwitcher />
            </div>

        </nav>
    </header>

    <main class="content">
        <div class="view">
            <RouterView />
        </div>
        <FaqPopup />

        <div class="footer no-print">
            <a :href="`${repoURL}/releases/tag/v${version_number}`">
                Github <img src="/github-mark-white.svg" width=14 alt="" />
            </a> &raquo;
            v{{ version_number }} &raquo;
            {{ $t('app.last-update') }}
            <TimeIndicator :date="build_date" />
        </div>
    </main>

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
    flex: none;
    background: rgba(var(--color-background-soft-rgb), .88);
    backdrop-filter: blur(8px) saturate(140%);
    -webkit-backdrop-filter: blur(8px) saturate(140%);

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
            padding-left: .5em;
        }

        .nav-language {
            position: absolute;
            top: 2px;
            right: 8px;

            @media (max-width: 500px) {
                right: 4px;
            }
        }

        .nav-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 .85rem;

            img {
                opacity: .8;
                transition: opacity .2s ease, transform .2s ease;
            }

            &:hover img,
            &.router-link-exact-active img {
                opacity: 1;
            }

            &:hover img {
                transform: rotate(30deg);
            }
        }

        a,
        .nav-link {
            display: inline-block;
            height: 100%;
            line-height: 2rem;
            padding: 0 1rem;
            border-left: 1px solid var(--color-border);
            vertical-align: top;

            &.disabled {
                color: var(--color-text-muted);
                opacity: .7;
                cursor: not-allowed;
                user-select: none;
            }

            &.multi-line {
                padding-top: .15em;
                line-height: 1rem;
            }

            &.router-link-exact-active {
                color: var(--color-text);
                position: relative;
                background-color: rgba(255, 255, 255, .04);
            }

            /* underline the active tab so the current section is obvious at a glance */
            &.router-link-exact-active::after {
                content: "";
                position: absolute;
                left: .5rem;
                right: .5rem;
                bottom: 0;
                height: 2px;
                border-radius: 2px 2px 0 0;
                background: var(--color-text-hyperlink);
            }

            &.router-link-exact-active:hover {
                background-color: rgba(255, 255, 255, .04);
            }

            &:first-child {
                border: 0;
            }

            .selected-hero-name {
                font-size: .75em;
                color: var(--color-heading-bright);
            }
        }
    }
}

.content {
    position: relative;
    transition: 0.2s ease;
    padding: 1rem;

    /* grow to fill the shell so the footer always rests at the bottom */
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .view {
        flex: 1 0 auto;
        min-width: 0;
    }

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
        margin-top: 2rem;
        padding-top: .5rem;
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
