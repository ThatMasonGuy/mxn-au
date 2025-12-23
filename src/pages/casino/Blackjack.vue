<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-2 sm:p-4 relative overflow-hidden">
        <!-- Animated background elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
        </div>

        <div class="max-w-[1920px] mx-auto relative z-10">
            <!-- Header with Balance and Stats -->
            <div class="mb-4 sm:mb-6">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <!-- Balance Card -->
                    <div class="glass-card flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl">
                        <div class="relative">
                            <div class="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50"></div>
                            <div class="relative bg-gradient-to-br from-yellow-400 to-yellow-600 text-black p-3 sm:p-4 rounded-2xl shadow-2xl">
                                <Coins class="w-6 h-6 sm:w-8 sm:h-8" />
                            </div>
                        </div>
                        <div>
                            <p class="text-slate-400 text-xs sm:text-sm font-medium uppercase tracking-wide">Your Balance</p>
                            <p class="text-white text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                ${{ balance.toLocaleString() }}
                            </p>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div class="flex gap-2 sm:gap-3">
                        <div class="glass-card p-3 text-center min-w-[70px] hover:scale-105 transition-transform">
                            <p class="text-green-400 text-lg sm:text-2xl font-bold drop-shadow-glow-green">{{ activeStatistics.wins }}</p>
                            <p class="text-slate-400 text-xs uppercase tracking-wider">Wins</p>
                        </div>
                        <div class="glass-card p-3 text-center min-w-[70px] hover:scale-105 transition-transform">
                            <p class="text-red-400 text-lg sm:text-2xl font-bold drop-shadow-glow-red">{{ activeStatistics.losses }}</p>
                            <p class="text-slate-400 text-xs uppercase tracking-wider">Losses</p>
                        </div>
                        <div class="glass-card p-3 text-center min-w-[70px] hover:scale-105 transition-transform">
                            <p class="text-yellow-400 text-lg sm:text-2xl font-bold drop-shadow-glow-yellow">{{ activeStatistics.pushes }}</p>
                            <p class="text-slate-400 text-xs uppercase tracking-wider">Pushes</p>
                        </div>
                        <div class="glass-card p-3 text-center min-w-[70px] hover:scale-105 transition-transform">
                            <p class="text-blue-400 text-lg sm:text-2xl font-bold drop-shadow-glow-blue">{{ winRate }}%</p>
                            <p class="text-slate-400 text-xs uppercase tracking-wider">Win Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Layout: 3 Columns -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <!-- Left Sidebar: Recent Games & Statistics -->
                <div class="lg:col-span-3 space-y-4">
                    <!-- Statistics Card -->
                    <Card class="glass-card border-slate-600/50">
                        <CardContent class="pt-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
                                    <TrendingUp class="w-5 h-5" />
                                    Performance
                                </h3>
                            </div>

                            <!-- Mode Toggle -->
                            <div class="flex gap-2 mb-4">
                                <button @click="statsDisplayMode = 'standard'" :class="[
                                    'flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all',
                                    statsDisplayMode === 'standard'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                ]">
                                    Standard (3:2)
                                </button>
                                <button @click="statsDisplayMode = 'challenge'" :class="[
                                    'flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all',
                                    statsDisplayMode === 'challenge'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                ]">
                                    Challenge (6:5)
                                </button>
                            </div>

                            <!-- Optimal Play Accuracy Badge -->
                            <div v-if="optimalPlayStatistics.totalDecisions > 0" class="mb-4 p-3 bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-2 border-purple-500 rounded-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-purple-300 text-xs font-semibold">STRATEGY ACCURACY</span>
                                    <Badge :class="[
                                        'font-bold',
                                        (optimalPlayStatistics.optimalDecisions / optimalPlayStatistics.totalDecisions * 100) >= 90 ? 'bg-green-600' :
                                        (optimalPlayStatistics.optimalDecisions / optimalPlayStatistics.totalDecisions * 100) >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                                    ]">
                                        {{ Math.round(optimalPlayStatistics.optimalDecisions / optimalPlayStatistics.totalDecisions * 100) }}%
                                    </Badge>
                                </div>
                                <div class="w-full bg-slate-700 rounded-full h-2">
                                    <div class="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                        :style="{ width: (optimalPlayStatistics.optimalDecisions / optimalPlayStatistics.totalDecisions * 100) + '%' }"></div>
                                </div>
                                <p class="text-purple-200 text-xs mt-1">
                                    {{ optimalPlayStatistics.optimalDecisions }} / {{ optimalPlayStatistics.totalDecisions }} optimal decisions
                                </p>
                            </div>

                            <!-- Performance Comparison -->
                            <div class="space-y-3 mb-4">
                                <div class="grid grid-cols-2 gap-2">
                                    <div class="text-center">
                                        <p class="text-slate-400 text-xs mb-1">YOUR PLAY</p>
                                        <div :class="[
                                            'text-2xl font-bold',
                                            activeStatistics.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                                        ]">
                                            {{ activeStatistics.netProfit >= 0 ? '+' : '' }}${{ activeStatistics.netProfit }}
                                        </div>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-blue-400 text-xs mb-1">OPTIMAL PLAY</p>
                                        <div :class="[
                                            'text-2xl font-bold',
                                            optimalPlayStatistics.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                                        ]">
                                            {{ optimalPlayStatistics.netProfit >= 0 ? '+' : '' }}${{ optimalPlayStatistics.netProfit }}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Difference Indicator -->
                                <div :class="[
                                    'p-2 rounded-lg text-center border-2',
                                    activeStatistics.netProfit >= optimalPlayStatistics.netProfit ? 'bg-green-900/30 border-green-600' : 'bg-red-900/30 border-red-600'
                                ]">
                                    <p class="text-xs mb-1" :class="activeStatistics.netProfit >= optimalPlayStatistics.netProfit ? 'text-green-300' : 'text-red-300'">
                                        {{ activeStatistics.netProfit >= optimalPlayStatistics.netProfit ? '✓ Playing better than optimal!' : 'DIFFERENCE FROM OPTIMAL' }}
                                    </p>
                                    <p :class="[
                                        'text-lg font-bold',
                                        activeStatistics.netProfit >= optimalPlayStatistics.netProfit ? 'text-green-400' : 'text-red-400'
                                    ]">
                                        {{ activeStatistics.netProfit - optimalPlayStatistics.netProfit >= 0 ? '+' : '' }}${{ activeStatistics.netProfit - optimalPlayStatistics.netProfit }}
                                    </p>
                                </div>
                            </div>

                            <!-- Detailed Stats -->
                            <div class="space-y-2 pt-3 border-t border-slate-700">
                                <div class="grid grid-cols-3 gap-2 text-center mb-3">
                                    <div class="bg-slate-900/50 rounded p-2">
                                        <p class="text-green-400 text-xl font-bold">{{ activeStatistics.wins }}</p>
                                        <p class="text-slate-400 text-xs">Wins</p>
                                    </div>
                                    <div class="bg-slate-900/50 rounded p-2">
                                        <p class="text-red-400 text-xl font-bold">{{ activeStatistics.losses }}</p>
                                        <p class="text-slate-400 text-xs">Losses</p>
                                    </div>
                                    <div class="bg-slate-900/50 rounded p-2">
                                        <p class="text-yellow-400 text-xl font-bold">{{ activeStatistics.pushes }}</p>
                                        <p class="text-slate-400 text-xs">Pushes</p>
                                    </div>
                                </div>

                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Win Rate</span>
                                    <span class="text-white font-semibold">{{ winRate }}%</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Blackjacks</span>
                                    <span class="text-yellow-400 font-semibold">{{ activeStatistics.blackjacks }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Best Streak</span>
                                    <span class="text-blue-400 font-semibold">{{ activeStatistics.bestStreak }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Current Streak</span>
                                    <span
                                        :class="activeStatistics.currentStreak > 0 ? 'text-green-400' : activeStatistics.currentStreak < 0 ? 'text-red-400' : 'text-slate-400'"
                                        class="font-semibold">
                                        {{ activeStatistics.currentStreak > 0 ? '+' : '' }}{{
                                        activeStatistics.currentStreak }}
                                    </span>
                                </div>
                            </div>

                            <!-- Mode explanation -->
                            <div class="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                                <p class="text-xs text-slate-400 mb-1 font-semibold">
                                    {{ statsDisplayMode === 'standard' ? 'Standard Rules' : 'Challenge Rules' }}
                                </p>
                                <p class="text-xs text-slate-300">
                                    {{ statsDisplayMode === 'standard'
                                        ? 'Blackjack pays 3:2 • Dealer stands on soft 17 • Ties push'
                                        : 'Blackjack pays 6:5 • Dealer wins all ties • No pushes' }}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Recent Games -->
                    <Card class="glass-card border-slate-600/50">
                        <CardContent class="pt-6">
                            <h3 class="text-white text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                                <History class="w-5 h-5 text-blue-400" />
                                Recent Games
                            </h3>
                            <div class="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                <div v-for="(game, idx) in activeRecentGames" :key="idx" :class="[
                                    'p-3 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02]',
                                    game.result === 'win' ? 'glass-card border-green-500/50 hover:border-green-400/70' :
                                        game.result === 'lose' ? 'glass-card border-red-500/50 hover:border-red-400/70' :
                                            'glass-card border-yellow-500/50 hover:border-yellow-400/70'
                                ]" :style="{
                                    boxShadow: game.result === 'win' ? '0 0 20px rgba(34, 197, 94, 0.1)' :
                                        game.result === 'lose' ? '0 0 20px rgba(239, 68, 68, 0.1)' :
                                            '0 0 20px rgba(250, 204, 21, 0.1)'
                                }">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="flex items-center gap-2">
                                            <div :class="[
                                                'w-2 h-2 rounded-full animate-pulse',
                                                game.result === 'win' ? 'bg-green-400' :
                                                    game.result === 'lose' ? 'bg-red-400' : 'bg-yellow-400'
                                            ]"></div>
                                            <span :class="[
                                                'text-sm font-bold uppercase tracking-wider',
                                                game.result === 'win' ? 'text-green-400 drop-shadow-glow-green' :
                                                    game.result === 'lose' ? 'text-red-400 drop-shadow-glow-red' :
                                                        'text-yellow-400 drop-shadow-glow-yellow'
                                            ]">
                                                {{ game.result === 'win' ? 'WIN' : game.result === 'lose' ? 'LOSS' : 'PUSH'
                                                }}
                                            </span>
                                            <Badge v-if="game.isBlackjack" variant="outline"
                                                class="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 text-yellow-300 border-yellow-600 text-xs px-2 py-0.5">
                                                <span class="drop-shadow-glow-yellow">BJ</span>
                                            </Badge>
                                        </div>
                                        <span class="text-xs text-slate-400 font-mono">{{ game.time }}</span>
                                    </div>
                                    
                                    <div class="grid grid-cols-3 gap-2 mt-2">
                                        <div class="text-center bg-slate-900/50 rounded-lg p-2">
                                            <p class="text-xs text-slate-400 mb-0.5">Bet</p>
                                            <p class="text-white text-sm font-bold">${{ game.bet }}</p>
                                        </div>
                                        <div class="text-center bg-slate-900/50 rounded-lg p-2">
                                            <p class="text-xs text-slate-400 mb-0.5">Payout</p>
                                            <p :class="[
                                                'text-sm font-bold',
                                                game.payout > 0 ? 'text-green-400' :
                                                    game.payout < 0 ? 'text-red-400' : 'text-yellow-400'
                                            ]">
                                                {{ game.payout > 0 ? '+' : '' }}${{ Math.abs(game.payout) }}
                                            </p>
                                        </div>
                                        <div class="text-center bg-slate-900/50 rounded-lg p-2">
                                            <p class="text-xs text-slate-400 mb-0.5">Return</p>
                                            <p class="text-blue-400 text-sm font-bold">
                                                {{ game.bet > 0 ? ((game.payout + game.bet) / game.bet * 100).toFixed(0) : 0 }}%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="activeRecentGames.length === 0" class="text-center text-slate-500 py-12">
                                    <History class="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p class="text-sm">No games played yet</p>
                                    <p class="text-xs text-slate-600 mt-1">Start playing to see your history</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Center: Game Table -->
                <div class="lg:col-span-6">
                    <div class="relative bg-gradient-to-br from-green-800 via-green-700 to-green-800 rounded-3xl shadow-2xl border-8 border-amber-900/50 overflow-hidden"
                        style="min-height: 700px;">
                        <!-- Table Texture Overlay -->
                        <div
                            class="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-600 via-transparent to-transparent pointer-events-none">
                        </div>

                        <!-- Deck and Discard Piles - Better positioned -->
                        <div
                            class="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
                            <!-- Discard Pile -->
                            <div ref="discardElement" class="flex flex-col items-center">
                                <div class="relative w-16 h-24 sm:w-20 sm:h-28">
                                    <Transition enter-active-class="transition-all duration-500"
                                        enter-from-class="opacity-0 scale-75" enter-to-class="opacity-100 scale-100">
                                        <div v-if="discardPile.length > 0"
                                            class="absolute inset-0 bg-white rounded-lg shadow-2xl border-2 border-gray-300 overflow-hidden">
                                            <div class="absolute inset-0 flex items-center justify-center">
                                                <div class="text-center">
                                                    <div class="text-3xl sm:text-4xl"
                                                        :class="discardPile[discardPile.length - 1].suit === '♥' || discardPile[discardPile.length - 1].suit === '♦' ? 'text-red-600' : 'text-black'">
                                                        {{ discardPile[discardPile.length - 1].suit }}
                                                    </div>
                                                    <div class="text-lg sm:text-xl font-bold"
                                                        :class="discardPile[discardPile.length - 1].suit === '♥' || discardPile[discardPile.length - 1].suit === '♦' ? 'text-red-600' : 'text-black'">
                                                        {{ discardPile[discardPile.length - 1].rank }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                                <p class="text-white text-xs text-center mt-1 font-semibold">DISCARD</p>
                            </div>

                            <!-- Deck -->
                            <div ref="deckElement" class="flex flex-col items-center">
                                <div class="relative w-16 h-24 sm:w-20 sm:h-28">
                                    <div v-for="i in 3" :key="i" :style="{
                                        transform: `translateY(-${i * 1}px) translateX(-${i * 1}px)`,
                                        zIndex: 3 - i
                                    }"
                                        class="absolute inset-0 bg-gradient-to-br from-red-800 via-red-900 to-black rounded-lg shadow-2xl border-2 border-red-700/50 overflow-hidden">
                                        <div
                                            class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]">
                                        </div>
                                        <div
                                            class="absolute inset-0 flex items-center justify-center text-4xl opacity-40">
                                            🂠
                                        </div>
                                    </div>
                                </div>
                                <p class="text-white text-xs text-center mt-1 font-semibold">DECK ({{ cardsRemaining }})
                                </p>
                            </div>
                        </div>

                        <!-- Main Game Area -->
                        <div class="relative flex flex-col" style="min-height: 700px;">
                            <!-- Dealer Section (Top) -->
                            <div class="flex-1 flex flex-col justify-start p-4 sm:p-8 pt-20 sm:pt-24">
                                <div class="flex items-center justify-center gap-3 mb-6">
                                    <Badge variant="secondary"
                                        class="bg-red-900/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold border border-red-700">
                                        <User class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        Dealer
                                    </Badge>
                                    <Transition enter-active-class="transition-all duration-500 ease-out"
                                        enter-from-class="opacity-0 scale-0" enter-to-class="opacity-100 scale-100">
                                        <Badge v-if="showDealerValue" variant="outline"
                                            class="bg-black/80 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-lg sm:text-xl font-bold border-2 border-white/30">
                                            {{ dealerValue }}
                                        </Badge>
                                    </Transition>
                                </div>

                                <!-- Dealer Cards -->
                                <div ref="dealerCardArea"
                                    class="flex justify-center items-center min-h-[160px] sm:min-h-[200px]">
                                    <TransitionGroup name="card-fade" tag="div" class="flex gap-2 sm:gap-3 flex-wrap justify-center">
                                        <div v-for="(card, idx) in dealerHand" :key="card.id"
                                            class="transform">
                                            <div v-if="card.faceDown"
                                                class="playing-card card-back w-20 h-32 sm:w-24 sm:h-36 rounded-xl flex items-center justify-center border-2 sm:border-4 border-red-700/50 relative overflow-hidden">
                                                <div class="text-5xl sm:text-7xl opacity-60">🂠</div>
                                            </div>

                                            <div v-else
                                                class="playing-card w-20 h-32 sm:w-24 sm:h-36 bg-gradient-to-br from-white via-gray-50 to-white rounded-xl flex items-center justify-center border-2 sm:border-4 border-gray-200 relative overflow-hidden cursor-pointer">
                                                <div class="absolute top-2 left-2 flex flex-col items-center">
                                                    <span class="text-xs sm:text-sm font-bold leading-none"
                                                        :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                        {{ card.rank }}
                                                    </span>
                                                    <span class="text-base sm:text-lg"
                                                        :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                        {{ card.suit }}
                                                    </span>
                                                </div>
                                                <div class="text-4xl sm:text-5xl"
                                                    :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                    {{ card.suit }}
                                                </div>
                                                <div
                                                    class="absolute bottom-2 right-2 flex flex-col items-center rotate-180">
                                                    <span class="text-xs sm:text-sm font-bold leading-none"
                                                        :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                        {{ card.rank }}
                                                    </span>
                                                    <span class="text-base sm:text-lg"
                                                        :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                        {{ card.suit }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TransitionGroup>
                                </div>

                                <!-- Insurance Offer -->
                                <Transition enter-active-class="transition-all duration-300"
                                    enter-from-class="opacity-0 -translate-y-4"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition-all duration-300"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-4">
                                    <div v-if="showInsuranceOffer"
                                        class="mt-4 flex justify-center items-center gap-3 animate-pulse">
                                        <Badge
                                            class="bg-blue-900/90 text-white px-4 py-2 text-sm font-semibold border-2 border-blue-500">
                                            Insurance? (${{ insuranceCost }})
                                        </Badge>
                                        <Button @click="takeInsurance" size="sm"
                                            class="bg-blue-600 hover:bg-blue-700 text-white">
                                            Yes
                                        </Button>
                                        <Button @click="declineInsurance" size="sm" variant="outline"
                                            class="border-white text-white hover:bg-white/10">
                                            No
                                        </Button>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Player Section (Bottom) -->
                            <div class="flex-1 flex flex-col justify-end p-4 sm:p-8 pb-6 sm:pb-10">
                                <!-- Player Hands -->
                                <div ref="playerCardArea"
                                    class="flex justify-center items-center gap-4 sm:gap-6 mb-6 flex-wrap">
                                    <div v-for="(hand, handIdx) in playerHands" :key="handIdx" :class="[
                                        'transition-all duration-300',
                                        handIdx === activeHandIndex && gameState === 'playing' ? 'scale-105' : ''
                                    ]">
                                        <div class="flex flex-col items-center gap-3">
                                            <!-- Hand Value Badge -->
                                            <div class="flex items-center gap-2">
                                                <Badge v-if="playerHands.length > 1" variant="outline" :class="[
                                                    'px-3 py-1 text-xs font-semibold border-2',
                                                    handIdx === activeHandIndex && gameState === 'playing'
                                                        ? 'bg-blue-900/90 text-white border-blue-400'
                                                        : 'bg-black/60 text-white border-white/30'
                                                ]">
                                                    Hand {{ handIdx + 1 }}
                                                </Badge>
                                                <Badge variant="outline" :class="[
                                                    'px-3 sm:px-4 py-1.5 sm:py-2 text-lg sm:text-xl font-bold border-2',
                                                    hand.busted ? 'bg-red-900/90 text-red-200 border-red-500' :
                                                        hand.value === 21 ? 'bg-yellow-900/90 text-yellow-200 border-yellow-500' :
                                                            'bg-black/80 text-white border-white/30'
                                                ]">
                                                    {{ hand.value }}
                                                    <span v-if="hand.busted" class="ml-2 text-sm">BUST</span>
                                                    <span v-else-if="hand.value === 21 && hand.cards.length === 2"
                                                        class="ml-2 text-sm">BJ</span>
                                                </Badge>
                                            </div>

                                            <!-- Cards -->
                                            <TransitionGroup name="card-fade" tag="div" class="flex gap-2 sm:gap-3 flex-wrap justify-center">
                                                <div v-for="(card, cardIdx) in hand.cards" :key="card.id"
                                                    class="transform">
                                                    <div
                                                        class="playing-card w-20 h-32 sm:w-24 sm:h-36 bg-gradient-to-br from-white via-gray-50 to-white rounded-xl flex items-center justify-center border-2 sm:border-4 border-gray-200 relative overflow-hidden cursor-pointer">
                                                        <div class="absolute top-2 left-2 flex flex-col items-center">
                                                            <span class="text-xs sm:text-sm font-bold leading-none"
                                                                :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                                {{ card.rank }}
                                                            </span>
                                                            <span class="text-base sm:text-lg"
                                                                :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                                {{ card.suit }}
                                                            </span>
                                                        </div>
                                                        <div class="text-4xl sm:text-5xl"
                                                            :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                            {{ card.suit }}
                                                        </div>
                                                        <div
                                                            class="absolute bottom-2 right-2 flex flex-col items-center rotate-180">
                                                            <span class="text-xs sm:text-sm font-bold leading-none"
                                                                :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                                {{ card.rank }}
                                                            </span>
                                                            <span class="text-base sm:text-lg"
                                                                :class="card.suit === '♥' || card.suit === '♦' ? 'text-red-600' : 'text-black'">
                                                                {{ card.suit }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TransitionGroup>

                                            <!-- Bet Amount -->
                                            <Badge variant="outline"
                                                class="bg-amber-900/80 text-amber-200 border-amber-600 px-3 py-1 font-semibold">
                                                Bet: ${{ hand.bet }}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <!-- Player Label -->
                                <div class="flex justify-center">
                                    <Badge variant="secondary"
                                        class="bg-blue-900/90 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold border border-blue-700">
                                        <User class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                        You
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons Below Table -->
                    <div class="mt-4">
                        <!-- Betting Phase -->
                        <Transition enter-active-class="transition-all duration-300"
                            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition-all duration-300"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
                            <Card v-if="gameState === 'betting'" class="glass-card border-slate-600/50">
                                <CardContent class="p-4 sm:p-6">
                                    <h3 class="text-white text-lg sm:text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
                                        <Coins class="w-5 h-5 text-yellow-400" />
                                        <span class="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                            Place Your Bet
                                        </span>
                                    </h3>

                                    <div class="mb-6">
                                        <div class="flex items-center justify-between mb-3">
                                            <label class="text-slate-400 text-sm font-medium uppercase tracking-wide">Bet Amount</label>
                                            <span class="text-white text-2xl font-bold drop-shadow-glow-blue">${{ currentBet }}</span>
                                        </div>
                                        <input type="range" v-model.number="currentBet" :min="minBet"
                                            :max="Math.min(maxBet, balance)" :step="betStep"
                                            :style="{ '--value': ((currentBet - minBet) / (Math.min(maxBet, balance) - minBet) * 100) + '%' }"
                                            class="w-full h-4 bg-slate-700/50 rounded-lg appearance-none cursor-pointer slider backdrop-blur-sm" />
                                        <div class="flex justify-between text-xs text-slate-400 mt-2 font-mono">
                                            <span>${{ minBet }}</span>
                                            <span>${{ Math.min(maxBet, balance) }}</span>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
                                        <Button v-for="chip in quickBets" :key="chip" @click="currentBet = chip"
                                            :disabled="chip > balance"
                                            class="relative group bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold shadow-lg disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm py-3 transition-all hover:scale-105 hover:shadow-2xl">
                                            <div class="absolute inset-0 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <span class="relative">${{ chip }}</span>
                                        </Button>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <Button @click="dealCards" :disabled="balance < currentBet" size="lg"
                                            class="relative group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold text-base sm:text-lg py-4 sm:py-6 shadow-xl disabled:opacity-50 transition-all hover:scale-105 hover:shadow-2xl">
                                            <div class="absolute inset-0 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div class="relative flex items-center justify-center gap-2">
                                                <Play class="w-4 h-4 sm:w-5 sm:h-5" />
                                                Deal (Space)
                                            </div>
                                        </Button>
                                        <Button @click="resetStats" size="lg" variant="outline"
                                            class="glass-card border-2 border-slate-500/50 text-slate-300 hover:bg-slate-700/50 font-semibold text-sm sm:text-base py-4 sm:py-6 transition-all hover:scale-105">
                                            <RotateCcw class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Reset Stats
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Transition>

                        <!-- Playing Phase -->
                        <Transition enter-active-class="transition-all duration-300"
                            enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition-all duration-300"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
                            <Card v-if="gameState === 'playing'" class="glass-card border-slate-600/50">
                                <CardContent class="p-4 sm:p-6">
                                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                        <Button @click="hit" :disabled="!canHit" size="lg"
                                            class="relative group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold shadow-lg disabled:opacity-30 py-4 transition-all hover:scale-105 hover:shadow-2xl">
                                            <div class="absolute inset-0 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div class="relative flex items-center justify-center gap-2">
                                                <Plus class="w-5 h-5" />
                                                <span>Hit (H)</span>
                                            </div>
                                        </Button>

                                        <Button @click="stand" :disabled="!canStand" size="lg"
                                            class="relative group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold shadow-lg disabled:opacity-30 py-4 transition-all hover:scale-105 hover:shadow-2xl">
                                            <div class="absolute inset-0 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div class="relative flex items-center justify-center gap-2">
                                                <Hand class="w-5 h-5" />
                                                <span>Stand (S)</span>
                                            </div>
                                        </Button>

                                        <Button @click="double" :disabled="!canDouble" size="lg"
                                            class="relative group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold shadow-lg disabled:opacity-30 py-4 transition-all hover:scale-105 hover:shadow-2xl">
                                            <div class="absolute inset-0 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div class="relative flex items-center justify-center gap-2">
                                                <Zap class="w-5 h-5" />
                                                <span>Double (D)</span>
                                            </div>
                                        </Button>

                                        <Button @click="split" :disabled="!canSplit" size="lg"
                                            class="relative group bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold shadow-lg disabled:opacity-30 py-4 transition-all hover:scale-105 hover:shadow-2xl">
                                            <div class="absolute inset-0 bg-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div class="relative flex items-center justify-center gap-2">
                                                <Split class="w-5 h-5" />
                                                <span>Split (P)</span>
                                            </div>
                                        </Button>
                                    </div>

                                    <!-- Keyboard hints -->
                                    <div class="mt-3 text-center">
                                        <p class="text-xs text-slate-400 font-mono">Press H (Hit), S (Stand), D (Double), or P (Split)</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Transition>
                    </div>
                </div>

                <!-- Right Sidebar: Controls & Info -->
                <div class="lg:col-span-3 space-y-4">
                    <!-- Game Controls -->
                    <Card class="glass-card border-slate-600/50">
                        <CardContent class="pt-6">
                            <h3 class="text-white text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                                <Settings class="w-5 h-5" />
                                Game Rules
                            </h3>
                            <div class="mb-3 p-2 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                                <p class="text-blue-300 text-xs font-semibold">Active: Standard Blackjack</p>
                                <p class="text-blue-200 text-xs mt-1">Stats tracked for both rulesets</p>
                            </div>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Min Bet</span>
                                    <span class="text-white font-semibold">${{ minBet }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Max Bet</span>
                                    <span class="text-white font-semibold">${{ maxBet }}</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Blackjack Pays</span>
                                    <span class="text-yellow-400 font-semibold">3:2</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Dealer Stands</span>
                                    <span class="text-white font-semibold">Soft 17</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-400 text-sm">Decks</span>
                                    <span class="text-white font-semibold">6</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Strategy Guide -->
                    <Card class="glass-card border-slate-600/50">
                        <CardContent class="pt-6">
                            <h3 class="text-white text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                                <Lightbulb class="w-5 h-5" />
                                Quick Tips
                            </h3>
                            <div class="space-y-2 text-sm text-slate-300">
                                <div class="flex items-start gap-2">
                                    <div class="w-2 h-2 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p>Always split Aces and 8s</p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div class="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p>Never split 10s or 5s</p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div class="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p>Double down on 11 vs dealer 2-10</p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div class="w-2 h-2 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p>Stand on 17+ (hard)</p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div class="w-2 h-2 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p>Hit on 16 or less vs dealer 7+</p>
                                </div>
                                <div class="flex items-start gap-2">
                                    <div class="w-2 h-2 bg-pink-400 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <p>Insurance is generally not recommended</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Strategy Analyzer - Expandable -->
                    <Card v-if="gameState === 'playing'" class="glass-card border-slate-600/50">
                        <CardContent class="pt-6">
                            <button @click="showStrategyAnalyzer = !showStrategyAnalyzer"
                                class="w-full flex items-center justify-between text-white text-lg sm:text-xl font-bold mb-4 hover:text-blue-400 transition-colors">
                                <div class="flex items-center gap-2">
                                    <Brain class="w-5 h-5" />
                                    Strategy Analyzer
                                </div>
                                <ChevronDown :class="[
                                    'w-5 h-5 transition-transform duration-300',
                                    showStrategyAnalyzer ? 'rotate-180' : ''
                                ]" />
                            </button>

                            <!-- Collapsed View - Just the header, no preview -->
                            <div v-if="!showStrategyAnalyzer" class="text-center text-slate-400 text-sm">
                                Click to view strategy recommendations
                            </div>

                            <!-- Expanded View - Full Analysis -->
                            <Transition enter-active-class="transition-all duration-300 ease-out"
                                enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-[1000px]"
                                leave-active-class="transition-all duration-300 ease-in"
                                leave-from-class="opacity-100 max-h-[1000px]" leave-to-class="opacity-0 max-h-0">
                                <div v-if="showStrategyAnalyzer" class="space-y-4 overflow-hidden">
                                    <!-- Recommended Action with Reasoning -->
                                    <div
                                        class="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-2 border-blue-600 rounded-lg p-4">
                                        <div class="flex items-center justify-between mb-3">
                                            <span class="text-blue-300 text-sm font-semibold">Recommended Action</span>
                                            <Badge :class="[
                                                'font-bold',
                                                recommendedAction === 'HIT' ? 'bg-blue-600' :
                                                    recommendedAction === 'STAND' ? 'bg-red-600' :
                                                        recommendedAction === 'DOUBLE' ? 'bg-purple-600' :
                                                            recommendedAction === 'SPLIT' ? 'bg-amber-600' : 'bg-gray-600'
                                            ]">
                                                {{ recommendedAction }}
                                            </Badge>
                                        </div>
                                        <p class="text-white text-2xl font-bold mb-2">{{ recommendedAction }}</p>
                                        <p class="text-blue-200 text-sm">{{ strategyReasoning }}</p>
                                    </div>

                                    <!-- Win/Lose/Push Probabilities -->
                                    <div class="space-y-2">
                                        <div>
                                            <div class="flex justify-between text-sm mb-1">
                                                <span class="text-green-400 font-semibold">Win Probability</span>
                                                <span class="text-white font-bold">{{ winProbability }}%</span>
                                            </div>
                                            <div class="w-full bg-slate-700 rounded-full h-3">
                                                <div class="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                                                    :style="{ width: winProbability + '%' }"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex justify-between text-sm mb-1">
                                                <span class="text-red-400 font-semibold">Bust Probability</span>
                                                <span class="text-white font-bold">{{ bustProbability }}%</span>
                                            </div>
                                            <div class="w-full bg-slate-700 rounded-full h-3">
                                                <div class="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                                                    :style="{ width: bustProbability + '%' }"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div class="flex justify-between text-sm mb-1">
                                                <span class="text-yellow-400 font-semibold">Push Probability</span>
                                                <span class="text-white font-bold">{{ pushProbability }}%</span>
                                            </div>
                                            <div class="w-full bg-slate-700 rounded-full h-3">
                                                <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-500"
                                                    :style="{ width: pushProbability + '%' }"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Dealer Analysis -->
                                    <div class="border-t border-slate-700 pt-3">
                                        <p class="text-xs text-slate-400 mb-3 flex items-center gap-2">
                                            <Target class="w-4 h-4" />
                                            Hand & Dealer Analysis
                                        </p>
                                        <div class="bg-slate-900/50 rounded-lg p-3 space-y-2">
                                            <div class="flex items-center justify-between">
                                                <span class="text-slate-300 text-sm">Your Hand Type</span>
                                                <Badge variant="outline" :class="[
                                                    'text-sm font-bold',
                                                    isSoftHand(currentHand.cards) ? 'bg-blue-900/50 text-blue-300' : 'bg-slate-700 text-slate-300'
                                                ]">
                                                    {{ isSoftHand(currentHand.cards) ? 'Soft' : 'Hard' }} {{
                                                    currentHand.value }}
                                                </Badge>
                                            </div>
                                            <div class="flex items-center justify-between">
                                                <span class="text-slate-300 text-sm">Dealer Visible</span>
                                                <span class="text-xl font-bold"
                                                    :class="dealerHand[0].suit === '♥' || dealerHand[0].suit === '♦' ? 'text-red-400' : 'text-white'">
                                                    {{ dealerHand[0].rank }}{{ dealerHand[0].suit }}
                                                </span>
                                            </div>
                                            <div class="flex items-center justify-between">
                                                <span class="text-slate-300 text-sm">Dealer Bust Chance</span>
                                                <Badge variant="outline" class="text-sm font-bold"
                                                    :class="dealerBustChance >= 40 ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'">
                                                    {{ dealerBustChance }}%
                                                </Badge>
                                            </div>
                                            <div class="flex items-center justify-between">
                                                <span class="text-slate-300 text-sm">Expected Final Value</span>
                                                <span class="text-white font-bold">{{ expectedDealerValue }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Expected Value -->
                                    <div class="border-t border-slate-700 pt-3">
                                        <p class="text-xs text-slate-400 mb-2 flex items-center gap-2">
                                            <TrendingUp class="w-4 h-4" />
                                            Expected Value Analysis
                                        </p>
                                        <div class="grid grid-cols-2 gap-2 mb-3">
                                            <div class="bg-slate-900/50 rounded-lg p-2 text-center">
                                                <p class="text-slate-400 text-xs mb-1">Hit EV</p>
                                                <p :class="[
                                                    'font-bold text-sm',
                                                    expectedValueHit >= 0 ? 'text-green-400' : 'text-red-400'
                                                ]">
                                                    {{ expectedValueHit >= 0 ? '+' : '' }}${{ expectedValueHit }}
                                                </p>
                                            </div>
                                            <div class="bg-slate-900/50 rounded-lg p-2 text-center">
                                                <p class="text-slate-400 text-xs mb-1">Stand EV</p>
                                                <p :class="[
                                                    'font-bold text-sm',
                                                    expectedValueStand >= 0 ? 'text-green-400' : 'text-red-400'
                                                ]">
                                                    {{ expectedValueStand >= 0 ? '+' : '' }}${{ expectedValueStand }}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <!-- Optimal Play Comparison -->
                                        <div class="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-2 border-purple-600 rounded-lg p-3">
                                            <p class="text-purple-300 text-xs font-semibold mb-2">Playing Optimally</p>
                                            <div class="flex items-center justify-between">
                                                <span class="text-white text-sm">Recommended: <span class="font-bold">{{ recommendedAction }}</span></span>
                                                <Badge :class="[
                                                    'font-bold',
                                                    optimalEV.recommendedEV >= 0 ? 'bg-green-600' : 'bg-red-600'
                                                ]">
                                                    {{ optimalEV.recommendedEV >= 0 ? '+' : '' }}${{ optimalEV.recommendedEV }}
                                                </Badge>
                                            </div>
                                            <div v-if="optimalEV.difference !== 0" class="mt-2 pt-2 border-t border-purple-700">
                                                <p class="text-xs" :class="optimalEV.difference > 0 ? 'text-red-300' : 'text-green-300'">
                                                    {{ optimalEV.difference > 0 ? '⚠️ Could lose' : '✓ Following optimal play' }} 
                                                    <span class="font-bold">${{ Math.abs(optimalEV.difference) }}</span>
                                                    {{ optimalEV.difference > 0 ? ' by not choosing ' + optimalEV.action : '' }}
                                                </p>
                                            </div>
                                            <div v-else class="mt-2 pt-2 border-t border-purple-700">
                                                <p class="text-xs text-green-300">
                                                    ✓ This is the optimal play!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        <!-- Result Modal -->
        <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition-all duration-200"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showResultModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                @click="closeResult">
                <Card @click.stop
                    class="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 border-2 shadow-2xl" :class="[
                        finalResult === 'win' ? 'border-green-500' :
                            finalResult === 'lose' ? 'border-red-500' :
                                'border-yellow-500'
                    ]">
                    <CardContent class="p-8 text-center">
                        <!-- Result Icon -->
                        <div class="mb-6">
                            <div v-if="finalResult === 'win'"
                                class="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                                <Trophy class="w-12 h-12 text-white" />
                            </div>
                            <div v-else-if="finalResult === 'lose'"
                                class="w-24 h-24 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
                                <X class="w-12 h-12 text-white" />
                            </div>
                            <div v-else
                                class="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                                <Minus class="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <!-- Result Message -->
                        <h2 class="text-4xl font-bold mb-4" :class="[
                            finalResult === 'win' ? 'text-green-400' :
                                finalResult === 'lose' ? 'text-red-400' :
                                    'text-yellow-400'
                        ]">
                            {{ resultMessage }}
                        </h2>

                        <!-- Winnings/Losses -->
                        <div class="mb-6">
                            <p class="text-slate-400 text-sm mb-2">Total Bet: ${{ totalBetAmount }}</p>
                            <p class="text-3xl font-bold" :class="[
                                totalWinnings - totalBetAmount > 0 ? 'text-green-400' :
                                    totalWinnings - totalBetAmount < 0 ? 'text-red-400' :
                                        'text-yellow-400'
                            ]">
                                {{ totalWinnings - totalBetAmount >= 0 ? '+' : '' }}${{
                                    (totalWinnings - totalBetAmount).toLocaleString() }}
                            </p>
                        </div>

                        <!-- New Balance -->
                        <div class="mb-8 p-4 bg-slate-700/50 rounded-lg">
                            <p class="text-slate-400 text-sm mb-1">New Balance</p>
                            <p class="text-2xl font-bold text-white">${{ balance.toLocaleString() }}</p>
                        </div>

                        <!-- Action Button -->
                        <Button @click="closeResult" size="lg"
                            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg py-6 shadow-xl">
                            Play Again (Enter)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Coins, History, User, Play, Plus, Hand, Zap, Split,
    Trophy, X, Minus, TrendingUp, RotateCcw, Settings,
    Lightbulb, Brain, ChevronDown, Target
} from 'lucide-vue-next'

