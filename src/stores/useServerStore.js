// @/stores/useServerStore.js
import { defineStore } from 'pinia'
import {
    ServerIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CommandLineIcon,
    FolderIcon,
    GlobeAltIcon,
} from '@heroicons/vue/24/solid'

const defaultLayout = [
    { x: 0, y: 0, w: 12, h: 3, i: 'overview' },
    { x: 0, y: 3, w: 6, h: 3, i: 'logs' },
    { x: 6, y: 3, w: 6, h: 3, i: 'metrics' },
]

const defaultComponentRegistry = {
    overview: { type: 'overview', title: 'Server Overview', iconColor: 'text-blue-400' },
    logs: { type: 'logs', title: 'Recent Logs', iconColor: 'text-blue-400' },
    metrics: { type: 'metrics', title: 'CPU Usage', iconColor: 'text-blue-400' },
}

const componentTypes = [
    { name: 'Server Overview', type: 'overview', icon: ServerIcon, iconColor: 'text-blue-400', defaultWidth: 12, defaultHeight: 3 },
    { name: 'Logs', type: 'logs', icon: ClipboardDocumentListIcon, iconColor: 'text-blue-400', defaultWidth: 6, defaultHeight: 3 },
    { name: 'CPU Metrics', type: 'metrics', icon: ChartBarIcon, iconColor: 'text-blue-400', defaultWidth: 6, defaultHeight: 3 },
    { name: 'Terminal', type: 'terminal', icon: CommandLineIcon, iconColor: 'text-green-400', defaultWidth: 6, defaultHeight: 3 },
    { name: 'File Browser', type: 'files', icon: FolderIcon, iconColor: 'text-yellow-400', defaultWidth: 6, defaultHeight: 3 },
    { name: 'Network', type: 'network', icon: GlobeAltIcon, iconColor: 'text-purple-400', defaultWidth: 6, defaultHeight: 3 },
]

const sampleData = {
    servers: [
        { name: 'Web Server', ip: '192.168.1.101', location: 'US East', status: 'online' },
        { name: 'Database', ip: '192.168.1.102', location: 'US East', status: 'online' },
        { name: 'Cache Server', ip: '192.168.1.103', location: 'US West', status: 'warning' },
        { name: 'Backup Server', ip: '192.168.1.104', location: 'EU Central', status: 'offline' },
        { name: 'CDN Node', ip: '10.0.1.200', location: 'Asia Pacific', status: 'online' },
        { name: 'Analytics', ip: '10.0.1.201', location: 'US West', status: 'online' },
    ],
    logs: [
        { type: 'error', message: 'Failed to connect to database server', time: '10:23:45' },
        { type: 'warning', message: 'High memory usage detected', time: '10:15:22' },
        { type: 'info', message: 'System update completed successfully', time: '09:58:10' },
        { type: 'info', message: 'Backup process started', time: '09:45:00' },
        { type: 'error', message: 'API endpoint timeout', time: '09:32:11' },
        { type: 'warning', message: 'SSL certificate expiring in 7 days', time: '09:01:30' },
    ],
    files: [
        { name: 'config', type: 'folder', size: '-' },
        { name: 'logs', type: 'folder', size: '-' },
        { name: 'public', type: 'folder', size: '-' },
        { name: 'server.js', type: 'file', size: '12.4 KB' },
        { name: 'package.json', type: 'file', size: '3.2 KB' },
        { name: '.env', type: 'file', size: '0.5 KB' },
        { name: 'README.md', type: 'file', size: '8.1 KB' },
        { name: 'yarn.lock', type: 'file', size: '42.6 KB' },
    ],
    cpuData: [25, 35, 40, 30, 45, 75, 65, 55, 30, 40, 50, 60],
    connections: [
        { source: '192.168.1.101', target: '192.168.1.102', protocol: 'HTTP', status: 'active' },
        { source: '192.168.1.103', target: '192.168.1.104', protocol: 'SSH', status: 'active' },
        { source: '10.0.1.200', target: '192.168.1.101', protocol: 'HTTP', status: 'active' },
        { source: '172.16.0.5', target: '192.168.1.102', protocol: 'PostgreSQL', status: 'active' },
        { source: '192.168.1.105', target: '10.0.1.201', protocol: 'HTTP', status: 'idle' },
    ],
}

export const useServerStore = defineStore('server', {
    state: () => ({
        layout: defaultLayout,
        componentRegistry: defaultComponentRegistry,
        availableComponents: componentTypes,
        servers: sampleData.servers,
        logs: sampleData.logs,
        files: sampleData.files,
        cpuData: sampleData.cpuData,
        connections: sampleData.connections,
    }),

    getters: {
        getComponentRegistry: (state) => state.componentRegistry,
        getComponentById: (state) => (id) => state.componentRegistry[id] || null,
    },

    actions: {
        updateLayout(layout) {
            this.layout = layout
        },

        addComponent(component) {
            const id = component.type === 'overview' ? 'overview' : crypto.randomUUID()
            if (this.layout.some(item => item.i === id) || this.componentRegistry[id]) return

            const maxY = Math.max(...this.layout.map(item => item.y + item.h), 0)

            this.layout.push({
                x: 0,
                y: maxY,
                w: component.defaultWidth,
                h: component.defaultHeight,
                i: id,
            })

            this.componentRegistry = {
                ...this.componentRegistry,
                [id]: {
                    type: component.type,
                    title: component.name,
                    iconColor: component.iconColor,
                },
            }
        },

        removeItem(id) {
            if (id === 'overview') return
            this.layout = this.layout.filter(item => item.i !== id)

            const newRegistry = { ...this.componentRegistry }
            delete newRegistry[id]
            this.componentRegistry = newRegistry
        },

        updateWidgetTitle({ id, title }) {
            if (this.componentRegistry[id]) {
                this.componentRegistry = {
                    ...this.componentRegistry,
                    [id]: {
                        ...this.componentRegistry[id],
                        title,
                    },
                }
            }
        },

        resetLayout() {
            this.layout = defaultLayout
            this.componentRegistry = defaultComponentRegistry
        },

        fetchServerData() {
            console.log('Fetching server data...') // Placeholder
        },

        updateMetrics() {
            const newValue = Math.floor(Math.random() * 100)
            this.cpuData.shift()
            this.cpuData.push(newValue)
        },
    },

    persist: {
        paths: ['layout', 'componentRegistry'], // Persist dashboard only, not live server data
    },
})