<template>
  <div class="property-details-page" v-if="property">
    <!-- Hero Gallery -->
    <div class="hero-gallery">
      <div class="main-image-container">
        <img :src="mainImage" alt="Main property photo" class="hero-image" />
        <div class="image-overlay-gradient"></div>
        <div class="price-badge">
          <span class="price-amount">${{ property.pricing?.price?.toLocaleString() }}</span>
          <span class="price-label">{{ property.basic?.saleOrRent }}</span>
        </div>
      </div>
      
      <!-- Thumbnail Strip -->
      <div class="thumbnail-strip" v-if="property.mediaUrls?.photos && property.mediaUrls.photos.length > 1">
        <div class="thumbnail-scroll">
          <div
            v-for="(photo, index) in property.mediaUrls?.photos || []"
            :key="index"
            @click="mainImage = photo"
            :class="{ active: mainImage === photo }"
            class="thumbnail-item"
          >
            <img :src="photo" alt="Thumbnail" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content Container -->
    <div class="content-wrapper">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Property Header -->
        <div class="property-header-card">
          <div class="header-content">
            <h1 class="property-title">{{ property.basic?.title }}</h1>
            <div class="location-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="location-icon">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span class="location-text">{{ property.basic?.location }}</span>
            </div>
          </div>
          <div class="status-badge">
            {{ property.basic?.saleOrRent }}
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats-card">
          <div class="stat-item">
            <div class="stat-icon">🛏️</div>
            <div class="stat-content">
              <span class="stat-value">{{ property.basic?.bedrooms || 'N/A' }}</span>
              <span class="stat-label">Bedrooms</span>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-icon">🛁</div>
            <div class="stat-content">
              <span class="stat-value">{{ property.basic?.bathrooms || 'N/A' }}</span>
              <span class="stat-label">Bathrooms</span>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-icon">📏</div>
            <div class="stat-content">
              <span class="stat-value">{{ property.basic?.size || 'N/A' }}</span>
              <span class="stat-label">Sq. Ft.</span>
            </div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-icon">🏠</div>
            <div class="stat-content">
              <span class="stat-value">{{ property.basic?.propertyType || 'N/A' }}</span>
              <span class="stat-label">Type</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="info-card">
          <h2 class="card-title">About This Property</h2>
          <p class="description-text">{{ property.basic?.description || 'No description available.' }}</p>
        </div>

        <!-- Amenities -->
        <div class="info-card" v-if="property.features?.amenities?.length">
          <h2 class="card-title">Amenities</h2>
          <div class="amenities-list">
            <div v-for="amenity in property.features.amenities" :key="amenity" class="amenity-item">
              <div class="amenity-dot"></div>
              <span>{{ amenity }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Sidebar -->
      <div class="contact-sidebar">
        <div class="contact-card">
          <h2 class="card-title">Contact Agent</h2>
          <div class="agent-info">
            <div class="info-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="info-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>{{ property.contact?.name || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="info-icon">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{{ property.contact?.phone || 'N/A' }}</span>
            </div>
            <div class="info-row">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="info-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>{{ property.contact?.email || 'N/A' }}</span>
            </div>
          </div>
          <button class="contact-button">
            <span>Request Information</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">
    <div class="loading-spinner"></div>
    <p>Loading property details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { usePropertyStore } from '../stores/property';

interface Property extends DocumentData {
  id: string;
  basic?: {
    title?: string;
    location?: string;
    size?: number;
    bedrooms?: number;
    bathrooms?: number;
    description?: string;
    propertyType?: string;
    saleOrRent?: string;
  };
  pricing?: { price?: number };
  features?: { amenities?: string[] };
  mediaUrls?: { photos?: string[] };
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

const property = ref<Property | null>(null);
const mainImage = ref('');
const route = useRoute();
const propertyStore = usePropertyStore();

onMounted(async () => {
  const propertyId = route.params.id as string;
  
  // Check for cached data first
  const cachedProperty = propertyStore.getCachedProperty(propertyId);

  if (cachedProperty) {
    console.log(`[Cache] Loading property '${propertyId}' from cache.`);
    property.value = { id: propertyId, ...cachedProperty } as Property;
  } else {
    console.log(`[API] Fetching property '${propertyId}' from Firestore.`);
    const docRef = doc(db, "properties", propertyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const propertyData = docSnap.data();
      property.value = { id: docSnap.id, ...propertyData } as Property;
      // Cache the newly fetched data
      propertyStore.cacheProperty(propertyId, propertyData);
      console.log(`[Cache] Stored property '${propertyId}' in cache.`);
    } else {
      console.error("No such document!");
    }
  }
});

watch(property, (newVal) => {
  if (newVal && newVal.mediaUrls?.photos?.length) {
    mainImage.value = newVal.mediaUrls.photos[0] ?? '';
  }
}, { immediate: true });
</script>

<style scoped>
.property-details-page {
  background: linear-gradient(to bottom, #f5f7fa 0%, #ffffff 100%);
  padding: 0;
  min-height: 100vh;
  padding-bottom: calc(72px + env(safe-area-inset-bottom, 0));
}

/* Hero Gallery */
.hero-gallery {
  position: relative;
  width: 100%;
}

.main-image-container {
  position: relative;
  width: 100%;
  height: 60vh;
  min-height: 400px;
  max-height: 600px;
  overflow: hidden;
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.image-overlay-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  pointer-events: none;
}

.price-badge {
  position: absolute;
  bottom: 24px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-radius: 18px;
  padding: 16px 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-blue);
  letter-spacing: -0.5px;
  line-height: 1;
}

.price-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.thumbnail-strip {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
  padding: 16px 20px;
}

.thumbnail-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.thumbnail-scroll::-webkit-scrollbar {
  display: none;
}

.thumbnail-item {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2.5px solid transparent;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: rgba(0, 0, 0, 0.05);
  position: relative;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail-item:active {
  transform: scale(0.95);
}

.thumbnail-item.active {
  border-color: var(--primary-blue);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
  transform: scale(1.05);
}

/* Content Wrapper */
.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 1024px) {
  .content-wrapper {
    flex-direction: row;
    gap: 24px;
    padding: 32px 24px;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 1024px) {
  .main-content {
    max-width: 800px;
  }
}

.contact-sidebar {
  width: 100%;
}

@media (min-width: 1024px) {
  .contact-sidebar {
    width: 360px;
    position: sticky;
    top: calc(64px + env(safe-area-inset-top, 0) + 24px);
    height: fit-content;
  }
}

/* Property Header Card */
.property-header-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.header-content {
  flex: 1;
}

.property-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 12px 0;
  line-height: 1.3;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

@media (min-width: 768px) {
  .property-title {
    font-size: 2.25rem;
  }
}

.location-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.9375rem;
  font-weight: 500;
}

.location-icon {
  width: 18px;
  height: 18px;
  color: var(--primary-blue);
  flex-shrink: 0;
}

.location-text {
  opacity: 0.8;
}

.status-badge {
  background: var(--primary-blue);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.3);
}

/* Quick Stats Card */
.quick-stats-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 100px;
  justify-content: center;
}

.stat-icon {
  font-size: 24px;
  opacity: 0.7;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .stat-divider {
    display: none;
  }
  .quick-stats-card {
    flex-direction: column;
    align-items: stretch;
  }
  .stat-item {
    justify-content: flex-start;
    padding: 12px 0;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.06);
  }
  .stat-item:last-child {
    border-bottom: none;
  }
}

/* Info Cards */
.info-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
}

