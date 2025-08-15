<template>
    <div class="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950 p-4 md:p-8">
        <div class="mx-auto max-w-7xl">
            <!-- Header -->
            <div class="mb-8 text-center">
                <h1
                    class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    MXN Daily Admin
                </h1>
                <p class="text-zinc-400">Manage daily challenges with style</p>
            </div>

            <!-- Top Controls Bar -->
            <Card class="mb-6 border-zinc-700 bg-zinc-900/80 backdrop-blur">
                <CardContent class="p-6">
                    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                        <div class="flex-1 space-y-2">
                            <Label htmlFor="game-select" class="text-xs uppercase tracking-wide text-zinc-300">
                                Select Game
                            </Label>
                            <Select v-model="selectedGame" @update:modelValue="onGameChange">
                                <SelectTrigger id="game-select"
                                    class="w-full bg-zinc-800 border-zinc-600 text-zinc-100 hover:bg-zinc-700">
                                    <SelectValue placeholder="Choose a game..." />
                                </SelectTrigger>
                                <SelectContent class="bg-zinc-800 border-zinc-600">
                                    <SelectItem v-for="game in games" :key="game.id" :value="game.id"
                                        class="text-zinc-100 hover:bg-zinc-700 focus:bg-zinc-700">
                                        <div class="flex items-center gap-2">
                                            <Gamepad2 class="w-4 h-4 text-violet-400" />
                                            <span>{{ game.name }}</span>
                                            <Badge class="ml-2 bg-zinc-700 text-zinc-200 border-zinc-600">
                                                {{ getGameTypeBadge(game) }}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                    <Separator class="my-2 bg-zinc-700" />
                                    <SelectItem value="__new__"
                                        class="text-violet-400 hover:bg-zinc-700 focus:bg-zinc-700">
                                        <div class="flex items-center gap-2">
                                            <Plus class="w-4 h-4" />
                                            <span>Add New Game</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <!-- Quick Actions -->
                        <div class="flex gap-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" @click="showBulkImport = true"
                                            class="border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                            <Upload class="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">Bulk Import
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" @click="exportData"
                                            class="border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                            <Download class="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">Export Data
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" @click="refreshData" :disabled="loading"
                                            class="border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                            <RefreshCw :class="['w-4 h-4', loading && 'animate-spin']" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">Refresh Data
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>

                    <!-- New Game Form -->
                    <div v-if="selectedGame === '__new__'"
                        class="mt-4 p-4 rounded-lg bg-zinc-800/80 border border-zinc-600">
                        <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
                            <div class="space-y-2">
                                <Label htmlFor="new-id" class="text-xs text-zinc-300">Game ID</Label>
                                <Input id="new-id" v-model="newGame.id" placeholder="word"
                                    class="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400" />
                            </div>
                            <div class="space-y-2">
                                <Label htmlFor="new-name" class="text-xs text-zinc-300">Name</Label>
                                <Input id="new-name" v-model="newGame.name" placeholder="Word Game"
                                    class="bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400" />
                            </div>
                            <div class="space-y-2">
                                <Label htmlFor="new-type" class="text-xs text-zinc-300">Type</Label>
                                <Select v-model="newGame.type">
                                    <SelectTrigger class="bg-zinc-700 border-zinc-600 text-zinc-100">
                                        <SelectValue placeholder="Game type..." />
                                    </SelectTrigger>
                                    <SelectContent class="bg-zinc-800 border-zinc-600">
                                        <SelectItem value="word" class="text-zinc-100">Word (Wordle)</SelectItem>
                                        <SelectItem value="connections" class="text-zinc-100">Connections</SelectItem>
                                        <SelectItem value="trivia" class="text-zinc-100">Trivia</SelectItem>
                                        <SelectItem value="sequence" class="text-zinc-100">Sequence</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div v-if="newGame.type === 'word'" class="space-y-2">
                                <Label htmlFor="new-chars" class="text-xs text-zinc-300">Characters</Label>
                                <Input id="new-chars" v-model.number="newGame.characters" type="number" min="1" max="10"
                                    class="bg-zinc-700 border-zinc-600 text-zinc-100" />
                            </div>
                            <div v-if="newGame.type === 'word'" class="space-y-2">
                                <Label htmlFor="new-attempts" class="text-xs text-zinc-300">Attempts</Label>
                                <Input id="new-attempts" v-model.number="newGame.attempts" type="number" min="1"
                                    max="10" class="bg-zinc-700 border-zinc-600 text-zinc-100" />
                            </div>
                            <div class="flex items-end">
                                <Button @click="createNewGame"
                                    class="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white">
                                    <Plus class="w-4 h-4 mr-2" />
                                    Create Game
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Main Content Grid -->
            <div v-if="selectedGame && selectedGame !== '__new__'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left Panel - Seed Form -->
                <div class="space-y-6">
                    <Card class="border-zinc-700 bg-zinc-900/80 backdrop-blur overflow-visible">
                        <div class="bg-gradient-to-r from-violet-600/20 to-pink-600/20 p-4 border-b border-zinc-700">
                            <h2 class="text-xl font-semibold text-zinc-100 flex items-center gap-2">
                                <CalendarPlus class="w-5 h-5" />
                                Seed New Day
                            </h2>
                        </div>
                        <CardContent class="p-6 space-y-4">
                            <!-- Date Picker -->
                            <div class="space-y-2">
                                <Label htmlFor="date" class="text-xs uppercase tracking-wide text-zinc-300">
                                    Date (AEST)
                                </Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" :class="[
                                            'w-full justify-start text-left font-normal bg-zinc-800 border-zinc-600 text-zinc-100 hover:bg-zinc-700',
                                            !date && 'text-zinc-400'
                                        ]">
                                            <CalendarIcon class="mr-2 h-4 w-4" />
                                            {{ date ? formatDateLong(date) : 'Pick a date' }}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent class="w-auto p-0 bg-zinc-800 border-zinc-600" align="start">
                                        <Calendar v-model="dateObj" @update:modelValue="handleDateSelect"
                                            class="bg-zinc-800 text-zinc-100" />
                                    </PopoverContent>
                                </Popover>
                                <p class="text-xs text-zinc-400">Today: {{ today }}</p>
                            </div>

                            <!-- Game-specific input forms -->
                            <!-- Word Game Form -->
                            <div v-if="currentGameConfig.type === 'word'" class="space-y-2">
                                <Label htmlFor="solution" class="text-xs uppercase tracking-wide text-zinc-300">
                                    Solution ({{ currentGameConfig.characters || 5 }} letters)
                                </Label>
                                <div class="flex gap-2">
                                    <Input id="solution" v-model="word" :maxlength="currentGameConfig.characters || 5"
                                        :placeholder="'X'.repeat(currentGameConfig.characters || 5)"
                                        class="flex-1 bg-zinc-800 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 uppercase tracking-widest font-mono text-lg hover:bg-zinc-700 focus:bg-zinc-700"
                                        @input="word = (word || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, currentGameConfig.characters || 5)" />

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button @click="getRandomWord" :disabled="loadingRandom"
                                                    variant="outline" size="icon"
                                                    class="border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                                    <Dices v-if="!loadingRandom" class="w-4 h-4" />
                                                    <Loader2 v-else class="w-4 h-4 animate-spin" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent class="bg-zinc-700 text-zinc-100 border-zinc-600">
                                                Random Unused Word
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <!-- Connections Game Form -->
                            <div v-if="currentGameConfig.type === 'connections'" class="space-y-3">
                                <Label class="text-xs uppercase tracking-wide text-zinc-300">
                                    Connections Groups (4 groups of 4 words)
                                </Label>

                                <div v-for="(group, idx) in connectionsGroups" :key="idx"
                                    class="p-3 rounded-lg bg-zinc-800/80 border border-zinc-700 space-y-2">
                                    <div class="flex gap-2">
                                        <Select v-model="group.difficulty" class="w-24">
                                            <SelectTrigger
                                                class="bg-zinc-700 border-zinc-600 text-zinc-100 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent class="bg-zinc-800 border-zinc-600">
                                                <SelectItem value="easy" class="text-zinc-100">Easy</SelectItem>
                                                <SelectItem value="medium" class="text-zinc-100">Medium</SelectItem>
                                                <SelectItem value="hard" class="text-zinc-100">Hard</SelectItem>
                                                <SelectItem value="expert" class="text-zinc-100">Expert</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div class="flex gap-2">
                                        <Input v-model="group.category" placeholder="Category name..."
                                            class="flex-1 h-8 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 text-xs" />
                                    </div>
                                    <div class="grid grid-cols-2 gap-1">
                                        <Input v-for="(_, wordIdx) in 4" :key="wordIdx" v-model="group.words[wordIdx]"
                                            :placeholder="`Word ${wordIdx + 1}`"
                                            class="h-7 bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 text-xs uppercase"
                                            @input="group.words[wordIdx] = (group.words[wordIdx] || '').toUpperCase()" />
                                    </div>
                                </div>

                                <Button @click="generateRandomConnections" variant="outline" size="sm"
                                    class="w-full border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                    <Dices class="w-3 h-3 mr-2" />
                                    Generate Random Puzzle
                                </Button>
                            </div>

                            <!-- Options -->
                            <div class="space-y-3">
                                <div class="flex items-center space-x-2">
                                    <Checkbox id="patch-root" v-model:checked="patchGameRoot"
                                        class="border-zinc-500 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600" />
                                    <Label htmlFor="patch-root"
                                        class="text-sm font-normal text-zinc-200 cursor-pointer">
                                        Ensure game root exists
                                    </Label>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <Checkbox id="overwrite" v-model:checked="overwriteIfExists"
                                        class="border-zinc-500 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600" />
                                    <Label htmlFor="overwrite" class="text-sm font-normal text-zinc-200 cursor-pointer">
                                        Overwrite if exists
                                    </Label>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <Button @click="submit" :disabled="submitting || !isValid"
                                class="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700 text-white disabled:opacity-50">
                                <Save v-if="!submitting" class="w-4 h-4 mr-2" />
                                <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                                {{ submitting ? 'Seeding...' : 'Create Day' }}
                            </Button>
                        </CardContent>
                    </Card>

                    <!-- Existing Days Management -->
                    <Card class="border-zinc-700 bg-zinc-900/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle class="text-lg flex items-center gap-2 text-zinc-100">
                                <History class="w-5 h-5" />
                                Recent Days
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                                <div v-for="day in recentDays" :key="day.date"
                                    class="flex items-center justify-between p-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 transition-colors border border-zinc-700">
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-zinc-100">{{ formatDate(day.date) }}</p>
                                        <p class="text-xs text-zinc-400 font-mono mt-1">
                                            {{ getDaySolutionDisplay(day) }}
                                        </p>
                                        <!-- Stats Display -->
                                        <div v-if="day.stats" class="flex gap-3 mt-2">
                                            <span class="text-xs text-emerald-400 font-medium">
                                                ✓ {{ day.stats.wins || 0 }}
                                            </span>
                                            <span class="text-xs text-rose-400 font-medium">
                                                ✗ {{ (day.stats.plays || 0) - (day.stats.wins || 0) }}
                                            </span>
                                            <span class="text-xs text-zinc-500">
                                                Total: {{ day.stats.plays || 0 }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex gap-1">
                                        <Button @click="editDay(day)" variant="ghost" size="sm"
                                            class="hover:bg-zinc-600 text-zinc-300">
                                            <Edit2 class="w-3 h-3" />
                                        </Button>
                                        <Button @click="deleteDay(day)" variant="ghost" size="sm"
                                            class="text-rose-400 hover:text-rose-300 hover:bg-zinc-600">
                                            <Trash2 class="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Right Panel - Calendar & Stats -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Stats Overview -->
                    <Card class="border-zinc-700 bg-zinc-900/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle class="text-lg flex items-center gap-2 text-zinc-100">
                                <TrendingUp class="w-5 h-5" />
                                Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="grid grid-cols-4 gap-4">
                                <div class="text-center p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                    <p class="text-2xl font-bold text-violet-400">{{ totalDaysSeeded }}</p>
                                    <p class="text-xs text-zinc-300 mt-1">Days Seeded</p>
                                </div>
                                <div class="text-center p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                    <p class="text-2xl font-bold text-pink-400">{{ upcomingDays.length }}</p>
                                    <p class="text-xs text-zinc-300 mt-1">Upcoming</p>
                                </div>
                                <div class="text-center p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                    <p class="text-2xl font-bold text-cyan-400">{{ getUsedCount() }}</p>
                                    <p class="text-xs text-zinc-300 mt-1">{{ currentGameConfig.type === 'connections' ?
                                        'Puzzles' : 'Words' }} Used</p>
                                </div>
                                <div class="text-center p-3 rounded-lg bg-zinc-800 border border-zinc-700">
                                    <p class="text-2xl font-bold text-emerald-400">
                                        {{ currentGameConfig.type === 'word' ? remainingWords : '∞' }}
                                    </p>
                                    <p class="text-xs text-zinc-300 mt-1">Available</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Upcoming Content -->
                    <Card class="border-zinc-700 bg-zinc-900/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle class="text-lg flex items-center justify-between text-zinc-100">
                                <div class="flex items-center gap-2">
                                    <Sparkles class="w-5 h-5" />
                                    Upcoming {{ currentGameConfig.type === 'connections' ? 'Puzzles' : 'Words' }}
                                </div>
                                <div class="relative">
                                    <Search
                                        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input v-model="searchTerm" placeholder="Search..."
                                        class="w-48 h-8 bg-zinc-800 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 pl-9"
                                        @input="filterDays" />
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea class="h-40">
                                <div class="flex flex-wrap gap-2">
                                    <div v-for="day in filteredUpcomingDays" :key="day.date" class="group relative">
                                        <div class="gradient-border rounded-full p-[1px]">
                                            <div
                                                class="bg-zinc-800 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-zinc-700 transition-colors">
                                                <span class="text-xs text-zinc-400">{{ formatDate(day.date) }}</span>
                                                <span class="font-mono font-bold text-violet-400 text-xs">
                                                    {{ getDaySolutionDisplay(day) }}
                                                </span>
                                                <Button @click="deleteDay(day)" variant="ghost" size="sm"
                                                    class="opacity-0 group-hover:opacity-100 -mr-2 p-1 h-auto hover:bg-zinc-600">
                                                    <X class="w-3 h-3 text-zinc-300" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="filteredUpcomingDays.length === 0" class="text-zinc-400 text-sm">
                                        No upcoming content scheduled
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <!-- Calendar -->
                    <Card class="border-zinc-700 bg-zinc-900/80 backdrop-blur">
                        <CardHeader>
                            <CardTitle class="text-lg flex items-center justify-between text-zinc-100">
                                <div class="flex items-center gap-2">
                                    <CalendarIconAlt class="w-5 h-5" />
                                    Calendar View
                                </div>
                                <div class="flex gap-2">
                                    <Button @click="previousMonth" variant="outline" size="icon"
                                        class="h-8 w-8 border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                        <ChevronLeft class="w-4 h-4" />
                                    </Button>
                                    <span class="px-3 py-1 text-sm text-zinc-100 font-medium flex items-center">
                                        {{ currentMonthYear }}
                                    </span>
                                    <Button @click="nextMonth" variant="outline" size="icon"
                                        class="h-8 w-8 border-zinc-600 bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
                                        <ChevronRight class="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="grid grid-cols-7 gap-2">
                                <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="day"
                                    class="text-center text-xs font-medium text-zinc-400 py-2">
                                    {{ day }}
                                </div>

                                <div v-for="(day, index) in calendarDays" :key="index" class="aspect-square">
                                    <div v-if="!day.empty" @click="selectCalendarDay(day)" :class="[
                                        'h-full rounded-lg p-2 cursor-pointer transition-all relative',
                                        day.hasSolution ? 'bg-gradient-to-br from-violet-900/30 to-pink-900/30 border border-violet-600/50' : 'bg-zinc-800/80 border border-zinc-700 hover:border-zinc-500',
                                        day.isToday && 'ring-2 ring-cyan-500',
                                        day.isSelected && 'ring-2 ring-yellow-500'
                                    ]">
                                        <div class="text-xs text-zinc-300 font-medium">{{ day.day }}</div>
                                        <div v-if="day.hasSolution"
                                            class="text-[10px] font-mono font-bold text-violet-300 mt-1 truncate">
                                            {{ day.solutionPreview }}
                                        </div>
                                        <!-- Stats for Past/Current Days -->
                                        <div v-if="day.stats && day.isPastOrToday"
                                            class="absolute bottom-1 right-1 left-1">
                                            <div class="flex justify-between text-[10px]">
                                                <span class="text-emerald-400 font-medium">✓{{ day.stats.wins || 0
                                                }}</span>
                                                <span class="text-rose-400 font-medium">✗{{ (day.stats.plays || 0) -
                                                    (day.stats.wins || 0) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <!-- Bulk Import Dialog -->
            <Dialog v-model:open="showBulkImport">
                <DialogContent class="sm:max-w-[600px] bg-zinc-800 border-zinc-600 text-zinc-100">
                    <DialogHeader>
                        <DialogTitle class="text-zinc-100">Bulk Import</DialogTitle>
                        <DialogDescription class="text-zinc-400">
                            {{ getBulkImportDescription() }}
                        </DialogDescription>
                    </DialogHeader>
                    <div class="grid gap-4 py-4">
                        <div class="space-y-2">
                            <Label htmlFor="start-date" class="text-zinc-200">Start Date</Label>
                            <Input id="start-date" v-model="bulkImportStartDate" type="date"
                                class="bg-zinc-700 border-zinc-600 text-zinc-100" />
                        </div>
                        <div class="space-y-2">
                            <Label htmlFor="bulk-content" class="text-zinc-200">
                                {{ currentGameConfig.type === 'connections' ? 'Puzzles (JSON format)' : 'Words (one per line)' }}
                            </Label>
                            <Textarea id="bulk-content" v-model="bulkImportContent"
                                :placeholder="getBulkImportPlaceholder()"
                                class="min-h-[300px] bg-zinc-700 border-zinc-600 text-zinc-100 placeholder:text-zinc-400 font-mono text-xs"
                                @input="handleBulkImportInput" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" @click="showBulkImport = false"
                            class="border-zinc-600 bg-zinc-700 hover:bg-zinc-600 text-zinc-200">
                            Cancel
                        </Button>
                        <Button @click="performBulkImport" class="bg-violet-600 hover:bg-violet-700 text-white">
                            Import {{ getBulkImportCount() }} {{ currentGameConfig.type === 'connections' ? 'Puzzles' :
                            'Words' }}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { firestore } from '@/firebase'
import wordList from 'word-list-json'
import {
    CalendarPlus, CalendarIcon, Calendar as CalendarIconAlt, Gamepad2, Plus, Upload, Download,
    RefreshCw, Save, Loader2, Dices, History, Edit2, Trash2, TrendingUp,
    Sparkles, Search, X, ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import {
    Button,
    Input,
    Label,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
    Card, CardContent, CardHeader, CardTitle,
    Badge,
    Checkbox,
    Separator,
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
    Popover, PopoverContent, PopoverTrigger,
    Calendar,
    ScrollArea,
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    Textarea
} from '@/components/ui'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

// AEST helpers
const AEST_TZ = 'Australia/Brisbane'
function fmtAEST(d) {
    const y = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, year: 'numeric' }).format(d)
    const m = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, month: '2-digit' }).format(d)
    const day = new Intl.DateTimeFormat('en-CA', { timeZone: AEST_TZ, day: '2-digit' }).format(d)
    return `${y}-${m}-${day}`
}

