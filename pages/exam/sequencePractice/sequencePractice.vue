<template>
  <!-- 外层 Flex 容器：垂直布局，占满视口高度 -->
  <view class="page-root">
    <!-- 1. 顶部进度条：固定高度，Flex 布局下自动固定在顶部 -->
    <view class="progress-bar">
      <view class="progress-info">
        <text class="progress-text">第 {{ page_no + 1 }} / {{ total_count }} 题</text>
      </view>
      <view class="progress-line">
        <view class="progress-fill" :style="{width: ( (page_no+1) / total_count * 100) + '%'}"></view>
      </view>
    </view>

    <!-- 2. 中间内容区：flex:1 占满剩余高度，内容超出时滚动 -->
    <view class="content-wrapper">
      <!-- 题目/答题/解析内容（和之前一致） -->
      <view class="question-item" v-if="currentQuestion">
        <view class="question-header">
          <uni-tag :text="page_no + 1 + ''" type="primary" size="mini" />
          <text class="question-type">{{ currentQuestion.type_name }}</text>
        </view>
        <view class="question-content">{{ currentQuestion.name }}</view>
        
        <!-- 选项列表 -->
        <view class="options-list">
          <view v-if="currentQuestion.type == 1">
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
        
        <!-- 简化后的答题结果区域 -->
        <view class="result-container" v-if="hasSubmitted">
          <view class="result-status" :class="isCorrect ? 'status-correct' : 'status-error'">
            <uni-icons 
              :type="isCorrect ? 'checkmarkempty' : 'closeempty'" 
              size="24rpx" 
            ></uni-icons>
            <text class="status-text">{{ isCorrect ? '回答正确' : '回答错误' }}</text>
          </view>
          <view class="result-detail">
            <view class="detail-item">
              <text class="detail-label">正确答案：</text>
              <text class="detail-value">{{ formatCorrectAnswer() }}</text>
            </view>
            <view class="detail-item" v-if="currentQuestion?.analysis">
              <text class="detail-label">解析：</text>
              <text class="detail-value analysis-content">{{ currentQuestion.analysis }}</text>
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
      </view>
    </view>

    <!-- 3. 底部按钮区：固定高度，Flex 布局下自动固定在底部 -->
    <view class="footer">
      <button style="flex:2;" @click="openAnswerCard">答题卡</button>
      <button style="flex:3;" v-if="isFinished"  @click="toResult">分析结果</button>
      <button style="flex:3;" type="primary" v-else :disabled="hasSubmitted" @click="submitAnswer">提交答案</button>
    </view>
  </view>

  <!-- 答题卡弹窗（不变） -->
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
// 脚本逻辑和之前完全一致，无需修改
import { onMounted, ref } from 'vue';
import APIService from '@/api/sequence_practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

// 用户id
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

// 题目相关变量
let currentQuestionId = ref(null)
let currentQuestion = ref(null)
let currentOptions = ref([])
let quesionIds = ref([])
let page_no = ref(null)
let total_count = ref(0)
let selected_option_ids = ref(undefined)
let hasSubmitted = ref(false)
let isCorrect = ref(false)
let isFinished = ref(false)

