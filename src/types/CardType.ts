function capitalizeFirstLetter(val: string): string {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function toString(t: CardType): string {
    return `${t.basic ? 'Basic ' : ''} ${capitalizeFirstLetter(t.type || 'unknown')}${t.ranged ? ' - Ranged' : ''}`;
}

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
