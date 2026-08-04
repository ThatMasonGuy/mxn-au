<template>
  <main class="min-h-screen bg-black px-5 py-20 text-white">
    <section class="mx-auto max-w-2xl">
      <router-link to="/" class="text-sm text-zinc-400 transition hover:text-white">
        &larr; MXN.au
      </router-link>

      <h1 class="mt-8 text-4xl font-black tracking-tight">Analytics &amp; privacy</h1>
      <p class="mt-3 text-lg leading-8 text-zinc-300">
        MXN uses required service records and optional Google Analytics. Your data is not sold and MXN does not run ads.
      </p>

      <div class="mt-10 space-y-4">
        <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="font-semibold">Required records</h2>
              <p class="mt-1 text-sm leading-6 text-zinc-400">
                MXN records what it needs to run features, save requested data, diagnose failures, and protect the site. This includes Firebase, Cloudflare, and required Everhomes records. These stay on.
              </p>
            </div>
            <span class="shrink-0 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              Always on
            </span>
          </div>
        </article>

        <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="font-semibold">Google Analytics</h2>
              <p class="mt-1 text-sm leading-6 text-zinc-400">
                Shows which pages and tools are useful, how people find MXN, and whether the site is improving. It starts only when you allow it.
              </p>
            </div>

            <span
              class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
              :class="enabled ? 'bg-blue-400/15 text-blue-300' : 'bg-zinc-400/15 text-zinc-300'"
            >
              {{ enabled ? 'On' : 'Off' }}
            </span>
          </div>

          <div class="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-default disabled:opacity-50"
              :disabled="enabled"
              @click="saveChoice(true)"
            >
              Turn on
            </button>
            <button
              type="button"
              class="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 disabled:cursor-default disabled:opacity-50"
              :disabled="choiceMade && !enabled"
              @click="saveChoice(false)"
            >
              Turn off
            </button>
          </div>
        </article>

        <article class="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-zinc-300">
          <h2 class="font-semibold text-white">What optional analytics records</h2>
          <ul class="mt-2 list-disc space-y-1 pl-5 text-zinc-400">
            <li>The page and tool being used.</li>
            <li>Browser, device, referrer, and approximate location information.</li>
            <li>Successful login or signup and the method used.</li>
          </ul>
          <p class="mt-3 text-zinc-400">
            MXN does not send Google names, email addresses, form contents, access keys, report details, raw errors, or MXN account IDs. Advertising features and Google Signals are off. GA4 retains event and user data for 14 months.
          </p>
          <p class="mt-3 text-zinc-400">
            This choice is saved in this browser and can be changed here at any time. See
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-300 underline decoration-blue-300/40 underline-offset-4 hover:text-blue-200"
            >Google's Privacy Policy</a>.
          </p>
        </article>
      </div>

      <p v-if="saved" class="mt-5 text-sm text-emerald-300" role="status">Your choice was saved.</p>
      <p class="mt-6 text-sm text-zinc-500">
        Privacy questions: <a href="mailto:legal@mxn.au" class="text-zinc-300 underline underline-offset-4 hover:text-white">legal@mxn.au</a>
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  getOptionalAnalyticsPreference,
  setOptionalAnalyticsEnabled,
  trackPageView,
} from '@/shared/analytics/analytics'

const route = useRoute()
const initialPreference = getOptionalAnalyticsPreference()
const choiceMade = ref(initialPreference.choiceMade)
const enabled = ref(initialPreference.enabled)
const saved = ref(false)

async function saveChoice(allowAnalytics) {
  enabled.value = await setOptionalAnalyticsEnabled(allowAnalytics)
  choiceMade.value = true
  saved.value = true

  if (enabled.value) await trackPageView(route)
}
</script>
