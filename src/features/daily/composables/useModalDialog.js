import { nextTick, onUnmounted, watch } from 'vue';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function useModalDialog(isOpen, dialogRef, closeDialog) {
  let previousFocus = null;
  let previousOverflow = '';

  function focusDialog() {
    const dialog = dialogRef.value;
    if (!dialog) return;
    dialog.focus({ preventScroll: true });
  }

  function handleKeydown(event) {
    if (!isOpen.value) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }
    if (event.key !== 'Tab') return;

    const dialog = dialogRef.value;
    if (!dialog) return;
    const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)]
      .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
    if (!focusable.length) {
      event.preventDefault();
      focusDialog();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!dialog.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  function deactivate() {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = previousOverflow;
    if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') {
      previousFocus.focus({ preventScroll: true });
    }
    previousFocus = null;
  }

  watch(isOpen, async (open) => {
    if (open) {
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
      await nextTick();
      focusDialog();
    } else {
      deactivate();
    }
  });

  onUnmounted(deactivate);
}
