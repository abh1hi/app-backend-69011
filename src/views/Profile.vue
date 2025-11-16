<template>
  <div class="dashboard-page">
    <!-- User Profile Section -->
    <div v-if="user" class="profile-card glass-card">
      <div class="profile-header">
        <h2 class="profile-name">{{ user.displayName || 'User' }}</h2>
        <p class="profile-phone">{{ user.phoneNumber || 'No phone number' }}</p>
      </div>
      <button @click="handleLogout" class="logout-button">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sign Out</span>
      </button>
    </div>

    <!-- Listed Properties Section -->
    <div class="properties-section">
      <h3 class="section-title">My Listed Properties</h3>
      <div v-if="documents.length > 0" class="properties-list">
        <PropertyCard 
          v-for="property in documents" 
          :key="property.id" 
          :property="property" 
        />
      </div>
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
      </div>
      <div v-if="!loading && documents.length === 0 && !error" class="no-properties">
        <p>You haven't listed any properties yet.</p>
      </div>
      <div v-if="error" class="error-state">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useInfiniteScroll } from '../composables/useInfiniteScroll';
import PropertyCard from '../components/PropertyCard.vue';

const user = ref<User | null>(null);
const router = useRouter();
const auth = getAuth();

// Create a ref for the ownerId that will be passed to the composable.
const ownerId = ref<string | null>(null);

// Call the composable immediately and synchronously.
// It will not fetch data until ownerId has a value.
const { documents, loading, error } = useInfiniteScroll('properties', { ownerId });

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // Listen for authentication state changes.
  unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      // When the user is logged in, update the ownerId.
      // The watcher in the composable will trigger the data fetch.
      ownerId.value = currentUser.uid;
    } else {
      // If there is no user, reset the user and ownerId, and redirect.
      user.value = null;
      ownerId.value = null;
      router.push('/login');
    }
  });
});

onUnmounted(() => {
  // Clean up the auth state listener.
  if (unsubscribe) {
    unsubscribe();
  }
});

const handleLogout = async () => {
  await signOut(auth);
  // The onAuthStateChanged listener will handle the redirect.
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
