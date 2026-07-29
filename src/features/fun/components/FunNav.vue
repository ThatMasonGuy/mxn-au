<template>
  <nav class="fun-nav" aria-label="Fun tools">
    <RouterLink
      v-for="tool in tools"
      :key="tool.to"
      class="fun-link"
      :to="tool.to"
      :aria-label="`${tool.label}: ${formatCount(tool.count)} ${tool.countLabel}`"
    >
      <component :is="tool.icon" :size="15" :stroke-width="1.9" />
      <span class="tool-label">{{ tool.label }}</span>
      <span class="tool-count">{{ formatCount(tool.count) }}</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { CircleHelp, Coins, Dices } from 'lucide-vue-next'
import { useFunCounters } from '@/features/fun/composables/useFunCounters'

const { questionsAsked, coinsFlipped, diceRolled } = useFunCounters()
const numberFormatter = new Intl.NumberFormat('en-AU', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const tools = computed(() => [
  {
    to: '/8ball',
    label: '8 Ball',
    count: questionsAsked.value,
    countLabel: 'questions asked',
    icon: CircleHelp,
  },
  {
    to: '/coin',
    label: 'Flip a coin',
    count: coinsFlipped.value,
    countLabel: 'coins flipped',
    icon: Coins,
  },
  {
    to: '/dice',
    label: 'Roll dice',
    count: diceRolled.value,
    countLabel: 'dice rolled',
    icon: Dices,
  },
])

function formatCount(value) {
  return numberFormatter.format(value || 0)
}
</script>

<style scoped>
.fun-nav {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.fun-link {
  display: inline-flex;
  min-height: 2.35rem;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.55rem 0.45rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 0.7rem;
  color: #9d96aa;
  background: rgba(255, 255, 255, 0.025);
  font-size: 0.65rem;
  font-weight: 650;
  letter-spacing: 0.025em;
  text-decoration: none;
  backdrop-filter: blur(1rem);
  transition:
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.fun-link:hover {
  border-color: rgba(174, 135, 246, 0.34);
  color: #f4edff;
  background: rgba(137, 91, 220, 0.1);
  transform: translateY(-1px);
}

.fun-link.router-link-active {
  border-color: rgba(174, 135, 246, 0.42);
  color: #fff;
  background: linear-gradient(135deg, rgba(128, 78, 210, 0.2), rgba(255, 255, 255, 0.04));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.fun-link:focus-visible {
  outline: 2px solid #c8aaff;
  outline-offset: 3px;
}

.tool-count {
  min-width: 1.45rem;
  padding: 0.2rem 0.35rem;
  border-radius: 0.4rem;
  color: #c9b9e6;
  background: rgba(255, 255, 255, 0.055);
  font-size: 0.57rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  text-align: center;
}

@media (max-width: 720px) {
  .fun-nav {
    gap: 0.3rem;
  }

  .fun-link {
    min-width: 2.35rem;
    justify-content: center;
    gap: 0.25rem;
    padding: 0.4rem;
  }

  .tool-label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .tool-count {
    min-width: 1.15rem;
    padding-inline: 0.2rem;
  }
}

@media (max-width: 390px) {
  .fun-link {
    min-width: 2.15rem;
  }

  .tool-count {
    display: none;
  }
}
</style>
