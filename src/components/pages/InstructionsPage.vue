<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata'
import InstructionsContent from '@/components/atoms/InstructionsContent.vue'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if (route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        <div class="columns">
            <div class="column is-2"></div>
            <div>
                <InstructionsContent />
            <hr>
            <button class="button is-success is-light" id='finish' @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
            </div>
            <div class="column is-2"></div>
        </div>
    </div>
</template>

