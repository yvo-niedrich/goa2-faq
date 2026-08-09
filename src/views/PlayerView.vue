<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

import router from '@/router';
import { useViewport } from '@/viewport';

import HeroCard from '@/components/HeroCard.vue';
import HeroPortrait from '@/components/HeroPortrait.vue';
import CardSelectPopup from '@/components/popups/CardSelectPopup.vue';
import CardColorColumns from '@/components/CardColorColumns.vue';
import { get } from '@/data/heroes';
import { sortCardsByTier, sortCardTiers } from '@/helper/cards';
import { useCompanionStore } from '@/stores/companion';

type CardFn = (c: Card) => boolean | void;

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

function getCard(color: Card['color'], id?: string | null, modifyFn?: CardFn) {
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

const viewport = useViewport();

function getVisibleCount(width: number) {
    if (width >= (viewport.desktopBoundary)) return 3.8;
    if (width >= viewport.mobileBoundary) return 2.5;
    return 1;
}

const visibleCount = computed(() => getVisibleCount(viewport.width.value));
const navigableSlides = computed(() => cards.value.length - Math.floor(visibleCount.value));
const isAtStart = computed(() => store.focus <= 0);
const isAtEnd = computed(() => store.focus >= navigableSlides.value);
const choice = ref<null | { cards: Card[], select: CardFn }>(null);


function setNewCard(cards: Card[], select: CardFn) {
    if (cards.length === 0) return;
    if (cards.length === 1) return select(cards[0]);

    choice.value = { cards, select };
}

/**
 * The edge fades have to follow what is actually clipped, not the focus index:
 * with a fractional items-to-show the last slide still overflows the viewport
 * once the carousel has reached its final snap position.
 */
const carouselWrapper = ref<HTMLElement | null>(null);
const edgeClip = ref({ left: 0, right: 0 });

function measureEdges() {
    const root = carouselWrapper.value;
    const viewport = root?.querySelector('.carousel__viewport');
    if (!viewport) return;

    const v = viewport.getBoundingClientRect();
    let left = 0;
    let right = 0;

    for (const slide of root!.querySelectorAll('.carousel__slide')) {
        const s = slide.getBoundingClientRect();
        // only slides that are partially on screen can be clipped by an edge
        if (s.right <= v.left + 1 || s.left >= v.right - 1) continue;
        left = Math.max(left, v.left - s.left);
        right = Math.max(right, s.right - v.right);
    }

    edgeClip.value = { left: Math.max(0, Math.round(left)), right: Math.max(0, Math.round(right)) };
}

let settleUntil = 0;
let frame = 0;

/** Keep measuring while the slide transition is still running. */
function trackEdges(duration = 600) {
    settleUntil = performance.now() + duration;
    if (frame) return;

    const step = () => {
        measureEdges();
        frame = performance.now() < settleUntil ? requestAnimationFrame(step) : 0;
    };
    frame = requestAnimationFrame(step);
}

function maskWidth(clip: number) {
    return `${Math.min(Math.max(clip * 2.5, 48), 176)}px`;
}

watch(() => [store.focus, viewport.width.value], () => trackEdges());
onMounted(() => trackEdges(1200));
onBeforeUnmount(() => {
    if (frame) cancelAnimationFrame(frame);
});

</script>

<template>
    <div>
        <HeroPortrait :hero="hero" :level="heroLevel">
            <template v-slot:actions>
                <button v-if="heroLevel > 1" type="button" class="btn-reset active" @click="store.resetCards"
                    :title="$t('app.hero.reset')" :aria-label="$t('app.hero.reset')">&#x27F3;</button>
                <button v-else type="button" class="btn-reset inactive" disabled
                    :aria-label="$t('app.hero.reset')">&#x27F3;</button>
            </template>
        </HeroPortrait>

        <CardSelectPopup v-if="choice?.cards" :cards="choice.cards" :select="choice.select"
            :close="() => choice = null" />

        <div class="carousel-wrapper" ref="carouselWrapper">
            <Carousel :items-to-show="visibleCount" :model-value="store.focus"
                @update:modelValue="val => store.focus = Math.min(val, navigableSlides)" :wrap-around="false"
                snap-align="center-even" :breakpoints="{
                    0: { itemsToShow: 1, snapAlign: 'center' },
                    [viewport.mobileBoundary]: { itemsToShow: getVisibleCount(viewport.mobileBoundary), snapAlign: 'center-even' },
                    [viewport.desktopBoundary]: { itemsToShow: getVisibleCount(viewport.desktopBoundary), snapAlign: 'center-even' },
                }" class="carousel">

                <template #addons>
                    <Navigation>
                        <template #prev>
                            <button class="nav-button prev" :class="{ disabled: isAtStart }" :disabled="isAtStart"
                                :aria-label="$t('app.card.previous')" :title="$t('app.card.previous')">&laquo;</button>
                        </template>
                        <template #next>
                            <button class="nav-button next" :class="{ disabled: isAtEnd }" :disabled="isAtEnd"
                                :aria-label="$t('app.card.next')" :title="$t('app.card.next')">&raquo;</button>
                        </template>
                    </Navigation>

                    <div class="custom-pagination">
                        <button v-for="(card, index) in cards" :key="index" type="button" class="pagination-bullet"
                            :class="[`color-${card.data.color}`, { active: index === store.focus }]"
                            @click="store.focus = index" :aria-label="card.data.name" :title="card.data.name"
                            :aria-current="index === store.focus" />
                    </div>

                    <div class="carousel-mask left" :class="{ 'hidden': edgeClip.left < 4 }"
                        :style="{ width: maskWidth(edgeClip.left) }" />
                    <div class="carousel-mask right" :class="{ 'hidden': edgeClip.right < 4 }"
                        :style="{ width: maskWidth(edgeClip.right) }" />
                </template>

                <Slide v-for="(card, index) in cards" :key="index" class="slide" :class="{
                    'is-left': index === store.focus - 1,
                    'is-right': index === store.focus + Math.floor(visibleCount),
                    'is-muted': index < store.focus - 1 || index > store.focus + Math.floor(visibleCount)
                }">
                    <div class="slide-card-container">

                        <button type="button" class="card-modification upgrade"
                            :class="{ 'disabled': card.upgrades.length === 0 }"
                            :disabled="card.upgrades.length === 0" :title="$t('app.card.upgrade')"
                            :aria-label="`${$t('app.card.upgrade')}: ${card.data.name}`"
                            @click="() => setNewCard(card.upgrades, card.modify)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="5 5 12 12"
                                fill="none">
                                <path d="M6 16L12 10L18 16" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6 12L12 6L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>

                        <button type="button" class="card-modification downgrade"
                            :class="{ 'disabled': card.downgrades.length === 0 }"
                            :disabled="card.downgrades.length === 0" :title="$t('app.card.downgrade')"
                            :aria-label="`${$t('app.card.downgrade')}: ${card.data.name}`"
                            @click="() => setNewCard(card.downgrades, card.modify)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="5 7 12 12"
                                fill="none">
                                <path d="M6 8L12 14L18 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M6 12L12 18L18 12" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>

                        <HeroCard class="card" :card="card.data" />
                    </div>

                </Slide>
            </Carousel>
        </div>

        <div v-if="hero.spellbook && hero.spellbook.length" class="spellbook-container">
            <CardColorColumns :cards="hero.spellbook" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.carousel-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    position: relative;
    width: 100%;
    min-width: 320px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 480px) {
        // padding: 0 1rem;
    }
}

