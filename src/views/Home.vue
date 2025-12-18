<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <transition-group name="fade" tag="div" class="hero-background-layer">
        <div v-for="(image, index) in images" :key="index" v-show="index === currentImageIndex" class="hero-image" :style="{ backgroundImage: `url(${image})` }"></div>
      </transition-group>
      <div class="hero-overlay"></div>
      
      <div class="hero-content">
        <div class="hero-chips-container">
            <span class="glass-chip">Residential</span>
            <span class="glass-chip">Commercial</span>
            <span class="glass-chip">Industrial</span>
        </div>


        <p class="hero-subtitle">Discover premium properties with verified dealers and owners.</p>
        
        <div class="hero-search-wrapper glass-panel">
             <HomeSearch />
        </div>
      </div>
    </div>
    
    <!-- Stats Section -->
    <section class="section-container stats-section">
        <div class="stat-item">
            <h2 class="stat-number">{{ stats.activeListings }}</h2>
            <p class="stat-label">Properties</p>
        </div>
        <div class="stat-item">
            <h2 class="stat-number">{{ stats.verifiedDealers }}</h2>
            <p class="stat-label">Dealers</p>
        </div>

    </section>

    <!-- Popular Locations -->
    <section class="section-container locations-section">
      <div class="section-header">
        <h2 class="section-title">Popular Locations</h2>
        <button class="view-all-btn" @click="$router.push('/search')">View All suffixes ➝</button>
      </div>
      
      <div class="locations-grid">
        <div v-for="state in states" :key="state.name" class="location-card" @click="searchByState(state.name)">
          <div class="location-image-wrapper">
             <div class="location-image" :style="{ backgroundImage: `url(${state.image})` }"></div>
             <div class="location-overlay"></div>
          </div>
          <div class="location-info">
             <h3>{{ state.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Marketing / Spotlight -->
    <section class="section-container spotlight-section">
      <div class="spotlight-content">
         <h2 class="spotlight-title">Selling property? <br>List it for free.</h2>
         <p class="spotlight-desc">Connect with thousands of buyers directly. No hiden charges for owners.</p>
         <button class="primary-btn" @click="handleListProperty">List Property</button>
      </div>
      <div class="spotlight-image-container">
          <div class="spotlight-image" style="background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop')"></div>
          
           <div class="floating-card glass-panel">
              <span>Looking for dealers?</span>
              <button class="text-link" @click="$router.push('/search')">Find Experts ➝</button>
           </div>
      </div>
    </section>

    <!-- Featured Properties -->
    <section class="section-container featured-section">
        <div class="section-header">
           <h2 class="section-title">Featured Listings</h2>
        </div>
        <FeaturedProperties />
    </section>

    <!-- Simple CTA -->
    <section class="cta-section">
        <div class="cta-content glass-panel">
            <h2>Start your journey today</h2>
            <p>Join the fastest growing real estate community.</p>
            <button class="cta-btn" @click="$router.push('/profile')">Get Started</button>
        </div>
    </section>

    <IDUploadActionSheet 
      :isVisible="showUpgradeSheet"
      @upload-complete="handleUpgrade"
    />

    <RoleSelectionActionSheet 
      :isVisible="showRoleSheet"
      @select-role="handleRoleSelect"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import HomeSearch from '../components/HomeSearch.vue';
import FeaturedProperties from '../components/FeaturedProperties.vue';
import IDUploadActionSheet from '../components/IDUploadActionSheet.vue';
import RoleSelectionActionSheet from '../components/RoleSelectionActionSheet.vue';
import { useUserStore } from '../stores/userStore';

const router = useRouter();
const userStore = useUserStore();
const user = computed(() => userStore.user);
const userProfile = computed(() => userStore.profile);

const showUpgradeSheet = ref(false);
const showRoleSheet = ref(false);

const loading = computed(() => userStore.loading);

const checkProfileCompletion = () => {
  if (loading.value) return;
  
  // If user is logged in but has no profile OR profile exists but no role
  if (user.value) {
    if (!userProfile.value || !userProfile.value.role) {
      showRoleSheet.value = true;
    }
  }
};

watch([user, userProfile, loading], () => {
  checkProfileCompletion();
}, { immediate: true });

const handleListProperty = () => {
  if (!user.value) {
    router.push('/login');
    return;
  }

  if (userProfile.value?.role === 'dealer') {
    router.push('/add-property');
  } else if (!userProfile.value?.role) {
     showRoleSheet.value = true; // Should ideally catch by watcher, but for explicit click
  } else {
    showUpgradeSheet.value = true;
  }
};

const handleRoleSelect = async (role: 'buyer' | 'dealer') => {
  if (!user.value) return;
  try {
     if (!userProfile.value) {
       // Create new profile if it doesn't exist
       await userStore.createUserProfile(user.value.uid, { 
         role,
         email: user.value.email,
         displayName: user.value.displayName,
         isVerified: false
       });
     } else {
       // Update existing profile
       await userStore.updateProfile(user.value.uid, { role });
     }
     
     showRoleSheet.value = false;

     if (role === 'dealer') {
         // Show upgrade sheet immediately if they chose dealer
         showUpgradeSheet.value = true;
     }

  } catch (e) {
      console.error("Failed to update role", e);
  }
};

const handleUpgrade = async (file: File) => {
  console.log('Home.vue handleUpgrade called with file', file);
  try {
    await userStore.upgradeToDealer(file);
    showUpgradeSheet.value = false;
    router.push('/add-property');
  } catch (error) {
    console.error("Upgrade failed", error);
    alert("Failed to upgrade account. Please try again.");
  }
};

const images = ref([
  '/home-page/hero-section/hero-image-1.jpeg',
  '/home-page/hero-section/hero-image-2.jpeg',
  '/home-page/hero-section/hero-image-3.jpeg'
]);

const currentImageIndex = ref(0);
let intervalId: any = null;

const states = [
  { name: 'Delhi', image: '/home-page/cities-images/delhi-icon.jpeg' },
  { name: 'Mumbai', image: '/home-page/cities-images/mumbai-icon.jpeg' },
  { name: 'Punjab', image: '/home-page/cities-images/punjab-icon.jpeg' },
  { name: 'Rajasthan', image: '/home-page/cities-images/rajasthan-icon.jpeg' },
  { name: 'Uttar Pradesh', image: '/home-page/cities-images/uttar-pardesh-icon.jpeg' },
];

const stats = ref({
  activeListings: '...',
  verifiedDealers: '...',
  citiesCovered: '...',
  totalUsers: '...'
});

const formatCount = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return `${count}`;
};

const fetchStats = async () => {
  try {
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);
    const count = snapshot.size;
    
    stats.value.activeListings = formatCount(count);
    stats.value.verifiedDealers = formatCount(Math.max(5, Math.floor(count / 15)));
    
    const cities = new Set();
    snapshot.forEach(doc => {
       if (doc.data().basic?.city) cities.add(doc.data().basic.city);
    });
    stats.value.citiesCovered = cities.size.toString();
    stats.value.totalUsers = formatCount(count * 5); // Mock estimation
    
  } catch (e) {
    stats.value = { activeListings: '2k+', verifiedDealers: '150+', citiesCovered: '12', totalUsers: '10k+' };
  }
};

