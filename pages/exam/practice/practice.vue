<template>
	<view class="page-container">
		<scroll-view class="content" scroll-y="true">
			<view style="" v-for="(item,index) in question_option_List" :key="item" class="content_item">
				<view style="display: flex;flex-direction: row;gap: 5px;">
						<view><uni-tag :text="index+1" type="primary" size="mini" /></view>
						<view style="font-size: 14px;color: rgb(51, 51, 51);">
							<text>{{item.question.name}}</text>
							<view style="font-size: 12px;color:gray;">{{item.question.type_name}}</view>
						</view>
				</view>
				<view v-if="item.question.type == 1">
					<!-- 单选题 -->
					<uni-data-checkbox mode="list" :map="{text:'content',value:'id'}" :localdata="item.options"  v-model="r1" ></uni-data-checkbox>
				</view>
				<view v-else-if="item.question.type == 2">
					<!-- 多选题 -->
					<uni-data-checkbox mode="list" :map="{text:'content',value:'id'}" multiple  :localdata="item.options" v-model="r2" @change="change"></uni-data-checkbox>
				</view>
			</view>
		</scroll-view>
		<view class="footer">
			<button class="footer-button" @click="toSubmit">固定按钮</button>
		</view>
	</view>
	
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ExamAPIService from '@/api/exam.service.js'
import { onLoad } from "@dcloudio/uni-app";

//测试id
let examId = ref(undefined)

//获取上一个页面传递的参数
onLoad((option) => {
	examId.value = option.examId;
});

onMounted(()=>{
	getQuestionList()
})
		

// 问题选项列表
let question_option_List = ref([
	{
		question:{},
		options:[]
	}
])

let r1 = {}
let r2 = []


function getQuestionList(){
	let params = {exam_id:examId.value}
	ExamAPIService.getQuestionList(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			question_option_List.value = res.data
		}
	})
}

function toSubmit(){
	console.log(r1.value)
	console.log(r2.value)
}

</script>
<style scoped>
page-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

content {
	flex: 1;
	overflow-y: auto;
}

content_item {
	background-color: white;
	padding:10px;
	margin: 10px;
}
	
footer {
	height: 60px;
	background-color: #f8f8f8;
	display: flex;
	justify-content: center;
	align-items: center;
}

footer-button {
	width: 100px;
	height: 40px;
	background-color: #007AFF;
	color: white;
	border-radius: 5px;
}   
</style>
  