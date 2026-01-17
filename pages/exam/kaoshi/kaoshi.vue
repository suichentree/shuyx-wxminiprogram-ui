<template>
	<view class="page-container">
		<scroll-view class="content" scroll-y="true">
			<!-- 题目项 - 优化卡片样式 -->
			<view class="content-item" v-for="(item,index) in question_option_List" :key="item.question.id" :id="index+1">
				<view class="question-header">
					<uni-tag :text="index+1+''" type="primary" size="mini" class="question-num-tag" />
					<view class="question-info">
						<text class="question-title">{{item.question.name}}</text>
						<text class="question-type">{{item.question.type_name}}</text>
					</view>
				</view>
				<!-- 单选/多选选项区域 -->
				<view class="options-container" v-if="item.question.type == 1">
					<uni-data-checkbox 
						mode="list" 
						:map="{text:'content',value:'id'}" 
						:localdata="item.options" 
						@change="(e)=>{ handleCheckboxChange(e,item.question.id,item.question.type) }"
						class="option-list"
					></uni-data-checkbox>
				</view>
				<view class="options-container" v-else-if="item.question.type == 2">
					<uni-data-checkbox 
						mode="list" 
						:map="{text:'content',value:'id'}" 
						multiple  
						:localdata="item.options" 
						@change="(e)=>{ handleCheckboxChange(e,item.question.id,item.question.type) }"
						class="option-list"
					></uni-data-checkbox>
				</view>
				<view class="options-container" v-else-if="item.question.type == 3">
					<uni-data-checkbox 
						mode="list" 
						:map="{text:'content',value:'id'}" 
						:localdata="item.options" 
						@change="(e)=>{ handleCheckboxChange(e,item.question.id,item.question.type) }"
						class="option-list"
					></uni-data-checkbox>
				</view>
			</view>
		</scroll-view>
	</view>
	
	<!-- 底部操作栏 - 美化按钮样式 -->
	<view class="footer">
		<button class="footer-btn answer-card-btn" @click="openAnswerCard">答题卡</button>
		<button class="footer-btn submit-btn" @click="toSubmit">交卷</button>
	</view>
	
	<!-- 答题卡弹窗 - 优化视觉和交互 -->
	<uni-popup ref="answerCardPopup" type="bottom" :mask-click="true" class="answer-card-popup">
		<scroll-view scroll-y="true" style="background-color: white;">
			<view class="answer-card">
				<view class="card-header">
				  <text class="card-title">答题卡</text>
				</view>
				<view class="card-list">
				  <view 
					class="card-item"
					v-for="(item,index) in question_option_List"
					:key="item.question.id"
					@click="jumpToQuestion(index + 1)"
					:class="{answered: isAnswerd(item.question.id) }"
				  >
					<text class="card-num">{{ index + 1 }}</text>
				  </view>
				</view>
			</view>
		</scroll-view>
	</uni-popup>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import KaoshiAPIService from '@/api/kaoshi.service.js'
import { onLoad } from "@dcloudio/uni-app";

//用户id
let userId = ref(getApp().globalData.userId)
userId.value = 999

// 用户测试记录
let userExamId = ref(null)
onLoad((obj) => {
	userExamId.value = obj.userExamId;
});

onMounted(()=>{
	//获取题目
	getQuestion(userExamId.value)
})
		
		
let question_option_List = ref([])
//获取题目列表信息和用户测试记录信息
function getQuestion(userExamId){
	//调用接口
	KaoshiAPIService.getQuestion({user_exam_id:userExamId}).then((res) => {
		console.log(res)
		if (res.code == 200) {
			//获取数据
			question_option_List.value = res.data.questions
			userExamId.value = res.data.user_exam_id
		}
	})
}

//用户题目选项键值对（键：question_id，值：选中的option_id，单选多选都是数组）
let userAnswerMap = ref({})
// 选项改变时,根据题目类型，处理选中的选项ID。
function handleCheckboxChange(e,question_id,question_type) {
	let select_array = new Array()
	if (question_type == 1 || question_type == 3) {
		//单选时。将选中的选项id，从整数类型转换为数组类型
		select_array.push(e.detail.value)
		userAnswerMap.value[question_id] = select_array
	}else{
		//多选时
		userAnswerMap.value[question_id] = e.detail.value
	}
}

//打开答题卡
let answerCardPopup = ref(null)
function openAnswerCard() {
  answerCardPopup.value?.open();
}

//答题卡跳转题目
const jumpToQuestion = (idx) => {
  var anchor = document.getElementById(idx);
  anchor.scrollIntoView({ behavior: 'smooth' }); // 增加平滑滚动
  //关闭
  answerCardPopup.value?.close()
};

