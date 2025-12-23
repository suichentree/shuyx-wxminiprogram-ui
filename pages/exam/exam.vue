<template>
	<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
		@scrolltolower="lower" @scroll="scroll">
		<view style="display: flex;flex-direction: column;">
			<view style="display: flex;flex-direction: row;justify-content: start;align-items: center;background-color: white;margin: 10px;">
				<image src="/static/111.png" mode="aspectFill" style="height:100px;width:150px;border-radius: 5%;"></image>
				<view style="padding: 5px;color:black;font-weight: 1000;">
					<text>SSS 面试题</text>
				</view>
			</view>
			<view style="display: flex;flex-direction: row;justify-content: start;align-items: center;background-color: white;margin: 10px;">
					<image src="/static/111.png" mode="aspectFill" style="height:100px;width:150px;border-radius: 5%;"></image>
				<view>
					<text>自定义两侧插槽</text>
				</view>
			</view>
		</view>
	</scroll-view>
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

<style scoped>
	       
</style>
