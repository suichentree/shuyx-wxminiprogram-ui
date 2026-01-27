<template>
  <view class="pay-container">
    <!-- 页面标题 -->
    <view class="page-title">微信支付 - 付费试题测试</view>

    <!-- 试题状态提示 -->
    <view class="status-tip" v-if="isPurchased">✅ 您已购买试题，可查看完整内容</view>
    <view class="status-tip" v-else>🔒 试题需付费购买后查看（测试金额：0.01元）</view>

    <!-- 付费试题区域 -->
    <view class="exam-card">
      <view class="exam-title">【测试版】2026年电工真题</view>
      
      <!-- 未购买时仅展示部分内容 -->
      <view class="exam-content" v-if="!isPurchased">
        <view class="exam-item">1. XXXXXXXXXXXXXX？（需购买后查看选项及答案）</view>
        <view class="exam-item">2. XXXXXXXXXXXXXXXXXXXXXXXXX？（需购买后查看选项及答案）</view>
      </view>

      <!-- 已购买时展示完整试题 -->
      <view class="exam-content" v-else>
        <view class="exam-item">
          <view class="item-title">1. xxxxxxxxxxx是？</view>
          <view class="item-options">A. 之前</view>
          <view class="item-options">B. 之后</view>
          <view class="item-options">C. 之中</view>
          <view class="item-answer">答案：A</view>
        </view>
      </view>
    </view>

    <!-- 支付按钮（未购买时展示） -->
    <button 
      class="pay-btn" 
      v-if="!isPurchased" 
      :loading="payLoading" 
      @click="handleBuyExam"
    >
      立即购买（0.01元）
    </button>

    <!-- 支付结果提示 -->
    <view class="pay-result" v-if="payResult">{{ payResult }}</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 状态定义
const isPurchased = ref(false); // 是否已购买试题
const payLoading = ref(false); // 支付按钮加载状态
const payResult = ref(''); // 支付结果提示
const platform = ref(''); // 当前运行平台（小程序/H5）

// 初始化：判断运行平台 + 模拟检查是否已购买（实际项目需对接后端查询订单）
onMounted(() => {
  // 区分uniapp运行平台（核心跨端逻辑）
  const systemInfo = uni.getSystemInfoSync();
  platform.value = systemInfo.platform; // mp-weixin（微信小程序）/ h5（H5端）
  console.log('当前运行平台：', platform.value);

  // 模拟：从本地缓存检查是否已购买（实际项目需调后端接口查询）
  const purchased = uni.getStorageSync('exam_purchased');
  if (purchased) {
    isPurchased.value = true;
  }
});

/**
 * 处理试题购买逻辑（核心支付流程）
 * 步骤：1. 调后端接口获取支付参数 2. 分平台调微信支付API 3. 处理支付结果
 */
const handleBuyExam = async () => {
  try {
    payLoading.value = true;
    payResult.value = '';

    // 1. 调后端接口获取支付参数（实际项目需替换为真实接口）
    // 注：微信支付参数需由后端生成，前端仅传递订单信息
    const payRes = await uni.request({
      url: '/api/wxpay/createOrder', // 后端支付接口（需自行开发）
      method: 'POST',
      data: {
        orderNo: `TEST_${Date.now()}`, // 测试订单号
        amount: 0.01, // 测试金额（单位：元）
        body: '2024编程基础测试题', // 订单描述
        platform: platform.value, // 传递当前平台（后端区分小程序/H5支付）
      },
    });

    if (payRes.statusCode !== 200 || !payRes.data.success) {
      throw new Error('获取支付参数失败：' + (payRes.data.msg || '接口异常'));
    }

    const payParams = payRes.data.data;

    // 2. 分平台处理微信支付（核心跨端支付逻辑）
    if (platform.value === 'mp-weixin') {
      // 微信小程序端支付逻辑
      await wx.requestPayment({
        timeStamp: payParams.timeStamp,
        nonceStr: payParams.nonceStr,
        package: payParams.package,
        signType: payParams.signType,
        paySign: payParams.paySign,
        success: (res) => {
          console.log('小程序支付成功：', res);
          handlePaySuccess();
        },
        fail: (err) => {
          throw new Error('小程序支付失败：' + (err.errMsg || '用户取消支付'));
        },
      });
    } else if (platform.value === 'h5') {
      // H5端微信支付逻辑（后端返回支付跳转链接）
      if (payParams.h5PayUrl) {
        // 跳转微信H5支付页面
        window.location.href = payParams.h5PayUrl;
        // 注：H5支付完成后需后端回调通知，前端可通过页面跳转/轮询查询订单状态
        // 此处模拟支付成功（实际需对接后端订单查询接口）
        setTimeout(() => {
          handlePaySuccess();
        }, 1000);
      } else {
        throw new Error('H5支付链接生成失败');
      }
    } else {
      throw new Error('当前平台不支持微信支付测试');
    }
  } catch (error) {
    payResult.value = error.message;
    console.error('支付异常：', error);
  } finally {
    payLoading.value = false;
  }
};

/**
 * 处理支付成功逻辑
 */
const handlePaySuccess = () => {
  payResult.value = '支付成功！正在为您解锁试题...';
  isPurchased.value = true;
  // 模拟：将购买状态存入本地缓存（实际项目需后端记录订单状态）
  uni.setStorageSync('exam_purchased', true);
  // 延迟清空结果提示
  setTimeout(() => {
    payResult.value = '';
  }, 3000);
};
</script>

<style scoped>
.pay-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
  color: #333;
}

.status-tip {
  text-align: center;
  font-size: 28rpx;
  padding: 15rpx;
  margin-bottom: 20rpx;
  border-radius: 8rpx;
  background-color: #e8f4f8;
  color: #2d3748;
}

.exam-card {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.exam-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #eee;
}

.exam-content {
  font-size: 28rpx;
  color: #4a5568;
}

.exam-item {
  margin-bottom: 25rpx;
  line-height: 1.6;
}

.item-title {
  font-weight: 500;
  margin-bottom: 10rpx;
}

.item-options {
  margin-left: 20rpx;
  margin-bottom: 8rpx;
  color: #718096;
}

.item-answer {
  margin-top: 10rpx;
  color: #e53e3e;
  font-weight: 500;
}

.pay-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #07c160;
  color: #fff;
  font-size: 32rpx;
  border-radius: 44rpx;
  border: none;
}

.pay-result {
  text-align: center;
  font-size: 28rpx;
  margin-top: 20rpx;
  color: #e53e3e;
}
</style>