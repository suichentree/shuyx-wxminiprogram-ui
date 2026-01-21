<template>
	<view class="page-container">
		<!-- 顶部进度条 -->
		<view class="progress-bar">
			<view class="progress-info">
				<text class="progress-text">第 {{ page_no + 1 }} / {{ total_count }} 题</text>
			</view>
			<view class="progress-line">
				<view class="progress-fill" :style="{width: ( (page_no+1) / total_count * 100) + '%'}"></view>
			</view>
		</view>
		
		<!-- 题目内容区域 -->
		<view class="question-item" v-if="currentQuestion">
			<view class="question-header">
				<uni-tag :text="page_no + 1 + ''" type="primary" size="mini" />
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
						:value="selected_option_ids"
						:disabled="hasSubmitted"
						@change="(e)=>{ handleCheckboxChange(e,currentQuestion.type) }"
					></uni-data-checkbox>
				</view>
				<view v-else-if="currentQuestion.type == 2">
					<!-- 多选 -->
					<uni-data-checkbox 
						mode="list" 
						:map="{text:'content',value:'id'}" 
						multiple
						:localdata="currentOptions" 
						:value="selected_option_ids"
						:disabled="hasSubmitted"
						@change="(e)=>{ handleCheckboxChange(e,currentQuestion.type) }"
					></uni-data-checkbox>
				</view>
				<view v-else-if="currentQuestion.type == 3">
					<!-- 判断题 -->
					<uni-data-checkbox 
						mode="list" 
						:map="{text:'content',value:'id'}" 
						:localdata="currentOptions" 
						:value="selected_option_ids"
						:disabled="hasSubmitted"
						@change="(e)=>{ handleCheckboxChange(e,currentQuestion.type) }"
					></uni-data-checkbox>
				</view>
			</view>
			
			<!-- 若已答题，则显示答题结果 -->
			<view class="result-tip" v-if="hasSubmitted">
				<!-- 判断是否答对 -->
				<view :class="['tip-content', isCorrect ? 'tip-correct' : 'tip-error']">
					<uni-icons :type="isCorrect ? 'checkmarkempty' : 'closeempty'" :color="isCorrect ? '#67c23a' : '#f56c6c'" size="20"></uni-icons>
					<text>{{ isCorrect ? '回答正确' : '回答错误' }}</text>
				</view>
				<!--显示正确答案 -->
				<view class="correct-answer-tip">
					<text class="answer-label">正确答案: \n</text>
					<text class="answer-value">{{ formatCorrectAnswer() }}</text>
				</view>
			</view>
		</view>
		
		<!-- 上下题按钮 -->
		<view class="page-nav">
			<button class="nav-btn prev-btn" :disabled="page_no <= 0" @click="prevQuestion">
				<text>上一题</text>
			</button>
			<button class="nav-btn next-btn" :disabled="page_no >= total_count-1" @click="nextQuestion">
				<text>下一题</text>
			</button>
		</view>
		
		<!-- 底部按钮区域 -->
		<view class="footer">
			<button style="flex:1;" @click="openAnswerCard">答题卡</button>
			<button style="flex:3;" v-if="isFinished"  @click="toResult">分析结果</button>
			<button style="flex:3;" type="primary" v-else :disabled="hasSubmitted" @click="submitAnswer">提交答案</button>
		</view>
	</view>

	<!-- 答题卡弹窗 -->
	<uni-popup ref="answerCardPopup" type="bottom" :mask-click="true">
		<scroll-view scroll-y="true" style="background-color: white;">
			<view class="answer-card">
					<view class="card-header">
						<text class="card-title">答题卡</text>
					</view>
					<view class="card-list">
						<view class="card-item" v-for="(item,index) in answerMap" :key="index"
							@click="jumpToQuestion(item.qid)" 
							:class="{right_css: isRight(item),wrong_css: isWrong(item) }">
							<text class="card-num">{{ index + 1 }}</text>
						</view>
					</view>
			</view>
		</scroll-view>
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
let userExamId = ref(null)
onLoad((obj) => {
	userExamId.value = obj.userExamId;
	if (!userExamId.value) {
		uni.showToast({
			title: '缺少用户测试ID',
			icon: 'error'
		});
	}
});

