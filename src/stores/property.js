import { defineStore } from 'pinia';
import { collection, query, where, orderBy, startAfter, limit, getDocs, doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref as storageRef, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { geohashQueryBounds, distanceBetween } from 'geofire-common';
export const usePropertyStore = defineStore('property', {
    state: () => ({
        propertyId: null, // To hold the ID for the new property being created
        property: {
            basic: { propertyType: '', saleOrRent: '', title: '', description: '', location: '', state: '', city: '', pincode: '', size: null, bedrooms: null, bathrooms: null, floor: '', age: '', lat: null, lng: null, geohash: '' },
            pricing: { price: null, maintenance: '', deposit: '', paymentTerms: '' },
            features: { furnishing: '', parking: '', security: '', amenities: [] },
            media: { photos: [], videos: [] },
            contact: { name: '', email: '', phone: '', contactMethod: '' },
            legal: { ownershipDocs: '', registration: '' },
            ownerId: ''
        },
        completedSections: {
            basic: false,
            pricing: false,
            features: false,
            media: false,
            contact: false,
            legal: false
        },
        cachedQueries: {},
        cachedProperties: {},
        availableStates: [],
        highestPrice: 50000000,
        highestSqft: 10000,
        lowestSqft: 0
    }),
    actions: {
        setPropertyId(id) {
            this.propertyId = id;
        },
        updateProperty(section, data) {
            this.property[section] = { ...this.property[section], ...data };
        },
        addMediaFile(type, file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewUrl = e.target?.result;
                const mediaItem = { file, previewUrl };
                if (type === 'photo') {
                    this.property.media.photos.push(mediaItem);
                }
                else {
                    this.property.media.videos.push(mediaItem);
                }
            };
            reader.readAsDataURL(file);
        },
        setSectionCompleted(section, isCompleted) {
            this.completedSections[section] = isCompleted;
        },
        setOwnerId(uid) {
            this.property.ownerId = uid;
        },
        resetState() {
            this.$reset();
        },
        clearCache() {
            this.cachedQueries = {};
            this.cachedProperties = {};
        },
        clearQueryCache(queryKey) {
            delete this.cachedQueries[queryKey];
        },
        cacheProperty(property) {
            if (property && property.id) {
                this.cachedProperties[property.id] = property;
            }
        },
        getCachedProperty(id) {
            const cachedProperty = this.cachedProperties[id];
            if (cachedProperty) {
                console.log(`[PropertyStore] Loaded property ${id} from cache.`);
            }
            return cachedProperty;
        },
        cacheQuery(queryKey, data) {
            this.cachedQueries[queryKey] = data;
        },
        getCachedQuery(queryKey) {
            const cached = this.cachedQueries[queryKey];
            if (cached) {
                console.log(`[PropertyStore] Found cached query for key: ${queryKey}`);
            }
            return cached;
        },
        // REPLACE THE ENTIRE fetchProperties function with this
        async fetchProperties(options) {
            const { collectionName, ownerId, filters, lastDoc, location } = options;
            const collectionRef = collection(db, collectionName);
            try {
                let documents = [];
                let newLastDoc = null;
                let hasMore = false;
                if (location && location.lat && location.lng) {
                    // --- GEO-QUERY LOGIC ---
                    const center = [location.lat, location.lng];
                    const radiusInM = 50 * 1000; // 50km radius
                    const bounds = geohashQueryBounds(center, radiusInM);
                    const promises = bounds.map((b) => {
                        const q = query(collectionRef, orderBy('basic.geohash'), where('basic.geohash', '>=', b[0]), where('basic.geohash', '<=', b[1]));
                        return getDocs(q);
                    });
                    const snapshots = await Promise.all(promises);
                    const matchingDocs = [];
                    snapshots.forEach((snap) => {
                        snap.forEach((doc) => {
                            const docData = { id: doc.id, ...doc.data() };
                            if (docData.basic?.lat && docData.basic?.lng) {
                                const docLoc = [docData.basic.lat, docData.basic.lng];
                                const distanceInKm = distanceBetween(docLoc, center);
                                const radiusInKm = radiusInM / 1000;
                                if (distanceInKm <= radiusInKm) {
                                    matchingDocs.push(docData);
                                }
                            }
                        });
                    });
                    const uniqueDocs = new Map();
                    matchingDocs.forEach(doc => uniqueDocs.set(doc.id, doc));
                    documents = Array.from(uniqueDocs.values());
                    hasMore = false;
                    newLastDoc = null;
                }
                else {
                    // --- NON-GEO-QUERY LOGIC ---
                    const queryConstraints = [];
                    if (ownerId) {
                        queryConstraints.push(where('ownerId', '==', ownerId));
                    }
                    if (filters) {
                        if (filters.saleOrRent) {
                            queryConstraints.push(where('basic.saleOrRent', '==', filters.saleOrRent));
                        }
                        if (filters.state) {
                            queryConstraints.push(where('basic.state', '==', filters.state));
                        }
                        if (filters.propertyType) {
                            queryConstraints.push(where('basic.propertyType', '==', filters.propertyType));
                        }
                        if (filters.priceRange && filters.priceRange[1] < this.highestPrice) {
                            queryConstraints.push(where('pricing.price', '>=', filters.priceRange[0]));
                            queryConstraints.push(where('pricing.price', '<=', filters.priceRange[1]));
                        }
                    }
                    if (filters && filters.priceRange) {
                        queryConstraints.push(orderBy('pricing.price', 'desc'));
                    }
                    else {
                        queryConstraints.push(orderBy('createdAt', 'desc'));
                    }
                    if (lastDoc) {
                        queryConstraints.push(startAfter(lastDoc));
                    }
                    queryConstraints.push(limit(25));
                    const finalQuery = query(collectionRef, ...queryConstraints);
                    const querySnapshot = await getDocs(finalQuery);
                    documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
                    hasMore = querySnapshot.docs.length === 25;
                }
                // --- APPLY CLIENT-SIDE FILTERS ---
                if (filters) {
                    documents = documents.filter(doc => {
                        const propertyDoc = doc;
                        const basic = propertyDoc.basic || {};
                        const features = propertyDoc.features || {};
                        if (filters.bedrooms > 0 && (basic.bedrooms || 0) < filters.bedrooms)
                            return false;
                        if (filters.bathrooms > 0 && (basic.bathrooms || 0) < filters.bathrooms)
                            return false;
                        if (filters.sqftRange) {
                            const size = basic.size || 0;
                            if (size < filters.sqftRange[0] || size > filters.sqftRange[1])
                                return false;
                        }
                        if (filters.amenities && filters.amenities.length > 0) {
                            const propertyAmenities = features.amenities || [];
                            if (!filters.amenities.every((a) => propertyAmenities.includes(a)))
                                return false;
                        }
                        return true;
                    });
                }
                documents.forEach(doc => this.cacheProperty(doc));
                return { newDocuments: documents, newLastDoc, hasMore };
            }
            catch (error) {
                console.error("[PropertyStore] ERROR executing fetchProperties:", error);
                throw error;
            }
        },
        async deleteProperty(propertyId) {
            console.log(`[PropertyStore] Initiating deletion for property: ${propertyId}`);
            const docRef = doc(db, 'properties', propertyId);
            try {
                // Get the document to retrieve media URLs before deleting
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const propertyData = docSnap.data();
                    const mediaUrls = propertyData.mediaUrls || {};
                    // Delete Firestore document
                    await deleteDoc(docRef);
                    console.log(`[PropertyStore] Successfully deleted Firestore document: ${propertyId}`);
                    // Delete associated media from Firebase Storage
                    const deletePromises = [];
                    if (mediaUrls.photos && mediaUrls.photos.length > 0) {
                        mediaUrls.photos.forEach((url) => {
                            const photoRef = storageRef(storage, url);
                            deletePromises.push(deleteObject(photoRef));
                        });
                    }
                    if (mediaUrls.videos && mediaUrls.videos.length > 0) {
                        mediaUrls.videos.forEach((url) => {
                            const videoRef = storageRef(storage, url);
                            deletePromises.push(deleteObject(videoRef));
                        });
                    }
                    await Promise.all(deletePromises);
                    console.log(`[PropertyStore] Successfully deleted all associated media for property: ${propertyId}`);
                    // Clear caches
                    delete this.cachedProperties[propertyId];
                    this.clearCache(); // Clear all query caches as they are now stale
                }
                else {
                    console.warn(`[PropertyStore] Property with ID ${propertyId} not found for deletion.`);
                }
            }
            catch (error) {
                console.error(`[PropertyStore] Error during deletion of property ${propertyId}:`, error);
                throw error;
            }
        },
        async updatePropertyWithMedia(propertyId, updatedData, mediaChanges) {
            const docRef = doc(db, "properties", propertyId);
            try {
                // 1. Delete media marked for removal
                const deletePromises = mediaChanges.deletedUrls.map(url => {
                    const oldRef = storageRef(storage, url);
                    return deleteObject(oldRef);
                });
                await Promise.all(deletePromises);
                // 2. Upload new files
                const uploadPromises = mediaChanges.newFiles.map(async (file) => {
                    const newRef = storageRef(storage, `properties/${propertyId}/${file.name}`);
                    await uploadBytes(newRef, file);
                    return getDownloadURL(newRef);
                });
                const newUrls = await Promise.all(uploadPromises);
                // 3. Get current data and merge media URLs
                const docSnap = await getDoc(docRef);
                if (!docSnap.exists()) {
                    throw new Error("Property not found");
                }
                const existingData = docSnap.data();
                const existingUrls = existingData.mediaUrls || { photos: [], videos: [] };
                // Filter out deleted URLs and add new ones
                const updatedPhotos = (existingUrls.photos || []).filter((url) => !mediaChanges.deletedUrls.includes(url));
                // This assumes new files are photos for simplicity. Adjust if handling videos differently.
                updatedData['mediaUrls.photos'] = [...updatedPhotos, ...newUrls];
                // 4. Update Firestore
                await updateDoc(docRef, updatedData);
                // 5. Invalidate cache
                delete this.cachedProperties[propertyId];
                this.clearCache();
                console.log("[PropertyStore] Property updated successfully with media changes.");
            }
            catch (error) {
                console.error("[PropertyStore] Error updating property with media:", error);
                throw error;
            }
        },
        // REPLACE these three functions
        async fetchHighestPrice() {
            try {
                const q = query(collection(db, 'properties'), orderBy('pricing.price', 'desc'), limit(1));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const firstDoc = querySnapshot.docs[0];
                    if (firstDoc) {
                        const docData = firstDoc.data();
                        if (docData?.pricing?.price != null) {
                            this.highestPrice = docData.pricing.price;
                            return docData.pricing.price;
                        }
                    }
                }
                return this.highestPrice;
            }
            catch (error) {
                console.error("[PropertyStore] Error fetching highest price:", error);
                return this.highestPrice;
            }
        },
        async fetchHighestSqft() {
            try {
                const q = query(collection(db, 'properties'), orderBy('basic.size', 'desc'), limit(1));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const firstDoc = querySnapshot.docs[0];
                    if (firstDoc) {
                        const docData = firstDoc.data();
                        if (docData?.basic?.size != null) {
                            this.highestSqft = docData.basic.size;
                            return docData.basic.size;
                        }
                    }
                }
                return this.highestSqft;
            }
            catch (error) {
                console.error("[PropertyStore] Error fetching highest sqft:", error);
                return this.highestSqft;
            }
        },
        async fetchLowestSqft() {
            try {
                const q = query(collection(db, 'properties'), orderBy('basic.size', 'asc'), limit(1));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const firstDoc = querySnapshot.docs[0];
                    if (firstDoc) {
                        const docData = firstDoc.data();
                        if (docData?.basic?.size != null) {
                            this.lowestSqft = docData.basic.size;
                            return docData.basic.size;
                        }
                    }
                }
                return this.lowestSqft;
            }
            catch (error) {
                console.error("[PropertyStore] Error fetching lowest sqft:", error);
                return this.lowestSqft;
            }
        },
        async fetchAvailableStates() {
            if (this.availableStates.length > 0)
                return;
            try {
                const querySnapshot = await getDocs(collection(db, 'properties'));
                const states = new Set();
                querySnapshot.forEach((doc) => {
                    const state = doc.data()?.basic?.state;
                    if (state && typeof state === 'string' && state.trim() !== '') {
                        states.add(state);
                    }
                });
                this.availableStates = Array.from(states).sort();
            }
            catch (error) {
                console.error("Error fetching available states:", error);
                this.availableStates = [];
            }
        }
    }
});
