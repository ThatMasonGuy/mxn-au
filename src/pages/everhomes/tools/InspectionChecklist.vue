<template>
    <LayoutComponent :header="true" :footer="true">

        <!-- ── Top bar ──────────────────────────────────────────────────── -->
        <div class="bg-slate-900 border-b border-slate-800">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-3">
                <span class="text-xs font-black tracking-wider text-violet-400 uppercase">Everhomes</span>
                <span class="text-slate-700">|</span>
                <span class="text-xs font-semibold text-slate-400">Property Inspection</span>
            </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════════ -->
        <!--  STEP 1 — PROPERTY SETUP                                       -->
        <!-- ══════════════════════════════════════════════════════════════ -->
        <div class="">
            <div class="bg-gradient-to-r from-violet-700 to-fuchsia-600 px-4 sm:px-6 lg:px-8 pt-8 pb-10">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">Set Up Your Property
                    </h1>
                    <p class="text-violet-200 text-sm mt-1 font-medium">Configure rooms, select areas, and choose the
                        report type.</p>
                </div>
            </div>

            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-8">
                <div class="bg-white rounded-2xl shadow-xl shadow-black/15 overflow-hidden">

                    <!-- Report type selector -->
                    <div class="bg-violet-50 border-b border-violet-100 px-5 py-4">
                        <p class="text-[0.65rem] font-black text-violet-600 uppercase tracking-widest mb-2.5">Report
                            Type</p>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <button v-for="rt in REPORT_TYPES" :key="rt.key" @click="reportSubtype = rt.key"
                                class="px-3 py-2.5 rounded-xl border-2 text-sm font-bold text-left transition-all duration-150"
                                :class="reportSubtype === rt.key
                                    ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'">
                                {{ rt.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Address + date + housing officer -->
                    <div class="bg-slate-50 border-b border-slate-200 px-5 py-4 space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="block text-[0.65rem] font-black text-violet-600 uppercase tracking-widest mb-1">Property
                                    Address</label>
                                <input v-model="propertyAddress" type="text" placeholder="123 Example St, Suburb"
                                    class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                                    :class="setupErrors.address ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'" />
                                <p v-if="setupErrors.address" class="text-rose-500 text-[0.65rem] font-bold mt-1">
                                    Property address is required</p>
                            </div>
                            <div class="min-w-0 overflow-hidden">
                                <label
                                    class="block text-[0.65rem] font-black text-violet-600 uppercase tracking-widest mb-1">Inspection
                                    Date</label>
                                <input v-model="inspectionDate" type="date"
                                    class="w-full max-w-full min-w-0 bg-white border border-slate-200 text-slate-800 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 transition appearance-none" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="block text-[0.65rem] font-black text-violet-600 uppercase tracking-widest mb-1">Everhomes
                                    Staff Name</label>
                                <input v-model="inspectorName" type="text" placeholder="Jane Smith"
                                    class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                                    :class="setupErrors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'" />
                                <p v-if="setupErrors.name" class="text-rose-500 text-[0.65rem] font-bold mt-1">Staff
                                    name is required</p>
                            </div>
                            <div>
                                <label
                                    class="block text-[0.65rem] font-black text-violet-600 uppercase tracking-widest mb-1">Everhomes
                                    Staff Email</label>
                                <input v-model="inspectorEmail" type="email" placeholder="name@everhomes.com.au"
                                    class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                                    :class="setupErrors.email ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'" />
                                <p v-if="setupErrors.email" class="text-rose-500 text-[0.65rem] font-bold mt-1">Staff
                                    email is required</p>
                            </div>
                        </div>
                        <p class="text-[0.6rem] text-slate-400 -mt-1">This is the person completing the form. These
                            details appear on the report and signature page.</p>
                    </div>

                    <div class="px-5 py-6 space-y-8">

                        <!-- Bedrooms -->
                        <div>
                            <div class="flex items-center justify-between mb-4">
                                <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Bedrooms</p>
                                <div class="flex items-center gap-3">
                                    <button @click="removeBedroom" :disabled="bedrooms.length <= 1"
                                        class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all text-lg font-bold leading-none">−</button>
                                    <span class="text-slate-800 font-black text-xl w-4 text-center tabular-nums">{{
                                        bedrooms.length }}</span>
                                    <button @click="addBedroom"
                                        class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 flex items-center justify-center transition-all text-lg font-bold leading-none">+</button>
                                </div>
                            </div>
                            <div class="space-y-2.5">
                                <div v-for="(bed, i) in bedrooms" :key="bed.id" class="flex items-center gap-2">
                                    <input v-model="bed.name" type="text" :placeholder="`Bedroom ${i + 1}`"
                                        class="flex-1 min-w-0 bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 transition" />
                                    <button @click="bed.hasEnsuite = !bed.hasEnsuite"
                                        class="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-150"
                                        :class="bed.hasEnsuite ? 'bg-teal-500 border-teal-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'">
                                        <div class="w-3.5 h-3.5 rounded border-2 flex items-center justify-center shrink-0"
                                            :class="bed.hasEnsuite ? 'bg-white/30 border-white/70' : 'border-slate-300'">
                                            <Check v-if="bed.hasEnsuite" class="w-2.5 h-2.5 text-white" />
                                        </div>
                                        Has ensuite
                                    </button>
                                    <button @click="bed.isOOA = !bed.isOOA"
                                        class="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-150"
                                        :class="bed.isOOA ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'">
                                        <ShieldCheck class="w-3.5 h-3.5 shrink-0" />OOA
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Bathrooms -->
                        <div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Standalone
                                        Bathrooms</p>
                                    <p class="text-[0.68rem] text-slate-400 font-medium mt-0.5">Not counting ensuites
                                        above</p>
                                </div>
                                <div class="flex items-center gap-3">
                                    <button @click="bathrooms = Math.max(0, bathrooms - 1)" :disabled="bathrooms <= 0"
                                        class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all text-lg font-bold leading-none">−</button>
                                    <span class="text-slate-800 font-black text-xl w-4 text-center tabular-nums">{{
                                        bathrooms }}</span>
                                    <button @click="bathrooms++"
                                        class="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-violet-400 hover:text-violet-600 flex items-center justify-center transition-all text-lg font-bold leading-none">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- Core sections (always included) -->
                        <div>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Core Sections
                            </p>
                            <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Always included in every
                                inspection</p>
                            <div class="flex flex-wrap gap-2">
                                <div v-for="s in CORE_SECTIONS" :key="s.key"
                                    class="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-white border-transparent shadow-sm"
                                    :style="{ backgroundColor: s.color }">
                                    <Check class="w-3 h-3 opacity-60" />
                                    {{ s.label }}
                                </div>
                            </div>
                        </div>

                        <!-- Optional areas -->
                        <div>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Optional Areas
                            </p>
                            <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Add any that apply to this
                                property</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <button v-for="area in OPTIONAL_AREAS" :key="area.key" @click="toggleOptional(area.key)"
                                    class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-150 border"
                                    :class="selectedOptional.has(area.key) ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                                    :style="selectedOptional.has(area.key) ? { backgroundColor: area.color } : {}">
                                    <div class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                                        :class="selectedOptional.has(area.key) ? 'bg-white/25 border-white/60' : 'border-slate-300'">
                                        <Check v-if="selectedOptional.has(area.key)" class="w-2.5 h-2.5 text-white" />
                                    </div>
                                    {{ area.label }}
                                </button>
                            </div>
                        </div>

                        <button @click="tryStartInspection"
                            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-150">
                            {{ checklistRooms.length ? 'Rebuild Checklist →' : 'Start Inspection →' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════════ -->
        <!--  STEP 2 — CHECKLIST                                            -->
        <!-- ══════════════════════════════════════════════════════════════ -->
        <div data-checklist class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

            <div v-if="checklistRooms.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
                <div
                    class="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <ClipboardCheck class="w-7 h-7 text-violet-400" />
                </div>
                <p class="text-sm font-semibold text-slate-400">Configure your property above<br><span
                        class="text-slate-500 font-normal">then hit Start Inspection.</span></p>
            </div>

            <template v-else>
                <!-- Image compression warning -->
                <div
                    class="mb-4 flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl">
                    <AlertTriangle class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p class="text-xs text-amber-300/90 font-medium leading-relaxed">Room photos are <span class="font-bold text-amber-200">compressed</span> for the report. Use the Marketing Photos section below for uncompressed hero shots.</p>
                </div>

                <!-- Marketing photos toggle -->
                <div class="mb-4 flex items-center justify-between px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <div class="flex items-center gap-2.5">
                        <Images class="w-4 h-4 text-violet-400" />
                        <div>
                            <p class="text-xs font-bold text-white">Marketing Photos</p>
                            <p class="text-[0.6rem] text-slate-500">Hero shots for listings — uploaded uncompressed</p>
                        </div>
                    </div>
                    <button @click="showMarketing = !showMarketing"
                        class="w-10 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5"
                        :class="showMarketing ? 'bg-violet-600' : 'bg-slate-700'">
                        <div class="w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                            :class="showMarketing ? 'translate-x-4' : 'translate-x-0'" />
                    </button>
                </div>

                <!-- Status legend -->
                <div class="mb-4 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2.5">Status Guide
                    </p>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                        <div class="flex items-start gap-2">
                            <CheckCircle class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-px" />
                            <div class="-mt-2">
                                <span class="text-xs font-bold text-emerald-400 leading-none">Good</span>
                                <p class="text-[0.6rem] text-slate-500 leading-tight mt-0.5">Item is in acceptable
                                    condition</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <AlertTriangle class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-px" />
                            <div class="-mt-2">
                                <span class="text-xs font-bold text-amber-400 leading-none">Attention</span>
                                <p class="text-[0.6rem] text-slate-500 leading-tight mt-0.5">Minor issue — note for
                                    follow-up</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <XCircle class="w-3.5 h-3.5 text-rose-400 shrink-0 mt-px" />
                            <div class="-mt-2">
                                <span class="text-xs font-bold text-rose-400 leading-none">Issue</span>
                                <p class="text-[0.6rem] text-slate-500 leading-tight mt-0.5">Requires action or repair
                                </p>
                            </div>
                        </div>
                        <div class="flex items-start gap-2">
                            <MinusCircle class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-px" />
                            <div class="-mt-2">
                                <span class="text-xs font-bold text-slate-400 leading-none">N/A</span>
                                <p class="text-[0.6rem] text-slate-500 leading-tight mt-0.5">Not applicable to this
                                    property</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Header + progress -->
                <div class="mb-5">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-base font-black text-white tracking-tight">Inspection Checklist</h2>
                        <div class="flex items-center gap-2">
                            <button @click="confirmClear.open = true"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-400 hover:border-rose-500/50 hover:text-rose-400 hover:bg-rose-500/5 text-xs font-bold transition-all">
                                <Trash2 class="w-3.5 h-3.5" />Clear
                            </button>
                            <button @click="openSubmit"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md transition-all">
                                <Send class="w-3.5 h-3.5" />Submit
                            </button>
                        </div>
                    </div>
                    <div class="h-2 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                        <div class="h-full rounded-full transition-all duration-700"
                            :style="{ width: progressPercent + '%', background: progressGradient }" />
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-slate-500 font-medium">{{ inspectedCount }} / {{ checklistRooms.length
                        }} rooms done</span>
                        <span class="flex items-center gap-1 text-[0.65rem] font-semibold text-slate-600">
                            <Save class="w-3 h-3" />Auto-saved
                        </span>
                    </div>
                </div>

                <!-- Room accordion -->
                <div class="space-y-2">
                    <div v-for="(room, idx) in checklistRooms" :key="room.id"
                        class="rounded-2xl overflow-hidden border-2 transition-colors duration-300"
                        :style="accordionBorderStyle(room.id)">

                        <button @click="toggleRoom(idx)"
                            class="w-full flex items-center gap-3 px-4 py-3.5 text-left focus:outline-none transition-colors">
                            <div class="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white shadow-sm"
                                :style="{ background: ROOM_META[room.type]?.gradient ?? ROOM_META.bedroom.gradient }">
                                <component :is="ROOM_META[room.type]?.icon ?? Moon" class="w-4 h-4" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="text-white font-bold text-sm leading-tight">{{ room.label }}</span>
                                    <span v-if="room.isOOA"
                                        class="inline-flex items-center gap-0.5 text-[0.58rem] font-black uppercase text-rose-400 bg-rose-500/15 border border-rose-500/25 px-1.5 py-0.5 rounded-full">
                                        <ShieldCheck class="w-2.5 h-2.5" />OOA
                                    </span>
                                    <span v-if="room.isEnsuite"
                                        class="text-[0.58rem] font-black uppercase text-sky-400 bg-sky-500/15 border border-sky-500/25 px-1.5 py-0.5 rounded-full">Ensuite</span>
                                </div>
                                <p class="text-xs mt-0.5">
                                    <span class="text-slate-500">{{ inspectionData[room.id]?.photos?.length ?? 0 }}
                                        photo{{ (inspectionData[room.id]?.photos?.length ?? 0) !== 1 ? 's' : '' }} ·
                                    </span>
                                    <span :style="{ color: statusColour(inspectionData[room.id]?.status) }">{{
                                        statusLabel(inspectionData[room.id]?.status) }}</span>
                                </p>
                            </div>
                            <div class="w-2 h-2 rounded-full shrink-0"
                                :style="{ background: statusColour(inspectionData[room.id]?.status) }"></div>
                            <ChevronDown class="w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200"
                                :class="{ 'rotate-180': openRooms.has(idx) }" />
                        </button>

                        <Transition enter-active-class="transition-all duration-300 ease-out"
                            leave-active-class="transition-all duration-200 ease-in"
                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[1200px]"
                            leave-from-class="opacity-100 max-h-[1200px]" leave-to-class="opacity-0 max-h-0">
                            <div v-if="openRooms.has(idx) && inspectionData[room.id]"
                                class="px-4 pb-5 pt-0 bg-slate-900/50 border-t border-slate-700/40 space-y-4">
                                <!-- Status — auto-computed from items; manual override shown only when all items are N/A -->
                                <div class="pt-4">
                                    <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Overall Status</p>
                                    <!-- All-NA override: show manual picker -->
                                    <template v-if="roomIsAllNA(room.id)">
                                        <p class="text-[0.65rem] text-amber-400 font-semibold mb-2">All items marked N/A
                                            — select an overall status manually:</p>
                                        <div class="flex flex-wrap gap-2">
                                            <button v-for="s in STATUS_OPTIONS" :key="s.value"
                                                @click="inspectionData[room.id].status = s.value"
                                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-150"
                                                :class="inspectionData[room.id].status === s.value ? s.activeClass : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-600'">
                                                <component :is="s.icon" class="w-3.5 h-3.5" />{{ s.label }}
                                            </button>
                                        </div>
                                    </template>
                                    <!-- Auto-computed status badge -->
                                    <template v-else>
                                        <div
                                            class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                            <component
                                                :is="STATUS_OPTIONS.find(s => s.value === (inspectionData[room.id].status || 'unchecked'))?.icon ?? MinusCircle"
                                                class="w-4 h-4 shrink-0"
                                                :style="{ color: statusColour(inspectionData[room.id].status) }" />
                                            <span class="text-sm font-bold"
                                                :style="{ color: statusColour(inspectionData[room.id].status) }">
                                                {{ statusLabel(inspectionData[room.id].status) }}
                                            </span>
                                            <span class="text-slate-600 text-xs ml-1">· auto-set from items</span>
                                        </div>
                                    </template>
                                </div>
                                <!-- Checklist Items -->
                                <div v-if="getChecklistGroups(room.type).length">
                                    <p
                                        class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2.5">
                                        Inspection Items</p>
                                    <div class="space-y-4">
                                        <div v-for="group in getChecklistGroups(room.type)" :key="group.group">
                                            <!-- Group header -->
                                            <div class="flex items-center gap-2 mb-1.5">
                                                <span v-if="group.sda"
                                                    class="text-[0.55rem] font-black uppercase tracking-wider text-violet-400 bg-violet-500/15 border border-violet-500/25 px-1.5 py-0.5 rounded-full">SDA</span>
                                                <span
                                                    class="text-[0.6rem] font-black text-slate-600 uppercase tracking-wider">{{
                                                        group.group }}</span>
                                            </div>
                                            <!-- Items -->
                                            <div class="space-y-0.5">
                                                <div v-for="item in group.items" :key="item.id"
                                                    class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors duration-150"
                                                    :class="item.type ? '' : itemRowClass(inspectionData[room.id].items?.[item.id])">

                                                    <!-- INPUT-TYPE ITEM (text/number) -->
                                                    <template v-if="item.type">
                                                        <span
                                                            class="flex-1 text-xs font-medium leading-tight text-slate-400">{{
                                                                item.label }}</span>
                                                        <input :type="item.type === 'number' ? 'number' : 'text'"
                                                            :value="inspectionData[room.id].inputs?.[item.id] ?? ''"
                                                            @input="setItemInput(room.id, item.id, $event.target.value)"
                                                            :placeholder="item.placeholder || ''"
                                                            class="w-36 shrink-0 bg-slate-800/60 border border-slate-700 text-white placeholder-slate-600 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
                                                    </template>

                                                    <!-- STATUS-CHECK ITEM (ok/attention/issue/na) -->
                                                    <template v-else>
                                                        <span
                                                            class="flex-1 text-xs font-medium leading-tight transition-colors duration-150"
                                                            :class="[
                                                                item.sda ? 'text-slate-300' : 'text-slate-400',
                                                                inspectionData[room.id].items?.[item.id] === 'na' ? 'line-through opacity-50' : '',
                                                                inspectionData[room.id].items?.[item.id] === 'issue' ? '!text-rose-300' : '',
                                                            ]">
                                                            {{ item.label }}
                                                        </span>
                                                        <!-- Status mini-buttons -->
                                                        <div class="flex items-center gap-0.5 shrink-0">
                                                            <button v-for="s in ITEM_STATUS_OPTIONS" :key="s.value"
                                                                @click="setItemStatus(room.id, item.id, s.value)"
                                                                :title="s.label"
                                                                class="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-100 border"
                                                                :class="inspectionData[room.id].items?.[item.id] === s.value
                                                                    ? s.activeClass
                                                                    : 'border-slate-700/60 text-slate-600 hover:border-slate-600 hover:text-slate-400 bg-transparent'">
                                                                <component :is="s.icon" class="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Notes -->
                                <div>
                                    <label
                                        class="block text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-1.5">Notes</label>
                                    <textarea v-model="inspectionData[room.id].notes" rows="3"
                                        placeholder="Add any observations, issues, or notes..."
                                        class="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-600 text-base sm:text-sm rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
                                </div>
                                <!-- Photos -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest">
                                            Photos</p>
                                        <button @click="openPhotoModal(idx)"
                                            class="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 px-2 py-1 rounded-lg hover:bg-violet-500/10 transition-colors">
                                            <Plus class="w-3.5 h-3.5" />Add Photo
                                        </button>
                                    </div>

                                    <div v-if="inspectionData[room.id].photos.length"
                                        class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        <div v-for="(photo, pIdx) in inspectionData[room.id].photos" :key="pIdx"
                                            class="flex flex-col gap-1">
                                            <div class="relative group aspect-square rounded-xl overflow-hidden border-2"
                                                :class="photo.uploadStatus === 'failed' ? 'border-rose-500/60' : photo.uploadStatus === 'uploading' ? 'border-violet-500/60' : 'border-slate-700/60'">

                                                <!-- Uploaded thumb or preview -->
                                                <img :src="photo.thumbUrl || photo.previewUrl"
                                                    :alt="photo.caption || 'Photo'"
                                                    class="w-full h-full object-cover" />

                                                <!-- Upload overlay -->
                                                <div v-if="photo.uploadStatus === 'uploading'"
                                                    class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                                    <div
                                                        class="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                    <span class="text-white text-[10px] font-bold">Uploading…</span>
                                                </div>

                                                <!-- Failed overlay -->
                                                <div v-else-if="photo.uploadStatus === 'failed'"
                                                    class="absolute inset-0 bg-rose-900/80 flex flex-col items-center justify-center gap-1.5 p-1">
                                                    <AlertTriangle class="w-4 h-4 text-rose-300" />
                                                    <span
                                                        class="text-[9px] font-bold text-rose-200 text-center leading-tight">Upload
                                                        failed</span>
                                                    <button @click.stop="retryPhotoUpload(room.id, pIdx)"
                                                        class="text-[10px] font-black text-white bg-rose-500 rounded-lg px-2 py-1 hover:bg-rose-400 transition-colors">
                                                        Tap to Retry
                                                    </button>
                                                </div>

                                                <!-- Skipped overlay -->
                                                <div v-else-if="photo.uploadStatus === 'skipped'"
                                                    class="absolute inset-0 bg-amber-900/70 flex flex-col items-center justify-center gap-1 p-1">
                                                    <AlertTriangle class="w-4 h-4 text-amber-300" />
                                                    <span
                                                        class="text-[9px] text-amber-200 font-bold text-center leading-tight">Send
                                                        manually</span>
                                                </div>

                                                <!-- Delete -->
                                                <button v-if="photo.uploadStatus !== 'uploading'"
                                                    @click.stop="removePhoto(room.id, pIdx)"
                                                    class="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X class="w-3 h-3 text-white" />
                                                </button>
                                                <!-- Edit caption -->
                                                <button v-if="photo.uploadStatus === 'done'"
                                                    @click.stop="openCaptionEdit(room.id, pIdx)"
                                                    class="absolute top-1 left-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Pencil class="w-2.5 h-2.5 text-white" />
                                                </button>
                                            </div>
                                            <!-- Caption byline -->
                                            <p v-if="photo.caption && photo.uploadStatus === 'done'"
                                                class="text-[10px] text-slate-500 font-medium leading-tight px-0.5 truncate">
                                                {{ photo.caption }}
                                            </p>
                                        </div>
                                        <button @click="openPhotoModal(idx)"
                                            class="aspect-square rounded-xl border-2 border-dashed border-slate-700 hover:border-violet-500/60 hover:bg-violet-500/5 flex items-center justify-center transition-colors group">
                                            <Plus
                                                class="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
                                        </button>
                                    </div>

                                    <div v-else @click="openPhotoModal(idx)"
                                        class="flex flex-col items-center justify-center h-20 rounded-xl border-2 border-dashed border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/5 cursor-pointer transition-colors gap-1.5 group">
                                        <Camera
                                            class="w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
                                        <p
                                            class="text-xs text-slate-600 group-hover:text-violet-400 transition-colors font-medium">
                                            Tap to add photos</p>
                                    </div>

                                    <!-- Skipped photos warning -->
                                    <div v-if="hasSkippedPhotos(room.id)"
                                        class="mt-2 flex items-start gap-2 px-3 py-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                                        <AlertTriangle class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                        <p class="text-xs text-amber-300 font-medium leading-tight">Some photos failed
                                            to upload. Please email them directly to <span
                                                class="font-black">admin@everhomes.com.au</span> with the
                                            property
                                            address and date.</p>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- ── Marketing Photos Section ─────────────────────────── -->
                <div v-if="showMarketing" class="mt-6 bg-gradient-to-b from-violet-900/20 to-slate-900/50 border border-violet-500/20 rounded-2xl overflow-hidden">
                    <div class="px-5 py-4 border-b border-violet-500/15 bg-violet-500/5">
                        <div class="flex items-center gap-2.5 mb-1">
                            <Images class="w-4 h-4 text-violet-400" />
                            <h3 class="text-sm font-black text-white">Marketing Photos</h3>
                        </div>
                        <p class="text-[0.65rem] text-slate-400 leading-relaxed">These hero shots are for marketing and listing purposes. They are uploaded <span class="font-bold text-violet-300">uncompressed</span> and will <span class="font-bold text-violet-300">not</span> appear in the compliance report.</p>
                    </div>
                    <div class="px-5 py-4 space-y-3">
                        <div v-for="slot in MARKETING_SLOTS" :key="slot.key"
                            class="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
                            <div class="flex items-center justify-between mb-2">
                                <div>
                                    <p class="text-xs font-bold text-white">{{ slot.label }}</p>
                                    <p class="text-[0.6rem] text-slate-500 mt-0.5">{{ slot.hint }}</p>
                                </div>
                                <label
                                    class="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 px-2 py-1 rounded-lg hover:bg-violet-500/10 transition-colors cursor-pointer">
                                    <Plus class="w-3.5 h-3.5" />Add
                                    <input type="file" accept="image/*" multiple class="hidden"
                                        @change="handleMarketingUpload(slot.key, $event)" />
                                </label>
                            </div>
                            <div v-if="(marketingPhotos[slot.key] ?? []).length" class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                <div v-for="(photo, mpIdx) in marketingPhotos[slot.key]" :key="mpIdx"
                                    class="relative group aspect-square rounded-xl overflow-hidden border-2"
                                    :class="photo.uploadStatus === 'uploading' ? 'border-violet-500/60' : photo.uploadStatus === 'failed' ? 'border-rose-500/60' : 'border-slate-700/60'">
                                    <img :src="photo.thumbUrl || photo.previewUrl" alt="" class="w-full h-full object-cover" />
                                    <div v-if="photo.uploadStatus === 'uploading'"
                                        class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                        <div class="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        <span class="text-white text-[10px] font-bold">Uploading…</span>
                                    </div>
                                    <div v-else-if="photo.uploadStatus === 'failed'"
                                        class="absolute inset-0 bg-rose-900/80 flex flex-col items-center justify-center gap-1 p-1">
                                        <AlertTriangle class="w-4 h-4 text-rose-300" />
                                        <span class="text-[9px] font-bold text-rose-200">Failed</span>
                                    </div>
                                    <button v-if="photo.uploadStatus !== 'uploading'" @click.stop="removeMarketingPhoto(slot.key, mpIdx)"
                                        class="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X class="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            </div>
                            <div v-else class="flex items-center justify-center h-16 rounded-xl border-2 border-dashed border-slate-700/50 text-slate-600 text-xs font-medium">
                                No photos yet
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bottom submit -->
                <div class="mt-6 pt-6 border-t border-slate-700/50">
                    <button @click="openSubmit"
                        class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-2">
                        <Send class="w-4 h-4" />Submit Inspection
                    </button>
                    <p class="text-center text-xs text-slate-600 font-medium mt-2">
                        {{ uninspectedCount > 0 ? `${uninspectedCount} room${uninspectedCount !== 1 ? 's' : ''} still
                        unchecked` : 'All rooms inspected ✓' }}
                    </p>
                </div>
            </template>
        </div>

        <!-- ══════════════════════════════════════════════════════════════ -->
        <!--  SUBMIT MODAL                                                   -->
        <!-- ══════════════════════════════════════════════════════════════ -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out"
                leave-active-class="transition duration-150 ease-in" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="submitModal.open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        @click="!submitModal.loading && !submitModal.done && (submitModal.open = false)" />

                    <Transition enter-active-class="transition duration-300 ease-out"
                        enter-from-class="opacity-0 translate-y-4 sm:scale-95"
                        enter-to-class="opacity-100 translate-y-0 sm:scale-100">
                        <div v-if="submitModal.open"
                            class="relative z-10 w-full sm:w-[500px] bg-slate-900 border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90dvh] overflow-y-auto">

                            <!-- Processing state -->
                            <div v-if="submitModal.loading"
                                class="flex flex-col items-center gap-5 px-6 py-12 text-center">
                                <div
                                    class="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
                                    <div
                                        class="w-8 h-8 rounded-full border-4 border-violet-500/30 border-t-violet-500 animate-spin" />
                                </div>
                                <div>
                                    <h3 class="text-white font-black text-lg">{{ submitModal.statusMessage }}</h3>
                                    <p class="text-slate-400 text-sm mt-1">This takes around 30–60 seconds. Don't close
                                        this
                                        page.</p>
                                </div>
                                <button v-if="submitModal.canFlush" @click="flushAndCheck"
                                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-sm transition-colors">
                                    <RefreshCw class="w-4 h-4" />Check Status
                                </button>
                            </div>

                            <!-- Done state -->
                            <div v-else-if="submitModal.done"
                                class="flex flex-col items-center gap-4 px-6 py-10 text-center">
                                <div
                                    class="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                                    <CheckCircle class="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 class="text-white font-black text-lg">Inspection Submitted</h3>
                                    <p class="text-slate-400 text-sm mt-1">Report emailed to admin{{ inspectorEmail ? `
                                        and
                                        ${inspectorEmail}` : '' }}.</p>
                                </div>
                                <a v-if="submitModal.pdfUrl" :href="submitModal.pdfUrl" target="_blank"
                                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors">
                                    <FileText class="w-4 h-4" />View PDF Report
                                </a>
                                <button @click="submitModal.open = false; submitModal.done = false"
                                    class="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-colors">
                                    Close
                                </button>
                            </div>

                            <!-- Error state -->
                            <div v-else-if="submitModal.error" class="px-6 py-8">
                                <div class="flex items-center gap-3 mb-4">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                                        <XCircle class="w-5 h-5 text-rose-400" />
                                    </div>
                                    <div>
                                        <h3 class="text-white font-black text-base">Submission Failed</h3>
                                        <p class="text-slate-400 text-xs mt-0.5">{{ submitModal.error }}</p>
                                    </div>
                                </div>
                                <div class="flex gap-3">
                                    <button @click="submitModal.open = false; submitModal.error = null"
                                        class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 text-sm font-bold transition-colors hover:border-slate-600">Cancel</button>
                                    <button @click="confirmSubmit"
                                        class="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-black transition-colors">
                                        Try Again
                                    </button>
                                </div>
                            </div>

                            <!-- Pre-submit summary -->
                            <template v-else>
                                <div class="px-5 pt-5 pb-0 flex items-start justify-between">
                                    <div>
                                        <h3 class="text-white font-black text-base">Submit Inspection</h3>
                                        <p class="text-slate-400 text-xs mt-0.5">{{ propertyAddress || 'Address not set'
                                        }} · {{ formatDate(inspectionDate) }}</p>
                                    </div>
                                    <button @click="submitModal.open = false"
                                        class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors shrink-0">
                                        <X class="w-4 h-4" />
                                    </button>
                                </div>

                                <div class="grid grid-cols-4 gap-2 px-5 pt-4">
                                    <div v-for="stat in submitStats" :key="stat.label"
                                        class="flex flex-col items-center gap-1 py-3 rounded-xl border"
                                        :style="{ borderColor: stat.color + '40', background: stat.color + '0D' }">
                                        <span class="text-lg font-black" :style="{ color: stat.color }">{{ stat.count
                                        }}</span>
                                        <span
                                            class="text-[0.6rem] font-bold text-slate-500 text-center leading-tight">{{
                                                stat.label }}</span>
                                    </div>
                                </div>

                                <div v-if="flaggedRooms.length" class="px-5 pt-4">
                                    <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Flagged Rooms</p>
                                    <div class="space-y-1.5">
                                        <div v-for="room in flaggedRooms" :key="room.id"
                                            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
                                            :style="flaggedRoomStyle(room.status)">
                                            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                                                :style="{ background: ROOM_META[room.type]?.gradient ?? ROOM_META.bedroom.gradient }">
                                                <component :is="ROOM_META[room.type]?.icon ?? Moon"
                                                    class="w-3.5 h-3.5" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-white text-xs font-bold leading-tight truncate">{{
                                                    room.label }}</p>
                                                <p class="text-xs mt-0.5" :style="{ color: statusColour(room.status) }">
                                                    {{ statusLabel(room.status) }}</p>
                                            </div>
                                            <component :is="room.status === 'issue' ? XCircle : AlertTriangle"
                                                class="w-4 h-4 shrink-0"
                                                :style="{ color: statusColour(room.status) }" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Uploading photos warning -->
                                <div v-if="hasAnyUploading"
                                    class="mx-5 mt-4 flex items-center gap-2.5 px-3.5 py-3 bg-violet-500/10 border border-violet-500/25 rounded-xl">
                                    <div
                                        class="w-3.5 h-3.5 rounded-full border-2 border-violet-400/30 border-t-violet-400 animate-spin shrink-0" />
                                    <p class="text-xs text-violet-300 font-semibold">Some photos are still uploading —
                                        please wait before submitting.</p>
                                </div>

                                <div v-if="uninspectedCount > 0"
                                    class="mx-5 mt-4 flex items-center gap-2.5 px-3.5 py-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                                    <AlertTriangle class="w-4 h-4 text-amber-400 shrink-0" />
                                    <p class="text-xs text-amber-300 font-semibold">{{ uninspectedCount }} room{{
                                        uninspectedCount !== 1 ? 's' : '' }} still unchecked — you can still submit.</p>
                                </div>

                                <!-- ── Signature Section ─────────────────────── -->
                                <div class="mx-5 mt-5 border border-slate-700 rounded-xl overflow-hidden">
                                    <div class="bg-slate-800/50 px-4 py-3 border-b border-slate-700">
                                        <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Staff Signature</p>
                                    </div>
                                    <div class="px-4 py-4 space-y-3">
                                        <div class="flex items-center justify-between text-xs">
                                            <span class="text-slate-400">{{ inspectorName || 'Staff name not set' }}</span>
                                            <span class="text-slate-500">{{ formatDate(inspectionDate) }}</span>
                                        </div>
                                        <div class="relative bg-white rounded-xl overflow-hidden" style="touch-action: none;">
                                            <canvas ref="staffSigCanvasRef" class="w-full" style="height: 140px;" />
                                            <button @click="clearStaffSignature"
                                                class="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold transition-colors">
                                                Clear
                                            </button>
                                        </div>
                                        <label class="flex items-start gap-2.5 cursor-pointer select-none">
                                            <input type="checkbox" v-model="signatureState.agreementChecked"
                                                class="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-0 shrink-0" />
                                            <span class="text-[0.65rem] text-slate-400 leading-relaxed">
                                                I, <span class="font-bold text-white">{{ inspectorName || '___' }}</span>, confirm that this inspection was completed on <span class="font-bold text-white">{{ formatDate(inspectionDate) || '___' }}</span> and that the information recorded is accurate to the best of my knowledge.
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <!-- ── Tenant Signatures (Entry/Exit only) ───── -->
                                <template v-if="reportSubtype === 'entry' || reportSubtype === 'exit'">
                                    <div class="mx-5 mt-4 border border-slate-700 rounded-xl overflow-hidden">
                                        <div class="bg-slate-800/50 px-4 py-3 border-b border-slate-700">
                                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Tenant Signatures</p>
                                            <p class="text-[0.6rem] text-slate-500 mt-0.5">Required for {{ reportSubtype }} reports — up to 3 tenants</p>
                                        </div>
                                        <div class="divide-y divide-slate-700/50">
                                            <div v-for="(tenant, tIdx) in signatureState.tenants" :key="tIdx" class="px-4 py-4 space-y-3">
                                                <div class="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label class="block text-[0.6rem] font-bold text-slate-500 uppercase mb-1">Tenant {{ tIdx + 1 }} Name</label>
                                                        <input v-model="tenant.name" type="text" placeholder="Full name"
                                                            class="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500" />
                                                    </div>
                                                    <div>
                                                        <label class="block text-[0.6rem] font-bold text-slate-500 uppercase mb-1">Date</label>
                                                        <input v-model="tenant.date" type="date"
                                                            class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none" />
                                                    </div>
                                                </div>
                                                <div class="relative bg-white rounded-xl overflow-hidden" style="touch-action: none;">
                                                    <canvas :ref="el => setTenantCanvasRef(tIdx, el)" class="w-full" style="height: 120px;" />
                                                    <button @click="clearTenantSignature(tIdx)"
                                                        class="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-bold transition-colors">
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>

                                <div class="flex gap-3 px-5 py-5">
                                    <button @click="submitModal.open = false"
                                        class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors">
                                        Back
                                    </button>
                                    <button @click="confirmSubmit" :disabled="hasAnyUploading || !canSubmit"
                                        class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                                        <Send class="w-4 h-4" />Confirm &amp; Submit
                                    </button>
                                </div>
                            </template>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

        <!-- ══════════════════════════════════════════════════════════════ -->
        <!--  CLEAR CONFIRM                                                  -->
        <!-- ══════════════════════════════════════════════════════════════ -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out"
                leave-active-class="transition duration-150 ease-in" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="confirmClear.open" class="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="confirmClear.open = false" />
                    <div
                        class="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-center">
                        <div
                            class="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center mx-auto mb-4">
                            <Trash2 class="w-6 h-6 text-rose-400" />
                        </div>
                        <h3 class="text-white font-black text-base mb-1">Clear Checklist?</h3>
                        <p class="text-slate-400 text-sm mb-5">All inspection data, statuses, notes, property setup, and
                            photos will be removed.</p>
                        <div class="flex gap-3">
                            <button @click="confirmClear.open = false"
                                class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors">Cancel</button>
                            <button @click="clearChecklist"
                                class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-black transition-colors">Yes,
                                Clear It</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ── Photo Modal ──────────────────────────────────────────────── -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out"
                leave-active-class="transition duration-150 ease-in" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="photoModal.open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closePhotoModal" />
                    <Transition enter-active-class="transition duration-300 ease-out"
                        enter-from-class="opacity-0 translate-y-4 sm:scale-95"
                        enter-to-class="opacity-100 translate-y-0 sm:scale-100">
                        <div v-if="photoModal.open"
                            class="relative z-10 w-full sm:w-[460px] bg-slate-900 border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl p-5 max-h-[90dvh] overflow-y-auto">
                            <div class="flex items-center justify-between mb-5">
                                <div>
                                    <h2 class="text-white font-extrabold text-base">{{ photoModal.queue.length > 0 ?
                                        `Label
                                        Photo ${photoModal.queueIndex + 1} of ${photoModal.queue.length}` : 'Add Photo'
                                    }}</h2>
                                    <p class="text-slate-400 text-xs mt-0.5">{{ photoModal.roomLabel }}</p>
                                </div>
                                <button @click="closePhotoModal"
                                    class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                                    <X class="w-4 h-4 text-slate-400" />
                                </button>
                            </div>

                            <!-- Queue mode: stepping through selected photos -->
                            <template v-if="photoModal.queue.length > 0">
                                <div class="mb-4 relative rounded-xl overflow-hidden aspect-video bg-slate-800">
                                    <img :src="photoModal.queue[photoModal.queueIndex]?.preview" alt="Preview"
                                        class="w-full h-full object-contain" />
                                </div>
                                <!-- Progress dots -->
                                <div v-if="photoModal.queue.length > 1"
                                    class="flex items-center justify-center gap-1.5 mb-4">
                                    <div v-for="(_, qi) in photoModal.queue" :key="qi"
                                        class="w-2 h-2 rounded-full transition-colors"
                                        :class="qi === photoModal.queueIndex ? 'bg-violet-400' : qi < photoModal.queueIndex ? 'bg-violet-600' : 'bg-slate-700'" />
                                </div>
                                <div class="mb-5">
                                    <label
                                        class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Caption
                                        <span class="normal-case font-medium tracking-normal text-slate-500">—
                                            optional</span></label>
                                    <input v-model="photoModal.queue[photoModal.queueIndex].caption" type="text"
                                        placeholder="e.g. Crack in wall near window"
                                        class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
                                </div>
                                <div class="flex gap-3">
                                    <button @click="closePhotoModal"
                                        class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors">Cancel</button>
                                    <button v-if="photoModal.queueIndex < photoModal.queue.length - 1"
                                        @click="nextInQueue"
                                        class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-500/20">
                                        Next Photo
                                    </button>
                                    <button v-else @click="confirmPhotoQueue"
                                        class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-500/20">
                                        {{ photoModal.queue.length === 1 ? 'Add Photo' : `Add ${photoModal.queue.length}
                                        Photos` }}
                                    </button>
                                </div>
                            </template>

                            <!-- Initial mode: pick source -->
                            <template v-else>
                                <div v-if="photoModal.preview"
                                    class="mb-4 relative rounded-xl overflow-hidden aspect-video bg-slate-800">
                                    <img :src="photoModal.preview" alt="Preview" class="w-full h-full object-contain" />
                                    <button @click="photoModal.preview = null; photoModal.rawFile = null"
                                        class="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                                        <X class="w-3.5 h-3.5 text-white" />
                                    </button>
                                </div>
                                <div v-if="!photoModal.preview" class="grid grid-cols-2 gap-3 mb-4">
                                    <button @click="triggerCameraInput"
                                        class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-slate-700 hover:border-violet-500/60 hover:bg-violet-500/5 transition-colors group">
                                        <Camera
                                            class="w-6 h-6 text-slate-400 group-hover:text-violet-400 transition-colors" />
                                        <span
                                            class="text-xs font-bold text-slate-400 group-hover:text-violet-400 transition-colors">Take
                                            Photo</span>
                                    </button>
                                    <button @click="triggerFileInput"
                                        class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-slate-700 hover:border-violet-500/60 hover:bg-violet-500/5 transition-colors group">
                                        <ImageIcon
                                            class="w-6 h-6 text-slate-400 group-hover:text-violet-400 transition-colors" />
                                        <span
                                            class="text-xs font-bold text-slate-400 group-hover:text-violet-400 transition-colors">Choose
                                            from Gallery</span>
                                    </button>
                                </div>
                                <input ref="cameraInputRef" :key="'cam-' + inputKey" type="file" accept="image/*"
                                    capture="environment" class="hidden" @change="handleCameraSelect" />
                                <input ref="fileInputRef" :key="'file-' + inputKey" type="file" accept="image/*"
                                    multiple class="hidden" @change="handleFileSelect" />
                                <div v-if="photoModal.preview" class="mb-5">
                                    <label
                                        class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Caption
                                        <span class="normal-case font-medium tracking-normal text-slate-500">—
                                            optional</span></label>
                                    <input v-model="photoModal.caption" type="text"
                                        placeholder="e.g. Crack in wall near window"
                                        class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 transition" />
                                </div>
                                <div class="flex gap-3">
                                    <button @click="closePhotoModal"
                                        class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors">Cancel</button>
                                    <button v-if="photoModal.preview" @click="confirmPhoto"
                                        class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-500/20">
                                        Add Photo
                                    </button>
                                </div>
                            </template>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

        <!-- ── Caption Edit Modal ─────────────────────────────────────── -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out"
                leave-active-class="transition duration-150 ease-in" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="captionEdit.open" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeCaptionEdit" />
                    <div
                        class="relative z-10 w-full sm:w-[400px] bg-slate-900 border border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl p-5">
                        <h3 class="text-white font-black text-base mb-4">Edit Caption</h3>
                        <input v-model="captionEdit.caption" type="text" placeholder="e.g. Crack in wall near window"
                            class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 transition mb-4"
                            @keydown.enter="saveCaptionEdit" />
                        <div class="flex gap-3">
                            <button @click="closeCaptionEdit"
                                class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors">Cancel</button>
                            <button @click="saveCaptionEdit"
                                class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-sm font-bold transition-all">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>

    </LayoutComponent>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'

