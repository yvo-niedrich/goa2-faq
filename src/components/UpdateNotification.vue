<script setup lang="ts">
import { ref } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

const showReload = ref(false);

const { updateServiceWorker } = useRegisterSW({
    onNeedRefresh() {
        showReload.value = true;
    },
    onRegisteredSW(swUrl) {
        console.log('Service worker registered:', swUrl);
    },
});
</script>

<template>
    <Teleport to="body">
        <div v-if="showReload" class="app-update-notification" role="alert">
            <span>⚠️ New version available.</span>
            <button @click="updateServiceWorker()">Reload</button>
        </div>
    </Teleport>
</template>

<style lang="scss">
.app-update-notification {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background: #333;
    color: white;
    padding: 0.75em 1em;
    border: 1px solid #666;
    border-radius: 6px;
    box-shadow: 0 0 8px rgb(0, 0, 0);
    display: flex;
    align-items: center;
    gap: 1em;
    z-index: 1000;

    button {
        background: #fff;
        color: #333;
        border: none;
        padding: 0.4em 0.8em;
        font-weight: bold;
        border-radius: 4px;
        cursor: pointer;
    }
}
</style>
