import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
import VueGtag from 'vue-gtag' // google analytics
import { VueRecaptchaPlugin } from 'vue-recaptcha/head'
// import StepProgress from 'vue-step-progress';
// import 'vue-step-progress/dist/main.css';

// import with an @ symbol are resolved by vite to ./src directory


import App from '@/App.vue' // import the main app component
import { router } from '@/router' // import the router
import { pinia } from '@/createpinia'
import '@/icons' // configure fontawesome

// Create the app and the data store
// const pinia = createPinia() // create the data store
const app = createApp(App) // create the app

// register plugins
app.use(pinia) // tell the app to use the data store
app.use(router) // tell the app to use the router
app.use(plugin, defaultConfig)
app.use(
  VueGtag,
  {
    disableScriptLoad: import.meta.env.MODE === 'development', // disable script load in development
    pageTrackerExcludedRoutes: ['config'], // ignore the config route
    config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS },
  },
  router
)

app.use(VueRecaptchaPlugin, {
  v3SiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
})

// load any global components (these will be available in all other components)
app.component('FAIcon', FontAwesomeIcon)
// app.component('StepProgress', StepProgress)

// you "mount the app starting at the #app element"
app.mount('#app') // start the app!
