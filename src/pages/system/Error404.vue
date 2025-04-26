<!-- src/pages/Error404.vue -->
<template>
  <section
    class="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 relative overflow-hidden">

    <!-- Floating Background Blobs -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div v-for="n in 8" :key="n"
        class="absolute rounded-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-float"
        :style="generateBlobStyle()" />
    </div>

    <!-- Main Content -->
    <div class="relative z-10 text-center space-y-8 animate-fade-in">
      <h1
        class="text-8xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text animate-gradient">
        404
      </h1>
      <p class="text-2xl sm:text-3xl font-light text-white/80">
        Whoops... you seem lost in space.
      </p>

      <router-link to="/"
        class="inline-block mt-6 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90 transition-all text-white font-semibold shadow-lg animate-pulse-soft">
        Return Home
      </router-link>
    </div>
  </section>
</template>

<script setup>
const generateBlobStyle = () => {
  const size = Math.floor(Math.random() * 200) + 150
  const left = Math.random() * 100
  const top = Math.random() * 100
  const duration = 20 + Math.random() * 10
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    top: `${top}%`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
@keyframes gradient {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes float {

  0%,
  100% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

.animate-fade-in {
  animation: fade-in 1.2s ease-out both;
}

.animate-float {
  animation: float infinite ease-in-out;
}

.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

@keyframes pulse-soft {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
</style>
