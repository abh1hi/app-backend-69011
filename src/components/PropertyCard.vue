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
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  height: 100%;
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 122, 255, 0.1);
}

.card-image {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.property-card:hover .card-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
  opacity: 0.8;
}

.property-type-badge {
  position: absolute;
  top: 16px; left: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  color: #111;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge {
    position: absolute;
    top: 16px; right: 16px;
    background: rgba(0, 122, 255, 0.85);
    color: white;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 2;
    backdrop-filter: blur(8px);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.card-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.property-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.3px;
}

.property-location {
  font-size: 0.9rem;
  color: #777;
  margin: 0;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 4px;
}

.property-specs {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 0;
  border-top: 1px solid #f8f8f8;
  border-bottom: 1px solid #f8f8f8;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.spec-item .material-symbols-outlined {
    font-size: 1.1rem;
    opacity: 0.7;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 8px;
}

.property-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #007aff; 
  letter-spacing: -1px;
  margin: 0;
}

.view-btn {
    padding: 10px 24px;
    border-radius: 100px;
    border: 1px solid #007aff;
    background: transparent;
    color: #007aff;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-btn:hover {
    background: #007aff;
    color: white;
    box-shadow: 0 8px 16px rgba(0, 122, 255, 0.2);
}

.owner-actions {
    display: flex;
    gap: 10px;
}

.icon-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.edit-btn { background: #f0f7ff; color: #007aff; }
.edit-btn:hover { background: #007aff; color: white; }

.delete-btn { background: #fff5f5; color: #ff3b30; }
.delete-btn:hover { background: #ff3b30; color: white; }

</style>
