<template>
  <div v-if="isVisible" class="sheet-overlay">
    <div class="sheet-content">
      <div class="sheet-header">
        <div class="drag-handle"></div>
        <h3>Complete Your Profile</h3>
        <p>Please select how you plan to use Apna Aashiyanaa to continue.</p>
      </div>

      <div class="role-options">
        <div 
          class="role-option" 
          :class="{ active: selectedRole === 'buyer' }"
          @click="selectRole('buyer')"
        >
          <div class="role-icon">
             <span class="material-symbols-outlined">home</span>
          </div>
          <div class="role-details">
            <h4>Buyer / Renter</h4>
            <p>Search for your dream property</p>
          </div>
          <div class="selection-indicator">
            <span v-if="selectedRole === 'buyer'" class="material-symbols-outlined">check_circle</span>
            <span v-else class="material-symbols-outlined unchecked">radio_button_unchecked</span>
          </div>
        </div>

        <div 
          class="role-option" 
          :class="{ active: selectedRole === 'dealer' }"
          @click="selectRole('dealer')"
        >
          <div class="role-icon">
             <span class="material-symbols-outlined">storefront</span>
          </div>
          <div class="role-details">
            <h4>Dealer / Seller</h4>
            <p>List and sell properties</p>
          </div>
           <div class="selection-indicator">
            <span v-if="selectedRole === 'dealer'" class="material-symbols-outlined">check_circle</span>
            <span v-else class="material-symbols-outlined unchecked">radio_button_unchecked</span>
          </div>
        </div>
      </div>

      <button 
        class="submit-btn" 
        :disabled="!selectedRole || isLoading"
        @click="confirmSelection"
      >
        <span v-if="!isLoading">Continue</span>
        <span v-else class="spinner"></span>
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
const isLoading = ref(false);

const selectRole = (role: 'buyer' | 'dealer') => {
  selectedRole.value = role;
};

const confirmSelection = async () => {
  if (!selectedRole.value) return;
  isLoading.value = true;
  emit('select-role', selectedRole.value);
  setTimeout(() => { isLoading.value = false }, 2000); 
};
</script>

<style scoped>
.sheet-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  animation: fade-in 0.3s ease;
}

.sheet-content {
  background: white;
  width: 100%;
  padding: 32px 24px;
  border-radius: 32px 32px 0 0;
  padding-bottom: calc(32px + env(safe-area-inset-bottom, 20px));
  animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -10px 40px rgba(0,0,0,0.08);
  font-family: 'Outfit', sans-serif;
  max-width: 600px; /* Tablet constraint */
  margin: 0 auto; 
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
  text-align: center;
  margin-bottom: 32px;
}

.drag-handle {
  width: 48px;
  height: 4px;
  background: #f0f0f0;
  border-radius: 100px;
  margin: -10px auto 24px;
}

.sheet-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.sheet-header p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.role-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.role-option {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: #f9f9f9;
  border: 1px solid transparent;
}

.role-option:hover {
  background: #f5f5f5;
  transform: scale(1.01);
}

.role-option.active {
  background: #f0f7ff;
  border-color: rgba(0, 122, 255, 0.15);
}

.role-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 14px;
  margin-right: 16px;
  color: #555;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
  transition: all 0.2s;
}

.role-option.active .role-icon {
  background: #007aff;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.2);
}

.role-details {
  flex: 1;
}

.role-details h4 {
  margin: 0 0 4px 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #111;
}

.role-details p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.selection-indicator {
    display: flex;
    align-items: center;
    color: #007aff;
}

.selection-indicator .unchecked {
    color: #ddd;
}

.submit-btn {
  width: 100%;
  background: #111;
  color: white;
  border: none;
  padding: 18px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.submit-btn:disabled {
  background: #e0e0e0;
  color: #aaa;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 768px) {
    .sheet-overlay { align-items: center; justify-content: center; }
    .sheet-content {
        border-radius: 32px;
        padding-bottom: 32px;
        width: 100%;
        max-width: 500px;
    }
}
</style>