// Game state
const gameState = ref('betting') // 'betting', 'playing', 'ended'
const balance = ref(1000)
const currentBet = ref(25)
const minBet = 10
const maxBet = 500
const betStep = 5
const quickBets = [10, 25, 50, 100, 250, 500, 1000]

// Element refs for animations
const deckElement = ref(null)
const discardElement = ref(null)
const dealerCardArea = ref(null)
const playerCardArea = ref(null)

// Strategy Analyzer
const showStrategyAnalyzer = ref(false)

// Deck management
const deck = ref([])
const discardPile = ref([])
let cardIdCounter = 0

// Hands
const playerHands = ref([])
const dealerHand = ref([])
const activeHandIndex = ref(0)
const showDealerValue = ref(false)

// Game results
const finalResult = ref(null) // 'win', 'lose', 'push'
const resultMessage = ref('')
const totalWinnings = ref(0)
const totalBetAmount = ref(0)
const showResultModal = ref(false)
const playerActions = ref([]) // Track actions taken: { handIndex, action, optimalAction }

// Insurance
const showInsuranceOffer = ref(false)
const insuranceBet = ref(0)
const hasInsurance = ref(false)

// Statistics
const statistics = ref({
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
    totalBet: 0,
    totalWon: 0,
    netProfit: 0,
    bestStreak: 0,
    currentStreak: 0
})

