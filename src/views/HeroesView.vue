<script setup lang="ts">
import { computed } from 'vue';
import { get } from '@/data/heroes'
import router from '@/router';
import HeroOverview from '@/components/HeroOverview.vue';
import HeroSelection from '@/components/HeroSelection.vue';

const props = defineProps<{ hero?: string; }>();

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
                <HeroSelection :onClick="(h) => router.push({ name: 'heroes', params: { hero: h.id } })" />
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
