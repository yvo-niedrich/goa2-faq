/// <reference types="vite/client" />

declare interface CardFaqMap {
    [cardId: string]: string[];
}

declare interface TranslationMap {
    [key: string]: string;
}

declare interface CardAttributes {
    movement?: number;
    defense?: number;
    attack?: number | string;
    range?: number | string;
    radius?: number;
}

declare type ActionType = 'attack' | 'movement' | 'ultimate' | 'skill' | 'defense';

declare interface CardType {
    basic: boolean;
    ranged: boolean;
    type: ActionType[];
}

declare interface Card {
    id: string;
    name: string;
    color: 'y' | 'g' | 'b' | 'r' | 'u' | 's';
    tier?: 'I' | 'II' | 'III' | 'IV' | 'H';
    type: CardType;
    text: string;
}

declare interface Hero {
    id: string;
    name: string;
    class: string;
    icon: string;
    complexity: number;
    expansion: 'Core' | 'Devoted' | 'Defiant' | 'Wayward' | 'Renowned' | 'Arcane';
    stats: {
        attack: number | [number, number];
        defense: number | [number, number];
        initiative: number | [number, number];
        movement: number | [number, number];
    };
    cards: Card[];
}

declare interface HeroRecord {
    name: string;
    cards: Card[];
}

declare interface FaqRecord {
    q: string;
    a: string;
    ref: string[];
}
