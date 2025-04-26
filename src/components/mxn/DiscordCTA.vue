<template>
    <section
      id="contact"
      class="relative min-h-[70vh] w-full flex flex-col justify-center items-center text-center px-6 py-24 text-white overflow-hidden"
    >
  
      <!-- Frosted Glass Card -->
      <div
        class="relative z-10 w-full max-w-2xl bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl px-8 py-12 flex flex-col items-center space-y-8 animate-fade-up"
      >
        <h2 class="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text leading-tight">
          Let's Connect on Discord
        </h2>
  
        <p class="text-lg text-white/80 max-w-xl leading-relaxed text-center">
          Have a project idea, need a dev, or just want to hang out?  
          Message me directly — no awkward forms.
        </p>
  
        <!-- CTA Button -->
        <a
          href="https://discord.com/users/358927850310598656"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full font-semibold text-lg shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 animate-bounce-on-scroll"
        >
          <!-- Discord Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.078.037c-.211.375-.444.864-.608 1.249a19.736 19.736 0 00-5.891 0 12.516 12.516 0 00-.617-1.249.077.077 0 00-.078-.037A19.736 19.736 0 003.683 4.37a.07.07 0 00-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 00.031.054 19.933 19.933 0 006.073 3.092.077.077 0 00.084-.027c.468-.644.885-1.32 1.247-2.023a.076.076 0 00-.041-.105 12.54 12.54 0 01-1.79-.864.078.078 0 01-.008-.128c.12-.09.239-.183.353-.275a.074.074 0 01.077-.01c3.752 1.709 7.814 1.709 11.538 0a.076.076 0 01.078.01c.114.092.233.185.353.275a.078.078 0 01-.006.128 12.298 12.298 0 01-1.792.864.075.075 0 00-.04.106c.363.703.78 1.38 1.248 2.023a.076.076 0 00.084.028 19.876 19.876 0 006.073-3.093.076.076 0 00.031-.053c.5-5.177-.838-9.653-3.549-13.661a.06.06 0 00-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.953 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
            />
          </svg>
  
          <!-- Username + Label -->
          <span class="flex flex-col items-start leading-tight text-left">
            <span class="text-white font-bold">@ThatMasonGuy</span>
            <span class="text-white/70 text-sm font-normal">Click to Message Me</span>
          </span>
        </a>
      </div>
    </section>
  </template>
  
  <script setup>
  // No dynamic logic needed yet
  </script>
  
  <style scoped>
  /* Background blobs float */
  @keyframes float-slow {
    0%, 100% {
      transform: translateY(0) translateX(0);
    }
    50% {
      transform: translateY(-20px) translateX(10px);
    }
  }
  .animate-float-slow {
    animation: float-slow 40s ease-in-out infinite;
  }
  
  /* Fade-up for card */
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
  
  /* Bounce for CTA Button */
  @keyframes bounce-on-scroll {
    0% {
      transform: translateY(10px) scale(0.95);
      opacity: 0;
    }
    60% {
      transform: translateY(-6px) scale(1.05);
      opacity: 1;
    }
    100% {
      transform: translateY(0) scale(1);
    }
  }
  .animate-bounce-on-scroll {
    animation: bounce-on-scroll 1.2s ease-out both;
  }
  </style>
  