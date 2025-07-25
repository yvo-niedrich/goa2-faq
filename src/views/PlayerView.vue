<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

import router from '@/router';
import { useViewport } from '@/viewport';

import HeroCard from '@/components/HeroCard.vue';
import HeroPortrait from '@/components/HeroPortrait.vue';
import CardSelectPopup from '@/components/popups/CardSelectPopup.vue';
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

</script>

<template>
    <div>
        <HeroPortrait :hero="hero" :level="heroLevel" />

        <CardSelectPopup v-if="choice?.cards" :cards="choice.cards" :select="choice.select"
            :close="() => choice = null" />

        <div class="carousel-wrapper">
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
                            <button class="nav-button prev" :class="{ disabled: isAtStart }"
                                :disabled="isAtStart">&laquo;</button>
                        </template>
                        <template #next>
                            <button class="nav-button next" :class="{ disabled: isAtEnd }"
                                :disabled="isAtEnd">&raquo;</button>
                        </template>
                    </Navigation>

                    <div class="custom-pagination">
                        <button v-for="(card, index) in cards" :key="index" class="pagination-bullet"
                            :class="[`color-${card.data.color}`, { active: index === store.focus }]"
                            @click="store.focus = index" aria-label="Go to slide" />
                    </div>

                    <div class="carousel-mask left" :class="{ 'hidden': isAtStart }" />
                    <div class="carousel-mask right" :class="{ 'hidden': isAtEnd }" />
                </template>



                <Slide v-for="(card, index) in cards" :key="index" class="slide" :class="{
                    'is-left': index === store.focus - 1,
                    'is-right': index === store.focus + Math.floor(visibleCount),
                    'is-muted': index < store.focus - 1 || index > store.focus + Math.floor(visibleCount)
                }">
                    <div class="slide-card-container">

                        <div class="card-modification upgrade" :class="{ 'disabled': card.upgrades.length === 0 }"
                            :title="$t('app.card.upgrade')" @click="() => setNewCard(card.upgrades, card.modify)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="5 5 12 12"
                                fill="none">
                                <path d="M6 16L12 10L18 16" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6 12L12 6L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>


                        </div>
                        <div class="card-modification downgrade" :class="{ 'disabled': card.downgrades.length === 0 }"
                            :title="$t('app.card.downgrade')" @click="() => setNewCard(card.downgrades, card.modify)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="5 7 12 12"
                                fill="none">
                                <path d="M6 8L12 14L18 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M6 12L12 18L18 12" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>

                        <HeroCard class="card" :card="card.data" />
                    </div>

                </Slide>
            </Carousel>
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

    &.left {
        left: 0;
        background: linear-gradient(to right, rgba(var(--color-background-soft-rgb), 0.9), transparent);

        @media (max-width: 480px) {
            opacity: 0;
        }
    }

    &.right {
        right: 0;
        background: linear-gradient(to left, rgba(var(--color-background-soft-rgb), 0.9), transparent);

        @media (max-width: 480px) {
            opacity: 0;
        }
    }

    &.hidden {
        opacity: 0;
    }
}

.nav-button {
    transition: .5s ease-out;

    position: absolute;
    top: 40%;
    transform: translateY(-50%) scaleY(2);
    background: none;
    border: none;
    font-size: 2rem;
    font-weight: 800;
    cursor: pointer;
    color: var(--color-text-dark);
    text-shadow: 0 0 1px #666;
    z-index: 10;
    border-radius: .4rem;
    padding: 2.25rem .25rem;


    &.prev {
        left: -2.15rem;
        background: linear-gradient(to right, rgba(var(--color-heading-bright-rgb), .4), transparent);
        background-position: -1em;
        background-repeat: no-repeat;
    }

    &.next {
        right: -2.15rem;
        background: linear-gradient(to left, rgba(var(--color-heading-bright-rgb), .4), transparent);
        background-position: 1em;
        background-repeat: no-repeat;
    }

    &.prev:hover,
    &.next:hover {
        background-position: 0;
    }

    &.disabled {
        opacity: 0.3;
        pointer-events: none;
    }
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
        height: 1.5em;

        width: 18%;

        max-width: 10em;
        border-radius: .35em;
        opacity: 0.9;
        cursor: pointer;
        border: 1px solid var(--color-border);
        transition: all 0.2s ease-in-out;

        &.active {
            opacity: 1;
            border: 1px solid var(--color-border-dark);
            box-shadow: 0 0 3px #000;
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

        opacity: .5;

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
</style>
