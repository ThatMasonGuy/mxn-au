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
import ColourBlobBackground from '@/components/common/backgrounds/ColourBlobBackground.vue'
import GradientBackground from '@/components/common/backgrounds/GradientBackground.vue'
import MXNHeader from '@/components/mxn/MXNHeader.vue'
import HeroSection from '@/components/mxn/HeroSection.vue'
import TerminalInterface from '@/components/mxn/TerminalInterface.vue'
import ExploreSection from '@/components/mxn/ExploreSection.vue'
import SkillsSection from '@/components/mxn/SkillsSection.vue'
import GithubSection from '@/components/mxn/GitHubSection.vue'
import DiscordCTA from '@/components/mxn/DiscordCTA.vue'
import MXNFooter from '@/components/mxn/MXNFooter.vue'
import Separator from '@/components/common/sections/Separator.vue'
</script>