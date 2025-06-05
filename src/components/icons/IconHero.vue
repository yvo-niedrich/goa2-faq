<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        name?: string;
        path: string;
        height?: number;
        animate?: boolean;
        inline?: boolean;
        onClick?: () => void;
    }>(),
    { height: 200, animate: true, inline: true }
);

const f = 293 / 387;

const fs = computed(() => {
    return Math.min(2, Math.max(0.75, props.height / 200))
})

function handleClick() {
    if (props.onClick) {
        props.onClick();
    }
}

</script>

<template>
    <div class="hero-icon" :class="{ animate, inline }" @click="handleClick"
        :style="{ backgroundImage: `url(${path})`, height: `${height}px`, width: `${height * f}px`, fontSize: `${fs}rem` }">
        <div v-if="name" class="name-overlay">
            <div class="name-overlay-text">{{ name }}</div>
        </div>
    </div>
</template>


<style lang="scss">
.hero-icon {

    &.inline {
        display: inline-block;
    }

    clip-path: polygon(22% 0%, 100% 0%, 78% 100%, 0% 100%);

    mask-image: url("/mask.svg");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;

    cursor: pointer;
    pointer-events: all;

    transition-duration: .5s;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    .name-overlay,
    .name-overlay-text {
        display: flex;
        justify-content: center;
    }

    .name-overlay {
        flex-direction: column;
        padding-top: 40%;
        padding-right: 10%;
        height: 100%;

        user-select: none;
    }

    .name-overlay-text {
        transition-duration: .5s;
        padding: .2em 0;
        align-items: center;
        font-weight: bold;
        color: #eee;
        background-color: rgba(0, 0, 0, .5);
        text-shadow: #000 0 0 3px;
        border-top: 1px solid rgba(255, 255, 255, .5);
        border-bottom: 1px solid rgba(255, 255, 255, .5);
    }

    &.animate:hover .name-overlay-text {
        color: #fff;
        background-color: rgba(0, 0, 0, .9);
        border-top: 1px solid rgba(255, 255, 255, .8);
        border-bottom: 1px solid rgba(255, 255, 255, .8);
        box-shadow: 0px 0px .75em 1.25em rgba(0, 0, 0, .85);
    }
}
</style>
