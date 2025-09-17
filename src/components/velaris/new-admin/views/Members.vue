<template>
    <div class="flex gap-4 lg:gap-6 h-full relative">
        <!-- Main Content Area -->
        <div class="flex-1 min-w-0">
            <!-- Header -->
            <div class="mb-4 lg:mb-6">
                <h1 class="text-xl lg:text-2xl font-semibold text-velaris-purple">Members</h1>
                <p class="text-xs lg:text-sm text-foreground/70 mt-1">Manage your guild members and track their
                    performance</p>
            </div>

            <!-- Stats Pills -->
            <div class="mb-4 lg:mb-6 flex flex-wrap items-center gap-2 lg:gap-3">
                <div
                    class="inline-flex items-center gap-2 rounded-full bg-velaris-green/15 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-velaris-green">
                    <Users class="h-3 lg:h-4 w-3 lg:w-4" />
                    {{ totalMembers }} Total
                </div>
                <div
                    class="inline-flex items-center gap-2 rounded-full bg-velaris-teal/15 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-velaris-teal">
                    <span class="h-1.5 lg:h-2 w-1.5 lg:w-2 rounded-full bg-velaris-teal animate-pulse"></span>
                    {{ activeMembers }} Active
                </div>
                <div
                    class="inline-flex items-center gap-2 rounded-full bg-velaris-amber/15 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm text-velaris-amber">
                    <Crown class="h-3 lg:h-4 w-3 lg:w-4" />
                    {{ officerCount }} Officers
                </div>
            </div>

            <!-- Actions Bar -->
            <div class="mb-4 space-y-3">
                <!-- Search + Filters (row 1) -->
                <div class="flex flex-col gap-2 md:gap-3">
                    <!-- Search -->
                    <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
                        <input v-model="searchQuery" type="search" placeholder="Search members..."
                            class="pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition w-full md:max-w-md" />
                    </div>

                    <!-- Filters -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
                        <select v-model="filterRole"
                            class="bg-card border border-border rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition">
                            <option value="">All Roles</option>
                            <option value="R5">R5 - Leader</option>
                            <option value="R4">R4 - Officer</option>
                            <option value="R3">R3 - Elite</option>
                            <option value="R2">R2 - Member</option>
                            <option value="R1">R1 - Recruit</option>
                        </select>

                        <select v-model="filterStatus"
                            class="bg-card border border-border rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition">
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="left">Left</option>
                            <option value="kicked">Kicked</option>
                        </select>

                        <select v-model="filterTag"
                            class="bg-card border border-border rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition col-span-2 sm:col-span-1">
                            <option value="">All Tags</option>
                            <option v-for="tagId in Object.keys(MEMBER_TAGS)" :key="tagId" :value="tagId">
                                {{ MEMBER_TAGS[tagId].label }}
                            </option>
                        </select>

                        <button v-if="hasActiveFilters" @click="clearFilters"
                            class="btn-soft-violet text-xs md:text-sm col-span-2 sm:col-span-1">
                            <RotateCcw class="h-3 w-3" />
                            Clear
                        </button>
                    </div>
                </div>

                <!-- Count + Actions (row 2) -->
                <div class="flex items-center justify-between md:justify-end gap-2 md:gap-3">
                    <div class="text-xs md:text-sm text-foreground/60">
                        {{ filteredMembers.length }} of {{ totalMembers }}
                    </div>

                    <div class="flex items-center gap-2 md:gap-3">
                        <button class="btn-soft-violet text-xs md:text-sm px-2 md:px-3">
                            <Download class="h-3 md:h-4 w-3 md:w-4" />
                            <span class="hidden sm:inline">Export</span>
                        </button>

                        <button @click="openAddModal" class="btn-solid-purple text-xs md:text-sm px-2 md:px-3">
                            <UserPlus class="h-3 md:h-4 w-3 md:w-4" />
                            <span class="hidden sm:inline">Add</span>
                        </button>

                        <button @click="toggleSidebar" class="btn-soft-violet text-xs md:text-sm px-2 md:px-3 2xl:hidden">
                            <BarChart3 class="h-3 md:h-4 w-3 md:w-4" />
                            <span class="hidden sm:inline">Analytics</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                <div v-for="i in 8" :key="i" class="member-card animate-pulse">
                    <div class="space-y-3">
                        <div class="flex items-start justify-between">
                            <div class="flex items-center gap-3">
                                <div class="h-10 w-10 rounded-full bg-foreground/10"></div>
                                <div class="space-y-1">
                                    <div class="h-4 bg-foreground/10 rounded w-20"></div>
                                    <div class="h-3 bg-foreground/10 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="h-3 bg-foreground/10 rounded"></div>
                            <div class="h-3 bg-foreground/10 rounded"></div>
                            <div class="h-3 bg-foreground/10 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Members Grid -->
            <div v-else-if="filteredMembers.length > 0" class="space-y-6 lg:space-y-8">
                <!-- Active/Inactive Members by Role -->
                <div v-for="role in ['R5', 'R4', 'R3', 'R2', 'R1']" :key="role">
                    <div v-if="groupedActiveMembers[role]?.length > 0" class="space-y-3 lg:space-y-4">
                        <!-- Role Header -->
                        <div class="flex items-center gap-2 lg:gap-3 pb-2 border-b border-border/50">
                            <div :class="[
                                'w-2 lg:w-3 h-4 lg:h-6 rounded-full',
                                role === 'R5' ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' :
                                    role === 'R4' ? 'bg-gradient-to-b from-purple-400 to-purple-600' :
                                        role === 'R3' ? 'bg-gradient-to-b from-blue-400 to-blue-600' :
                                            role === 'R2' ? 'bg-gradient-to-b from-green-400 to-green-600' :
                                                'bg-gradient-to-b from-slate-400 to-slate-600'
                            ]"></div>
                            <component :is="getRoleIcon(role)" class="w-4 lg:w-5 h-4 lg:h-5"
                                :class="getRoleIconColor(role)" />
                            <h3 class="text-base lg:text-lg font-semibold text-foreground">{{ getRoleLabel(role) }}</h3>
                            <span
                                class="text-xs lg:text-sm text-foreground/60 bg-card px-2 py-0.5 lg:py-1 rounded-full border border-border/50">
                                {{ groupedActiveMembers[role].length }}
                            </span>
                        </div>

                        <!-- Active Members Grid for this role -->
                        <div class="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            <MemberCard v-for="member in groupedActiveMembers[role]" :key="member.id" :member="member"
                                @view="viewMemberProfile" @edit="editMember" @delete="deleteMember"
                                @events="viewEvents" />
                        </div>
                    </div>
                </div>

                <!-- Former Members Section -->
                <div v-if="formerMembers.length > 0" class="space-y-3 lg:space-y-4">
                    <div class="flex items-center gap-2 lg:gap-3 pb-2 border-b border-border/50 opacity-60">
                        <div class="w-2 lg:w-3 h-4 lg:h-6 rounded-full bg-gradient-to-b from-slate-500 to-slate-600">
                        </div>
                        <UserX class="w-4 lg:w-5 h-4 lg:h-5 text-slate-500" />
                        <h3 class="text-base lg:text-lg font-semibold text-foreground/60">Former Members</h3>
                        <span
                            class="text-xs lg:text-sm text-foreground/40 bg-card/50 px-2 py-0.5 lg:py-1 rounded-full border border-border/30">
                            {{ formerMembers.length }}
                        </span>
                        <button @click="toggleFormerMembers"
                            class="ml-auto text-xs text-foreground/40 hover:text-foreground/60 transition-colors flex items-center gap-1">
                            <component :is="showFormerMembers ? 'ChevronUp' : 'ChevronDown'" class="w-4 h-4" />
                            {{ showFormerMembers ? 'Hide' : 'Show' }}
                        </button>
                    </div>

                    <!-- Former Members Grid -->
                    <div v-if="showFormerMembers"
                        class="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 opacity-50">
                        <MemberCard v-for="member in formerMembers" :key="member.id" :member="member"
                            @view="viewMemberProfile" @edit="editMember" @delete="deleteMember" @events="viewEvents" />
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="!isLoading && totalMembers === 0"
                class="text-center py-12 lg:py-16 text-foreground/60 bg-card/50 rounded-2xl border border-border/50">
                <Users class="w-12 lg:w-16 h-12 lg:h-16 mx-auto mb-4 opacity-50" />
                <h3 class="text-lg lg:text-xl font-semibold mb-2">No members found</h3>
                <p class="text-sm text-foreground/50 mb-6">No members have been added to the guild yet</p>
                <button @click="openAddModal" class="btn-solid-purple">
                    <UserPlus class="h-4 w-4 mr-2" />
                    Add First Member
                </button>
            </div>

            <!-- No Search Results -->
            <div v-else-if="!isLoading && totalMembers > 0 && filteredMembers.length === 0"
                class="text-center py-12 lg:py-16 text-foreground/60 bg-card/50 rounded-2xl border border-border/50">
                <SearchX class="w-12 lg:w-16 h-12 lg:h-16 mx-auto mb-4 opacity-50" />
                <h3 class="text-lg lg:text-xl font-semibold mb-2">No matching members</h3>
                <p class="text-sm text-foreground/50 mb-6">Try adjusting your search criteria or filters</p>
                <button @click="clearFilters" class="btn-soft-violet">
                    <RotateCcw class="h-4 w-4 mr-2" />
                    Clear Filters
                </button>
            </div>
        </div>

        <!-- Desktop Sidebar -->
        <div
            class="hidden 2xl:block w-80 bg-gradient-to-br from-card via-card to-velaris-purple/5 border border-border rounded-xl p-6 space-y-6 h-fit sticky top-24 overflow-y-auto max-h-[calc(100vh-8rem)] backdrop-blur-sm">
            <!-- Sidebar Header -->
            <div class="flex items-center justify-between">
                <h2
                    class="text-lg font-semibold text-foreground bg-gradient-to-r from-velaris-purple to-velaris-teal bg-clip-text text-transparent">
                    Guild Analytics</h2>
            </div>

            <!-- Quick Stats -->
            <div class="space-y-4">
                <h3 class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                    <div class="w-1 h-4 bg-gradient-to-b from-velaris-purple to-velaris-teal rounded-full"></div>
                    Overview
                </h3>
                <div class="grid grid-cols-2 gap-3">
                    <div
                        class="bg-gradient-to-br from-velaris-green/10 via-velaris-green/5 to-transparent rounded-xl p-4 border border-velaris-green/20 backdrop-blur-sm">
                        <div class="text-2xl font-bold text-velaris-green">{{ activeInactiveStats.active }}</div>
                        <div class="text-xs text-velaris-green/80 font-medium">Active Members</div>
                    </div>
                    <div
                        class="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent rounded-xl p-4 border border-red-500/20 backdrop-blur-sm">
                        <div class="text-2xl font-bold text-red-400">{{ activeInactiveStats.inactive +
                            (activeInactiveStats.left || 0) +
                            (activeInactiveStats.kicked || 0) }}</div>
                        <div class="text-xs text-red-400/80 font-medium">Inactive</div>
                    </div>
                </div>
            </div>

            <!-- Power Statistics -->
            <div class="space-y-4">
                <h3 class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                    <div class="w-1 h-4 bg-gradient-to-b from-velaris-amber to-yellow-500 rounded-full"></div>
                    Power Statistics
                </h3>
                <div
                    class="bg-gradient-to-br from-velaris-amber/10 via-velaris-amber/5 to-transparent rounded-xl p-4 border border-velaris-amber/20 backdrop-blur-sm space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-foreground/80 font-medium">Total Power</span>
                        <span class="font-bold text-velaris-amber">{{ formatPower(activeInactiveStats.totalPower)
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-foreground/80 font-medium">Average</span>
                        <span class="font-bold text-velaris-amber">{{ formatPower(activeInactiveStats.averagePower)
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-foreground/80 font-medium">Highest</span>
                        <span class="font-bold text-velaris-amber">{{ formatPower(activeInactiveStats.maxPower)
                            }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-foreground/80 font-medium">Average Castle</span>
                        <span class="font-bold text-velaris-amber">{{ activeInactiveStats.averageCastle }}</span>
                    </div>
                </div>
            </div>

            <!-- Role Distribution -->
            <div class="space-y-4">
                <h3 class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                    <div class="w-1 h-4 bg-gradient-to-b from-velaris-teal to-blue-500 rounded-full"></div>
                    Role Distribution
                </h3>
                <div
                    class="bg-gradient-to-br from-velaris-teal/10 via-velaris-teal/5 to-transparent rounded-xl p-4 border border-velaris-teal/20 backdrop-blur-sm space-y-2">
                    <div v-for="role in ['R5', 'R4', 'R3', 'R2', 'R1']" :key="role"
                        class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-velaris-teal/10 transition-colors">
                        <div class="flex items-center gap-3">
                            <component :is="getRoleIcon(role)" class="w-4 h-4" :class="getRoleIconColor(role)" />
                            <span class="text-sm font-medium">{{ getRoleLabel(role) }}</span>
                        </div>
                        <span class="font-bold text-velaris-teal">{{ activeInactiveStats.roles[role] || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- Tag Distribution -->
            <div v-if="Object.keys(activeInactiveStats.tagStats || {}).length > 0" class="space-y-4">
                <h3 class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                    <div class="w-1 h-4 bg-gradient-to-b from-purple-400 to-velaris-purple rounded-full"></div>
                    Tag Distribution
                </h3>
                <div
                    class="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-xl p-4 border border-purple-500/20 backdrop-blur-sm space-y-2">
                    <div v-for="[tagId, count] in Object.entries(activeInactiveStats.tagStats || {}).sort(([, a], [, b]) => b - a)"
                        :key="tagId"
                        class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                        <Tag :tag-id="tagId" size="xs" />
                        <span class="font-bold text-purple-400">{{ count }}</span>
                    </div>
                </div>
            </div>

            <!-- Data Quality Issues -->
            <div class="space-y-4">
                <h3 class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                    <div class="w-1 h-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                    Data Quality
                </h3>
                <div class="space-y-2">
                    <div v-if="activeInactiveStats.withoutDiscord > 0"
                        class="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent rounded-xl p-3 border border-yellow-500/20 backdrop-blur-sm">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <AlertTriangle class="w-4 h-4 text-yellow-500" />
                                <span class="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Missing
                                    Discord</span>
                            </div>
                            <span class="font-bold text-yellow-600 dark:text-yellow-400">{{
                                activeInactiveStats.withoutDiscord
                                }}</span>
                        </div>
                    </div>
                    <div v-if="activeInactiveStats.withoutGameUid > 0"
                        class="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent rounded-xl p-3 border border-orange-500/20 backdrop-blur-sm">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <AlertTriangle class="w-4 h-4 text-orange-500" />
                                <span class="text-sm text-orange-600 dark:text-orange-400 font-medium">Missing Game
                                    UID</span>
                            </div>
                            <span class="font-bold text-orange-600 dark:text-orange-400">{{
                                activeInactiveStats.withoutGameUid
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Country Distribution -->
            <div v-if="Object.keys(activeInactiveStats.countries || {}).length > 0" class="space-y-4">
                <h3 class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                    <div class="w-1 h-4 bg-gradient-to-b from-emerald-400 to-velaris-green rounded-full"></div>
                    Countries
                </h3>
                <div
                    class="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-4 border border-emerald-500/20 backdrop-blur-sm space-y-2">
                    <div v-for="[country, count] in (showAllCountries ? Object.entries(activeInactiveStats.countries || {}).sort(([, a], [, b]) => b - a) : Object.entries(activeInactiveStats.countries || {}).sort(([, a], [, b]) => b - a).slice(0, 5))"
                        :key="country"
                        class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-emerald-500/10 transition-colors">
                        <span class="text-sm font-medium">{{ country }}</span>
                        <span class="font-bold text-emerald-400">{{ count }}</span>
                    </div>

                    <button v-if="Object.keys(activeInactiveStats.countries || {}).length > 5"
                        @click="showAllCountries = !showAllCountries"
                        class="w-full mt-3 text-xs text-emerald-400 hover:text-emerald-300 font-medium py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-200 border border-emerald-500/20">
                        {{ showAllCountries ? 'Show Less' : `Show All (${Object.keys(activeInactiveStats.countries ||
                        {}).length})` }}
                    </button>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3 pt-4 border-t border-velaris-purple/20">
                <button
                    class="w-full bg-gradient-to-r from-velaris-purple/10 to-velaris-teal/10 hover:from-velaris-purple/20 hover:to-velaris-teal/20 border border-velaris-purple/30 text-velaris-purple hover:text-velaris-teal rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                    <FileText class="w-4 h-4" />
                    Generate Report
                </button>
                <button
                    class="w-full bg-gradient-to-r from-velaris-teal/10 to-velaris-green/10 hover:from-velaris-teal/20 hover:to-velaris-green/20 border border-velaris-teal/30 text-velaris-teal hover:text-velaris-green rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                    <Users class="w-4 h-4" />
                    Bulk Actions
                </button>
            </div>
        </div>

        <!-- Mobile Sidebar Overlay -->
        <div v-if="sidebarOpen" class="fixed inset-0 bg-black/50 z-50 2xl:hidden" @click="closeSidebar">
            <!-- Mobile Sidebar -->
            <div class="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-br from-card via-card to-velaris-purple/5 border-l border-border p-4 space-y-4 overflow-y-auto transform transition-transform duration-300 ease-out backdrop-blur-sm"
                @click.stop>
                <!-- Mobile Sidebar Header -->
                <div class="flex items-center justify-between pb-4 border-b border-border">
                    <h2
                        class="text-lg font-semibold text-foreground bg-gradient-to-r from-velaris-purple to-velaris-teal bg-clip-text text-transparent">
                        Guild Analytics</h2>
                    <button @click="closeSidebar" class="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Quick Stats -->
                <div class="space-y-3">
                    <h3
                        class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                        <div class="w-1 h-4 bg-gradient-to-b from-velaris-purple to-velaris-teal rounded-full"></div>
                        Overview
                    </h3>
                    <div class="grid grid-cols-2 gap-3">
                        <div
                            class="bg-gradient-to-br from-velaris-green/10 via-velaris-green/5 to-transparent rounded-xl p-3 border border-velaris-green/20 backdrop-blur-sm">
                            <div class="text-xl font-bold text-velaris-green">{{ activeInactiveStats.active }}</div>
                            <div class="text-xs text-velaris-green/80 font-medium">Active</div>
                        </div>
                        <div
                            class="bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent rounded-xl p-3 border border-red-500/20 backdrop-blur-sm">
                            <div class="text-xl font-bold text-red-400">{{ activeInactiveStats.inactive +
                                (activeInactiveStats.left || 0) +
                                (activeInactiveStats.kicked || 0) }}</div>
                            <div class="text-xs text-red-400/80 font-medium">Inactive</div>
                        </div>
                    </div>
                </div>

                <!-- Power Statistics -->
                <div class="space-y-3">
                    <h3
                        class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                        <div class="w-1 h-4 bg-gradient-to-b from-velaris-amber to-yellow-500 rounded-full"></div>
                        Power Statistics
                    </h3>
                    <div
                        class="bg-gradient-to-br from-velaris-amber/10 via-velaris-amber/5 to-transparent rounded-xl p-3 border border-velaris-amber/20 backdrop-blur-sm space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-foreground/80 font-medium">Total Power</span>
                            <span class="font-semibold text-sm text-velaris-amber">{{
                                formatPower(activeInactiveStats.totalPower)
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-foreground/80 font-medium">Average</span>
                            <span class="font-semibold text-sm text-velaris-amber">{{
                                formatPower(activeInactiveStats.averagePower)
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-foreground/80 font-medium">Highest</span>
                            <span class="font-semibold text-sm text-velaris-amber">{{
                                formatPower(activeInactiveStats.maxPower)
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-foreground/80 font-medium">Average Castle</span>
                            <span class="font-semibold text-sm text-velaris-amber">{{ activeInactiveStats.averageCastle
                                }}</span>
                        </div>
                    </div>
                </div>

                <!-- Role Distribution -->
                <div class="space-y-3">
                    <h3
                        class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                        <div class="w-1 h-4 bg-gradient-to-b from-velaris-teal to-blue-500 rounded-full"></div>
                        Role Distribution
                    </h3>
                    <div
                        class="bg-gradient-to-br from-velaris-teal/10 via-velaris-teal/5 to-transparent rounded-xl p-3 border border-velaris-teal/20 backdrop-blur-sm space-y-2">
                        <div v-for="role in ['R5', 'R4', 'R3', 'R2', 'R1']" :key="role"
                            class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-velaris-teal/10 transition-colors">
                            <div class="flex items-center gap-2">
                                <component :is="getRoleIcon(role)" class="w-4 h-4" :class="getRoleIconColor(role)" />
                                <span class="text-sm font-medium">{{ getRoleLabel(role) }}</span>
                            </div>
                            <span class="font-semibold text-sm text-velaris-teal">{{ activeInactiveStats.roles[role] ||
                                0 }}</span>
                        </div>
                    </div>
                </div>

                <!-- Tag Distribution -->
                <div v-if="Object.keys(activeInactiveStats.tagStats || {}).length > 0" class="space-y-3">
                    <h3
                        class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                        <div class="w-1 h-4 bg-gradient-to-b from-purple-400 to-velaris-purple rounded-full"></div>
                        Tag Distribution
                    </h3>
                    <div
                        class="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-xl p-3 border border-purple-500/20 backdrop-blur-sm space-y-2">
                        <div v-for="[tagId, count] in Object.entries(activeInactiveStats.tagStats || {}).sort(([, a], [, b]) => b - a)"
                            :key="tagId"
                            class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                            <Tag :tag-id="tagId" size="xs" />
                            <span class="font-semibold text-sm text-purple-400">{{ count }}</span>
                        </div>
                    </div>
                </div>

                <!-- Data Quality Issues -->
                <div class="space-y-3">
                    <h3
                        class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                        <div class="w-1 h-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
                        Data Quality
                    </h3>
                    <div class="space-y-2">
                        <div v-if="activeInactiveStats.withoutDiscord > 0"
                            class="bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent rounded-xl p-3 border border-yellow-500/20 backdrop-blur-sm">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <AlertTriangle class="w-4 h-4 text-yellow-500" />
                                    <span class="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Missing
                                        Discord</span>
                                </div>
                                <span class="font-semibold text-sm text-yellow-600 dark:text-yellow-400">{{
                                    activeInactiveStats.withoutDiscord }}</span>
                            </div>
                        </div>
                        <div v-if="activeInactiveStats.withoutGameUid > 0"
                            class="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent rounded-xl p-3 border border-orange-500/20 backdrop-blur-sm">
                            <div class="flex items-center gap-2">
                                <AlertTriangle class="w-4 h-4 text-orange-500" />
                                <span class="text-sm text-orange-600 dark:text-orange-400 font-medium">Missing Game
                                    UID</span>
                            </div>
                            <span class="font-semibold text-sm text-orange-600 dark:text-orange-400">{{
                                activeInactiveStats.withoutGameUid }}</span>
                        </div>
                    </div>
                </div>

                <!-- Country Distribution -->
                <div v-if="Object.keys(activeInactiveStats.countries || {}).length > 0" class="space-y-3">
                    <h3
                        class="text-sm font-medium text-velaris-purple/80 uppercase tracking-wide flex items-center gap-2">
                        <div class="w-1 h-4 bg-gradient-to-b from-emerald-400 to-velaris-green rounded-full"></div>
                        Countries
                    </h3>
                    <div
                        class="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-xl p-3 border border-emerald-500/20 backdrop-blur-sm space-y-2">
                        <div v-for="[country, count] in (showAllCountries ? Object.entries(activeInactiveStats.countries || {}).sort(([, a], [, b]) => b - a) : Object.entries(activeInactiveStats.countries || {}).sort(([, a], [, b]) => b - a).slice(0, 5))"
                            :key="country"
                            class="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-emerald-500/10 transition-colors">
                            <span class="text-sm font-medium truncate">{{ country }}</span>
                            <span class="font-semibold text-sm flex-shrink-0 ml-2 text-emerald-400">{{ count }}</span>
                        </div>

                        <button v-if="Object.keys(activeInactiveStats.countries || {}).length > 5"
                            @click="showAllCountries = !showAllCountries"
                            class="w-full mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-medium py-2 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all duration-200 border border-emerald-500/20">
                            {{ showAllCountries ? 'Show Less' : `Show All (${Object.keys(activeInactiveStats.countries
                                ||
                            {}).length})` }}
                        </button>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="space-y-2 pt-4 border-t border-velaris-purple/20">
                    <button
                        class="w-full bg-gradient-to-r from-velaris-purple/10 to-velaris-teal/10 hover:from-velaris-purple/20 hover:to-velaris-teal/20 border border-velaris-purple/30 text-velaris-purple hover:text-velaris-teal rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                        <FileText class="w-4 h-4" />
                        Generate Report
                    </button>
                    <button
                        class="w-full bg-gradient-to-r from-velaris-teal/10 to-velaris-green/10 hover:from-velaris-teal/20 hover:to-velaris-green/20 border border-velaris-teal/30 text-velaris-teal hover:text-velaris-green rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2">
                        <Users class="w-4 h-4" />
                        Bulk Actions
                    </button>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <MemberFormModal v-if="showModal" :initial="editingMember" @close="closeModal" @save="saveMember" />
        <PlayerProfileModal v-if="selectedMember" :member="selectedMember" @close="selectedMember = null" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
    Users, Clock, Search, Filter, Download, UserPlus, MoreHorizontal,
    Crown, RotateCcw, SearchX, Shield, Star, UserCheck, UserX, BarChart3,
    X, AlertTriangle, FileText, ChevronUp, ChevronDown
} from 'lucide-vue-next'
import MemberCard from '@/components/velaris/MemberCard.vue'
import MemberFormModal from '@/components/velaris/MemberFormModal.vue'
import PlayerProfileModal from '@/components/velaris/PlayerProfileModal.vue'
import Tag from '@/components/velaris/Tag.vue'
import { useMembers, MEMBER_TAGS } from '@/composables/topheroes/admin/useMembers'

const { members, loadMembers, addMember, updateMember, deleteMemberById, getMemberStats } = useMembers()

// UI State
const showModal = ref(false)
const editingMember = ref(null)
const selectedMember = ref(null)
const isLoading = ref(true)
const sidebarOpen = ref(false)
const showAllCountries = ref(false)
const showFormerMembers = ref(false) // Default collapsed

// Filter state
const searchQuery = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const filterTag = ref('')

// Initialize data on mount
onMounted(async () => {
    await loadMembers()
    isLoading.value = false
})

// Computed Statistics for all members
const stats = computed(() => getMemberStats())

// Computed Statistics for active/inactive members only (for sidebar)
const activeInactiveStats = computed(() => {
  const activeInactiveMembers = members.value.filter(
    m => m.status === 'active' || m.status === 'inactive'
  )

  let totalPower = 0
  let maxPower = 0
  let memberCount = 0
  let activeCount = 0
  let inactiveCount = 0
  let withoutDiscord = 0
  let withoutGameUid = 0

  // Castle tracking (sum + count of valid values)
  let castleSum = 0
  let castleCount = 0

  const roleStats = { R5: 0, R4: 0, R3: 0, R2: 0, R1: 0 }
  const tagStats = {}
  const countries = {}

  for (const member of activeInactiveMembers) {
    memberCount++

    // Status counts
    if (member.status === 'active') activeCount++
    else if (member.status === 'inactive') inactiveCount++

    // Power stats
    if (member.power != null) {
      const p = Number(member.power)
      if (!Number.isNaN(p)) {
        totalPower += p
        if (p > maxPower) maxPower = p
      }
    }

    // --- Castle level: accept several field names & coerce to number ---
    const rawCastle =
      member.castleLevel ?? member.castle ?? member.castle_level ?? null
    if (rawCastle != null) {
      const lvl = Number(rawCastle)
      if (!Number.isNaN(lvl) && lvl > 0) {
        castleSum += lvl
        castleCount++
      }
    }

    // Role stats
    if (member.role && Object.hasOwn(roleStats, member.role)) {
      roleStats[member.role]++
    }

    // Tag stats
    if (Array.isArray(member.tags)) {
      for (const tagId of member.tags) {
        tagStats[tagId] = (tagStats[tagId] || 0) + 1
      }
    }

    // Country stats
    if (member.country) {
      countries[member.country] = (countries[member.country] || 0) + 1
    }

    // Data quality
    if (!member.discordId) withoutDiscord++
    if (!member.gameUid) withoutGameUid++
  }

  return {
    total: memberCount,
    active: activeCount,
    inactive: inactiveCount,
    totalPower,
    averagePower: memberCount ? Math.round(totalPower / memberCount) : 0,
    maxPower,
    // Average only across members with a valid castle level
    averageCastle: castleCount ? Math.round(castleSum / castleCount) : 0,
    roles: roleStats,
    tagStats,
    countries,
    withoutDiscord,
    withoutGameUid,
  }
})

const totalMembers = computed(() => members.value.length)
const activeMembers = computed(() => members.value.filter(m => m.status === 'active').length)
const officerCount = computed(() => members.value.filter(m => ['R4', 'R5'].includes(m.role)).length)

// Formatting helper
const formatPower = (n) => {
    if (!n) return '0'
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

// Filtering
const filteredMembers = computed(() => {
    return members.value.filter((m) => {
        const matchesQuery = !searchQuery.value ||
            m.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            String(m.gameUid).includes(searchQuery.value)

        const matchesRole = !filterRole.value || m.role === filterRole.value
        const matchesStatus = !filterStatus.value || m.status === filterStatus.value
        const matchesTag = !filterTag.value || (m.tags && m.tags.includes(filterTag.value))

        return matchesQuery && matchesRole && matchesStatus && matchesTag
    })
})

// Group active/inactive members by role (sorted alphabetically)
const groupedActiveMembers = computed(() => {
    const groups = { R5: [], R4: [], R3: [], R2: [], R1: [] }

    filteredMembers.value
        .filter(member => member.status === 'active' || member.status === 'inactive')
        .forEach(member => {
            if (groups[member.role]) {
                groups[member.role].push(member)
            }
        })

    // Sort each group alphabetically by name
    Object.keys(groups).forEach(role => {
        groups[role].sort((a, b) => a.name.localeCompare(b.name))
    })

    return groups
})

// Get former members (left/kicked) sorted alphabetically
const formerMembers = computed(() => {
    return filteredMembers.value
        .filter(member => member.status === 'left' || member.status === 'kicked')
        .sort((a, b) => a.name.localeCompare(b.name))
})

const hasActiveFilters = computed(() =>
    searchQuery.value || filterRole.value || filterStatus.value || filterTag.value
)

// Helper Functions
const getRoleLabel = (role) => {
    const labels = {
        R5: 'Leader',
        R4: 'Officer',
        R3: 'Elite',
        R2: 'Member',
        R1: 'Recruit'
    }
    return labels[role] || role
}

const getRoleIcon = (role) => {
    const icons = {
        R5: Crown,
        R4: Shield,
        R3: Star,
        R2: Users,
        R1: UserCheck
    }
    return icons[role] || UserCheck
}

const getRoleIconColor = (role) => {
    const colors = {
        R5: 'text-yellow-400',
        R4: 'text-purple-400',
        R3: 'text-blue-400',
        R2: 'text-green-400',
        R1: 'text-slate-400'
    }
    return colors[role] || 'text-slate-400'
}

// Sidebar Actions
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
    sidebarOpen.value = false
}

// Former Members Toggle
const toggleFormerMembers = () => {
    showFormerMembers.value = !showFormerMembers.value
}

// Actions
const openAddModal = () => {
    editingMember.value = null
    showModal.value = true
}

const editMember = (member) => {
    editingMember.value = member
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    editingMember.value = null
}

const saveMember = async (data) => {
    try {
        if (data.id) {
            await updateMember(data.id, data)
        } else {
            await addMember(data)
        }
        closeModal()
    } catch (error) {
        console.error('Failed to save member:', error)
    }
}

const deleteMember = async (member) => {
    if (confirm(`Are you sure you want to delete ${member.name}?`)) {
        try {
            await deleteMemberById(member.id)
        } catch (error) {
            console.error('Failed to delete member:', error)
        }
    }
}

const viewMemberProfile = (member) => {
    selectedMember.value = member
}

const viewEvents = (member) => {
    console.log('View events for', member.name)
}

const clearFilters = () => {
    searchQuery.value = ''
    filterRole.value = ''
    filterStatus.value = ''
    filterTag.value = ''
}
</script>