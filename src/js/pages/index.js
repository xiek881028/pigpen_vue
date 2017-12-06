import home from './home.vue';
import home_cn from './home_cn.vue';

const routes = [
	{path: '/', component: home},
	{path: '/home_cn', component: home_cn},
];

const router = new VueRouter({
	routes,
});

export default router;