.carousel {
    width: 100%;
    margin: 0 auto;
    padding: 1rem 0 0 0;


    @media (max-width: 750px) {
        padding-top: 1rem;
    }

    @media (max-width: 480px) {
        padding-top: .5rem;
    }
}

.slide {
    padding: 0.5rem;
    transition: transform 0.5s ease-out;

    &.is-left {
        transform: perspective(500px) rotateY(25deg) translateX(2em);
    }

    &.is-right {
        transform: perspective(500px) rotateY(-25deg) translateX(-2em);
    }

    &.is-muted {
        opacity: 0.3;
    }
}

.carousel-mask {
    opacity: 1;
    transition: .5s ease-out;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 7em;
    z-index: 2;
    pointer-events: none;

    @media (max-width: 750px) {
        display: none;
    }

    /* width is bound inline: it tracks how much of the edge slide is actually clipped */
    width: 12em;

    &.left {
        left: 0;
        background: linear-gradient(to right,
                rgb(var(--color-background-soft-rgb)) 0%,
                rgb(var(--color-background-soft-rgb)) 25%,
                rgba(var(--color-background-soft-rgb), .6) 55%,
                transparent 100%);

        @media (max-width: 480px) {
            opacity: 0;
        }
    }

    &.right {
        right: 0;
        background: linear-gradient(to left,
                rgb(var(--color-background-soft-rgb)) 0%,
                rgb(var(--color-background-soft-rgb)) 25%,
                rgba(var(--color-background-soft-rgb), .6) 55%,
                transparent 100%);

        @media (max-width: 480px) {
            opacity: 0;
        }
    }

    &.hidden {
        opacity: 0;
    }
}

