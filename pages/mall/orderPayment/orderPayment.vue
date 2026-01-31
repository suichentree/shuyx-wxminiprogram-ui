<template>
  <view class="payment-container">
    <!-- 商品信息卡片 -->
    <uni-card class="goods-card">
      <view class="goods-info">
        <!-- 商品图片 -->
        <image class="goods-img" src="/static/default_user_head.jpg" mode="widthFix"></image>
        <view class="goods-desc">
          <text class="goods-name">{{ goodsInfo.name }}</text>
          <text class="goods-price">¥{{ goodsInfo.current_price }}</text>
        </view>
      </view>
    </uni-card>

    <!-- 支付方式选择（核心美化区域） -->
    <uni-card class="pay-type-card">
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
                // 关键修改1：从固定判断value=2改为动态判断isDisabled
                disabled: option.isDisabled
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
      :disabled="!selectedPayType || getIsDisabled(selectedPayType)"
    >
      确认支付
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import APIService from '@/api/product.service.js'
import orderAPIService from '@/api/order.service.js'
import { onLoad } from "@dcloudio/uni-app";

let userId = ref(null)
let goodsId = ref(null)
// 页面加载获取商品参数
onLoad((options) => {
	goodsId.value = options.goodsId;
	userId.value = getApp().globalData.userId
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

// 选中的支付方式（默认选第一个可用的支付方式）
const selectedPayType = ref('');
// 支付方式列表
const paylist = ref([
  { value: '1', text: '微信支付', isDisabled: false }, 
  { value: '2', text: '支付宝支付', isDisabled: true },
  { value: '3', text: '银行卡支付', isDisabled: false }
]);

// 辅助方法：根据value判断是否禁用
const getIsDisabled = (value) => {
  const item = paylist.value.find(item => item.value === value);
  return item ? item.isDisabled : true;
};

// 支付方式变更处理
// 关键修改2：从硬编码判断支付宝改为通用的isDisabled判断
const handlePayTypeChange = (e) => {
  const selectedValue = e.detail.value;
  const selectedItem = paylist.value.find(item => item.value === selectedValue);

  // 如果选中了禁用的项
  if (selectedItem && selectedItem.isDisabled) {
    uni.showToast({
      title: `${selectedItem.text}暂不支持使用`,
      icon: 'none',
      duration: 1500
    });
  }
};

// 提交支付
const submitPayment = () => {
  // 模拟调起支付
  uni.showLoading({ title: '开始创建订单，并调起支付...' });
  
  //创建订单信息
  let productIdArray = []
  productIdArray.push(goodsId.value)
  orderAPIService.createOrder({userId:userId.value,productIds:productIdArray}).then(res => {
	  if(res.code == 200){
		uni.hideLoading();
		
		//调用微信下单接口，跳转到微信支付页面
		
	  	uni.showToast({
	  		title:"下单成功",
	  		icon:"success"
	  	})
	  }else{
		uni.hideLoading();
		uni.showToast({
			title:res.message,
			icon:"none"
		})
	  }
  })
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
/* 禁用态（动态绑定） */
.option-item.disabled {
  opacity: 0.6;
  pointer-events: none; /* 禁止点击 */
  color: #999;
}
/* 未选中 hover 态 */
.option-item:not(.active):not(.disabled):hover {
  background-color: #f8f9fa;
}

/* 支付方式文字 */
.option-text {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}
/* 禁用项文字颜色 */
.option-item.disabled .option-text {
  color: #999;
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
</style>