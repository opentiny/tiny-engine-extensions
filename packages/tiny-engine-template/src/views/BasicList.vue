<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Button as TinyButton,
  DialogBox as TinyDialogBox,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  Input as TinyInput,
  Pager as TinyPager,
  Progress as TinyProgress,
  Select as TinySelect,
} from '@opentiny/vue'
import {
  iconHelpCircle,
  iconRefresh,
  iconSearch,
} from '@opentiny/vue-icon'


const TinyIconHelpCircle = iconHelpCircle()
const TinyIconRefresh = iconRefresh()
const TinyIconSearch = iconSearch()

type ListStatus = 'freeze' | 'fail' | 'shutdown' | 'running'
type EditorMode = 'create' | 'edit'

type ProjectRow = {
  id: number
  category: string
  name: string
  owner: string
  metric: string
  status: ListStatus
  statusLabel: string
  date: string
  progress: number
  selected: boolean
}

const keyword = ref('')
const category = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const categoryOptions = [
  { label: '请选择', value: '' },
  { label: '智能制造', value: 'smart' },
  { label: '云平台', value: 'cloud' },
  { label: '物联网', value: 'iot' },
]

const allRows = ref<ProjectRow[]>([
  { id: 1, category: 'smart', name: '智慧物流系统开发', owner: '李晓刚', metric: '45678.56', status: 'freeze', statusLabel: '冻结', date: '2022-01-15', progress: 45, selected: false },
  { id: 2, category: 'smart', name: '智能工厂自动化升级', owner: '张维勇', metric: '89.32%', status: 'fail', statusLabel: '失败', date: '2021-07-28', progress: 45, selected: false },
  { id: 3, category: 'iot', name: '环保材料研发计划', owner: '刘成', metric: 'N/A', status: 'shutdown', statusLabel: '关机', date: '2023-03-01', progress: 45, selected: false },
  { id: 4, category: 'cloud', name: '电商平台优化', owner: '赵丹凤', metric: '否', status: 'fail', statusLabel: '失败', date: '2022-09-12', progress: 45, selected: false },
  { id: 5, category: 'cloud', name: '大数据分析平台建设', owner: '周伟', metric: '3021米', status: 'freeze', statusLabel: '冻结', date: '2021-12-14', progress: 45, selected: false },
  { id: 6, category: 'smart', name: '智能家居产品设计', owner: '吴志超', metric: '24条', status: 'freeze', statusLabel: '冻结', date: '2022-01-15', progress: 45, selected: false },
  { id: 7, category: 'smart', name: '新能源汽车研发项目', owner: '郑静', metric: '是', status: 'running', statusLabel: '运行中', date: '2023-05-26', progress: 45, selected: false },
  { id: 8, category: 'iot', name: '虚拟现实技术应用探索', owner: '冯春燕', metric: '01/07/2023', status: 'freeze', statusLabel: '冻结', date: '2022-03-22', progress: 45, selected: false },
  { id: 9, category: 'cloud', name: '云计算服务平台拓展', owner: '梁智', metric: '670吨', status: 'running', statusLabel: '运行中', date: '2021-11-30', progress: 60, selected: false },
  { id: 10, category: 'iot', name: '物联网安全解决方案', owner: '许伟东', metric: '正常', status: 'freeze', statusLabel: '冻结', date: '2022-11-25', progress: 20, selected: false },
  { id: 11, category: 'cloud', name: '工业数据采集平台', owner: '王超', metric: '1024条', status: 'running', statusLabel: '运行中', date: '2022-04-18', progress: 55, selected: false },
  { id: 12, category: 'smart', name: '智能仓储调度中心', owner: '刘扬', metric: '78.2%', status: 'freeze', statusLabel: '冻结', date: '2021-10-12', progress: 35, selected: false },
  { id: 13, category: 'iot', name: '边缘节点运维平台', owner: '陈静', metric: '正常', status: 'running', statusLabel: '运行中', date: '2023-06-09', progress: 60, selected: false },
  { id: 14, category: 'cloud', name: '企业门户升级项目', owner: '林峰', metric: '245吨', status: 'fail', statusLabel: '失败', date: '2022-08-26', progress: 25, selected: false },
  { id: 15, category: 'cloud', name: '新零售营销中台', owner: '杨波', metric: '是', status: 'freeze', statusLabel: '冻结', date: '2021-11-17', progress: 40, selected: false },
  { id: 16, category: 'smart', name: '智慧园区管理平台', owner: '曹琳', metric: '否', status: 'shutdown', statusLabel: '关机', date: '2023-01-08', progress: 15, selected: false },
  { id: 17, category: 'smart', name: '能源监控平台建设', owner: '何旭', metric: '6890.22', status: 'running', statusLabel: '运行中', date: '2022-05-19', progress: 70, selected: false },
  { id: 18, category: 'iot', name: '供应链协同服务', owner: '邓凯', metric: '126件', status: 'freeze', statusLabel: '冻结', date: '2023-07-02', progress: 30, selected: false },
  { id: 19, category: 'cloud', name: '客户运营分析系统', owner: '许楠', metric: '53.6%', status: 'fail', statusLabel: '失败', date: '2022-02-16', progress: 50, selected: false },
  { id: 20, category: 'smart', name: '资产管理数字化平台', owner: '宋哲', metric: '84项', status: 'running', statusLabel: '运行中', date: '2021-09-08', progress: 65, selected: false },
])

