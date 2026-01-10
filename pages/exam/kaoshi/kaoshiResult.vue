<template>
	<view class="page-container">
		<!-- 成绩卡片 -->
		<view class="score-card">
			<view class="score-circle">
				<view class="score-text">{{ (accuracy_rate || 0).toFixed(1) }}% 正确率</view>
			</view>
			<view class="score-rate">{{exam_name}}</view>
		</view>
		
		<!-- 统计数据 -->
		<view class="statistics">
			<view class="stat-item stat-correct">
				<view class="stat-number">{{ correct_count || 0 }}</view>
				<view class="stat-label">正确题数</view>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item stat-error">
				<view class="stat-number">{{ error_count || 0 }}</view>
				<view class="stat-label">错误题数</view>
			</view>
			<view class="stat-divider"></view>
			<view class="stat-item stat-total">
				<view class="stat-number">{{ total_count }}</view>
				<view class="stat-label">总题数</view>
			</view>
		</view>
		
		<scroll-view class="content" scroll-y="true">
			<!-- 题目列表 -->
			<view class="question-list" v-if="question_detail_list && question_detail_list.length > 0">
				<view class="section-title">答题详情</view>
				<view class="question-item" v-for="(item, index) in question_detail_list" :key="item.question_id">
					<view class="question-header">
						<uni-tag :text="index + 1 + ''" :type="getQuestionTagType(item)" size="mini" />
						<text class="question-type">{{ item.type_name }}</text>
						<uni-tag :text="item.is_correct ? '正确' : '错误'" :type="item.is_correct ? 'success' : 'error'" size="mini" />
					</view>
					<view class="question-content">{{ item.question_name }}</view>
					<view class="answer-info">
						<view class="answer-row">
							<text class="answer-label">您的答案：</text>
							<text :class="['answer-value', item.is_correct ? 'correct' : 'error']">{{ formatUserAnswer(item) }}</text>
						</view>
						<view class="answer-row" v-if="!item.is_correct">
							<text class="answer-label">正确答案：</text>
							<text class="answer-value correct">{{ formatCorrectAnswer(item) }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<button class="btn-secondary" @click="goBack">返回</button>
			<button class="btn-primary" @click="reviewAnswers">查看解析</button>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import KaoshiAPIService from '@/api/kaoshi.service.js'
import { onLoad } from "@dcloudio/uni-app";

//用户id
let userId = ref(getApp().globalData.userId)
userId.value = 999

//测试id
let userExamId = ref(null)
onLoad((option) => {
	userExamId.value = option.userExamId;
	userExamId.value = 101
});

onMounted(()=>{
	kaoshiResult()
})

//获取考试结果
let exam_name = ref(null)
let correct_count = ref(0)
let error_count = ref(0)
let total_count = ref(0)
let accuracy_rate = ref(0)
let question_detail_list = ref([]) // 题目详情列表

function kaoshiResult(){
	let params = {user_id:userId.value,user_exam_id:userExamId.value}
	KaoshiAPIService.kaoshiResult(params).then((res) => {
		console.log(res)
		if(res.code == 200){
			exam_name.value = res.data.exam_name
			correct_count.value = res.data.correct_count || 0
			error_count.value = res.data.error_count || 0
			total_count.value = res.data.total_count || 0
			accuracy_rate.value = res.data.accuracy_rate || 0
			// 如果API返回题目列表
			if(res.data.question_detail_list) {
				question_detail_list.value = res.data.question_detail_list
			}
		}
	})
}

// 获取题目标签类型
function getQuestionTagType(item) {
	return item.is_correct ? 'success' : 'error'
}

// 格式化用户答案
function formatUserAnswer(item) {
	if(!item.user_answer) return '未作答'
	if(Array.isArray(item.user_answer)) {
		return item.user_answer.join('、')
	}
	return item.user_answer
}

// 格式化正确答案
function formatCorrectAnswer(item) {
	if(!item.correct_answer) return '-'
	if(Array.isArray(item.correct_answer)) {
		return item.correct_answer.join('、')
	}
	return item.correct_answer
}

// 回到考试列表页面
function goBack() {
	uni.switchTab({
		url: '/pages/exam/exam'
	})
}

// 查看解析（跳转到解析页面或展开解析）
function reviewAnswers() {
	uni.showToast({
		title: '解析功能开发中',
		icon: 'none'
	})
	// 可以跳转到解析页面或展开解析内容
	// uni.navigateTo({
	//   url: '/pages/exam/kaoshi/kaoshiReview?userExamId=' + userExamId.value
	// })
}
</script>
<style scoped>
.page-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f5f5;
}

.content {
	flex: 1;
	padding-bottom: 80rpx;
}

/* 成绩卡片 */
.score-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 60rpx 40rpx;
	text-align: center;
	color: #fff;
}

.score-circle {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
}

.score-text {
	font-size: 50rpx;
	font-weight: bold;
	line-height: 1;
}

.score-rate {
	font-size: 28rpx;
	opacity: 0.9;
}

/* 统计数据 */
.statistics {
	display: flex;
	background-color: #fff;
	margin: 20rpx;
	border-radius: 16rpx;
	padding: 40rpx 0;
	align-items: center;
	justify-content: space-around;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.stat-item {
	flex: 1;
	text-align: center;
}

.stat-number {
	font-size: 48rpx;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.stat-item.stat-correct .stat-number {
	color: #67c23a;
}

.stat-item.stat-error .stat-number {
	color: #f56c6c;
}

.stat-item.stat-total .stat-number {
	color: #409eff;
}

.stat-label {
	font-size: 24rpx;
	color: #909399;
}

.stat-divider {
	width: 2rpx;
	height: 60rpx;
	background-color: #e4e7ed;
}

/* 题目列表 */
.question-list {
	margin: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	padding: 0 10rpx;
}

.question-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.question-header {
	display: flex;
	align-items: center;
	gap: 15rpx;
	margin-bottom: 20rpx;
}

.question-type {
	font-size: 24rpx;
	color: #909399;
	flex: 1;
}

.question-content {
	font-size: 30rpx;
	color: #333;
	line-height: 1.6;
	margin-bottom: 20rpx;
}

.answer-info {
	background-color: #f8f9fa;
	border-radius: 8rpx;
	padding: 20rpx;
}

.answer-row {
	display: flex;
	margin-bottom: 10rpx;
	font-size: 26rpx;
}

.answer-row:last-child {
	margin-bottom: 0;
}

.answer-label {
	color: #606266;
	margin-right: 10rpx;
}

.answer-value {
	flex: 1;
}

.answer-value.correct {
	color: #67c23a;
	font-weight: 500;
}

.answer-value.error {
	color: #f56c6c;
	font-weight: 500;
}

/* 底部按钮 */
.footer {
	display: flex;
	gap: 20rpx;
	padding: 20rpx;
	background-color: #fff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}

.btn-primary, .btn-secondary {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	font-size: 30rpx;
}

.btn-primary {
	background-color: #409eff;
	color: #fff;
}

.btn-secondary {
	background-color: #f0f0f0;
	color: #606266;
}
</style>
