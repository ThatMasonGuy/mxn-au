<template>
  <div class="min-h-screen bg-[#020817] text-slate-300 font-sans selection:bg-teal-500/30">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-[#020817]/80 backdrop-blur-md border-b border-teal-900/30">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img src="/ai-journal/icon.png" alt="AI Journal Icon" class="w-10 h-10 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
          <span class="text-xl font-bold bg-gradient-to-r from-teal-400 to-amber-500 bg-clip-text text-transparent">AI Journal</span>
        </div>
        <div class="flex gap-6 text-sm font-medium">
          <a href="#architecture" class="hover:text-teal-400 transition-colors">Architecture</a>
          <a href="#memory" class="hover:text-amber-400 transition-colors">Memory</a>
          <a href="#tools" class="hover:text-teal-400 transition-colors">Tools</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
      <!-- Background glows -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-[120px] -z-10"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] -z-10"></div>

      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-950/50 border border-teal-800/50 text-teal-400 text-sm font-medium">
            <Sparkles class="w-4 h-4" />
            14-Layer Personal Assistant
          </div>
          <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            The Ultimate <br/>
            <span class="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Black Box</span> <br/>
            For Your Mind
          </h1>
          <p class="text-lg text-slate-400 leading-relaxed max-w-xl">
            Integrated directly into Discord, this system captures your thoughts, feelings, and physical telemetry (Oura, PC activity), providing a deeply contextualized, searchable database of your entire life.
          </p>
          <div class="flex gap-4">
            <a href="#memory" class="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(13,148,136,0.4)] transition-all">
              Explore the Architecture
            </a>
          </div>
        </div>
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <img src="/ai-journal/hero.png" alt="AI Neural Brain Core" class="relative rounded-2xl shadow-2xl border border-teal-900/50 w-full object-cover aspect-square" />
        </div>
      </div>
    </section>

    <!-- Architecture Section -->
    <section id="architecture" class="py-24 px-6 bg-[#030c22] border-y border-teal-900/20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-5xl font-bold text-white mb-6">Orchestrated Intelligence</h2>
          <p class="text-slate-400 max-w-2xl mx-auto">Requests are intelligently routed across specialized AI models to maximize efficiency, depth, and recall.</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Card 1 -->
          <div class="p-8 rounded-2xl bg-[#020817] border border-teal-900/40 hover:border-teal-500/50 transition-colors group">
            <Zap class="w-8 h-8 text-amber-500 mb-6" />
            <h3 class="text-xl font-bold text-white mb-3">Gemini 2.5 Flash</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Operates as the fast, daily chat layer for near-instant, day-to-day conversation and ultra-fast memory selection.</p>
          </div>
          <!-- Card 2 -->
          <div class="p-8 rounded-2xl bg-[#020817] border border-teal-900/40 hover:border-teal-500/50 transition-colors group">
            <Search class="w-8 h-8 text-teal-400 mb-6" />
            <h3 class="text-xl font-bold text-white mb-3">Gemini 2.5 Pro</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Functions as the multimodal and search layer, handling complex tasks like web lookups, image analysis, and document interpretation.</p>
          </div>
          <!-- Card 3 -->
          <div class="p-8 rounded-2xl bg-[#020817] border border-teal-900/40 hover:border-amber-500/50 transition-colors group">
            <BrainCircuit class="w-8 h-8 text-amber-500 mb-6" />
            <h3 class="text-xl font-bold text-white mb-3">GPT-5.4 & Mini</h3>
            <p class="text-slate-400 text-sm leading-relaxed">Serves as the deep reasoning layer for memory sweeps and pruning, while Mini acts as a lightweight utility for reminders and glue logic.</p>
          </div>
          <!-- Card 4 (Spans) -->
          <div class="p-8 rounded-2xl bg-gradient-to-br from-teal-950/40 to-[#020817] border border-teal-700/30 lg:col-span-3 hover:border-teal-400/50 transition-all flex flex-col md:flex-row items-center gap-8">
            <Database class="w-12 h-12 text-teal-400 shrink-0" />
            <div>
              <h3 class="text-2xl font-bold text-white mb-2">NotebookLM: The Grounded Archive</h3>
              <p class="text-slate-400">Maintains full daily logs and acts as the high-trust, long-term recall layer. Every thought, metric, and summary is indexed here permanently.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Massive Memory Management Section -->
    <section id="memory" class="py-32 px-6 relative overflow-hidden">
      <!-- Subtle dot pattern background for depth -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyMCwgMTg0LCAxNjYsIDAuMTUpIi8+PC9zdmc+')] opacity-50"></div>
      
      <div class="max-w-5xl mx-auto relative z-10">
        <div class="mb-20 text-center md:text-left">
          <h2 class="text-4xl lg:text-6xl font-black text-white mb-8 border-l-4 border-amber-500 pl-6 inline-block md:block mx-auto md:mx-0 text-left">Deep Memory Architecture</h2>
          <p class="text-xl text-teal-200/80 leading-relaxed md:pl-7 max-w-3xl">
            The largest and most complex subsystem. A multi-layered pipeline designed to process vast amounts of data without losing context, optimizing for both short-term relevance and long-term wisdom.
          </p>
        </div>

        <div class="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-teal-500/20 before:via-amber-500/20 before:to-transparent">

          <!-- Step 1 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020817] bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Clock class="w-4 h-4" />
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#030c22]/80 backdrop-blur border border-teal-900/50 hover:border-teal-500/50 transition-colors ml-4 md:ml-0">
              <h3 class="text-xl font-bold text-amber-400 mb-2">Hourly & 4-Hour Rollups</h3>
              <p class="text-slate-400 text-sm leading-relaxed">Each hour, messages are rolled up into a contextual blob detailing key decisions, emotions, and unfinished thoughts. At the 4th hour, the oldest two are merged into a daily blob, ensuring high detail for recent hours and condensed key context for older ones.</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020817] bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Moon class="w-4 h-4" />
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#030c22]/80 backdrop-blur border border-teal-900/50 hover:border-amber-500/50 transition-colors ml-4 md:ml-0">
              <h3 class="text-xl font-bold text-teal-400 mb-2">End-of-Day Extraction</h3>
              <p class="text-slate-400 text-sm leading-relaxed">Between 6am-6am, the entire log runs through GPT-5.4 with high reasoning to extract standalone memories. These are staged and sent through a secondary cleaning pass to promote, cull, or merge with existing memories based on long-term value.</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020817] bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Cpu class="w-4 h-4" />
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#030c22]/80 backdrop-blur border border-teal-900/50 hover:border-teal-500/50 transition-colors ml-4 md:ml-0">
              <h3 class="text-xl font-bold text-amber-400 mb-2">Ultra-Fast Retrieval</h3>
              <p class="text-slate-400 text-sm leading-relaxed">Before a message hits GPT-5.4-mini, Gemini Flash-Lite scans all active memories in sub-3 seconds. It injects up to 15 highly relevant long-term memories into the context packet, ensuring flawless continuity.</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020817] bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Calendar class="w-4 h-4" />
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#030c22]/80 backdrop-blur border border-teal-900/50 hover:border-amber-500/50 transition-colors ml-4 md:ml-0">
              <h3 class="text-xl font-bold text-teal-400 mb-2">Weekly Consolidation</h3>
              <p class="text-slate-400 text-sm leading-relaxed">To prevent exponential growth, a weekly parse rewrites merged memories, consolidating context from multiple archived entries. This allows deletion operations without losing a drop of historical context.</p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020817] bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <ImageIcon class="w-4 h-4" />
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#030c22]/80 backdrop-blur border border-teal-900/50 hover:border-teal-500/50 transition-colors ml-4 md:ml-0">
              <h3 class="text-xl font-bold text-amber-400 mb-2">Multimodal Translation</h3>
              <p class="text-slate-400 text-sm leading-relaxed">Images and files uploaded are immediately swept, fully described, and transcribed into text. This saves NotebookLM's source limits while permanently indexing the visual context.</p>
            </div>
          </div>

          <!-- Step 6 -->
          <div class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020817] bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <Layers class="w-4 h-4" />
            </div>
            <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-[#030c22]/80 backdrop-blur border border-teal-900/50 hover:border-amber-500/50 transition-colors ml-4 md:ml-0">
              <h3 class="text-xl font-bold text-teal-400 mb-2">The Daily Index</h3>
              <p class="text-slate-400 text-sm leading-relaxed">A massive AI pass compiles chat logs, NLM discussions, tasks, Oura health data, and PC usage into a singular daily index document (mood, energy, themes). This final bundle is pushed to NLM for permanent archiving.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Active Tools -->
    <section id="tools" class="py-24 px-6 bg-[#020817] border-t border-teal-900/20">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl lg:text-5xl font-bold text-center text-white mb-16">Active Life Management</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="flex gap-4 p-6 rounded-xl bg-[#030c22] border border-teal-900/30">
            <ListTodo class="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <h4 class="text-lg font-bold text-white mb-1">Tasks & Reminders</h4>
              <p class="text-sm text-slate-400">Natural language processing sets timed reminders and manages multiple to-do lists, pinging you directly in Discord.</p>
            </div>
          </div>
          
          <div class="flex gap-4 p-6 rounded-xl bg-[#030c22] border border-amber-900/30">
            <EyeOff class="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h4 class="text-lg font-bold text-white mb-1">Off-Record Mode</h4>
              <p class="text-sm text-slate-400">Private venting sessions. Raw transcripts are permanently wiped, leaving only structured metadata (tone, themes) for continuity.</p>
            </div>
          </div>

          <div class="flex gap-4 p-6 rounded-xl bg-[#030c22] border border-teal-900/30">
            <Newspaper class="w-8 h-8 text-teal-400 shrink-0" />
            <div>
              <h4 class="text-lg font-bold text-white mb-1">Automated News</h4>
              <p class="text-sm text-slate-400">Integrated RSS fetches, deduplicates, and summarizes specific stories, delivering a curated morning briefing.</p>
            </div>
          </div>

          <div class="flex gap-4 p-6 rounded-xl bg-[#030c22] border border-amber-900/30">
            <UserCircle class="w-8 h-8 text-amber-500 shrink-0" />
            <div>
              <h4 class="text-lg font-bold text-white mb-1">Profiles & Briefs</h4>
              <p class="text-sm text-slate-400">Stores context like location and work schedules. The '!brief' command synthesizes weather, tasks, and reminders instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-teal-900/30 bg-[#01040a] py-12 px-6 text-center text-sm text-slate-500 relative z-20">
      <div class="flex justify-center gap-6 mb-6">
        <router-link to="/ai-journal/terms-of-service" class="hover:text-teal-400 transition-colors">Terms of Service</router-link>
        <router-link to="/ai-journal/privacy-policy" class="hover:text-amber-400 transition-colors">Privacy Policy</router-link>
      </div>
      <p>&copy; {{ new Date().getFullYear() }} AI Journal. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { 
  Sparkles, Zap, Search, BrainCircuit, Database, 
  Clock, Moon, Cpu, Calendar, Image as ImageIcon, Layers,
  ListTodo, EyeOff, Newspaper, UserCircle 
} from 'lucide-vue-next'
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