// Firebase — adjust these imports to match your actual client firebase config exports
import { storage, firestore } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { doc, setDoc, updateDoc, onSnapshot, getDoc, serverTimestamp } from 'firebase/firestore'

import {
    ClipboardCheck, ChevronDown, Plus, X, Camera,
    Image as ImageIcon, CheckCircle, AlertTriangle,
    XCircle, MinusCircle, Moon, ShieldCheck, Bath,
    Check, Tv, UtensilsCrossed, Flame, Sparkles,
    Building2, Truck, Sun, Archive, Monitor, Wrench,
    Home, Trees, Send, Trash2, Save, FileText,
    RefreshCw, Pencil, Images,
} from 'lucide-vue-next'
import { CHECKLIST_ITEMS, _common, getChecklistGroups } from '@/data/inspectionItems.js'
import SignaturePad from 'signature_pad'

// ─── Constants ─────────────────────────────────────────────────────────────

const CACHE_KEY = 'everhomes_inspection_v2'
const REPORT_TYPE = 'inspection'
// Set VITE_FUNCTIONS_URL in your .env — e.g. https://australia-southeast2-{projectId}.cloudfunctions.net
const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''

const ROOM_META = {
    general: { icon: ClipboardCheck, gradient: 'linear-gradient(135deg,#059669,#10B981)' },
    bedroom: { icon: Moon, gradient: 'linear-gradient(135deg,#7C3AED,#A855F7)' },
    ensuite: { icon: Bath, gradient: 'linear-gradient(135deg,#0891B2,#22D3EE)' },
    bathroom: { icon: Sparkles, gradient: 'linear-gradient(135deg,#0284C7,#38BDF8)' },
    living: { icon: Tv, gradient: 'linear-gradient(135deg,#D97706,#FBBF24)' },
    dining: { icon: UtensilsCrossed, gradient: 'linear-gradient(135deg,#B45309,#F59E0B)' },
    kitchen: { icon: Flame, gradient: 'linear-gradient(135deg,#C2410C,#F97316)' },
    laundry: { icon: Wrench, gradient: 'linear-gradient(135deg,#0D9488,#2DD4BF)' },
    study: { icon: Monitor, gradient: 'linear-gradient(135deg,#4F46E5,#818CF8)' },
    garage: { icon: Truck, gradient: 'linear-gradient(135deg,#475569,#94A3B8)' },
    outdoor: { icon: Sun, gradient: 'linear-gradient(135deg,#0891B2,#38BDF8)' },
    garden: { icon: Trees, gradient: 'linear-gradient(135deg,#15803D,#4ADE80)' },
    storage: { icon: Archive, gradient: 'linear-gradient(135deg,#6B7280,#D1D5DB)' },
    common: { icon: Building2, gradient: 'linear-gradient(135deg,#0891B2,#22D3EE)' },
    entry: { icon: Home, gradient: 'linear-gradient(135deg,#EA580C,#FB923C)' },
    driveway: { icon: Truck, gradient: 'linear-gradient(135deg,#475569,#94A3B8)' },
}

