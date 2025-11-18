
<template>
  <div class="properties-page">
    <div class="page-header">
      <h1 class="page-title">Available Properties</h1>
      <div class="search-input-group">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <input ref="locationInput" type="text" placeholder="Enter a city" class="search-input">
      </div>
      <div class="header-actions">
        <button @click="isFilterModalVisible = true" class="filter-button">Filter</button>
        <button v-if="filtersApplied" @click="removeFilters" class="remove-filter-button">Remove Filters</button>
      </div>
    </div>

    <FilterProperties 
      :isVisible="isFilterModalVisible" 
      @close="isFilterModalVisible = false"
      @apply-filters="applyFilters" 
    />

    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div class="properties-grid">
      <PropertyCard v-for="property in documents" :key="property.id" :property="property" />
    </div>

    <div v-if="loading && documents.length === 0" class="loading-indicator">
      <div class="spinner"></div>
    </div>

    <div v-if="!loading && documents.length === 0 && !error" class="empty-state">
      <p>No properties found. Try adjusting your filters.</p>
    </div>

    <div v-if="hasMore && !loading" class="load-more-container">
      <button @click="loadMore" class="load-more-button">Load More</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import PropertyCard from '../components/PropertyCard.vue';
import FilterProperties from '../components/FilterProperties.vue';
import { usePropertyStore } from '../stores/property';
import type { DocumentData, QueryDocumentSnapshot, QueryFilterConstraint } from 'firebase/firestore';
import { and, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const store = usePropertyStore();
const isFilterModalVisible = ref(false);
const filtersApplied = ref(false);
const currentFilters = ref<any>(null);
const documents = ref<DocumentData[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const hasMore = ref(true);
const lastDoc = ref<QueryDocumentSnapshot<DocumentData> | null>(null);
const locationInput = ref<HTMLInputElement | null>(null);
const selectedPlace = ref<any>(null);

onMounted(() => {
  if (locationInput.value) {
    const autocomplete = new google.maps.places.Autocomplete(locationInput.value, {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const city = place.address_components?.find(c => c.types.includes('locality'))?.long_name;
      const state = place.address_components?.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
      const pincode = place.address_components?.find(c => c.types.includes('postal_code'))?.long_name;

      selectedPlace.value = {
        city,
        state,
        pincode
      };
      loadProperties(currentFilters.value);
    });
  }
  loadProperties(currentFilters.value);
});


const loadProperties = async (filters: any) => {

  loading.value = true;
  error.value = null;

  try {
    const queryConstraints: QueryFilterConstraint[] = [];

    if (selectedPlace.value) {
        if (selectedPlace.value.city) {
            queryConstraints.push(where('basic.city', '==', selectedPlace.value.city));
        }
        if (selectedPlace.value.state) {
            queryConstraints.push(where('basic.state', '==', selectedPlace.value.state));
        }
        if (selectedPlace.value.pincode) {
            queryConstraints.push(where('basic.pincode', '==', selectedPlace.value.pincode));
        }
    }

    if (filters) {
        if (filters.saleOrRent) {
            queryConstraints.push(where('basic.saleOrRent', '==', filters.saleOrRent));
        }
        if (filters.propertyType) {
            queryConstraints.push(where('basic.propertyType', '==', filters.propertyType));
        }
        if (filters.priceRange && filters.priceRange[1] < store.highestPrice) {
            queryConstraints.push(where('pricing.price', '>=', filters.priceRange[0]));
            queryConstraints.push(where('pricing.price', '<=', filters.priceRange[1]));
        }
    }

    let q;
    if (queryConstraints.length > 0) {
        q = query(collection(db, 'properties'), and(...queryConstraints));
    } else {
        q = query(collection(db, 'properties'));
    }

    const querySnapshot = await getDocs(q);
    documents.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    lastDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    hasMore.value = querySnapshot.docs.length > 0;
    
  } catch (e) {
    error.value = 'Failed to load properties.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const applyFilters = (filters: any) => {
  currentFilters.value = filters;
  filtersApplied.value = true;
  isFilterModalVisible.value = false;
  loadProperties(filters);
};

const removeFilters = () => {
  currentFilters.value = null;
  filtersApplied.value = false;
  selectedPlace.value = null;
  if(locationInput.value) locationInput.value.value = "";
  loadProperties(null);
};

const loadMore = async () => {
    // Load more is complex with the current filtering, so for now we will just re-load the properties
    // In a real application, you would want to implement proper pagination with cursors
    loadProperties(currentFilters.value);
};

</script>

<style scoped>
.properties-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.page-header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-top: 1rem;
  grid-template-areas:
    "title"
    "search"
    "actions";
}

.page-title {
  grid-area: title;
  font-size: 1.875rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
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

.header-actions {
  grid-area: actions;
  display: flex;
  gap: 1rem;
  justify-self: start;
}

.filter-button, .remove-filter-button {
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-filter-button {
  background: #e74c3c;
}

.properties-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .page-header {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "title actions"
      "search search";
    align-items: center;
  }

  .page-title {
    font-size: 2.25rem;
  }

  .header-actions {
    justify-self: end;
  }

  .properties-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .page-header {
    grid-template-columns: auto 1fr auto;
    grid-template-areas: "title search actions";
    gap: 2rem;
  }

  .page-title {
    font-size: 2.75rem;
  }

  .properties-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.loading-indicator, .error-state, .empty-state {
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.125rem;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  border: 3px solid rgba(0, 122, 255, 0.1);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.load-more-container {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem 0;
}

.load-more-button {
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
}
</style>
