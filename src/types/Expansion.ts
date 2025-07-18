export enum Expansion {
    Core = 'Core',
    Arcane = 'Arcane',
    Defiant = 'Defiant',
    Devoted = 'Devoted',
    Renowned = 'Renowned',
    Wayward = 'Wayward',
}

export const expansions = [
    Expansion.Core,
    Expansion.Devoted,
    Expansion.Defiant,
    Expansion.Wayward,
    Expansion.Renowned,
    Expansion.Arcane,
];

export function toExpansion(e: string): Expansion {
    switch (e.toLowerCase()) {
        case 'core':
            return Expansion.Core;
        case 'devoted':
            return Expansion.Devoted;
        case 'defiant':
            return Expansion.Defiant;
        case 'wayward':
            return Expansion.Wayward;
        case 'renowned':
            return Expansion.Renowned;
        case 'arcane':
            return Expansion.Arcane;
        default:
            throw new Error('Invalid Expansion: ' + e);
    }
}
