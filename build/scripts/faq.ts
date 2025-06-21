import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { __data } from './paths';

interface FAQ {
    q: string;
    a: string;
    ref: string[];
}

type FAQMap = { [key: string]: FAQ };

function generateId(length = 8) {
    let result = '';
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        l = c.length;
    const charactersLength = c.length;
    for (let i = 0; i < length; i++) {
        result += c.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

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

    let fileUpdated = false;
    for (const key of Object.keys(fMap)) {
        if (faq.hasOwnProperty(key)) {
            throw new Error(`Duplicate FAQ key: ${key} (${file})`);
        }

        if (key.match(/-\d+$/)) {
            let newKey;
            while (true) {
                newKey = key.replace(/-\d+$/, '-' + generateId());
                if (!faq.hasOwnProperty(newKey)) {
                    break;
                }
            }

            fileUpdated = true;
            faq[newKey] = fMap[newKey] = fMap[key];
            delete fMap[key];
        } else {
            faq[key] = fMap[key];
        }
    }

    if (fileUpdated) {
        console.log('FAQ file updated: ' + file);
        writeFileSync(faqPath + '/' + file, JSON.stringify(fMap));
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
