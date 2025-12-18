<template>
  <div class="property-card" @click="viewDetails">
    <div class="card-image">
      <img :src="property.mediaUrls?.photos?.[0] || 'https://placehold.co/600x400/png'" alt="Property Image"/>
      <div class="image-overlay"></div>
      <span class="property-type-badge">{{ property.basic?.propertyType }}</span>
      <span class="status-badge">{{ property.basic?.saleOrRent }}</span>
    </div>
    
    <div class="card-content">
      <div class="card-header">
        <h3 class="property-title">{{ property.basic?.title }}</h3>
        <p class="property-location">{{ property.basic?.city }}, {{ property.basic?.state }}</p>
      </div>

      <div class="property-specs">
        <div class="spec-item" v-if="property.basic?.bedrooms">
          <span class="material-symbols-outlined">bed</span>
          <span>{{ property.basic?.bedrooms }} Beds</span>
        </div>
        <div class="spec-item" v-if="property.basic?.bathrooms">
          <span class="material-symbols-outlined">bathtub</span>
          <span>{{ property.basic?.bathrooms }} Baths</span>
        </div>
        <div class="spec-item" v-if="property.basic?.size">
          <span class="material-symbols-outlined">square_foot</span>
          <span>{{ property.basic?.size }} {{ property.basic?.sizeUnit || 'sqft' }}</span>
        </div>
      </div>

      <div class="card-footer">
         <p class="property-price">
          ₹{{ property.pricing?.price ? property.pricing.price.toLocaleString() : 'N/A' }}
        </p>
        
        <div v-if="showOwnerActions" class="owner-actions">
          <button @click.stop="onEdit" class="icon-btn edit-btn">
             <span class="material-symbols-outlined">edit</span>
          </button>
          <button @click.stop="onDelete" class="icon-btn delete-btn">
             <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
        <button v-else class="view-btn">
          View
        </button>
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
  },
  showOwnerActions: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'delete']);
const router = useRouter();

const viewDetails = () => {
  if (!props.showOwnerActions) {
    router.push({ name: 'PropertyDetails', params: { id: props.property.id } });
  }
};

const onEdit = () => {
  emit('edit', props.property.id);
};

const onDelete = () => {
  emit('delete', props.property.id);
};
</script>

<style scoped>
.property-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: 100%;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
  border-color: transparent;
}

.card-image {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.property-card:hover .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%);
  opacity: 0.6;
}

.property-type-badge {
  position: absolute;
  top: 12px; left: 12px;
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.status-badge {
    position: absolute;
    top: 12px; right: 12px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    z-index: 2;
    backdrop-filter: blur(4px);
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.property-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.property-location {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.property-specs {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #555;
  font-weight: 500;
}

.spec-item svg {
    opacity: 0.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 4px;
}

.property-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111; 
  letter-spacing: -0.5px;
  margin: 0;
}

.view-btn {
    padding: 6px 16px;
    border-radius: 100px;
    border: 1px solid #e5e5e5;
    background: white;
    color: #111;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.view-btn:hover {
    background: #111;
    color: white;
    border-color: #111;
}

.owner-actions {
    display: flex;
    gap: 8px;
}

.icon-btn {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-btn { background: #fff8e1; color: #f59e0b; }
.edit-btn:hover { background: #f59e0b; color: white; }

.delete-btn { background: #fee2e2; color: #ef4444; }
.delete-btn:hover { background: #ef4444; color: white; }

</style>
