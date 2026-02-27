<template>
    <LayoutComponent :header="true" :footer="true">

        <!-- ══════════════════════════════════════════════════════════════ -->
        <!--  STEP 1 — SETUP                                                 -->
        <!-- ══════════════════════════════════════════════════════════════ -->
        <div class="">
            <div class="bg-gradient-to-r from-teal-700 to-emerald-600 px-4 sm:px-6 lg:px-8 pt-20 pb-10 sm:pt-24">
                <div class="max-w-4xl mx-auto">
                    <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">Handover / Annual
                        Review</h1>
                    <p class="text-teal-200 text-sm mt-1 font-medium">SDA Dwelling Suitability Review — select the
                        sections applicable to this property.</p>
                </div>
            </div>

            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 pb-8">
                <div class="bg-white rounded-2xl shadow-xl shadow-black/15 overflow-hidden">

                    <!-- Address + date + officer -->
                    <div class="bg-slate-50 border-b border-slate-200 px-5 py-4 space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="block text-[0.65rem] font-black text-teal-600 uppercase tracking-widest mb-1">Property
                                    Address</label>
                                <input v-model="propertyAddress" type="text" placeholder="123 Example St, Suburb"
                                    class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                                    :class="setupErrors.address ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'" />
                                <p v-if="setupErrors.address" class="text-rose-500 text-[0.65rem] font-bold mt-1">
                                    Property address is required</p>
                            </div>
                            <div class="min-w-0">
                                <label
                                    class="block text-[0.65rem] font-black text-teal-600 uppercase tracking-widest mb-1">Review
                                    Date</label>
                                <input v-model="inspectionDate" type="date"
                                    class="w-full min-w-0 bg-white border border-slate-200 text-slate-800 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label
                                    class="block text-[0.65rem] font-black text-teal-600 uppercase tracking-widest mb-1">Housing
                                    Officer Name</label>
                                <input v-model="inspectorName" type="text" placeholder="Jane Smith"
                                    class="w-full bg-white border text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                                    :class="setupErrors.name ? 'border-rose-400 ring-1 ring-rose-400' : 'border-slate-200'" />
                                <p v-if="setupErrors.name" class="text-rose-500 text-[0.65rem] font-bold mt-1">Housing
                                    officer name is required</p>
                            </div>
                            <div>
                                <label
                                    class="block text-[0.65rem] font-black text-teal-600 uppercase tracking-widest mb-1">Housing
                                    Officer Email</label>
                                <input v-model="inspectorEmail" type="email" placeholder="officer@everhomes.com.au"
                                    class="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-base sm:text-sm font-medium rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 transition" />
                            </div>
                        </div>
                    </div>

                    <div class="px-5 py-6 space-y-6">

                        <!-- SDA Design Category -->
                        <div>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">SDA Design
                                Category</p>
                            <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Filters checklist items to those
                                applicable for this property</p>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                <button v-for="pt in PROPERTY_TYPES" :key="pt.key" @click="propertyType = pt.key"
                                    class="flex flex-col items-start gap-1.5 px-3.5 py-3 rounded-xl border-2 text-left transition-all duration-150"
                                    :style="propertyType === pt.key
                                        ? { backgroundColor: pt.color + '20', borderColor: pt.color, color: pt.color }
                                        : { borderColor: '#1e293b', color: '#64748b' }">
                                    <span class="text-sm font-black">{{ pt.key }}</span>
                                    <span class="text-[0.65rem] font-medium leading-tight opacity-80">{{ pt.label
                                    }}</span>
                                    <div class="flex flex-wrap gap-1 mt-0.5">
                                        <span v-for="cat in pt.includes" :key="cat"
                                            class="text-[0.55rem] font-black px-1.5 py-0.5 rounded-md uppercase"
                                            :style="sdaChipStyle(cat)">{{ cat }}</span>
                                    </div>
                                </button>
                            </div>
                            <p v-if="setupErrors.propertyType" class="text-rose-500 text-[0.65rem] font-bold mt-2">
                                Please select a design category</p>
                        </div>

                        <!-- Core sections (always included) -->
                        <div>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Core Sections
                            </p>
                            <p class="text-[0.68rem] text-slate-400 font-medium mb-3">Always included in every review
                            </p>
                            <div class="flex flex-wrap gap-2">
                                <div v-for="section in CORE_SECTIONS" :key="section.key"
                                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border"
                                    :style="{ backgroundColor: section.color + '20', borderColor: section.color + '60', color: section.color }">
                                    <component :is="section.icon" class="w-3.5 h-3.5 shrink-0" />
                                    {{ section.label }}
                                </div>
                            </div>
                        </div>

                        <!-- Optional sections -->
                        <div>
                            <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Additional
                                Sections</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <button v-for="section in visibleOptionalSections" :key="section.key"
                                    @click="toggleSection(section.key)"
                                    class="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-left transition-all duration-150 border"
                                    :class="selectedOptional.has(section.key) ? 'text-white border-transparent shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                                    :style="selectedOptional.has(section.key) ? { backgroundColor: section.color } : {}">
                                    <div class="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0"
                                        :class="selectedOptional.has(section.key) ? 'bg-white/25 border-white/60' : 'border-slate-300'">
                                        <Check v-if="selectedOptional.has(section.key)"
                                            class="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <component :is="section.icon" class="w-3.5 h-3.5 shrink-0" />
                                    {{ section.label }}
                                </button>
                            </div>
                        </div>

                        <button @click="tryStartHandover"
                            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-500/25 hover:-translate-y-0.5 transition-all duration-150">
                            {{ checklistSections.length ? 'Rebuild Checklist →' : 'Start Handover Review →' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════════ -->
        <!--  STEP 2 — CHECKLIST                                            -->
        <!-- ══════════════════════════════════════════════════════════════ -->
        <div data-checklist class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

            <div v-if="checklistSections.length === 0" class="flex flex-col items-center gap-3 py-16 text-center">
                <div
                    class="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                    <ClipboardCheck class="w-7 h-7 text-teal-400" />
                </div>
                <p class="text-sm font-semibold text-slate-400">Configure your review above<br><span
                        class="text-slate-500 font-normal">then hit Start Handover Review.</span></p>
            </div>

            <template v-else>
                <!-- Header + progress -->
                <div class="mb-5">
                    <div class="flex items-center justify-between mb-2">
                        <h2 class="text-base font-black text-white tracking-tight">Handover Checklist</h2>
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
                        <span class="text-xs text-slate-500 font-medium">{{ inspectedCount }} / {{
                            checklistSections.length }} sections done</span>
                        <span class="flex items-center gap-1 text-[0.65rem] font-semibold text-slate-600">
                            <Save class="w-3 h-3" />Auto-saved
                        </span>
                    </div>
                </div>

                <!-- Section accordion -->
                <div class="space-y-2">
                    <div v-for="(section, idx) in checklistSections" :key="section.id"
                        class="rounded-2xl overflow-hidden border-2 transition-colors duration-300"
                        :style="accordionBorderStyle(section.id)">

                        <button @click="toggleSection2(idx)"
                            class="w-full flex items-center gap-3 px-4 py-3.5 text-left focus:outline-none transition-colors">
                            <div class="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white shadow-sm"
                                :style="{ background: SECTION_META[section.type]?.gradient ?? SECTION_META.general.gradient }">
                                <component :is="SECTION_META[section.type]?.icon ?? ClipboardCheck" class="w-4 h-4" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="text-white font-bold text-sm leading-tight">{{ section.label }}</span>
                                </div>
                                <p class="text-xs mt-0.5">
                                    <span class="text-slate-500">{{ checklistData[section.id]?.photos?.length ?? 0 }}
                                        photo{{ (checklistData[section.id]?.photos?.length ?? 0) !== 1 ? 's' : '' }} ·
                                    </span>
                                    <span :style="{ color: statusColour(checklistData[section.id]?.status) }">{{
                                        statusLabel(checklistData[section.id]?.status) }}</span>
                                </p>
                            </div>
                            <div class="w-2 h-2 rounded-full shrink-0"
                                :style="{ background: statusColour(checklistData[section.id]?.status) }"></div>
                            <ChevronDown class="w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200"
                                :class="{ 'rotate-180': openSections.has(idx) }" />
                        </button>

                        <Transition enter-active-class="transition-all duration-300 ease-out"
                            leave-active-class="transition-all duration-200 ease-in"
                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[2400px]"
                            leave-from-class="opacity-100 max-h-[2400px]" leave-to-class="opacity-0 max-h-0">
                            <div v-if="openSections.has(idx) && checklistData[section.id]"
                                class="px-4 pb-5 pt-0 bg-slate-900/50 border-t border-slate-700/40 space-y-4">

                                <!-- Overall Status -->
                                <div class="pt-4">
                                    <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Overall Status</p>
                                    <template v-if="sectionIsAllNA(section.id)">
                                        <p class="text-[0.65rem] text-amber-400 font-semibold mb-2">All items marked N/A
                                            — select an overall status manually:</p>
                                        <div class="flex flex-wrap gap-2">
                                            <button v-for="s in STATUS_OPTIONS" :key="s.value"
                                                @click="checklistData[section.id].status = s.value"
                                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all duration-150"
                                                :class="checklistData[section.id].status === s.value ? s.activeClass : 'bg-transparent border-slate-700 text-slate-500 hover:border-slate-600'">
                                                <component :is="s.icon" class="w-3.5 h-3.5" />{{ s.label }}
                                            </button>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div
                                            class="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                            <component
                                                :is="STATUS_OPTIONS.find(s => s.value === (checklistData[section.id].status || 'unchecked'))?.icon ?? MinusCircle"
                                                class="w-4 h-4 shrink-0"
                                                :style="{ color: statusColour(checklistData[section.id].status) }" />
                                            <span class="text-sm font-bold"
                                                :style="{ color: statusColour(checklistData[section.id].status) }">
                                                {{ statusLabel(checklistData[section.id].status) }}
                                            </span>
                                            <span class="text-slate-600 text-xs ml-1">· auto-set from items</span>
                                        </div>
                                    </template>
                                </div>

                                <!-- Checklist Items -->
                                <div v-if="getFilteredGroups(section.type).length">
                                    <p
                                        class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2.5">
                                        Review Items</p>
                                    <div class="space-y-4">
                                        <div v-for="group in getFilteredGroups(section.type)" :key="group.group">
                                            <div class="flex items-center gap-2 mb-1.5">
                                                <span v-if="group.sda"
                                                    class="text-[0.55rem] font-black uppercase tracking-wider text-teal-400 bg-teal-500/15 border border-teal-500/25 px-1.5 py-0.5 rounded-full">SDA</span>
                                                <span
                                                    class="text-[0.6rem] font-black text-slate-600 uppercase tracking-wider">{{
                                                        group.group }}</span>
                                            </div>
                                            <div class="space-y-0.5">
                                                <template v-for="item in group.items" :key="item.id">

                                                    <!-- ── Input item (number / text) ── -->
                                                    <div v-if="item.type === 'number' || item.type === 'text'"
                                                        class="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-slate-800/40">
                                                        <div class="flex-1 flex flex-wrap items-center gap-1.5 min-w-0">
                                                            <span v-for="chip in parseLabel(item.label).chips"
                                                                :key="chip"
                                                                class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[0.58rem] font-black uppercase tracking-wide leading-none"
                                                                :style="sdaChipStyle(chip)">{{ chip }}</span>
                                                            <span class="text-xs font-medium leading-tight"
                                                                :class="item.sda ? 'text-slate-300' : 'text-slate-400'">
                                                                {{ parseLabel(item.label).text }}
                                                            </span>
                                                        </div>
                                                        <input :type="item.type" :placeholder="item.placeholder ?? ''"
                                                            :value="checklistData[section.id].inputs?.[item.id] ?? ''"
                                                            @input="setItemInput(section.id, item.id, $event.target.value)"
                                                            class="w-28 shrink-0 bg-slate-900/80 border border-slate-600 text-white placeholder-slate-600 text-xs font-medium rounded-lg px-2.5 py-1.5 text-right focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                                                            :class="item.type === 'number' ? 'w-20' : 'w-36'" />
                                                    </div>

                                                    <!-- ── Standard checklist item ── -->
                                                    <div v-else
                                                        class="flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors duration-150"
                                                        :class="itemRowClass(checklistData[section.id].items?.[item.id])">
                                                        <div class="flex-1 flex flex-wrap items-center gap-1.5 min-w-0"
                                                            :class="checklistData[section.id].items?.[item.id] === 'na' ? 'opacity-40' : ''">
                                                            <span v-for="chip in parseLabel(item.label).chips"
                                                                :key="chip"
                                                                class="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[0.58rem] font-black uppercase tracking-wide leading-none"
                                                                :style="sdaChipStyle(chip)">{{ chip }}</span>
                                                            <span class="text-xs font-medium leading-tight" :class="[
                                                                item.sda ? 'text-slate-300' : 'text-slate-400',
                                                                checklistData[section.id].items?.[item.id] === 'issue' ? '!text-rose-300' : '',
                                                            ]">{{ parseLabel(item.label).text }}</span>
                                                        </div>
                                                        <div class="flex items-center gap-0.5 shrink-0">
                                                            <button v-for="s in ITEM_STATUS_OPTIONS" :key="s.value"
                                                                @click="setItemStatus(section.id, item.id, s.value)"
                                                                :title="s.label"
                                                                class="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-100 border"
                                                                :class="checklistData[section.id].items?.[item.id] === s.value
                                                                    ? s.activeClass
                                                                    : 'border-slate-700/60 text-slate-600 hover:border-slate-600 hover:text-slate-400 bg-transparent'">
                                                                <component :is="s.icon" class="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Notes -->
                                <div>
                                    <label
                                        class="block text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-1.5">Notes</label>
                                    <textarea v-model="checklistData[section.id].notes" rows="3"
                                        placeholder="Add any observations, issues, or notes..."
                                        class="w-full bg-slate-800/70 border border-slate-700 text-white placeholder-slate-600 text-base sm:text-sm rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                                </div>

                                <!-- Photos -->
                                <div>
                                    <div class="flex items-center justify-between mb-2">
                                        <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest">
                                            Photos</p>
                                        <button @click="openPhotoModal(idx)"
                                            class="flex items-center gap-1 text-xs font-bold text-teal-400 hover:text-teal-300 px-2 py-1 rounded-lg hover:bg-teal-500/10 transition-colors">
                                            <Plus class="w-3.5 h-3.5" />Add Photo
                                        </button>
                                    </div>

                                    <div v-if="checklistData[section.id].photos.length"
                                        class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        <div v-for="(photo, pIdx) in checklistData[section.id].photos" :key="pIdx"
                                            class="flex flex-col gap-1">
                                            <div class="relative group aspect-square rounded-xl overflow-hidden border-2"
                                                :class="photo.uploadStatus === 'failed' ? 'border-rose-500/60' : photo.uploadStatus === 'uploading' ? 'border-teal-500/60' : 'border-slate-700/60'">
                                                <img :src="photo.thumbUrl || photo.previewUrl" alt="Photo"
                                                    class="w-full h-full object-cover" />
                                                <!-- Uploading overlay -->
                                                <div v-if="photo.uploadStatus === 'uploading'"
                                                    class="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <div
                                                        class="w-6 h-6 rounded-full border-2 border-teal-400/30 border-t-teal-400 animate-spin" />
                                                </div>
                                                <!-- Failed overlay -->
                                                <div v-if="photo.uploadStatus === 'failed' || photo.uploadStatus === 'skipped'"
                                                    class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                                    <XCircle class="w-5 h-5 text-rose-400" />
                                                    <button @click="retryPhotoUpload(section.id, pIdx)"
                                                        class="text-[0.6rem] font-bold text-rose-300 hover:text-white px-1.5 py-0.5 bg-rose-500/30 rounded-md transition-colors">
                                                        Retry
                                                    </button>
                                                </div>
                                                <!-- Remove button -->
                                                <button v-if="photo.uploadStatus !== 'uploading'"
                                                    @click="removePhoto(section.id, pIdx)"
                                                    class="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/70">
                                                    <X class="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                            <p v-if="photo.caption"
                                                class="text-[0.6rem] text-slate-500 leading-tight truncate px-0.5">{{
                                                    photo.caption
                                                }}</p>
                                        </div>
                                    </div>

                                    <button v-else @click="openPhotoModal(idx)"
                                        class="w-full flex flex-col items-center gap-1.5 py-5 rounded-xl border-2 border-dashed border-slate-700 hover:border-teal-500/40 hover:bg-teal-500/5 transition-colors group">
                                        <Camera
                                            class="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                                        <p
                                            class="text-xs text-slate-600 group-hover:text-teal-400 transition-colors font-medium">
                                            Tap to add photos</p>
                                    </button>

                                    <div v-if="hasSkippedPhotos(section.id)"
                                        class="mt-2 flex items-start gap-2 px-3 py-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                                        <AlertTriangle class="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                        <p class="text-xs text-amber-300 font-medium leading-tight">Some photos failed
                                            to upload. Please email them
                                            directly to <span class="font-black">admin@everhomes.com.au</span> with the
                                            property address and date.</p>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- Bottom submit -->
                <div class="mt-6 pt-6 border-t border-slate-700/50">
                    <button @click="openSubmit"
                        class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-2">
                        <Send class="w-4 h-4" />Submit Handover Review
                    </button>
                    <p class="text-center text-xs text-slate-600 font-medium mt-2">
                        {{ uninspectedCount > 0 ? `${uninspectedCount} section${uninspectedCount !== 1 ? 's' : ''} still
                        unchecked` :
                            'All sections reviewed ✓' }}
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

                            <!-- Processing -->
                            <div v-if="submitModal.loading"
                                class="flex flex-col items-center gap-5 px-6 py-12 text-center">
                                <div
                                    class="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center">
                                    <div
                                        class="w-8 h-8 rounded-full border-4 border-teal-500/30 border-t-teal-500 animate-spin" />
                                </div>
                                <div>
                                    <h3 class="text-white font-black text-lg">{{ submitModal.statusMessage }}</h3>
                                    <p class="text-slate-400 text-sm mt-1">This takes around 30–60 seconds. Don't close
                                        this
                                        page.</p>
                                </div>
                            </div>

                            <!-- Done -->
                            <div v-else-if="submitModal.done"
                                class="flex flex-col items-center gap-4 px-6 py-10 text-center">
                                <div
                                    class="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                                    <CheckCircle class="w-8 h-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 class="text-white font-black text-lg">Handover Review Submitted</h3>
                                    <p class="text-slate-400 text-sm mt-1">Report emailed to admin{{ inspectorEmail ? `
                                        and
                                        ${inspectorEmail}` : '' }}.</p>
                                </div>
                                <a v-if="submitModal.pdfUrl" :href="submitModal.pdfUrl" target="_blank"
                                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-colors">
                                    <FileText class="w-4 h-4" />View PDF Report
                                </a>
                                <button @click="submitModal.open = false; submitModal.done = false"
                                    class="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-colors">
                                    Close
                                </button>
                            </div>

                            <!-- Error -->
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
                                        <h3 class="text-white font-black text-base">Submit Handover Review</h3>
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

                                <div v-if="flaggedSections.length" class="px-5 pt-4">
                                    <p class="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest mb-2">
                                        Flagged Sections</p>
                                    <div class="space-y-1.5">
                                        <div v-for="sec in flaggedSections" :key="sec.id"
                                            class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border"
                                            :style="flaggedStyle(sec.status)">
                                            <div class="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                                                :style="{ background: SECTION_META[sec.type]?.gradient ?? SECTION_META.general.gradient }">
                                                <component :is="SECTION_META[sec.type]?.icon ?? ClipboardCheck"
                                                    class="w-3.5 h-3.5" />
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-white text-xs font-bold leading-tight truncate">{{
                                                    sec.label }}</p>
                                                <p class="text-xs mt-0.5" :style="{ color: statusColour(sec.status) }">
                                                    {{ statusLabel(sec.status) }}</p>
                                            </div>
                                            <component :is="sec.status === 'issue' ? XCircle : AlertTriangle"
                                                class="w-4 h-4 shrink-0" :style="{ color: statusColour(sec.status) }" />
                                        </div>
                                    </div>
                                </div>

                                <div v-if="hasAnyUploading"
                                    class="mx-5 mt-4 flex items-center gap-2.5 px-3.5 py-3 bg-teal-500/10 border border-teal-500/25 rounded-xl">
                                    <div
                                        class="w-3.5 h-3.5 rounded-full border-2 border-teal-400/30 border-t-teal-400 animate-spin shrink-0" />
                                    <p class="text-xs text-teal-300 font-semibold">Some photos are still uploading —
                                        please wait before submitting.</p>
                                </div>

                                <div v-if="uninspectedCount > 0"
                                    class="mx-5 mt-4 flex items-center gap-2.5 px-3.5 py-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                                    <AlertTriangle class="w-4 h-4 text-amber-400 shrink-0" />
                                    <p class="text-xs text-amber-300 font-semibold">{{ uninspectedCount }} section{{
                                        uninspectedCount !== 1 ? 's' : '' }} still unchecked — you can still submit.</p>
                                </div>

                                <div class="flex gap-3 px-5 py-5">
                                    <button @click="submitModal.open = false"
                                        class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors">
                                        Back
                                    </button>
                                    <button @click="confirmSubmit" :disabled="hasAnyUploading"
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
                        class="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
                        <h3 class="text-white font-black text-base mb-1">Clear Checklist?</h3>
                        <p class="text-slate-400 text-sm mb-5">All review data and photos will be permanently removed.
                        </p>
                        <div class="flex gap-3">
                            <button @click="confirmClear.open = false"
                                class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 text-sm font-bold transition-colors hover:border-slate-600">Cancel</button>
                            <button @click="clearChecklist"
                                class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-black transition-colors">
                                Clear All
                            </button>
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
                                    <h2 class="text-white font-extrabold text-base">Add Photo</h2>
                                    <p class="text-slate-400 text-xs mt-0.5">{{ photoModal.sectionLabel }}</p>
                                </div>
                                <button @click="closePhotoModal"
                                    class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors">
                                    <X class="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                            <div v-if="photoModal.preview"
                                class="mb-4 relative rounded-xl overflow-hidden aspect-video bg-slate-800">
                                <img :src="photoModal.preview" alt="Preview" class="w-full h-full object-contain" />
                                <button @click="photoModal.preview = null"
                                    class="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                                    <X class="w-3.5 h-3.5 text-white" />
                                </button>
                            </div>
                            <div v-if="!photoModal.preview" class="grid grid-cols-2 gap-3 mb-4">
                                <button @click="cameraInputRef?.click()"
                                    class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-slate-700 hover:border-teal-500/60 hover:bg-teal-500/5 transition-colors group">
                                    <Camera
                                        class="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                                    <span
                                        class="text-xs font-bold text-slate-400 group-hover:text-teal-400 transition-colors">Take
                                        Photo</span>
                                </button>
                                <button @click="fileInputRef?.click()"
                                    class="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-slate-700 hover:border-teal-500/60 hover:bg-teal-500/5 transition-colors group">
                                    <ImageIcon
                                        class="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                                    <span
                                        class="text-xs font-bold text-slate-400 group-hover:text-teal-400 transition-colors">Choose
                                        from Gallery</span>
                                </button>
                            </div>
                            <input ref="cameraInputRef" type="file" accept="image/*" capture="environment"
                                class="hidden" @change="handleFileSelect" />
                            <input ref="fileInputRef" type="file" accept="image/*" class="hidden"
                                @change="handleFileSelect" />
                            <div v-if="photoModal.preview" class="mb-5">
                                <label
                                    class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Caption
                                    <span class="normal-case font-medium tracking-normal text-slate-500">—
                                        optional</span></label>
                                <input v-model="photoModal.caption" type="text"
                                    placeholder="e.g. Damaged grab rail in shower"
                                    class="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-base sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 transition" />
                            </div>
                            <div class="flex gap-3">
                                <button @click="closePhotoModal"
                                    class="flex-1 py-2.5 rounded-xl border-2 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-bold transition-colors">Cancel</button>
                                <button v-if="photoModal.preview" @click="confirmPhoto"
                                    class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold transition-all shadow-lg shadow-teal-500/20">
                                    Add Photo
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

    </LayoutComponent>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import LayoutComponent from '@/components/everhomes/layouts/LayoutComponent.vue'