@media (min-width: 768px) {
  .info-card {
    padding: 32px;
  }
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: var(--text-primary);
  letter-spacing: -0.3px;
}

@media (min-width: 768px) {
  .card-title {
    font-size: 1.375rem;
    margin-bottom: 24px;
  }
}

.description-text {
  line-height: 1.75;
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
  letter-spacing: -0.1px;
}

/* Amenities List */
.amenities-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.06);
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
}

.amenity-item:last-child {
  border-bottom: none;
}

.amenity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-blue);
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* Contact Card */
.contact-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  position: sticky;
  top: calc(64px + env(safe-area-inset-top, 0) + 24px);
}

@media (min-width: 1024px) {
  .contact-card {
    padding: 32px;
  }
}

.agent-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(0, 122, 255, 0.04);
  border-radius: 14px;
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
  letter-spacing: -0.1px;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: var(--primary-blue);
  flex-shrink: 0;
  opacity: 0.8;
}

.contact-button {
  width: 100%;
  padding: 16px 24px;
  border: none;
  background: var(--primary-blue);
  color: white;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.25), 0 2px 8px rgba(0, 122, 255, 0.15);
  letter-spacing: -0.2px;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.contact-button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
}

@media (min-width: 768px) {
  .contact-button:hover {
    box-shadow: 0 8px 24px rgba(0, 122, 255, 0.35), 0 4px 12px rgba(0, 122, 255, 0.2);
    transform: translateY(-2px);
  }
}

.contact-button svg {
  width: 20px;
  height: 20px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 4rem 1.5rem;
  gap: 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(0, 122, 255, 0.1);
  border-top: 3px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 500;
  opacity: 0.7;
  margin: 0;
}

</style>
