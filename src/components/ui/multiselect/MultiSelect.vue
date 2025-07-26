// @/components/ui/multiselect/MultiSelect.vue
<script setup>
import { provide, computed } from "vue";
import { SelectRoot, useForwardPropsEmits } from "radix-vue";

const props = defineProps({
  open: { type: Boolean, required: false },
  defaultOpen: { type: Boolean, required: false },
  defaultValue: { type: Array, required: false, default: () => [] },
  modelValue: { type: Array, required: false, default: () => [] },
  dir: { type: String, required: false },
  name: { type: String, required: false },
  disabled: { type: Boolean, required: false },
  required: { type: Boolean, required: false },
});

const emits = defineEmits(["update:modelValue", "update:open"]);

// Internal state for managing selections
const selectedValues = computed({
  get: () => props.modelValue || [],
  set: (value) => emits("update:modelValue", value)
});

// Toggle selection of a value
const toggleValue = (value) => {
  const current = [...selectedValues.value];
  const index = current.indexOf(value);
  
  if (index > -1) {
    current.splice(index, 1); // Remove if already selected
  } else {
    current.push(value); // Add if not selected
  }
  
  selectedValues.value = current;
};

// Check if a value is selected
const isSelected = (value) => selectedValues.value.includes(value);

// Provide context to child components
provide('multiselect', {
  selectedValues,
  toggleValue,
  isSelected
});

// Forward props but exclude modelValue since we handle selection ourselves
const delegatedProps = computed(() => {
  const { modelValue, defaultValue, ...delegated } = props;
  return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SelectRoot v-bind="forwarded">
    <slot />
  </SelectRoot>
</template>