// @/components/ui/multiselect/MultiSelectItem.vue
<script setup>
import { computed, inject } from "vue";
import { CheckIcon } from "@radix-icons/vue";
import { cn } from "@/lib/utils";

const props = defineProps({
  value: { type: String, required: true },
  disabled: { type: Boolean, required: false },
  class: { type: null, required: false },
});

const multiselect = inject('multiselect');

const isSelected = computed(() => multiselect.isSelected(props.value));

const handleClick = () => {
  if (!props.disabled) {
    multiselect.toggleValue(props.value);
  }
};
</script>

<template>
  <div
    @click="handleClick"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        {
          'cursor-not-allowed opacity-50': props.disabled
        },
        props.class
      )
    "
  >
    <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <CheckIcon 
        v-if="isSelected" 
        class="h-4 w-4" 
      />
    </span>

    <slot />
  </div>
</template>