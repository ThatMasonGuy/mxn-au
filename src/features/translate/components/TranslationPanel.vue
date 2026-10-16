<template>
  <section class="translator" aria-label="Translator">
    <div class="translator-toolbar">
      <span class="engine"><span class="status-dot" /> {{ store.selectedModel === 'deepl' ? 'DeepL' : 'GPT-6 Luna' }}</span>
      <span class="toolbar-hint">{{ store.isTranslating ? 'Working on your translation…' : 'Made for the way you actually talk' }}</span>
    </div>
    <p v-if="showDeeplWarning" class="notice">This language pair uses OpenAI because DeepL doesn’t support it.</p>
    <div class="editors">
      <section v-for="side in sides" :key="side.key" class="editor" :class="{ destination: lastResult?.dest === side.key && lastResult?.ok }">
        <div class="editor-header">
          <label :for="`${side.key}-language`">{{ side.key === 'left' ? 'First language' : 'Second language' }}</label>
          <select :id="`${side.key}-language`" v-model="store[side.language]" :disabled="store.isTranslating" :aria-label="side.key === 'left' ? 'First language' : 'Second language'">
            <option v-for="lang in store.languages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
          </select>
        </div>
        <textarea :id="`${side.key}-text`" v-model="store[side.text]" :aria-label="`${store[side.name]} text`"
          :placeholder="side.key === 'left' ? 'Type or paste something here…' : 'Your translation will appear here…'"
          :readonly="store.isTranslating" maxlength="6000" @keydown.enter.ctrl.prevent="onTranslate(side.key)" @keydown.enter.meta.prevent="onTranslate(side.key)" />
        <div class="editor-actions">
          <span class="char-count">{{ store[side.text].length.toLocaleString() }} / 6,000</span>
          <button class="icon-button" :disabled="!store[side.text] || store.isTranslating" @click="clearSide(side)" :aria-label="`Clear ${store[side.name]} text`" title="Clear text"><X :size="15" /></button>
          <button class="copy-button" :disabled="!store[side.text]" @click="store.copyToClipboard(store[side.text])"><Copy :size="14" /> Copy</button>
        </div>
        <button class="translate-button" :class="{ secondary: side.key === 'right' }" :disabled="!store[side.canTranslate]" @click="onTranslate(side.key)">
          <LoaderCircle v-if="store.isTranslating && store.lastTranslationDirection === side.key" :size="16" class="spinner" />
          <ArrowRight v-else :size="16" />
          {{ store.isTranslating && store.lastTranslationDirection === side.key ? 'Translating…' : `Translate to ${side.key === 'left' ? store.rightLanguageName : store.leftLanguageName}` }}
        </button>
      </section>
    </div>
    <div class="translation-status" aria-live="polite" role="status">
      <template v-if="store.isTranslating"><LoaderCircle :size="14" class="spinner" /> Translating and checking the wording… <button @click="store.forceResetTranslator()">Cancel</button></template>
      <template v-else-if="store.translationError"><span class="error-text">{{ store.translationError }}</span></template>
      <template v-else-if="lastResult?.ok"><Check :size="14" /> {{ lastResult.cached ? 'Loaded from saved translation' : 'Translation ready' }} <span class="status-time">{{ (lastResult.apiTimeMs / 1000).toFixed(1) }}s</span><button v-if="store.lastCacheId" @click="markBad"><ThumbsDown :size="13" /> Report translation</button></template>
      <template v-else><CornerDownLeft :size="14" /> Ctrl / ⌘ + Enter to translate <span class="status-time">Enter for a new line</span></template>
    </div>
    <details v-if="store.retranslatedText || store.isRetranslating" class="back-translation">
      <summary><RotateCcw :size="15" /> Back-translation check <span>{{ store.isRetranslating ? 'Checking…' : `${store.accuracyPercentage}% wording similarity` }}</span><ChevronDown :size="15" /></summary>
      <div class="back-content"><p>{{ store.retranslatedText || 'Checking the translated wording…' }}</p><small>Translated back to {{ store.retranslationTargetLanguageName }} for comparison. Wording similarity is a guide, not a measure of translation quality.</small></div>
    </details>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowRight, X, Copy, LoaderCircle, CornerDownLeft, RotateCcw, ChevronDown, Check, ThumbsDown } from '@lucide/vue'
