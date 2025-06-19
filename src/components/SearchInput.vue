<script setup lang="ts">

interface Option {
    value: string;
    label: string;
}

defineProps<{
    modelValue: string;
    placeholder?: string;
    filterKey?: string;
    options?: Option[];
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'update:filterKey', value: string): void;
}>();
</script>

<template>
    <div class="search-input">
        <div class="search-input__wrapper">
            <input type="text" :value="modelValue"
                @input="event => emit('update:modelValue', (event.target as HTMLInputElement).value)"
                class="search-input__field" :placeholder="placeholder ?? 'Search...'" />

            <svg class="search-input__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                    fill="currentColor" stroke="currentColor" />
            </svg>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.search-input {
    width: 100%;
    max-width: 32rem;

    &__wrapper {
        display: flex;
        align-items: center;
        position: relative;
    }

    &__field {
        flex: 1;
        padding: 0.5em 1.5em 0.5em 1em;
        border: 1px solid var(--color-border-shadow);
        border-radius: 1.25em;
        // box-shadow: 0 1px 2px var(--color-border-hover);
        outline: none;

        &:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
    }

    &__icon {
        position: absolute;
        left: auto;
        right: 1em;
        top: 50%;
        transform: translateY(-50%);
        width: 1.5em;
        height: 1.5em;
        color: #9ca3af;
        pointer-events: none;
    }
}
</style>
