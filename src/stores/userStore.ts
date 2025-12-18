import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const useUserStore = defineStore('userV2', () => {
  const user = ref<User | null>(null);
  const profile = ref<any>(null);
  const loading = ref(true);
  const auth = getAuth();
  const router = useRouter();

  console.log('User Store Initializing...'); // Debug: Ensure store loads

  let unsubscribe: (() => void) | null = null;

  const listenForAuthStateChanges = () => {
    if (unsubscribe) return;

    unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      user.value = currentUser;
      if (currentUser) {
        await fetchUserProfile(currentUser.uid);
      } else {
        profile.value = null;
      }
      loading.value = false;
      if (!currentUser) {
        router.push('/login');
      }
    });
  };

  const stopListeningForAuthStateChanges = () => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };



  const createUserProfile = async (uid: string, profileData: any) => {
    try {
      const userRef = doc(db, 'users', uid);

      // Default to empty strings if null, or use auth data
      const authData = user.value ? {
        displayName: user.value.displayName || '',
        email: user.value.email || '',
        photoURL: user.value.photoURL || '',
        phoneNumber: user.value.phoneNumber || '',
      } : {};

      await setDoc(userRef, {
        ...authData,
        ...profileData,
        createdAt: serverTimestamp()
      }, { merge: true });

      profile.value = { ...authData, ...profile.value, ...profileData };
      console.log('Profile created:', profile.value);
    } catch (e) {
      console.error('Error creating user profile:', e);
      throw e;
    }
  };

  const fetchUserProfile = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        profile.value = docSnap.data();
      } else {
        profile.value = null; // Or partial profile
      }
    } catch (e) {
      console.error('Error fetching user profile:', e);
      // Don't throw, just log
    }
  };


  const uploadUserDocument = async (uid: string, file: File) => {
    try {
      const fileRef = storageRef(storage, `user_documents/${uid}/aadhar_card.pdf`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (e) {
      console.error('Error uploading document:', e);
      throw e;
    }
  };

  const upgradeToDealerLogged = async (file: File) => {
    console.log('upgradeToDealer called with file:', file.name);
    if (!user.value) {
      console.error('upgradeToDealer aborting: no user');
      return;
    }
    try {
      loading.value = true;
      const downloadURL = await uploadUserDocument(user.value.uid, file);

      const userRef = doc(db, 'users', user.value.uid);

      const authData = {
        displayName: user.value.displayName || '',
        email: user.value.email || '',
        phoneNumber: user.value.phoneNumber || '',
      };

      const updateData = {
        ...authData,
        role: 'dealer',
        isVerified: true,
        verificationMethod: 'self_approved',
        documents: {
          aadharCardUrl: downloadURL
        }
      };

      console.log('Upgrading user to dealer with data:', JSON.stringify(updateData));

      await setDoc(userRef, updateData, { merge: true });
      console.log('Dealer upgrade written to Firestore');

      // Update local state
      if (profile.value) {
        profile.value = { ...profile.value, ...updateData };
      } else {
        profile.value = updateData;
      }
      console.log('Local profile updated:', JSON.stringify(profile.value));

    } catch (e) {
      console.error('Error upgrading to dealer:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateUserProfile = async (uid: string, data: any) => {
    // Updating user profile
    try {
      loading.value = true;
      const userRef = doc(db, 'users', uid);

      // Update Firestore
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });

      // Update local state
      if (profile.value) {
        profile.value = { ...profile.value, ...data };
      } else {
        profile.value = data;
      }

      console.log('User profile updated successfully');
    } catch (e) {
      console.error('Error updating user profile:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const returnValue = {
    user,
    profile,
    loading,
    listenForAuthStateChanges,
    stopListeningForAuthStateChanges,
    logout,
    createUserProfile,
    fetchUserProfile,
    uploadUserDocument,
    upgradeToDealer: upgradeToDealerLogged,
    updateUserProfile
  };

  console.log('[UserStore] Initialized. Returning keys:', Object.keys(returnValue));
  console.log('[UserStore] updateUserProfile type:', typeof returnValue.updateUserProfile);

  return returnValue;
});


