<template>
  <main class="translate-page">
    <div class="translate-wrap">
      <header class="page-nav">
        <RouterLink to="/" class="wordmark"><Languages :size="21" /> MXN <span>/ translate</span></RouterLink>
        <nav aria-label="Translation navigation">
          <RouterLink to="/translate/usage">Usage</RouterLink>
          <SettingsPopover />
        </nav>
      </header>
      <section class="page-intro">
        <p class="eyebrow">LESS LOST IN TRANSLATION</p>
        <h1>Say it your way.<br /><span>In another language.</span></h1>
        <p>A little more context. A lot less guesswork.</p>
      </section>
      <TranslationPanel />
      <details class="history-section">
        <summary><History :size="16" /> Recent translations <span>{{ store.history.length }}</span><ChevronDown :size="16" class="history-chevron" /></summary>
        <div class="history-content"><HistoryPanel /></div>
      </details>
      <footer>Built by Mason <span>Context across languages.</span></footer>
    </div>
  </main>
</template>

<script setup>
import { Languages, History, ChevronDown } from '@lucide/vue'
import { useTranslateStore } from '@/features/translate/stores/useTranslateStore'
import TranslationPanel from '@/features/translate/components/TranslationPanel.vue'
import SettingsPopover from '@/features/translate/components/SettingsPopover.vue'
import HistoryPanel from '@/features/translate/components/HistoryPanel.vue'
const store = useTranslateStore()
</script>

<style scoped>
.translate-page { background: #111715; color: #edf2ee; min-height: 100vh; font-family: inherit; }
.translate-wrap { width: min(1120px, 100% - 64px); margin: auto; }
.page-nav { display:flex; align-items:center; justify-content:space-between; padding:28px 0; border-bottom:1px solid #ffffff12; }
.wordmark { display:flex; align-items:center; gap:10px; font-size:15px; font-weight:750; letter-spacing:.04em; text-decoration:none; color:#edf2ee; }
.wordmark svg { color:#c6e5af; }
.wordmark span { color:#8b9a91; font-weight:400; letter-spacing:0; }
nav { display:flex; align-items:center; gap:24px; font-size:13px; color:#aab7af; }
nav a:hover { color:#edf2ee; }
.page-intro { padding:58px 0 32px; }
.eyebrow { font-size:10px; letter-spacing:.2em; color:#c6e5af; font-weight:650; margin:0 0 20px; }
h1 { font-size:clamp(32px,4.2vw,51px); line-height:1.12; letter-spacing:-.045em; font-weight:600; margin:0; }
h1 span { color:#a3b3a9; }
.page-intro > p:last-child { color:#9aaba0; font-size:14px; margin:20px 0 0; }
.history-section { margin-top:26px; border:1px solid #ffffff15; border-radius:14px; background:#161e1a; }
summary { list-style:none; display:flex; align-items:center; gap:10px; padding:18px 22px; cursor:pointer; font-size:13px; color:#c0cdc3; }
summary::-webkit-details-marker { display:none; }
summary span { font-size:11px; color:#8fa196; }
.history-chevron { margin-left:auto; }
details[open] .history-chevron { transform:rotate(180deg); }
.history-content { padding:0 20px 20px; max-height:480px; overflow:auto; }
footer { display:flex; justify-content:space-between; padding:25px 0 35px; color:#6e8275; font-size:11px; }
@media(max-width:600px) { .translate-wrap { width:calc(100% - 32px); } .page-nav { padding:20px 0; } nav { gap:16px; } .page-intro { padding:36px 0 26px; } footer span { display:none; } }
</style>
