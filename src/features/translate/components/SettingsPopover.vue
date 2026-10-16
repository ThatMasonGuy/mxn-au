<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child><button class="settings-trigger" aria-label="Open translation settings"><Settings :size="16" /><span>Settings</span></button></PopoverTrigger>
    <PopoverContent align="end" :side-offset="12" class="translation-settings">
      <header><h2>Translation settings</h2><button @click="open = false" aria-label="Close settings"><X :size="17" /></button></header>
      <section>
        <h3>Translation engine</h3>
        <div class="engine-options">
          <button v-for="engine in engines" :key="engine.value" :aria-pressed="store.selectedModel === engine.value" :disabled="store.isTranslating" @click="store.selectedModel = engine.value"><span>{{ engine.name }}</span><small>{{ engine.description }}</small></button>
        </div>
        <p>{{ store.selectedModel === 'openai' ? 'Contextual translation with a back-translation check.' : 'Specialist translation. Unsupported language pairs use OpenAI.' }}</p>
      </section>
      <section class="preferences">
        <label><span>Copy translation automatically<small>Copy the result to your clipboard</small></span><input type="checkbox" v-model="store.autoCopy" /></label>
        <label><span>Sync history<small>Save history across devices when signed in</small></span><input type="checkbox" v-model="store.syncHistory" /></label>
      </section>
      <details>
        <summary>Use your own OpenAI key <ChevronDown :size="14" /></summary>
        <p>Leave blank to use shared translation while signed in. Your own key is optional, billed to your OpenAI account, and held only for this session.</p>
        <label for="translation-api-key" class="key-label">OpenAI API key</label>
        <div class="key-input"><input id="translation-api-key" v-model="store.apiKey" :type="store.showApiKey ? 'text' : 'password'" placeholder="sk-…" autocomplete="off" spellcheck="false" :disabled="store.isTranslating" /><button @click="store.toggleShowApiKey()">{{ store.showApiKey ? 'Hide' : 'Show' }}</button></div>
        <button class="clear-key" @click="store.apiKey = ''" :disabled="store.isTranslating">Clear key</button>
      </details>
      <RouterLink v-if="!main.user" to="/login" class="login-link" @click="open = false">Sign in for shared translation <ArrowRight :size="14" /></RouterLink>
    </PopoverContent>
  </Popover>
</template>

<script setup>
import { ref } from 'vue'
import { Settings, X, ChevronDown, ArrowRight } from '@lucide/vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useTranslateStore } from '@/features/translate/stores/useTranslateStore'
import { useMainStore } from '@/shared/stores/useMainStore'
const store = useTranslateStore()
const main = useMainStore()
const open = ref(false)
const engines = [{ value: 'openai', name: 'GPT-6 Luna', description: 'Context & nuance' }, { value: 'deepl', name: 'DeepL', description: 'Specialist translation' }]
</script>

<style scoped>
.settings-trigger { display:flex; align-items:center; gap:7px; color:#bfcec2; padding:8px 0; cursor:pointer; font-size:13px; }
:global(.translation-settings) { width:min(380px, calc(100vw - 32px)); background:#1b251e; color:#edf2ee; border:1px solid #405045; border-radius:14px; padding:22px; box-shadow:0 16px 50px #0005; max-height:80vh; overflow:auto; }
header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
h2 { font-weight:600; font-size:16px; }
h3 { font-size:12px; color:#b8c9bd; margin:0 0 10px; }
section { margin-bottom:22px; }
p { font-size:11px; line-height:1.7; color:#95ab9c; margin:12px 0; }
button { cursor:pointer; }
button:disabled { opacity:.5; cursor:default; }
.engine-options { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.engine-options button { border:1px solid #405045; background:#202e24; border-radius:9px; padding:12px; text-align:left; }
.engine-options button[aria-pressed=true] { border-color:#c6e5af; background:#2d3c2b; }
.engine-options span { display:block; font-size:13px; font-weight:550; }
small { display:block; color:#92a898; font-size:10px; margin-top:5px; }
.preferences { border-block:1px solid #ffffff12; padding:16px 0; }
.preferences label { display:flex; justify-content:space-between; align-items:center; gap:14px; font-size:12px; margin-bottom:18px; cursor:pointer; }
.preferences label:last-child { margin-bottom:0; }
input[type=checkbox] { accent-color:#c6e5af; width:16px; height:16px; flex-shrink:0; }
summary { display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#b7cbbb; cursor:pointer; list-style:none; }
summary::-webkit-details-marker { display:none; }
.key-label { font-size:11px; color:#9fb5a5; }
.key-input { display:flex; align-items:center; gap:8px; margin-top:7px; }
.key-input input { min-width:0; width:100%; background:#121c15; border:1px solid #405045; border-radius:6px; padding:9px; color:#edf2ee; font-size:12px; }
.key-input button,.clear-key { font-size:11px; color:#baccbd; }
.clear-key { margin-top:10px; text-decoration:underline; }
.login-link { margin-top:22px; display:flex; gap:10px; align-items:center; color:#c6e5af; font-size:12px; }
button:focus-visible,summary:focus-visible,input:focus-visible { outline:2px solid #c6e5af; outline-offset:3px; }
@media(max-width:400px) { .settings-trigger span { display:none; } }
</style>
