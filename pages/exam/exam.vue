<template>
	<view>
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
			@scrolltolower="lower" @scroll="scroll">
			<uni-list>
				<uni-list-item>
					<template v-slot:header>
						<view class="slot-box">
							<image class="slot-image" src="/static/logo.png" mode="widthFix" style="width: 100px;"></image>
						</view>
					</template>
					<template v-slot:footer>
						<text class="slot-box slot-text">自定义两侧插槽</text>
					</template>
				</uni-list-item>
			</uni-list>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'

// 用户信息
let userInfo = ref({})
// onMounted生命周期
onMounted(() => {
	//若已登录
	if (getApp().globalData.userId != undefined){
		userInfo.value = getApp().globalData.userInfo
		console.log(userInfo.value)
	
	}
})	

let scrollTop = ref(0)

			
function upper(e){
	console.log(e)
}		
function lower(e){
	console.log(e)
}	
function scroll(e){
	console.log(e)
	this.old.scrollTop = e.detail.scrollTop
}	

</script>

<style>
	       
</style>
