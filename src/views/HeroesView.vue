<script setup lang="ts">
import { computed, ref } from 'vue';
import { filterHeroesByExpansions, get } from '@/data/heroes'
import HeroIcon from '@/components/icons/IconHero.vue'
import router from '@/router';
import { useViewport } from '@/viewport';
import type { Expansion } from '@/types/Expansion';
import HeroCardOverview from '@/components/HeroCardOverview.vue';

const props = defineProps<{
    hero?: string;
}>();

const { isTablet, isDesktop } = useViewport();

const filterExp = ref<Expansion[]>([]);
const filterComplexity = ref<number[]>([]);
const filterName = ref('');

const selectedHero = computed(() => {
    if (!props.hero) return null;
    try {
        return get(props.hero);
    } catch (e) {
        console.warn(e);
        return null
    }
});

const list = computed(() => filterHeroesByExpansions(filterExp.value)
    .filter(h => filterComplexity.value.length === 0 || filterComplexity.value.includes(h.complexity))
    .filter(h => h.name.toLowerCase().includes(filterName.value.toLowerCase()))
);

const portraitHeight = computed(() => isDesktop.value ? 250 : isTablet.value ? 200 : 150);
</script>

<template>
    <div class="list">
        <HeroIcon v-for="h of list" :key="h.id" :height="portraitHeight" :name="h.name" :path="h.icon"
            :class="{ 'hidden': (selectedHero?.id ?? h.id) !== h.id, 'selected': selectedHero?.id === h.id }"
            :onClick="() => router.push({ name: 'heroes', params: { hero: h.id } })" />
    </div>
    <div v-if="selectedHero">
        <HeroCardOverview :hero="selectedHero" />
    </div>
</template>

<style lang="scss">
.list {
    text-align: center;

    .hero-icon {
        margin-right: -2em;
        margin-bottom: 0.25em;
    }
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
