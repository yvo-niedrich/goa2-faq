import { mkdir, writeFileSync } from 'fs';
import { __src } from './paths';
import { source, path as translationPath } from './translations';

export function writeTranslations(data: TranslationMap) {
    mkdir(translationPath, { recursive: true }, (err) => err && console.error(err));
    writeFileSync(`${translationPath}/${source}.json`, JSON.stringify(data, null, 4), {
        flag: 'w',
    });
}

export function writeCardFaqMap(data: CardFaqMap) {
    mkdir(__src + '/data', { recursive: true }, (err) => err && console.error(err));
    writeFileSync(__src + '/data/faq.generated.json', JSON.stringify(data), {
        flag: 'w',
    });
}

export function writeHeroData(data: Hero[] | Hero) {
    if (!Array.isArray(data)) {
        data = [data];
    }

    const obj = Object.fromEntries(data.map((h) => [h.id, h]));

    if (Object.keys(obj).length !== data.length) {
        throw new Error('Hero IDs not unique...');
    }

    mkdir(__src + '/data', { recursive: true }, (err) => err && console.error(err));
    writeFileSync(__src + '/data/heroes.generated.json', JSON.stringify(obj), {
        flag: 'w',
    });
}