const filteredRows = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  return allRows.value.filter((item) => {
    const matchCategory = !category.value || item.category === category.value
    const matchKeyword =
      !query ||
      [item.name, item.owner, item.metric, item.statusLabel, item.date]
        .some((field) => String(field).toLowerCase().includes(query))

    return matchCategory && matchKeyword
  })
})

const total = computed(() => filteredRows.value.length)

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value

  return filteredRows.value.slice(start, start + pageSize.value)
})

const selectedCount = computed(() => allRows.value.filter((item) => item.selected).length)
const selectedRows = computed(() => allRows.value.filter((item) => item.selected))
const toolbarExportRows = computed(() =>
  selectedRows.value.length ? selectedRows.value : filteredRows.value,
)

const deleteDialogVisible = ref(false)
const deleteTargets = ref<ProjectRow[]>([])
const editorDialogVisible = ref(false)
const editorMode = ref<EditorMode>('create')
const editingId = ref<number | null>(null)
const importDialogVisible = ref(false)
const importFileName = ref('')
const importInputRef = ref<HTMLInputElement | null>(null)
const editorFormRef = ref<any>(null)
const editorForm = ref({
  name: '',
  owner: '',
  metric: '',
  statusLabel: '',
})
const statusOptions = [
  { label: '冻结', value: '冻结' },
  { label: '失败', value: '失败' },
  { label: '关机', value: '关机' },
  { label: '运行中', value: '运行中' },
]
const editorRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  metric: [{ required: true, message: '请输入数据', trigger: 'blur' }],
  statusLabel: [{ required: true, message: '请选择状态', trigger: 'change' }],
}

const selectConfig = {
  checkField: 'selected',
}

const handleCurrentChange = (value: number) => {
  currentPage.value = value
}

const handleSizeChange = (value: number) => {
  pageSize.value = value
}

const getStatusMeta = (statusLabel: string): Pick<ProjectRow, 'status' | 'statusLabel'> => {
  const value = statusLabel.trim()

  if (value === '运行中') {
    return { status: 'running', statusLabel: value }
  }

  if (value === '失败') {
    return { status: 'fail', statusLabel: value }
  }

  if (value === '关机') {
    return { status: 'shutdown', statusLabel: value }
  }

  return { status: 'freeze', statusLabel: value || '冻结' }
}

const resetEditorForm = () => {
  editorForm.value = {
    name: '',
    owner: '',
    metric: '',
    statusLabel: '',
  }
}

