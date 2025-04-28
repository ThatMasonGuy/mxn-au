<template>
    <Dialog :open="isOpen" @update:open="close">
        <DialogContent class="bg-gray-900 text-gray-200">
            <DialogHeader>
                <DialogTitle>
                    {{ isEdit ? 'Edit Document' : 'Add New Document' }}
                </DialogTitle>
            </DialogHeader>

            <div class="space-y-4">
                <!-- Document ID Input (only for new docs) -->
                <div v-if="!isEdit">
                    <label for="documentId" class="block text-sm font-medium text-gray-300">
                        Document ID (optional)
                    </label>
                    <input id="documentId" :value="newDocumentId"
                        @input="$emit('update:newDocumentId', $event.target.value)"
                        placeholder="Leave blank for auto-generated ID"
                        class="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-sm text-gray-200 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                <!-- Document JSON Input -->
                <div>
                    <label for="documentData" class="block text-sm font-medium text-gray-300">
                        Document Data (JSON)
                    </label>
                    <textarea id="documentData" :value="documentJsonData"
                        @input="$emit('update:documentJsonData', $event.target.value)" rows="10"
                        placeholder='{"key": "value"}'
                        class="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-sm font-mono text-gray-200 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        :class="{ 'border-red-500': jsonError }"></textarea>

                    <p v-if="jsonError" class="text-sm text-red-500 mt-2">{{ jsonError }}</p>

                    <div class="flex justify-end mt-2">
                        <button type="button" @click="formatJson"
                            class="text-sm text-gray-400 hover:text-indigo-400 transition">
                            Format JSON
                        </button>
                    </div>
                </div>
            </div>

            <DialogFooter class="flex justify-end gap-3 mt-6">
                <button type="button" class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-gray-200"
                    @click="close">
                    Cancel
                </button>
                <button type="button" class="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm text-white"
                    @click="save">
                    Save
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
    isEdit: Boolean,
    newDocumentId: String,
    documentJsonData: String,
    jsonError: String,
})

const emit = defineEmits([
    'close',
    'save',
    'format-json',
    'update:newDocumentId',
    'update:documentJsonData'
])

const close = () => emit('close')
const save = () => emit('save')
const formatJson = () => emit('formatJson')
</script>