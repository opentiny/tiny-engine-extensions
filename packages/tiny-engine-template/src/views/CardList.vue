<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  Button as TinyButton,
  ButtonGroup as TinyButtonGroup,
  DialogBox as TinyDialogBox,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Pager as TinyPager,
  Select as TinySelect,
  Modal,
} from '@opentiny/vue'
import { iconHelpCircle, iconPlus, iconRefresh, iconSearch } from '@opentiny/vue-icon'
import AppCatalogCard from '../components/AppCatalogCard.vue'

const TinyIconHelpCircle = iconHelpCircle()
const TinyIconPlus = iconPlus()
const TinyIconRefresh = iconRefresh()
const TinyIconSearch = iconSearch()

type AppCategory = 'all' | 'service' | 'design'
type AppTagType = 'success' | 'warning' | 'info' | 'danger'
type AppAction = 'edit' | 'delete' | 'export'
type EditorMode = 'create' | 'edit'

type AppTag = {
  label: string
  type: AppTagType
}

type CatalogRecord = {
  id: number
  title: string
  description: string
  category: Exclude<AppCategory, 'all'>
  iconSrc: string
  iconColor?: string
  iconAccent?: string
  owner: string
  updatedAt: string
  tags: AppTag[]
}

type AppItem = CatalogRecord & {
  selected: boolean
}

type EditorForm = {
  title: string
  owner: string
  category: Exclude<AppCategory, 'all'>
  description: string
  tagLabels: string
}

const activeCategory = ref<AppCategory>('all')
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(8)
const isRefreshing = ref(false)
const lastSyncAt = ref('')

const editorDialogVisible = ref(false)
const editorMode = ref<EditorMode>('create')
const editingId = ref<number | null>(null)
const editorFormRef = ref<any>(null)

const deleteDialogVisible = ref(false)
const deleteTargets = ref<AppItem[]>([])

const categoryTabs = [
  { text: '全部应用', value: 'all' },
  { text: '开发服务', value: 'service' },
  { text: '交互设计', value: 'design' },
]

const categoryOptions = [
  { label: '开发服务', value: 'service' },
  { label: '交互设计', value: 'design' },
]