onMounted(()=>{
	getQuestion(userExamId.value)
})

// 当前题目id
let currentQuestionId = ref(null)
// 当前题目对象
let currentQuestion = ref(null)
//当前选项数组
let currentOptions = ref([])
// 全部题目id数组
let quesionIds = ref([])
// 题目进度索引
let page_no = ref(null)
// 题目总数
let total_count = ref(0)
let selected_option_ids = ref(undefined) //用户答题选项，单选多选都是数组
let hasSubmitted = ref(false) //该题目是否已答题
let isCorrect = ref(false) 	// 判断当前题目是否正确
let isFinished = ref(false)  //判断当前测试中所有题目是否全部已答


// 获取题目
function getQuestion(userExamId,questionId){
	// 重置状态
	currentQuestionId.value = null
	currentQuestion.value = null
	currentOptions.value = []
	quesionIds.value = []
	selected_option_ids.value = null
	hasSubmitted.value = false
	isCorrect.value = false
	
	let params = {user_exam_id:userExamId,question_id:questionId}
	practiceAPIService.getQuestion(params).then((res) => {
		if (res.code == 200) {
			currentQuestionId.value = res.data.question_id
			currentQuestion.value = res.data.question_options.question
			currentOptions.value = res.data.question_options.options
			quesionIds.value = res.data.question_ids
			
			isFinished.value = res.data.is_finished
			
			//查找当前题目在列表中的索引(从0开始)
			page_no.value = quesionIds.value.indexOf(currentQuestionId.value);
			total_count.value = quesionIds.value.length
			
			//若有提交的用户选项数据，表示该题目已答
			if(res.data.selected_option_ids != null){
				//设置该题目已提交
				hasSubmitted.value = true
				//获取用户选项
				selected_option_ids.value = res.data.selected_option_ids
				//获取是否答对
				isCorrect.value = res.data.is_correct
			}else{
				hasSubmitted.value = false
				//若是单选题，判断题，则初始化为null,多选题则初始化为[]
				if(currentQuestion.value.type == 1){
					selected_option_ids.value = null
				}else if (currentQuestion.value.type == 2){
					selected_option_ids.value = []
				}else if (currentQuestion.value.type == 3){
					selected_option_ids.value = null
				}
			}
		}
	})
}

// 提交答案
function submitAnswer() {
	if(!selected_option_ids.value || selected_option_ids.value.length === 0) {
		uni.showToast({
			title: '请先选择答案',
			icon: 'none'
		})
	}else{
		// 本地判断答案是否正确
		let isAnswerCorrect = checkAnswerCorrectness()
		
		// 更新本地状态
		hasSubmitted.value = true
		isCorrect.value = isAnswerCorrect
		
		//构建参数
		let params = {
			user_exam_id: userExamId.value,
			question_id: currentQuestionId.value,
			question_type:currentQuestion.value.type,
			option_ids: selected_option_ids.value
		}
		practiceAPIService.submitAnswer(params).then((res) => {
			console.log(res)
			if(res.code != 200) {
				uni.showToast({
					title: '提交失败：' + res.message,
					icon: 'none'
				})
			}
		})
	}
}

// 选项改变时,根据题目类型，处理选中的选项ID。
function handleCheckboxChange(e,question_type) {
	let select_array = new Array()
	if (question_type == 1 || question_type == 3) {
		//单选题，判断题时。将选中的选项id，转换为数组
		select_array.push(e.detail.value)
		selected_option_ids.value = select_array
	}else{
		//多选时
		selected_option_ids.value = e.detail.value
	}
}