const REPORT_TYPES = [
    { key: 'entry', label: 'Entry Report' },
    { key: 'routine', label: 'Routine Inspection' },
    { key: 'exit', label: 'Exit Report' },
    { key: 'event', label: 'Event Response' },
]

// Core sections — always included, not toggleable (like handover)
const CORE_SECTIONS = [
    { key: 'entry', label: 'Entry / Hallway', color: '#EA580C' },
    { key: 'living', label: 'Living Room', color: '#D97706' },
    { key: 'kitchen', label: 'Kitchen', color: '#C2410C' },
]

// Optional areas — one group, common ones listed first
const OPTIONAL_AREAS = [
    { key: 'dining', label: 'Dining Room', color: '#B45309' },
    { key: 'laundry', label: 'Laundry', color: '#0D9488' },
    { key: 'driveway', label: 'Driveway', color: '#64748B' },
    { key: 'study', label: 'Study / Office', color: '#4F46E5' },
    { key: 'garage', label: 'Garage / Carport', color: '#475569' },
    { key: 'outdoor', label: 'Patio / Balcony', color: '#0891B2' },
    { key: 'garden', label: 'Garden / Lawn', color: '#15803D' },
    { key: 'common', label: 'Common Area', color: '#7C3AED' },
    { key: 'storage', label: 'Storage', color: '#6B7280' },
]

