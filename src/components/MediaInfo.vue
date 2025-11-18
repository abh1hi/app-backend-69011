<template>
  <div class="media-info-container">
    <!-- Display Existing Media -->
    <div v-if="existingMedia.photos.length > 0 || existingMedia.videos.length > 0" class="existing-media-section">
      <h4 class="section-title">Current Media</h4>
      <div class="media-grid">
        <!-- Existing Photos -->
        <div v-for="url in existingMedia.photos" :key="url" class="media-item">
          <img :src="url" class="media-preview" alt="Photo"/>
          <button @click="deleteExistingMedia(url, 'photo')" class="delete-btn">✕</button>
        </div>
        <!-- Existing Videos -->
        <div v-for="url in existingMedia.videos" :key="url" class="media-item">
          <video :src="url" class="media-preview" controls></video>
          <button @click="deleteExistingMedia(url, 'video')" class="delete-btn">✕</button>
        </div>
      </div>
    </div>

    <!-- Upload New Media -->
    <div class="upload-section">
      <h4 class="section-title">Upload New Media</h4>
       <div class="upload-box">
        <label for="photo-upload" class="upload-label">
          <span class="upload-icon">🖼️</span>
          <span class="upload-text">Add New Photos</span>
        </label>
        <input id="photo-upload" type="file" multiple @change="handleFileUpload('photo', $event)" accept="image/*" class="file-input">
      </div>
       <div class="upload-box">
        <label for="video-upload" class="upload-label">
          <span class="upload-icon">🎬</span>
          <span class="upload-text">Add New Videos</span>
        </label>
        <input id="video-upload" type="file" multiple @change="handleFileUpload('video', $event)" accept="video/*" class="file-input">
      </div>
    </div>

    <!-- New Media Previews -->
    <div v-if="newPhotos.length > 0 || newVideos.length > 0" class="new-media-preview-section">
      <h4 class="section-title">New Uploads</h4>
      <div class="media-grid">
        <div v-for="(file, index) in newPhotos" :key="index" class="media-item">
          <img :src="file.previewUrl" class="media-preview" alt="New Photo"/>
          <button @click="removeNewMedia('photo', index)" class="delete-btn">✕</button>
        </div>
        <div v-for="(file, index) in newVideos" :key="index" class="media-item">
          <video :src="file.previewUrl" class="media-preview" controls></video>
          <button @click="removeNewMedia('video', index)" class="delete-btn">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  initialMedia: {
    type: Object,
    default: () => ({ photos: [], videos: [] }),
  },
});

const emit = defineEmits(['update']);

const existingMedia = ref({ ...props.initialMedia });
const newPhotos = ref<{ file: File, previewUrl: string }[]>([]);
const newVideos = ref<{ file: File, previewUrl: string }[]>([]);
const deletedUrls = ref<string[]>([]);


onMounted(() => {
  // Ensure initialMedia is reactive
  watch(() => props.initialMedia, (newVal) => {
    existingMedia.value = { ...newVal };
  }, { immediate: true, deep: true });
});

const handleFileUpload = (type: 'photo' | 'video', event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    for (const file of Array.from(target.files)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        if (type === 'photo') {
          newPhotos.value.push({ file, previewUrl });
        } else {
          newVideos.value.push({ file, previewUrl });
        }
        emitUpdates();
      };
      reader.readAsDataURL(file);
    }
  }
};

const deleteExistingMedia = (url: string, type: 'photo' | 'video') => {
  if (type === 'photo') {
    existingMedia.value.photos = existingMedia.value.photos.filter((p: string) => p !== url);
  } else {
    existingMedia.value.videos = existingMedia.value.videos.filter((v: string) => v !== url);
  }
  deletedUrls.value.push(url);
  emitUpdates();
};

const removeNewMedia = (type: 'photo' | 'video', index: number) => {
  if (type === 'photo') {
    newPhotos.value.splice(index, 1);
  } else {
    newVideos.value.splice(index, 1);
  }
  emitUpdates();
};

const emitUpdates = () => {
  const allNewFiles = [...newPhotos.value.map(p => p.file), ...newVideos.value.map(v => v.file)];
  emit('update', { newFiles: allNewFiles, deletedUrls: deletedUrls.value });
};

</script>

<style scoped>
.media-info-container {
  padding: 1rem 0;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.media-item {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.media-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 24px;
  height: 24px;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(2px);
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.8);
  transform: scale(1.1);
}

/* Upload Section */
.upload-section {
  margin-top: 2.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .upload-section {
    grid-template-columns: 1fr 1fr;
  }
}

.upload-box {
  text-align: center;
  position: relative;
}

.upload-label {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  height: 100%;
}

.upload-label:hover {
  background: #f0f5ff;
  border-color: var(--primary-blue);
}

.upload-icon {
  font-size: 2.5rem;
}

.upload-text {
  margin-top: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.file-input {
  display: none;
}

.new-media-preview-section {
  margin-top: 2.5rem;
}
</style>
