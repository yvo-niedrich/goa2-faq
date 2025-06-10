import { writeFileSync } from 'fs';
import { default as h1 } from './data/heroes.json';
import { default as h2 } from './data/heroes2.json';
import { __data } from './scripts/paths';

for (const hero of h1) {
    for (const stats of h2) {
        if (hero.name !== stats.name) {
            continue;
        }

        (hero as any).stats = {
            attack: stats.attack,
            defense: stats.defense,
            initiative: stats.initiative,
            movement: stats.movement,
        };
    }

    if (!(hero as any).stats) {
        console.warn('missing stats: ' + hero.name);
    }
}

writeFileSync(__data + 'hero_status.json', JSON.stringify(h1, null, 4), {
    flag: 'w',
});