const STATUS_OPTIONS = [
    { value: 'ok', label: 'OK', icon: CheckCircle, activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-400' },
    { value: 'attention', label: 'Needs Attention', icon: AlertTriangle, activeClass: 'bg-amber-500/20 border-amber-500 text-amber-400' },
    { value: 'issue', label: 'Issue Found', icon: XCircle, activeClass: 'bg-rose-500/20 border-rose-500 text-rose-400' },
    { value: 'na', label: 'N/A', icon: MinusCircle, activeClass: 'bg-slate-700 border-slate-500 text-slate-400' },
]

// Compact per-item status buttons (icon-only)
const ITEM_STATUS_OPTIONS = [
    { value: 'ok', label: 'OK', icon: CheckCircle, activeClass: 'bg-emerald-500/25 border-emerald-500/80 text-emerald-400' },
    { value: 'attention', label: 'Needs Attention', icon: AlertTriangle, activeClass: 'bg-amber-500/25 border-amber-500/80 text-amber-400' },
    { value: 'issue', label: 'Issue Found', icon: XCircle, activeClass: 'bg-rose-500/25 border-rose-500/80 text-rose-400' },
    { value: 'na', label: 'N/A', icon: MinusCircle, activeClass: 'bg-slate-700/80 border-slate-500/80 text-slate-400' },
]

const MARKETING_SLOTS = [
    { key: 'frontExterior', label: 'Front Exterior', hint: 'Full front view of the property from the street' },
    { key: 'kitchenWide', label: 'Kitchen Wide', hint: 'Wide-angle shot showing the full kitchen' },
    { key: 'livingArea', label: 'Living Area', hint: 'Main living space — open and well-lit' },
    { key: 'mainBedroom', label: 'Main Bedroom', hint: 'Primary bedroom — bed area and window' },
    { key: 'bathroom', label: 'Bathroom', hint: 'Main bathroom — clean and bright' },
    { key: 'outdoorGarden', label: 'Outdoor / Garden', hint: 'Backyard, patio, or balcony area' },
    { key: 'streetView', label: 'Street View', hint: 'Property from across the street with surroundings' },
]


// All status-checkable item IDs for a given room type (excludes input-type items)
function getItemIds(type) {
    return getChecklistGroups(type).flatMap(g => g.items.filter(i => !i.type).map(i => i.id))
}

// ─── Setup state ────────────────────────────────────────────────────────────

let _id = 1
const propertyAddress = ref('')
const inspectionDate = ref(new Date().toISOString().split('T')[0])
const inspectorName = ref('')
const inspectorEmail = ref('')
const bathrooms = ref(1)

const bedrooms = reactive([
    { id: _id++, name: '', hasEnsuite: true, isOOA: false },
    { id: _id++, name: '', hasEnsuite: true, isOOA: false },
    { id: _id++, name: '', hasEnsuite: false, isOOA: true },
])

const selectedOptional = reactive(new Set(['dining', 'laundry']))
const reportSubtype = ref('routine')
const showMarketing = ref(false)
const marketingPhotos = reactive({})  // { [slotKey]: [{ previewUrl, thumbUrl, url, storagePath, uploadStatus }] }

function addBedroom() { bedrooms.push({ id: _id++, name: '', hasEnsuite: false, isOOA: false }) }
function removeBedroom() { if (bedrooms.length > 1) bedrooms.pop() }
function toggleOptional(key) { selectedOptional.has(key) ? selectedOptional.delete(key) : selectedOptional.add(key) }

// ─── Checklist state ────────────────────────────────────────────────────────

// Current inspectionId — generated fresh each time startInspection() is called
const inspectionId = ref(null)
const checklistRooms = ref([])
const openRooms = ref(new Set())

// inspectionData[roomId] = {
//   status: 'unchecked'|'ok'|'attention'|'issue'|'na'
//   notes: string
//   photos: [{ previewUrl, thumbUrl, url, storagePath, caption, uploadStatus: 'uploading'|'done'|'failed'|'skipped' }]
//   items: { [id]: status }        — status-checkable items
//   inputs: { [id]: string|number } — text/number input items
// }
const inspectionData = reactive({})

function ensureInspectionEntry(id, type) {
    if (!inspectionData[id]) {
        const items = {}
        getItemIds(type).forEach(itemId => { items[itemId] = 'unchecked' })
        inspectionData[id] = { status: 'unchecked', notes: '', photos: [], items, inputs: {} }
    }
}

function startInspection() {
    const rooms = []
    const newId = crypto.randomUUID()
    inspectionId.value = newId

    function addArea(key, label) {
        const aId = `area-${key}`
        rooms.push({ id: aId, type: key, label, isOOA: false, isEnsuite: false })
        ensureInspectionEntry(aId, key)
    }

    // ── Walk-through order ─────────────────────────────────────────
    // 1. Driveway (if selected) — arrive at property
    if (selectedOptional.has('driveway')) addArea('driveway', 'Driveway')

    // 2. Core sections — always included
    for (const s of CORE_SECTIONS) addArea(s.key, s.label)

    // 3. Optional areas (excl. driveway — already placed first)
    for (const area of OPTIONAL_AREAS) {
        if (area.key === 'driveway') continue
        if (selectedOptional.has(area.key)) addArea(area.key, area.label)
    }

    // 4. Bedrooms + ensuites
    bedrooms.forEach((bed, i) => {
        const bId = `bed-${bed.id}`
        rooms.push({ id: bId, type: 'bedroom', label: bed.name.trim() || `Bedroom ${i + 1}`, isOOA: bed.isOOA, isEnsuite: false })
        ensureInspectionEntry(bId, 'bedroom')

        if (bed.hasEnsuite) {
            const eId = `ensuite-${bed.id}`
            rooms.push({ id: eId, type: 'ensuite', label: `${bed.name.trim() || `Bedroom ${i + 1}`} — Ensuite`, isOOA: false, isEnsuite: true })
            ensureInspectionEntry(eId, 'ensuite')
        }
    })

    // 5. Standalone bathrooms
    for (let i = 0; i < bathrooms.value; i++) {
        const bId = `bath-${i}`
        rooms.push({ id: bId, type: 'bathroom', label: bathrooms.value > 1 ? `Bathroom ${i + 1}` : 'Bathroom', isOOA: false, isEnsuite: false })
        ensureInspectionEntry(bId, 'bathroom')
    }

    // 6. General Property — always last
    addArea('general', 'General Property')

    checklistRooms.value = rooms
    openRooms.value = new Set([0])
    saveToCache()

    setTimeout(() => {
        document.querySelector('[data-checklist]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
}

// ─── Photo upload ────────────────────────────────────────────────────────────

// Upload a single photo file to Firebase Storage with up to 3 attempts.
// Returns { url, storagePath } on success, or throws after all retries.
async function uploadPhotoToStorage(file, roomId) {
    if (!inspectionId.value) throw new Error('No inspection ID — start inspection first')

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${roomId}_${Date.now()}.${ext}`
    const path = `${REPORT_TYPE}s/${inspectionId.value}/photos/${filename}`
    const fileRef = storageRef(storage, path)

    const MAX_ATTEMPTS = 3
    const UPLOAD_TIMEOUT_MS = 30_000 // 30s per attempt
    let lastError

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            await Promise.race([
                (async () => {
                    await uploadBytes(fileRef, file, { contentType: file.type || 'image/jpeg' })
                })(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Upload timed out')), UPLOAD_TIMEOUT_MS)
                ),
            ])
            const url = await getDownloadURL(fileRef)
            return { url, storagePath: path }
        } catch (err) {
            lastError = err
            console.warn(`Photo upload attempt ${attempt} failed:`, err.message)
            if (attempt < MAX_ATTEMPTS) {
                await new Promise(r => setTimeout(r, attempt * 1000)) // 1s, 2s backoff
            }
        }
    }

    throw lastError
}

// Delete a photo from Storage by its path
async function deletePhotoFromStorage(storagePath) {
    if (!storagePath) return
    try {
        await deleteObject(storageRef(storage, storagePath))
    } catch (err) {
        console.warn('Failed to delete photo from Storage:', err.message)
    }
}

// Called after user confirms photo in the modal
async function confirmPhoto() {
    if (photoModal.roomIdx === null || !photoModal.rawFile) return
    const room = checklistRooms.value[photoModal.roomIdx]
    if (!room || !inspectionData[room.id]) return

    const previewUrl = photoModal.preview
    const caption = photoModal.caption
    const rawFile = photoModal.rawFile
    const roomId = room.id

    // Add placeholder immediately so the user sees it
    const photoEntry = reactive({
        previewUrl,
        thumbUrl: null,
        url: null,
        storagePath: null,
        caption,
        uploadStatus: 'uploading',
    })
    inspectionData[roomId].photos.push(photoEntry)

    closePhotoModal()

    // Upload in background
    try {
        const { url, storagePath } = await uploadPhotoToStorage(rawFile, roomId)
        photoEntry.url = url
        photoEntry.thumbUrl = url   // Storage URL serves as thumb (sized by Cloud Function)
        photoEntry.storagePath = storagePath
        photoEntry.uploadStatus = 'done'
    } catch {
        photoEntry.uploadStatus = 'failed'
    }
}

// Retry a failed upload
async function retryPhotoUpload(roomId, photoIdx) {
    const photo = inspectionData[roomId]?.photos?.[photoIdx]
    if (!photo || photo.uploadStatus === 'uploading') return

    // We need the raw file — but after the modal closes we no longer have it.
    // The previewUrl is a blob URL still valid in the same session.
    // Fetch it back as a Blob and retry.
    photo.uploadStatus = 'uploading'
    try {
        const blob = await fetch(photo.previewUrl).then(r => r.blob())
        const fakeFile = new File([blob], 'retry.jpg', { type: 'image/jpeg' })
        const { url, storagePath } = await uploadPhotoToStorage(fakeFile, roomId)
        photo.url = url
        photo.thumbUrl = url
        photo.storagePath = storagePath
        photo.uploadStatus = 'done'
    } catch {
        // All retries exhausted inside uploadPhotoToStorage — mark skipped
        photo.uploadStatus = 'skipped'
    }
}

async function removePhoto(roomId, photoIdx) {
    const photo = inspectionData[roomId]?.photos?.[photoIdx]
    if (!photo) return
    if (photo.storagePath) await deletePhotoFromStorage(photo.storagePath)
    inspectionData[roomId].photos.splice(photoIdx, 1)
}

function hasSkippedPhotos(roomId) {
    return inspectionData[roomId]?.photos?.some(p => p.uploadStatus === 'skipped') ?? false
}

const hasAnyUploading = computed(() =>
    Object.values(inspectionData).some(d => d.photos?.some(p => p.uploadStatus === 'uploading'))
)

// ─── Accordion ───────────────────────────────────────────────────────────────

function toggleRoom(idx) {
    const s = new Set(openRooms.value)
    s.has(idx) ? s.delete(idx) : s.add(idx)
    openRooms.value = s
}

// ─── Progress ────────────────────────────────────────────────────────────────

// A room is "complete" when every status-checkable item has been set (not 'unchecked')
function isRoomComplete(roomId) {
    const items = inspectionData[roomId]?.items ?? {}
    const values = Object.values(items)
    return values.length > 0 && values.every(v => v !== 'unchecked')
}

const inspectedCount = computed(() =>
    checklistRooms.value.filter(r => isRoomComplete(r.id)).length
)
const uninspectedCount = computed(() =>
    checklistRooms.value.filter(r => !isRoomComplete(r.id)).length
)
const incompleteRooms = computed(() =>
    checklistRooms.value.filter(r => {
        const items = inspectionData[r.id]?.items ?? {}
        const values = Object.values(items)
        const checked = values.filter(v => v !== 'unchecked').length
        return checked > 0 && checked < values.length
    })
)
const progressPercent = computed(() => {
    if (!checklistRooms.value.length) return 0
    return Math.round((inspectedCount.value / checklistRooms.value.length) * 100)
})
const progressGradient = computed(() => {
    if (progressPercent.value === 100) return 'linear-gradient(90deg,#10B981,#34D399)'
    if (progressPercent.value >= 60) return 'linear-gradient(90deg,#7C3AED,#A855F7)'
    if (progressPercent.value >= 30) return 'linear-gradient(90deg,#EA580C,#FB923C)'
    return 'linear-gradient(90deg,#334155,#475569)'
})

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusLabel(status) {
    return { unchecked: 'Not inspected', ok: 'OK', attention: 'Needs attention', issue: 'Issue found', na: 'N/A' }[status] ?? 'Not inspected'
}
function statusColour(status) {
    return { unchecked: '#475569', ok: '#10B981', attention: '#F59E0B', issue: '#F43F5E', na: '#64748B' }[status ?? 'unchecked'] ?? '#475569'
}

function setItemStatus(roomId, itemId, value) {
    if (!inspectionData[roomId]) return
    if (!inspectionData[roomId].items) inspectionData[roomId].items = {}
    // Toggle off if already selected
    inspectionData[roomId].items[itemId] = inspectionData[roomId].items[itemId] === value ? 'unchecked' : value
    // Auto-recompute room status after any item change
    recomputeRoomStatus(roomId)
}

function setItemInput(roomId, itemId, value) {
    if (!inspectionData[roomId]) return
    if (!inspectionData[roomId].inputs) inspectionData[roomId].inputs = {}
    inspectionData[roomId].inputs[itemId] = value
}

// Returns true when every explicitly-set item is N/A (manual override needed)
function roomIsAllNA(roomId) {
    const items = inspectionData[roomId]?.items ?? {}
    const checked = Object.values(items).filter(v => v !== 'unchecked')
    return checked.length > 0 && checked.every(v => v === 'na')
}

// Derives the worst-case status from item states and writes it to inspectionData
function recomputeRoomStatus(roomId) {
    const entry = inspectionData[roomId]
    if (!entry) return
    const values = Object.values(entry.items ?? {})
    if (values.length === 0) return  // no items — leave manual

    const checked = values.filter(v => v !== 'unchecked')
    // Nothing checked yet → stay unchecked
    if (checked.length === 0) { entry.status = 'unchecked'; return }
    // All checked items are N/A → don't auto-set, let officer pick manually
    if (checked.every(v => v === 'na')) return
    // Worst-case priority: issue > attention > ok
    if (values.includes('issue')) { entry.status = 'issue'; return }
    if (values.includes('attention')) { entry.status = 'attention'; return }
    entry.status = 'ok'
}

// ─── Validation ───────────────────────────────────────────────────────────────

const setupErrors = reactive({ address: false, name: false, email: false })

function validateSetup() {
    setupErrors.address = !propertyAddress.value.trim()
    setupErrors.name = !inspectorName.value.trim()
    setupErrors.email = !inspectorEmail.value.trim()
    return !setupErrors.address && !setupErrors.name && !setupErrors.email
}

function tryStartInspection() {
    if (validateSetup()) startInspection()
}

function itemRowClass(status) {
    if (status === 'ok') return 'bg-emerald-500/5'
    if (status === 'attention') return 'bg-amber-500/5'
    if (status === 'issue') return 'bg-rose-500/10 border border-rose-500/20 rounded-lg'
    if (status === 'na') return 'opacity-50'
    return ''
}
function accordionBorderStyle(roomId) {
    const status = inspectionData[roomId]?.status ?? 'unchecked'
    const borders = { unchecked: '#33415550', ok: '#10B98135', attention: '#F59E0B35', issue: '#F43F5E35', na: '#47556940' }
    const bgs = { unchecked: '#1E293B20', ok: '#10B98108', attention: '#F59E0B08', issue: '#F43F5E08', na: '#1E293B15' }
    return { borderColor: borders[status] ?? borders.unchecked, background: bgs[status] ?? bgs.unchecked }
}

// ─── Submit modal ─────────────────────────────────────────────────────────────

const submitModal = reactive({
    open: false,
    loading: false,
    done: false,
    error: null,
    statusMessage: 'Generating report…',
    pdfUrl: null,
    canFlush: false,
})

let firestoreUnsub = null
let submitTimeoutId = null
const SUBMIT_TIMEOUT_MS = 120_000 // 2 minutes

const submitStats = computed(() => {
    const total = checklistRooms.value.length
    const ok = checklistRooms.value.filter(r => inspectionData[r.id]?.status === 'ok').length
    const attention = checklistRooms.value.filter(r => inspectionData[r.id]?.status === 'attention').length
    const issues = checklistRooms.value.filter(r => inspectionData[r.id]?.status === 'issue').length
    return [
        { label: 'Total', count: total, color: '#64748B' },
        { label: 'OK', count: ok, color: '#10B981' },
        { label: 'Attention', count: attention, color: '#F59E0B' },
        { label: 'Issues', count: issues, color: '#F43F5E' },
    ]
})

const flaggedRooms = computed(() =>
    checklistRooms.value
        .filter(r => ['issue', 'attention'].includes(inspectionData[r.id]?.status))
        .map(r => ({ ...r, status: inspectionData[r.id].status }))
        .sort((a, b) => (a.status === 'issue' ? -1 : 1))
)

function flaggedRoomStyle(status) {
    if (status === 'issue') return { borderColor: '#F43F5E30', background: '#F43F5E08' }
    if (status === 'attention') return { borderColor: '#F59E0B30', background: '#F59E0B08' }
    return {}
}

function openSubmit() {
    if (!validateSetup()) return   // block if address or name missing
    submitModal.open = true
    submitModal.loading = false
    submitModal.done = false
    submitModal.error = null
    submitModal.pdfUrl = null
    submitModal.canFlush = false
}

async function confirmSubmit() {
    if (hasAnyUploading.value) return

    // ── Network gate ───────────────────────────────────────────────
    if (!navigator.onLine) {
        submitModal.error = 'You appear to be offline. Please check your internet connection and try again.'
        return
    }

    submitModal.loading = true
    submitModal.error = null
    submitModal.canFlush = false
    submitModal.statusMessage = 'Generating report…'

    // Create the Firestore doc so we can listen to it
    const id = inspectionId.value ?? crypto.randomUUID()
    inspectionId.value = id

    const docRef = doc(firestore, `${REPORT_TYPE}s`, id)

    // Try creating the Firestore doc — may already exist from a previous attempt
    try {
        await setDoc(docRef, {
            status: 'pending',
            propertyAddress: propertyAddress.value,
            inspectionDate: inspectionDate.value,
            inspectorName: inspectorName.value,
            inspectorEmail: inspectorEmail.value,
            createdAt: serverTimestamp(),
        })
    } catch (err) {
        // If the doc already exists from a previous attempt (rules deny update),
        // that's fine — we'll just re-send the HTTP request below.
        const isPermDenied = err?.code === 'permission-denied' || err?.message?.includes('PERMISSION_DENIED')
        if (!isPermDenied) {
            submitModal.loading = false
            submitModal.error = `Failed to create report record: ${err.message}`
            return
        }
    }

    // ── Listen for status updates ──────────────────────────────────
    // includeMetadataChanges lets us distinguish cache vs server snapshots
    if (firestoreUnsub) firestoreUnsub()
    firestoreUnsub = onSnapshot(docRef, { includeMetadataChanges: true }, snap => {
        const data = snap.data()
        if (!data) return

        // Ignore cache-only reads while still pending — we need the real server state
        if (snap.metadata.fromCache && data.status === 'pending') return

        if (data.status === 'processing') {
            submitModal.statusMessage = 'Building PDF and packaging photos…'
            // Reset timeout — the function is actively working
            clearSubmitTimeout()
            startSubmitTimeout()
        } else if (data.status === 'complete') {
            clearSubmitTimeout()
            firestoreUnsub?.()
            submitModal.loading = false
            submitModal.done = true
            submitModal.pdfUrl = data.pdfUrl ?? null
            clearCache()
        } else if (data.status === 'failed') {
            clearSubmitTimeout()
            firestoreUnsub?.()
            submitModal.loading = false
            submitModal.error = data.error ?? 'The report generation failed. Please try again.'
        }
    })

    // ── Start timeout ──────────────────────────────────────────────
    startSubmitTimeout()

    // ── Build the payload ──────────────────────────────────────────
    const rooms = checklistRooms.value.map(room => ({
        id: room.id,
        type: room.type,
        label: room.label,
        isOOA: room.isOOA,
        isEnsuite: room.isEnsuite,
        status: inspectionData[room.id]?.status ?? 'unchecked',
        notes: inspectionData[room.id]?.notes ?? '',
        items: inspectionData[room.id]?.items ?? {},
        inputs: inspectionData[room.id]?.inputs ?? {},
        photos: (inspectionData[room.id]?.photos ?? [])
            .filter(p => p.uploadStatus === 'done' && p.url)
            .map(p => ({ url: p.url, caption: p.caption, storagePath: p.storagePath })),
    }))

    // ── Build signature payload ─────────────────────────────────────
    const staffSigData = getStaffSignatureData()
    const sigPayload = {
        staff: {
            name: inspectorName.value,
            date: inspectionDate.value,
            signature: staffSigData,
        },
        tenants: (reportSubtype.value === 'entry' || reportSubtype.value === 'exit')
            ? signatureState.tenants.map((t, i) => ({
                name: t.name,
                date: t.date,
                signature: getTenantSignatureData(i),
            })).filter(t => t.name || t.signature)
            : [],
    }

    // ── Build marketing photos payload ──────────────────────────────
    const marketingPayload = {}
    for (const slot of MARKETING_SLOTS) {
        const photos = (marketingPhotos[slot.key] ?? [])
            .filter(p => p.uploadStatus === 'done' && p.url)
            .map(p => ({ url: p.url, storagePath: p.storagePath }))
        if (photos.length) marketingPayload[slot.key] = photos
    }

    // ── Upload staff signature to Storage ───────────────────────────
    let staffSigStoragePath = null
    if (staffSigData) {
        try {
            const sigBlob = await (await fetch(staffSigData)).blob()
            const sigFile = new File([sigBlob], 'staff_signature.png', { type: 'image/png' })
            const sigPath = `${REPORT_TYPE}s/${id}/signatures/staff_signature.png`
            const sigRef = storageRef(storage, sigPath)
            await uploadBytes(sigRef, sigFile, { contentType: 'image/png' })
            const sigUrl = await getDownloadURL(sigRef)
            sigPayload.staff.signatureUrl = sigUrl
            sigPayload.staff.signatureStoragePath = sigPath
            staffSigStoragePath = sigPath
        } catch (err) {
            console.warn('Staff signature upload failed:', err.message)
        }
    }

    // ── Upload tenant signatures to Storage ─────────────────────────
    for (let i = 0; i < sigPayload.tenants.length; i++) {
        const t = sigPayload.tenants[i]
        if (!t.signature) continue
        try {
            const blob = await (await fetch(t.signature)).blob()
            const file = new File([blob], `tenant_${i + 1}_signature.png`, { type: 'image/png' })
            const tPath = `${REPORT_TYPE}s/${id}/signatures/tenant_${i + 1}_signature.png`
            const tRef = storageRef(storage, tPath)
            await uploadBytes(tRef, file, { contentType: 'image/png' })
            const tUrl = await getDownloadURL(tRef)
            t.signatureUrl = tUrl
            t.signatureStoragePath = tPath
        } catch (err) {
            console.warn(`Tenant ${i + 1} signature upload failed:`, err.message)
        }
    }

    // ── Send to cloud function ─────────────────────────────────────
    try {
        const controller = new AbortController()
        const fetchTimeout = setTimeout(() => controller.abort(), 60_000) // 60s fetch timeout

        const response = await fetch(`${FUNCTIONS_URL}/generateInspectionReport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                reportType: REPORT_TYPE,
                reportSubtype: reportSubtype.value,
                inspectionId: id,
                propertyAddress: propertyAddress.value,
                inspectionDate: inspectionDate.value,
                inspectorName: inspectorName.value,
                inspectorEmail: inspectorEmail.value,
                rooms,
                signatures: sigPayload,
                marketingPhotos: marketingPayload,
            }),
        })
        clearTimeout(fetchTimeout)

        if (!response.ok) {
            const err = await response.json().catch(() => ({}))
            throw new Error(err.details ?? err.error ?? `HTTP ${response.status}`)
        }
        // Success — Firestore listener handles the rest
    } catch (err) {
        // DON'T kill the listener — the function may still complete server-side.
        // Show an actionable message instead of a dead error.
        if (err.name === 'AbortError') {
            submitModal.statusMessage = 'The request is taking a while — the report may still be generating.'
        } else {
            submitModal.statusMessage = 'The request may not have reached the server.'
        }
        submitModal.canFlush = true
        // Keep loading=true, keep listener alive — the function might still finish
    }
}

