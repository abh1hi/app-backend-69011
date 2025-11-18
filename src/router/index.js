import { createRouter, createWebHistory } from 'vue-router';
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
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Auth
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Profile, // Use Profile.vue for the dashboard
        meta: { requiresAuth: true }
    },
    {
        path: '/properties',
        name: 'Properties',
        component: Properties
    },
    {
        path: '/search',
        name: 'SearchResults',
        component: SearchResults
    },
    {
        path: '/property/:id',
        name: 'PropertyDetails',
        component: PropertyDetails
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
        component: Properties
    }
];
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, _from, savedPosition) {
        // If there's a saved position (e.g., from browser back button), use it
        if (savedPosition) {
            return savedPosition;
        }
        // If navigating to a hash, scroll to that element
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 20
            };
        }
        // Otherwise, scroll to top with smooth animation
        return {
            top: 0,
            behavior: 'smooth'
        };
    }
});
export default router;
