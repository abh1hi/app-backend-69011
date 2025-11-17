<template>
  <Transition name="modal">
    <div class="modal-overlay" v-if="isVisible" @click.self="close">
      <div class="modal-container" @click.stop>
        <!-- Drag Handle (Mobile) -->
        <div class="drag-handle"></div>
        
        <!-- Header -->
        <div class="modal-header">
          <button @click="close" class="close-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <h3 class="header-title">{{ title }}</h3>
          <div class="header-spacer"></div>
        </div>
        
        <!-- Body -->
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div class="modal-footer">
          <button @click="close" class="footer-cancel-btn">Cancel</button>
          <button @click="save" class="footer-save-btn">Save</button>
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
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
    padding-bottom: 20px;
  }
}

/* Modal Container */
.modal-container {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(50px) saturate(180%);
  -webkit-backdrop-filter: blur(50px) saturate(180%);
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -4px 40px rgba(0, 0, 0, 0.15), 0 -2px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border: 0.5px solid rgba(255, 255, 255, 0.9);
  overflow: hidden;
  position: relative;
}

@media (min-width: 768px) {
  .modal-container {
    border-radius: 28px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15);
    max-height: 85vh;
  }
}

/* Drag Handle */
.drag-handle {
  width: 36px;
  height: 5px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  margin: 12px auto 8px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .drag-handle {
    display: none;
  }
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  padding-top: 12px;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  min-height: 56px;
}

@media (min-width: 768px) {
  .modal-header {
    padding: 20px 28px;
    padding-top: 24px;
  }
}

.close-btn {
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.6);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0;
  padding: 0;
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.close-btn:active {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(0.95);
}

@media (min-width: 768px) {
  .close-btn:hover {
    background: rgba(0, 0, 0, 0.08);
  }
}

.header-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.3px;
  margin: 0;
  text-align: center;
  flex: 1;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 120px);
}

@media (min-width: 768px) {
  .header-title {
    font-size: 1.25rem;
    position: static;
    transform: none;
    width: auto;
  }
}

.header-spacer {
  width: 32px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .header-spacer {
    display: none;
  }
}

/* Body */
.modal-body {
  padding: 24px 20px;
  overflow-y: auto;
  flex: 1;
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 768px) {
  .modal-body {
    padding: 28px;
  }
}

/* Footer */
.modal-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0));
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

@media (min-width: 768px) {
  .modal-footer {
    flex-direction: row;
    justify-content: flex-end;
    padding: 20px 28px;
    padding-bottom: 28px;
    gap: 12px;
  }
}

.footer-cancel-btn,
.footer-save-btn {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  letter-spacing: -0.2px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .footer-cancel-btn,
  .footer-save-btn {
    width: auto;
    min-width: 120px;
    min-height: 44px;
  }
}

.footer-cancel-btn {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
  order: 2;
}

.footer-cancel-btn:active {
  background: rgba(0, 0, 0, 0.1);
  transform: scale(0.98);
}

@media (min-width: 768px) {
  .footer-cancel-btn {
    order: 1;
  }
  .footer-cancel-btn:hover {
    background: rgba(0, 0, 0, 0.08);
  }
}

.footer-save-btn {
  background: var(--primary-blue);
  color: white;
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.25), 0 2px 8px rgba(0, 122, 255, 0.15);
  order: 1;
}

.footer-save-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.25);
}

@media (min-width: 768px) {
  .footer-save-btn {
    order: 2;
  }
  .footer-save-btn:hover {
    box-shadow: 0 6px 20px rgba(0, 122, 255, 0.35), 0 4px 12px rgba(0, 122, 255, 0.2);
    transform: translateY(-1px);
  }
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-container {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .modal-enter-from .modal-container {
    transform: translateY(40px) scale(0.95);
  }
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-container {
  transform: translateY(100%);
}

@media (min-width: 768px) {
  .modal-leave-to .modal-container {
    transform: translateY(40px) scale(0.95);
  }
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
}

.modal-enter-to .modal-container,
.modal-leave-from .modal-container {
  transform: translateY(0) scale(1);
}

</style>
