import { default as faqdata } from './faq.generated.json';

interface FAQ {
    question: string;
    answer: string;
}

function translationKeys(id: string): FAQ {
    return {
        question: `${id}.question`,
        answer: `${id}.answer`,
    };
}

export function get(cardId: string): FAQ[] {
    return ((faqdata as CardFaqMap)[cardId] || []).map((r) => translationKeys(r));
}

export function count(cardId: string): number {
    return ((faqdata as CardFaqMap)[cardId] || []).length;
}
