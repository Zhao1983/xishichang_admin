import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import {
    GridPlugin
} from '@syncfusion/ej2-vue-grids'

import AsyncComputed from 'vue-async-computed'

import VueMoment from 'vue-moment'

import '@/styles/index.scss' // global css
import '../node_modules/@syncfusion/ej2-vue-grids/styles/material.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
    const {
        mockXHR
    } = require('../mock')
    mockXHR()
}

// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VueMoment)
Vue.use(GridPlugin)
Vue.use(AsyncComputed)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})