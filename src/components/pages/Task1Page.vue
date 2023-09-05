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

if (route.meta.progress) smilestore.global.progress = route.meta.progress

smilestore.loadGamesData();
const gamesData = smilestore.getGamesData;
const gameData = gamesData.games[0];

function finish(goto) { 
    // smilestore.saveData()
    smilestore.recordSingleGameResults(gameData.id, judgementRef.value.rating, judgementRef.value.reasoning, judgementRef.value.highlightedText);
    if(goto) router.push(goto)
}


</script>

<template>
    <div class="page">
        <h1 class="title is-3">Task 1</h1>
        
        <SingleGameJudgment v-bind:game="gameData.text" ref="judgementRef"></SingleGameJudgment>

        <button class="button is-success is-light" id='finish' @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>