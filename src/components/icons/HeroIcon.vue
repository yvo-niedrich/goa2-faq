<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        name?: string;
        complexity?: number;
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
    return Math.min(2, Math.max(0.75, props.height / ((props.name?.length ?? 0) >= 12 ? 210 : 180)))
})

function handleClick() {
    if (props.onClick) {
        props.onClick();
    }
}

</script>

<template>
    <div class="hero-icon" :class="{ animate, inline, pointer: !!onClick }" @click="handleClick"
        :style="{ backgroundImage: `url(${path})`, height: `${height}px`, width: `${height * f}px`, fontSize: `${fs}rem` }">
        <div class="icon-container-left">
            <slot />
        </div>
        <div v-if="complexity" class="hero-complexity">
            <template v-for="index in complexity" :key="index">&starf;</template>
        </div>
        <div v-if="name" class="name-overlay">
            <div class="name-overlay-text">{{ name }}</div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.hero-icon {
    position: relative;
    clip-path: polygon(22% 0%, 100% 0%, 78% 100%, 0% 100%);

    mask-image: url('data:image/svg+xml,<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="220pt" height="290pt" viewBox="0 0 220 290"><polygon points="48.4,0 220,0 171.6,290 0,290" style="fill:%23000000;stroke:none;" /></svg>');
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;

    pointer-events: all;

    transition-duration: .5s;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;


    &.inline {
        display: inline-block;
    }

    &.pointer {
        cursor: pointer;
    }

    .icon-container-left {
        position: absolute;
        top: 2px;
        left: 22.5%;
    }

    .name-overlay,
    .name-overlay-text {
        display: flex;
        justify-content: center;
    }

    .hero-complexity {
        user-select: none;
        transition: .5s ease-out;
        position: absolute;
        top: 0;
        right: 4%;
        opacity: .75;

        line-height: 1em;
        color: gold;
        text-shadow: 1px 1px 6px #000;
        text-shadow: -1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333, 2px 2px 6px #000;
        font-size: .9em;
    }

    .name-overlay {
        flex-direction: column;
        padding-top: 40%;
        padding-right: 10%;
        height: 100%;

        user-select: none;
    }

    .name-overlay-text {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

        transition-duration: 1s;
        padding: .2em 0;
        align-items: center;
        font-weight: bold;
        color: #dfdfdf;
        background-color: rgba(0, 0, 0, .65);
        text-shadow: #000 0 0 8px;
        border-top: 1px solid rgba(255, 255, 255, .5);
        border-bottom: 1px solid rgba(255, 255, 255, .5);
    }

    &.animate:hover .name-overlay-text {
        color: #fff;
        background-color: rgba(0, 0, 0, .75);
        border-top: 1px solid rgba(255, 255, 255, .8);
        border-bottom: 1px solid rgba(255, 255, 255, .8);
        box-shadow: 0px 0px .75em 1.25em rgba(0, 0, 0, .5);
    }
}
</style>