.nav-button {
    transition: .25s ease-out;

    position: absolute;
    top: 40%;
    transform: translateY(-50%);

    /* readable, thumb-sized controls instead of near-invisible dark glyphs */
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2.4rem;
    height: 4.5rem;
    padding: 0;

    border: 1px solid var(--color-border);
    border-radius: .5rem;
    background: rgba(var(--color-background-rgb), .75);

    font-size: 2rem;
    font-weight: 800;
    line-height: 1;
    cursor: pointer;
    color: var(--color-heading-bright);
    text-shadow: 0 1px 2px #000;
    z-index: 10;

    @media (max-width: 480px) {
        width: 2rem;
        height: 3.5rem;
        font-size: 1.6rem;
    }

    &.prev {
        left: -2.15rem;
    }

    &.next {
        right: -2.15rem;
    }

    &:hover {
        background: rgba(var(--color-background-highlight-rgb), .85);
        border-color: var(--color-border-highlight);
        color: #fff;
    }

    &.disabled {
        opacity: 0.25;
        pointer-events: none;
    }
}

.spellbook-container {
    transition: .25s ease-out;
    background: linear-gradient(0deg, var(--color-background-mute) 0%, var(--color-background-highlight) 70%);
    margin: 2px;
    border-radius: 1em;
    border: 1px solid #000;
    box-shadow: 0 0 1px #CCC;

    padding: .5em 1em;
}

.custom-pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1.25rem 2.5rem;


    @media (max-width: 750px) {
        margin: 1.15rem 1.5rem;
    }


    @media (max-width: 480px) {
        margin: 1rem;
    }

    .pagination-bullet {
        height: 1.75em;

        width: 18%;

        max-width: 10em;
        border-radius: .35em;
        opacity: 0.55;
        cursor: pointer;
        border: 1px solid var(--color-border);
        transition: all 0.2s ease-in-out;

        &:hover {
            opacity: .85;
        }

        /* the selected colour reads as raised and fully saturated */
        &.active {
            opacity: 1;
            border: 1px solid #000;
            box-shadow:
                0 0 0 1px var(--color-border-highlight),
                0 2px 6px rgba(0, 0, 0, .7);
            transform: translateY(-2px);
        }

        &.color-y {
            background-color: var(--color-card-y-primary);
        }

        &.color-s {
            background-color: var(--color-card-s-primary);
        }

        &.color-r {
            background-color: var(--color-card-r-primary);
        }

        &.color-g {
            background-color: var(--color-card-g-primary);
        }

        &.color-b {
            background-color: var(--color-card-b-primary);
        }

        &.color-u {
            background-color: var(--color-card-u-primary);
        }
    }
}

.slide-card-container {
    height: 100%;
    position: relative;
    padding: 2rem 0.15rem;

    @media (max-width: 768px) {
        padding: 2rem 1rem;
    }

    .card-modification {
        transition: .5s ease-out;
        text-align: center;
        position: absolute;
        vertical-align: text-bottom;
        width: 45%;
        margin: 0 auto;
        left: 50%;
        transform: translate(-50%, 0);
        cursor: pointer;
        height: 2rem;

        padding: 0;
        border: 0;
        color: var(--color-text);
        opacity: .7;

        &>* {
            vertical-align: text-bottom;
        }

        &:hover {
            opacity: 1;
        }

        &.downgrade {
            bottom: 0;

            border-bottom: 1px solid var(--color-background);
            border-left: 1px solid var(--color-background);
            border-right: 1px solid var(--color-background);
            border-bottom-right-radius: 1em;
            border-bottom-left-radius: 1em;

            background: linear-gradient(to top, rgba(var(--color-background-highlight-rgb), 0.5), transparent);


            &:hover svg {
                transform: translateY(7px);
            }
        }

        &.upgrade {
            top: 0;

            border-top: 1px solid var(--color-background);
            border-left: 1px solid var(--color-background);
            border-right: 1px solid var(--color-background);
            border-top-right-radius: 1em;
            border-top-left-radius: 1em;


            background: linear-gradient(to bottom, rgba(var(--color-background-highlight-rgb), 0.5), transparent);

            &:hover svg {
                transform: translateY(-7px);
            }
        }

        &.downgrade.disabled,
        &.upgrade.disabled {
            opacity: 0;
            background: none;
            border: none;
            cursor: default;
        }

        svg {
            transition: 0.5s ease-out;
        }
    }
}

.card {
    margin: 0;
    user-select: none;
    touch-action: pan-y;

    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.65);
    height: 100%;
    align-items: center;
    justify-content: center;

}

.btn-reset {
    position: absolute;
    top: .05em;
    left: .15em;
    text-decoration: none;
    background: var(--color-background-highlight);
    color: #fff;
    overflow: hidden;
    padding: 0;
    font-family: inherit;
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
    border-radius: 1em;
    line-height: 0.75;

    padding-bottom: .175em;

    &.active {
        opacity: 0.9;
        background: var(--color-background-softer);
        text-shadow: 0 0 3px rgba(0, 0, 0, 1);

        &:hover {
            color: rgb(190, 190, 190);
        }
    }

    &:not(.active):hover {
        background: #50a0ce;
    }

    &.inactive {
        opacity: 0.3;
    }
}
</style>
