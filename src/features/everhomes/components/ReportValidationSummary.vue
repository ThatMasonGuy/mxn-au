<template>
  <div v-if="readiness.blocked" class="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-rose-100">
    <p class="text-sm font-bold">Cannot submit yet</p>
    <div role="status" aria-live="polite" class="mt-1 space-y-1 text-xs leading-5">
      <p v-if="readiness.missingAnswerCount">{{ readiness.missingAnswerCount }} required answer{{ readiness.missingAnswerCount === 1 ? ' is' : 's are' }} missing.</p>
      <p v-if="readiness.waitingForUploads">Photos are uploading. Wait for uploads to finish before submitting.</p>
      <p v-if="readiness.offline">You’re offline. Reconnect before submitting.</p>
      <p v-if="readiness.issues.some(issue => issue.kind !== 'answer')">Retry or remove failed photos before submitting.</p>
    </div>
    <template v-if="readiness.issues.length">
      <p class="mt-2 text-xs leading-5">Go to an item below to fix it. Required questions will be highlighted.</p>
      <button type="button" @click="emit('go-to', readiness.issues[0])" class="mt-2 w-full rounded-lg border border-rose-300/40 px-3 py-2.5 text-left text-xs font-bold leading-5 hover:bg-rose-400/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200">
        Go to {{ readiness.issues[0].label }} <span aria-hidden="true">→</span>
      </button>
      <details v-if="readiness.issues.length > 1" class="mt-2 text-xs">
        <summary class="cursor-pointer rounded-lg py-2 font-bold focus-visible:outline-2 focus-visible:outline-rose-200">Show {{ readiness.issues.length - 1 }} more item{{ readiness.issues.length === 2 ? '' : 's' }} to fix</summary>
        <ul class="mt-1 space-y-2">
          <li v-for="(issue, index) in readiness.issues.slice(1)" :key="index">
            <button type="button" @click="emit('go-to', issue)" class="w-full rounded-lg border border-rose-300/30 px-3 py-2.5 text-left leading-5 hover:bg-rose-400/15 focus-visible:outline-2 focus-visible:outline-rose-200">Go to {{ issue.label }} <span aria-hidden="true">→</span></button>
          </li>
        </ul>
      </details>
    </template>
  </div>
</template>

<script setup>
defineProps({ readiness: { type: Object, required: true } })
const emit = defineEmits(['go-to'])
</script>