const openCreateDialog = () => {
  editorMode.value = 'create'
  editingId.value = null
  resetEditorForm()
  editorDialogVisible.value = true
}

const openEditDialog = (row: ProjectRow) => {
  editorMode.value = 'edit'
  editingId.value = row.id
  editorForm.value = {
    name: row.name,
    owner: row.owner,
    metric: row.metric,
    statusLabel: row.statusLabel,
  }
  editorDialogVisible.value = true
}

const closeEditorDialog = () => {
  editorDialogVisible.value = false
  editingId.value = null
  resetEditorForm()
  editorFormRef.value?.clearValidate?.()
}

const openImportDialog = () => {
  importDialogVisible.value = true
}

const closeImportDialog = () => {
  importDialogVisible.value = false
  importFileName.value = ''

  if (importInputRef.value) {
    importInputRef.value.value = ''
  }
}

const downloadTemplate = () => {
  const content = '项目名称,负责人,数据,状态\n示例项目,张三,192.168.0.48/28,冻结'
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = '基础列表导入模板.csv'
  link.click()
  URL.revokeObjectURL(url)
}

const triggerImportSelect = () => {
  importInputRef.value?.click()
}

const handleImportFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]

  importFileName.value = file?.name || ''
}

const confirmImport = () => {
  if (!importFileName.value) {
    return
  }

  const nextId = allRows.value.reduce((max, item) => Math.max(max, item.id), 0) + 1
  const today = new Date().toISOString().slice(0, 10)

  allRows.value = [
    {
      id: nextId,
      category: category.value || 'cloud',
      name: `导入项目-${nextId}`,
      owner: '导入用户',
      metric: importFileName.value,
      status: 'running',
      statusLabel: '运行中',
      date: today,
      progress: 50,
      selected: false,
    },
    ...allRows.value,
  ]
  currentPage.value = 1
  closeImportDialog()
}

