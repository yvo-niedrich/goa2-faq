<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import CardColorColumns from './CardColorColumns.vue';

defineProps<{
    cards?: SpellbookCard[];
}>();

</script>

<template>
    <div class="spellbook-container" v-if="cards && cards.length">
        <h2>Spellbook</h2>
        <CardColorColumns :cards="cards" />
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
</style>
