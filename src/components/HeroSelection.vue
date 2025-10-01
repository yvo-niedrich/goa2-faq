<script setup lang="ts">
import { heroes, expansions, sortByComplexity, sortByExpansion, sortByName, sortExpansion } from '@/data/heroes';
import HeroIcon from '@/components/icons/HeroIcon.vue'
import { useViewport } from '@/viewport';
import { computed, ref } from 'vue';
import SearchInput from '@/components/SearchInput.vue';
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

defineProps<{
    'onClick'?: (h: Hero) => unknown;
    'scale'?: number
}>();

type SortFn<T> = (a: T, b: T) => number;

const { t: $translate } = useI18n();

const layouts: {
    [name: string]: {
        label: string,
        sortOrder: SortFn<Hero>[],
        groupBy: null | ((h: Hero) => string),
        groupOrder: null | SortFn<string>,
    }
} = {
    'box': {
        label: 'app.sortby.box',
        sortOrder: [sortByExpansion, sortByComplexity, sortByName],
        groupBy: h => h.expansion,
        groupOrder: sortExpansion,
    },
    'complexity': {
        label: 'app.sortby.complexity',
        sortOrder: [sortByComplexity, sortByName],
        groupBy: h => `${'\u2605'.repeat(h.complexity)}`,
        groupOrder: (a, b) => a.length - b.length,
    },
    'name': {
        label: 'app.sortby.name',
        sortOrder: [sortByName],
        groupBy: null,
        groupOrder: null,
    },
};

const { filteredExpansions: filterExp, selectionLayout: layout } = storeToRefs(useAppStore());

const { isTablet, isDesktop } = useViewport();
const portraitHeight = computed(() => isDesktop.value ? 250 : isTablet.value ? 200 : 150);
const filterName = ref<string>('');

function sortBy<T>(compareFns: SortFn<T>[]): SortFn<T> {
    return (a, b) => compareFns.reduce((acc, fn) => acc || fn(a, b), 0);
}

function sortIf<T>(list: T[], s: null | SortFn<T>): T[] {
    return s ? list.sort(s) : list;
}

const list = computed(() => {
    const filtered = Object.values(heroes)
        .filter(h => filterExp.value.length === 0 || filterExp.value.includes(h.expansion))
        .filter(h => h.name.toLowerCase().includes(filterName.value.toLowerCase()));

    const { sortOrder, groupBy } = layouts[layout.value];

    const sortFn = sortBy(sortOrder);
    if (!groupBy) {
        return filtered.sort(sortFn);
    }

    const obj: { [group: string]: Hero[] } = {};
    filtered.forEach((h) => {
        const key = groupBy(h);
        if (!obj.hasOwnProperty(key)) obj[key] = [];
        obj[key].push(h);
    });

    Object.keys(obj).forEach(k => obj[k].sort(sortFn));
    return obj;
});

function objectMap<T, S>(object: { [key: string]: T }, mapFn: (t: T) => S): { [key: string]: S } {
    return Object.keys(object).reduce(function (result, key) {
        result[key] = mapFn(object[key])
        return result
    }, {})
}

const sortChoices = computed(() => objectMap(layouts, l => $translate(l.label)));
</script>


<template>
    <div>
        <div class="search-bar">
            <SearchInput v-model:name="filterName" v-model:choices="filterExp" v-model:sortBy="layout"
                :options="expansions" :sortByOptions="sortChoices" :placeholder="$t('app.button.search')" />
        </div>
        <div v-if="Array.isArray(list)" class="list">
            <HeroIcon v-for="h of list" :key="h.id" :height="portraitHeight * (scale || 1)" :name="h.name"
                :path="h.icon" :complexity="h.complexity" :onClick="() => onClick ? onClick(h) : false" />
        </div>
        <div v-else class="groups">
            <div v-for="group of sortIf(Object.keys(list), layouts[layout].groupOrder)" :key="group" class="group">
                <h2 class="group-title">{{ group }}</h2>
                <div class="list">
                    <HeroIcon v-for="h of list[group]" :key="h.id" :height="portraitHeight * (scale || 1)"
                        :name="h.name" :path="h.icon" :complexity="h.complexity"
                        :onClick="() => onClick ? onClick(h) : false" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.list {
    transition: .5s ease-out;
    text-align: center;
    padding: 0 1.25em;

    @media (max-width: 765px) {
        padding: 0 .5em;
    }

    .hero-icon {
        margin-left: -1.15rem;
        margin-right: -1.15rem;
        margin-bottom: 0.25rem;

        @media (max-width: 1080px) {
            margin-left: -1rem;
            margin-right: -1rem;
        }

        @media (max-width: 765px) {
            margin-left: -.725rem;
            margin-right: -.725rem;
        }
    }
}

.groups {
    .group {
        position: relative;
        border: 1px solid var(--color-border);
        transition: .25s ease-out;
        background: linear-gradient(0deg, var(--color-background-mute) 30%, var(--color-background) 90%);
        margin: 1em 0 1.5em 0;
        border-radius: 1em;
        border: 1px solid #000;
        box-shadow: 0 0 1px #CCC;

        padding: 0;

        h2 {
            position: absolute;
            z-index: 1;
            top: -.75em;
            left: .5em;
            background: linear-gradient(0deg, var(--color-background-mute) 20%, transparent);
            border-radius: .3em;
            padding: 0 .4em 0 .4em;
            text-shadow: 1px 1px 3px #000, -1px -1px 3px #000;
            line-height: 1.3em;

            &::after {
                content: "";
                position: absolute;
                bottom: -1px;
                left: 2.5%;
                width: 95%;
                height: 1px;
                background-image: linear-gradient(to right, rgba(0, 0, 0, 0), var(--color-border-hover), rgba(0, 0, 0, 0));
            }


            @media (max-width: 765px) {
                font-size: 1.25em;
            }

            @media (max-width: 580px) {
                font-size: 1.15em;
            }

            @media (max-width: 480px) {
                font-size: 1.1em;
            }
        }
    }
}
</style>