const escapeCsvValue = (value: string | number | boolean) => {
  const text = String(value).replace(/"/g, '""')

  return `"${text}"`
}

const exportProjectRows = (rows: ProjectRow[], fileName: string) => {
  if (!rows.length) {
    return
  }

  const header = ['项目名称', '负责人', '数据', '状态', '开始日期', '当前进度']
  const content = rows.map((item) =>
    [
      item.name,
      item.owner,
      item.metric,
      item.statusLabel,
      item.date,
      `${item.progress}%`,
    ]
      .map(escapeCsvValue)
      .join(','),
  )

  const csv = [header.join(','), ...content].join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

const handleExportToolbar = () => {
  exportProjectRows(toolbarExportRows.value, '基础列表导出.csv')
}

const handleRowExport = (row: ProjectRow) => {
  exportProjectRows([row], `${row.name}.csv`)
}

const confirmEditor = () => {
  editorFormRef.value?.validate?.((valid: boolean) => {
    if (!valid) {
      return
    }

    const name = editorForm.value.name.trim()
    const owner = editorForm.value.owner.trim()
    const metric = editorForm.value.metric.trim()
    const statusLabel = editorForm.value.statusLabel.trim()
    const statusMeta = getStatusMeta(statusLabel)

    if (editorMode.value === 'create') {
      const nextId = allRows.value.reduce((max, item) => Math.max(max, item.id), 0) + 1
      const today = new Date().toISOString().slice(0, 10)

      allRows.value = [
        {
          id: nextId,
          category: category.value || 'smart',
          name,
          owner,
          metric,
          status: statusMeta.status,
          statusLabel: statusMeta.statusLabel,
          date: today,
          progress: 45,
          selected: false,
        },
        ...allRows.value,
      ]
      currentPage.value = 1
    } else if (editingId.value !== null) {
      allRows.value = allRows.value.map((item) =>
        item.id === editingId.value
          ? {
              ...item,
              name,
              owner,
              metric,
              status: statusMeta.status,
              statusLabel: statusMeta.statusLabel,
            }
          : item,
      )
    }

    closeEditorDialog()
  })
}

const openDeleteDialog = (targets: ProjectRow[]) => {
  if (!targets.length) {
    return
  }

  deleteTargets.value = targets
  deleteDialogVisible.value = true
}

const handleBatchDelete = () => {
  openDeleteDialog(selectedRows.value)
}

const handleRowDelete = (row: ProjectRow) => {
  openDeleteDialog([row])
}

const confirmDelete = () => {
  const targetIds = new Set(deleteTargets.value.map((item) => item.id))

  allRows.value = allRows.value.filter((item) => !targetIds.has(item.id))
  deleteDialogVisible.value = false
  deleteTargets.value = []
}

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false
  deleteTargets.value = []
}

const getOwnerBadge = (name: string) => name.slice(0, 1)
const getOwnerTone = (owner: string) => {
  const palette = ['tone-blue', 'tone-green', 'tone-orange', 'tone-purple']
  return palette[(owner.charCodeAt(0) || 0) % palette.length]
}

watch([keyword, category], () => {
  currentPage.value = 1
})

watch([pageSize, total], () => {
  const maxPage = Math.max(1, Math.ceil(total.value / pageSize.value))

  if (currentPage.value > maxPage) {
    currentPage.value = maxPage
  }
})
</script>

<template>
  <div class="basic-list-page">
    <div class="basic-list-panel">
      <div class="basic-list-panel__header">
        <h1>基础列表</h1>
      </div>

      <div class="action-toolbar">
        <tiny-button class="action-toolbar__button" round @click="openCreateDialog">创建</tiny-button>
        <tiny-button
          class="action-toolbar__button"
          round
          :disabled="selectedCount === 0"
          @click="handleBatchDelete"
        >
          删除
        </tiny-button>
        <tiny-button class="action-toolbar__button" round @click="openImportDialog">
          <span>导入</span>
        </tiny-button>
        <tiny-button class="action-toolbar__button" round @click="handleExportToolbar">
          <span>导出</span>
        </tiny-button>
      </div>

      <div class="filter-toolbar">
        <tiny-select
          v-model="category"
          :options="categoryOptions"
          text-field="label"
          value-field="value"
          placeholder="请选择"
          class="filter-toolbar__select"
        />

        <div class="search-toolbar">
          <div class="search-toolbar__input">
            <tiny-input
              v-model="keyword"
              placeholder="输入关键字搜索、过滤"
              :prefix-icon="TinyIconSearch"
              clearable
            />
            <TinyIconHelpCircle class="search-toolbar__help" />
          </div>

          <tiny-button class="search-toolbar__refresh" circle>
            <TinyIconRefresh />
          </tiny-button>
        </div>
      </div>

      <tiny-grid
        class="basic-grid"
        :data="pagedRows"
        :select-config="selectConfig"
        :sort-config="{ trigger: 'cell' }"
        :row-id="'id'"
        :show-overflow="true"
        :show-header-overflow="true"
      >
        <tiny-grid-column type="selection" width="60" />
        <tiny-grid-column field="name" title="项目名称" min-width="240" />

        <tiny-grid-column field="owner" title="负责人" min-width="150">
          <template #default="{ row }">
            <div class="owner-chip">
              <span class="owner-cell__avatar" :class="getOwnerTone(row.owner)">
                {{ getOwnerBadge(row.owner) }}
              </span>
              <span>{{ row.owner }}</span>
            </div>
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="metric" title="数据" min-width="120" />

        <tiny-grid-column field="statusLabel" title="状态" min-width="140">
          <template #default="{ row }">
            <span class="status-chip" :class="`is-${row.status}`">
              <span class="status-chip__icon" />
              <span>{{ row.statusLabel }}</span>
            </span>
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="date" title="开始日期" min-width="140" sortable />

        <tiny-grid-column field="progress" title="当前进度" min-width="200">
          <template #default="{ row }">
            <div class="progress-cell">
              <tiny-progress
                :percentage="row.progress"
                :show-text="false"
                :stroke-width="6"
                color="#74c01b"
              />
              <span>{{ row.progress }}%</span>
            </div>
          </template>
        </tiny-grid-column>

        <tiny-grid-column title="操作" min-width="210">
          <template #default="{ row }">
            <div class="action-cell">
              <tiny-button type="text" class="row-action-btn" @click="openEditDialog(row)">
                修改
              </tiny-button>
              <tiny-button type="text" class="row-action-btn" @click="handleRowDelete(row)">
                删除
              </tiny-button>
              <tiny-button type="text" class="row-action-btn" @click="handleRowExport(row)">
                导出
              </tiny-button>
            </div>
          </template>
        </tiny-grid-column>
      </tiny-grid>

      <div class="list-footer">
        <div class="list-footer__summary">
          <span>总条数：{{ total }}</span>
          <span>已选：{{ selectedCount }}</span>
        </div>

        <tiny-pager
          class="basic-pager"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30]"
          :pager-count="7"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>

      <tiny-dialog-box
        v-model:visible="importDialogVisible"
        title="导入"
        width="600px"
        top="12vh"
        class="import-dialog"
      >
        <div class="import-dialog__body">
          <div class="import-dialog__notice">
            <p>1.导入数据应不超过500条，超过数量不允许导入；</p>
            <p>2.相同数据不会重复发；</p>
            <p>
              3.上传文件限Xlsx格式，文件不超过500KB，
              <button type="button" class="import-dialog__link" @click="downloadTemplate">
                点击下载模板
              </button>
            </p>
          </div>

          <input
            ref="importInputRef"
            type="file"
            accept=".xlsx,.xls,.csv"
            class="import-dialog__file-input"
            @change="handleImportFileChange"
          />

          <div class="import-dialog__actions">
            <tiny-button round @click="triggerImportSelect">添加文件</tiny-button>
            <div class="import-dialog__file-name">
              {{ importFileName || '未选择文件' }}
            </div>
          </div>
        </div>

        <template #footer>
          <div class="import-dialog__footer">
            <tiny-button round @click="closeImportDialog">取消</tiny-button>
            <tiny-button type="primary" round :disabled="!importFileName" @click="confirmImport">
              导入
            </tiny-button>
          </div>
        </template>
      </tiny-dialog-box>

      <tiny-dialog-box
        v-model:visible="editorDialogVisible"
        :title="editorMode === 'create' ? '创建' : '修改'"
        width="640px"
        top="12vh"
        class="editor-dialog"
      >
        <div class="editor-dialog__body">
          <tiny-form
            ref="editorFormRef"
            :model="editorForm"
            :rules="editorRules"
            label-position="top"
            class="editor-form"
          >
            <tiny-form-item label="项目名称" prop="name">
              <tiny-input v-model="editorForm.name" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="负责人" prop="owner">
              <tiny-input v-model="editorForm.owner" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="数据" prop="metric">
              <tiny-input v-model="editorForm.metric" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="状态" prop="statusLabel">
              <tiny-select
                v-model="editorForm.statusLabel"
                :options="statusOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择"
              />
            </tiny-form-item>
          </tiny-form>
        </div>

        <template #footer>
          <div class="editor-dialog__footer">
            <tiny-button round @click="closeEditorDialog">取消</tiny-button>
            <tiny-button type="primary" round @click="confirmEditor">确定</tiny-button>
          </div>
        </template>
      </tiny-dialog-box>

      <tiny-dialog-box
        v-model:visible="deleteDialogVisible"
        title="删除"
        width="640px"
        top="12vh"
        class="delete-dialog"
      >
        <div class="delete-dialog__body">
          <p class="delete-dialog__tip">您即将删除以下{{ deleteTargets.length }}个项目</p>

          <tiny-grid
            class="delete-dialog__grid"
            :data="deleteTargets"
            :show-overflow="true"
            :show-header-overflow="true"
          >
            <tiny-grid-column field="name" title="项目名称" min-width="180" />
            <tiny-grid-column field="owner" title="负责人" min-width="120" />
            <tiny-grid-column field="metric" title="数据" min-width="140" />
            <tiny-grid-column field="statusLabel" title="状态" min-width="120">
              <template #default="{ row }">
                <span class="status-chip" :class="`is-${row.status}`">
                  <span class="status-chip__icon" />
                  <span>{{ row.statusLabel }}</span>
                </span>
              </template>
            </tiny-grid-column>
          </tiny-grid>
        </div>

        <template #footer>
          <div class="delete-dialog__footer">
            <tiny-button round @click="closeDeleteDialog">取消</tiny-button>
            <tiny-button type="primary" round @click="confirmDelete">确定</tiny-button>
          </div>
        </template>
      </tiny-dialog-box>
    </div>
  </div>
