<template>
  <div class="relative">
    <!-- Input Connection Points -->
    <div v-for="(port, index) in inputPorts" :key="`input-${index}`"
         @mouseup.stop="handleInputPortClick(index)"
         class="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white cursor-crosshair hover:scale-125 transition z-10"
         :class="{ 'ring-2 ring-blue-300': hasInputConnection(index) }"
         :style="{ left: '-12px', top: `${port.y}px` }"
         :title="`Input ${index + 1}${port.item ? ': ' + port.item : ''}`">
    </div>
    
    <!-- Output Connection Points -->
    <div v-for="(port, index) in outputPorts" :key="`output-${index}`"
         @mousedown.stop="handleOutputPortClick(index, $event)"
         class="absolute w-6 h-6 bg-orange-500 rounded-full border-2 border-white cursor-crosshair hover:scale-125 transition z-10"
         :class="{ 'ring-2 ring-orange-300': hasOutputConnection(index) }"
         :style="{ right: '-12px', top: `${port.y}px` }"
         :title="`Output ${index + 1}`">
    </div>

    <!-- Node Card -->
    <div class="w-[300px] bg-slate-800 rounded-lg border-2 shadow-xl relative min-h-[200px]"
         :class="[
           node.dragging ? 'border-orange-500 shadow-orange-500/50' : 'border-slate-600',
           nodeTypeColor,
           efficiencyGlow
         ]">
      
      <!-- Header -->
      <div class="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <component :is="getIcon()" class="w-5 h-5" :class="iconColor" />
          <h3 class="font-semibold text-sm">{{ node.name }}</h3>
        </div>
        <button @click.stop="$emit('delete', node.id)" 
                class="p-1 hover:bg-red-600 rounded transition">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-4 space-y-3">
        
        <!-- Resource Node Settings -->
        <div v-if="node.type === 'resource'" class="space-y-3">
          <div>
            <label class="text-xs text-slate-400 block mb-1">Resource Type</label>
            <select v-model="selectedResourceType"
                    @change="updateResourceType"
                    class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm">
              <option value="iron">Iron Ore</option>
              <option value="copper">Copper Ore</option>
              <option value="limestone">Limestone</option>
              <option value="coal">Coal</option>
              <option value="caterium">Caterium Ore</option>
              <option value="bauxite">Bauxite</option>
              <option value="rawQuartz">Raw Quartz</option>
              <option value="sulfur">Sulfur</option>
              <option value="uranium">Uranium</option>
              <option value="crude">Crude Oil</option>
              <option value="water">Water</option>
              <option value="nitrogen">Nitrogen Gas</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-slate-400 block mb-1">Node Purity</label>
            <div class="flex gap-2">
              <button v-for="purity in ['impure', 'normal', 'pure']" :key="purity"
                      @click.stop="updatePurity(purity)"
                      class="flex-1 px-3 py-2 rounded text-sm transition"
                      :class="node.purity === purity 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'">
                {{ purity.charAt(0).toUpperCase() + purity.slice(1) }}
              </button>
            </div>
          </div>

          <div>
            <label class="text-xs text-slate-400 block mb-1">Miner Tier</label>
            <div class="flex gap-2">
              <button v-for="tier in ['mk1', 'mk2', 'mk3']" :key="tier"
                      @click.stop="updateMinerType(tier)"
                      class="flex-1 px-3 py-2 rounded text-sm transition"
                      :class="node.minerType === tier 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'">
                {{ tier.toUpperCase() }}
              </button>
            </div>
          </div>
        </div>

        <!-- Recipe Selection -->
        <div v-if="node.recipes && node.recipes.length > 0 && node.type !== 'resource'">
          <label class="text-xs text-slate-400 block mb-1">Recipe</label>
          <select v-model="selectedRecipe"
                  @change="updateRecipe"
                  class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm">
            <option v-for="recipe in availableRecipes" :key="recipe.name" :value="recipe">
              {{ recipe.name }} {{ recipe.isAlternate ? '(Alt)' : '' }}
            </option>
          </select>
        </div>

        <!-- Smart Splitter Filters -->
        <div v-if="node.type === 'smart-splitter'" class="space-y-2">
          <label class="text-xs text-slate-400 block">Output Filters</label>
          <div v-for="(filter, index) in node.splitterFilters" :key="index" class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-500 w-16">Output {{ index + 1 }}:</span>
              <select v-model="node.splitterFilters[index].item"
                      class="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs">
                <option :value="undefined">Any</option>
                <option v-for="item in getAllItems()" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Clock Speed (not for logistics/storage) -->
        <div v-if="showClockSpeed">
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs text-slate-400">Clock Speed</label>
            <span class="text-sm font-mono" :class="clockSpeedColor">{{ node.clockSpeed }}%</span>
          </div>
          <input type="range" 
                 v-model.number="clockSpeed"
                 @input="updateClockSpeed"
                 min="10" 
                 max="250" 
                 step="1"
                 class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider">
          <div class="flex justify-between text-xs text-slate-500 mt-1">
            <span>10%</span>
            <span>100%</span>
            <span>250%</span>
          </div>
        </div>

        <!-- Inputs/Outputs Display -->
        <div v-if="actualThroughput && (actualThroughput.inputs.length > 0 || actualThroughput.outputs.length > 0)" class="text-xs bg-slate-700/50 rounded p-3 space-y-2">
          <div v-if="actualThroughput.inputs.length > 0">
            <div class="text-slate-400 mb-1 flex items-center">
              <ArrowDownCircle class="w-3 h-3 mr-1" />
              Inputs:
            </div>
            <div class="space-y-1">
              <div v-for="input in actualThroughput.inputs" :key="input.item" 
                   class="flex justify-between items-center">
                <span class="flex items-center gap-1">
                  <Package class="w-3 h-3 text-blue-400" />
                  {{ input.item }}:
                </span>
                <span class="font-mono text-blue-300">
                  {{ input.rate.toFixed(1) }}/min
                </span>
              </div>
            </div>
          </div>
          <div v-if="actualThroughput.outputs.length > 0">
            <div class="text-slate-400 mb-1 flex items-center">
              <ArrowUpCircle class="w-3 h-3 mr-1" />
              Output:
            </div>
            <div class="space-y-1">
              <div v-for="output in actualThroughput.outputs" :key="output.item" 
                   class="flex justify-between items-center">
                <span class="flex items-center gap-1">
                  <Package class="w-3 h-3 text-orange-400" />
                  {{ output.item }}:
                </span>
                <span class="font-mono text-orange-300">
                  {{ output.rate.toFixed(1) }}/min
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Power Consumption -->
        <div v-if="node.powerUsage && showClockSpeed" 
             class="flex items-center justify-between text-sm bg-slate-700/50 rounded p-2">
          <span class="text-slate-400 flex items-center gap-2">
            <Zap class="w-4 h-4 text-yellow-400" />
            Power
          </span>
          <span class="font-mono">{{ currentPowerUsage.toFixed(2) }} MW</span>
        </div>

        <!-- Efficiency Display -->
        <div v-if="showEfficiency" 
             class="flex items-center justify-between text-sm bg-slate-700/50 rounded p-2">
          <span class="text-slate-400 flex items-center gap-2">
            <Activity class="w-4 h-4 text-green-400" />
            Efficiency
          </span>
          <span class="font-mono" :class="efficiencyColor">{{ efficiency.toFixed(1) }}%</span>
        </div>

        <!-- Belt Speed Selector (always visible for outputs) -->
        <div v-if="connections.outputs.length > 0" class="space-y-2">
          <label class="text-xs text-slate-400 block">Belt Speed</label>
          <div class="grid grid-cols-5 gap-1">
            <button v-for="speed in ['mk1', 'mk2', 'mk3', 'mk4', 'mk5']" :key="speed"
                    @click.stop="updateBeltSpeed(speed)"
                    class="px-2 py-1 rounded text-xs transition font-semibold"
                    :style="{ 
                      backgroundColor: node.beltSpeed === speed ? getBeltColor(speed) : '',
                      color: node.beltSpeed === speed ? 'white' : ''
                    }"
                    :class="node.beltSpeed !== speed ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : ''">
              {{ speed.replace('mk', '') }}
            </button>
          </div>
          <div class="text-xs text-center" :style="{ color: getBeltColor(node.beltSpeed || 'mk1') }">
            Max: {{ getBeltMaxThroughput(node.beltSpeed || 'mk1') }}/min
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { 
  X, Package, Zap, Activity, Factory, Mountain, Split, Combine, 
  Hammer, Wrench, Cpu, Beaker, Droplet, Box, ArrowDownCircle, ArrowUpCircle
} from 'lucide-vue-next';

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  connections: {
    type: Object,
    default: () => ({ inputs: [], outputs: [] })
  },
  inputPortCount: {
    type: Number,
    default: 1
  },
  outputPortCount: {
    type: Number,
    default: 1
  },
  actualThroughput: {
    type: Object,
    default: () => ({ inputs: [], outputs: [] })
  }
});

