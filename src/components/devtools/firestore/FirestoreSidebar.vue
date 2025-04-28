<template>
    <aside class="space-y-6">
        <!-- Collections -->
        <div class="bg-gray-900/80 rounded-2xl shadow-md overflow-hidden">
            <div class="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <h2 class="text-lg font-semibold text-gray-100">Collections</h2>
            </div>
            <div class="p-4 space-y-4">
                <!-- Search Input -->
                <div class="relative">
                    <input :value="collectionSearch" @input="$emit('update:collectionSearch', $event.target.value)"
                        placeholder="Search collections..."
                        class="block w-full bg-gray-800 border border-gray-700 rounded-md pl-10 pr-3 py-2 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>

                <!-- Collections List -->
                <div class="space-y-2">
                    <button v-for="collection in filteredCollections" :key="collection.id"
                        @click="$emit('select-collection', collection.id)"
                        class="flex justify-between items-center w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        :class="selectedCollection === collection.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'">
                        <span>{{ collection.id }}</span>
                        <span class="text-xs text-gray-400">({{ collection.count }})</span>
                    </button>
                </div>

                <!-- New Collection Button -->
                <button @click="$emit('show-new-collection-modal')"
                    class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-indigo-500 rounded-md text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition">
                    <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                        viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clip-rule="evenodd" />
                    </svg>
                    New Collection
                </button>
            </div>
        </div>

        <!-- Connection Status -->
        <div class="bg-gray-900/80 rounded-2xl shadow-md overflow-hidden">
            <div class="bg-gray-800 px-4 py-3 border-b border-gray-700">
                <h2 class="text-lg font-semibold text-gray-100">Connection</h2>
            </div>
            <div class="p-4 space-y-4">
                <div class="flex items-center gap-3">
                    <div class="h-4 w-4 rounded-full"
                        :class="isConnected ? 'bg-green-400 animate-blink' : 'bg-red-500 animate-pulse-alert'"></div>
                    <div>
                        <p class="text-sm font-medium text-gray-200">
                            {{ isConnected ? 'Connected' : 'Disconnected' }}
                        </p>
                        <p class="text-xs text-gray-400">{{ connectionDetails }}</p>
                    </div>
                </div>

                <button @click="$emit('reconnect')"
                    class="w-full flex items-center justify-center px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition">
                    Reconnect
                </button>
            </div>
        </div>
    </aside>
</template>

<script setup>
const props = defineProps({
    filteredCollections: Array,
    collectionSearch: String,
    selectedCollection: String,
    isConnected: Boolean,
    connectionDetails: String,
})

const emit = defineEmits([
    'select-collection',
    'reconnect',
    'show-new-collection-modal',
    'update:collectionSearch'
])
</script>

<style scoped>
@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }
}

.animate-blink {
    animation: blink 1.5s infinite;
}

@keyframes pulse-alert {

    0%,
    100% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.3);
        opacity: 0.6;
    }
}

.animate-pulse-alert {
    animation: pulse-alert 1.5s infinite;
}
</style>