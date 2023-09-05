<script setup>
import { useRouter, useRoute, stringifyQuery } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import GameTextDisplay from '@/components/atoms/GameTextDisplay.vue';

import bulmaSlider from 'bulma-slider/dist/js/bulma-slider';
import { onMounted, ref, watchEffect } from 'vue';

// const router = useRouter()
// const route = useRoute()
// const smilestore = useSmileStore()


let slider = null;
const rating = ref(50);
const reasoning = ref('');
const highlightedText = ref('');

const gameTextDisplayRef = ref(null);


const props = defineProps({
    game: String
})

defineExpose({
    rating,
    reasoning,
    highlightedText
})

onMounted(() => {
    slider = bulmaSlider.attach();
})

watchEffect(() => {
    if (gameTextDisplayRef.value) {
        highlightedText.value = gameTextDisplayRef.value.highlightedText;
    }
})

</script>

<template>
    <div class="my-2">
        <div class="one-game my-4">
            <div class="columns">
                <div class="column is-2"></div>
                <div class="column is-8">
                    <div class="has-text-left pb-4">
                        Please read the following game description, and answer the questions below:
                    </div>
                    <GameTextDisplay :game="props.game" ref="gameTextDisplayRef"></GameTextDisplay>
                </div>
                <div class="column is-2"></div>
            </div>
        </div>    

        <div class="">
            <div class="game-questions columns">
                <div class="column is-3"></div>
                <div class="column is-6">
                    <form>
                        <div class="field">
                            <label for="game-rating-slider" class="label has-text-left">How human-like do you find this game?</label>
                            <div class="control">
                                <input id="game-rating-slider" class="slider is-fullwidth has-output is-circle" step="1" min="0" max="100" v-model="rating" type="range">
                                <output for="game-rating-slider">50</output>
                            </div>
                            <p class="help has-text-left">0 indicating you are certain this game was not created by a person<br>100 indicating you are certain it was created by a person</p>
                        </div>

                        <div class="field">
                            <label for="game-rating-reasoning" class="label has-text-left">Reasoning</label>
                            <div class="control">
                                <textarea id="game-rating-reasoning" class="textarea" placeholder="What led you to this judgment?" rows="3" v-model="reasoning"></textarea>
                            </div>
                        </div>

                        <div class="field">
                            <label for="game-rating-highlighted" class="label has-text-left">Relevant highlighted text</label>
                            <div class="control">
                                <textarea id="game-rating-highlighted" class="textarea is-italic" placeholder="Please highlight the part of the game that was most influential to your judgment" v-model="highlightedText"></textarea>
                            </div>
                        </div>
                        
                    </form>
                </div>
                <div class="column is-3"></div>
            </div>

        </div>
    </div>
</template>