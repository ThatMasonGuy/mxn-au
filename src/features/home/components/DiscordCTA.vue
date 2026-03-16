<template>
  <section
      id="contact"
      class="relative min-h-[80vh] w-full flex flex-col justify-center items-center text-center px-6 py-32 text-white">

      <div class="relative z-10 w-full max-w-3xl">
          <!-- Glow Effect -->
          <div class="absolute -inset-8 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl opacity-50" />
          
          <!-- Main Card -->
          <div class="relative bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl px-8 sm:px-12 py-16 space-y-8">
              
              <!-- Header -->
              <div class="space-y-4">
                  <h2 class="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text leading-tight">
                      Let's Connect
                  </h2>
                  <p class="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                      Have a project idea, need a developer, or just want to chat?
                      <span class="block mt-2 text-white/50">Message me directly — no forms, no hassle</span>
                  </p>
              </div>

              <!-- Discord CTA -->
              <div class="pt-4">
                  <a
                      href="https://discord.com/users/358927850310598656"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group inline-flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                      
                      <!-- Discord Icon -->
                      <div class="relative">
                          <div class="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                          <svg xmlns="http://www.w3.org/2000/svg" class="relative h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.078.037c-.211.375-.444.864-.608 1.249a19.736 19.736 0 00-5.891 0 12.516 12.516 0 00-.617-1.249.077.077 0 00-.078-.037A19.736 19.736 0 003.683 4.37a.07.07 0 00-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 00.031.054 19.933 19.933 0 006.073 3.092.077.077 0 00.084-.027c.468-.644.885-1.32 1.247-2.023a.076.076 0 00-.041-.105 12.54 12.54 0 01-1.79-.864.078.078 0 01-.008-.128c.12-.09.239-.183.353-.275a.074.074 0 01.077-.01c3.752 1.709 7.814 1.709 11.538 0a.076.076 0 01.078.01c.114.092.233.185.353.275a.078.078 0 01-.006.128 12.298 12.298 0 01-1.792.864.075.075 0 00-.04.106c.363.703.78 1.38 1.248 2.023a.076.076 0 00.084.028 19.876 19.876 0 006.073-3.093.076.076 0 00.031-.053c.5-5.177-.838-9.653-3.549-13.661a.06.06 0 00-.031-.028zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.953 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.953-2.418 2.157-2.418 1.21 0 2.18 1.092 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" />
                          </svg>
                      </div>

                      <!-- Username & Label -->
                      <div class="flex flex-col items-start leading-tight">
                          <span class="text-white font-bold text-xl">@ThatMasonGuy</span>
                          <span class="text-white/80 text-sm font-normal">Click to message me</span>
                      </div>

                      <!-- Arrow -->
                      <ArrowRight class="w-6 h-6 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
              </div>

              <!-- Quick Links -->
              <div class="flex items-center justify-center gap-6 pt-8 border-t border-white/10">
                  <a 
                      href="https://github.com/ThatMasonGuy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                      <Github class="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span class="text-sm font-medium">GitHub</span>
                  </a>
                  <div class="w-px h-6 bg-white/20" />
                  <a 
                      href="mailto:contact@mxn.au"
                      class="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                      <Mail class="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span class="text-sm font-medium">Email</span>
                  </a>
              </div>

          </div>
      </div>
  </section>
</template>

<script setup>
import { ArrowRight, Github, Mail } from 'lucide-vue-next'
</script>