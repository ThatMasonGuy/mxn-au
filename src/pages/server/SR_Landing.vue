<template>
    <div id="landing"
        class="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col font-sans selection:bg-emerald-400/30">
        <!-- HEADER -->
        <header class="border-b border-white/5">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
                <!-- Breadcrumb-style path -->
                <h1 class="flex items-center gap-2 font-mono text-lg tracking-tight">
                    <span class="text-emerald-400">mxn.au</span>
                    <span class="opacity-40">/</span>
                    <span>server</span>
                </h1>

                <button class="rounded-md border border-emerald-400/70 px-4 py-1 text-sm font-mono tracking-wider transition
                   hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/70">
                    [ LOGIN ]
                </button>
            </div>
        </header>

        <!-- HERO -->
        <section class="border-b border-white/5">
            <div class="mx-auto max-w-7xl grid gap-12 px-4 py-20 lg:grid-cols-2">
                <!-- Copy -->
                <div class="space-y-6">
                    <h2 class="flex items-center font-mono text-4xl">
                        <span class="mr-3 text-emerald-400">&gt;</span>
                        Server Admin Panel
                        <span class="ml-2 animate-pulse text-emerald-400">▌</span>
                    </h2>

                    <p class="max-w-prose text-gray-400">
                        Self-hosted. Shell-centric. Overkill (in the best possible way).
                    </p>

                    <button class="group relative inline-flex items-center overflow-hidden rounded-md border border-emerald-500 px-6 py-2
                     font-mono tracking-wider transition hover:text-gray-900">
                        <span class="absolute inset-0 -z-10 translate-y-full bg-emerald-400 transition-transform duration-300
                       group-hover:translate-y-0"></span>
                        [ OPEN&nbsp;DASHBOARD ]
                    </button>
                </div>

                <!-- Fake terminal window -->
                <div
                    class="relative h-64 overflow-hidden rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-sm backdrop-blur">
                    <div class="mb-2 flex items-center">
                        <div class="mr-2 h-3 w-3 animate-pulse rounded-full bg-emerald-400"></div>
                        <span class="text-emerald-300">~ server-connection</span>
                    </div>

                    <pre class="space-y-0.5 text-emerald-200">
  <span>$ ssh admin@mxn.au</span>
  <span class="text-gray-500">Authenticating via SSH key…</span>
  <span class="text-gray-500">Connection established</span>
  <span>$ ps aux | grep nginx</span>
  <span class="text-gray-400">root      1234 … nginx: master process</span>
  <span class="text-gray-400">www-data  5678 … nginx: worker process</span>
  <span>$ systemctl status postgresql</span>
  <span class="text-emerald-200">● postgresql.service - PostgreSQL RDBMS</span>
  <span class="text-gray-400">   Loaded:  loaded (/lib/systemd/system/postgresql.service)</span>
  <span class="text-emerald-200">   Active:  active (running)</span>
  <span class="animate-pulse">$</span>
            </pre>
                </div>
            </div>
        </section>

        <!-- ABOUT -->
        <section class="border-b border-white/5 bg-[#161b22]">
            <div class="mx-auto flex max-w-7xl items-start gap-4 px-4 py-12">
                <span class="mt-1 font-mono text-emerald-400">$</span>
                <p class="text-gray-300">
                    Remote management interface for Linux servers with shell access. Execute commands, browse file
                    systems, monitor processes, and deploy code—all from a terminal-centric GUI.
                </p>
            </div>
        </section>

        <!-- TOOLS GRID -->
        <section class="border-b border-white/5">
            <div class="mx-auto max-w-7xl px-4 py-20">
                <h2 class="mb-10 flex items-center font-mono text-xl">
                    <span class="mr-3 text-emerald-400">&gt;</span> Available&nbsp;Tools
                </h2>

                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <ToolCard v-for="tool in tools" :key="tool.title" v-bind="tool" />
                </div>
            </div>
        </section>

        <!-- FOOTER CTA -->
        <footer class="bg-[#161b22] py-14">
            <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 md:flex-row">
                <div>
                    <div class="mb-2 flex items-center">
                        <span class="mr-2 font-mono text-emerald-400">$</span>
                        <code
                            class="rounded bg-[#0d1117] px-3 py-1 font-mono text-sm text-gray-200 ring-1 ring-inset ring-white/10">
                open&nbsp;mxn.au/server
              </code>
                    </div>
                    <p class="text-xs text-gray-400">Access your server administration panel</p>
                </div>

                <button class="rounded-md border border-emerald-400/70 px-6 py-2 font-mono tracking-wider transition
                   hover:bg-emerald-400/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/70">
                    [ LAUNCH PANEL ]
                </button>
            </div>
        </footer>
    </div>
</template>

<script setup>
import {
    CommandLineIcon,
    FolderOpenIcon,
    CodeBracketIcon,
    ServerIcon,
    DocumentTextIcon,
    CpuChipIcon,
    CloudArrowUpIcon,
    KeyIcon
} from '@heroicons/vue/24/outline'
import ToolCard from '@/components/server/ToolCard.vue'

const tools = [
    {
        icon: CommandLineIcon,
        title: 'SSH Console',
        desc: 'Secure shell terminal with history, autocompletion & multi-server support.'
    },
    {
        icon: FolderOpenIcon,
        title: 'File Tree',
        desc: 'Browse, edit & manage files with inline preview and search.'
    },
    {
        icon: CodeBracketIcon,
        title: 'Deploy Hook Runner',
        desc: 'Execute deployment scripts with live output streaming and history.'
    },
    {
        icon: ServerIcon,
        title: 'Service Health',
        desc: 'Monitor process status, restart services & view resource usage.'
    },
    {
        icon: DocumentTextIcon,
        title: 'Log Streaming',
        desc: 'Aggregate logs in real-time with powerful filters.'
    },
    {
        icon: CpuChipIcon,
        title: 'System Stats',
        desc: 'CPU, memory, disk & network utilisation with trends.'
    },
    {
        icon: CloudArrowUpIcon,
        title: 'Backup Manager',
        desc: 'Schedule automated backups with compression & remote storage.'
    },
    {
        icon: KeyIcon,
        title: 'Auth Manager',
        desc: 'SSH key registration & management with access logs.'
    }
]
</script>