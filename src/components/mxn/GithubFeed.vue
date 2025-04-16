<!-- src/components/mxn/GithubFeed.vue -->
<template>
    <section id="github" class="px-8 py-16 max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-blue-300 mb-12">Live GitHub Feed</h2>
        <div v-if="repos.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="repo in repos" :key="repo.id" class="hover-card glass p-4 rounded-xl shadow-xl">
                <h3 class="text-lg font-bold text-blue-200">{{ repo.name }}</h3>
                <p class="text-sm text-gray-400 mb-2">{{ repo.description || 'No description provided.' }}</p>
                <a class="text-sm text-blue-400 hover:underline" :href="repo.html_url" target="_blank">View on
                    GitHub</a>
            </div>
        </div>
        <p v-else class="text-yellow-400">No public repositories found.</p>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const repos = ref([])

onMounted(async () => {
    try {
        const res = await axios.get('https://api.github.com/users/ThatMasonGuy/repos?sort=updated')
        repos.value = res.data.slice(0, 6)
    } catch (err) {
        console.error('Failed to load GitHub projects:', err)
    }
})
</script>

<style>
.glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.hover-card:hover {
    transform: scale(1.03);
    transition: all 0.3s ease;
}
</style>