<template>
	<div class="m-header">
		<i class="icon"></i>
		<span class="text">Chicken Music</span>
		<router-link to="/user" tag="div" class="user">
			<i class="icon-mine"></i>
		</router-link>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/mixin.styl'
	@import '~common/stylus/variable.styl'
	.m-header
		height: 44px
		text-align: center
		color: $color-theme
		font-size: 0
		.icon
			display: inline-block
			vertical-align: top
			margin-top: 6px
			margin-right: 9px
			width: 30px
			height: 32px
			bg-image('images/logo')
			background-size: 30px 32px 
		.text
			display: inline-block
			vertical-align: top
			line-height: 44px
			font-size: $font-size-large
		.user
			position: absolute
			top: 0
			right: 0
			.icon-mine
				display: block
				padding: 12px
				color: $color-theme
				font-size: 20px
</style>