<!-- @/components/server/ui/DraggableComponent.vue -->
<!-- Component for sidebar draggable items -->
 <template>
  <div 
    class="p-3 bg-gray-800 rounded-lg cursor-move hover:bg-gray-700 transition-colors flex items-center gap-2 border border-gray-700"
    draggable="true" 
    @dragstart="onDragStart($event, component)"
  >
    <component :is="component.icon" class="h-5 w-5" :class="component.iconColor" />
    <span>{{ component.name }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  component: {
    type: Object,
    required: true
  }
});

function onDragStart(event, component) {
  // Set a proper drag image
  const dragImage = event.currentTarget.cloneNode(true);
  dragImage.style.opacity = "0.5";
  document.body.appendChild(dragImage);
  
  // Set all necessary data
  event.dataTransfer.setData('componentType', component.type);
  event.dataTransfer.setData('name', component.name);
  event.dataTransfer.setData('icon', component.icon.name || '');
  event.dataTransfer.setData('iconColor', component.iconColor || '');
  event.dataTransfer.setData('cols', component.defaultSize.cols.toString());
  event.dataTransfer.setData('rows', component.defaultSize.rows.toString());
  
  event.dataTransfer.setDragImage(dragImage, 0, 0);
  
  // Clean up after a short delay
  setTimeout(() => {
    document.body.removeChild(dragImage);
  }, 0);
}
</script>