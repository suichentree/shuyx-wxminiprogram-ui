<template>
	<view class="page-container">
		<scroll-view class="content" scroll-y="true">
			<!-- 题目项 -->
			<view class="content-item" v-for="(item, index) in questionList" :key="item.question.id" :id="index+1">
				<view class="question-header">
					<uni-tag :text="index+1+''" type="primary" size="mini" class="question-num-tag" />
					<view class="question-info">
						<text class="question-title">{{ item.question.name }}</text>
						<text class="question-type">{{ item.question.type_name }}</text>
						<!-- 展示用户作答统计 -->
						<view class="question-stat">
							<text class="stat-item">做对：{{ item.correct_count || 0 }}次</text>
							<text class="stat-item">做错：{{ item.error_count || 0 }}次</text>
							<text class="stat-item">总做：{{ item.total_count || 0 }}次</text>
						</view>
					</view>
					<!-- 题目作答结果提示 -->
					<uni-tag 
						v-if="questionResultMap[item.question.id] !== undefined"
						:type="questionResultMap[item.question.id] ? 'success' : 'error'"
						size="mini"
					>
						{{ questionResultMap[item.question.id] ? '回答正确' : '回答错误' }}
					</uni-tag>
				</view>
				
				<!-- 选项区域 - 根据题型展示不同样式 -->
				<view class="options-container">
					<uni-data-checkbox 
						mode="list" 
						:map="{text:'content',value:'id'}" 
						:localdata="item.options" 
						:multiple="item.question.type === 2"
						@change="(e)=>{ handleOptionChange(e, item) }"
						class="option-list"
						:selected="userAnswerMap[item.question.id] || []"
						:disabled="questionResultMap[item.question.id] !== undefined"
					>
						<template v-slot:option="{ option }">
							<view class="option-item" :class="getOptionClass(option, item.question.id)">
								<text class="option-text">{{ option.content }}</text>
								<!-- 选项对错标识 -->
								<uni-icon 
									v-if="questionResultMap[item.question.id] !== undefined"
									:type="option.is_right ? 'checkmarkempty' : (isUserSelected(option.id, item.question.id) ? 'closeempty' : '')"
									:color="option.is_right ? '#00b42a' : '#f53f3f'"
									class="option-icon"
									v-show="option.is_right || isUserSelected(option.id, item.question.id)"
								></uni-icon>
							</view>
						</template>
					</uni-data-checkbox>
				</view>
				
				<!-- 答题结果和正确答案显示区域 -->
				<view v-if="questionResultMap[item.question.id] !== undefined" class="answer-result">
					<view class="result-message" :class="questionResultMap[item.question.id] ? 'result-correct' : 'result-incorrect'">
						{{ questionResultMap[item.question.id] ? '恭喜，回答正确！' : '很遗憾，回答错误！' }}
					</view>
					
					<!-- 显示正确答案 -->
					<view class="correct-answer">
						<text class="answer-label">正确答案：</text>
						<text class="answer-content">
							{{ getCorrectAnswersText(item.options) }}
						</text>
					</view>
				</view>
			</view>
		</scroll-view>
	
	<!-- 底部操作栏 -->
	<view class="footer">
		<button class="footer-btn answer-card-btn" @click="openAnswerCard">答题卡</button>
	</view>
	
	<!-- 答题卡弹窗 -->
	<uni-popup ref="answerCardPopup" type="bottom" :mask-click="true" class="answer-card-popup">
		<scroll-view scroll-y="true" style="background-color: white;">
			<view class="answer-card">
				<view class="card-header">
				  <text class="card-title">答题卡</text>
				</view>
				<view class="card-list">
				  <view 
					class="card-item"
					v-for="(item, index) in questionList"
					:key="item.question.id"
					@click="jumpToQuestion(index + 1)"
					:class="{
						answered: isAnswered(item.question.id),
						correct: questionResultMap[item.question.id] === true,
						incorrect: questionResultMap[item.question.id] === false
					}"
				  >
					<text class="card-num">{{ index + 1 }}</text>
					<!-- 答题卡对错标识 -->
					<uni-icon 
						v-if="questionResultMap[item.question.id] !== undefined"
						:type="questionResultMap[item.question.id] ? 'checkmarkempty' : 'closeempty'"
						:color="questionResultMap[item.question.id] ? '#00b42a' : '#f53f3f'"
						class="card-icon"
					></uni-icon>
				  </view>
				</view>
			</view>
		</scroll-view>
	</uni-popup>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ErrorPracticeAPIService from '@/api/error_practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

