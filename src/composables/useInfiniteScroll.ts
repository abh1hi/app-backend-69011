import { ref, onMounted, onUnmounted, watch, type Ref } from 'vue';
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
  type QueryDocumentSnapshot 
} from 'firebase/firestore';

interface InfiniteScrollOptions {
  ownerId?: Ref<string | null>;
}

export function useInfiniteScroll(collectionName: string, options: InfiniteScrollOptions = {}) {
  const { ownerId } = options;

  const documents = ref<DocumentData[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastDoc = ref<QueryDocumentSnapshot<DocumentData> | null>(null);
  const documentsPerPage = 10;

  const loadMoreDocuments = async (isInitialLoad = false) => {
    if (loading.value) return;
    // Do not fetch if ownerId is a condition but is not available yet.
    if (ownerId && !ownerId.value) {
      documents.value = []; // Clear documents if ownerId is cleared (e.g., on logout)
      return;
    }
    loading.value = true;

    try {
      let q;
      const collectionRef = collection(db, collectionName);
      
      const shouldUsePagination = !isInitialLoad && lastDoc.value;

      if (ownerId?.value) {
        if (shouldUsePagination) {
          q = query(collectionRef, where('ownerId', '==', ownerId.value), orderBy('createdAt', 'desc'), startAfter(lastDoc.value), limit(documentsPerPage));
        } else {
          q = query(collectionRef, where('ownerId', '==', ownerId.value), orderBy('createdAt', 'desc'), limit(documentsPerPage));
        }
      } else {
        if (shouldUsePagination) {
          q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastDoc.value), limit(documentsPerPage));
        } else {
          q = query(collectionRef, orderBy('createdAt', 'desc'), limit(documentsPerPage));
        }
      }

      const querySnapshot = await getDocs(q);
      const newDocuments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (isInitialLoad) {
        documents.value = newDocuments;
      } else {
        documents.value.push(...newDocuments);
      }
      
      lastDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1] ?? null;

    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      error.value = `Could not fetch ${collectionName}.`;
    } finally {
      loading.value = false;
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadMoreDocuments();
    }
  };

  // Watch for changes in ownerId
  if (ownerId) {
    watch(ownerId, (newOwnerId) => {
        // When ownerId changes, reset and perform an initial load.
        documents.value = [];
        lastDoc.value = null;
        if (newOwnerId) {
            loadMoreDocuments(true);
        }
    }, { immediate: true }); // `immediate` will trigger the watch handler right away with the initial value
  } else {
    // If no ownerId is provided, load documents on mount.
    onMounted(() => loadMoreDocuments(true));
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return { documents, loading, error, loadMoreDocuments };
}