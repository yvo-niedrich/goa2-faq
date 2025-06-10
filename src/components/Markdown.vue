<script setup lang="ts">
import { marked } from 'marked';
import { computed } from 'vue';
import { defineProps } from 'vue';

const props = defineProps<{ text: string }>();

// sanitize if needed or trust your input
const renderedHtml = computed(() => marked(props.text.trim().replace(/\n{1,}/g, "\n\n")));
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
}
</style>
