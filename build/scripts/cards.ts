import { toColor } from '@/types/Color';
import { readFileSync } from 'fs';
import { __data } from './paths';
import { toType } from '@/types/CardType';

interface CardRaw {
    id: string;
    name: string;
    color: string;
    type: string;
    tier?: string;
    text: string;
}

function loadJSON(path: string) {
    return JSON.parse(readFileSync(__data + '/' + path).toString());
}

const cache: { [file: string]: CardRaw[] } = {};

export function translationMap(file: string | string[] = []): TranslationMap {
    if (typeof file === 'string') {
        file = [file];
    }

    if (file.length === 0) {
        file = Object.keys(cache);
    }

    const t: TranslationMap = {};

    for (const f of file) {
        if (!cache.hasOwnProperty(f)) {
            cache[f] = loadJSON(f);
        }

        for (const card of cache[f]) {
            if (t.hasOwnProperty(`${card.id}.text`)) {
                throw new Error(`Card is not unique: ${card.id} (${card.name})`);
            }

            t[`${card.id}.text`] = card.text;
        }
    }

    return t;
}

export function loadCards(file: string | string[], withTranslation = true): Card[] {
    if (typeof file === 'string') {
        file = [file];
    }

    const c: Card[] = [];

    for (const f of file) {
        if (!cache.hasOwnProperty(f)) {
            cache[f] = loadJSON(f);
        }

        for (const card of cache[f]) {
            c.push({
                id: card.id,
                name: card.name,
                color: toColor(card.color),
                type: toType(card.type),
                text: withTranslation ? `${card.id}.text` : card.text,
                ...(card.tier ? { tier: card.tier.toUpperCase() as Card['tier'] } : {}),
            });
        }
    }

    return c;
}
