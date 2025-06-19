<script setup lang="ts">
import { computed } from 'vue';
import HeroCard from '@/components/HeroCard.vue';
import { cardColumn, sortCardsByColor, sortCardsByTier } from '@/data/heroes';
import HeroPortrait from './HeroPortrait.vue';
import { useCompanionStore } from '@/stores/companion';

const props = defineProps<{
    hero: Hero;
}>();

const heroCards = computed(() => props.hero.cards.slice(0).sort((a, b) => {
    return sortCardsByColor(a, b) || sortCardsByTier(a, b);
}).reduce<Card[][]>(
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

        @media (max-width: 1080px) {
            grid-template-columns: repeat(2, 1fr);
            column-gap: 1.5em;
        }

        @media (max-width: 720px) {
            column-gap: .65em;
        }

        @media (max-width: 495px) {
            grid-template-columns: 1fr;

            .hero-card-details {
                margin: 0.75em auto;
            }
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
