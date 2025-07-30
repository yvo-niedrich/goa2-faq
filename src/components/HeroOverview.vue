<script setup lang="ts">
import { computed } from 'vue';
import HeroCard from '@/components/HeroCard.vue';
import { cardColumn } from '@/helper/cards';
import HeroPortrait from './HeroPortrait.vue';
import { useCompanionStore } from '@/stores/companion';

const props = defineProps<{
    hero: Hero;
}>();

const heroCards = computed(() => props.hero.cards.slice(0).reduce<Card[][]>(
    (acc, current) => {
        acc[cardColumn(current)].push(current);
        return acc;
    },
    [[], [], [], []] as Card[][]
))

const store = useCompanionStore();
const isFavorite = computed(() => store.id === props.hero.id)

function setFavorite(h: Hero) {
    store.reset();
    store.id = h.id;
}

function unsetFavorite() {
    store.reset();
}

</script>

<template>
    <div>
        <HeroPortrait :hero="hero">
            <template v-slot:actions>
                <img v-if="isFavorite" class="btn-favorite active" src="@/components/icons/heart.svg" alt="fav"
                    width="36px" @click="unsetFavorite">
                <img v-else class="btn-favorite inactive" src="@/components/icons/heart_inactive.svg" alt="fav"
                    width="36px" @click="() => setFavorite(hero)">
            </template>
        </HeroPortrait>

        <div v-if="['gyd', 'mra', 'sno'].includes(hero.id)" class="construction-site">
            <svg fill="#000000" height="12vw" viewBox="8 5 55 45" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M27.69,34.62l-4.85-7.84.37-.36,1.6,1.37a1.5,1.5,0,0,0,.53,1.93,1.54,1.54,0,0,0,.81.23,1.49,1.49,0,0,0,.87-.27L37,38.2a.62.62,0,0,0,.44.18.64.64,0,0,0,.47-.21.65.65,0,0,0,0-.91L27.8,28.66l5-7.88a1.49,1.49,0,0,0,0-1.62,2.26,2.26,0,0,0-.25-.29L26.74,12a1.5,1.5,0,0,0-1.24-.66h0l-7.67.07a1.22,1.22,0,0,0-1.07.69l-2.37,5.09-.63-.54a.63.63,0,0,0-.9,0,.64.64,0,0,0,0,.91l.93.8-.24.53a1.52,1.52,0,0,0,.59,2,1.42,1.42,0,0,0,.74.2,1.51,1.51,0,0,0,1.27-.7l.78.67L13.4,24.87a2.37,2.37,0,0,0-.76,1.66l-.26,8.58L10.05,45.19A2.35,2.35,0,0,0,11.81,48a2.48,2.48,0,0,0,.54.06,2.35,2.35,0,0,0,2.29-1.83l2.44-10.53.23-7.63,1.4,1,4,6.49-4.38,9.15a2.35,2.35,0,1,0,4.25,2L27.76,36A1.37,1.37,0,0,0,27.69,34.62Z" />
                <circle cx="33.46" cy="12.22" r="4.3" />
                <path
                    d="M61.39,45.33c-1.44-2.1-8.34-15.16-10.12-17s-3.36-2.08-4.44-1.64a6.94,6.94,0,0,0-3,2.24c-1.27,1.73-3,6.91-4.44,9.23a11.08,11.08,0,0,0-.8,1l-.08.06c-1.06.64-4,1.19-5.19,2.4a15.63,15.63,0,0,0-1.92,2.6l-.18.25a8.22,8.22,0,0,1-3.93,3.27l0,.32H60.43C60.66,48.08,63.15,47.9,61.39,45.33Z" />
            </svg>
            <br />
            Work in Progress
        </div>

        <div class="card-column-container">
            <div v-for="(cardColumn, idx) in heroCards" :key="idx">
                <div v-for="card of cardColumn" :key="card.id">
                    <HeroCard :card="card" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.card-column-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 1.5em;
    row-gap: 3em;
    margin: 0 .15em;

    .hero-card-wrapper {
        margin: 1.5em auto;
    }

    @media (max-width: 1280px) {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 2.5em;
    }

    @media (max-width: 720px) {
        column-gap: 1.5em;
    }

    @media (max-width: 580px) {
        grid-template-columns: 1fr;

        .hero-card-wrapper {
            margin: 1em auto;
        }
    }
}

.construction-site {
    background-color: #f6c033;
    border: 3px solid #000;
    color: black;
    font-weight: bold;
    white-space: pre;

    box-shadow:
        4px 4px 1px #f6c033,
        4px -4px 1px #f6c033,
        -4px -4px 1px #f6c033,
        -4px 4px 1px #f6c033;

    border-radius: 1em;
    margin: 2em auto;
    padding: .25em 5em;
    min-width: 250px;
    width: 45%;

    text-align: center;

    svg {
        margin: 0 auto;
    }
}

.btn-favorite {
    cursor: pointer;

    &.inactive {
        opacity: .6;

        &:hover {
            opacity: 1;
        }
    }
}
</style>
