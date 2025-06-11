<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    'name': string;
    'value': number | [number, number];
    'max'?: number
}>(), {
    'max': 8,
});

const statValue = computed(() => Array.isArray(props.value) ? props.value[0] : props.value);
const statPotential = computed(() => Array.isArray(props.value) ? props.value[1] : 0);
</script>

<template>
    <div class="stat">
        <div class="stat-name">{{ name }}</div>
        <div class="stat-value">
            <div v-for="i in max" :key="i"
                :class="{ 'stat-bar': true, 'full': statValue >= i, 'potential': statValue < i && statPotential >= i }"
                :data-bar="i" />
        </div>
    </div>
</template>


<style lang="scss">
.stat {
    display: grid;
    grid-template-columns: 2fr 5fr;

    .stat-name {
        margin-right: 5%;
        text-align: right;
    }

    .stat-value {
        text-align: center;

        .stat-bar {
            display: inline-block;
            height: 50%;
            width: 10%;
            margin: 0 1%;
            border: 1px solid #000;
            border-radius: .15rem;
            box-shadow: 0 0 2px 1px var(--color-border);

            background-color: #00000040;

            &.full {
                background: var(--color-heading-full);
            }

            &.potential {
                background: var(--color-heading-bright);
            }
        }
    }
}
</style>