// ─── Submit timeout & flush ──────────────────────────────────────────────────

function startSubmitTimeout() {
    clearSubmitTimeout()
    submitTimeoutId = setTimeout(() => {
        submitModal.canFlush = true
        submitModal.statusMessage = 'This is taking longer than expected.'
    }, SUBMIT_TIMEOUT_MS)
}

function clearSubmitTimeout() {
    if (submitTimeoutId) {
        clearTimeout(submitTimeoutId)
        submitTimeoutId = null
    }
}

// "Check Status" — forces a server read to see if the report actually completed
async function flushAndCheck() {
    submitModal.statusMessage = 'Checking report status…'
    submitModal.canFlush = false

    try {
        const docRef = doc(firestore, `${REPORT_TYPE}s`, inspectionId.value)
        const snap = await getDoc(docRef)
        const data = snap.data()

        if (!data) {
            // Doc never made it to the server — allow full retry with a new ID
            submitModal.loading = false
            submitModal.error = 'Report record not found on the server. Your inspection data is safe — please try submitting again.'
            inspectionId.value = crypto.randomUUID()
            return
        }

        if (data.status === 'complete') {
            clearSubmitTimeout()
            firestoreUnsub?.()
            submitModal.loading = false
            submitModal.done = true
            submitModal.pdfUrl = data.pdfUrl ?? null
            clearCache()
        } else if (data.status === 'failed') {
            clearSubmitTimeout()
            firestoreUnsub?.()
            submitModal.loading = false
            submitModal.error = data.error ?? 'Report generation failed. Your data is safe — please try again.'
        } else if (data.status === 'processing') {
            submitModal.statusMessage = 'Report is still being generated. Please wait…'
            startSubmitTimeout()
        } else {
            // Still 'pending' — the HTTP request likely never reached the server
            submitModal.loading = false
            submitModal.error = 'The report request may not have reached the server. Please check your connection and try again.'
            // Generate a new ID so the next attempt can create a fresh doc
            inspectionId.value = crypto.randomUUID()
        }
    } catch (err) {
        submitModal.statusMessage = `Unable to check status. Please check your internet connection.`
        submitModal.canFlush = true
    }
}

