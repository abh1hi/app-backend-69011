import { type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
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
    location?: {
        lat: number;
        lng: number;
    };
}
export interface PropertyDocument extends DocumentData {
    id: string;
    basic: {
        lat: number;
        lng: number;
        bedrooms: number;
        bathrooms: number;
        size: number;
        geohash: string;
    };
    features: {
        amenities: string[];
    };
    pricing: {
        price: number;
    };
}
export declare const usePropertyStore: import("pinia").StoreDefinition<"property", {
    propertyId: string | null;
    property: {
        basic: {
            propertyType: string;
            saleOrRent: string;
            title: string;
            description: string;
            location: string;
            state: string;
            city: string;
            pincode: string;
            size: null;
            bedrooms: null;
            bathrooms: null;
            floor: string;
            age: string;
            lat: null;
            lng: null;
            geohash: string;
        };
        pricing: {
            price: null;
            maintenance: string;
            deposit: string;
            paymentTerms: string;
        };
        features: {
            furnishing: string;
            parking: string;
            security: string;
            amenities: string[];
        };
        media: {
            photos: MediaItem[];
            videos: MediaItem[];
        };
        contact: {
            name: string;
            email: string;
            phone: string;
            contactMethod: string;
        };
        legal: {
            ownershipDocs: string;
            registration: string;
        };
        ownerId: string;
    };
    completedSections: {
        basic: boolean;
        pricing: boolean;
        features: boolean;
        media: boolean;
        contact: boolean;
        legal: boolean;
    };
    cachedQueries: Record<string, CachedQuery>;
    cachedProperties: Record<string, DocumentData>;
    availableStates: string[];
    highestPrice: number;
    highestSqft: number;
    lowestSqft: number;
}, {}, {
    setPropertyId(id: string): void;
    updateProperty<T extends PropertySection>(this: any, section: T, data: Partial<any>): void;
    addMediaFile(type: 'photo' | 'video', file: File): void;
    setSectionCompleted(section: PropertySection, isCompleted: boolean): void;
    setOwnerId(uid: string): void;
    resetState(): void;
    clearCache(): void;
    clearQueryCache(queryKey: string): void;
    cacheProperty(property: DocumentData): void;
    getCachedProperty(id: string): DocumentData | undefined;
    cacheQuery(queryKey: string, data: CachedQuery): void;
    getCachedQuery(queryKey: string): CachedQuery | undefined;
    fetchProperties(options: FetchPropertiesOptions): Promise<{
        newDocuments: DocumentData[];
        newLastDoc: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
        hasMore: boolean;
    }>;
    deleteProperty(propertyId: string): Promise<void>;
    updatePropertyWithMedia(propertyId: string, updatedData: DocumentData, mediaChanges: {
        newFiles: File[];
        deletedUrls: string[];
    }): Promise<void>;
    fetchHighestPrice(): Promise<number>;
    fetchHighestSqft(): Promise<number>;
    fetchLowestSqft(): Promise<number>;
    fetchAvailableStates(): Promise<void>;
}>;
export {};
