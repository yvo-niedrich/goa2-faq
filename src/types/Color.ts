export enum Color {
    Gold = 'y',
    Green = 'g',
    Blue = 'b',
    Red = 'r',
    Ultimate = 'u',
    Silver = 's',
}

export function toColor(e: string): Color {
    switch (e.toLowerCase()) {
        case 'y':
        case 'gold':
            return Color.Gold;
        case 'g':
        case 'green':
            return Color.Green;
        case 'b':
        case 'blue':
            return Color.Blue;
        case 'r':
        case 'red':
            return Color.Red;
        case 'u':
        case 'ultimate':
        case 'black':
        case 'purple':
            return Color.Ultimate;
        case 's':
        case 'silver':
            return Color.Silver;
        default:
            throw new Error('Invalid Color: ' + e);
    }
}