import { storage, firestore } from '@/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'

import {
    ClipboardCheck, ChevronDown, Plus, X, Camera,
    Image as ImageIcon, CheckCircle, AlertTriangle,
    XCircle, MinusCircle, Check, Send, Trash2, Save,
    FileText, Home, Rows3, AppWindow, Droplets, UtensilsCrossed,
    Wrench, BedDouble, Sofa, MoveUp, TreePine, ParkingSquare,
    DoorOpen, Columns, SquareSplitVertical, ShieldAlert,
} from 'lucide-vue-next'
import { HANDOVER_ITEMS, getHandoverGroups } from '@/data/handoverItems.js'

// ─── Constants ──────────────────────────────────────────────────────────────

const CACHE_KEY = 'everhomes_handover_v1'
const REPORT_TYPE = 'handover'
const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL ?? ''

const SECTION_META = {
    general: { icon: ClipboardCheck, gradient: 'linear-gradient(135deg,#0D9488,#2DD4BF)', label: 'General & Compliance' },
    accessway: { icon: Rows3, gradient: 'linear-gradient(135deg,#0891B2,#38BDF8)', label: 'Accessways' },
    carParking: { icon: ParkingSquare, gradient: 'linear-gradient(135deg,#475569,#94A3B8)', label: 'Car Parking' },
    entrance: { icon: DoorOpen, gradient: 'linear-gradient(135deg,#EA580C,#FB923C)', label: 'Entrance & Doors' },
    corridors: { icon: Columns, gradient: 'linear-gradient(135deg,#7C3AED,#A855F7)', label: 'Corridors' },
    windows: { icon: AppWindow, gradient: 'linear-gradient(135deg,#0284C7,#38BDF8)', label: 'Windows & Glazing' },
    sanitary: { icon: Droplets, gradient: 'linear-gradient(135deg,#0891B2,#22D3EE)', label: 'Sanitary / Bathrooms' },
    kitchen: { icon: UtensilsCrossed, gradient: 'linear-gradient(135deg,#C2410C,#F97316)', label: 'Kitchen' },
    laundry: { icon: Wrench, gradient: 'linear-gradient(135deg,#4F46E5,#818CF8)', label: 'Laundry' },
    bedroom: { icon: BedDouble, gradient: 'linear-gradient(135deg,#7C3AED,#A855F7)', label: 'Bedroom(s)' },
    living: { icon: Sofa, gradient: 'linear-gradient(135deg,#D97706,#FBBF24)', label: 'Living Areas' },
    stairs: { icon: MoveUp, gradient: 'linear-gradient(135deg,#64748B,#CBD5E1)', label: 'Stairs & Lifts' },
    external: { icon: TreePine, gradient: 'linear-gradient(135deg,#15803D,#4ADE80)', label: 'External Areas' },
    breakout: { icon: ShieldAlert, gradient: 'linear-gradient(135deg,#B45309,#F59E0B)', label: 'Breakout Room' },
}