// 获取题目
function getQuestion(userExamId,questionId){
  currentQuestionId.value = null
  currentQuestion.value = null
  currentOptions.value = []
  quesionIds.value = []
  selected_option_ids.value = null
  hasSubmitted.value = false
  isCorrect.value = false
  
  let params = {user_exam_id:userExamId,question_id:questionId}
  APIService.getQuestion(params).then((res) => {
    if (res.code == 200) {
      currentQuestionId.value = res.data.question_id
      currentQuestion.value = res.data.question_options.question
      currentOptions.value = res.data.question_options.options
      quesionIds.value = res.data.question_ids
      
      isFinished.value = res.data.is_finished
      page_no.value = quesionIds.value.indexOf(currentQuestionId.value);
      total_count.value = quesionIds.value.length
      
      if(res.data.selected_option_ids != null){
        hasSubmitted.value = true
        selected_option_ids.value = res.data.selected_option_ids
        isCorrect.value = res.data.is_correct
      }else{
        hasSubmitted.value = false
        if(currentQuestion.value.type == 1 || currentQuestion.value.type == 3){
          selected_option_ids.value = null
        }else if (currentQuestion.value.type == 2){
          selected_option_ids.value = []
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
    let isAnswerCorrect = checkAnswerCorrectness()
    hasSubmitted.value = true
    isCorrect.value = isAnswerCorrect
    
    let params = {
      user_exam_id: userExamId.value,
      question_id: currentQuestionId.value,
      question_type:currentQuestion.value.type,
      option_ids: selected_option_ids.value
    }
    APIService.submitAnswer(params).then((res) => {
      if(res.code != 200) {
        uni.showToast({
          title: '提交失败：' + res.message,
          icon: 'none'
        })
      }
    })
  }
}

// 选项改变处理
function handleCheckboxChange(e,question_type) {
  let select_array = new Array()
  if (question_type == 1 || question_type == 3) {
    select_array.push(e.detail.value)
    selected_option_ids.value = select_array
  }else{
    selected_option_ids.value = e.detail.value
  }
}

// 验证答案正确性
function checkAnswerCorrectness() {
  let correctOptionIds = currentOptions.value
    .filter(option => option.is_right === 1)
    .map(option => option.id)
  
  if(selected_option_ids.value.length !== correctOptionIds.length){
    return false
  }else{
    return selected_option_ids.value.every(id => correctOptionIds.includes(id))
  }
}

// 格式化正确答案
function formatCorrectAnswer() {
  let right_array = new Array()
  currentOptions.value.forEach(function(opt) {
    if(opt.is_right == 1){
      right_array.push(opt.content)
    }
  }, this);
  return right_array.join('、')
}

// 上下题
function nextQuestion() {
  page_no.value += 1
  let next_question_id = quesionIds.value[page_no.value]
  getQuestion(userExamId.value,next_question_id)
}
function prevQuestion() {
  page_no.value -= 1
  let prev_question_id = quesionIds.value[page_no.value]
  getQuestion(userExamId.value,prev_question_id)
}

// 交卷/结果页
function toSubmitExam(){
  let params = { user_exam_id:userExamId.value }
  APIService.submitAnswerMap(params).then((res) => {
    if(res.code != 200){
      uni.showToast({ title: '交卷失败,'+res.message, duration: 2000 })
    }else{
      uni.navigateTo({ url: '/pages/exam/sequencePractice/sequencePracticeResult?userExamId='+userExamId.value })
    }
  })
}
function toResult() { toSubmitExam() }

// 答题卡相关
let answerCardPopup = ref(null)
function openAnswerCard() {
  answerCardPopup.value?.open()
  loadAnswerCard()
}
let answerMap = ref([])
function loadAnswerCard() {
  answerMap.value = []
  APIService.getAnswerCardInfo({ user_exam_id: userExamId.value })
  .then(res => {
    if (res.code === 200) {
      let all_question_ids = res.data.all_question_ids;
      let user_exam_options_list = res.data.user_exam_options_list;
      all_question_ids.map(qid =>{
        let item = user_exam_options_list.find(item => item.q_id === qid);
        let is_correct = item ? item.is_correct:null;
        answerMap.value.push({ qid, is_correct })
      });
    }
  })
}
function jumpToQuestion(qid) {
  answerCardPopup.value?.close()
  getQuestion(userExamId.value,qid)
}
function isRight(item) { return item.is_correct == 1; }
function isWrong(item) { return item.is_correct == 0; }
</script>

<style scoped>
/* ========== 核心 Flex 布局样式 ========== */
/* 外层容器：垂直 Flex，占满视口高度，隐藏溢出 */
.page-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
  overflow: hidden; /* 防止整体页面溢出 */
  box-sizing: border-box;
}

/* 1. 顶部进度条：固定高度，Flex 布局下自动固定在顶部 */
.progress-bar {
  height: 120rpx; /* 固定高度，关键！ */
  background-color: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #f0f0f0;
  box-sizing: border-box; /* 确保padding不超出固定高度 */
  z-index: 10; /* 确保层级高于中间内容（可选） */
}

/* 2. 中间内容区：flex:1 占满剩余高度，内容超出时滚动 */
.content-wrapper {
  flex: 1; /* 关键！占满顶部/底部外的所有空间 */
  overflow-y: auto; /* 内容超出时垂直滚动 */
  padding: 20rpx;
  box-sizing: border-box;
}

/* 3. 底部按钮区：固定高度，Flex 布局下自动固定在底部 */
.footer {
  height: 120rpx; /* 固定高度，关键！ */
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  box-sizing: border-box; /* 确保padding不超出固定高度 */
  z-index: 10;
}

/* ========== 其他样式（和之前一致，仅适配） ========== */
.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
}
.progress-text {
  font-size: 28rpx;
  color: #4b5563;
  font-weight: 500;
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

.question-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
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
  font-size: 34rpx;
  color: #1e293b;
  line-height: 1.8;
  margin-bottom: 40rpx;
}

.options-list {
  margin-bottom: 30rpx;
}
::v-deep .uni-data-checkbox__list {
  gap: 12rpx;
}
::v-deep .uni-data-checkbox__item {
  padding: 22rpx 20rpx;
  border-radius: 12rpx;
  border: 1px solid #f0f0f0;
  transition: all 0.2s ease;
}
::v-deep .uni-data-checkbox__item:active {
  background-color: #f5f7fa;
}
::v-deep .uni-data-checkbox__item--active {
  background-color: #e8f4ff;
  border-color: #409eff;
}

/* 答题结果区域 */
.result-container {
  margin-top: 30rpx;
  border-radius: 12rpx;
  overflow: hidden;
}
.result-status {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 18rpx 20rpx;
  font-size: 28rpx;
  font-weight: 500;
}
.status-correct {
  background-color: #f0f9ff;
  color: #10b981;
}
.status-error {
  background-color: #fef2f2;
  color: #ef4444;
}
.result-detail {
  padding: 20rpx;
  background-color: #fafafa;
}
.detail-item {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 12rpx;
  font-size: 26rpx;
  line-height: 1.6;
}
.detail-label {
  color: #67c23a;
  font-weight: 500;
  min-width: 100rpx;
}
.detail-value {
  color: #374151;
  flex: 1;
}
.analysis-content {
  color: #1f2937;
}

/* 上下题按钮 */
.page-nav {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}
.nav-btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
  border: none;
  transition: all 0.2s ease;
}
.prev-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}
.next-btn {
  background-color: #f3f4f6;
  color: #4b5563;
}
.nav-btn:disabled {
  opacity: 0.5;
}
.nav-btn:active:not(:disabled) {
  transform: scale(0.98);
}

/* 答题卡样式 */
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
  transition: transform 0.2s;
}
.card-item:hover {
  transform: scale(1.05);
}
.right_css {
  background-color: #10b981;
  color: white;
}
.wrong_css {
  background-color: #ef4444;
  color: white;
}

/* 底部按钮样式 */
.footer button {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  border: none;
}
</style>