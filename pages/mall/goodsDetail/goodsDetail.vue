<template>
  <view class="detail-container">
    <!-- 商品信息 -->
    <uni-card>
      <view class="goods-base">
        <image class="goods-big-img" src="/static/default_user_head.jpg" mode="widthFix"></image>
        <text class="goods-title">{{ goodsInfo.name }}</text>
        <text class="goods-price">¥{{ goodsInfo.current_price }}</text>
        <text class="goods-intro">{{ goodsInfo.description }}</text>
      </view>
    </uni-card>

    <!-- 支付按钮 -->
    <button type="primary" class="pay-btn" @click="toPayment">立即购买</button>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import APIService from '@/api/product.service.js'
import { onLoad } from "@dcloudio/uni-app";

let goodsId = ref(null)
// 页面加载获取商品参数
onLoad((options) => {
	goodsId.value = options.goodsId;
});

let goodsInfo = ref({});
onMounted(() => {
  // 获取商品详情
  APIService.getProductDetail({product_id:goodsId.value}).then(res => {
	  if(res.code == 200){
	  	goodsInfo.value = res.data;
	  }else{
	  	uni.showToast({
	  		title:"失败",
	  		icon:None
	  	})
	  } 
  });
}) 

function toPayment (){
	uni.navigateTo({
		url: "/pages/mall/payment/payment?goodsId="+goodsId.value
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