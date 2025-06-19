export function toType(value: string): CardType {
    let basic = false;
    let ranged = false;
    let type: CardType['type'] | undefined = undefined;

    const keywords = value
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 0);

    for (const word of keywords) {
        switch (word) {
            case 'ranged':
                ranged = true;
                break;
            case 'basic':
                basic = true;
                break;
            default:
                if (['attack', 'movement', 'ultimate', 'skill', 'defense'].includes(word)) {
                    type = word as CardType['type'];
                }
        }
    }

    if (type === undefined) {
        throw new Error('Could not parse card type: ' + value);
    }

    return { ranged, basic, type };
}

function tierToNum(t: Card['tier'] | null) {
    switch (t) {
        case 'I':
            return 1;
        case 'II':
            return 2;
        case 'III':
            return 3;
        case 'IV':
            return 4;
        case 'H':
            return -1;
        default:
            return 0;
    }
}

export function sortTier(a: Card['tier'] | null, b: Card['tier'] | null) {
    if (a === b) return 0;
    return tierToNum(a) > tierToNum(b) ? 1 : -1;
}
