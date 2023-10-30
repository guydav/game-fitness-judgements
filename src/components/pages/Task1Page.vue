<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

import { reactive, onMounted, ref, watchEffect, watch } from 'vue';
import SingleGameExtendedJudgment from '@/components/molecules/SingleGameExtendedJudgment.vue';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()
const judgementRef = ref(null)
const isDisabled = ref(true);

if (route.meta.progress) smilestore.global.progress = route.meta.progress

smilestore.loadGamesData();
const gamesData = smilestore.getGamesData;
const gameData = gamesData.games[0];



function finish(goto) { 
    // smilestore.saveData()
    smilestore.recordSingleGameResults({
        id: gameData.id,
        ...judgementRef.value.answers,
    });
    if(goto) router.push(goto)
}

watchEffect(() => {
    if (judgementRef.value) {
        // console.log(Object.keys(judgementRef.value).map((key) => judgementRef.value[key]));
        isDisabled.value = !judgementRef.value.complete;
        // console.log(isDisabled.value);
    }
});

</script>

<template>
    <div class="page">
        <h1 class="title is-3">Task 1</h1>
        
        <SingleGameExtendedJudgment :game="gameData.text" ref="judgementRef"></SingleGameExtendedJudgment>

        <button class="button is-success is-light" id='finish' :disabled="isDisabled" @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