// ─── Clear ────────────────────────────────────────────────────────────────────

const confirmClear = reactive({ open: false })

function clearChecklist() {
    checklistRooms.value = []
    Object.keys(inspectionData).forEach(k => delete inspectionData[k])
    openRooms.value = new Set()
    inspectionId.value = null
    // Reset form builder to defaults
    propertyAddress.value = ''
    inspectionDate.value = new Date().toISOString().split('T')[0]
    inspectorName.value = ''
    inspectorEmail.value = ''
    bathrooms.value = 1
    bedrooms.splice(0, bedrooms.length, { id: ++_id, name: '', hasEnsuite: true, isOOA: false }, { id: ++_id, name: '', hasEnsuite: true, isOOA: false }, { id: ++_id, name: '', hasEnsuite: false, isOOA: true })
    selectedOptional.clear();['dining', 'laundry'].forEach(k => selectedOptional.add(k))
    reportSubtype.value = 'routine'
    showMarketing.value = false
    Object.keys(marketingPhotos).forEach(k => delete marketingPhotos[k])
    confirmClear.open = false
    clearCache()
}

// ─── LocalStorage cache ───────────────────────────────────────────────────────
// Photos are stored as {previewUrl, thumbUrl, url, storagePath, caption, uploadStatus}.
// previewUrl is a blob URL and won't survive a page reload — that's fine, the thumbUrl
// (Storage URL) is what we show after upload. We strip previewUrl from the cache.

