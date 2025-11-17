<template>
  <div class="search-results-container">
    <h1 class="results-title">Search Results</h1>
    <p class="results-subtitle">Showing properties for your search</p>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading search results...</p>
    </div>

    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-if="!loading && !error && results.length > 0" class="results-grid">
      <PropertyCard v-for="property in results" :key="property.id" :property="property" />
    </div>

    <div v-if="!loading && !error && results.length === 0" class="no-results-state">
      <p>No properties found for your search. Try broadening your criteria.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { collection, getDocs, query, where, and } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyCard from '../components/PropertyCard.vue';

const route = useRoute();
const results = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const { type, city, budget } = route.query;
    const filters = [];

    if (type) {
      const saleOrRent = type === 'buy' ? 'For Sale' : 'For Rent';
      filters.push(where('basic.saleOrRent', '==', saleOrRent));
    }

    if (city) {
      filters.push(where('basic.state', '==', city));
    }

    if (budget) {
      filters.push(where('pricing.price', '<=', Number(budget)));
    }
    
    let q;
    if (filters.length > 0) {
        q = query(collection(db, 'properties'), and(...filters));
    } else {
        q = query(collection(db, 'properties'));
    }


    const querySnapshot = await getDocs(q);
    results.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err: any) {
    console.error("Error fetching search results:", err);
    if (err.message.includes('index')) {
      error.value = `The query requires an index. Please create the index in your Firebase console. The error message is: ${err.message}`
    } else {
       error.value = 'Failed to load search results. Please try again later.';
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.search-results-container {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
}

.results-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
}

.results-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  text-align: center;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.loading-state, .error-state, .no-results-state {
  text-align: center;
  padding: 4rem 1rem;
}

.error-state {
    color: red;
    max-width: 800px;
    margin: 0 auto;
    word-break: break-word;
}

.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: var(--primary-blue);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>