const CORE_SECTIONS = [
    { key: 'general', label: 'General & Compliance', color: '#0D9488', icon: ClipboardCheck },
    { key: 'entrance', label: 'Entrance & Doors', color: '#EA580C', icon: DoorOpen },
    { key: 'corridors', label: 'Corridors', color: '#7C3AED', icon: Columns },
    { key: 'windows', label: 'Windows & Glazing', color: '#0284C7', icon: AppWindow },
    { key: 'sanitary', label: 'Sanitary / Bathrooms', color: '#0891B2', icon: Droplets },
    { key: 'kitchen', label: 'Kitchen', color: '#C2410C', icon: UtensilsCrossed },
    { key: 'laundry', label: 'Laundry', color: '#4F46E5', icon: Wrench },
    { key: 'bedroom', label: 'Bedroom(s)', color: '#7C3AED', icon: BedDouble },
    { key: 'living', label: 'Living Areas', color: '#D97706', icon: Sofa },
]

const OPTIONAL_SECTIONS = [
    { key: 'accessway', label: 'Accessways', color: '#0891B2', icon: Rows3 },
    { key: 'carParking', label: 'Car Parking', color: '#475569', icon: ParkingSquare },
    { key: 'stairs', label: 'Stairs & Lifts', color: '#64748B', icon: MoveUp },
    { key: 'external', label: 'External Areas', color: '#15803D', icon: TreePine },
    { key: 'breakout', label: 'Breakout Room', color: '#B45309', icon: ShieldAlert },
]