// Optimal play statistics - what would have happened with perfect play
const optimalPlayStatistics = ref({
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
    totalBet: 0,
    totalWon: 0,
    netProfit: 0,
    bestStreak: 0,
    currentStreak: 0,
    optimalDecisions: 0, // Times player matched optimal play
    totalDecisions: 0     // Total decisions made
})

// Challenge mode statistics (6:5 blackjack payout, dealer hits soft 17)
const challengeStatistics = ref({
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
    totalBet: 0,
    totalWon: 0,
    netProfit: 0,
    bestStreak: 0,
    currentStreak: 0
})

const gameMode = ref('standard') // 'standard' or 'challenge'
const statsDisplayMode = ref('standard') // Which stats to display

const activeStatistics = computed(() => {
    return statsDisplayMode.value === 'standard' ? statistics.value : challengeStatistics.value
})

// Recent games
const recentGames = ref([])
const challengeRecentGames = ref([])

const activeRecentGames = computed(() => {
    return statsDisplayMode.value === 'standard' ? recentGames.value : challengeRecentGames.value
})

// Card suits and ranks
const suits = ['♠', '♥', '♦', '♣']
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

// Initialize deck with 6 decks
const initializeDeck = () => {
    const newDeck = []
    for (let d = 0; d < 6; d++) {
        for (const suit of suits) {
            for (const rank of ranks) {
                newDeck.push({
                    suit,
                    rank,
                    value: rank === 'A' ? 11 : ['J', 'Q', 'K'].includes(rank) ? 10 : parseInt(rank),
                    id: cardIdCounter++,
                    faceDown: false
                })
            }
        }
    }
    return shuffleDeck(newDeck)
}