// State
const today = ref(fmtAEST(new Date()))
const selectedGame = ref('')
const games = ref([])
const date = ref(today.value)
const selectedDate = ref(null)
const word = ref('')
const patchGameRoot = ref(true)
const overwriteIfExists = ref(false)
const submitting = ref(false)
const gameDays = ref([])
const upcomingDays = ref([])
const recentDays = ref([])
const currentMonth = ref(new Date())
const usedWords = ref(new Set())
const loadingRandom = ref(false)
const loading = ref(false)
const searchTerm = ref('')
const filteredUpcomingDays = ref([])
const showBulkImport = ref(false)
const bulkImportContent = ref('')
const bulkImportStartDate = ref(today.value)

// Connections specific state
const connectionsGroups = ref([
    { difficulty: 'easy', category: '', words: ['', '', '', ''] },
    { difficulty: 'medium', category: '', words: ['', '', '', ''] },
    { difficulty: 'hard', category: '', words: ['', '', '', ''] },
    { difficulty: 'expert', category: '', words: ['', '', '', ''] }
])

// New game state
const newGame = ref({
    id: '',
    name: '',
    type: 'word',
    characters: 5,
    attempts: 6
})

// Sample connections data for random generation
const sampleConnectionsData = [
    {
        groups: [
            { category: "PIZZA TOPPINGS", words: ["PEPPERONI", "MUSHROOM", "OLIVES", "SAUSAGE"], difficulty: "easy" },
            { category: "SOCIAL MEDIA", words: ["FACEBOOK", "TWITTER", "INSTAGRAM", "LINKEDIN"], difficulty: "medium" },
            { category: "CARD GAMES", words: ["POKER", "BRIDGE", "HEARTS", "SPADES"], difficulty: "hard" },
            { category: "THINGS WITH RINGS", words: ["SATURN", "TREE", "CIRCUS", "WEDDING"], difficulty: "expert" }
        ]
    },
    {
        groups: [
            { category: "BREAKFAST FOODS", words: ["EGGS", "BACON", "TOAST", "CEREAL"], difficulty: "easy" },
            { category: "PROGRAMMING LANGUAGES", words: ["PYTHON", "JAVA", "SWIFT", "RUBY"], difficulty: "medium" },
            { category: "MUSICAL INSTRUMENTS", words: ["PIANO", "GUITAR", "DRUMS", "VIOLIN"], difficulty: "hard" },
            { category: "WORDS ENDING IN -IGHT", words: ["BRIGHT", "FLIGHT", "SIGHT", "NIGHT"], difficulty: "expert" }
        ]
    }
]

