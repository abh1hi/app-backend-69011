<template>
  <div class="search-bar-container">
    <div class="search-input-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input
        type="text"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        placeholder="Search by name, location..."
        class="search-input"
      />
    </div>
    <button @click="$emit('search')" class="search-button">Search</button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

defineEmits(['update:modelValue', 'search']);
</script>

<style scoped>
.search-bar-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  max-width: 500px;
}

.search-input-wrapper {
  position: relative;
  flex-grow: 1;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #9e9e9e;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  font-size: 1rem;
  transition: box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
  border-color: #007aff;
}

.search-button {
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  border: none;
  background-color: #007aff;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #0056b3;
}
</style>
