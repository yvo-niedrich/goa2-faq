import { toColor } from '../../src/types/Color';
import { readFileSync } from 'fs';
import { __data } from './paths';

interface CardRaw {
    id: string; // all lowercase: %color%-%tier%-%name_NonAlphaNumToDash%
    name: string;
    color: 'gold' | 'silver' | 'red' | 'blue' | 'green' | 'ultimate' | 'black';
    type: string; // (Basic) Skill / Attack (Ranged)
    tier?: 'I' | 'II' | 'III' | 'IV' | 'H' | null; // Top right, next to the name
    text: string; // Markdown Parsable (italics, bold, newlines, ...)
}

const cache: { [file: string]: CardRaw[] } = {};

function getFile(f: string): CardRaw[] {
    if (!cache.hasOwnProperty(f)) {
        try {
            cache[f] = JSON.parse(readFileSync(__data + '/' + f).toString());
        } catch (err) {
            console.error('Could not load: ' + f);
            throw err;
        }
    }
    return cache[f];
}

interface TranslationMap {
    [key: string]: string;
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

export function toType(value: string): CardType {
    let basic = false;
    let ranged = false;
    const type: CardType['type'] = [];

    const keywords = value
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

    for (const word of keywords) {
        switch (word) {
            case 'ranged':
                ranged = true;
                break;
            case 'basic':
                basic = true;
                break;
            default:
                if (['attack', 'movement', 'ultimate', 'skill', 'defense'].includes(word)) {
                    type.push(word as ActionType);
                }
        }
    }

    if (!type.length) {
        throw new Error('Could not parse card type: ' + value);
    }

    return { ranged, basic, type: type.sort(primaryActionsFirst) };
}

const primaryActions: ActionType[] = ['skill', 'attack'];
function primaryActionsFirst(a: ActionType, b: ActionType) {
    const aIndex = primaryActions.indexOf(a);
    const bIndex = primaryActions.indexOf(b);

    const aInPriority = aIndex !== -1;
    const bInPriority = bIndex !== -1;

    if (aInPriority && bInPriority) {
        return aIndex - bIndex;
    } else if (aInPriority) {
        return -1;
    } else if (bInPriority) {
        return 1;
    } else {
        return a.localeCompare(b);
    }
}
