<template>
	<view class="page-container">
		<scroll-view class="content" scroll-y="true">
			<view class="content-item" v-for="(item,index) in question_option_List" :key="item">
				<view :id="index+1" style="display: flex;flex-direction: row;gap: 5px;">
						<view ><uni-tag :text="index+1" type="primary" size="mini" /></view>
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
		<!-- 占位区域，防止底部区域遮挡题目 -->
		<view style="height: 50px;"></view>
		<!-- 底部区域 -->
		<view class="footer">
			<button style="flex: 1;" @click="openAnswerCard">答题卡</button>
			<button style="flex:3;" @click="toSubmit">交卷</button>
		</view>
	</view>
	
	<!-- 答题卡弹窗 -->
	<uni-popup ref="answerCardPopup" type="bottom" :mask-click="true">
	  <view class="answer-card">
		<view class="card-header">
		  <text class="card-title">答题卡</text>
		</view>
		<view class="card-list">
		  <view class="card-item"
			:class="{ answered: question.selectedOptionId }"
			v-for="(question, idx) in question_option_List"
			:key="question.id"
			@click="jumpToQuestion(idx + 1)"
		  >
			<text class="card-num">{{ idx + 1 }}</text>
		  </view>
		</view>
	  </view>
	</uni-popup>
	
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


let type = ref("center")
let answerCardPopup = ref(null)
function openAnswerCard() {
  answerCardPopup.value?.open();
}

let currentIndex = ref(0)
const jumpToQuestion = (idx) => {
  var anchor = document.getElementById(idx);
  anchor.scrollIntoView();
};

</script>
<style scoped>
page-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
}

.content {
	flex: 1;
	overflow-y: auto;
}

.content-item {
	background-color: white;
	margin:10px;
	padding: 10px;
}

.footer {
	display: flex;
	background-color: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 99;
}

.answer-card {
  background-color: #fff;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
  max-height: 80vh;
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}
.card-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
}
.card-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}
.card-item {
	width: 80rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 8rpx;
	background-color: #f5f5f5;
	font-size: 32rpx;
	color: #333;
	&.answered {
	  background-color: #e6f7ff;
	  color: #1890ff;
	  border: 2rpx solid #1890ff;
	}
}
</style>
  