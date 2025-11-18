<template>
  <div class="form-section contact-info">
    <div class="form-grid">
      <div class="form-group">
        <label for="name">Contact Name</label>
        <input id="name" type="text" v-model="contactData.name" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="contactData.email" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="phone">Phone</label>
        <input id="phone" type="tel" v-model="contactData.phone" @input="emitUpdate">
      </div>
      <div class="form-group">
        <label for="contactMethod">Preferred Contact Method</label>
        <select id="contactMethod" v-model="contactData.contactMethod" @change="emitUpdate">
          <option>Email</option>
          <option>Phone</option>
          <option>Either</option>
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

const contactData = ref({ ...props.initialData });

watch(() => props.initialData, (newData) => {
  contactData.value = { ...newData };
}, { deep: true, immediate: true });

const emitUpdate = () => {
  emit('update', contactData.value);
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
