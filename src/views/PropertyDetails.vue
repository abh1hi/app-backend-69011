<template>
  <div class="property-details-page" v-if="property">
    <!-- Hero Section with Gallery -->
    <div class="hero-section">
      <div class="hero-media-wrapper">
        <img :src="mainImage" alt="Property Image" class="hero-image" />
        <div class="hero-overlay"></div>
        <button class="back-btn" @click="router.back()">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      <!-- Thumbnail Strip -->
      <div class="gallery-strip" v-if="property.mediaUrls?.photos && property.mediaUrls.photos.length > 1">
        <div 
          v-for="(photo, index) in property.mediaUrls.photos" 
          :key="index"
          @click="mainImage = photo"
          class="gallery-thumb"
          :class="{ active: mainImage === photo }"
        >
          <img :src="photo" alt="Thumbnail" />
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="content-container">
      <div class="main-column">
        
        <!-- Header Info -->
        <header class="property-header">
           <div class="header-top">
             <span class="status-badge">{{ property.basic?.saleOrRent }}</span>
             <span class="type-badge">{{ property.basic?.propertyType }}</span>
           </div>
           
           <h1 class="property-title">{{ property.basic?.title }}</h1>
           
           <div class="location-row">
             <span class="material-symbols-outlined icon">location_on</span>
             <span>{{ property.basic?.location }}</span>
           </div>

           <div class="price-row">
             <span class="currency">₹</span>
             <span class="amount">{{ property.pricing?.price?.toLocaleString() || 'N/A' }}</span>
           </div>
        </header>

        <!-- Specs Grid -->
        <div class="specs-grid">
           <div class="spec-card">
              <span class="material-symbols-outlined">bed</span>
              <div class="spec-info">
                <span class="value">{{ property.basic?.bedrooms || '-' }}</span>
                <span class="label">Bedrooms</span>
              </div>
           </div>
           <div class="spec-card">
              <span class="material-symbols-outlined">bathtub</span>
              <div class="spec-info">
                <span class="value">{{ property.basic?.bathrooms || '-' }}</span>
                <span class="label">Bathrooms</span>
              </div>
           </div>
           <div class="spec-card">
              <span class="material-symbols-outlined">square_foot</span>
              <div class="spec-info">
                <span class="value">{{ property.basic?.size || '-' }}</span>
                <span class="label">Area ({{property.basic?.sizeUnit || 'sqft' }})</span>
              </div>
           </div>
           <div class="spec-card">
              <span class="material-symbols-outlined">category</span>
              <div class="spec-info">
                <span class="value">{{ property.basic?.propertyType || '-' }}</span>
                <span class="label">Type</span>
              </div>
           </div>
        </div>

        <section class="info-section">
          <h3>Property Overview</h3>
          <div class="overview-grid">
             <div class="overview-item" v-if="property.basic?.age">
                <span class="label">Property Age</span>
                <span class="value">{{ property.basic?.age }} Years</span>
             </div>
             <div class="overview-item" v-if="property.basic?.floor">
                <span class="label">Floor</span>
                <span class="value">{{ property.basic?.floor }}</span>
             </div>
             <div class="overview-item" v-if="property.features?.furnishing">
                <span class="label">Furnishing</span>
                <span class="value">{{ property.features?.furnishing }}</span>
             </div>
             <div class="overview-item" v-if="property.features?.parking">
                <span class="label">Parking</span>
                <span class="value">{{ property.features?.parking }}</span>
             </div>
              <div class="overview-item" v-if="property.basic?.city">
                <span class="label">City</span>
                <span class="value">{{ property.basic?.city }}</span>
             </div>
             <!-- Full Address if available -->
             <div class="overview-item full-width">
               <span class="label">Full Address</span>
               <span class="value">{{ property.basic?.location }}</span>
             </div>
          </div>
        </section>

        <section class="info-section">
          <h3>Description</h3>
          <p class="description">{{ property.basic?.description || 'No description available for this property.' }}</p>
        </section>

        <section class="info-section" v-if="property.features?.amenities?.length">
          <h3>Amenities & Features</h3>
          <div class="amenities-grid">
            <div v-for="amenity in property.features.amenities" :key="amenity" class="amenity-tag">
              <span class="material-symbols-outlined">check_circle</span>
              {{ amenity }}
            </div>
             <div class="amenity-tag" v-if="property.features?.security">
               <span class="material-symbols-outlined">security</span>
               Security: {{ property.features.security }}
             </div>
          </div>
        </section>

         <section class="info-section">
          <h3>Pricing and Financials</h3>
          <div class="overview-grid">
             <div class="overview-item">
                <span class="label">Price</span>
                <span class="value highlight">₹{{ property.pricing?.price?.toLocaleString() || '-' }}</span>
             </div>
             <div class="overview-item" v-if="property.pricing?.maintenance">
                <span class="label">Maintenance</span>
                <span class="value">₹{{ property.pricing?.maintenance }}</span>
             </div>
             <div class="overview-item" v-if="property.pricing?.deposit">
                <span class="label">Deposit</span>
                <span class="value">₹{{ property.pricing?.deposit }}</span>
             </div>
              <div class="overview-item" v-if="property.pricing?.paymentTerms">
                 <span class="label">Payment Terms</span>
                 <span class="value">{{ property.pricing?.paymentTerms }}</span>
              </div>
          </div>
        </section>

         <section class="info-section" v-if="property.legal?.ownershipDocs || property.legal?.registration">
          <h3>Legal Information</h3>
          <div class="overview-grid">
             <div class="overview-item" v-if="property.legal?.ownershipDocs">
                <span class="label">Ownership Docs</span>
                <span class="value">{{ property.legal?.ownershipDocs }}</span>
             </div>
              <div class="overview-item" v-if="property.legal?.registration">
                <span class="label">Registration</span>
                <span class="value">{{ property.legal?.registration }}</span>
             </div>
          </div>
        </section>

      </div>

      <!-- Sidebar -->
      <aside class="sidebar-column">
        <div class="contact-card">
          <h3>Contact Agent</h3>
          <div class="agent-profile">
            <div class="agent-avatar">
               <span class="material-symbols-outlined">person</span>
            </div>
            <div class="agent-details">
              <h4>{{ property.contact?.name || 'Agent' }}</h4>
              <p>Certified Partner</p>
            </div>
          </div>
          
          <div class="contact-info-list">
             <div class="contact-row" v-if="property.contact?.contactMethod">
                 <span class="material-symbols-outlined">contact_phone</span>
                 <span>Prefers: {{ property.contact.contactMethod }}</span>
             </div>
          </div>

          <div class="contact-actions">
            <button class="action-btn call" v-if="property.contact?.phone">
              <span class="material-symbols-outlined">call</span>
              {{ property.contact.phone }}
            </button>
            <button class="action-btn email" v-if="property.contact?.email">
              <span class="material-symbols-outlined">mail</span>
               Email Agent
            </button>
          </div>
        </div>
      </aside>
    </div>

  </div>
  
  <div v-else class="loading-state">
    <div class="spinner"></div>
    <p>Loading property details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, getDoc, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { usePropertyStore } from '../stores/property';

