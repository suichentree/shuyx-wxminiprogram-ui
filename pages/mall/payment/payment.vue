<template>
  <view class="payment-container">
    <!-- 商品信息 -->
    <uni-card class="pay-goods">
      <text class="pay-goods-name">商品：{{ payInfo.name }}</text>
      <text class="pay-goods-price">金额：¥{{ payInfo.price }}</text>
    </uni-card>

    <!-- 支付方式选择 -->
    <uni-list>
      <uni-list-item title="微信支付" showArrow="false">
        <radio :checked="payType === 'wechat'" @change="changePayType('wechat')" color="#07C160"></radio>
      </uni-list-item>
      <uni-list-item title="支付宝支付（暂未开通）" showArrow="false" disabled>
        <radio :checked="payType === 'alipay'" @change="changePayType('alipay')" color="#07C160"></radio>
      </uni-list-item>
    </uni-list>

    <!-- 支付按钮 -->
    <button type="primary" class="pay-submit-btn" @click="submitPayment">
      确认支付
    </button>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import APIService from '@/api/sequence_practice.service.js'
import { onLoad } from "@dcloudio/uni-app";
// 支付信息
const payInfo = ref({
  id: '1',
  name: '123456',
  price: '11'
});
// 支付方式（默认微信）
const payType = ref('wechat');

// 页面加载获取支付参数
onLoad((options) => {
  payInfo.value = {
    id: options.goodsId,
    name: options.goodsName,
    price: options.goodsPrice
  };
});

// 切换支付方式
const changePayType = (type) => {
  payType.value = type;
};

// 提交支付（模拟微信支付流程）
const submitPayment = () => {
  // 模拟调起微信支付（实际需对接微信支付SDK/后端接口）
  uni.showLoading({ title: '正在调起微信支付...' });
  
  setTimeout(() => {
    uni.hideLoading();
    // 模拟支付成功
    uni.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 2000
    });

    // 支付成功后跳转到已购商品页面
    setTimeout(() => {
		let a = {
			isPaySuccess: true
		}
		uni.navigateTo({
			url: '/pages/mall/purchasedGoods/purchasedGoods?isPaySuccess='+a.isPaySuccess
		})
    }, 2000);
  }, 1500);
};
</script>

<style scoped>
.payment-container {
  width: 100%;
  height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
}
.pay-goods {
  margin-bottom: 30rpx;
}
.pay-goods-name {
  font-size: 32rpx;
  display: block;
  margin-bottom: 10rpx;
}
.pay-goods-price {
  font-size: 30rpx;
  color: #f53f3f;
}
.pay-submit-btn {
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}
uni-list-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}
radio {
  transform: scale(1.2);
}
</style>