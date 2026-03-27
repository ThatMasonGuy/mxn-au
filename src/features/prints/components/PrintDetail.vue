<template>
    <Dialog :open="!!print" @update:open="$emit('close')">
        <DialogContent class="bg-stone-950 border-white/10 max-w-4xl w-full p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto rounded-none sm:rounded-lg">

            <!-- Close button -->
            <DialogTitle class="sr-only">{{ print?.title }}</DialogTitle>
            <DialogDescription class="sr-only">Print details and purchase options for {{ print?.title }}</DialogDescription>

            <div v-if="print" class="flex flex-col lg:flex-row">

                <!-- Image Side -->
                <div class="lg:w-1/2 bg-stone-900 flex items-center justify-center p-8 lg:p-12 min-h-[300px] lg:min-h-[500px]">
                    <div class="text-center">
                        <Camera class="w-12 h-12 text-white/10 mx-auto mb-3" />
                        <span class="text-[10px] tracking-[0.3em] uppercase text-white/20">{{ print.title }}</span>
                    </div>
                </div>

                <!-- Details Side -->
                <div class="lg:w-1/2 p-8 lg:p-10 space-y-8">

                    <!-- Header -->
                    <div>
                        <div class="flex items-center gap-2 mb-3">
                            <span v-if="print.limited" class="text-[9px] tracking-[0.2em] uppercase bg-amber-400/90 text-stone-950 px-2 py-0.5 font-medium">
                                Limited Edition
                            </span>
                            <span class="text-[10px] tracking-[0.2em] uppercase text-white/40">{{ print.category }}</span>
                        </div>
                        <h2 class="font-serif text-2xl lg:text-3xl text-white/95 leading-tight mb-2">
                            {{ print.title }}
                        </h2>
                        <p class="text-xs tracking-wider text-amber-400/60 uppercase flex items-center gap-1.5">
                            <MapPin class="w-3 h-3" />
                            {{ print.location }}
                        </p>
                    </div>

                    <!-- Description -->
                    <p class="text-sm text-white/50 font-light leading-relaxed">
                        {{ print.description }}
                    </p>

                    <!-- Size Selection -->
                    <div>
                        <label class="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">Select Size</label>
                        <div class="grid grid-cols-2 gap-2">
                            <button v-for="(size, i) in print.sizes" :key="size.label"
                                @click="selectedSize = i"
                                :class="[
                                    'border px-3 py-3 text-left transition-all duration-200',
                                    selectedSize === i
                                        ? 'border-amber-400/50 bg-amber-400/5'
                                        : 'border-white/10 hover:border-white/20'
                                ]">
                                <span class="block text-sm text-white/80">{{ size.label }}</span>
                                <span class="block text-xs text-amber-400/70 mt-0.5">${{ size.price }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Paper Selection -->
                    <div>
                        <label class="text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-3">Paper Type</label>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="paper in print.papers" :key="paper"
                                @click="selectedPaper = paper"
                                :class="[
                                    'border px-4 py-2 text-xs tracking-wider transition-all duration-200',
                                    selectedPaper === paper
                                        ? 'border-amber-400/50 bg-amber-400/5 text-white/80'
                                        : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                                ]">
                                {{ paper }}
                            </button>
                        </div>
                    </div>

                    <!-- Price & Purchase -->
                    <div class="pt-4 border-t border-white/5">
                        <div class="flex items-end justify-between mb-6">
                            <div>
                                <span class="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1">Total</span>
                                <span class="font-serif text-3xl text-white/95">${{ currentPrice }}</span>
                                <span class="text-xs text-white/30 ml-1">AUD</span>
                            </div>
                        </div>

                        <button @click="handlePurchase"
                            class="w-full py-4 bg-amber-400/90 hover:bg-amber-400 text-stone-950 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20">
                            Purchase Print
                        </button>

                        <p class="text-[10px] text-white/25 text-center mt-3 tracking-wider">
                            Printed & shipped by Printful. Secure checkout via Stripe.
                        </p>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog'
import { Camera, MapPin } from 'lucide-vue-next'

const props = defineProps({
    print: {
        type: Object,
        default: null,
    }
})

defineEmits(['close'])

const selectedSize = ref(0)
const selectedPaper = ref('')

watch(() => props.print, (p) => {
    if (p) {
        selectedSize.value = 0
        selectedPaper.value = p.papers[0] || ''
    }
})

const currentPrice = computed(() => {
    if (!props.print) return 0
    return props.print.sizes[selectedSize.value]?.price || props.print.startingPrice
})

const handlePurchase = () => {
    // TODO: Integrate with Stripe Checkout via Cloud Function
    // 1. Call Cloud Function with print ID, size, paper type
    // 2. Cloud Function creates Printful order + Stripe checkout session
    // 3. Redirect to Stripe checkout URL
    console.log('Purchase:', {
        printId: props.print.id,
        size: props.print.sizes[selectedSize.value]?.label,
        paper: selectedPaper.value,
        price: currentPrice.value,
    })
    alert('Shop coming soon! Stripe + Printful integration in progress.')
}
</script>
