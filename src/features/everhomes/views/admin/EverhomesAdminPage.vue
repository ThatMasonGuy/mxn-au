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
                <section class="mb-8 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:rounded-[2rem] sm:p-8 lg:p-10">
                    <div class="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
                        <div class="min-w-0">
                            <div class="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-teal-300">
                                <ShieldCheck class="h-3.5 w-3.5 shrink-0" />
                                <span class="truncate">Site Admin</span>
                            </div>

                            <h1 class="max-w-full text-[clamp(2.4rem,12vw,4rem)] font-black leading-[0.92] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                <span class="block whitespace-nowrap">Everhomes</span>
                                <span class="block bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                                    Admin
                                </span>
                            </h1>

                            <p class="mt-5 max-w-2xl text-[14px] leading-6 text-slate-300 sm:text-lg sm:leading-7">
                                Submissions, datasets, reports, and the small administrative rituals keeping civilisation duct-taped together.
                            </p>

                            <div class="mt-7 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    @click="loadSubmissions"
                                    :disabled="loading"
                                    class="inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-4 py-2 text-sm font-semibold text-teal-200 transition hover:border-teal-300/50 hover:bg-teal-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <RefreshCw class="h-4 w-4" :class="loading ? 'animate-spin' : ''" />
                                    Refresh submissions
                                </button>

                                <p class="text-xs font-medium text-slate-500">
                                    Loaded {{ allSubmissions.length }} submission{{ allSubmissions.length === 1 ? '' : 's' }}
                                </p>
                            </div>
                        </div>

                        <aside class="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/20">
                            <div class="mb-4 flex items-center justify-between gap-4">
                                <div>
                                    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        System pulse
                                    </p>
                                    <p class="mt-1 text-sm font-medium text-slate-300">
                                        Current submission state
                                    </p>
                                </div>

                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                                    <BarChart3 class="h-5 w-5 text-cyan-300" />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div
                                    v-for="stat in stats"
                                    :key="stat.label"
                                    class="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                                >
                                    <div class="mb-3 flex items-center justify-between gap-3">
                                        <span class="text-xs font-semibold text-slate-500">{{ stat.label }}</span>
                                        <div class="flex h-8 w-8 items-center justify-center rounded-xl" :style="{ background: stat.bgColor }">
                                            <component :is="stat.icon" class="h-4 w-4" :style="{ color: stat.color }" />
                                        </div>
                                    </div>
                                    <p class="text-3xl font-black leading-none text-white tabular-nums">
                                        {{ stat.value }}
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <!-- Tabs -->
                <section class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex w-full gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1 shadow-xl shadow-black/10 sm:w-fit">
                        <button
                            v-for="tab in tabs"
                            :key="tab.id"
                            type="button"
                            @click="activeTab = tab.id"
                            class="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:flex-none sm:px-4"
                            :class="activeTab === tab.id
                                ? 'border border-teal-400/30 bg-teal-400/15 text-teal-200 shadow-lg shadow-teal-950/30'
                                : 'border border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'"
                        >
                            <component :is="tab.icon" class="h-4 w-4 shrink-0" />
                            <span class="truncate">{{ tab.label }}</span>
                            <span
                                v-if="tab.id === 'submissions' && allSubmissions.length"
                                class="ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none"
                                :class="activeTab === 'submissions' ? 'bg-teal-400/20 text-teal-200' : 'bg-white/10 text-slate-500'"
                            >
                                {{ allSubmissions.length }}
                            </span>
                        </button>
                    </div>
                </section>

                <!-- Submissions tab -->
                <section v-if="activeTab === 'submissions'" class="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10 backdrop-blur sm:rounded-[2rem] sm:p-5">
                    <!-- Filter bar -->
                    <div class="mb-5 flex flex-col gap-3 border-b border-white/[0.07] pb-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                                Submission queue
                            </p>
                            <h2 class="mt-1 text-xl font-bold text-white">
                                Recent reports
                            </h2>
                        </div>

                        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                            <div class="flex flex-wrap gap-2">
                                <button
                                    v-for="f in typeFilters"
                                    :key="f.id"
                                    type="button"
                                    @click="typeFilter = f.id"
                                    class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                                    :class="typeFilter === f.id
                                        ? 'border-teal-400/30 bg-teal-400/15 text-teal-200'
                                        : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-slate-200'"
                                >
                                    <component :is="f.icon" class="h-3.5 w-3.5" />
                                    {{ f.label }}
                                </button>
                            </div>

                            <div class="flex flex-wrap gap-2 sm:justify-end">
                                <button
                                    v-for="s in statusFilters"
                                    :key="s.id"
                                    type="button"
                                    @click="statusFilter = statusFilter === s.id ? 'all' : s.id"
                                    class="rounded-full border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide transition"
                                    :class="statusFilter === s.id ? s.activeClass : 'border-white/10 bg-white/[0.04] text-slate-500 hover:border-white/20 hover:text-slate-300'"
                                >
                                    {{ s.label }}
                                </button>
                            </div>
                        </div>
                    </div>


                    <!-- Loading state -->
                    <div v-if="loading" class="flex items-center justify-center gap-3 py-24 text-slate-500">
                        <Loader2 class="h-5 w-5 animate-spin text-cyan-300" />
                        <span class="text-sm">Loading submissions…</span>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="!filteredSubmissions.length" class="rounded-[2rem] border border-white/10 bg-white/[0.035] py-20 text-center">
                        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                            <Inbox class="h-5 w-5 text-slate-500" />
                        </div>
                        <p class="font-semibold text-slate-300">
                            No submissions found
                        </p>
                        <p class="mt-1 text-sm text-slate-600">
                            Try changing the filters. Riveting admin theatre, truly.
                        </p>
                    </div>

                    <!-- Submissions list -->
                    <div v-else class="space-y-3">
                        <article
                            v-for="sub in visibleSubmissions"
                            :key="sub.id"
                            class="group relative overflow-visible rounded-[1.35rem] border border-white/10 bg-slate-950/35 p-3 pt-4 shadow-lg shadow-black/10 transition hover:border-white/20 hover:bg-white/[0.055]"
                        >
                            <!-- Decorative clipped layer only -->
                            <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.35rem]">
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
                                                    Submitted {{ formatRelative(sub.createdAt) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex flex-wrap items-center gap-2 lg:justify-end">
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
                                            Photos
                                        </a>

                                        <div
                                            v-if="sub.pdfUrl || sub.submissionPayload"
                                            class="flex"
                                        >
                                            <button
                                                type="button"
                                                @click="triggerResend(sub)"
                                                :disabled="!sub.pdfUrl || resendingId === sub.id || regenId === sub.id"
                                                class="inline-flex items-center gap-1.5 rounded-l-full border border-r-0 px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                                                :class="resendSuccess === sub.id ? 'border-teal-400/30 bg-teal-400/10 text-teal-200' : 'border-white/10 bg-white/[0.045] text-slate-300 hover:border-teal-400/30 hover:bg-teal-400/10 hover:text-teal-200'"
                                            >
                                                <Loader2 v-if="resendingId === sub.id" class="h-3.5 w-3.5 animate-spin" />
                                                <CheckCheck v-else-if="resendSuccess === sub.id" class="h-3.5 w-3.5" />
                                                <SendHorizontal v-else class="h-3.5 w-3.5" />
                                                {{ resendSuccess === sub.id ? 'Sent' : resendingId === sub.id ? 'Sending…' : 'Resend' }}
                                            </button>

                                            <button
                                                type="button"
                                                @click.stop="openActionMenu($event, sub)"
                                                :disabled="resendingId === sub.id || regenId === sub.id"
                                                class="inline-flex items-center justify-center rounded-r-full border border-white/10 bg-white/[0.045] px-2 py-1.5 text-slate-500 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <ChevronDown class="h-3 w-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="sub.status === 'failed' && sub.error" class="mt-4 flex items-start gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2.5">
                                    <AlertCircle class="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-300" />
                                    <p class="text-xs leading-5 text-red-200">{{ sub.error }}</p>
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

                <!-- SDA Dataset tab -->
                <section v-if="activeTab === 'sda'" class="grid gap-6 lg:grid-cols-2">
                    <!-- Current dataset card -->
                    <article class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10 backdrop-blur sm:rounded-[2rem] sm:p-6">
                        <div class="mb-5 flex items-start justify-between gap-4 border-b border-white/[0.07] pb-5">
                            <div class="flex items-center gap-3">
                                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10">
                                    <Database class="h-5 w-5 text-violet-300" />
                                </div>
                                <div>
                                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/70">
                                        Dataset
                                    </p>
                                    <h2 class="mt-1 text-lg font-bold text-white">
                                        Current SDA Dataset
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <div v-if="sdaStore.loading" class="flex items-center gap-2 py-6 text-slate-500">
                            <Loader2 class="h-4 w-4 animate-spin text-violet-300" />
                            <span class="text-sm">Loading…</span>
                        </div>

                        <div v-else-if="sdaStore.config" class="space-y-4">
                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                            </div>

                            <div class="flex items-center gap-2 rounded-2xl border border-teal-400/20 bg-teal-400/10 px-4 py-3">
                                <CheckCircle2 class="h-4 w-4 shrink-0 text-teal-300" />
                                <span class="text-xs font-semibold text-teal-200">Dataset is active and serving all users</span>
                            </div>
                        </div>

                        <div v-else class="rounded-[2rem] border border-white/10 bg-white/[0.035] py-14 text-center">
                            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                                <DatabaseZap class="h-5 w-5 text-slate-500" />
                            </div>
                            <p class="text-sm font-semibold text-slate-300">No dataset loaded</p>
                            <p class="mt-1 text-xs text-slate-600">Upload the NDIS SDA Price Calculator to get started</p>
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
                                        <span class="font-bold text-white">8</span>
                                    </div>
                                    <div class="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs">
                                        <span class="text-slate-500">SA4 regions</span>
                                        <span class="font-bold text-white">{{ uploadPreview.locationFactors.newBuild.length }}</span>
                                    </div>
                                    <div class="flex items-center justify-between rounded-xl bg-white/[0.045] px-3 py-2 text-xs">
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

        <!-- Resend confirm modal -->
        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-150"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition duration-100"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div v-if="resendModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
                    <div class="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0f1e30] p-6 shadow-2xl shadow-black/40">
                        <div class="mb-4 flex items-center gap-3">
                            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-teal-400/20 bg-teal-400/10">
                                <SendHorizontal class="h-5 w-5 text-teal-300" />
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white">Resend Report</h3>
                                <p class="text-xs text-slate-500">Re-email the existing PDF to all recipients</p>
                            </div>
                        </div>

                        <div class="mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <p class="mb-0.5 text-sm font-semibold text-white">{{ resendModal.propertyAddress }}</p>
                            <p class="text-xs text-slate-400">
                                {{ resendModal.collection === 'inspections' ? 'Inspection' : 'Handover' }}
                                · {{ resendModal.inspectionDate }}
                            </p>
                            <div v-if="resendModal.emailsSent?.length" class="mt-3 flex flex-wrap gap-1.5">
                                <span v-for="email in resendModal.emailsSent" :key="email" class="rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] text-slate-400">
                                    {{ email }}
                                </span>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <button
                                type="button"
                                @click="confirmResend"
                                class="flex flex-1 items-center justify-center gap-2 rounded-full border border-teal-400/40 bg-teal-500/70 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500/85"
                            >
                                <SendHorizontal class="h-4 w-4" />
                                Resend Now
                            </button>
                            <button
                                type="button"
                                @click="resendModal = null"
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
                                This will <strong>overwrite the existing PDF</strong>, unpack the photos ZIP back into storage, re-run the full report pipeline, and re-send emails to all original recipients.
                            </p>
                        </div>

                        <div class="flex gap-3">
                            <button
                                type="button"
                                @click="confirmRegen"
                                class="flex flex-1 items-center justify-center gap-2 rounded-full border border-violet-400/40 bg-violet-500/70 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500/85"
                            >
                                <RotateCcw class="h-4 w-4" />
                                Regenerate
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

        <!-- Action dropdown — Teleported to body so it's never clipped by stacking contexts -->
        <Teleport to="body">
            <!-- Click-away backdrop -->
            <div v-if="actionMenuId" class="fixed inset-0 z-[200]" @click="actionMenuId = null" />

            <Transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
            >
                <div
                    v-if="actionMenuSub"
                    class="fixed z-[201] min-w-[190px] overflow-hidden rounded-2xl"
                    :style="{
                        top: actionMenuPos.top + 'px',
                        right: actionMenuPos.right + 'px',
                        background: '#111f33',
                        border: '1px solid rgba(255,255,255,0.22)',
                        boxShadow: '0 12px 48px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.5)',
                    }"
                >
                    <button
                        type="button"
                        @click="triggerResend(actionMenuSub); actionMenuId = null"
                        class="flex w-full items-center gap-2.5 px-4 py-3.5 text-left text-xs font-semibold text-white transition-colors hover:bg-white/[0.09] active:bg-white/[0.12]"
                    >
                        <SendHorizontal class="h-3.5 w-3.5 shrink-0 text-teal-400" />
                        Resend email
                    </button>
                    <div style="height:1px; background: rgba(255,255,255,0.12);" />
                    <button
                        type="button"
                        @click="triggerRegen(actionMenuSub); actionMenuId = null"
                        :disabled="!actionMenuSub.submissionPayload"
                        class="flex w-full items-center gap-2.5 px-4 py-3.5 text-left text-xs font-semibold text-white transition-colors hover:bg-white/[0.09] active:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <RotateCcw class="h-3.5 w-3.5 shrink-0 text-violet-400" :class="regenId === actionMenuSub.id ? 'animate-spin' : ''" />
                        <span>
                            Regenerate report
                            <span v-if="!actionMenuSub.submissionPayload" class="mt-0.5 block text-[10px] text-slate-500">No stored payload</span>
                        </span>
                    </button>
                </div>
            </Transition>
        </Teleport>
    </LayoutComponent>
</template>


<script setup>
import { ref, computed, onMounted, defineComponent, h, watch } from 'vue'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { firestore } from '@/firebase'
import * as XLSX from 'xlsx'

import LayoutComponent from '@/features/everhomes/components/layouts/LayoutComponent.vue'
import { useSdaPriceStore } from '@/features/everhomes/stores/useSdaPriceStore'
import { useMainStore } from '@/shared/stores/useMainStore'
import { extractSdaPricingData } from '@/features/everhomes/utils/sdaPriceExtractor'

import {
    ShieldCheck, RefreshCw, Loader2, Inbox, Database, DatabaseZap, Upload,
    FileText, FolderArchive, SendHorizontal, CheckCheck, AlertCircle,
    ClipboardCheck, ClipboardList, User, Calendar, Clock,
    CheckCircle2, AlertTriangle, FileSpreadsheet, CloudUpload,
    BarChart3, TrendingUp, XCircle, ChevronDown, RotateCcw,
} from 'lucide-vue-next'

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''

// ─── Stores ───────────────────────────────────────────────────────────────────
const sdaStore  = useSdaPriceStore()
const mainStore = useMainStore()

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const activeTab = ref('submissions')
const tabs = [
    { id: 'submissions', label: 'Submissions', icon: ClipboardCheck },
    { id: 'sda',         label: 'SDA Dataset',  icon: Database },
]

// ─── Submissions ──────────────────────────────────────────────────────────────
const allSubmissions = ref([])
const loading        = ref(false)
const SUBMISSIONS_PAGE_SIZE = 10
const visibleSubmissionCount = ref(SUBMISSIONS_PAGE_SIZE)

async function loadSubmissions() {
    loading.value = true
    try {
        const [inspSnap, handSnap] = await Promise.all([
            getDocs(query(collection(firestore, 'inspections'), orderBy('createdAt', 'desc'), limit(50))),
            getDocs(query(collection(firestore, 'handovers'),   orderBy('createdAt', 'desc'), limit(50))),
        ])

        const inspections = inspSnap.docs.map(d => ({ id: d.id, collection: 'inspections', ...d.data() }))
        const handovers   = handSnap.docs.map(d => ({ id: d.id, collection: 'handovers',   ...d.data() }))

        allSubmissions.value = [...inspections, ...handovers].sort((a, b) => {
            const ta = a.createdAt?.toMillis?.() ?? 0
            const tb = b.createdAt?.toMillis?.() ?? 0
            return tb - ta
        })
        visibleSubmissionCount.value = SUBMISSIONS_PAGE_SIZE
    } catch (err) {
        console.error('Failed to load submissions:', err)
    } finally {
        loading.value = false
    }
}

// ─── Filters ──────────────────────────────────────────────────────────────────
const typeFilter   = ref('all')
const statusFilter = ref('all')

const typeFilters = [
    { id: 'all',         label: 'All',        icon: BarChart3 },
    { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
    { id: 'handovers',   label: 'Handovers',   icon: ClipboardList },
]

const statusFilters = [
    { id: 'complete',   label: 'Complete',   activeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
    { id: 'processing', label: 'Processing', activeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    { id: 'failed',     label: 'Failed',     activeClass: 'bg-red-500/15 text-red-300 border-red-500/30' },
]

const filteredSubmissions = computed(() => {
    return allSubmissions.value.filter(s => {
        const matchType   = typeFilter.value === 'all' || s.collection === typeFilter.value
        const matchStatus = statusFilter.value === 'all' || s.status === statusFilter.value
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
const stats = computed(() => {
    const total      = allSubmissions.value.length
    const complete   = allSubmissions.value.filter(s => s.status === 'complete').length
    const processing = allSubmissions.value.filter(s => s.status === 'processing' || s.status === 'pending').length
    const failed     = allSubmissions.value.filter(s => s.status === 'failed').length

    return [
        { label: 'Total',      value: total,      icon: BarChart3,    color: '#94a3b8', bgColor: 'rgba(148,163,184,0.1)' },
        { label: 'Complete',   value: complete,   icon: CheckCircle2, color: '#14b8a6', bgColor: 'rgba(20,184,166,0.12)' },
        { label: 'Processing', value: processing, icon: TrendingUp,   color: '#f59e0b', bgColor: 'rgba(245,158,11,0.12)' },
        { label: 'Failed',     value: failed,     icon: XCircle,      color: '#f43f5e', bgColor: 'rgba(244,63,94,0.12)' },
    ]
})

// ─── Status badge component ───────────────────────────────────────────────────
const StatusBadge = defineComponent({
    props: { status: String },
    setup(props) {
        return () => {
            const map = {
                complete:   { label: 'Complete',   color: '#14b8a6', bg: 'rgba(20,184,166,0.12)',   border: 'rgba(20,184,166,0.25)' },
                processing: { label: 'Processing', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.25)' },
                pending:    { label: 'Pending',    color: '#94a3b8', bg: 'rgba(148,163,184,0.10)',  border: 'rgba(148,163,184,0.2)' },
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

// ─── Action dropdown (split button) ──────────────────────────────────────────
// Teleported to <body> to escape stacking contexts; positioned via fixed coords.
const actionMenuId  = ref(null)
const actionMenuPos = ref({ top: 0, right: 0 })

// The submission object currently shown in the dropdown
const actionMenuSub = computed(() =>
    actionMenuId.value
        ? allSubmissions.value.find(s => s.id === actionMenuId.value) ?? null
        : null
)

function openActionMenu(event, sub) {
    const rect = event.currentTarget.getBoundingClientRect()
    actionMenuPos.value = {
        top:   rect.bottom + 6,                         // 6px below the button
        right: window.innerWidth - rect.right,          // align right edge
    }
    actionMenuId.value = actionMenuId.value === sub.id ? null : sub.id
}

// ─── Resend ───────────────────────────────────────────────────────────────────
const resendModal   = ref(null)
const resendingId   = ref(null)
const resendSuccess = ref(null)

function triggerResend(sub) {
    resendModal.value = sub
}

async function confirmResend() {
    const sub = resendModal.value
    if (!sub) return
    resendModal.value = null
    resendingId.value = sub.id
    resendSuccess.value = null

    try {
        const res = await fetch(`${FUNCTIONS_URL}/resendReport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection: sub.collection, docId: sub.id }),
        })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`)
        resendSuccess.value = sub.id
        setTimeout(() => { if (resendSuccess.value === sub.id) resendSuccess.value = null }, 4000)
    } catch (err) {
        alert(`Resend failed: ${err.message}`)
    } finally {
        resendingId.value = null
    }
}

// ─── Regenerate ───────────────────────────────────────────────────────────────
const regenModal   = ref(null)
const regenId      = ref(null)
const regenSuccess = ref(null)

function triggerRegen(sub) {
    regenModal.value = sub
}

async function confirmRegen() {
    const sub = regenModal.value
    if (!sub) return
    regenModal.value = null
    regenId.value = sub.id

    try {
        const res = await fetch(`${FUNCTIONS_URL}/regenerateReport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ collection: sub.collection, docId: sub.id }),
        })
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `HTTP ${res.status}`)
        regenSuccess.value = sub.id
        // Reload submissions so the status reflects "pending" / eventual "complete"
        setTimeout(() => loadSubmissions(), 2000)
        setTimeout(() => { if (regenSuccess.value === sub.id) regenSuccess.value = null }, 6000)
    } catch (err) {
        alert(`Regeneration failed: ${err.message}`)
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
</script>
