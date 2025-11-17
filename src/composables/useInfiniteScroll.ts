import { ref, onMounted, watch, type Ref, computed } from 'vue';
import type { DocumentData } from 'firebase/firestore';
import { usePropertyStore } from '../stores/property';

interface InfiniteScrollOptions {
  ownerId?: Ref<string | null>;
}

export function useInfiniteScroll(collectionName: string, options: InfiniteScrollOptions = {}) {
  const { ownerId } = options;
  const propertyStore = usePropertyStore();

  const documents = ref<DocumentData[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const hasMore = ref(true);

  const queryKey = computed(() => {
    return ownerId?.value ? `properties_owner_${ownerId.value}` : 'properties_all';
  });

  const loadMoreDocuments = async (filters: any = null) => {
    if (loading.value) return;

    const isInitialLoad = !filters;
    const cachedQuery = propertyStore.getCachedQuery(queryKey.value);

    if (isInitialLoad && cachedQuery) {
      console.log(`[Cache] Loading properties for list: '${queryKey.value}' from cache.`);
      documents.value = cachedQuery.documents;
      hasMore.value = cachedQuery.hasMore;
      return;
    }

    if (ownerId && !ownerId.value) {
      documents.value = [];
      hasMore.value = true;
      propertyStore.clearQueryCache(queryKey.value);
      return;
    }

    loading.value = true;

    try {
      const lastDoc = cachedQuery ? cachedQuery.lastDoc : null;
      const { newDocuments, newLastDoc, hasMore: newHasMore } = await propertyStore.fetchProperties({
        collectionName,
        ownerId: ownerId?.value,
        filters,
        lastDoc: isInitialLoad ? null : lastDoc,
      });

      if (filters) {
        documents.value = newDocuments;
      } else {
        propertyStore.addCachedDocuments(queryKey.value, newDocuments, newLastDoc, newHasMore);
        const updatedQuery = propertyStore.getCachedQuery(queryKey.value);
        if(updatedQuery){
          documents.value = updatedQuery.documents;
        }
      }
      hasMore.value = newHasMore;

    } catch (err: any) {
      console.error(`Error fetching ${collectionName}:`, err);
      if (err.code === 'failed-precondition') {
        error.value = 'This query requires a Firestore index. Please create it in the Firebase console.';
      } else {
        error.value = `Could not fetch ${collectionName}.`;
      }
    } finally {
      loading.value = false;
    }
  };

  if (ownerId) {
    watch(ownerId, (newOwnerId, oldOwnerId) => {
      if (newOwnerId !== oldOwnerId) {
        const oldQueryKey = newOwnerId ? `properties_owner_${oldOwnerId}` : 'properties_all';
        propertyStore.clearQueryCache(oldQueryKey);
        documents.value = [];
        hasMore.value = true;
        error.value = null;
        if (newOwnerId) {
          loadMoreDocuments();
        }
      }
    }, { immediate: true });
  } else {
    onMounted(() => loadMoreDocuments());
  }

  return { documents, loading, error, hasMore, loadMoreDocuments };
}
