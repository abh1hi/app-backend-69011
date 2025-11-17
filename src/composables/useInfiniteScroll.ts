import { ref, onMounted, watch, type Ref, computed } from 'vue';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { usePropertyStore } from '../stores/property';

interface InfiniteScrollOptions {
  ownerId?: Ref<string | null>;
}

export function useInfiniteScroll(collectionName: string, options: InfiniteScrollOptions = {}) {
  console.log("[useInfiniteScroll] Initializing...");
  const { ownerId } = options;
  const propertyStore = usePropertyStore();

  const documents = ref<DocumentData[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const hasMore = ref(true);
  const lastDoc = ref<QueryDocumentSnapshot<DocumentData> | null>(null);
  const currentFilters = ref<any>(null);

  const queryKey = computed(() => {
    const filterKey = currentFilters.value ? JSON.stringify(currentFilters.value) : 'no_filters';
    const ownerKey = ownerId?.value ? `owner_${ownerId.value}` : 'all_users';
    const key = `${collectionName}_${ownerKey}_${filterKey}`;
    console.log(`[useInfiniteScroll] Computed queryKey: ${key}`);
    return key;
  });

  const loadMoreDocuments = async (filters: any = null) => {
    console.log("[useInfiniteScroll] loadMoreDocuments called with filters:", JSON.stringify(filters));

    if (JSON.stringify(filters) !== JSON.stringify(currentFilters.value)) {
      console.log("[useInfiniteScroll] Filter change detected. Resetting state.");
      currentFilters.value = filters;
      documents.value = [];
      lastDoc.value = null;
      hasMore.value = true;
      propertyStore.clearQueryCache(queryKey.value); // Clear cache for the new query
    }

    if (loading.value || !hasMore.value) {
      console.log("[useInfiniteScroll] Aborting load: already loading or no more documents.");
      return;
    }

    loading.value = true;
    console.log("[useInfiniteScroll] Loading started.");

    try {
      console.log("[useInfiniteScroll] Fetching properties with options:", {
        collectionName,
        ownerId: ownerId?.value,
        filters: currentFilters.value,
        lastDoc: lastDoc.value,
      });

      const { newDocuments, newLastDoc, hasMore: newHasMore } = await propertyStore.fetchProperties({
        collectionName,
        ownerId: ownerId?.value,
        filters: currentFilters.value,
        lastDoc: lastDoc.value,
      });

      console.log("[useInfiniteScroll] Fetched data:", { 
        newDocsCount: newDocuments.length, 
        newHasMore, 
        newLastDoc: newLastDoc ? newLastDoc.id : null 
      });

      documents.value.push(...newDocuments);
      lastDoc.value = newLastDoc;
      hasMore.value = newHasMore;

      console.log("[useInfiniteScroll] Updated local state:", { 
        totalDocs: documents.value.length, 
        hasMore: hasMore.value, 
        lastDoc: lastDoc.value ? lastDoc.value.id : null 
      });

    } catch (err: any) {
      console.error("[useInfiniteScroll] Error fetching documents:", err);
      if (err.code === 'failed-precondition') {
        error.value = 'This query requires a Firestore index. Please create it in the Firebase console.';
      } else {
        error.value = `Could not fetch ${collectionName}.`;
      }
    } finally {
      loading.value = false;
      console.log("[useInfiniteScroll] Loading finished.");
    }
  };

  if (ownerId) {
    watch(ownerId, (newOwnerId) => {
        console.log(`[useInfiniteScroll] Owner ID changed to: ${newOwnerId}. Resetting state.`);
        currentFilters.value = null;
        documents.value = [];
        lastDoc.value = null;
        hasMore.value = true;
        error.value = null;
        if (newOwnerId) {
          loadMoreDocuments();
        }
    }, { immediate: true });
  } else {
    onMounted(() => {
      console.log("[useInfiniteScroll] Component mounted. Performing initial load.");
      if(documents.value.length === 0){
        loadMoreDocuments()
      }
    });
  }

  return { documents, loading, error, hasMore, loadMoreDocuments };
}
