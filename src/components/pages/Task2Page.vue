<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

import { onMounted, ref } from 'vue';
import PairedGameJudgment from '@/components/molecules/PairedGameJudgment.vue';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()
const judgementRef = ref(null)

smilestore.loadGamesData();
const gamesData = smilestore.getGamesData;
const leftGameData = gamesData.games[0];
const rightGameData = gamesData.games[1];

if(route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    // smilestore.saveData()
    smilestore.recordPairedGameResults(leftGameData.id, rightGameData.id, judgementRef.value.rating, judgementRef.value.reasoning, judgementRef.value.leftHighlightedText, judgementRef.value.righttHighlightedText);
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3">Task 2</h1>
    
        <PairedGameJudgment v-bind:leftGame="leftGameData.text" v-bind:rightGame="rightGameData.text" ref="judgementRef"> </PairedGameJudgment>

        <button class="button is-success is-light" id='finish' @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>