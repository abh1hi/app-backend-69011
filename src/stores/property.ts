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
    availableStates: [] as string[]
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
    addCachedDocuments(queryKey: string, newDocs: DocumentData[], lastDoc: QueryDocumentSnapshot<DocumentData> | null, hasMore: boolean) {
      const existingQuery = this.cachedQueries[queryKey];
      if (existingQuery) {
        existingQuery.documents.push(...newDocs);
        existingQuery.lastDoc = lastDoc;
        existingQuery.hasMore = hasMore;
      } else {
        this.cachedQueries[queryKey] = { documents: newDocs, lastDoc, hasMore };
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
    cacheProperty(propertyId: string, propertyData: DocumentData) {
      this.cachedProperties[propertyId] = propertyData;
    },
    getCachedProperty(propertyId: string): DocumentData | undefined {
      return this.cachedProperties[propertyId];
    },
    async fetchProperties(options: FetchPropertiesOptions) {
      const { collectionName, ownerId, filters, lastDoc } = options;
      const collectionRef = collection(db, collectionName);
      const queryParts: any[] = [];

      if (ownerId) {
        queryParts.push(where('ownerId', '==', ownerId));
      }

      if (filters) {
        if (filters.saleOrRent) {
          queryParts.push(where('basic.saleOrRent', '==', filters.saleOrRent));
        }
        if (filters.state) {
          queryParts.push(where('basic.state', '==', filters.state));
        }

        // Handle price range filter and ordering
        if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000)) {
          queryParts.push(where('pricing.price', '>=', filters.priceRange[0]));
          queryParts.push(where('pricing.price', '<=', filters.priceRange[1]));
          // Firestore requires ordering by the field used in inequality filters.
          queryParts.push(orderBy('pricing.price', 'desc'));
        } else {
          // Default sort order when not filtering by price.
          queryParts.push(orderBy('createdAt', 'desc'));
        }
      } else {
         // Default sort order if no filters at all.
         queryParts.push(orderBy('createdAt', 'desc'));
      }

      queryParts.push(orderBy('__name__', 'desc'));

      if (lastDoc) {
        queryParts.push(startAfter(lastDoc));
      }

      queryParts.push(limit(10));

      const q = query(collectionRef, ...queryParts);
      const querySnapshot = await getDocs(q);

      const newDocuments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === 10;

      return { newDocuments, newLastDoc, hasMore };
    },
    async fetchAvailableStates() {
      if (this.availableStates.length > 0) {
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, 'properties'));
        const states = new Set<string>();
        
        querySnapshot.forEach((doc) => {
          const propertyData = doc.data();
          const state = propertyData?.basic?.state;
          if (state && typeof state === 'string' && state.trim() !== '') {
            states.add(state);
          }
        });
        
        this.availableStates = Array.from(states).sort();

      } catch (error) {
        console.error("Error fetching available states:", error);
        this.availableStates = []; // Clear on error to prevent inconsistent state
      }
    }
  }
});
