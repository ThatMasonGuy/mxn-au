<template>
    <nav class="flex items-center gap-1 px-4 py-2 bg-zinc-900 border-b border-zinc-700 flex-shrink-0">
        <router-link v-for="link in links" :key="link.name" :to="{ name: link.name }" :class="[
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
            $route.name === link.name
                ? 'bg-zinc-700 text-zinc-100 border border-zinc-600'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
        ]">
            <component :is="link.icon" :size="13" />
            {{ link.label }}
        </router-link>
    </nav>
</template>

<script setup>
import { CalendarDays, ListTodo, CalendarRange, Settings2 } from 'lucide-vue-next'

const links = [
    { name: 'personal-todo', label: 'Today', icon: CalendarDays },
    { name: 'personal-todo-tasks', label: 'All tasks', icon: ListTodo },
    { name: 'personal-todo-days', label: 'Timeline', icon: CalendarRange },
    { name: 'personal-todo-settings', label: 'Settings', icon: Settings2 },
]
</script>