const shuffleDeck = (deckToShuffle) => {
    const shuffled = [...deckToShuffle]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

const dealCard = (faceDown = false) => {
    if (deck.value.length < 20) {
        deck.value = initializeDeck()
    }
    const card = deck.value.pop()

    return { ...card, faceDown, id: cardIdCounter++ }
}

// Computed properties
const currentHand = computed(() => playerHands.value[activeHandIndex.value])

const cardsRemaining = computed(() => deck.value.length)

const calculateHandValue = (hand) => {
    let value = 0
    let aces = 0

    for (const card of hand) {
        if (card.faceDown) continue
        if (card.rank === 'A') {
            aces++
            value += 11
        } else {
            value += card.value
        }
    }

    while (value > 21 && aces > 0) {
        value -= 10
        aces--
    }

    return value
}

const isSoftHand = (hand) => {
    if (!hand) return false

    let value = 0
    let aces = 0

    for (const card of hand) {
        if (card.faceDown) continue
        if (card.rank === 'A') {
            aces++
            value += 11
        } else {
            value += card.value
        }
    }

    // Check if we have an ace counting as 11
    return aces > 0 && value <= 21
}

const dealerValue = computed(() => calculateHandValue(dealerHand.value))

const canHit = computed(() => {
    if (!currentHand.value) return false
    return !currentHand.value.busted && !currentHand.value.stood && currentHand.value.value < 21
})

const canStand = computed(() => {
    if (!currentHand.value) return false
    return !currentHand.value.busted && !currentHand.value.stood
})

const canDouble = computed(() => {
    if (!currentHand.value) return false
    return currentHand.value.cards.length === 2 &&
        !currentHand.value.stood &&
        balance.value >= currentHand.value.bet
})

const canSplit = computed(() => {
    if (!currentHand.value) return false
    if (currentHand.value.cards.length !== 2) return false
    if (balance.value < currentHand.value.bet) return false
    if (playerHands.value.length >= 4) return false

    const card1 = currentHand.value.cards[0]
    const card2 = currentHand.value.cards[1]
    return card1.value === card2.value
})

const insuranceCost = computed(() => Math.floor(currentBet.value / 2))

const winRate = computed(() => {
    const total = activeStatistics.value.wins + activeStatistics.value.losses
    if (total === 0) return 0
    return Math.round((activeStatistics.value.wins / total) * 100)
})

const bustProbability = computed(() => {
    if (!currentHand.value || gameState.value !== 'playing') return 0

    const handValue = currentHand.value.value
    if (handValue >= 21) return handValue > 21 ? 100 : 0

    // Calculate based on remaining deck composition
    let bustCards = 0
    let totalCards = 0

    for (const card of deck.value) {
        totalCards++
        if (handValue + card.value > 21) {
            bustCards++
        }
    }

    if (totalCards === 0) return 50

    return Math.round((bustCards / totalCards) * 100)
})

const dealerBustChance = computed(() => {
    if (dealerHand.value.length === 0) return 0

    const upCard = dealerHand.value[0].rank
    const bustChances = {
        '2': 35, '3': 37, '4': 40, '5': 42, '6': 42,
        '7': 26, '8': 24, '9': 23, '10': 21, 'J': 21, 'Q': 21, 'K': 21, 'A': 11
    }

    return bustChances[upCard] || 25
})

const expectedDealerValue = computed(() => {
    if (dealerHand.value.length === 0) return 17

    const upCard = dealerHand.value[0].rank
    const expectedValues = {
        '2': 18.8, '3': 18.6, '4': 18.4, '5': 18.2, '6': 18.0,
        '7': 18.8, '8': 19.0, '9': 19.2, '10': 19.3, 'J': 19.3, 'Q': 19.3, 'K': 19.3, 'A': 18.7
    }

    return expectedValues[upCard]?.toFixed(1) || '18.5'
})

const winProbability = computed(() => {
    if (!currentHand.value || gameState.value !== 'playing') return 0

    const playerValue = currentHand.value.value
    const dealerUpCard = dealerHand.value[0]?.rank

    if (playerValue > 21) return 0
    if (playerValue === 21) return 85

    // More accurate win probability based on dealer's up card and player's total
    const winMatrix = {
        '2': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 39, 42, 45, 38, 63, 69, 75, 82],
        '3': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 41, 44, 47, 40, 62, 68, 74, 81],
        '4': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 43, 46, 49, 42, 61, 67, 73, 80],
        '5': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 45, 48, 51, 44, 60, 66, 72, 79],
        '6': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 45, 48, 51, 44, 58, 65, 71, 78],
        '7': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 26, 30, 33, 36, 29, 38, 60, 69, 77],
        '8': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 28, 31, 34, 27, 36, 49, 67, 76],
        '9': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 27, 30, 33, 26, 34, 47, 58, 74],
        '10': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 25, 28, 31, 24, 32, 45, 56, 65],
        'J': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 25, 28, 31, 24, 32, 45, 56, 65],
        'Q': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 25, 28, 31, 24, 32, 45, 56, 65],
        'K': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21, 25, 28, 31, 24, 32, 45, 56, 65],
        'A': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 35, 38, 41, 34, 43, 55, 64, 72]
    }

    const matrix = winMatrix[dealerUpCard] || winMatrix['10']
    return matrix[playerValue] || 30
})

