import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import nightwatchPlugin from 'vite-plugin-nightwatch';
import { VitePWA } from 'vite-plugin-pwa';

const hash = (Math.random() + 1).toString(36).substring(2);

// https://vite.dev/config/
export default defineConfig({
    base: '/goa2-faq/',

    define: {
        __APP_VERSION__: JSON.stringify(require('./package.json').version),
        __APP_REPO__: JSON.stringify(require('./package.json').repository.url),
        __APP_URL__: JSON.stringify(require('./package.json').homepage),
        __APP_BUILD_HASH__: '\"' + hash + '\"',
        __APP_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },

    plugins: [
        vue(),
        vueJsx(),
        vueDevTools(),
        nightwatchPlugin(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'locales/*.json', 'hero/*.png'],
            manifest: {
                name: 'Guards of Atlantis 2 :: FAQ',
                short_name: 'GoA2 :: FAQ',
                description: 'Card Texts & FAQ',
                background_color: '#283741',
                theme_color: '#689db4',
                icons: [
                    {
                        src: 'favicon/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'favicon/icon-256x256.png',
                        sizes: '256x256',
                        type: 'image/png',
                    },
                    {
                        src: 'favicon/icon-256x256.png',
                        sizes: '256x256',
                        type: 'image/png',
                        purpose: 'any',
                    },
                    {
                        src: 'favicon/icon-256x256.png',
                        sizes: '256x256',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
