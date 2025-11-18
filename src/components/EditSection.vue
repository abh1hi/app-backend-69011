<template>
  <div class="edit-section-card">
    <div class="card-header" @click="toggle">
      <h3 class="section-title">{{ title }}</h3>
      <span class="toggle-icon">{{ isOpen ? '−' : '+' }}</span>
    </div>
    <div v-if="isOpen" class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  startOpen: {
    type: Boolean,
    default: false,
  },
});

const isOpen = ref(props.startOpen);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.edit-section-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 0.5px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease-in-out;
}

.card-header {
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
  transition: background-color 0.2s ease;
}

.card-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.3px;
}

.toggle-icon {
  font-size: 1.5rem;
  font-weight: 300;
  color: var(--primary-blue);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-content {
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