const pushProbability = computed(() => {
    if (!currentHand.value || gameState.value !== 'playing') return 0

    const playerValue = currentHand.value.value
    const dealerUpCard = dealerHand.value[0]?.rank

    if (playerValue > 21) return 0

    // Push probability based on player value and dealer up card
    const pushMatrix = {
        '2': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 8, 9, 10, 11],
        '3': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 8, 9, 10, 11],
        '4': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 8, 9, 10, 11],
        '5': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 8, 9, 10, 11],
        '6': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 8, 9, 10, 11],
        '7': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 6, 14, 10, 9, 8],
        '8': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 6, 8, 18, 9, 8],
        '9': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 6, 8, 9, 20, 8],
        '10': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 6, 8, 9, 10, 23],
        'J': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 6, 8, 9, 10, 23],
        'Q': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 6, 8, 9, 10, 23],
        'K': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 4, 5, 6, 8, 9, 10, 23],
        'A': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5, 5, 6, 7, 9, 10, 11, 12]
    }

    const matrix = pushMatrix[dealerUpCard] || pushMatrix['10']
    return matrix[playerValue] || 5
})

const recommendedAction = computed(() => {
    if (!currentHand.value || gameState.value !== 'playing') return 'WAIT'

    const hand = currentHand.value
    const playerValue = hand.value
    const dealerUpCard = dealerHand.value[0]?.rank

    if (!dealerUpCard) return 'WAIT'

    // Check for pairs (split)
    if (hand.cards.length === 2 && canSplit.value) {
        const cardRank = hand.cards[0].rank

        // Always split Aces and 8s
        if (cardRank === 'A' || cardRank === '8') return 'SPLIT'

        // Split 9s except against 7, 10, or Ace
        if (cardRank === '9' && !['7', '10', 'J', 'Q', 'K', 'A'].includes(dealerUpCard)) return 'SPLIT'

        // Split 2s, 3s, 6s, 7s against dealer 2-7
        if (['2', '3', '6', '7'].includes(cardRank) && ['2', '3', '4', '5', '6', '7'].includes(dealerUpCard)) return 'SPLIT'

        // Never split 4s, 5s, or 10s
    }

    // Check for soft hands (Ace counting as 11)
    const soft = isSoftHand(hand.cards)

    if (soft) {
        // Soft 20 or 21 - always stand
        if (playerValue >= 20) return 'STAND'

        // Soft 19 (A,8) - always stand
        if (playerValue === 19) return 'STAND'

        // Soft 18 (A,7)
        if (playerValue === 18) {
            if (['9', '10', 'J', 'Q', 'K', 'A'].includes(dealerUpCard)) return 'HIT'
            if (canDouble.value && ['3', '4', '5', '6'].includes(dealerUpCard)) return 'DOUBLE'
            return 'STAND'
        }

        // Soft 17 (A,6)
        if (playerValue === 17) {
            if (canDouble.value && ['3', '4', '5', '6'].includes(dealerUpCard)) return 'DOUBLE'
            return 'HIT'
        }

        // Soft 16 (A,5) or Soft 15 (A,4)
        if (playerValue === 16 || playerValue === 15) {
            if (canDouble.value && ['4', '5', '6'].includes(dealerUpCard)) return 'DOUBLE'
            return 'HIT'
        }

        // Soft 14 (A,3) or Soft 13 (A,2)
        if (playerValue === 14 || playerValue === 13) {
            if (canDouble.value && ['5', '6'].includes(dealerUpCard)) return 'DOUBLE'
            return 'HIT'
        }

        // Lower soft hands - always hit
        return 'HIT'
    }

    // Hard hands
    if (playerValue >= 17) return 'STAND'

    if (playerValue >= 13 && playerValue <= 16) {
        if (['2', '3', '4', '5', '6'].includes(dealerUpCard)) return 'STAND'
        return 'HIT'
    }

    if (playerValue === 12) {
        if (['4', '5', '6'].includes(dealerUpCard)) return 'STAND'
        return 'HIT'
    }

    // Double down situations (hard hands)
    if (canDouble.value && hand.cards.length === 2) {
        if (playerValue === 11) return 'DOUBLE'
        if (playerValue === 10 && !['10', 'J', 'Q', 'K', 'A'].includes(dealerUpCard)) return 'DOUBLE'
        if (playerValue === 9 && ['3', '4', '5', '6'].includes(dealerUpCard)) return 'DOUBLE'
    }

    return 'HIT'
})

