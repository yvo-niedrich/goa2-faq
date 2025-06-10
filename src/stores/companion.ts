import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompanionStore = defineStore('companion', () => {
    const id = ref<string | null>(null);
    const gold = ref<string | null>(null);
    const silver = ref<string | null>(null);
    const red = ref<string | null>(null);
    const green = ref<string | null>(null);
    const blue = ref<string | null>(null);

    function reset() {
        id.value = null;
        gold.value = null;
        silver.value = null;
        red.value = null;
        green.value = null;
        blue.value = null;
    }

    return { id, gold, silver, red, green, blue, reset };
});