const searchByState = (state: string) => {
    router.push({ path: '/search', query: { state } });
};

onMounted(() => {
  intervalId = setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
  }, 5000);
  fetchStats();
});

onUnmounted(() => clearInterval(intervalId));
</script>

<style scoped>
.home-container {
    width: 100%;
    min-height: 100vh;
    background: #f8f9fa; /* Very light subtle grey/white */
    font-family: 'Outfit', 'Inter', sans-serif;
    color: #1a1a1a;
    overflow-x: hidden;
}

/* Utilities */
.glass-panel {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.section-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 1.5rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 3rem;
}

.section-title {
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: -0.5px;
    margin: 0;
}

/* Hero Section */
.hero-section {
    position: relative;
    height: 90vh;
    min-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    margin-top: -80px; /* Under header */
}

.hero-background-layer, .hero-image {
    position: absolute; top:0; left:0; width:100%; height:100%; z-index: 0;
}
.hero-image {
    background-size: cover;
    background-position: center;
    transition: opacity 1.5s ease;
}
.hero-overlay {
    position: absolute; top:0; left:0; width:100%; height:100%; z-index: 1;
    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
}

.hero-content {
    position: relative; z-index: 10;
    max-width: 800px;
    width: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.hero-chips-container {
    display: flex; gap: 1rem; margin-bottom: 2rem;
}

.glass-chip {
    padding: 8px 20px;
    border-radius: 100px;
    font-size: 0.85rem;
    font-weight: 500;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(4px);
    letter-spacing: 0.5px;
}

.hero-title {
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 600;
    line-height: 1.1;
    margin-bottom: 1rem;
    letter-spacing: -1px;
}

.hero-subtitle {
    font-size: clamp(1rem, 2vw, 1.25rem);
    opacity: 0.9;
    font-weight: 300;
    margin-bottom: 3rem;
    max-width: 500px;
}

.hero-search-wrapper {
    width: 100%;
    max-width: 700px;
    padding: 1rem;
    border-radius: 24px;
}

/* Stats Section */
.stats-section {
    display: flex;
    justify-content: space-between;
    padding: 4rem 1.5rem;
    background: white;
}

.stat-item {
    text-align: center;
    flex: 1;
}

.stat-number {
    font-size: 3.5rem;
    font-weight: 200; /* Ultra thin */
    color: #111;
    margin: 0;
    line-height: 1;
}

.stat-label {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 500;
}

/* Locations */
.view-all-btn {
    background: none; border: none; font-size: 0.9rem; font-weight: 500; cursor: pointer;
    border-bottom: 1px solid black; padding-bottom: 2px;
}

.locations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 2rem;
}

