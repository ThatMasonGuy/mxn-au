<!-- TopHeroes.vue -->
<template>
    <div class="min-h-screen bg-background text-foreground">
        <!-- Header -->
        <div class="mb-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <h1 class="text-2xl font-semibold text-velaris-purple">TopHeroes Manager</h1>
                    <p class="text-sm text-foreground/70 mt-1">Manage heroes, build teams, and optimize gear setups</p>
                </div>
                <div class="flex gap-3 w-full lg:w-auto">
                    <button @click="activeView = activeView === 'heroes' ? 'teams' : 'heroes'"
                        class="btn-soft-violet flex-1 lg:flex-none">
                        <component :is="activeView === 'heroes' ? 'Users' : 'Library'" class="h-4 w-4 mr-2" />
                        {{ activeView === 'heroes' ? 'Team Builder' : 'Hero Collection' }}
                    </button>
                    <button @click="showTeamModal = true" class="btn-solid-purple flex-1 lg:flex-none">
                        <Plus class="h-4 w-4 mr-2" />
                        New Team
                    </button>
                </div>
            </div>
        </div>

        <!-- Heroes View -->
        <div v-if="activeView === 'heroes'" class="space-y-8">
            <!-- Stats Dashboard -->
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div class="stat-card stat-card-nature">
                    <div class="relative p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-nature-green to-emerald-600 flex items-center justify-center shadow-lg">
                                <Leaf class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-nature-green">{{ getFactionCount('nature') }}</p>
                                <p class="text-sm font-medium text-nature-green/80">Nature Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stat-card stat-card-horde">
                    <div class="relative p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-horde-red to-red-600 flex items-center justify-center shadow-lg">
                                <Flame class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-horde-red">{{ getFactionCount('horde') }}</p>
                                <p class="text-sm font-medium text-horde-red/80">Horde Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stat-card stat-card-league">
                    <div class="relative p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-league-blue to-blue-600 flex items-center justify-center shadow-lg">
                                <Shield class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-league-blue">{{ getFactionCount('league') }}</p>
                                <p class="text-sm font-medium text-league-blue/80">League Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="stat-card stat-card-total">
                    <div class="relative p-6">
                        <div class="flex items-center gap-4">
                            <div
                                class="h-12 w-12 rounded-xl bg-gradient-to-br from-velaris-amber to-yellow-600 flex items-center justify-center shadow-lg">
                                <Star class="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p class="text-2xl font-bold text-velaris-amber">{{ heroData.heroes.length }}</p>
                                <p class="text-sm font-medium text-velaris-amber/80">Total Heroes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Search and Filters -->
            <div
                class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-sm border border-border/30">
                <div class="p-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <div class="relative">
                                <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                                <input v-model="searchQuery" type="search"
                                    placeholder="Search heroes by name, faction, or abilities..."
                                    class="pl-12 pr-4 py-3 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 focus:border-velaris-purple/50 transition-all w-full shadow-inner" />
                            </div>
                        </div>
                        <div class="flex gap-3 flex-wrap items-center">
                            <select v-model="filterFaction"
                                class="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Factions</option>
                                <option value="nature">🌿 Nature</option>
                                <option value="horde">🔥 Horde</option>
                                <option value="league">🛡️ League</option>
                            </select>
                            <select v-model="filterRarity"
                                class="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Rarities</option>
                                <option value="MY">💎 Mythic</option>
                                <option value="LE">⭐ Legendary</option>
                                <option value="EP">🔮 Epic</option>
                                <option value="RA">💠 Rare</option>
                            </select>
                            <select v-model="filterTag"
                                class="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-velaris-purple/50 transition-all">
                                <option value="">All Roles</option>
                                <option v-for="tag in heroData.tags" :key="tag.id" :value="tag.id">{{ tag.name }}
                                </option>
                            </select>

                            <!-- View Mode Toggle -->
                            <div class="flex rounded-xl bg-background/30 p-1 border border-border/30">
                                <button @click="viewMode = 'grouped'"
                                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                        viewMode === 'grouped' ? 'bg-velaris-purple text-white shadow-md' : 'text-foreground/70 hover:text-foreground']">
                                    Grouped
                                </button>
                                <button @click="viewMode = 'mixed'"
                                    :class="['px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                        viewMode === 'mixed' ? 'bg-velaris-purple text-white shadow-md' : 'text-foreground/70 hover:text-foreground']">
                                    Mixed
                                </button>
                            </div>

                            <button v-if="hasActiveFilters" @click="clearFilters"
                                class="btn-soft-violet px-4 py-3 rounded-xl">
                                <RotateCcw class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Faction-Grouped Heroes -->
            <div v-if="viewMode === 'grouped'" class="space-y-8">
                <div v-for="faction in ['nature', 'horde', 'league']" :key="faction"
                    v-show="getFilteredHeroesByFaction(faction).length > 0">
                    <!-- Faction Header -->
                    <div class="flex items-center gap-4 mb-6">
                        <div class="h-1 w-12 rounded-full" :class="getFactionBgClass(faction)"></div>
                        <div class="flex items-center gap-3">
                            <div class="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg"
                                :class="getFactionGradient(faction)">
                                <component :is="getFactionIcon(faction)" class="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 class="text-xl font-bold" :class="getFactionColor(faction)">
                                    {{ getFactionName(faction) }}
                                </h2>
                                <p class="text-sm text-foreground/60">
                                    {{ getFilteredHeroesByFaction(faction).length }} heroes
                                </p>
                            </div>
                        </div>
                        <div class="h-1 flex-1 rounded-full" :class="getFactionBgClass(faction)"></div>
                    </div>

                    <!-- Heroes Grid for this Faction -->
                    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        <div v-for="hero in getFilteredHeroesByFaction(faction)" :key="hero.id"
                            class="hero-showcase-card group cursor-pointer" :class="[
                                faction === 'nature' ? 'hero-card-nature' :
                                    faction === 'horde' ? 'hero-card-horde' : 'hero-card-league',
                                hero.rarity === 'mythic' ? 'rarity-mythic' :
                                    hero.rarity === 'legendary' ? 'rarity-legendary' :
                                        hero.rarity === 'epic' ? 'rarity-epic' : 'rarity-rare'
                            ]" @click="selectHero(hero)">

                            <!-- Hero Avatar -->
                            <div class="relative mb-4">
                                <div class="hero-avatar" :class="getFactionGradient(hero.faction)">
                                    <span class="text-2xl font-bold text-white">{{ hero.name.charAt(0) }}</span>
                                    <div class="absolute -top-2 -right-2">
                                        <div class="rarity-gem" :class="getRarityGemClass(hero.rarity)">
                                            <component :is="getRarityIcon(hero.rarity)" class="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                </div>
                            </div>

                            <!-- Hero Info -->
                            <div class="space-y-3">
                                <div class="text-center">
                                    <h3
                                        class="font-bold text-lg text-foreground group-hover:text-velaris-purple transition-colors">
                                        {{ hero.name }}
                                    </h3>
                                    <div class="flex items-center justify-center gap-2 mt-1">
                                        <component :is="getFactionIcon(hero.faction)" class="h-4 w-4"
                                            :class="getFactionColor(hero.faction)" />
                                        <span class="text-sm font-medium" :class="getFactionColor(hero.faction)">
                                            {{ getFactionName(hero.faction) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Rarity Badge -->
                                <div class="flex justify-center">
                                    <div class="rarity-badge" :class="getRarityBadgeClass(hero.rarity)">
                                        <component :is="getRarityIcon(hero.rarity)" class="h-4 w-4" />
                                        <span class="font-bold text-sm">{{ getRarityName(hero.rarity) }}</span>
                                    </div>
                                </div>

                                <!-- Tags -->
                                <div class="flex flex-wrap gap-1.5 justify-center">
                                    <span v-for="tagId in hero.tags.slice(0, 3)" :key="tagId" class="tag-pill">
                                        {{ getTagName(tagId) }}
                                    </span>
                                    <span v-if="hero.tags.length > 3" class="tag-pill-more">
                                        +{{ hero.tags.length - 3 }}
                                    </span>
                                </div>
                            </div>

                            <!-- Hover Action -->
                            <div
                                class="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <button
                                    class="w-full bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                                    <Plus class="h-4 w-4 inline mr-2" />
                                    Add to Team
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mixed View Heroes -->
            <div v-else class="space-y-6">
                <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    <div v-for="hero in getMixedSortedHeroes" :key="hero.id"
                        class="hero-showcase-card group cursor-pointer" :class="[
                            hero.faction === 'nature' ? 'hero-card-nature' :
                                hero.faction === 'horde' ? 'hero-card-horde' : 'hero-card-league',
                            hero.rarity === 'mythic' ? 'rarity-mythic' :
                                hero.rarity === 'legendary' ? 'rarity-legendary' :
                                    hero.rarity === 'epic' ? 'rarity-epic' : 'rarity-rare'
                        ]" @click="selectHero(hero)">

                        <!-- Hero Avatar -->
                        <div class="relative mb-4">
                            <div class="hero-avatar" :class="getFactionGradient(hero.faction)">
                                <span class="text-2xl font-bold text-white">{{ hero.name.charAt(0) }}</span>
                                <div class="absolute -top-2 -right-2">
                                    <div class="rarity-gem" :class="getRarityGemClass(hero.rarity)">
                                        <component :is="getRarityIcon(hero.rarity)" class="h-3 w-3 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div
                                class="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                        </div>

                        <!-- Hero Info -->
                        <div class="space-y-3">
                            <div class="text-center">
                                <h3
                                    class="font-bold text-lg text-foreground group-hover:text-velaris-purple transition-colors">
                                    {{ hero.name }}
                                </h3>
                                <div class="flex items-center justify-center gap-2 mt-1">
                                    <component :is="getFactionIcon(hero.faction)" class="h-4 w-4"
                                        :class="getFactionColor(hero.faction)" />
                                    <span class="text-sm font-medium" :class="getFactionColor(hero.faction)">
                                        {{ getFactionName(hero.faction) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Rarity Badge -->
                            <div class="flex justify-center">
                                <div class="rarity-badge" :class="getRarityBadgeClass(hero.rarity)">
                                    <component :is="getRarityIcon(hero.rarity)" class="h-4 w-4" />
                                    <span class="font-bold text-sm">{{ getRarityName(hero.rarity) }}</span>
                                </div>
                            </div>

                            <!-- Tags -->
                            <div class="flex flex-wrap gap-1.5 justify-center">
                                <span v-for="tagId in hero.tags.slice(0, 3)" :key="tagId" class="tag-pill">
                                    {{ getTagName(tagId) }}
                                </span>
                                <span v-if="hero.tags.length > 3" class="tag-pill-more">
                                    +{{ hero.tags.length - 3 }}
                                </span>
                            </div>
                        </div>

                        <!-- Hover Action -->
                        <div
                            class="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <button
                                class="w-full bg-gradient-to-r from-velaris-purple to-velaris-teal text-white font-medium py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                                <Plus class="h-4 w-4 inline mr-2" />
                                Add to Team
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Builder View -->
        <div v-else class="space-y-6">
            <!-- Team Stats -->
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div class="elev-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 bg-velaris-purple/15 rounded-lg flex items-center justify-center">
                            <Users class="h-5 w-5 text-velaris-purple" />
                        </div>
                        <div>
                            <p class="text-sm text-foreground/60">Active Teams</p>
                            <p class="text-xl font-semibold">{{ savedTeams.length }}</p>
                        </div>
                    </div>
                </div>
                <div class="elev-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 bg-velaris-teal/15 rounded-lg flex items-center justify-center">
                            <Zap class="h-5 w-5 text-velaris-teal" />
                        </div>
                        <div>
                            <p class="text-sm text-foreground/60">Active Bonds</p>
                            <p class="text-xl font-semibold">{{ getActiveBonds(currentTeam).length }}</p>
                        </div>
                    </div>
                </div>
                <div class="elev-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 bg-velaris-green/15 rounded-lg flex items-center justify-center">
                            <TrendingUp class="h-5 w-5 text-velaris-green" />
                        </div>
                        <div>
                            <p class="text-sm text-foreground/60">Faction Bonus</p>
                            <p class="text-xl font-semibold">{{ getFactionBonus(currentTeam) }}%</p>
                        </div>
                    </div>
                </div>
                <div class="elev-card p-4">
                    <div class="flex items-center gap-3">
                        <div class="h-10 w-10 bg-velaris-amber/15 rounded-lg flex items-center justify-center">
                            <Sword class="h-5 w-5 text-velaris-amber" />
                        </div>
                        <div>
                            <p class="text-sm text-foreground/60">Team Power</p>
                            <p class="text-xl font-semibold">{{ getTeamPower(currentTeam) }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Team Formation -->
            <div class="elev-card p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users class="h-5 w-5 text-velaris-purple" />
                    Team Formation
                </h3>

                <div class="grid gap-4">
                    <!-- Back Row -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-foreground/70">Back Row</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-for="position in ['back1', 'back2']" :key="position" class="team-slot"
                                @drop="onDrop($event, position)" @dragover.prevent @dragenter.prevent>
                                <div v-if="currentTeam[position]" class="hero-in-team"
                                    :class="getFactionCardClass(currentTeam[position].faction)" draggable="true"
                                    @dragstart="onTeamDragStart($event, position)" @click="removeFromTeam(position)">
                                    <div class="flex items-center gap-2">
                                        <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                            :class="getFactionGradient(currentTeam[position].faction)">
                                            {{ currentTeam[position].name.charAt(0) }}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-medium text-sm truncate">{{ currentTeam[position].name }}</p>
                                            <p class="text-xs text-foreground/60">{{
                                                getFactionName(currentTeam[position].faction) }}</p>
                                        </div>
                                        <button class="p-1 hover:bg-foreground/10 rounded">
                                            <Settings class="h-4 w-4" @click.stop="openGearModal(position)" />
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="empty-slot">
                                    <Users class="h-6 w-6 text-foreground/30" />
                                    <span class="text-sm text-foreground/50">Back {{ position === 'back1' ? '1' : '2'
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Mid Row -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-foreground/70">Mid Row</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-for="position in ['mid1', 'mid2']" :key="position" class="team-slot"
                                @drop="onDrop($event, position)" @dragover.prevent @dragenter.prevent>
                                <div v-if="currentTeam[position]" class="hero-in-team"
                                    :class="getFactionCardClass(currentTeam[position].faction)" draggable="true"
                                    @dragstart="onTeamDragStart($event, position)" @click="removeFromTeam(position)">
                                    <div class="flex items-center gap-2">
                                        <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                            :class="getFactionGradient(currentTeam[position].faction)">
                                            {{ currentTeam[position].name.charAt(0) }}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-medium text-sm truncate">{{ currentTeam[position].name }}</p>
                                            <p class="text-xs text-foreground/60">{{
                                                getFactionName(currentTeam[position].faction) }}</p>
                                        </div>
                                        <button class="p-1 hover:bg-foreground/10 rounded">
                                            <Settings class="h-4 w-4" @click.stop="openGearModal(position)" />
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="empty-slot">
                                    <Users class="h-6 w-6 text-foreground/30" />
                                    <span class="text-sm text-foreground/50">Mid {{ position === 'mid1' ? '1' : '2'
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Front Row -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-medium text-foreground/70">Front Row</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div v-for="position in ['front1', 'front2']" :key="position" class="team-slot"
                                @drop="onDrop($event, position)" @dragover.prevent @dragenter.prevent>
                                <div v-if="currentTeam[position]" class="hero-in-team"
                                    :class="getFactionCardClass(currentTeam[position].faction)" draggable="true"
                                    @dragstart="onTeamDragStart($event, position)" @click="removeFromTeam(position)">
                                    <div class="flex items-center gap-2">
                                        <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                                            :class="getFactionGradient(currentTeam[position].faction)">
                                            {{ currentTeam[position].name.charAt(0) }}
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-medium text-sm truncate">{{ currentTeam[position].name }}</p>
                                            <p class="text-xs text-foreground/60">{{
                                                getFactionName(currentTeam[position].faction) }}</p>
                                        </div>
                                        <button class="p-1 hover:bg-foreground/10 rounded">
                                            <Settings class="h-4 w-4" @click.stop="openGearModal(position)" />
                                        </button>
                                    </div>
                                </div>
                                <div v-else class="empty-slot">
                                    <Users class="h-6 w-6 text-foreground/30" />
                                    <span class="text-sm text-foreground/50">Front {{ position === 'front1' ? '1' : '2'
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Hero Selection for Team Building -->
            <div class="elev-card p-6">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Library class="h-5 w-5 text-velaris-purple" />
                    Available Heroes
                </h3>

                <div
                    class="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 max-h-64 overflow-y-auto">
                    <div v-for="hero in availableHeroes" :key="hero.id" class="hero-mini-card cursor-pointer"
                        :class="getFactionCardClass(hero.faction)" draggable="true"
                        @dragstart="onDragStart($event, hero)" @click="addToTeam(hero)">
                        <div class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mx-auto mb-2"
                            :class="getFactionGradient(hero.faction)">
                            {{ hero.name.charAt(0) }}
                        </div>
                        <p class="text-xs font-medium text-center truncate">{{ hero.name }}</p>
                        <p class="text-xs text-foreground/60 text-center">{{ getFactionName(hero.faction) }}</p>
                    </div>
                </div>
            </div>

            <!-- Bonds and Recommendations -->
            <div v-if="getActiveBonds(currentTeam).length > 0 || getRecommendations(currentTeam).length > 0"
                class="space-y-4">
                <!-- Active Bonds -->
                <div v-if="getActiveBonds(currentTeam).length > 0" class="elev-card p-6">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Zap class="h-5 w-5 text-velaris-teal" />
                        Active Bonds
                    </h3>
                    <div class="grid gap-3 md:grid-cols-2">
                        <div v-for="bond in getActiveBonds(currentTeam)" :key="bond.id"
                            class="p-4 bg-velaris-teal/10 border border-velaris-teal/20 rounded-lg">
                            <div class="flex items-center gap-2 mb-2">
                                <Zap class="h-4 w-4 text-velaris-teal" />
                                <span class="font-medium text-velaris-teal">Bond Active</span>
                            </div>
                            <p class="text-sm text-foreground/70 mb-2">{{ bond.heroes.join(', ') }}</p>
                            <div class="text-xs text-velaris-teal font-medium">
                                {{ formatBondBuffs(bond.buffs) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recommendations -->
                <div v-if="getRecommendations(currentTeam).length > 0" class="elev-card p-6">
                    <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Lightbulb class="h-5 w-5 text-velaris-amber" />
                        Recommendations
                    </h3>
                    <div class="grid gap-3 md:grid-cols-2">
                        <div v-for="rec in getRecommendations(currentTeam)" :key="rec.id"
                            class="p-4 bg-velaris-amber/10 border border-velaris-amber/20 rounded-lg">
                            <div class="flex items-center gap-2 mb-2">
                                <Lightbulb class="h-4 w-4 text-velaris-amber" />
                                <span class="font-medium text-velaris-amber">{{ rec.type }}</span>
                            </div>
                            <p class="text-sm text-foreground/70 mb-2">{{ rec.description }}</p>
                            <div class="text-xs text-velaris-amber font-medium">{{ rec.benefit }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Gear Modal -->
        <div v-if="showGearModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-card border border-border rounded-xl p-6 w-full max-w-md">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Gear Setup</h3>
                    <button @click="closeGearModal" class="p-2 hover:bg-foreground/10 rounded">
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <div v-if="gearModalHero" class="space-y-4">
                    <div class="flex items-center gap-3 p-3 bg-foreground/5 rounded-lg">
                        <div class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold"
                            :class="getFactionGradient(gearModalHero.faction)">
                            {{ gearModalHero.name.charAt(0) }}
                        </div>
                        <div>
                            <p class="font-medium">{{ gearModalHero.name }}</p>
                            <p class="text-sm text-foreground/60">{{ gearModalPosition }}</p>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium mb-2">Weapon</label>
                            <input v-model="gearData.weapon"
                                class="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                placeholder="e.g., Mythic Sword +5" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Armor</label>
                            <input v-model="gearData.armor"
                                class="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                placeholder="e.g., Legendary Plate +3" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Accessories</label>
                            <input v-model="gearData.accessories"
                                class="w-full px-3 py-2 bg-background border border-border rounded-lg"
                                placeholder="e.g., Ring of Power +2" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Notes</label>
                            <textarea v-model="gearData.notes"
                                class="w-full px-3 py-2 bg-background border border-border rounded-lg h-20"
                                placeholder="Additional gear notes or strategy..."></textarea>
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button @click="saveGearData" class="btn-solid-purple flex-1">Save Gear</button>
                        <button @click="closeGearModal" class="btn-soft-violet flex-1">Cancel</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Team Modal -->
        <div v-if="showTeamModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-card border border-border rounded-xl p-6 w-full max-w-md">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Save Team</h3>
                    <button @click="closeTeamModal" class="p-2 hover:bg-foreground/10 rounded">
                        <X class="h-4 w-4" />
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Team Name</label>
                        <input v-model="newTeamName"
                            class="w-full px-3 py-2 bg-background border border-border rounded-lg"
                            placeholder="e.g., Main PvP Team" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea v-model="newTeamDescription"
                            class="w-full px-3 py-2 bg-background border border-border rounded-lg h-20"
                            placeholder="Team strategy and notes..."></textarea>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button @click="saveCurrentTeam" class="btn-solid-purple flex-1">Save Team</button>
                        <button @click="closeTeamModal" class="btn-soft-violet flex-1">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import {
    Search, Plus, Library, Users, Flame, Leaf, Shield, Star, RotateCcw,
    Settings, X, Zap, Lightbulb, TrendingUp, Sword, Crown, Gem, Award, Hexagon
} from 'lucide-vue-next'

// Hero data (would typically come from props or a store)
const heroData = reactive({
    "factions": [
        {
            "id": "league",
            "name": "League",
            "beats": "nature",
            "loses_to": "horde",
            "buff_percent": 30
        },
        {
            "id": "nature",
            "name": "Nature",
            "beats": "horde",
            "loses_to": "league",
            "buff_percent": 30
        },
        {
            "id": "horde",
            "name": "Horde",
            "beats": "league",
            "loses_to": "nature",
            "buff_percent": 30
        }
    ],
    "rarities": [
        { "id": "MY", "name": "Mythic" },
        { "id": "LE", "name": "Legendary" },
        { "id": "EP", "name": "Epic" },
        { "id": "RA", "name": "Rare" }
    ],
    "tags": [
        { "id": "DD", "name": "Damage Dealer", "desc": "Excels at dealing damage (+3% final damage)." },
        { "id": "HE", "name": "Healer", "desc": "Provides healing support (+5% healing)." },
        { "id": "SP", "name": "Supporter", "desc": "Strategic support (+5% max HP to team)." },
        { "id": "T", "name": "Tank", "desc": "Front row defense (-5% damage taken)." },
        { "id": "BD", "name": "Burst Damage", "desc": "Specializes in short-period high skill damage." },
        { "id": "S", "name": "Sustained", "desc": "Sustained combat and special effects." },
        { "id": "B", "name": "Buff", "desc": "Can provide buffs to teammates." },
        { "id": "D", "name": "Debuff", "desc": "Can inflict debuffs on enemies." },
        { "id": "C", "name": "Control", "desc": "Can control or disable enemies." },
        { "id": "SM", "name": "Summon", "desc": "Can summon units." },
        { "id": "MT", "name": "Multi-target", "desc": "Deals AoE/multi-target damage." },
        { "id": "ST", "name": "Single-target", "desc": "Specializes in single-target damage." }
    ],
    "hero_bonds": [
        {
            "heroes": ["Astrologer", "Adjudicator", "Paragon"],
            "buffs": [{ "stat": "atk", "type": "percent", "value": 10 }]
        },
        {
            "heroes": ["Wilderness Hunter", "Soulmancer", "Desert Prince"],
            "buffs": [{ "stat": "atk", "type": "percent", "value": 10 }]
        },
        {
            "heroes": ["Sage", "Forest Maiden", "Pixie"],
            "buffs": [{ "stat": "atk", "type": "percent", "value": 10 }]
        },
        {
            "heroes": ["Desert Prince", "Storm Maiden", "Witch"],
            "buffs": [{ "stat": "atk", "type": "percent", "value": 15 }]
        },
        {
            "heroes": ["Storm Maiden", "Wukong", "Beastmaster"],
            "buffs": [{ "stat": "atk", "type": "percent", "value": 15 }]
        },
        {
            "heroes": ["Rose Princess", "Artificer", "Adjudicator"],
            "buffs": [{ "stat": "atk", "type": "percent", "value": 15 }]
        },
        {
            "heroes": ["Paragon", "Pixie", "Desert Prince"],
            "buffs": [{ "stat": "atk", "type": "percent", "value": 15 }]
        }
    ],
    "heroes": [
        { "id": "pyromancer", "name": "Pyromancer", "rarity": "LE", "faction": "league", "tags": ["DD", "BD", "MT"] },
        { "id": "nun", "name": "Nun", "rarity": "LE", "faction": "league", "tags": ["HE", "B", "ST"] },
        { "id": "adjudicator", "name": "Adjudicator", "rarity": "LE", "faction": "league", "tags": ["T", "S", "B"] },
        { "id": "rose_princess", "name": "Rose Princess", "rarity": "MY", "faction": "league", "tags": ["T", "BD", "C"] },
        { "id": "paragon", "name": "Paragon", "rarity": "MY", "faction": "league", "tags": ["DD", "BD", "MT"] },
        { "id": "bishop", "name": "Bishop", "rarity": "MY", "faction": "league", "tags": ["DD", "BD", "C"] },
        { "id": "wukong", "name": "Wukong", "rarity": "MY", "faction": "horde", "tags": ["DD", "C", "SM"] },
        { "id": "tidecaller", "name": "Tidecaller", "rarity": "MY", "faction": "nature", "tags": ["DD", "SM", "C"] },
        { "id": "desert_prince", "name": "Desert Prince", "rarity": "MY", "faction": "horde", "tags": ["T", "S", "MT"] },
        { "id": "beastmaster", "name": "Beastmaster", "rarity": "MY", "faction": "horde", "tags": ["T", "C", "B"] },
        { "id": "witch", "name": "Witch", "rarity": "MY", "faction": "horde", "tags": ["HE", "S", "C"] },
        { "id": "storm_maiden", "name": "Storm Maiden", "rarity": "MY", "faction": "horde", "tags": ["DD", "S", "MT"] },
        { "id": "treeguard", "name": "Treeguard", "rarity": "LE", "faction": "nature", "tags": ["T", "S", "B"] },
        { "id": "soulmancer", "name": "Soulmancer", "rarity": "LE", "faction": "horde", "tags": ["SP", "B", "MT"] },
        { "id": "secret_keeper", "name": "Secret Keeper", "rarity": "LE", "faction": "league", "tags": ["T", "C", "B"] },
        { "id": "artificer", "name": "Artificer", "rarity": "MY", "faction": "league", "tags": ["SP", "B", "C"] },
        { "id": "warlock", "name": "Warlock", "rarity": "LE", "faction": "horde", "tags": ["SP", "B", "D"] },
        { "id": "monk", "name": "Monk", "rarity": "MY", "faction": "nature", "tags": ["T", "S", "B"] },
        { "id": "ne_zha", "name": "Ne Zha", "rarity": "MY", "faction": "nature", "tags": ["T", "BD", "C"] },
        { "id": "druid", "name": "Druid", "rarity": "LE", "faction": "nature", "tags": ["HE", "B", "SM"] },
        { "id": "astrologer", "name": "Astrologer", "rarity": "LE", "faction": "league", "tags": ["DD", "BD", "ST"] },
        { "id": "windwalker", "name": "Windwalker", "rarity": "LE", "faction": "nature", "tags": ["DD", "BD", "ST"] },
        { "id": "sage", "name": "Sage", "rarity": "LE", "faction": "nature", "tags": ["T", "S", "D"] },
        { "id": "forest_maiden", "name": "Forest Maiden", "rarity": "LE", "faction": "nature", "tags": ["SP", "C", "SM"] },
        { "id": "shaman", "name": "Shaman", "rarity": "LE", "faction": "horde", "tags": ["HE", "S", "MT"] },
        { "id": "swordmaster", "name": "Swordmaster", "rarity": "LE", "faction": "horde", "tags": ["T", "S", "MT"] },
        { "id": "wilderness_hunter", "name": "Wilderness Hunter", "rarity": "LE", "faction": "horde", "tags": ["DD", "S", "B"] },
        { "id": "barbarian", "name": "Barbarian", "rarity": "LE", "faction": "horde", "tags": ["T", "C", "D"] },
        { "id": "hostess", "name": "Hostess", "rarity": "LE", "faction": "league", "tags": ["T", "C", "MT"] },
        { "id": "pixie", "name": "Pixie", "rarity": "LE", "faction": "nature", "tags": ["DD", "BD", "C"] },
        { "id": "bard", "name": "Bard", "rarity": "LE", "faction": "league", "tags": ["SP", "B", "MT"] },
        { "id": "ranger", "name": "Ranger", "rarity": "EP", "faction": "league", "tags": ["DD", "B"] },
        { "id": "knight", "name": "Knight", "rarity": "EP", "faction": "league", "tags": ["T", "C"] },
        { "id": "rogue", "name": "Rogue", "rarity": "EP", "faction": "horde", "tags": ["DD", "D"] },
        { "id": "brawler", "name": "Brawler", "rarity": "EP", "faction": "horde", "tags": ["DD", "S"] },
        { "id": "minister", "name": "Minister", "rarity": "EP", "faction": "league", "tags": ["HE", "B"] },
        { "id": "priestess", "name": "Priestess", "rarity": "EP", "faction": "nature", "tags": ["DD", "SM"] },
        { "id": "dancer", "name": "Dancer", "rarity": "EP", "faction": "nature", "tags": ["SP", "B"] },
        { "id": "outlaw", "name": "Outlaw", "rarity": "EP", "faction": "horde", "tags": ["SP", "D"] },
        { "id": "watcher", "name": "Watcher", "rarity": "LE", "faction": "nature", "tags": ["DD", "BD", "D"] },
        { "id": "warrior", "name": "Warrior", "rarity": "RA", "faction": "league", "tags": ["DD", "S"] },
        { "id": "wizard", "name": "Wizard", "rarity": "RA", "faction": "league", "tags": ["DD", "MT"] },
        { "id": "guard", "name": "Guard", "rarity": "RA", "faction": "horde", "tags": ["T", "C"] },
        { "id": "blacksmith", "name": "Blacksmith", "rarity": "RA", "faction": "horde", "tags": ["SP", "B"] },
        { "id": "pharmacist", "name": "Pharmacist", "rarity": "RA", "faction": "nature", "tags": ["HE", "MT"] },
        { "id": "archer", "name": "Archer", "rarity": "RA", "faction": "nature", "tags": ["DD", "MT"] }
    ]
})

// UI State
const activeView = ref('heroes')
const searchQuery = ref('')
const filterFaction = ref('')
const filterRarity = ref('')
const filterTag = ref('')
const showGearModal = ref(false)
const showTeamModal = ref(false)
const gearModalPosition = ref('')
const gearModalHero = ref(null)
const newTeamName = ref('')
const newTeamDescription = ref('')
const viewMode = ref('grouped') // 'grouped' or 'mixed'

// Team state
const currentTeam = reactive({
    front1: null,
    front2: null,
    mid1: null,
    mid2: null,
    back1: null,
    back2: null
})

const gearData = reactive({
    weapon: '',
    armor: '',
    accessories: '',
    notes: ''
})

const savedTeams = ref([])
const teamGearData = ref({})

// Computed properties
const filteredHeroes = computed(() => {
    return heroData.heroes.filter(hero => {
        const matchesSearch = !searchQuery.value ||
            hero.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            hero.tags.some(tag => getTagName(tag).toLowerCase().includes(searchQuery.value.toLowerCase()))

        const matchesFaction = !filterFaction.value || hero.faction === filterFaction.value
        const matchesRarity = !filterRarity.value || hero.rarity === filterRarity.value
        const matchesTag = !filterTag.value || hero.tags.includes(filterTag.value)

        return matchesSearch && matchesFaction && matchesRarity && matchesTag
    })
})

const getFilteredHeroesByFaction = (faction) => {
    const factionHeroes = filteredHeroes.value.filter(hero => hero.faction === faction)

    // Sort by rarity (Mythic -> Legendary -> Epic -> Rare), then by name
    const rarityOrder = { 'mythic': 0, 'legendary': 1, 'epic': 2, 'rare': 3 }

    return factionHeroes.sort((a, b) => {
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff
        return a.name.localeCompare(b.name)
    })
}

const getMixedSortedHeroes = computed(() => {
    const rarityOrder = { 'mythic': 0, 'legendary': 1, 'epic': 2, 'rare': 3 }
    const factionOrder = { 'league': 0, 'nature': 1, 'horde': 2 }

    return filteredHeroes.value.sort((a, b) => {
        // First sort by rarity
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff

        // Then by faction (League, Nature, Horde)
        const factionDiff = factionOrder[a.faction] - factionOrder[b.faction]
        if (factionDiff !== 0) return factionDiff

        // Finally by name
        return a.name.localeCompare(b.name)
    })
})

const availableHeroes = computed(() => {
    const usedHeroIds = Object.values(currentTeam).filter(Boolean).map(hero => hero.id)
    const available = heroData.heroes.filter(hero => !usedHeroIds.includes(hero.id))

    // Get current team faction counts
    const teamHeroes = Object.values(currentTeam).filter(Boolean)
    const factionCounts = {}
    teamHeroes.forEach(hero => {
        factionCounts[hero.faction] = (factionCounts[hero.faction] || 0) + 1
    })

    // Find dominant faction (faction with most heroes in team)
    const dominantFaction = Object.keys(factionCounts).reduce((a, b) =>
        factionCounts[a] > factionCounts[b] ? a : b, 'nature'
    )

    // Sort by faction priority (dominant first), then by rarity (Mythic to Rare)
    const rarityOrder = { 'mythic': 0, 'legendary': 1, 'epic': 2, 'rare': 3 }

    return available.sort((a, b) => {
        // First, prioritize dominant faction
        if (a.faction === dominantFaction && b.faction !== dominantFaction) return -1
        if (b.faction === dominantFaction && a.faction !== dominantFaction) return 1

        // Then sort by rarity (Mythic first)
        const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        if (rarityDiff !== 0) return rarityDiff

        // Finally sort by name
        return a.name.localeCompare(b.name)
    })
})

const hasActiveFilters = computed(() =>
    searchQuery.value || filterFaction.value || filterRarity.value || filterTag.value
)

// Helper functions
const getFactionCount = (faction) => {
    return heroData.heroes.filter(hero => hero.faction === faction).length
}

const getFactionName = (faction) => {
    const factionData = heroData.factions.find(f => f.id === faction)
    return factionData ? factionData.name : faction
}

const getRarityName = (rarity) => {
    const rarityData = heroData.rarities.find(r => r.id === rarity)
    return rarityData ? rarityData.name : rarity
}

const getTagName = (tagId) => {
    const tag = heroData.tags.find(t => t.id === tagId)
    return tag ? tag.name : tagId
}

const getFactionIcon = (faction) => {
    const icons = { nature: Leaf, horde: Flame, league: Shield }
    return icons[faction] || Shield
}

const getFactionColor = (faction) => {
    const colors = {
        nature: 'text-nature-green',
        horde: 'text-horde-red',
        league: 'text-league-blue'
    }
    return colors[faction] || 'text-foreground'
}

const getFactionCardClass = (faction) => {
    const classes = {
        nature: 'border-nature-green/30 hover:border-nature-green/60 bg-nature-green/5',
        horde: 'border-horde-red/30 hover:border-horde-red/60 bg-horde-red/5',
        league: 'border-league-blue/30 hover:border-league-blue/60 bg-league-blue/5'
    }
    return classes[faction] || 'border-border'
}

const getFactionGradient = (faction) => {
    const gradients = {
        nature: 'bg-gradient-to-br from-nature-green to-emerald-600',
        horde: 'bg-gradient-to-br from-horde-red to-red-600',
        league: 'bg-gradient-to-br from-league-blue to-blue-600'
    }
    return gradients[faction] || 'bg-gradient-to-br from-velaris-purple to-velaris-teal'
}

const getRarityColor = (rarity) => {
    const colors = {
        mythic: 'bg-red-500/15 text-red-400 border-red-500/30',      // Mythic = Red
        legendary: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',  // Legendary = Yellow
        epic: 'bg-purple-500/15 text-purple-400 border-purple-500/30',  // Epic = Purple
        rare: 'bg-blue-500/15 text-blue-400 border-blue-500/30'        // Rare = Blue
    }
    return colors[rarity] || 'bg-foreground/10 text-foreground border-border'
}

const getRarityIcon = (rarity) => {
    const icons = {
        mythic: Crown,     // Mythic
        legendary: Star,      // Legendary  
        epic: Gem,       // Epic
        rare: Hexagon    // Rare
    }
    return icons[rarity] || Star
}

const getRarityGemClass = (rarity) => {
    const classes = {
        mythic: 'bg-gradient-to-br from-red-500 to-red-600',
        legendary: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
        epic: 'bg-gradient-to-br from-purple-500 to-purple-600',
        rare: 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
    return classes[rarity] || 'bg-gradient-to-br from-slate-500 to-slate-600'
}

const getRarityBadgeClass = (rarity) => {
    const classes = {
        mythic: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30',
        legendary: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 border border-yellow-500/30',
        epic: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 border border-purple-500/30',
        rare: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30'
    }
    return classes[rarity] || 'bg-foreground/10 text-foreground border-border'
}

const getFactionBgClass = (faction) => {
    const classes = {
        nature: 'bg-gradient-to-r from-nature-green/50 to-nature-green/20',
        horde: 'bg-gradient-to-r from-horde-red/50 to-horde-red/20',
        league: 'bg-gradient-to-r from-league-blue/50 to-league-blue/20'
    }
    return classes[faction] || 'bg-foreground/20'
}

const getFactionCardBg = (faction) => {
    const classes = {
        nature: 'bg-gradient-to-br from-nature-green/10 via-nature-green/5 to-nature-green/10',
        horde: 'bg-gradient-to-br from-horde-red/10 via-horde-red/5 to-horde-red/10',
        league: 'bg-gradient-to-br from-league-blue/10 via-league-blue/5 to-league-blue/10'
    }
    return classes[faction] || 'bg-card/50'
}

const getRarityShadow = (rarity) => {
    const shadows = {
        mythic: 'shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30',
        legendary: 'shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30',
        epic: 'shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30',
        rare: 'shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
    }
    return shadows[rarity] || 'shadow-lg shadow-foreground/10'
}

// Team building functions
const selectHero = (hero) => {
    if (activeView.value === 'teams') {
        addToTeam(hero)
    }
}

const addToTeam = (hero) => {
    // Find first empty slot
    const positions = ['front1', 'front2', 'mid1', 'mid2', 'back1', 'back2']
    for (const position of positions) {
        if (!currentTeam[position]) {
            currentTeam[position] = hero
            break
        }
    }
}

const removeFromTeam = (position) => {
    currentTeam[position] = null
}

const onDragStart = (event, hero) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'hero', data: hero }))
}

const onTeamDragStart = (event, position) => {
    const hero = currentTeam[position]
    if (hero) {
        event.dataTransfer.setData('text/plain', JSON.stringify({ type: 'team-hero', data: hero, position: position }))
    }
}

const onDrop = (event, targetPosition) => {
    event.preventDefault()
    const dragData = JSON.parse(event.dataTransfer.getData('text/plain'))

    if (dragData.type === 'hero') {
        // Dropping a new hero from the available list
        currentTeam[targetPosition] = dragData.data
    } else if (dragData.type === 'team-hero') {
        // Moving a hero from one team slot to another
        const sourcePosition = dragData.position
        const sourceHero = dragData.data
        const targetHero = currentTeam[targetPosition]

        // Swap heroes or move to empty slot
        currentTeam[targetPosition] = sourceHero
        currentTeam[sourcePosition] = targetHero || null
    }
}

// Bond and recommendation functions
const getActiveBonds = (team) => {
    const teamHeroes = Object.values(team).filter(Boolean).map(hero => hero.name)
    return heroData.hero_bonds.filter(bond => {
        return bond.heroes.every(heroName => teamHeroes.includes(heroName))
    }).map((bond, index) => ({
        id: index,
        ...bond
    }))
}

const getFactionBonus = (team) => {
    const teamHeroes = Object.values(team).filter(Boolean)
    const factionCounts = {}

    teamHeroes.forEach(hero => {
        factionCounts[hero.faction] = (factionCounts[hero.faction] || 0) + 1
    })

    const maxCount = Math.max(...Object.values(factionCounts), 0)
    if (maxCount >= 4) return 35
    if (maxCount >= 3) return 25
    if (maxCount >= 2) return 15
    return 0
}

const getTeamPower = (team) => {
    const teamHeroes = Object.values(team).filter(Boolean)
    const rarityPower = { mythic: 1000, legendary: 750, epic: 500, rare: 250 }
    return teamHeroes.reduce((total, hero) => total + (rarityPower[hero.rarity] || 0), 0)
}

const getRecommendations = (team) => {
    const recommendations = []
    const teamHeroes = Object.values(team).filter(Boolean)

    if (teamHeroes.length < 6) {
        recommendations.push({
            id: 'incomplete',
            type: 'Team Incomplete',
            description: `Add ${6 - teamHeroes.length} more heroes to complete your team`,
            benefit: 'Full team provides maximum synergy potential'
        })
    }

    // Check for missing tanks
    const tanks = teamHeroes.filter(hero => hero.tags.includes('T'))
    if (tanks.length < 2) {
        recommendations.push({
            id: 'tanks',
            type: 'Need Tanks',
            description: 'Consider adding more tank heroes for front line protection',
            benefit: 'Tanks reduce damage taken and protect damage dealers'
        })
    }

    return recommendations
}

const formatBondBuffs = (buffs) => {
    return buffs.map(buff => `+${buff.value}% ${buff.stat.toUpperCase()}`).join(', ')
}

// Modal functions
const openGearModal = (position) => {
    if (currentTeam[position]) {
        gearModalPosition.value = position
        gearModalHero.value = currentTeam[position]

        // Load existing gear data
        const key = `${currentTeam[position].id}_${position}`
        const existingGear = teamGearData.value[key] || {}
        Object.assign(gearData, {
            weapon: existingGear.weapon || '',
            armor: existingGear.armor || '',
            accessories: existingGear.accessories || '',
            notes: existingGear.notes || ''
        })

        showGearModal.value = true
    }
}

const closeGearModal = () => {
    showGearModal.value = false
    gearModalPosition.value = ''
    gearModalHero.value = null
    Object.assign(gearData, { weapon: '', armor: '', accessories: '', notes: '' })
}

const saveGearData = () => {
    if (gearModalHero.value && gearModalPosition.value) {
        const key = `${gearModalHero.value.id}_${gearModalPosition.value}`
        teamGearData.value[key] = { ...gearData }
    }
    closeGearModal()
}

const closeTeamModal = () => {
    showTeamModal.value = false
    newTeamName.value = ''
    newTeamDescription.value = ''
}

const saveCurrentTeam = () => {
    if (newTeamName.value.trim()) {
        const team = {
            id: Date.now(),
            name: newTeamName.value,
            description: newTeamDescription.value,
            heroes: { ...currentTeam },
            gear: { ...teamGearData.value },
            createdAt: new Date().toISOString()
        }
        savedTeams.value.push(team)
        closeTeamModal()
    }
}

// Filter functions
const clearFilters = () => {
    searchQuery.value = ''
    filterFaction.value = ''
    filterRarity.value = ''
    filterTag.value = ''
}
</script>

<style scoped>
/* Custom faction colors */
:root {
    --nature-green: #10b981;
    --horde-red: #ef4444;
    --league-blue: #3b82f6;
}

.text-nature-green {
    color: var(--nature-green);
}

.text-horde-red {
    color: var(--horde-red);
}

.text-league-blue {
    color: var(--league-blue);
}

/* Stat Cards */
.stat-card {
    @apply relative overflow-hidden rounded-2xl backdrop-blur-sm border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
}

.stat-card::before {
    content: '';
    @apply absolute inset-0 opacity-10;
}

.stat-card-nature {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%);
    border-color: rgba(16, 185, 129, 0.3);
}

.stat-card-nature::before {
    background: linear-gradient(135deg, var(--nature-green), #059669);
}

.stat-card-horde {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0.1) 50%, transparent 100%);
    border-color: rgba(239, 68, 68, 0.3);
}

.stat-card-horde::before {
    background: linear-gradient(135deg, var(--horde-red), #dc2626);
}

.stat-card-league {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 100%);
    border-color: rgba(59, 130, 246, 0.3);
}

.stat-card-league::before {
    background: linear-gradient(135deg, var(--league-blue), #2563eb);
}

.stat-card-total {
    background: linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(234, 179, 8, 0.1) 50%, transparent 100%);
    border-color: rgba(234, 179, 8, 0.3);
}

.stat-card-total::before {
    background: linear-gradient(135deg, #eab308, #f59e0b);
}

/* Hero Cards */
.hero-showcase-card {
    @apply relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 overflow-hidden;
}

.hero-card-nature {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(16, 185, 129, 0.05) 100%);
    border-color: rgba(16, 185, 129, 0.25);
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.1), 0 4px 6px -2px rgba(16, 185, 129, 0.05);
}

.hero-card-nature:hover {
    border-color: rgba(16, 185, 129, 0.4);
    box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.2), 0 10px 15px -3px rgba(16, 185, 129, 0.1);
}

.hero-card-horde {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 50%, rgba(239, 68, 68, 0.05) 100%);
    border-color: rgba(239, 68, 68, 0.25);
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05);
}

.hero-card-horde:hover {
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.2), 0 10px 15px -3px rgba(239, 68, 68, 0.1);
}

.hero-card-league {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.08) 50%, rgba(59, 130, 246, 0.05) 100%);
    border-color: rgba(59, 130, 246, 0.25);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05);
}

