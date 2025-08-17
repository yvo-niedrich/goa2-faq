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

const store = useFaqStore();
const { hero, cards } = storeToRefs(store);
const selectedHero = computed(() => hero.value ? get(hero.value) : null);
const selectedCards = computed<Card[]>(() => cards.value?.length && selectedHero.value ? selectedHero.value.cards.filter(c => cards.value.includes(c.id)) : []);
const faqQuestion = ref('');
const faqAnswer = ref('');
const faqId = ref(generateId());
const submitInProgress = ref(false);


const cardsForHero = computed(() => {
    if (!selectedHero.value) return [];
    return selectedHero.value.cards;
});

function submitToGithub() {
    if (!selectedHero.value) {
        (document.querySelector('#hero-select') as HTMLElement)?.focus();
        return false;
    }

    if (!faqQuestion.value) {
        (document.querySelector('#faqQuestion') as HTMLElement)?.focus();
        return false;
    }


    const labels = ['documentation'];
    if (!faqAnswer.value.trim()) labels.push('help wanted');

    let prefixKey: string, heroName: string;
    if (cards.value.map(k => k.substring(0, 4)).filter((v, i) => cards.value.indexOf(v) === i).length > 1) {
        prefixKey = 'common';
        heroName = 'Multiple'
    } else {
        prefixKey = selectedHero.value.id;
        heroName = selectedHero.value.name;
    }
    const issueTitle = `FAQ: ${heroName}`;
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
            [`faq-${prefixKey}-${faqId.value}`]: {
                q: faqQuestion.value.trim(),
                a: faqAnswer.value.trim() || null,
                ref: cards.value.sort(),
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
    submitInProgress.value = true;
}

function reset() {
    store.$reset();
    faqId.value = generateId();
    submitInProgress.value = false;
    (document.activeElement as HTMLElement)?.blur();
}
</script>


<template>
    <div class="faq-proposal">
        <h2>{{ $t('app.settings.propose-FAQ') }}</h2>

        <div class="faq-contents">
            <div class="faq-hero-wrapper">
                <!-- Hero Selection -->
                <div class="faq-hero">
                    <select id="hero-select" v-model="hero" class="">
                        <option disabled value="">-- Choose a hero --</option>
                        <option v-for="hero in Object.values(heroes).sort(sortByName)" :key="hero.id" :value="hero.id">
                            {{ hero.name }}
                        </option>
                    </select>
                </div>

                <!-- Card Selection -->
                <div class="faq-cards">
                    <div v-for="card in cardsForHero" :key="card.id" class="hero-card"
                        :class="{ [`hero-card-color-${card.color}`]: true, 'hero-card-alternative': card.alternative }">

                        <label :for="card.id">
                            <input type="checkbox" :id="card.id" :value="card.id" v-model="cards" />
                            <span class="checkmark"></span>
                            <span class="card-tier"> {{ card.tier }} </span>
                            <span class="card-name"> {{ card.name }} </span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="faq-query-wrapper">
                <!-- FAQ Question -->
                <div class="legend-input input-question">
                    <label for="faqQuestion">Question</label>
                    <input type="text" id="faqQuestion" v-model="faqQuestion"
                        placeholder="How does this ability interact with trees?" />
                </div>

                <!-- FAQ Answer (optional) -->
                <div class="legend-input input-answer">
                    <label for="faqAnswer">Answer (optional)</label>
                    <textarea id="faqAnswer" v-model="faqAnswer" rows="5"
                        placeholder="Trees are obsticales!"></textarea>
                </div>
            </div>
        </div>

        <div class="faq-buttons">
            <button class="faq-submit-github" @click="submitToGithub">
                Submit
            </button>
            <button class="faq-reset" @click="reset">
                Reset
            </button>

        </div>
    </div>
</template>

<style lang="scss">
.hero-cards {
    label {
        height: 2em;
    }
}

.faq-hero {
    margin: 0 15% 1em;

    select {
        background-color: #2b2f34;
        color: #f1f1f1;
        padding: 0.6em 2.5em 0.6em 1em;
        border: 1px solid #555;
        border-radius: 6px;
        background-repeat: no-repeat;
        background-position: right 0.7em center;
        background-size: 1em;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;
        width: 100%;
        box-sizing: border-box;


        /* Hover + focus */
        &:hover,
        &:focus {
            border-color: #888;
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        /* Disabled state */
        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }

}

.faq-contents {
    display: grid;
    grid-template-columns: 1fr 2fr;
    column-gap: 1.5em;
    row-gap: 1em;
    margin: 0 .15em;

    transition: 0.25s ease-out;
    background: linear-gradient(0deg, var(--color-background-mute) 30%, var(--color-background) 90%);
    margin: 1em 0 1.5em 0;
    border-radius: 1em;
    border: 1px solid #000;
    box-shadow: 0 0 1px #CCC;
    padding: 1em;


    @media (max-width: 680px) {
        grid-template-columns: 1fr;
    }

    .faq-cards {
        padding: .5em .25em;

        .hero-card label {
            display: flex;
            align-items: center;

            border: 1px solid var(--color-border);
            border-radius: .5em;
            padding: .25em .3em;
            margin: .3em;

            cursor: pointer;

            &:hover {
                background: var(--color-background-soft) !important;
                border: 1px solid var(--color-border-hover);
            }

            &:has(input:checked),
            &:has(input[checked="checked"]) {
                background: var(--color-background-softer);
            }

            input[type="checkbox"] {
                display: none;
            }

            .checkmark {
                display: inline-block;
                width: 20px;
                height: 20px;


                background-color: rgb(30, 44, 49);
                border: 2px solid #ccc;
                border-radius: 4px;
                margin-right: 8px;
                vertical-align: middle;
                position: relative;
                cursor: pointer;
            }

            input:checked+.checkmark::after {
                content: "";
                position: absolute;
                left: 5px;
                top: 1px;
                width: 6px;
                height: 12px;
                border: solid #ccc;
                border-width: 0 2px 2px 0;
                transform: rotate(45deg);
            }

            &:hover .checkmark {
                background-color: rgb(87, 85, 81);
            }

            .card-tier {
                height: 1.3em;
                width: 1.3em;

                margin: 0 .5em;

                vertical-align: middle;
                text-align: center;

                display: inline-flex;
                align-items: center;
                justify-content: center;

                font-weight: bold;
                color: #000;
                text-shadow: 1px 0 0 #FFF, -1px 0 0 #FFF, 0 1px 0 #FFF, 0 -1px 0 #FFF;

                // outline: 1px solid #000;
                border-radius: 50%;
                background-color: var(--card-background-primary);
                box-shadow: 0 0 2px #000;
            }
        }
    }

    .faq-query-wrapper {
        margin: 1em;

        input,
        textarea {
            box-sizing: border-box;
            background-color: #f8f8f8;
            resize: none;
        }

        textarea {
            min-height: 50vh;
            max-height: 600px;
        }
    }
}

.legend-input {
    position: relative;
    margin-bottom: 1.5em;

    &:focus-within textarea,
    &:focus-within input,
    &:focus-within label {
        border-color: #333;
    }

    &:focus-within textarea,
    &:focus-within input {
        box-shadow: 0 0 3px #eee;
    }

    input,
    textarea {
        width: 100%;
        padding: .75em;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        box-sizing: border-box;
        outline: none;
    }

    label {
        position: absolute;
        top: 0;
        left: 0;
        transform: translateY(-50%);
        background: white;
        padding: 0 1em;
        font-size: 0.88em;
        color: #777;
        pointer-events: none;
        border-radius: .5em;
        border-bottom-left-radius: 0;
        outline: none;
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
    }
}

.faq-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 1em;
    margin: 0 .25em;
    padding-bottom: 2em;

    button {
        padding: 0.6em 1em;
        background-color: #2b2f34;
        color: #f1f1f1;
        font-size: 1.25rem;
        line-height: 1.5rem;
        font-weight: bold;
        border: 1px solid #555;
        border-radius: 6px;
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        max-width: 350px;
        margin: auto;

        @media (max-width: 680px) {
            font-size: 1rem;
        }

        &:hover,
        &:focus {
            border-color: #888;
            outline: none;
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }
    }

    .faq-submit-github {
        padding: 0.6em 1em 0.6em 3.5em;
        background-image: url('/github-mark-white.svg');
        background-repeat: no-repeat;
        background-position: left 0.7em center;
        background-size: auto 70%;
    }
}
</style>
