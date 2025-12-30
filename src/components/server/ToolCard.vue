<template>
  <div class="tool-card">
    <div class="icon-wrapper">
      <component :is="icon" class="w-6 h-6 text-emerald-400" />
    </div>
    
    <div class="flex-1">
      <h3 class="tool-title">{{ title }}</h3>
      <p class="tool-desc">{{ desc }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.tool-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  transition: all 0.3s;
}

.tool-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.icon-wrapper {
  padding: 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.tool-title {
  font-family: monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.5rem;
}

.tool-desc {
  font-size: 0.875rem;
  color: #9ca3af;
  line-height: 1.5;
}
</style>