.hero-card-league:hover {
    border-color: rgba(59, 130, 246, 0.4);
    box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.2), 0 10px 15px -3px rgba(59, 130, 246, 0.1);
}

/* Rarity Shadows */
.rarity-mythic {
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.15), 0 4px 6px -2px rgba(239, 68, 68, 0.1) !important;
}

.rarity-mythic:hover {
    box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 10px 15px -3px rgba(239, 68, 68, 0.15) !important;
}

.rarity-legendary {
    box-shadow: 0 10px 15px -3px rgba(234, 179, 8, 0.15), 0 4px 6px -2px rgba(234, 179, 8, 0.1) !important;
}

.rarity-legendary:hover {
    box-shadow: 0 25px 50px -12px rgba(234, 179, 8, 0.25), 0 10px 15px -3px rgba(234, 179, 8, 0.15) !important;
}

.rarity-epic {
    box-shadow: 0 10px 15px -3px rgba(147, 51, 234, 0.15), 0 4px 6px -2px rgba(147, 51, 234, 0.1) !important;
}

.rarity-epic:hover {
    box-shadow: 0 25px 50px -12px rgba(147, 51, 234, 0.25), 0 10px 15px -3px rgba(147, 51, 234, 0.15) !important;
}

.rarity-rare {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.15), 0 4px 6px -2px rgba(59, 130, 246, 0.1) !important;
}

