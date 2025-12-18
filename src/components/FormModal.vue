<template>
  <Transition name="modal">
    <div class="modal-overlay" v-if="isVisible" @click.self="close">
      <div class="modal-container" @click.stop>
        <!-- Header -->
        <div class="modal-header">
           <div class="drag-handle"></div>
           <h3 class="header-title">{{ title }}</h3>
           <button @click="close" class="close-btn">
             <span class="material-symbols-outlined">close</span>
           </button>
        </div>
        
        <!-- Body -->
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div class="modal-footer">
          <button @click="save" class="footer-save-btn">
            Save Changes
          </button>
           <button @click="close" class="footer-cancel-btn">
            Cancel
           </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">

defineProps({
  isVisible: Boolean,
  title: String
});

const emit = defineEmits(['close', 'save']);

const close = () => {
  emit('close');
};

const save = () => {
  emit('save');
};
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
  padding: 0;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

@media (min-width: 768px) {
  .modal-overlay {
    align-items: center;
    padding: 20px;
  }
}

/* Modal Container */
.modal-container {
  width: 100%;
  max-width: 500px;
  max-height: 94vh;
  background: #ffffff;
  border-radius: 32px 32px 0 0;
  box-shadow: 0 -4px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  font-family: 'Outfit', sans-serif;
}

@media (min-width: 768px) {
  .modal-container {
    border-radius: 32px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    max-height: 85vh;
  }
}

/* Header */
.modal-header {
  padding: 24px;
  padding-bottom: 12px;
  background: white;
  position: relative;
  flex-shrink: 0;
  text-align: left;
}

.drag-handle {
    width: 40px; height: 4px; background: #f0f0f0; border-radius: 100px; margin: 0 auto 16px;
}

@media (min-width: 768px) { .drag-handle { display: none; } }

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111;
  margin: 0;
  letter-spacing: -0.5px;
}

.close-btn {
  position: absolute;
  top: 24px; right: 24px;
  background: #f8f8f8;
  border: none;
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #555;
  transition: all 0.2s;
}

.close-btn:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }

/* Body */
.modal-body {
  padding: 0 24px 24px;
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

/* Footer */
.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  padding-top: 16px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0));
  background: white;
  border-top: 1px solid #f0f0f0;
}

@media (min-width: 768px) {
  .modal-footer {
    padding: 24px;
    padding-top: 20px;
  }
}

.footer-cancel-btn,
.footer-save-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 100px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
}

.footer-cancel-btn {
  background: white;
  color: #666;
  order: 2;
  box-shadow: inset 0 0 0 1px #e0e0e0;
}

.footer-cancel-btn:hover { background: #f9f9f9; color: #111; }

.footer-save-btn {
  background: #111;
  color: white;
  order: 1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.footer-save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }

/* Animations */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-active .modal-container, .modal-leave-active .modal-container { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }

.modal-enter-from { opacity: 0; }
.modal-enter-from .modal-container { transform: translateY(100%); }

.modal-leave-to { opacity: 0; }
.modal-leave-to .modal-container { transform: translateY(100%); }

@media (min-width: 768px) {
  .modal-enter-from .modal-container { transform: translateY(20px) scale(0.95); }
  .modal-leave-to .modal-container { transform: translateY(20px) scale(0.95); }
}
</style>
