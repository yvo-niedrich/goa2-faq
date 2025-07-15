<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const props = defineProps<{
    date: string;
}>();

const dd = computed(() => new Date(props.date));
const nowRef = ref(new Date());

    const relative = computed(() => {
    const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' });
    const diffMs = dd.value.getTime() - nowRef.value.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const abs = Math.abs;

    const thresholds = [
        { unit: 'year',   value: 60 * 60 * 24 * 365 },
        { unit: 'month',  value: 60 * 60 * 24 * 30 },
        { unit: 'week',   value: 60 * 60 * 24 * 7 },
        { unit: 'day',    value: 60 * 60 * 24 },
        { unit: 'hour',   value: 60 * 60 },
        { unit: 'minute', value: 60 },
        { unit: 'second', value: 1 },
    ];

    for (const { unit, value } of thresholds) {
        const delta = diffSec / value;
        if (abs(delta) >= 1) {
            return rtf.format(Math.round(delta), unit as Intl.RelativeTimeFormatUnit);
        }
    }

    return rtf.format(0, 'second');
});

let interval: number;

/* eslint-disable  @typescript-eslint/no-explicit-any */
onMounted(() => {
    interval = setInterval(() => {
        nowRef.value = new Date();
    }, 60000) as any as number; // 1 minute
});

onUnmounted(() => {
    clearInterval(interval);
});

</script>
<template>
    <span :title="dd.toLocaleString()">{{ relative }}</span>
</template>
