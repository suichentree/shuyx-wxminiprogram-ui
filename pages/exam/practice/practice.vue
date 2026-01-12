<template>
	<view class="page-container">
		<!-- 顶部进度条 -->
		<view class="progress-bar">
			<view class="progress-info">
				<text class="progress-text">第 {{ page_no }} / {{ total_count }} 题</text>
			</view>
			<view class="progress-line">
				<view class="progress-fill" :style="{width: (page_no / total_count * 100) + '%'}"></view>
			</view>
		</view>
		
		<!-- 题目内容区域 -->
		<scroll-view class="content" scroll-y="true">
			<view class="question-item" v-if="currentQuestion">
				<view class="question-header">
					<uni-tag :text="page_no + ''" type="primary" size="mini" />
					<text class="question-type">{{ currentQuestion.type_name }}</text>
				</view>
				<view class="question-content">{{ currentQuestion.name }}</view>
				
				<!-- 选项列表 -->
				<view class="options-list">
					<view v-if="currentQuestion.type == 1">
						<!-- 单选 -->
						<uni-data-checkbox 
							mode="list" 
							:map="{text:'content',value:'id'}" 
							:localdata="currentOptions" 
							:value="user_options"
							:disabled="hasSubmitted"
							@change="(e) => { handleCheckboxChange(e) }"
						></uni-data-checkbox>
					</view>
					<view v-else-if="currentQuestion.type == 2">
						<!-- 多选 -->
						<uni-data-checkbox 
							mode="list" 
							:map="{text:'content',value:'id'}" 
							multiple
							:localdata="currentOptions" 
							:value="user_options"
							:disabled="hasSubmitted"
							@change="(e) => { handleCheckboxChange(e) }"
						></uni-data-checkbox>
					</view>
				</view>
				
				<!-- 答题结果提示 -->
				<view class="result-tip" v-if="hasSubmitted">
					<view :class="['tip-content', isCorrect ? 'tip-correct' : 'tip-error']">
						<uni-icons :type="isCorrect ? 'checkmarkempty' : 'closeempty'" :color="isCorrect ? '#67c23a' : '#f56c6c'" size="20"></uni-icons>
						<text>{{ isCorrect ? '回答正确' : '回答错误' }}</text>
					</view>
					<!-- 显示正确答案（如果答错） -->
					<view class="correct-answer-tip" v-if="!isCorrect && correctOptionIds.length > 0">
						<text class="answer-label">正确答案：</text>
						<text class="answer-value">{{ formatCorrectAnswer() }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<view>
			<button class="btn-prev" :disabled="page_no <= 1" @click="prevQuestion">上一题</button>
			<button class="btn-next" :disabled="page_no >= total_count" @click="nextQuestion">下一题</button>
		</view>
		
		<!-- 底部按钮区域 -->
		<view class="footer">
			<button style="flex: 1;" @click="openAnswerCard">答题卡</button>
			<button style="flex:3;" :disabled="hasSubmitted"
					@click="submitAnswer">提交答案</button>
		</view>
	</view>


	<!-- 答题卡弹窗 -->
	<uni-popup ref="answerCardPopup" type="bottom" :mask-click="true">
		<view class="answer-card">
			<view class="card-header">
			<text class="card-title">答题卡</text>
			</view>
			<view class="card-list">
			<view
				class="card-item"
				v-for="n in total_count"
				:key="n"
				@click="jumpToQuestion(n)"
				:class="{
				answered: isAnswered(n),
				right: isRight(n),
				wrong: isWrong(n),
				current: n === page_no
				}"
			>
				<text class="card-num">{{ n }}</text>
			</view>
			</view>
		</view>
	</uni-popup>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import practiceAPIService from '@/api/practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

//用户id
let userId = ref(getApp().globalData.userId)
userId.value = 999

// 用户测试记录
let user_exam_id = ref(null)
let page_no = ref(null)
let total_count = ref(0)
onLoad((obj) => {
	user_exam_id.value = obj.userExamId;
});

onMounted(()=>{
	getQuestion()
})




// 答题卡用的答题记录（按题号存）
let answerMap = ref({})  // { [pageNo]: { userOptions, isCorrect } }

// 打开答题卡
let answerCardPopup = ref(null)
function openAnswerCard() {
  answerCardPopup.value?.open()

  loadAnswerCard()
}
//获取答题卡信息
function loadAnswerCard() {
     practiceAPIService.getAnswerCardInfo({ user_exam_id: user_exam_id.value })
       .then(res => {
         if (res.code === 200) {
           total_count.value = res.data.total_count
           answerMap.value = res.data.answer_card.reduce((acc, item) => {
             acc[item.page_no] = {
               userOptions: item.user_options,
               isCorrect: item.is_correct
             }
             return acc
           }, {})
         }
       })
}


// 当前题目和选项
let currentQuestion = ref(null)
let currentOptions = ref([])
let user_options = ref(null) // 单选是数字，多选是数组
let hasSubmitted = ref(false) // 是否已提交当前题目
let isCorrect = ref(false) // 当前题目是否正确
let correctOptionIds = ref([]) // 正确答案选项ID列表

