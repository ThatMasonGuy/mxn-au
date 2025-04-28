<template>
    <Dialog :open="isOpen" @update:open="close">
        <DialogContent class="bg-gray-900 text-gray-200 max-w-2xl">
            <DialogHeader>
                <DialogTitle>Document Details</DialogTitle>
            </DialogHeader>

            <div class="space-y-4">
                <!-- Document Path -->
                <div>
                    <label class="block text-sm font-medium text-gray-300">Document Path</label>
                    <div class="mt-1 bg-gray-800 rounded-md p-2 text-sm font-mono text-indigo-400 break-all">
                        {{ documentPath }}
                    </div>
                    <div class="flex justify-end mt-2">
                        <button @click="copyDocumentPath"
                            class="text-xs text-gray-400 hover:text-indigo-400 transition">
                            Copy Path
                        </button>
                    </div>
                </div>

                <!-- JSON Preview -->
                <div>
                    <label class="block text-sm font-medium text-gray-300">Document JSON</label>
                    <pre
                        class="mt-1 bg-gray-800 rounded-md p-3 overflow-auto max-h-96 text-sm font-mono text-gray-300">{{ formattedJson }}</pre>
                </div>
            </div>

            <DialogFooter class="flex justify-end gap-3 mt-6">
                <button type="button" class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-gray-200"
                    @click="editDocument">
                    Edit
                </button>
                <button type="button" class="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm text-white"
                    @click="close">
                    Close
                </button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    isOpen: Boolean,
    documentPath: String,
    formattedJson: String,
})

const emit = defineEmits(['close', 'edit', 'copyDocumentPath'])

const close = () => emit('close')
const editDocument = () => emit('edit')
const copyDocumentPath = () => emit('copyDocumentPath')
</script>