<template>
  <div class="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-teal-500/30 py-24 px-6">
    <div class="max-w-3xl mx-auto bg-[#030c22] border border-amber-900/30 rounded-2xl p-8 md:p-12 shadow-2xl">
      <div class="mb-10 flex items-center gap-4 border-b border-amber-900/30 pb-6">
        <router-link to="/ai-journal" class="text-amber-500 hover:text-teal-500 transition-colors">
          <ArrowLeft class="w-6 h-6" />
        </router-link>
        <h1 class="text-3xl font-bold text-white">Privacy Policy</h1>
      </div>
      
      <div class="prose prose-invert max-w-none text-slate-300">
        <p class="text-teal-400/80"><strong>Effective Date:</strong> {{ new Date().toLocaleDateString() }}</p>

        <h2 class="text-teal-400 mt-8 mb-4 text-xl font-semibold">1. Information We Collect</h2>
        <p>As an advanced personal journaling assistant, our system collects and processes deeply personal information to provide you with maximum contextual value. This includes:</p>
        <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-400">
          <li><strong>Chat Logs:</strong> Messages sent to and received from the AI via Discord.</li>
          <li><strong>Health Telemetry:</strong> Physical health metrics such as sleep patterns, heart rate, and readiness scores, retrieved via the <strong>Oura API</strong>.</li>
          <li><strong>Computer Activity Logs:</strong> Data regarding applications focused on, words typed, and time spent on your PC.</li>
          <li><strong>Multimodal Data:</strong> Images, screenshots, or files uploaded are processed into text descriptions and discarded (unless specified otherwise).</li>
        </ul>

        <h2 class="text-teal-400 mt-8 mb-4 text-xl font-semibold">2. How We Use Your Information</h2>
        <p>Your data is exclusively used to power the intelligent journaling features:</p>
        <ul class="list-disc pl-6 space-y-2 mb-6 text-slate-400">
          <li>To create a deeply contextualized, searchable database of your life.</li>
          <li>To perform memory rollups, extraction, and indexing via language models.</li>
          <li>To correlate physical health (Oura data) with emotional states and daily activities.</li>
        </ul>

        <h2 class="text-teal-400 mt-8 mb-4 text-xl font-semibold">3. Third-Party Integrations and Processing</h2>
        <p>To function, your data is processed by external AI models (OpenAI, Google) via API. However, your data is strictly handled through API endpoints that do not use your personal inputs for training public models. Health data obtained from the Oura API is securely stored locally in NotebookLM and utilized solely for your daily and weekly briefings.</p>

        <h2 class="text-teal-400 mt-8 mb-4 text-xl font-semibold">4. Off-Record Mode</h2>
        <p>When utilizing the "Off-Record" feature, raw chat transcripts are permanently deleted immediately after the session. Only non-identifiable metadata regarding tone and overarching themes is retained to preserve continuity.</p>

        <h2 class="text-teal-400 mt-8 mb-4 text-xl font-semibold">5. Security</h2>
        <p>We employ rigorous data segregation and API security protocols. Long-term archives are securely stored in NotebookLM, and temporary staging data is aggressively pruned to minimize exposure.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
</script>
