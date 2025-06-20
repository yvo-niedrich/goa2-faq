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
                <div class="card-select-scroll">
                    <div v-for="(card, id) in cards" :key="id" class="card-select-record">
                        <HeroCard :card="card" />
                        <input type="button" value="Select" @click="() => choice(card)" />
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
        background: #202d33;
        border: 1px solid #FFF;
        box-shadow: 0 0 10px 4px #000;

        border-radius: 0.75rem;
        padding: 1.5rem;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        min-height: 15vh;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;

        @media (max-width: 520px) {
            font-size: .9em;
            padding: 1rem .5rem;
            width: 95%;
        }


        .card-select-scroll {
            overflow-y: auto;
            flex: 1;
            padding-right: 0.5rem;
        }

        .close-btn {
            top: .05rem;
            right: .15rem;

            margin: 0;
            padding: .2em;
            line-height: .75em;

            position: absolute;
            background: transparent;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--color-text);

            opacity: .5;
            transition: 1s ease-out;

            &:hover {
                opacity: 1;
                text-shadow: 1px 1px 3px #999;
            }
        }

    }
</style>
