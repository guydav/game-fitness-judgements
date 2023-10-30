<script setup>

import {ref, } from 'vue';

// const router = useRouter()
// const route = useRoute()
// const smilestore = useSmileStore()


const value = ref(0);

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    n: {
        type: Number,
        required: true,
    },
    labels: Object,
})

defineExpose({
    value,
})

</script>

<template>
    <div class="field">
        <div class="label has-text-left">{{ props.question }}</div>
        <div class="control">
            <label class="radio" v-for="i in props.n" :key="i">
                <input type="radio" :value="i" :name="props.name" v-model="value">
                {{ i }}{{ props.labels && i in props.labels ? ` (${props.labels[i]})` : '' }}
            </label>
        </div>
    </div>
</template>