import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import 'vant/lib/index.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ParticleBackground from './components/ParticleBackground.vue'

import  router  from './router'
import App from './App.vue'

const app=createApp(App)
for (const [key,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}

const pinia = createPinia()

app.component('ParticleBackground',ParticleBackground)
app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.mount('#app')