// Computed
const currentGameConfig = computed(() => {
    const game = games.value.find(g => g.id === selectedGame.value)
    return game || { type: 'word', characters: 5, attempts: 6 }
})

const isValid = computed(() => {
    if (currentGameConfig.value.type === 'word') {
        const len = currentGameConfig.value.characters || 5
        return new RegExp(`^[A-Z]{${len}}$`).test(word.value)
    } else if (currentGameConfig.value.type === 'connections') {
        // Validate connections groups
        return connectionsGroups.value.every(group =>
            group.category &&
            group.difficulty &&
            group.words.every(w => w && w.length > 0)
        )
    }
    return false
})

const currentMonthYear = computed(() => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric'
    }).format(currentMonth.value)
})

const dateObj = computed({
    get() {
        return date.value ? new Date(date.value + 'T00:00:00') : undefined
    },
    set(d) {
        if (d instanceof Date && !isNaN(d)) {
            date.value = fmtAEST(d)
        }
    }
})

const totalDaysSeeded = computed(() => gameDays.value.length)

const remainingWords = computed(() => {
    if (selectedGame.value !== 'word' || currentGameConfig.value.type !== 'word') return 0
    const fiveLetterWords = wordList.filter(w => w.length === (currentGameConfig.value.characters || 5))
    return fiveLetterWords.length - usedWords.value.size
})

