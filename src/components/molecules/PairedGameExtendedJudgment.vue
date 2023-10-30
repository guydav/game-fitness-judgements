<script setup>
import { useRouter, useRoute, stringifyQuery } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import GameTextDisplay from '@/components/atoms/GameTextDisplay.vue';

import bulmaSlider from 'bulma-slider/dist/js/bulma-slider';
import { ref, reactive, computed } from 'vue';

// const router = useRouter()
// const route = useRoute()
// const smilestore = useSmileStore()


const QUESTION_TYPE = 'select';
const VALIDATION_TYPE = 'required:trim';

const JUDGEMENT_QUESTIONS = [
    {
        'id': 'fun',
        'label': "Which of these two games do you think would be more fun to play?",
        'options': {
            1: 'The left game, by a lot', 2: 'The left game', 3: 'The left game, by a little',
            4: 'Unsure', 5: 'The right game, by a little', 6: 'The right game', 7: 'The right game, by a lot'
        },
    },
    {
        'id': 'capability',
        'label': "Which of these two games would help you become more capable in this video game environment?",
        'options': {
            1: 'The left game, by a lot', 2: 'The left game', 3: 'The left game, by a little',
            4: 'Unsure', 5: 'The right game, by a little', 6: 'The right game', 7: 'The right game, by a lot'
        },
    },
    {
        'id': 'achievablity',
        'label': "Which of these two games described more achievable goals?",
        'options': {
            1: 'The left game, by a lot', 2: 'The left game', 3: 'The left game, by a little',
            4: 'Unsure', 5: 'The right game, by a little', 6: 'The right game', 7: 'The right game, by a lot'
        },
    },
    {
        'id': 'difficulty',
        'label': "Which of these two games do you think would be more difficult to play?",
        'options': {
            1: 'The left game, by a lot', 2: 'The left game', 3: 'The left game, by a little',
            4: 'Unsure', 5: 'The right game, by a little', 6: 'The right game', 7: 'The right game, by a lot'
        },
    },
    {
        'id': 'creativity',
        'label': "Which of these two games is more creative?",
        'options': {
            1: 'The left game, by a lot', 2: 'The left game', 3: 'The left game, by a little',
            4: 'Unsure', 5: 'The right game, by a little', 6: 'The right game', 7: 'The right game, by a lot'
        },
    },
    {
        'id': 'human-likeness',
        'label': "Which of these two games do you think is more human-like?",
        'options': {
            1: 'The left game, by a lot', 2: 'The left game', 3: 'The left game, by a little',
            4: 'Unsure', 5: 'The right game, by a little', 6: 'The right game', 7: 'The right game, by a lot'
        },
    },
    {
        'id': 'confidence',
        'label': "How confident are you in your human-likeness judgenment?",
        'options': {1: 'Not at all confident', 4: 'Somewhat confident', 7: 'Very confident'},
    }
]

const answers = reactive(Object.fromEntries(JUDGEMENT_QUESTIONS.map((question) => [question.id, ''])))
answers['reasoning-left'] = '';
answers['reasoning-right'] = '';

const complete = computed(() => Object.keys(answers).every((key) => answers[key] !== '' && answers[key] !== 0));

const leftGameTextDisplayRef = ref(null);
const rightGameTextDisplayRef = ref(null);


const props = defineProps({
    leftGame: String,
    rightGame: String
})

defineExpose({
    complete,
    answers,
})


function range(start, end) {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
}

function specifyOptions(spec) {
    if (typeof spec === 'number') {
        return range(0, spec + 1).map((i) => {
            if (i === 0) {
                return {label: '', value: '', attrs: {disabled: true}};
            }
            return {label: `(${i})`, value: i};
        });
    }

    if (typeof spec === 'object') {
        const keys = Object.keys(spec).map((key) => parseInt(key, 10));
        const max = Math.max(...keys);
        const min = Math.min(...keys);
        return range(min - 1, max + 1).map((i) => {
            if (i === min - 1) {
                return {label: '', value: '', attrs: {disabled: true}};
            }

            const label = i in spec ? `(${i}) ${spec[i]}` : `(${i})`;
            return {label, value: i};; 
        });
    }

    console.log('invalid spec', spec);
    return [];
}

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
                    <FormKit 
                        type="form"
                        id="paired-game-extended-judgement-form"
                        :actions="false"
                    >
                        <p class="field has-text-left">
                            Please answer the following questions about the games above in the context of the video game environment described earlier:
                        </p>

                        <template v-for="question in JUDGEMENT_QUESTIONS" :key="question.id">
                            <FormKit
                                :name="question.id"
                                :label="question.label"
                                v-model="answers[question.id]"
                                :type="'type' in question ? question.type : QUESTION_TYPE"
                                :options="specifyOptions(question.options)"
                                :validation="'validation' in question ? question.validation : VALIDATION_TYPE"
                            />
                        </template>

                        <div class="columns">
                            <div class="field column">
                                <FormKit 
                                    v-model="answers['reasoning-left']"
                                    type="textarea"
                                    label="Explain your ratings of the left-hand game"
                                    help="For questions you answered toward the left-hand game (1, 2, or 3), what about the game contributed to your judgement?"
                                    placeholder="What contributed to your judgement?"
                                    rows="5"
                                    validation-visibility="live"
                                    validation="length:30"
                                />
                            </div>

                            <div class="field column">
                                <FormKit 
                                    v-model="answers['reasoning-right']"
                                    type="textarea"
                                    label="Explain your ratings of the right-hand game"
                                    help="For questions you answered toward the right-hand games (5, 6, or 7), what about the game contributed to your judgement?"
                                    placeholder="What contributed to your judgement?"
                                    rows="5"
                                    validation-visibility="live"
                                    validation="length:30"
                                />
                            </div>
                        </div>
                    </FormKit>
                </div>
                <div class="column is-3"></div>
            </div>

        </div>
    </div>
</template>