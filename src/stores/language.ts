import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const locales = {
    en: { label: 'English', flag: '🇬🇧' },
    de: { label: 'Deutsch', flag: '🇩🇪' },
    fr: { label: 'Français', flag: '🇫🇷' },
};

const defaultLocale = (function () {
    const supportedLocales = Object.keys(locales);
    const browserLocales = navigator.languages || [navigator.language];

    for (const locale of browserLocales) {
        const base = locale.split('-')[0];
        if (supportedLocales.includes(base.toLocaleLowerCase())) {
            return base;
        }
    }

    return 'en';
})();

export const useLanguageStore = defineStore('language', () => {
    const language = useStorage<string | null>('goa2-faq.language', defaultLocale);

    return { language };
});
