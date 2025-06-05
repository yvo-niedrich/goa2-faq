<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useViewport } from '@/viewport';

const { width, height, isMobile, isTablet, isDesktop } = useViewport();
</script>

<template>
    <header>
        <nav>
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="25" height="25" />
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/hero">Hero</RouterLink>
        </nav>
    </header>

    <div class="content">

        <div class="debug">
            <p>Width: {{ width }}</p>
            <p>Height: {{ height }}</p>
            <p>Mobile: {{ isMobile }}</p>
            <p>Tablet: {{ isTablet }}</p>
            <p>Desktop: {{ isDesktop }}</p>
        </div>
        <RouterView />
    </div>
</template>

<style lang="scss" scoped>
header {
    height: 2rem;
    text-align: center;

    width: 100%;
    position: sticky;
    top: 0;
    background: rgba(48, 68, 77, .75);

    z-index: 10;
    border-bottom: 1px solid black;
    box-shadow: 0 1px 0 rgba(180, 180, 180, .5);
}

.content {
    position: relative;
    transition: 0.2s ease;
    padding: 1rem 2rem 2rem 2rem;

    @media (max-width: 1280px) {
        padding: 1rem 1rem 1rem 1rem;
    }
}

.debug {
    position: absolute;
    top: 5px;
    right: 5px;

    background: #FFF;
    border: 1px solid #000;
    padding: 5px;
    border-radius: 1em;
    font-size: 12px;
}

header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
}

.logo {
    display: inline-block;
}

nav {
    width: 100%;
    text-align: center;
    background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0) 95%);
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    height: 100%;
    padding: .2em 1rem;
    border-left: 1px solid var(--color-border);
    vertical-align: top;
}

nav a:first-of-type {
    border: 0;
}
</style>