// 用户ID和测试ID
let userId = ref(getApp().globalData.userId || 999)
let examId = ref(null)

onLoad((obj) => {
	examId.value = obj.examId;
	if (!examId.value) {
		uni.showToast({
			title: '缺少考试ID',
			icon: 'error'
		});
	}
});

onMounted(()=>{
	// 获取题目列表
	getQuestionList(examId.value)
})

// 题目列表数据
let questionList = ref([])
// 用户作答映射（键：question_id，值：选中的option_id数组）
let userAnswerMap = ref({})
// 题目作答结果映射（键：question_id，值：true(对)/false(错)/undefined(未作答)）
let questionResultMap = ref({})

// 获取题目列表信息
function getQuestionList(examId) {
	ErrorPracticeAPIService.getQuestion({ exam_id: examId }).then((res) => {
		console.log('题目数据:', res)
		if (res.code === 200) {
			questionList.value = res.data.questions || []
			// 初始化结果映射
			res.data.questions.forEach(item => {
				questionResultMap.value[item.question.id] = undefined
			})
		} else {
			uni.showToast({
				title: res.msg || '获取题目失败',
				icon: 'none'
			});
		}
	}).catch(err => {
		console.error('获取题目失败:', err)
		uni.showToast({
			title: '网络错误，获取题目失败',
			icon: 'none'
		});
	})
}

// 处理选项变更
function handleOptionChange(e, questionItem) {
	const questionId = questionItem.question.id
	const questionType = questionItem.question.type
	let selectedValues = []
	
	// 处理单选/多选值
	if (questionType === 1 || questionType === 3) {
		// 单选
		selectedValues = [e.detail.value]
	} else {
		// 多选
		selectedValues = e.detail.value
	}
	
	// 保存用户答案
	userAnswerMap.value[questionId] = selectedValues
	
	// 判断答案正确性
	judgeAnswer(questionItem, selectedValues)
}

// 判断答案正确性
function judgeAnswer(questionItem, selectedValues) {
	const questionId = questionItem.question.id
	const options = questionItem.options || []
	const questionType = questionItem.question.type
	
	// 获取正确选项ID
	const correctOptionIds = options.filter(option => option.is_right).map(option => option.id.toString())
	
	// 转换用户选项为字符串
	const userOptionIds = selectedValues.map(id => id.toString())
	
	let isCorrect = false
	
	if (questionType === 1 || questionType === 3) {
		// 单选：判断是否选中了唯一正确选项
		isCorrect = userOptionIds.length === 1 && correctOptionIds.includes(userOptionIds[0])
	} else if (questionType === 2) {
		// 多选：判断选项完全匹配
		if (userOptionIds.length === correctOptionIds.length) {
			isCorrect = userOptionIds.every(id => correctOptionIds.includes(id))
		}
	}
	
	// 记录结果
	questionResultMap.value[questionId] = isCorrect
}

// 判断选项是否被用户选中
function isUserSelected(optionId, questionId) {
	const userAnswers = userAnswerMap.value[questionId] || []
	return userAnswers.some(id => id.toString() === optionId.toString())
}

// 获取选项样式
function getOptionClass(option, questionId) {
	const result = questionResultMap.value[questionId]
	if (result === undefined) return ''
	
	// 正确选项
	if (option.is_right) {
		return 'option-correct'
	}
	
	// 用户选中的错误选项
	if (isUserSelected(option.id, questionId)) {
		return 'option-incorrect'
	}
	
	return ''
}

