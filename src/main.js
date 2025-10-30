import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import Demo1 from './views/Demo1.vue'
import Demo2 from './views/Demo2.vue'

Vue.use(iView)
Vue.use(VueRouter)

const routes = [
  { path: '/demo1', component: Demo1 },
  { path: '/demo2', component: Demo2 }
]
const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')