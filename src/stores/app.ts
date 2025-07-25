import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const filteredExpansions = useStorage<string[]>('goa2-faq.app.filter.exp', []);
    const selectionLayout = useStorage<'box' | 'complexity' | 'name'>('goa2-faq.app.layout', 'box');
    const currentFaqCardId = ref<string | null>(null);

    function showFaq(cardId: string) {
        currentFaqCardId.value = cardId;
    }

    function closeFaq() {
        currentFaqCardId.value = null;
    }

    return {
        filteredExpansions,
        selectionLayout,
        currentFaqCardId,
        $showFaq: showFaq,
        $closeFaq: closeFaq,
    };
});
