<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/stores/app'
import { get as getFAQs } from '@/data/faq'
import Markdown from '../Markdown.vue';

const appStore = useAppStore()

const records = computed(() => {
    if (!appStore.currentFaqCardId) return [];
    return getFAQs(appStore.currentFaqCardId);
});

</script>

<template>
    <Teleport to="body">
        <div v-if="records.length > 0" class="faq-overlay" @click.self="appStore.$closeFaq">
            <div class="faq-popup">
                <button class="close-btn" @click="appStore.$closeFaq">×</button>
                <div class="scroll-container">
                    <div class="faq-scroll">
                        <div v-for="(record, id) in records" :key="id" class="faq-record">
                            <h3 class="question">
                                <Markdown :text="$t(record.question)" :inline="true" />
                            </h3>
                            <div class="answer">
                                <Markdown :text="$t(record.answer)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style lang="scss" scoped>
.faq-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.faq-popup {
    transition: .25s ease-out;
    background: linear-gradient(0deg, var(--color-background-mute) 30%, var(--color-background) 90%);
    margin: 0 1.5em 0 1.15em;
    border-radius: 1em;
    border: 1px solid var(--color-border-hover);

    box-shadow:
        inset 2px 2px 5px #000,
        inset -2px -2px 5px #000,
        2px 2px 10px 1px #000,
        -2px -2px 10px 1px #000;

    padding: 1em 1.25em;


    max-width: 650px;
    width: 92%;
    max-height: 90vh;
    min-height: 15vh;
    position: relative;
    display: flex;
    flex-direction: column;

    .close-btn {
        position: absolute;
        top: -0.65em;
        right: -0.65em;

        transition: .5s ease-out;
        cursor: pointer;

        /* Orange badge */
        outline: 0;
        border: 1px solid var(--color-border-hover);
        background-color: var(--color-background-soft);
        color: var(--color-text-muted);
        text-shadow: 0 0 1px #000000;

        font-weight: bold;
        vertical-align: top;
        font-size: 1.8em;
        padding: 0.1em 0.225em 0.2em 0.225em;
        border-radius: 40%;
        box-shadow: 0 0 8px #000000;
        z-index: 1;
        line-height: 1em;


        &:hover {
            color: var(--color-text);
            background-color: var(--color-background-mute);
            border: 1px solid var(--color-border-highlight);
        }
    }

    .scroll-container {
        flex: 1;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .faq-record {
        padding: 1em 0;

        &:first-of-type {
            padding-top: 0;
        }

        &:last-of-type {
            padding-bottom: 0;
        }

        &:not(:last-of-type) {
            position: relative;

            &::after {
                content: "";
                position: absolute;
                bottom: 0;
                /* or use top: 100% if you want it below the div */
                left: 2.5%;
                /* to match 95% width with centered alignment */
                width: 95%;
                height: 1px;
                background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0));
            }
        }
    }

    .question {
        font-style: italic;
        font-weight: 400;
        padding-left: .75em;
        font-size: 1.2em;

        &::before {
            content: '\00BB\00A0 ';
        }
    }
}


.faq-scroll {
    overflow-y: auto;
    flex: 1;
    padding-right: 0.5rem;
}
</style>