const STATUS_OPTIONS = [
    { value: 'ok', label: 'OK', icon: CheckCircle, activeClass: 'bg-emerald-500/20 border-emerald-500 text-emerald-400' },
    { value: 'attention', label: 'Needs Attention', icon: AlertTriangle, activeClass: 'bg-amber-500/20 border-amber-500 text-amber-400' },
    { value: 'issue', label: 'Issue Found', icon: XCircle, activeClass: 'bg-rose-500/20 border-rose-500 text-rose-400' },
    { value: 'na', label: 'N/A', icon: MinusCircle, activeClass: 'bg-slate-700 border-slate-500 text-slate-400' },
]

const ITEM_STATUS_OPTIONS = [
    { value: 'ok', label: 'OK', icon: CheckCircle, activeClass: 'bg-emerald-500/25 border-emerald-500/80 text-emerald-400' },
    { value: 'attention', label: 'Needs Attention', icon: AlertTriangle, activeClass: 'bg-amber-500/25 border-amber-500/80 text-amber-400' },
    { value: 'issue', label: 'Issue Found', icon: XCircle, activeClass: 'bg-rose-500/25 border-rose-500/80 text-rose-400' },
    { value: 'na', label: 'N/A', icon: MinusCircle, activeClass: 'bg-slate-700/80 border-slate-500/80 text-slate-400' },
]

