import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
    const filteredExpansions = useStorage<string[]>('goa2-faq.app.filter.exp', []);

    return { filteredExpansions };
});
