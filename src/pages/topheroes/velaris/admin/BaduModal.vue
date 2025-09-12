<!-- components/ModalBadu.vue -->
<template>
    <Dialog v-model:open="internalOpen">
        <DialogContent class="sm:max-w-md p-0 overflow-hidden" @escape-key-down="onNo">
            <div class="bg-background">
                <DialogHeader class="px-6 pt-6">
                    <DialogTitle class="text-xl">Confirm?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to proceed?
                    </DialogDescription>
                </DialogHeader>

                <div class="px-6 py-4">
                    <img :src="badu" alt="badu" class="w-full h-[30rem] rounded-xl border border-border"
                        draggable="false" />
                </div>

                <DialogFooter class="px-6 pb-6 gap-2 sm:gap-3">
                    <Button variant="secondary" @click="onNo">No</Button>
                    <Button @click="onYes" ref="yesBtn">Yes</Button>
                </DialogFooter>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import badu from '@/assets/Badu.png' // if needed, add extension (e.g., '@/assets/badu.png')
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const props = defineProps({
    modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'yes', 'no'])

const internalOpen = ref(props.modelValue)
const yesBtn = ref(null)

watch(() => props.modelValue, v => { internalOpen.value = v })
watch(internalOpen, v => emit('update:modelValue', v))

function onYes() {
    emit('yes')
    internalOpen.value = false
}
function onNo() {
    emit('no')
    internalOpen.value = false
}

onMounted(() => {
    // slight focus nudge so keyboard users can hit Enter for "Yes"
    const t = setTimeout(() => { yesBtn.value?.$el?.focus?.() || yesBtn.value?.focus?.() }, 0)
    // no need to clear; component teardown will handle it
})
</script>