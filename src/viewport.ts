import { ref, onMounted, onUnmounted } from 'vue';

export function useViewport() {
    const mobileHorizontalBoundary = 500;
    const mobileBoundary = 768;
    const desktopBoundary = 1080;

    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);
    const isMobileVertical = ref(width.value < mobileHorizontalBoundary);
    const isMobileHorizontal = ref(
        width.value >= mobileHorizontalBoundary && width.value < mobileBoundary,
    );
    const isMobile = ref(width.value < mobileBoundary);
    const isTablet = ref(width.value >= mobileBoundary && width.value < desktopBoundary);
    const isDesktop = ref(width.value >= desktopBoundary);

    function updateSize() {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
        isMobileVertical.value = width.value < mobileHorizontalBoundary;
        isMobileHorizontal.value =
            width.value >= mobileHorizontalBoundary && width.value < mobileBoundary;
        isMobile.value = width.value < mobileBoundary;
        isTablet.value = width.value >= mobileBoundary && width.value < desktopBoundary;
        isDesktop.value = width.value >= desktopBoundary;
    }

    onMounted(() => {
        window.addEventListener('resize', updateSize);
        updateSize();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateSize);
    });

    return {
        width,
        height,
        isMobile,
        isMobileVertical,
        isMobileHorizontal,
        isTablet,
        isDesktop,
        mobileBoundary,
        desktopBoundary,
        mobileHorizontalBoundary,
    };
}
