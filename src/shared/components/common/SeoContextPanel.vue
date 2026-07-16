<template>
  <section
    v-if="context"
    class="seo-context-panel"
    :aria-labelledby="`seo-context-${context.path.replaceAll('/', '-') || 'home'}`"
  >
    <div class="seo-context-panel__inner">
      <div class="seo-context-panel__copy">
        <p class="seo-context-panel__eyebrow">About this {{ context.kind === 'game' ? 'game' : 'tool' }}</p>
        <h2 :id="`seo-context-${context.path.replaceAll('/', '-') || 'home'}`">
          {{ context.title }}
        </h2>
        <p>{{ context.description }}</p>
        <p class="seo-context-panel__purpose">{{ context.purpose }}</p>
      </div>

      <nav v-if="context.related.length" class="seo-context-panel__links" :aria-label="`Related ${context.title} pages`">
        <p class="seo-context-panel__links-title">Explore related MXN tools</p>
        <ul>
          <li v-for="link in context.related" :key="link.path">
            <RouterLink :to="link.path">{{ link.title }}</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSeoContextForPath } from '@/shared/utils/seoConfig'

const route = useRoute()

const context = computed(() => {
  if (route.path === '/') return null
  return getSeoContextForPath(route.path, route.meta)
})
</script>

<style scoped>
.seo-context-panel {
  background: #050505;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #f8fafc;
}

.seo-context-panel__inner {
  display: grid;
  gap: 2rem;
  margin: 0 auto;
  max-width: 76rem;
  padding: 3rem 1.5rem;
}

.seo-context-panel__copy {
  max-width: 44rem;
}

.seo-context-panel__eyebrow,
.seo-context-panel__links-title {
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin: 0 0 0.5rem;
  text-transform: uppercase;
}

.seo-context-panel h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.15;
  margin: 0 0 0.8rem;
}

.seo-context-panel p {
  color: #cbd5e1;
  line-height: 1.65;
  margin: 0;
}

.seo-context-panel__purpose {
  margin-top: 0.75rem !important;
}

.seo-context-panel__links {
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding-left: 1.25rem;
}

.seo-context-panel ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.seo-context-panel a {
  color: #e2e8f0;
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: rgba(148, 163, 184, 0.55);
  text-underline-offset: 0.2em;
}

.seo-context-panel a:hover {
  color: #fff;
}

@media (min-width: 900px) {
  .seo-context-panel__inner {
    align-items: start;
    grid-template-columns: minmax(0, 1.35fr) minmax(16rem, 0.65fr);
    padding-block: 4rem;
  }
}
</style>
