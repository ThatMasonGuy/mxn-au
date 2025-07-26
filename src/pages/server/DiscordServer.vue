<template>
    <div class="min-h-screen bg-gray-900 text-gray-100">
        <!-- Header -->
        <header class="bg-gray-800 border-b border-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <h1
                            class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Discord Analytics Hub
                        </h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button class="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                    class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-400 text-sm">Total Guilds</p>
                            <p class="text-3xl font-bold mt-2">{{ stats.guilds }}</p>
                        </div>
                        <div class="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-green-400 text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span>+12.5%</span>
                    </div>
                </div>

                <div
                    class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-400 text-sm">Total Messages</p>
                            <p class="text-3xl font-bold mt-2">{{ stats.messages.toLocaleString() }}</p>
                        </div>
                        <div class="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z">
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-green-400 text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span>+24.1%</span>
                    </div>
                </div>

                <div
                    class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-400 text-sm">Active Users</p>
                            <p class="text-3xl font-bold mt-2">{{ stats.users.toLocaleString() }}</p>
                        </div>
                        <div class="p-3 bg-green-500 bg-opacity-20 rounded-lg">
                            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-green-400 text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span>+8.7%</span>
                    </div>
                </div>

                <div
                    class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-orange-500 transition-all duration-300 transform hover:scale-105">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-400 text-sm">Total Channels</p>
                            <p class="text-3xl font-bold mt-2">{{ stats.channels }}</p>
                        </div>
                        <div class="p-3 bg-orange-500 bg-opacity-20 rounded-lg">
                            <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                            </svg>
                        </div>
                    </div>
                    <div class="mt-4 flex items-center text-red-400 text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                        </svg>
                        <span>-2.3%</span>
                    </div>
                </div>
            </div>

            <!-- Navigation Tabs -->
            <div class="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200',
                    activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                ]">
                    {{ tab.name }}
                </button>
            </div>

            <!-- Search and Filters -->
            <div class="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="md:col-span-2">
                        <div class="relative">
                            <input v-model="searchQuery" type="text" placeholder="Search across all data..."
                                class="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors">
                            <svg class="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <select v-model="filterType"
                            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors">
                            <option value="">All Types</option>
                            <option v-for="option in filterOptions" :key="option.value" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Recent Activity -->
                <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 class="text-xl font-semibold mb-4 text-gray-100">Recent Activity</h3>
                    <div class="space-y-4">
                        <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start space-x-3">
                            <div :class="['p-2 rounded-lg', activity.color]">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        :d="activity.icon"></path>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm text-gray-300">{{ activity.description }}</p>
                                <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Channels -->
                <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h3 class="text-xl font-semibold mb-4 text-gray-100">Top Active Channels</h3>
                    <div class="space-y-3">
                        <div v-for="channel in topChannels" :key="channel.id" class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-gray-400">#</span>
                                <span class="text-gray-200">{{ channel.name }}</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <span class="text-sm text-gray-400">{{ channel.messages.toLocaleString() }} msgs</span>
                                <div class="w-24 bg-gray-700 rounded-full h-2 ml-2">
                                    <div class="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                                        :style="`width: ${channel.percentage}%`"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Tables for Other Tabs -->
            <div v-else class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-900">
                                <th v-for="header in getTableHeaders()" :key="header"
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    {{ header }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-700">
                            <!-- Guilds Tab -->
                            <template v-if="activeTab === 'guilds'">
                                <tr v-for="guild in paginatedData" :key="guild.id"
                                    class="hover:bg-gray-750 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 h-10 w-10">
                                                <div
                                                    class="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-bold">
                                                    {{ guild.name.charAt(0).toUpperCase() }}
                                                </div>
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-100">{{ guild.name }}</div>
                                                <div class="text-sm text-gray-400">ID: {{ guild.id }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ guild.owner_name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{
                                        guild.member_count.toLocaleString() }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ guild.channel_count
                                        }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ guild.region }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button @click="viewDetails(guild)"
                                            class="text-purple-400 hover:text-purple-300 mr-3">View</button>
                                        <button class="text-blue-400 hover:text-blue-300">Analytics</button>
                                    </td>
                                </tr>
                            </template>

                            <!-- Messages Tab -->
                            <template v-else-if="activeTab === 'messages'">
                                <tr v-for="message in paginatedData" :key="message.id"
                                    class="hover:bg-gray-750 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="max-w-xs">
                                            <p class="text-sm text-gray-100 truncate">{{ message.content }}</p>
                                            <p class="text-xs text-gray-400 mt-1">ID: {{ message.id }}</p>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 h-8 w-8 mr-3">
                                                <img class="h-8 w-8 rounded-full"
                                                    :src="message.author_avatar || `https://ui-avatars.com/api/?name=${message.author_name}&background=6366f1&color=fff`"
                                                    alt="">
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-100">{{ message.author_name }}
                                                </div>
                                                <div class="text-xs text-gray-400">{{ message.author_discriminator }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{{
                                        message.channel_name }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ message.guild_name
                                        }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span v-if="message.is_pinned"
                                            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-200">
                                            Pinned
                                        </span>
                                        <span v-else-if="message.deleted"
                                            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 text-red-200">
                                            Deleted
                                        </span>
                                        <span v-else
                                            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                                            Active
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{
                                        formatDate(message.timestamp) }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button @click="viewDetails(message)"
                                            class="text-purple-400 hover:text-purple-300">Details</button>
                                    </td>
                                </tr>
                            </template>

                            <!-- Users Tab -->
                            <template v-else-if="activeTab === 'users'">
                                <tr v-for="user in paginatedData" :key="user.id"
                                    class="hover:bg-gray-750 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 h-10 w-10">
                                                <img class="h-10 w-10 rounded-full"
                                                    :src="user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`"
                                                    alt="">
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-100">{{ user.name }}</div>
                                                <div class="text-sm text-gray-400">{{ user.nickname || 'No nickname' }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{ user.id }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{{ user.discriminator
                                        }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span v-if="user.is_bot"
                                            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-200">
                                            Bot
                                        </span>
                                        <span v-else
                                            class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900 text-green-200">
                                            User
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex -space-x-1">
                                            <span v-for="(role, idx) in user.roles.slice(0, 3)" :key="idx"
                                                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mr-1"
                                                :style="`background-color: ${role.color}20; color: ${role.color}`">
                                                {{ role.name }}
                                            </span>
                                            <span v-if="user.roles.length > 3" class="text-xs text-gray-400 ml-2">
                                                +{{ user.roles.length - 3 }} more
                                            </span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{{
                                        user.message_count.toLocaleString() }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button @click="viewDetails(user)"
                                            class="text-purple-400 hover:text-purple-300 mr-3">View</button>
                                        <button class="text-blue-400 hover:text-blue-300">Messages</button>
                                    </td>
                                </tr>
                            </template>

                            <!-- Analytics Tab -->
                            <template v-else-if="activeTab === 'analytics'">
                                <tr>
                                    <td colspan="6" class="px-6 py-12 text-center">
                                        <div class="text-gray-400">
                                            <svg class="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                                                </path>
                                            </svg>
                                            <p class="text-lg font-medium mb-2">Analytics Dashboard Coming Soon</p>
                                            <p class="text-sm">Charts, graphs, and insights will be displayed here</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="activeTab !== 'analytics'" class="bg-gray-900 px-6 py-3 flex items-center justify-between">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button @click="previousPage" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-400">
                                Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span
                                    class="font-medium">{{ endIndex
                                    }}</span> of{' '}
                                <span class="font-medium">{{ filteredData.length }}</span> results
                            </p>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination">
                                <button @click="previousPage" :disabled="currentPage === 1"
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <button v-for="page in displayedPages" :key="page" @click="currentPage = page" :class="[
                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                    currentPage === page
                                        ? 'z-10 bg-purple-600 border-purple-600 text-white'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                                ]">
                                    {{ page }}
                                </button>
                                <button @click="nextPage" :disabled="currentPage === totalPages"
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700">
                                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detail Modal -->
            <Transition name="modal">
                <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div class="fixed inset-0 transition-opacity" @click="showModal = false">
                            <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
                        </div>
                        <div
                            class="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 class="text-lg leading-6 font-medium text-gray-100 mb-4">
                                    Details
                                </h3>
                                <div class="mt-2">
                                    <pre
                                        class="text-sm text-gray-300 bg-gray-900 p-4 rounded-lg overflow-auto max-h-96">{{
                                            JSON.stringify(selectedItem, null, 2) }}</pre>
                                </div>
                            </div>
                            <div class="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button @click="showModal = false" type="button"
                                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Stats
const stats = ref({
    guilds: 12,
    messages: 1847293,
    users: 4821,
    channels: 287
})

// Tabs
const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'guilds', name: 'Guilds' },
    { id: 'messages', name: 'Messages' },
    { id: 'users', name: 'Users' },
    { id: 'analytics', name: 'Analytics' }
]

const activeTab = ref('overview')

// Search and filter
const searchQuery = ref('')
const filterType = ref('')

// Modal
const showModal = ref(false)
const selectedItem = ref(null)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Reset pagination when tab changes
watch(activeTab, () => {
    currentPage.value = 1
    searchQuery.value = ''
    filterType.value = ''
})

// Sample data for different tabs
const guildsData = ref([
    { id: '123456789012345678', name: 'Gaming Central', owner_id: '098765432109876543', owner_name: 'GamerPro', region: 'us-west', member_count: 5432, channel_count: 45 },
    { id: '234567890123456789', name: 'Tech Innovators', owner_id: '109876543210987654', owner_name: 'TechLead', region: 'eu-west', member_count: 3210, channel_count: 32 },
    { id: '345678901234567890', name: 'Art & Design Hub', owner_id: '210987654321098765', owner_name: 'CreativeDir', region: 'us-east', member_count: 2876, channel_count: 28 },
    { id: '456789012345678901', name: 'Music Production', owner_id: '321098765432109876', owner_name: 'BeatMaker', region: 'asia', member_count: 4123, channel_count: 38 },
    { id: '567890123456789012', name: 'Coding Bootcamp', owner_id: '432109876543210987', owner_name: 'DevMaster', region: 'us-central', member_count: 6789, channel_count: 52 },
    { id: '678901234567890123', name: 'Anime Paradise', owner_id: '543210987654321098', owner_name: 'OtakuKing', region: 'japan', member_count: 8901, channel_count: 67 },
    { id: '789012345678901234', name: 'Sports Arena', owner_id: '654321098765432109', owner_name: 'SportsFan', region: 'brazil', member_count: 3456, channel_count: 41 },
    { id: '890123456789012345', name: 'Book Club Central', owner_id: '765432109876543210', owner_name: 'BookWorm', region: 'sydney', member_count: 1234, channel_count: 18 },
    { id: '901234567890123456', name: 'Meme Factory', owner_id: '876543210987654321', owner_name: 'MemeLord', region: 'us-west', member_count: 12345, channel_count: 89 },
    { id: '012345678901234567', name: 'Photography Guild', owner_id: '987654321098765432', owner_name: 'PhotoPro', region: 'eu-central', member_count: 2345, channel_count: 25 },
    { id: '112233445566778899', name: 'Fitness Community', owner_id: '998877665544332211', owner_name: 'FitCoach', region: 'us-east', member_count: 4567, channel_count: 34 },
    { id: '998877665544332211', name: 'Food & Cooking', owner_id: '112233445566778899', owner_name: 'ChefMaster', region: 'india', member_count: 3789, channel_count: 29 }
])

const messagesData = ref([
    { id: '111222333444555666', content: 'Hey everyone! Just wanted to share this amazing resource I found for learning React...', author_id: '777888999000111222', author_name: 'ReactDev', author_discriminator: '1234', author_avatar: null, channel_id: '333444555666777888', channel_name: 'react-help', guild_id: '567890123456789012', guild_name: 'Coding Bootcamp', timestamp: '2025-01-20T14:32:00Z', is_pinned: 1, deleted: 0 },
    { id: '222333444555666777', content: 'Can someone help me with this Python error? I\'m getting a TypeError when trying to...', author_id: '888999000111222333', author_name: 'PythonNewbie', author_discriminator: '5678', author_avatar: null, channel_id: '444555666777888999', channel_name: 'python-support', guild_id: '567890123456789012', guild_name: 'Coding Bootcamp', timestamp: '2025-01-20T15:45:00Z', is_pinned: 0, deleted: 0 },
    { id: '333444555666777888', content: 'Just finished my first game jam! It was exhausting but so rewarding. Here\'s the link to play...', author_id: '999000111222333444', author_name: 'IndieGameDev', author_discriminator: '9012', author_avatar: null, channel_id: '555666777888999000', channel_name: 'showcase', guild_id: '123456789012345678', guild_name: 'Gaming Central', timestamp: '2025-01-20T16:20:00Z', is_pinned: 1, deleted: 0 },
    { id: '444555666777888999', content: 'Anyone up for some ranked matches tonight? Looking to grind to Diamond...', author_id: '000111222333444555', author_name: 'CompetitiveGamer', author_discriminator: '3456', author_avatar: null, channel_id: '666777888999000111', channel_name: 'looking-for-group', guild_id: '123456789012345678', guild_name: 'Gaming Central', timestamp: '2025-01-20T17:00:00Z', is_pinned: 0, deleted: 0 },
    { id: '555666777888999000', content: 'New episode of Attack on Titan just dropped! No spoilers please, but OMG that ending...', author_id: '111222333444555666', author_name: 'AnimeFanatic', author_discriminator: '7890', author_avatar: null, channel_id: '777888999000111222', channel_name: 'anime-discussion', guild_id: '678901234567890123', guild_name: 'Anime Paradise', timestamp: '2025-01-20T18:30:00Z', is_pinned: 0, deleted: 0 },
    { id: '666777888999000111', content: '[DELETED MESSAGE]', author_id: '222333444555666777', author_name: 'DeletedUser', author_discriminator: '0000', author_avatar: null, channel_id: '888999000111222333', channel_name: 'general', guild_id: '901234567890123456', guild_name: 'Meme Factory', timestamp: '2025-01-20T19:15:00Z', is_pinned: 0, deleted: 1 },
    { id: '777888999000111222', content: 'Check out my latest digital art piece! Took me about 20 hours to complete...', author_id: '333444555666777888', author_name: 'DigitalArtist', author_discriminator: '2468', author_avatar: null, channel_id: '999000111222333444', channel_name: 'art-showcase', guild_id: '345678901234567890', guild_name: 'Art & Design Hub', timestamp: '2025-01-20T20:00:00Z', is_pinned: 1, deleted: 0 },
    { id: '888999000111222333', content: 'Looking for feedback on my mix. I think the bass might be too loud but I\'m not sure...', author_id: '444555666777888999', author_name: 'ProducerX', author_discriminator: '1357', author_avatar: null, channel_id: '000111222333444555', channel_name: 'production-feedback', guild_id: '456789012345678901', guild_name: 'Music Production', timestamp: '2025-01-20T21:30:00Z', is_pinned: 0, deleted: 0 },
    { id: '999000111222333444', content: 'Just hit a new PR! 405lbs deadlift! Years of training finally paying off 💪', author_id: '555666777888999000', author_name: 'GymRat', author_discriminator: '2469', author_avatar: null, channel_id: '111222333444555666', channel_name: 'achievements', guild_id: '112233445566778899', guild_name: 'Fitness Community', timestamp: '2025-01-20T22:45:00Z', is_pinned: 0, deleted: 0 },
    { id: '000111222333444555', content: 'Who else is reading "The Midnight Library"? Just finished chapter 10 and wow...', author_id: '666777888999000111', author_name: 'Bookworm2025', author_discriminator: '8024', author_avatar: null, channel_id: '222333444555666777', channel_name: 'current-reads', guild_id: '890123456789012345', guild_name: 'Book Club Central', timestamp: '2025-01-21T10:00:00Z', is_pinned: 0, deleted: 0 }
])

const usersData = ref([
    { id: '777888999000111222', name: 'ReactDev', nickname: 'React Master', discriminator: '1234', is_bot: 0, avatar_url: null, color: '#5865F2', message_count: 3842, roles: [{ name: 'Developer', color: '#3498db' }, { name: 'Moderator', color: '#e74c3c' }, { name: 'Nitro Booster', color: '#f47fff' }] },
    { id: '888999000111222333', name: 'PythonNewbie', nickname: null, discriminator: '5678', is_bot: 0, avatar_url: null, color: '#57F287', message_count: 127, roles: [{ name: 'Member', color: '#99aab5' }] },
    { id: '999000111222333444', name: 'IndieGameDev', nickname: 'Game Maker', discriminator: '9012', is_bot: 0, avatar_url: null, color: '#ED4245', message_count: 2156, roles: [{ name: 'Game Developer', color: '#9b59b6' }, { name: 'Artist', color: '#e91e63' }] },
    { id: '000111222333444555', name: 'CompetitiveGamer', nickname: 'Diamond Player', discriminator: '3456', is_bot: 0, avatar_url: null, color: '#FEE75C', message_count: 5672, roles: [{ name: 'Diamond Rank', color: '#00d4ff' }, { name: 'Team Captain', color: '#ff6b6b' }, { name: 'Verified', color: '#2ecc71' }, { name: 'Streamer', color: '#9146ff' }] },
    { id: '111222333444555666', name: 'AnimeFanatic', nickname: 'Otaku4Life', discriminator: '7890', is_bot: 0, avatar_url: null, color: '#EB459E', message_count: 8901, roles: [{ name: 'Anime Expert', color: '#ff69b4' }, { name: 'Manga Reader', color: '#ff1493' }, { name: 'Sub Enthusiast', color: '#c71585' }] },
    { id: '222333444555666777', name: 'BotAssistant', nickname: null, discriminator: '0000', is_bot: 1, avatar_url: null, color: '#5865F2', message_count: 45678, roles: [{ name: 'Bot', color: '#7289da' }, { name: 'Music', color: '#1db954' }] },
    { id: '333444555666777888', name: 'DigitalArtist', nickname: 'Pixel Wizard', discriminator: '2468', is_bot: 0, avatar_url: null, color: '#9B59B6', message_count: 3421, roles: [{ name: 'Artist', color: '#e91e63' }, { name: 'Designer', color: '#00bcd4' }, { name: 'Commissions Open', color: '#4caf50' }] },
    { id: '444555666777888999', name: 'ProducerX', nickname: 'Beat Maker', discriminator: '1357', is_bot: 0, avatar_url: null, color: '#F1C40F', message_count: 2890, roles: [{ name: 'Music Producer', color: '#ff5722' }, { name: 'FL Studio', color: '#ff9800' }] },
    { id: '555666777888999000', name: 'GymRat', nickname: 'Iron Addict', discriminator: '2469', is_bot: 0, avatar_url: null, color: '#E74C3C', message_count: 1567, roles: [{ name: 'Powerlifter', color: '#d32f2f' }, { name: '1000lb Club', color: '#b71c1c' }] },
    { id: '666777888999000111', name: 'Bookworm2025', nickname: 'Page Turner', discriminator: '8024', is_bot: 0, avatar_url: null, color: '#2ECC71', message_count: 892, roles: [{ name: 'Book Club Member', color: '#8bc34a' }, { name: 'Monthly Reader', color: '#4caf50' }] },
    { id: '777666555444333222', name: 'ModBot', nickname: null, discriminator: '0001', is_bot: 1, avatar_url: null, color: '#ED4245', message_count: 67890, roles: [{ name: 'Bot', color: '#7289da' }, { name: 'Moderation', color: '#e74c3c' }, { name: 'Admin', color: '#ff0000' }] },
    { id: '888777666555444333', name: 'ChefMaster', nickname: 'Kitchen King', discriminator: '3690', is_bot: 0, avatar_url: null, color: '#F47FFF', message_count: 4123, roles: [{ name: 'Head Chef', color: '#ff6347' }, { name: 'Recipe Creator', color: '#ffa500' }, { name: 'Food Critic', color: '#ff4500' }] }
])

// Recent activity for overview
const recentActivity = ref([
    { id: 1, description: 'New message in #general by @ReactDev', time: '2 minutes ago', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', color: 'bg-blue-500 bg-opacity-20 text-blue-400' },
    { id: 2, description: 'User @GymRat joined Fitness Community', time: '15 minutes ago', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', color: 'bg-green-500 bg-opacity-20 text-green-400' },
    { id: 3, description: 'Channel #announcements created in Tech Innovators', time: '1 hour ago', icon: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14', color: 'bg-purple-500 bg-opacity-20 text-purple-400' },
    { id: 4, description: 'Message deleted in #general by ModBot', time: '2 hours ago', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16', color: 'bg-red-500 bg-opacity-20 text-red-400' }
])

// Top channels for overview
const topChannels = ref([
    { id: 1, name: 'general', messages: 45632, percentage: 100 },
    { id: 2, name: 'memes', messages: 38901, percentage: 85 },
    { id: 3, name: 'gaming-chat', messages: 32456, percentage: 71 },
    { id: 4, name: 'tech-support', messages: 28790, percentage: 63 },
    { id: 5, name: 'announcements', messages: 21345, percentage: 47 }
])

// Computed properties
const filterOptions = computed(() => {
    switch (activeTab.value) {
        case 'guilds':
            return [
                { value: 'us-west', label: 'US West' },
                { value: 'us-east', label: 'US East' },
                { value: 'eu-west', label: 'EU West' },
                { value: 'asia', label: 'Asia' }
            ]
        case 'messages':
            return [
                { value: 'pinned', label: 'Pinned' },
                { value: 'deleted', label: 'Deleted' },
                { value: 'active', label: 'Active' }
            ]
        case 'users':
            return [
                { value: 'bot', label: 'Bots' },
                { value: 'user', label: 'Users' },
                { value: 'moderator', label: 'Moderators' }
            ]
        default:
            return []
    }
})

const currentData = computed(() => {
    switch (activeTab.value) {
        case 'guilds':
            return guildsData.value
        case 'messages':
            return messagesData.value
        case 'users':
            return usersData.value
        default:
            return []
    }
})

const filteredData = computed(() => {
    let data = currentData.value

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        data = data.filter(item => {
            // Search in relevant fields based on tab
            switch (activeTab.value) {
                case 'guilds':
                    return item.name.toLowerCase().includes(query) ||
                        item.id.includes(query) ||
                        item.owner_name.toLowerCase().includes(query)
                case 'messages':
                    return item.content.toLowerCase().includes(query) ||
                        item.author_name.toLowerCase().includes(query) ||
                        item.channel_name.toLowerCase().includes(query)
                case 'users':
                    return item.name.toLowerCase().includes(query) ||
                        item.nickname?.toLowerCase().includes(query) ||
                        item.id.includes(query)
                default:
                    return true
            }
        })
    }

    if (filterType.value) {
        data = data.filter(item => {
            switch (activeTab.value) {
                case 'guilds':
                    return item.region === filterType.value
                case 'messages':
                    if (filterType.value === 'pinned') return item.is_pinned === 1
                    if (filterType.value === 'deleted') return item.deleted === 1
                    if (filterType.value === 'active') return item.deleted === 0 && item.is_pinned === 0
                    return true
                case 'users':
                    if (filterType.value === 'bot') return item.is_bot === 1
                    if (filterType.value === 'user') return item.is_bot === 0
                    if (filterType.value === 'moderator') return item.roles.some(r => r.name === 'Moderator')
                    return true
                default:
                    return true
            }
        })
    }

    return data
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredData.value.length))

const paginatedData = computed(() => {
    return filteredData.value.slice(startIndex.value, endIndex.value)
})

const displayedPages = computed(() => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Methods
const getTableHeaders = () => {
    switch (activeTab.value) {
        case 'guilds':
            return ['Guild', 'Owner', 'Members', 'Channels', 'Region', 'Actions']
        case 'messages':
            return ['Content', 'Author', 'Channel', 'Guild', 'Status', 'Timestamp', 'Actions']
        case 'users':
            return ['User', 'ID', 'Discriminator', 'Type', 'Roles', 'Messages', 'Actions']
        default:
            return []
    }
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date

    // If less than 24 hours, show relative time
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000)
        const minutes = Math.floor((diff % 3600000) / 60000)

        if (hours > 0) return `${hours}h ${minutes}m ago`
        if (minutes > 0) return `${minutes}m ago`
        return 'Just now'
    }

    // Otherwise show date
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const viewDetails = (item) => {
    selectedItem.value = item
    showModal.value = true
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .inline-block,
.modal-leave-active .inline-block {
    transition: all 0.3s;
}

.modal-enter-from .inline-block {
    transform: scale(0.9);
    opacity: 0;
}

.modal-leave-to .inline-block {
    transform: scale(0.9);
    opacity: 0;
}
</style>