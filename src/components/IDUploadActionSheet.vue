<template>
  <div v-if="isVisible" class="sheet-overlay">
    <div class="sheet-content">
      <div class="sheet-header">
        <div class="drag-handle"></div>
        <h3>Verify Your Identity</h3>
        <p>As a dealer, we need to verify your details. Please upload your Aadhar Card (PDF only).</p>
      </div>

      <div class="upload-area" @click="triggerFileInput" :class="{ 'has-file': file }">
        <input 
          type="file" 
          ref="fileInput" 
          accept="application/pdf" 
          @change="handleFileChange" 
          hidden
        >
        
        <div v-if="!file" class="upload-placeholder">
          <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
          </div>
          <p class="upload-text">Tap to upload PDF</p>
          <p class="file-hint">Max size 5MB</p>
        </div>

        <div v-else class="file-preview">
          <div class="file-icon">📄</div>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatSize(file.size) }}</span>
          </div>
          <button class="remove-btn" @click.stop="removeFile">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button 
        class="submit-btn" 
        :disabled="!file || isUploading"
        @click="uploadFile"
      >
        <span v-if="!isUploading">Complete Verification</span>
        <span v-else>Uploading... {{ uploadProgress }}%</span>
      </button>
      
      <div v-if="isUploading" class="progress-bar">
        <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits<{
  (e: 'upload-complete', file: File): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);
const error = ref<string | null>(null);
const isUploading = ref(false);
const uploadProgress = ref(0);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  error.value = null;

  if (selectedFile) {
    if (selectedFile.type !== 'application/pdf') {
      error.value = 'Only PDF files are allowed.';
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      error.value = 'File size must be under 5MB.';
      return;
    }
    file.value = selectedFile;
  }
};

const removeFile = () => {
  file.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const uploadFile = async () => {
  if (!file.value) return;
  
  isUploading.value = true;
  // Simulate progress for UX (real upload happens in parent/store)
  const interval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 10;
    }
  }, 200);

  // Emit file to parent to handle actual upload logic
  // We'll trust the parent to handle the actual progress or just wait for the promise
  emit('upload-complete', file.value);
  
  // Cleanup simulation
  clearInterval(interval);
};

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped>
.sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  animation: fade-in 0.3s ease;
}

.sheet-content {
  background: white;
  width: 100%;
  padding: 24px;
  border-radius: 24px 24px 0 0;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 20px));
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
  text-align: center;
  margin-bottom: 24px;
}

.drag-handle {
  width: 40px;
  height: 5px;
  background: #e0e0e0;
  border-radius: 3px;
  margin: 0 auto 20px;
}

.sheet-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.sheet-header p {
  color: var.(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
  margin-bottom: 24px;
}

.upload-area:active {
  background: #f0f0f0;
  border-color: #ccc;
}

.upload-area.has-file {
  border-style: solid;
  border-color: rgba(0, 122, 255, 0.3);
  background: rgba(0, 122, 255, 0.04);
  padding: 20px;
}

.icon-circle {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  color: var(--primary-blue);
}

.upload-text {
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.file-hint {
  font-size: 0.8rem;
  color: #999;
  margin: 0;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
}

.file-icon {
  font-size: 24px;
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
  word-break: break-all;
}

.file-size {
  font-size: 0.8rem;
  color: #666;
}

.remove-btn {
  background: rgba(0,0,0,0.05);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
}

.submit-btn {
  width: 100%;
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

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-msg {
  color: #ff3b30;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 16px;
  background: rgba(255, 59, 48, 0.1);
  padding: 8px;
  border-radius: 8px;
}

.progress-bar {
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin-top: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #34c759;
  transition: width 0.3s ease;
}
</style>
