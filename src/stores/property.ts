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
    addCachedDocuments(queryKey: string, newDocs: DocumentData[], lastDoc: QueryDocumentSnapshot<DocumentData> | null, hasMore: boolean) {
      console.log(`[PropertyStore] Caching documents for key: ${queryKey}`);
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
      console.log(`[PropertyStore] Getting cached query for key: ${queryKey}`);
      return this.cachedQueries[queryKey];
    },
    clearCache() {
      console.log("[PropertyStore] Clearing all caches.");
      this.cachedQueries = {};
      this.cachedProperties = {};
    },
    clearQueryCache(queryKey: string) {
      console.log(`[PropertyStore] Clearing cache for key: ${queryKey}`);
      delete this.cachedQueries[queryKey];
    },
    cacheProperty(propertyId: string, propertyData: DocumentData) {
      this.cachedProperties[propertyId] = propertyData;
    },
    getCachedProperty(propertyId: string): DocumentData | undefined {
      return this.cachedProperties[propertyId];
    },
    async fetchProperties(options: FetchPropertiesOptions) {
      console.log("[PropertyStore] fetchProperties called with options:", JSON.stringify(options));
      const { collectionName, ownerId, filters, lastDoc } = options;
      const collectionRef = collection(db, collectionName);
      const queryParts: any[] = [];
      let isOrderedByPrice = false;

      if (ownerId) {
        console.log("[PropertyStore] Adding ownerId filter:", ownerId);
        queryParts.push(where('ownerId', '==', ownerId));
      }

      if (filters) {
        console.log("[PropertyStore] Applying filters:", JSON.stringify(filters));
        if (filters.saleOrRent) {
          queryParts.push(where('basic.saleOrRent', '==', filters.saleOrRent));
        }
        if (filters.state) {
          queryParts.push(where('basic.state', '==', filters.state));
        }

        if (filters.priceRange) {
          console.log("[PropertyStore] Applying price range filter:", filters.priceRange);
          queryParts.push(where('pricing.price', '>=', filters.priceRange[0]));
          queryParts.push(where('pricing.price', '<=', filters.priceRange[1]));
          queryParts.push(orderBy('pricing.price', 'desc'));
          isOrderedByPrice = true;
        }
      }
      
      if (!isOrderedByPrice) {
        console.log("[PropertyStore] No price filter, ordering by createdAt.");
        queryParts.push(orderBy('createdAt', 'desc'));
      }

      queryParts.push(orderBy('__name__', 'desc'));

      if (lastDoc) {
        console.log("[PropertyStore] Paginating after doc:", lastDoc.id);
        queryParts.push(startAfter(lastDoc));
      }

      queryParts.push(limit(10));

      console.log("[PropertyStore] Executing query with parts:", queryParts.map(p => p.toString()));
      const q = query(collectionRef, ...queryParts);
      const querySnapshot = await getDocs(q);
      console.log(`[PropertyStore] Query returned ${querySnapshot.docs.length} documents.`);

      const newDocuments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const hasMore = querySnapshot.docs.length === 10;

      return { newDocuments, newLastDoc, hasMore };
    },
    async fetchHighestPrice(): Promise<number> {
      console.log("[PropertyStore] Fetching highest price.");
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
            console.log(`[PropertyStore] Highest price found: ${highestPriceValue}`);
            return highestPriceValue;
          } else {
             console.log("[PropertyStore] Highest price property found, but price is missing. Returning default.");
             return this.highestPrice;
          }
        } else {
          console.log("[PropertyStore] No properties found, returning default high value.");
          return this.highestPrice;
        }
      } catch (error) {
        console.error("[PropertyStore] Error fetching highest price:", error);
        return this.highestPrice;
      }
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
