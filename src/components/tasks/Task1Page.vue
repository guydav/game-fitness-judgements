<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization';
import RoomPictures from '@/components/instructions/RoomPictures.vue'
import { useChallengeV3 } from 'vue-recaptcha/head'
import { checkRecaptcha } from '@/recaptcha_utils'

import { reactive, onMounted, ref, watchEffect, watch } from 'vue';
import SingleGameExtendedJudgment from '@/components/tasks/SingleGameExtendedJudgment.vue';
import InstructionsContent from '@/components/instructions/InstructionsContent.vue';
import GameTextDisplay from '@/components/tasks/GameTextDisplay.vue';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()
const gameTextSectionRef = ref(null);
const judgementRef = ref(null);
const isDisabled = ref(true);

const { execute } = useChallengeV3('game_responses')

if (route.meta.progress) smilestore.global.progress = route.meta.progress

smilestore.loadGamesData();
const gamesData = smilestore.getGamesData;

function sampleGames() {
    const games = [];
    if ('realGames' in gamesData && smilestore.getNRealGames > 0) {
        const realGameKeys = Object.keys(gamesData.realGames);
        console.log(`Found # real games: ${realGameKeys.length}`);
        const selectedKeys = realGameKeys.length <= smilestore.getNRealGames ? realGameKeys : random.shuffle(realGameKeys).slice(0, smilestore.getNRealGames);
        const realGames = selectedKeys.map((key) => ({
            text: gamesData.realGames[key],
            id: key,
            real: true,
            matched: true,
        }));

        games.push(...realGames);

        if ('matchedArchiveGames' in gamesData) {
            const matchedGames = [];
            realGames.forEach((realGameEntry) => {
                if (realGameEntry.id in gamesData.matchedArchiveGames) {
                    matchedGames.push({
                        text: gamesData.matchedArchiveGames[realGameEntry.id],
                        id: realGameEntry.id,
                        real: false,
                        matched: true,
                    });
                } else {
                    console.log(`No matched game found for ${realGameEntry.id}`);
                }
            });

            games.push(...matchedGames);
        }
    }

    if ('novelArchiveGames' in gamesData && smilestore.getNNovelGames > 0) {
        const novelGameKeys = Object.keys(gamesData.novelArchiveGames);
        console.log(`Found # novel games: ${novelGameKeys.length}`);
        const selectedNovelKeys = novelGameKeys.length <= smilestore.getNNovelGames ? novelGameKeys : random.shuffle(novelGameKeys).slice(0, smilestore.getNNovelGames);
        const novelGames = selectedNovelKeys.map((key) => ({
            text: gamesData.novelArchiveGames[key],
            id: key,
            real: false,
            matched: false,
        }));
        games.push(...novelGames);
    }

    return random.shuffle(games);
}

const participantGames = sampleGames();
const gameIndex = ref(0);


async function finish(goto) {
    console.log(`finish called with game index ${gameIndex.value}`);
    // const captchaToken = await execute();
    // const captchaResponse = await checkRecaptcha(captchaToken);

    const gameDesc = { ...participantGames[gameIndex.value], ...judgementRef.value.answers };
    if ('text' in gameDesc) delete gameDesc.text;  

    execute()
        .then((captchaToken) => checkRecaptcha(captchaToken))
        .then((captchaResponse) => {
            gameDesc.captchaResponse = captchaResponse; 
            smilestore.recordSingleGameResults(gameDesc);
            smilestore.recordTimestamp(`game_submit_${gameIndex.value}`);
        });
    
    if (gameIndex.value < participantGames.length - 1) {
        gameIndex.value += 1;
        judgementRef.value.resetForm();
        gameTextSectionRef.value?.scrollIntoView({ behavior: 'smooth' }) 
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

const modalVisible = ref(false);
function flipModalVisibility() {
    modalVisible.value = !modalVisible.value;
}

</script>

<template>
    <div class="page">
        <!-- TODO: change title to something more helpful (e.g. game X/N?) -->
        <h1 class="title is-3">Game Responses</h1>
        
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
                        <RoomPictures />

                        <div class="has-text-left pb-4">
                            Please read the following game description, imagine playing it in the room pictured above, and answer the questions below:
                        </div>
                        <section ref="gameTextSectionRef">
                          <GameTextDisplay :game="participantGames[gameIndex].text"/>
                        </section>
                    </div>
                    <div class="column is-2"></div>
                </div>
            </div>    

            <div class="">
                <div class="game-questions columns">
                    <div class="column is-3"></div>
                    <div class="column is-6">
                        <SingleGameExtendedJudgment ref="judgementRef" />

                        <div class="is-flex is-justify-content-space-between">
                            <button class="button is-light is-info" id='instructions-modal-button' @click="flipModalVisibility()">Review Instructions</button>
                            <button class="button is-success is-light" id='finish' :disabled="isDisabled" @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
                        </div>
                    </div>
                    <div class="column is-3"></div>
                </div>

            </div>
        </div>
    </div>
</template>