const emit = defineEmits(['update', 'delete', 'connect-start', 'connect-end', 'update-belt']);

const clockSpeed = ref(props.node.clockSpeed || 100);
const selectedRecipe = ref(props.node.selectedRecipe);
const selectedResourceType = ref('iron');

watch(() => props.node.clockSpeed, (newVal) => {
  clockSpeed.value = newVal;
});

const cardHeight = computed(() => {
  // Baseline heights for port positioning
  if (props.node.type === 'splitter' || props.node.type === 'merger' || props.node.type === 'smart-splitter') {
    return 250; // Taller baseline for logistics with multiple ports
  }
  return 200; // Standard baseline height
});

const showClockSpeed = computed(() => {
  return props.node.type !== 'splitter' && 
         props.node.type !== 'merger' && 
         props.node.type !== 'smart-splitter' && 
         props.node.type !== 'storage';
});

const showEfficiency = computed(() => {
  return props.node.selectedRecipe && showClockSpeed.value;
});

const inputPorts = computed(() => {
  const ports = [];
  const count = props.inputPortCount;
  const height = cardHeight.value;
  const spacing = count > 1 ? height / (count + 1) : height / 2;
  
  for (let i = 0; i < count; i++) {
    let itemType = null;
    if (props.node.selectedRecipe && props.node.selectedRecipe.inputs && props.node.selectedRecipe.inputs[i]) {
      itemType = props.node.selectedRecipe.inputs[i].item;
    }
    
    ports.push({
      y: spacing * (i + 1),
      item: itemType
    });
  }
  return ports;
});

