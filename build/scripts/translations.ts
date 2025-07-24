import { __public, __root } from './paths';
import { readFileSync, writeFileSync } from 'fs';

type TranslationMap = { [key: string]: string };

const _cache: { [key: string]: TranslationMap } = {};
export const path = __public + '/locales';
export const source = 'en';
export const translations = ['de'];

export function applicationTranslations(): TranslationMap {
    return {
        'app.header.overview': 'Heroes',
        'app.header.dashboard': 'My Dashboard',
        'app.button.search': 'Search...',
        'app.sortby.box': 'Expansion',
        'app.sortby.complexity': 'Complexity',
        'app.sortby.name': 'Name',
        'app.last-update': 'Last update',
        'app.card.upgrade': 'Upgrade',
        'app.card.downgrade': 'Downgrade',
        'app.card-type.basic': 'Basic',
        'app.card-type.basic.attack': 'Basic Attack',
        'app.card-type.basic.defense': 'Basic Defense',
        'app.card-type.basic.movement': 'Basic Movement',
        'app.card-type.basic.skill': 'Basic Skill',
        'app.card-type.ranged': 'Ranged',
        'app.card-type.attack': 'Attack',
        'app.card-type.movement': 'Movement',
        'app.card-type.ultimate': 'Ultimate',
        'app.card-type.skill': 'Skill',
        'app.card-type.defense': 'Defense',
        'app.stat.attack': 'Attack',
        'app.stat.defense': 'Defense',
        'app.stat.initiative': 'Initiative',
        'app.stat.movement': 'Movement',
    };
}

function load(lang: string, cache = false) {
    if (cache && _cache.hasOwnProperty(lang)) {
        return _cache[lang];
    }

    let langData: TranslationMap;
    try {
        langData = JSON.parse(readFileSync(`${path}/${lang}.json`).toString());
    } catch (err) {
        console.error('Could not load language: ' + lang);
        throw err;
    }

    if (cache) {
        _cache[lang] = langData;
    }

    return langData;
}

export function verifyTranslations(lang: string) {
    const sourceData = load(source, true);
    const sourceKeys = Object.keys(sourceData);

    const langData = load(lang);
    const langKeys = Object.keys(langData);

    const missing = [] as string[];
    const unexpected = [] as string[];

    for (const k of sourceKeys) {
        if (!langKeys.includes(k)) {
            missing.push(k);
        }
    }

    for (const k of langKeys) {
        if (!sourceKeys.includes(k)) {
            unexpected.push(k);
        }
    }

    if (unexpected.length) {
        console.warn('Unexpected translations in ' + lang + '.json:', unexpected);
    }

    if (missing.length) {
        const missingEntries = missing.reduce((acc, k) => {
            acc[k] = sourceData[k];
            return acc;
        }, {} as TranslationMap);

        console.warn(`Missing Translations: ${lang}.missing.json (${missing.length})`);
        writeFileSync(`${__root}/${lang}.missing.json`, JSON.stringify(missingEntries, null, 2), {
            flag: 'w',
        });
    }
}
