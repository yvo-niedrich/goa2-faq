/* eslint-disable  @typescript-eslint/no-explicit-any */
import { toExpansion } from '../../src/types/Expansion';
import { default as heroes } from '../data/heroes.json';
import { loadCards } from './cards';

import '../../env.d.ts';

export function load(filterFn: (h: Hero) => boolean = () => true) {
    const h: Hero[] = [];
    for (const r of heroes) {
        const advice = typeof r.advice === 'string' ? r.advice : null;
        const lore = typeof r.lore === 'string' ? r.lore : null;

        const hero: Hero = {
            id: r.id,
            name: r.name,
            class: r.class,
            icon: r.icon,
            complexity: r.complexity,
            expansion: toExpansion(r.expansion),
            stats: r.stats as any,
            cards: typeof r.cards === 'string' ? loadCards(r.cards) : [],
            hasLore: !!lore,
            hasAdvice: !!advice,
            ...(r.spellbook && r.spellbook.length
                ? { spellbook: loadCards(r.spellbook) as unknown as SpellbookCard[] }
                : {}),
        };

        if (filterFn(hero)) {
            translationCache[`${hero.id}.class`] = hero.class;
            hero.class = `${hero.id}.class`;

            if (advice) translationCache[`${hero.id}.advice`] = advice;
            if (lore) translationCache[`${hero.id}.lore`] = lore;

            h.push(hero);
        } else {
            console.log(`Hero Skipped: ${hero.name} / ${hero.id}`);
        }
    }

    return h;
}

const translationCache: TranslationMap = {};

export function translationMap(): TranslationMap {
    return translationCache;
}
