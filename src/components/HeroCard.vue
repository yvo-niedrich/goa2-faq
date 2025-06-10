<script setup lang="ts">
import { toString as typeToString } from '@/types/CardType';
import { count as countFaq } from '@/data/faq'
import { useFaqStore } from '@/stores/faq'
import { computed } from 'vue';
import Markdown from './Markdown.vue';


const props = defineProps<{ card: Card; }>();
const hasFaq = computed(() => countFaq(props.card.id) > 0)

function showFAQs() {
    if (hasFaq.value) {
        useFaqStore().show(props.card.id)
    }
}

</script>

<template>
    <div class="card-details" :class="{ [`card-color-${card.color}`]: true, 'has-faq': hasFaq }" @click="showFAQs()">
        <h2 class="card-name">{{ card.name }}</h2>
        <div v-if="card.tier" class="card-level">{{ card.tier }}</div>
        <div class="card-effect-type">{{ typeToString(card.type) }}</div>
        <div class="card-effect-text">
            <Markdown :text="$t(card.text)" />
        </div>
    </div>
</template>


<style lang="scss">
.card-details {
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
        padding-bottom: 1.75em;
        cursor: pointer;

        &::after {
            transition: .5s ease-out;
            content: '?!';

            position: absolute;
            bottom: .5em;
            right: .5em;

            background: #ffffff50;
            box-shadow: 0 0 2px #FFFFFF50;

            border: 1px solid black;
            padding: 0 .35em;
            border-radius: .5em;
        }

        &:hover::after {
            background: #e01919;
        }
    }


    @media (max-width: 1280px) {
        padding: 0.75em;
        margin: 0.75em 0.5em;
    }

    &.card-color-y {
        background: #e3c100;
        background: linear-gradient(180deg, rgb(223, 189, 0) 0%, rgb(255, 228, 75) 75%);
    }

    &.card-color-s {
        background: #b0b0b0;
        background: linear-gradient(180deg, rgb(158, 158, 158) 0%, rgb(209, 209, 209) 75%);
    }

    &.card-color-r {
        background: #cc2f2f;
        background: linear-gradient(180deg, rgba(204, 47, 47, 1) 0%, rgba(255, 89, 89, 1) 75%);
    }

    &.card-color-g {
        background: #1dab1d;
        background: linear-gradient(180deg, rgba(29, 171, 29, 1) 0%, rgba(67, 217, 67, 1) 75%);
    }

    &.card-color-b {
        background: #283db5;
        background: linear-gradient(180deg, rgb(57, 81, 212) 0%, rgb(102, 124, 247) 75%);
    }

    &.card-color-u {
        background: #1c0333;
        background: linear-gradient(180deg, rgb(33, 3, 61) 0%, rgb(104, 73, 119) 38%, rgb(140, 107, 156) 65%);

        .card-name {
            color: white;
        }
    }

    .card-attribute-value {
        margin: .25em 0;
        width: 1.65em;
        text-align: center;
        font-size: 1.5em;
        font-weight: bold;
        border: 1px solid #000;
        border-radius: .5rem;

        background-color: rgba(255, 255, 255, 0.75);
    }

    .card-attribute-value.attribute-initiative {
        margin-top: 0;
        margin-bottom: 1.25em;
    }

    .card-name {
        font-weight: 600;
        font-size: 1.75em;

        color: var(--color-heading-dark);
        position: relative;

        top: -5px;
        left: -5px;
        padding-left: 5px;


        border-top-left-radius: .25em;
        border-bottom-left-radius: .25em;
    }

    .card-level {
        position: absolute;
        top: .4em;
        right: .4em;

        width: 2em;
        height: 2em;
        padding-top: 2px;

        background-color: #000;
        border-radius: .95em;
        color: #FFF;
        font-weight: bold;
        text-align: center;
        box-shadow: 0 0 3px #BBB;
    }

    .card-effect-type {
        text-align: center;
        margin-bottom: .25em;

        border-top: 1px solid rgba(0, 0, 0, .8);
        border-bottom: 1px solid rgba(0, 0, 0, .4);

        background: radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 95%);
    }

    // .card-effect-text {
    //     white-space: pre-wrap;
    //     word-wrap: break-word;
    //     font-family: inherit;
    // }

}
</style>