const seedAppItems: CatalogRecord[] = [
  {
    id: 1,
    title: 'Tiny DesignLink 设计流',
    description: '设计、协同和资产管理一体化，帮助团队串联需求、设计评审与研发交付。',
    category: 'design',
    iconSrc: '/card_icon1.svg',
    iconColor: '#4a7bff',
    iconAccent: '#7ea6ff',
    owner: '李清',
    updatedAt: '2026-04-03 09:12',
    tags: [
      { label: '交互设计', type: 'info' },
      { label: '视觉设计', type: 'warning' },
    ],
  },
  {
    id: 2,
    title: 'TinyUI 组件工程台',
    description: '统一管理组件库版本、依赖升级和发布流水线，支持研发团队按环境分批发布。',
    category: 'service',
    iconSrc: '/card_icon2.svg',
    iconColor: '#29b37e',
    iconAccent: '#6dd3a8',
    owner: '周越',
    updatedAt: '2026-04-02 18:20',
    tags: [{ label: '开发', type: 'success' }],
  },
  {
    id: 3,
    title: 'TinyPlus 业务中台',
    description: '聚合公共业务能力，沉淀表单、流程和权限模型，缩短中后台应用建设周期。',
    category: 'service',
    iconSrc: '/card_icon3.svg',
    iconColor: '#f28c36',
    iconAccent: '#ffb36d',
    owner: '陈赫',
    updatedAt: '2026-04-02 15:36',
    tags: [{ label: '开发', type: 'success' }],
  },
  {
    id: 4,
    title: 'Tiny Stage 工程 CLI',
    description: '支持脚手架、环境配置和构建插件统一下发，覆盖多仓库前端工程化场景。',
    category: 'service',
    iconSrc: '/card_icon4.svg',
    iconColor: '#7b61ff',
    iconAccent: '#a28eff',
    owner: '韩松',
    updatedAt: '2026-04-01 20:05',
    tags: [{ label: '工程化', type: 'success' }],
  },
  {
    id: 5,
    title: 'Tiny Flow API 编排',
    description: '通过可视化节点组合接口逻辑，减少 BFF 与聚合接口的重复开发成本。',
    category: 'service',
    iconSrc: '/card_icon5.svg',
    iconColor: '#0f9ad6',
    iconAccent: '#69c8ef',
    owner: '王岚',
    updatedAt: '2026-04-01 16:48',
    tags: [{ label: '接口编排', type: 'info' }],
  },
  {
    id: 6,
    title: 'Tiny Gate 门禁流程',
    description: '将审批、门禁和考勤串联成统一流程，方便在项目试运行阶段快速校验权限策略。',
    category: 'service',
    iconSrc: '/card_icon6.svg',
    iconColor: '#ec6d5e',
    iconAccent: '#f6a198',
    owner: '许诺',
    updatedAt: '2026-03-31 11:25',
    tags: [{ label: '测试验证', type: 'info' }],
  },
  {
    id: 7,
    title: 'Console Framework 控制台',
    description: '面向云服务控制台的页面骨架和统一规范，支持团队快速搭建管理界面。',
    category: 'service',
    iconSrc: '/card_icon7.svg',
    iconColor: '#1f6feb',
    iconAccent: '#69a2ff',
    owner: '罗宁',
    updatedAt: '2026-03-31 09:40',
    tags: [
      { label: '开发', type: 'success' },
      { label: '测试验证', type: 'info' },
      { label: '上线', type: 'warning' },
    ],
  },
  {
    id: 8,
    title: 'Node BFF Framework',
    description: '面向 Node.js 的 BFF 方案，内置网关鉴权、日志追踪和接口聚合能力。',
    category: 'service',
    iconSrc: '/card_icon8.svg',
    iconColor: '#00a870',
    iconAccent: '#54d2a3',
    owner: '沈尧',
    updatedAt: '2026-03-30 19:10',
    tags: [
      { label: '开发', type: 'success' },
      { label: '稳定性', type: 'info' },
    ],
  },
  {
    id: 9,
    title: 'Furion 体验监控',
    description: '监控首屏、交互耗时和页面稳定性，帮助产品团队量化用户体验变化。',
    category: 'design',
    iconSrc: '/card_icon9.svg',
    iconColor: '#d96c17',
    iconAccent: '#f0a85e',
    owner: '姚芷',
    updatedAt: '2026-03-30 14:55',
    tags: [{ label: '体验度量', type: 'warning' }],
  },
  {
    id: 10,
    title: 'Tiny Motion 动效规范',
    description: '沉淀页面过渡和反馈节奏，帮助不同产品线输出一致的品牌动效语言。',
    category: 'design',
    iconSrc: '/card_icon2.svg',
    iconColor: '#c84cff',
    iconAccent: '#df8bff',
    owner: '顾青',
    updatedAt: '2026-03-29 18:16',
    tags: [{ label: '交互设计', type: 'info' }],
  },
  {
    id: 11,
    title: 'Tiny Mock 数据服务',
    description: '提供低成本接口模拟与协同联调能力，方便前后端并行推进页面开发。',
    category: 'service',
    iconSrc: '/card_icon1.svg',
    iconColor: '#16a34a',
    iconAccent: '#72d68f',
    owner: '杜衡',
    updatedAt: '2026-03-29 10:08',
    tags: [{ label: '开发', type: 'success' }],
  },
  {
    id: 12,
    title: 'Tiny Board 设计画板',
    description: '支持多人协作、版本回溯与素材复用，帮助设计团队沉淀可复用资产。',
    category: 'design',
    iconSrc: '/card_icon5.svg',
    iconColor: '#e85aad',
    iconAccent: '#f39fce',
    owner: '宋禾',
    updatedAt: '2026-03-28 17:42',
    tags: [{ label: '视觉设计', type: 'warning' }],
  },
]

const defaultEditorForm = (): EditorForm => ({
  title: '',
  owner: '',
  category: activeCategory.value === 'design' ? 'design' : 'service',
  description: '',
  tagLabels: '',
})

const editorForm = reactive<EditorForm>(defaultEditorForm())

const editorRules = {
  title: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  category: [{ required: true, message: '请选择应用分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入应用描述', trigger: 'blur' }],
}

const catalogStore = ref<CatalogRecord[]>(cloneRecords(seedAppItems))
const appItems = ref<AppItem[]>([])

function cloneRecords(records: CatalogRecord[]): CatalogRecord[] {
  return records.map((record) => ({
    ...record,
    tags: record.tags.map((tag) => ({ ...tag })),
  }))
}

