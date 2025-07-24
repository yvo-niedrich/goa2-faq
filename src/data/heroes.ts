import { Expansion, expansions as allExpansions } from '@/types/Expansion';
import { default as inferredHeroes } from './heroes.generated.json';

export const heroes: { [id: string]: Hero } = inferredHeroes as never;
export const heroIds = Object.keys(heroes);

const baseUrl = import.meta.env.BASE_URL;
if (baseUrl) {
    heroIds.forEach((key) => {
        heroes[key].icon = baseUrl + heroes[key].icon.replace(/^\/*/g, '');
    });
}

export const expansions = allExpansions.filter(
    (e) => !!Object.values(heroes).find((h) => h.expansion === e),
);

function getExpansionIndex(v: string | Expansion): number {
    return expansions.indexOf(v as Expansion);
}

export function sortExpansion(a: string | Expansion, b: string | Expansion): number {
    return getExpansionIndex(a) - getExpansionIndex(b);
}

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

export function sortByExpansion(a: Hero, b: Hero) {
    return sortExpansion(a.expansion, b.expansion);
}

export function sortByComplexity(a: Hero, b: Hero) {
    if (a.complexity === b.complexity) return 0;
    return a.complexity > b.complexity ? 1 : -1;
}

export function sortByName(a: Hero, b: Hero) {
    if (a.name === b.name) return 0;
    return a.name > b.name ? 1 : -1;
}

const colorRanking = {
    y: 0,
    s: 0.1,
    u: 0.2,
    r: 1,
    g: 2,
    b: 3,
};

export function cardColumn(c: Card) {
    return Math.trunc(colorRanking[c.color]);
}

export function sortCardsByColor(a: Card, b: Card) {
    if (a.color === b.color) return 0;
    return colorRanking[a.color] > colorRanking[b.color] ? 1 : -1;
}

const tierRanking = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    H: 5,
};

export function sortCardsByTier(a: Card, b: Card) {
    return sortCardTiers(a.tier, b.tier);
}

export function sortCardTiers(a: Card['tier'], b: Card['tier']) {
    if (a === b) return 0;
    return (tierRanking[a] ?? 0) > (tierRanking[b] ?? 0) ? 1 : -1;
}
