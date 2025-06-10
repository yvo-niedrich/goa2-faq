import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFaqStore = defineStore('faq', () => {
    const currentCardId = ref<string | null>(null);

    function show(cardId: string) {
        currentCardId.value = cardId;
    }

    function close() {
        currentCardId.value = null;
    }

    return { currentCardId, show, close };
});
