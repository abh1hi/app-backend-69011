<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <h2 class="modal-title">Select Your Role</h2>
      <p class="modal-subtitle">Tell us how you plan to use Apna Aashiyanaa</p>
      
      <div class="role-cards">
        <div 
          class="role-card" 
          :class="{ active: selectedRole === 'buyer' }"
          @click="selectRole('buyer')"
        >
          <div class="role-icon">🏠</div>
          <div class="role-info">
            <h3>Buyer / Renter</h3>
            <p>I want to search for properties.</p>
          </div>
          <div class="radio-indicator"></div>
        </div>

        <div 
          class="role-card" 
          :class="{ active: selectedRole === 'dealer' }"
          @click="selectRole('dealer')"
        >
          <div class="role-icon">💼</div>
          <div class="role-info">
            <h3>Dealer / Seller</h3>
            <p>I want to list properties.</p>
          </div>
          <div class="radio-indicator"></div>
        </div>
      </div>

      <button 
        class="continue-btn" 
        :disabled="!selectedRole"
        @click="confirmSelection"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: 'select-role', role: 'buyer' | 'dealer'): void;
}>();

const selectedRole = ref<'buyer' | 'dealer' | null>(null);

const selectRole = (role: 'buyer' | 'dealer') => {
  selectedRole.value = role;
};

const confirmSelection = () => {
  if (selectedRole.value) {
    emit('select-role', selectedRole.value);
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
  margin: 0;
}

.modal-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin: 0;
  margin-top: -16px;
  font-size: 0.95rem;
}

.role-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(245, 247, 250, 0.5);
}

.role-card:active {
  transform: scale(0.98);
}

.role-card.active {
  border-color: var(--primary-blue);
  background: rgba(0, 122, 255, 0.04);
}

.role-icon {
  font-size: 2rem;
  background: white;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.role-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.role-info p {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.radio-indicator {
  margin-left: auto;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ddd;
  position: relative;
}

.role-card.active .radio-indicator {
  border-color: var(--primary-blue);
  background: var(--primary-blue);
}

.role-card.active .radio-indicator::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.continue-btn {
  background: var(--primary-blue);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.continue-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
