// @/components/ui/select/SelectTrigger.vue
<script setup>
import { computed } from "vue";
import { SelectIcon, SelectTrigger, useForwardProps } from "radix-vue";
import { CaretSortIcon } from "@radix-icons/vue";
import { cn } from "@/lib/utils";

const props = defineProps({
  disabled: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <SelectTrigger
    v-bind="forwardedProps"
    :class="
      cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        props.class
      )
    "
  >
    <slot />
    <SelectIcon as-child>
      <CaretSortIcon class="w-4 h-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
