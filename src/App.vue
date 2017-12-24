<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<script>
export default {
	name: 'app'
}
</script>

<style lang="less">
@import (reference) url('../src/assets/css/public.less');
ul,li{
    margin: 0;
    padding: 0;
    list-style-type: none;
}
a{
	transition: all 0.4s;
	text-decoration: none;
	color: #0e6bd6;
}
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: @color-dark;
	.size(100%, 100%);
	position: absolute;
	top: 0;
	left: 0;
	overflow-x: hidden;
	overflow-y: auto;
}
#app .main{
	position: relative;
}
div{
	box-sizing: border-box;
}
div::-webkit-scrollbar{
	display: none;
}
</style>
