<template>
  <div class="quick-actions-container">
    <div class="actions-grid">
      <router-link to="/add-property" class="action-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-8"/><path d="M5 14H2.5a2.5 2.5 0 0 1 0-5H5"/><path d="M21.5 9H19a2.5 2.5 0 0 0 0 5h2.5"/><path d="M19 14v8"/><path d="M5 22v-8"/><path d="M12 2v2"/><path d="M12 8v2"/><path d="M12 14v2"/><circle cx="12" cy="12" r="2"/><path d="M18 12h2"/><path d="M4 12H2"/></svg>
        </div>
        <h3 class="action-title">Add Property</h3>
        <p class="action-subtitle">List your property for sale or rent.</p>
      </router-link>

      <router-link to="/my-properties" class="action-card">
        <div class="icon-wrapper">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H2"/><path d="M18 12h4"/><path d="M12 6V2"/><path d="M12 22v-4"/><path d="M12 12v-2"/></svg>
        </div>
        <h3 class="action-title">My Properties</h3>
        <p class="action-subtitle">View and manage your listings.</p>
      </router-link>

      <router-link to="/all-properties" class="action-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <h3 class="action-title">Explore Properties</h3>
        <p class="action-subtitle">Browse all available listings.</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script logic needed for this component yet.
</script>

<style scoped>
.quick-actions-container {
  padding: 2rem 1rem;
  background: transparent;
}

@media (min-width: 768px) {
  .quick-actions-container {
    padding: 3rem 1.5rem;
  }
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

.action-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 24px 16px;
  border-radius: 18px;
  text-align: center;
  text-decoration: none;
  color: var(--text-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.action-card:active {
  transform: scale(0.96);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

@media (min-width: 768px) {
  .action-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.icon-wrapper {
  height: 56px;
  width: 56px;
  background: var(--primary-blue);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.25);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.action-card:active .icon-wrapper {
  transform: scale(0.95);
}

@media (min-width: 768px) {
  .action-card:hover .icon-wrapper {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 122, 255, 0.35);
  }
}

.icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.action-title {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: -0.2px;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .action-title {
    font-size: 1.0625rem;
  }
}

.action-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin: 0;
  opacity: 0.7;
  display: none;
}

@media (min-width: 1024px) {
  .action-subtitle {
    display: block;
  }
}

@media (max-width: 640px) {
  .quick-actions-container {
    padding: 1.5rem 1rem;
  }

  .actions-grid {
    gap: 10px;
  }

  .action-card {
    padding: 20px 12px;
  }

  .icon-wrapper {
    height: 48px;
    width: 48px;
  }

  .icon-wrapper svg {
    width: 20px;
    height: 20px;
  }

  .action-title {
    font-size: 0.75rem;
  }
}
</style>

