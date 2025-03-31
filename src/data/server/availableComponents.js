// @/data/server/availableComponents.js
// Available component configuration for the sidebar

import { ServerIcon, CommandLineIcon, ChartBarIcon, ClipboardIcon } from '@heroicons/vue/24/solid';

export const availableComponents = [
    {
        name: 'Terminal',
        type: 'terminal',
        icon: CommandLineIcon,
        iconColor: 'text-green-400',
        defaultSize: { cols: 4, rows: 2 }
    },
    {
        name: 'Metrics',
        type: 'metrics',
        icon: ChartBarIcon,
        iconColor: 'text-blue-400',
        defaultSize: { cols: 2, rows: 2 }
    },
    {
        name: 'File Browser',
        type: 'files',
        icon: ClipboardIcon,
        iconColor: 'text-yellow-400',
        defaultSize: { cols: 4, rows: 2 }
    },
    {
        name: 'Network',
        type: 'network',
        icon: ServerIcon,
        iconColor: 'text-purple-400',
        defaultSize: { cols: 4, rows: 2 }
    }
];