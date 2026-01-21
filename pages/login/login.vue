<template>
  <view class="login-container">
    <view class="login-content">
      <!-- 顶部装饰 -->
      <view class="header-decoration">
        <view class="circle circle-1"></view>
        <view class="circle circle-2"></view>
        <view class="circle circle-3"></view>
      </view>
      
      <!-- 登录标题 -->
      <view class="login-header">
        <text class="login-title">欢迎回来</text>
        <text class="login-subtitle">登录您的账户继续使用</text>
      </view>
      
      <!-- 登录表单 -->
      <view class="login-form">
        <view class="form-item">
          <view class="input-wrapper">
            <uni-icons type="person" size="20" color="#999" class="input-icon"></uni-icons>
            <input 
              class="form-input" 
              type="text" 
              v-model="formData.username" 
              placeholder="请输入您的账号"
              placeholder-class="input-placeholder"
            />
          </view>
        </view>
        
        <view class="form-item">
          <view class="input-wrapper">
            <uni-icons type="locked" size="20" color="#999" class="input-icon"></uni-icons>
            <input 
              class="form-input" 
              :type="showPassword ? 'text' : 'password'" 
              v-model="formData.password" 
              placeholder="请输入您的密码"
              placeholder-class="input-placeholder"
            />
            <uni-icons 
              :type="showPassword ? 'eye-slash' : 'eye'" 
              size="20" 
              color="#999" 
              class="password-toggle"
              @click="togglePassword"
            ></uni-icons>
          </view>
        </view>
        
        <view class="form-options">
          <view class="remember-me" @click="toggleRemember">
            <uni-icons :type="rememberMe ? 'checkbox-filled' : 'checkbox'" size="18" :color="rememberMe ? '#667eea' : '#999'"></uni-icons>
            <text class="option-text">记住我</text>
          </view>
          <text class="forgot-password" @click="forgotPassword">忘记密码?</text>
        </view>
        
		<view @click="submitLogin" class="form-btn" style="text-align: center;padding: 10px;background: linear-gradient(135deg, #667eea 0%, #736da2 100%);">
		  <uni-button 
			type="primary" 
			size="default" 
			:loading="isLoading"
			class="custom-login-btn"
		  >
			登录
		  </uni-button>
		</view>
      </view>
      <!-- 底部链接 -->
      <view class="login-footer">
        <text class="footer-text">还没有账号?</text>
        <text class="footer-link" @click="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import LoginAPIService from '@/api/login.service.js'

// 表单数据
const formData = reactive({
  username: '',
  password: ''
});

// 状态变量
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);

// 方法
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleRemember = () => {
  rememberMe.value = !rememberMe.value;
};

const submitLogin = () => {
  // 登录逻辑
  isLoading.value = true;
  
  try {
  	  let params = {username: formData.username,password: formData.password}
  	  LoginAPIService.Login(params).then((res) => {
  	  	if (res.code == 200) {
  	  		// 登录成功：1. 存储token等信息 2. 跳转页面
  	  		uni.setStorageSync('token', res.data.token) // 存储token
			uni.setStorageSync('userId', res.data.userId) // 存储用户信息
			uni.setStorageSync('userName', res.data.userName) // 存储用户信息
			//跳转
			uni.switchTab({
			  url: '/pages/exam/exam',
			})
  	  	} else {
  		  // 登录失败提示
  		  uni.showToast({
  			title: '登录失败',
  			icon: 'none'
  		  })
  		}
  	  })
  
  } catch (error) {
		// 网络错误等异常处理
		uni.showToast({
		  title: '网络异常，请稍后重试',
		  icon: 'none'
		})
		console.error('登录接口调用失败：', error)
  } finally {
		// 关闭加载状态
		isLoading.value = false
  }
}

const forgotPassword = () => {
  // 忘记密码逻辑
  uni.navigateTo({
    url: '/pages/forgot-password/forgot-password'
  })
};

const goToRegister = () => {
  // 跳转到注册页面
  uni.navigateTo({
    url: '/pages/register/register'
  })
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  position: relative;
  overflow: hidden;
}

.login-content {
  flex: 1;
  padding: 80rpx 40rpx;
  position: relative;
  z-index: 1;
}

.header-decoration {
  position: absolute;
  top: -100rpx;
  right: -100rpx;
  width: 400rpx;
  height: 400rpx;
  z-index: -1;
  
  .circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
  }
  
  .circle-1 {
    width: 300rpx;
    height: 300rpx;
    background-color: #667eea;
    top: 0;
    right: 0;
  }
  
  .circle-2 {
    width: 200rpx;
    height: 200rpx;
    background-color: #764ba2;
    top: 50rpx;
    right: 50rpx;
  }
  
  .circle-3 {
    width: 100rpx;
    height: 100rpx;
    background-color: #667eea;
    top: 100rpx;
    right: 100rpx;
  }
}

.login-header {
  margin-bottom: 60rpx;
  
  .login-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }
  
  .login-subtitle {
    display: block;
    font-size: 28rpx;
    color: #999;
  }
}

.login-form {
  margin-bottom: 40rpx;
  
  .form-item {
    margin-bottom: 30rpx;
    
    .input-wrapper {
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 12rpx;
      padding: 0 20rpx;
      height: 90rpx;
      box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.05);
      
      .input-icon {
        margin-right: 15rpx;
      }
      
      .form-input {
        flex: 1;
        height: 100%;
        font-size: 30rpx;
        color: #333;
      }
      
      .input-placeholder {
        color: #ccc;
      }
      
      .password-toggle {
        margin-left: 10rpx;
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    
    .remember-me {
      display: flex;
      align-items: center;
      
      .option-text {
        font-size: 26rpx;
        color: #666;
        margin-left: 10rpx;
      }
    }
    
    .forgot-password {
      font-size: 26rpx;
      color: #667eea;
    }
  }
  
  
}

.login-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
  
  .footer-text {
    font-size: 28rpx;
    color: #999;
    margin-right: 10rpx;
  }
  .footer-link {
    font-size: 28rpx;
    color: #667eea;
    font-weight: 500;
  }
}
</style>