<!-- GuildVsGuild.vue -->
<template>
    <div>
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-semibold text-velaris-purple">Guild vs Guild</h1>
            <p class="text-sm text-foreground/70 mt-1">Manage GvG battles, strategies, and track performance</p>
        </div>

        <!-- Battle Status -->
        <div
            class="mb-6 p-4 rounded-xl bg-gradient-to-r from-velaris-purple/10 to-velaris-teal/10 border border-velaris-purple/20">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-semibold text-velaris-purple">Current Battle: Velaris vs Shadow Legion
                    </h3>
                    <p class="text-sm text-foreground/70 mt-1">Phase 2 of 3 • Ends in 4h 23m</p>
                </div>
                <div class="text-right">
                    <div class="text-2xl font-bold text-velaris-green">2,847</div>
                    <div class="text-xs text-foreground/60">Current Score</div>
                </div>
            </div>
        </div>

        <!-- Quick Stats -->
        <div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="stat-card">
                <div class="flex items-center gap-3">
                    <div
                        class="h-10 w-10 rounded-lg bg-gradient-to-br from-velaris-green to-velaris-teal flex items-center justify-center">
                        <Trophy class="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div class="text-sm text-foreground/70">Win Rate</div>
                        <div class="text-xl font-semibold text-velaris-green">73%</div>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="flex items-center gap-3">
                    <div
                        class="h-10 w-10 rounded-lg bg-gradient-to-br from-velaris-purple to-velaris-teal flex items-center justify-center">
                        <Users class="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div class="text-sm text-foreground/70">Active Warriors</div>
                        <div class="text-xl font-semibold">94/100</div>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="flex items-center gap-3">
                    <div
                        class="h-10 w-10 rounded-lg bg-gradient-to-br from-velaris-teal to-velaris-green flex items-center justify-center">
                        <Zap class="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div class="text-sm text-foreground/70">Avg Attack</div>
                        <div class="text-xl font-semibold">1.2M</div>
                    </div>
                </div>
            </div>
            <div class="stat-card">
                <div class="flex items-center gap-3">
                    <div
                        class="h-10 w-10 rounded-lg bg-gradient-to-br from-velaris-amber to-velaris-purple flex items-center justify-center">
                        <Shield class="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div class="text-sm text-foreground/70">Defense Score</div>
                        <div class="text-xl font-semibold">847K</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Battle Overview -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Current Matchups -->
                <div class="elev-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-velaris-purple">Active Battles</h3>
                        <button class="btn-soft-violet">
                            <RefreshCw class="h-4 w-4" />
                            Refresh
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div v-for="battle in activeBattles" :key="battle.id" class="battle-item">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="text-center">
                                        <div class="text-sm font-medium">{{ battle.ourPlayer }}</div>
                                        <div class="text-xs text-velaris-green">{{ battle.ourPower }}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="h-8 w-8 rounded bg-velaris-green/20 flex items-center justify-center">
                                            <Sword class="h-4 w-4 text-velaris-green" />
                                        </div>
                                        <span class="text-foreground/50">VS</span>
                                        <div
                                            class="h-8 w-8 rounded bg-velaris-amber/20 flex items-center justify-center">
                                            <Shield class="h-4 w-4 text-velaris-amber" />
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-sm font-medium">{{ battle.enemyPlayer }}</div>
                                        <div class="text-xs text-foreground/60">{{ battle.enemyPower }}</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium"
                                        :class="battle.status === 'winning' ? 'bg-velaris-green/15 text-velaris-green' :
                                            battle.status === 'losing' ? 'bg-velaris-amber/15 text-velaris-amber' :
                                                'bg-velaris-teal/15 text-velaris-teal'">
                                        {{ battle.status }}
                                    </span>
                                    <button class="p-1 hover:bg-foreground/5 rounded">
                                        <Eye class="h-4 w-4 text-foreground/50" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Battle History -->
                <div class="elev-card">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-semibold text-velaris-purple">Recent Results</h3>
                        <button class="btn-soft-violet">
                            <BarChart3 class="h-4 w-4" />
                            View Stats
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div v-for="result in battleResults" :key="result.id"
                            class="flex items-center justify-between py-2">
                            <div class="flex items-center gap-3">
                                <div class="h-2 w-2 rounded-full"
                                    :class="result.result === 'victory' ? 'bg-velaris-green' : 'bg-velaris-amber'">
                                </div>
                                <span class="text-sm">{{ result.description }}</span>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-xs text-foreground/60">{{ result.time }}</span>
                                <span class="text-sm font-medium"
                                    :class="result.result === 'victory' ? 'text-velaris-green' : 'text-velaris-amber'">
                                    {{ result.result === 'victory' ? '+' : '' }}{{ result.points }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- War Strategy -->
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">War Strategy</h3>
                    <div class="space-y-3">
                        <button class="strategy-btn">
                            <Target class="h-4 w-4 text-velaris-green" />
                            <div class="text-left">
                                <div class="text-sm font-medium">Focus Fire</div>
                                <div class="text-xs text-foreground/60">Target weakest enemies</div>
                            </div>
                        </button>
                        <button class="strategy-btn">
                            <Shield class="h-4 w-4 text-velaris-teal" />
                            <div class="text-left">
                                <div class="text-sm font-medium">Defensive Wall</div>
                                <div class="text-xs text-foreground/60">Protect key players</div>
                            </div>
                        </button>
                        <button class="strategy-btn">
                            <Zap class="h-4 w-4 text-velaris-purple" />
                            <div class="text-left">
                                <div class="text-sm font-medium">Blitz Attack</div>
                                <div class="text-xs text-foreground/60">All-out offense</div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Top Performers -->
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Top Warriors</h3>
                    <div class="space-y-3">
                        <div v-for="(warrior, index) in topWarriors" :key="warrior.id" class="flex items-center gap-3">
                            <div class="flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium"
                                :class="index === 0 ? 'bg-velaris-amber/20 text-velaris-amber' :
                                    index === 1 ? 'bg-velaris-teal/20 text-velaris-teal' :
                                        'bg-velaris-purple/20 text-velaris-purple'">
                                {{ index + 1 }}
                            </div>
                            <div class="flex-1">
                                <div class="text-sm font-medium">{{ warrior.name }}</div>
                                <div class="text-xs text-foreground/60">{{ warrior.points }} points</div>
                            </div>
                            <div class="text-xs text-velaris-green">{{ warrior.battles }}W</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="elev-card">
                    <h3 class="font-semibold text-velaris-purple mb-4">Quick Actions</h3>
                    <div class="space-y-2">
                        <button class="w-full btn-solid-purple">
                            <Users class="h-4 w-4" />
                            Rally Troops
                        </button>
                        <button class="w-full btn-soft-violet">
                            <MessageSquare class="h-4 w-4" />
                            War Council
                        </button>
                        <button class="w-full btn-soft-violet">
                            <FileText class="h-4 w-4" />
                            Battle Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import {
    Trophy, Users, Zap, Shield, RefreshCw, Sword, Eye, BarChart3, Target,
    MessageSquare, FileText, Plus
} from 'lucide-vue-next'

const activeBattles = ref([
    {
        id: 1,
        ourPlayer: 'Froggy',
        ourPower: '4.2M',
        enemyPlayer: 'DarkLord',
        enemyPower: '3.8M',
        status: 'winning'
    },
    {
        id: 2,
        ourPlayer: 'Velvet',
        ourPower: '3.9M',
        enemyPlayer: 'ShadowKing',
        enemyPower: '4.1M',
        status: 'losing'
    },
    {
        id: 3,
        ourPlayer: 'DragonHeart',
        ourPower: '4.5M',
        enemyPlayer: 'VoidMaster',
        enemyPower: '4.3M',
        status: 'close'
    }
])

const battleResults = ref([
    {
        id: 1,
        description: 'Froggy defeated DarkLord',
        result: 'victory',
        points: 150,
        time: '5m ago'
    },
    {
        id: 2,
        description: 'Lost to ShadowKing offensive',
        result: 'defeat',
        points: -75,
        time: '12m ago'
    },
    {
        id: 3,
        description: 'Velvet secured key fortress',
        result: 'victory',
        points: 200,
        time: '18m ago'
    },
    {
        id: 4,
        description: 'Defense successful at North Gate',
        result: 'victory',
        points: 100,
        time: '25m ago'
    }
])

const topWarriors = ref([
    { id: 1, name: 'Froggy', points: 1250, battles: 8 },
    { id: 2, name: 'DragonHeart', points: 980, battles: 6 },
    { id: 3, name: 'Velvet', points: 875, battles: 7 },
    { id: 4, name: 'ShadowBlade', points: 720, battles: 5 }
])
</script>