// ─── Setup state ─────────────────────────────────────────────────────────────

const propertyAddress = ref('')
const inspectionDate = ref(new Date().toISOString().split('T')[0])
const inspectorName = ref('')
const inspectorEmail = ref('')
const setupErrors = reactive({ address: false, name: false, propertyType: false })

const selectedOptional = reactive(new Set())
const propertyType = ref(null)

function toggleSection(key) {
    selectedOptional.has(key) ? selectedOptional.delete(key) : selectedOptional.add(key)
}

function validateSetup() {
    setupErrors.address = !propertyAddress.value.trim()
    setupErrors.name = !inspectorName.value.trim()
    setupErrors.propertyType = !propertyType.value
    return !setupErrors.address && !setupErrors.name && !setupErrors.propertyType
}

function tryStartHandover() {
    if (!validateSetup()) return
    startHandover()
}

// ─── Checklist state ─────────────────────────────────────────────────────────

const handoverId = ref(null)
const checklistSections = ref([])
const openSections = ref(new Set())

// checklistData[sectionId] = { status, notes, photos: [], items: {} }
const checklistData = reactive({})

function getAllItemIds(type) {
    // Only status-checked items contribute to section scoring — skip input types
    return getHandoverGroups(type).flatMap(g =>
        g.items.filter(i => !i.type).map(i => i.id)
    )
}

