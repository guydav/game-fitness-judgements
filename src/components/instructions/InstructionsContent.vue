<script setup>
import RoomPictures from '@/components/instructions/RoomPictures.vue'

const SINGLE_GAME_INSTRUCTIONS = [
    "You will be shown descriptions of various games, one game at a time.",
    "These games were created to be played in the video game environment shown in the images below.",
    "This environment depicts a bedroom with various balls, blocks, toys, and other objects.",
    "You will be asked to explain the game in your own words, answer some multiple choice judgement questions, and write a short overall impression about each game.",
    "The game descriptions you will read were created by a computer translator program, and therefore might seem somewhat artificial.",
    '<span class="has-text-weight-semibold">Please try to judge the games based on the merits of the game described, not the quality of the description.</span>',
    'Click "next" to proceed to an example of the experiment, after which you will be asked to answer a quiz with some questions about the experiment.',

    // "You will be shown descriptions of various games, one game at a time.",
    // "These games were created to be played in a video game environment in the images below.",
    // "In this video game, the player can move and look around the room, pick up objects, put them down, and throw them.",
    // "This video game environment is a room with a bed, a desk, several types of toys (such as balls, blocks, and stuffed animals), and other objects (such as a lamp, a clock, and a book).",
    // "Participants in a previous study played in this video game environment.",
    // "They were then asked to create a game to be played in the room to pass some time, for a single player, with no specific goal, but requiring keeping score.",
    // "You will be provided textual descriptions of these games, created by a computer translator program.",
    // // "Some of these games were created by human participants in a previous study; other games were created by a computer program.",
    // // "Regardless of whether the game was created by a human or a program, all of the textual descriptions you will see were created by a separate computer program.",
    // "This might cause the descriptions to seem artificial; please try to judge the games based on the contents of the game described, not the quality of the description.",
    // "You can also assume that all objects mentioned in a game description exist in the room.",
    // "You will be asked to answer a few multiple choice questions with judgements of each game description, such as how creative the game is, or how fun it might be to play.",
    // "You will also be asked to provide short (1-2 sentence) explanations of particularly low and high multiple choice answers for each game.",
    // "Your task is to judge whether each game was created by a human or a computer program.",
    // "You will be asked to make these judgments for each game description.",
    // "You will use a slider to indicate your judgment, between 0 and 100.",
    // "0 means you are certain the game was created by a computer program, and 100 means you are certain the game was created by a human.",
    // "With each judgment, you will be able to provide a short explanation for your judgment.",
    // "You will also be asked to highlight the parts of the game description that you think are most important for your judgment.",
];

const PAIRED_GAME_INSTRUCTIONS = [
    "You will be shown descriptions of various games, two games at a time.",
    "These games were created to be played in a video game environment in the images below.",
    "In this video game, the player can move and look around the room, pick up objects, put them down, and throw them.",
    "This video game environment is a room with a bed, a desk, several types of toys (such as balls, blocks, and stuffed animals), and other objects (such as a lamp, a clock, and a book).",
    "Participants in a previous study played in this video game environment.",
    "They were then asked to create a game to be played in the room to pass some time, for a single player, with no specific goal, but requiring keeping score.",
    "You will be provided textual descriptions of these games, created by a computer translator program.",

    "This might cause the descriptions to seem artificial; please try to judge the games based on the contents of the games described, not the quality of the descriptions.",
    "You can also assume that all objects mentioned in a game description exist in the room.",
    "You will be asked to answer a few multiple choice questions with judgements of each game description, such as which game seems more creative, or which might be more fun to play.",
    "You will also be asked to provide short (1-2 sentence) explanations of particularly low and high multiple choice answers for each pair of games.",
    // "Regardless of whether the game was created by a human or a program, all of the textual descriptions you will see were created by a separate computer program.",
    // "This might cause the descriptions to seem artificial; please try to judge the games based on the contents of the game described, not the quality of the description.",
    // "Your task is to judge which of the two games is more likely to have been created by a human (as opposed to a computer program).",
    // "You will be asked to make these judgments for each game description.",
    // "You will use a slider to indicate your judgment, between 0 and 100.",
    // "0 means you are certain the game presented on the left-hand side was created by a human, and 100 means you are certain the game presented on the right-hand side was created by a human.",
    // "With each judgment, you will be able to provide a short explanation for your judgment.", 
    // "You will also be asked to highlight the parts of either of the game descriptions that you think are most important for your judgment.",
];


// computed property based on condition in data
const instText = SINGLE_GAME_INSTRUCTIONS;
// const instText = computed(() => {
//     const {task} = smilestore.getConditions;
//     if (task === 'single') {
//         return SINGLE_GAME_INSTRUCTIONS;

//     } if (task === 'paired') {
//         return PAIRED_GAME_INSTRUCTIONS;
//     }

//     console.error(`Found unexpected task: ${task}, defaulting to 'single'`);
//     return SINGLE_GAME_INSTRUCTIONS;
// })

const props = defineProps({
    showPictures: {
        type: Boolean,
        default: true,
    },
    includeLastLine: {
        type: Boolean,
        default: true,
    },
});

</script>

<template>
    <div class="column has-text-left instructions">
        <h1 class="title is-3">Instructions</h1>
        <div class="is-size-5">
            Please carefully read the following instructions for this experiment:
        </div>
        <hr>
        <div class="is-size-6">
            <ul>
                <template v-for="(line, index) in instText" :key="index">
                    <li v-if="index < instText.length - 1 || props.includeLastLine" v-html="line" ></li>
                </template>
            </ul>
        </div>
        <div v-if="props.showPictures">
            <hr>
            <RoomPictures />
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