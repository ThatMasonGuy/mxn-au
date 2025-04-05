<template>
    <div class="min-h-screen bg-gray-900 text-white">
        <!-- Sidebar -->
        <div class="fixed inset-y-0 left-0 w-52 bg-gray-800 border-r border-gray-700">
            <div class="p-4 font-bold text-xl text-blue-400">ServerDash</div>
            <div class="mt-6">
                <p class="px-4 text-xs text-gray-400 mb-2">COMPONENTS</p>
                <div v-for="(item, index) in navigationItems" :key="index"
                    class="px-4 py-3 flex items-center cursor-pointer hover:bg-gray-700"
                    :class="{ 'bg-gray-700': activeComponent === item.id }" @click="activeComponent = item.id">
                    <component :is="item.icon" class="w-5 h-5 mr-3" :class="item.color" />
                    <span>{{ item.name }}</span>
                </div>
            </div>

            <div class="absolute bottom-0 w-full p-4 border-t border-gray-700">
                <p class="text-xs text-gray-400 mb-2">SYSTEM STATUS</p>
                <div class="space-y-2">
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span>CPU</span>
                            <span>45%</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded">
                            <div class="h-full bg-green-500 rounded" style="width: 45%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span>Memory</span>
                            <span>72%</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded">
                            <div class="h-full bg-yellow-500 rounded" style="width: 72%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs mb-1">
                            <span>Disk</span>
                            <span>28%</span>
                        </div>
                        <div class="h-2 bg-gray-700 rounded">
                            <div class="h-full bg-blue-500 rounded" style="width: 28%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="ml-52 p-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold">Server Dashboard</h1>
                <div class="flex items-center gap-4">
                    <button class="bg-blue-600 px-4 py-2 rounded text-sm">Reset Layout</button>
                    <div class="w-6 h-6 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </div>
                    <div class="w-6 h-6 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
                        <span class="font-semibold">A</span>
                    </div>
                </div>
            </div>

            <!-- Main Content Widgets -->
            <div v-if="activeComponent === 'dashboard'">
                <!-- Server Overview Widget -->
                <Widget title="Server Overview" icon="server">
                    <div class="grid grid-cols-3 gap-4">
                        <div v-for="server in servers" :key="server.id" class="bg-gray-800 p-4 rounded relative">
                            <div class="absolute top-4 right-4">
                                <div :class="`w-3 h-3 rounded-full ${getStatusColor(server.status)}`"></div>
                            </div>
                            <h3 class="text-sm font-medium mb-1">{{ server.name }}</h3>
                            <p class="text-sm text-gray-400 mb-1">{{ server.ip }}</p>
                            <p class="text-xs text-gray-500">{{ server.location }}</p>
                        </div>
                    </div>
                </Widget>

                <!-- CPU Usage Widget -->
                <div class="grid grid-cols-2 gap-6 mt-6">
                    <Widget title="CPU Usage" icon="chart">
                        <div class="h-40 flex items-end">
                            <div v-for="(value, index) in cpuData" :key="index" class="w-full mx-1">
                                <div :style="`height: ${value}%`" class="bg-blue-400"></div>
                            </div>
                        </div>
                    </Widget>

                    <!-- Recent Logs Widget -->
                    <Widget title="Recent Logs" icon="document">
                        <div class="space-y-2">
                            <div v-for="(log, index) in recentLogs" :key="index" class="text-sm p-2 rounded"
                                :class="getLogClass(log.type)">
                                <div class="flex justify-between">
                                    <span>{{ log.message }}</span>
                                    <span class="text-gray-500">{{ log.time }}</span>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>

                <!-- Network Widget -->
                <Widget title="Network" icon="network" class="mt-6">
                    <div class="space-y-2 max-h-32 overflow-y-auto">
                        <div v-for="(connection, index) in networkConnections" :key="index"
                            class="flex items-center text-sm p-2 border-b border-gray-700">
                            <svg class="w-4 h-4 text-green-400 mr-2" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7.805V10a1 1 0 01-2 0V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13.5V16a1 1 0 11-2 0v-2.025A7.002 7.002 0 012.5 3.5a1 1 0 111.002-1.999 9.002 9.002 0 00.506 9.556z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span class="flex-1">{{ connection.source }} → {{ connection.target }}</span>
                            <span class="text-xs px-2 py-1 rounded bg-gray-700 mr-2">{{ connection.protocol }}</span>
                            <span class="text-xs text-green-400">active</span>
                        </div>
                    </div>
                </Widget>

                <!-- File Browser Widget -->
                <Widget title="File Browser" icon="folder" class="mt-6">
                    <div class="space-y-2 max-h-32 overflow-y-auto">
                        <div v-for="(folder, index) in folders" :key="index"
                            class="flex items-center text-sm p-2 border-b border-gray-700">
                            <svg class="w-4 h-4 text-yellow-400 mr-2" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ folder }}</span>
                        </div>
                    </div>
                </Widget>

                <!-- Terminal Widget -->
                <Widget title="Terminal" icon="terminal" class="mt-6">
                    <div class="bg-black p-4 rounded font-mono text-sm">
                        <div class="text-green-400">admin@server:~$ Welcome to ServerDash Terminal. Type "help" for
                            available commands.</div>
                        <div class="flex mt-1">
                            <span class="text-green-400">admin@server:~$</span>
                            <input v-model="terminalInput" @keydown.enter="executeCommand"
                                class="bg-transparent border-none outline-none text-white ml-1 flex-1" />
                        </div>
                    </div>
                </Widget>
            </div>

            <!-- Server Management -->
            <div v-if="activeComponent === 'server-management'">
                <div class="mb-6">
                    <h2 class="text-xl font-bold mb-4">Server Management</h2>
                    <p class="text-gray-400">Add and manage your servers for monitoring</p>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Server List -->
                    <div class="lg:col-span-1">
                        <div class="bg-gray-800 rounded-md p-4">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="font-medium">Your Servers</h3>
                                <button @click="showAddServerModal = true"
                                    class="bg-blue-600 text-xs px-3 py-1 rounded">Add New</button>
                            </div>

                            <div class="space-y-3">
                                <div v-for="server in servers" :key="server.id"
                                    class="p-3 bg-gray-700 rounded-md flex justify-between items-center cursor-pointer hover:bg-gray-600"
                                    @click="selectedServer = server">
                                    <div>
                                        <div class="flex items-center">
                                            <div :class="`w-2 h-2 rounded-full ${getStatusColor(server.status)} mr-2`">
                                            </div>
                                            <span class="font-medium">{{ server.name }}</span>
                                        </div>
                                        <div class="text-xs text-gray-400 mt-1">{{ server.ip }}</div>
                                    </div>
                                    <div class="text-xs text-gray-400">{{ server.location }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Server Details -->
                    <div class="lg:col-span-2">
                        <div class="bg-gray-800 rounded-md p-4">
                            <div v-if="selectedServer">
                                <div class="flex justify-between items-center mb-6">
                                    <h3 class="font-medium">{{ selectedServer.name }} Details</h3>
                                    <div class="flex space-x-2">
                                        <button class="bg-blue-600 text-xs px-3 py-1 rounded">Edit</button>
                                        <button class="bg-red-600 text-xs px-3 py-1 rounded">Delete</button>
                                    </div>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-xs text-gray-400 mb-1">Server Name</label>
                                            <div class="bg-gray-700 p-2 rounded">{{ selectedServer.name }}</div>
                                        </div>

                                        <div>
                                            <label class="block text-xs text-gray-400 mb-1">IP Address</label>
                                            <div class="bg-gray-700 p-2 rounded">{{ selectedServer.ip }}</div>
                                        </div>

                                        <div>
                                            <label class="block text-xs text-gray-400 mb-1">Location</label>
                                            <div class="bg-gray-700 p-2 rounded">{{ selectedServer.location }}</div>
                                        </div>
                                    </div>

                                    <div class="space-y-4">
                                        <div>
                                            <label class="block text-xs text-gray-400 mb-1">SSH Port</label>
                                            <div class="bg-gray-700 p-2 rounded">22</div>
                                        </div>

                                        <div>
                                            <label class="block text-xs text-gray-400 mb-1">Username</label>
                                            <div class="bg-gray-700 p-2 rounded">admin</div>
                                        </div>

                                        <div>
                                            <label class="block text-xs text-gray-400 mb-1">Authentication</label>
                                            <div class="bg-gray-700 p-2 rounded">SSH Key</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-6">
                                    <label class="block text-xs text-gray-400 mb-1">Status</label>
                                    <div class="flex items-center">
                                        <div
                                            :class="`w-3 h-3 rounded-full ${getStatusColor(selectedServer.status)} mr-2`">
                                        </div>
                                        <span>{{ selectedServer.status === 'ok' ? 'Online' : selectedServer.status ===
                                            'warning' ? 'Warning' : 'Offline' }}</span>
                                    </div>
                                </div>
                            </div>

                            <div v-else class="text-center py-10 text-gray-500">
                                <svg class="w-16 h-16 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                </svg>
                                <p>Select a server to view details</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- User Settings -->
            <div v-if="activeComponent === 'settings'">
                <div class="mb-6">
                    <h2 class="text-xl font-bold mb-4">User Settings</h2>
                    <p class="text-gray-400">Manage your account and preferences</p>
                </div>

                <div class="bg-gray-800 rounded-md p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Profile Settings -->
                        <div>
                            <h3 class="font-medium mb-4">Profile Settings</h3>

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm text-gray-400 mb-1">Username</label>
                                    <input type="text" v-model="userSettings.username"
                                        class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                                </div>

                                <div>
                                    <label class="block text-sm text-gray-400 mb-1">Email</label>
                                    <input type="email" v-model="userSettings.email"
                                        class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                                </div>

                                <div>
                                    <label class="block text-sm text-gray-400 mb-1">Password</label>
                                    <input type="password" value="********"
                                        class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                                </div>
                            </div>
                        </div>

                        <!-- SSH Keys -->
                        <div>
                            <h3 class="font-medium mb-4">SSH Keys</h3>

                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm text-gray-400 mb-1">Default SSH Key</label>
                                    <select v-model="userSettings.defaultSshKey"
                                        class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                                        <option v-for="key in userSettings.sshKeys" :key="key.id" :value="key.id">{{
                                            key.name }}</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm text-gray-400 mb-1">Manage SSH Keys</label>
                                    <div class="bg-gray-700 rounded border border-gray-600 max-h-40 overflow-y-auto">
                                        <div v-for="key in userSettings.sshKeys" :key="key.id"
                                            class="p-2 border-b border-gray-600 flex justify-between items-center">
                                            <div>
                                                <div class="font-medium text-sm">{{ key.name }}</div>
                                                <div class="text-xs text-gray-400">{{ key.fingerprint }}</div>
                                            </div>
                                            <button class="text-red-500 text-sm">Remove</button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <button class="bg-blue-600 px-4 py-2 rounded text-sm">Add New SSH Key</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Notification Settings -->
                    <div class="mt-8">
                        <h3 class="font-medium mb-4">Notification Settings</h3>

                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium text-sm">Email Notifications</div>
                                    <div class="text-xs text-gray-400">Receive alerts via email</div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="userSettings.emailNotifications"
                                        class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>

                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium text-sm">SMS Notifications</div>
                                    <div class="text-xs text-gray-400">Receive critical alerts via SMS</div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="userSettings.smsNotifications" class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>

                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-medium text-sm">Dashboard Notifications</div>
                                    <div class="text-xs text-gray-400">Show notifications in dashboard</div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="userSettings.dashboardNotifications"
                                        class="sr-only peer">
                                    <div
                                        class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 flex justify-end">
                        <button class="bg-blue-600 px-4 py-2 rounded text-sm">Save Settings</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Server Modal -->
        <div v-if="showAddServerModal"
            class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div class="bg-gray-800 rounded-lg w-full max-w-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg">Add New Server</h3>
                    <button @click="showAddServerModal = false" class="text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Server Name</label>
                        <input type="text" v-model="newServer.name"
                            class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-sm text-gray-400 mb-1">IP Address</label>
                        <input type="text" v-model="newServer.ip"
                            class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Server Type</label>
                        <select v-model="newServer.type"
                            class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                            <option value="web">Web Server</option>
                            <option value="db">Database</option>
                            <option value="cache">Cache Server</option>
                            <option value="backup">Backup Server</option>
                            <option value="cdn">CDN Node</option>
                            <option value="analytics">Analytics</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Location</label>
                        <select v-model="newServer.location"
                            class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                            <option value="US East">US East</option>
                            <option value="US West">US West</option>
                            <option value="EU Central">EU Central</option>
                            <option value="Asia Pacific">Asia Pacific</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Authentication Method</label>
                        <div class="flex items-center space-x-4">
                            <label class="flex items-center">
                                <input type="radio" v-model="newServer.authMethod" value="ssh" class="mr-1">
                                <span>SSH Key</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" v-model="newServer.authMethod" value="password" class="mr-1">
                                <span>Password</span>
                            </label>
                        </div>
                    </div>

                    <div v-if="newServer.authMethod === 'ssh'">
                        <label class="block text-sm text-gray-400 mb-1">SSH Key</label>
                        <select v-model="newServer.sshKey"
                            class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                            <option v-for="key in userSettings.sshKeys" :key="key.id" :value="key.id">{{ key.name }}
                            </option>
                        </select>
                    </div>

                    <div v-if="newServer.authMethod === 'password'">
                        <label class="block text-sm text-gray-400 mb-1">Password</label>
                        <input type="password" v-model="newServer.password"
                            class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                    </div>

                    <div>
                        <label class="block text-sm text-gray-400 mb-1">SSH Port</label>
                        <input type="number" v-model="newServer.sshPort"
                            class="w-full bg-gray-700 rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none">
                    </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                    <button @click="showAddServerModal = false"
                        class="px-4 py-2 border border-gray-600 rounded text-sm">Cancel</button>
                    <button @click="addNewServer" class="bg-blue-600 px-4 py-2 rounded text-sm">Add Server</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { GridLayout, GridItem } from 'vue3-grid-layout';
import {
    BellIcon,
    UserIcon,
    CogIcon,
    ServerIcon,
    CommandLineIcon,
    XCircleIcon,
    ChartBarIcon,
    ClipboardIcon,
    ArrowsPointingOutIcon,
    PencilIcon,
    FolderIcon,
    DocumentIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/solid';

// Component registry - maps IDs to component metadata
const componentRegistry = ref({
    'overview': {
        type: 'overview',
        title: 'Server Overview',
        icon: ServerIcon,
        iconColor: 'text-blue-400'
    },
    'logs': {
        type: 'logs',
        title: 'Recent Logs',
        icon: ClipboardIcon,
        iconColor: 'text-blue-400'
    },
    'cpu-chart': {
        type: 'metrics',
        title: 'CPU Usage',
        icon: ChartBarIcon,
        iconColor: 'text-blue-400'
    }
});

// Available components that can be added
const availableComponents = ref([
    {
        name: 'Terminal',
        type: 'terminal',
        icon: CommandLineIcon,
        iconColor: 'text-green-400',
        defaultSize: { w: 4, h: 2 }
    },
    {
        name: 'Metrics',
        type: 'metrics',
        icon: ChartBarIcon,
        iconColor: 'text-blue-400',
        defaultSize: { w: 4, h: 2 }
    },
    {
        name: 'File Browser',
        type: 'files',
        icon: ClipboardIcon,
        iconColor: 'text-yellow-400',
        defaultSize: { w: 4, h: 2 }
    },
    {
        name: 'Network',
        type: 'network',
        icon: ServerIcon,
        iconColor: 'text-purple-400',
        defaultSize: { w: 4, h: 2 }
    }
]);

// Initial layout configuration for GridLayout
const layout = ref([
    { x: 0, y: 0, w: 8, h: 2, i: 'overview' },
    { x: 8, y: 0, w: 4, h: 3, i: 'logs' },
    { x: 0, y: 2, w: 4, h: 1, i: 'cpu-chart' }
]);

// For editing component titles
const editingTitle = ref(null);
const titleEditValue = ref('');
const hoveredComponent = ref(null);
const titleInput = ref(null);

// Component counter for unique IDs
let componentCounter = 1;

// Server data
const servers = ref([
    { name: 'Web Server', status: 'online', ip: '192.168.1.101', location: 'US East' },
    { name: 'Database', status: 'online', ip: '192.168.1.102', location: 'US East' },
    { name: 'Cache', status: 'warning', ip: '192.168.1.103', location: 'US East' },
    { name: 'Storage', status: 'offline', ip: '192.168.1.104', location: 'US West' },
    { name: 'Load Balancer', status: 'online', ip: '192.168.1.105', location: 'EU West' },
    { name: 'CI/CD', status: 'online', ip: '192.168.1.106', location: 'Asia' }
]);

// Log data
const logs = ref([
    { type: 'error', message: 'Connection timeout on db2', time: '2m ago' },
    { type: 'info', message: 'Backup completed successfully', time: '15m ago' },
    { type: 'warning', message: 'High memory usage detected', time: '32m ago' },
    { type: 'info', message: 'User john.doe logged in', time: '1h ago' },
    { type: 'error', message: 'Failed deployment for api-v2', time: '2h ago' },
    { type: 'info', message: 'System update scheduled', time: '3h ago' }
]);

// File browser data
const files = ref([
    { name: 'config', type: 'folder', size: '' },
    { name: 'logs', type: 'folder', size: '' },
    { name: 'server.conf', type: 'file', size: '4.2 KB' },
    { name: 'nginx.conf', type: 'file', size: '8.7 KB' },
    { name: 'database.sql', type: 'file', size: '2.1 MB' },
    { name: 'backup.tar.gz', type: 'file', size: '156 MB' }
]);

// Network connections
const connections = ref([
    { source: '192.168.1.101', target: '192.168.1.102', protocol: 'TCP', status: 'ESTABLISHED' },
    { source: '192.168.1.101', target: '192.168.1.103', protocol: 'TCP', status: 'ESTABLISHED' },
    { source: '192.168.1.105', target: '192.168.1.101', protocol: 'HTTP', status: 'ACTIVE' },
    { source: '192.168.1.105', target: '8.8.8.8', protocol: 'DNS', status: 'ACTIVE' }
]);

// CPU data for the chart
const cpuData = ref([15, 25, 40, 30, 35, 55, 35, 30, 45, 60, 40, 35]);
// Active sidebar component
const activeComponent = ref('dashboard');

// Sidebar navigation items
const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: ServerIcon, color: 'text-blue-400' },
    { id: 'server-management', name: 'Servers', icon: FolderIcon, color: 'text-yellow-400' },
    { id: 'settings', name: 'Settings', icon: CogIcon, color: 'text-gray-400' },
];

