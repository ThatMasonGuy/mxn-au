import type { ToastRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'

export { default as Toaster } from './Toaster.vue'
export { default as Toast } from './Toast.vue'
export { default as ToastViewport } from './ToastViewport.vue'
export { default as ToastAction } from './ToastAction.vue'
export { default as ToastClose } from './ToastClose.vue'
export { default as ToastTitle } from './ToastTitle.vue'
export { default as ToastDescription } from './ToastDescription.vue'
export { default as ToastProvider } from './ToastProvider.vue'
export { toast, useToast } from './use-toast'

import { type VariantProps, cva } from 'class-variance-authority'

export const toastVariants = cva(
  [
    'group pointer-events-auto relative flex w-full items-center justify-between space-x-2',
    'overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all',
    // Swipe transitions
    'data-[swipe=cancel]:translate-x-0',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=move]:transition-none',
    // State transitions
    'data-[state=open]:animate-in',
    'data-[state=open]:slide-in-from-top-full',
    'data-[state=open]:sm:slide-in-from-bottom-full',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-80',
    'data-[state=closed]:slide-out-to-right-full',
    'data-[swipe=end]:animate-out',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive: 'border-destructive bg-destructive text-destructive-foreground',
        success: 'border-green-500 bg-green-600 text-white',
        warning: 'border-yellow-400 bg-yellow-300 text-black/80',
        info: 'border-blue-500 bg-blue-600 text-white',
        error: 'border-red-500 bg-red-600 text-white',
        neutral: 'border-gray-400 bg-gray-100 text-gray-900',
        accent: 'border-purple-500 bg-purple-600 text-white',
        loading: 'border-muted bg-muted text-muted-foreground cursor-wait',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type ToastVariants = VariantProps<typeof toastVariants>

export interface ToastProps extends ToastRootProps {
  class?: HTMLAttributes['class']
  variant?: ToastVariants['variant']
  onOpenChange?: ((value: boolean) => void) | undefined
}
