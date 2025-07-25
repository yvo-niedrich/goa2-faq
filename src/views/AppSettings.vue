<script setup lang="ts">
import ProposeFAQ from '@/components/Settings/ProposeFAQ.vue';
import QrCode from '@/components/Settings/QrCode.vue';

defineProps<{ setting?: string; }>();

const IS_DEV = import.meta.env.DEV;
</script>

<template>

    <div v-if="setting">
        <RouterLink class="settings-back no-print" to="/settings">
            <img src="@/assets/back-arrow.svg" width="20" />
        </RouterLink>
        <ProposeFAQ v-if="setting === 'faq'" />
        <QrCode v-else-if="setting === 'qr'" />
    </div>
    <div v-else>
        <div class="app-settings">
            <div v-if="IS_DEV">
                <RouterLink to="/settings/faq">Propose FAQ</RouterLink>
            </div>
            <div>
                <RouterLink to="/settings/qr">Generate QR Code</RouterLink>
            </div>
        </div>
    </div>
</template>

<style>
a.settings-back {
    float: left;
    margin-top: .5em;
    padding: 0 .75em;
    margin-right: .5em;
}

div.app-settings {
    text-align: center;

    a {
        display: block;
        width: 50em;
        max-width: 85%;
        margin: 1.5em auto;
        padding: .75em;
        border: 1px solid var(--color-border);
        border-radius: .75em;
        box-shadow: 0 0 4px var(--color-background-mute);

        &:hover {
            box-shadow: 0 0 8px var(--color-background-mute);
        }
    }
}
</style>
