<template>
  <view class="mall-container">
    <!-- 商品列表 -->
    <scroll-view class="goods-list" scroll-y>
      <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="toGoodsDetail(item)">
        <uni-card :shadow="false">
          <view class="goods-info">
            <image class="goods-img" src="/static/default_user_head.jpg" mode="widthFix"></image>
            <view class="goods-desc">
              <text class="goods-name">{{ item.name }}</text>
              <text class="goods-price">现价 ¥{{ item.current_price }}</text>
              <text class="goods-tag">{{ item.type_name }}</text>
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

// onMounted生命周期
onMounted(() => {
	getProductList()
})

let goodsList = ref([])
function getProductList() {
	let params = {
		type_code:null,
		page_num: 1,
		page_size: 10
	}
	APIService.getProductList(params).then(res => {
		if(res.code == 200){
			goodsList.value = res.data.products
		}else{
			uni.showToast({
				title:"失败",
				icon:None
			})
		}
	})
}

// 跳转到商品详情
function toGoodsDetail(item){
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