const calendarDays = computed(() => {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()

    const days = []
    const todayDateObj = new Date(today.value)

    // Add empty cells for padding
    for (let i = 0; i < startPadding; i++) {
        days.push({ empty: true })
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const dayData = gameDays.value.find(d => d.date === dateStr)
        const isToday = dateStr === today.value
        const isSelected = dateStr === selectedDate.value
        const isPastOrToday = new Date(dateStr) <= todayDateObj

        days.push({
            day,
            date: dateStr,
            hasSolution: !!dayData,
            solutionPreview: getDaySolutionDisplay(dayData),
            stats: dayData?.stats,
            isToday,
            isSelected,
            isPastOrToday
        })
    }

    return days
})

// Helper functions
function getGameTypeBadge(game) {
    if (game.type === 'connections') return 'Connections'
    if (game.type === 'trivia') return 'Trivia'
    if (game.type === 'sequence') return 'Sequence'
    return `${game.characters || 5} chars`
}

function getDaySolutionDisplay(day) {
    if (!day) return ''

    if (day.solution && typeof day.solution === 'string') {
        return day.solution
    } else if (day.solution && day.solution.groups) {
        // Connections type
        const categories = day.solution.groups.map(g => g.category).slice(0, 2)
        return categories.join(', ') + '...'
    }
    return 'Complex'
}

