
<template>
  <div class="properties-page">
    <div class="page-header animate-up">
      <div class="header-left">
        <h1 class="page-title">Explore <span class="highlight-blue">Aashiyanaa</span></h1>
        <p class="page-subtitle">Find the best properties in your preferred cities</p>
      </div>

      <div class="header-right">
        <div class="search-input-group glass-panel">
          <span class="material-symbols-outlined search-icon">location_on</span>
          <input ref="locationInput" type="text" placeholder="Search by city..." class="search-input">
        </div>
        
        <div class="header-actions">
          <button @click="isFilterModalVisible = true" class="filter-button">
            <span class="material-symbols-outlined">tune</span>
            <span>Filters</span>
          </button>
          <button v-if="filtersApplied" @click="removeFilters" class="remove-filter-button">
            <span class="material-symbols-outlined">close</span>
            <span>Reset</span>
          </button>
        </div>
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

    <div v-if="loading && documents.length === 0" class="loading-indicator animate-up">
      <div class="spinner-modern"></div>
      <p>Searching for properties...</p>
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
  padding: 3rem 1.5rem 8rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Outfit', sans-serif;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;
  padding-top: 1rem;
}

.highlight-blue {
    color: #007aff;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -1.5px;
  margin: 0;
  line-height: 1.1;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin-top: 0.5rem;
    font-weight: 400;
}

.header-right {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 600px;
}

.search-input-group {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}

.glass-panel {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    border-radius: 100px;
}

.search-icon {
    position: absolute;
    left: 1.5rem;
    color: #007aff;
    font-size: 1.4rem;
}

.search-input {
    width: 100%;
    padding: 16px 1.5rem 16px 3.5rem;
    border-radius: 100px;
    border: 1px solid transparent;
    background: transparent;
    color: #111;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-weight: 500;
    font-family: 'Outfit', sans-serif;
}

.search-input:focus {
    outline: none;
    border-color: #007aff;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-button, .remove-filter-button {
  background: white;
  color: #111;
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid #eef0f2;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
}

.filter-button:hover {
    background: #fdfdfd;
    border-color: #007aff;
    color: #007aff;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 122, 255, 0.1);
}

.remove-filter-button {
  background: #fff5f5;
  color: #ff3b30;
  border-color: rgba(255, 59, 48, 0.1);
}

.remove-filter-button:hover {
    background: #ff3b30;
    color: white;
    transform: translateY(-2px);
}

.properties-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .properties-grid { grid-template-columns: repeat(2, 1fr); gap: 2.5rem;}
}

@media (min-width: 1024px) {
  .page-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
  
  .header-right {
      align-items: flex-end;
  }

  .properties-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
}

.loading-indicator, .error-state, .empty-state {
  text-align: center;
  padding: 6rem 1rem;
  font-size: 1.1rem;
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner-modern {
  border: 4px solid rgba(0, 122, 255, 0.1);
  border-top: 4px solid #007aff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.load-more-container {
  text-align: center;
  margin-top: 5rem;
  padding-bottom: 2rem;
}

.load-more-button {
  background: #1a1a1a;
  color: white;
  padding: 16px 40px;
  border-radius: 100px;
  font-size: 1.05rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.load-more-button:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

/* Animations */
.animate-up {
    animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
