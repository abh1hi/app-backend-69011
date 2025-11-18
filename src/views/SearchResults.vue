<template>
  <div class="search-results-container">
    <h1 class="results-title">Search Results</h1>
    <p class="results-subtitle" v-if="subtitle">{{ subtitle }}</p>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Finding properties...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-title">Sorry, something went wrong.</p>
      <p class="error-message">{{ error }}</p>
      <button @click="fetchResults" class="retry-btn">Try Again</button>
    </div>

    <div v-else-if="results.length > 0" class="results-grid">
      <PropertyCard v-for="property in results" :key="property.id" :property="property" />
    </div>

    <div v-else class="no-results-state">
       <img src="https://firebasestorage.googleapis.com/v0/b/aapna-ashiana-c7414.appspot.com/o/defaults%2Fno-results.svg?alt=media&token=42217c46-9132-4a70-8c29-e331c90c766b" alt="No results found" class="no-results-image" />
      <p class="no-results-title">No Properties Found</p>
      <p class="no-results-text">We couldn't find any properties matching your search criteria. Please try a different location or budget.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { collection, getDocs, query, where, and, QueryFilterConstraint } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyCard from '../components/PropertyCard.vue';

const route = useRoute();
const results = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const subtitle = computed(() => {
    const { type, city } = route.query;
    if (city && type) {
        const typeText = type === 'buy' ? 'for sale' : 'for rent';
        return `Showing properties ${typeText} in ${city}`;
    }
    return 'Showing properties for your search';
});

const fetchResults = async () => {
  loading.value = true;
  error.value = null;
  try {
    const { type, city, state, pincode, budget } = route.query;
    const filters: QueryFilterConstraint[] = [];

    if (type) {
      const saleOrRent = type === 'buy' ? 'For Sale' : 'For Rent';
      filters.push(where('basic.saleOrRent', '==', saleOrRent));
    }

    if (city && typeof city === 'string' && city.trim() !== '') {
      filters.push(where('basic.city', '==', city));
    }

    if (state && typeof state === 'string' && state.trim() !== '') {
      filters.push(where('basic.state', '==', state));
    }

    if (pincode && typeof pincode === 'string' && pincode.trim() !== '') {
      filters.push(where('basic.pincode', '==', pincode));
    }

    if (budget) {
      const numericBudget = Number(budget);
      if (!isNaN(numericBudget) && numericBudget > 0) {
        filters.push(where('pricing.price', '<=', numericBudget));
      }
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
    if (err.code === 'failed-precondition') {
      error.value = `This query requires a custom index. Please create the composite index in your Firebase Firestore console. Details: ${err.message}`;
    } else {
      error.value = 'An unexpected error occurred while fetching results.';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(fetchResults);
</script>

<style scoped>
.search-results-container {
  padding: 2rem 1rem;
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.results-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.results-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  text-align: left;
}

.loading-state, .error-state, .no-results-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  min-height: 50vh;
}

.spinner {
  border: 4px solid rgba(0,0,0,0.1);
  border-left-color: var(--primary-blue);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--danger-red);
  margin-bottom: 0.5rem;
}

.error-message {
  max-width: 600px;
  margin-bottom: 2rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background-color: #006ae6;
}

.no-results-image {
  width: 150px;
  height: auto;
  margin-bottom: 2rem;
  opacity: 0.7;
}

.no-results-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.no-results-text {
  color: var(--text-secondary);
  max-width: 400px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
    .results-grid {
        grid-template-columns: 1fr;
    }
}
</style>