// 本地验证答案正确性
function checkAnswerCorrectness() {
	// 获取正确选项ID集合
	let correctOptionIds = currentOptions.value
		.filter(option => option.is_right === 1)
		.map(option => option.id)
	
	// 长度不同直接错误
	if(selected_option_ids.value.length !== correctOptionIds.length){
		return false
	}else{
		// 检查每个选项是否都在正确答案中
		return selected_option_ids.value.every(id => correctOptionIds.includes(id))
	}
}


// 格式化正确答案显示
function formatCorrectAnswer() {
	let right_array = new Array()
	// 遍历选项信息，找出正确答案选项,并格式化
	currentOptions.value.forEach(function(opt) {
		if(opt.is_right == 1){
			right_array.push(opt.content)
		}
	}, this);
	return right_array.join('\n')
}

// 下一题
function nextQuestion() {
	//题目索引+1
	page_no.value += 1
	let next_question_id = quesionIds.value[page_no.value]
	//重新获取题目
	getQuestion(userExamId.value,next_question_id)
}

// 上一题
function prevQuestion() {
    //题目索引-1
    page_no.value -= 1
    let prev_question_id = quesionIds.value[page_no.value]
    //重新获取题目
    getQuestion(userExamId.value,prev_question_id)
}


//交卷
function toSubmitExam(){
	let params = {
		user_exam_id:userExamId.value,
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


//答题卡相关==============


// 打开答题卡
let answerCardPopup = ref(null)
function openAnswerCard() {
  answerCardPopup.value?.open()
  loadAnswerCard()
}
// 答题卡信息
let answerMap = ref([])  // [{qid,is_correct}]
//获取答题卡信息
function loadAnswerCard() {
	//初始化
	answerMap.value = []
	practiceAPIService.getAnswerCardInfo({ user_exam_id: userExamId.value })
	.then(res => {
		if (res.code === 200) {
			let all_question_ids = res.data.all_question_ids; //[1,2,.....]
			let user_exam_options_list = res.data.user_exam_options_list;  //[{q_id,is_correct}]
			//遍历
			all_question_ids.map(qid =>{
				// 查找用户答题列表中当前qid对应的项
				let item = user_exam_options_list.find(item => item.q_id === qid);
				// 有匹配项则取其is_correct，无匹配项默认设为null（比如用户未作答）
				let is_correct = item ? item.is_correct:null;
				// 构建qid和is_correct的对象，添加到answerMap数组中
				answerMap.value.push({ qid, is_correct })
			});
		}
	})
}


// 答题卡跳转
function jumpToQuestion(qid) {
  answerCardPopup.value?.close()
  getQuestion(userExamId.value,qid)
}
// 答题卡状态判断
function isRight(item) {
  return item.is_correct == 1;
}
function isWrong(item) {
  return item.is_correct == 0;
}

</script>
<style scoped>
.page-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f5f5f5;
	/* 给内容区域添加底部内边距，避免被固定的底部按钮遮挡 */
	padding-bottom: 120rpx;
	box-sizing: border-box;
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
/* 答题结果提示区域美化 */
.result-tip {
  margin-top: 30rpx;
  padding: 24rpx;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

/* 正确/错误提示行样式 */
.tip-content {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 30rpx;
  font-weight: 500;
  padding: 16rpx 20rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

/* 正确状态样式 */
.tip-correct {
  color: #36b37e;
  background-color: #f6ffed;
  border-color: #eaffea;
}

/* 错误状态样式 */
.tip-error {
  color: #ff5630;
  background-color: #fff2f0;
  border-color: #ffe8e5;
}

/* 正确答案提示区域 */
.correct-answer-tip {
  padding: 22rpx 24rpx;
  background-color: #f0f7ff;
  border-radius: 8rpx;
  border-left: 4rpx solid #409eff;
  font-size: 28rpx;
  line-height: 1.8;
}

/* 答案标签样式 */
.answer-label {
  color: #409eff;
  font-weight: 600;
  margin-right: 10rpx;
}

/* 答案内容样式 */
.answer-value {
  color: #333;
  white-space: pre-line; /* 保留换行符 */
  padding-left: 10rpx;
}

/* 上下题按钮 */
.page-nav {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	padding: 0 24rpx 24rpx;
	
}
.nav-btn {
	/* 每个按钮占满一行宽度 */
	  width: 80%;
	  /* 移除flex:1，改用width:100% */
	  height: 92rpx;
	  line-height: 92rpx;
	  border-radius: 8rpx;
	  font-size: 30rpx;
	  font-weight: 500;
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  gap: 12rpx;
	  transition: all 0.2s ease;
	  border: none;
}
.prev-btn {
	background-color: #ffffff;
	color: #606266;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}
.next-btn {
	background: linear-gradient(135deg, #409eff 0%, #53a8ff 100%);
	color: white;
	box-shadow: 0 4rpx 12rpx rgba(64, 158, 255, 0.2);
}
.nav-btn:disabled {
	opacity: 0.5;
	transform: none !important;
}
.nav-btn:active:not(:disabled) {
	transform: scale(0.98);
}

/* 底部按钮 */
.footer {
	/* 固定在底部 */
	  position: fixed;
	  bottom: 0;
	  left: 0;
	  right: 0;
	  display: flex;
	  gap: 20rpx;
	  padding: 20rpx;
	  background-color: #fff;
	  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
	  /* 确保在最上层 */
	  z-index: 99;
	  /* 防止内容溢出 */
	  box-sizing: border-box;
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
  padding: 30rpx;
  max-height: 60vh;
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

/* 答对样式（绿色背景+白色文字） */
.right_css {
	background-color: #4cd964;
	border-color: #4cd964;
}
/* 答错样式（红色背景+白色文字） */
.wrong_css {
	background-color: #ff3b30;
	border-color: #ff3b30;
}


/* 全局基础优化 */
.page-container {
  background-color: #f8fafc; /* 更柔和的背景色 */
}

/* 进度条美化 */
.progress-bar {
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #f0f0f0; /* 增加底部边框区分区域 */
}
.progress-text {
  font-size: 28rpx;
  color: #4b5563; /* 更深的文字色提升可读性 */
  font-weight: 500;
}

/* 题目卡片美化 */
.question-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 20rpx; /* 增加外间距 */
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05); /* 轻微阴影增强层次感 */
}
.question-content {
  font-size: 34rpx;
  color: #1e293b;
  line-height: 1.8;
  margin-bottom: 40rpx;
}

/* 选项列表优化 */
::v-deep .uni-data-checkbox__list {
  gap: 15rpx; /* 选项间距 */
}
::v-deep .uni-data-checkbox__item {
  padding: 25rpx;
  border-radius: 10rpx;
  transition: background-color 0.2s;
}
::v-deep .uni-data-checkbox__item:hover {
  background-color: #f1f5f9; /* 悬停背景色 */
}

/* 按钮美化 */
.nav-btn {
  width: 80%;
  height: 92rpx;
  line-height: 92rpx;
  border-radius: 12rpx; /* 更圆润的边角 */
  font-size: 32rpx;
  transition: all 0.3s ease;
}
.next-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); /* 更饱和的蓝色 */
}
.next-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 2rpx 8rpx rgba(37, 99, 235, 0.3);
}

/* 答题卡美化 */
.card-item {
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 8rpx;
  transition: transform 0.2s;
}
.card-item:hover {
  transform: scale(1.05); /* 悬停放大效果 */
}
.right_css {
  background-color: #10b981; /* 更柔和的绿色 */
  color: white; /* 白色文字提升对比 */
}
.wrong_css {
  background-color: #ef4444; /* 更柔和的红色 */
  color: white;
}

</style>
