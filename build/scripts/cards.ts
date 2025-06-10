import { toColor } from '@/types/Color';
import { readFileSync } from 'fs';
import { __data } from './paths';
import { toType } from '@/types/CardType';

interface CardRaw {
    id: string; // all lowercase: %color%-%tier%-%name_NonAlphaNumToDash%
    name: string;
    color: 'gold' | 'silver' | 'red' | 'blue' | 'green';
    type: string; // (Basic) Skill / Attack (Ranged)
    tier?: 'I' | 'II' | 'III' | 'IV' | 'H' | null; // Top right, next to the name
    text: string; // Markdown Parsable (italics, bold, newlines, ...)
}

const cache: { [file: string]: CardRaw[] } = {};

function getFile(f: string): CardRaw[] {
    if (!cache.hasOwnProperty(f)) {
        cache[f] = JSON.parse(readFileSync(__data + '/' + f).toString());
    }
    return cache[f];
}

export function translationMap(file: string | string[] = []): TranslationMap {
    if (typeof file === 'string') {
        file = [file];
    }

    if (file.length === 0) {
        file = Object.keys(cache);
    }

    const t: TranslationMap = {};

    for (const f of file) {
        for (const card of getFile(f)) {
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
        for (const card of getFile(f)) {
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
