<template>
    <Dialog :open="true" @update:open="(val) => !val && $emit('close')">
        <DialogContent class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700">
            <!-- Header -->
            <div class="flex justify-between items-start">
                <DialogTitle class="text-2xl font-bold text-slate-200">Add Member</DialogTitle>

                <Button size="sm" variant="outline" class="ml-auto" @click="showBulkImport = true">
                    📥 Bulk Import
                </Button>

            </div>
                <DialogDescription class="text-sm text-slate-400 -mt-2 mb-4">
                    Add new member details below.
                </DialogDescription>
            <form @submit.prevent="handleSubmit" class="space-y-6 text-sm text-slate-200">
                <!-- Core Info -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                        <Label for="name">Name</Label>
                        <Input id="name" v-model="form.name" placeholder="funkyfrog" class="bg-slate-700" required />
                    </div>

                    <div>
                        <Label for="role">Role</Label>
                        <Select v-model="form.role" class="bg-slate-700" required>
                            <SelectTrigger class="bg-slate-700">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="R5">R5</SelectItem>
                                <SelectItem value="R4">R4</SelectItem>
                                <SelectItem value="R3">R3</SelectItem>
                                <SelectItem value="R2">R2</SelectItem>
                                <SelectItem value="R1">R1</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="status">Status</Label>
                        <Select v-model="form.status">
                            <SelectTrigger class="bg-slate-700" required>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="kicked">Kicked</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label for="power">Power</Label>
                        <Input id="power" type="number" v-model.number="form.power" placeholder="44100000"
                            class="bg-slate-700" required />
                    </div>

                    <div>
                        <Label for="castle">Castle Level</Label>
                        <Input id="castle" type="number" v-model.number="form.castle" placeholder="40"
                            class="bg-slate-700" required />
                    </div>

                    <div>
                        <Label for="country">Country</Label>
                        <Input id="country" v-model="form.country" placeholder="United States" class="bg-slate-700"
                            required />
                    </div>

                    <div>
                        <Label for="discord">Discord</Label>
                        <Input id="discord" v-model="form.discord" placeholder="@username" class="bg-slate-700"
                             />
                    </div>

                    <div>
                        <Label for="server">Server</Label>
                        <Input id="server" v-model="form.server" placeholder="s10154" class="bg-slate-700" required />
                    </div>

                    <div>
                        <Label for="gameUid">Game UID</Label>
                        <Input id="gameUid" v-model="form.gameUid" placeholder="396541251549" class="bg-slate-700" />
                    </div>
                </div>

                <!-- Other Names -->
                <div>
                    <Label for="otherNames">Other Names (comma separated)</Label>
                    <Input id="otherNames" v-model="otherNamesInput" placeholder="froggy, frog, frogvader"
                        class="bg-slate-700" />
                </div>

                <!-- Notes -->
                <div>
                    <Label for="notes">Notes</Label>
                    <Textarea id="notes" v-model="form.notes" placeholder="Optional notes or commentary"
                        class="bg-slate-700" />
                </div>

                <div class="flex items-center gap-2 mt-6">
                    <input type="checkbox" id="locked" v-model="form.locked" class="scale-125 bg-slate-700" />
                    <Label for="locked" class="text-sm">Locked</Label>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" @click="$emit('close')">Cancel</Button>
                    <Button type="submit">Add Member</Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
    <BulkMemberImportModal v-if="showBulkImport" @close="showBulkImport = false" @imported="onBulkImport" />
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { useMembers } from '@/composables/topheroes/admin/useMembers'
import BulkMemberImportModal from './BulkMemberImportModal.vue'
import { useToast } from '@/components/ui/toast';

const { toast } = useToast();

const showBulkImport = ref(false)
const { addMember } = useMembers()

const props = defineProps({
  initial: Object
})

const emit = defineEmits(['close'])

const onBulkImport = () => {
  showBulkImport.value = false
  emit('close')
}

const form = ref({
    name: '',
    role: '',
    status: '',
    power: null,
    castle: null,
    country: '',
    discord: '',
    server: '',
    gameUid: '',
    notes: '',
    otherNames: [],
    locked: false
})

const otherNamesInput = ref('')

watchEffect(() => {
  if (!props.initial) return
  form.value = { ...props.initial }
  otherNamesInput.value = props.initial.otherNames?.join(', ') || ''
})

const handleSubmit = async () => {
    const otherNamesArray = otherNamesInput.value
        .split(',')
        .map(name => name.trim())
        .filter(Boolean)

    const payload = {
        ...form.value,
        otherNames: otherNamesArray
    }

    try {
        await addMember(payload)
        toast({
            variant: 'success',
            title: 'Added member',
            description: `${form.name} was successfully added.`
        })
        emit('close')
    } catch (err) {
        console.error('Failed to add member:', err)
        toast({
            variant: 'destructive',
            title: 'Failed to add member',
            description: `${form.name} was unable to be added.`
        })
    }
}
</script>