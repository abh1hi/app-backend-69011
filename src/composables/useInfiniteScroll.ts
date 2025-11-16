import { ref, onMounted, watch, type Ref } from 'vue';
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
  const hasMore = ref(true);
  const documentsPerPage = 10;

  const loadMoreDocuments = async (isInitialLoad = false) => {
    if (loading.value) return;
    
    if (ownerId && !ownerId.value) {
      documents.value = [];
      hasMore.value = true;
      lastDoc.value = null;
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

      const shouldUsePagination = !isInitialLoad && lastDoc.value;
      if (shouldUsePagination) {
        queryParts.push(startAfter(lastDoc.value));
      }
      queryParts.push(limit(documentsPerPage));
      
      q = query(collectionRef, ...queryParts);

      const querySnapshot = await getDocs(q);
      const newDocuments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (isInitialLoad) {
        documents.value = newDocuments;
      } else {
        documents.value.push(...newDocuments);
      }
      
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      lastDoc.value = lastVisible || null;

      if (querySnapshot.docs.length < documentsPerPage) {
        hasMore.value = false;
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
    watch(ownerId, (newOwnerId) => {
        documents.value = [];
        lastDoc.value = null;
        hasMore.value = true;
        error.value = null;
        if (newOwnerId) {
            loadMoreDocuments(true);
        }
    }, { immediate: true });
  } else {
    onMounted(() => loadMoreDocuments(true));
  }

  return { documents, loading, error, hasMore, loadMoreDocuments };
}
