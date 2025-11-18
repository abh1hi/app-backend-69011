<template>
  <div class="edit-property-container">
    <div class="header">
      <h1 class="page-title">Edit Property</h1>
      <div class="header-actions">
        <button @click="cancel" class="cancel-btn">Cancel</button>
        <button @click="saveAllChanges" class="save-all-btn" :disabled="isSaving">
          <span v-if="isSaving" class="spinner-icon"></span>
          {{ isSaving ? 'Saving...' : 'Save All Changes' }}
        </button>
      </div>
    </div>

    <div v-if="propertyData && isMapsApiLoaded" class="form-container">
      <EditSection title="Basic Information" startOpen>
        <BasicInfo :initial-data="propertyData.basic" :is-edit-mode="true" @update="handleUpdate('basic', $event)"/>
      </EditSection>

      <EditSection title="Pricing Details">
        <PricingInfo :initial-data="propertyData.pricing" @update="handleUpdate('pricing', $event)"/>
      </EditSection>

      <EditSection title="Features & Amenities">
        <FeaturesInfo :initial-data="propertyData.features" @update="handleUpdate('features', $event)"/>
      </EditSection>

      <EditSection title="Contact Information">
        <ContactInfo :initial-data="propertyData.contact" @update="handleUpdate('contact', $event)"/>
      </EditSection>

       <EditSection title="Media (Photos & Videos)">
        <MediaInfo :initial-media="propertyData.mediaUrls" @update="handleMediaUpdate" />
      </EditSection>

    </div>

    <div v-else-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading property details...</p>
    </div>
     <div v-else class="error-state">
      <p>Sorry, we couldn't load the property details. Please try again later.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '../stores/property';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useGoogleMaps } from '../composables/useGoogleMaps';

import EditSection from '../components/EditSection.vue';
import BasicInfo from '../components/BasicInfo.vue';
import PricingInfo from '../components/PricingInfo.vue';
import FeaturesInfo from '../components/FeaturesInfo.vue';
import ContactInfo from '../components/ContactInfo.vue';
import MediaInfo from '../components/MediaInfo.vue';

const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();
const { load: loadMapsApi, isLoaded: isMapsApiLoaded } = useGoogleMaps();

const propertyData = ref<any>(null);
const updatedData = ref<any>({});
const mediaChanges = ref<{ newFiles: File[], deletedUrls: string[] }>({ newFiles: [], deletedUrls: [] });

const propertyId = route.params.id as string;
const isLoading = ref(true);
const isSaving = ref(false);

onMounted(async () => {
  await loadMapsApi(); // Load the Google Maps API
  const cachedProp = propertyStore.getCachedProperty(propertyId);
  if (cachedProp) {
    propertyData.value = JSON.parse(JSON.stringify(cachedProp));
    isLoading.value = false;
    return;
  }

  try {
    const docRef = doc(db, 'properties', propertyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const fetchedData = { id: docSnap.id, ...docSnap.data() };
      propertyData.value = JSON.parse(JSON.stringify(fetchedData));
      propertyStore.cacheProperty(propertyData.value);
    } else {
      console.error('No such document!');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
  } finally {
    isLoading.value = false;
  }
});

const handleUpdate = (section: string, data: any) => {
  if (!updatedData.value[section]) {
    updatedData.value[section] = {};
  }
  updatedData.value[section] = { ...updatedData.value[section], ...data };
};

const handleMediaUpdate = (changes: { newFiles: File[], deletedUrls: string[] }) => {
  mediaChanges.value = changes;
};

const saveAllChanges = async () => {
  isSaving.value = true;
  try {
    await propertyStore.updatePropertyWithMedia(propertyId, updatedData.value, mediaChanges.value);
    alert('Property updated successfully!');
    router.push({ name: 'Dashboard' });
  } catch (error) {
    console.error('Failed to save changes:', error);
    alert('An error occurred while saving. Please try again.');
  } finally {
    isSaving.value = false;
  }
};

const cancel = () => {
  router.back();
};

</script>

<style scoped>
.edit-property-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.save-all-btn, .cancel-btn {
  padding: 0.875rem 1.75rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.save-all-btn {
  background: linear-gradient(135deg, var(--primary-blue), #0051d5);
  color: white;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
}

.cancel-btn {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid #d1d5db;
}

.cancel-btn:hover {
  background: #f3f4f6;
  border-color: #a1a1aa;
}

.save-all-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.spinner-icon {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.loading-state, .error-state {
  text-align: center;
  padding: 5rem 1rem;
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.spinner {
  border: 3px solid rgba(0, 122, 255, 0.1);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