function getUsedCount() {
    if (currentGameConfig.value.type === 'connections') {
        return gameDays.value.length
    }
    return usedWords.value.size
}

function getBulkImportDescription() {
    if (currentGameConfig.value.type === 'connections') {
        return 'Import multiple Connections puzzles at once. Use JSON format with an array of puzzle objects.'
    }
    return 'Import multiple words at once. Enter one word per line.'
}

function getBulkImportPlaceholder() {
    if (currentGameConfig.value.type === 'connections') {
        return `[
  {
    "groups": [
      {"category": "COLORS", "words": ["RED", "BLUE", "GREEN", "YELLOW"], "difficulty": "easy"},
      {"category": "PLANETS", "words": ["MARS", "VENUS", "JUPITER", "MERCURY"], "difficulty": "medium"},
      ...
    ]
  }
]`
    }
    return 'HOUSE\nPLANT\nWATER\n...'
}

function getBulkImportCount() {
    if (currentGameConfig.value.type === 'connections') {
        try {
            const parsed = JSON.parse(bulkImportContent.value)
            return Array.isArray(parsed) ? parsed.length : 0
        } catch {
            return 0
        }
    }
    return bulkImportContent.value.split('\n').filter(w => w.trim().length === (currentGameConfig.value.characters || 5)).length
}

