import { translationMap as cardTranslationMap } from './scripts/cards';
import { load as loadHeroes, translationMap as heroTranslationMap } from './scripts/hero';
import { translationMap as FaqTranslationMap, cardIndex as FaQCardIndex } from './scripts/faq';
import { writeCardFaqMap, writeHeroData, writeTranslations } from './scripts/files';

const uniqueFn = (e: string, i: number, self: string[]) => i === self.indexOf(e);

// const heroes = loadHeroes((h) => h.cards.length > 0);
const heroes = loadHeroes();
const faqMap = FaQCardIndex(heroes.map((h) => h.cards.map((c) => c.id)).flat());

writeHeroData(heroes);
writeCardFaqMap(faqMap);
writeTranslations({
    ...heroTranslationMap(),
    ...cardTranslationMap(),
    ...FaqTranslationMap(Object.values(faqMap).flat().filter(uniqueFn)),
});