const expectedValueHit = computed(() => {
    if (!currentHand.value) return 0

    const bet = currentHand.value.bet
    const playerValue = currentHand.value.value

    // If already at 21 or busted, hitting has terrible EV
    if (playerValue >= 21) return -bet

    // Calculate probability of improving vs busting
    const bustProb = bustProbability.value / 100
    const winProb = winProbability.value / 100
    const pushProb = pushProbability.value / 100

    // When you hit, you risk busting (lose bet) but might improve (win bet)
    // EV = (prob of winning after hit * 2*bet) + (prob of push * bet) - (prob of losing * bet) - bet
    // Simplified: Consider the risk of busting heavily
    const improvementFactor = (21 - playerValue) / 21 // How much room to improve
    const ev = (winProb * bet * 0.7) - (bustProb * bet) + (pushProb * bet * 0.5) - (bet * 0.3)

    return Math.round(ev)
})

const expectedValueStand = computed(() => {
    if (!currentHand.value) return 0

    const bet = currentHand.value.bet
    const playerValue = currentHand.value.value

    // If busted, standing has zero EV (already lost)
    if (playerValue > 21) return -bet

    // Standing means we keep our hand and see what dealer does
    const winProb = winProbability.value / 100
    const pushProb = pushProbability.value / 100
    const loseProb = Math.max(0, 1 - winProb - pushProb)

    // EV = (prob of winning * bet) + (prob of push * 0) - (prob of losing * bet)
    const ev = (winProb * bet) - (loseProb * bet)

    return Math.round(ev)
})

const optimalEV = computed(() => {
    if (!currentHand.value || gameState.value !== 'playing') return { action: 'WAIT', ev: 0, difference: 0 }
    
    const evs = {
        'HIT': expectedValueHit.value,
        'STAND': expectedValueStand.value
    }
    
    // Find the action with the highest EV
    let maxEV = -Infinity
    let bestAction = 'STAND'
    
    Object.entries(evs).forEach(([action, ev]) => {
        if (ev > maxEV) {
            maxEV = ev
            bestAction = action
        }
    })
    
    // Calculate difference from optimal for each action
    const recommended = recommendedAction.value
    const recommendedEV = evs[recommended] || evs['STAND']
    const difference = maxEV - recommendedEV
    
    return {
        action: bestAction,
        ev: Math.round(maxEV),
        recommendedEV: Math.round(recommendedEV),
        difference: Math.round(difference)
    }
})

const strategyReasoning = computed(() => {
    if (!currentHand.value || gameState.value !== 'playing') return ''

    const action = recommendedAction.value
    const playerValue = currentHand.value.value
    const dealerUpCard = dealerHand.value[0]?.rank
    const soft = isSoftHand(currentHand.value.cards)
    const handType = soft ? 'soft' : 'hard'

    const reasons = {
        'HIT': `With ${handType} ${playerValue}, you should hit to improve. The dealer shows ${dealerUpCard}, and you need a stronger hand to compete.`,
        'STAND': `Stand on ${handType} ${playerValue}. You have a strong enough hand, and the risk of busting by hitting outweighs the potential improvement.`,
        'DOUBLE': `Double down with ${handType} ${playerValue} vs dealer's ${dealerUpCard}. This is a mathematically favorable situation that maximizes your expected value.`,
        'SPLIT': `Split this pair to create two hands. Against dealer's ${dealerUpCard}, splitting maximizes your long-term expected value.`,
        'WAIT': 'Waiting for game to continue...'
    }

    return reasons[action] || reasons['HIT']
})

// Game actions
const dealCards = async () => {
    if (balance.value < currentBet.value) return

    balance.value -= currentBet.value
    totalBetAmount.value = currentBet.value
    gameState.value = 'playing'
    hasInsurance.value = false
    insuranceBet.value = 0
    playerActions.value = [] // Reset player actions tracking

    // Initialize hands
    playerHands.value = [{
        cards: [],
        value: 0,
        busted: false,
        stood: false,
        bet: currentBet.value,
        split: false
    }]

    dealerHand.value = []
    activeHandIndex.value = 0

    // Deal initial cards
    await new Promise(resolve => setTimeout(resolve, 200))

    const playerCard1 = dealCard()
    playerHands.value[0].cards.push(playerCard1)
    updateHandValues()

    await new Promise(resolve => setTimeout(resolve, 300))

    const dealerCard1 = dealCard()
    dealerHand.value.push(dealerCard1)

    await new Promise(resolve => setTimeout(resolve, 300))

    const playerCard2 = dealCard()
    playerHands.value[0].cards.push(playerCard2)
    updateHandValues()

    await new Promise(resolve => setTimeout(resolve, 300))

    const dealerCard2 = dealCard(true)
    dealerHand.value.push(dealerCard2)

    await new Promise(resolve => setTimeout(resolve, 300))

    // Check for insurance
    if (dealerHand.value[0].rank === 'A') {
        showInsuranceOffer.value = true
        return
    }

    // Check for blackjack
    if (playerHands.value[0].value === 21) {
        await checkForBlackjack()
    }
}

