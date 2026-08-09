<script setup lang="ts">
import { computed } from 'vue';
import HeroPortrait from './HeroPortrait.vue';
import CardColorColumns from './CardColorColumns.vue';
import { useCompanionStore } from '@/stores/companion';
import router from '@/router';
import { RouterLink } from 'vue-router';

const props = defineProps<{ hero: Hero; }>();
const store = useCompanionStore();
const isFavorite = computed(() => store.id === props.hero.id)

function setFavorite(h: Hero) {
    store.reset();
    store.id = h.id;
    router.push({ name: 'player' })
}

function unsetFavorite() {
    store.reset();
}

const cards = computed(() => props.hero.cards);
const spellbook = computed(() => props.hero.spellbook);

</script>

<template>
    <div>
        <RouterLink :to="{ name: 'heroes' }" class="btn-back no-print">
            <span class="btn-back__arrow" aria-hidden="true">&#x2190;</span>
            {{ $t('app.button.back') }}
        </RouterLink>

        <HeroPortrait :hero="hero">
            <template v-slot:actions>
                <button v-if="isFavorite" type="button" class="btn-favorite active" @click="unsetFavorite"
                    :title="$t('app.hero.favorite.remove')" :aria-label="$t('app.hero.favorite.remove')"
                    aria-pressed="true">♥</button>
                <button v-else type="button" class="btn-favorite inactive" @click="() => setFavorite(hero)"
                    :title="$t('app.hero.favorite.add')" :aria-label="$t('app.hero.favorite.add')"
                    aria-pressed="false">♥</button>
            </template>
        </HeroPortrait>

        <CardColorColumns :cards="cards" />

        <div v-if="spellbook && spellbook.length" class="spellbook-container">
            <CardColorColumns :cards="spellbook" />
        </div>
    </div>
</template>

<style lang="scss">
.btn-back {
    display: inline-flex;
    align-items: center;
    gap: .4em;

    margin: 0 0 .5em .25em;
    padding: .35em .9em .35em .7em;

    color: var(--color-text-muted);
    background: var(--color-background-mute);
    border: 1px solid var(--color-border-shadow);
    border-radius: 2em;
    font-size: .95em;
    line-height: 1.4;

    transition: .2s ease;

    .btn-back__arrow {
        transition: transform .2s ease;
        font-size: 1.1em;
        line-height: 1;
    }

    &:hover {
        color: var(--color-text);
        background: var(--color-background-softer);
        border-color: var(--color-border-hover);

        .btn-back__arrow {
            transform: translateX(-3px);
        }
    }
}

.spellbook-container {
    transition: .25s ease-out;
    background: linear-gradient(0deg, var(--color-background-mute) 0%, var(--color-background-highlight) 70%);
    margin: 2px;
    border-radius: 1em;
    border: 1px solid #000;
    box-shadow: 0 0 1px #CCC;

    padding: .5em 1em;
}

.btn-favorite {
    position: absolute;
    top: .05em;
    left: .15em;
    text-decoration: none;
    background: var(--color-background-highlight);
    color: #fff;
    overflow: hidden;
    padding: 0;
    font-family: inherit;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: 1px solid rgba(0, 0, 0, 0.75);
    box-shadow: 0 1px 3px 1px #000;
    transition: .5s ease-out;
    z-index: 10;
    cursor: pointer;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.6);

    font-size: 1.35em;
    width: 1.1em;
    height: 1.1em;
    font-weight: bold;
    line-height: 0.75em;
    border-radius: 1em;

    &.active {
        background: var(--color-background-softer);
        color: rgb(253, 40, 40);
        text-shadow: 0 0 3px rgba(0, 0, 0, 1);
    }

    &:hover {
        color: rgb(255, 90, 90);
    }

    &:not(.active):hover {
        background: #50a0ce;
    }
}
</style>
