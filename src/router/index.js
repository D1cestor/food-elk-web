import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Create a new router instance with Vue Router's createRouter function
const router = createRouter({
  // Use createWebHistory to create a new history object to be used by the router
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define an array of routes
  routes: [
    {
      // Define the root path as the HomeView component
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // Define the '/about' path as a separate component using code-splitting
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

// Export the router instance for use in other parts of the application
export default router
