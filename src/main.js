// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import dateFilter from './filters/date.filter.js';
import currencyFilter from './filters/currency.filter.js';

Vue.config.productionTip = false

Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
