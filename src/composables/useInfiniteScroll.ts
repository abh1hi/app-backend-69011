import { ref, onMounted, onUnmounted } from 'vue';
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

export function useInfiniteScroll(collectionName: string, ownerId?: string) {
  const documents = ref<DocumentData[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const lastDoc = ref<QueryDocumentSnapshot<DocumentData> | null>(null);
  const documentsPerPage = 10;

  const loadMoreDocuments = async () => {
    if (loading.value) return;
    loading.value = true;

    try {
      let q;
      const collectionRef = collection(db, collectionName);

      if (ownerId) {
        if (lastDoc.value) {
          q = query(collectionRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'), startAfter(lastDoc.value), limit(documentsPerPage));
        } else {
          q = query(collectionRef, where('ownerId', '==', ownerId), orderBy('createdAt', 'desc'), limit(documentsPerPage));
        }
      } else {
        if (lastDoc.value) {
          q = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastDoc.value), limit(documentsPerPage));
        } else {
          q = query(collectionRef, orderBy('createdAt', 'desc'), limit(documentsPerPage));
        }
      }

      const querySnapshot = await getDocs(q);
      const newDocuments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      documents.value.push(...newDocuments);
      
      if (querySnapshot.docs.length > 0) {
        lastDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1];
      } else {
        // No more documents to load
      }

    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      error.value = `Could not fetch ${collectionName}.`;
    } finally {
      loading.value = false;
    }
  };

  const handleScroll = () => {
    // Check if we're near the bottom of the page
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) { // added a 20px buffer
      loadMoreDocuments();
    }
  };

  onMounted(() => {
    loadMoreDocuments();
    window.addEventListener('scroll', handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return { documents, loading, error, loadMoreDocuments };
}
