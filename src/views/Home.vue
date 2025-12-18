<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <transition-group name="fade" tag="div" class="hero-background-layer">
        <div v-for="(image, index) in images" :key="index" v-show="index === currentImageIndex" class="hero-image" :style="{ backgroundImage: `url(${image})` }"></div>
      </transition-group>
      <div class="hero-overlay"></div>
      
      <div class="hero-content">
        <div class="hero-main-info animate-up">
          <div class="hero-tagline">
            <span class="tagline-dot"></span>
            Real Estate Redefined
          </div>
          <h1 class="hero-display-title">Find Your Perfect<br><span>Aashiyanaa</span></h1>
          <p class="hero-description">Discover premium residential and commercial properties verified by local experts.</p>
        </div>
        
        <div class="hero-search-wrapper glass-panel animate-up-delayed">
             <HomeSearch />
        </div>

        <div class="hero-quick-filters animate-up-delayed-more">
            <span class="filter-chip">Residential</span>
            <span class="filter-chip">Commercial</span>
            <span class="filter-chip">Villas</span>
            <span class="filter-chip">Plots</span>
        </div>
      </div>
    </div>
    
    <!-- Stats Section -->
    <section class="stats-section">
        <div class="stat-item animate-up">
            <span class="stat-icon material-symbols-outlined">real_estate_agent</span>
            <div class="stat-values">
                <h2 class="stat-number">{{ stats.activeListings }}</h2>
                <p class="stat-label">Properties</p>
            </div>
        </div>
        <div class="stat-vertical-divider"></div>
        <div class="stat-item animate-up">
            <span class="stat-icon material-symbols-outlined">groups</span>
            <div class="stat-values">
                <h2 class="stat-number">{{ stats.verifiedDealers }}</h2>
                <p class="stat-label">Verified Dealers</p>
            </div>
        </div>
        <div class="stat-vertical-divider"></div>
        <div class="stat-item animate-up">
            <span class="stat-icon material-symbols-outlined">location_city</span>
            <div class="stat-values">
                <h2 class="stat-number">{{ stats.citiesCovered }}</h2>
                <p class="stat-label">Cities</p>
            </div>
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

    <!-- Spotlight Section -->
    <section class="section-container spotlight-section">
      <div class="spotlight-grid">
        <div class="spotlight-content animate-up">
           <div class="accent-line"></div>
           <h2 class="spotlight-title">Selling property? <br><span class="highlight-text">List it for free.</span></h2>
           <p class="spotlight-desc">Connect with thousands of buyers directly. No hidden charges for owners. Simple, transparent, and verified.</p>
           <button class="primary-btn-modern" @click="handleListProperty">
             <span>List Property</span>
             <span class="material-symbols-outlined">add_circle</span>
           </button>
        </div>
        <div class="spotlight-image-container animate-up-delayed">
            <div class="spotlight-image" style="background-image: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop')"></div>
             <div class="floating-card glass-panel shadow-premium">
                <div class="expert-avatar-group">
                    <span class="material-symbols-outlined">support_agent</span>
                    <div>
                        <p class="expert-text">Need expert help?</p>
                        <button class="text-link-modern" @click="$router.push('/search')">Find Agents ➝</button>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </section>



    <!-- Simple CTA -->
    <section class="cta-section">
        <div class="cta-card-premium glass-panel animate-up">
            <h2>Start your journey today</h2>
            <p>Join the fastest growing real estate community. It's free and always will be.</p>
            <div class="cta-buttons">
              <button class="cta-btn-primary" @click="$router.push('/profile')">Get Started</button>
              <button class="cta-btn-secondary" @click="$router.push('/properties')">Browse Styles</button>
            </div>
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
  { name: 'Jaipur', image: '/home-page/cities-images/jaipur-icon.jpg' },
  { name: 'Delhi', image: '/home-page/cities-images/delhi-icon.jpeg' },
  { name: 'Gurugram', image: '/home-page/cities-images/gurugram-icon.jpg' },
  { name: 'Ajmer', image: '/home-page/cities-images/Ajmer-icon.png' },
  { name: 'Mumbai', image: '/home-page/cities-images/mumbai-icon.jpeg' },
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
    padding: 8rem 1.5rem; /* Increased vertical breathing room */
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

/* Hero Section Refinements */
.hero-section {
    position: relative;
    height: 95vh;
    min-height: 700px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2rem;
    margin-top: -80px; /* Seamless flow under header */
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
    background: linear-gradient(180deg, 
                rgba(0,0,0,0.5) 0%, 
                rgba(0,0,0,0.3) 50%, 
                rgba(0,0,0,0.6) 100%);
}

.hero-content {
    position: relative; z-index: 10;
    max-width: 900px;
    width: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
}

