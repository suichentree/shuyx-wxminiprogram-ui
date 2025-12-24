<template>
	<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
		@scrolltolower="lower" @scroll="scroll">
		<view style="display: flex;flex-direction: column;">
			<view style="display:flex;flex-direction:row;background-color: white;margin: 10px;">
				<view style="flex:1;display: flex;">
					<img src="/static/111.png" alt="" style="width:100%;height:auto;border-radius: 8px;"/>
				</view>
				<view style="flex:1;display:flex;flex-direction: column;gap:10px;padding: 5px;" @click="toExam(1)">
					<h3>SSS 面试题</h3>
					<view style="display: flex;gap: 10px;">
						<uni-tag text="面试" type="primary" size="small"/>
						<uni-tag text="测试" type="primary" size="small"/>
					</view>
					<view style="background-color: lightblue;">
						<text>开始练习</text><uni-icons type="redo-filled"></uni-icons>
					</view>
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

function toExam(id){
	console.log(id)
	uni.navigateTo({
		url: '/pages/exam/aq/aq?examId='+id
	})
}

</script>

<style scoped>
	       
</style>
