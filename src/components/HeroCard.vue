<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { count as countFaq } from '@/data/faq'
import { useFaqStore } from '@/stores/faq'
import Markdown from './Markdown.vue';

const props = defineProps<{ card: Card; }>();
const hasFaq = computed(() => countFaq(props.card.id) > 0)

function showFAQs() {
    if (hasFaq.value) {
        useFaqStore().show(props.card.id)
    }
}

const { t: $translate } = useI18n();

function processCardType(type: Card['type']) {
    let tt = $translate('app.card-type.' + (type.basic ? 'basic.' : '') + type.type[0]);

    for (let i = 1; i < type.type.length; i++) {
        tt += ' / ' + $translate('app.card-type.' + type.type[i]);
    }

    if (type.ranged) {
        tt += ' \u2014 ' + $translate('app.card-type.ranged')
    }

    return tt;
}

</script>

<template>
    <div class="hero-card" :class="{ [`hero-card-color-${card.color}`]: true, 'has-faq': hasFaq }" @click="showFAQs()">
        <div class="hero-card-name">{{ card.name }}</div>
        <div v-if="card.tier" class="hero-card-tier">{{ card.tier }}</div>
        <div class="hero-card-type">
            {{ processCardType(card.type) }}
        </div>
        <div class="hero-card-text">
            <Markdown :text="$t(card.text)" />
        </div>
    </div>
</template>


