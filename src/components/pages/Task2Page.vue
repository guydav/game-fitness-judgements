<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

import { watchEffect, ref } from 'vue';
import PairedGameExtendedJudgment from '@/components/molecules/PairedGameExtendedJudgment.vue';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()
const judgementRef = ref(null)
const isDisabled = ref(true);

smilestore.loadGamesData();
const gamesData = smilestore.getGamesData;
const leftGameData = gamesData.games[0];
const rightGameData = gamesData.games[1];

if(route.meta.progress) smilestore.global.progress = route.meta.progress


watchEffect(() => {
    if (judgementRef.value) {
        // console.log(Object.keys(judgementRef.value).map((key) => judgementRef.value[key]));
        isDisabled.value = !judgementRef.value.complete;
        // console.log(isDisabled.value);
    }
});


function finish(goto) { 
    // smilestore.saveData()
    smilestore.recordPairedGameResults({
        id: gameData.id,
        ...judgementRef.value.answers,
    });
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3">Task 2</h1>
    
        <PairedGameExtendedJudgment v-bind:leftGame="leftGameData.text" v-bind:rightGame="rightGameData.text" ref="judgementRef"> </PairedGameExtendedJudgment>

        <button class="button is-success is-light" id='finish' :disabled="isDisabled" @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>