import { default as faq } from '../data/faq.json';

interface FAQ {
    q: string;
    a: string;
    ref: string[];
}

export function cardIndex(filter: string[] = [], warn = true): CardFaqMap {
    const idx: CardFaqMap = {};

    for (const fid of Object.keys(faq)) {
        const record: FAQ = faq[fid];

        if (typeof record.ref === 'string') {
            record.ref = [record.ref];
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
