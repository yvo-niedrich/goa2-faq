import { Expansion, expansions as allExpansions } from '@/types/Expansion';
import { default as inferredHeroes } from './heroes.generated.json';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const heroes: { [id: string]: Hero } = inferredHeroes as any;
export const heroIds = Object.keys(heroes);

export const expansions = allExpansions.filter(
    (e) => !!Object.values(heroes).find((h) => h.expansion === e),
);

export const get = (id: string): Hero => {
    let h;
    if ((h = heroes[id])) {
        return h;
    }
    throw new Error('Hero not found: ' + id);
};

// Helper function to filter heroes by expansions
export const filterHeroesByExpansions = (
    selectedExpansions: string | string[] | Expansion[],
): Hero[] => {
    if (selectedExpansions.length === 0) {
        return Object.values(heroes);
    }

    if (typeof selectedExpansions === 'string') {
        selectedExpansions = [selectedExpansions];
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return Object.values(heroes).filter((hero) =>
        selectedExpansions.includes(hero.expansion as any),
    );
};

export function defaultHeroSortFn(a: Hero, b: Hero) {
    if (a.expansion === b.expansion) {
        return a.name > b.name ? 1 : -1;
    }

    return expansions.indexOf(a.expansion as unknown as Expansion) >
        expansions.indexOf(b.expansion as unknown as Expansion)
        ? 1
        : -1;
}

const cardColorValue = {
    y: 0,
    s: 0.1,
    u: 0.2,
    r: 1,
    g: 2,
    b: 3,
};

export function cardColumn(c: Card) {
    return Math.trunc(cardColorValue[c.color]);
}

export function sortCardsByColor(a: Card, b: Card) {
    if (a.color === b.color) return 0;
    return cardColorValue[a.color] > cardColorValue[b.color] ? 1 : -1;
}

export function sortCardsByTier(a: Card, b: Card) {
    if (!a.color) return -1;
    return a.tier > b.tier ? 1 : -1;
}
