import { createApp } from 'vue'
import App from './App.vue'
// import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './assets/main.css'

// Create a new Vue app instance
const app = createApp(App)

// Get a reference to the Vue app's global properties object
const prototype = app.config.globalProperties

// app.use(router)
app.use(ElementPlus)

// Mount the app to the DOM
app.mount('#app')
