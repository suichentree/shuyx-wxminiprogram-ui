<template>
  <view class="purchased-container">
    <!-- 已购商品列表 -->
    <scroll-view class="purchased-list" scroll-y v-if="purchasedList.length > 0">
      <view v-for="(item, index) in purchasedList" :key="index" class="purchased-item">
        <uni-card :shadow="false">
          <view class="purchased-info">
            <image class="purchased-img" :src="item.image" mode="widthFix"></image>
            <view class="purchased-desc">
              <text class="purchased-name">{{ item.name }}</text>
              <text class="purchased-price">¥{{ item.price }}</text>
              <text class="purchased-time">{{ item.buyTime }}</text>
            </view>
          </view>
        </uni-card>
      </view>
    </scroll-view>

    <!-- 空数据提示 -->
    <view class="empty-tip" v-else>
      <uni-icons type="empty" size="60" color="#999"></uni-icons>
      <text class="empty-text">暂无已购商品，快去商城选购吧~</text>
      <uni-button type="primary" size="mini" @click="toMall">去商城</uni-button>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import APIService from '@/api/sequence_practice.service.js'
import { onLoad } from "@dcloudio/uni-app";

// 是否支付成功（从支付页跳转携带）
const isPaySuccess = ref(false);
// 已购商品列表（模拟数据，实际需从后端获取）
const purchasedList = ref([
  // 模拟已购商品，支付成功后会新增
  {
    id: 1,
    name: "2024年行测真题题库（含解析）",
    price: 99,
    image: "/static/images/test-1.png",
    buyTime: "2024-05-20 14:30:00"
  }
]);

// 页面加载
onLoad((options) => {
  isPaySuccess.value = options.isPaySuccess === 'true';
  // 支付成功时，新增商品到已购列表
  if (isPaySuccess.value) {
    const newGoods = {
      id: Date.now(), // 临时ID
      name: uni.getStorageSync('lastPayGoodsName') || "VIP会员",
      price: uni.getStorageSync('lastPayGoodsPrice') || 299,
      image: "/static/images/vip-1.png",
      buyTime: new Date().toLocaleString()
    };
    purchasedList.value.push(newGoods);
    // 清除缓存
    uni.removeStorageSync('lastPayGoodsName');
    uni.removeStorageSync('lastPayGoodsPrice');
  }
});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 跳转到商城首页
const toMall = () => {
  uni.navigateTo({ url: "/pages/mall/mall" });
};
</script>

<style scoped>
.purchased-container {
  width: 100%;
  height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
}
.purchased-list {
  height: calc(100vh - 100rpx);
  padding: 10rpx 0;
}
.purchased-item {
  margin-bottom: 20rpx;
}
.purchased-info {
  display: flex;
  align-items: center;
}
.purchased-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
}
.purchased-desc {
  margin-left: 20rpx;
  flex: 1;
}
.purchased-name {
  font-size: 32rpx;
  font-weight: 500;
  display: block;
  margin-bottom: 10rpx;
}
.purchased-price {
  font-size: 28rpx;
  color: #f53f3f;
  display: block;
  margin-bottom: 10rpx;
}
.purchased-time {
  font-size: 24rpx;
  color: #999;
}
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100rpx);
}
.empty-text {
  font-size: 28rpx;
  color: #999;
  margin: 20rpx 0;
}
</style>