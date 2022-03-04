import './config'
import Vue from 'vue'
import App from './App.vue'
import '@/assets/style/main.scss'
import axios from 'axios'
import { csvParse } from 'd3'
import { createApp } from '@vue/composition-api'

export const CSV_PATHS = Array.from(require.context('!!raw-loader!/public/datasets', true, /\.csv$/, 'weak').keys(), path => path.replace('./', '/datasets/'))

Vue.config.productionTip = false

createApp(new Vue({
  render: h => h(App)
}).$mount('#app'))
