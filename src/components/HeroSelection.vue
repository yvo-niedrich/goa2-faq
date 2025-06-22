<script setup lang="ts">
import { defaultHeroSortFn, heroes as allHeroes } from '@/data/heroes';
import HeroIcon from '@/components/icons/HeroIcon.vue'
import { useViewport } from '@/viewport';
import { computed } from 'vue';

const props = defineProps<{
    'heroes'?: Hero[];
    'onClick'?: (h: Hero) => unknown;
    'scale'?: number
}>();


const list = computed(() => props.heroes || Object.values(allHeroes).sort(defaultHeroSortFn));

const { isTablet, isDesktop } = useViewport();
const portraitHeight = computed(() => isDesktop.value ? 250 : isTablet.value ? 200 : 150);

</script>


<template>
    <div class="list">
        <HeroIcon v-for="h of list" :key="h.id" :height="portraitHeight * (scale || 1)" :name="h.name" :path="h.icon"
            :complexity="h.complexity" :onClick="() => onClick ? onClick(h) : false" />
    </div>
</template>

<style lang="scss">
    .list {

        transition: .5s ease-out;

        text-align: center;
        padding: 0 1.25em;

        @media (max-width: 765px) {
            padding: 0 .5em;
        }

        .hero-icon {
            margin-left: -1.15rem;
            margin-right: -1.15rem;
            margin-bottom: 0.25rem;

            @media (max-width: 1080px) {
                margin-left: -1rem;
                margin-right: -1rem;
            }

            @media (max-width: 765px) {
                margin-left: -.725rem;
                margin-right: -.725rem;
            }
        }
    }
</style>