function handleBulkImportInput() {
    if (currentGameConfig.value.type === 'word') {
        bulkImportContent.value = bulkImportContent.value.toUpperCase()
    }
}

function handleDateSelect(newDate) {
    dateObj.value = newDate
}

function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    }).format(date)
}

function formatDateLong(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date)
}

// Zero stats helpers
function zeroGameStats() {
    return {
        totalPlays: 0,
        totalWins: 0,
        totalPlayers: 0,
        attemptsHistogram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 }
    }
}

function zeroDayStats() {
    return {
        plays: 0,
        wins: 0,
        players: 0,
        attemptsHistogram: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, 'fail': 0 }
    }
}

// Generate random connections puzzle
function generateRandomConnections() {
    const randomPuzzle = sampleConnectionsData[Math.floor(Math.random() * sampleConnectionsData.length)]
    connectionsGroups.value = randomPuzzle.groups.map(g => ({
        difficulty: g.difficulty,
        category: g.category,
        words: [...g.words]
    }))
}

// Load games
async function loadGames() {
    try {
        const gamesSnap = await getDocs(collection(firestore, 'dailyChallenges'))
        games.value = gamesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error('Error loading games:', error)
        toast({
            title: 'Error',
            description: 'Failed to load games',
            variant: 'destructive'
        })
    }
}

// Load game days
async function loadGameDays() {
    if (!selectedGame.value || selectedGame.value === '__new__') return

    try {
        loading.value = true
        const daysRef = collection(firestore, 'dailyChallenges', selectedGame.value, 'games')
        const q = query(daysRef, orderBy('date', 'desc'), limit(365))
        const snapshot = await getDocs(q)

        gameDays.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))

        // Update used words set for word games
        if (currentGameConfig.value.type === 'word') {
            usedWords.value = new Set(gameDays.value.map(d => d.solution).filter(s => typeof s === 'string'))
        }

        // Get upcoming days
        const todayDate = new Date(today.value)
        upcomingDays.value = gameDays.value
            .filter(d => new Date(d.date) > todayDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date))

        filteredUpcomingDays.value = upcomingDays.value

        // Get recent days
        recentDays.value = gameDays.value
            .filter(d => new Date(d.date) <= todayDate)
            .slice(0, 10)
    } catch (error) {
        console.error('Error loading game days:', error)
        toast({
            title: 'Error',
            description: 'Failed to load game days',
            variant: 'destructive'
        })
    } finally {
        loading.value = false
    }
}

// Get random unused word
async function getRandomWord() {
    loadingRandom.value = true
    try {
        const charCount = currentGameConfig.value.characters || 5
        const filteredWords = wordList.filter(w => w.length === charCount)
        const availableWords = filteredWords.filter(w => !usedWords.value.has(w.toUpperCase()))

        if (availableWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWords.length)
            word.value = availableWords[randomIndex].toUpperCase()
        } else {
            toast({
                title: 'No Words Available',
                description: `No unused ${charCount}-letter words available!`,
                variant: 'destructive'
            })
        }
    } catch (error) {
        console.error('Error getting random word:', error)
        toast({
            title: 'Error',
            description: 'Failed to get random word',
            variant: 'destructive'
        })
    } finally {
        loadingRandom.value = false
    }
}

