<template>
  <view class="page-container">
    <!-- 介绍区域卡片 -->
    <view class="card intro-card">
      <text class="card-title">介绍</text>
      <!-- 核心：用flex布局分离文本和按钮，解决拥挤 -->
      <view class="intro-content">
        <view class="intro-text"> <!-- 新增文本容器，包裹名称和规则 -->
          <text class="exam-name">{{ exam_info.name }}</text>
          <!-- 新增顺序练习规则介绍 -->
          <text class="intro-rule">
            顺序练习规则：按题目顺序依次作答，覆盖全部题库内容，不随机抽题。每答完一题可即时查看解析，练习过程可暂停，完成后生成详细错题记录。
          </text>
        </view>
        <button type="primary" @click="toStart" class="start-btn">开始练习</button>
      </view>
    </view>

    <!-- 历史记录区域卡片 -->
    <!-- 以下内容不变 -->
    <view class="card history-card">
      <text class="card-title">历史记录</text>
      <!-- 空状态 -->
      <view v-if="history_list.length === 0" class="empty-history">
        <text class="empty-text">📝 暂无练习记录，快去开始第一次练习吧～</text>
      </view>
      <!-- 历史记录列表 -->
      <view v-else class="history-list">
        <view 
          v-for="(item, index) in history_list" 
          :key="item.id"
          class="history-item"
          @click="viewResult(item.id)"
        >
          <!-- 左侧文本区域 -->
          <view class="history-left">
            <text class="history-exam-name">{{ exam_info.name }}</text>
            <view class="history-stats">
              <text class="stat-item">已答：<text class="num answered-num">{{ item.answered_count }}</text></text>
              <text class="stat-divider">|</text>
              <text class="stat-item">未答：<text class="num unanswered-num">{{ item.unanswered_count }}</text></text>
              <text class="stat-divider">|</text>
              <text class="stat-item">完成时间：<text class="finish-time">{{ item.finish_time || '未完成' }}</text></text>
            </view>
          </view>
          <!-- 右侧正确率 -->
          <view class="history-right">
            <text class="accuracy-label">正确率</text>
            <text class="accuracy-num">{{ item.accuracy || 0 }}%</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import spAPIService from '@/api/sequence_practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

let userId = ref(getApp().globalData.userId || 999);
let examId = ref(null);

onLoad((option) => {
  examId.value = option.examId;
});

onMounted(() => {
  history();
});

let history_list = ref([]);
let exam_info = ref({
  name: '特种作业人员-高处作业-登高架设作业(初训)(常考题)',
  id: null,
  tag: null
});

function history() {
  let params = { user_id: userId.value, exam_id: examId.value };
  spAPIService.history(params).then((res) => {
    if (res.code == 200) {
      history_list.value = res.data.user_exam_history;
      exam_info.value = res.data.exam_info;
    }
  });
}

let userExamId = ref(null);
function toStart() {
  let params = { user_id: userId.value, exam_id: examId.value };
  spAPIService.start(params).then((res) => {
    if (res.code == 200) {
      userExamId.value = res.data.user_exam_id;
      uni.navigateTo({
        url: '/pages/exam/sequencePractice/sequencePractice?userExamId=' + userExamId.value
      });
    } else {
      uni.showToast({
        title: '请求失败',
        icon: 'none',
        duration: 2000
      });
    }
  });
}

function viewResult(userExamId) {
  uni.navigateTo({
    url: '/pages/exam/sequencePractice/sequencePracticeResult?userExamId=' + userExamId
  });
}
</script>

<style scoped>
/* 页面全局容器 */
.page-container {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 通用卡片样式 */
.card {
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  padding: 24rpx;
  margin-bottom: 20rpx;
}

/* 卡片标题样式 */
.card-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
  display: block;
}

/* 介绍区域内容 */
.intro-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 改为顶部对齐，避免文本过长时按钮位置偏移 */
  flex-wrap: wrap;
  gap: 16rpx;
}

/* 新增：文本容器，让名称和规则上下排列 */
.intro-text {
  flex: 1;
  min-width: 0; /* 解决flex子元素文本溢出问题 */
}

/* 考试名称文本 */
.exam-name {
  font-size: 28rpx;
  color: #333333;
  line-height: 1.5;
  display: block; /* 改为块级元素，让规则在下方显示 */
  margin-bottom: 12rpx; /* 与规则保持间距 */
}

/* 新增：规则介绍样式 */
.intro-rule {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.6;
  display: block;
}

/* 开始练习按钮 */
.start-btn {
  min-width: 140rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  background-color: #1677ff;
  border: none;
  margin-top: 4rpx; /* 微调按钮位置，与文本顶部对齐 */
}

/* 以下样式不变 */
.empty-history {
  padding: 40rpx 0;
  text-align: center;
}
.empty-text {
  font-size: 28rpx;
  color: #999999;
}

.history-list {
  margin-top: 10rpx;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}
.history-item:last-child {
  border-bottom: none;
}

.history-left {
  flex: 1;
  margin-right: 20rpx;
}

.history-exam-name {
  font-size: 28rpx;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.history-stats {
  font-size: 26rpx;
  color: #666666;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  align-items: center;
}

.num {
  font-weight: 600;
  font-size: 28rpx;
  margin-left: 4rpx;
}
.answered-num {
  color: #008000;
}
.unanswered-num {
  color: #ff4500;
}

.stat-divider {
  color: #cccccc;
}

.finish-time {
  color: #888888;
}

.history-right {
  min-width: 100rpx;
  text-align: center;
}
.accuracy-label {
  font-size: 24rpx;
  color: #666666;
  display: block;
  margin-bottom: 4rpx;
}
.accuracy-num {
  font-size: 32rpx;
  font-weight: 700;
  color: #1677ff;
}
</style>