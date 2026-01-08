<template>
  <div class="space-y-6">
    <DialogHeader>
      <DialogTitle class="text-2xl">World Management</DialogTitle>
      <DialogDescription>
        Create, switch, and manage your Minecraft worlds
      </DialogDescription>
    </DialogHeader>

    <!-- Active World Banner -->
    <div v-if="activeWorld" class="bg-green-900/20 border border-green-800/50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-green-600 rounded flex items-center justify-center">
            <Globe class="w-6 h-6" />
          </div>
          <div>
            <div class="font-semibold text-lg">{{ activeWorld.name }}</div>
            <div class="flex items-center space-x-4 text-sm text-gray-400">
              <span>{{ getGameModeText(activeWorld.gameMode) }}</span>
              <span v-if="activeWorld.difficulty">{{ activeWorld.difficulty }}</span>
              <span v-if="activeWorld.hardcore" class="text-red-400 font-semibold">HARDCORE</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" class="bg-green-900/50">Active</Badge>
      </div>
    </div>

    <!-- Tabs -->
    <Tabs default-value="worlds" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="worlds">Saved Worlds</TabsTrigger>
        <TabsTrigger value="create">Create New World</TabsTrigger>
      </TabsList>

      <!-- Saved Worlds Tab -->
      <TabsContent value="worlds" class="space-y-4 mt-6">
        <div v-if="worlds.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
            <Globe class="w-8 h-8 text-gray-600" />
          </div>
          <h3 class="text-lg font-semibold mb-2">No Worlds Yet</h3>
          <p class="text-gray-400 mb-6">Create your first world to get started</p>
          <Button @click="switchTab('create')" class="bg-green-600 hover:bg-green-700">
            <Plus class="w-4 h-4 mr-2" />
            Create World
          </Button>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="world in worlds"
            :key="world.id"
            :class="[
              'border rounded-lg p-4 transition-all',
              world.id === instance.activeWorld
                ? 'border-green-600 bg-green-900/10'
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
            ]"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div 
                  :class="[
                    'w-10 h-10 rounded flex items-center justify-center',
                    world.id === instance.activeWorld ? 'bg-green-600' : 'bg-gray-700'
                  ]"
                >
                  <Globe class="w-5 h-5" />
                </div>
                <div>
                  <div class="font-semibold">{{ world.name }}</div>
                  <div class="flex items-center space-x-3 text-xs text-gray-400">
                    <span>{{ getGameModeText(world.gameMode) }}</span>
                    <span v-if="world.difficulty">{{ world.difficulty }}</span>
                    <span v-if="world.hardcore" class="text-red-400 font-semibold">HARDCORE</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <Button
                  v-if="world.id !== instance.activeWorld"
                  size="sm"
                  @click="switchToWorld(world.id)"
                  variant="outline"
                >
                  <Play class="w-3 h-3 mr-1" />
                  Load
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button size="sm" variant="ghost">
                      <MoreVertical class="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="showWorldInfo(world)">
                      <Info class="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="backupWorld(world)">
                      <Download class="w-4 h-4 mr-2" />
                      Download Backup
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      @click="deleteWorld(world)"
                      class="text-red-400"
                      :disabled="world.id === instance.activeWorld"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      Delete World
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <!-- World Stats -->
            <div class="grid grid-cols-4 gap-4 pt-3 border-t border-gray-700 text-xs">
              <div>
                <div class="text-gray-400">Created</div>
                <div class="font-semibold">{{ formatDate(world.createdAt) }}</div>
              </div>
              <div>
                <div class="text-gray-400">Last Played</div>
                <div class="font-semibold">{{ world.lastPlayed ? formatDate(world.lastPlayed) : 'Never' }}</div>
              </div>
              <div>
                <div class="text-gray-400">Size</div>
                <div class="font-semibold">{{ formatSize(world.size) }}</div>
              </div>
              <div>
                <div class="text-gray-400">Seed</div>
                <div class="font-mono text-xs">{{ world.seed || 'Random' }}</div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- Create New World Tab -->
      <TabsContent value="create" class="mt-6">
        <form @submit.prevent="createNewWorld" class="space-y-6">
          <div>
            <Label for="worldName">World Name</Label>
            <Input 
              id="worldName"
              v-model="newWorld.name" 
              placeholder="My Awesome World"
              required
            />
          </div>

          <div>
            <Label for="gameMode">Game Mode</Label>
            <Select v-model="newWorld.gameMode">
              <SelectTrigger id="gameMode">
                <SelectValue placeholder="Select game mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="survival">Survival</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="spectator">Spectator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="difficulty">Difficulty</Label>
            <Select v-model="newWorld.difficulty">
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peaceful">Peaceful</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox id="hardcore" v-model:checked="newWorld.hardcore" />
            <Label for="hardcore" class="cursor-pointer">
              Hardcore Mode
            </Label>
          </div>

          <Alert v-if="newWorld.hardcore" class="bg-red-900/20 border-red-800/50">
            <AlertTriangle class="h-4 w-4 text-red-400" />
            <AlertTitle>Hardcore Mode Warning</AlertTitle>
            <AlertDescription>
              In Hardcore mode, the difficulty is locked to Hard and players cannot respawn. 
              When you die, the world becomes unplayable. You can create a new world from the world manager.
            </AlertDescription>
          </Alert>

          <Separator />

          <div>
            <Label for="seed">World Seed (Optional)</Label>
            <Input 
              id="seed"
              v-model="newWorld.seed" 
              placeholder="Leave blank for random"
            />
            <p class="text-xs text-gray-400 mt-1">
              Use a specific seed to generate a predetermined world
            </p>
          </div>

          <div>
            <Label for="worldType">World Type</Label>
            <Select v-model="newWorld.worldType">
              <SelectTrigger id="worldType">
                <SelectValue placeholder="Select world type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="flat">Superflat</SelectItem>
                <SelectItem value="large_biomes">Large Biomes</SelectItem>
                <SelectItem value="amplified">Amplified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox id="structures" v-model:checked="newWorld.generateStructures" />
            <Label for="structures" class="cursor-pointer">
              Generate Structures (Villages, Temples, etc.)
            </Label>
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox id="commandBlock" v-model:checked="newWorld.enableCommandBlock" />
            <Label for="commandBlock" class="cursor-pointer">
              Enable Command Blocks
            </Label>
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox id="pvp" v-model:checked="newWorld.pvp" />
            <Label for="pvp" class="cursor-pointer">
              Enable PvP
            </Label>
          </div>

          <Alert>
            <Info class="h-4 w-4" />
            <AlertTitle>World Generation</AlertTitle>
            <AlertDescription>
              The server will start to generate the world. This process can take 1-3 minutes 
              depending on server performance. You can monitor progress in the server console.
            </AlertDescription>
          </Alert>

          <div class="flex justify-end space-x-2">
            <Button type="button" variant="outline" @click="resetForm">
              Reset
            </Button>
            <Button 
              type="submit" 
              :disabled="creating || !newWorld.name"
              class="bg-green-600 hover:bg-green-700"
            >
              <Loader2 v-if="creating" class="w-4 h-4 mr-2 animate-spin" />
              <Plus v-else class="w-4 h-4 mr-2" />
              Create World
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>

    <!-- World Info Dialog -->
    <Dialog v-model:open="showInfoDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ selectedWorld?.name }}</DialogTitle>
        </DialogHeader>
        <div v-if="selectedWorld" class="space-y-4">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-400">Game Mode:</span>
              <p class="font-semibold">{{ getGameModeText(selectedWorld.gameMode) }}</p>
            </div>
            <div>
              <span class="text-gray-400">Difficulty:</span>
              <p class="font-semibold">{{ selectedWorld.difficulty }}</p>
            </div>
            <div>
              <span class="text-gray-400">Hardcore:</span>
              <p class="font-semibold">{{ selectedWorld.hardcore ? 'Yes' : 'No' }}</p>
            </div>
            <div>
              <span class="text-gray-400">World Type:</span>
              <p class="font-semibold">{{ selectedWorld.worldType || 'Default' }}</p>
            </div>
            <div>
              <span class="text-gray-400">Seed:</span>
              <p class="font-mono text-xs">{{ selectedWorld.seed || 'Random' }}</p>
            </div>
            <div>
              <span class="text-gray-400">Size:</span>
              <p class="font-semibold">{{ formatSize(selectedWorld.size) }}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMinecraftStore } from '@/stores/useMinecraftStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Globe,
  Plus,
  Play,
  MoreVertical,
  Info,
  Download,
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-vue-next'

