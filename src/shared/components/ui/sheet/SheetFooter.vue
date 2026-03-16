<script setup>
import { cn } from "@/features/topheroes/lib/utils";

const props = defineProps();
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
