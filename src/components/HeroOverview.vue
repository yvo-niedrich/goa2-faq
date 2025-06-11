<script setup lang="ts">
import { computed } from 'vue';
import HeroCard from '@/components/HeroCard.vue';
import HeroIcon from '@/components/icons/HeroIcon.vue';
import { useViewport } from '@/viewport';
import HeroStat from './HeroStat.vue';

const props = defineProps<{
    hero: Hero;
}>();


const { isTablet, isDesktop } = useViewport();
const portraitHeight = computed(() => isDesktop.value ? 380 : isTablet.value ? 300 : 240);


function column(c: Card) {
    switch (c.color) {
        case 'y': return 0;
        case 's': return 0.1;
        case 'u': return 0.2;
        case 'r': return 1;
        case 'g': return 2;
        case 'b': return 3;
    }
}


const heroCards = computed(() => props.hero.cards.slice(0).sort((a, b) => {
    const ca = column(a),
        cb = column(b);
    if (ca < cb) return -1;
    if (ca > cb) return 1;
    return a.tier > b.tier ? 1 : -1;
}).reduce<Card[][]>(
    (acc, current) => {
        acc[Math.trunc(column(current))].push(current);
        return acc;
    },
    [[], [], [], []] as Card[][]
))

</script>

<template>
    <div>
        <div class="hero-portrait">
            <HeroIcon :height="portraitHeight" :name="hero.name" :path="hero.icon" />
            <div>
                <h2>
                    <span class="hero-class">{{ $t(hero.class) }}</span>
                    <span class="hero-complexity">
                        <template v-for="index in 5" :key="index">
                            {{ Math.abs(index - 5) < hero.complexity ? '&starf;' : '&star;' }} </template>
                    </span>
                </h2>
                <div class="hero-stats">
                    <HeroStat name="Attack" :value="hero.stats.attack" />
                    <HeroStat name="Defense" :value="hero.stats.defense" />
                    <HeroStat name="Initiative" :value="hero.stats.initiative" />
                    <HeroStat name="Movement" :value="hero.stats.movement" />
                </div>
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse harum officia deserunt velit
                    voluptates nisi magnam,
                    veritatis consequatur in qui, quibusdam fugit accusantium commodi praesentium provident sunt eum
                    eaque optio.
                </div>
            </div>

        </div>
        <div class="card-column-container">
            <div v-for="(cardColumn, idx) in heroCards" :key="idx">
                <div v-for="card of cardColumn" :key="card.id">
                    <HeroCard :card="card" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.hero-portrait {
    transition: .25s ease-out;
    background: linear-gradient(0deg, var(--color-background-highlight) 30%, var(--color-background-mute) 90%);
    margin: 2px;
    border-radius: 1em;
    border: 1px solid #000;
    box-shadow: 0 0 1px #CCC;

    padding: 1em;

    display: grid;
    grid-template-columns: auto 1fr;

    @media (max-width: 720px) {
        font-size: .85em;
    }

    h2 {
        @media (max-width: 720px) {
            margin-top: -.2em;
        }

        position: relative;
        border-bottom: 1px solid gray;

        .hero-class {
            color: var(--color-text-highlight);
            font-style: italic;
            font-weight: 200;
            padding-left: .75em;
        }

        .hero-complexity {
            position: absolute;
            top: 0em;
            right: .5em;


            color: yellow;
            text-shadow: 0 0 2px #000;
            font-size: 1.5em;
            line-height: .9em;
        }


    }

    .hero-stats {
        transition: .5 ease-out;
        margin: 1em 2em;
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 10%;

        @media (max-width: 1180px) {
            margin: .75em 1.5em;
            column-gap: 7.5%;
        }


        @media (max-width: 920px) {
            margin: .75em .5em;
            column-gap: 5%;
        }

        @media (max-width: 720px) {
            grid-template-columns: 1fr;
            margin: .5em .25em;
        }

    }


}

.card-column-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    @media (max-width: 1180px) {
        grid-template-columns: repeat(2, 1fr);
        column-gap: 2em;
    }

    @media (max-width: 720px) {
        column-gap: .75em;
    }
}
</style>
