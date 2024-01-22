<script setup>
import { useRouter, useRoute, stringifyQuery } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import GameTextDisplay from '@/components/tasks/GameTextDisplay.vue';

import bulmaSlider from 'bulma-slider/dist/js/bulma-slider';
import { onMounted, ref, watchEffect } from 'vue';

// const router = useRouter()
// const route = useRoute()
// const smilestore = useSmileStore()


let slider = null;
const rating = ref(50);
const reasoning = ref('');
const leftHighlightedText = ref('');
const rightHighlightedText = ref('');

const leftGameTextDisplayRef = ref(null);
const rightGameTextDisplayRef = ref(null);


const props = defineProps({
    leftGame: String,
    rightGame: String
})

defineExpose({
    rating,
    reasoning,
    leftHighlightedText,
    rightHighlightedText
})

onMounted(() => {
    slider = bulmaSlider.attach();
})

watchEffect(() => {
    if (leftGameTextDisplayRef.value) {
        leftHighlightedText.value = leftGameTextDisplayRef.value.highlightedText;
    }

    if (rightGameTextDisplayRef.value) {
        rightHighlightedText.value = rightGameTextDisplayRef.value.highlightedText;
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
                        Please read the following game descriptions, and answer the questions below:
                    </div>
                    <div class="columns">
                        <div class="column">
                            <GameTextDisplay :game="props.leftGame" ref="leftGameTextDisplayRef"></GameTextDisplay>
                        </div>
                        <div class="column">
                            <GameTextDisplay :game="props.rightGame" ref="rightGameTextDisplayRef"></GameTextDisplay>
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
                    <form>
                        <div class="field">
                            <label for="game-rating-slider" class="label has-text-left">Which game do you find more human-like?</label>
                            <div class="control">
                                <input id="game-rating-slider" class="slider is-fullwidth has-output is-circle" step="1" min="0" max="100" v-model="rating" type="range">
                                <output for="game-rating-slider">50</output>
                            </div>
                            <p class="help has-text-left">0 indicating you are certain the left-hand game is more human-like<br>50 indicating you have no indications one way or another<br>100 you are certain the left-hand game is more human-like</p>
                        </div>

                        <div class="field">
                            <label for="game-rating-reasoning" class="label has-text-left">Reasoning</label>
                            <div class="control">
                                <textarea id="game-rating-reasoning" class="textarea" placeholder="What led you to this judgment?" rows="3" v-model="reasoning"></textarea>
                            </div>
                        </div>
                        
                        <div class="columns">
                            <div class="field column">
                                <label for="game-rating-highlighted-left" class="label has-text-left">Left game relevant highlighted text</label>
                                <div class="control">
                                    <textarea id="game-rating-highlighted-left" class="textarea is-italic" placeholder="Please highlight the part of the left-hand game that was most influential to your judgment" v-model="leftHighlightedText"></textarea>
                                </div>
                            </div>

                            <div class="field column">
                                <label for="game-rating-highlighted-right" class="label has-text-left">Right game relevant highlighted text</label>
                                <div class="control">
                                    <textarea id="game-rating-highlighted-right" class="textarea is-italic" placeholder="Please highlight the part of the right-hand game that was most influential to your judgment" v-model="rightHighlightedText"></textarea>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="column is-3"></div>
            </div>

        </div>
    </div>
</template>