const takeInsurance = () => {
    showInsuranceOffer.value = false
    hasInsurance.value = true
    insuranceBet.value = insuranceCost.value
    balance.value -= insuranceBet.value
    checkForBlackjack()
}

const declineInsurance = () => {
    showInsuranceOffer.value = false
    checkForBlackjack()
}

const checkForBlackjack = async () => {
    const playerBJ = playerHands.value[0].value === 21 && playerHands.value[0].cards.length === 2

    // Reveal dealer's hidden card
    await revealDealerCard()

    const dealerBJ = dealerValue.value === 21 && dealerHand.value.length === 2

    // Handle insurance
    if (hasInsurance.value) {
        if (dealerBJ) {
            const insurancePayout = insuranceBet.value * 3
            balance.value += insurancePayout
            totalWinnings.value += insurancePayout
        }
    }

    const now = new Date()

    if (playerBJ && dealerBJ) {
        // Both blackjack - push in standard, but dealer wins in challenge
        finalResult.value = 'push'
        resultMessage.value = 'Both Blackjack - Push'
        balance.value += currentBet.value
        totalWinnings.value = currentBet.value

        // Standard: push
        updateStatistics(statistics.value, 'push', totalBetAmount.value, currentBet.value, false)
        recentGames.value.unshift({
            result: 'push',
            bet: totalBetAmount.value,
            payout: 0,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isBlackjack: false
        })

        // Challenge: dealer wins (no pushes)
        updateStatistics(challengeStatistics.value, 'lose', totalBetAmount.value, 0, false)
        challengeRecentGames.value.unshift({
            result: 'lose',
            bet: totalBetAmount.value,
            payout: -totalBetAmount.value,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isBlackjack: false
        })

        await endGame()
    } else if (playerBJ) {
        // Player blackjack - wins in both modes (but different payouts)
        const standardPayout = currentBet.value * 2.5  // 3:2
        const challengePayout = currentBet.value * 2.2  // 6:5

        balance.value += standardPayout
        totalWinnings.value = standardPayout
        finalResult.value = 'win'
        resultMessage.value = 'Blackjack!'

        // Standard mode
        updateStatistics(statistics.value, 'win', totalBetAmount.value, standardPayout, true)
        recentGames.value.unshift({
            result: 'win',
            bet: totalBetAmount.value,
            payout: standardPayout - totalBetAmount.value,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isBlackjack: true
        })

        // Challenge mode (immediate payout, higher frequency but lower amount)
        updateStatistics(challengeStatistics.value, 'win', totalBetAmount.value, challengePayout, true)
        challengeRecentGames.value.unshift({
            result: 'win',
            bet: totalBetAmount.value,
            payout: challengePayout - totalBetAmount.value,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isBlackjack: true
        })

        await endGame(true)
    } else if (dealerBJ) {
        // Dealer blackjack - player loses in both modes
        finalResult.value = 'lose'
        resultMessage.value = 'Dealer Blackjack'

        // Both modes: loss
        updateStatistics(statistics.value, 'lose', totalBetAmount.value, 0, false)
        recentGames.value.unshift({
            result: 'lose',
            bet: totalBetAmount.value,
            payout: -totalBetAmount.value,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isBlackjack: false
        })

        updateStatistics(challengeStatistics.value, 'lose', totalBetAmount.value, 0, false)
        challengeRecentGames.value.unshift({
            result: 'lose',
            bet: totalBetAmount.value,
            payout: -totalBetAmount.value,
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            isBlackjack: false
        })

        await endGame()
    }

    // Trim recent games lists
    if (recentGames.value.length > 20) {
        recentGames.value.pop()
    }
    if (challengeRecentGames.value.length > 20) {
        challengeRecentGames.value.pop()
    }
}

// Update all hand values
const updateHandValues = () => {
    playerHands.value.forEach(hand => {
        hand.value = calculateHandValue(hand.cards)
        if (hand.value > 21) {
            hand.busted = true
        }
    })
}

const hit = async () => {
    if (!canHit.value) return

    // Track action vs optimal
    playerActions.value.push({
        handIndex: activeHandIndex.value,
        action: 'HIT',
        optimalAction: recommendedAction.value
    })

    const newCard = dealCard()
    currentHand.value.cards.push(newCard)

    await new Promise(resolve => setTimeout(resolve, 300))
    updateHandValues()

    await new Promise(resolve => setTimeout(resolve, 200))

    if (currentHand.value.busted) {
        await nextHand()
    }
}

const stand = async () => {
    if (!canStand.value) return

    // Track action vs optimal
    playerActions.value.push({
        handIndex: activeHandIndex.value,
        action: 'STAND',
        optimalAction: recommendedAction.value
    })

    currentHand.value.stood = true
    await nextHand()
}

const double = async () => {
    if (!canDouble.value) return

    // Track action vs optimal
    playerActions.value.push({
        handIndex: activeHandIndex.value,
        action: 'DOUBLE',
        optimalAction: recommendedAction.value
    })

    balance.value -= currentHand.value.bet
    currentHand.value.bet *= 2
    totalBetAmount.value += currentHand.value.bet / 2

    const newCard = dealCard()
    currentHand.value.cards.push(newCard)

    await new Promise(resolve => setTimeout(resolve, 300))
    updateHandValues()

    await new Promise(resolve => setTimeout(resolve, 200))

    currentHand.value.stood = true
    await nextHand()
}

const split = async () => {
    if (!canSplit.value) return

    // Track action vs optimal
    playerActions.value.push({
        handIndex: activeHandIndex.value,
        action: 'SPLIT',
        optimalAction: recommendedAction.value
    })

    balance.value -= currentBet.value
    totalBetAmount.value += currentBet.value

    const originalHand = currentHand.value
    const card1 = originalHand.cards[0]
    const card2 = originalHand.cards[1]

    originalHand.cards = [card1]
    originalHand.split = true

    const newHand = {
        cards: [card2],
        value: 0,
        busted: false,
        stood: false,
        bet: currentBet.value,
        split: true
    }

    playerHands.value.push(newHand)

    await new Promise(resolve => setTimeout(resolve, 200))

    const newCard1 = dealCard()
    originalHand.cards.push(newCard1)
    updateHandValues()

    await new Promise(resolve => setTimeout(resolve, 300))

    const newCard2 = dealCard()
    newHand.cards.push(newCard2)
    updateHandValues()
}

const nextHand = async () => {
    if (activeHandIndex.value < playerHands.value.length - 1) {
        activeHandIndex.value++
    } else {
        await revealDealerCard()
        await dealerPlay()
        await resolveGame()
    }
}

const revealDealerCard = async () => {
    const faceDownIndex = dealerHand.value.findIndex(c => c.faceDown)
    if (faceDownIndex !== -1) {
        dealerHand.value[faceDownIndex] = { ...dealerHand.value[faceDownIndex], faceDown: false }
        showDealerValue.value = true
        await new Promise(resolve => setTimeout(resolve, 500))
    }
}

