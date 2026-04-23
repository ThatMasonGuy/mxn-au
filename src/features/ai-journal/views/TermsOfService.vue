<template>
  <div class="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-teal-500/30 py-24 px-6">
    <div class="max-w-3xl mx-auto bg-[#030c22] border border-teal-900/30 rounded-2xl p-8 md:p-12 shadow-2xl">
      <div class="mb-10 flex items-center gap-4 border-b border-teal-900/30 pb-6">
        <router-link to="/ai-journal" class="text-teal-500 hover:text-amber-500 transition-colors">
          <ArrowLeft class="w-6 h-6" />
        </router-link>
        <h1 class="text-3xl font-bold text-white">Terms of Service</h1>
      </div>
      
      <div class="prose prose-invert max-w-none text-slate-300">
        <p class="text-amber-400/80"><strong>Effective Date:</strong> {{ new Date().toLocaleDateString() }}</p>
        
        <h2 class="text-amber-400 mt-8 mb-4 text-xl font-semibold">1. Introduction</h2>
        <p>Welcome to the AI Journaling Application. These Terms of Service govern your use of our private, personalized AI assistant integrated via Discord. By accessing or using the service, you agree to be bound by these terms.</p>

        <h2 class="text-amber-400 mt-8 mb-4 text-xl font-semibold">2. Service Description</h2>
        <p>The AI Journaling App is a personal mental and physical telemetry tracking system. It interfaces with third-party APIs (such as Oura and Discord) and utilizes advanced AI models (including Gemini and GPT series) to process, summarize, and archive user data.</p>

        <h2 class="text-amber-400 mt-8 mb-4 text-xl font-semibold">3. User Responsibilities</h2>
        <p>This service is intended for personal use. You are responsible for maintaining the confidentiality of your Discord account and API keys (such as Oura API credentials). You agree not to misuse the service for malicious activities or attempt to reverse-engineer the proprietary memory management architecture.</p>

        <h2 class="text-amber-400 mt-8 mb-4 text-xl font-semibold">4. Data and Intellectual Property</h2>
        <p>You retain all rights to the personal data you input into the system. The unique memory pipeline, routing logic, and code architecture remain the intellectual property of the developer.</p>

        <h2 class="text-amber-400 mt-8 mb-4 text-xl font-semibold">5. Limitation of Liability</h2>
        <p>The service is provided "as is". The AI may generate inaccurate or hallucinatory responses. We are not liable for any decisions made based on the AI's output, nor are we liable for data loss or service interruptions resulting from third-party API outages.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
</script>
