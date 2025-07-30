import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useFaqStore = defineStore('faq', () => {
    const hero = useStorage<string | null>('goa2-faq.faq.hero', null);
    const cards = useStorage<string[]>('goa2-faq.faq.cards', []);
    const question = useStorage<string>('goa2-faq.faq.question', '');
    const answer = useStorage<string>('goa2-faq.faq.answer', '');

    function reset() {
        hero.value = '';
        cards.value = [];
        question.value = '';
        answer.value = '';
    }

    return {
        hero,
        cards,
        question,
        answer,
        $reset: reset,
    };
});
