<script setup lang="ts">
import { useViewport } from '@/viewport';
import { computed } from 'vue';
import HeroStat from './HeroStat.vue';
import HeroIcon from './icons/HeroIcon.vue';

defineProps<{
    hero: Hero;
}>();

const { isTablet, isDesktop } = useViewport();
    const portraitHeight = computed(() => isDesktop.value ? 380 : isTablet.value ? 300 : 200);
</script>

<template>
    <div class="hero-portrait">
        <HeroIcon :height="portraitHeight" :name="hero.name" :path="hero.icon">
            <template v-slot:top-left>
                <slot name="actions" />
            </template>
        </HeroIcon>
        <div>
            <h2>
                <span class="hero-class">{{ $t(hero.class) }}</span>
                <span class="hero-complexity">
                    <template v-for="index in 5" :key="index">
                        {{ Math.abs(index - 5) < hero.complexity ? '&starf;' : '&star;' }} </template>
                </span>
            </h2>
            <div class="hero-stats">
                <HeroStat :name="$t('app.stat.attack')" :value="hero.stats.attack" />
                <HeroStat :name="$t('app.stat.defense')" :value="hero.stats.defense" />
                <HeroStat :name="$t('app.stat.initiative')" :value="hero.stats.initiative" />
                <HeroStat :name="$t('app.stat.movement')" :value="hero.stats.movement" />
            </div>
            <div v-if="isDesktop || isTablet">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse harum officia deserunt velit
                voluptates nisi magnam,
                veritatis consequatur in qui, quibusdam fugit accusantium commodi praesentium provident sunt eum
                eaque optio.
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

        @media (max-width: 500px) {
            padding: .75em;
        }

        h2 {
            position: relative;
            border-bottom: 1px solid gray;

            @media (max-width: 720px) {
                margin-top: -.2em;
            }

            @media (max-width: 500px) {
                padding-top: .75em;
            }

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
                font-size: 1.25em;
                line-height: 1em;

                @media (max-width: 500px) {
                    right: 0;
                    font-size: 1.1em;
                }
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
</style>
