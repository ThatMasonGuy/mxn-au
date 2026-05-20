<template>
    <section id="terminal" class="relative w-full overflow-visible px-4 py-28 text-white sm:px-6">
        <div class="mx-auto flex w-full max-w-6xl flex-col gap-10">
            <div class="max-w-3xl">
                <div
                    class="mb-5 inline-flex items-center gap-2 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-cyan-200">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]"></span>
                    mxn-shell
                </div>

                <h2
                    class="text-4xl font-extrabold tracking-normal text-white sm:text-5xl lg:text-6xl">
                    Terminal, but current this time.
                </h2>

                <p class="mt-5 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                    The home prompt now knows about the current MXN.au projects, including the real SSH terminal living
                    under <span class="font-mono text-cyan-200">/server</span>.
                </p>
            </div>

            <div class="relative z-20 w-full overflow-visible">
                <div
                    class="absolute -inset-px rounded-lg bg-gradient-to-r from-emerald-400/30 via-cyan-400/25 to-violet-400/30 blur-lg"></div>

                <div
                    class="relative overflow-visible rounded-lg border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <div
                        class="flex flex-col gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex gap-1.5" aria-hidden="true">
                                <span class="h-3 w-3 rounded-full bg-rose-400/90"></span>
                                <span class="h-3 w-3 rounded-full bg-amber-300/90"></span>
                                <span class="h-3 w-3 rounded-full bg-emerald-300/90"></span>
                            </div>

                            <div class="font-mono text-sm text-white/80">
                                mason@mxn.au:<span class="text-cyan-300">~</span>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
                            <span class="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-emerald-200">
                                Vue 3
                            </span>
                            <span class="rounded border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-cyan-200">
                                Vite 7
                            </span>
                            <span class="rounded border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-violet-200">
                                xterm in /server
                            </span>
                        </div>
                    </div>

                    <div
                        ref="output"
                        class="terminal-output custom-scrollbar min-h-[320px] max-h-[420px] overflow-y-auto px-4 py-5 font-mono text-sm leading-6 text-emerald-100/85 sm:px-6">
                        <div v-if="showHelpPrompt" class="terminal-output-line terminal-output-line--system">
                            MXN shell ready.
                            Run help, projects, stack, or open server.
                        </div>
                    </div>

                    <div class="relative border-t border-white/10 p-4 sm:p-5">
                        <form class="relative overflow-visible" @submit.prevent="handleCommand">
                            <div
                                class="flex min-h-12 items-center gap-3 rounded-md border border-cyan-400/25 bg-black/45 px-4 py-3 font-mono shadow-inner shadow-cyan-950/30 transition-colors focus-within:border-cyan-300/60">
                                <span class="shrink-0 text-cyan-300">$</span>
                                <input
                                    v-model="command"
                                    @keydown.enter.prevent="handleCommand"
                                    @input="handleInput"
                                    @keydown.space="handleSpace"
                                    @keydown.tab.prevent="applySelectedSuggestion"
                                    @keydown.arrow-down.prevent="navigateAutocomplete(1)"
                                    @keydown.arrow-up.prevent="navigateAutocomplete(-1)"
                                    type="text"
                                    autocomplete="off"
                                    autocapitalize="off"
                                    spellcheck="false"
                                    :placeholder="isFocused ? '' : 'help, open server, stack'"
                                    @focus="isFocused = true"
                                    @blur="isFocused = false"
                                    class="min-w-0 flex-1 bg-transparent text-base text-emerald-100 caret-cyan-300 outline-none placeholder:text-white/30" />
                            </div>

                            <div
                                v-if="suggestions.length"
                                class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[80] max-h-64 overflow-y-auto rounded-lg border border-cyan-400/25 bg-slate-950/98 p-1 font-mono shadow-2xl shadow-black/50 backdrop-blur-xl">
                                <button
                                    v-for="(suggestion, index) in suggestions"
                                    :key="suggestion"
                                    type="button"
                                    @mousedown.prevent="applySuggestion(suggestion)"
                                    :class="[
                                        'block w-full rounded-md px-3 py-2.5 text-left transition-colors',
                                        selectedIndex === index
                                            ? 'bg-cyan-400/15 text-cyan-100'
                                            : 'text-emerald-100/80 hover:bg-white/5 hover:text-white'
                                    ]">
                                    <span class="block text-sm">{{ suggestion }}</span>
                                    <span
                                        v-if="describeSuggestion(suggestion)"
                                        class="mt-0.5 block truncate text-xs text-white/45">
                                        {{ describeSuggestion(suggestion) }}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTerminal } from '@/shared/utils/useTerminal.js'

const router = useRouter()

const {
    output,
    command,
    suggestions,
    selectedIndex,
    showHelpPrompt,
    handleCommand,
    handleInput,
    handleSpace,
    navigateAutocomplete,
    applySuggestion,
    applySelectedSuggestion,
    describeSuggestion
} = useTerminal({
    navigate: path => router.push(path)
})

const isFocused = ref(false)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.85);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(34, 211, 238, 0.25);
    border-radius: 999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(34, 211, 238, 0.45);
}

.terminal-output-line {
    white-space: pre-wrap;
}

:deep(.terminal-output-line) {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.65;
}

:deep(.terminal-output-line + .terminal-output-line) {
    margin-top: 0.75rem;
}

:deep(.terminal-output-line--prompt) {
    color: rgba(103, 232, 249, 0.95);
}

:deep(.terminal-output-line--success) {
    color: rgba(110, 231, 183, 0.95);
}

:deep(.terminal-output-line--error) {
    color: rgba(251, 113, 133, 0.95);
}

.terminal-output-line--system {
    color: rgba(167, 243, 208, 0.9);
}
</style>
