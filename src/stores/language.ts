import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { createI18n } from 'vue-i18n';

export const locales = {
    en: { label: 'English', flag: '🇬🇧' },
    de: { label: 'Deutsch', flag: '🇩🇪' },
    // es: { label: 'Español', flag: '🇪🇸' },
    // fr: { label: 'Français', flag: '🇫🇷' },
    // it: { label: 'Italiano', flag: '🇮🇹' },
};

const defaultLocale = (function () {
    const supportedLocales = Object.keys(locales);
    const browserLocales =
        typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : [];

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

    watch(
        language,
        (newLang) => {
            if (newLang) {
                loadLocale(newLang, true);
            }
        },
        { immediate: true },
    );

    return { language };
});

let i18n: ReturnType<typeof createI18n>;
export function getI18n() {
    if (!i18n) {
        const store = useLanguageStore();
        i18n = createI18n({
            legacy: false,
            locale: store.language,
            fallbackLocale: 'en',
            messages: {},
            missingWarn: false,
            fallbackWarn: false,
        });
        loadLocale(store.language)
            .then(() => loadLocale('en'))
            .then(() => ((i18n as any).global.missingWarn = true))
            .then(() => ((i18n as any).global.fallbackWarn = true));
    }

    return i18n;
}

const loadedLanguages = ref<string[]>([]);
async function loadLocale(locale: string, setLang: boolean = false) {
    if (!i18n) return;
    if (!loadedLanguages.value.includes(locale) && Object.keys(locales).includes(locale)) {
        try {
            const messages = await fetch(
                `${import.meta.env.BASE_URL}locales/${locale}.json?v=${__APP_BUILD_HASH__}`,
            ).then((res) => res.json());
            i18n.global.setLocaleMessage(locale, messages);
            loadedLanguages.value.push(locale);
        } catch (err) {
            console.log(err);
        }
    }

    if (setLang) {
        (i18n.global.locale as { value: string }).value = locale;
    }
}