// Recent logs (for dashboard)
const recentLogs = computed(() => logs.value.slice(0, 5));

// File/folder names only for File Browser Widget
const folders = computed(() => files.value.map(f => f.name));

// Network widget data
const networkConnections = computed(() => connections.value);

// Terminal
const terminalInput = ref('');
function executeCommand() {
    // Very basic terminal logic for demo purposes
    if (terminalInput.value.trim().toLowerCase() === 'help') {
        logs.value.unshift({
            type: 'info',
            message: 'Available commands: help, clear',
            time: 'just now'
        });
    } else if (terminalInput.value.trim().toLowerCase() === 'clear') {
        logs.value.splice(0, logs.value.length);
    } else {
        logs.value.unshift({
            type: 'info',
            message: `Unknown command: ${terminalInput.value}`,
            time: 'just now'
        });
    }
    terminalInput.value = '';
}

// Server selection
const selectedServer = ref(null);

// Show add server modal
const showAddServerModal = ref(false);

// New server form
const newServer = ref({
    name: '',
    ip: '',
    type: 'web',
    location: 'US East',
    authMethod: 'ssh',
    sshKey: null,
    password: '',
    sshPort: 22
});

function addNewServer() {
    servers.value.push({
        name: newServer.value.name,
        ip: newServer.value.ip,
        location: newServer.value.location,
        status: 'online'
    });
    showAddServerModal.value = false;

    // Reset form
    newServer.value = {
        name: '',
        ip: '',
        type: 'web',
        location: 'US East',
        authMethod: 'ssh',
        sshKey: null,
        password: '',
        sshPort: 22
    };
}

