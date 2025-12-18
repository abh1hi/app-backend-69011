<template>
  <div v-if="isVisible" class="sheet-overlay" @click.self="close">
    <div class="sheet-content">
      <div class="sheet-header">
        <div class="drag-handle"></div>
        <div class="header-row">
            <h3>Filters</h3>
            <button class="clear-btn" @click="emit('clear')">Clear All</button>
        </div>
      </div>

      <div class="sheet-body">
         <div class="filter-group">
            <label>Property Type</label>
            <select :value="filters.propertyType" @input="updateFilter('propertyType', ($event.target as HTMLSelectElement).value)" class="filter-select">
            <option value="">All Types</option>
            <option v-for="type in propertyTypes" :key="type" :value="type">
                {{ type }}
            </option>
            </select>
        </div>

        <div class="filter-group">
            <label>Size Unit</label>
            <select :value="filters.sizeUnit" @input="updateFilter('sizeUnit', ($event.target as HTMLSelectElement).value)" class="filter-select">
            <option value="">Any Unit</option>
            <option v-for="unit in measurementUnits" :key="unit" :value="unit">
                {{ unit }}
            </option>
            </select>
        </div>

        <div class="filter-group">
            <label>Size Range</label>
            <div class="range-inputs">
            <input :value="filters.minSize" @input="updateFilter('minSize', ($event.target as HTMLInputElement).value)" type="number" placeholder="Min" class="filter-input" />
            <span class="separator">-</span>
            <input :value="filters.maxSize" @input="updateFilter('maxSize', ($event.target as HTMLInputElement).value)" type="number" placeholder="Max" class="filter-input" />
            </div>
        </div>
      </div>

      <div class="sheet-footer">
        <button class="submit-btn" @click="apply">Apply Filters</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps<{
  isVisible: boolean;
  filters: any;
  propertyTypes: string[];
  measurementUnits: string[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'apply'): void;
  (e: 'clear'): void;
  (e: 'update:filter', key: string, value: any): void;
}>();

const close = () => {
  emit('close');
};

const apply = () => {
    emit('apply');
};

const updateFilter = (key: string, value: any) => {
    emit('update:filter', key, value);
};
</script>

<style scoped>
.sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  animation: fade-in 0.3s ease;
  font-family: 'Outfit', sans-serif;
}

.sheet-content {
  background: white;
  width: 100%;
  max-height: 85vh;
  border-radius: 24px 24px 0 0;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 20px));
  display: flex;
  flex-direction: column;
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.sheet-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.drag-handle {
  width: 40px;
  height: 5px;
  background: #e0e0e0;
  border-radius: 3px;
  margin: 0 auto 16px;
}

.header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sheet-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.clear-btn {
    background: none;
    border: none;
    color: #666;
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0;
    cursor: pointer;
}

.sheet-body {
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #444;
}

.filter-select, .filter-input {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #eee;
  font-size: 1rem;
  width: 100%;
  background-color: #f9f9f9;
  color: #333;
  outline: none;
}

.filter-select:focus, .filter-input:focus {
    border-color: #111;
    background: white;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.separator {
  color: #888;
}

.sheet-footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
}

.submit-btn {
  width: 100%;
  background: #111;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:active {
    opacity: 0.9;
    transform: scale(0.98);
}
</style>
