import { ref, onMounted, watch, type Ref, computed } from 'vue';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  startAfter, 
  limit, 
  getDocs, 
  type DocumentData, 
} from 'firebase/firestore';
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
    // Use a more descriptive name for the general list of properties
    return ownerId?.value ? `properties_owner_${ownerId.value}` : 'properties_all';
  });

  const loadMoreDocuments = async (isInitialLoad = false) => {
    if (loading.value) return;

    const cachedQuery = propertyStore.getCachedQuery(queryKey.value);
    // On the initial load of a list, check for cached data first.
    if (isInitialLoad && cachedQuery) {
      console.log(`[Cache] Loading properties for list: '${queryKey.value}' from cache.`);
      documents.value = cachedQuery.documents;
      hasMore.value = cachedQuery.hasMore;
      return; // Data is already cached, no need to fetch.
    }

    if (ownerId && !ownerId.value) {
      documents.value = [];
      hasMore.value = true;
      propertyStore.clearQueryCache(queryKey.value);
      return;
    }
    loading.value = true;

    try {
      let q;
      const collectionRef = collection(db, collectionName);
      
      const queryParts: any[] = [];
      if (ownerId?.value) {
        queryParts.push(where('ownerId', '==', ownerId.value));
      }
      queryParts.push(orderBy('createdAt', 'desc'));
      queryParts.push(orderBy('__name__', 'desc'));

      const lastDoc = cachedQuery ? cachedQuery.lastDoc : null;
      const shouldUsePagination = !isInitialLoad && lastDoc;
      if (shouldUsePagination) {
        queryParts.push(startAfter(lastDoc));
      }
      queryParts.push(limit(10));
      
      q = query(collectionRef, ...queryParts);
      
      if (isInitialLoad) {
        console.log(`[API] Fetching initial properties for list: '${queryKey.value}' from Firestore.`);
      } else {
        console.log(`[API] Fetching more properties for list: '${queryKey.value}' from Firestore.`);
      }

      const querySnapshot = await getDocs(q);
      const newDocuments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      const newHasMore = querySnapshot.docs.length === 10;

      propertyStore.addCachedDocuments(queryKey.value, newDocuments, newLastDoc, newHasMore);
      const updatedQuery = propertyStore.getCachedQuery(queryKey.value);
      if(updatedQuery){
        documents.value = updatedQuery.documents;
        hasMore.value = updatedQuery.hasMore;
      }

    } catch (err: any) {
      console.error(`Error fetching ${collectionName}:`, err);
      if (err.code === 'failed-precondition') {
        error.value = 'This query requires a Firestore index. Please create it in the Firebase console.';
        console.error('Missing Firestore index. Please create the required composite index in your Firebase console. The link to create it should be in the error message in the browser console.');
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
        // Clear the cache for the specific query when the ownerId changes.
        const oldQueryKey = newOwnerId ? `properties_owner_${oldOwnerId}` : 'properties_all';
        propertyStore.clearQueryCache(oldQueryKey);
        documents.value = [];
        hasMore.value = true;
        error.value = null;
        if (newOwnerId) {
            loadMoreDocuments(true);
        }
      }
    }, { immediate: true });
  } else {
    onMounted(() => loadMoreDocuments(true));
  }

  return { documents, loading, error, hasMore, loadMoreDocuments };
}
