import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Home from '../views/Home.vue';
import Auth from '../views/Auth.vue';
import Profile from '../views/Profile.vue';
import Properties from '../views/Properties.vue';
import AddProperty from '../views/AddProperty.vue';
import PreviewProperty from '../views/PreviewProperty.vue';
import MyProperties from '../views/MyProperties.vue';
import PropertyDetails from '../views/PropertyDetails.vue';
import SearchResults from '../views/SearchResults.vue';
import EditProperty from '../views/EditProperty.vue';
import Contact from '../views/Contact.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { isPublic: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Auth,
    meta: { isPublic: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/properties',
    name: 'Properties',
    component: Properties,
    meta: { isPublic: true }
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    meta: { isPublic: true }
  },
  {
    path: '/property/:id',
    name: 'PropertyDetails',
    component: PropertyDetails,
    meta: { isPublic: true }
  },
  {
    path: '/add-property',
    name: 'AddProperty',
    component: AddProperty,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit-property/:id',
    name: 'EditProperty',
    component: EditProperty,
    meta: { requiresAuth: true }
  },
  {
    path: '/preview',
    name: 'PreviewProperty',
    component: PreviewProperty,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-properties',
    name: 'MyProperties',
    component: MyProperties,
    meta: { requiresAuth: true }
  },
  {
    path: '/all-properties',
    name: 'AllProperties',
    component: Properties,
    meta: { isPublic: true }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: { isPublic: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 20
      };
    }
    return {
      top: 0,
      behavior: 'smooth'
    };
  }
});

// Helper to wait for Firebase Auth to initialize
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = await getCurrentUser();

  if (requiresAuth && !user) {
    next('/login');
  } else if (to.name === 'Login' && user) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
