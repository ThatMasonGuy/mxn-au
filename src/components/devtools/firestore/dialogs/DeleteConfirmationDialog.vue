<template>
    <Dialog :open="isOpen" @update:open="close">
        <DialogContent class="bg-gray-900 text-gray-200 max-w-md">
            <DialogHeader>
                <DialogTitle>Delete Document</DialogTitle>
            </DialogHeader>

            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    <div class="h-10 w-10 flex items-center justify-center rounded-full bg-red-500/20">
                        <TrashIcon class="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                        <p class="text-sm font-semibold text-gray-200">
                            Are you sure you want to delete this document?
                        </p>
                        <p class="text-xs text-gray-400 mt-1">
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div class="bg-gray-800 rounded-md p-2 text-sm font-mono text-red-400 break-all">
                    {{ documentPath }}
                </div>
            </div>

            <DialogFooter class="flex justify-end gap-3 mt-6">
                <button type="button" class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-gray-200"
                    @click="close">
                    Cancel
                </button>
                <button type="button" class="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 text-sm text-white"
                    @click="confirm">
                    Delete
                </button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    documentPath: String,
})

const emit = defineEmits(['close', 'confirm'])

const close = () => emit('close')
const confirm = () => emit('confirm')
</script>