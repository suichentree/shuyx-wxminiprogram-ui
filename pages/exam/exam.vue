<template>
  <view class="exam-container">
    <!-- 顶部导航栏 -->
    <view class="exam-nav">
      <view class="nav-search">
        <uni-icons type="search" size="18" color="#999"></uni-icons>
        <input type="text" placeholder="搜索题库" class="search-input" v-model="exam_name"/>
      </view>
		<uni-icons 
		  type="search" 
		  size="24" 
		  color="#409EFF" 
		  class="search-btn"
		  @click="getExamList()" 
		/>
    </view>
    <!-- 题库分类筛选 -->
    <scroll-view class="category-scroll" :scroll-x="true" :show-scrollbar="false">
      <view class="category-list">
        <view class="category-item" :class="{active: index === activeCategory}" 
			v-for="(item, index) in categoryList" :key="index"  @click="handleCategoryClick(index)">
           {{ item.tag }}
        </view>
      </view>
    </scroll-view>

    <!-- 题库列表 -->
    <view class="exam-list">
      <view class="exam-card" v-for="(exam, index) in examList" :key="index">
        <!-- 题库封面/图标 + 信息 头部区域 -->
        <view class="exam-card__header">
          <view class="exam-card__icon">
            <uni-icons type="compose" size="36" :color="randomColor()"></uni-icons>
          </view>
          <!-- 题库信息 -->
          <view class="exam-card__info">
            <text class="exam-title">{{ exam.name }}</text>
            <view class="exam-meta">
              <text class="meta-item">{{ exam.tag }}</text>
            </view>
          </view>
        </view>
        
        <!-- 练习按钮区域 -->
        <view class="exam-card__btns">
          <button class="btn-item practice" @click="toPractice(exam.id)">顺序练习</button>
          <button class="btn-item exam" @click="toKaoshi(exam.id)">模拟考试</button>
          <button class="btn-item error" @click="toErrorPractice(exam.id)">错题练习</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'
import ExamAPIService from '@/api/exam.service.js'

// 用户信息
let userId = getApp().globalData.userId
let exam_name = ref('')
let exam_tag = ref('')
// 分类列表
let categoryList = ref([{"tag":"全部"}])
// 题库列表
let examList = ref([])
// 当前选中的分类
let activeCategory = ref(0)

// onMounted生命周期
onMounted(() => {
	//若已登录
	if (userId != undefined){
		//获取测试列表信息
		getExamList()
			
	}else{
		//若未登录
		uni.showToast({
			title: '请先登录',
			icon: "error",
			duration: 2000
		})
	}
})	

function search(res){
	exam_name.value = res
	getExamList()
}

function handleCategoryClick(index) {
  console.log('点击了分类索引：', index, '当前分类列表：', categoryList.value);
  activeCategory.value = index;
  
  // 筛选逻辑：如果是“全部”（index=0），则查所有；否则按分类标签筛选
  const currentTag = categoryList.value[index].tag;
  if (currentTag === '全部') {
    exam_tag.value = null; 
  } else {
    exam_tag.value = currentTag;
  }
  getExamList()
}

//获取题库题目列表
function getExamList(){
	let params = {page_num:1,page_size:10,exam_name:exam_name.value,exam_tag:exam_tag.value}
	ExamAPIService.getExamList(params).then((res) => {
		if (res.code == 200) {
			examList.value = res.data.exams
			let tags = res.data.tags || [];
			categoryList.value = [{"tag":"全部"}, ...tags];
		} else {
		  // 接口返回非200时，兜底分类列表
		  categoryList.value = [{"tag":"全部"}];
		  uni.showToast({title: '获取分类失败', icon: 'error'});
		}
	}).catch((err) => {
		categoryList.value = [{"tag":"全部"}];
		uni.showToast({title: '获取分类失败', icon: 'error'});
	})
}

//进行顺序练习
function toPractice(id){
	uni.navigateTo({
		url: '/pages/exam/sequencePractice/sequencePracticeInfo?examId='+id
	})
}

//进行模拟考试
function toKaoshi(id){
	uni.navigateTo({
		url: '/pages/exam/kaoshi/kaoshiInfo?examId='+id
	})
}

//进行错题练习
function toErrorPractice(id){
	uni.navigateTo({
		url: '/pages/exam/errorPractice/errorPractice?examId='+id
	})
}