<style lang="scss">
.hero-card {
    &.hero-card-color-y {
        --card-background-primary: var(--color-card-y-primary);
        --card-background-secondary: var(--color-card-y-secondary);
    }

    &.hero-card-color-s {
        --card-background-primary: var(--color-card-s-primary);
        --card-background-secondary: var(--color-card-s-secondary);
    }

    &.hero-card-color-r {
        --card-background-primary: var(--color-card-r-primary);
        --card-background-secondary: var(--color-card-r-secondary);
    }

    &.hero-card-color-g {
        --card-background-primary: var(--color-card-g-primary);
        --card-background-secondary: var(--color-card-g-secondary);
    }

    &.hero-card-color-b {
        --card-background-primary: var(--color-card-b-primary);
        --card-background-secondary: var(--color-card-b-secondary);
    }

    &.hero-card-color-u {
        --card-background-primary: var(--color-card-u-primary);
        --card-background-secondary: var(--color-card-u-secondary);
    }

    position: relative;
    display: flex;
    flex: auto;
    flex-direction: column;
    transition: .2s ease;

    max-width: 600px;
    min-width: 275px;

    border-radius: 1em;
    border: 1px solid #000;

    background-color: rgb(27, 39, 44);
    background-image: url("data:image/svg+xml;utf8,<svg width='10' height='35' xmlns='http://www.w3.org/2000/svg'><rect height='35' width='20' y='-1' x='-5' stroke='%23ffffff' fill='%23313131'/></svg>"),
    url("data:image/svg+xml;utf8,<svg width='10' height='35' xmlns='http://www.w3.org/2000/svg'><rect height='35' width='20' y='1' x='-5' stroke='%23ffffff' fill='%23313131'/></svg>");
    background-repeat: repeat-x,
    repeat-x;
    background-position: top,
    bottom;

    padding: 1em .75em;
    margin: 0.75em 0.5em;

    @media (max-width: 1280px) {
        padding: 0.75em 1em;
        margin: 0.75em 0.25em;
    }

    @media (max-width: 480px) {
        margin: 0.75em 0.25em;
    }

    &.has-faq {
        cursor: pointer;

        &::before {
            content: "?!";
            position: absolute;
            top: -0.5em;
            left: -0.5em;

            background-color: rgba(255, 169, 31, 0.75);
            color: var(--color-text);
            text-shadow: 0 0 1px rgb(95, 59, 0);

            font-weight: bold;
            font-size: 1em;
            padding: 0.25em 0.4em 0.3em 0.4em;
            border-radius: 50%;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.75);
            z-index: 1;
            line-height: 1;
        }

        &:hover::before {
            background-color: rgba(243, 156, 18, 1);
            box-shadow: 0 0 2px rgba(0, 0, 0, 1);
        }
    }

    .hero-card-name {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1.8em;
        min-width: 95%;

        position: relative;
        font-family: 'ModestoPoster', serif;
        font-size: 1.6em;

        color: var(--color-text-dark);
        text-shadow: 0 0 3px #FFFFFF;

        text-shadow: -1px -1px 2px #f3f3f0, 1px -1px 2px #f3f3f0, -1px 1px 2px #f3f3f0, 1px 1px 2px #f3f3f0;
        background: #cfccc2;
        background: linear-gradient(180deg, #dbdad5 0%, #b7b4ae 45%, #b7b4ae 55%, #dbdad5 100%);

        border: 2px solid #2b2b2b;
        border-radius: 1em;
        box-shadow:
            inset 0 0 4px #00000066,
            0 4px 8px #00000033;
        margin-bottom: .5em;

        white-space: pre;
        padding: 0 .15em;
    }

    .hero-card-tier {
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        position: absolute;

        display: flex;
        align-items: center;
        justify-content: center;

        top: .95em;
        right: 1px;

        width: 1.75em;
        height: 1.75em;

        filter: drop-shadow(0 0 2px rgba(255, 255, 255, .6));
        background-image: url("data:image/svg+xml,%3Csvg width='150' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cpath stroke='%23000000' stroke-width='1' fill='%23202525' d='m74.8906,138.72463c1.70625,0 3.28118,-0.19683 5.05295,-0.32787l3.80616,7.21838c0.72181,1.44362 2.16543,2.23095 3.93748,1.9686c1.64045,-0.32815 2.82172,-1.50914 3.01855,-3.28118l1.18127,-7.94019c3.21539,-0.85312 6.43077,-2.09991 9.58064,-3.47802l5.90607,5.3153c1.24679,1.18127 2.82172,1.4439 4.46217,0.52498c1.4439,-0.78733 2.0344,-2.36226 1.70625,-4.06851l-1.64045,-7.87467c2.69041,-1.90308 5.3811,-4.06851 7.80887,-6.49657l7.34969,3.08435c1.64101,0.65601 3.15015,0.32815 4.3975,-1.18127c1.11547,-1.18127 1.24567,-2.88752 0.32787,-4.33114l-4.26562,-6.82472c1.96888,-2.75593 3.54381,-5.70924 5.05323,-8.85883l8.00571,0.39366c1.70569,0.06552 3.14903,-0.85312 3.74036,-2.49358c0.52414,-1.64073 0,-3.21567 -1.37894,-4.26562l-6.2331,-4.98715c0.8534,-3.15015 1.50914,-6.56237 1.77121,-10.1059l7.61204,-2.36226c1.64101,-0.59078 2.69069,-1.83756 2.69069,-3.60933c0,-1.70625 -1.04968,-2.95304 -2.69069,-3.54353l-7.61204,-2.42834c-0.26207,-3.54353 -0.9178,-6.82444 -1.77121,-10.0401l6.2331,-5.05267c1.37894,-0.98444 1.90308,-2.49386 1.37894,-4.13431c-0.59134,-1.64073 -2.03468,-2.55937 -3.74036,-2.49386l-8.00571,0.32843c-1.50942,-3.15015 -3.08435,-6.10291 -5.05323,-8.85911l4.26562,-6.82472c0.9178,-1.3781 0.78761,-3.08435 -0.32787,-4.26562c-1.24735,-1.50914 -2.75649,-1.90308 -4.3975,-1.18099l-7.34969,2.95304c-2.42778,-2.29702 -5.11847,-4.52825 -7.80887,-6.43105l1.64045,-7.80915c0.32815,-1.77177 -0.26235,-3.3467 -1.70625,-4.13431c-1.64045,-0.85312 -3.21539,-0.72181 -4.46217,0.59078l-5.90607,5.18426c-3.14987,-1.3781 -6.36526,-2.49386 -9.58064,-3.4125l-1.18127,-7.94019c-0.19683,-1.70625 -1.3781,-2.95304 -3.01855,-3.21567c-1.77205,-0.26235 -3.21567,0.45946 -3.93748,1.90308l-3.80616,7.21866c-1.77177,-0.13131 -3.3467,-0.26263 -5.05295,-0.26263c-1.77177,0 -3.3467,0.13131 -5.18398,0.26263l-3.74036,-7.21866c-0.72209,-1.44362 -2.16571,-2.16543 -4.00299,-1.90308c-1.64073,0.26263 -2.75621,1.50942 -3.01883,3.21567l-1.11547,7.87467c-3.28118,0.98416 -6.49657,2.09991 -9.58092,3.47802l-5.90579,-5.18426c-1.31259,-1.31259 -2.88752,-1.4439 -4.46245,-0.59078c-1.44362,0.78761 -2.0344,2.36254 -1.70625,4.13431l1.64045,7.80915c-2.75593,1.9028 -5.44633,4.13403 -7.87467,6.43105l-7.2839,-2.95304c-1.64073,-0.72209 -3.21567,-0.32815 -4.46245,1.18099c-1.04968,1.18127 -1.18099,2.88752 -0.32787,4.19983l4.33086,6.89051c-1.9686,2.75621 -3.54353,5.70896 -5.05267,8.85911l-8.07178,-0.32843c-1.70597,-0.06552 -3.14987,0.85312 -3.67485,2.49386c-0.52498,1.64045 -0.06552,3.14987 1.31259,4.13431l6.29974,5.05267c-0.85312,3.21567 -1.57493,6.49657 -1.77177,10.0401l-7.61232,2.42834c-1.70625,0.5247 -2.62489,1.77149 -2.62489,3.54353c0,1.77177 0.91864,3.01855 2.62489,3.60933l7.61232,2.42778c0.19683,3.47802 0.91864,6.89023 1.77177,10.04038l-6.29974,4.98715c-1.3781,1.04996 -1.83756,2.62489 -1.31259,4.26562c0.52498,1.64045 1.96888,2.55909 3.67485,2.49358l8.07178,-0.39366c1.50914,3.14959 3.08407,6.10291 4.98715,8.85883l-4.19983,6.82472c-0.98444,1.44362 -0.85312,3.14987 0.26235,4.33114c1.24679,1.50942 2.82172,1.83728 4.46245,1.18127l7.2839,-3.08435c2.42834,2.42806 5.11875,4.59349 7.87467,6.49657l-1.64045,7.87467c-0.32815,1.70625 0.26263,3.28118 1.70625,4.06851c1.64045,0.91892 3.21539,0.65629 4.46245,-0.52498l5.84028,-5.3153c3.14987,1.3781 6.36526,2.62489 9.64644,3.47802l1.11547,7.94019c0.26263,1.77205 1.3781,2.95304 3.01883,3.28118c1.83728,0.26235 3.2809,-0.52498 4.00299,-1.9686l3.74036,-7.21838c1.77177,0.13103 3.41222,0.32787 5.18398,0.32787zm16.47143,-68.11584c-3.08435,-8.26834 -9.12146,-12.79631 -16.66827,-12.79631c-1.11547,0 -2.42778,0.13131 -4.52769,0.5905l-18.8337,-32.1547c7.02155,-3.47802 15.02725,-5.3811 23.55822,-5.3811c28.61145,0 51.05419,21.72094 53.08887,49.74161l-36.61744,0zm-69.75658,4.19983c0,-18.24292 8.59648,-34.32041 22.1804,-44.03237l18.96473,32.35153c-3.54353,3.67485 -5.18398,7.67784 -5.18398,11.94318c0,4.13431 1.57493,7.94047 5.18398,11.74663l-19.42419,31.76104c-13.25577,-9.77775 -21.72094,-25.65813 -21.72094,-43.77002zm45.21364,0.19683c0,-4.46217 3.80616,-7.94019 8.00599,-7.94019c4.46245,0 8.1373,3.47802 8.1373,7.94019c0,4.39666 -3.67485,8.00599 -8.1373,8.00599c-4.19983,0 -8.00599,-3.60933 -8.00599,-8.00599zm8.0715,53.7446c-8.72752,0 -16.86482,-2.03412 -24.01768,-5.57765l19.29316,-31.56449c2.03412,0.52498 3.41222,0.65629 4.52769,0.65629c7.61232,0 13.64943,-4.65929 16.66827,-13.12445l36.61744,0c-2.10047,27.88936 -24.54322,49.61029 -53.08887,49.61029z' /%3E%3Cellipse stroke='%23393f41' stroke-width='1' fill='%23111313' ry='54' rx='54' cy='74.5' cx='74.5' /%3E%3C/g%3E%3C/svg%3E");
        background-size: contain;
        background-position: center center;

        vertical-align: top;
        font-size: 1.35em;
        font-weight: bold;
        text-align: center;
    }

    .hero-card-type {
        --r: 1em;

        line-height: 1.6em;
        padding-inline: .5em;
        border-inline: var(--r) solid #0000;
        border-radius: calc(2*var(--r)) calc(2*var(--r)) 0 0/var(--r);
        mask:
            radial-gradient(var(--r) at var(--r) 0, #0000 98%, #000 101%) calc(-1*var(--r)) 100%/100% var(--r) repeat-x,
            conic-gradient(#000 0 0) padding-box;
        background: var(--card-background-primary) border-box;

        width: fit-content;
        min-width: 75%;
        text-align: center;
        padding: 0 .6em;
        font-family: 'ModestoPoster';
        font-size: 1.15em;
        white-space: pre;
        color: #FFFFFF;
        text-shadow: 0 0 8px #000000;
        text-shadow: -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000;
        margin: 0 auto -1px auto;
        z-index: 1;
    }

    .hero-card-text {
        flex-grow: 1;
        width: 100%;

        color: #000;
        text-align: center;
        padding: .75em .4em;
        vertical-align: middle;

        background: radial-gradient(circle, var(--card-background-secondary) 20%, rgb(223, 220, 215) 97%);

        border-radius: .75em;
        border: 1px solid #000;
        box-shadow:
            inset 3px 3px 2px var(--card-background-primary),
            inset -3px 3px 2px var(--card-background-primary),
            1px 4px 3px rgba(0, 0, 0, .5);

        display: flex;
        align-items: center;
        justify-content: center;

        ul {
            text-align: left;
        }
    }
}
</style>
