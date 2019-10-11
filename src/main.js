import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  NavBar,
  Button,
  Field,
  Cell,
  CellGroup,
  Toast
} from 'vant'

import './styles/index.less'

Vue
  .use(NavBar)
  .use(Button)
  .use(Field)
  .use(Cell)
  .use(CellGroup)
  .use(Toast)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
