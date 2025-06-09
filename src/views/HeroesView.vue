<script setup lang="ts">
import { computed, ref } from 'vue';
import { filterHeroesByExpansions, get } from '@/data/heroes'
import HeroIcon from '@/components/icons/HeroIcon.vue'
import router from '@/router';
import { useViewport } from '@/viewport';
import type { Expansion } from '@/types/Expansion';
import HeroOverview from '@/components/HeroOverview.vue';

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
    <div class="hero-selection">
        <Transition :name="'slide-' + (selectedHero ? 'left' : 'right')">
            <div v-if="!selectedHero" class="list">
                <HeroIcon v-for="h of list" :key="h.id" :height="portraitHeight" :name="h.name" :path="h.icon"
                    :onClick="() => router.push({ name: 'heroes', params: { hero: h.id } })" />

            </div>
            <div class="details" v-else>
                <HeroOverview :hero="selectedHero" />
            </div>
        </Transition>
    </div>

</template>

<style lang="scss">
.hero-selection {
    position: relative;
    overflow: hidden;

    .list {
        text-align: center;
        padding: 0 1.25em;

        .hero-icon {
            margin-left: -1.1em;
            margin-right: -1.1em;
            margin-bottom: 0.25em;
        }
    }

    .details,
    .list {
        width: 100%;
    }


    .details.slide-right-leave-active,
    .list.slide-left-leave-active {
        position: absolute;
        transition: all 1s ease-out,
            opacity .75s ease-out .15s;

    }


    .slide-left-enter-active,
    .slide-right-enter-active,
    .slide-left-leave-active,
    .slide-right-leave-active {
        transition: all 1s ease-out;
        min-height: 25vw;
    }

    .slide-left-enter-from {
        opacity: 0;
        transform: translateX(105%);
    }

    .slide-left-leave-to {
        opacity: 0;
        transform: translateX(-105%);
    }

    .slide-right-enter-from {
        opacity: 0;
        transform: translateX(-105%);
    }

    .slide-right-leave-to {
        opacity: 0;
        transform: translateX(105%);
    }


}
</style>
