export enum Expansion {
    Core = 'Core',
    Arcane = 'Devoted',
    Defiant = 'Defiant',
    Devoted = 'Wayward',
    Renowned = 'Renowned',
    Wayward = 'Arcane',
}

export const expansions = [
    Expansion.Core,
    Expansion.Arcane,
    Expansion.Defiant,
    Expansion.Devoted,
    Expansion.Renowned,
    Expansion.Wayward,
];

export function toExpansion(e: string): Expansion {
    switch (e.toLowerCase()) {
        case 'core':
            return Expansion.Core;
        case 'arcane':
            return Expansion.Arcane;
        case 'defiant':
            return Expansion.Defiant;
        case 'devoted':
            return Expansion.Devoted;
        case 'renowned':
            return Expansion.Renowned;
        case 'wayward':
            return Expansion.Wayward;
        default:
            throw new Error('Invalid Expansion: ' + e);
    }
}
