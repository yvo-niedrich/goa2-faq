<script setup lang="ts">
import { computed } from 'vue';
import HeroCard from '@/components/HeroCard.vue';

const props = defineProps<{
    hero: Hero;
}>();


function column(c: Card) {
    switch (c.color) {
        case 'y': return 0;
        case 's': return 0.1;
        case 'u': return 0.2;
        case 'r': return 1;
        case 'g': return 2;
        case 'b': return 3;
    }
}


const heroCards = computed(() => props.hero.cards.slice(0).sort((a, b) => {
    const ca = column(a),
        cb = column(b);
    if (ca < cb) return -1;
    if (ca > cb) return 1;
    return a.tier > b.tier ? 1 : -1;
}).reduce<Card[][]>(
    (acc, current) => {
        acc[Math.trunc(column(current))].push(current);
        return acc;
    },
    [[], [], [], []] as Card[][]
))

</script>

<template>
    <div>
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

    @media (max-width: 1280px) {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 2em;
    }
}
</style>
