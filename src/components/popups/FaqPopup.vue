<script setup lang="ts">
import { computed } from 'vue';
import { useFaqStore } from '@/stores/faq'
import { get as getFAQs } from '@/data/faq'
import Markdown from '../Markdown.vue';

const faqStore = useFaqStore()

const records = computed(() => {
    if (!faqStore.currentCardId) return [];
    return getFAQs(faqStore.currentCardId);
});

</script>

<template>
    <Teleport to="body">
        <div v-if="records.length > 0" class="faq-overlay" @click.self="faqStore.close">
            <div class="faq-popup">
                <button class="close-btn" @click="faqStore.close">×</button>
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
    background: #202d33;
    border: 1px solid #FFF;
    box-shadow: 0 0 10px 4px #000;

    border-radius: 0.75rem;
    padding: 1.5rem;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    min-height: 15vh;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;


    .faq-record {
        padding: 1em 0;
        border-bottom: 1px dashed #999;

        &:first-of-type {
            padding-top: 0;
        }


        &:last-of-type {
            padding-bottom: 0;
            border: none;
        }
    }

    .question {
        font-style: italic;
        font-weight: 400;
        padding-left: .75em;

        &::before {
            content: '\00BB\00A0 ';
        }
    }

    .answer {
        font-size: .9em;
    }

}


.faq-scroll {
    overflow-y: auto;
    flex: 1;
    padding-right: 0.5rem;
}

.close-btn {
    top: .05rem;
    right: .15rem;

    margin: 0;
    padding: .2em;
    line-height: .75em;

    position: absolute;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--color-text);

    opacity: .5;
    transition: 1s ease-out;

    &:hover {
        opacity: 1;
        text-shadow: 1px 1px 3px #999;
    }
}
</style>
