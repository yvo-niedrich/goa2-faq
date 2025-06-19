import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: { name: 'heroes' },
        },
        {
            path: '/hero/:hero?',
            name: 'heroes',
            props: true,
            component: () => import('@/views/HeroesView.vue'),
        },
        {
            path: '/me',
            name: 'player',
            props: true,
            component: () => import('@/views/PlayerView.vue'),
        },
    ],
    scrollBehavior() {
        return { top: 0 };
    },
});

export default router;