function toAppItems(records: CatalogRecord[], selectedIds = new Set<number>()): AppItem[] {
  return records.map((record) => ({
    ...record,
    tags: record.tags.map((tag) => ({ ...tag })),
    selected: selectedIds.has(record.id),
  }))
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function formatDateTime(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function createTags(rawLabels: string, category: Exclude<AppCategory, 'all'>): AppTag[] {
  const labels = rawLabels
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (!labels.length) {
    return category === 'design'
      ? [{ label: '交互设计', type: 'info' }]
      : [{ label: '开发', type: 'success' }]
  }

  const tagTypes: AppTagType[] =
    category === 'design' ? ['info', 'warning', 'danger'] : ['success', 'info', 'warning']

  return labels.slice(0, 4).map((label, index) => ({
    label,
    type: tagTypes[index % tagTypes.length],
  }))
}

async function syncCatalogFromStore(options: { silent?: boolean } = {}) {
  const selectedIds = new Set(appItems.value.filter((item) => item.selected).map((item) => item.id))

  isRefreshing.value = true
  await wait(220)
  appItems.value = toAppItems(catalogStore.value, selectedIds)
  lastSyncAt.value = formatDateTime()
  isRefreshing.value = false

  if (!options.silent) {
    Modal.message({ message: '卡片数据已刷新', status: 'success' })
  }
}

const filteredApps = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  return appItems.value.filter((item) => {
    const matchCategory = activeCategory.value === 'all' || item.category === activeCategory.value
    const matchKeyword =
      !query ||
      [item.title, item.description, item.owner, item.updatedAt, ...item.tags.map((tag) => tag.label)]
        .some((field) => field.toLowerCase().includes(query))

    return matchCategory && matchKeyword
  })
})

const total = computed(() => filteredApps.value.length)
const selectedApps = computed(() => appItems.value.filter((item) => item.selected))
const selectedCount = computed(() => selectedApps.value.length)

const pagedApps = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value

  return filteredApps.value.slice(start, start + pageSize.value)
})

const nextId = computed(() =>
  catalogStore.value.reduce((max, item) => Math.max(max, item.id), 0) + 1,
)

const emptyDescription = computed(() =>
  keyword.value.trim()
    ? `没有匹配“${keyword.value.trim()}”的应用，可以调整搜索词后重试。`
    : '当前分类下还没有应用，可以先创建一个新的卡片应用。',
)

watch([activeCategory, keyword], () => {
  currentPage.value = 1
})

watch([pageSize, total], () => {
  const maxPage = Math.max(1, Math.ceil(total.value / pageSize.value))

  if (currentPage.value > maxPage) {
    currentPage.value = maxPage
  }
})

onMounted(() => {
  void syncCatalogFromStore({ silent: true })
})

const resetEditorForm = () => {
  Object.assign(editorForm, defaultEditorForm())
}

const openCreateDialog = () => {
  editorMode.value = 'create'
  editingId.value = null
  resetEditorForm()
  editorDialogVisible.value = true
}

const openEditDialog = (app: AppItem) => {
  editorMode.value = 'edit'
  editingId.value = app.id
  Object.assign(editorForm, {
    title: app.title,
    owner: app.owner,
    category: app.category,
    description: app.description,
    tagLabels: app.tags.map((tag) => tag.label).join('，'),
  })
  editorDialogVisible.value = true
}

const closeEditorDialog = () => {
  editorDialogVisible.value = false
  editingId.value = null
  resetEditorForm()
  editorFormRef.value?.clearValidate?.()
}

const saveEditorDialog = () => {
  editorFormRef.value?.validate?.(async (valid: boolean) => {
    if (!valid) {
      Modal.message({ message: '请先补全应用信息', status: 'warning' })
      return
    }

    const iconSrc = editorForm.category === 'design' ? '/card_icon5.svg' : '/card_icon2.svg'
    const iconColor = editorForm.category === 'design' ? '#c84cff' : '#29b37e'
    const iconAccent = editorForm.category === 'design' ? '#df8bff' : '#6dd3a8'
    const record: CatalogRecord = {
      id: editingId.value ?? nextId.value,
      title: editorForm.title.trim(),
      owner: editorForm.owner.trim(),
      category: editorForm.category,
      description: editorForm.description.trim(),
      iconSrc,
      iconColor,
      iconAccent,
      updatedAt: formatDateTime(),
      tags: createTags(editorForm.tagLabels, editorForm.category),
    }

    if (editorMode.value === 'create') {
      catalogStore.value = [record, ...catalogStore.value]
      currentPage.value = 1
    } else {
      catalogStore.value = catalogStore.value.map((item) =>
        item.id === record.id ? record : item,
      )
    }

    closeEditorDialog()
    await syncCatalogFromStore({ silent: true })
    Modal.message({
      message: editorMode.value === 'create' ? '应用已创建' : '应用已更新',
      status: 'success',
    })
  })
}

