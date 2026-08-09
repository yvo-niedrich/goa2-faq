<script setup lang="ts">
import Markdown from './Markdown.vue';

defineProps<{ hero: Hero }>();
</script>

<template>
    <Markdown v-if="hero.hasLore" :text="$t(hero.id + '.lore')" class="hero-lore" />
    <hr v-if="hero.hasAdvice && hero.hasLore" />
    <Markdown v-if="hero.hasAdvice" :text="$t(hero.id + '.advice')" class="hero-advice" />
</template>
