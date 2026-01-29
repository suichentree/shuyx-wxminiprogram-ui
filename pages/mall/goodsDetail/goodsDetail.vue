<template>
  <view class="detail-container">
    <!-- 商品信息 -->
    <uni-card>
      <view class="goods-base">
        <image class="goods-big-img" :src="goodsInfo.image" mode="widthFix"></image>
        <text class="goods-title">{{ goodsInfo.name }}</text>
        <text class="goods-price">¥{{ goodsInfo.price }}</text>
        <text class="goods-intro">{{ goodsInfo.intro }}</text>
      </view>
    </uni-card>

    <!-- 支付按钮 -->
    <button type="primary" class="pay-btn" @click="toPayment">立即购买</button>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import APIService from '@/api/sequence_practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

const goodsInfo = ref({
  id: '1',
  name: '1111111',
  price: '11',
  image: '/static/images/vip-1.png',
  intro: '真题题库含完整解析，支持在线做题、错题收藏'
});

const goods_id = ref(null)
// 页面加载获取商品参数
onLoad((options) => {
	goods_id.value = options.goodsId;
	
	//获取具体商品信息
  
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 跳转到支付页面
const toPayment = () => {
	uni.navigateTo({
		url: "/pages/mall/payment/payment?goodsId="+goodsInfo.value.id
	})
};
</script>

<style scoped>
.detail-container {
  width: 100%;
  height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
}
.goods-big-img {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}
.goods-title {
  font-size: 36rpx;
  font-weight: 600;
  display: block;
  margin-bottom: 10rpx;
}
.goods-price {
  font-size: 32rpx;
  color: #f53f3f;
  display: block;
  margin-bottom: 20rpx;
}
.goods-intro {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
.pay-btn {
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}
</style>