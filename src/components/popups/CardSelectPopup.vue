<script setup lang="ts">
import HeroCard from '../HeroCard.vue';

const props = defineProps<{
    cards: Card[],
    select: (card: Card) => boolean | null | void
    close: () => boolean | null | void
}>()

function choice(c: Card) {
    props.select(c);
    props.close();
}

</script>

<template>
    <Teleport to="body">
        <div class="card-select-overlay" @click.self="close">
            <div class="card-select-popup">
                <button class="close-btn" @click="close">×</button>

                <div class="scroll-container">
                    <div class="card-select-scroll">
                        <div v-for="(card, id) in cards" :key="id" class="card-select-record">
                            <HeroCard :card="card" />
                            <div style="text-align: center;">
                                <input class="popup-select" type="button" value="Select" @click="() => choice(card)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style lang="scss">
.card-select-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 900;
}


.card-select-popup {
    transition: .5s ease-out;
    background: var(--color-background);
    border: 1px solid var(--color-border-hover);
    margin: 0 1.5em 0 1.15em;

    box-shadow:
        inset 2px 2px 5px #000,
        inset -2px -2px 5px #000,
        2px 2px 10px 1px #000,
        -2px -2px 10px 1px #000;


    border-radius: 0.75rem;
    padding: 1em 0;
    max-width: 800px;
    width: 90%;
    max-height: 90vh;
    min-height: 15vh;
    position: relative;
    display: flex;
    flex-direction: column;

    @media (max-width: 520px) {
        font-size: .9em;
        width: 95%;
    }


    .close-btn {
        position: absolute;
        top: -0.65em;
        right: -0.65em;

        transition: .5s ease-out;
        cursor: pointer;


        /* Orange badge */
        outline: 0;
        border: 1px solid var(--color-border-hover);
        background-color: var(--color-background-soft);
        color: var(--color-text-muted);
        text-shadow: 0 0 1px #000000;

        font-weight: bold;
        vertical-align: top;
        font-size: 1.8em;
        padding: 0.1em 0.225em 0.2em 0.225em;
        border-radius: 40%;
        box-shadow: 0 0 8px #000000;
        z-index: 1;
        line-height: 1em;


        &:hover {
            color: var(--color-text);
            background-color: var(--color-background-mute);
            border: 1px solid var(--color-border-highlight);
            box-shadow: 0 0 5px #000000;
        }
    }

    .scroll-container {
        flex: 1;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }


    .card-select-scroll {
        position: relative;
        overflow-y: auto;
        flex: 1;
        padding: 0 .75em .5em;
    }

    .card-select-record:not(:last-of-type) {
        position: relative;
        padding-bottom: 1.25em;
        margin-bottom: 1.25em;

        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            /* or use top: 100% if you want it below the div */
            left: 2.5%;
            /* to match 95% width with centered alignment */
            width: 95%;
            height: 1px;
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0));
        }
    }

    .hero-card {
        margin: .5em auto;
    }

    input[type="button"] {
        --btn-color-top: var(--color-border-highlight);
        --btn-color-middle: var(--color-border-highlight);
        --btn-color-bottom: var(--color-background-highlight);

        transition: 0.5s ease;
        background: linear-gradient(to bottom, var(--btn-color-top), var(--btn-color-middle), var(--btn-color-bottom));
        background-position-y: 0;
        background-repeat: no-repeat no-repeat;

        color: var(--color-text-dark);
        border: 1px solid #000;
        margin: 0 auto;
        padding: 0.6em 15%;
        font-size: 1rem;
        border-radius: 1em;
        cursor: pointer;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

        &:hover {
            --btn-color-middle: var(--color-background-highlight);
            --btn-color-bottom: var(--color-background-mute);
            box-shadow: 0 1px 2px rgba(60, 60, 60, 0.5);
            color: #000;
        }

        &:active {
            transform: scale(0.97);
        }
    }
}
</style>
