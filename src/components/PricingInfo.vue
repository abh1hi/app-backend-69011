<template>
  <div class="form-section pricing-info">
    <div class="form-grid">
      <div class="form-group">
        <label for="price">Price (₹INR)</label>
        <input id="price" type="number" v-model.number="pricingData.price" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="maintenance">Maintenance</label>
        <input id="maintenance" type="text" v-model="pricingData.maintenance" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="deposit">Deposit</label>
        <input id="deposit" type="text" v-model="pricingData.deposit" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="paymentTerms">Payment Terms</label>
        <select id="paymentTerms" v-model="pricingData.paymentTerms" @change="emitUpdate">
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Yearly</option>
          <option>One-time</option>
        </select>
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
  }
});

const emit = defineEmits(['update']);

const pricingData = ref({ ...props.initialData });

watch(() => props.initialData, (newData) => {
  pricingData.value = { ...newData };
}, { deep: true, immediate: true });

const emitUpdate = () => {
  emit('update', pricingData.value);
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
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-group input, 
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

.form-group input:focus, 
.form-group select:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
}
</style>