//答题卡中题目是否已经作答
function isAnswerd(qid){
	const ans = userAnswerMap.value[qid]
	// 多选题：答案是数组，需判断长度 > 0
	if (Array.isArray(ans)) {
	return ans.length > 0
	}
	// 单选题：有非空值即可
	return ans !== undefined && ans !== null && ans !== ''
}

// 是否全部作答
function isAllAnswered() {
  return question_option_List.value.every(item => {
    const qid = item.question.id
    const ans = userAnswerMap.value[qid]
    // 多选题：答案是数组，需要判断长度
    if (Array.isArray(ans)) {
      return ans.length > 0
    }
    // 单选题：只要有值即可
    return ans !== undefined && ans !== null && ans !== ''
  })
}

//交卷
function toSubmit(){
	console.log("userAnswerMap.value",userAnswerMap.value);
	if (!isAllAnswered()) {
		uni.showToast({
		  title: '还有未作答的题目，请先完成所有题目',
		  icon: 'none',
		  duration: 2000
		})
		return
	}
	
	let params = {
		user_exam_id:userExamId.value,
		answer_map:userAnswerMap.value,
	}
	KaoshiAPIService.submitAnswerMap(params).then((res) => {
		console.log(res)
		if(res.code != 200){
			uni.showToast({
				title: '交卷失败,'+res.message,
				duration: 2000
			})
		}else{
			//跳转到考试结果展示页面
			uni.navigateTo({
				url: '/pages/exam/kaoshi/kaoshiResult?userExamId='+userExamId.value
			})
		}
	})
}
</script>

<style scoped>
/* 全局容器 - 优化背景和高度 */
.page-container {
	display: flex;
	flex-direction: column;
	height: 90vh;
	background-color: #f5f7fa; /* 柔和背景色，避免纯白刺眼 */
}

/* 滚动内容区 */
.content {
	flex: 1;
	overflow-y: auto;
	padding: 10rpx;
}

/* 题目项卡片 - 核心美化 */
.content-item {
	background-color: #ffffff;
	margin: 15rpx 10rpx;
	padding: 20rpx;
	border-radius: 12rpx; /* 圆角更柔和 */
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05); /* 轻微阴影提升层次感 */
	transition: all 0.2s ease; /* 过渡动效 */
}

.content-item:active {
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1); /* 点击时轻微加深阴影 */
}

/* 题目头部（序号+标题+类型） */
.question-header {
	display: flex;
	flex-direction: row;
	gap: 10rpx;
	align-items: flex-start;
	margin-bottom: 15rpx;
}

.question-num-tag {
	margin-top: 2rpx;
}

.question-info {
	flex: 1;
}

.question-title {
	font-size: 32rpx;
	color: #333333;
	line-height: 1.5;
}

.question-type {
	font-size: 24rpx;
	color: #909399;
	margin-top: 5rpx;
	display: block;
}

/* 选项容器 */
.options-container {
	padding-left: 10rpx;
}

.option-list {
	--uni-data-checkbox-font-size: 30rpx;
	--uni-data-checkbox-color: #606266;
	--uni-data-checkbox-active-color: #409eff;
}

/* 底部操作栏 */
.footer {
	display: flex;
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 99;
	height: 98rpx;
	border-top: 1rpx solid #ebeef5;
}

/* 底部按钮统一样式 */
.footer-btn {
	height: 70rpx;
	margin: 14rpx;
	border-radius: 35rpx; /* 圆角按钮 */
	font-size: 32rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

/* 答题卡按钮 */
.answer-card-btn {
	flex: 1;
	color: #333333;
	margin-right: 10rpx;
}

.answer-card-btn:active {
	background-color: #e5e6eb;
}

/* 交卷按钮 */
.submit-btn {
	flex: 3;
	background-color: #409eff;
	color: #ffffff;
	margin-left: 10rpx;
}

.submit-btn:active {
	background-color: #337ecc;
}

/* 答题卡弹窗 */
.answer-card-popup {
	--uni-popup-background: transparent;
}

.answer-card {
	background-color: #ffffff;
	border-radius: 20rpx 20rpx 0 0;
	padding: 30rpx;
	max-height: 80vh;
}

.card-header {
	display: flex;
	justify-content: center; /* 标题居中 */
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #ebeef5;
}

.card-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333333;
}

/* 答题卡题目列表 */
.card-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	justify-content: flex-start;
}

/* 答题卡题目项 */
.card-item {
	width: 80rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 8rpx;
	background-color: #f5f5f5;
	font-size: 32rpx;
	color: #333333;
	transition: all 0.2s ease;
}

/* 已作答状态 */
.card-item.answered {
	background-color: #e6f7ff;
	color: #1890ff;
}

/* 答题卡项点击/hover反馈 */
.card-item:active {
	transform: scale(0.95);
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}
</style>