const outputPorts = computed(() => {
  const ports = [];
  const count = props.outputPortCount;
  const height = cardHeight.value;
  const spacing = count > 1 ? height / (count + 1) : height / 2;
  
  for (let i = 0; i < count; i++) {
    ports.push({
      y: spacing * (i + 1)
    });
  }
  return ports;
});

const hasInputConnection = (portIndex) => {
  return props.connections.inputs.some(c => c.toPort === portIndex);
};

const hasOutputConnection = (portIndex) => {
  return props.connections.outputs.some(c => c.fromPort === portIndex);
};

const handleInputPortClick = (portIndex) => {
  const portY = inputPorts.value[portIndex].y;
  emit('connect-end', {
    nodeId: props.node.id,
    portIndex,
    x: props.node.x,
    y: props.node.y + portY,
    isOutput: false
  });
};

const handleOutputPortClick = (portIndex, event) => {
  event.preventDefault();
  const portY = outputPorts.value[portIndex].y;
  emit('connect-start', {
    nodeId: props.node.id,
    portIndex,
    x: props.node.x + 300,
    y: props.node.y + portY,
    isOutput: true
  });
};

const updateClockSpeed = () => {
  emit('update', props.node.id, { clockSpeed: clockSpeed.value });
};

const updateRecipe = () => {
  emit('update', props.node.id, { selectedRecipe: selectedRecipe.value });
};

const updatePurity = (purity) => {
  emit('update', props.node.id, { purity });
};

const updateMinerType = (minerType) => {
  emit('update', props.node.id, { minerType });
};

const updateBeltSpeed = (speed) => {
  emit('update', props.node.id, { beltSpeed: speed });
  props.connections.outputs.forEach((conn, index) => {
    emit('update-belt', props.node.id, index, true, speed);
  });
};

const updateResourceType = () => {
  const resourceRecipes = {
    iron: { name: 'Iron Ore', output: { item: 'Iron Ore', amount: 60 } },
    copper: { name: 'Copper Ore', output: { item: 'Copper Ore', amount: 60 } },
    limestone: { name: 'Limestone', output: { item: 'Limestone', amount: 60 } },
    coal: { name: 'Coal', output: { item: 'Coal', amount: 60 } },
    caterium: { name: 'Caterium Ore', output: { item: 'Caterium Ore', amount: 60 } },
    bauxite: { name: 'Bauxite', output: { item: 'Bauxite', amount: 60 } },
    rawQuartz: { name: 'Raw Quartz', output: { item: 'Raw Quartz', amount: 60 } },
    sulfur: { name: 'Sulfur', output: { item: 'Sulfur', amount: 60 } },
    uranium: { name: 'Uranium', output: { item: 'Uranium', amount: 60 } },
    crude: { name: 'Crude Oil', output: { item: 'Crude Oil', amount: 120 } },
    water: { name: 'Water', output: { item: 'Water', amount: 120 } },
    nitrogen: { name: 'Nitrogen Gas', output: { item: 'Nitrogen Gas', amount: 120 } },
  };

  const recipe = resourceRecipes[selectedResourceType.value];
  if (recipe) {
    emit('update', props.node.id, { 
      selectedRecipe: recipe,
      name: `${recipe.name} Extractor`
    });
  }
};

const getIcon = () => {
  if (props.node.type === 'resource') return Mountain;
  if (props.node.type === 'smelter') return Factory;
  if (props.node.type === 'constructor') return Hammer;
  if (props.node.type === 'assembler') return Wrench;
  if (props.node.type === 'manufacturer') return Cpu;
  if (props.node.type === 'refinery') return Beaker;
  if (props.node.type === 'packager') return Droplet;
  if (props.node.type === 'splitter' || props.node.type === 'smart-splitter') return Split;
  if (props.node.type === 'merger') return Combine;
  if (props.node.type === 'storage') return Box;
  return Factory;
};

