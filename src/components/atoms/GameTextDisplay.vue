<script setup>
import { onMounted, ref } from 'vue';

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
    <div class="has-text-left has-text-weight-semibold has-background-white-ter" @mouseup="getHighlightedText">
        {{ props.game }}
    </div>
</template>