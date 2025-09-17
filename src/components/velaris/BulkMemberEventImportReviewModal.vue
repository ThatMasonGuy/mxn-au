<template>
    <Dialog :open="true" @update:open="$emit('close')">
        <DialogContent
            class="w-full h-full sm:w-full sm:h-auto sm:max-w-7xl sm:max-h-[90vh] bg-slate-900 border border-slate-700 text-slate-200 overflow-hidden flex flex-col">
            <DialogHeader class="pb-4 border-b border-slate-700">
                <div class="flex items-center justify-between">
                    <div>
                        <DialogTitle class="text-2xl font-bold text-white flex items-center gap-3">
                            <div
                                class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <Users class="w-5 h-5 text-white" />
                            </div>
                            Review Imported Players
                        </DialogTitle>
                        <DialogDescription class="text-slate-400 mt-1">
                            Match imported names to existing members, then finalize the import.
                        </DialogDescription>
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex items-center gap-2">
                        <Button size="sm" @click="acceptAllExact" :disabled="allExactAccepted"
                            class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 transition-all duration-200">
                            <Check class="w-4 h-4 mr-2" />
                            Accept All Exact
                        </Button>
                    </div>
                </div>

                <!-- Progress Summary -->
                <div
                    class="flex items-center justify-between mt-4 p-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg border border-slate-600">
                    <div class="flex items-center gap-6">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span class="text-sm text-slate-300">{{ resolvedCount }} Resolved</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-red-400"></div>
                            <span class="text-sm text-slate-300">{{ excludedCount }} Excluded</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <span class="text-sm text-slate-300">{{ pendingCount }} Pending</span>
                        </div>
                    </div>
                    <div class="text-sm text-slate-400">
                        Total: {{ rows.length }} rows
                    </div>
                </div>
            </DialogHeader>

            <!-- Scrollable Sections Container -->
            <div class="flex-1 overflow-y-auto -mr-3 pr-3 min-h-0">
                <div class="space-y-4 py-4">

                    <!-- Exact Matches Section -->
                    <div v-if="exactMatches.length > 0" class="space-y-2">
                        <button @click="toggleSection('exact')"
                            class="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-lg border border-green-600/30 hover:border-green-500/50 transition-all">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <Check class="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-green-100 text-left">Exact Matches</h3>
                                    <p class="text-xs text-green-300/70">{{exactMatches.filter(r => r.resolved).length
                                        }}/{{ exactMatches.length }} confirmed</p>
                                </div>
                            </div>
                            <ChevronDown class="w-5 h-5 text-green-400 transition-transform"
                                :class="{ 'rotate-180': openSections.exact }" />
                        </button>

                        <div v-if="openSections.exact" class="space-y-2 ml-4">
                            <div v-for="(row, i) in exactMatches" :key="`exact-${i}`"
                                class="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl border transition-all duration-200 overflow-hidden"
                                :class="getRowClasses(row)">
                                <!-- Player Row Content -->
                                <div class="p-4">
                                    <!-- Header Row: Name + Status Badge -->
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div class="flex-shrink-0">
                                                <div
                                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm">
                                                    {{ getInitials(row.raw['name'] || row.raw['player name'] || row.raw['player']) }}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 class="font-semibold text-white text-lg">
                                                    {{ row.raw['name'] || row.raw['player name'] || row.raw['player'] }}
                                                </h3>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <!-- Additional Data Badges -->
                                                    <div v-if="row.raw['rank']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                                                        <Crown class="w-3 h-3" />
                                                        Rank {{ row.raw['rank'] }}
                                                    </div>
                                                    <div v-if="row.raw['power']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                                                        <Zap class="w-3 h-3" />
                                                        {{ formatPower(row.raw['power']) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Status Indicator -->
                                        <div class="flex items-center gap-2">
                                            <div v-if="row.resolved"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                                                <CheckCircle class="w-4 h-4" />
                                                Confirmed
                                            </div>
                                            <div v-else-if="row.excluded"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                                                <XCircle class="w-4 h-4" />
                                                Excluded
                                            </div>
                                            <div v-else
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                                                <Clock class="w-4 h-4" />
                                                Pending
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Match Details & Actions -->
                                    <div v-if="!row.excluded" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <!-- Match Information -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Target class="w-4 h-4" />
                                                Match Details
                                            </h4>

                                            <!-- Exact/Alias Match Display -->
                                            <template v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                                                <div
                                                    class="bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-lg p-3 border border-slate-600">
                                                    <div class="flex items-center gap-3">
                                                        <div
                                                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                            {{ getInitials(row.match.member.name) }}
                                                        </div>
                                                        <div>
                                                            <div class="font-medium text-white">{{ row.match.member.name }}</div>
                                                            <div class="text-xs text-slate-400 flex gap-3">
                                                                <span>Power: {{ getMemberDisplayInfo(row.match.member.id).power }}</span>
                                                                <span>Rank: {{ getMemberDisplayInfo(row.match.member.id).rank }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Conflict Resolution -->
                                            <template v-else-if="row.match.type === 'conflict' && !row.resolved">
                                                <div class="space-y-2">
                                                    <label class="block text-sm font-medium text-slate-300">Select Member:</label>
                                                    <!-- Inline Member Selector -->
                                                    <div class="relative">
                                                        <button @click="toggleDropdown(`conflict-${i}`)" type="button"
                                                            class="w-full flex items-center justify-between px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-left">
                                                            <span class="truncate text-white">{{ getSelectedMemberDisplay(row.selectedMemberId, 'Choose from multiple matches...') }}</span>
                                                            <ChevronDown class="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                                                        </button>

                                                        <!-- Dropdown Panel -->
                                                        <div v-if="dropdownState[`conflict-${i}`]"
                                                            class="absolute z-50 mt-2 w-full max-w-[32rem] bg-slate-800 border border-slate-600 rounded-lg shadow-lg overflow-hidden">
                                                            
                                                            <!-- Members List -->
                                                            <div class="max-h-[16rem] overflow-y-auto">
                                                                <button v-for="member in row.match.matches" :key="member.id" 
                                                                    @click="selectMember(row, member.id, `conflict-${i}`)"
                                                                    class="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3"
                                                                    :class="{ 'bg-indigo-900/20': row.selectedMemberId === member.id }">
                                                                    <div
                                                                        class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                                        {{ getInitials(member.name) }}
                                                                    </div>
                                                                    <div class="flex-1 min-w-0">
                                                                        <div class="font-medium text-white truncate">{{ member.name }}</div>
                                                                        <div class="text-xs text-slate-400 flex gap-3">
                                                                            <span>{{ formatPower(member.power) }} power</span>
                                                                            <span>{{ member.role || 'Unknown' }}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div v-if="row.selectedMemberId === member.id" class="flex-shrink-0">
                                                                        <CheckCircle class="w-4 h-4 text-indigo-400" />
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Manual Selection -->
                                            <template v-else-if="row.match.type === 'unmatched' && !row.resolved">
                                                <div class="space-y-2">
                                                    <label class="block text-sm font-medium text-slate-300">Manual Selection:</label>
                                                    <!-- Inline Member Selector -->
                                                    <div class="relative">
                                                        <button @click="toggleDropdown(`unmatched-${i}`)" type="button"
                                                            class="w-full flex items-center justify-between px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-left">
                                                            <span class="truncate text-white">{{ getSelectedMemberDisplay(row.selectedMemberId, 'Select a member...') }}</span>
                                                            <ChevronDown class="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                                                        </button>

                                                        <!-- Dropdown Panel -->
                                                        <div v-if="dropdownState[`unmatched-${i}`]"
                                                            class="absolute z-50 mt-2 w-full max-w-[32rem] bg-slate-800 border border-slate-600 rounded-lg shadow-lg overflow-hidden">
                                                            
                                                            <!-- Search Bar -->
                                                            <div class="p-3 border-b border-slate-600 bg-slate-800 sticky top-0 z-10">
                                                                <div class="relative">
                                                                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                                    <input :ref="el => searchRefs[`unmatched-${i}`] = el" v-model="searchQueries[`unmatched-${i}`]" type="text"
                                                                        placeholder="Search by name, power, rank, or role..."
                                                                        class="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                                                                        @keydown.escape="dropdownState[`unmatched-${i}`] = false" />
                                                                </div>
                                                            </div>

                                                            <!-- Members List -->
                                                            <div class="max-h-[24rem] overflow-y-auto">
                                                                <!-- Grouped Members -->
                                                                <div v-for="group in getFilteredGroupedMembers(unmatchedMembers, searchQueries[`unmatched-${i}`] || '')" :key="group.status">
                                                                    <div
                                                                        class="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wide sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-600/30">
                                                                        <div class="flex items-center gap-2">
                                                                            <div class="w-2 h-2 rounded-full" :class="getStatusColor(group.status)"></div>
                                                                            {{ group.status }} ({{ group.members.length }})
                                                                        </div>
                                                                    </div>
                                                                    <button v-for="member in group.members" :key="member.id" 
                                                                        @click="selectMember(row, member.id, `unmatched-${i}`)"
                                                                        class="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3"
                                                                        :class="{ 'bg-indigo-900/20': row.selectedMemberId === member.id }">
                                                                        <div
                                                                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                                            {{ getInitials(member.name) }}
                                                                        </div>
                                                                        <div class="flex-1 min-w-0">
                                                                            <div class="font-medium text-white truncate">{{ member.name }}</div>
                                                                            <div class="text-xs text-slate-400 flex gap-3">
                                                                                <span>{{ formatPower(member.power) }} power</span>
                                                                                <span>{{ member.role || 'Unknown' }}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div v-if="row.selectedMemberId === member.id" class="flex-shrink-0">
                                                                            <CheckCircle class="w-4 h-4 text-indigo-400" />
                                                                        </div>
                                                                    </button>
                                                                </div>

                                                                <!-- No Results -->
                                                                <div v-if="(searchQueries[`unmatched-${i}`] || '').trim() && getFilteredGroupedMembers(unmatchedMembers, searchQueries[`unmatched-${i}`] || '').length === 0"
                                                                    class="p-8 text-center text-sm text-slate-400">
                                                                    <Users class="w-8 h-8 mx-auto mb-2 text-slate-500" />
                                                                    No members found matching "{{ searchQueries[`unmatched-${i}`] }}"
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Resolved Display -->
                                            <template v-else-if="row.resolved">
                                                <div
                                                    class="bg-gradient-to-r from-emerald-700/20 to-green-700/20 rounded-lg p-3 border border-emerald-500/30">
                                                    <div class="flex items-center gap-2 text-emerald-400">
                                                        <CheckCircle class="w-5 h-5" />
                                                        <span class="font-medium">Successfully matched and confirmed</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- Actions -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Settings class="w-4 h-4" />
                                                Actions
                                            </h4>

                                            <div class="flex flex-wrap gap-2">
                                                <!-- Exact/Alias Actions -->
                                                <template v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                                                    <Button @click="handleRowAction({ action: 'confirm', row })" size="sm"
                                                        class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0">
                                                        <Check class="w-4 h-4 mr-1" />
                                                        Confirm
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'reject', row })" size="sm" variant="outline"
                                                        class="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                                        <X class="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'exclude', row })" size="sm" variant="outline"
                                                        class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                                        <Trash2 class="w-4 h-4 mr-1" />
                                                        Exclude
                                                    </Button>
                                                </template>

                                                <!-- Conflict Actions -->
                                                <template v-else-if="row.match.type === 'conflict' && !row.resolved">
                                                    <Button :disabled="!row.selectedMemberId" @click="handleRowAction({ action: 'confirmConflict', row })" size="sm"
                                                        class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 disabled:opacity-50">
                                                        <Check class="w-4 h-4 mr-1" />
                                                        Confirm Selection
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'reject', row })" size="sm" variant="outline"
                                                        class="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                                        <X class="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'exclude', row })" size="sm" variant="outline"
                                                        class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                                        <Trash2 class="w-4 h-4 mr-1" />
                                                        Exclude
                                                    </Button>
                                                </template>

                                                <!-- Unmatched Actions -->
                                                <template v-else-if="row.match.type === 'unmatched' && !row.resolved">
                                                    <Button :disabled="!row.selectedMemberId" @click="handleRowAction({ action: 'confirmUnmatched', row })" size="sm"
                                                        class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 disabled:opacity-50">
                                                        <Check class="w-4 h-4 mr-1" />
                                                        Confirm Mapping
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'exclude', row })" size="sm" variant="outline"
                                                        class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                                        <Trash2 class="w-4 h-4 mr-1" />
                                                        Exclude
                                                    </Button>
                                                </template>

                                                <!-- Resolved Actions -->
                                                <template v-else-if="row.resolved">
                                                    <Button @click="handleRowAction({ action: 'undo', row })" size="sm" variant="outline"
                                                        class="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                                                        <RotateCcw class="w-4 h-4 mr-1" />
                                                        Undo
                                                    </Button>
                                                </template>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Excluded State -->
                                    <div v-else class="text-center py-4">
                                        <div class="flex items-center justify-center gap-2 text-red-400 mb-2">
                                            <XCircle class="w-5 h-5" />
                                            <span class="font-medium">This row has been excluded from import</span>
                                        </div>
                                        <Button @click="handleRowAction({ action: 'unexclude', row })" size="sm" variant="outline"
                                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                            <RotateCcw class="w-4 h-4 mr-1" />
                                            Include Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Alias Matches Section -->
                    <div v-if="aliasMatches.length > 0" class="space-y-2">
                        <button @click="toggleSection('alias')"
                            class="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-lg border border-blue-600/30 hover:border-blue-500/50 transition-all">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                    <Link class="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-blue-100 text-left">Alias Matches</h3>
                                    <p class="text-xs text-blue-300/70">{{aliasMatches.filter(r => r.resolved).length
                                        }}/{{ aliasMatches.length }} confirmed</p>
                                </div>
                            </div>
                            <ChevronDown class="w-5 h-5 text-blue-400 transition-transform"
                                :class="{ 'rotate-180': openSections.alias }" />
                        </button>

                        <div v-if="openSections.alias" class="space-y-2 ml-4">
                            <div v-for="(row, aliasIndex) in aliasMatches" :key="`alias-${aliasIndex}`"
                                class="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl border transition-all duration-200 overflow-hidden"
                                :class="getRowClasses(row)">
                                <!-- Player Row Content -->
                                <div class="p-4">
                                    <!-- Header Row: Name + Status Badge -->
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div class="flex-shrink-0">
                                                <div
                                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm">
                                                    {{ getInitials(row.raw['name'] || row.raw['player name'] || row.raw['player']) }}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 class="font-semibold text-white text-lg">
                                                    {{ row.raw['name'] || row.raw['player name'] || row.raw['player'] }}
                                                </h3>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <div v-if="row.raw['rank']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                                                        <Crown class="w-3 h-3" />
                                                        Rank {{ row.raw['rank'] }}
                                                    </div>
                                                    <div v-if="row.raw['power']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                                                        <Zap class="w-3 h-3" />
                                                        {{ formatPower(row.raw['power']) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Status Indicator -->
                                        <div class="flex items-center gap-2">
                                            <div v-if="row.resolved"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                                                <CheckCircle class="w-4 h-4" />
                                                Confirmed
                                            </div>
                                            <div v-else-if="row.excluded"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                                                <XCircle class="w-4 h-4" />
                                                Excluded
                                            </div>
                                            <div v-else
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                                                <Clock class="w-4 h-4" />
                                                Pending
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Match Details & Actions -->
                                    <div v-if="!row.excluded" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <!-- Match Information -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Target class="w-4 h-4" />
                                                Match Details
                                            </h4>

                                            <!-- Exact/Alias Match Display -->
                                            <template v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                                                <div
                                                    class="bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-lg p-3 border border-slate-600">
                                                    <div class="flex items-center gap-3">
                                                        <div
                                                            class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                            {{ getInitials(row.match.member.name) }}
                                                        </div>
                                                        <div>
                                                            <div class="font-medium text-white">{{ row.match.member.name }}</div>
                                                            <div class="text-xs text-slate-400 flex gap-3">
                                                                <span>Power: {{ getMemberDisplayInfo(row.match.member.id).power }}</span>
                                                                <span>Rank: {{ getMemberDisplayInfo(row.match.member.id).rank }}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>

                                            <!-- Resolved Display -->
                                            <template v-else-if="row.resolved">
                                                <div
                                                    class="bg-gradient-to-r from-emerald-700/20 to-green-700/20 rounded-lg p-3 border border-emerald-500/30">
                                                    <div class="flex items-center gap-2 text-emerald-400">
                                                        <CheckCircle class="w-5 h-5" />
                                                        <span class="font-medium">Successfully matched and confirmed</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- Actions -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Settings class="w-4 h-4" />
                                                Actions
                                            </h4>

                                            <div class="flex flex-wrap gap-2">
                                                <!-- Exact/Alias Actions -->
                                                <template v-if="(row.match.type === 'exact' || row.match.type === 'alias') && !row.resolved">
                                                    <Button @click="handleRowAction({ action: 'confirm', row })" size="sm"
                                                        class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0">
                                                        <Check class="w-4 h-4 mr-1" />
                                                        Confirm
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'reject', row })" size="sm" variant="outline"
                                                        class="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                                        <X class="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'exclude', row })" size="sm" variant="outline"
                                                        class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                                        <Trash2 class="w-4 h-4 mr-1" />
                                                        Exclude
                                                    </Button>
                                                </template>

                                                <!-- Resolved Actions -->
                                                <template v-else-if="row.resolved">
                                                    <Button @click="handleRowAction({ action: 'undo', row })" size="sm" variant="outline"
                                                        class="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                                                        <RotateCcw class="w-4 h-4 mr-1" />
                                                        Undo
                                                    </Button>
                                                </template>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Excluded State -->
                                    <div v-else class="text-center py-4">
                                        <div class="flex items-center justify-center gap-2 text-red-400 mb-2">
                                            <XCircle class="w-5 h-5" />
                                            <span class="font-medium">This row has been excluded from import</span>
                                        </div>
                                        <Button @click="handleRowAction({ action: 'unexclude', row })" size="sm" variant="outline"
                                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                            <RotateCcw class="w-4 h-4 mr-1" />
                                            Include Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Multiple Matches Section -->
                    <div v-if="conflictMatches.length > 0" class="space-y-2">
                        <button @click="toggleSection('conflict')"
                            class="w-full flex items-center justify-between p-3 bg-gradient-to-r from-yellow-800/30 to-orange-800/30 rounded-lg border border-yellow-600/30 hover:border-yellow-500/50 transition-all">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                                    <AlertTriangle class="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-yellow-100 text-left">Multiple Matches</h3>
                                    <p class="text-xs text-yellow-300/70">{{conflictMatches.filter(r =>
                                        r.resolved).length }}/{{ conflictMatches.length }} resolved</p>
                                </div>
                            </div>
                            <ChevronDown class="w-5 h-5 text-yellow-400 transition-transform"
                                :class="{ 'rotate-180': openSections.conflict }" />
                        </button>

                        <div v-if="openSections.conflict" class="space-y-2 ml-4">
                            <div v-for="(row, conflictIndex) in conflictMatches" :key="`conflict-${conflictIndex}`"
                                class="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl border transition-all duration-200 overflow-hidden"
                                :class="getRowClasses(row)">
                                <!-- Player Row Content -->
                                <div class="p-4">
                                    <!-- Header Row: Name + Status Badge -->
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div class="flex-shrink-0">
                                                <div
                                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm">
                                                    {{ getInitials(row.raw['name'] || row.raw['player name'] || row.raw['player']) }}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 class="font-semibold text-white text-lg">
                                                    {{ row.raw['name'] || row.raw['player name'] || row.raw['player'] }}
                                                </h3>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <div v-if="row.raw['rank']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                                                        <Crown class="w-3 h-3" />
                                                        Rank {{ row.raw['rank'] }}
                                                    </div>
                                                    <div v-if="row.raw['power']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                                                        <Zap class="w-3 h-3" />
                                                        {{ formatPower(row.raw['power']) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Status Indicator -->
                                        <div class="flex items-center gap-2">
                                            <div v-if="row.resolved"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                                                <CheckCircle class="w-4 h-4" />
                                                Confirmed
                                            </div>
                                            <div v-else-if="row.excluded"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                                                <XCircle class="w-4 h-4" />
                                                Excluded
                                            </div>
                                            <div v-else
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                                                <Clock class="w-4 h-4" />
                                                Pending
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Match Details & Actions -->
                                    <div v-if="!row.excluded" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <!-- Match Information -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Target class="w-4 h-4" />
                                                Match Details
                                            </h4>

                                            <!-- Conflict Resolution -->
                                            <template v-if="row.match.type === 'conflict' && !row.resolved">
                                                <div class="space-y-2">
                                                    <label class="block text-sm font-medium text-slate-300">Select Member:</label>
                                                    <!-- Global Member Selector Button -->
                                                    <button @click="(e) => toggleDropdown(`conflict-${conflictIndex}`, row, row.match.matches, 'conflict', e)" type="button"
                                                        class="w-full flex items-center justify-between px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-left">
                                                        <span class="truncate text-white">{{ getSelectedMemberDisplay(row.selectedMemberId, 'Choose from multiple matches...') }}</span>
                                                        <ChevronDown class="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                                                    </button>
                                                </div>
                                            </template>

                                            <!-- Resolved Display -->
                                            <template v-else-if="row.resolved">
                                                <div
                                                    class="bg-gradient-to-r from-emerald-700/20 to-green-700/20 rounded-lg p-3 border border-emerald-500/30">
                                                    <div class="flex items-center gap-2 text-emerald-400">
                                                        <CheckCircle class="w-5 h-5" />
                                                        <span class="font-medium">Successfully matched and confirmed</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- Actions -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Settings class="w-4 h-4" />
                                                Actions
                                            </h4>

                                            <div class="flex flex-wrap gap-2">
                                                <!-- Conflict Actions -->
                                                <template v-if="row.match.type === 'conflict' && !row.resolved">
                                                    <Button :disabled="!row.selectedMemberId" @click="handleRowAction({ action: 'confirmConflict', row })" size="sm"
                                                        class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 disabled:opacity-50">
                                                        <Check class="w-4 h-4 mr-1" />
                                                        Confirm Selection
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'reject', row })" size="sm" variant="outline"
                                                        class="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                                        <X class="w-4 h-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'exclude', row })" size="sm" variant="outline"
                                                        class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                                        <Trash2 class="w-4 h-4 mr-1" />
                                                        Exclude
                                                    </Button>
                                                </template>

                                                <!-- Resolved Actions -->
                                                <template v-else-if="row.resolved">
                                                    <Button @click="handleRowAction({ action: 'undo', row })" size="sm" variant="outline"
                                                        class="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                                                        <RotateCcw class="w-4 h-4 mr-1" />
                                                        Undo
                                                    </Button>
                                                </template>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Excluded State -->
                                    <div v-else class="text-center py-4">
                                        <div class="flex items-center justify-center gap-2 text-red-400 mb-2">
                                            <XCircle class="w-5 h-5" />
                                            <span class="font-medium">This row has been excluded from import</span>
                                        </div>
                                        <Button @click="handleRowAction({ action: 'unexclude', row })" size="sm" variant="outline"
                                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                            <RotateCcw class="w-4 h-4 mr-1" />
                                            Include Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- No Matches Section -->
                    <div v-if="unmatchedRows.length > 0" class="space-y-2">
                        <button @click="toggleSection('unmatched')"
                            class="w-full flex items-center justify-between p-3 bg-gradient-to-r from-slate-800/30 to-gray-800/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-6 h-6 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center">
                                    <Search class="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-slate-100 text-left">No Matches</h3>
                                    <p class="text-xs text-slate-300/70">{{unmatchedRows.filter(r => r.resolved).length
                                        }}/{{ unmatchedRows.length }} mapped</p>
                                </div>
                            </div>
                            <ChevronDown class="w-5 h-5 text-slate-400 transition-transform"
                                :class="{ 'rotate-180': openSections.unmatched }" />
                        </button>

                        <div v-if="openSections.unmatched" class="space-y-2 ml-4">
                            <div v-for="(row, unmatchedIndex) in unmatchedRows" :key="`unmatched-${unmatchedIndex}`"
                                class="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl border transition-all duration-200 overflow-hidden"
                                :class="getRowClasses(row)">
                                <!-- Player Row Content -->
                                <div class="p-4">
                                    <!-- Header Row: Name + Status Badge -->
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div class="flex-shrink-0">
                                                <div
                                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm">
                                                    {{ getInitials(row.raw['name'] || row.raw['player name'] || row.raw['player']) }}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 class="font-semibold text-white text-lg">
                                                    {{ row.raw['name'] || row.raw['player name'] || row.raw['player'] }}
                                                </h3>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <div v-if="row.raw['rank']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                                                        <Crown class="w-3 h-3" />
                                                        Rank {{ row.raw['rank'] }}
                                                    </div>
                                                    <div v-if="row.raw['power']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                                                        <Zap class="w-3 h-3" />
                                                        {{ formatPower(row.raw['power']) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Status Indicator -->
                                        <div class="flex items-center gap-2">
                                            <div v-if="row.resolved"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                                                <CheckCircle class="w-4 h-4" />
                                                Confirmed
                                            </div>
                                            <div v-else-if="row.excluded"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                                                <XCircle class="w-4 h-4" />
                                                Excluded
                                            </div>
                                            <div v-else
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                                                <Clock class="w-4 h-4" />
                                                Pending
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Match Details & Actions -->
                                    <div v-if="!row.excluded" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <!-- Match Information -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Target class="w-4 h-4" />
                                                Match Details
                                            </h4>

                                            <!-- Manual Selection -->
                                            <template v-if="row.match.type === 'unmatched' && !row.resolved">
                                                <div class="space-y-2">
                                                    <label class="block text-sm font-medium text-slate-300">Manual Selection:</label>
                                                    <!-- Global Member Selector Button -->
                                                    <button @click="(e) => toggleDropdown(`unmatched-${unmatchedIndex}`, row, unmatchedMembers, 'unmatched', e)" type="button"
                                                        class="w-full flex items-center justify-between px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-left">
                                                        <span class="truncate text-white">{{ getSelectedMemberDisplay(row.selectedMemberId, 'Select a member...') }}</span>
                                                        <ChevronDown class="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
                                                    </button>
                                                </div>
                                            </template>

                                            <!-- Resolved Display -->
                                            <template v-else-if="row.resolved">
                                                <div
                                                    class="bg-gradient-to-r from-emerald-700/20 to-green-700/20 rounded-lg p-3 border border-emerald-500/30">
                                                    <div class="flex items-center gap-2 text-emerald-400">
                                                        <CheckCircle class="w-5 h-5" />
                                                        <span class="font-medium">Successfully matched and confirmed</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- Actions -->
                                        <div class="space-y-3">
                                            <h4 class="text-sm font-medium text-slate-300 flex items-center gap-2">
                                                <Settings class="w-4 h-4" />
                                                Actions
                                            </h4>

                                            <div class="flex flex-wrap gap-2">
                                                <!-- Unmatched Actions -->
                                                <template v-if="row.match.type === 'unmatched' && !row.resolved">
                                                    <Button :disabled="!row.selectedMemberId" @click="handleRowAction({ action: 'confirmUnmatched', row })" size="sm"
                                                        class="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 disabled:opacity-50">
                                                        <Check class="w-4 h-4 mr-1" />
                                                        Confirm Mapping
                                                    </Button>
                                                    <Button @click="handleRowAction({ action: 'exclude', row })" size="sm" variant="outline"
                                                        class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                                        <Trash2 class="w-4 h-4 mr-1" />
                                                        Exclude
                                                    </Button>
                                                </template>

                                                <!-- Resolved Actions -->
                                                <template v-else-if="row.resolved">
                                                    <Button @click="handleRowAction({ action: 'undo', row })" size="sm" variant="outline"
                                                        class="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10">
                                                        <RotateCcw class="w-4 h-4 mr-1" />
                                                        Undo
                                                    </Button>
                                                </template>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Excluded State -->
                                    <div v-else class="text-center py-4">
                                        <div class="flex items-center justify-center gap-2 text-red-400 mb-2">
                                            <XCircle class="w-5 h-5" />
                                            <span class="font-medium">This row has been excluded from import</span>
                                        </div>
                                        <Button @click="handleRowAction({ action: 'unexclude', row })" size="sm" variant="outline"
                                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                            <RotateCcw class="w-4 h-4 mr-1" />
                                            Include Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Excluded Section -->
                    <div v-if="excludedRows.length > 0" class="space-y-2">
                        <button @click="toggleSection('excluded')"
                            class="w-full flex items-center justify-between p-3 bg-gradient-to-r from-red-800/30 to-rose-800/30 rounded-lg border border-red-600/30 hover:border-red-500/50 transition-all">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                    <XCircle class="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 class="font-semibold text-red-100 text-left">Excluded from Import</h3>
                                    <p class="text-xs text-red-300/70">{{ excludedRows.length }} excluded</p>
                                </div>
                            </div>
                            <ChevronDown class="w-5 h-5 text-red-400 transition-transform"
                                :class="{ 'rotate-180': openSections.excluded }" />
                        </button>

                        <div v-if="openSections.excluded" class="space-y-2 ml-4">
                            <div v-for="(row, excludedIndex) in excludedRows" :key="`excluded-${excludedIndex}`"
                                class="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-xl border transition-all duration-200 overflow-hidden opacity-60"
                                :class="getRowClasses(row)">
                                <!-- Player Row Content -->
                                <div class="p-4">
                                    <!-- Header Row: Name + Status Badge -->
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-3">
                                            <div class="flex-shrink-0">
                                                <div
                                                    class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm">
                                                    {{ getInitials(row.raw['name'] || row.raw['player name'] || row.raw['player']) }}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 class="font-semibold text-white text-lg">
                                                    {{ row.raw['name'] || row.raw['player name'] || row.raw['player'] }}
                                                </h3>
                                                <div class="flex items-center gap-2 mt-1">
                                                    <div v-if="row.raw['rank']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-violet-500/20 border border-purple-500/30 text-purple-400 text-xs font-medium">
                                                        <Crown class="w-3 h-3" />
                                                        Rank {{ row.raw['rank'] }}
                                                    </div>
                                                    <div v-if="row.raw['power']"
                                                        class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                                                        <Zap class="w-3 h-3" />
                                                        {{ formatPower(row.raw['power']) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Status Indicator -->
                                        <div class="flex items-center gap-2">
                                            <div v-if="row.excluded"
                                                class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 text-red-400 text-sm font-medium">
                                                <XCircle class="w-4 h-4" />
                                                Excluded
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Excluded State -->
                                    <div class="text-center py-4">
                                        <div class="flex items-center justify-center gap-2 text-red-400 mb-2">
                                            <XCircle class="w-5 h-5" />
                                            <span class="font-medium">This row has been excluded from import</span>
                                        </div>
                                        <Button @click="handleRowAction({ action: 'unexclude', row })" size="sm" variant="outline"
                                            class="border-slate-500/50 text-slate-400 hover:bg-slate-500/10">
                                            <RotateCcw class="w-4 h-4 mr-1" />
                                            Include Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Global Dropdown Overlay -->
            <div v-if="Object.values(dropdownState).some(Boolean)" class="fixed inset-0 z-40" @click="closeAllDropdowns"></div>
            
            <!-- Global Dropdown Panel -->
            <div v-if="activeDropdown" 
                class="fixed z-50 bg-slate-800 border border-slate-600 rounded-lg shadow-lg overflow-hidden"
                :style="dropdownPosition"
                style="width: 32rem; max-width: 90vw;">
                
                <!-- Search Bar (only for unmatched) -->
                <div v-if="activeDropdown.type === 'unmatched'" class="p-3 border-b border-slate-600 bg-slate-800 sticky top-0 z-10">
                    <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input ref="globalSearchInput" v-model="activeDropdown.searchQuery" type="text"
                            placeholder="Search by name, power, rank, or role..."
                            class="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                            @keydown.escape="closeAllDropdowns" />
                    </div>
                </div>

                <!-- Members List -->
                <div class="max-h-[24rem] overflow-y-auto">
                    <!-- Conflict Members (simple list) -->
                    <template v-if="activeDropdown.type === 'conflict'">
                        <button v-for="member in activeDropdown.members" :key="member.id" 
                            @click="selectGlobalMember(member.id)"
                            class="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3"
                            :class="{ 'bg-indigo-900/20': activeDropdown.selectedMemberId === member.id }">
                            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {{ getInitials(member.name) }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-white truncate">{{ member.name }}</div>
                                <div class="text-xs text-slate-400 flex gap-3">
                                    <span>{{ formatPower(member.power) }} power</span>
                                    <span>{{ member.role || 'Unknown' }}</span>
                                </div>
                            </div>
                            <div v-if="activeDropdown.selectedMemberId === member.id" class="flex-shrink-0">
                                <CheckCircle class="w-4 h-4 text-indigo-400" />
                            </div>
                        </button>
                    </template>

                    <!-- Unmatched Members (grouped with search) -->
                    <template v-if="activeDropdown.type === 'unmatched'">
                        <div v-for="group in getFilteredGroupedMembers(unmatchedMembers, activeDropdown.searchQuery || '')" :key="group.status">
                            <div class="px-3 py-2 text-xs font-medium text-slate-400 uppercase tracking-wide sticky top-0 bg-slate-800/95 backdrop-blur-sm border-b border-slate-600/30">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 rounded-full" :class="getStatusColor(group.status)"></div>
                                    {{ group.status }} ({{ group.members.length }})
                                </div>
                            </div>
                            <button v-for="member in group.members" :key="member.id" 
                                @click="selectGlobalMember(member.id)"
                                class="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center gap-3"
                                :class="{ 'bg-indigo-900/20': activeDropdown.selectedMemberId === member.id }">
                                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 border flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {{ getInitials(member.name) }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-white truncate">{{ member.name }}</div>
                                    <div class="text-xs text-slate-400 flex gap-3">
                                        <span>{{ formatPower(member.power) }} power</span>
                                        <span>{{ member.role || 'Unknown' }}</span>
                                    </div>
                                </div>
                                <div v-if="activeDropdown.selectedMemberId === member.id" class="flex-shrink-0">
                                    <CheckCircle class="w-4 h-4 text-indigo-400" />
                                </div>
                            </button>
                        </div>

                        <!-- No Results -->
                        <div v-if="(activeDropdown.searchQuery || '').trim() && getFilteredGroupedMembers(unmatchedMembers, activeDropdown.searchQuery || '').length === 0"
                            class="p-8 text-center text-sm text-slate-400">
                            <Users class="w-8 h-8 mx-auto mb-2 text-slate-500" />
                            No members found matching "{{ activeDropdown.searchQuery }}"
                        </div>
                    </template>
                </div>
            </div>

            <!-- Footer Actions -->
            <div class="border-t border-slate-700 pt-4 space-y-3">
                <!-- Prominent Finalize Button -->
                <div v-if="allIncludedResolved"
                    class="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border border-emerald-500/30 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-semibold text-emerald-400 flex items-center gap-2">
                                <CheckCircle class="w-5 h-5" />
                                Ready to Import
                            </h3>
                            <p class="text-sm text-emerald-300/70 mt-1">
                                All {{ resolvedCount }} players have been matched and are ready to be added to your
                                database.
                            </p>
                        </div>
                        <Button @click="submitMatches" size="lg"
                            class="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-0 px-8 py-3 text-lg font-semibold">
                            <Upload class="w-5 h-5 mr-3" />
                            Import {{ resolvedCount }} Players
                        </Button>
                    </div>
                </div>

                <!-- Regular Footer -->
                <div class="flex justify-between items-center">
                    <div class="text-sm text-slate-400">
                        <span class="font-medium">{{ resolvedCount }}</span> of <span class="font-medium">{{
                            includedRows.length }}</span> rows ready for import
                    </div>
                    <div class="flex gap-3">
                        <Button variant="outline" @click="$emit('close')"
                            class="border-slate-600 text-slate-300 hover:bg-slate-800">
                            Cancel Import
                        </Button>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Users, Check, CheckCircle, XCircle, AlertTriangle, Search, Link, Upload, ChevronDown,
    Clock, Target, Settings, X, Trash2, RotateCcw, Crown, Zap
} from 'lucide-vue-next'
import { useMembers } from '@/composables/topheroes/admin/useMembers'

const props = defineProps({
    rows: {
        type: Array,
        required: true
    }
})
const emit = defineEmits(['close', 'finalize'])
const { members, updateMember } = useMembers()

// Section visibility state
const openSections = ref({
    exact: true,
    alias: true,
    conflict: true,
    unmatched: true,
    excluded: false
})

// Dropdown state management
const dropdownState = ref({})
const activeDropdown = ref(null)
const dropdownPosition = ref({})
const globalSearchInput = ref(null)

const closeAllDropdowns = () => {
    Object.keys(dropdownState.value).forEach(key => {
        dropdownState.value[key] = false
    })
    activeDropdown.value = null
}

const selectGlobalMember = (memberId) => {
    if (activeDropdown.value && activeDropdown.value.row) {
        activeDropdown.value.row.selectedMemberId = memberId
        closeAllDropdowns()
    }
}

const toggleDropdown = async (dropdownKey, row, members, type, event) => {
    closeAllDropdowns()
    
    if (!dropdownState.value[dropdownKey]) {
        dropdownState.value[dropdownKey] = true
        
        // Just center it on the screen - much simpler and more reliable
        dropdownPosition.value = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }
        
        activeDropdown.value = {
            key: dropdownKey,
            row: row,
            members: members,
            type: type,
            selectedMemberId: row.selectedMemberId,
            searchQuery: type === 'unmatched' ? '' : undefined
        }
        
        if (type === 'unmatched') {
            await nextTick()
            globalSearchInput.value?.focus()
        }
    }
}

const toggleSection = (section) => {
    openSections.value[section] = !openSections.value[section]
}

// Helper functions
const getInitials = (name) => {
    if (!name) return '??'
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const formatPower = (power) => {
    if (!power) return '0'
    return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(power)
}

const getMemberDisplayInfo = (memberId) => {
    const member = members.value.find(m => m.id === memberId)
    if (!member) return { power: '0', rank: 'Unknown' }

    return {
        power: member.power ? formatPower(member.power) : '0',
        rank: member.role || 'Unknown'
    }
}

const getStatusColor = (status) => {
    const colors = {
        active: 'bg-green-400',
        inactive: 'bg-yellow-400',
        left: 'bg-gray-400',
        kicked: 'bg-red-400'
    }
    return colors[status.toLowerCase()] || 'bg-slate-400'
}

// Member selector functions
const getSelectedMemberDisplay = (selectedMemberId, placeholder) => {
    if (!selectedMemberId) return placeholder
    const member = members.value.find(m => m.id === selectedMemberId)
    return member ? member.name : placeholder
}

const getFilteredGroupedMembers = (membersToGroup, searchQuery) => {
    let filtered = membersToGroup

    // Apply search filter
    if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase()
        filtered = membersToGroup.filter(member => {
            const searchFields = [
                member.name?.toLowerCase() || '',
                member.discord?.toLowerCase() || '',
                member.role?.toLowerCase() || '',
                member.status?.toLowerCase() || '',
                formatPower(member.power).toLowerCase(),
                member.power?.toString() || ''
            ]

            return searchFields.some(field => field.includes(query))
        })
    }

    // Group by status
    const grouped = new Map()

    filtered.forEach(member => {
        const status = member.status || 'unknown'
        const statusKey = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()

        if (!grouped.has(statusKey)) {
            grouped.set(statusKey, [])
        }
        grouped.get(statusKey).push(member)
    })

    // Convert to array and sort
    const statusOrder = ['Active', 'Inactive', 'Left', 'Kicked', 'Unknown']

    return statusOrder
        .map(status => {
            const members = grouped.get(status) || []
            if (members.length === 0) return null

            // Sort members within each group by name
            members.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

            return {
                status,
                members
            }
        })
        .filter(Boolean)
}

// Click outside handler - simplified
const handleClickOutside = (e) => {
    if (!e.target.closest('.fixed') && !e.target.closest('button')) {
        closeAllDropdowns()
    }
}

// Lifecycle
onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Grouped rows by match type
const exactMatches = computed(() =>
    props.rows.filter(row => row.match.type === 'exact' && !row.excluded)
)

const aliasMatches = computed(() =>
    props.rows.filter(row => row.match.type === 'alias' && !row.excluded)
)

const conflictMatches = computed(() =>
    props.rows.filter(row => row.match.type === 'conflict' && !row.excluded)
)

const unmatchedRows = computed(() =>
    props.rows.filter(row => row.match.type === 'unmatched' && !row.excluded)
)

const excludedRows = computed(() =>
    props.rows.filter(row => row.excluded)
)

const getRowClasses = (row) => {
    if (row.resolved) return 'border-emerald-500/30 bg-gradient-to-r from-emerald-900/10 to-emerald-800/10'
    if (row.excluded) return 'border-red-500/30 bg-gradient-to-r from-red-900/10 to-red-800/10 opacity-60'
    return 'border-slate-600 hover:border-slate-500'
}

// Row state management functions
function confirmRow(row) {
    const index = props.rows.findIndex(r => r === row)
    if (index === -1) return

    props.rows[index].resolved = true
    props.rows[index].finalMemberId = props.rows[index].match.member.id

    // Add original imported name to member's otherNames if it's different from their current name
    addNameToMemberOtherNames(props.rows[index].match.member.id, props.rows[index].originalName)
}

function confirmConflict(row) {
    const index = props.rows.findIndex(r => r === row)
    if (index === -1 || !props.rows[index].selectedMemberId) return

    props.rows[index].resolved = true
    props.rows[index].finalMemberId = props.rows[index].selectedMemberId

    // Add original imported name to selected member's otherNames
    addNameToMemberOtherNames(props.rows[index].selectedMemberId, props.rows[index].originalName)
}

function confirmUnmatched(row) {
    const index = props.rows.findIndex(r => r === row)
    if (index === -1 || !props.rows[index].selectedMemberId) return

    props.rows[index].resolved = true
    props.rows[index].finalMemberId = props.rows[index].selectedMemberId

    // Add original imported name to selected member's otherNames
    addNameToMemberOtherNames(props.rows[index].selectedMemberId, props.rows[index].originalName)
}

function rejectRow(row) {
    const index = props.rows.findIndex(r => r === row)
    if (index === -1) return

    props.rows[index].match = { type: 'unmatched' }
    props.rows[index].selectedMemberId = null
    props.rows[index].resolved = false
    props.rows[index].finalMemberId = null
}

function excludeRow(row) {
    const index = props.rows.findIndex(r => r === row)
    if (index === -1) return

    props.rows[index].excluded = true
    props.rows[index].resolved = false
    props.rows[index].finalMemberId = null
}

function unexcludeRow(row) {
    const index = props.rows.findIndex(r => r === row)
    if (index === -1) return

    props.rows[index].excluded = false
}

function undoRow(row) {
    const index = props.rows.findIndex(r => r === row)
    if (index === -1) return

    props.rows[index].resolved = false
    props.rows[index].finalMemberId = null
}

const handleRowAction = ({ action, row }) => {
    switch (action) {
        case 'confirm':
            confirmRow(row)
            break
        case 'confirmConflict':
            confirmConflict(row)
            break
        case 'confirmUnmatched':
            confirmUnmatched(row)
            break
        case 'reject':
            rejectRow(row)
            break
        case 'exclude':
            excludeRow(row)
            break
        case 'unexclude':
            unexcludeRow(row)
            break
        case 'undo':
            undoRow(row)
            break
    }
}

// Add imported name to member's otherNames
async function addNameToMemberOtherNames(memberId, importedName) {
    if (!importedName || !memberId) return

    const member = members.value.find(m => m.id === memberId)
    if (!member) return

    // Check if name is already in otherNames or is the same as current name
    const currentOtherNames = member.otherNames || []
    const lowerImportedName = importedName.toLowerCase()
    const lowerCurrentName = member.name.toLowerCase()

    if (lowerImportedName === lowerCurrentName) return
    if (currentOtherNames.some(name => name.toLowerCase() === lowerImportedName)) return

    // Add the imported name to otherNames
    const updatedOtherNames = [...currentOtherNames, importedName]

    try {
        await updateMember(memberId, {
            otherNames: updatedOtherNames,
            updatedAt: new Date()
        })
    } catch (error) {
        console.error('Failed to update member otherNames:', error)
    }
}

// Computed properties
const resolvedCount = computed(() =>
    props.rows.filter(row => row.resolved && !row.excluded).length
)

const excludedCount = computed(() =>
    props.rows.filter(row => row.excluded).length
)

const includedRows = computed(() =>
    props.rows.filter(row => !row.excluded)
)

const pendingCount = computed(() =>
    includedRows.value.filter(row => !row.resolved).length
)

const allIncludedResolved = computed(() =>
    includedRows.value.length > 0 && includedRows.value.every(row => row.resolved)
)

// Show only members not already mapped by finalMemberId in another row
const unmatchedMembers = computed(() => {
    const usedIds = props.rows.map(r => r.finalMemberId).filter(Boolean)
    return members.value.filter(m => !usedIds.includes(m.id))
})

function acceptAllExact() {
    props.rows.forEach((row) => {
        if (row.match.type === 'exact' && !row.resolved && !row.excluded) {
            confirmRow(row)
        }
    })
}

const allExactAccepted = computed(() =>
    props.rows.filter(r => r.match.type === 'exact' && !r.excluded).every(r => r.resolved)
)

function submitMatches() {
    const finalMapped = props.rows
        .filter(row => row && row.raw && row.finalMemberId && !row.excluded)
        .map(row => ({
            memberId: row.finalMemberId,
            ...row.raw
        }))
    emit('finalize', finalMapped)
}
</script>

<style scoped>
/* Custom scrollbar styling */
.overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgb(71 85 105) rgb(30 41 59);
}

.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: rgb(30 41 59);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: rgb(71 85 105);
    border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: rgb(100 116 139);
}
</style>