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

export function sortCardsByAlternative(a: Card, b: Card) {
    if (!a.alternative === !b.alternative) return 0;
    return a.alternative ? 1 : -1;
}
