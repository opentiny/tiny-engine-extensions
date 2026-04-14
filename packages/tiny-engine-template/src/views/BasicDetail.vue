<script setup lang="ts">
import { Grid as TinyGrid, GridColumn as TinyGridColumn, Progress as TinyProgress, Modal } from '@opentiny/vue'
import { iconCopy } from '@opentiny/vue-icon'

type DetailItem = {
  label: string
  value: string
  copyable?: boolean
  isStatus?: boolean
}

type DetailSection = {
  title: string
  items: DetailItem[]
}

type TaskStatus = 'freeze' | 'fail' | 'shutdown'

type TaskRow = {
  name: string
  owner: string
  data: string
  status: TaskStatus
  statusLabel: string
  startDate: string
  progress: number
}

const TinyIconCopy = iconCopy()

const detailSections: DetailSection[] = [
  {
    title: '基础信息',
    items: [
      { label: '名称', value: 'Cluster001' },
      { label: 'ID', value: '239f4937-d597-451b-9e15-42', copyable: true },
      { label: '集群版本 | 补丁版本', value: 'v1.19 | v1.3.21' },
      { label: '类型', value: 'CCE集群' },
      { label: '集群状态', value: '运行中', isStatus: true },
      { label: '管理规模', value: '50节点' },
      { label: '创建时间', value: '2023/04/07 16:35:18 GMT+08:00' },
    ],
  },
  {
    title: '网络信息',
    items: [
      { label: '网络类型', value: 'VPC网络' },
      { label: 'VPC', value: 'vpc-noha' },
      { label: '子网', value: 'subnet-4d11' },
      { label: '容器网段', value: '172.16.0.0/16' },
      { label: 'IPv4服务网段', value: '10.247.0.0/16' },
      { label: '转发模式', value: 'iptables' },
      { label: '节点默认安全组', value: 'w00797244-eyhehe' },
    ],
  },
  {
    title: '网络信息',
    items: [
      { label: '内网地址', value: 'https://192.168.1.0:5443', copyable: true },
      { label: '公网地址', value: '--' },
      { label: '自定义SAN', value: '--' },
      { label: 'kubectl', value: '--' },
      { label: '证书认证', value: 'X509 证书' },
    ],
  },
  {
    title: '交易信息',
    items: [
      { label: '计费模式', value: '包年/包月' },
      { label: '最近交易订单', value: 'CS2402071033GCNNI' },
      { label: '创建时间', value: '2024/02/07 10:33:51 GMT+08:00' },
      { label: '到期时间', value: '2025/02/07 10:33:51 GMT+08:00' },
      { label: '到期时间', value: '2024/02/07 10:34:01 GMT+08:00' },
      { label: '到期处理策略', value: '到期进入宽限期' },
    ],
  },
]

const tableRows: TaskRow[] = [
  { name: '智慧物流系统开发', owner: '李晓刚', data: '45678.56', status: 'freeze', statusLabel: '冻结', startDate: '2022-01-15', progress: 45 },
  { name: '智能工厂自动化升级', owner: '张维勇', data: '89.32%', status: 'fail', statusLabel: '失败', startDate: '2021-07-28', progress: 45 },
  { name: '环保材料研发计划', owner: '刘成', data: 'N/A', status: 'shutdown', statusLabel: '关机', startDate: '2023-03-01', progress: 45 },
  { name: '电商平台优化', owner: '赵丹凤', data: '否', status: 'fail', statusLabel: '失败', startDate: '2022-09-12', progress: 45 },
  { name: '大数据分析平台建设', owner: '周伟', data: '3021米', status: 'freeze', statusLabel: '冻结', startDate: '2021-12-14', progress: 45 },
  { name: '智能家居产品设计', owner: '吴志超', data: '24条', status: 'freeze', statusLabel: '冻结', startDate: '2022-01-15', progress: 45 },
]

const copyText = async (text: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const input = document.createElement('textarea')
      input.value = text
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
    }

    Modal.message({ message: '已复制', status: 'success' })
  } catch {
    Modal.message({ message: '复制失败，请手动复制', status: 'warning' })
  }
}

const getStatusClassName = (status: TaskStatus) => {
  if (status === 'fail') return 'is-fail'
  if (status === 'shutdown') return 'is-shutdown'
  return 'is-freeze'
}

const getAvatarText = (name: string) => name.slice(0, 1)
</script>

