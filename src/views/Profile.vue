<template>
  <div class="dashboard-page">
    <!-- User Profile Section -->
    <div class="profile-card glass-card">
      <div class="profile-header">
        <h2 class="profile-name">{{ user?.displayName || 'User' }}</h2>
        <p class="profile-phone">{{ user?.phoneNumber || 'No phone number' }}</p>
      </div>
      <button @click="handleLogout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sign Out</span>
      </button>
    </div>

    <!-- Listed Properties Section -->
    <div class="properties-section">
      <h3 class="section-title">My Listed Properties</h3>
      <div v-if="scroll.documents.value.length > 0" class="properties-list">
        <PropertyCard 
          v-for="property in scroll.documents.value" 
          :key="property.id" 
          :property="property" 
        />
      </div>
      <div v-if="scroll.loading.value" class="loading-indicator">
        <div class="spinner"></div>
      </div>
      <div v-if="!scroll.loading.value && scroll.documents.value.length === 0 && !scroll.error.value" class="no-properties">
        <p>You haven't listed any properties yet.</p>
      </div>
      <div v-if="scroll.error.value" class="error-state">
        <p>{{ scroll.error.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';

const user = ref<User | null>(null);
const router = useRouter();
const auth = getAuth();

const scroll = reactive({
  documents: ref([]),
  loading: ref(true),
  error: ref<string | null>(null),
});

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      const { documents, loading, error } = useInfiniteScroll('properties', currentUser.uid);
      scroll.documents = documents;
      scroll.loading = loading;
      scroll.error = error;
    } else {
      router.push('/login');
    }
  });
});

const handleLogout = async () => {
  await signOut(auth);
  router.push('/login');
};
</script>

<style scoped>
.dashboard-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  margin-bottom: 2.5rem;
  border-radius: 20px;
}

.profile-name {
  font-size: 2rem;
  font-weight: 800;
}

.logout-button {
  background-color: #ff4d4d;
  color: white;
  border-radius: 12px;
  padding: 0.8rem 1.3rem;
}

.properties-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.properties-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.loading-indicator, .no-properties, .error-state {
  text-align: center;
  padding: 4rem 1rem;
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--primary-blue);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
