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
  padding: 2.5rem 1rem;
  background-color: var(--background-color-soft);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.action-card {
  background-color: var(--white);
  padding: 2rem 1.5rem;
  border-radius: 20px;
  text-align: center;
  text-decoration: none;
  color: var(--text-primary);
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  position: relative;
  overflow: hidden;
}

.action-card:before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.1), transparent 40%);
  transform: scale(0);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 45px rgba(0,0,0,0.1);
}

.action-card:hover:before {
  transform: scale(1);
}

.icon-wrapper {
  height: 70px;
  width: 70px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--primary-blue), #00c6ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--white);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.3);
  position: relative;
  z-index: 2;
}

.icon-wrapper svg {
  width: 32px;
  height: 32px;
}

.action-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
}

.action-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
   position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .quick-actions-container {
    padding: 2rem 1rem;
  }

  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .action-card {
    padding: 1.5rem 0.5rem;
    background: none;
    box-shadow: none;
  }

  .action-card:hover {
    transform: none;
    box-shadow: none;
  }

  .icon-wrapper {
    height: 60px;
    width: 60px;
    margin-bottom: 1rem;
  }
  
  .action-title {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .action-subtitle {
    display: none;
  }
}
</style>
