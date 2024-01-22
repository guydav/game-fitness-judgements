<script setup>
import { useRouter, useRoute, stringifyQuery } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import RoomPictures from '@/components/instructions/RoomPictures.vue'

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
            5: `Extremely ${keyword}`,
        }
    }

    console.error('invalid n', n);
    return {};
}

function buildAgreementOptions(n) {
    if (n === 5) {
        return {
            1: 'Strongly disagree',
            2: 'Disagree',
            3: 'Neither agree nor disagree',
            4: 'Agree',
            5: 'Strongly agree',
        }
    }

    console.error('invalid n', n);
    return {};
}


function buildDifficultyOptions(n) {
    if (n === 5) {
        return {
            1: 'Far too easy',
            2: 'Too easy',
            3: 'Appropriately difficult',
            4: 'Too hard',
            5: 'Far too hard',
        }
    }

    console.error('invalid n', n);
    return {};
}


const QUESTION_TYPE = 'select';
const VALIDATION_TYPE = 'required:trim';

const JUDGEMENT_QUESTIONS = [
    {
        'id': 'creator',
        'label': "Describe the creator of this game",
        'type': 'textarea',
        'help': 'In a couple of sentences, please describe the creator of this game.',
        'placeholder': 'Please describe the creator of this game',
        'rows:': 5,
        'invisible': true,
    },
    {
        'id': 'explain',
        'label': "Please explain the game described above in your own words:",
        'type': 'textarea',
        'help': 'In a couple of sentences, please explain the game desribed above in your own words.',
        'placeholder': 'Please explain the game in your own words. You cannot paste into this field.',
        'validation': 'length:30',
        'validation-visibility': 'live',
        'rows:': 5,
        'prevent-paste': true,
    },
    {
        'id': 'confident',
        'label': 'How confident are you that you understand the game described above?',
        'options': buildDefaultOptions(5, 'confident'),
        // 'options': {1: 'Not fun at all', 4: 'Medium', 7: 'Very fun'},
    },
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
        'label': "Imagine that you played this game for several minutes. How helpful would it be for learning to interact with the virtual environment?",
        'options': buildDefaultOptions(5, 'helpful'),
        // 'options': {1: 'Not at all', 4: 'Somewhat', 7: 'Very much so'},
    },
    // {
    //     'id': 'achievablity',
    //     'label': "How achievable are the goals described by this game?",
    //     'options': buildDefaultOptions(5, 'achievable'),
    // },
    // {
    //     'id': 'difficulty',
    //     'label': "Imagine playing this game. How difficult do you think it would be to play?",
    //     'options': buildDefaultOptions(5, 'difficult'),
    // },
    {
        'id': 'goldilocks',
        // 'label': 'How much do you agree with the following statement: "This game would be appropriately difficult for me, neither too hard nor too easy."',
        'label': 'Imagine that you played this game for several minutes. Do you think it would be too easy, appropriately difficult, or too hard for you?',
        // 'options': buildAgreementOptions(5),
        'options': buildDifficultyOptions(5),
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
    // {
    //     'id': 'confidence',
    //     'label': "How confident are you in your human-likeness judgenment?",
    //     'options': buildDefaultOptions(5, 'confident')
    // }
    {
        'id': 'weather',
        'label': "Describe the weather in the room?",
        'type': 'textarea',
        'help': 'In a couple of sentences, please describe the weather while playing the game.',
        'placeholder': 'Please describe the weather',
        'rows:': 5,
        'invisible': true,
    },
    {
        'id': 'overall',
        'label': "What is your overall impression of this game?",
        'type': 'textarea',
        'help': 'In a couple of sentences, please describe your overall impression of this game.',
        'placeholder': 'Please provide your overall impression',
        'validation': 'length:30',
        'validation-visibility': 'live',
        'rows:': 5,
    },
];
const ID_TO_QUESTION = Object.fromEntries(JUDGEMENT_QUESTIONS.map((question) => [question.id, question]));

const answers = reactive(Object.fromEntries(JUDGEMENT_QUESTIONS.map((question) => [question.id, ''])))
// answers['reasoning-low'] = '';
// answers['reasoning-high'] = '';
answers.explain = '';
answers.overall = '';

const complete = computed(() => Object.keys(answers).every((key) => (answers[key] !== '' && answers[key] !== 0) || ('invisible' in ID_TO_QUESTION[key]) ));

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
                    :options="'options' in question ? specifyOptions(question.options) : null"
                    :validation="'validation' in question ? question.validation : VALIDATION_TYPE"
                    :help="'help' in question ? question.help : null"
                    :placeholder="'placeholder' in question ? question.placeholder : null"
                    :rows="'rows' in question ? question.rows : null"
                    :validation-visibility="'validation-visibility' in question ? question['validation-visibility'] : null"
                    :onpaste="'prevent-paste' in question ? 'return false;' : undefined" 
                    :outer-class="'invisible' in question ? 'is-hidden' : ''"
                />
            </template>
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