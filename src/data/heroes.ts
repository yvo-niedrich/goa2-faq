import type { Expansion } from '@/types/Expansion';
import { default as inferredHeroes } from './heroes.generated.json';

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const heroes: { [id: string]: Hero } = inferredHeroes as any;
export const heroIds = Object.keys(heroes);

export const get = (id: string): Hero => {
    let h;
    if ((h = heroes[id])) {
        return h;
    }
    throw new Error('Hero not found: ' + id);
};

// Helper function to get all available expansions
export const getAllExpansions = (): string[] => {
    return ['Core', 'Devoted', 'Defiant', 'Wayward', 'Renowned', 'Arcane'];
};

// Helper function to filter heroes by expansions
export const filterHeroesByExpansions = (selectedExpansions: string[] | Expansion[]): Hero[] => {
    if (selectedExpansions.length === 0) {
        return Object.values(heroes);
    }

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    return Object.values(heroes).filter((hero) =>
        selectedExpansions.includes(hero.expansion as any),
    );
};
