<script setup lang="ts">
import { computed } from 'vue';
import { cardColumn } from '@/helper/cards';
import HeroCard from './HeroCard.vue';

const props = defineProps<{
    cards: Card[];
}>();

const columns = computed(() => props.cards.slice(0).reduce<Card[][]>(
    (acc, current) => {
        acc[cardColumn(current)].push(current);
        return acc;
    },
    [[], [], [], []] as Card[][]
));

</script>

<template>
    <div class="card-column-container">
        <div v-for="(column, idx) in columns" :key="idx">
            <div v-for="card of column" :key="card.id">
                <HeroCard :card="card" />
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
</style>
