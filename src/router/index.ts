import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Auth from '../views/Auth.vue';
import Profile from '../views/Profile.vue';
import Properties from '../views/Properties.vue';
import AddProperty from '../views/AddProperty.vue';
import PreviewProperty from '../views/PreviewProperty.vue';
import MyProperties from '../views/MyProperties.vue';
import PropertyDetails from '../views/PropertyDetails.vue';

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
  routes
});

export default router;
