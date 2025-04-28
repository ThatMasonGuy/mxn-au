<template>
    <Dialog :open="isOpen" @update:open="close">
        <DialogContent class="bg-gray-900 text-gray-200 max-w-md">
            <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>

            <div class="space-y-4">
                <!-- Collection ID Input -->
                <div>
                    <label for="newCollectionId" class="block text-sm font-medium text-gray-300">
                        Collection ID
                    </label>
                    <input id="newCollectionId" :value="newCollectionId"
                        @input="$emit('update:newCollectionId', $event.target.value)"
                        class="mt-1 block w-full rounded-md bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g. users, products, settings" />
                    <p v-if="newCollectionIdError" class="mt-2 text-sm text-red-500">
                        {{ newCollectionIdError }}
                    </p>
                </div>
            </div>

            <DialogFooter class="flex justify-end gap-3 mt-6">
                <button type="button" class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-gray-200"
                    @click="close">
                    Cancel
                </button>
                <button type="button" class="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-sm text-white"
                    @click="confirm">
                    Create
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
    newCollectionId: String,
    newCollectionIdError: String,
})

const emit = defineEmits([
  'close',
  'confirm',
  'update:newCollectionId'
])

const close = () => emit('close')
const confirm = () => emit('confirm')
</script>