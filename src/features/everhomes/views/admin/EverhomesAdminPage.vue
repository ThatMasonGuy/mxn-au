<template>
    <LayoutComponent :header="true" :footer="true" :background="false" bg-style="linear-gradient(160deg, #101c2e 0%, #0b1525 48%, #070f1d 100%)">
        <div class="relative min-h-screen">

            <!-- Background -->
            <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div class="absolute inset-0" style="background: linear-gradient(160deg, #101c2e 0%, #0b1525 48%, #070f1d 100%);" />
                <div class="absolute inset-0" style="background-image: radial-gradient(circle, rgba(148,163,184,0.055) 1px, transparent 1px); background-size: 28px 28px;" />
                <div class="absolute top-0 inset-x-0 h-px" style="background: linear-gradient(to right, transparent 5%, rgba(20,184,166,0.4) 40%, rgba(34,211,238,0.3) 60%, transparent 95%);" />
            </div>

            <!-- ─── Page header ──────────────────────────────────────────────── -->
            <div class="relative pt-20 sm:pt-24 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div class="inline-flex items-center gap-1.5 text-xs font-medium text-teal-400 mb-2">
                            <ShieldCheck class="w-3.5 h-3.5" />
                            <span class="uppercase tracking-widest">Site Admin</span>
                        </div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Everhomes Admin</h1>
                        <p class="text-slate-400 text-sm mt-1">Submissions, datasets, and system management</p>
                    </div>

                    <button
                        @click="loadSubmissions"
                        :disabled="loading"
                        class="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05] text-xs font-medium transition-all"
                    >
                        <RefreshCw class="w-3.5 h-3.5" :class="loading ? 'animate-spin' : ''" />
                        Refresh
                    </button>
                </div>
            </div>

            <!-- ─── Stats row ───────────────────────────────────────────────── -->
            <div class="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div v-for="stat in stats" :key="stat.label" class="rounded-xl p-4 border" :style="{ background: '#0f1e30', borderColor: 'rgba(255,255,255,0.08)' }">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-7 h-7 rounded-lg flex items-center justify-center" :style="{ background: stat.bgColor }">
                                <component :is="stat.icon" class="w-3.5 h-3.5" :style="{ color: stat.color }" />
                            </div>
                            <span class="text-xs text-slate-500 font-medium">{{ stat.label }}</span>
                        </div>
                        <p class="text-2xl font-bold text-white tabular-nums">{{ stat.value }}</p>
                    </div>
                </div>
            </div>

            <!-- ─── Tabs ────────────────────────────────────────────────────── -->
            <div class="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">

                <div class="flex gap-1 mb-6 p-1 rounded-xl w-fit" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07)">
                    <button
                        v-for="tab in tabs" :key="tab.id"
                        @click="activeTab = tab.id"
                        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        :class="activeTab === tab.id
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : 'text-slate-400 hover:text-slate-200'"
                    >
                        <component :is="tab.icon" class="w-4 h-4" />
                        {{ tab.label }}
                        <span v-if="tab.id === 'submissions' && allSubmissions.length" class="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold" :class="activeTab === 'submissions' ? 'bg-teal-500/30 text-teal-300' : 'bg-white/10 text-slate-400'">
                            {{ allSubmissions.length }}
                        </span>
                    </button>
                </div>

                <!-- ── Submissions tab ──────────────────────────────────────── -->
                <div v-if="activeTab === 'submissions'">
                    <!-- Filter bar -->
                    <div class="flex flex-wrap items-center gap-2 mb-5">
                        <button
                            v-for="f in typeFilters" :key="f.id"
                            @click="typeFilter = f.id"
                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                            :class="typeFilter === f.id
                                ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                                : 'text-slate-400 hover:text-slate-200 border-white/[0.07] hover:border-white/15'"
                        >
                            <component :is="f.icon" class="w-3.5 h-3.5" />
                            {{ f.label }}
                        </button>

                        <div class="ml-auto flex items-center gap-2">
                            <button
                                v-for="s in statusFilters" :key="s.id"
                                @click="statusFilter = statusFilter === s.id ? 'all' : s.id"
                                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide transition-all border"
                                :class="statusFilter === s.id ? s.activeClass : 'text-slate-500 border-white/[0.07] hover:border-white/15'"
                            >
                                {{ s.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Click-away trap for action dropdowns — always in the DOM, only catches clicks when a menu is open -->
                    <div
                        class="fixed inset-0 z-10"
                        :class="actionMenuId ? '' : 'pointer-events-none'"
                        @click="actionMenuId = null"
                    />

                    <!-- Loading state -->
                    <div v-if="loading" class="flex items-center justify-center py-20 gap-3 text-slate-500">
                        <Loader2 class="w-5 h-5 animate-spin" />
                        <span class="text-sm">Loading submissions…</span>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="!filteredSubmissions.length" class="flex flex-col items-center justify-center py-20 text-center gap-3">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-1" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">
                            <Inbox class="w-5 h-5 text-slate-600" />
                        </div>
                        <p class="text-slate-400 font-medium">No submissions found</p>
                        <p class="text-slate-600 text-sm">Try changing the filters</p>
                    </div>

                    <!-- Submissions list -->
                    <div v-else class="flex flex-col gap-3">
                        <div
                            v-for="sub in filteredSubmissions"
                            :key="sub.id"
                            class="rounded-xl overflow-hidden transition-all"
                            style="background: #0f1e30; border: 1px solid rgba(255,255,255,0.08);"
                        >
                            <!-- Top accent strip with type color -->
                            <div class="h-0.5 w-full" :style="{ background: sub.collection === 'inspections' ? 'linear-gradient(to right, #14b8a6, rgba(20,184,166,0.2))' : 'linear-gradient(to right, #06b6d4, rgba(6,182,212,0.2))' }" />

                            <div class="p-4 sm:p-5">
                                <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">

                                    <!-- Icon -->
                                    <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 hidden sm:flex" :style="{ background: sub.collection === 'inspections' ? 'rgba(20,184,166,0.12)' : 'rgba(6,182,212,0.12)', border: sub.collection === 'inspections' ? '1px solid rgba(20,184,166,0.2)' : '1px solid rgba(6,182,212,0.2)' }">
                                        <component :is="sub.collection === 'inspections' ? ClipboardCheck : ClipboardList" class="w-5 h-5" :style="{ color: sub.collection === 'inspections' ? '#14b8a6' : '#06b6d4' }" />
                                    </div>

                                    <!-- Content -->
                                    <div class="flex-1 min-w-0">
                                        <div class="flex flex-wrap items-center gap-2 mb-1">
                                            <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" :style="sub.collection === 'inspections' ? 'background: rgba(20,184,166,0.12); color: #14b8a6; border: 1px solid rgba(20,184,166,0.2)' : 'background: rgba(6,182,212,0.12); color: #06b6d4; border: 1px solid rgba(6,182,212,0.2)'">
                                                {{ sub.collection === 'inspections' ? 'Inspection' : 'Handover' }}
                                            </span>
                                            <StatusBadge :status="sub.status" />
                                        </div>

                                        <p class="text-white font-semibold text-sm truncate mb-0.5">{{ sub.propertyAddress || 'Unknown Property' }}</p>
                                        <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                                            <span v-if="sub.inspectorName" class="flex items-center gap-1">
                                                <User class="w-3 h-3" />{{ sub.inspectorName }}
                                            </span>
                                            <span v-if="sub.inspectionDate" class="flex items-center gap-1">
                                                <Calendar class="w-3 h-3" />{{ sub.inspectionDate }}
                                            </span>
                                            <span v-if="sub.createdAt" class="flex items-center gap-1">
                                                <Clock class="w-3 h-3" />Submitted {{ formatRelative(sub.createdAt) }}
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                                        <a
                                            v-if="sub.pdfUrl"
                                            :href="sub.pdfUrl"
                                            target="_blank"
                                            rel="noopener"
                                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-300 hover:text-white hover:bg-white/[0.07]"
                                            style="border: 1px solid rgba(255,255,255,0.1)"
                                        >
                                            <FileText class="w-3.5 h-3.5" />
                                            PDF
                                        </a>
                                        <a
                                            v-if="sub.photosDownloadUrl"
                                            :href="sub.photosDownloadUrl"
                                            target="_blank"
                                            rel="noopener"
                                            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-slate-300 hover:text-white hover:bg-white/[0.07]"
                                            style="border: 1px solid rgba(255,255,255,0.1)"
                                        >
                                            <FolderArchive class="w-3.5 h-3.5" />
                                            Photos
                                        </a>
                                        <!-- Split resend/regenerate button — show when PDF exists OR a payload is stored (regen available) -->
                                        <div
                                            v-if="sub.pdfUrl || sub.submissionPayload"
                                            class="relative flex"
                                        >
                                            <!-- Main resend button — only active when PDF exists -->
                                            <button
                                                @click="triggerResend(sub)"
                                                :disabled="!sub.pdfUrl || resendingId === sub.id || regenId === sub.id"
                                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-l-lg text-xs font-medium transition-all disabled:opacity-50"
                                                :class="resendSuccess === sub.id ? 'text-teal-300 bg-teal-500/10 border-teal-500/30' : 'text-slate-300 hover:text-white hover:bg-white/[0.07]'"
                                                style="border: 1px solid rgba(255,255,255,0.1); border-right: none;"
                                            >
                                                <Loader2 v-if="resendingId === sub.id" class="w-3.5 h-3.5 animate-spin" />
                                                <CheckCheck v-else-if="resendSuccess === sub.id" class="w-3.5 h-3.5" />
                                                <SendHorizontal v-else class="w-3.5 h-3.5" />
                                                {{ resendSuccess === sub.id ? 'Sent!' : resendingId === sub.id ? 'Sending…' : 'Resend' }}
                                            </button>
                                            <!-- Dropdown chevron -->
                                            <button
                                                @click.stop="actionMenuId = actionMenuId === sub.id ? null : sub.id"
                                                :disabled="resendingId === sub.id || regenId === sub.id"
                                                class="flex items-center justify-center px-1.5 py-1.5 rounded-r-lg text-slate-500 hover:text-white hover:bg-white/[0.07] transition-all disabled:opacity-50"
                                                style="border: 1px solid rgba(255,255,255,0.1);"
                                            >
                                                <ChevronDown class="w-3 h-3" />
                                            </button>
                                            <!-- Dropdown menu -->
                                            <Transition
                                                enter-active-class="transition duration-100 ease-out"
                                                enter-from-class="opacity-0 scale-95"
                                                enter-to-class="opacity-100 scale-100"
                                                leave-active-class="transition duration-75 ease-in"
                                                leave-from-class="opacity-100 scale-100"
                                                leave-to-class="opacity-0 scale-95"
                                            >
                                                <div
                                                    v-if="actionMenuId === sub.id"
                                                    class="absolute right-0 top-full mt-1 z-20 rounded-xl overflow-hidden shadow-2xl min-w-[160px]"
                                                    style="background: #0f1e30; border: 1px solid rgba(255,255,255,0.12);"
                                                >
                                                    <button
                                                        @click="triggerResend(sub); actionMenuId = null"
                                                        class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                                                    >
                                                        <SendHorizontal class="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                                        Resend email
                                                    </button>
                                                    <div style="height:1px; background: rgba(255,255,255,0.06);" />
                                                    <button
                                                        @click="triggerRegen(sub); actionMenuId = null"
                                                        :disabled="!sub.submissionPayload"
                                                        class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors text-left disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <RotateCcw class="w-3.5 h-3.5 text-violet-400 shrink-0" :class="regenId === sub.id ? 'animate-spin' : ''" />
                                                        <span>
                                                            Regenerate report
                                                            <span v-if="!sub.submissionPayload" class="block text-[10px] text-slate-600 mt-0.5">No stored payload</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </Transition>
                                        </div>
                                    </div>
                                </div>

                                <!-- Error message -->
                                <div v-if="sub.status === 'failed' && sub.error" class="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg" style="background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2)">
                                    <AlertCircle class="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                    <p class="text-xs text-red-400">{{ sub.error }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ── SDA Dataset tab ──────────────────────────────────────── -->
                <div v-if="activeTab === 'sda'">
                    <div class="grid lg:grid-cols-2 gap-6">

                        <!-- Current dataset card -->
                        <div class="rounded-xl p-5 border" style="background: #0f1e30; border-color: rgba(255,255,255,0.08)">
                            <div class="flex items-center gap-2 mb-4">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.2)">
                                    <Database class="w-4 h-4 text-violet-400" />
                                </div>
                                <h2 class="text-white font-semibold text-sm">Current SDA Dataset</h2>
                            </div>

                            <div v-if="sdaStore.loading" class="flex items-center gap-2 py-4 text-slate-500">
                                <Loader2 class="w-4 h-4 animate-spin" />
                                <span class="text-sm">Loading…</span>
                            </div>

                            <div v-else-if="sdaStore.config" class="space-y-3">
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="rounded-lg p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07)">
                                        <p class="text-xs text-slate-500 mb-1">Financial Year</p>
                                        <p class="text-white font-semibold text-sm">{{ sdaStore.config.financialYear }}</p>
                                    </div>
                                    <div class="rounded-lg p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07)">
                                        <p class="text-xs text-slate-500 mb-1">Imported</p>
                                        <p class="text-white font-semibold text-sm">{{ formatDate(sdaStore.config.importedAt) }}</p>
                                    </div>
                                    <div class="rounded-lg p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07)">
                                        <p class="text-xs text-slate-500 mb-1">Imported By</p>
                                        <p class="text-white font-semibold text-sm truncate">{{ sdaStore.config.importedBy ?? '—' }}</p>
                                    </div>
                                    <div class="rounded-lg p-3" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07)">
                                        <p class="text-xs text-slate-500 mb-1">Source File</p>
                                        <p class="text-white font-semibold text-sm truncate" :title="sdaStore.config.sourceFile">{{ sdaStore.config.sourceFile ?? '—' }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-1.5 px-3 py-2 rounded-lg" style="background: rgba(20,184,166,0.08); border: 1px solid rgba(20,184,166,0.2)">
                                    <CheckCircle2 class="w-3.5 h-3.5 text-teal-400 shrink-0" />
                                    <span class="text-xs text-teal-300">Dataset is active and serving all users</span>
                                </div>
                            </div>

                            <div v-else class="flex flex-col items-center justify-center py-8 text-center gap-2">
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">
                                    <DatabaseZap class="w-5 h-5 text-slate-600" />
                                </div>
                                <p class="text-slate-400 text-sm font-medium">No dataset loaded</p>
                                <p class="text-slate-600 text-xs">Upload the NDIS SDA Price Calculator to get started</p>
                            </div>
                        </div>

                        <!-- Upload card -->
                        <div class="rounded-xl p-5 border" style="background: #0f1e30; border-color: rgba(255,255,255,0.08)">
                            <div class="flex items-center gap-2 mb-4">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.2)">
                                    <Upload class="w-4 h-4 text-violet-400" />
                                </div>
                                <div>
                                    <h2 class="text-white font-semibold text-sm">Update Dataset</h2>
                                    <p class="text-slate-500 text-xs">NDIS SDA Price Calculator (.xlsx)</p>
                                </div>
                            </div>

                            <!-- Drop zone -->
                            <div
                                v-if="!uploadPreview && uploadStatus !== 'parsing'"
                                @dragover.prevent="dragOver = true"
                                @dragleave="dragOver = false"
                                @drop.prevent="onDrop"
                                @click="fileInputRef?.click()"
                                class="rounded-xl py-10 px-6 text-center cursor-pointer transition-all"
                                :style="dragOver
                                    ? 'background: rgba(139,92,246,0.12); border: 2px dashed rgba(139,92,246,0.6);'
                                    : 'background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.1);'"
                                :class="dragOver ? '' : 'hover:border-violet-500/40 hover:bg-violet-500/5'"
                            >
                                <FileSpreadsheet class="w-9 h-9 mx-auto text-slate-600 mb-3" />
                                <p class="text-sm text-slate-300 font-medium">Drop the Excel file here</p>
                                <p class="text-xs text-slate-600 mt-1">NDIS SDA Price Calculator 20XX–XX.xlsx</p>
                                <input ref="fileInputRef" type="file" accept=".xlsx" class="hidden" @change="onFileSelect" />
                            </div>

                            <!-- Parsing spinner -->
                            <div v-if="uploadStatus === 'parsing'" class="flex items-center justify-center gap-3 py-10 text-slate-400">
                                <Loader2 class="w-5 h-5 animate-spin text-violet-400" />
                                <span class="text-sm">Parsing spreadsheet…</span>
                            </div>

                            <!-- Preview -->
                            <div v-if="uploadPreview" class="space-y-4">
                                <div
                                    class="rounded-xl p-4 space-y-2"
                                    :style="uploadPreview.valid
                                        ? 'background: rgba(20,184,166,0.06); border: 1px solid rgba(20,184,166,0.25)'
                                        : 'background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.25)'"
                                >
                                    <div class="flex items-center gap-2">
                                        <CheckCircle2 v-if="uploadPreview.valid" class="w-4 h-4 text-teal-400 shrink-0" />
                                        <AlertTriangle v-else class="w-4 h-4 text-amber-400 shrink-0" />
                                        <p class="text-sm font-semibold" :class="uploadPreview.valid ? 'text-teal-300' : 'text-amber-300'">
                                            {{ uploadPreview.valid ? 'Ready to import' : 'Warnings detected — review before importing' }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-2 gap-x-6 gap-y-1 mt-2">
                                        <div class="flex items-center justify-between text-xs">
                                            <span class="text-slate-500">Financial year</span>
                                            <span class="text-white font-medium">{{ uploadPreview.financialYear }}</span>
                                        </div>
                                        <div class="flex items-center justify-between text-xs">
                                            <span class="text-slate-500">Benchmark tables</span>
                                            <span class="text-white font-medium">8</span>
                                        </div>
                                        <div class="flex items-center justify-between text-xs">
                                            <span class="text-slate-500">SA4 regions</span>
                                            <span class="text-white font-medium">{{ uploadPreview.locationFactors.newBuild.length }}</span>
                                        </div>
                                        <div class="flex items-center justify-between text-xs">
                                            <span class="text-slate-500">MRRC (single)</span>
                                            <span class="text-white font-medium">{{ formatCurrency(uploadPreview.mrrc?.single?.perAnnum) }}/yr</span>
                                        </div>
                                    </div>
                                    <ul v-if="uploadPreview.warnings?.length" class="mt-2 space-y-1">
                                        <li v-for="w in uploadPreview.warnings" :key="w" class="flex items-start gap-1.5 text-xs text-amber-400">
                                            <AlertTriangle class="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                            {{ w }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="flex gap-3">
                                    <button
                                        @click="confirmUpload"
                                        :disabled="sdaStore.uploading"
                                        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                                        style="background: rgba(139,92,246,0.8); border: 1px solid rgba(139,92,246,0.6);"
                                        :class="!sdaStore.uploading ? 'hover:bg-violet-500/90' : ''"
                                    >
                                        <Loader2 v-if="sdaStore.uploading" class="w-4 h-4 animate-spin" />
                                        <CloudUpload v-else class="w-4 h-4" />
                                        {{ sdaStore.uploading ? 'Saving…' : 'Save to Firebase' }}
                                    </button>
                                    <button
                                        @click="cancelUpload"
                                        class="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all"
                                        style="border: 1px solid rgba(255,255,255,0.1)"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <p v-if="sdaStore.error" class="text-xs text-red-400">{{ sdaStore.error }}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <!-- Resend confirm modal — inside LayoutComponent so component has a single root -->
        <Teleport to="body">
        <Transition
            enter-active-class="transition duration-150"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-100"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="resendModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
                <div class="w-full max-w-md rounded-2xl p-6" style="background: #0f1e30; border: 1px solid rgba(255,255,255,0.12)">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: rgba(20,184,166,0.12); border: 1px solid rgba(20,184,166,0.2)">
                            <SendHorizontal class="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                            <h3 class="text-white font-semibold text-base">Resend Report</h3>
                            <p class="text-slate-500 text-xs">Re-email the existing PDF to all recipients</p>
                        </div>
                    </div>

                    <div class="rounded-xl p-3 mb-4" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)">
                        <p class="text-white text-sm font-medium mb-0.5">{{ resendModal.propertyAddress }}</p>
                        <p class="text-slate-400 text-xs">
                            {{ resendModal.collection === 'inspections' ? 'Inspection' : 'Handover' }}
                            · {{ resendModal.inspectionDate }}
                        </p>
                        <div v-if="resendModal.emailsSent?.length" class="mt-2 flex flex-wrap gap-1.5">
                            <span v-for="email in resendModal.emailsSent" :key="email" class="text-[10px] px-2 py-0.5 rounded-full text-slate-400" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08)">
                                {{ email }}
                            </span>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button
                            @click="confirmResend"
                            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                            style="background: rgba(20,184,166,0.7); border: 1px solid rgba(20,184,166,0.5)"
                        >
                            <SendHorizontal class="w-4 h-4" />
                            Resend Now
                        </button>
                        <button
                            @click="resendModal = null"
                            class="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all"
                            style="border: 1px solid rgba(255,255,255,0.1)"
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
            <div v-if="regenModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px)">
                <div class="w-full max-w-md rounded-2xl p-6" style="background: #0f1e30; border: 1px solid rgba(255,255,255,0.12)">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.2)">
                            <RotateCcw class="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h3 class="text-white font-semibold text-base">Regenerate Report</h3>
                            <p class="text-slate-500 text-xs">Rebuild the PDF from stored data and resend emails</p>
                        </div>
                    </div>

                    <div class="rounded-xl p-3 mb-3" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07)">
                        <p class="text-white text-sm font-medium mb-0.5">{{ regenModal.propertyAddress }}</p>
                        <p class="text-slate-400 text-xs">
                            {{ regenModal.collection === 'inspections' ? 'Inspection' : 'Handover' }}
                            · {{ regenModal.inspectionDate }}
                        </p>
                    </div>

                    <!-- Warning -->
                    <div class="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4" style="background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2)">
                        <AlertTriangle class="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <p class="text-xs text-amber-300 leading-relaxed">
                            This will <strong>overwrite the existing PDF</strong>, unpack the photos ZIP back into storage, re-run the full report pipeline, and re-send emails to all original recipients.
                        </p>
                    </div>

                    <div class="flex gap-3">
                        <button
                            @click="confirmRegen"
                            class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
                            style="background: rgba(139,92,246,0.7); border: 1px solid rgba(139,92,246,0.5)"
                        >
                            <RotateCcw class="w-4 h-4" />
                            Regenerate
                        </button>
                        <button
                            @click="regenModal = null"
                            class="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-all"
                            style="border: 1px solid rgba(255,255,255,0.1)"
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
import { ref, computed, onMounted, defineComponent, h } from 'vue'
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

// ─── Resend ───────────────────────────────────────────────────────────────────
const resendModal   = ref(null)
const resendingId   = ref(null)
const resendSuccess = ref(null)
const actionMenuId  = ref(null)   // which card has its dropdown open

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
