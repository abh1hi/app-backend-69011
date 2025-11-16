import { defineStore } from 'pinia';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

interface MediaItem {
  file: File;
  previewUrl: string;
}

type PropertySection = 'basic' | 'pricing' | 'features' | 'media' | 'contact' | 'legal';

interface CachedQuery {
  documents: DocumentData[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

export const usePropertyStore = defineStore('property', {
  state: () => ({
    property: {
      basic: { propertyType: '', saleOrRent: '', title: '', description: '', location: '', size: null, bedrooms: null, bathrooms: null, floor: '', age: '' },
      pricing: { price: null, maintenance: '', deposit: '', paymentTerms: '' },
      features: { furnishing: '', parking: '', security: '', amenities: [] as string[] },
      media: { photos: [] as MediaItem[], videos: [] as MediaItem[] },
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
    },
    // Caching state for queries (lists of properties)
    cachedQueries: {} as Record<string, CachedQuery>,
    // Caching state for individual properties
    cachedProperties: {} as Record<string, DocumentData>
  }),
  actions: {
    updateProperty<T extends PropertySection>(this: any, section: T, data: Partial<typeof this.property[T]>) {
      this.property[section] = { ...this.property[section], ...data };
    },
    addMediaFile(type: 'photo' | 'video', file: File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const previewUrl = e.target?.result as string;
        const mediaItem: MediaItem = { file, previewUrl };
        if (type === 'photo') {
          this.property.media.photos.push(mediaItem);
        } else {
          this.property.media.videos.push(mediaItem);
        }
      };
      reader.readAsDataURL(file);
    },
    setSectionCompleted(section: PropertySection, isCompleted: boolean) {
      this.completedSections[section] = isCompleted;
    },
    setOwnerId(uid: string) {
      this.property.ownerId = uid;
    },
    resetState() {
      this.$reset();
    },

    // Caching actions for queries
    addCachedDocuments(queryKey: string, newDocs: DocumentData[], lastDoc: QueryDocumentSnapshot<DocumentData> | null, hasMore: boolean) {
      const existingQuery = this.cachedQueries[queryKey];
      if (existingQuery) {
        existingQuery.documents.push(...newDocs);
        existingQuery.lastDoc = lastDoc;
        existingQuery.hasMore = hasMore;
      } else {
        this.cachedQueries[queryKey] = {
          documents: newDocs,
          lastDoc,
          hasMore
        };
      }
    },
    getCachedQuery(queryKey: string): CachedQuery | undefined {
      return this.cachedQueries[queryKey];
    },
    clearCache() {
      this.cachedQueries = {};
      this.cachedProperties = {};
    },
    clearQueryCache(queryKey: string) {
      delete this.cachedQueries[queryKey];
    },

    // Caching actions for individual properties
    cacheProperty(propertyId: string, propertyData: DocumentData) {
      this.cachedProperties[propertyId] = propertyData;
    },
    getCachedProperty(propertyId: string): DocumentData | undefined {
      return this.cachedProperties[propertyId];
    }
  }
});
