import { defineStore } from 'pinia';

export const usePropertyStore = defineStore('property', {
  state: () => ({
    property: {
      basic: { propertyType: '', saleOrRent: '', title: '', description: '', location: '', size: null, bedrooms: null, bathrooms: null, floor: '', age: '' },
      pricing: { price: null, maintenance: '', deposit: '', paymentTerms: '' },
      features: { furnishing: '', parking: '', security: '', amenities: [] },
      media: { photos: [], videos: [] },
      contact: { name: '', email: '', phone: '', contactMethod: '' },
      legal: { ownershipDocs: '', registration: '' },
      ownerId: ''
    },
    completedSections: {
      basic: false,
      pricing: false,
      features: false,
      media: false,
      contact: false,
      legal: false
    }
  }),
  actions: {
    updateProperty(section: string, data: any) {
      this.property[section] = { ...this.property[section], ...data };
    },
    addMediaFile(type: 'photo' | 'video', file: File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        const mediaItem = { file, previewUrl };
        if (type === 'photo') {
          this.property.media.photos.push(mediaItem);
        } else {
          this.property.media.videos.push(mediaItem);
        }
      };
      reader.readAsDataURL(file);
    },
    setSectionCompleted(section: string, isCompleted: boolean) {
      this.completedSections[section] = isCompleted;
    },
    setOwnerId(uid: string) {
      this.property.ownerId = uid;
    },
    resetState() {
      this.$reset();
    }
  }
});