// Create new game
async function createNewGame() {
    if (!newGame.value.id || !newGame.value.name) {
        toast({
            title: 'Validation Error',
            description: 'Please fill in all fields for the new game',
            variant: 'destructive'
        })
        return
    }

    try {
        const gameRef = doc(firestore, 'dailyChallenges', newGame.value.id)
        await setDoc(gameRef, {
            gameId: newGame.value.id,
            name: newGame.value.name,
            type: newGame.value.type || 'word',
            description: `${newGame.value.name} daily challenge`,
            characters: newGame.value.type === 'word' ? (newGame.value.characters || 5) : 0,
            attempts: newGame.value.type === 'word' ? (newGame.value.attempts || 6) : 0,
            stats: zeroGameStats(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        await loadGames()
        selectedGame.value = newGame.value.id

        // Reset new game form
        newGame.value = { id: '', name: '', type: 'word', characters: 5, attempts: 6 }

        toast({
            title: 'Success',
            description: 'Game created successfully!'
        })
    } catch (error) {
        console.error('Error creating game:', error)
        toast({
            title: 'Error',
            description: 'Failed to create game',
            variant: 'destructive'
        })
    }
}

// Game change handler
async function onGameChange() {
    if (selectedGame.value && selectedGame.value !== '__new__') {
        await loadGameDays()
    }
}

// Calendar navigation
function previousMonth() {
    const newMonth = new Date(currentMonth.value)
    newMonth.setMonth(newMonth.getMonth() - 1)
    currentMonth.value = newMonth
}

function nextMonth() {
    const newMonth = new Date(currentMonth.value)
    newMonth.setMonth(newMonth.getMonth() + 1)
    currentMonth.value = newMonth
}

// Select calendar day
function selectCalendarDay(day) {
    if (!day.empty) {
        date.value = day.date
        selectedDate.value = day.date

        // Load existing data if available
        const existingDay = gameDays.value.find(d => d.date === day.date)
        if (existingDay) {
            editDay(existingDay)
        }
    }
}

// Edit day
function editDay(day) {
    date.value = day.date
    selectedDate.value = day.date
    overwriteIfExists.value = true

    if (currentGameConfig.value.type === 'word') {
        word.value = day.solution
    } else if (currentGameConfig.value.type === 'connections' && day.solution?.groups) {
        connectionsGroups.value = day.solution.groups.map(g => ({
            difficulty: g.difficulty,
            category: g.category,
            words: [...g.words]
        }))
    }
}

// Delete day
async function deleteDay(day) {
    if (!confirm(`Delete puzzle for ${formatDate(day.date)}?`)) return

    try {
        const dayRef = doc(firestore, 'dailyChallenges', selectedGame.value, 'games', day.date)
        await deleteDoc(dayRef)
        await loadGameDays()

        toast({
            title: 'Success',
            description: 'Day deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting day:', error)
        toast({
            title: 'Error',
            description: 'Failed to delete day',
            variant: 'destructive'
        })
    }
}

// Filter days
function filterDays() {
    if (!searchTerm.value) {
        filteredUpcomingDays.value = upcomingDays.value
    } else {
        const term = searchTerm.value.toUpperCase()
        filteredUpcomingDays.value = upcomingDays.value.filter(d => {
            const solutionStr = getDaySolutionDisplay(d).toUpperCase()
            return solutionStr.includes(term) || d.date.includes(term)
        })
    }
}

// Refresh data
async function refreshData() {
    await loadGames()
    if (selectedGame.value && selectedGame.value !== '__new__') {
        await loadGameDays()
    }
}

// Export data
function exportData() {
    const data = {
        game: selectedGame.value,
        gameType: currentGameConfig.value.type,
        days: gameDays.value,
        exported: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedGame.value}-export-${today.value}.json`
    a.click()

    toast({
        title: 'Success',
        description: 'Data exported successfully'
    })
}

// Bulk import
async function performBulkImport() {
    if (currentGameConfig.value.type === 'connections') {
        // Import connections puzzles
        try {
            const puzzles = JSON.parse(bulkImportContent.value)
            if (!Array.isArray(puzzles)) {
                throw new Error('Invalid format: expected an array of puzzles')
            }

            const startDate = new Date(bulkImportStartDate.value)

            for (let i = 0; i < puzzles.length; i++) {
                const dateToSeed = new Date(startDate)
                dateToSeed.setDate(dateToSeed.getDate() + i)
                const dateStr = fmtAEST(dateToSeed)

                const dayRef = doc(firestore, 'dailyChallenges', selectedGame.value, 'games', dateStr)
                await setDoc(dayRef, {
                    date: dateStr,
                    solution: puzzles[i],
                    stats: zeroDayStats(),
                    updatedAt: serverTimestamp()
                }, { merge: true })
            }

            await loadGameDays()
            showBulkImport.value = false
            bulkImportContent.value = ''

            toast({
                title: 'Success',
                description: `Imported ${puzzles.length} puzzles successfully`
            })
        } catch (error) {
            console.error('Error bulk importing:', error)
            toast({
                title: 'Error',
                description: 'Failed to import puzzles. Check JSON format.',
                variant: 'destructive'
            })
        }
    } else {
        // Import words (existing logic)
        const words = bulkImportContent.value
            .split('\n')
            .map(w => w.trim().toUpperCase())
            .filter(w => w.length === (currentGameConfig.value.characters || 5))

        if (words.length === 0) {
            toast({
                title: 'Validation Error',
                description: 'No valid words to import',
                variant: 'destructive'
            })
            return
        }

        try {
            const startDate = new Date(bulkImportStartDate.value)

            for (let i = 0; i < words.length; i++) {
                const dateToSeed = new Date(startDate)
                dateToSeed.setDate(dateToSeed.getDate() + i)
                const dateStr = fmtAEST(dateToSeed)

                const dayRef = doc(firestore, 'dailyChallenges', selectedGame.value, 'games', dateStr)
                await setDoc(dayRef, {
                    date: dateStr,
                    solution: words[i],
                    stats: zeroDayStats(),
                    updatedAt: serverTimestamp()
                }, { merge: true })
            }

            await loadGameDays()
            showBulkImport.value = false
            bulkImportContent.value = ''

            toast({
                title: 'Success',
                description: `Imported ${words.length} words successfully`
            })
        } catch (error) {
            console.error('Error bulk importing:', error)
            toast({
                title: 'Error',
                description: 'Failed to import words',
                variant: 'destructive'
            })
        }
    }
}

// Submit form
async function submit() {
    if (!isValid.value) {
        toast({
            title: 'Validation Error',
            description: currentGameConfig.value.type === 'connections'
                ? 'Please fill in all groups with categories and 4 words each.'
                : `Word must be exactly ${currentGameConfig.value.characters} letters.`,
            variant: 'destructive'
        })
        return
    }

    submitting.value = true
    try {
        const gameId = selectedGame.value

        // 1) Create/patch game root (optional)
        if (patchGameRoot.value) {
            const gameRef = doc(firestore, 'dailyChallenges', gameId)
            const snap = await getDoc(gameRef)

            if (!snap.exists()) {
                await setDoc(gameRef, {
                    gameId,
                    name: currentGameConfig.value.name || gameId,
                    type: currentGameConfig.value.type || 'word',
                    description: `${currentGameConfig.value.name || gameId} daily challenge`,
                    characters: currentGameConfig.value.type === 'word' ? (currentGameConfig.value.characters || 5) : undefined,
                    attempts: currentGameConfig.value.type === 'word' ? (currentGameConfig.value.attempts || 6) : undefined,
                    stats: zeroGameStats(),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                })
            } else {
                await setDoc(gameRef, {
                    gameId,
                    type: currentGameConfig.value.type || snap.data().type || 'word',
                    stats: Object.assign(zeroGameStats(), snap.data().stats || {}),
                    updatedAt: serverTimestamp()
                }, { merge: true })
            }
        }

        // 2) Create (or overwrite) day doc
        const dayRef = doc(firestore, 'dailyChallenges', gameId, 'games', date.value)
        const daySnap = await getDoc(dayRef)

        if (daySnap.exists() && !overwriteIfExists.value) {
            toast({
                title: 'Day Exists',
                description: `Day already exists for ${date.value}. Check "Overwrite" to replace.`,
                variant: 'destructive'
            })
            submitting.value = false
            return
        }

        // Prepare solution based on game type
        let solution
        if (currentGameConfig.value.type === 'connections') {
            solution = {
                groups: connectionsGroups.value.map(g => ({
                    category: g.category,
                    words: g.words,
                    difficulty: g.difficulty
                }))
            }
        } else {
            solution = word.value.toUpperCase()
        }

        await setDoc(dayRef, {
            date: date.value,
            solution,
            stats: zeroDayStats(),
            updatedAt: serverTimestamp()
        }, { merge: true })

        toast({
            title: 'Success',
            description: `Seeded ${gameId} for ${date.value}`
        })

        // Update selected date
        selectedDate.value = date.value

        // Clear form
        if (currentGameConfig.value.type === 'word') {
            word.value = ''
        } else if (currentGameConfig.value.type === 'connections') {
            connectionsGroups.value = [
                { difficulty: 'easy', category: '', words: ['', '', '', ''] },
                { difficulty: 'medium', category: '', words: ['', '', '', ''] },
                { difficulty: 'hard', category: '', words: ['', '', '', ''] },
                { difficulty: 'expert', category: '', words: ['', '', '', ''] }
            ]
        }

        // Reload game days
        await loadGameDays()
    } catch (e) {
        console.error(e)
        toast({
            title: 'Error',
            description: 'Failed to seed. Check console & rules.',
            variant: 'destructive'
        })
    } finally {
        submitting.value = false
    }
}

// Load on mount
onMounted(async () => {
    today.value = fmtAEST(new Date())
    if (!date.value) date.value = today.value
    await loadGames()
})

// Watch for game selection changes
watch(selectedGame, () => {
    if (selectedGame.value && selectedGame.value !== '__new__') {
        loadGameDays()
    }
})

// Watch for date changes
watch(date, (newDate) => {
    selectedDate.value = newDate
})
</script>

<style scoped>
.gradient-border {
    background: linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(39, 39, 42, 0.5);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(139, 92, 246, 0.5);
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(139, 92, 246, 0.7);
}
</style>