// 获取题目
function getQuestion(){
	// 重置状态
	user_options.value = null
	hasSubmitted.value = false
	isCorrect.value = false
	correctOptionIds.value = []
	
	let params = {user_exam_id:user_exam_id.value,page_no:page_no.value}
	practiceAPIService.getQuestion(params).then((res) => {
		console.log(res)
		if (res.code == 200) {
			page_no.value = res.data.page_no
			total_count.value = res.data.total_count
			currentQuestion.value = res.data.question
			currentOptions.value = res.data.options || []
			correctOptionIds.value = res.data.correct_option_ids || []
			
			//若有提交的用户选项数据，表示该题目已经提交了
			if(res.data.user_options != null){
				user_options.value = res.data.user_options
				isCorrect.value = res.data.is_correct
				hasSubmitted.value = true
			}
		}
	})
}

// 选项改变时
function handleCheckboxChange(e) {
	user_options.value = e.detail.value
}

// 提交答案
function submitAnswer() {
	if(!user_options.value || (Array.isArray(user_options.value) && user_options.value.length === 0)) {
		uni.showToast({
			title: '请先选择答案',
			icon: 'none'
		})
		return
	}
	
	let params = {
		user_exam_id: user_exam_id.value,
		question_id: currentQuestion.value.id,
		option_ids: user_options.value
	}
	
	practiceAPIService.submitAnswer(params).then((res) => {
		console.log(res)
		if(res.code == 200) {
			isCorrect.value = res.data.is_correct === 1
			hasSubmitted.value = true
			
			// 注意：page_no 前端自己控制，不依赖 res.data.page_no
			// 记录到答题卡
			answerMap.value[page_no.value] = {
				userOptions: user_options.value,
				isCorrect: isCorrect.value
			}
			
			// 如果已完成，延迟跳转到结果页
			if(res.data.finished) {
				uni.showToast({
					title: '练习完成！',
					icon: 'success',
					duration: 1500
				})
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/exam/practice/practiceResult?userExamId=' + user_exam_id.value
					})
				}, 1500)
			}
		} else {
			uni.showToast({
				title: '提交失败：' + res.message,
				icon: 'none'
			})
		}
	})
}

// 格式化正确答案显示
function formatCorrectAnswer() {
	if(correctOptionIds.value.length === 0) return '-'
	// 根据正确答案ID找到对应的选项内容
	let correctOptions = currentOptions.value.filter(opt => correctOptionIds.value.includes(opt.id))
	return correctOptions.map(opt => opt.content).join('、')
}

// 下一题
function nextQuestion() {
	// if(page_no.value >= total_count.value) {
	// 	// 已完成，跳转到结果页
	// 	uni.navigateTo({
	// 		url: '/pages/exam/practice/practiceResult?userExamId=' + user_exam_id.value
	// 	})
	// 	return
	// }
	page_no.value += 1
	getQuestion()
}

// 上一题（需要重新开始或记录历史，这里简化处理，提示用户）
function prevQuestion() {
    if(page_no.value > 1) {
        page_no.value -= 1
        getQuestion()
    }
}

// 答题卡跳转
function jumpToQuestion(n) {
  page_no.value = n
  answerCardPopup.value?.close()
  getQuestion()
}

// 答题卡状态判断
function isAnswered(n) {
  return !!answerMap.value[n]
}
function isRight(n) {
  return answerMap.value[n]?.isCorrect === true || answerMap.value[n]?.isCorrect === 1
}
function isWrong(n) {
  return answerMap.value[n]?.isCorrect === false || answerMap.value[n]?.isCorrect === 0
}

</script>
<style scoped>
.page-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
}

/* 进度条 */
.progress-bar {
	background-color: #fff;
	padding: 20rpx 30rpx;
}

.progress-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 15rpx;
}

.progress-text {
	font-size: 28rpx;
	color: #333;
}

.progress-line {
	height: 8rpx;
	background-color: #e4e7ed;
	border-radius: 4rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
	transition: width 0.3s;
}

/* 内容区域 */
.content {
	flex: 1;
	padding: 20rpx;
}

.question-item {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
}

.question-header {
	display: flex;
	align-items: center;
	gap: 15rpx;
	margin-bottom: 30rpx;
}

.question-type {
	font-size: 24rpx;
	color: #909399;
}

.question-content {
	font-size: 32rpx;
	color: #333;
	line-height: 1.8;
	margin-bottom: 40rpx;
}

.options-list {
	margin-bottom: 30rpx;
}

/* 答题结果提示 */
.result-tip {
	margin-top: 30rpx;
	padding: 20rpx;
	border-radius: 8rpx;
}

.tip-content {
	display: flex;
	align-items: center;
	gap: 10rpx;
	font-size: 28rpx;
	font-weight: 500;
}

.tip-correct {
	color: #67c23a;
	background-color: #f0f9ff;
}

.tip-error {
	color: #f56c6c;
	background-color: #fef0f0;
}

/* 正确答案提示 */
.correct-answer-tip {
	margin-top: 20rpx;
	padding: 20rpx;
	background-color: #f0f9ff;
	border-radius: 8rpx;
	font-size: 26rpx;
}

.answer-label {
	color: #606266;
	margin-right: 10rpx;
}

.answer-value {
	color: #67c23a;
	font-weight: 500;
}

/* 底部按钮 */
.footer {
	display: flex;
	gap: 20rpx;
	padding: 20rpx;
	background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}

.btn-prev, .btn-submit, .btn-next {
	flex: 1;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	font-size: 30rpx;
}

.btn-prev {
	background-color: #f0f0f0;
	color: #606266;
}

.btn-prev:disabled {
	opacity: 0.5;
}

.btn-submit {
	background-color: #409eff;
	color: #fff;
}

.btn-submit:disabled {
	opacity: 0.5;
}

.btn-next {
	background-color: #67c23a;
	color: #fff;
}

.btn-next:disabled {
	opacity: 0.5;
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
