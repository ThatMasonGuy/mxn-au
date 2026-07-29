<template>
  <main class="fun-page">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>
    <div class="stars" aria-hidden="true"></div>

    <header class="page-header">
      <RouterLink class="brand" to="/" aria-label="Go to MXN.au">
        <span class="brand-mark">M</span>
        <span>MXN.AU</span>
      </RouterLink>
      <FunNav />
    </header>

    <slot />

    <footer class="page-footer">
      <span>ODDS ARE OPTIONAL</span>
      <span class="footer-line" aria-hidden="true"></span>
      <span>COMMIT TO THE BIT</span>
    </footer>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import FunNav from '@/features/fun/components/FunNav.vue'
</script>

<style scoped>
.fun-page {
  --ink: #f7f4ff;
  --muted: #aaa3bd;
  position: relative;
  display: flex;
  height: 100dvh;
  min-height: 38rem;
  flex-direction: column;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(1rem, 2.5vh, 1.5rem) clamp(1.1rem, 4vw, 4.5rem) clamp(0.8rem, 2vh, 1.25rem);
  color: var(--ink);
  background:
    radial-gradient(circle at 25% 42%, rgba(89, 41, 160, 0.21), transparent 32rem),
    radial-gradient(circle at 88% 8%, rgba(84, 36, 138, 0.16), transparent 27rem),
    linear-gradient(145deg, #08070c 0%, #0c0912 45%, #050507 100%);
  font-family: "Noto Sans Display", ui-sans-serif, system-ui, sans-serif;
}

.ambient {
  position: absolute;
  z-index: -2;
  border-radius: 999px;
  filter: blur(90px);
  pointer-events: none;
}

.ambient-one {
  width: 22rem;
  height: 22rem;
  top: 20%;
  left: -10rem;
  background: rgba(107, 62, 194, 0.18);
}

.ambient-two {
  width: 17rem;
  height: 17rem;
  right: -6rem;
  bottom: 8%;
  background: rgba(70, 44, 112, 0.14);
}

.stars {
  position: absolute;
  z-index: -1;
  inset: 0;
  opacity: 0.42;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 12% 17%, rgba(255, 255, 255, 0.65) 0 1px, transparent 1.5px),
    radial-gradient(circle at 76% 22%, rgba(255, 255, 255, 0.4) 0 1px, transparent 1.5px),
    radial-gradient(circle at 42% 79%, rgba(255, 255, 255, 0.35) 0 1px, transparent 1.5px),
    radial-gradient(circle at 92% 68%, rgba(255, 255, 255, 0.5) 0 1px, transparent 1.5px);
  background-size: 19rem 17rem, 23rem 21rem, 29rem 24rem, 17rem 20rem;
}

.page-header,
.page-footer {
  width: min(100%, 84rem);
  margin-inline: auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.65rem;
  color: #e9e5f1;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 2rem;
  height: 2rem;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.55rem;
  color: #fff;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.02));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  font-size: 0.9rem;
  letter-spacing: 0;
}

.brand:focus-visible {
  outline: 2px solid #c8aaff;
  outline-offset: 3px;
}

.page-footer {
  display: flex;
  flex: none;
  align-items: center;
  gap: 1rem;
  margin-top: clamp(0.35rem, 1vh, 0.65rem);
  color: #4d4854;
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.17em;
}

.footer-line {
  width: 2.5rem;
  height: 1px;
  background: #37333d;
}

@media (max-width: 850px) {
  .fun-page {
    height: auto;
    min-height: 100dvh;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .page-footer {
    display: none;
  }
}

@media (max-width: 520px) {
  .fun-page {
    padding-inline: 1rem;
  }

  .brand {
    gap: 0;
    font-size: 0;
    letter-spacing: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
