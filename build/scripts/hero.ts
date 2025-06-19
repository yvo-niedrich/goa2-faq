import { toExpansion } from '@/types/Expansion';
import { default as heroes } from '../data/heroes.json';
import { loadCards } from './cards';

export interface HeroBuild extends Hero {
    cardsJson?: string;
}

export function load(filterFn: (h: HeroBuild) => boolean = () => true, withCards = true) {
    const h: HeroBuild[] = [];
    for (const r of heroes) {
        const hero: HeroBuild = {
            id: r.id,
            name: r.name,
            class: r.class,
            icon: r.icon,
            complexity: r.complexity,
            expansion: toExpansion(r.expansion),
            stats: r.stats as any,
            cards: withCards && typeof r.cards === 'string' ? loadCards(r.cards) : [],
            ...(!withCards && typeof r.cards === 'string' ? { cardsJson: r.cards } : {}),
        };

        if (filterFn(hero)) {
            translationCache[`${hero.id}.class`] = hero.class;
            hero.class = `${hero.id}.class`;

            h.push(hero);
        }
    }

    return h;
}

const translationCache: TranslationMap = {};

export function translationMap(): TranslationMap {
    return translationCache;
}
