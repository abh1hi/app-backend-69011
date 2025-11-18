import { type Ref } from 'vue';
import type { DocumentData } from 'firebase/firestore';
interface InfiniteScrollOptions {
    ownerId?: Ref<string | null>;
}
export declare function useInfiniteScroll(collectionName: string, options?: InfiniteScrollOptions): {
    documents: Ref<DocumentData[], DocumentData[]>;
    loading: Ref<boolean, boolean>;
    error: Ref<string | null, string | null>;
    hasMore: Ref<boolean, boolean>;
    loadMoreDocuments: (filters?: any) => Promise<void>;
};
export {};