import { useTranslateStore } from '@/features/translate/stores/useTranslateStore'
const store = useTranslateStore()
const lastResult = ref(null)
const sides = [
  { key: 'left', text: 'leftText', language: 'fromLanguage', name: 'leftLanguageName', canTranslate: 'canTranslateLeft' },
  { key: 'right', text: 'rightText', language: 'selectedLanguage', name: 'rightLanguageName', canTranslate: 'canTranslateRight' },
]
const onTranslate = async side => {
  lastResult.value = null
  const result = await store.translate(side)
  if (!result?.skipped) lastResult.value = { ...result, dest: side === 'left' ? 'right' : 'left' }
}
const clearSide = side => { store[side.text] = ''; lastResult.value = null; store.translationError = '' }
const markBad = async () => { if ((await store.markTranslationBad()).ok) lastResult.value = null }
const supported = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh', 'ru', 'tr', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'cs', 'hu']
const showDeeplWarning = computed(() => store.selectedModel === 'deepl' && (!supported.includes(store.fromLanguage) || !supported.includes(store.selectedLanguage)))
</script>

<style scoped>
.translator { border:1px solid #344139; border-radius:18px; background:#19221d; overflow:hidden; box-shadow:0 18px 60px #00000018; }
.translator-toolbar { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:17px 24px; border-bottom:1px solid #ffffff12; }
.engine { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:600; color:#d6e6d9; }
.status-dot { width:6px; height:6px; border-radius:50%; background:#c6e5af; }
.toolbar-hint { color:#859b8d; font-size:11px; }
.editors { display:grid; grid-template-columns:minmax(0,1fr) minmax(0,1fr); }
.editor { padding:24px; min-width:0; }
.editor + .editor { border-left:1px solid #ffffff12; background:#1c2720; }
.editor-header { display:flex; flex-direction:column; gap:7px; }
.editor-header label { font-size:10px; letter-spacing:.08em; text-transform:uppercase; color:#889e90; }
select { color:#edf2ee; background:#25322a; border:1px solid #ffffff12; border-radius:8px; padding:8px 10px; font-size:14px; width:100%; max-width:235px; cursor:pointer; }
option { background:#1c2720; color:#edf2ee; }
textarea { width:100%; height:240px; display:block; resize:vertical; min-height:160px; max-height:600px; padding:23px 0 12px; background:transparent; color:#f1f5f0; font-size:18px; line-height:1.65; border:0; outline:none; }
textarea::placeholder { color:#6f8476; }
textarea:focus-visible { box-shadow:inset 0 -2px #c6e5af; }
.editor-actions { display:flex; align-items:center; gap:12px; padding:8px 0 20px; }
.char-count { color:#809588; font-size:10px; margin-right:auto; font-variant-numeric:tabular-nums; }
button { cursor:pointer; }
button:disabled { opacity:.4; cursor:default; }
.copy-button,.icon-button { display:flex; align-items:center; gap:6px; color:#b9c9bc; font-size:12px; padding:4px; }
button:focus-visible,select:focus-visible,summary:focus-visible { outline:2px solid #c6e5af; outline-offset:4px; }
.translate-button { display:flex; align-items:center; justify-content:center; gap:9px; width:100%; padding:13px 16px; border-radius:9px; background:#c6e5af; color:#1b2c1c; font-size:13px; font-weight:650; }
.translate-button:hover:not(:disabled) { background:#d6f1c3; }
.translate-button.secondary { background:#2a3a2f; border:1px solid #4a6050; color:#dce9df; }
.translate-button.secondary:hover:not(:disabled) { background:#344a3a; }
.translation-status { display:flex; flex-wrap:wrap; align-items:center; gap:8px; min-height:48px; padding:12px 24px; border-top:1px solid #ffffff12; color:#9caf9f; font-size:11px; }
.translation-status button { margin-left:auto; display:flex; align-items:center; gap:5px; color:#c6d9c9; text-decoration:underline; text-underline-offset:3px; }
.status-time { color:#718878; margin-left:auto; }
.error-text { color:#ffb9a9; }
.notice { color:#ead69b; padding:14px 24px; font-size:12px; }
.back-translation { border-top:1px solid #ffffff12; }
summary { display:flex; align-items:center; flex-wrap:wrap; gap:9px; padding:17px 24px; cursor:pointer; list-style:none; font-size:12px; color:#c1d0c5; }
summary::-webkit-details-marker { display:none; }
summary span { margin-left:auto; color:#8fa796; font-size:11px; }
.back-content { padding:0 24px 22px; }
.back-content p { white-space:pre-wrap; overflow-wrap:anywhere; font-size:14px; line-height:1.7; color:#dce6df; margin:0 0 14px; }
.back-content small { color:#83998b; font-size:11px; }
.spinner { animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
@media(prefers-reduced-motion:reduce) { .spinner { animation:none; } }
@media(max-width:650px) { .toolbar-hint { display:none; } .translator-toolbar { padding:15px 18px; } .editors { grid-template-columns:minmax(0,1fr); } .editor { padding:20px 18px; } .editor + .editor { border-left:0; border-top:1px solid #ffffff12; } textarea { height:180px; font-size:16px; } .translation-status { padding:14px 18px; } summary { padding:17px 18px; } summary span { margin-left:0; } }
</style>