const toggleCardSelection = (id: number) => {
  appItems.value = appItems.value.map((item) =>
    item.id === id ? { ...item, selected: !item.selected } : item,
  )
}

const clearSelection = () => {
  appItems.value = appItems.value.map((item) => ({ ...item, selected: false }))
}

const exportApps = (items: AppItem[], filename: string) => {
  const payload = {
    exportedAt: formatDateTime(),
    total: items.length,
    items: items.map(({ selected, ...rest }) => rest),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

const handleExportSelected = () => {
  if (!selectedCount.value) {
    Modal.message({ message: '请先选择要导出的应用', status: 'warning' })
    return
  }

  exportApps(selectedApps.value, '已选应用.json')
  Modal.message({ message: '已导出所选应用', status: 'success' })
}

const handleExportSingle = (app: AppItem) => {
  exportApps([app], `${app.title}.json`)
  Modal.message({ message: `${app.title} 已导出`, status: 'success' })
}

const openDeleteDialog = (targets: AppItem[]) => {
  if (!targets.length) {
    Modal.message({ message: '请先选择要删除的应用', status: 'warning' })
    return
  }

  deleteTargets.value = targets.map((item) => ({ ...item, tags: item.tags.map((tag) => ({ ...tag })) }))
  deleteDialogVisible.value = true
}

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false
  deleteTargets.value = []
}

const confirmDelete = async () => {
  const targetIds = new Set(deleteTargets.value.map((item) => item.id))

  catalogStore.value = catalogStore.value.filter((item) => !targetIds.has(item.id))
  closeDeleteDialog()
  await syncCatalogFromStore({ silent: true })
  Modal.message({ message: '应用已删除', status: 'success' })
}

const handleCardAction = ({ id, action }: { id: number; action: AppAction }) => {
  const target = appItems.value.find((item) => item.id === id)

  if (!target) return

  if (action === 'edit') {
    openEditDialog(target)
    return
  }

  if (action === 'delete') {
    openDeleteDialog([target])
    return
  }

  handleExportSingle(target)
}

const handleRefresh = () => {
  void syncCatalogFromStore()
}

const handleCurrentChange = (value: number) => {
  currentPage.value = value
}

const handleSizeChange = (value: number) => {
  pageSize.value = value
}
</script>

<template>
  <div class="card-list-page">
    <div class="card-list-panel">
      <div class="card-list-panel__header">
        <div>
          <h1>卡片列表</h1>
          <p>面向真实数据的应用目录，支持筛选、编辑、删除、导出和批量选择。</p>
        </div>
        <div class="card-list-panel__meta">
          <span>最近同步：{{ lastSyncAt || '--' }}</span>
          <span>数据源：本地目录仓</span>
        </div>
      </div>

      <div class="card-toolbar">
        <tiny-button-group
          v-model="activeCategory"
          class="card-toolbar__tabs"
          :data="categoryTabs"
          size="small"
        />

        <div class="card-toolbar__search">
          <div class="card-toolbar__search-input">
            <tiny-input
              v-model="keyword"
              :prefix-icon="TinyIconSearch"
              placeholder="输入应用名、负责人或标签进行过滤"
              clearable
            />
            <TinyIconHelpCircle class="card-toolbar__help" />
          </div>

          <tiny-button class="card-toolbar__refresh" circle :disabled="isRefreshing" @click="handleRefresh">
            <TinyIconRefresh />
          </tiny-button>
        </div>
      </div>

      <div class="catalog-actions">
        <div class="catalog-actions__summary">
          <span>筛选结果 {{ total }} 个</span>
          <span>已选 {{ selectedCount }} 个</span>
        </div>

        <div class="catalog-actions__buttons">
          <tiny-button round :disabled="!selectedCount" @click="clearSelection">清空选择</tiny-button>
          <tiny-button round :disabled="!selectedCount" @click="handleExportSelected">导出已选</tiny-button>
          <tiny-button round :disabled="!selectedCount" @click="openDeleteDialog(selectedApps)">删除已选</tiny-button>
          <tiny-button type="primary" round @click="openCreateDialog">新建应用</tiny-button>
        </div>
      </div>

      <div class="catalog-grid">
        <button type="button" class="catalog-add-card" @click="openCreateDialog">
          <TinyIconPlus class="catalog-add-card__icon" />
          <span>添加应用</span>
          <span class="small">通过表单录入真实卡片数据</span>
        </button>

        <app-catalog-card
          v-for="app in pagedApps"
          :key="app.id"
          :app="app"
          @action="handleCardAction"
          @select="toggleCardSelection"
        />

        <div v-if="!pagedApps.length" class="catalog-empty">
          <p class="catalog-empty__title">暂无匹配数据</p>
          <p class="catalog-empty__desc">{{ emptyDescription }}</p>
          <tiny-button type="primary" round @click="openCreateDialog">新建一个应用</tiny-button>
        </div>
      </div>

      <div class="catalog-footer">
        <div class="catalog-footer__summary">
          <span>当前页 {{ pagedApps.length }} 条</span>
          <span>总条数 {{ total }}</span>
          <span>已选 {{ selectedCount }}</span>
        </div>

        <tiny-pager
          class="catalog-pager"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[8, 10, 12]"
          :pager-count="7"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <tiny-dialog-box
      v-model:visible="editorDialogVisible"
      :title="editorMode === 'create' ? '新建应用' : '编辑应用'"
      width="680px"
      top="12vh"
      class="card-dialog"
    >
      <div class="card-dialog__body">
        <tiny-form
          ref="editorFormRef"
          :model="editorForm"
          :rules="editorRules"
          label-position="top"
          class="card-editor-form"
        >
          <div class="card-editor-form__grid">
            <tiny-form-item label="应用名称" prop="title">
              <tiny-input v-model="editorForm.title" placeholder="请输入应用名称" />
            </tiny-form-item>

            <tiny-form-item label="负责人" prop="owner">
              <tiny-input v-model="editorForm.owner" placeholder="请输入负责人" />
            </tiny-form-item>

            <tiny-form-item label="应用分类" prop="category">
              <tiny-select
                v-model="editorForm.category"
                :options="categoryOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择应用分类"
              />
            </tiny-form-item>

            <tiny-form-item label="标签">
              <tiny-input
                v-model="editorForm.tagLabels"
                placeholder="多个标签请用逗号分隔，如：开发，稳定性"
              />
            </tiny-form-item>

            <tiny-form-item label="应用描述" prop="description" class="card-editor-form__full">
              <tiny-input
                v-model="editorForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入应用描述"
              />
            </tiny-form-item>
          </div>
        </tiny-form>
      </div>

      <template #footer>
        <div class="card-dialog__footer">
          <tiny-button round @click="closeEditorDialog">取消</tiny-button>
          <tiny-button type="primary" round @click="saveEditorDialog">保存</tiny-button>
        </div>
      </template>
    </tiny-dialog-box>

    <tiny-dialog-box
      v-model:visible="deleteDialogVisible"
      title="删除应用"
      width="640px"
      top="12vh"
      class="card-dialog card-dialog--delete"
    >
      <div class="delete-dialog__body">
        <p class="delete-dialog__title">将删除以下 {{ deleteTargets.length }} 个应用，删除后不可恢复。</p>

        <div class="delete-dialog__list">
          <div v-for="item in deleteTargets" :key="item.id" class="delete-dialog__item">
            <div class="delete-dialog__item-title">{{ item.title }}</div>
            <div class="delete-dialog__item-meta">
              <span>{{ item.owner }}</span>
              <span>{{ item.updatedAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="card-dialog__footer">
          <tiny-button round @click="closeDeleteDialog">取消</tiny-button>
          <tiny-button type="primary" round @click="confirmDelete">删除</tiny-button>
        </div>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<style scoped>
.card-list-page {
  padding: 24px;
}

.card-list-panel {
  min-height: calc(100vh - 88px);
  padding: 20px 24px 24px;
  border-radius: 8px;
  border: 1px solid #ebeef2;
  background: #fff;
}

.card-list-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.card-list-panel__header h1 {
  margin: 0;
  color: #222;
  font-size: 18px;
  font-weight: 600;
}

.card-list-panel__header p {
  margin: 8px 0 0;
  color: #606266;
  font-size: 13px;
}

.card-list-panel__meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  color: #909399;
  font-size: 12px;
}

.card-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 24px;
}

.card-toolbar__tabs {
  flex: none;
}

.card-toolbar__search {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(520px, 100%);
  margin-left: auto;
}

.card-toolbar__search-input {
  position: relative;
  flex: 1;
}

.card-toolbar__help {
  position: absolute;
  top: 50%;
  right: 12px;
  width: 14px;
  height: 14px;
  color: #b4bac5;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

.card-toolbar__refresh {
  width: 32px;
  height: 32px;
}

.catalog-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 8px;
  background: #f7f8fa;
}

.catalog-actions__summary {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  color: #606266;
  font-size: 13px;
}

.catalog-actions__buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  margin-top: 22px;
}

