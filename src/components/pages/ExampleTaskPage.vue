<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization';
import RoomPictures from '@/components/atoms/RoomPictures.vue'

import { reactive, onMounted, ref, watchEffect, watch, computed } from 'vue';
import SingleGameExtendedJudgment from '@/components/molecules/SingleGameExtendedJudgment.vue';
import InstructionsContent from '@/components/atoms/InstructionsContent.vue';
import GameTextDisplay from '@/components/atoms/GameTextDisplay.vue';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

const MAX_STEP = 4;

const judgementRef = ref(null);
const step = ref(0);
const isDisabled = computed(() => step.value <= MAX_STEP);


if (route.meta.progress) smilestore.global.progress = route.meta.progress


const exampleGame = `Setup: put a curved wooden ramp on the floor and make sure it stays there for the duration of the game
Gameplay: stand in front of the ramp and throw dodgeballs so that they touch the ramp and then land behind it
Terminal: the game ends after you successfully throw a dodgeball in this way
Scoring: you get 3 points if you made a successful throw in one attempt, 2 points if you did so in two attempts, and 1 point if you did so in three or more attempts`;



function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}

watchEffect(() => {
    if (judgementRef.value) {
        // console.log(Object.keys(judgementRef.value).map((key) => judgementRef.value[key]));
        isDisabled.value = !judgementRef.value.complete;
        // console.log(isDisabled.value);
    }
});

const modalVisible = ref(false);
function flipModalVisibility() {
    modalVisible.value = !modalVisible.value;
}

function nextStep() {
    step.value += 1;
}

</script>

<template>
    <div class="page" @click="nextStep">
        <h1 class="title is-3">Game Response Tutorial</h1>
        <div :class="step != 0 ? 'unfocused': ''">Click anywhere to begin a brief tutorial.</div>
        
        <div class="modal" :class="{'is-active': modalVisible}" id="modal-holder" @click="flipModalVisibility()">
            <div class="modal-background"></div>
            <div class="modal-content has-background-white-bis" >
                <InstructionsContent :showPictures="false" :includeLastLine="false"/>
            </div>
        </div>

        <div class="my-2">
            <div class="one-game my-4">
                <div class="columns">
                    <div class="column is-2"></div>
                    <div class="column is-8">
                        <div :class="step != 1 ? 'unfocused': 'focused'" id="">
                            <RoomPictures />
                            <div class="modal" :class="{'is-active': step === 1}" id="step-1-modal-holder">
                                <!-- <div class="modal-background"></div> -->
                                <div class="modal-content has-background-white-bis has-text-left p-4 focused-modal" >
                                    First, you'll see images of the room in the video game environment. 
                                    <br>
                                    This room contains various balls, blocks, toys, and other objects.
                                    <br>
                                    You can assume that all objects mentioned in the games exist in the room.
                                    <br><br>
                                    <span class="is-italic">Click anywhere to continue.</span>
                                </div>
                            </div>
                        </div>
                        
                        <div :class="step != 2 ? 'unfocused': 'focused'">
                            <div class="has-text-left pb-4">
                                Please read the following game description, imagine playing it in the room pictured above, and answer the questions below:
                            </div>
                            <GameTextDisplay :game="exampleGame" ref="gameTextDisplayRef" />
                            <div class="modal" :class="{'is-active': step === 2}" id="step-2-modal-holder">
                                <!-- <div class="modal-background"></div> -->
                                <div class="modal-content has-background-white-bis has-text-left p-4 focused-modal" >
                                    Below the images, you'll read a textual description of a game.
                                    <br>
                                    The game descriptions were created by a computer translator program, and therefore might seem somewhat artificial.
                                    <br>
                                    Each description includes sentences describing how to play the game ('gameplay') and how to keep score ('scoring').
                                    <br>
                                    Some descriptions also include instructions for how to prepare the room ('setup') or when the game ends ('terminal').
                                    <br>
                                    <span class="has-text-weight-semibold">Please try to judge the games based on the merits of the game described, not the quality of the description.</span>
                                    <br><br>
                                    <span class="is-italic">Click anywhere to continue.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column is-2"></div>
                </div>
            </div>    

            <div class="">
                <div class="game-questions columns">
                    <div class="column is-3"></div>
                    <div class="column is-6">
                        <div :class="step != 3 ? 'unfocused': 'focused'">
                            <SingleGameExtendedJudgment ref="judgementRef" />
                            <div class="modal" :class="{'is-active': step === 3}" id="step-3-modal-holder">
                                <!-- <div class="modal-background"></div> -->
                                <div class="modal-content has-background-white-bis has-text-left p-4 focused-modal" >
                                    You will then answer some questions about the game described.
                                    <br>
                                    First, you will explain the game in your own words. 
                                    <br>
                                    Next, you will answer multiple choice judgement questions about the game.
                                    <br>
                                    Finally, you will write your short overall impression about the game. 
                                    <br>
                                    <span class="has-text-weight-semibold">Again, please try to judge the games based on the merits of the game described, not the quality of the description.</span>
                                    <br><br>
                                    <span class="is-italic">Click anywhere to continue.</span>
                                </div>
                            </div>
                        </div>
                        
                        <div :class="step < 4 ? 'unfocused': (step == 4 ? 'focused' : '')">
                            <div class="is-flex is-justify-content-space-between">
                                <button class="button is-light is-info" id='instructions-modal-button' @click="flipModalVisibility()">Review Instructions</button>
                                <button class="button is-success is-light" id='finish' :disabled="isDisabled" @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
                            </div>
                            <div class="modal" :class="{'is-active': step === 4}" id="step-4-modal-holder">
                                <!-- <div class="modal-background"></div> -->
                                <div class="modal-content has-background-white-bis has-text-left p-4 focused-modal" >
                                    To submit your answers for the current game, and proceed to the next game, prest the "next" button at the bottom of the page.
                                    <br>
                                    If you wish to review the instructions, you can press the "Review Instructions" button.
                                    <br><br>
                                    <span class="is-italic">Click anywhere to continue.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column is-3"></div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
    .unfocused {
        opacity: 0.3;
    }

    .focused {
        border-style: solid;
        border-color: yellow;
        border-width: 4px;
    }

    .focused-modal {
        opacity: 1;
        border-style: solid;
        border-width: 2px;
        border-color: #3273dc;
        line-height: 1.5em;
    }
</style>