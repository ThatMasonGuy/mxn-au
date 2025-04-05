// @/store/modules/dashboard.js
import { v4 as uuidv4 } from 'uuid';
import {
    ServerIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    CommandLineIcon,
    FolderIcon,
    GlobeAltIcon,
} from '@heroicons/vue/24/solid';

const defaultLayout = [
    { x: 0, y: 0, w: 12, h: 3, i: 'overview' },
    { x: 0, y: 3, w: 6, h: 3, i: 'logs' },
    { x: 6, y: 3, w: 6, h: 3, i: 'metrics' },
];

const defaultComponentRegistry = {
    overview: {
        type: 'overview',
        title: 'Server Overview',
        iconColor: 'text-blue-400',
    },
    logs: {
        type: 'logs',
        title: 'Recent Logs',
        iconColor: 'text-blue-400',
    },
    metrics: {
        type: 'metrics',
        title: 'CPU Usage',
        iconColor: 'text-blue-400',
    },
};

const componentTypes = [
    {
        name: 'Server Overview',
        type: 'overview',
        icon: ServerIcon,
        iconColor: 'text-blue-400',
        defaultWidth: 12,
        defaultHeight: 3,
    },
    {
        name: 'Logs',
        type: 'logs',
        icon: ClipboardDocumentListIcon,
        iconColor: 'text-blue-400',
        defaultWidth: 6,
        defaultHeight: 3,
    },
    {
        name: 'CPU Metrics',
        type: 'metrics',
        icon: ChartBarIcon,
        iconColor: 'text-blue-400',
        defaultWidth: 6,
        defaultHeight: 3,
    },
    {
        name: 'Terminal',
        type: 'terminal',
        icon: CommandLineIcon,
        iconColor: 'text-green-400',
        defaultWidth: 6,
        defaultHeight: 3,
    },
    {
        name: 'File Browser',
        type: 'files',
        icon: FolderIcon,
        iconColor: 'text-yellow-400',
        defaultWidth: 6,
        defaultHeight: 3,
    },
    {
        name: 'Network',
        type: 'network',
        icon: GlobeAltIcon,
        iconColor: 'text-purple-400',
        defaultWidth: 6,
        defaultHeight: 3,
    },
];

const sampleData = {
    servers: [
        {
            name: 'Web Server',
            ip: '192.168.1.101',
            location: 'US East',
            status: 'online',
        },
        {
            name: 'Database',
            ip: '192.168.1.102',
            location: 'US East',
            status: 'online',
        },
        {
            name: 'Cache Server',
            ip: '192.168.1.103',
            location: 'US West',
            status: 'warning',
        },
        {
            name: 'Backup Server',
            ip: '192.168.1.104',
            location: 'EU Central',
            status: 'offline',
        },
        {
            name: 'CDN Node',
            ip: '10.0.1.200',
            location: 'Asia Pacific',
            status: 'online',
        },
        {
            name: 'Analytics',
            ip: '10.0.1.201',
            location: 'US West',
            status: 'online',
        },
    ],
    logs: [
        {
            type: 'error',
            message: 'Failed to connect to database server',
            time: '10:23:45',
        },
        {
            type: 'warning',
            message: 'High memory usage detected',
            time: '10:15:22',
        },
        {
            type: 'info',
            message: 'System update completed successfully',
            time: '09:58:10',
        },
        {
            type: 'info',
            message: 'Backup process started',
            time: '09:45:00',
        },
        {
            type: 'error',
            message: 'API endpoint timeout',
            time: '09:32:11',
        },
        {
            type: 'warning',
            message: 'SSL certificate expiring in 7 days',
            time: '09:01:30',
        },
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
        {
            source: '192.168.1.101',
            target: '192.168.1.102',
            protocol: 'HTTP',
            status: 'active',
        },
        {
            source: '192.168.1.103',
            target: '192.168.1.104',
            protocol: 'SSH',
            status: 'active',
        },
        {
            source: '10.0.1.200',
            target: '192.168.1.101',
            protocol: 'HTTP',
            status: 'active',
        },
        {
            source: '172.16.0.5',
            target: '192.168.1.102',
            protocol: 'PostgreSQL',
            status: 'active',
        },
        {
            source: '192.168.1.105',
            target: '10.0.1.201',
            protocol: 'HTTP',
            status: 'idle',
        },
    ],
};

