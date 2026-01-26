<template>
	<view class="page-container">
		<!-- 成绩卡片 -->
		<view class="score-card">
			<view class="score-circle">
				<view class="score-text">{{ (accuracy_rate || 0).toFixed(1) }}% 正确率</view>
			</view>
			<view class="score-rate">{{ exam_name }}</view>
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
				<view class="stat-number">{{ total_count - (error_count + correct_count) || 0 }}</view>
				<view class="stat-label">未答题数</view>
			</view>
		</view>
		
		<scroll-view class="content" scroll-y="true">
			<!-- 题目列表 -->
			<view class="question-list" v-if="question_detail_list && question_detail_list.length > 0">
				<view class="section-title">答题详情</view>
				<view class="question-item" v-for="(item, index) in question_detail_list" :key="item.question_id">
					<view class="question-header">
						<uni-tag :text="index + 1 + ''" :type="getQuestionTagType(item)" size="mini" />
						<text class="question-type">{{ item.question_type_name }}</text>
						<!-- 优化：区分未答/正确/错误状态 -->
						<uni-tag 
							:text="getAnswerStatusText(item.is_correct)" 
							:type="getQuestionTagType(item)" 
							size="mini" 
						/>
					</view>
					<view class="question-content">{{ item.question_name }}</view>
					<view class="answer-info">
						<view class="answer-row">
							<text class="answer-label">您的答案：</text>
							<!-- 优化：未答状态单独样式 -->
							<text 
								:class="[
									'answer-value', 
									item.is_correct === 1 ? 'correct' : (item.is_correct === -1 ? 'unanswered' : 'error')
								]"
							>{{ formatUserAnswer(item) }}</text>
						</view>
						<!-- 未答/错误时显示正确答案 -->
						<view class="answer-row" v-if="item.is_correct !== 1">
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
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import spAPIService from '@/api/sequence_practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

//用户id
let userId = ref(getApp().globalData.userId)

//测试id
let userExamId = ref(null)
onLoad((option) => {
	userExamId.value = option.userExamId;
});

onMounted(()=>{
	practiceResult()
})

//获取练习结果
let exam_name = ref(null)
let correct_count = ref(0)
let error_count = ref(0)
let total_count = ref(0)
let accuracy_rate = ref(0)
let question_detail_list = ref([]) // 题目详情列表

function practiceResult(){
	let params = {user_id:userId.value,user_exam_id:userExamId.value}
	spAPIService.practiceResult(params).then((res) => {
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

// 优化：获取题目标签类型（区分未答/正确/错误）
function getQuestionTagType(item) {
	if (item.is_correct === 1) return 'success' // 正确-绿色
	if (item.is_correct === -1) return 'warning' // 未答-黄色
	return 'error' // 错误-红色
}

// 优化：获取答题状态文本
function getAnswerStatusText(isCorrect) {
	if (isCorrect === 1) return '正确'
	if (isCorrect === -1) return '未答'
	return '错误'
}

// 格式化用户答案
function formatUserAnswer(item) {
	if(!item.user_answer || (Array.isArray(item.user_answer) && item.user_answer.length === 0)) {
		return '未作答'
	}
	if(Array.isArray(item.user_answer)) {
		return item.user_answer.join('、')
	}
	return item.user_answer
}

// 格式化正确答案
function formatCorrectAnswer(item) {
	if(!item.correct_answer || (Array.isArray(item.correct_answer) && item.correct_answer.length === 0)) {
		return '-'
	}
	if(Array.isArray(item.correct_answer)) {
		return item.correct_answer.join('、')
	}
	return item.correct_answer
}

// 返回
function goBack() {
	uni.navigateBack()
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

/* 正确样式 */
.answer-value.correct {
	color: #67c23a;
	font-weight: 500;
}

/* 错误样式 */
.answer-value.error {
	color: #f56c6c;
	font-weight: 500;
}

/* 优化：新增未答样式 */
.answer-value.unanswered {
	color: #e6a23c;
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

/* 兼容uni-tag的warning样式（未答标签） */
:deep(.uni-tag--warning) {
	background-color: #fdf6ec;
	color: #e6a23c;
	border-color: #fbbf24;
}
</style>