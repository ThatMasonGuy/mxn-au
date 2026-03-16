<!-- src/pages/MasonUnleashed.vue -->
<template>
  <ColourBlobBackground>
    <GradientBackground :hue="210">
      <MXNHeader />
      <HeroSection id="top" />
      <Separator />
      <TerminalInterface id="terminal" />
      <Separator />
      <ExploreSection id="explore" />
      <Separator />
      <SkillsSection id="skills" />
      <Separator />
      <GithubSection id="github" />
      <Separator />
      <DiscordCTA id="contact" />
      <MXNFooter />
    </GradientBackground>
  </ColourBlobBackground>
</template>

<script setup>
import ColourBlobBackground from '@/shared/components/common/backgrounds/ColourBlobBackground.vue'
import GradientBackground from '@/shared/components/common/backgrounds/GradientBackground.vue'
import MXNHeader from '@/features/home/components/MXNHeader.vue'
import HeroSection from '@/features/home/components/HeroSection.vue'
import TerminalInterface from '@/features/home/components/TerminalInterface.vue'
import ExploreSection from '@/features/home/components/ExploreSection.vue'
import SkillsSection from '@/features/home/components/SkillsSection.vue'
import GithubSection from '@/features/home/components/GitHubSection.vue'
import DiscordCTA from '@/features/home/components/DiscordCTA.vue'
import MXNFooter from '@/features/home/components/MXNFooter.vue'
import Separator from '@/shared/components/common/sections/Separator.vue'
</script>