//Importing bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import dateFilter from './filters/date.filter';
import currencyFilter from './filters/currency.filter';

Vue.config.productionTip = false

Vue.filter('date', dateFilter);
Vue.filter('currency', currencyFilter);

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