<template>
  <div class="basic-detail-page">
    <header class="page-heading">
      <h1>详情信息</h1>
    </header>

    <section class="detail-card">
      <h2>详细信息</h2>

      <div class="detail-layout">
        <article v-for="section in detailSections" :key="section.title" class="detail-section">
          <h3>{{ section.title }}</h3>

          <div class="detail-list">
            <div v-for="item in section.items" :key="`${section.title}-${item.label}`" class="detail-item">
              <div class="detail-item__label">{{ item.label }}</div>

              <div class="detail-item__value-row" :class="{ 'is-status': item.isStatus }">
                <span v-if="item.isStatus" class="status-dot" />
                <span class="detail-item__value">{{ item.value }}</span>

                <button
                  v-if="item.copyable"
                  type="button"
                  class="copy-button"
                  aria-label="复制"
                  @click="copyText(item.value)"
                >
                  <component :is="TinyIconCopy" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="table-card">
      <tiny-grid class="detail-table" :data="tableRows" :show-header-overflow="true" :show-overflow="true">
        <tiny-grid-column field="name" title="项目名称" min-width="220" />

        <tiny-grid-column field="owner" title="负责人" min-width="170">
          <template #default="{ row }">
            <div class="owner-cell">
              <div class="owner-avatar-wrap">
                <img class="owner-avatar-image" src="/avatar.png" alt="" />
                <span class="owner-avatar-fallback">{{ getAvatarText(row.owner) }}</span>
              </div>
              <span class="owner-name">{{ row.owner }}</span>
            </div>
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="data" title="数据" min-width="130" />

        <tiny-grid-column field="statusLabel" title="状态" min-width="150">
          <template #default="{ row }">
            <span class="table-status" :class="getStatusClassName(row.status)">
              <span class="table-status__icon" />
              <span>{{ row.statusLabel }}</span>
            </span>
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="startDate" title="开始日期" min-width="150" sortable />

        <tiny-grid-column field="progress" title="当前进度" min-width="220" sortable>
          <template #default="{ row }">
            <div class="progress-cell">
              <tiny-progress :percentage="row.progress" :show-text="false" :stroke-width="6" />
              <span>{{ row.progress }}%</span>
            </div>
          </template>
        </tiny-grid-column>
      </tiny-grid>
    </section>
  </div>
</template>

<style scoped>
.basic-detail-page {
  padding: 22px 24px 28px;
}

.page-heading {
  margin-bottom: 16px;
}

.page-heading h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2329;
}

.detail-card,
.table-card {
  background: #fff;
  border: 1px solid #eef0f2;
  border-radius: 10px;
}

.detail-card {
  padding: 24px 26px 18px;
}

.table-card {
  margin-top: 18px;
  padding: 22px 24px 96px;
}

.detail-card h2 {
  margin: 0 0 24px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2329;
}

.detail-layout {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 52px;
}

.detail-section h3 {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
}

.detail-list {
  display: grid;
  gap: 14px;
}

.detail-item__label {
  font-size: 12px;
  line-height: 18px;
  color: #8a8f99;
}

.detail-item__value-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  min-height: 24px;
}

.detail-item__value-row.is-status {
  gap: 6px;
}

.detail-item__value {
  font-size: 13px;
  line-height: 22px;
  color: #2b2f36;
  word-break: break-word;
}

.status-dot {
  width: 10px;
  height: 10px;
  border: 2px solid #67c23a;
  border-radius: 50%;
  background: #fff;
  flex: 0 0 auto;
}

.copy-button {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  color: #5f6673;
  cursor: pointer;
}

.copy-button :deep(svg) {
  width: 14px;
  height: 14px;
}

.owner-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.owner-avatar-wrap {
  position: relative;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  border-radius: 50%;
  overflow: hidden;
  background: #e7eaef;
}

.owner-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.owner-avatar-fallback {
  position: absolute;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #4b5563;
}

.owner-avatar-image[src=''],
.owner-avatar-image:not([src]) {
  display: none;
}

.owner-avatar-image[src=''] + .owner-avatar-fallback,
.owner-avatar-image:not([src]) + .owner-avatar-fallback {
  display: inline-flex;
}

.owner-name {
  font-size: 13px;
  color: #2b2f36;
}

.table-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #2b2f36;
}

.table-status__icon {
  width: 10px;
  height: 10px;
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
}

.table-status.is-fail .table-status__icon,
.table-status.is-shutdown .table-status__icon {
  border-radius: 50%;
  border: 2px solid currentColor;
  box-sizing: border-box;
}

.table-status.is-freeze {
  color: #f59a23;
}

.table-status.is-freeze .table-status__icon::before {
  content: '';
  position: absolute;
  left: 1px;
  top: -1px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 8px solid currentColor;
}

.table-status.is-fail {
  color: #f23030;
}

.table-status.is-shutdown {
  color: #b7b7b7;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-cell span {
  min-width: 36px;
  font-size: 13px;
  color: #2b2f36;
}

.progress-cell :deep(.tiny-progress) {
  flex: 1;
}

.progress-cell :deep(.tiny-progress-bar__outer) {
  background: #eceff3;
}

.progress-cell :deep(.tiny-progress-bar__inner) {
  background: #67c23a;
}

.detail-table :deep(.tiny-grid) {
  border: none;
}

.detail-table :deep(.tiny-grid__header-wrapper),
.detail-table :deep(.tiny-grid__body-wrapper) {
  border-bottom: none;
}

.detail-table :deep(.tiny-grid-header__row) {
  height: 40px;
  background: #f5f5f5;
}

.detail-table :deep(.tiny-grid-header__column) {
  border-right: none;
  color: #444b56;
  font-size: 13px;
  font-weight: 600;
}

.detail-table :deep(.tiny-grid-body__column) {
  border-right: none;
  color: #2b2f36;
  font-size: 13px;
}

.detail-table :deep(.tiny-grid-body__row) {
  height: 42px;
}

.detail-table :deep(.tiny-grid-body__row .tiny-grid-body__column) {
  border-bottom: 1px solid #f0f1f3;
}

.detail-table :deep(.tiny-grid-cell) {
  padding-top: 12px;
  padding-bottom: 12px;
}

.detail-table :deep(.col__sort) {
  color: #8c919c;
}

@media (max-width: 1400px) {
  .detail-layout {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 24px;
  }
}

@media (max-width: 900px) {
  .basic-detail-page {
    padding: 16px;
  }

  .detail-card,
  .table-card {
    padding-left: 16px;
    padding-right: 16px;
  }

  .detail-layout {
    grid-template-columns: 1fr;
  }
}
</style>
