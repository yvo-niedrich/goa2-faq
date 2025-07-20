<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { count as countFaq } from '@/data/faq'
import { useFaqStore } from '@/stores/faq'
import Markdown from './Markdown.vue';

const props = defineProps<{ card: Card; }>();
const hasFaq = computed(() => countFaq(props.card.id) > 0)

function showFAQs() {
    if (hasFaq.value) {
        useFaqStore().show(props.card.id)
    }
}

const { t: $translate } = useI18n();

function processCardType(type: Card['type']) {
    let tt = $translate('app.card-type.' + (type.basic ? 'basic.' : '') + type.type[0]);

    for (let i = 1; i < type.type.length; i++) {
        tt += ' / ' + $translate('app.card-type.' + type.type[i]);
    }

    if (type.ranged) {
        tt += ' \u2014 ' + $translate('app.card-type.ranged')
    }

    return tt;
}

</script>

<template>
    <div class="hero-card" :class="{ [`hero-card-color-${card.color}`]: true, 'has-faq': hasFaq }" @click="showFAQs()">
        <div class="hero-card-name">{{ card.name }}</div>
        <div v-if="card.tier" class="hero-card-tier">{{ card.tier }}</div>
        <div class="hero-card-type">
            {{ processCardType(card.type) }}
        </div>
        <div class="hero-card-text">
            <Markdown :text="$t(card.text)" />
        </div>
    </div>
</template>


<style lang="scss">
.hero-card {
    &.hero-card-color-y {
        --card-background-primary: var(--color-card-y-primary);
        --card-background-secondary: var(--color-card-y-secondary);
    }

    &.hero-card-color-s {
        --card-background-primary: var(--color-card-s-primary);
        --card-background-secondary: var(--color-card-s-secondary);
    }

    &.hero-card-color-r {
        --card-background-primary: var(--color-card-r-primary);
        --card-background-secondary: var(--color-card-r-secondary);
    }

    &.hero-card-color-g {
        --card-background-primary: var(--color-card-g-primary);
        --card-background-secondary: var(--color-card-g-secondary);
    }

    &.hero-card-color-b {
        --card-background-primary: var(--color-card-b-primary);
        --card-background-secondary: var(--color-card-b-secondary);
    }

    &.hero-card-color-u {
        --card-background-primary: var(--color-card-u-primary);
        --card-background-secondary: var(--color-card-u-secondary);
    }

    position: relative;
    flex: auto;
    flex-direction: column;
    transition: .2s ease;

    max-width: 75vw;
    min-width: 275px;

    border: 1px solid #000;

    border-radius: 1em;
    // background: var(--color-background);

    --card-bg-spacing: 2em;
    --card-gb-dark: #2f2e31;
    --card-gb-light: var(--color-background-mute);
    --card-gb-separator: #ddd;
    background-image: linear-gradient(to bottom,
        var(--card-gb-dark) 0,
        var(--card-gb-dark) var(--card-bg-spacing),
        var(--card-gb-separator) var(--card-bg-spacing),
        var(--card-gb-separator) calc(var(--card-bg-spacing) + 1.3px),
        var(--card-gb-light) calc(var(--card-bg-spacing) + 1.3px),
        var(--card-gb-light) calc(100% - var(--card-bg-spacing) - 1.3px),
        var(--card-gb-separator) calc(100% - var(--card-bg-spacing) - 1.3px),
        var(--card-gb-separator) calc(100% - var(--card-bg-spacing)),
        var(--card-gb-dark) calc(100% - var(--card-bg-spacing)),
        var(--card-gb-dark) 100%);

    color: var(--card-text-color);

    padding: 1em .75em;
    margin: 0.75em 0.5em;

    @media (max-width: 1280px) {
        padding: 0.75em 1em;
        margin: 0.75em 0.25em;
    }

    @media (max-width: 480px) {
        margin: 0.75em 0.25em;
    }

    &.has-faq {
        cursor: pointer;

        &::before {
            content: "?!";
            position: absolute;
            top: -0.5em;
            left: -0.5em;

            background-color: rgba(255, 169, 31, 0.75);
            color: var(--color-text);
            text-shadow: 0 0 1px rgb(95, 59, 0);

            font-weight: bold;
            font-size: 1em;
            padding: 0.25em 0.4em 0.3em 0.4em;
            border-radius: 50%;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.75);
            z-index: 1;
            line-height: 1;
        }

        &:hover::before {
            background-color: rgba(243, 156, 18, 1);
            box-shadow: 0 0 2px rgba(0, 0, 0, 1);
        }
    }

    .hero-card-name {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.8em;

        position: relative;
        font-family: 'ModestoPoster', serif;
        font-size: 1.6em;

        color: var(--color-text-dark);
        text-shadow: 0 0 3px #FFFFFF;
        background: #cfccc2;
        background: linear-gradient(180deg, #dbdad5 0%, #b7b4ae 45%, #b7b4ae 55%, #dbdad5 100%);

        border: 2px solid #2b2b2b;
        border-radius: 1em;
        box-shadow:
            inset 0 0 4px #00000066,
            0 4px 8px #00000033;
        margin-bottom: .5em;

        white-space: pre;
        padding: 0 .15em;
    }

    .hero-card-tier {
        position: absolute;

        top: -0.2em;
        right: -0.2em;

        width: 2em;
        height: 1.75em;

        line-height: 1.6em;
        font-weight: bold;
        text-align: center;

        border-radius: .6em;
        box-shadow: 0 0 3px rgba(255, 255, 255, .5);

        background-color: var(--color-background);
        color: var(--color-text);

    }

    .hero-card-type {
        --r: 1em;

        line-height: 1.6em;
        padding-inline: .5em;
        border-inline: var(--r) solid #0000;
        border-radius: calc(2*var(--r)) calc(2*var(--r)) 0 0/var(--r);
        mask:
            radial-gradient(var(--r) at var(--r) 0, #0000 98%, #000 101%) calc(-1*var(--r)) 100%/100% var(--r) repeat-x,
            conic-gradient(#000 0 0) padding-box;
        background: var(--card-background-primary) border-box;

        width: fit-content;
        min-width: 60%;
        text-align: center;
        padding: 0 1.5em;
        font-family: 'ModestoPoster';
        font-size: 1.15em;
        color: #FFFFFF;
        text-shadow: 0 0 8px #000000;
        margin: 0 auto -1px auto;
        z-index: 1;
    }

    .hero-card-text {
        color: #000;
        text-align: center;
        padding: .75em .4em;

        border-top: 1px solid #000;
        box-shadow: 1px 0 2px 1px #FFF;

        background: radial-gradient(circle, var(--card-background-secondary) 20%, rgb(223, 220, 215) 97%);

        border-radius: .75em;
        border: 1px solid #000;
        box-shadow:
            inset 3px 3px 2px var(--card-background-primary),
            inset -3px 3px 2px var(--card-background-primary),
            1px 4px 3px rgba(0, 0, 0, .5);

        ul {
            text-align: left;
        }
    }
}
</style>