const nodeTypeColor = computed(() => {
  const colors = {
    resource: 'bg-emerald-900/20',
    smelter: 'bg-orange-900/20',
    constructor: 'bg-blue-900/20',
    assembler: 'bg-purple-900/20',
    manufacturer: 'bg-red-900/20',
    refinery: 'bg-cyan-900/20',
    foundry: 'bg-orange-800/20',
    splitter: 'bg-yellow-900/20',
    'smart-splitter': 'bg-yellow-800/20',
    merger: 'bg-yellow-900/20',
    storage: 'bg-indigo-900/20',
  };
  return colors[props.node.type] || 'bg-slate-900/20';
});

const iconColor = computed(() => {
  const colors = {
    resource: 'text-emerald-400',
    smelter: 'text-orange-400',
    constructor: 'text-blue-400',
    assembler: 'text-purple-400',
    manufacturer: 'text-red-400',
    refinery: 'text-cyan-400',
    foundry: 'text-orange-300',
    splitter: 'text-yellow-400',
    'smart-splitter': 'text-yellow-300',
    merger: 'text-yellow-400',
    storage: 'text-indigo-400',
  };
  return colors[props.node.type] || 'text-slate-400';
});

const clockSpeedColor = computed(() => {
  if (clockSpeed.value < 100) return 'text-blue-400';
  if (clockSpeed.value > 100) return 'text-red-400';
  return 'text-green-400';
});

const currentPowerUsage = computed(() => {
  if (!props.node.powerUsage) return 0;
  const clockMultiplier = Math.pow(clockSpeed.value / 100, 1.6);
  return props.node.powerUsage * clockMultiplier;
});

const efficiency = computed(() => {
  if (!props.node.selectedRecipe || !props.node.selectedRecipe.inputs) return 100;
  if (props.actualThroughput.inputs.length === 0) return 0;
  
  // Calculate efficiency based on actual vs required inputs
  const clockMult = clockSpeed.value / 100;
  let totalRequired = 0;
  let totalActual = 0;
  
  props.node.selectedRecipe.inputs.forEach(input => {
    const required = input.amount * clockMult;
    const actual = props.actualThroughput.inputs.find(i => i.item === input.item)?.rate || 0;
    
    totalRequired += required;
    totalActual += Math.min(actual, required);
  });
  
  if (totalRequired === 0) return 100;
  return (totalActual / totalRequired) * 100;
});

const efficiencyColor = computed(() => {
  if (efficiency.value >= 99) return 'text-green-400';
  if (efficiency.value >= 75) return 'text-yellow-400';
  if (efficiency.value >= 50) return 'text-orange-400';
  return 'text-red-400';
});

const efficiencyGlow = computed(() => {
  if (!showClockSpeed.value) return '';
  
  // Check for underload (not getting enough input)
  if (props.actualThroughput.inputs.length > 0 && efficiency.value < 99) {
    return 'shadow-lg shadow-blue-500/50';
  }
  
  // Check for overload (output exceeds belt capacity)
  if (props.actualThroughput.outputs.length > 0) {
    const beltMax = getBeltMaxThroughput(props.node.beltSpeed || 'mk1');
    const outputRate = props.actualThroughput.outputs.reduce((sum, out) => sum + out.rate, 0);
    
    if (outputRate > beltMax * 1.01) {
      return 'shadow-lg shadow-red-500/50';
    }
  }
  
  return '';
});

const availableRecipes = computed(() => {
  if (!props.node.recipes) return [];
  return props.node.recipes;
});

const getBeltColor = (speed) => {
  const colors = {
    mk1: '#f97316',
    mk2: '#eab308',
    mk3: '#8b5cf6',
    mk4: '#06b6d4',
    mk5: '#10b981'
  };
  return colors[speed] || '#f97316';
};

const getBeltMaxThroughput = (speed) => {
  const speeds = {
    mk1: 60,
    mk2: 120,
    mk3: 270,
    mk4: 480,
    mk5: 780
  };
  return speeds[speed] || 60;
};

const getAllItems = () => {
  return [
    'Iron Ore', 'Copper Ore', 'Limestone', 'Coal', 'Caterium Ore',
    'Iron Ingot', 'Copper Ingot', 'Steel Ingot',
    'Iron Plate', 'Iron Rod', 'Screw', 'Wire', 'Cable',
    'Reinforced Iron Plate', 'Rotor', 'Modular Frame'
  ];
};
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f97316;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f97316;
  cursor: pointer;
  border: none;
}
</style>