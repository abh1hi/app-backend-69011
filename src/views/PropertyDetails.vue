<template>
  <div class="property-details-page" v-if="property">
    <!-- Gallery -->
    <div class="gallery-container">
      <div class="main-image-wrapper">
        <img :src="mainImage" alt="Main property photo" class="main-image" />
      </div>
      <div class="thumbnail-wrapper">
        <div class="thumbnail-grid">
          <img
            v-for="(photo, index) in property.mediaUrls?.photos"
            :key="index"
            :src="photo"
            alt="Property thumbnail"
            @click="mainImage = photo"
            :class="{ active: mainImage === photo }"
            class="thumbnail-image"
          />
        </div>
      </div>
    </div>

    <!-- Details -->
    <div class="details-container">
      <div class="main-content">
        <div class="property-header">
          <h1 class="property-title">{{ property.basic?.title }}</h1>
          <p class="property-location">
            <i class="fas fa-map-marker-alt"></i>
            {{ property.basic?.location }}
          </p>
        </div>

        <!-- Key Details -->
        <div class="details-card">
          <h2 class="section-title">Key Details</h2>
          <div class="key-details-grid">
            <div class="detail-item">
              <span class="detail-label">Price</span>
              <span class="detail-value price">${{ property.pricing?.price?.toLocaleString() }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Size</span>
              <span class="detail-value">{{ property.basic?.size }} sqft</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Bedrooms</span>
              <span class="detail-value">{{ property.basic?.bedrooms }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label">Bathrooms</span>
              <span class="detail-value">{{ property.basic?.bathrooms }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Property Type</span>
              <span class="detail-value">{{ property.basic?.propertyType }}</span>
            </div>
             <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value status-tag">{{ property.basic?.saleOrRent }}</span>
            </div>
          </div>
        </div>

        <!-- Amenities -->
        <div class="details-card" v-if="property.features?.amenities?.length">
          <h2 class="section-title">Amenities</h2>
          <div class="amenities-grid">
            <div v-for="amenity in property.features.amenities" :key="amenity" class="amenity-chip">
              {{ amenity }}
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="details-card">
          <h2 class="section-title">Description</h2>
          <p class="description-text">{{ property.basic?.description }}</p>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <div class="details-card contact-card">
          <h2 class="section-title">Contact Agent</h2>
           <div class="agent-details">
            <p><i class="fas fa-user"></i> {{ property.contact?.name }}</p>
            <p><i class="fas fa-phone"></i> {{ property.contact?.phone }}</p>
            <p><i class="fas fa-envelope"></i> {{ property.contact?.email }}</p>
          </div>
          <button class="contact-btn">Request Info</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading property details...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Property {
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

onMounted(async () => {
  const propertyId = route.params.id as string;
  const docRef = doc(db, "properties", propertyId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    property.value = { id: docSnap.id, ...docSnap.data() } as Property;
  } else {
    console.error("No such document!");
  }
});

watch(property, (newVal) => {
  if (newVal && newVal.mediaUrls?.photos?.length) {
    mainImage.value = newVal.mediaUrls.photos[0] ?? '';
  }
});
</script>

<style scoped>
.property-details-page {
  background-color: #f9fafb;
  padding: 1.5rem;
}

/* Gallery */
.gallery-container {
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
.main-image-wrapper {
  height: 400px;
}
.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumbnail-wrapper {
  background-color: #fff;
  padding: 0.75rem;
}
.thumbnail-grid {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
}
.thumbnail-image {
  width: 100px;
  height: 75px;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid transparent;
  transition: border-color 0.3s, transform 0.3s;
}
.thumbnail-image:hover {
  transform: scale(1.05);
}
.thumbnail-image.active {
  border-color: var(--primary-blue);
}

/* Details Layout */
.details-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .details-container {
    grid-template-columns: 2fr 1fr;
  }
}

.details-card {
  background-color: var(--white);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

/* Header */
.property-header {
  margin-bottom: 2rem;
}
.property-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.property-location {
  font-size: 1.1rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}


/* Key Details */
.key-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1.5rem;
}
.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.detail-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}
.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}
.detail-value.price {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary-blue);
}

.status-tag {
    background-color: var(--primary-blue-light);
    color: var(--primary-blue);
    padding: 0.3rem 0.8rem;
    border-radius: 30px;
    font-size: 0.8rem;
    font-weight: 600;
    text-align: center;
    display: inline-block;
}

/* Amenities */
.amenities-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.amenity-chip {
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.6rem 1rem;
  border-radius: 30px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Description */
.description-text {
  line-height: 1.7;
  color: var(--text-secondary);
}

/* Sidebar */
.agent-details p {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.contact-btn {
  width: 100%;
  padding: 1rem;
  border: none;
  background: linear-gradient(45deg, var(--primary-blue), #00c6ff);
  color: white;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.contact-btn:hover {
    box-shadow: 0 6px 20px rgba(0,122,255,0.3);
    transform: translateY(-3px);
}

/* Loading */
.loading {
  padding: 4rem;
  text-align: center;
}

</style>