// User settings
const userSettings = ref({
    username: 'admin',
    email: 'admin@example.com',
    defaultSshKey: null,
    emailNotifications: true,
    smsNotifications: false,
    dashboardNotifications: true,
    sshKeys: [
        { id: 'key1', name: 'Main Key', fingerprint: 'AA:BB:CC:DD:EE:FF' },
        { id: 'key2', name: 'Backup Key', fingerprint: '11:22:33:44:55:66' }
    ]
});

// Utility to get log class
function getLogClass(type) {
    switch (type) {
        case 'error':
            return 'bg-red-600 text-white';
        case 'warning':
            return 'bg-yellow-500 text-black';
        default:
            return 'bg-gray-700 text-white';
    }
}

// Utility to get server status color
function getStatusColor(status) {
    switch (status) {
        case 'online':
        case 'ok':
            return 'bg-green-400';
        case 'warning':
            return 'bg-yellow-400';
        case 'offline':
        case 'error':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
}
</script>

<style>
/* vue3-grid-layout classes */
.vue-grid-layout {
    background: transparent;
}

.vue-grid-item {
    transition: all 200ms ease;
    transition-property: left, top, right;
}

.vue-grid-item.vue-grid-placeholder {
    background: rgba(59, 130, 246, 0.2) !important;
    border: 1px dashed #3b82f6 !important;
    z-index: 2;
    opacity: 0.8;
}

.vue-grid-item.vue-draggable-dragging {
    z-index: 10;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.vue-grid-item.vue-resizable-resizing {
    z-index: 10;
    opacity: 0.9;
}

.vue-resizable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    background: transparent;
    cursor: se-resize;
}

/* Custom styles */
.resize-handle {
    cursor: se-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.resize-handle:hover {
    background-color: rgba(59, 130, 246, 0.1);
}

.drag-handle {
    cursor: move;
}
</style>