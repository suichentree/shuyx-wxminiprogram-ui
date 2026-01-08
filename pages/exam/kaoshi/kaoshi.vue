<template>
	<view class="page-container">
		<scroll-view class="content" scroll-y="true">
			<view class="content-item" v-for="(item,index) in question_option_List" :key="item">
				<view :id="index+1" style="display: flex;flex-direction: row;gap: 5px;">
						<view><uni-tag :text="index+1+''" type="primary" size="mini" /></view>
						<view style="font-size: 14px;color: rgb(51, 51, 51);">
							<text>{{item.question.name}}</text>
							<view style="font-size: 12px;color:gray;">{{item.question.type_name}}</view>
						</view>
				</view>
				<view v-if="item.question.type == 1">
					<!-- 单选 -->
					<uni-data-checkbox mode="list" :map="{text:'content',value:'id'}" :localdata="item.options" @change="(e)=>{ handleCheckboxChange(e,item.question.id) }"></uni-data-checkbox>
				</view>
				<view v-else-if="item.question.type == 2">
					<!-- 多选 -->
					<uni-data-checkbox mode="list" :map="{text:'content',value:'id'}" multiple  :localdata="item.options" @change="(e)=>{ handleCheckboxChange(e,item.question.id) }"></uni-data-checkbox>
				</view>
			</view>
		</scroll-view>
	</view>
	<!-- 底部区域 -->
	<view class="footer">
		<button style="flex: 1;" @click="openAnswerCard">答题卡</button>
		<button style="flex:3;" @click="toSubmit">交卷</button>
	</view>
	
	<!-- 答题卡弹窗 -->
	<uni-popup ref="answerCardPopup" type="bottom" :mask-click="true">
	  <view class="answer-card">
		<view class="card-header">
		  <text class="card-title">答题卡</text>
		</view>
		<view class="card-list">
		  <view class="card-item"
			v-for="(item,index) in question_option_List"
			:key="item.question.id"
			@click="jumpToQuestion(index + 1)"
			:class="{answered: isAnswerd(item.question.id) }"
		  >
			<text class="card-num">{{ index + 1 }}</text>
		  </view>
		</view>
	  </view>
	</uni-popup>
	
</template>

<script setup>
import { onMounted, ref } from 'vue';
import KaoshiAPIService from '@/api/kaoshi.service.js'
import { onLoad } from "@dcloudio/uni-app";

//测试id
let examId = ref(undefined)

//获取上一个页面传递的参数
onLoad((option) => {
	examId.value = option.examId;
});

onMounted(()=>{
	start()
})
		

// 问题选项列表
let question_option_List = ref([])
//获取题目列表信息和用户测试记录信息
function start(){
	let params = {user_id:999,exam_id:examId.value}
	KaoshiAPIService.start(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			question_option_List.value = res.data
		}
	})
}

//用户题目选项键值对（键：question_id，值：选中的option_id，单选是数字，多选是数组）
//例如 {4: 17, 6: 25, 8: 32,11:[46,45]}
let userAnswerMap = ref({})
//选项改变时
function handleCheckboxChange(e,question_id){
	console.log(e.detail.value)
	console.log(question_id)
	//将已选的题目id-已选的选项ID,进行关联存储
	userAnswerMap.value[question_id] = e.detail.value
}

//打开答题卡
let type = ref("center")
let answerCardPopup = ref(null)
function openAnswerCard() {
  answerCardPopup.value?.open();
}

//答题卡跳转题目
let currentIndex = ref(0)
const jumpToQuestion = (idx) => {
  var anchor = document.getElementById(idx);
  anchor.scrollIntoView();
};

//答题卡中题目是否已经作答
function isAnswerd(qid){
	return userAnswerMap.value.hasOwnProperty(qid)
}

//交卷
function toSubmit(){
	console.log(userAnswerMap.value)
	let params = {exam_id:examId.value,answer_map:userAnswerMap.value}
	KaoshiAPIService.submitAnswerMap(params).then((res) => {
		console.log(res)
		
	})
}

</script>
<style scoped>
.page-container {
	display: flex;
	flex-direction: column;
	height: 90vh;
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
	
}
.answered {
  background-color: #e6f7ff;
  color: #1890ff;
}
</style>
  