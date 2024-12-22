<!-- src/App.vue -->
<template>
  <div id="app" class="flex flex-col">
    <Toaster position="bottom-right" richColors />
    <router-view class="flex" />
    <div clas="flex-grow"></div>
  </div>
</template>

<script>
import { Toaster } from '@/components/ui/sonner';

export default {
  components: {
    Toaster,
  },
};
</script>

<style>
#app {
  min-height: 100vh;
}

.router-view {
  flex-grow: 1;
}
</style>