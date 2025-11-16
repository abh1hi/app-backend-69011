<template>
  <div class="modal-overlay" v-if="isVisible" @click.self="close">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="header-title">{{ title }}</h3>
        <button @click="close" class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <button @click="save" class="footer-save-btn">Save</button>
        <button @click="close" class="footer-close-btn">Done</button>
      </div>
    </div>
  </div>
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 600px;
  background: var(--background-color);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  animation: slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #343a40;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  color: #adb5bd;
  transition: color 0.2s;
}

.close-btn:hover {
    color: #495057;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  gap: 1rem;
}

.footer-close-btn, .footer-save-btn {
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
   box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.footer-close-btn {
  background-color: #6c757d;
  color: var(--white);
}

.footer-save-btn {
  background: linear-gradient(45deg, var(--primary-blue), #00c6ff);
  color: var(--white);
}

.footer-close-btn:hover, .footer-save-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px var(--shadow-color);
}

</style>