.rarity-rare:hover {
    box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 10px 15px -3px rgba(59, 130, 246, 0.15) !important;
}

/* Card styles */
.hero-card {
    @apply elev-card p-4 transition-all duration-200 border-2;
}

.hero-card:hover {
    @apply transform -translate-y-1 shadow-lg;
}

.hero-avatar {
    @apply w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mx-auto relative transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl;
}

.rarity-gem {
    @apply w-6 h-6 rounded-full flex items-center justify-center shadow-md;
}

.rarity-badge {
    @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm;
}

.tag-pill {
    @apply px-2.5 py-1 bg-gradient-to-r from-foreground/10 to-foreground/5 text-foreground/70 rounded-full text-xs font-medium border border-foreground/10 backdrop-blur-sm transition-all duration-200 hover:bg-foreground/15;
}

.tag-pill-more {
    @apply px-2.5 py-1 bg-gradient-to-r from-velaris-purple/20 to-velaris-teal/20 text-velaris-purple rounded-full text-xs font-bold border border-velaris-purple/30;
}

.hero-mini-card {
    @apply p-3 rounded-lg border-2 transition-all duration-200 hover:transform hover:-translate-y-1;
}

.team-slot {
    @apply min-h-[4rem] border-2 border-dashed border-border/50 rounded-lg transition-all duration-200;
}

.team-slot:hover {
    @apply border-velaris-purple/50 bg-velaris-purple/5;
}

.empty-slot {
    @apply h-full flex flex-col items-center justify-center text-center p-4;
}

.hero-in-team {
    @apply p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md;
}

/* Animation classes for smooth transitions */
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Scroll animations */
@keyframes slideInFromLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.hero-showcase-card {
    animation: slideInFromLeft 0.6s ease-out forwards;
}

.hero-showcase-card:nth-child(even) {
    animation-delay: 0.1s;
}

.hero-showcase-card:nth-child(3n) {
    animation-delay: 0.2s;
}

.hero-showcase-card:nth-child(4n) {
    animation-delay: 0.3s;
}

.hero-showcase-card:nth-child(5n) {
    animation-delay: 0.4s;
}
</style>