interface Property extends DocumentData {
  id: string;
  basic?: {
    title?: string;
    location?: string;
    city?: string;          // Added
    state?: string;         // Added
    pincode?: string;       // Added
    size?: number;
    sizeUnit?: string;
    bedrooms?: number;
    bathrooms?: number;
    description?: string;
    propertyType?: string;
    saleOrRent?: string;
    age?: string;           // Added
    floor?: string;         // Added
  };
  pricing?: { 
      price?: number; 
      maintenance?: string; // Added
      deposit?: string;     // Added
      paymentTerms?: string;// Added
  };
  features?: { 
      amenities?: string[];
      furnishing?: string;  // Added
      parking?: string;     // Added
      security?: string;    // Added
  };
  legal?: {                // Added
      ownershipDocs?: string;
      registration?: string;
  };
  mediaUrls?: { photos?: string[] };
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
    contactMethod?: string; // Added
  };
  createdAt?: any;          // Added
}

const property = ref<Property | null>(null);
const mainImage = ref('');
const route = useRoute();
const router = useRouter();
const propertyStore = usePropertyStore();

onMounted(async () => {
  const propertyId = route.params.id as string;
  
  // Check for cached data first
  const cachedProperty = propertyStore.getCachedProperty(propertyId);

  if (cachedProperty) {
    property.value = { id: propertyId, ...cachedProperty } as Property;
  } else {
    const docRef = doc(db, "properties", propertyId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const propertyData = docSnap.data();
      property.value = { id: docSnap.id, ...propertyData } as Property;
      propertyStore.cacheProperty(property.value);
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
  min-height: 100vh;
  background: #fff;
  font-family: 'Outfit', sans-serif;
  padding-bottom: 80px;
}

/* Hero */
.hero-section {
  position: relative;
  background: #f5f5f5;
}

.hero-media-wrapper {
  position: relative;
  width: 100%;
  height: 50vh;
  min-height: 400px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%);
}

.back-btn {
  position: absolute;
  top: 24px; left: 24px;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  z-index: 10;
}

.back-btn:active { transform: scale(0.95); }

/* Gallery Strip */
.gallery-strip {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  overflow-x: auto;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.gallery-thumb {
  width: 80px; height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s;
}

.gallery-thumb.active {
  opacity: 1;
  box-shadow: 0 0 0 2px #111;
}

.gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* Content Layout */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  gap: 48px;
}

.main-column { flex: 1; }
.sidebar-column { width: 340px; }

/* Header */
.property-header { margin-bottom: 32px; }

.header-top {
  display: flex; gap: 8px; margin-bottom: 12px;
}

.status-badge, .type-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge { background: #111; color: white; }
.type-badge { background: #f0f0f0; color: #333; }

.property-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.location-row {
  display: flex; align-items: center; gap: 8px;
  color: #666;
  font-size: 1rem;
  margin-bottom: 16px;
}

.location-row .icon { font-size: 20px; color: #888; }

.price-row {
  display: flex; align-items: flex-start;
  color: #111;
}

.currency { font-size: 1.25rem; font-weight: 600; margin-top: 4px; margin-right: 2px; }
.amount { font-size: 2.5rem; font-weight: 700; letter-spacing: -1px; }

/* Specs Grid */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.spec-card {
  background: #fafafa;
  padding: 16px;
  border-radius: 12px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 12px;
}

.spec-card .material-symbols-outlined {
  font-size: 24px; color: #444; background: white; padding: 8px; border-radius: 8px;
}

.spec-info { display: flex; flex-direction: column; }
.spec-info .value { font-size: 1.1rem; font-weight: 700; color: #111; }
.spec-info .label { font-size: 0.8rem; color: #666; }

/* Info Sections */
.info-section { margin-bottom: 40px; }
.info-section h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #1a1a1a; }
.description { line-height: 1.6; color: #444; font-size: 1.05rem; }

.amenities-grid {
  display: flex; flex-wrap: wrap; gap: 12px;
}

.amenity-tag {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #eee;
  border-radius: 100px;
  font-size: 0.95rem;
  color: #333;
}

.amenity-tag .material-symbols-outlined { font-size: 18px; color: #22c55e; }

/* Contact Card */
.contact-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  position: sticky; top: 100px;
}

.contact-card h3 { margin: 0 0 20px 0; font-size: 1.1rem; }

.agent-profile {
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
}

.agent-avatar {
  width: 56px; height: 56px; background: #f0f0f0; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.agent-avatar span { font-size: 32px; color: #bbb; }

.agent-details h4 { margin: 0; font-size: 1rem; font-weight: 600; }
.agent-details p { margin: 4px 0 0; font-size: 0.85rem; color: #666; }

.contact-actions { display: flex; flex-direction: column; gap: 12px; }

.action-btn {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.2s;
}

.action-btn.call { background: #111; color: white; }
.action-btn.call:hover { background: #333; }

.action-btn.email { background: white; border: 1px solid #111; color: #111; }
.action-btn.email:hover { background: #f9f9f9; }

/* Responsive */
@media (max-width: 1024px) {
  .content-container { flex-direction: column; gap: 32px; }
  .sidebar-column { width: 100%; }
}

@media (max-width: 640px) {
  .hero-media-wrapper { height: 40vh; }
  .specs-grid { grid-template-columns: repeat(2, 1fr); }
  .property-title { font-size: 1.5rem; }
  .amount { font-size: 2rem; }
}

/* Loading */
.loading-state {
  height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.spinner {
  width: 40px; height: 40px; border: 3px solid #eee; border-top-color: #111;
  border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Overview Grid */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.overview-item {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #f0f0f0;
  padding: 12px 16px;
  border-radius: 12px;
}

.overview-item.full-width {
  grid-column: 1 / -1;
}

.overview-item .label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
}

.overview-item .value {
  font-size: 1rem;
  font-weight: 600;
  color: #111;
}

.overview-item .value.highlight {
  color: #007aff;
  font-size: 1.2rem;
}

/* Contact Info List */
.contact-info-list {
  margin-bottom: 20px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #444;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.contact-row .material-symbols-outlined {
  font-size: 18px;
  color: #666;
}

@media (max-width: 640px) {
  .hero-media-wrapper { height: 40vh; }
  .specs-grid { grid-template-columns: repeat(2, 1fr); }
  .overview-grid { grid-template-columns: 1fr; }
  .property-title { font-size: 1.5rem; }
  .amount { font-size: 2rem; }
}
</style>
