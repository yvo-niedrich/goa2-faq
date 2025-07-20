<script setup lang="ts">
import { markdown } from '@/helper/markdown';
import { computed } from 'vue';

const props = defineProps<{ text: string, inline?: boolean }>();

const supported_icons = [
    'attack',
    'defense',
    'initiative',
    'life_counters',
    'marker_bounty',
    'marker_poison',
    'movement',
    'range',
    'radius',
    'rune_anvil', // TODO: missing
    'rune_axe', // TODO: missing
    'rune_bird', // TODO: missing
    'rune_horn', // TODO: missing
    'skill',
    'tiebreaker_blue',
    'tiebreaker_orange',
    'token_barrier',
    'token_blast',
    'token_dud',
    'token_glitch', // TODO: missing
    'token_grenade',
    'token_ice',
    'token_illusion',
    'token_magma',
    'token_rock', // TODO: missing
    'token_smoke_bomb',
    'token_totem',
    'token_tree',
    'token_zombie' // TODO: missing
];


function replaceIcons(input: string) {
    return input.replace(
        new RegExp(`::(${supported_icons.join('|')})::`, 'g'),
        `![$1](${import.meta.env.BASE_URL}icons/$1.png)`
    );
}

function toMarkdown(input: string) {
    const fn = props.inline ? markdown.parseInline : markdown.parse

    return fn(replaceIcons(input
        .trim()
        .replace(/\n{1,}/g, "\n\n"))
    );
}

const renderedHtml = computed(() => toMarkdown(props.text));
</script>

<template>
    <span class="markdown-container" :class="{ 'contain': !inline }" v-html="renderedHtml" />
</template>

<style lang="scss">
.markdown-container {
    line-height: 1.275rem;

    &.contain {
        display: inline-block;
    }

    ul {
        list-style: disc;
    }

    ol {
        list-style: decimal;
    }

    ol,
    ul {
        padding-left: 1.75em;
        margin-left: 0;
    }

    li {
        margin: .35em 0;
    }

    strong {
        font-weight: bold;
    }

    em {
        font-style: italic;
    }

    p {
        margin: .35em 0;
    }

    hr {
        width: 95%;
        border: 0;
        height: 1px;
        background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
    }

    img {
        margin-top: -0.25em;
        margin-right: 0.15em;
        vertical-align: middle;
        height: 1.5em;
        width: auto;
        filter: drop-shadow(2px 2px 4px #000000);
    }

    .inline-icon-wrapper {
        position: relative;
        display: inline-block;
    }

    /* Hidden large preview */
    .inline-icon-wrapper::after {
        content: '';
        position: absolute;
        top: -125%;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        width: 82px;
        height: 82px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        filter: drop-shadow(1px 1px 10px #000000);
        z-index: 100;
    }

    /* Show on hover */
    .inline-icon-wrapper.show-preview::after,
    .inline-icon-wrapper:hover::after {
        display: block;
        background-image: var(--icon-url);
    }

}
</style>
