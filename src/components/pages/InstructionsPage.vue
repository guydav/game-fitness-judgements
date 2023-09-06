<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if (route.meta.progress) smilestore.global.progress = route.meta.progress


const SINGLE_GAME_INSTRUCTIONS = [
    "You will be shown descriptions of various games, one game at a time.",
    "Some of these games were created by human participants in a previous study; other games were created by a computer program.",
    "Regardless of whether the game was created by a human or a program, all of the textual descriptions you will see were created by a separate computer program.",
    "This might cause the descriptions to seem artificial; please try to judge the games based on the contents of the game described, not the quality of the description.",
    "Your task is to judge whether each game was created by a human or a computer program.",
    "You will be asked to make these judgments for each game description.",
    "You will use a slider to indicate your judgment, between 0 and 100.",
    "0 means you are certain the game was created by a computer program, and 100 means you are certain the game was created by a human.",
    "With each judgment, you will be able to provide a short explanation for your judgment.",
    "You will also be asked to highlight the parts of the game description that you think are most important for your judgment.",
];

const PAIRED_GAME_INSTRUCTIONS = [
    "You will be shown descriptions of various games, two games at a time.",
    "Some of these games were created by human participants in a previous study; other games were created by a computer program.",
    "Regardless of whether the game was created by a human or a program, all of the textual descriptions you will see were created by a separate computer program.",
    "This might cause the descriptions to seem artificial; please try to judge the games based on the contents of the game described, not the quality of the description.",
    "Your task is to judge which of the two games is more likely to have been created by a human (as opposed to a computer program).",
    "You will be asked to make these judgments for each game description.",
    "You will use a slider to indicate your judgment, between 0 and 100.",
    "0 means you are certain the game presented on the left-hand side was created by a human, and 100 means you are certain the game presented on the right-hand side was created by a human.",
    "With each judgment, you will be able to provide a short explanation for your judgment.", 
    "You will also be asked to highlight the parts of either of the game descriptions that you think are most important for your judgment.",
];


// computed property based on condition in data
const instText = computed(() => {
    const {task} = smilestore.getConditions;
    if (task === 'single') {
        return SINGLE_GAME_INSTRUCTIONS;

    } if (task === 'paired') {
        return PAIRED_GAME_INSTRUCTIONS;
    }

    console.error(`Found unexpected task: ${task}.`);
    return [];
})

function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        <div class="columns">
            <div class="column is-2"></div>
            <div class="column has-text-left instructions">
                <h1 class="title is-3">Instructions</h1>
                <div class="is-size-5">
                    Please read the following instructions for the task you will be asked to perform:
                </div>
                <hr>
                <div class="is-size-6">
                    <ul>
                        <template v-for="(line, index) in instText" :key="index">
                            <li>{{ line }}</li>
                        </template>
                    </ul>
                </div>
                <hr>
                <button class="button is-success is-light" id='finish' @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
            </div>
            <div class="column is-2"></div>
        </div>
    </div>
</template>

<style scoped>
.instructions {
    padding: 10px;
    padding-top: 30px;
    text-align: left;
    font-size: 0.95em;
}

.instructions hr {
    background-color: rgb(210, 210, 210);
    margin-top: 7px;
    margin-bottom: 10px;
    height: 1px;
}
.instructions ul {
    padding-left: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    list-style-type: square;
}
</style>