.catalog-add-card {
  min-height: 224px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px dashed #d7dde8;
  border-radius: 8px;
  background: #fff;
  color: #606266;
  cursor: pointer;
}

.catalog-add-card .small {
  color: #909399;
  font-size: 12px;
}

.catalog-add-card__icon {
  width: 22px;
  height: 22px;
  color: #606266;
}

.catalog-empty {
  grid-column: span 4;
  min-height: 224px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  background: linear-gradient(180deg, #fafbfd 0%, #f5f7fa 100%);
  border: 1px dashed #d7dde8;
}

.catalog-empty__title {
  margin: 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.catalog-empty__desc {
  max-width: 360px;
  margin: 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.7;
  text-align: center;
}

.catalog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  color: #606266;
  font-size: 13px;
}

.catalog-footer__summary {
  display: inline-flex;
  align-items: center;
  gap: 18px;
}

.catalog-pager {
  margin-left: auto;
}

.card-dialog__body {
  padding-top: 4px;
}

.card-editor-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
}

.card-editor-form__full {
  grid-column: 1 / -1;
}

.card-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.delete-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.delete-dialog__title {
  margin: 0;
  color: #303133;
  font-size: 14px;
}

.delete-dialog__list {
  display: grid;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}

.delete-dialog__item {
  padding: 12px 14px;
  border: 1px solid #ebeef2;
  border-radius: 8px;
  background: #fafbfd;
}

