/*!
* home
* create: 2017-12-05
* since: 0.0.1
*/

<template lang="pug">
	div(is="layout")
		h1 hello world!
		router-link(to="/home_cn") 点我去中文版
		i by bagazhu
</template>

<script>
import layout from './components/layout.vue';
export default{
	components: {
		layout,
	},
}
</script>

<style lang="less" scoped>
h1{
	color: #0ff;
}
</style>
