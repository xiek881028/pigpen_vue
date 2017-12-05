/*!
 * _common
 * create: 2017/11/30
 * since: 0.0.1
 */
'use strict';

// Css
import '../css/_common.scss';

import components from './components';

new Vue({
	el:'#app',
	router: components,
});
