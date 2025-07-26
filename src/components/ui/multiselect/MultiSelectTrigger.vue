// @/components/ui/multiselect/MultiSelectTrigger.vue
<script setup>
import { computed, inject } from "vue";
import { SelectTrigger, useForwardProps } from "radix-vue";
import { CaretSortIcon } from "@radix-icons/vue";
import { cn } from "@/lib/utils";

const props = defineProps({
  disabled: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
  placeholder: { type: String, required: false, default: "Select items..." },
  maxDisplay: { type: Number, required: false, default: 2 }
});

const multiselect = inject('multiselect');

const delegatedProps = computed(() => {
  const { class: _, placeholder: __, maxDisplay: ___, ...delegated } = props;
  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);

const displayText = computed(() => {
  const selected = multiselect.selectedValues.value;
  if (selected.length === 0) {
    return props.placeholder;
  }
  
  if (selected.length <= props.maxDisplay) {
    return selected.join(", ");
  }
  
  return `${selected.slice(0, props.maxDisplay).join(", ")} +${selected.length - props.maxDisplay} more`;
});
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
    <span :class="multiselect.selectedValues.value.length === 0 ? 'text-muted-foreground' : ''">
      {{ displayText }}
    </span>
    <CaretSortIcon class="w-4 h-4 opacity-50" />
  </SelectTrigger>
</template>