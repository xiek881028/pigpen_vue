/*!
* layout
* create: 2017-12-06
* since: 0.0.1
*/

<template lang="pug">
	.rootBox
		slot
</template>

<script>
module.exports = {
}
</script>

<style lang="scss" scoped>
.rootBox{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 2;
	overflow-y: auto;
	background-color: #383e4a;
}
</style>
