<!-- BackgroundParticles.vue -->
<template>
  <div class="absolute inset-0 pointer-events-none">
    <div 
      v-for="(particle, index) in particles" 
      :key="index"
      class="absolute rounded-full mix-blend-screen animate-float"
      :style="particleStyle(particle)"
    ></div>
  </div>
</template>

<script setup>
const particles = Array.from({ length: 30 }, () => ({
  width: Math.random() * 200 + 50,
  height: Math.random() * 200 + 50,
  left: Math.random() * 100,
  top: Math.random() * 100,
  color: ['rgba(220, 38, 38, 0.1)', 'rgba(34, 197, 94, 0.1)', 'rgba(251, 191, 36, 0.1)'][Math.floor(Math.random() * 3)],
  delay: Math.random() * 10,
  duration: Math.random() * 20 + 15
}))

const particleStyle = (particle) => {
  return {
    width: `${particle.width}px`,
    height: `${particle.height}px`,
    left: `${particle.left}%`,
    top: `${particle.top}%`,
    background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
    animationDelay: `${particle.delay}s`,
    animationDuration: `${particle.duration}s`
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -30px);
  }
  66% {
    transform: translate(-20px, 20px);
  }
}

.animate-float {
  animation: float infinite ease-in-out;
}
</style>