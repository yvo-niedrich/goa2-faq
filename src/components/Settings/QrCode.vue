<script setup lang="ts">
import { ref, watch } from 'vue';
import { debounce } from '@/helper/debounce';
import { useViewport } from '@/viewport';
import { expansions } from '@/data/heroes';


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

    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    return url;
}

const qrCodeUrl = ref('');
const selectedExpansions = ref([]);

const viewport = useViewport();
watch([viewport.width, selectedExpansions], debounce(function () {
    const qrSize = Math.min(600, Math.max(150, Math.floor(viewport.width.value * .75)));
    qrCodeUrl.value = 'http://api.qrserver.com/v1/create-qr-code/?data=' + getLink(selectedExpansions.value) + '&size=' + qrSize + 'x' + qrSize;
}, 800), { immediate: true })

</script>

<template>
    <div>
        <h2 class="no-print">{{ $t('app.settings.generate-qr') }}</h2>
        <div class="expansion-filter no-print">
            <ul>
                <li v-for="option in expansions" :key="option">
                    <label>
                        <input type="checkbox" :value="option" v-model="selectedExpansions" />
                        &nbsp;{{ option }}
                    </label>
                </li>
            </ul>
        </div>

        <div class="qr-container" v-if="qrCodeUrl">
            <div class="qr-raw no-print">{{ getLink(selectedExpansions) }}</div>
            <div class="qr-raw print-only">{{ getLink() }}</div>

            <div class="qr-wrapper">
                <img :src="qrCodeUrl" />
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.expansion-filter {

    transition: .25s ease-out;
    background: var(--color-background-mute);
    margin: 1em 0;
    border-radius: 1em;
    border: 1px solid #000;
    box-shadow: 0 0 1px #CCC;

    padding: 1em;

    ul {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        list-style-type: none;
        margin: 0;
        padding: 0;

        @media (max-width: 750px) {
            grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 580px) {
            grid-template-columns: repeat(2, 1fr);
        }


        @media (max-width: 320px) {
            grid-template-columns: none;
        }

        label {
            transition: 0.5s ease-out;
            display: block;
            min-width: 50%;
            padding: .25em 1em;
            margin: 0 .5em 0 0;
            border: 1px solid transparent;
            border-radius: .75em;

            &:hover {
                border: 1px solid var(--color-border);
            }
        }
    }
}

.qr-container {
    margin-top: 2.5em;
    text-align: center;

    .qr-raw {
        font-family: monospace;
        font-size: 1.1em;
        line-height: 1.75em;
        white-space: pre;
        font-weight: bold;
        margin: .5em 0;

        &.print-only {
            font-size: 2.5em;
            line-height: 2em;
        }
    }

    .qr-wrapper {
        margin: 0 auto;
        padding: 1em;
        background-color: #FFFFFF;
        border: 1px solid var(--color-border);
        border-radius: .5em;
        display: inline-block;
        box-shadow: 0 0 10px #000000;

        @media print {
            box-shadow: none;
            border: none;
            padding: 1.5em;
        }
    }
}
</style>
