<script setup lang="ts">
import { computed, watch } from 'vue';

import router from '@/router';

import CardCarousel from '@/components/CardCarousel.vue';
import HeroPortrait from '@/components/HeroPortrait.vue';
import HeroActionButton from '@/components/HeroActionButton.vue';
import CardColorColumns from '@/components/CardColorColumns.vue';
import { get } from '@/data/heroes';
import { sortCardsByTier, sortCardTiers } from '@/helper/cards';
import { useCompanionStore } from '@/stores/companion';

const store = useCompanionStore();

watch(store, () => {
    if (!store.id) {
        router.push({ name: 'heroes' });
    }
})

const hero = computed(() => get(store.id || 'xar'));
const hCards = computed(() => hero.value.cards.slice(0).sort(sortCardsByTier).reduce((acc, card) => {
    if (!acc.hasOwnProperty(card.color)) { acc[card.color] = []; }
    acc[card.color].push(card);
    return acc;
}, {} as { [color: string]: Card[] }));

function arrayUnique<T>(value: T, index: number, array: T[]): boolean {
    return array.indexOf(value) === index;
}

function getUpgrades(list: Card[], card: Card) {
    const options = list.map(c => c.tier).filter(t => sortCardTiers(t, card.tier) > 0).filter(arrayUnique).sort(sortCardTiers);
    return list.filter(c => options.length && c.tier === options[0]);
}

function getDowngrades(list: Card[], card: Card) {
    const options = list.map(c => c.tier).filter(t => sortCardTiers(t, card.tier) < 0).filter(arrayUnique).sort(sortCardTiers);
    return list.filter(c => options.length && c.tier === options[options.length - 1]);
}

function getCard(color: Card['color'], id?: string | null, modifyFn?: HandCard['modify']): HandCard {
    const card = id ? hCards.value[color].find(c => c.id === id) : hCards.value[color][0];
    const upgrades = getUpgrades(hCards.value[color], card);
    const downgrades = getDowngrades(hCards.value[color], card);

    return { data: card, upgrades, downgrades, modify: modifyFn || (() => null) };
}

const cards = computed(() => [
    getCard('y', store.gold, (card: Card) => { store.gold = card.id }),
    getCard('s', store.silver, (card: Card) => { store.silver = card.id }),
    getCard('r', store.red, (card: Card) => { store.red = card.id }),
    getCard('g', store.green, (card: Card) => { store.green = card.id }),
    getCard('b', store.blue, (card: Card) => { store.blue = card.id }),
    getCard('u'),
]);

function tierToLevel(t: string | null) {
    if (t === 'II') return 1;
    if (t === 'III') return 2;
    return 0;
}

const heroLevel = computed(() => cards.value.reduce((agg, card) => agg + tierToLevel(card.data.tier), 1))
</script>

<template>
    <div>
        <HeroPortrait :hero="hero" :level="heroLevel">
            <template v-slot:actions>
                <HeroActionButton icon="reset" :label="$t('app.hero.reset')" :disabled="heroLevel <= 1"
                    @click="store.resetCards" />
            </template>
        </HeroPortrait>

        <CardCarousel :cards="cards" v-model:focus="store.focus" />

        <div v-if="hero.spellbook && hero.spellbook.length" class="spellbook-container">
            <CardColorColumns :cards="hero.spellbook" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.spellbook-container {
    transition: .25s ease-out;
    background: linear-gradient(0deg, var(--color-background-mute) 0%, var(--color-background-highlight) 70%);
    margin: 2px;
    border-radius: 1em;
    border: 1px solid #000;
    box-shadow: 0 0 1px #CCC;

    padding: .5em 1em;
}

</style>
