<script setup>
import { useRouter, useRoute, stringifyQuery } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

import { ref, reactive, computed, watch } from 'vue';
import { reset } from '@formkit/core';

// const router = useRouter()
// const route = useRoute()
// const smilestore = useSmileStore()

function buildDefaultOptions(n, keyword) {
    if (n === 5) {
        return {
            1: `Not at all ${keyword}`,
            2: `Slightly ${keyword}`,
            3: `Moderately ${keyword}`,
            4: `Very ${keyword}`,
            5: `Extremley ${keyword}`,
        }
    }

    console.error('invalid n', n);
    return {};
}


const QUESTION_TYPE = 'select';
const VALIDATION_TYPE = 'required:trim';

const JUDGEMENT_QUESTIONS = [
    {
        'id': 'fun_play',
        'label': 'How fun would it be to play game yourself?',
        'options': buildDefaultOptions(5, 'fun'),
        // 'options': {1: 'Not fun at all', 4: 'Medium', 7: 'Very fun'},
    },
    {
        'id': 'fun_watch',
        'label': 'How fun would it be to watch someone else play this game?',
        'options': buildDefaultOptions(5, 'fun'),
        // 'options': {1: 'Not fun at all', 4: 'Medium', 7: 'Very fun'},
    },
    {
        'id': 'capability',
        'label': "Imagine that you played this game for several minutes. How much better would it make you at interacting with the virtual environment?",
        'options': buildDefaultOptions(5, 'helpful'),
        // 'options': {1: 'Not at all', 4: 'Somewhat', 7: 'Very much so'},
    },
    {
        'id': 'achievablity',
        'label': "How achievable are the goals described by this game?",
        'options': buildDefaultOptions(5, 'achievable'),
    },
    {
        'id': 'difficulty',
        'label': "Imagine playing this game. How difficult do you think it would be to play?",
        'options': buildDefaultOptions(5, 'difficult'),
    },
    {
        'id': 'creativity',
        'label': "How creatively designed is this game?",
        'options': buildDefaultOptions(5, 'creative'),
    },
    {
        'id': 'human-likeness',
        'label': "How human-like do you think this game is?",
        'options': buildDefaultOptions(5, 'human-like')
    },
    {
        'id': 'confidence',
        'label': "How confident are you in your human-likeness judgenment?",
        'options': buildDefaultOptions(5, 'confident')
    }
]

const answers = reactive(Object.fromEntries(JUDGEMENT_QUESTIONS.map((question) => [question.id, ''])))
answers['reasoning-low'] = '';
answers['reasoning-high'] = '';

const complete = computed(() => Object.keys(answers).every((key) => answers[key] !== '' && answers[key] !== 0));

function resetForm() {
    reset('single-game-extended-judgement-form');
}

defineExpose({
    complete,
    answers,
    resetForm
})

const gameTextDisplayRef = ref(null);

const props = defineProps({
    game: String
})


// When the game changes, reset the answers
watch(() => props.game, (prevGame, nextGame) => {
    if (prevGame !== nextGame) {
        // console.log('game changed, resetting answers');
        // console.log(answers);
        // console.log(answers.value);
        // Object.keys(answers).forEach((key) => {
        //     answers[key] = '';
        // });
        reset('single-game-extended-judgement-form');
    }
});

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
            // return {label: `(${i})`, value: i};
            return {label: i, value: i};
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

            // const label = i in spec ? `(${i}) ${spec[i]}` : `(${i})`;
            const label = i in spec ? `${i} - ${spec[i]}` : i;
            return {label, value: i};; 
        });
    }

    console.log('invalid spec', spec);
    return [];
}

</script>

<template>
    <div>
        <FormKit 
            type="form"
            id="single-game-extended-judgement-form"
            :actions="false"
        >
            <p class="field has-text-left">
                Please answer the following questions about the game above in the context of the video game environment described earlier:
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
                        v-model="answers['reasoning-low']"
                        type="textarea"
                        label="Explain your low ratings"
                        help="For questions you answered lowly (1, 2, or 3), what about the game contributed to your judgement?"
                        placeholder="What contributed to your judgement?"
                        rows="5"
                        validation-visibility="live"
                        validation="length:30"
                    />
                </div>

                <div class="field column">
                    <FormKit 
                        v-model="answers['reasoning-high']"
                        type="textarea"
                        label="Explain your high ratings"
                        help="For questions you answered highly (5, 6, or 7), what about the game contributed to your judgement?"
                        placeholder="What contributed to your judgement?"
                        rows="5"
                        validation-visibility="live"
                        validation="length:30"
                    />
                </div>
            </div>
        </FormKit>

    </div>
</template>

<style>
    /* .formkit-options {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    } */

</style>