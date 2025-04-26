<template>
    <div class="space-y-4 animate-fade-up">

        <div v-for="commit in commits" :key="commit.sha"
            class="p-4 rounded-2xl backdrop-blur border transition-all shadow-md flex flex-col space-y-2 animate-commit-in hover:shadow-fuchsia-500/30 hover:scale-[1.02]"
            :style="{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderColor: commit.color }">
            <!-- Header -->
            <div class="flex items-center justify-between text-xs text-white/60">
                <div class="flex items-center gap-2">
                    <!-- Avatar -->
                    <img :src="commit.avatar_url || fallbackAvatar" alt="avatar"
                        class="w-6 h-6 rounded-full object-cover" />

                    <!-- Repo and Author -->
                    <div class="flex flex-wrap gap-2 items-center">
                        <span class="font-semibold" :style="{ color: commit.color }">{{ commit.repo }}</span>
                        <span class="text-white/30">•</span>
                        <span>{{ commit.author || 'Unknown' }}</span>
                    </div>
                </div>

                <!-- Timestamp -->
                <div class="flex items-center gap-1 text-white/40">
                    <span>{{ formatDateTime(commit.date) }}</span>
                    <span v-if="isToday(commit.date)"
                        class="px-2 py-0.5 bg-green-600/80 text-xs text-white rounded-full">
                        New!
                    </span>
                </div>
            </div>

            <!-- Commit Message -->
            <div class="flex items-center flex-wrap gap-2 text-white/90 text-sm">
                <span v-if="commit.tag" class="px-2 py-0.5 rounded-full bg-fuchsia-600 text-xs font-semibold">
                    {{ commit.tag.toUpperCase() }}
                </span>
                <a :href="commit.url" target="_blank" rel="noopener noreferrer"
                    class="hover:underline hover:text-fuchsia-400 transition break-words">
                    {{ truncateMessage(commit.message) }}
                </a>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="!commits.length" class="text-center text-white/40 py-10 animate-pulse">
            Fetching commits...
        </div>

    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { githubFetch } from '@/utils/githubFetch.js'

const props = defineProps({
    repos: Array
})

const commits = ref([])

const fallbackAvatar = 'https://avatars.githubusercontent.com/u/583231?v=4' // Octocat fallback

watchEffect(async () => {
  if (!props.repos.length) return

  const repoColors = {}
  let allCommits = []

  for (const repo of props.repos) {
    try {
      const data = await githubFetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?per_page=3`)

      if (!Array.isArray(data)) {
        console.error('GitHub Commits API Error:', data)
        continue
      }

      if (!repoColors[repo.name]) {
        repoColors[repo.name] = getRandomColor()
      }

      allCommits.push(...data.map(commit => ({
        repo: repo.name,
        message: commit.commit.message,
        sha: commit.sha,
        date: commit.commit.author.date,
        author: commit.commit.author.name,
        url: commit.html_url,
        avatar_url: commit.author?.avatar_url || null,
        color: repoColors[repo.name],
        tag: extractTag(commit.commit.message)
      })))
    } catch (err) {
      console.error('Error fetching commits for', repo.name, err)
    }
  }

  commits.value = allCommits
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20)
})

const formatDateTime = (iso) => {
    const date = new Date(iso)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
}

const truncateMessage = (msg) => {
    if (!msg) return ''
    return msg.length > 80 ? msg.slice(0, 80) + '...' : msg
}

const getRandomColor = () => {
    const colors = [
        '#8b5cf6', '#22d3ee', '#10b981', '#f59e0b', '#f472b6', '#6366f1', '#0ea5e9'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}

const extractTag = (message) => {
    const tags = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    if (!message) return null
    const lower = message.toLowerCase()
    for (const tag of tags) {
        if (lower.startsWith(`${tag}:`)) return tag
    }
    return null
}

const isToday = (iso) => {
    const today = new Date()
    const date = new Date(iso)
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}
</script>

<style scoped>
@keyframes commitIn {
    0% {
        transform: translateY(20px) scale(0.95);
        opacity: 0;
    }

    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

.animate-commit-in {
    animation: commitIn 0.8s ease-out forwards;
}
</style>