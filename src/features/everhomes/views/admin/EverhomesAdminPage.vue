<template>
    <LayoutComponent
        :header="true"
        :footer="true"
        :background="false"
        bg-style="linear-gradient(160deg, #101c2e 0%, #0b1525 48%, #070f1d 100%)"
    >
        <main class="relative min-h-screen overflow-hidden bg-[#0b1525]">
            <!-- Background -->
            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div
                    class="absolute inset-0"
                    style="background: linear-gradient(160deg, #101c2e 0%, #0b1525 48%, #070f1d 100%);"
                />

                <div
                    class="absolute inset-0 opacity-70"
                    style="background-image: radial-gradient(circle, rgba(148, 163, 184, 0.14) 1px, transparent 1px); background-size: 28px 28px;"
                />

                <div class="absolute left-1/2 top-16 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div class="absolute right-[-12rem] top-80 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
                <div class="absolute bottom-0 left-[-10rem] h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
            </div>

            <div class="relative mx-auto max-w-7xl px-3 pb-24 pt-24 sm:px-6 sm:pt-28 lg:px-8">
                <!-- Hero -->
                <section class="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 p-5 shadow-xl shadow-black/20 backdrop-blur sm:p-7">
                    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(430px,0.8fr)] lg:items-center">
                        <div class="min-w-0">
                            <div class="mb-3 flex max-w-full items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
                                <ShieldCheck class="h-3.5 w-3.5 shrink-0" />
                                <span class="truncate">Site Admin</span>
                            </div>

                            <h1 class="max-w-full text-[1.75rem] font-bold tracking-tight text-white sm:text-4xl">
                                Everhomes <span class="text-teal-300">Admin</span>
                            </h1>

                            <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                Manage report submissions, tool activity and SDA pricing data.
                            </p>

                            <div v-if="activeTab === 'submissions'" class="mt-5 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    @click="loadSubmissions"
                                    :disabled="loading"
                                    class="inline-flex items-center gap-2 rounded-lg border border-teal-400/25 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200 transition hover:border-teal-300/50 hover:bg-teal-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw class="h-4 w-4" :class="loading ? 'animate-spin' : ''" />
                                    Refresh submissions
                                </button>

                                <p class="text-xs font-medium text-slate-500">
                                    Loaded {{ allSubmissions.length }} submission{{ allSubmissions.length === 1 ? '' : 's' }}
                                </p>
                            </div>
                        </div>

                        <aside class="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-4">
                            <div class="flex items-center justify-between gap-5">
                                <div>
                                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        System pulse
                                    </p>
                                    <p class="mt-1 text-sm font-medium text-slate-300">
                                        Current submission state
                                    </p>
                                </div>

                                <div class="shrink-0 text-right">
                                    <p class="text-3xl font-bold leading-none text-white tabular-nums">
                                        {{ submissionTotal }}
                                    </p>
                                    <p class="mt-1 text-[11px] font-medium text-slate-500">submissions</p>
                                </div>
                            </div>

                            <div class="mt-4 flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]" aria-hidden="true">
                                <span
                                    v-for="stat in stats"
                                    :key="stat.label"
                                    class="h-full transition-[width]"
                                    :style="{ width: `${stat.percentage}%`, backgroundColor: stat.color }"
                                />
                            </div>

                            <dl class="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                                <div v-for="stat in stats" :key="stat.label" class="flex items-center gap-2">
                                    <span class="h-2 w-2 shrink-0 rounded-full" :style="{ backgroundColor: stat.color }" />
                                    <dt class="min-w-0 truncate text-xs text-slate-500">{{ stat.label }}</dt>
                                    <dd class="ml-auto text-sm font-bold text-slate-200 tabular-nums">{{ stat.value }}</dd>
                                </div>
                            </dl>
                        </aside>
                    </div>
                </section>

                <!-- Tabs -->
                <section class="mb-6 border-b border-white/10">
                    <div class="flex w-full sm:w-fit">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            type="button"
                            @click="activeTab = tab.id"
                            class="-mb-px flex min-w-0 flex-1 items-center justify-center gap-1 border-b-2 px-2 py-3 text-sm font-semibold transition sm:flex-none sm:gap-2 sm:px-4"
                            :class="activeTab === tab.id
                                ? 'border-teal-400 text-teal-200'
                                : 'border-transparent text-slate-500 hover:border-white/20 hover:text-slate-200'"
                        >
                            <component :is="tab.icon" class="hidden h-4 w-4 shrink-0 sm:block" />
                            <span class="truncate">{{ tab.label }}</span>
                            <span
                                v-if="tab.id === 'submissions' && allSubmissions.length"
                                class="ml-0.5 text-[11px] font-bold leading-none tabular-nums"
                                :class="activeTab === 'submissions' ? 'text-teal-300' : 'text-slate-600'"
                            >
                                ({{ allSubmissions.length }})
                            </span>
                        </button>
                    </div>
                </section>

                <!-- Submissions tab -->
                <section v-if="activeTab === 'submissions'" class="rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:p-5">
                    <!-- Filter bar -->
                    <div class="mb-5 flex flex-col gap-5 border-b border-white/[0.07] pb-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                                Submission queue
                            </p>
                            <h2 class="mt-1 text-xl font-bold text-white">
                                Report history
                            </h2>
                        </div>

                        <div class="grid gap-4 sm:grid-cols-2 lg:flex lg:items-end">
                            <fieldset>
                                <legend class="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Report type</legend>
                                <div class="flex flex-wrap gap-1.5">
                                <button
                                    v-for="f in typeFilters"
                                    :key="f.id"
                                    type="button"
                                    @click="typeFilter = f.id"
                                    class="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition"
                                    :class="typeFilter === f.id
                                        ? 'border-teal-400/30 bg-teal-400/15 text-teal-200'
                                        : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-slate-200'"
                                >
                                    <component :is="f.icon" class="h-3.5 w-3.5" />
                                    {{ f.label }}
                                </button>
                                </div>
                            </fieldset>

                            <fieldset>
                                <legend class="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Status</legend>
                                <div class="flex flex-wrap gap-1.5">
                                <button
                                    v-for="s in statusFilters"
                                    :key="s.id"
                                    type="button"
                                    @click="statusFilter = s.id"
                                    class="rounded-md border px-3 py-1.5 text-[11px] font-bold transition"
                                    :class="statusFilter === s.id ? s.activeClass : 'border-white/10 bg-white/[0.04] text-slate-500 hover:border-white/20 hover:text-slate-300'"
                                >
                                    {{ s.label }}
                                </button>
                                </div>
                            </fieldset>
                        </div>
                    </div>


                    <!-- Loading state -->
                    <div v-if="loading" class="flex items-center justify-center gap-3 py-24 text-slate-500">
                        <Loader2 class="h-5 w-5 animate-spin text-cyan-300" />
                        <span class="text-sm">Loading submissions…</span>
                    </div>

                    <div v-else-if="submissionsError" class="rounded-lg border border-red-400/20 bg-red-500/10 px-5 py-8 text-center">
                        <XCircle class="mx-auto h-6 w-6 text-red-300" />
                        <p class="mt-3 font-semibold text-red-100">Could not load submissions</p>
                        <p class="mt-1 text-sm text-red-200/80">{{ submissionsError }}</p>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="!filteredSubmissions.length" class="border-y border-white/10 py-20 text-center">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                            <Inbox class="h-5 w-5 text-slate-500" />
                        </div>
                        <p class="font-semibold text-slate-300">
                            No submissions found
                        </p>
                        <p class="mt-1 text-sm text-slate-600">
                            Try changing the report type or status filters.
                        </p>
                    </div>

                    <!-- Submissions list -->
                    <div v-else class="space-y-3">
                        <article
                            v-for="sub in visibleSubmissions"
                            :key="sub.id"
                            class="group relative overflow-visible rounded-lg border border-white/10 bg-slate-950/35 p-3 pt-4 transition hover:border-white/20 hover:bg-white/[0.055]"
                        >
                            <!-- Decorative clipped layer only -->
                            <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
                                <div
                                    class="absolute inset-x-0 top-0 h-1"
                                    :style="{
                                        background:
                                            sub.collection === 'inspections'
                                                ? 'linear-gradient(to right, rgba(20,184,166,0.85), rgba(20,184,166,0.12))'
                                                : 'linear-gradient(to right, rgba(6,182,212,0.85), rgba(6,182,212,0.12))'
                                    }"
                                />
                            </div>

                            <div class="relative z-10 px-1 pb-1 sm:px-2 sm:pb-2">
                                <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div class="flex min-w-0 gap-3 sm:gap-4">
                                        <div
                                            class="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border sm:flex"
                                            :style="{ background: sub.collection === 'inspections' ? 'rgba(20,184,166,0.12)' : 'rgba(6,182,212,0.12)', borderColor: sub.collection === 'inspections' ? 'rgba(20,184,166,0.24)' : 'rgba(6,182,212,0.24)' }"
                                        >
                                            <component
                                                :is="sub.collection === 'inspections' ? ClipboardCheck : ClipboardList"
                                                class="h-5 w-5"
                                                :style="{ color: sub.collection === 'inspections' ? '#14b8a6' : '#06b6d4' }"
                                            />
                                        </div>

                                        <div class="min-w-0 flex-1">
                                            <div class="mb-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    class="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest"
                                                    :style="sub.collection === 'inspections' ? 'background: rgba(20,184,166,0.12); color: #5eead4; border: 1px solid rgba(20,184,166,0.2)' : 'background: rgba(6,182,212,0.12); color: #67e8f9; border: 1px solid rgba(6,182,212,0.2)'"
                                                >
                                                    {{ sub.collection === 'inspections' ? 'Inspection' : 'Handover' }}
                                                </span>
                                                <StatusBadge :status="sub.status" />
                                            </div>

                                            <p class="truncate text-base font-bold text-white">
                                                {{ sub.propertyAddress || 'Unknown Property' }}
                                            </p>

                                            <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                                <span v-if="sub.inspectorName" class="inline-flex items-center gap-1.5">
                                                    <User class="h-3.5 w-3.5" />
                                                    {{ sub.inspectorName }}
                                                </span>
                                                <span v-if="sub.inspectionDate" class="inline-flex items-center gap-1.5">
                                                    <Calendar class="h-3.5 w-3.5" />
                                                    {{ sub.inspectionDate }}
                                                </span>
                                                <span v-if="sub.createdAt" class="inline-flex items-center gap-1.5">
                                                    <Clock class="h-3.5 w-3.5" />
                                                    {{ sub.status === 'draft' ? 'Backup' : 'Submitted' }} {{ formatRelative(sub.draftUpdatedAt || sub.createdAt) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex flex-wrap items-center gap-2 lg:justify-end">
                                        <button
                                            v-if="['draft', 'failed'].includes(sub.status) && sub.draftAccessKey"
                                            type="button"
                                            @click="copyDraftRecoveryLink(sub)"
                                            class="inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-400/15"
                                        >
                                            <Link class="h-3.5 w-3.5" />
                                            {{ copiedDraftId === sub.id ? 'Link copied' : 'Copy recovery link' }}
                                        </button>

                                        <button
                                            v-if="['draft', 'failed'].includes(sub.status)"
                                            type="button"
                                            @click="triggerDelete(sub)"
                                            :disabled="deletingId === sub.id"
                                            class="inline-flex items-center gap-1.5 rounded-full border border-red-400/25 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-200 transition hover:border-red-300/50 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Loader2 v-if="deletingId === sub.id" class="h-3.5 w-3.5 animate-spin" />
                                            <Trash2 v-else class="h-3.5 w-3.5" />
                                            {{ deletingId === sub.id ? 'Deleting…' : 'Delete' }}
                                        </button>

                                        <a
                                            v-if="sub.pdfUrl"
                                            :href="sub.pdfUrl"
                                            target="_blank"
                                            rel="noopener"
                                            class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200"
                                        >
                                            <FileText class="h-3.5 w-3.5" />
                                            PDF
                                        </a>

                                        <a
                                            v-if="sub.photosDownloadUrl"
                                            :href="sub.photosDownloadUrl"
                                            target="_blank"
                                            rel="noopener"
                                            class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200"
                                        >
                                            <FolderArchive class="h-3.5 w-3.5" />
                                            Package
                                        </a>

                                        <button
                                            type="button"
                                            @click="openReportDetails(sub)"
                                            :disabled="deletingId === sub.id"
                                            class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-400/10 hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Loader2
                                                v-if="resendingId === sub.id || regenId === sub.id || ['preparing', 'restoring', 'generating'].includes(sub.regenerationPhase)"
                                                class="h-3.5 w-3.5 animate-spin"
                                            />
                                            <Activity v-else class="h-3.5 w-3.5" />
                                            {{ regenId === sub.id || ['preparing', 'restoring', 'generating'].includes(sub.regenerationPhase) ? 'Regenerating…' : resendingId === sub.id ? 'Sending…' : 'Details' }}
                                        </button>
                                    </div>
                                </div>

                                <div v-if="sub.status === 'failed' && sub.error" class="mt-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2.5">
                                    <AlertCircle class="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                                    <p class="text-xs leading-5 text-red-200">{{ sub.error }}</p>
                                </div>

                                <div v-if="sub.clearError" class="mt-3 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2.5">
                                    <AlertCircle class="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                                    <p class="text-xs leading-5 text-red-200">{{ sub.clearError }}</p>
                                </div>

                                <div v-if="sub.regenerationError" class="mt-3 flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
                                    <AlertTriangle class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                                    <div class="min-w-0 text-xs leading-5 text-amber-100">
                                        <p class="font-bold">Regeneration did not complete; the previous report is still active.</p>
                                        <p>{{ sub.regenerationError }}</p>
                                    </div>
                                </div>

                                <div v-if="sub.generationDeadlineWarning" class="mt-3 flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
                                    <Loader2 class="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-amber-300" />
                                    <p class="text-xs leading-5 text-amber-100">{{ sub.generationDeadlineWarning }}</p>
                                </div>

                                <div v-if="sub.emailFailures?.length" class="mt-3 flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
                                    <MailWarning class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                                    <div class="min-w-0 text-xs leading-5 text-amber-100">
                                        <p class="font-bold">Report generated, but some email delivery failed.</p>
                                        <p>{{ sub.emailFailures.map((failure) => failure.email || failure).join(', ') }}</p>
                                    </div>
                                </div>

                                <div v-if="sub.latestUploadFailure && sub.status !== 'complete'" class="mt-3 flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
                                    <AlertTriangle class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                                    <div class="min-w-0 text-xs leading-5 text-amber-100">
                                        <p class="font-bold">Latest image failure: {{ sub.latestUploadFailure.code }}</p>
                                        <p>{{ sub.latestUploadFailure.message }}</p>
                                        <p class="mt-1 text-[11px] text-amber-200/70">
                                            {{ sub.latestUploadFailure.fileName || 'unnamed file' }}
                                            <span v-if="sub.latestUploadFailure.attempts"> · {{ sub.latestUploadFailure.attempts }} attempt{{ sub.latestUploadFailure.attempts === 1 ? '' : 's' }}</span>
                                            <span v-if="sub.uploadFailureCount"> · {{ sub.uploadFailureCount }} recorded total</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <div class="flex flex-col items-center justify-center gap-2 pt-4 text-center">
                            <button
                                v-if="hasMoreSubmissions"
                                type="button"
                                @click="loadMoreSubmissions"
                                class="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200 transition hover:border-teal-300/50 hover:bg-teal-400/15"
                            >
                                Load more
                            </button>

                            <p
                                v-else
                                class="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-semibold text-slate-500"
                            >
                                No more submissions to load
                            </p>

                            <p class="text-[11px] font-medium text-slate-600">
                                Showing {{ visibleSubmissions.length }} of {{ filteredSubmissions.length }} matching submission{{ filteredSubmissions.length === 1 ? '' : 's' }}
                            </p>
                        </div>
                    </div>
                </section>

                <ToolUsageDashboard v-if="activeTab === 'usage'" />

                <!-- SDA Dataset tab -->
                <section v-if="activeTab === 'sda'" class="grid gap-6 lg:grid-cols-2">
                    <!-- Datasets list card -->
                    <article class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur sm:rounded-[2rem] sm:p-6">
                        <div class="mb-5 flex items-start justify-between gap-4 border-b border-white/[0.07] pb-5">
                            <div class="flex items-center gap-3">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10">
                                    <Database class="h-5 w-5 text-violet-300" />
                                </div>
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                                        Datasets
                                    </p>
                                    <h2 class="mt-1 text-lg font-bold text-white">
                                        SDA Pricing Datasets
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div v-if="sdaStore.loading" class="flex items-center gap-2 py-6 text-slate-500">
                            <Loader2 class="h-4 w-4 animate-spin text-violet-300" />
                            <span class="text-sm">Loading…</span>
                        </div>

                        <div v-else-if="sdaStore.availableYears.length" class="space-y-4">
                            <!-- Year pills -->
                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="year in sdaStore.availableYears"
                                    :key="year"
                                    type="button"
                                    @click="sdaStore.setYear(year)"
                                    class="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold transition"
                                    :class="year === sdaStore.selectedYear
                                        ? 'border-violet-400/40 bg-violet-500/20 text-violet-100 shadow-sm shadow-violet-950/40'
                                        : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-slate-200'"
                                >
                                    <span>{{ year }}</span>
                                    <span
                                        v-if="year === sdaStore.latestYear"
                                        class="rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider"
                                        :class="year === sdaStore.selectedYear ? 'bg-violet-400/30 text-violet-50' : 'bg-white/10 text-slate-500'"
                                    >
                                        Latest
                                    </span>
                                </button>
                            </div>

                            <!-- Selected dataset metadata -->
                            <div v-if="sdaStore.config" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div class="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p class="mb-1 text-xs font-semibold text-slate-500">Financial Year</p>
                                    <p class="truncate text-sm font-bold text-white">{{ sdaStore.config.financialYear }}</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p class="mb-1 text-xs font-semibold text-slate-500">Imported</p>
                                    <p class="truncate text-sm font-bold text-white">{{ formatDate(sdaStore.config.importedAt) }}</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p class="mb-1 text-xs font-semibold text-slate-500">Imported By</p>
                                    <p class="truncate text-sm font-bold text-white">{{ sdaStore.config.importedBy ?? '—' }}</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p class="mb-1 text-xs font-semibold text-slate-500">Source File</p>
                                    <p class="truncate text-sm font-bold text-white" :title="sdaStore.config.sourceFile">{{ sdaStore.config.sourceFile ?? '—' }}</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p class="mb-1 text-xs font-semibold text-slate-500">Benchmark tables</p>
                                    <p class="truncate text-sm font-bold text-white">{{ Object.keys(sdaStore.benchmarks).length }}</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                                    <p class="mb-1 text-xs font-semibold text-slate-500">Appendix H tables</p>
                                    <p class="truncate text-sm font-bold" :class="sdaStore.hasAppendixH ? 'text-white' : 'text-amber-300'">
                                        {{ Object.keys(sdaStore.appendixH).length }}
                                        <span v-if="!sdaStore.hasAppendixH" class="ml-1 text-[10px] font-medium text-amber-400/80">re-upload to populate</span>
                                    </p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 rounded-2xl border border-teal-400/20 bg-teal-400/10 px-4 py-3">
                                <CheckCircle2 class="h-4 w-4 shrink-0 text-teal-300" />
                                <span class="text-xs font-semibold text-teal-200">
                                    {{ sdaStore.selectedYear }} is active and serving all users
                                </span>
                            </div>
                        </div>

                        <div v-else class="rounded-[2rem] border border-white/10 bg-white/[0.035] py-14 text-center">
                            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                                <DatabaseZap class="h-5 w-5 text-slate-500" />
                            </div>
                            <p class="text-sm font-semibold text-slate-300">No datasets loaded</p>
                            <p class="mt-1 text-xs text-slate-600">Upload an NDIS SDA Price Calculator to get started</p>
                        </div>
                    </article>

                    <!-- Upload card -->
                    <article class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur sm:rounded-[2rem] sm:p-6">
                        <div class="mb-5 flex items-start gap-3 border-b border-white/[0.07] pb-5">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10">
                                <Upload class="h-5 w-5 text-violet-300" />
                            </div>
                            <div>
                                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                                    Import
                                </p>
                                <h2 class="mt-1 text-lg font-bold text-white">
                                    Update Dataset
                                </h2>
                                <p class="mt-1 text-sm text-slate-500">NDIS SDA Price Calculator (.xlsx)</p>
                            </div>
                        </div>

                        <!-- Drop zone -->
                        <div
                            v-if="!uploadPreview && uploadStatus !== 'parsing'"
                            @dragover.prevent="dragOver = true"
                            @dragleave="dragOver = false"
                            @drop.prevent="onDrop"
                            @click="fileInputRef?.click()"
                            class="cursor-pointer rounded-[1.5rem] px-6 py-12 text-center transition"
                            :class="dragOver ? 'border-violet-300/60 bg-violet-400/10' : 'border-white/10 bg-white/[0.025] hover:border-violet-400/35 hover:bg-violet-400/[0.06]'"
                            style="border-width: 2px; border-style: dashed;"
                        >
                            <FileSpreadsheet class="mx-auto mb-4 h-10 w-10 text-slate-600" />
                            <p class="text-sm font-semibold text-slate-300">Drop the Excel file here</p>
                            <p class="mt-1 text-xs text-slate-600">NDIS SDA Price Calculator 20XX–XX.xlsx</p>
                            <input ref="fileInputRef" type="file" accept=".xlsx" class="hidden" @change="onFileSelect" />
                        </div>

                        <!-- Parsing spinner -->
                        <div v-if="uploadStatus === 'parsing'" class="flex items-center justify-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.025] py-14 text-slate-400">
                            <Loader2 class="h-5 w-5 animate-spin text-violet-300" />
                            <span class="text-sm">Parsing spreadsheet…</span>
                        </div>

                        <!-- Preview -->
                        <div v-if="uploadPreview" class="space-y-4">
                            <div
                                class="rounded-[1.5rem] p-4"
                                :class="uploadPreview.valid ? 'border border-teal-400/25 bg-teal-400/10' : 'border border-amber-400/25 bg-amber-400/10'"
                            >
                                <div class="mb-4 flex items-center gap-2">
                                    <CheckCircle2 v-if="uploadPreview.valid" class="h-4 w-4 shrink-0 text-teal-300" />
                                    <AlertTriangle v-else class="h-4 w-4 shrink-0 text-amber-300" />
                                    <p class="text-sm font-bold" :class="uploadPreview.valid ? 'text-teal-200' : 'text-amber-200'">
                                        {{ uploadPreview.valid ? 'Ready to import' : 'Warnings detected — review before importing' }}
                                    </p>
                                </div>

                                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    <div class="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs">
                                        <span class="text-slate-500">Financial year</span>
                                        <span class="font-bold text-white">{{ uploadPreview.financialYear }}</span>
                                    </div>
                                    <div class="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs">
                                        <span class="text-slate-500">Benchmark tables</span>
                                        <span class="font-bold text-white">{{ Object.keys(uploadPreview.benchmarks ?? {}).length }}</span>
                                    </div>
                                    <div class="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs">
                                        <span class="text-slate-500">Appendix H tables</span>
                                        <span class="font-bold text-white">{{ Object.keys(uploadPreview.appendixH ?? {}).length }}</span>
                                    </div>
                                    <div class="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs">
                                        <span class="text-slate-500">SA4 regions</span>
                                        <span class="font-bold text-white">{{ uploadPreview.locationFactors.newBuild.length }}</span>
                                    </div>
                                    <div class="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs sm:col-span-2">
                                        <span class="text-slate-500">MRRC (single)</span>
                                        <span class="font-bold text-white">{{ formatCurrency(uploadPreview.mrrc?.single?.perAnnum) }}/yr</span>
                                    </div>
                                </div>

                                <ul v-if="uploadPreview.warnings?.length" class="mt-4 space-y-2">
                                    <li v-for="w in uploadPreview.warnings" :key="w" class="flex items-start gap-2 text-xs leading-5 text-amber-200">
                                        <AlertTriangle class="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                        {{ w }}
                                    </li>
                                </ul>
                            </div>

                            <!-- Overwrite warning when uploading an existing year -->
                            <div
                                v-if="uploadOverwritesExistingYear"
                                class="flex items-start gap-2 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3"
                            >
                                <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                                <p class="text-xs leading-5 text-amber-200">
                                    <strong>{{ uploadPreview.financialYear }}</strong> already exists and will be overwritten with this upload.
                                </p>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    @click="confirmUpload"
                                    :disabled="sdaStore.uploading"
                                    class="inline-flex items-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/70 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-500/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Loader2 v-if="sdaStore.uploading" class="h-4 w-4 animate-spin" />
                                    <CloudUpload v-else class="h-4 w-4" />
                                    {{ sdaStore.uploading ? 'Saving…' : 'Save to Firebase' }}
                                </button>

                                <button
                                    type="button"
                                    @click="cancelUpload"
                                    class="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p v-if="sdaStore.error" class="text-xs text-red-300">{{ sdaStore.error }}</p>
                        </div>
                    </article>
                </section>
            </div>
        </main>

        <!-- Report details, activity and delivery modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-150"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="reportDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6">
                    <div class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f1e30] shadow-2xl shadow-black/50">
                        <div class="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
                            <div class="flex min-w-0 items-center gap-3">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10">
                                    <Activity class="h-5 w-5 text-violet-300" />
                                </div>
                                <div class="min-w-0">
                                    <h3 class="truncate text-base font-bold text-white">Report details</h3>
                                    <p class="truncate text-xs text-slate-400">{{ reportDetailsModal.report.propertyAddress || 'Unknown property' }}</p>
                                </div>
                            </div>
                            <div class="flex shrink-0 items-center gap-2">
                                <button
                                    type="button"
                                    @click="loadReportActivity(true)"
                                    :disabled="activityLoading || activityRefreshing"
                                    class="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                                >
                                    <RefreshCw class="h-3.5 w-3.5" :class="activityRefreshing ? 'animate-spin' : ''" />
                                    Refresh
                                </button>
                                <button
                                    type="button"
                                    @click="closeReportDetails"
                                    class="rounded-full border border-white/10 p-2 text-slate-500 transition hover:border-white/20 hover:text-white"
                                    aria-label="Close report details"
                                >
                                    <X class="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div class="overflow-y-auto p-5 sm:p-6">
                            <div class="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div class="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</p>
                                    <div class="mt-2"><StatusBadge :status="reportDetailsModal.report.status" /></div>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Report date</p>
                                    <p class="mt-2 text-xs font-semibold text-white">{{ reportDetailsModal.report.inspectionDate || '—' }}</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Prepared by</p>
                                    <p class="mt-2 truncate text-xs font-semibold text-white">{{ reportDetailsModal.report.inspectorName || '—' }}</p>
                                </div>
                                <div class="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Report contact</p>
                                    <p class="mt-2 truncate text-xs font-semibold text-white">{{ reportDetailsModal.report.inspectorEmail || '—' }}</p>
                                </div>
                            </div>

                            <div
                                v-if="reportOperationActive"
                                class="mb-5 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4"
                            >
                                <Loader2 class="mt-0.5 h-4 w-4 shrink-0 animate-spin text-amber-300" />
                                <div class="min-w-0">
                                    <p class="text-sm font-bold text-amber-100">{{ reportOperationLabel }}</p>
                                    <p v-if="reportDetailsModal.report.regenerationProgress?.total" class="mt-1 text-xs text-amber-200/75">
                                        Restored {{ reportDetailsModal.report.regenerationProgress.completed }} of {{ reportDetailsModal.report.regenerationProgress.total }} photos
                                    </p>
                                    <p v-else class="mt-1 text-xs text-amber-200/75">This modal will update automatically while the operation runs.</p>
                                </div>
                            </div>

                            <div v-if="activityNotice" class="mb-5 rounded-2xl border border-teal-400/20 bg-teal-400/10 px-4 py-3 text-xs text-teal-100">
                                {{ activityNotice }}
                            </div>
                            <div v-if="reportDetailsError" class="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                                {{ reportDetailsError }}
                            </div>

                            <div class="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
                                <section class="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
                                    <div class="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/70">Audit trail</p>
                                            <h4 class="mt-1 text-sm font-bold text-white">Activity and email delivery</h4>
                                        </div>
                                        <span class="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-500">{{ reportActivity.length }} events</span>
                                    </div>

                                    <div v-if="activityLoading" class="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
                                        <Loader2 class="h-4 w-4 animate-spin text-violet-300" />
                                        Loading history…
                                    </div>
                                    <div v-else-if="!reportActivity.length" class="py-12 text-center text-sm text-slate-500">
                                        No activity has been recorded yet.
                                    </div>
                                    <ol v-else class="max-h-[52vh] space-y-3 overflow-y-auto pr-1">
                                        <li
                                            v-for="event in reportActivity"
                                            :key="event.id"
                                            class="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5"
                                        >
                                            <div class="flex items-start justify-between gap-3">
                                                <div class="min-w-0">
                                                    <div class="flex flex-wrap items-center gap-2">
                                                        <p class="text-xs font-bold text-white">{{ activityTitle(event) }}</p>
                                                        <span
                                                            v-if="event.kind === 'email'"
                                                            class="rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                                                            :class="emailStatusClass(event.providerStatus)"
                                                        >
                                                            {{ emailStatusLabel(event.providerStatus) }}
                                                        </span>
                                                    </div>
                                                    <p v-if="event.recipient" class="mt-1 break-all text-xs text-slate-300">{{ event.recipient }}</p>
                                                    <p v-if="event.error" class="mt-1 text-[11px] leading-4 text-red-300">{{ event.error }}</p>
                                                    <p class="mt-1.5 text-[10px] text-slate-500">
                                                        {{ activityActorLabel(event.actor) }}
                                                        <span v-if="event.action"> · {{ activityActionLabel(event.action) }}</span>
                                                    </p>
                                                </div>
                                                <time class="shrink-0 text-right text-[10px] leading-4 text-slate-600">{{ formatActivityTime(event.occurredAt) }}</time>
                                            </div>
                                        </li>
                                    </ol>
                                </section>

                                <aside class="space-y-4">
                                    <section v-if="reportDetailsModal.report.pdfUrl" class="rounded-2xl border border-teal-400/15 bg-teal-400/[0.06] p-4">
                                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300/70">Send report</p>
                                        <label class="mt-3 block text-xs font-semibold text-slate-300" for="report-recipient-email">Recipients</label>
                                        <input
                                            id="report-recipient-email"
                                            v-model="recipientInput"
                                            type="text"
                                            inputmode="email"
                                            autocomplete="off"
                                            placeholder="Type an email, then space or comma"
                                            class="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400/50"
                                            @keydown="handleRecipientKeydown"
                                            @paste="handleRecipientPaste"
                                            @blur="commitRecipientInput"
                                        />
                                        <p v-if="recipientInputError" class="mt-2 text-[10px] leading-4 text-red-300">{{ recipientInputError }}</p>
                                        <div v-if="recipientEmails.length" class="mt-3 flex flex-wrap gap-2">
                                            <span
                                                v-for="email in recipientEmails"
                                                :key="email"
                                                class="inline-flex max-w-full items-center gap-1.5 rounded-full border border-teal-400/25 bg-teal-400/10 py-1 pl-2.5 pr-1 text-[11px] font-semibold text-teal-100"
                                            >
                                                <span class="truncate">{{ email }}</span>
                                                <button
                                                    type="button"
                                                    @click="removeRecipient(email)"
                                                    class="shrink-0 rounded-full p-1 text-teal-300/70 transition hover:bg-white/10 hover:text-white"
                                                    :aria-label="`Remove ${email}`"
                                                >
                                                    <X class="h-3 w-3" />
                                                </button>
                                            </span>
                                        </div>
                                        <p v-else class="mt-2 text-[10px] leading-4 text-amber-300">Add at least one recipient to resend or regenerate.</p>
                                        <div class="mt-4 grid grid-cols-2 gap-2">
                                            <button
                                                type="button"
                                                @click="resendToSelectedRecipients"
                                                :disabled="resendLoading || reportOperationActive || !recipientEmails.length"
                                                class="inline-flex items-center justify-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/70 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-teal-500/85 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Loader2 v-if="resendLoading" class="h-3.5 w-3.5 animate-spin" />
                                                <SendHorizontal v-else class="h-3.5 w-3.5" />
                                                {{ resendLoading ? 'Sending…' : 'Resend report' }}
                                            </button>
                                            <button
                                                type="button"
                                                @click="triggerRegen(reportDetailsModal.submission, recipientEmails)"
                                                :disabled="!reportDetailsModal.report.canRegenerate || regenId === reportDetailsModal.report.id || reportOperationActive || resendLoading || !recipientEmails.length"
                                                class="inline-flex items-center justify-center gap-2 rounded-full border border-violet-400/35 bg-violet-500/20 px-3 py-2.5 text-xs font-bold text-violet-100 transition hover:bg-violet-500/30 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                <Loader2 v-if="regenId === reportDetailsModal.report.id || reportOperationActive" class="h-3.5 w-3.5 animate-spin" />
                                                <RotateCcw v-else class="h-3.5 w-3.5" />
                                                {{ regenId === reportDetailsModal.report.id || reportOperationActive ? 'Regenerating…' : 'Regenerate' }}
                                            </button>
                                        </div>
                                        <p v-if="!reportDetailsModal.report.canRegenerate" class="mt-2 text-[10px] leading-4 text-slate-500">This older report has no stored regeneration payload.</p>
                                    </section>

                                    <section class="rounded-2xl border border-violet-400/15 bg-violet-400/[0.06] p-4">
                                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/70">Report actions</p>
                                        <div class="mt-3 grid gap-2">
                                            <a
                                                v-if="reportDetailsModal.report.pdfUrl"
                                                :href="reportDetailsModal.report.pdfUrl"
                                                target="_blank"
                                                rel="noopener"
                                                class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                                            >
                                                <FileText class="h-3.5 w-3.5" /> View PDF
                                            </a>
                                            <a
                                                v-if="reportDetailsModal.report.photosDownloadUrl"
                                                :href="reportDetailsModal.report.photosDownloadUrl"
                                                target="_blank"
                                                rel="noopener"
                                                class="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:text-white"
                                            >
                                                <FolderArchive class="h-3.5 w-3.5" /> Download package
                                            </a>
                                        </div>
                                    </section>
                                </aside>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Delete confirm modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-150"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="deleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
                    <div class="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0f1e30] p-6 shadow-2xl shadow-black/40">
                        <div class="mb-4 flex items-center gap-3">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
                                <Trash2 class="h-5 w-5 text-red-300" />
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white">Delete Report</h3>
                                <p class="text-xs text-slate-500">Permanently remove this {{ deleteModal.status }} report</p>
                            </div>
                        </div>

                        <div class="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <p class="mb-0.5 text-sm font-semibold text-white">{{ deleteModal.propertyAddress || 'Untitled report' }}</p>
                            <p class="text-xs text-slate-400">
                                {{ deleteModal.collection === 'inspections' ? 'Inspection' : 'Handover' }}
                                <span v-if="deleteModal.inspectionDate"> · {{ deleteModal.inspectionDate }}</span>
                            </p>
                        </div>

                        <div class="mb-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2.5">
                            <AlertTriangle class="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                            <p class="text-xs leading-5 text-red-200">
                                This permanently removes the report record and every stored photo. Completed reports cannot be deleted.
                            </p>
                        </div>

                        <div class="flex gap-3">
                            <button
                                type="button"
                                @click="confirmDelete"
                                class="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-400/40 bg-red-500/70 py-2.5 text-sm font-bold text-white transition hover:bg-red-500/85"
                            >
                                <Trash2 class="h-4 w-4" />
                                Delete permanently
                            </button>
                            <button
                                type="button"
                                @click="deleteModal = null"
                                class="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- Regenerate confirm modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-150"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="regenModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
                    <div class="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0f1e30] p-6 shadow-2xl shadow-black/40">
                        <div class="mb-4 flex items-center gap-3">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10">
                                <RotateCcw class="h-5 w-5 text-violet-300" />
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white">Regenerate Report</h3>
                                <p class="text-xs text-slate-500">Rebuild the PDF from stored data and resend emails</p>
                            </div>
                        </div>

                        <div class="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <p class="mb-0.5 text-sm font-semibold text-white">{{ regenModal.propertyAddress }}</p>
                            <p class="text-xs text-slate-400">
                                {{ regenModal.collection === 'inspections' ? 'Inspection' : 'Handover' }}
                                · {{ regenModal.inspectionDate }}
                            </p>
                        </div>

                        <div class="mb-4 flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2.5">
                            <AlertTriangle class="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                            <p class="text-xs leading-5 text-amber-200">
                                This will <strong>overwrite the existing PDF</strong>, unpack the report package back into storage, re-run the full report pipeline, and send it to the {{ regenModal.selectedRecipients.length }} selected recipient{{ regenModal.selectedRecipients.length === 1 ? '' : 's' }}.
                            </p>
                        </div>

                        <div class="flex gap-3">
                            <button
                                type="button"
                                @click="confirmRegen"
                                :disabled="regenId === regenModal.id"
                                class="flex flex-1 items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/70 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500/85 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Loader2 v-if="regenId === regenModal.id" class="h-4 w-4 animate-spin" />
                                <RotateCcw v-else class="h-4 w-4" />
                                {{ regenId === regenModal.id ? 'Starting…' : 'Regenerate' }}
                            </button>
                            <button
                                type="button"
                                @click="regenModal = null"
                                class="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-white/20 hover:text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </LayoutComponent>
</template>


<script setup>
import { ref, computed, onMounted, onUnmounted, defineComponent, h, watch } from 'vue'
import { collection, query, orderBy, limit, startAfter, getDocs } from 'firebase/firestore'
import { auth, firestore } from '@/firebase'
import * as XLSX from 'xlsx'

import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import ToolUsageDashboard from '@/features/everhomes/components/admin/ToolUsageDashboard.vue'
import { useSdaPriceStore } from '@/features/everhomes/stores/useSdaPriceStore'
import { useMainStore } from '@/shared/stores/useMainStore'
import { extractSdaPricingData } from '@/features/everhomes/utils/sdaPriceExtractor'
import { addReportRecipients } from '@/features/everhomes/utils/reportRecipients'

import {
    ShieldCheck, RefreshCw, Loader2, Inbox, Database, DatabaseZap, Upload,
    FileText, FolderArchive, SendHorizontal, AlertCircle,
    ClipboardCheck, ClipboardList, User, Calendar, Clock,
    CheckCircle2, AlertTriangle, FileSpreadsheet, CloudUpload,
    BarChart3, TrendingUp, XCircle, RotateCcw, Link, MailWarning, Activity, Trash2, X,
} from '@lucide/vue'

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''
const copiedDraftId = ref(null)

async function adminRequestHeaders() {
    const token = await auth.currentUser?.getIdToken()
    if (!token) throw new Error('Your administrator session has expired. Please sign in again.')
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    try {
        return await fetch(url, { ...options, signal: controller.signal })
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} seconds`)
        }
        throw error
    } finally {
        clearTimeout(timeout)
    }
}

async function copyDraftRecoveryLink(submission) {
    const reportType = submission.reportType ?? (submission.collection === 'handovers' ? 'handover' : 'inspection')
    const link = `${window.location.origin}/everhomes/report/${reportType}#everhomes-draft=${reportType}.${submission.id}.${submission.draftAccessKey}`
    try {
        await navigator.clipboard.writeText(link)
        copiedDraftId.value = submission.id
        setTimeout(() => {
            if (copiedDraftId.value === submission.id) copiedDraftId.value = null
        }, 2_500)
    } catch (error) {
        alert(`Could not copy the recovery link: ${error.message}`)
    }
}

// ─── Stores ───────────────────────────────────────────────────────────────────
const sdaStore  = useSdaPriceStore()
const mainStore = useMainStore()

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const activeTab = ref('submissions')
const tabs = [
    { id: 'submissions', label: 'Submissions', icon: ClipboardCheck },
    { id: 'usage',       label: 'Tool Usage',  icon: Activity },
    { id: 'sda',         label: 'SDA Dataset',  icon: Database },
]

// ─── Submissions ──────────────────────────────────────────────────────────────
const allSubmissions = ref([])
const loading        = ref(false)
const submissionsError = ref('')
const SUBMISSIONS_PAGE_SIZE = 10
const visibleSubmissionCount = ref(SUBMISSIONS_PAGE_SIZE)

async function loadSubmissions() {
    loading.value = true
    submissionsError.value = ''
    try {
        async function loadCollection(collectionName) {
            const docs = []
            let cursor = null
            do {
                const constraints = [orderBy('createdAt', 'desc'), limit(100)]
                if (cursor) constraints.push(startAfter(cursor))
                const snapshot = await getDocs(query(collection(firestore, collectionName), ...constraints))
                docs.push(...snapshot.docs)
                cursor = snapshot.docs.at(-1) ?? null
                if (snapshot.size < 100) break
            } while (cursor)
            return docs
        }

        const [inspSnap, handSnap] = await Promise.all([
            loadCollection('inspections'),
            loadCollection('handovers'),
        ])

        const inspections = inspSnap.map(d => ({ id: d.id, collection: 'inspections', ...d.data() }))
        const handovers   = handSnap.map(d => ({ id: d.id, collection: 'handovers',   ...d.data() }))

        allSubmissions.value = [...inspections, ...handovers].sort((a, b) => {
            const ta = a.draftUpdatedAt?.toMillis?.() ?? a.createdAt?.toMillis?.() ?? 0
            const tb = b.draftUpdatedAt?.toMillis?.() ?? b.createdAt?.toMillis?.() ?? 0
            return tb - ta
        })
        visibleSubmissionCount.value = SUBMISSIONS_PAGE_SIZE
    } catch (err) {
        console.error('Failed to load submissions:', err)
        submissionsError.value = err.message ?? 'Unknown Firestore error'
    } finally {
        loading.value = false
    }
}

// ─── Filters ──────────────────────────────────────────────────────────────────
const typeFilter   = ref('all')
const statusFilter = ref('all')

const typeFilters = [
    { id: 'all',         label: 'All reports', icon: BarChart3 },
    { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
    { id: 'handovers',   label: 'Handovers',   icon: ClipboardList },
]

const statusFilters = [
    { id: 'all',        label: 'All statuses', activeClass: 'bg-slate-400/10 text-slate-200 border-slate-400/25' },
    { id: 'draft',      label: 'Drafts',     activeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
    { id: 'complete',   label: 'Complete',   activeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
    { id: 'processing', label: 'Processing', activeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    { id: 'failed',     label: 'Failed',     activeClass: 'bg-red-500/15 text-red-300 border-red-500/30' },
]

const filteredSubmissions = computed(() => {
    return allSubmissions.value.filter(s => {
        const matchType   = typeFilter.value === 'all' || s.collection === typeFilter.value
        const matchStatus = statusFilter.value === 'all'
            || s.status === statusFilter.value
            || (statusFilter.value === 'processing' && ['pending', 'regenerating', 'deleting'].includes(s.status))
        return matchType && matchStatus
    })
})

const visibleSubmissions = computed(() => {
    return filteredSubmissions.value.slice(0, visibleSubmissionCount.value)
})

const hasMoreSubmissions = computed(() => {
    return visibleSubmissionCount.value < filteredSubmissions.value.length
})

function loadMoreSubmissions() {
    visibleSubmissionCount.value += SUBMISSIONS_PAGE_SIZE
}

watch([typeFilter, statusFilter], () => {
    visibleSubmissionCount.value = SUBMISSIONS_PAGE_SIZE
})

// ─── Stats ────────────────────────────────────────────────────────────────────
const submissionTotal = computed(() => allSubmissions.value.length)

const stats = computed(() => {
    const total      = submissionTotal.value
    const complete   = allSubmissions.value.filter(s => s.status === 'complete').length
    const processing = allSubmissions.value.filter(s => ['processing', 'pending', 'regenerating', 'deleting'].includes(s.status)).length
    const failed     = allSubmissions.value.filter(s => s.status === 'failed').length
    const drafts     = allSubmissions.value.filter(s => s.status === 'draft').length

    return [
        { label: 'Complete',   value: complete,   color: '#14b8a6' },
        { label: 'Processing', value: processing, color: '#f59e0b' },
        { label: 'Failed',     value: failed,     color: '#f43f5e' },
        { label: 'Drafts',     value: drafts,     color: '#38bdf8' },
    ].map(stat => ({
        ...stat,
        percentage: total ? (stat.value / total) * 100 : 0,
    }))
})

// ─── Status badge component ───────────────────────────────────────────────────
const StatusBadge = defineComponent({
    props: { status: String },
    setup(props) {
        return () => {
            const map = {
                complete:   { label: 'Complete',   color: '#14b8a6', bg: 'rgba(20,184,166,0.12)',   border: 'rgba(20,184,166,0.25)' },
                processing: { label: 'Processing', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.25)' },
                regenerating: { label: 'Regenerating', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
                deleting:   { label: 'Deleting',   color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',    border: 'rgba(244,63,94,0.25)' },
                pending:    { label: 'Pending',    color: '#94a3b8', bg: 'rgba(148,163,184,0.10)',  border: 'rgba(148,163,184,0.2)' },
                draft:      { label: 'Draft',      color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',    border: 'rgba(56,189,248,0.25)' },
                failed:     { label: 'Failed',     color: '#f43f5e', bg: 'rgba(244,63,94,0.12)',    border: 'rgba(244,63,94,0.25)' },
            }
            const s = map[props.status] ?? map.pending
            return h('span', {
                class: 'text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full',
                style: `background: ${s.bg}; color: ${s.color}; border: 1px solid ${s.border};`,
            }, s.label)
        }
    }
})

// ─── Report activity and delivery controls ──────────────────────────────────
const reportDetailsModal = ref(null)
const reportActivity = ref([])
const activityLoading = ref(false)
const activityRefreshing = ref(false)
const reportDetailsError = ref('')
const activityNotice = ref('')
const recipientInput = ref('')
const recipientInputError = ref('')
const recipientEmails = ref([])
const recipientsInitialised = ref(false)
const resendLoading = ref(false)
const resendingId = ref(null)
let activityPollTimer = null

const ACTIVE_REGENERATION_PHASES = new Set(['preparing', 'restoring', 'generating'])
const ACTIVE_REPORT_STATUSES = new Set(['pending', 'processing', 'regenerating'])

const reportOperationActive = computed(() => {
    const report = reportDetailsModal.value?.report
    return Boolean(
        report
        && (
            ACTIVE_REGENERATION_PHASES.has(report.regenerationPhase)
            || ACTIVE_REPORT_STATUSES.has(report.status)
            || regenId.value === report.id
        )
    )
})

const reportOperationLabel = computed(() => {
    const report = reportDetailsModal.value?.report
    if (!report) return 'Working…'
    if (report.regenerationPhase === 'preparing') return 'Preparing report regeneration…'
    if (report.regenerationPhase === 'restoring') return 'Restoring the report photos…'
    if (report.regenerationPhase === 'generating') return 'Generating the PDF and sending emails…'
    if (report.status === 'pending' || report.status === 'processing') return 'Generating the report…'
    return 'Regenerating the report…'
})

function reportSummary(submission) {
    return {
        id: submission.id,
        collection: submission.collection,
        status: submission.status ?? 'unknown',
        regenerationPhase: submission.regenerationPhase ?? null,
        regenerationProgress: submission.regenerationProgress ?? null,
        propertyAddress: submission.propertyAddress ?? '',
        inspectionDate: submission.inspectionDate ?? null,
        inspectorName: submission.inspectorName ?? null,
        inspectorEmail: submission.inspectorEmail ?? null,
        previousRecipients: Array.isArray(submission.emailsSent) ? submission.emailsSent : [],
        pdfUrl: submission.pdfUrl ?? null,
        photosDownloadUrl: submission.photosDownloadUrl ?? null,
        canRegenerate: Boolean(submission.submissionPayload),
    }
}

function clearActivityPoll() {
    if (activityPollTimer) clearTimeout(activityPollTimer)
    activityPollTimer = null
}

function scheduleActivityPoll() {
    clearActivityPoll()
    if (!reportDetailsModal.value || !reportOperationActive.value) return
    activityPollTimer = setTimeout(async () => {
        await loadReportActivity(false)
        scheduleActivityPoll()
    }, 5_000)
}

async function openReportDetails(submission) {
    clearActivityPoll()
    reportDetailsModal.value = { submission, report: reportSummary(submission) }
    reportActivity.value = []
    recipientInput.value = ''
    recipientInputError.value = ''
    recipientEmails.value = []
    recipientsInitialised.value = false
    reportDetailsError.value = ''
    activityNotice.value = ''
    await loadReportActivity(true)
}

function closeReportDetails() {
    clearActivityPoll()
    reportDetailsModal.value = null
    reportActivity.value = []
    reportDetailsError.value = ''
    activityNotice.value = ''
    recipientInput.value = ''
    recipientInputError.value = ''
    recipientEmails.value = []
    recipientsInitialised.value = false
}

async function loadReportActivity(refreshProviderStatuses = false) {
    const modal = reportDetailsModal.value
    if (!modal || activityLoading.value || activityRefreshing.value) return
    const initialLoad = reportActivity.value.length === 0
    if (initialLoad) activityLoading.value = true
    else activityRefreshing.value = true
    reportDetailsError.value = ''
    try {
        const res = await fetchWithTimeout(`${FUNCTIONS_URL}/getReportActivity`, {
            method: 'POST',
            headers: await adminRequestHeaders(),
            body: JSON.stringify({
                collection: modal.report.collection,
                docId: modal.report.id,
                refreshProviderStatuses,
            }),
        }, 65_000)
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
        if (reportDetailsModal.value !== modal) return
        modal.report = { ...modal.report, ...body.report }
        reportActivity.value = Array.isArray(body.events) ? body.events : []
        if (!recipientsInitialised.value) {
            const previous = Array.isArray(body.report.previousRecipients)
                ? body.report.previousRecipients
                : []
            const fallback = previous.length ? previous : [body.report.inspectorEmail].filter(Boolean)
            recipientEmails.value = addReportRecipients([], fallback.join(',')).recipients
            recipientsInitialised.value = true
        }
        const submission = allSubmissions.value.find(candidate => (
            candidate.id === body.report.id && candidate.collection === body.report.collection
        ))
        if (submission) Object.assign(submission, body.report)
    } catch (error) {
        if (reportDetailsModal.value === modal) {
            reportDetailsError.value = `Could not load report history: ${error.message}`
        }
    } finally {
        activityLoading.value = false
        activityRefreshing.value = false
        if (reportDetailsModal.value === modal) scheduleActivityPoll()
    }
}

function addRecipientsFromInput(value) {
    const result = addReportRecipients(recipientEmails.value, value)
    recipientEmails.value = result.recipients
    recipientInputError.value = result.invalid.length
        ? `Invalid email${result.invalid.length === 1 ? '' : 's'}: ${result.invalid.join(', ')}`
        : result.overflow
            ? 'A maximum of 20 recipients can be selected.'
            : ''
    return result
}

function commitRecipientInput() {
    if (!recipientInput.value.trim()) return true
    const result = addRecipientsFromInput(recipientInput.value)
    recipientInput.value = result.invalid.join(' ')
    return result.invalid.length === 0 && !result.overflow
}

function handleRecipientKeydown(event) {
    if (!['Enter', ',', ' ', 'Tab'].includes(event.key) || !recipientInput.value.trim()) return
    if (event.key !== 'Tab') event.preventDefault()
    commitRecipientInput()
}

function handleRecipientPaste(event) {
    const text = event.clipboardData?.getData('text') ?? ''
    if (!/[,;\s]/.test(text.trim())) return
    event.preventDefault()
    addRecipientsFromInput(text)
    recipientInput.value = ''
}

function removeRecipient(email) {
    recipientEmails.value = recipientEmails.value.filter(candidate => candidate !== email)
    recipientInputError.value = ''
}

async function sendReportEmails({ recipients }) {
    const modal = reportDetailsModal.value
    if (!modal) return
    resendLoading.value = true
    resendingId.value = modal.report.id
    reportDetailsError.value = ''
    activityNotice.value = ''
    try {
        const bodyPayload = {
            collection: modal.report.collection,
            docId: modal.report.id,
            recipients,
        }
        const res = await fetchWithTimeout(`${FUNCTIONS_URL}/resendReport`, {
            method: 'POST',
            headers: await adminRequestHeaders(),
            body: JSON.stringify(bodyPayload),
        }, 60_000)
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
        const failedMessage = body.failed
            ? ` ${body.failed} recipient${body.failed === 1 ? '' : 's'} failed.`
            : ''
        activityNotice.value = `${body.sent} email${body.sent === 1 ? '' : 's'} accepted for delivery.${failedMessage}${body.auditWarning ? ` ${body.auditWarning}` : ''}`
        await loadReportActivity(true)
    } catch (error) {
        reportDetailsError.value = `Email send failed: ${error.message}`
        await loadReportActivity(true)
    } finally {
        resendLoading.value = false
        resendingId.value = null
    }
}

function resendToSelectedRecipients() {
    if (!commitRecipientInput() || !recipientEmails.value.length) return
    return sendReportEmails({
        recipients: [...recipientEmails.value],
    })
}

function emailStatusLabel(status) {
    return ({
        bounced: 'Bounced', failed: 'Failed', complained: 'Spam report', suppressed: 'Suppressed',
        delivered: 'Delivered', delivery_delayed: 'Delayed', sent: 'Sent', queued: 'Queued',
        scheduled: 'Scheduled', opened: 'Opened', clicked: 'Clicked', canceled: 'Canceled',
    })[status] ?? 'Unknown'
}

function emailStatusClass(status) {
    if (['bounced', 'failed', 'complained', 'suppressed', 'canceled'].includes(status)) {
        return 'border-red-400/25 bg-red-400/10 text-red-300'
    }
    if (['delivered', 'opened', 'clicked'].includes(status)) {
        return 'border-teal-400/25 bg-teal-400/10 text-teal-300'
    }
    if (status === 'delivery_delayed') return 'border-amber-400/25 bg-amber-400/10 text-amber-300'
    return 'border-slate-400/20 bg-slate-400/10 text-slate-400'
}

function activityTitle(event) {
    if (event.kind === 'email') return 'Email delivery'
    return event.label ?? ({
        'report.started': 'Report started',
        'report.submitted': 'Report submitted',
        'report.generated': 'Report generated',
        'report.regenerated': 'Report regenerated',
        'report.generation_failed': 'Report generation failed',
        'report.regeneration_started': 'Regeneration started',
        'report.regeneration_failed': 'Regeneration failed',
        'report.contact_updated': 'Report contact updated',
    })[event.type] ?? 'Report activity'
}

function activityActorLabel(actor) {
    if (!actor) return 'System'
    const identity = actor.name || actor.email
    if (identity) return `${identity}${actor.kind === 'admin' ? ' (admin)' : ''}`
    return actor.kind === 'admin' ? 'Everhomes administrator' : actor.kind === 'reporter' ? 'Report author' : 'System'
}

function activityActionLabel(action) {
    return ({
        generation: 'Initial send', regeneration: 'Regeneration send',
        targeted_resend: 'Targeted resend', resend_all: 'Resend to original recipients',
        resend: 'Administrative resend',
    })[action] ?? action.replaceAll('_', ' ')
}

function formatActivityTime(value) {
    if (!value) return 'Time unavailable'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Time unavailable'
    return new Intl.DateTimeFormat('en-AU', {
        dateStyle: 'medium', timeStyle: 'short', timeZone: 'Australia/Brisbane',
    }).format(date)
}

// ─── Delete draft/failed report ──────────────────────────────────────────────
const deleteModal = ref(null)
const deletingId = ref(null)

function triggerDelete(sub) {
    deleteModal.value = sub
}

async function confirmDelete() {
    const sub = deleteModal.value
    if (!sub) return
    deleteModal.value = null
    deletingId.value = sub.id

    try {
        const res = await fetchWithTimeout(`${FUNCTIONS_URL}/deleteEverhomesReport`, {
            method: 'POST',
            headers: await adminRequestHeaders(),
            body: JSON.stringify({ collection: sub.collection, docId: sub.id }),
        }, 130_000)
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
        allSubmissions.value = allSubmissions.value.filter(candidate => (
            candidate.id !== sub.id || candidate.collection !== sub.collection
        ))
    } catch (err) {
        alert(`Deletion failed: ${err.message}`)
        await loadSubmissions()
    } finally {
        deletingId.value = null
    }
}

// ─── Regenerate ───────────────────────────────────────────────────────────────
const regenModal   = ref(null)
const regenId      = ref(null)
const regenSuccess = ref(null)

function triggerRegen(sub, recipients) {
    if (!commitRecipientInput()) return
    const selectedRecipients = Array.isArray(recipients) ? [...recipients] : [...recipientEmails.value]
    if (!selectedRecipients.length) return
    regenModal.value = { ...sub, selectedRecipients }
}

async function confirmRegen() {
    const sub = regenModal.value
    if (!sub) return
    regenModal.value = null
    regenId.value = sub.id
    activityNotice.value = 'Regeneration started. Progress will update here automatically.'
    reportDetailsError.value = ''
    if (reportDetailsModal.value?.report.id === sub.id) {
        reportDetailsModal.value.report.regenerationPhase = 'preparing'
        reportDetailsModal.value.report.regenerationProgress = null
        scheduleActivityPoll()
    }

    try {
        const res = await fetchWithTimeout(`${FUNCTIONS_URL}/regenerateReport`, {
            method: 'POST',
            headers: await adminRequestHeaders(),
            body: JSON.stringify({
                collection: sub.collection,
                docId: sub.id,
                recipients: sub.selectedRecipients,
            }),
        }, 910_000)
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.details ?? body.error ?? `HTTP ${res.status}`)
        regenSuccess.value = sub.id
        activityNotice.value = 'Report regenerated and the email attempts have finished.'
        await loadReportActivity(true)
        await loadSubmissions()
        setTimeout(() => { if (regenSuccess.value === sub.id) regenSuccess.value = null }, 6000)
    } catch (err) {
        if (reportDetailsModal.value?.report.id === sub.id) {
            reportDetailsError.value = `Regeneration failed: ${err.message}`
            await loadReportActivity(true)
        } else {
            alert(`Regeneration failed: ${err.message}`)
        }
    } finally {
        regenId.value = null
    }
}

// ─── SDA upload ───────────────────────────────────────────────────────────────
const fileInputRef  = ref(null)
const dragOver      = ref(false)
const uploadStatus  = ref(null)   // null | 'parsing' | 'preview'
const uploadPreview = ref(null)
const pendingFile   = ref(null)

const uploadOverwritesExistingYear = computed(() => {
    const fy = uploadPreview.value?.financialYear
    return !!fy && fy !== 'Unknown' && sdaStore.availableYears.includes(fy)
})

function onDrop(e) {
    dragOver.value = false
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
}

function onFileSelect(e) {
    const file = e.target.files[0]
    if (file) processFile(file)
}

async function processFile(file) {
    pendingFile.value  = file
    uploadStatus.value = 'parsing'
    uploadPreview.value = null
    try {
        const buffer   = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        uploadPreview.value = extractSdaPricingData(workbook, file.name)
        uploadStatus.value  = 'preview'
    } catch (err) {
        uploadStatus.value = null
        alert(`Failed to parse file: ${err.message}`)
    }
}

async function confirmUpload() {
    if (!uploadPreview.value || !pendingFile.value) return
    try {
        await sdaStore.uploadData(
            uploadPreview.value,
            pendingFile.value.name,
            mainStore.user?.email ?? 'unknown'
        )
        cancelUpload()
    } catch { /* store.error shown in UI */ }
}

function cancelUpload() {
    uploadStatus.value  = null
    uploadPreview.value = null
    pendingFile.value   = null
    if (fileInputRef.value) fileInputRef.value.value = ''
}

// ─── Formatting helpers ───────────────────────────────────────────────────────
function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatRelative(ts) {
    const ms = ts?.toMillis?.() ?? (ts ? new Date(ts).getTime() : null)
    if (!ms) return '—'
    const diff = Date.now() - ms
    const mins = Math.floor(diff / 60_000)
    if (mins < 1)   return 'just now'
    if (mins < 60)  return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24)   return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30)  return `${days}d ago`
    return formatDate(new Date(ms).toISOString())
}

function formatCurrency(val) {
    if (val == null) return '—'
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val)
}

// ─── Init ─────────────────────────────────────────────────────────────────────
onMounted(async () => {
    loadSubmissions()
    if (!sdaStore.hasData) sdaStore.fetchData()
})

onUnmounted(clearActivityPoll)
</script>
