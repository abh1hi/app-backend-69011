<template>
  <div class="search-results-page">
    <!-- Sticky Header with Search -->
    <header class="results-header-bar">
      <div class="header-inner">
        <HomeSearch variant="compact" />
      </div>
    </header>

    <div class="page-layout">
      <!-- Sidebar Filters (Desktop) -->
      <aside class="filters-sidebar desktop-only">
        <div class="filters-content">
          <div class="sidebar-header">
             <h3>Filters</h3>
             <button @click="clearFilters" class="text-btn">Reset</button>
          </div>

          <div class="filter-section">
            <label>Property Type</label>
            <div class="select-wrapper">
               <select v-model="filters.propertyType">
                <option value="">All Types</option>
                <option v-for="type in propertyStore.propertyTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-section">
            <label>Size Unit</label>
            <div class="select-wrapper">
              <select v-model="filters.sizeUnit">
                <option value="">Any Unit</option>
                <option v-for="unit in propertyStore.measurementUnits" :key="unit" :value="unit">
                  {{ unit }}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-section">
            <label>Size Range</label>
            <div class="range-row">
              <input v-model.number="filters.minSize" type="number" placeholder="Min" />
              <span class="range-sep">-</span>
              <input v-model.number="filters.maxSize" type="number" placeholder="Max" />
            </div>
          </div>
          
          <button @click="fetchResults" class="apply-btn">Apply Filters</button>
        </div>
      </aside>

      <!-- Main Results Grid -->
      <main class="results-area">
        <div class="results-top-bar">
          <div>
            <h1 class="page-title">Properties</h1>
            <p class="page-subtitle">{{ subtitle || 'Explore our exclusive listings' }}</p>
          </div>
          <button class="filter-toggle-btn mobile-only" @click="showFilters = true">
             <span class="material-symbols-outlined">filter_list</span>
             Filters
          </button>
        </div>

        <div v-if="loading" class="loading-container">
           <div class="spinner"></div>
        </div>

        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
          <button @click="fetchResults" class="retry-btn">Try Again</button>
        </div>

        <div v-else-if="results.length === 0" class="empty-container">
           <div class="empty-icon">¯\_(ツ)_/¯</div>
           <h3>No properties found</h3>
           <p>Try adjusting your search or filters.</p>
           <button @click="clearFilters" class="reset-btn">Clear Filters</button>
        </div>

        <div v-else class="property-grid">
           <PropertyCard v-for="property in results" :key="property.id" :property="property" />
        </div>
      </main>
    </div>

    <FilterActionSheet
      :isVisible="showFilters"
      :filters="filters"
      :propertyTypes="propertyStore.propertyTypes"
      :measurementUnits="propertyStore.measurementUnits"
      @close="showFilters = false"
      @apply="applyFilters"
      @clear="clearFilters"
      @update:filter="(key, val) => filters[key as keyof typeof filters] = val"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import PropertyCard from '../components/PropertyCard.vue';
import FilterActionSheet from '../components/FilterActionSheet.vue';
import HomeSearch from '../components/HomeSearch.vue';

const route = useRoute();
const propertyStore = usePropertyStore();

const results = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showFilters = ref(false);

const filters = reactive({
  propertyType: '',
  sizeUnit: '',
  minSize: null as number | null,
  maxSize: null as number | null
});

const subtitle = computed(() => {
    const { type, city } = route.query;
    if (city) {
        const typeText = type === 'buy' ? 'For Sale' : (type === 'rent' ? 'For Rent' : 'Properties');
        return `${typeText} in ${city}`;
    }
    return '';
});

