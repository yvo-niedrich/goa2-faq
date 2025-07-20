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
    <div class="hero-card-details" :class="{ [`hero-card-color-${card.color}`]: true, 'has-faq': hasFaq }"
        @click="showFAQs()">
        <h2 class="hero-card-name">{{ card.name }}</h2>
        <div v-if="card.tier" class="hero-card-tier">{{ card.tier }}</div>
        <div class="hero-card-effect-type">
            {{ processCardType(card.type) }}
        </div>
        <div class="hero-card-effect-text">
            <Markdown :text="$t(card.text)" />
        </div>
    </div>
</template>


<style lang="scss">
.hero-card-details {
    flex: auto;
    flex-direction: column;

    max-width: 50vw;
    min-width: 275px;

    position: relative;

    transition: .2s ease;

    margin: 0.75em;
    padding: 1em;
    border: 1px solid #000;
    border-radius: 1em;

    color: var(--color-text-dark);

    &.has-faq {
        cursor: pointer;

        &::before {
            content: "?!";
            position: absolute;
            top: -0.5em;
            left: -0.5em;

            /* Orange badge */
            // border: 1px solid rgba(0, 0, 0, .6);
            background-color: rgba(243, 156, 18, .75);
            color: var(--color-text);
            text-shadow: 0 0 1px rgb(119, 73, 0);

            font-weight: bold;
            font-size: .85em;
            padding: 0.3em 0.5em;
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

    @media (max-width: 1280px) {
        padding: 0.75em;
        margin: 0.75em 0.5em;
    }

    &.hero-card-color-y {
        background: #e3c100;
        background: linear-gradient(180deg, rgb(223, 189, 0) 0%, rgb(255, 228, 75) 75%);
    }

    &.hero-card-color-s {
        background: #b0b0b0;
        background: linear-gradient(180deg, rgb(158, 158, 158) 0%, rgb(209, 209, 209) 75%);
    }

    &.hero-card-color-r {
        background: #cc2f2f;
        background: linear-gradient(180deg, rgb(204, 47, 47) 0%, rgba(255, 89, 89, 1) 75%);
    }

    &.hero-card-color-g {
        background: #1dab1d;
        background: linear-gradient(180deg, rgb(29, 171, 29) 0%, rgba(67, 217, 67, 1) 75%);
    }

    &.hero-card-color-b {
        background: #283db5;
        background: linear-gradient(180deg, rgb(57, 81, 212) 0%, rgb(102, 124, 247) 75%);
    }

    &.hero-card-color-u {
        background: #1c0333;
        background: linear-gradient(180deg, rgb(33, 3, 61) 0%, rgb(104, 73, 119) 38%, rgb(140, 107, 156) 65%);

        .hero-card-name {
            color: white;
        }
    }

    .hero-card-attribute-value {
        margin: .25em 0;
        width: 1.65em;
        text-align: center;
        font-size: 1.5em;
        font-weight: bold;
        border: 1px solid #000;
        border-radius: .5rem;

        background-color: rgba(255, 255, 255, 0.75);
    }

    .hero-card-attribute-value.attribute-initiative {
        margin-top: 0;
        margin-bottom: 1.25em;
    }

    .hero-card-name {
        position: relative;

        text-align: center;
        font-weight: 600;
        font-size: 1.75em;
        line-height: 1.25em;

        color: var(--color-heading-dark);

        top: -5px;
        left: -5px;
        padding-left: 5px;
        padding-top: .3em;

        border-top-left-radius: .25em;
        border-bottom-left-radius: .25em;
    }

    .hero-card-tier {
        position: absolute;
        top: .25em;
        right: .25em;

        width: 1.75em;
        height: 1.5em;

        line-height: 1.4em;
        font-weight: bold;
        text-align: center;

        border-radius: .6em;
        box-shadow: 0 0 3px #e0e0b8;

        background-color: var(--color-background);
        color: var(--color-text);

    }

    .hero-card-effect-type {
        text-align: center;
        margin-bottom: .25em;

        border-top: 1px solid rgba(0, 0, 0, .75);
        border-bottom: 1px solid rgba(0, 0, 0, .75);

        background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 95%);
    }

    .hero-card-effect-text {
        // ...
    }

}
</style>