const props = defineProps({
  instance: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const minecraftStore = useMinecraftStore()

const creating = ref(false)
const showInfoDialog = ref(false)
const selectedWorld = ref(null)

const newWorld = ref({
  name: '',
  gameMode: 'survival',
  difficulty: 'normal',
  hardcore: false,
  seed: '',
  worldType: 'default',
  generateStructures: true,
  enableCommandBlock: false,
  pvp: true
})

const worlds = computed(() => props.instance.worlds || [])
const activeWorld = computed(() => {
  if (!props.instance.activeWorld) return null
  return worlds.value.find(w => w.id === props.instance.activeWorld)
})

const switchTab = (tab) => {
  const tabsTrigger = document.querySelector(`[value="${tab}"]`)
  if (tabsTrigger) tabsTrigger.click()
}

const createNewWorld = async () => {
  creating.value = true
  try {
    const world = await minecraftStore.createWorld(props.instance.id, {
      ...newWorld.value,
      size: 0
    })

    // Create a job to generate the world
    await minecraftStore.createJob(props.instance.id, {
      type: 'generate_world',
      instanceName: props.instance.name,
      worldName: world.name,
      stages: [
        'Stopping server',
        'Updating world configuration',
        'Starting server',
        'Generating world chunks',
        'Verifying world generation',
        'Server ready'
      ]
    })

    resetForm()
    switchTab('worlds')
  } catch (error) {
    console.error('Error creating world:', error)
    alert('Failed to create world: ' + error.message)
  } finally {
    creating.value = false
  }
}

const switchToWorld = async (worldId) => {
  try {
    await minecraftStore.switchWorld(props.instance.id, worldId)
    
    // Create a job to switch the world
    const world = worlds.value.find(w => w.id === worldId)
    await minecraftStore.createJob(props.instance.id, {
      type: 'switch_world',
      instanceName: props.instance.name,
      worldName: world.name,
      stages: [
        'Stopping server',
        'Backing up current world',
        'Switching world configuration',
        'Starting server with new world',
        'Server ready'
      ]
    })
  } catch (error) {
    console.error('Error switching world:', error)
    alert('Failed to switch world: ' + error.message)
  }
}

const deleteWorld = async (world) => {
  if (!confirm(`Are you sure you want to delete "${world.name}"? This action cannot be undone.`)) {
    return
  }

  try {
    await minecraftStore.deleteWorld(props.instance.id, world.id)
  } catch (error) {
    console.error('Error deleting world:', error)
    alert('Failed to delete world: ' + error.message)
  }
}

const backupWorld = (world) => {
  console.log('Backup world:', world.name)
  // Implementation would trigger a download
}

const showWorldInfo = (world) => {
  selectedWorld.value = world
  showInfoDialog.value = true
}

const resetForm = () => {
  newWorld.value = {
    name: '',
    gameMode: 'survival',
    difficulty: 'normal',
    hardcore: false,
    seed: '',
    worldType: 'default',
    generateStructures: true,
    enableCommandBlock: false,
    pvp: true
  }
}

const getGameModeText = (mode) => {
  const modes = {
    survival: 'Survival',
    creative: 'Creative',
    adventure: 'Adventure',
    spectator: 'Spectator'
  }
  return modes[mode] || mode
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString()
}

const formatSize = (bytes) => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}
</script>
