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
          <span class="spec-icon">&#128719;️</span>
          <span>{{ property.basic?.bedrooms || 'N/A' }} Beds</span>
        </div>
        <div class="spec-item">
          <span class="spec-icon">&#128705;</span>
          <span>{{ property.basic?.bathrooms || 'N/A' }} Baths</span>
        </div>
        <div class="spec-item">
          <span class="spec-icon">&#128207;</span>
          <span>{{ property.basic?.size || 'N/A' }} sqft</span>
        </div>
      </div>

      <div class="card-footer">
         <p class="property-price">
          ₹{{ property.pricing?.price ? property.pricing.price.toLocaleString() : 'N/A' }}
        </p>
        <div v-if="showOwnerActions" class="owner-actions">
          <button @click.stop="onEdit" class="edit-btn">Edit</button>
          <button @click.stop="onDelete" class="delete-btn">Delete</button>
        </div>
        <button v-else class="details-btn">View Details</button>
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 0.5px solid rgba(255, 255, 255, 0.8);
}

.property-card:active {
  transform: scale(0.98);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

@media (min-width: 768px) {
  .property-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.property-card:active .card-image img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent 60%);
  pointer-events: none;
}

.property-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  z-index: 1;
}

.card-content {
  padding: 18px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.3px;
}

.property-location {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 400;
  opacity: 0.8;
}

.property-specs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
  padding: 12px 0 0;
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
}

.spec-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.spec-icon {
  font-size: 1.125rem;
  opacity: 0.7;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 12px;
  gap: 12px;
}

.property-price {
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--primary-blue);
  letter-spacing: -0.5px;
  flex: 1;
}

.details-btn, .edit-btn, .delete-btn {
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;
}

.details-btn:active, .edit-btn:active, .delete-btn:active {
  transform: scale(0.96);
}

.details-btn {
  background: rgba(0, 122, 255, 0.1);
  color: var(--primary-blue);
}

.edit-btn {
  background: rgba(255, 149, 0, 0.1);
  color: #FF9500;
}

.delete-btn {
  background: rgba(255, 59, 48, 0.1);
  color: #FF3B30;
}

@media (min-width: 768px) {
  .details-btn:hover {
    background: var(--primary-blue);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 122, 255, 0.25);
  }
  .edit-btn:hover {
    background: #FF9500;
    color: white;
    box-shadow: 0 4px 12px rgba(255, 149, 0, 0.25);
  }
  .delete-btn:hover {
    background: #FF3B30;
    color: white;
    box-shadow: 0 4px 12px rgba(255, 59, 48, 0.25);
  }
}

.owner-actions {
    display: flex;
    gap: 8px;
}

</style>