const fetchResults = async () => {
  loading.value = true;
  error.value = null;
  results.value = [];

  try {
    const { type, city, state, budget } = route.query;
    
    // Build options for store
    const options: any = {
      collectionName: 'properties',
      filters: {}
    };

    if (type) options.filters.saleOrRent = type === 'buy' ? 'For Sale' : (type === 'rent' ? 'For Rent' : undefined);
    if (state) options.filters.state = state;

    if (filters.propertyType) options.filters.propertyType = filters.propertyType;
    
    // Budget handling from Query
    if (budget) {
       const numericBudget = Number(budget);
        if (!isNaN(numericBudget) && numericBudget > 0) {
            options.filters.priceRange = [0, numericBudget];
        }
    }

    const { newDocuments } = await propertyStore.fetchProperties(options);
    
    let filteredDocs = newDocuments;
    
    // Client-side filtering for city (exact match)
    if (city) {
      filteredDocs = filteredDocs.filter((d: any) => 
        d.basic?.city?.toLowerCase() === (city as string).toLowerCase()
      );
    }
    
    // Client-side size unit
    if (filters.sizeUnit) {
      filteredDocs = filteredDocs.filter((d: any) => d.basic?.sizeUnit === filters.sizeUnit);
    }
    
    // Client-side size range
    if (filters.minSize || filters.maxSize) {
        const min = filters.minSize || 0;
        const max = filters.maxSize || Infinity;
        filteredDocs = filteredDocs.filter((d: any) => {
            const size = Number(d.basic?.size || 0);
            return size >= min && size <= max;
        });
    }

    results.value = filteredDocs;

  } catch (err: any) {
    console.error("Error:", err);
    error.value = "Unable to load properties.";
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
    showFilters.value = false;
    fetchResults();
};

const clearFilters = () => {
    filters.propertyType = '';
    filters.sizeUnit = '';
    filters.minSize = null;
    filters.maxSize = null;
    fetchResults();
};

onMounted(async () => {
  // Ensure options are loaded
  if (propertyStore.propertyTypes.length === 0) {
      await propertyStore.fetchPropertyOptions();
  }
  fetchResults();
});
</script>

<style scoped>
.search-results-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Outfit', sans-serif;
}

.results-header-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}

.header-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-layout {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  gap: 40px;
}

/* Sidebar */
.filters-sidebar {
  width: 260px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.sidebar-header h3 {
    margin: 0; font-size: 1.1rem; font-weight: 600;
}

.text-btn {
    background: none; border: none; color: #666; font-size: 0.9rem; cursor: pointer; text-decoration: underline;
}

.filter-section {
    margin-bottom: 24px;
}

.filter-section label {
    display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; color: #444;
}

.select-wrapper select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    font-size: 0.9rem;
    color: #333;
    outline: none;
    background: #fafafa;
}

.range-row {
    display: flex; align-items: center; gap: 8px;
}

.range-row input {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    font-size: 0.9rem;
    background: #fafafa;
}

.apply-btn {
    width: 100%;
    padding: 12px;
    background: #111;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
}

/* Main Area */
.results-area {
    flex: 1;
}

.results-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
}

.page-title {
    font-size: 2rem; font-weight: 700; margin: 0; letter-spacing: -1px;
    color: #111;
}

.page-subtitle {
    margin: 4px 0 0; color: #666; font-size: 1rem;
}

.filter-toggle-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 100px;
    background: white;
    font-weight: 600;
    font-size: 0.9rem;
}

/* Grid */
.property-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
}

/* State Containers */
.loading-container, .error-container, .empty-container {
    padding: 60px; text-align: center;
    background: #fafafa;
    border-radius: 16px;
}

.spinner {
    width: 30px; height: 30px; border: 3px solid #eee; border-top-color: #111; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon {
    font-size: 2rem; margin-bottom: 16px; color: #aaa;
}

.reset-btn, .retry-btn {
    margin-top: 16px;
    padding: 8px 16px;
    border: 1px solid #ccc;
    background: white;
    border-radius: 6px;
    cursor: pointer;
}

@media (max-width: 1024px) {
    .page-layout { flex-direction: column; padding: 20px; }
    .filters-sidebar { display: none; } /* Hidden on mobile, use sheet */
    .mobile-only { display: flex; }
    .desktop-only { display: none; }
}

@media (min-width: 1025px) {
    .mobile-only { display: none; }
}
</style>
