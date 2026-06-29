<template>
  <div class="main-container">
    <!-- 响应式布局容器 -->
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-aside :width="asideWidth" class="aside-menu">
        <!-- 标题区域 -->
        <div class="menu-header">
          <h3 v-if="!isCollapsed">
            <el-icon>
              <Menu/>
            </el-icon>
            <span>系统菜单</span>
          </h3>
          <h3 v-else>
            <el-icon>
              <Menu/>
            </el-icon>
          </h3>
          <!-- 移动端菜单折叠按钮 -->
          <el-button
              v-if="isMobile"
              @click="toggleCollapse"
              class="collapse-btn"
              :icon="collapseIcon"
              circle
              size="small"
          />
        </div>

        <!-- 菜单区域 -->
        <el-menu
            :default-active="activeMenu"
            class="menu-list"
            :collapse="isCollapsed && !isMobile"
            @select="handleMenuSelect"
            :unique-opened="true"
            :router="true"
        >
          <el-sub-menu v-for="mg in menus"
                       :index="mg.path"
          >
            <template #title>
              <el-icon>
                <Document/>
              </el-icon>
              <span>{{ mg.meta?.title }}</span>
            </template>

            <el-menu-item v-for="m in mg.children"
                          :index="m.path"
            >
              {{ m.meta?.title }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>

        <!-- 折叠按钮（桌面端） -->
        <div v-if="!isMobile" class="collapse-container">
          <el-button
              @click="toggleCollapse"
              class="collapse-btn"
              :icon="collapseIcon"
              circle
              size="small"
          />
        </div>
      </el-aside>

      <!-- 主内容区域 -->
      <el-container class="content-container">
        <!-- 顶部面包屑导航 -->
        <el-header class="content-header">
          <div class="breadcrumb">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="item in breadcrumb" :key="item">
                {{ item }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="user-info">
            <el-avatar :size="32" icon="UserFilled"/>
            <span class="username">管理员</span>
          </div>
        </el-header>

        <!-- 内容展示区域 -->
        <el-main class="content-main">
          <!-- 路由出口 -->
          <div class="content-wrapper">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {Document, Expand, Fold, Menu} from '@element-plus/icons-vue'
import {appConfig} from "@/appconfig";
import routes from '@/routes-data'
import {JSEncrypt} from "jsencrypt";
import {ApiRequest, Session} from '@/utils';

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式状态
const activeMenu = ref('/dashboard')
const isCollapsed = ref(false)
const isMobile = ref(false)
const windowWidth = ref(window.innerWidth)

const menus = computed(() => {
  return routes[0].children;
})

const breadcrumb = computed(() => {
  return route.meta.title ? [route.meta.title] : []
})

const asideWidth = computed(() => {
  if (isMobile.value) {
    return isCollapsed.value ? '0px' : '220px'
  }
  return isCollapsed.value ? '64px' : '220px'
})

const collapseIcon = computed(() => {
  return isCollapsed.value ? Expand : Fold
})

// 方法
const handleMenuSelect = (index) => {
  activeMenu.value = index
  router.push(index)
  // 移动端点击菜单后自动收起菜单
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const checkIsMobile = () => {
  windowWidth.value = window.innerWidth
  isMobile.value = windowWidth.value <= 768
  // 移动端默认收起菜单
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// 监听路由变化
const updateActiveMenu = () => {
  activeMenu.value = route.path
}

// 自动登录
const autoLogin = () => {
  const rsa = new JSEncrypt();
  rsa.setPublicKey(appConfig.rsaPublicKey);

  ApiRequest.post('/api/auth/token', {
    appId: '',
    appClient: 'admin',
    authId: 1,
    type: '10',
    username: 'admin',
    password: rsa.encrypt('123456'),
    code: '',
    codeImg: ''
  }).then(response => {
    Session.setTokenStorage(response.data);
  }).catch(error => {
    console.error('Error:', error);
  });
}

// 生命周期钩子
onMounted(() => {
  autoLogin()
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  updateActiveMenu()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<style scoped>
.main-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f7fa;
}

.layout-container {
  height: 100vh;
}

/* 侧边栏样式 */
.aside-menu {
  transition: width 0.3s;
  position: relative;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 18px;
  font-weight: 600;
}

.menu-list {
  border-right: none;
  background-color: transparent;
  flex: 1;
  overflow-y: auto;
}

.menu-list:not(.el-menu--collapse) {
  width: 100%;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  color: #333333;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(64, 158, 255, 0.2);
  color: #409eff;
}

.collapse-container {
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn {
  border: none;
}

.collapse-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 主内容区样式 */
.content-container {
  display: flex;
  flex-direction: column;
}

.content-header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.breadcrumb {
  flex: 1;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-weight: 500;
  color: #333;
}

.content-main {
  padding: 10px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 路由视图容器 */
.content-wrapper {
  min-height: 500px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .aside-menu {
    position: absolute;
    z-index: 1000;
    height: 100%;
  }

  .menu-header h3 {
    font-size: 16px;
  }

  .content-main {
    padding: 10px;
  }
}

@media (max-width: 576px) {
  .content-header {
    flex-direction: column;
    height: auto;
    padding: 10px;
    gap: 10px;
  }

  .breadcrumb {
    width: 100%;
  }

  .user-info {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>