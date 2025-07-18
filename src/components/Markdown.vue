<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';

const props = defineProps<{ text: string }>();

const supported_icons = [
    'attack_gold', 'attack_red', 'attack_silver', 'defense_blue',
    'defense_silver', 'gold_attack', 'initiative', 'life_counters',
    'marker_bounty', 'marker_poison', 'movement_blue', 'movement_green',
    'movement_silver', 'range_gold', 'range_purple', 'range_red',
    'rune_anvil', 'rune_axe', 'rune_bird', 'rune_horn',
    'skill_silver', 'tiebreaker_blue', 'tiebreaker_orange', 'token_barrier',
    'token_blast', 'token_dud', 'token_glitch', 'token_grenade',
    'token_ice', 'token_illusion', 'token_magma', 'token_rock',
    'token_smoke_bomb', 'token_totem', 'token_tree', 'token_zombie'
]

function replaceIcons(input: string) {
    return input.replace(
        new RegExp(`::(${supported_icons.join('|')})::`, 'g'),
        `![$1](${import.meta.env.BASE_URL}icons/$1.png)`
    );
}

function toMarkdown(input: string) {
    return marked(replaceIcons(input
        .trim()
        .replace(/\n{1,}/g, "\n\n"))
    );
}

const renderedHtml = computed(() => toMarkdown(props.text));
</script>

<template>
    <span class="markdown-container" v-html="renderedHtml" />
</template>

<style lang="scss">
.markdown-container {
    ul {
        list-style: disc;
    }

    ol {
        list-style: decimal;
    }

    ol,
    ul {
        padding-left: 2em;
        margin-left: 0;
    }

    li {
        margin: .25em 0;
    }

    strong {
        font-weight: bold;
    }

    em {
        font-style: italic;
    }

    p {
        margin: .25em 0;
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
    filter: drop-shadow(2px 2px 4px #000000);
}
}
</style>
