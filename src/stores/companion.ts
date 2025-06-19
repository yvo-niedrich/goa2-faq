import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompanionStore = defineStore('companion', () => {
    const id = useStorage<string | null>('goa2-faq.companion.id', null);
    const gold = useStorage<string | null>('goa2-faq.companion.gold', null);
    const silver = useStorage<string | null>('goa2-faq.companion.silver', null);
    const red = useStorage<string | null>('goa2-faq.companion.red', null);
    const green = useStorage<string | null>('goa2-faq.companion.green', null);
    const blue = useStorage<string | null>('goa2-faq.companion.blue', null);
    const focus = ref(0);

    function resetCards() {
        gold.value = null;
        silver.value = null;
        red.value = null;
        green.value = null;
        blue.value = null;
    }

    function reset() {
        id.value = null;
        focus.value = 0;
        resetCards();
    }

    return { id, gold, silver, red, green, blue, focus, reset, resetCards };
});
