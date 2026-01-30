<template>
  <view class="payment-container">
    <!-- 商品信息卡片 -->
    <uni-card class="goods-card" >
      <view class="goods-info">
        <!-- 商品图片 -->
        <image class="goods-img" src="/static/default_user_head.jpg" mode="widthFix"></image>
        <view class="goods-desc">
          <text class="goods-name">{{ payInfo.name }}</text>
          <text class="goods-price">¥{{ payInfo.price }}</text>
        </view>
      </view>
    </uni-card>

    <!-- 支付方式选择（核心美化区域） -->
    <uni-card class="pay-type-card" >
      <view class="pay-type-title">支付方式</view>
      <view class="pay-type-list">
        <uni-data-checkbox
          mode="list"
          :localdata="paylist"
          v-model="selectedPayType"
          @change="handlePayTypeChange"
          class="option-list"
        >
          <template v-slot:option="{ option }">
            <!-- 支付方式选项项 -->
            <view 
              class="option-item" 
              :class="{ 
                active: selectedPayType === option.value,
                disabled: option.value === '2' // 禁用支付宝
              }"
            >
              <!-- 支付方式名称 -->
              <text class="option-text">{{ option.text }}</text>
              <!-- 选中态图标 -->
              <uni-icon 
                v-if="selectedPayType === option.value"
                type="success"
                color="#00b42a"
                size="18"
                class="active-icon"
              ></uni-icon>
            </view>
          </template>
        </uni-data-checkbox>
      </view>
    </uni-card>

    <!-- 支付按钮 -->
    <button 
      type="primary" 
      class="pay-submit-btn" 
      @click="submitPayment"
      :disabled="!selectedPayType"
    >
      确认支付
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from "@dcloudio/uni-app";

// 支付信息
const payInfo = ref({
  id: '',
  name: '',
  price: ''
});

// 选中的支付方式（默认微信）
const selectedPayType = ref('1');
// 支付方式列表
const paylist = ref([
  { value: '1', text: '微信支付',isDisabled:true },
  { value: '2', text: '支付宝支付',isDisabled:false  },
  { value: '3', text: '银行卡支付',isDisabled:false  }
]);


// 页面加载获取支付参数
onLoad((options) => {
  payInfo.value = {
    id: options.goodsId || '',
    name: options.goodsName || '默认商品',
    price: options.goodsPrice || '0.00'
  };
});

// 支付方式变更处理
const handlePayTypeChange = (e) => {
  const selectedValue = e.detail.value;
  // 禁用支付宝支付
  if (selectedValue === '2') {
    uni.showToast({
      title: '暂不支持支付宝支付',
      icon: 'none',
      duration: 1500
    });
    selectedPayType.value = '1'; // 切回微信支付
    return;
  }
  selectedPayType.value = selectedValue;
};

// 提交支付
const submitPayment = () => {
  if (!selectedPayType.value) return;

  // 模拟调起支付
  uni.showLoading({ title: '正在调起支付...' });
  
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2000
    });

    // 跳转到已购商品页面
    setTimeout(() => {
      uni.navigateTo({
        url: `/pages/mall/purchasedGoods/purchasedGoods?isPaySuccess=true`
      });
    }, 2000);
  }, 1500);
};
</script>

<style scoped>
/* 全局容器 */
.payment-container {
  width: 100%;
  min-height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

/* 商品信息卡片 */
.goods-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.goods-info {
  display: flex;
  align-items: center;
}
.goods-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.goods-desc {
  flex: 1;
}
.goods-name {
  font-size: 32rpx;
  font-weight: 500;
  display: block;
  margin-bottom: 10rpx;
  color: #333;
  line-height: 1.4;
}
.goods-price {
  font-size: 32rpx;
  color: #f53f3f;
  font-weight: 600;
}

/* 优惠券卡片 */
.coupon-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.coupon-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.coupon-label {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}
.coupon-select {
  width: 60%;
}

/* 支付方式卡片 */
.pay-type-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.pay-type-title {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 24rpx;
  font-weight: 500;
}
.pay-type-list {
  padding: 0 8rpx;
}

/* 支付方式选项 */
.option-item {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
  border-radius: 12rpx;
  margin-bottom: 12rpx;
  transition: all 0.2s ease;
  position: relative;
}
/* 选中态 */
.option-item.active {
  background-color: #f0f9ff;
  border: 2rpx solid #1677ff;
}
/* 禁用态（支付宝） */
.option-item.disabled {
  opacity: 0.6;
  pointer-events: none;
}
/* 未选中 hover 态 */
.option-item:not(.active):not(.disabled):hover {
  background-color: #f8f9fa;
}

/* 支付图标 */
.pay-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}

/* 支付方式文字 */
.option-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

/* 选中态图标 */
.active-icon {
  position: absolute;
  right: 16rpx;
}

/* 支付按钮 */
.pay-submit-btn {
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  border-radius: 44rpx;
  background-color: #f53f3f;
  border: none;
  color: #fff;
}
/* 按钮禁用态 */
.pay-submit-btn:disabled {
  background-color: #ccc;
  color: #fff;
}
/* 按钮点击反馈 */
.pay-submit-btn:active {
  background-color: #d83737;
}
</style>