.location-card {
    cursor: pointer;
    group: hover;
}

.location-image-wrapper {
    width: 100%;
    height: 320px; /* Tall cards */
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
}

.location-image {
    width: 100%; height: 100%;
    background-size: cover; background-position: center;
    transition: transform 0.5s ease;
}

.location-card:hover .location-image {
    transform: scale(1.05);
}

.location-overlay {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
    opacity: 0;
    transition: opacity 0.3s;
}

.location-card:hover .location-overlay { opacity: 1; }

.location-info h3 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
}

/* Spotlight Section */
.spotlight-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    padding-top: 2rem;
    padding-bottom: 2rem;
}

.spotlight-title {
    font-size: 3rem;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -1px;
}

.spotlight-desc {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 2.5rem;
    max-width: 400px;
    line-height: 1.6;
}

.primary-btn {
    background: #111;
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 100px;
    border: none;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s;
}

.primary-btn:hover { transform: translateY(-2px); }

.spotlight-image-container {
    position: relative;
    height: 500px;
    width: 100%;
}

.spotlight-image {
    width: 100%; height: 100%;
    background-size: cover; background-position: center;
    border-radius: 32px;
}

.floating-card {
    position: absolute;
    bottom: 2rem; right: -2rem;
    padding: 1.5rem 2rem;
    border-radius: 20px;
    display: flex; flex-direction: column; gap: 0.5rem;
    min-width: 200px;
}
.floating-card span { font-size: 0.9rem; color: #555; }
.text-link {
    background: none; border: none; color: #111; font-weight: 600; cursor: pointer;
    padding: 0; text-align: left; font-size: 1rem;
}

/* Featured Section */
.featured-section {
    background: white; /* Contrast from main */
    padding-top: 4rem;
    padding-bottom: 6rem;
}

/* CTA Section */
.cta-section {
    padding: 4rem 1.5rem 6rem;
    display: flex; justify-content: center;
}

.cta-content {
    width: 100%;
    max-width: 1000px;
    padding: 4rem 2rem;
    border-radius: 32px;
    text-align: center;
    background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,240,250,0.8));
}

.cta-content h2 { font-size: 2.5rem; margin-bottom: 1rem; letter-spacing: -1px; }
.cta-content p { font-size: 1.1rem; color: #666; margin-bottom: 2.5rem; }

.cta-btn {
    background: #007aff; /* Brand blue or similar */
    color: white;
    padding: 1rem 3rem;
    border-radius: 100px;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
    transition: transform 0.2s;
}
.cta-btn:hover { transform: translateY(-2px); }


/* Responsive */
@media (max-width: 1024px) {
    .spotlight-section { grid-template-columns: 1fr; text-align: center; gap: 3rem; }
    .spotlight-content { margin: 0 auto; display: flex; flex-direction: column; align-items: center;}
    .floating-card { right: 2rem; }
}

@media (max-width: 768px) {
    .hero-title { font-size: 2.5rem; }
    .stats-section { flex-direction: column; gap: 2rem; padding: 3rem 1.5rem; }
    .locations-grid { grid-template-columns: 1fr 1fr; }
    .location-image-wrapper { height: 200px; }
    .spotlight-image-container { height: 350px; }
    .cta-content { padding: 3rem 1.5rem; }
    .cta-content h2 { font-size: 2rem; }
}
</style>
