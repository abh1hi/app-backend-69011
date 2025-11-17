<template>
  <div class="quick-actions-container">
    <div class="actions-grid">
      <router-link to="/add-property" class="action-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-8"/><path d="M5 14H2.5a2.5 2.5 0 0 1 0-5H5"/><path d="M21.5 9H19a2.5 2.5 0 0 0 0 5h2.5"/><path d="M19 14v8"/><path d="M5 22v-8"/><path d="M12 2v2"/><path d="M12 8v2"/><path d="M12 14v2"/><circle cx="12" cy="12" r="2"/><path d="M18 12h2"/><path d="M4 12H2"/></svg>
        </div>
        <h3 class="action-title">Post Property</h3>
      </router-link>

      <router-link to="/my-properties" class="action-card">
        <div class="icon-wrapper">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H2"/><path d="M18 12h4"/><path d="M12 6V2"/><path d="M12 22v-4"/><path d="M12 12v-2"/></svg>
        </div>
        <h3 class="action-title">My Properties</h3>
      </router-link>

      <router-link to="/properties" class="action-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <h3 class="action-title">All Properties</h3>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script logic needed
</script>

<style scoped>
.quick-actions-container {
  padding: 2.5rem 1rem;
  background: var(--background-color-soft);
}

.actions-grid {
  display: flex;
  justify-content: space-around;
  max-width: 1000px;
  margin: 0 auto;
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-primary);
  padding: 1rem 0.5rem;
  border-radius: 16px;
  transition: all 0.25s ease-out;
}

.action-card:hover {
  background: rgba(0, 122, 255, 0.05);
  transform: translateY(-2px);
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border: 1px solid var(--border-color);
  color: var(--primary-blue);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease-out;
}

.action-card:hover .icon-wrapper {
  background: var(--primary-blue);
  color: var(--white);
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.25);
  transform: rotate(-10deg);
}

.icon-wrapper svg {
  width: 26px;
  height: 26px;
  transition: transform 0.25s ease-out;
}

.action-card:hover .icon-wrapper svg {
  transform: scale(1.1);
}

.action-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

@media (max-width: 640px) {
  .quick-actions-container {
    padding: 2rem 1rem;
  }
  .icon-wrapper {
    width: 52px;
    height: 52px;
  }
  .icon-wrapper svg {
    width: 22px;
    height: 22px;
  }
  .action-title {
    font-size: 0.8125rem;
  }
}
</style>