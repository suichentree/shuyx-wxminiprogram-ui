<template>
  <view class="mall-container">
    <!-- 商品列表 -->
    <scroll-view class="goods-list" scroll-y>
      <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="toGoodsDetail(item)">
        <uni-card :shadow="false">
          <view class="goods-info">
            <image class="goods-img" :src="item.image" mode="widthFix"></image>
            <view class="goods-desc">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-price">¥{{ item.price }}</text>
              <text class="goods-tag" v-if="item.type === 'vip'">VIP专属</text>
            </view>
          </view>
        </uni-card>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import APIService from '@/api/product.service.js'
import { onLoad } from "@dcloudio/uni-app";

// 激活的标签页
const activeTab = ref(0);
// 商品列表（模拟数据）
const goodsList = ref([
  {
    id: 1,
    name: "2026年行测真题题库（含解析）",
    price: 99,
    image: "/static/images/test-1.png",
    type: "test"
  },
  {
    id: 2,
    name: "全年VIP会员（所有试题免费看）",
    price: 299,
    image: "/static/images/vip-1.png",
    type: "vip"
  }
]);

// 跳转到商品详情
const toGoodsDetail = (item) => {
  uni.navigateTo({
	url:"/pages/mall/goodsDetail/goodsDetail?goodsId="+item.id
  })
};

</script>
<style scoped>
.mall-container {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
}
.goods-list {
  height: calc(100vh - 200rpx);
  padding: 20rpx;
}
.goods-item {
  margin-bottom: 20rpx;
}
.goods-info {
  display: flex;
  align-items: center;
}
.goods-img {
  width: 150rpx;
  height: 150rpx;
  border-radius: 10rpx;
}
.goods-desc {
  margin-left: 20rpx;
  flex: 1;
}
.goods-name {
  font-size: 32rpx;
  font-weight: 500;
  display: block;
  margin-bottom: 10rpx;
}
.goods-price {
  font-size: 30rpx;
  color: #f53f3f;
  display: block;
  margin-bottom: 10rpx;
}
.goods-tag {
  font-size: 24rpx;
  background: #007AFF;
  color: #fff;
  padding: 5rpx 10rpx;
  border-radius: 5rpx;
}
.purchased-btn {
  position: fixed;
  bottom: 30rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}
</style>