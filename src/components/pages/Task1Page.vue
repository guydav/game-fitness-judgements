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

function sampleGames() {
    const { games } = gamesData;
    // TODO: sample games, using a random seed, balanced by conditions
    // TODO: # of real/model created, MAP-Elites bins, etc.?
    return games;
    
}

const participantGames = sampleGames();
const gameIndex = ref(0);


function finish(goto) { 
    console.log(`finish called with game index ${gameIndex.value}`);
    // smilestore.saveData()
    smilestore.recordSingleGameResults({
        id: participantGames[gameIndex.value].id,
        // TODO: Any other information we need to add here?
        ...judgementRef.value.answers,
    });

    if (gameIndex.value < participantGames.length - 1) {
        gameIndex.value += 1;
    } else {
        smilestore.saveData();
        if (goto) router.push(goto);
    }
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
        <!-- TODO: change title to something more helpful (e.g. game X/N?) -->
        <h1 class="title is-3">Task 1</h1>
        
        <SingleGameExtendedJudgment :game="participantGames[gameIndex].text" ref="judgementRef"></SingleGameExtendedJudgment>

        <button class="button is-success is-light" id='finish' :disabled="isDisabled" @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

