<script lang="ts" setup>
import { ref, computed } from 'vue';
import { sortByName, heroes, get } from '@/data/heroes';
import { useFaqStore } from '@/stores/faq';
import { storeToRefs } from 'pinia';

function generateId(length = 8) {
    let result = '';
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        l = c.length;
    for (let i = 0; i < length; i++) {
        result += c.charAt(Math.floor(Math.random() * l));
    }
    return result;
}


const { hero, cards } = storeToRefs(useFaqStore());
const selectedHero = computed(() => hero.value ? get(hero.value) : null);
const selectedCards = computed<Card[]>(() => cards.value?.length && selectedHero.value ? selectedHero.value.cards.filter(c => cards.value.includes(c.id)) : []);
const faqQuestion = ref('');
const faqAnswer = ref('');
const faqId = ref(generateId());


const cardsForHero = computed(() => {
    if (!selectedHero.value) return [];
    return selectedHero.value.cards;
});

function submitToGithub() {
    if (!(selectedHero.value && faqQuestion.value)) return false;

    const labels = ['documentation'];
    if (!faqAnswer.value.trim()) labels.push('help wanted');

    const issueTitle = `FAQ Proposal: ${selectedHero.value.name}`;
    const body = `
**Hero**: ${selectedHero.value?.name}
**Cards**: ${selectedCards.value.map(c => c.name).join(', ') || 'None'}

**Question**:
${faqQuestion.value.trim()}

**Answer**:
${faqAnswer.value.trim() || '_No answer provided_'}

\`\`\`json
${JSON.stringify(
        {
            [faqId.value]: {
                q: faqQuestion.value.trim(),
                a: faqAnswer.value.trim() || null,
                ref: selectedCards.value.map(c => c.id),
            }
        },
        null,
        4,
    )}
\`\`\`
    `.trim();

    const url = `${__APP_REPO__}/issues/new?title=${encodeURIComponent(
        issueTitle
    )}&body=${encodeURIComponent(body)}&labels=${encodeURIComponent(labels.join(','))}`;

    window.open(url, '_blank');
    faqId.value = generateId();
}
</script>


<template>
    <div class="p-4 space-y-4">
        <h2 class="text-xl font-bold">Propose a New FAQ Entry</h2>

        <!-- Hero Selection -->
        <div>
            <label for="hero" class="block font-medium mb-1">Select Hero</label>
            <select id="hero" v-model="hero" class="w-full p-2 border rounded">
                <option disabled value="">-- Choose a hero --</option>
                <option v-for="hero in Object.values(heroes).sort(sortByName)" :key="hero.id" :value="hero.id">
                    {{ hero.name }}
                </option>
            </select>
        </div>

        <!-- Card Selection -->
        <div v-if="cardsForHero.length > 0">
            <label>Related Cards</label>
            <div class="hero-cards">
                <div v-for="card in cardsForHero" :key="card.id" class="flex items-center gap-2">

                    <label :for="card.id"
                        :class="{ [`hero-card-color-${card.color}`]: true, 'hero-card-alternative': card.alternative }">
                        <input type="checkbox" :id="card.id" :value="card.id" v-model="cards" />
                        <span class="card-tier"> {{ card.tier }} </span>
                        <span class="card-name"> {{ card.name }} </span>
                    </label>
                </div>
            </div>
        </div>

        <!-- FAQ Question -->
        <div>
            <label for="faqQuestion" class="block font-medium mb-1">Question</label>
            <input type="text" id="faqQuestion" v-model="faqQuestion"
                placeholder="How does this ability interact with ...?" />
        </div>

        <!-- FAQ Answer (optional) -->
        <div>
            <label for="faqAnswer" class="block font-medium mb-1">Answer (optional)</label>
            <textarea id="faqAnswer" v-model="faqAnswer" rows="3" class="w-full p-2 border rounded"
                placeholder="e.g. Yes, because..."></textarea>
        </div>

        <!-- GitHub Submit Button -->
        <button @click="submitToGithub" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Submit as GitHub Issue
        </button>
    </div>
</template>

<style lang="scss">
.hero-cards {
    label {
        height: 2em;
    }
}

.card-tier {
    height: 1.25em;
    width: 1.25em;

    margin: 0 .5em;

    vertical-align: middle;
    text-align: center;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    font-weight: bold;
    color: #000;
    text-shadow: 1px 0 0 #FFF, -1px 0 0 #FFF, 0 1px 0 #FFF, 0 -1px 0 #FFF;

    border-radius: 50%;
    background-color: var(--card-background-primary);
    box-shadow: 0 0 2px #000;
}
</style>
