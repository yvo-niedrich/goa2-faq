<script setup lang="ts">
import ProposeFAQ from '@/components/Settings/ProposeFAQ.vue';
import QrCode from '@/components/Settings/QrCode.vue';

defineProps<{ setting?: string; }>();
</script>

<template>
    <div v-if="setting === 'faq'">
        <ProposeFAQ />
    </div>
    <div v-else-if="setting === 'qr'">
        <QrCode />
    </div>
    <div v-else>
        <ul>
            <li>
                <RouterLink to="/settings/faq">Propose FAQ</RouterLink>
            </li>
            <li>
                <RouterLink to="/settings/qr">Generate QR Code</RouterLink>
            </li>
        </ul>
    </div>
</template>
