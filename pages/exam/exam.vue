<template>
	<scroll-view>
		<view v-for="(item,index) in examList" style="display: flex;flex-direction: column;">
			<view style="display:flex;flex-direction:row;background-color: white;margin: 10px;">
				<view style="flex:1;display: flex;">
					<img src="/static/111.png" style="width:100%;height:auto;border-radius: 5px;"/>
				</view>
				<view style="flex:1;display:flex;flex-direction: column;gap:5px;padding: 10px;">
					<h3>{{item.name}}</h3>
					<view style="display: flex;gap: 5px;">
						<uni-tag :text="item.type" type="primary" size="small"/>
					</view>
					<view style="background-color: lightblue;" @click="toPractice(item.id)">
						<text>顺序练习</text><uni-icons type="redo-filled"></uni-icons>
					</view>
					<view style="background-color: lightblue;" @click="toKaoshi(item.id)">
						<text>模拟考试</text><uni-icons type="redo-filled"></uni-icons>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import ExamAPIService from '@/api/exam.service.js'

// 用户信息
let userInfo = ref({})

//测试列表
let examList = ref([{
	id:undefined,
	name:undefined,
	type:undefined,
	status:undefined,
	create_time:undefined
}])

// onMounted生命周期
onMounted(() => {
	//若已登录
	if (getApp().globalData.userId != undefined){
		userInfo.value = getApp().globalData.userInfo
		console.log(userInfo.value)
		
		//获取测试列表信息
		getExamList()
		
	}else{
		
		//获取测试列表信息
		getExamList()
		
		//若未登录
		uni.showToast({
			title: '请先登录',
			icon: "error",
			duration: 2000
		})
	}
})	


function getExamList(){
	let params = {page_num:1,page_size:10}
	ExamAPIService.getExamList(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			examList.value = res.data
		}
	})
}

//进行顺序练习
function toPractice(id){
	console.log(id)
	uni.navigateTo({
		url: '/pages/exam/practice/practiceInfo?examId='+id
	})
}

//进行模拟考试
function toKaoshi(id){
	console.log(id)
	uni.navigateTo({
		url: '/pages/exam/kaoshi/kaoshiInfo?examId='+id
	})
}

</script>

<style scoped>
	       
</style>