const dealerPlay = async () => {
    const anyHandsActive = playerHands.value.some(h => !h.busted)
    if (!anyHandsActive) return

    await new Promise(resolve => setTimeout(resolve, 400))

    while (dealerValue.value < 17) {
        const newCard = dealCard()
        dealerHand.value.push(newCard)
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    await new Promise(resolve => setTimeout(resolve, 500))
}

const calculateGameResult = (mode) => {
    let totalPayout = 0
    const dealerVal = dealerValue.value
    const dealerBusted = dealerVal > 21

    let wins = 0
    let losses = 0
    let pushes = 0
    let hasBlackjack = false

    playerHands.value.forEach(hand => {
        if (hand.busted) {
            losses++
            return
        }

        const handVal = hand.value
        const isBlackjack = hand.cards.length === 2 && handVal === 21 && !hand.split

        if (isBlackjack) hasBlackjack = true

        if (dealerBusted || handVal > dealerVal) {
            wins++
            let payout
            if (isBlackjack) {
                payout = mode === 'standard' ? hand.bet * 2.5 : hand.bet * 2.2 // 3:2 vs 6:5
            } else {
                payout = hand.bet * 2
            }
            totalPayout += payout
        } else if (handVal === dealerVal) {
            // Challenge mode: dealer wins all ties (no pushes)
            if (mode === 'challenge') {
                losses++
            } else {
                // Standard mode: ties are pushes
                pushes++
                totalPayout += hand.bet
            }
        } else {
            losses++
        }
    })

    return { totalPayout, wins, losses, pushes, hasBlackjack }
}

const updateStatistics = (stats, result, betAmount, payout, hasBlackjack) => {
    stats.totalBet += betAmount
    stats.totalWon += payout
    stats.netProfit = stats.totalWon - stats.totalBet

    if (result === 'win') {
        stats.wins++
        stats.currentStreak = stats.currentStreak >= 0 ? stats.currentStreak + 1 : 1
        if (stats.currentStreak > stats.bestStreak) {
            stats.bestStreak = stats.currentStreak
        }
        if (hasBlackjack) stats.blackjacks++
    } else if (result === 'lose') {
        stats.losses++
        stats.currentStreak = stats.currentStreak <= 0 ? stats.currentStreak - 1 : -1
    } else if (result === 'push') {
        stats.pushes++
        // Pushes don't affect streak
    }
}

const resolveGame = async () => {
    const dealerVal = dealerValue.value
    const dealerBusted = dealerVal > 21

    // Calculate for both modes
    const standardResult = calculateGameResult('standard')
    const challengeResult = calculateGameResult('challenge')

    // Determine result message based on standard mode
    let standardResultType = null
    let challengeResultType = null
    let message = ''

    // Standard mode result
    if (standardResult.wins > 0 && standardResult.losses === 0) {
        standardResultType = 'win'
        message = standardResult.wins === 1 ? 'You Win!' : `${standardResult.wins} Hands Win!`
    } else if (standardResult.wins === 0 && standardResult.losses > 0) {
        standardResultType = 'lose'
        message = 'Dealer Wins'
    } else if (standardResult.wins > standardResult.losses) {
        standardResultType = 'win'
        message = `You Win ${standardResult.wins}-${standardResult.losses}!`
    } else if (standardResult.losses > standardResult.wins) {
        standardResultType = 'lose'
        message = `Dealer Wins ${standardResult.losses}-${standardResult.wins}`
    } else if (standardResult.pushes > 0 && standardResult.wins === 0 && standardResult.losses === 0) {
        standardResultType = 'push'
        message = 'Push'
    } else {
        standardResultType = 'push'
        message = 'Push'
    }

    // Challenge mode result (no pushes - dealer wins ties)
    if (challengeResult.wins > 0 && challengeResult.losses === 0) {
        challengeResultType = 'win'
    } else if (challengeResult.wins === 0 && challengeResult.losses > 0) {
        challengeResultType = 'lose'
    } else if (challengeResult.wins > challengeResult.losses) {
        challengeResultType = 'win'
    } else if (challengeResult.losses > challengeResult.wins) {
        challengeResultType = 'lose'
    } else {
        // In challenge mode, ties go to dealer
        challengeResultType = 'lose'
    }

    // Update both sets of statistics
    updateStatistics(statistics.value, standardResultType, totalBetAmount.value, standardResult.totalPayout, standardResult.hasBlackjack)
    updateStatistics(challengeStatistics.value, challengeResultType, totalBetAmount.value, challengeResult.totalPayout, challengeResult.hasBlackjack)

    // Calculate optimal play statistics
    // For now, we'll use the same result since the hand already played out
    // We just track accuracy of decisions
    playerActions.value.forEach(action => {
        optimalPlayStatistics.value.totalDecisions++
        if (action.action === action.optimalAction) {
            optimalPlayStatistics.value.optimalDecisions++
        }
    })
    
    // Update optimal play game stats with the same results
    // (In a perfect implementation, we'd simulate what would have happened with optimal play)
    // For simplicity, we assume optimal play would have gotten the same result
    updateStatistics(optimalPlayStatistics.value, standardResultType, totalBetAmount.value, standardResult.totalPayout, standardResult.hasBlackjack)

    // Use standard mode payout for actual balance (game plays in standard mode)
    balance.value += standardResult.totalPayout
    totalWinnings.value = standardResult.totalPayout

    finalResult.value = standardResultType
    resultMessage.value = message

    // Add to recent games for both modes
    const now = new Date()

    // Standard mode history
    recentGames.value.unshift({
        result: standardResultType,
        bet: totalBetAmount.value,
        payout: standardResult.totalPayout - totalBetAmount.value,
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isBlackjack: standardResult.hasBlackjack
    })
    if (recentGames.value.length > 20) {
        recentGames.value.pop()
    }

    // Challenge mode history
    challengeRecentGames.value.unshift({
        result: challengeResultType,
        bet: totalBetAmount.value,
        payout: challengeResult.totalPayout - totalBetAmount.value,
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isBlackjack: challengeResult.hasBlackjack
    })
    if (challengeRecentGames.value.length > 20) {
        challengeRecentGames.value.pop()
    }

    await endGame(standardResult.hasBlackjack)
}

const endGame = async (isBlackjack = false) => {
    gameState.value = 'ended'

    await new Promise(resolve => setTimeout(resolve, 1500))
    showResultModal.value = true
}

const closeResult = async () => {
    showResultModal.value = false

    await new Promise(resolve => setTimeout(resolve, 400))

    // Clear all cards
    const allCards = [
        ...playerHands.value.flatMap(h => h.cards),
        ...dealerHand.value
    ]

    // Add last card to discard pile
    if (allCards.length > 0) {
        discardPile.value.push(allCards[allCards.length - 1])
    }

    await new Promise(resolve => setTimeout(resolve, 200))

    playerHands.value = []
    dealerHand.value = []
    finalResult.value = null
    resultMessage.value = ''
    totalWinnings.value = 0
    totalBetAmount.value = 0
    showDealerValue.value = false
    activeHandIndex.value = 0
    showInsuranceOffer.value = false
    hasInsurance.value = false
    insuranceBet.value = 0
    showStrategyAnalyzer.value = false
    playerActions.value = []
    gameState.value = 'betting'
}

const resetStats = () => {
    if (confirm('Are you sure you want to reset all statistics for both game modes?')) {
        statistics.value = {
            wins: 0,
            losses: 0,
            pushes: 0,
            blackjacks: 0,
            totalBet: 0,
            totalWon: 0,
            netProfit: 0,
            bestStreak: 0,
            currentStreak: 0
        }
        challengeStatistics.value = {
            wins: 0,
            losses: 0,
            pushes: 0,
            blackjacks: 0,
            totalBet: 0,
            totalWon: 0,
            netProfit: 0,
            bestStreak: 0,
            currentStreak: 0
        }
        optimalPlayStatistics.value = {
            wins: 0,
            losses: 0,
            pushes: 0,
            blackjacks: 0,
            totalBet: 0,
            totalWon: 0,
            netProfit: 0,
            bestStreak: 0,
            currentStreak: 0,
            optimalDecisions: 0,
            totalDecisions: 0
        }
        recentGames.value = []
        challengeRecentGames.value = []
        balance.value = 1000
    }
}

// Keyboard shortcuts
const handleKeyPress = (e) => {
    if (showResultModal.value && e.key === 'Enter') {
        closeResult()
        return
    }

    if (gameState.value === 'betting') {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault()
            dealCards()
        }
    } else if (gameState.value === 'playing') {
        switch (e.key.toLowerCase()) {
            case 'h':
                if (canHit.value) hit()
                break
            case 's':
                if (canStand.value) stand()
                break
            case 'd':
                if (canDouble.value) double()
                break
            case 'p':
                if (canSplit.value) split()
                break
        }
    }
}

// Initialize
onMounted(() => {
    deck.value = initializeDeck()
    window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
})
</script>

<style scoped>
/* Glassmorphic Effects */
.glass-card {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-card:hover {
    background: rgba(15, 23, 42, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.15);
}

/* Glow effects */
.drop-shadow-glow-green {
    filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.5));
}

.drop-shadow-glow-red {
    filter: drop-shadow(0 0 8px rgba(248, 113, 113, 0.5));
}

.drop-shadow-glow-yellow {
    filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.5));
}

.drop-shadow-glow-blue {
    filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.5));
}

/* Enhanced card animations */
.card-fade-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card-fade-leave-active {
    transition: all 0.3s ease-in;
}

.card-fade-enter-from {
    opacity: 0;
    transform: scale(0.5) translateY(-50px) rotateY(180deg);
}

.card-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.card-fade-move {
    transition: transform 0.4s ease;
}

/* Playing card 3D effect */
.playing-card {
    transform-style: preserve-3d;
    transition: all 0.3s ease;
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.5),
        0 0 20px rgba(255, 255, 255, 0.1) inset;
}

.playing-card:hover {
    transform: translateY(-8px) rotateX(5deg);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.6),
        0 0 30px rgba(255, 255, 255, 0.15) inset;
}

.card-back {
    background: 
        radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.2), transparent 50%),
        linear-gradient(45deg, #7f1d1d 25%, transparent 25%),
        linear-gradient(-45deg, #7f1d1d 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #7f1d1d 75%),
        linear-gradient(-45deg, transparent 75%, #7f1d1d 75%),
        #991b1b;
    background-size: 100% 100%, 20px 20px, 20px 20px, 20px 20px, 20px 20px, 100% 100%;
    background-position: 0 0, 0 0, 10px 0, 10px -10px, 0 10px;
}

/* Scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.4);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(96, 165, 250, 0.5);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(96, 165, 250, 0.7);
}

.slider {
    -webkit-appearance: none;
    appearance: none;
    background: linear-gradient(to right,
            #10b981 0%,
            #10b981 var(--value),
            #334155 var(--value),
            #334155 100%);
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #10b981, #059669);
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #10b981, #059669);
    cursor: pointer;
    border-radius: 50%;
    border: none;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.slider::-moz-range-track {
    background: #334155;
    border-radius: 0.5rem;
    height: 0.75rem;
}

.slider::-moz-range-progress {
    background: #10b981;
    border-radius: 0.5rem;
    height: 0.75rem;
}
</style>