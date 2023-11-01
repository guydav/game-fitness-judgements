<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'


const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()


// smilestore.global.page_bg_color = '#fff'
// smilestore.global.page_text_color = '#000'
// smilestore.global.status_bar_bg_color = '#fff'
// smilestore.global.status_bar_text_color = '#000'


if (route.meta.progress) smilestore.global.progress = route.meta.progress

const {task} = smilestore.getConditions;

const QUIZ_QUESTIONS = [
    {
        'id': 'howManyGames',
        'question': 'How many game descriptions will you be shown at a time?',
        'multiSelect': false,
        'answers': [
            '1',
            '2',
            '4',
            'It will vary between 1, 2, and 4',
        ],
        'correctAnswer': task === "single" ? 0 : 1,  // zero-based
    },
    {
        'id': 'howDescriptions',
        'question': 'How were the textual descriptions for the games you will see created?',
        'multiSelect': false,
        'answers': [
            'They were written by human participants in a previous study',
            'They were written by a computer translator program',
            'They were written by the researchers',
            'Some were written by human participants and some were written by a computer program'
        ],
        'correctAnswer': 1,  // zero-based
    },
    {
        'id': 'textResponses',
        'question': 'What will you be asked to write in your short responses for each trial?',
        'multiSelect': false,
        'answers': [
            'Highlights and lowlights of the described game',
            'Explanations of particularly low and high multiple choice answers about the game',
            'Suggestions for other settings in which the game might be played',
            'Your best guess for who created the game',
        ],
        'correctAnswer': 1,  // zero-based
    },
    {
        'id': 'submittables',
        'question': 'What will you be asked to respond with in each trial?',
        'multiSelect': true,
        'answers': [
            'Answers of a few multiple choice questions with judgements of the game description',
            'Your edits for how the described game might be improved',
            'Short explanations for your question answers',
            'A list of which objects are missing from the room to play the game'
        ],
        'correctAnswer': [0, 2],  // zero-based
    },
    // {
    //     'id': 'submittables',
    //     'question': 'Which of the following will you be able to submit for each game?',
    //     'multiSelect': true,
    //     'answers': [
    //         'Asnwers to several multiple choice questions about the game',
    //         'A short explanation for your rating',
    //         'Highlighted text from the game description that helped you make your judgment',
    //         'A summary of the game description in your own words',
    //         'A rating of how fun the game would be to play',
    //         'A rating of how difficult the game would be to play',
    //         'A list of objects that appear in the game',
    //     ],
    //     'correctAnswer': [0, 1, 2],  // zero-based
    // },
];


const QUIZ_QUESTIONS_SHUFFLED_ANSWERS = QUIZ_QUESTIONS.map((question) => {
    const answers = random.shuffle(question.answers);
    const correctAnswer = answers.indexOf(question.answers[question.correctAnswer]);
    return {
        ...question,
        answers,
        correctAnswer,
    }
});

const forminfo = reactive(Object.fromEntries(QUIZ_QUESTIONS.map((question) => [question.id, ''])))


const page = ref(1)

// quiz complete if they answered every question
const quizComplete = computed(() => Object.keys(forminfo).every((key) => forminfo[key] !== ''));


// only move to next page if answers are correct, else return to instructions
const quizCorrect = computed(() => QUIZ_QUESTIONS.every((question) => {
    // console.log(`${question.id} | ${forminfo[question.id]} | ${Object.keys(forminfo[question.id])} | ${question.answers[question.correctAnswer]} | ${question.correctAnswer.length}`);
    if (question.multiSelect) {
        // const val = forminfo[question.id].length === question.correctAnswer.length && question.correctAnswer.every((answerIndex) => forminfo[question.id].includes(question.answers[answerIndex]));
        // console.log(`checking ${question.id} with ${forminfo[question.id]} and ${question.correctAnswer} and ${val}`);
        // return val;
        return forminfo[question.id].length === question.correctAnswer.length && question.correctAnswer.every((answerIndex) => forminfo[question.id].includes(question.answers[answerIndex]));
    }

    // const val = forminfo[question.id] === question.answers[question.correctAnswer]
    // console.log(`checking ${question.id} with ${forminfo[question.id]} and ${question.correctAnswer} and ${val}`);
    // return val;
    return forminfo[question.id] === question.answers[question.correctAnswer];
}));

function autofill() {
    QUIZ_QUESTIONS.forEach((question) => {
        // TODO: figure this out for multi-select
        forminfo[question.id] = question.answers[question.correctAnswer];
    });
}

if (smilestore.config.mode === 'development') smilestore.setPageAutofill(autofill);

function finish(goto) { 
    if (smilestore.config.mode === 'development') smilestore.removePageAutofill();
    if(goto) router.push(goto)
}

function checkQuiz() { 
    // increment the attempts at the quiz
    smilestore.incrementQuizAttempts();
    forminfo.attempt = smilestore.getQuizAttempts; // e.g., first time submitting the quiz is attempt 1
    // save the answers
    smilestore.saveQuizForm(forminfo); // todo: if too many attempts are incorrect, end experiment?

    // quiz good
    if (quizCorrect.value) {
        finish(next());

    // You have failed too many times :( ) {
    } else if (forminfo.attempt > 5) {
        finish('thanks')

    // Do the instructions again!
    } else {
        finish('instructions')
    }
}

</script>


<template>
    <div class="page">
        <div class="formcontent">
            <h3 class="is-size-4 has-text-weight-bold">Instructions quiz</h3>
            <p class="is-size-6">
                To check that you read and understood the instructions, we will give you 
                a short quiz on the game you are about to play. If you get any answers incorrect, 
                you will return to the beginning of the instructions to re-read and try again.
            </p>
            
            <div class="formstep" v-if='page==1'>
                <div class="columns" >
                    <div class="column is-one-third">
                        <div class="formsectionexplainer">
                            <h3 class="is-size-6 has-text-weight-bold">Answer the following questions:</h3>
                            <!-- <p class="is-size-7">First, we need some basic information. </p> -->
                        </div>
                    </div>
                    <div class="column">
                        <div class="box is-shadowless formbox">
                            <template v-for="question in QUIZ_QUESTIONS_SHUFFLED_ANSWERS" :key="question.id">
                                <FormKit v-bind:type="question.multiSelect ? 'checkbox' : 'radio'"
                                     v-bind:label="question.question"
                                     v-bind:name="question.id"
                                     v-model="forminfo[question.id]"
                                     v-bind:options="question.answers"
                                     validation="required"/>
                            </template>
                            <hr>              
                            <div class="columns">
                                <div class="column">
                                    <div class="has-text-right">
                                    <button class="button is-warning" id='finish' v-if='quizComplete' @click='checkQuiz'>Submit &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
                                    </div> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>



<style>

.formstep {
    margin-top: 40px;
}


:root {
    --fk-bg-input: #fff;
    --fk-max-width-input: 100%;
}

.formbox {
    border: 1px solid #dfdfdf;
    text-align: left;
    background-color: rgb(248, 248, 248);
}


.formkit-input  select {
    background-color: #fff;
}


.formcontent {
    width: 80%;
    margin: auto;
    margin-bottom: 40px;
    padding-bottom: 200px;
    text-align: left;
}
.formsectionexplainer {
    text-align: left;
    color: #777;
}
</style>