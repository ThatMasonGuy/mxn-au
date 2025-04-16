<!-- src/pages/MasonUnleashed.vue -->
<template>
  <main class="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans overflow-x-hidden">
    <HeaderBar />
    <HeroSection />
    <TerminalInterface />
    <AboutSection />
    <TimelineSection />
    <SkillsChart />
    <ProjectsDashboard />
    <GithubFeed />
    <MasonFooter />
  </main>
</template>

<script setup>
import HeaderBar from '@/components/mxn/HeaderBar.vue'
import HeroSection from '@/components/mxn/HeroSection.vue'
import TerminalInterface from '@/components/mxn/TerminalInterface.vue'
import AboutSection from '@/components/mxn/AboutSection.vue'
import TimelineSection from '@/components/mxn/TimelineSection.vue'
import SkillsChart from '@/components/mxn/SkillsChart.vue'
import ProjectsDashboard from '@/components/mxn/ProjectsDashboard.vue'
import GithubFeed from '@/components/mxn/GithubFeed.vue'
import MasonFooter from '@/components/mxn/MasonFooter.vue'
</script>