.hero-tagline {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 8px 16px;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

.tagline-dot {
    width: 8px;
    height: 8px;
    background: #007aff;
    border-radius: 50%;
    box-shadow: 0 0 10px #007aff;
}

.hero-display-title {
    font-size: clamp(3.5rem, 8vw, 6rem);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -3px;
    margin-bottom: 1.5rem;
    text-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.hero-display-title span {
    background: linear-gradient(to right, #ffffff, #007aff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    filter: drop-shadow(0 2px 10px rgba(0,122,255,0.3));
}

.hero-description {
    font-size: clamp(1.1rem, 2vw, 1.3rem);
    opacity: 0.95;
    font-weight: 300;
    max-width: 600px;
    margin: 0 auto;
    letter-spacing: 0.2px;
}

.hero-search-wrapper {
    width: 100%;
    max-width: 750px;
    padding: 0.75rem;
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}

.hero-quick-filters {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
}

.filter-chip {
    padding: 10px 24px;
    border-radius: 100px;
    font-size: 0.9rem;
    font-weight: 500;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    color: white;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-chip:hover {
    background: white;
    color: #1a1a1a;
    transform: translateY(-2px);
}

/* Animations */
.animate-up {
    animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
.animate-up-delayed {
    animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
}
.animate-up-delayed-more {
    animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s both;
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Stats Section Refinements */
.stats-section {
    display: flex;
    justify-content: center;
    gap: 100px;
    padding: 5rem 1.5rem;
    background: white;
    border-bottom: 1px solid #f0f0f0;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    text-align: left;
}

.stat-icon {
    font-size: 2.5rem;
    color: #007aff;
    opacity: 0.8;
}

.stat-vertical-divider {
    width: 1px;
    height: 50px;
    background: #eee;
}

.stat-number {
    font-size: 2.2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    line-height: 1;
}

.stat-label {
    font-size: 0.85rem;
    color: #888;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 500;
}

/* Locations Section Refinement */
.locations-section {
    background: #fafafa;
}

.view-all-btn {
    background: none; 
    border: none; 
    font-size: 0.95rem; 
    font-weight: 500; 
    cursor: pointer;
    color: #007aff;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.view-all-btn:hover {
    gap: 12px;
}

.locations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2.5rem;
}

.location-card {
    cursor: pointer;
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    background: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.location-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.location-image-wrapper {
    width: 100%;
    height: 350px;
    overflow: hidden;
    position: relative;
}

.location-image {
    width: 100%; height: 100%;
    background-size: cover; 
    background-position: center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.location-card:hover .location-image {
    transform: scale(1.1);
}

.location-overlay {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 60%;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
    transition: opacity 0.3s;
}

.location-info {
    position: absolute;
    bottom: 24px;
    left: 24px;
    color: white;
    z-index: 2;
}

.location-info h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 4px;
}

.location-info p {
    font-size: 0.9rem;
    opacity: 0.8;
}

/* Spotlight Section Refinement */
.spotlight-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
}

.accent-line {
    width: 60px;
    height: 4px;
    background: #007aff;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.spotlight-title {
    font-size: 3.5rem;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -2px;
    font-weight: 700;
}

.spotlight-desc {
    font-size: 1.15rem;
    color: #555;
    margin-bottom: 2.5rem;
    max-width: 450px;
    line-height: 1.6;
}

.primary-btn-modern {
    background: #1a1a1a;
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 100px;
    border: none;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.primary-btn-modern:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

.spotlight-image-container {
    position: relative;
    height: 550px;
    width: 100%;
}

.spotlight-image {
    width: 100%; height: 100%;
    background-size: cover; background-position: center;
    border-radius: 40px;
    box-shadow: 0 30px 60px rgba(0,0,0,0.1);
}

.expert-avatar-group {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.floating-card {
    position: absolute;
    bottom: 2.5rem; right: -2rem;
    padding: 1.25rem 1.75rem;
    border-radius: 24px;
    min-width: 250px;
}

.expert-text { font-size: 0.85rem; color: #888; margin: 0; }
.text-link-modern {
    background: none; border: none; color: #1a1a1a; font-weight: 600; cursor: pointer;
    padding: 0; text-align: left; font-size: 1rem; margin-top: 2px;
}

/* Featured Section */
.featured-section {
    background: white;
    padding: 8rem 0;
}

/* Elevated CTA Section */
.cta-section {
    padding: 2rem 1.5rem 8rem;
    display: flex; justify-content: center;
}

.cta-card-premium {
    width: 100%;
    max-width: 1100px;
    padding: 6rem 3rem;
    border-radius: 40px;
    text-align: center;
    background: linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%);
    position: relative;
    overflow: hidden;
}

.cta-card-premium::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%);
    pointer-events: none;
}

.cta-card-premium h2 { 
    font-size: 3.5rem; 
    margin-bottom: 1.5rem; 
    letter-spacing: -2px; 
    font-weight: 700;
}

.cta-card-premium p { 
    font-size: 1.2rem; 
    color: #666; 
    margin-bottom: 3.5rem; 
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
}

.cta-btn-primary {
    background: #007aff;
    color: white;
    padding: 1.1rem 3.5rem;
    border-radius: 100px;
    border: none;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
    transition: all 0.3s ease;
}

.cta-btn-primary:hover { 
    transform: translateY(-4px); 
    box-shadow: 0 15px 40px rgba(0, 122, 255, 0.4);
}

.cta-btn-secondary {
    background: white;
    color: #1a1a1a;
    padding: 1.1rem 3.5rem;
    border-radius: 100px;
    border: 1px solid #ddd;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cta-btn-secondary:hover {
    border-color: #1a1a1a;
    background: #f9f9f9;
}

/* Utility Shadows */
.shadow-premium {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

/* Responsive Overrides */
@media (max-width: 1024px) {
    .spotlight-grid { grid-template-columns: 1fr; text-align: center; gap: 4rem; }
    .spotlight-content { display: flex; flex-direction: column; align-items: center; }
    .spotlight-desc { margin-left: auto; margin-right: auto; }
    .accent-line { margin-left: auto; margin-right: auto; }
    .floating-card { right: 2rem; }
}

@media (max-width: 768px) {
    .hero-display-title { font-size: 3.5rem; }
    .stats-section { flex-direction: column; gap: 3rem; padding: 4rem 1.5rem; align-items: flex-start; margin-left: auto; margin-right: auto; width: fit-content;}
    .stat-vertical-divider { display: none; }
    .spotlight-title { font-size: 2.8rem; }
    .cta-card-premium { padding: 4rem 1.5rem; }
    .cta-card-premium h2 { font-size: 2.5rem; }
    .cta-buttons { flex-direction: column; width: 100%; max-width: 300px; margin: 0 auto; }
}
</style>
