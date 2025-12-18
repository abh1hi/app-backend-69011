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
            <span class="material-symbols-outlined">cloud_upload</span>
          </div>
          <p class="upload-text">Tap to upload PDF</p>
          <p class="file-hint">Max size 5MB</p>
        </div>

        <div v-else class="file-preview">
          <div class="file-icon">
             <span class="material-symbols-outlined">description</span>
          </div>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatSize(file.size) }}</span>
          </div>
          <button class="remove-btn" @click.stop="removeFile">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <p v-if="error" class="error-msg">
         <span class="material-symbols-outlined">error</span>
         {{ error }}
      </p>

      <button 
        class="submit-btn" 
        :disabled="!file || isUploading"
        @click="uploadFile"
      >
        <span v-if="!isUploading">Complete Verification</span>
        <span v-else class="upload-status">
           <span class="spinner"></span>
           Uploading... {{ uploadProgress }}%
        </span>
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
  padding: 0 10px;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 24px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: #fafafa;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.upload-area:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
}

.upload-area:active {
  background: #f0f0f0;
  transform: scale(0.99);
}

.upload-area.has-file {
  border-style: solid;
  border-color: rgba(0, 122, 255, 0.2);
  background: #f0f7ff;
  padding: 24px;
}

.icon-circle {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.06);
  color: #007aff;
}
.icon-circle span { font-size: 32px; }

.upload-text {
  font-weight: 600;
  color: #111;
  margin: 0 0 4px 0;
  font-size: 1.05rem;
}

.file-hint {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

.file-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
}

.file-icon {
  width: 48px; height: 48px;
  background: white;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #007aff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #111;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
}

.remove-btn {
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s;
}
.remove-btn:hover { background: #fee2e2; color: #ef4444; transform: scale(1.1); }

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

.upload-status {
    display: flex; align-items: center; justify-content: center; gap: 10px;
}

.error-msg {
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 24px;
  background: #fef2f2;
  padding: 12px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.error-msg span { font-size: 18px; }

.progress-bar {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  margin-top: 16px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s ease;
}

.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

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
