<template>
  <div class="my-properties-container">
    <h2 class="section-title">My Properties</h2>
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading my properties...</p>
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
      <p>You haven't listed any properties yet.</p>
       <router-link to="/add-property" class="add-property-btn">Add a Property</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import PropertyCard from '../components/PropertyCard.vue';

const properties = ref<any[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    error.value = "You must be logged in to see your properties.";
    isLoading.value = false;
    return;
  }

  const firestore = getFirestore();
  try {
    const q = query(collection(firestore, 'properties'), where('ownerId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    properties.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error fetching properties: ", err);
    error.value = "Sorry, we couldn't load your properties at the moment. Please try again later.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.my-properties-container {
  padding: 3rem 1.5rem;
  background-color: var(--background-color-soft);
  min-height: 100vh;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 2.5rem;
}

.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p, .error-state p, .empty-state p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.add-property-btn {
  background: linear-gradient(45deg, var(--primary-blue), #00c6ff);
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-property-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.25);
}
</style>
