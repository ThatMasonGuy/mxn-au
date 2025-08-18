<template>
    <section
        class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden text-white px-6 sm:px-12 pt-14">

        <!-- Main Content -->
        <div class="relative z-10 space-y-8 animate-fade-up">
            <!-- Title -->
            <h1
                class="text-5xl sm:text-7xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text animate-gradient leading-tight">
                Welcome to
                <span
                    class="inline-block relative group bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-transparent bg-clip-text">
                    MXN.au
                    <span
                        class="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300"></span>
                </span>
            </h1>

            <!-- Subtitle -->
            <p
                class="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed opacity-0 animate-delayed-fade">
                Building <span class="inline-block animate-pulse-subtle">✨</span> bleeding-edge webapps, tools, games,
                and more
                for the digital frontier.
            </p>

            <!-- Status Badge -->
            <div class="opacity-0 animate-delayed-fade-long">
                <div
                    class="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 shadow-lg hover:bg-black/50 transition-all duration-300 group">
                    <div class="relative">
                        <div class="w-3 h-3 rounded-full bg-green-400"></div>
                        <div class="absolute inset-0 w-3 h-3 rounded-full bg-green-400 animate-ping opacity-75"></div>
                    </div>
                    <span class="text-sm text-green-300 font-medium">
                        Online - Currently working on
                        <span class="font-semibold relative">
                            "TopHeroes Assistant"
                        </span>
                    </span>
                </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4 opacity-0 animate-delayed-fade-longer">
                <!-- Explore Button -->
                <button
                    class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-medium shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 ease-out flex items-center justify-center gap-2"
                    @click="scrollToSection('explore')">
                    <span>Explore My Work</span>
                    <span class="inline-block animate-bounce-right-soft">→</span>
                </button>

                <!-- Contact Button -->
                <button
                    class="px-6 py-3 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg font-medium hover:bg-black/50 transform hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 ease-out flex items-center justify-center gap-2"
                    @click="scrollToSection('contact')">
                    <span>Get in Touch</span>
                    <span class="inline-block animate-bounce-right-soft">→</span>
                </button>
            </div>

        </div>
    </section>
</template>

<script setup>
const scrollToSection = (id) => {
  if (!id) return
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<style scoped>
/* Animations */

/* Soft fade-up on load */
@keyframes fade-up {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-up {
    animation: fade-up 1.2s ease-out both;
}

/* Background gradient pulse */
@keyframes gradient {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

.animate-gradient {
    background-size: 200% 200%;
    animation: gradient 8s ease infinite;
}

/* Delayed fade-ins */
@keyframes delayed-fade {

    0%,
    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.animate-delayed-fade {
    animation: delayed-fade 1.5s forwards;
    animation-delay: 0.4s;
}

.animate-delayed-fade-long {
    animation: delayed-fade 1.5s forwards;
    animation-delay: 0.8s;
}

.animate-delayed-fade-longer {
    animation: delayed-fade 1.5s forwards;
    animation-delay: 1.2s;
}

/* Subtle pulse on sparkles */
@keyframes pulse-subtle {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.8;
        transform: scale(1.1);
    }
}

.animate-pulse-subtle {
    animation: pulse-subtle 2s ease-in-out infinite;
}

/* Softer bounce for button arrows */
@keyframes bounce-right-soft {

    0%,
    100% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(2px);
    }
}

.animate-bounce-right-soft {
    animation: bounce-right-soft 1.2s ease-in-out infinite;
}
</style>