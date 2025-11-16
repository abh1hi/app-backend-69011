<template>
  <div class="picker-overlay" v-if="isVisible" @click.self="close">
    <div class="picker-container" :class="{ 'is-visible': isVisible }">
      <div class="picker-header">
        <h3 class="picker-title">{{ title }}</h3>
        <button @click="close" class="close-btn">Done</button>
      </div>
      <div class="picker-body">
        <ul>
          <li 
            v-for="option in options" 
            :key="option" 
            @click="selectOption(option)"
            class="picker-option"
          >
            {{ option }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
  isVisible: Boolean,
  title: String,
  options: Array as () => string[]
});

const emit = defineEmits(['close', 'select']);

const close = () => {
  emit('close');
};

const selectOption = (option: string) => {
  emit('select', option);
  close();
};
</script>

<style scoped>

.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2000;
}

.picker-container {
  width: 100%;
  max-width: 500px;
  background: var(--background-color);
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 -5px 30px rgba(0,0,0,0.1);
}

.picker-container.is-visible {
  transform: translateY(0);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.picker-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-blue);
  cursor: pointer;
}

.picker-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 40vh;
  overflow-y: auto;
}

.picker-option {
  padding: 1.2rem 1.5rem;
  text-align: center;
  font-size: 1.1rem;
  cursor: pointer;
  border-bottom: 1px solid #e9ecef;
  transition: background-color 0.2s;
}

.picker-option:hover {
  background-color: var(--primary-blue-light);
}

.picker-option:last-child {
  border-bottom: none;
}
</style>
