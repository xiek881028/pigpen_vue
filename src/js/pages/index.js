const home = resolve => require(['./home.vue'], resolve);
const home_cn = resolve => require(['./home_cn.vue'], resolve);

const Title = '八嘎猪';

const routes = [
	{path: '/', component: home, meta: {title: `首页 - ${Title}`}},
	{path: '/home_cn', component: home_cn, meta: {title: `首页中文版 - ${Title}`}},
];

const router = new VueRouter({
	routes,
});

router.beforeEach((to, from, next) => {
	//单页应用重置title(据说IOS的微信有bug，选择性无视)
	if(to.meta.title){
		document.title = to.meta.title;
	}
	next();
});

export default router;
