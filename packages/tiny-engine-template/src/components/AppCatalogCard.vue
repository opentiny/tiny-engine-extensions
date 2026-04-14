<script setup lang="ts">
import { computed } from 'vue'
import { Dropdown as TinyDropdown, Tag as TinyTag } from '@opentiny/vue'
import { iconEllipsis } from '@opentiny/vue-icon'

const TinyIconEllipsis = iconEllipsis()

type CardAction = 'edit' | 'delete' | 'export'

type AppCard = {
  id: number
  title: string
  description: string
  category: string
  iconSrc: string
  iconColor?: string
  iconAccent?: string
  owner: string
  updatedAt: string
  tags: Array<{
    label: string
    type: 'success' | 'warning' | 'info' | 'danger'
  }>
  selected: boolean
}

const props = defineProps<{
  app: AppCard
}>()

const emit = defineEmits<{
  action: [payload: { id: number; action: CardAction }]
  select: [id: number]
}>()

const menuOptions = computed(() => ({
  options: [
    { id: 'edit', label: '修改' },
    { id: 'delete', label: '删除' },
    { id: 'export', label: '导出' },
  ],
  textField: 'label',
  placement: 'bottom-end',
  popperClass: 'app-card-menu',
}))

const cardIconStyle = computed(() => ({
  '--card-icon': props.app.iconColor || '#4a7bff',
  '--card-accent': props.app.iconAccent || '#8bb0ff',
}))

const normalizeCommand = (payload: any): CardAction | undefined => {
  const command = payload?.itemData?.id ?? payload?.id ?? payload?.itemData?.label ?? payload?.label ?? payload

  if (command === 'edit' || command === 'delete' || command === 'export') {
    return command
  }

  return undefined
}

const handleMenuClick = (payload: any) => {
  const action = normalizeCommand(payload)

  if (action) {
    emit('action', { id: props.app.id, action })
  }
}
</script>

<template>
  <article
    class="app-catalog-card"
    :class="{ 'is-selected': app.selected }"
    @click="emit('select', app.id)"
  >
    <div class="app-catalog-card__menu" @click.stop>
      <tiny-dropdown
        trigger="click"
        :show-icon="false"
        :menu-options="menuOptions"
        @item-click="handleMenuClick"
      >
        <button type="button" class="app-catalog-card__menu-trigger">
          <TinyIconEllipsis />
        </button>
      </tiny-dropdown>
    </div>

    <div class="app-catalog-card__head">
      <div class="app-catalog-card__icon" :style="cardIconStyle">
        <img :src="app.iconSrc" alt="" />
      </div>
      <span v-if="app.selected" class="app-catalog-card__selected">已选</span>
    </div>

    <h3>{{ app.title }}</h3>
    <p>{{ app.description }}</p>

    <div class="app-catalog-card__meta">
      <span>{{ app.owner }}</span>
      <span>{{ app.updatedAt }}</span>
    </div>

    <div class="app-catalog-card__tags">
      <tiny-tag
        v-for="tag in app.tags"
        :key="tag.label"
        :type="tag.type"
        effect="light"
        size="small"
      >
        {{ tag.label }}
      </tiny-tag>
    </div>
  </article>
</template>

<style scoped>
.app-catalog-card {
  position: relative;
  min-height: 224px;
  padding: 20px 22px 18px;
  border: 1px solid #ebeef2;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.app-catalog-card:hover {
  border-color: #d7dde8;
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.04);
}

.app-catalog-card.is-selected {
  border-color: #2f7df6;
  box-shadow: 0 0 0 2px rgba(47, 125, 246, 0.08);
}

.app-catalog-card__menu {
  position: absolute;
  top: 14px;
  right: 12px;
}

.app-catalog-card__menu-trigger {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #a0a7b4;
  cursor: pointer;
}

.app-catalog-card__menu-trigger:hover {
  background: #f5f7fa;
  color: #606266;
}

.app-catalog-card__menu-trigger :deep(svg) {
  width: 16px;
  height: 16px;
}

.app-catalog-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.app-catalog-card__icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
}

.app-catalog-card__icon img {
  width: 100%;
}

.app-catalog-card__selected {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(47, 125, 246, 0.08);
  color: #2f7df6;
  font-size: 12px;
  font-weight: 600;
}

.app-catalog-card h3 {
  margin: 16px 0 0;
  color: #222;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
}

.app-catalog-card p {
  margin: 12px 0 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.app-catalog-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
  color: #909399;
  font-size: 12px;
}

.app-catalog-card__tags {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 14px;
}

:deep(.app-catalog-card__tags .tiny-tag) {
  border: none;
  font-size: 12px;
}
</style>
