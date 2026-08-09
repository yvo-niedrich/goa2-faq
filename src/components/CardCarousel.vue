<script setup lang="ts">
import { computed, ref } from 'vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';

import { useViewport } from '@/viewport';
import HeroCard from '@/components/HeroCard.vue';
import CardSelectPopup from '@/components/popups/CardSelectPopup.vue';

const props = defineProps<{ cards: HandCard[] }>();
const focus = defineModel<number>('focus', { default: 0 });

const viewport = useViewport();

function getVisibleCount(width: number) {
    if (width >= viewport.desktopBoundary) return 3;
    if (width >= viewport.mobileBoundary) return 2;
    return 1;
}

function getSnapAlign(count: number): "center" | "center-even" {
    return count % 2 ? 'center' : 'center-even';
}

function caruselBreakpoint(width: number) {
    const visibleCount = getVisibleCount(width);
    return {
        itemsToShow: visibleCount,
        snapAlign: getSnapAlign(visibleCount),
    };
}

const visibleCount = computed(() => getVisibleCount(viewport.width.value));
const lastIndex = computed(() => props.cards.length - 1);
const isAtStart = computed(() => focus.value <= 0);
const isAtEnd = computed(() => focus.value >= lastIndex.value);

/**
 * Which slides the carousel currently shows. The focused slide sits in the middle
 * except at the two ends, where the carousel stops rather than scrolling past the
 * first / last card.
 */
const windowStart = computed(() => Math.max(0, Math.min(
    focus.value - Math.floor((visibleCount.value - 1) / 2),
    props.cards.length - visibleCount.value,
)));
const windowEnd = computed(() => windowStart.value + visibleCount.value - 1);

const choice = ref<null | { cards: Card[], select: HandCard['modify'] }>(null);

function setNewCard(cards: Card[], select: HandCard['modify']) {
    if (cards.length === 0) return;
    if (cards.length === 1) return select(cards[0]);

    choice.value = { cards, select };
}
</script>

<template>
    <div class="carousel-wrapper">
        <CardSelectPopup v-if="choice?.cards" :cards="choice.cards" :select="choice.select"
            :close="() => choice = null" />

        <Carousel :items-to-show="visibleCount" v-model="focus" :wrap-around="false"
            :snap-align="getSnapAlign(visibleCount)" :breakpoints="{
                0: caruselBreakpoint(0),
                [viewport.mobileBoundary]: caruselBreakpoint(viewport.mobileBoundary),
                [viewport.desktopBoundary]: caruselBreakpoint(viewport.desktopBoundary),
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
                        :class="[`color-${card.data.color}`, { active: index === focus }]" @click="focus = index"
                        :aria-label="card.data.name" :title="card.data.name" :aria-current="index === focus" />
                </div>

            </template>

            <Slide v-for="(card, index) in cards" :key="index" class="slide" :class="{
                'is-left': index === windowStart && index !== focus,
                'is-right': index === windowEnd && index !== focus,
                'is-muted': index < windowStart || index > windowEnd
            }">
                <div class="slide-card-container">

                    <button type="button" class="card-modification upgrade"
                        :class="{ 'disabled': card.upgrades.length === 0 }" :disabled="card.upgrades.length === 0"
                        :title="$t('app.card.upgrade')" :aria-label="`${$t('app.card.upgrade')}: ${card.data.name}`"
                        @click="() => setNewCard(card.upgrades, card.modify)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="5 5 12 12" fill="none">
                            <path d="M6 16L12 10L18 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M6 12L12 6L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>

                    <button type="button" class="card-modification downgrade"
                        :class="{ 'disabled': card.downgrades.length === 0 }" :disabled="card.downgrades.length === 0"
                        :title="$t('app.card.downgrade')" :aria-label="`${$t('app.card.downgrade')}: ${card.data.name}`"
                        @click="() => setNewCard(card.downgrades, card.modify)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="5 7 12 12" fill="none">
                            <path d="M6 8L12 14L18 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M6 12L12 18L18 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>

                    <HeroCard class="card" :card="card.data" />
                </div>

            </Slide>
        </Carousel>
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;

    @media (max-width: 480px) {
        padding: 0 1.5rem;
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
</style>
