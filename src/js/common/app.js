/*!
 * common
 * create: 2017/11/30
 * since: 0.0.1
 */
'use strict';

// Css
import '@src/css/_reset.less';
import '@src/css/_common.less';

import Vue from 'vue';
import Vuex from 'vuex';
import store from '@src/js/store';
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
