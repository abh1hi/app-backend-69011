<template>
  <div class="property-card" @click="viewDetails">
    <div class="card-image">
      <img :src="property.mediaUrls?.photos?.[0] || 'https://placehold.co/600x400/png'" alt="Property Image"/>
      <div class="image-overlay"></div>
      <span class="property-type-badge">{{ property.basic?.propertyType }}</span>
    </div>
    <div class="card-content">
      <h3 class="property-title">{{ property.basic?.title }}</h3>
      <p class="property-location">{{ property.basic?.location }}</p>

      <div class="property-specs">
        <div class="spec-item">
          <span class="spec-icon">🛏️</span>
          <span>{{ property.basic?.bedrooms || 'N/A' }} Beds</span>
        </div>
        <div class="spec-item">
          <span class="spec-icon">🛁</span>
          <span>{{ property.basic?.bathrooms || 'N/A' }} Baths</span>
        </div>
        <div class="spec-item">
          <span class="spec-icon">📏</span>
          <span>{{ property.basic?.size || 'N/A' }} sqft</span>
        </div>
      </div>

      <div class="card-footer">
        <p class="property-price">
          ${{ property.pricing?.price ? property.pricing.price.toLocaleString() : 'N/A' }}
        </p>
        <button class="details-btn">View Details</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps({
  property: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const viewDetails = () => {
  router.push({ name: 'PropertyDetails', params: { id: props.property.id } });
};
</script>

<style scoped>
.property-card {
  background-color: var(--white);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(0,0,0,0.07);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.property-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 45px rgba(0,0,0,0.1);
}

.card-image {
  position: relative;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%);
}

.property-type-badge {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
  background-color: rgba(0,0,0,0.5);
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(5px);
}

.card-content {
  padding: 1.2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.property-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-location {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.property-specs {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
}

.spec-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.spec-icon {
  font-size: 1.1rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto; /* Push footer to the bottom */
}

.property-price {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--primary-blue);
}

.details-btn {
  background: none;
  border: 2px solid var(--primary-blue);
  color: var(--primary-blue);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-btn:hover {
  background-color: var(--primary-blue);
  color: var(--white);
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);
}
</style>
