import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { createI18n } from 'vue-i18n';

export const fallbackLocale = 'en';
export const locales: Record<string, { label: string; flag: string; lang?: string }> = {
    en: { label: 'English', flag: '🇬🇧' },
    de: { label: 'Deutsch', flag: '🇩🇪' },
    // es: { label: 'Español', flag: '🇪🇸' },
    // fr: { label: 'Français', flag: '🇫🇷' },
    // it: { label: 'Italiano', flag: '🇮🇹' },
    zh: { label: '简体中文', flag: '🇨🇳', lang: 'zh-Hans' },
};

export function getLocale(locale: string) {
    return locales[locale] ?? locales[fallbackLocale];
}

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

    return fallbackLocale;
})();

export const useLanguageStore = defineStore('language', () => {
    const language = useStorage<string | null>('goa2-faq.language', defaultLocale);

    // a locale persisted by an older build may no longer exist (renamed or removed)
    if (!language.value || !locales.hasOwnProperty(language.value)) {
        language.value = defaultLocale;
    }

    watch(
        language,
        (newLang) => {
            setDocumentLang(newLang);
            loadLocale(newLang, true);
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
            fallbackLocale: fallbackLocale,
            messages: {},
            missingWarn: false,
            fallbackWarn: false,
        });
        loadLocale(store.language)
            .then(() => loadLocale(fallbackLocale))
            .then(() => ((i18n as any).global.missingWarn = true))
            .then(() => ((i18n as any).global.fallbackWarn = true));
    }

    return i18n;
}

/**
 * Keeps <html lang> in sync with the active locale. Beyond a11y this drives glyph
 * selection for CJK (Han unification) as well as line-breaking rules, so `zh` needs
 * the more specific `zh-Hans` to render as Simplified Chinese rather than Japanese.
 */
function setDocumentLang(locale: string | null) {
    if (typeof document === 'undefined' || !locale) return;
    document.documentElement.lang = locales[locale]?.lang ?? locale;
}

const loadedLanguages = ref<string[]>([]);
async function loadLocale(locale: string|null, setLang: boolean = false) {
    if (!locale) return;
    if (!i18n) return;
    if (locales.hasOwnProperty(locale) && !loadedLanguages.value.includes(locale)) {
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