.delete-dialog__item-title {
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.delete-dialog__item-meta {
  display: flex;
  gap: 12px;
  margin-top: 6px;
  color: #909399;
  font-size: 12px;
}

:deep(.card-toolbar__tabs.tiny-button-group) {
  border-radius: 6px;
  background: #f5f7fa;
  padding: 0;
}

:deep(.card-toolbar__tabs .tiny-button) {
  min-width: 96px;
  height: 30px;
  border: none;
  background: transparent;
  color: #606266;
  box-shadow: none;
}

:deep(.card-toolbar__tabs .tiny-button.is-checked),
:deep(.card-toolbar__tabs .tiny-button.tiny-button--primary) {
  color: #fff;
  background: #2f7df6;
}

:deep(.card-toolbar__search-input .tiny-input__inner) {
  height: 30px;
  padding-left: 30px;
  padding-right: 34px;
  border-radius: 6px;
  font-size: 12px;
}

:deep(.card-toolbar__search-input .tiny-input__prefix) {
  left: 10px;
  color: #b4bac5;
}

:deep(.card-toolbar__search-input .tiny-input__prefix .tiny-svg) {
  width: 14px;
  height: 14px;
}

:deep(.card-toolbar__refresh .tiny-button) {
  height: 32px;
  min-width: 32px;
  padding: 0;
  border-radius: 6px;
  border-color: #dcdfe6;
  background: #fff;
  color: #606266;
  box-shadow: none;
}

:deep(.card-dialog .tiny-dialog-box) {
  border-radius: 12px;
}

:deep(.card-dialog .tiny-dialog-box__body) {
  padding-top: 4px;
}

@media (max-width: 1680px) {
  .catalog-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .catalog-empty {
    grid-column: span 3;
  }
}

@media (max-width: 1440px) {
  .catalog-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .catalog-empty {
    grid-column: span 2;
  }
}

@media (max-width: 1024px) {
  .card-list-panel__header,
  .card-toolbar,
  .catalog-actions,
  .catalog-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .card-list-panel__meta {
    align-items: flex-start;
  }

  .card-toolbar__search {
    width: 100%;
  }

  .catalog-actions__buttons {
    justify-content: flex-start;
  }

  .catalog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .catalog-empty {
    grid-column: 1 / -1;
  }

  .catalog-pager {
    margin-left: 0;
  }
}

@media (max-width: 720px) {
  .card-list-page {
    padding: 16px;
  }

  .card-list-panel {
    padding: 16px;
  }

  .card-editor-form__grid,
  .catalog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
