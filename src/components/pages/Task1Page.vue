<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

import { onMounted, ref } from 'vue';
import SingleGameJudgment from '@/components/molecules/SingleGameJudgment.vue';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()
const judgementRef = ref(null)


if(route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    // smilestore.saveData()
    console.log(judgementRef);
    console.log(judgementRef.value.rating);
    if(goto) router.push(goto)
}


</script>

<template>
    <div class="page">
        <h1 class="title is-3">Task 1</h1>
        
        <SingleGameJudgment game='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum' ref="judgementRef"></SingleGameJudgment>

        <button class="button is-success is-light" id='finish' @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>