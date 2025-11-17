<template>
  <div class="home-search-container">
    <div class="search-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'buy' }]" 
        @click="activeTab = 'buy'"
      >
        Buy
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'rent' }]" 
        @click="activeTab = 'rent'"
      >
        Rent
      </button>
    </div>
    <div class="search-form">
      <div class="search-input-group">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <input v-model="city" type="text" placeholder="Enter a city" class="search-input">
      </div>
      <div class="search-input-group">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon rupee-icon"><path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path><path d="M8 8h8M8 12h8M15 16H8"></path><path d="M11 16s-1.5-2-3-2"></path></svg>
        <input v-model="budget" type="text" placeholder="Enter a budget" class="search-input">
      </div>
      <button @click="performSearch" class="search-btn-main">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <span>Search</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const activeTab = ref('buy');
const city = ref('');
const budget = ref('');
const router = useRouter();

const performSearch = () => {
  const query: any = {
    type: activeTab.value,
  };
  if (city.value) {
    query.city = city.value;
  }
  if (budget.value) {
    query.budget = budget.value;
  }
  router.push({ name: 'SearchResults', query });
};
</script>

<style scoped>
.home-search-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.search-tabs {
  display: flex;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  padding: 5px;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 0.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 11px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: -0.2px;
}

.tab-btn.active {
  background: var(--white);
  color: var(--primary-blue);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.15), 0 1px 4px rgba(0,0,0,0.05);
}

.search-form {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .search-form {
    grid-template-columns: 1fr 1fr auto;
  }
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-secondary);
  opacity: 0.6;
  width: 20px;
  height: 20px;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
  font-weight: 400;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
  background-color: var(--white);
}

.rupee-icon {
  stroke-width: 2;
}

.search-btn-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  background-color: var(--primary-blue);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);
}

.search-btn-main:hover {
  background-color: #006ae6;
  box-shadow: 0 6px 20px rgba(0, 122, 255, 0.3);
  transform: translateY(-1px);
}

.search-btn-main:active {
  transform: translateY(0px) scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 122, 255, 0.2);
}

.search-btn-main svg {
  transition: transform 0.2s ease;
}

.search-btn-main:hover svg {
  transform: rotate(-15deg);
}

@media (max-width: 767px) {
  .home-search-container {
    padding: 0.75rem;
    border-radius: 16px;
  }
  .search-tabs {
    border-radius: 12px;
  }
  .tab-btn {
    font-size: 0.875rem;
    border-radius: 10px;
  }
  .search-input {
    font-size: 0.9375rem;
  }
  .search-btn-main {
    padding: 0.875rem;
    font-size: 0.9375rem;
  }
}
</style>