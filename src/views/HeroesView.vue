<script setup lang="ts">
import { computed, ref } from 'vue';
    import { sortByExpansion, filterHeroesByExpansions, get } from '@/data/heroes'
import router from '@/router';
import HeroOverview from '@/components/HeroOverview.vue';
import HeroSelection from '@/components/HeroSelection.vue';
import SearchInput from '@/components/SearchInput.vue';

const props = defineProps<{
    hero?: string;
}>();

const filterExp = ref<string>('');
const filterComplexity = ref<number[]>([]);
const filterName = ref<string>('');

const list = computed(() => filterHeroesByExpansions(filterExp.value)
    .filter(h => filterComplexity.value.length === 0 || filterComplexity.value.includes(h.complexity))
    .filter(h => h.name.toLowerCase().includes(filterName.value.toLowerCase()))
    .sort(sortByExpansion)
);

const selectedHero = computed(() => {
    if (!props.hero) return null;
    try {
        return get(props.hero);
    } catch (e) {
        console.warn(e);
        return null
    }
});

</script>

<template>
    <div class="hero-overview">
        <Transition :name="'slide-' + (selectedHero ? 'left' : 'right')">
            <div class="overview-selection" v-if="!selectedHero">
                <div class="search-bar">
                    <SearchInput v-model="filterName" :placeholder="$t('app.button.search')" />
                </div>
                <HeroSelection :heroes="list"
                    :onClick="(h) => router.push({ name: 'heroes', params: { hero: h.id } })" />
            </div>

            <div class="overview-details" v-else>
                <HeroOverview :hero="selectedHero" />
            </div>
        </Transition>
    </div>
</template>

<style lang="scss">
.hero-overview {
    --animation-transition-time: .5s;

    position: relative;
    overflow: hidden;

    &>* {
        width: 100%;
    }

    .search-bar {
        width: 30em;
        max-width: 80%;
        margin: 0 auto 1em auto;
        text-align: center;
    }

    .overview-details.slide-right-leave-active,
    .overview-selection.slide-left-leave-active {
        position: absolute;
        transition: all var(--animation-transition-time) ease-out,
            opacity .25s ease-out .15s;

    }


    .slide-left-enter-active,
    .slide-right-enter-active,
    .slide-left-leave-active,
    .slide-right-leave-active {
        transition: all var(--animation-transition-time) ease-out;
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
