<script setup>
import { onMounted, ref, computed } from 'vue';

const highlightedText = ref('');
let getHighlightedText = null;

const props = defineProps({
    game: String
})

defineExpose({
    highlightedText
})

onMounted(() => {
    getHighlightedText = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            highlightedText.value = range.toString();
            // console.log(highlightedText);
        }
    }
})

</script>

<template>
    <h4 class="title is-size-4">Game Description</h4>
    <div class="has-text-left has-background-white-ter" style="white-space: pre-line; font-size: 18px" @mouseup="getHighlightedText">
        <div class="mb-2" v-for="line in props.game.replaceAll('\n\n', '\n').split('\n')">
            <span class="has-text-weight-semibold">{{ line.split(" ", 1)[0] }}</span>
            <span>{{ line.substring(line.split(" ", 1)[0].length) }}</span>
        </div>
    </div>
</template>