function saveToCache() {
    try {
        const payload = {
            propertyAddress: propertyAddress.value,
            inspectionDate: inspectionDate.value,
            inspectorName: inspectorName.value,
            inspectorEmail: inspectorEmail.value,
            bathrooms: bathrooms.value,
            bedrooms: bedrooms.map(b => ({ ...b })),
            selectedOptional: [...selectedOptional],
            reportSubtype: reportSubtype.value,
            showMarketing: showMarketing.value,
            marketingPhotos: Object.fromEntries(
                Object.entries(marketingPhotos).map(([k, photos]) => [
                    k,
                    (photos ?? []).filter(p => p.url).map(p => ({
                        thumbUrl: p.url, url: p.url, storagePath: p.storagePath,
                        uploadStatus: p.uploadStatus === 'done' ? 'done' : 'skipped',
                    })),
                ])
            ),
            inspectionId: inspectionId.value,
            checklistRooms: checklistRooms.value,
            inspectionData: Object.fromEntries(
                Object.entries(inspectionData).map(([k, v]) => [
                    k,
                    {
                        status: v.status,
                        notes: v.notes,
                        items: v.items ?? {},
                        inputs: v.inputs ?? {},
                        // Only persist photos that have a Storage URL
                        photos: (v.photos ?? [])
                            .filter(p => p.url)
                            .map(p => ({ thumbUrl: p.url, url: p.url, storagePath: p.storagePath, caption: p.caption, uploadStatus: p.uploadStatus === 'done' ? 'done' : 'skipped' })),
                    },
                ])
            ),
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    } catch { /* quota exceeded — silently ignore */ }
}

function clearCache() {
    try { localStorage.removeItem(CACHE_KEY) } catch { /* ignore */ }
}

function loadFromCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return
        const data = JSON.parse(raw)

        if (data.propertyAddress) propertyAddress.value = data.propertyAddress
        if (data.inspectionDate) inspectionDate.value = data.inspectionDate
        if (data.inspectorName) inspectorName.value = data.inspectorName
        if (data.inspectorEmail) inspectorEmail.value = data.inspectorEmail
        if (typeof data.bathrooms === 'number') bathrooms.value = data.bathrooms
        if (data.inspectionId) inspectionId.value = data.inspectionId

        if (Array.isArray(data.bedrooms) && data.bedrooms.length) {
            bedrooms.splice(0, bedrooms.length, ...data.bedrooms)
            _id = Math.max(...data.bedrooms.map(b => b.id ?? 0)) + 1
        }
        if (Array.isArray(data.selectedOptional)) {
            selectedOptional.clear()
            data.selectedOptional.forEach(k => selectedOptional.add(k))
        }
        // Legacy cache compatibility: migrate old selectedAreas
        if (Array.isArray(data.selectedAreas) && !data.selectedOptional) {
            selectedOptional.clear()
            const optKeys = new Set(OPTIONAL_AREAS.map(a => a.key))
            for (const k of data.selectedAreas) {
                if (optKeys.has(k)) selectedOptional.add(k)
            }
        }
        if (data.reportSubtype) reportSubtype.value = data.reportSubtype
        if (typeof data.showMarketing === 'boolean') showMarketing.value = data.showMarketing
        if (data.marketingPhotos && typeof data.marketingPhotos === 'object') {
            for (const [k, photos] of Object.entries(data.marketingPhotos)) {
                if (Array.isArray(photos) && photos.length) {
                    marketingPhotos[k] = photos
                }
            }
        }
        if (Array.isArray(data.checklistRooms) && data.checklistRooms.length) {
            checklistRooms.value = data.checklistRooms
        }
        if (data.inspectionData && typeof data.inspectionData === 'object') {
            Object.assign(inspectionData, data.inspectionData)
            // Ensure items and inputs exist on restored entries (handles cache from before this feature)
            for (const [roomId, entry] of Object.entries(inspectionData)) {
                if (!entry.items) entry.items = {}
                if (!entry.inputs) entry.inputs = {}
            }
        }
    } catch { /* corrupt cache — ignore */ }
}

