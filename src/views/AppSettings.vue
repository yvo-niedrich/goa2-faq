<script setup lang="ts">
import { ref, watch } from 'vue';
import ProposeFAQ from '@/components/ProposeFAQ.vue';
import { useViewport } from '@/viewport';
import { debounce } from '@/helper/debounce';

const state = ref('');

function goto(newState = '') {
    state.value = newState;
    return false;
}

function getLink(expansions: string[] = []) {
    let url = window.location.origin;

    const baseUrl = import.meta.env.BASE_URL;
    if (baseUrl) {
        if (!url.endsWith('/') && !baseUrl.startsWith('/')) {
            url += '/';
        }
        url += baseUrl;
    }

    if (expansions && expansions.length) {
        if (!url.endsWith('/')) {
            url += '/';
        }

        url += '?expansions=' + encodeURIComponent(expansions.join(','));
    }

    return url;
}



const qrCodeUrl = ref('');

const viewport = useViewport();
watch(viewport.width, debounce(function() {
    const qrSize = Math.min(600, Math.max(150, Math.floor(viewport.width.value * .75)));
    console.log(viewport.width.value, qrSize);
    qrCodeUrl.value = 'http://api.qrserver.com/v1/create-qr-code/?data=' + getLink() +'&size=' + qrSize + 'x' + qrSize;
}, 800), {immediate: true})


</script>

<template>
    <div v-if="state === 'contribute-faq'">
        <ProposeFAQ />
    </div>
    <div v-else-if="state === 'qr'">
        {{ getLink() }}<br />
        <img v-if="qrCodeUrl" :src="qrCodeUrl" />
    </div>
    <div v-else>
        <ul>
            <li><a @click="() => goto('contribute-faq')" href="#">Propose FAQ</a></li>
            <li><a @click="() => goto('qr')" href="#">Generate QR Code</a></li>
        </ul>
    </div>
</template>
