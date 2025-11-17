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
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2000;
  animation: fade-in 0.3s;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.picker-container {
  width: 100%;
  max-width: 500px;
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.15);
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  border-bottom: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.picker-container.is-visible {
  transform: translateY(0);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.5);
}

.picker-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary-blue);
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
  letter-spacing: -0.2px;
}

.close-btn:active {
  background: rgba(0, 122, 255, 0.1);
  transform: scale(0.95);
}

.picker-body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.picker-body ul {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.picker-option {
  padding: 16px 24px;
  text-align: center;
  font-size: 1.0625rem;
  font-weight: 400;
  cursor: pointer;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  color: var(--text-primary);
  letter-spacing: -0.2px;
}

.picker-option:active {
  background: rgba(0, 122, 255, 0.08);
  transform: scale(0.98);
}

.picker-option:last-child {
  border-bottom: none;
}

@media (min-width: 768px) {
  .picker-option:hover {
    background: rgba(0, 122, 255, 0.06);
  }
}
</style>
