<template>
    <div class="space-y-8">
        <!-- Empty state when no blocks -->
        <div v-if="blocks.length === 0" class="rounded-xl border-2 border-dashed border-zinc-700 p-12 text-center">
            <div class="flex flex-col items-center justify-center space-y-4">
                <div class="rounded-full bg-zinc-800 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-400" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h3 class="text-xl font-medium text-white">Add your first block</h3>
                <p class="text-zinc-400 max-w-md">
                    Select a component from the library to start building your guide
                </p>
            </div>
        </div>

        <!-- List of blocks with animations -->
        <TransitionGroup name="list" tag="div" class="space-y-4">
            <div v-for="(block, index) in blocks" :key="block.id" class="relative group">
                <!-- Block controls overlay -->
                <div
                    class="absolute -left-10 top-0 bottom-0 w-8 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                </div>

                <!-- Block content with hover effect -->
                <div
                    class="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden hover:border-purple-600/30 transition-colors shadow-lg hover:shadow-purple-900/10">
                    <!-- Block header -->
                    <div class="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-700">
                        <div class="flex items-center">
                            <span class="text-xs uppercase tracking-wider font-mono text-purple-300 mr-2">
                                {{ block.type }}
                            </span>
                            <span class="text-zinc-400 text-xs">ID: {{ block.id.substring(0, 8) }}</span>
                        </div>

                        <div class="flex items-center space-x-2">
                            <!-- Move Up -->
                            <button v-if="index > 0" @click="moveBlock(index, 'up')" title="Move up"
                                class="hover:text-purple-400 text-zinc-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 15l7-7 7 7" />
                                </svg>
                            </button>

                            <!-- Move Down -->
                            <button v-if="index < blocks.length - 1" @click="moveBlock(index, 'down')" title="Move down"
                                class="hover:text-purple-400 text-zinc-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- Delete -->
                            <button @click="removeBlock(index)" title="Delete"
                                class="hover:text-red-500 text-zinc-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <!-- Expand/Collapse -->
                            <button @click="toggleBlockExpand(block.id)"
                                class="hover:text-purple-300 text-zinc-400 transition-colors"
                                :title="expandedBlocks[block.id] ? 'Collapse' : 'Expand'">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform"
                                    :class="{ 'rotate-180': expandedBlocks[block.id] }" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Block content -->
                    <div class="p-4">
                        <GuideBlock :block="block" :is-expanded="expandedBlocks[block.id]" />
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { defineProps, ref, onMounted, watch } from 'vue'
import GuideBlock from './GuideBlock.vue'

const props = defineProps({
    blocks: Array
})

const expandedBlocks = ref({})

// Initialize all blocks as expanded
onMounted(() => {
    props.blocks.forEach(block => {
        expandedBlocks.value[block.id] = true
    })
})

// Watch for new blocks and set them as expanded
watch(
    () => props.blocks,
    (newBlocks) => {
        newBlocks.forEach(block => {
            if (expandedBlocks.value[block.id] === undefined) {
                expandedBlocks.value[block.id] = true
            }
        })
    },
    { deep: true }
)

function toggleBlockExpand(id) {
    expandedBlocks.value[id] = !expandedBlocks.value[id]
}

function moveBlock(index, direction) {
    if (direction === 'up' && index > 0) {
        const temp = props.blocks[index]
        props.blocks[index] = props.blocks[index - 1]
        props.blocks[index - 1] = temp
    } else if (direction === 'down' && index < props.blocks.length - 1) {
        const temp = props.blocks[index]
        props.blocks[index] = props.blocks[index + 1]
        props.blocks[index + 1] = temp
    }
}

function removeBlock(index) {
    if (confirm('Are you sure you want to delete this block?')) {
        props.blocks.splice(index, 1)
    }
}
</script>

<style scoped>
/* List animation */
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

/* Ensure leaving items don't affect layout */
.list-leave-active {
    position: absolute;
}
</style>