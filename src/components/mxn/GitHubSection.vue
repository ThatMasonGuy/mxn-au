<template>
    <section class="relative w-full px-6 py-20 mx-auto flex flex-col items-center text-white">
        <h2 class="text-4xl z-10 sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text text-center mb-12 animate-fade-up">
            My GitHub Activity
        </h2>

        <!-- Toggle View -->
        <div class="flex items-center space-x-4 mb-10">
            <button :class="['px-4 py-2 rounded-full', { 'bg-fuchsia-600': !showLogs, 'bg-white/10': showLogs }]"
                @click="showLogs = false">
                Repos
            </button>
            <button :class="['px-4 py-2 rounded-full', { 'bg-fuchsia-600': showLogs, 'bg-white/10': !showLogs }]"
                @click="showLogs = true">
                Live Logs
            </button>
        </div>

        <!-- View Swap -->
        <div v-if="!showLogs" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full">
            <GitHubRepoCard v-for="repo in repos" :key="repo.id" :repo="repo" :topStarCount="topStarCount" />
        </div>

        <div v-else class="w-full max-w-5xl">
            <GitHubCommitFeed :repos="repos" />
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GitHubRepoCard from '@/components/mxn/github/GitHubRepoCard.vue'
import GitHubCommitFeed from '@/components/mxn/github/GitHubCommitFeed.vue'
import { githubFetch } from '@/utils/githubFetch.js'

const showLogs = ref(false)
const repos = ref([])
const topStarCount = ref()

onMounted(async () => {
  try {
    const data = await githubFetch('https://api.github.com/users/ThatMasonGuy/repos?sort=updated&per_page=6')

    if (!Array.isArray(data)) {
      console.error('GitHub API Error:', data)
      repos.value = []
      return
    }

    repos.value = data
    topStarCount.value = Math.max(...data.map(repo => repo.stargazers_count))
  } catch (err) {
    console.error('Failed to fetch GitHub repos:', err)
  }
})
</script>