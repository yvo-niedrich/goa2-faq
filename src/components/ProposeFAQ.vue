

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { sortByName, heroes } from '@/data/heroes';

function generateId(length = 8) {
    let result = '';
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        l = c.length;
    for (let i = 0; i < length; i++) {
        result += c.charAt(Math.floor(Math.random() * l));
    }
    return result;
}

const selectedHero = ref<null|Hero>();
const selectedCards = ref<Card[]>([]);
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
    {[faqId.value]: {
        q: faqQuestion.value.trim(),
        a: faqAnswer.value.trim() || null,
        ref: selectedCards.value.map(c => c.id),
    }},
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
            <select id="hero" v-model="selectedHero" class="w-full p-2 border rounded">
                <option disabled value="">-- Choose a hero --</option>
                <option v-for="hero in Object.values(heroes).sort(sortByName)" :key="hero.id" :value="hero">
                    {{ hero.name }}
                </option>
            </select>
        </div>

        <!-- Card Selection -->
        <div v-if="cardsForHero.length > 0">
            <label class="block font-medium mb-1">Related Cards</label>
            <div class="space-y-1 max-h-40 overflow-y-auto border p-2 rounded">
                <div v-for="card in cardsForHero" :key="card.id" class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        :id="card.id"
                        :value="card"
                        v-model="selectedCards"
                    />
                    <label :for="card.id">{{ card.name }}</label>
                </div>
            </div>
        </div>

        <!-- FAQ Question -->
        <div>
            <label for="faqQuestion" class="block font-medium mb-1">Question</label>
            <input
                type="text"
                id="faqQuestion"
                v-model="faqQuestion"
                placeholder="How does this ability interact with ...?"
            />
        </div>

        <!-- FAQ Answer (optional) -->
        <div>
            <label for="faqAnswer" class="block font-medium mb-1">Answer (optional)</label>
            <textarea
                id="faqAnswer"
                v-model="faqAnswer"
                rows="3"
                class="w-full p-2 border rounded"
                placeholder="e.g. Yes, because..."
            ></textarea>
        </div>

        <!-- GitHub Submit Button -->
        <button
            @click="submitToGithub"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
            Submit as GitHub Issue
        </button>
    </div>
</template>
