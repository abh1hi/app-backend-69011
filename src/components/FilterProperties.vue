<template>
  <FormModal 
    :is-visible="isVisible" 
    title="Filter Properties" 
    @save="applyFilters" 
    @close="$emit('close')"
  >
    <div class="filter-properties">
      <div class="filter-group">
        <label class="filter-label">Property Type</label>
        <div class="filter-options">
          <button
            :class="{ active: saleOrRent === 'sale' }"
            @click="saleOrRent = 'sale'"
          >
            For Sale
          </button>
          <button
            :class="{ active: saleOrRent === 'rent' }"
            @click="saleOrRent = 'rent'"
          >
            For Rent
          </button>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">Price Range</label>
        <div class="price-range">
          <span>${{ priceRange[0] }}</span>
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            v-model.number="priceRange[0]"
          />
          <input
            type="range"
            min="0"
            max="1000000"
            step="10000"
            v-model.number="priceRange[1]"
          />
          <span>${{ priceRange[1] }}</span>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label">State</label>
        <select v-model="selectedState">
          <option value="">All States</option>
          <option v-for="state in propertyStore.availableStates" :key="state" :value="state">
            {{ state }}
          </option>
        </select>
      </div>
    </div>
  </FormModal>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import FormModal from './FormModal.vue';
import { usePropertyStore } from '../stores/property';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['apply-filters', 'close']);

const propertyStore = usePropertyStore();

const saleOrRent = ref('sale');
const priceRange = ref([0, 1000000]);
const selectedState = ref('');

onMounted(() => {
  propertyStore.fetchAvailableStates();
});

const applyFilters = () => {
  emit('apply-filters', {
    saleOrRent: saleOrRent.value,
    priceRange: priceRange.value,
    state: selectedState.value,
  });
};
</script>

<style scoped>
.filter-properties {
  padding: 1rem 0;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.filter-options {
  display: flex;
  gap: 0.5rem;
}

.filter-options button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #f9fafb;
  color: var(--text-secondary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-options button.active {
  background-color: var(--primary-blue);
  color: #fff;
  border-color: var(--primary-blue);
}

.price-range {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-range span {
  font-weight: 500;
  color: var(--text-secondary);
}

.price-range input[type="range"] {
  flex: 1;
}

select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #f9fafb;
  font-size: 1rem;
}
</style>