//随机颜色
function randomColor(){
	let a = ['#F56C6C','#409EFF','#67C23A','#E6A23C']
	return a[Math.floor(Math.random()*a.length)]
}
</script>

<style scoped lang="scss">
// 全局容器
.exam-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

// 顶部导航
.exam-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .nav-search {
    display: flex;
    align-items: center;
    background-color: #f5f7fa;
    border-radius: 60rpx;
    padding: 10rpx 20rpx;
    flex: 1; // 占满除按钮外的空间
    margin-right: 20rpx; // 与搜索按钮间距

    .search-input {
      flex: 1;
      font-size: 28rpx;
      margin-left: 10rpx;
      color: #666;
      background: transparent;
    }
	
  }
  
  .search-btn {
    /* 清除移动端点击默认高亮背景 */
    -webkit-tap-highlight-color: transparent;
    /* 优化移动端点击响应速度（避免300ms延迟） */
    touch-action: manipulation;
    /* 过渡动画：让样式变化更自然 */
    transition: all 0.2s ease;
    /* 确保transform缩放生效 */
    display: inline-block;
    /* 可选：增加点击热区 */
    padding: 8px;
    border-radius: 4px;
  }
  
  /* 点击（按下）时的反馈效果 */
  .search-btn:active {
    transform: scale(0.95); /* 轻微缩放，模拟物理按压感 */
    color: #337ecc; /* 颜色加深，强化视觉反馈 */
    opacity: 0.9; /* 轻微透明，提升交互质感 */
    /* 可选：添加背景色反馈 */
    background-color: rgba(64, 158, 255, 0.1);
  }
}

// 分类横向滚动：修复滚动问题核心样式
.category-scroll {
	width: 100%; // 关键：设置scroll-view宽度100%
	white-space: nowrap; // 关键：子元素不换行
	background-color: #fff;
	padding: 0 30rpx;
	box-sizing: border-box; // 关键：padding包含在宽度内
	// 新增：解决移动端点击延迟/无响应
	touch-action: manipulation; 
	-webkit-overflow-scrolling: touch; // 开启iOS弹性滚动	

  .category-list {
    display: inline-flex; // 关键：行内flex，支持横向滚动
    padding: 20rpx 0;
    box-sizing: border-box;

    .category-item {
      padding: 10rpx 24rpx;
      margin-right: 20rpx;
      font-size: 28rpx;
      color: #666;
      border-radius: 40rpx;
      background-color: #f5f7fa;
      transition: all 0.3s;
      white-space: nowrap; // 关键：分类文字不换行
		// 新增：提升点击体验
	      cursor: pointer; // 鼠标悬浮显示手型
	      -webkit-tap-highlight-color: transparent; // 清除移动端点击高亮
	      touch-action: manipulation; // 禁用浏览器默认触摸行为	
		
      &.active {
        background-color: #409eff;
        color: #fff;
      }

      &:last-child {
        margin-right: 0;
      }
	  
	  // 新增：点击态反馈（可选，提升交互感知）
		&:active {
		  transform: scale(0.95);
		  opacity: 0.9;
		}
    }
  }
}

// 题库列表
.exam-list {
  padding: 20rpx 30rpx;

  .exam-card {
    display: flex;
    flex-direction: column; // 改为纵向布局
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;

    &:last-child {
      margin-bottom: 0;
    }

    &:active {
      transform: scale(0.98);
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
    }

    // 卡片头部（图标+信息）
    &__header {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
    }

    // 题库图标
    &__icon {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(64, 158, 255, 0.1);
      border-radius: 12rpx;
      margin-right: 20rpx;
    }

    // 题库信息
    &__info {
      flex: 1;

      .exam-title {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }

      .exam-meta {
        display: flex;
        align-items: center;

        .meta-item {
          font-size: 24rpx;
          color: #666;
          margin-right: 24rpx;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    // 按钮区域
    &__btns {
      display: flex;
      justify-content: space-between;
      gap: 12rpx; // 按钮间距

      .btn-item {
        flex: 1; // 平分宽度
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        border-radius: 8rpx;
        font-size: 26rpx;
        border: none;
        color: #fff;
        padding: 0;

        // 顺序练习按钮样式
        &.practice {
          background-color: #409EFF;
        }

        // 模拟考试按钮样式
        &.exam {
          background-color: #67C23A;
        }

        // 错题练习按钮样式
        &.error {
          background-color: #F56C6C;
        }

        // 点击态
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>