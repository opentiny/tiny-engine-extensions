<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { Input as TinyInput, TreeMenu as TinyTreeMenu } from '@opentiny/vue'
import { iconSearch } from '@opentiny/vue-icon'

const router = useRouter()
const route = useRoute()
const searchKeyword = ref('')
const TinyIconSearch = iconSearch()
const treeMenuRef = ref<any>(null)

type NavigationTreeNode = {
  id: string
  label: string
  routePath?: string
  children?: NavigationTreeNode[]
}

const navigationTreeData: NavigationTreeNode[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    children: [{ id: '/dashboard/overview', label: '总览', routePath: '/dashboard/overview' }],
  },
  {
    id: 'list',
    label: '列表页',
    children: [
      { id: '/list/basic', label: '基础列表', routePath: '/list/basic' },
      { id: '/list/card', label: '卡片列表', routePath: '/list/card' },
    ],
  },
  {
    id: 'form',
    label: '表单页',
    children: [
      { id: '/form/basic', label: '基础表单', routePath: '/form/basic' },
      { id: '/form/advanced', label: '高级表单', routePath: '/form/advanced' },
      { id: '/form/step', label: '分步表单', routePath: '/form/step' },
    ],
  },
  {
    id: 'detail',
    label: '详情页',
    children: [
      { id: '/detail/basic', label: '基础详情', routePath: '/detail/basic' },
      { id: '/detail/advanced', label: '高级详情', routePath: '/detail/advanced' },
    ],
  },
  {
    id: 'result',
    label: '结果页',
    children: [
      { id: '/result/success', label: '成功页', routePath: '/result/success' },
      { id: '/result/fail', label: '失败页', routePath: '/result/fail' },
    ],
  },
  {
    id: 'profile',
    label: '个人页',
    children: [
      { id: '/profile/center', label: '个人中心', routePath: '/profile/center' },
      { id: '/profile/settings', label: '个人设置', routePath: '/profile/settings' },
    ],
  },
]

const expandedSectionKeys = navigationTreeData.map((section) => section.id)
const treeMenuProps = {
  label: 'label',
  children: 'children',
}

const syncCurrentMenu = async () => {
  await nextTick()
  treeMenuRef.value?.setCurrentKey?.(route.path)
}

const handleMenuNodeClick = (nodeData: NavigationTreeNode) => {
  if (!nodeData.routePath || nodeData.routePath === route.path) {
    return
  }

  router.push(nodeData.routePath)
}

watch(
  () => route.path,
  () => {
    syncCurrentMenu()
  },
  { immediate: true },
)

onMounted(() => {
  syncCurrentMenu()
})
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink to="/dashboard/overview" class="app-brand">
        <img class="app-brand__logo" src="/TinyEngine.svg" alt="" />
        <span class="app-brand__name">TinyEngine</span>
      </RouterLink>

      <div class="app-header__actions">
        <tiny-input
          v-model="searchKeyword"
          class="app-search"
          :prefix-icon="TinyIconSearch"
          placeholder="请输入关键字搜索"
          clearable
        />
        <div class="text">中文</div>
        <div class="text">帮助中心</div>
        <div class="app-profile">
          <span class="app-profile__avatar">歌</span>
        </div>
      </div>
    </header>

    <aside class="app-sidebar">
      <nav class="app-sidebar__nav">
        <tiny-tree-menu
          ref="treeMenuRef"
          class="app-tree-menu"
          node-key="id"
          :data="navigationTreeData"
          :props="treeMenuProps"
          :default-expanded-keys="expandedSectionKeys"
          :show-filter="false"
          :show-title="false"
          :width-adapt="true"
          @node-click="handleMenuNodeClick"
        />
      </nav>
    </aside>

    <div class="app-main">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f5f6f8;
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 14px;
  background: #fff;
  border-bottom: 1px solid #e7eaef;
}

.app-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #222;
  text-decoration: none;
}

.app-brand__logo {
  width: 28px;
  height: 28px;
}

.app-brand__name {
  font-size: 14px;
  font-weight: 600;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-header__actions .text {
  font-size: 14px;
  color: #191919;
}

.app-search {
  width: 220px;
}

.app-profile {
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.app-profile__avatar {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #2f7df6;
  color: #fff;
  font-size: 12px;
}

.app-sidebar {
  position: fixed;
  top: 40px;
  left: 0;
  bottom: 0;
  width: 220px;
  background: #fff;
  border-right: 1px solid #e7eaef;
}

.app-sidebar__nav {
  height: 100%;
  overflow-y: auto;
  padding: 12px 0 18px;
}

.app-main {
  min-height: 100vh;
  padding-top: 40px;
  padding-left: 220px;
  background: #f5f5f5;
}

:deep(.app-tree-menu.tiny-tree-menu) {
  --tv-TreeMenu-width: 100%;
  --tv-TreeMenu-node-height: 32px;
  --tv-TreeMenu-node-margin-bottom: 2px;
  background: transparent;
}

:deep(.app-tree-menu.tiny-tree-menu::before) {
  display: none;
}

:deep(.app-tree-menu .tiny-tree) {
  padding-top: 0;
}

:deep(.app-tree-menu .tiny-tree::before) {
  display: none;
}

:deep(.app-tree-menu .tiny-tree-node__content) {
  margin-bottom: 2px;
}

:deep(.app-tree-menu .tiny-tree-node__content-left) {
  padding-left: 12px;
  padding-right: 12px;
}

:deep(.app-tree-menu .tree-node-body) {
  width: 100%;
}

:deep(.app-search .tiny-input__inner) {
  height: 28px;
  font-size: 12px;
  background: #f7f8fa;
  border-color: #eef1f4;
}

@media (max-width: 1220px) {
  .app-shell {
    padding-top: 40px;
  }

  .app-sidebar {
    position: static;
    width: auto;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e7eaef;
  }

  .app-main {
    padding-top: 0;
    padding-left: 0;
  }
}

@media (max-width: 900px) {
  .app-header {
    height: auto;
    min-height: 40px;
    align-items: flex-start;
    flex-direction: column;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .app-header__actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .app-search {
    width: 100%;
  }

  .app-shell {
    padding-top: 72px;
  }

  .app-sidebar {
    top: 72px;
  }
}
</style>
