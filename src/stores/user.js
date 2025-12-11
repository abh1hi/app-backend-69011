import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
export const useUserStore = defineStore('user', () => {
    const user = ref(null);
    const profile = ref(null);
    const loading = ref(true);
    const auth = getAuth();
    const router = useRouter();
    let unsubscribe = null;
    const listenForAuthStateChanges = () => {
        if (unsubscribe)
            return;
        unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            user.value = currentUser;
            if (currentUser) {
                await fetchUserProfile(currentUser.uid);
            }
            else {
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
    const createUserProfile = async (uid, profileData) => {
        try {
            const userRef = doc(db, 'users', uid);
            await setDoc(userRef, {
                ...profileData,
                createdAt: serverTimestamp()
            }, { merge: true });
            profile.value = { ...profile.value, ...profileData };
            console.log('Profile created:', profileData);
        }
        catch (e) {
            console.error('Error creating user profile:', e);
            throw e;
        }
    };
    const fetchUserProfile = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                profile.value = docSnap.data();
            }
            else {
                profile.value = null; // Or partial profile
            }
        }
        catch (e) {
            console.error('Error fetching user profile:', e);
            // Don't throw, just log
        }
    };
    const uploadUserDocument = async (uid, file) => {
        try {
            const fileRef = storageRef(storage, `user_documents/${uid}/aadhar_card.pdf`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            return downloadURL;
        }
        catch (e) {
            console.error('Error uploading document:', e);
            throw e;
        }
    };
    const upgradeToDealer = async (file) => {
        if (!user.value)
            return;
        try {
            loading.value = true;
            const downloadURL = await uploadUserDocument(user.value.uid, file);
            const userRef = doc(db, 'users', user.value.uid);
            const updateData = {
                role: 'dealer',
                isVerified: false,
                'documents.aadharCardUrl': downloadURL
            };
            await updateDoc(userRef, updateData);
            // Update local state
            if (profile.value) {
                profile.value.role = 'dealer';
                profile.value.isVerified = false;
                profile.value.documents = { ...profile.value.documents, aadharCardUrl: downloadURL };
            }
        }
        catch (e) {
            console.error('Error upgrading to dealer:', e);
            throw e;
        }
        finally {
            loading.value = false;
        }
    };
    return {
        user,
        profile,
        loading,
        listenForAuthStateChanges,
        stopListeningForAuthStateChanges,
        logout,
        createUserProfile,
        fetchUserProfile,
        uploadUserDocument,
        upgradeToDealer
    };
});
