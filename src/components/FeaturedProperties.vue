<template>
  <div class="featured-properties-container">
    <h2 class="section-title">Featured Properties</h2>
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading properties...</p>
    </div>
    <div v-if="error" class="error-state">
       <p>{{ error }}</p>
    </div>
    <div v-if="!isLoading && !error" class="properties-grid">
      <PropertyCard 
        v-for="property in properties" 
        :key="property.id" 
        :property="property"
      />
    </div>
     <div v-if="!isLoading && properties.length === 0 && !error" class="empty-state">
      <p>No properties found. Be the first to add one!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';
import PropertyCard from './PropertyCard.vue';

const properties = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const firestore = getFirestore();
  try {
    const q = query(collection(firestore, 'properties'), limit(6));
    const querySnapshot = await getDocs(q);
    properties.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching properties: ", err);
    error.value = "Sorry, we couldn't load the properties at the moment. Please try again later.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.featured-properties-container {
  padding: 2.5rem 1rem;
}

.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p, .error-state p, .empty-state p {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .featured-properties-container {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .properties-grid {
    gap: 1.2rem;
  }
}
</style>