</template>

<style scoped>
.basic-list-page {
  padding: 24px;
}

.basic-list-panel {
  min-height: calc(100vh - 88px);
  padding: 20px 24px 24px;
  border-radius: 8px;
  background: #fff;
}

.basic-list-panel__header h1 {
  margin: 0;
  color: #222;
  font-size: 18px;
  font-weight: 600;
}

.action-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.action-toolbar__button {
  min-width: 84px;
}

.action-toolbar__icon {
  width: 14px;
  height: 14px;
}

.filter-toolbar {
  display: grid;
  grid-template-columns: minmax(280px, 1.05fr) minmax(520px, 0.95fr);
  gap: 12px;
  margin-top: 20px;
  align-items: center;
}

.filter-toolbar__select {
  width: 100%;
}

.search-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-toolbar__input {
  position: relative;
  flex: 1;
}

.search-toolbar__help {
  position: absolute;
  top: 50%;
  right: 14px;
  width: 14px;
  height: 14px;
  color: #b4bac5;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

.search-toolbar__refresh {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

.basic-grid {
  margin-top: 18px;
}

.owner-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.owner-cell__avatar {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
}

.tone-blue { background: linear-gradient(135deg, #5b8ff9 0%, #2f6bff 100%); }
.tone-green { background: linear-gradient(135deg, #41c781 0%, #12a150 100%); }
.tone-orange { background: linear-gradient(135deg, #ffb562 0%, #ff8a1f 100%); }
.tone-purple { background: linear-gradient(135deg, #8d7cf7 0%, #6951ea 100%); }

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  line-height: 1;
}

.status-chip__icon {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid currentColor;
  box-sizing: border-box;
}

.status-chip.is-freeze {
  color: #f59a23;
}

.status-chip.is-freeze .status-chip__icon {
  width: 0;
  height: 0;
  border: none;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 9px solid #f59a23;
  border-radius: 0;
  transform: translateY(-1px);
}

.status-chip.is-fail {
  color: #f56c6c;
}

.status-chip.is-shutdown {
  color: #c0c4cc;
}

.status-chip.is-running {
  color: #67c23a;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.progress-cell :deep(.tiny-progress) {
  width: 134px;
  flex: none;
}

.action-cell {
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;
}

.row-action-btn {
  padding: 0;
  color: #2f7df6;
}

.row-action-btn span {
  letter-spacing: 0;
}

.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  color: #606266;
  font-size: 13px;
}

.list-footer__summary {
  display: inline-flex;
  align-items: center;
  gap: 18px;
}

.basic-pager {
  margin-left: auto;
}

.delete-dialog__body {
  padding: 2px 0 8px;
}

.delete-dialog__tip {
  margin: 0 0 16px;
  color: #606266;
  font-size: 14px;
}

.delete-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.editor-dialog__body {
  padding: 4px 0 8px;
}

.editor-form {
  display: grid;
  gap: 4px;
}

.editor-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.import-dialog__body {
  padding: 4px 0 6px;
}

.import-dialog__notice {
  padding: 12px 16px;
  border-radius: 8px;
  background: #dcecff;
  color: #4f6480;
  font-size: 14px;
  line-height: 1.9;
}

.import-dialog__notice p {
  margin: 0;
}

.import-dialog__file-input {
  display: none;
}

.import-dialog__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}

.import-dialog__link {
  padding: 0;
  border: none;
  background: transparent;
  color: #2f7df6;
  cursor: pointer;
}

.import-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.action-toolbar__button .tiny-button) {
  min-width: 84px;
  height: 30px;
  border-radius: 999px;
  border-color: #202020;
  color: #222;
  background: #fff;
  font-size: 13px;
}

:deep(.filter-toolbar__select .tiny-input__inner),
:deep(.search-toolbar__input .tiny-input__inner) {
  height: 32px;
  border-radius: 6px;
  font-size: 12px;
  color: #606266;
  border-color: #dcdfe6;
  background: #fff;
}

:deep(.search-toolbar__input .tiny-input__inner) {
  padding-right: 34px;
  padding-left: 30px;
}

:deep(.search-toolbar__input .tiny-input__prefix) {
  left: 10px;
  color: #b4bac5;
}

:deep(.search-toolbar__input .tiny-input__prefix .tiny-svg) {
  width: 14px;
  height: 14px;
}

:deep(.filter-toolbar__select .tiny-input__suffix),
:deep(.search-toolbar__input .tiny-input__suffix) {
  right: 10px;
}

:deep(.filter-toolbar__select .tiny-base-select) {
  width: 100%;
}

:deep(.filter-toolbar__select .tiny-base-select .tiny-input__inner) {
  padding-left: 12px;
}

:deep(.search-toolbar__refresh .tiny-button) {
  width: 32px;
  height: 32px;
  min-width: 32px;
  padding: 0;
  border-radius: 6px;
  border-color: #dcdfe6;
  background: #fff;
  color: #606266;
  box-shadow: none;
}

:deep(.basic-grid .tiny-grid) {
  border: none;
  font-size: 13px;
  color: #303133;
}

:deep(.basic-grid .tiny-grid__header-wrapper),
:deep(.basic-grid .tiny-grid__body-wrapper) {
  border: none;
}

:deep(.basic-grid .tiny-grid__header) {
  border-collapse: separate;
  border-spacing: 0;
}

:deep(.basic-grid .tiny-grid-header__row) {
  background: #f5f5f5;
  height: 40px;
}

:deep(.basic-grid .tiny-grid-header__column) {
  position: relative;
  background: #f5f5f5;
}

:deep(.basic-grid .tiny-grid-header__column:not(.col__selection):not(:last-child)::after) {
  content: '';
  position: absolute;
  top: 12px;
  right: 0;
  width: 1px;
  height: 16px;
  background: #e6e8eb;
}

:deep(.basic-grid .tiny-grid-body__column) {
  height: 42px;
  border-bottom-color: #ebeef2;
  background: #fff;
}

:deep(.basic-grid .tiny-grid-body__row:hover .tiny-grid-body__column) {
  background: #fff;
}

:deep(.basic-grid .tiny-grid-body__row.row__selected .tiny-grid-body__column) {
  background: #fff;
}

:deep(.basic-grid .tiny-grid-cell) {
  font-size: 13px;
  color: #303133;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.basic-grid .tiny-grid-header__column .tiny-grid-cell) {
  font-weight: 600;
  color: #606266;
  line-height: 40px;
}

:deep(.progress-cell .tiny-progress-bar__outer) {
  background: #e6e8eb;
  border-radius: 999px;
}

:deep(.progress-cell .tiny-progress-bar__inner) {
  border-radius: 999px;
}

:deep(.row-action-btn .tiny-button) {
  padding: 0;
  font-size: 13px;
  color: #2f7df6;
  min-width: auto;
  height: auto;
}

:deep(.row-action-btn .tiny-button:hover) {
  color: #1e63da;
}

:deep(.row-action-btn .tiny-button .tiny-svg) {
  width: 14px;
  height: 14px;
  margin-right: 2px;
}

:deep(.delete-dialog .tiny-dialog-box) {
  border-radius: 8px;
}

:deep(.import-dialog .tiny-dialog-box) {
  border-radius: 8px;
}

:deep(.editor-dialog .tiny-dialog-box) {
  border-radius: 8px;
}

:deep(.delete-dialog .tiny-dialog-box__header) {
  padding: 20px 24px 16px;
}

:deep(.import-dialog .tiny-dialog-box__header) {
  padding: 20px 24px 16px;
}

:deep(.editor-dialog .tiny-dialog-box__header) {
  padding: 20px 24px 16px;
}

:deep(.delete-dialog .tiny-dialog-box__title) {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

:deep(.import-dialog .tiny-dialog-box__title) {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

:deep(.editor-dialog .tiny-dialog-box__title) {
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

:deep(.delete-dialog .tiny-dialog-box__body) {
  padding: 0 24px;
}

:deep(.import-dialog .tiny-dialog-box__body) {
  padding: 0 24px;
}

:deep(.editor-dialog .tiny-dialog-box__body) {
  padding: 0 24px;
}

:deep(.delete-dialog .tiny-dialog-box__footer) {
  padding: 18px 24px 24px;
}

:deep(.import-dialog .tiny-dialog-box__footer) {
  padding: 18px 24px 24px;
}

:deep(.editor-dialog .tiny-dialog-box__footer) {
  padding: 18px 24px 24px;
}

:deep(.delete-dialog__footer .tiny-button) {
  min-width: 84px;
  height: 30px;
}

:deep(.import-dialog__footer .tiny-button) {
  min-width: 84px;
  height: 30px;
}

:deep(.editor-dialog__footer .tiny-button) {
  min-width: 84px;
  height: 30px;
}

:deep(.editor-form .tiny-input__inner) {
  height: 30px;
  border-radius: 6px;
  font-size: 14px;
}

:deep(.editor-form .tiny-form-item) {
  margin-bottom: 10px;
}

:deep(.editor-form .tiny-form-item__label) {
  padding-bottom: 8px;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

:deep(.editor-form .tiny-base-select .tiny-input__inner) {
  height: 30px;
  border-radius: 6px;
  font-size: 14px;
}

:deep(.delete-dialog__grid .tiny-grid) {
  border: none;
}

:deep(.delete-dialog__grid .tiny-grid__header-wrapper),
:deep(.delete-dialog__grid .tiny-grid__body-wrapper) {
  border: none;
}

:deep(.delete-dialog__grid .tiny-grid-header__row) {
  background: #f5f7fa;
}

:deep(.delete-dialog__grid .tiny-grid-header__column),
:deep(.delete-dialog__grid .tiny-grid-body__column) {
  border-bottom-color: #ebeef2;
}

:deep(.delete-dialog__grid .tiny-grid-cell) {
  font-size: 13px;
  color: #303133;
}

:deep(.delete-dialog__grid .tiny-grid-header__column .tiny-grid-cell) {
  color: #606266;
  font-weight: 600;
}

.import-dialog__file-name {
  width: 240px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  color: #606266;
  font-size: 13px;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  background: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

:deep(.basic-grid .tiny-grid-checkbox) {
  width: 16px;
  height: 16px;
}

:deep(.basic-grid .tiny-checkbox__inner),
:deep(.basic-grid .tiny-grid-checkbox__icon) {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

:deep(.basic-grid .tiny-grid-body__column.col__selection .tiny-grid-cell),
:deep(.basic-grid .tiny-grid-header__column.col__selection .tiny-grid-cell) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.basic-grid .tiny-grid-body__column .tiny-grid-cell-text) {
  line-height: 42px;
}

@media (max-width: 1440px) {
  .basic-grid {
    overflow-x: auto;
  }
}

@media (max-width: 900px) {
  .basic-list-page {
    padding: 16px;
  }

  .basic-list-panel {
    padding: 16px;
  }

  .filter-toolbar {
    grid-template-columns: 1fr;
  }

  .list-footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .basic-pager {
    margin-left: 0;
  }
}
</style>