function getMaxY(layout) {
    return Math.max(...layout.map(item => item.y + item.h), 0)
}

export const server = {
    namespaced: true,

    state: () => ({
        layout: JSON.parse(localStorage.getItem('dashboardLayout')) || defaultLayout,
        componentRegistry: JSON.parse(localStorage.getItem('dashboardRegistry')) || defaultComponentRegistry,
        availableComponents: componentTypes,
        servers: sampleData.servers,
        logs: sampleData.logs,
        files: sampleData.files,
        cpuData: sampleData.cpuData,
        connections: sampleData.connections,
    }),

    getters: {
        getComponentRegistry(state) {
            return state.componentRegistry;
        },
        getComponentById: (state) => (id) => {
            return state.componentRegistry[id] || null;
        },
    },

    mutations: {
        SET_LAYOUT(state, layout) {
            state.layout = layout;
            localStorage.setItem('dashboardLayout', JSON.stringify(layout));
        },
        ADD_COMPONENT(state, { component, id }) {
            state.componentRegistry = {
                ...state.componentRegistry,
                [id]: {
                    type: component.type,
                    title: component.name,
                    iconColor: component.iconColor,
                },
            };
            localStorage.setItem('dashboardRegistry', JSON.stringify(state.componentRegistry));
        },
        REMOVE_COMPONENT(state, id) {
            const newRegistry = { ...state.componentRegistry };
            delete newRegistry[id];
            state.componentRegistry = newRegistry;
            localStorage.setItem('dashboardRegistry', JSON.stringify(state.componentRegistry));
        },
        UPDATE_WIDGET_TITLE(state, { id, title }) {
            if (state.componentRegistry[id]) {
                state.componentRegistry = {
                    ...state.componentRegistry,
                    [id]: {
                        ...state.componentRegistry[id],
                        title,
                    },
                };
                localStorage.setItem('dashboardRegistry', JSON.stringify(state.componentRegistry));
            }
        },
        RESET_DASHBOARD(state) {
            state.layout = defaultLayout;
            state.componentRegistry = defaultComponentRegistry;
            localStorage.setItem('dashboardLayout', JSON.stringify(defaultLayout));
            localStorage.setItem('dashboardRegistry', JSON.stringify(defaultComponentRegistry));
        },
        UPDATE_METRICS(state, newValue) {
            state.cpuData.shift();
            state.cpuData.push(newValue);
        },
    },

    actions: {
        updateLayout({ commit }, layout) {
            commit('SET_LAYOUT', layout);
        },
        addComponent({ commit, state }, component) {
            const id = component.type === 'overview' ? 'overview' : crypto.randomUUID();
            if (state.layout.some(item => item.i === id) || state.componentRegistry[id]) return;

            const maxY = Math.max(...state.layout.map(item => item.y + item.h), 0);

            const newLayoutItem = {
                x: 0,
                y: maxY,
                w: component.defaultWidth,
                h: component.defaultHeight,
                i: id,
            };

            commit('SET_LAYOUT', [...state.layout, newLayoutItem]);
            commit('ADD_COMPONENT', { component, id });
        },
        removeItem({ commit, state }, id) {
            if (id === 'overview') return;
            const newLayout = state.layout.filter(item => item.i !== id);
            commit('SET_LAYOUT', newLayout);
            commit('REMOVE_COMPONENT', id);
        },
        updateWidgetTitle({ commit }, payload) {
            commit('UPDATE_WIDGET_TITLE', payload);
        },
        resetLayout({ commit }) {
            commit('RESET_DASHBOARD');
        },
        fetchServerData() {
            console.log('Fetching server data...');
        },
        updateMetrics({ commit }) {
            const newValue = Math.floor(Math.random() * 100);
            commit('UPDATE_METRICS', newValue);
        },
    },
};