// 获取正确答案文本
function getCorrectAnswersText(options) {
	const correctOptions = options.filter(option => option.is_right)
	return correctOptions.map(option => option.content).join('；')
}

// 答题卡相关方法
let answerCardPopup = ref(null)

function openAnswerCard() {
	answerCardPopup.value?.open();
}

function jumpToQuestion(idx) {
	// 兼容H5和小程序的滚动方式
	uni.createSelectorQuery().select(`#${idx}`).boundingClientRect(data => {
		uni.pageScrollTo({
			scrollTop: data.top + uni.pageScrollGetScrollTop() - 20,
			duration: 300
		});
	}).exec();
	answerCardPopup.value?.close()
}

// 判断题目是否已作答
function isAnswered(qid) {
	const ans = userAnswerMap.value[qid]
	return Array.isArray(ans) && ans.length > 0
}

</script>

<style scoped>
/* 保持原有样式不变 */
.page-container {
	display: flex;
	flex-direction: column;
	height: 90vh;
	background-color: #f5f7fa;
}

.content {
	flex: 1;
	overflow-y: auto;
	padding: 10rpx;
}

.content-item {
	background-color: #ffffff;
	margin: 15rpx 10rpx;
	padding: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
	transition: all 0.2s ease;
}

.content-item:active {
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.question-header {
	display: flex;
	flex-direction: row;
	gap: 10rpx;
	align-items: flex-start;
	margin-bottom: 15rpx;
	flex-wrap: wrap;
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

.question-stat {
	display: flex;
	gap: 15rpx;
	margin-top: 8rpx;
}

.stat-item {
	font-size: 22rpx;
	color: #666;
}

.options-container {
	padding-left: 10rpx;
}

.option-list {
	--uni-data-checkbox-font-size: 30rpx;
	--uni-data-checkbox-color: #606266;
	--uni-data-checkbox-active-color: #409eff;
}

.option-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;
}

.option-text {
	flex: 1;
}

.option-icon {
	font-size: 28rpx;
	margin-left: 10rpx;
}

.option-correct {
	color: #00b42a;
	background-color: #f0f9ff;
	padding: 10rpx;
	border-radius: 8rpx;
}

.option-incorrect {
	color: #f53f3f;
	background-color: #fff2f3;
	padding: 10rpx;
	border-radius: 8rpx;
}

/* 答题结果样式 */
.answer-result {
	margin-top: 20rpx;
	padding: 15rpx;
	border-radius: 8rpx;
	background-color: #f5f7fa;
	animation: fadeIn 0.3s ease-in-out;
}

.result-message {
	font-size: 28rpx;
	font-weight: 500;
	margin-bottom: 10rpx;
}

.result-correct {
	color: #00b42a;
}

.result-incorrect {
	color: #f53f3f;
}

.correct-answer {
	font-size: 26rpx;
}

.answer-label {
	color: #606266;
	font-weight: 500;
}

.answer-content {
	color: #303133;
}

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

.footer-btn {
	height: 70rpx;
	margin: 14rpx;
	border-radius: 35rpx;
	font-size: 32rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.answer-card-btn {
	flex: 1;
	color: #333333;
	margin-right: 10rpx;
}

.answer-card-btn:active {
	background-color: #e5e6eb;
}

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
	justify-content: center;
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

.card-list {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
	justify-content: flex-start;
}

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
	position: relative;
}

.card-item.answered {
	background-color: #e6f7ff;
	color: #1890ff;
}

.card-item.correct {
	background-color: #e8ffeb;
	color: #00b42a;
}

.card-item.incorrect {
	background-color: #fff2f3;
	color: #f53f3f;
}

.card-icon {
	position: absolute;
	bottom: 5rpx;
	right: 5rpx;
	font-size: 20rpx;
}

.card-item:active {
	transform: scale(0.95);
	box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

/* 动画 */	
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10rpx);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>