let _saveTimer = null
function debouncedSave() {
    clearTimeout(_saveTimer)
    _saveTimer = setTimeout(saveToCache, 800)
}

watch([propertyAddress, inspectionDate, inspectorName, inspectorEmail, bathrooms], debouncedSave)
watch(() => bedrooms.map(b => ({ ...b })), debouncedSave, { deep: true })
watch(() => [...selectedOptional], debouncedSave)
watch(reportSubtype, debouncedSave)
watch(showMarketing, debouncedSave)
watch(marketingPhotos, debouncedSave, { deep: true })
watch(checklistRooms, debouncedSave, { deep: true })
watch(inspectionData, debouncedSave, { deep: true })

onMounted(loadFromCache)
onUnmounted(() => { firestoreUnsub?.(); clearSubmitTimeout() })

// ─── Photo modal ──────────────────────────────────────────────────────────────

const cameraInputRef = ref(null)
const fileInputRef = ref(null)
const inputKey = ref(0)
const photoModal = reactive({ open: false, roomIdx: null, roomLabel: '', preview: null, rawFile: null, caption: '', queue: [], queueIndex: 0 })

function openPhotoModal(idx) {
    Object.assign(photoModal, { open: true, roomIdx: idx, roomLabel: checklistRooms.value[idx]?.label ?? '', preview: null, rawFile: null, caption: '', queue: [], queueIndex: 0 })
}
function closePhotoModal() {
    Object.assign(photoModal, { open: false, roomIdx: null, roomLabel: '', preview: null, rawFile: null, caption: '', queue: [], queueIndex: 0 })
}

function triggerCameraInput() {
    inputKey.value++
    setTimeout(() => cameraInputRef.value?.click(), 0)
}
function triggerFileInput() {
    inputKey.value++
    setTimeout(() => fileInputRef.value?.click(), 0)
}

// Camera: single photo, goes straight to single-photo preview
function handleCameraSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return
    photoModal.rawFile = file
    const reader = new FileReader()
    reader.onload = e => { photoModal.preview = e.target.result }
    reader.readAsDataURL(file)
}

// Gallery: supports multiple selection — enters queue mode if >1
function handleFileSelect(event) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    if (files.length === 1) {
        // Single file — use the simple preview flow
        photoModal.rawFile = files[0]
        const reader = new FileReader()
        reader.onload = e => { photoModal.preview = e.target.result }
        reader.readAsDataURL(files[0])
        return
    }

    // Multiple files — build a queue and enter label-stepping mode
    const queue = []
    let loaded = 0
    files.forEach((file, i) => {
        const entry = reactive({ file, preview: null, caption: '' })
        queue.push(entry)
        const reader = new FileReader()
        reader.onload = e => {
            entry.preview = e.target.result
            loaded++
            // Once all previews are loaded, show the queue
            if (loaded === files.length) {
                photoModal.queue = queue
                photoModal.queueIndex = 0
            }
        }
        reader.readAsDataURL(file)
    })
}

function nextInQueue() {
    if (photoModal.queueIndex < photoModal.queue.length - 1) {
        photoModal.queueIndex++
    }
}

async function confirmPhotoQueue() {
    if (photoModal.roomIdx === null || !photoModal.queue.length) return
    const room = checklistRooms.value[photoModal.roomIdx]
    if (!room || !inspectionData[room.id]) return
    const roomId = room.id
    const queue = [...photoModal.queue]

    closePhotoModal()

    for (const item of queue) {
        const photoEntry = reactive({
            previewUrl: item.preview,
            thumbUrl: null,
            url: null,
            storagePath: null,
            caption: item.caption,
            uploadStatus: 'uploading',
        })
        inspectionData[roomId].photos.push(photoEntry)

        // Upload in background
        try {
            const { url, storagePath } = await uploadPhotoToStorage(item.file, roomId)
            photoEntry.url = url
            photoEntry.thumbUrl = url
            photoEntry.storagePath = storagePath
            photoEntry.uploadStatus = 'done'
        } catch {
            photoEntry.uploadStatus = 'failed'
        }
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────

// ─── Caption Edit ────────────────────────────────────────────────────────────

const captionEdit = reactive({ open: false, roomId: null, photoIdx: null, caption: '' })

function openCaptionEdit(roomId, photoIdx) {
    const photo = inspectionData[roomId]?.photos?.[photoIdx]
    if (!photo) return
    captionEdit.open = true
    captionEdit.roomId = roomId
    captionEdit.photoIdx = photoIdx
    captionEdit.caption = photo.caption ?? ''
}

function saveCaptionEdit() {
    const photo = inspectionData[captionEdit.roomId]?.photos?.[captionEdit.photoIdx]
    if (photo) photo.caption = captionEdit.caption
    closeCaptionEdit()
}

function closeCaptionEdit() {
    Object.assign(captionEdit, { open: false, roomId: null, photoIdx: null, caption: '' })
}

// ─── Signature ───────────────────────────────────────────────────────────────

const staffSigCanvasRef = ref(null)
const tenantCanvasRefs = {}
let staffSigPad = null
const tenantSigPads = {}

const signatureState = reactive({
    staffSigned: false,
    agreementChecked: false,
    tenants: [
        { name: '', date: '', signed: false },
        { name: '', date: '', signed: false },
        { name: '', date: '', signed: false },
    ],
})

function setTenantCanvasRef(idx, el) {
    tenantCanvasRefs[idx] = el
}

function initSignaturePads() {
    // Staff pad
    if (staffSigCanvasRef.value && !staffSigPad) {
        const canvas = staffSigCanvasRef.value
        resizeCanvas(canvas)
        staffSigPad = new SignaturePad(canvas, {
            penColor: '#1E293B',
            backgroundColor: 'rgba(255,255,255,0)',
        })
        staffSigPad.addEventListener('endStroke', () => {
            signatureState.staffSigned = !staffSigPad.isEmpty()
        })
    }
    // Tenant pads
    for (let i = 0; i < 3; i++) {
        const el = tenantCanvasRefs[i]
        if (el && !tenantSigPads[i]) {
            resizeCanvas(el)
            tenantSigPads[i] = new SignaturePad(el, {
                penColor: '#1E293B',
                backgroundColor: 'rgba(255,255,255,0)',
            })
            const idx = i
            tenantSigPads[i].addEventListener('endStroke', () => {
                signatureState.tenants[idx].signed = !tenantSigPads[idx].isEmpty()
            })
        }
    }
}

function resizeCanvas(canvas) {
    const ratio = Math.max(window.devicePixelRatio ?? 1, 1)
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    canvas.getContext('2d').scale(ratio, ratio)
}

function clearStaffSignature() {
    staffSigPad?.clear()
    signatureState.staffSigned = false
}

function clearTenantSignature(idx) {
    tenantSigPads[idx]?.clear()
    signatureState.tenants[idx].signed = false
}

function destroySignaturePads() {
    if (staffSigPad) { staffSigPad.off(); staffSigPad = null }
    for (const key of Object.keys(tenantSigPads)) {
        tenantSigPads[key]?.off()
        delete tenantSigPads[key]
    }
    signatureState.staffSigned = false
    signatureState.agreementChecked = false
    signatureState.tenants.forEach(t => { t.name = ''; t.date = ''; t.signed = false })
}

// Re-init signature pads when submit modal opens
watch(() => submitModal.open, async (open) => {
    if (open && !submitModal.loading && !submitModal.done && !submitModal.error) {
        await nextTick()
        // Small delay for the DOM to fully render the canvas
        setTimeout(initSignaturePads, 100)
    } else if (!open) {
        destroySignaturePads()
    }
})

const canSubmit = computed(() => {
    if (!signatureState.staffSigned || !signatureState.agreementChecked) return false
    return true
})

function getStaffSignatureData() {
    if (!staffSigPad || staffSigPad.isEmpty()) return null
    return staffSigPad.toDataURL('image/png')
}

function getTenantSignatureData(idx) {
    if (!tenantSigPads[idx] || tenantSigPads[idx].isEmpty()) return null
    return tenantSigPads[idx].toDataURL('image/png')
}

// ─── Marketing photos ────────────────────────────────────────────────────────

async function uploadMarketingPhoto(file) {
    if (!inspectionId.value) throw new Error('No inspection ID')
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `marketing_${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`
    const path = `${REPORT_TYPE}s/${inspectionId.value}/marketing/${filename}`
    const fileRef = storageRef(storage, path)
    const MAX_ATTEMPTS = 3
    const UPLOAD_TIMEOUT_MS = 30_000
    let lastError
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            await Promise.race([
                uploadBytes(fileRef, file, { contentType: file.type || 'image/jpeg' }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Upload timed out')), UPLOAD_TIMEOUT_MS)),
            ])
            const url = await getDownloadURL(fileRef)
            return { url, storagePath: path }
        } catch (err) {
            lastError = err
            if (attempt < MAX_ATTEMPTS) await new Promise(r => setTimeout(r, attempt * 1000))
        }
    }
    throw lastError
}

async function handleMarketingUpload(slotKey, event) {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return

    // Ensure the inspection has started (need an ID for the storage path)
    if (!inspectionId.value) {
        if (!validateSetup()) return
        startInspection()
    }

    if (!marketingPhotos[slotKey]) marketingPhotos[slotKey] = []

    for (const file of files) {
        const previewUrl = URL.createObjectURL(file)
        const entry = reactive({ previewUrl, thumbUrl: null, url: null, storagePath: null, uploadStatus: 'uploading' })
        marketingPhotos[slotKey].push(entry)

        try {
            const { url, storagePath } = await uploadMarketingPhoto(file)
            entry.url = url
            entry.thumbUrl = url
            entry.storagePath = storagePath
            entry.uploadStatus = 'done'
        } catch {
            entry.uploadStatus = 'failed'
        }
    }
    // Reset the input so the same file can be re-selected
    event.target.value = ''
}

async function removeMarketingPhoto(slotKey, idx) {
    const photo = marketingPhotos[slotKey]?.[idx]
    if (!photo) return
    if (photo.storagePath) await deletePhotoFromStorage(photo.storagePath)
    marketingPhotos[slotKey].splice(idx, 1)
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<style>
/* Prevent iOS Safari from auto-zooming when tapping input fields.
   font-size must be >= 16px on mobile to suppress zoom behaviour. */
@media (max-width: 639px) {

    input[type="text"],
    input[type="email"],
    input[type="date"],
    input[type="number"],
    textarea,
    select {
        font-size: 16px !important;
    }
}

/* Constrain native date picker on mobile — prevents overflow */
input[type="date"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    max-width: 100%;
    box-sizing: border-box;
}
</style>