<template>
  <div class="form-section basic-info">
    <div class="form-grid">
      <div class="form-group full-width">
        <label for="title">Property Title</label>
        <input id="title" type="text" v-model="basicData.title" @input="emitUpdate">
      </div>
      <div class="form-group full-width">
        <label for="description">Description</label>
        <textarea id="description" v-model="basicData.description" @input="emitUpdate"></textarea>
      </div>
      <div class="form-group">
        <label for="propertyType">Property Type</label>
        <select id="propertyType" v-model="basicData.propertyType" @change="emitUpdate">
          <option disabled value="">Please select one</option>
          <option>Apartment</option>
          <option>House</option>
          <option>Condo</option>
          <option>Land</option>
          <option>Commercial</option>
        </select>
      </div>
      <div class="form-group">
        <label for="saleOrRent">For Sale or Rent</label>
        <select id="saleOrRent" v-model="basicData.saleOrRent" @change="emitUpdate">
          <option disabled value="">Please select one</option>
          <option>Sale</option>
          <option>Rent</option>
        </select>
      </div>
      <div class="form-group">
        <label for="bedrooms">Bedrooms</label>
        <input id="bedrooms" type="number" min="0" v-model.number="basicData.bedrooms" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="bathrooms">Bathrooms</label>
        <input id="bathrooms" type="number" min="0" v-model.number="basicData.bathrooms" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="size">Size (sqft)</label>
        <input id="size" type="number" min="0" v-model.number="basicData.size" @input="emitUpdate">
      </div>
       <div class="form-group">
        <label for="floor">Floor</label>
        <input id="floor" type="number" min="0" v-model.number="basicData.floor" @input="emitUpdate">
      </div>
        <div class="form-group">
        <label for="age">Age of Property</label>
        <input id="age" type="number" min="0" v-model.number="basicData.age" @input="emitUpdate">
      </div>
       <div class="form-group full-width">
        <label for="location">Location / Address</label>
        <input id="location" type="text" v-model="basicData.location" :disabled="isEditMode" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="city">City</label>
        <input id="city" type="text" v-model="basicData.city" :disabled="isEditMode" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="state">State</label>
        <input id="state" type="text" v-model="basicData.state" :disabled="isEditMode" @input="emitUpdate">
      </div>
       <div class="form-group">
        <label for="pincode">Pincode</label>
        <input id="pincode" type="text" v-model="basicData.pincode" :disabled="isEditMode" @input="emitUpdate">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update']);

const basicData = ref({ ...props.initialData });

watch(() => props.initialData, (newData) => {
  basicData.value = { ...newData };
}, { deep: true, immediate: true });

const emitUpdate = () => {
  emit('update', basicData.value);
};
</script>

<style scoped>
.form-section {
  padding-top: 1.5rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  .full-width {
    grid-column: 1 / -1;
  }
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group input, 
.form-group textarea, 
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  font-size: 1rem;
  color: var(--text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:disabled, 
.form-group textarea:disabled, 
.form-group select:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-group input:focus, 
.form-group textarea:focus, 
.form-group select:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}
</style>
