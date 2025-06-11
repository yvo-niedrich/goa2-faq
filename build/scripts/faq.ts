import { readdirSync, readFileSync } from 'fs';
import { __data } from './paths';

interface FAQ {
    q: string;
    a: string;
    ref: string[];
}

type FAQMap = { [key: string]: FAQ };

const faq = {} as FAQMap;
const faqPath = __data + '/faqs';
const files = readdirSync(faqPath);
for (const file of files) {
    if (!file.includes('.json')) continue;

    let fMap: FAQMap;
    try {
        fMap = JSON.parse(readFileSync(faqPath + '/' + file).toString());
    } catch (err) {
        console.error('Could not load faq: ' + file);
        throw err;
    }

    for (const key of Object.keys(fMap)) {
        if (faq.hasOwnProperty(key)) {
            throw new Error(`Duplicate FAQ key: ${key} (${file})`);
        }

        faq[key] = fMap[key];
    }
}

export function cardIndex(filter: string[] = [], warn = true): CardFaqMap {
    const idx: CardFaqMap = {};

    for (const fid of Object.keys(faq)) {
        const record: FAQ = faq[fid];

        if (typeof record.ref === 'string') {
            record.ref = [record.ref];
        }

        if ((!record.ref || record.ref.length === 0) && warn) {
            console.warn(`[FAQ] No cards referenced for ${fid}`);
        }

        for (const cid of record.ref) {
            if (filter.length !== 0 && !filter.includes(cid)) {
                if (warn) {
                    console.warn(`[FAQ] Card \`${cid}\` not found (${fid})`);
                }
                continue;
            }

            if (!idx.hasOwnProperty(cid)) {
                idx[cid] = [];
            }
            idx[cid].push(fid);
        }
    }

    return idx;
}

export function translationMap(filter: string[] = []): TranslationMap {
    const t: TranslationMap = {};

    for (const fid of Object.keys(faq)) {
        if (filter.length !== 0 && !filter.includes(fid)) {
            continue;
        }

        const record: FAQ = faq[fid];

        if (t.hasOwnProperty(`${fid}.answer`)) {
            throw new Error('FAQ index is not unique: ' + fid);
        }

        t[`${fid}.question`] = record.q;
        t[`${fid}.answer`] = record.a;
    }

    return t;
}
