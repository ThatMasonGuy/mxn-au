<template>
  <section id="github" class="relative w-full px-6 py-32 mx-auto flex flex-col items-center text-white">
      
      <!-- Section Header -->
      <div class="text-center mb-12 max-w-3xl">
          <h2 class="text-5xl sm:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              My GitHub Activity
          </h2>
          <p class="text-lg text-white/60">
              Explore my latest projects and contributions
          </p>
      </div>

      <!-- Toggle View -->
      <div class="flex items-center gap-2 mb-12 p-1.5 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10">
          <button 
              :class="[
                  'px-6 py-2.5 rounded-lg font-medium transition-all duration-300',
                  !showLogs 
                      ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/20' 
                      : 'text-white/60 hover:text-white/90'
              ]"
              @click="showLogs = false">
              <span class="flex items-center gap-2">
                  <Github class="w-4 h-4" />
                  Repositories
              </span>
          </button>
          <button 
              :class="[
                  'px-6 py-2.5 rounded-lg font-medium transition-all duration-300',
                  showLogs 
                      ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-500/20' 
                      : 'text-white/60 hover:text-white/90'
              ]"
              @click="showLogs = true">
              <span class="flex items-center gap-2">
                  <GitCommit class="w-4 h-4" />
                  Live Activity
              </span>
          </button>
      </div>

      <!-- View Content -->
      <div class="w-full max-w-7xl">
          <!-- Repos Grid -->
          <div v-if="!showLogs" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <GitHubRepoCard v-for="repo in repos" :key="repo.id" :repo="repo" :topStarCount="topStarCount" />
          </div>

          <!-- Commit Feed -->
          <div v-else>
              <GitHubCommitFeed :repos="repos" />
          </div>
      </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Github, GitCommit } from 'lucide-vue-next'
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