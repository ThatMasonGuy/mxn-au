<!-- @/pages/server/Dashboard.vue -->
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
    <div class="flex h-screen">
      <Sidebar :available-components="availableComponents" @add-component="addComponent" />

      <div class="flex-1 overflow-auto p-6">
        <Header @reset-layout="resetLayout" />

        <grid-layout v-model:layout="layout" :col-num="12" :row-height="100" :is-draggable="true" :is-resizable="true"
          :vertical-compact="true" :use-css-transforms="true" :responsive="true" :margin="[16, 16]" class="bg-gray-900">
          <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i"
            :min-w="1" :min-h="1">
            <component :is="getWidgetComponent(item.i)" :widget-id="item.i" @remove="removeItem" />
          </grid-item>
        </grid-layout>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { GridLayout, GridItem } from 'vue3-grid-layout'

import Sidebar from '@/components/server/layout/Sidebar.vue'
import Header from '@/components/server/layout/Header.vue'

import ServerOverviewWidget from '@/components/server/widgets/ServerOverviewWidget.vue'
import LogsWidget from '@/components/server/widgets/LogsWidget.vue'
import MetricsWidget from '@/components/server/widgets/MetricsWidget.vue'
import TerminalWidget from '@/components/server/widgets/TerminalWidget.vue'
import FileBrowserWidget from '@/components/server/widgets/FileBrowserWidget.vue'
import NetworkWidget from '@/components/server/widgets/NetworkWidget.vue'

const store = useStore()
const layout = computed({
  get: () => store.state.server.layout,
  set: (val) => store.commit('server/SET_LAYOUT', val),
})

const availableComponents = computed(() => store.state.server.availableComponents)
const componentRegistry = computed(() => store.getters['server/getComponentRegistry'])

const addComponent = component => store.dispatch('server/addComponent', component)
const removeItem = id => store.dispatch('server/removeItem', id)
const resetLayout = () => store.dispatch('server/resetLayout')

const getWidgetComponent = id => {
  const type = componentRegistry.value[id]?.type

  switch (type) {
    case 'overview': return ServerOverviewWidget
    case 'logs': return LogsWidget
    case 'metrics': return MetricsWidget
    case 'terminal': return TerminalWidget
    case 'files': return FileBrowserWidget
    case 'network': return NetworkWidget
    default: return null
  }
}
</script>

<style>
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
</style>