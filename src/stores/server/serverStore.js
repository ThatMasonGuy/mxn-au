// @/stores/server/serverStore.js
import { ServerIcon, CommandLineIcon, ChartBarIcon, ClipboardIcon } from '@heroicons/vue/24/solid';
import { widgetSizeDefaults } from '@/data/server/widgetDefaults';

export const server = {
    namespaced: true,

    state: () => ({
        availableComponents: [
            {
                name: 'Terminal',
                type: 'terminal',
                icon: CommandLineIcon,
                iconColor: 'text-green-400',
                defaultSize: widgetSizeDefaults.terminal
            },
            {
                name: 'Metrics',
                type: 'metrics',
                icon: ChartBarIcon,
                iconColor: 'text-blue-400',
                defaultSize: widgetSizeDefaults.metrics
            },
            {
                name: 'File Browser',
                type: 'files',
                icon: ClipboardIcon,
                iconColor: 'text-yellow-400',
                defaultSize: widgetSizeDefaults.files
            },
            {
                name: 'Network',
                type: 'network',
                icon: ServerIcon,
                iconColor: 'text-purple-400',
                defaultSize: widgetSizeDefaults.network
            }
        ],
        dashboardComponents: [
            {
                id: 'overview',
                type: 'overview',
                title: 'Server Overview',
                icon: ServerIcon,
                iconColor: 'text-blue-400',
                size: widgetSizeDefaults.overview,
                position: { x: 0, y: 0 }
            },
            {
                id: 'logs',
                type: 'logs',
                title: 'Recent Logs',
                icon: ClipboardIcon,
                iconColor: 'text-blue-400',
                size: widgetSizeDefaults.logs,
                position: { x: 8, y: 0 }
            },
            {
                id: 'cpu-chart',
                type: 'metrics',
                title: 'CPU Usage',
                icon: ChartBarIcon,
                iconColor: 'text-blue-400',
                size: widgetSizeDefaults.metrics,
                position: { x: 0, y: 4 }
            }
        ],

        componentCounter: 1
    }),

    mutations: {
        ADD_COMPONENT(state, { component, position }) {
            const newId = `${component.type}-${state.componentCounter++}`;
            state.dashboardComponents.push({
                id: newId,
                type: component.type,
                title: component.name || `New ${component.type}`,
                icon: component.icon,
                iconColor: component.iconColor || 'text-blue-400',
                size: component.defaultSize || { cols: 2, rows: 2 },
                position: position || { x: 0, y: 0 }
            });
        },

        REMOVE_COMPONENT(state, id) {
            state.dashboardComponents = state.dashboardComponents.filter(c => c.id !== id);
        },

        UPDATE_COMPONENT(state, { id, properties }) {
            const index = state.dashboardComponents.findIndex(c => c.id === id);
            if (index !== -1) {
                state.dashboardComponents[index] = {
                    ...state.dashboardComponents[index],
                    ...properties
                };
            }
        },

        RESIZE_COMPONENT(state, { id, size }) {
            const comp = state.dashboardComponents.find(c => c.id === id);
            if (comp) {
                comp.size = { ...comp.size, ...size };
            }
        },

        UPDATE_POSITION(state, { id, position }) {
            const comp = state.dashboardComponents.find(c => c.id === id);
            if (comp) {
                comp.position = { ...comp.position, ...position };
            }
        },

        RESET_COMPONENT_SIZE(state, id) {
            const comp = state.dashboardComponents.find(c => c.id === id);
            if (comp) {
                const defaultSize = widgetSizeDefaults[comp.type];
                if (defaultSize) {
                    comp.size = { ...defaultSize };
                }
            }
        }
    },

    actions: {
        addComponent({ commit }, { component, position }) {
            commit('ADD_COMPONENT', { component, position });
        },
        removeComponent({ commit }, id) {
            commit('REMOVE_COMPONENT', id);
        },
        updateComponent({ commit }, { id, properties }) {
            commit('UPDATE_COMPONENT', { id, properties });
        },
        resizeComponent({ commit }, { id, size }) {
            commit('RESIZE_COMPONENT', { id, size });
        },
        updatePosition({ commit }, { id, position }) {
            commit('UPDATE_POSITION', { id, position });
        },
        resetComponentSize({ commit }, id) {
            commit('RESET_COMPONENT_SIZE', id);
        }
    },

    getters: {
        getDefaultSizeForType: () => (type) => {
            return widgetSizeDefaults[type] || { cols: 2, rows: 2 };
        }
    }
};