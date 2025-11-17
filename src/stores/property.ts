import { defineStore } from 'pinia';
import {
  collection,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  getDocs,
  type DocumentData,
  type QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// ... (interfaces remain the same)

interface MediaItem {
  file: File;
  previewUrl: string;
}

type PropertySection = 'basic' | 'pricing' | 'features' | 'media' | 'contact' | 'legal';

export interface CachedQuery {
  documents: DocumentData[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasMore: boolean;
}

interface FetchPropertiesOptions {
  collectionName: string;
  ownerId?: string | null;
  filters?: any;
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
}


export const usePropertyStore = defineStore('property', {
  state: () => ({
    property: {
      basic: { propertyType: '', saleOrRent: '', title: '', description: '', location: '', state: '', size: null, bedrooms: null, bathrooms: null, floor: '', age: '' },
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
    cachedQueries: {} as Record<string, CachedQuery>,
    cachedProperties: {} as Record<string, DocumentData>,
    availableStates: [] as string[],
    highestPrice: 50000000
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
    clearCache() {
      this.cachedQueries = {};
      this.cachedProperties = {};
    },
    clearQueryCache(queryKey: string) {
      delete this.cachedQueries[queryKey];
    },
    cacheProperty(property: DocumentData) {
      if (property && property.id) {
        this.cachedProperties[property.id] = property;
      }
    },
    getCachedProperty(id: string): DocumentData | undefined {
      const cachedProperty = this.cachedProperties[id];
      if (cachedProperty) {
        console.log(`[PropertyStore] Loaded property ${id} from cache.`);
      }
      return cachedProperty;
    },
    cacheQuery(queryKey: string, data: CachedQuery) {
      console.log(`[PropertyStore] Caching query results for key: ${queryKey}`);
      this.cachedQueries[queryKey] = data;
    },
    getCachedQuery(queryKey: string): CachedQuery | undefined {
      const cached = this.cachedQueries[queryKey];
      if (cached) {
        console.log(`[PropertyStore] Found cached query for key: ${queryKey}`);
      }
      return cached;
    },
    async fetchProperties(options: FetchPropertiesOptions) {
      const { collectionName, ownerId, filters, lastDoc } = options;
      const collectionRef = collection(db, collectionName);
      const queryParts: any[] = [];
      let isOrderedByPrice = false;

      if (ownerId) {
        queryParts.push(where('ownerId', '==', ownerId));
      }

      if (filters) {
        if (filters.saleOrRent) {
          queryParts.push(where('basic.saleOrRent', '==', filters.saleOrRent));
        }
        if (filters.state && filters.state.trim() !== '') {
          queryParts.push(where('basic.state', '==', filters.state));
        }

        if (filters.priceRange) {
          queryParts.push(where('pricing.price', '>=', filters.priceRange[0]));
          queryParts.push(where('pricing.price', '<=', filters.priceRange[1]));
          queryParts.push(orderBy('pricing.price', 'desc'));
          isOrderedByPrice = true;
        }
      }

      if (!isOrderedByPrice) {
        queryParts.push(orderBy('createdAt', 'desc'));
      }

      if (lastDoc) {
        queryParts.push(startAfter(lastDoc));
      }

      queryParts.push(limit(10));

      const q = query(collectionRef, ...queryParts);

      try {
        const querySnapshot = await getDocs(q);
        const newDocuments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (newDocuments.length > 0) {
            console.log(`[PropertyStore] Loaded ${newDocuments.length} new documents from Firestore.`);
        }

        newDocuments.forEach(doc => this.cacheProperty(doc));
        
        const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
        const hasMore = querySnapshot.docs.length === 10;

        return { newDocuments, newLastDoc, hasMore };
      } catch (error) {
        console.error("[PropertyStore] ERROR executing getDocs:", error);
        throw error;
      }
    },

    async fetchHighestPrice(): Promise<number> {
        try {
          const q = query(
            collection(db, 'properties'),
            orderBy('pricing.price', 'desc'),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const highestPriceValue = querySnapshot.docs[0].data()?.pricing?.price;
            if (highestPriceValue != null) {
              this.highestPrice = highestPriceValue;
              return highestPriceValue;
            }
          }
          return this.highestPrice;
        } catch (error) {
          console.error("[PropertyStore] Error fetching highest price:", error);
          return this.highestPrice;
        }
      },
  
      async fetchAvailableStates() {
        if (this.availableStates.length > 0) return;
        try {
          const querySnapshot = await getDocs(collection(db, 'properties'));
          const states = new Set<string>();
          querySnapshot.forEach((doc) => {
            const state = doc.data()?.basic?.state;
            if (state && typeof state === 'string' && state.trim() !== '') {
              states.add(state);
            }
          });
          this.availableStates = Array.from(states).sort();
        } catch (error) {
          console.error("Error fetching available states:", error);
          this.availableStates = [];
        }
      }
  }
});