function ensureEntry(id, type) {
    if (!checklistData[id]) {
        const items = {}
        getAllItemIds(type).forEach(itemId => { items[itemId] = 'unchecked' })
        checklistData[id] = { status: 'unchecked', notes: '', photos: [], items, inputs: {} }
    }
}

function startHandover() {
    const sections = []
    const newId = crypto.randomUUID()
    handoverId.value = newId

    // Core sections always first
    for (const s of CORE_SECTIONS) {
        sections.push({ id: `section-${s.key}`, type: s.key, label: s.label })
        ensureEntry(`section-${s.key}`, s.key)
    }

    // Optional sections
    for (const s of OPTIONAL_SECTIONS) {
        if (selectedOptional.has(s.key)) {
            sections.push({ id: `section-${s.key}`, type: s.key, label: s.label })
            ensureEntry(`section-${s.key}`, s.key)
        }
    }

    checklistSections.value = sections
    openSections.value = new Set([0])
    saveToCache()

    setTimeout(() => {
        document.querySelector('[data-checklist]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
}

// ─── Per-item status ─────────────────────────────────────────────────────────

function setItemStatus(sectionId, itemId, status) {
    if (!checklistData[sectionId]) return
    const entry = checklistData[sectionId]
    if (!entry.items) entry.items = {}
    // Toggle off if tapping the same status again
    entry.items[itemId] = entry.items[itemId] === status ? 'unchecked' : status
    recomputeSectionStatus(sectionId)
    saveToCache()
}

function setItemInput(sectionId, itemId, value) {
    if (!checklistData[sectionId]) return
    const entry = checklistData[sectionId]
    if (!entry.inputs) entry.inputs = {}
    entry.inputs[itemId] = value
    saveToCache()
}

function recomputeSectionStatus(sectionId) {
    const entry = checklistData[sectionId]
    if (!entry) return
    const values = Object.values(entry.items ?? {})
    if (!values.length) return

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

function sectionIsAllNA(sectionId) {
    const items = checklistData[sectionId]?.items ?? {}
    const vals = Object.values(items)
    return vals.length > 0 && vals.every(v => v === 'na')
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function statusColour(status) {
    if (status === 'ok') return '#10B981'
    if (status === 'attention') return '#F59E0B'
    if (status === 'issue') return '#F43F5E'
    if (status === 'na') return '#64748B'
    return '#475569'
}

function statusLabel(status) {
    if (status === 'ok') return 'OK'
    if (status === 'attention') return 'Needs Attention'
    if (status === 'issue') return 'Issue Found'
    if (status === 'na') return 'N/A'
    return 'Unchecked'
}

function itemRowClass(status) {
    if (status === 'issue') return 'bg-rose-500/10'
    if (status === 'attention') return 'bg-amber-500/10'
    if (status === 'ok') return 'bg-emerald-500/10'
    return ''
}

function accordionBorderStyle(id) {
    const status = checklistData[id]?.status
    if (status === 'ok') return { borderColor: '#10B98130' }
    if (status === 'attention') return { borderColor: '#F59E0B30' }
    if (status === 'issue') return { borderColor: '#F43F5E40' }
    return { borderColor: '#1E293B' }
}

// ─── SDA property type filtering ─────────────────────────────────────────────

const PROPERTY_TYPES = [
    { key: 'HPS', label: 'High Physical Support', color: '#7c3aed', includes: ['HPS', 'FA', 'IL'] },
    { key: 'FA', label: 'Fully Accessible', color: '#2563eb', includes: ['FA', 'IL'] },
    { key: 'IL', label: 'Improved Liveability', color: '#d97706', includes: ['IL'] },
    { key: 'R', label: 'Robust', color: '#e11d48', includes: ['R', 'IL'] },
]

// Breakout is Robust-only — hide it from optional sections for other categories
const visibleOptionalSections = computed(() =>
    OPTIONAL_SECTIONS.filter(s => s.key !== 'breakout' || propertyType.value === 'R')
)

function itemApplicable(item) {
    if (!propertyType.value) return true
    const { chips } = parseLabel(item.label)
    if (!chips.length) return true
    const allowed = PROPERTY_TYPES.find(p => p.key === propertyType.value)?.includes ?? []
    return chips.some(c => allowed.includes(c))
}

function getFilteredGroups(type) {
    return getHandoverGroups(type)
        .map(group => ({ ...group, items: group.items.filter(itemApplicable) }))
        .filter(group => group.items.length > 0)
}

// ─── SDA chip helpers ─────────────────────────────────────────────────────────

const SDA_CHIP_STYLES = {
    HPS: { background: '#7c3aed20', border: '1px solid #7c3aed60', color: '#c4b5fd' },
    FA: { background: '#2563eb20', border: '1px solid #2563eb60', color: '#93c5fd' },
    IL: { background: '#d9770620', border: '1px solid #d9770660', color: '#fcd34d' },
    R: { background: '#e11d4820', border: '1px solid #e11d4860', color: '#fca5a5' },
}

function sdaChipStyle(chip) {
    return SDA_CHIP_STYLES[chip] ?? { background: '#47556920', border: '1px solid #47556960', color: '#94a3b8' }
}

// Parses "HPS/FA: Some label text" → { chips: ['HPS', 'FA'], text: 'Some label text' }
// Parses "Some label text" → { chips: [], text: 'Some label text' }
function parseLabel(label) {
    const match = label.match(/^((?:(?:HPS|FA|IL|R)\/)*(?:HPS|FA|IL|R)):\s*(.+)$/)
    if (!match) return { chips: [], text: label }
    return {
        chips: match[1].split('/'),
        text: match[2],
    }
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function toggleSection2(idx) {
    const s = new Set(openSections.value)
    s.has(idx) ? s.delete(idx) : s.add(idx)
    openSections.value = s
}

// ─── Progress ────────────────────────────────────────────────────────────────

const inspectedCount = computed(() =>
    checklistSections.value.filter(s => checklistData[s.id]?.status !== 'unchecked').length
)
const uninspectedCount = computed(() =>
    checklistSections.value.filter(s => checklistData[s.id]?.status === 'unchecked').length
)
const progressPercent = computed(() => {
    if (!checklistSections.value.length) return 0
    return Math.round((inspectedCount.value / checklistSections.value.length) * 100)
})
const progressGradient = computed(() => {
    const p = progressPercent.value
    if (p === 100) return 'linear-gradient(90deg,#10B981,#059669)'
    if (p >= 60) return 'linear-gradient(90deg,#0D9488,#10B981)'
    return 'linear-gradient(90deg,#0891B2,#0D9488)'
})

// ─── Photo upload ─────────────────────────────────────────────────────────────

async function uploadPhotoToStorage(file, sectionId) {
    if (!handoverId.value) throw new Error('No handover ID')
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${REPORT_TYPE}s/${handoverId.value}/photos/${sectionId}_${Date.now()}.${ext}`
    const fileRef = storageRef(storage, path)
    const MAX_ATTEMPTS = 3
    let lastError
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            await uploadBytes(fileRef, file, { contentType: file.type || 'image/jpeg' })
            const url = await getDownloadURL(fileRef)
            return { url, storagePath: path }
        } catch (err) {
            lastError = err
            if (attempt < MAX_ATTEMPTS) await new Promise(r => setTimeout(r, attempt * 1000))
        }
    }
    throw lastError
}

async function deletePhotoFromStorage(storagePath) {
    if (!storagePath) return
    try { await deleteObject(storageRef(storage, storagePath)) } catch { /* ignore */ }
}

const cameraInputRef = ref(null)
const fileInputRef = ref(null)
const photoModal = reactive({ open: false, sectionIdx: null, sectionLabel: '', preview: null, rawFile: null, caption: '' })

function openPhotoModal(idx) {
    Object.assign(photoModal, { open: true, sectionIdx: idx, sectionLabel: checklistSections.value[idx]?.label ?? '', preview: null, rawFile: null, caption: '' })
}
function closePhotoModal() {
    Object.assign(photoModal, { open: false, sectionIdx: null, sectionLabel: '', preview: null, rawFile: null, caption: '' })
}

function handleFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) return
    photoModal.rawFile = file
    const reader = new FileReader()
    reader.onload = e => { photoModal.preview = e.target.result }
    reader.readAsDataURL(file)
    event.target.value = ''
}

async function confirmPhoto() {
    if (photoModal.sectionIdx === null || !photoModal.rawFile) return
    const section = checklistSections.value[photoModal.sectionIdx]
    if (!section || !checklistData[section.id]) return

    const previewUrl = photoModal.preview
    const caption = photoModal.caption
    const rawFile = photoModal.rawFile
    const sectionId = section.id

    const photoEntry = reactive({ previewUrl, thumbUrl: null, url: null, storagePath: null, caption, uploadStatus: 'uploading' })
    checklistData[sectionId].photos.push(photoEntry)

    if (checklistData[sectionId].status === 'unchecked') {
        checklistData[sectionId].status = 'ok'
    }

    closePhotoModal()

    try {
        const { url, storagePath } = await uploadPhotoToStorage(rawFile, sectionId)
        photoEntry.url = url
        photoEntry.thumbUrl = url
        photoEntry.storagePath = storagePath
        photoEntry.uploadStatus = 'done'
    } catch {
        photoEntry.uploadStatus = 'failed'
    }
}

async function retryPhotoUpload(sectionId, photoIdx) {
    const photo = checklistData[sectionId]?.photos?.[photoIdx]
    if (!photo || photo.uploadStatus === 'uploading') return
    photo.uploadStatus = 'uploading'
    try {
        const blob = await fetch(photo.previewUrl).then(r => r.blob())
        const fakeFile = new File([blob], 'retry.jpg', { type: 'image/jpeg' })
        const { url, storagePath } = await uploadPhotoToStorage(fakeFile, sectionId)
        photo.url = url
        photo.thumbUrl = url
        photo.storagePath = storagePath
        photo.uploadStatus = 'done'
    } catch {
        photo.uploadStatus = 'skipped'
    }
}

async function removePhoto(sectionId, photoIdx) {
    const photo = checklistData[sectionId]?.photos?.[photoIdx]
    if (!photo) return
    if (photo.storagePath) await deletePhotoFromStorage(photo.storagePath)
    checklistData[sectionId].photos.splice(photoIdx, 1)
}

function hasSkippedPhotos(sectionId) {
    return checklistData[sectionId]?.photos?.some(p => p.uploadStatus === 'skipped') ?? false
}

const hasAnyUploading = computed(() =>
    Object.values(checklistData).some(d => d.photos?.some(p => p.uploadStatus === 'uploading'))
)

// ─── Submit ───────────────────────────────────────────────────────────────────

const submitModal = reactive({ open: false, loading: false, done: false, error: null, pdfUrl: null, statusMessage: '' })

const submitStats = computed(() => {
    let ok = 0, attention = 0, issues = 0, total = 0
    for (const sec of checklistSections.value) {
        const items = checklistData[sec.id]?.items ?? {}
        for (const status of Object.values(items)) {
            total++
            if (status === 'ok') ok++
            else if (status === 'attention') attention++
            else if (status === 'issue') issues++
        }
    }
    return [
        { label: 'Total', count: total, color: '#64748B' },
        { label: 'OK', count: ok, color: '#10B981' },
        { label: 'Attention', count: attention, color: '#F59E0B' },
        { label: 'Issues', count: issues, color: '#F43F5E' },
    ]
})

const flaggedSections = computed(() =>
    checklistSections.value
        .filter(s => ['issue', 'attention'].includes(checklistData[s.id]?.status))
        .map(s => ({ ...s, status: checklistData[s.id].status }))
        .sort((a, b) => (a.status === 'issue' ? -1 : 1))
)

function flaggedStyle(status) {
    if (status === 'issue') return { borderColor: '#F43F5E30', background: '#F43F5E08' }
    if (status === 'attention') return { borderColor: '#F59E0B30', background: '#F59E0B08' }
    return {}
}

function openSubmit() {
    if (!validateSetup()) return
    submitModal.open = true
    submitModal.loading = false
    submitModal.done = false
    submitModal.error = null
    submitModal.pdfUrl = null
}

let firestoreUnsub = null

async function confirmSubmit() {
    if (hasAnyUploading.value) return

    submitModal.loading = true
    submitModal.error = null
    submitModal.statusMessage = 'Generating report…'

    const id = handoverId.value ?? crypto.randomUUID()
    handoverId.value = id

    const docRef = doc(firestore, `${REPORT_TYPE}s`, id)
    await setDoc(docRef, {
        status: 'pending',
        propertyAddress: propertyAddress.value,
        inspectionDate: inspectionDate.value,
        inspectorName: inspectorName.value,
        inspectorEmail: inspectorEmail.value,
        createdAt: serverTimestamp(),
    })

    if (firestoreUnsub) firestoreUnsub()
    firestoreUnsub = onSnapshot(docRef, snap => {
        const data = snap.data()
        if (!data) return
        if (data.status === 'processing') {
            submitModal.statusMessage = 'Building PDF and packaging photos…'
        } else if (data.status === 'complete') {
            firestoreUnsub?.()
            submitModal.loading = false
            submitModal.done = true
            submitModal.pdfUrl = data.pdfUrl ?? null
            clearCache()
        } else if (data.status === 'failed') {
            firestoreUnsub?.()
            submitModal.loading = false
            submitModal.error = data.error ?? 'Report generation failed. Please try again.'
        }
    })

    const rooms = checklistSections.value.map(section => ({
        id: section.id,
        type: section.type,
        label: section.label,
        isOOA: false,
        isEnsuite: false,
        status: checklistData[section.id]?.status ?? 'unchecked',
        notes: checklistData[section.id]?.notes ?? '',
        items: checklistData[section.id]?.items ?? {},
        inputs: checklistData[section.id]?.inputs ?? {},
        photos: (checklistData[section.id]?.photos ?? [])
            .filter(p => p.uploadStatus === 'done' && p.url)
            .map(p => ({ url: p.url, caption: p.caption, storagePath: p.storagePath })),
    }))

    try {
        const response = await fetch(`${FUNCTIONS_URL}/generateInspectionReport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reportType: REPORT_TYPE,
                inspectionId: id,
                propertyAddress: propertyAddress.value,
                inspectionDate: inspectionDate.value,
                inspectorName: inspectorName.value,
                inspectorEmail: inspectorEmail.value,
                rooms,
            }),
        })

        if (!response.ok) {
            const err = await response.json().catch(() => ({}))
            throw new Error(err.details ?? err.error ?? `HTTP ${response.status}`)
        }
    } catch (err) {
        firestoreUnsub?.()
        submitModal.loading = false
        submitModal.error = err.message
    }
}

// ─── Clear ────────────────────────────────────────────────────────────────────

const confirmClear = reactive({ open: false })

function clearChecklist() {
    checklistSections.value = []
    Object.keys(checklistData).forEach(k => delete checklistData[k])
    openSections.value = new Set()
    handoverId.value = null
    confirmClear.open = false
    clearCache()
}

// ─── LocalStorage cache ───────────────────────────────────────────────────────

function saveToCache() {
    try {
        const payload = {
            propertyAddress: propertyAddress.value,
            inspectionDate: inspectionDate.value,
            inspectorName: inspectorName.value,
            inspectorEmail: inspectorEmail.value,
            propertyType: propertyType.value,
            selectedOptional: [...selectedOptional],
            handoverId: handoverId.value,
            checklistSections: checklistSections.value,
            checklistData: Object.fromEntries(
                Object.entries(checklistData).map(([k, v]) => [
                    k,
                    {
                        status: v.status,
                        notes: v.notes,
                        items: v.items ?? {},
                        inputs: v.inputs ?? {},
                        photos: (v.photos ?? [])
                            .filter(p => p.url)
                            .map(p => ({ thumbUrl: p.url, url: p.url, storagePath: p.storagePath, caption: p.caption, uploadStatus: 'done' })),
                    },
                ])
            ),
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
    } catch { /* quota exceeded */ }
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
        if (data.handoverId) handoverId.value = data.handoverId
        if (data.propertyType) propertyType.value = data.propertyType

        if (Array.isArray(data.selectedOptional)) {
            selectedOptional.clear()
            data.selectedOptional.forEach(k => selectedOptional.add(k))
        }
        if (Array.isArray(data.checklistSections) && data.checklistSections.length) {
            checklistSections.value = data.checklistSections
        }
        if (data.checklistData && typeof data.checklistData === 'object') {
            Object.assign(checklistData, data.checklistData)
            for (const entry of Object.values(checklistData)) {
                if (!entry.items) entry.items = {}
                if (!entry.inputs) entry.inputs = {}
                if (!entry.photos) entry.photos = []
            }
        }
    } catch { /* corrupt cache */ }
}

let _saveTimer = null
function debouncedSave() {
    clearTimeout(_saveTimer)
    _saveTimer = setTimeout(saveToCache, 800)
}

watch([propertyAddress, inspectionDate, inspectorName, inspectorEmail, propertyType], debouncedSave)
watch(() => [...selectedOptional], debouncedSave)
watch(checklistSections, debouncedSave, { deep: true })
watch(checklistData, debouncedSave, { deep: true })

onMounted(loadFromCache)
onUnmounted(() => firestoreUnsub?.())
</script>

<style>
@media (max-width: 639px) {

    input[type="text"],
    input[type="email"],
    input[type="date"],
    textarea {
        font-size: 16px !important;
    }
}
</style>