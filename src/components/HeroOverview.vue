<script setup lang="ts">
import { computed } from 'vue';
import HeroPortrait from './HeroPortrait.vue';
import CardColorColumns from './CardColorColumns.vue';
import { useCompanionStore } from '@/stores/companion';
import router from '@/router';

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
        <HeroPortrait :hero="hero">
            <template v-slot:actions>
                <div v-if="isFavorite" class="btn-favorite active" @click="unsetFavorite">♥</div>
                <div v-else class="btn-favorite inactive" @click="() => setFavorite(hero)">♥</div>
            </template>
        </HeroPortrait>

        <CardColorColumns :cards="cards" />

        <div v-if="spellbook && spellbook.length" class="spellbook-container">
            <CardColorColumns :cards="spellbook" />
        </div>
    </div>
</template>

<style lang="scss">
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
