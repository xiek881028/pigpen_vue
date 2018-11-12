/*!
 * common
 * create: 2017/11/30
 * since: 0.0.1
 */
'use strict';

// Css
import '@/css/_reset.scss';
import '@/css/_common.scss';

import Vue from 'vue';
import Vuex from 'vuex';
import store from '@/js/store';
import pages from '../pages';

if(process.env.NODE_ENV === 'production'){
  window.console.log = function() {};
}

Vue.use(Vuex);

new Vue({
  el: '#app',
  router: pages,
  store,
});
