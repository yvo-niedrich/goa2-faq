interface CardAttributes {
    movement?: number;
    defense?: number;
    attack?: number | string;
    range?: number | string;
    radius?: number;
}

interface CardType {
    basic: boolean;
    ranged: boolean;
    type: 'attack' | 'movement' | 'ultimate' | 'skill';
}

interface Card {
    id: string;
    name: string;
    color: 'y' | 'g' | 'b' | 'r' | 'u' | 's';
    tier?: 'I' | 'II' | 'III' | 'IV' | 'H';
    type: CardType;
    text: string;
}

interface Hero {
    id: string;
    name: string;
    class: string;
    icon: string;
    complexity: number;
    expansion: 'Core' | 'Devoted' | 'Defiant' | 'Wayward' | 'Renowned' | 'Arcane';
    cards: Card[];
}

interface HeroRecord {
    name: string;
    cards: Card[];
}

interface FaqRecord {
    q: string;
    a: string;
    ref: string[];
}
