<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import {
  Button as TinyButton,
  DatePicker as TinyDatePicker,
  DialogBox as TinyDialogBox,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  Input as TinyInput,
  Pager as TinyPager,
  Progress as TinyProgress,
  Select as TinySelect,
  Switch as TinySwitch,
  Tag as TinyTag,
  Modal
} from '@opentiny/vue'
import {
  iconCopy,
  iconSearch,
} from '@opentiny/vue-icon'

type ClusterStatus = 'running' | 'maintenance' | 'stopped'
type TaskStatus = 'running' | 'freeze' | 'fail' | 'shutdown'
type TaskDialogMode = 'create' | 'edit'
type OwnerRole = '架构负责人' | '交付负责人' | '产品负责人' | '运维负责人'

type ClusterState = {
  name: string
  id: string
  version: string
  addonVersion: string
  type: string
  status: ClusterStatus
  nodeCount: number
  createdAt: string
  networkType: string
  vpc: string
  subnet: string
  serviceCidr: string
  podCidr: string
  endpoint: string
  publicEndpoint: string
  customSan: string
  kubectl: string
  certificate: string
  billingMode: string
  lastOrderId: string
  orderCreatedAt: string
  expireAt: string
  certificateExpireAt: string
  expirePolicy: string
  securityGroup: string
  description: string
}

type TaskRow = {
  id: number
  name: string
  owner: string
  ownerRole: OwnerRole
  dataValue: string
  status: TaskStatus
  statusLabel: string
  startDate: string
  progress: number
  selected: boolean
  remark: string
}

type ActivityLog = {
  id: number
  title: string
  detail: string
  time: string
  tone: 'success' | 'info' | 'warning'
}

type DetailGroupItem = {
  label: string
  value: string
  copyable?: boolean
  isStatus?: boolean
}

type DetailGroup = {
  title: string
  items: DetailGroupItem[]
}

const TinyIconCopy = iconCopy()
const TinyIconSearch = iconSearch()

const taskFormRef = ref<any>(null)
const clusterFormRef = ref<any>(null)
const keyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const clusterDialogVisible = ref(false)
const taskDialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const taskDialogMode = ref<TaskDialogMode>('create')
const editingTaskId = ref<number | null>(null)
const maintenanceMode = ref(false)
const autoRenewEnabled = ref(true)
const lastSyncAt = ref('2026-03-30 10:18:20')
const deleteTargets = ref<TaskRow[]>([])

const cluster = reactive<ClusterState>({
  name: 'Cluster001',
  id: '239f4937-d597-451b-9e15-42f3d6c8a101',
  version: 'v1.19',
  addonVersion: 'v1.3.21',
  type: 'CCE集群',
  status: 'running',
  nodeCount: 50,
  createdAt: '2023/04/07 16:35:18 GMT+08:00',
  networkType: 'VPC网络',
  vpc: 'vpc-noha',
  subnet: 'subnet-4d11',
  serviceCidr: '172.16.0.0/16',
  podCidr: '10.247.0.0/16',
  endpoint: 'https://192.168.10.1:5443',
  publicEndpoint: '--',
  customSan: '--',
  kubectl: '--',
  certificate: 'X509 证书',
  billingMode: '包年/包月',
  lastOrderId: 'CS2402071033GCNNI',
  orderCreatedAt: '2024/02/07 10:33:51 GMT+08:00',
  expireAt: '2025/02/07 10:33:51 GMT+08:00',
  certificateExpireAt: '2024/02/07 10:34:01 GMT+08:00',
  expirePolicy: '到期进入宽限期',
  securityGroup: 'w00797244-eyhehe',
  description: '承载制造中台、数据服务和边缘推理任务的主集群。',
})

const clusterForm = reactive({
  name: cluster.name,
  nodeCount: String(cluster.nodeCount),
  endpoint: cluster.endpoint,
  billingMode: cluster.billingMode,
  expirePolicy: cluster.expirePolicy,
  description: cluster.description,
})

const taskForm = reactive({
  name: '',
  owner: '',
  ownerRole: '架构负责人' as OwnerRole,
  dataValue: '',
  status: 'running' as TaskStatus,
  startDate: '',
  progress: '45',
  remark: '',
})

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '运行中', value: 'running' },
  { label: '冻结', value: 'freeze' },
  { label: '失败', value: 'fail' },
  { label: '关机', value: 'shutdown' },
]

const ownerRoleOptions = [
  { label: '架构负责人', value: '架构负责人' },
  { label: '交付负责人', value: '交付负责人' },
  { label: '产品负责人', value: '产品负责人' },
  { label: '运维负责人', value: '运维负责人' },
]

const taskStatusOptions = statusOptions.filter((item) => item.value)
const billingOptions = [
  { label: '包年/包月', value: '包年/包月' },
  { label: '按需计费', value: '按需计费' },
]
const expirePolicyOptions = [
  { label: '到期进入宽限期', value: '到期进入宽限期' },
  { label: '到期自动释放', value: '到期自动释放' },
  { label: '到期自动续费', value: '到期自动续费' },
]

const allTasks = ref<TaskRow[]>([
  { id: 1, name: '智慧物流系统开发', owner: '李晓刚', ownerRole: '架构负责人', dataValue: '45678.56', status: 'freeze', statusLabel: '冻结', startDate: '2022-01-15', progress: 45, selected: false, remark: '涉及仓储链路与多租户权限梳理' },
  { id: 2, name: '智能工厂自动化升级', owner: '张维勇', ownerRole: '交付负责人', dataValue: '89.32%', status: 'fail', statusLabel: '失败', startDate: '2021-07-28', progress: 45, selected: false, remark: '当前卡在生产环境联调' },
  { id: 3, name: '环保材料研发计划', owner: '刘成', ownerRole: '产品负责人', dataValue: 'N/A', status: 'shutdown', statusLabel: '关机', startDate: '2023-03-01', progress: 45, selected: false, remark: '预算审批尚未完成' },
  { id: 4, name: '电商平台优化', owner: '赵丹凤', ownerRole: '产品负责人', dataValue: '否', status: 'fail', statusLabel: '失败', startDate: '2022-09-12', progress: 45, selected: false, remark: '需补充压测基线' },
  { id: 5, name: '大数据分析平台建设', owner: '周伟', ownerRole: '架构负责人', dataValue: '3021米', status: 'freeze', statusLabel: '冻结', startDate: '2021-12-14', progress: 45, selected: false, remark: '等待对象存储扩容' },
  { id: 6, name: '智能家居产品设计', owner: '吴志超', ownerRole: '交付负责人', dataValue: '24条', status: 'freeze', statusLabel: '冻结', startDate: '2022-01-15', progress: 45, selected: false, remark: '设计稿已经进入灰度验收' },
  { id: 7, name: 'AI质检工作台', owner: '韩宁', ownerRole: '运维负责人', dataValue: '1280条', status: 'running', statusLabel: '运行中', startDate: '2024-06-10', progress: 68, selected: false, remark: '本周新增模型切换能力' },
  { id: 8, name: '边缘节点统一运维', owner: '林玥', ownerRole: '运维负责人', dataValue: '6区域', status: 'running', statusLabel: '运行中', startDate: '2024-04-19', progress: 82, selected: false, remark: '节点巡检已接入自动告警' },
])

const activityLogs = ref<ActivityLog[]>([
  { id: 1, title: '任务推进', detail: '边缘节点统一运维已推进至 82%，同步了 2 个节点的巡检结果。', time: '10:06', tone: 'success' },
  { id: 2, title: '证书检查', detail: '控制面证书还有 314 天到期，自动续费策略已启用。', time: '09:42', tone: 'info' },
  { id: 3, title: '网络变更', detail: 'VPC 网络策略已更新，容器网段未受影响。', time: '09:18', tone: 'warning' },
])

const clusterRules = {
  name: [{ required: true, message: '请输入集群名称', trigger: 'blur' }],
  nodeCount: [{ required: true, message: '请输入节点规模', trigger: 'blur' }],
  endpoint: [{ required: true, message: '请输入内网地址', trigger: 'blur' }],
  billingMode: [{ required: true, message: '请选择计费模式', trigger: 'change' }],
}

const taskRules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  owner: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  ownerRole: [{ required: true, message: '请选择负责人角色', trigger: 'change' }],
  dataValue: [{ required: true, message: '请输入数据值', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  progress: [{ required: true, message: '请输入进度', trigger: 'blur' }],
}

const selectConfig = {
  checkField: 'selected',
}

const clusterStatusLabel = computed(() => {
  if (cluster.status === 'maintenance') return '维护中'
  if (cluster.status === 'stopped') return '已停用'
  return '运行中'
})

const clusterTagType = computed(() => {
  if (cluster.status === 'maintenance') return 'warning'
  if (cluster.status === 'stopped') return 'danger'
  return 'success'
})

const activeTaskCount = computed(() => allTasks.value.filter((item) => item.status === 'running').length)
const averageProgress = computed(() => {
  if (!allTasks.value.length) return 0

  const totalProgress = allTasks.value.reduce((sum, item) => sum + item.progress, 0)
  return Math.round(totalProgress / allTasks.value.length)
})

const selectedRows = computed(() => allTasks.value.filter((item) => item.selected))
const selectedCount = computed(() => selectedRows.value.length)
const detailStats = computed(() => [
  { label: '管理节点', value: `${cluster.nodeCount} 节点`, helper: '含 6 个系统节点' },
  { label: '运行任务', value: `${activeTaskCount.value} 个`, helper: '已接入交付流水线' },
  { label: '平均进度', value: `${averageProgress.value}%`, helper: '最近 24 小时 +6%' },
  { label: '最近同步', value: lastSyncAt.value, helper: '支持手动刷新' },
])

const detailGroups = computed<DetailGroup[]>(() => [
  {
    title: '基础信息',
    items: [
      { label: '名称', value: cluster.name },
      { label: 'ID', value: cluster.id, copyable: true },
      { label: '集群版本 | 补丁版本', value: `${cluster.version} | ${cluster.addonVersion}` },
      { label: '类型', value: cluster.type },
      { label: '集群状态', value: clusterStatusLabel.value, isStatus: true },
      { label: '管理规模', value: `${cluster.nodeCount} 节点` },
      { label: '默认安全组', value: cluster.securityGroup },
      { label: '创建时间', value: cluster.createdAt },
    ],
  },
  {
    title: '网络信息',
    items: [
      { label: '网络类型', value: cluster.networkType },
      { label: 'VPC', value: cluster.vpc },
      { label: '子网', value: cluster.subnet },
      { label: '容器网段', value: cluster.serviceCidr },
      { label: 'IPv4 服务网段', value: cluster.podCidr },
      { label: '节点默认安全组', value: cluster.securityGroup },
    ],
  },
  {
    title: '访问信息',
    items: [
      { label: '内网地址', value: cluster.endpoint, copyable: true },
      { label: '公网地址', value: cluster.publicEndpoint },
      { label: '自定义 SAN', value: cluster.customSan },
      { label: 'kubectl', value: cluster.kubectl },
      { label: '证书认证', value: cluster.certificate },
      { label: '备注', value: cluster.description },
    ],
  },
  {
    title: '交易信息',
    items: [
      { label: '计费模式', value: cluster.billingMode },
      { label: '最近交易订单', value: cluster.lastOrderId, copyable: true },
      { label: '创建时间', value: cluster.orderCreatedAt },
      { label: '到期时间', value: cluster.expireAt },
      { label: '证书到期时间', value: cluster.certificateExpireAt },
      { label: '到期处理策略', value: cluster.expirePolicy },
    ],
  },
])

const filteredTasks = computed(() => {
  const query = keyword.value.trim().toLowerCase()

  return allTasks.value.filter((item) => {
    const matchStatus = !statusFilter.value || item.status === statusFilter.value
    const matchKeyword =
      !query ||
      [item.name, item.owner, item.ownerRole, item.dataValue, item.statusLabel, item.startDate, item.remark]
        .some((field) => String(field).toLowerCase().includes(query))

    return matchStatus && matchKeyword
  })
})

const total = computed(() => filteredTasks.value.length)
const pagedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredTasks.value.slice(start, start + pageSize.value)
})

watch([keyword, statusFilter], () => {
  currentPage.value = 1
})

watch(total, (value) => {
  const maxPage = Math.max(1, Math.ceil(value / pageSize.value))
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

const getTaskStatusMeta = (status: TaskStatus) => {
  if (status === 'running') return { label: '运行中', className: 'is-running' }
  if (status === 'fail') return { label: '失败', className: 'is-fail' }
  if (status === 'shutdown') return { label: '关机', className: 'is-shutdown' }
  return { label: '冻结', className: 'is-freeze' }
}

const formatTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const addActivityLog = (title: string, detail: string, tone: ActivityLog['tone']) => {
  activityLogs.value = [
    { id: Date.now(), title, detail, time: formatTime().slice(11, 16), tone },
    ...activityLogs.value,
  ].slice(0, 4)
}

const copyText = async (text: string, label: string) => {
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

    Modal.message({ message: `${label}已复制`, status: 'success' })
  } catch {
    Modal.message({ message: '复制失败，请手动复制', status: 'warning' })
  }
}

const handleCurrentChange = (value: number) => {
  currentPage.value = value
}

const handleSizeChange = (value: number) => {
  pageSize.value = value
}

const syncClusterStatus = () => {
  if (cluster.status === 'stopped') {
    maintenanceMode.value = false
    return
  }

  cluster.status = maintenanceMode.value ? 'maintenance' : 'running'
}

const handleMaintenanceChange = (value: boolean) => {
  if (cluster.status === 'stopped' && value) {
    maintenanceMode.value = false
    Modal.message({ message: '集群已停用，不能开启维护模式', status: 'warning' })
    return
  }

  maintenanceMode.value = value
  syncClusterStatus()
  addActivityLog(
    '维护模式变更',
    value ? '维护模式已开启，任务发布会自动进入人工确认。' : '维护模式已关闭，集群恢复常规调度。',
    value ? 'warning' : 'success',
  )
}

const handleAutoRenewChange = (value: boolean) => {
  autoRenewEnabled.value = value
  addActivityLog(
    '续费策略调整',
    value ? '自动续费已启用，到期前 7 天将自动创建续费订单。' : '自动续费已关闭，到期前需要人工确认续费。',
    value ? 'success' : 'info',
  )
}

const handleRefreshPage = () => {
  allTasks.value = allTasks.value.map((item) =>
    item.status === 'running'
      ? { ...item, progress: Math.min(item.progress + Math.floor(Math.random() * 8), 98) }
      : item,
  )
  lastSyncAt.value = formatTime()
  addActivityLog('状态刷新', '已同步基础详情与任务进度，页面数据已更新到最新快照。', 'info')
  Modal.message({ message: '页面数据已刷新', status: 'success' })
}

const handleClusterPower = () => {
  if (cluster.status === 'stopped') {
    cluster.status = maintenanceMode.value ? 'maintenance' : 'running'
    addActivityLog('集群启动', `${cluster.name} 已重新启动，并恢复控制面调度。`, 'success')
    Modal.message({ message: '集群已启动', status: 'success' })
    return
  }

  cluster.status = 'stopped'
  maintenanceMode.value = false
  addActivityLog('集群停用', `${cluster.name} 已停用，相关任务会暂停调度。`, 'warning')
  Modal.message({ message: '集群已停用', status: 'warning' })
}

const openClusterDialog = () => {
  clusterForm.name = cluster.name
  clusterForm.nodeCount = String(cluster.nodeCount)
  clusterForm.endpoint = cluster.endpoint
  clusterForm.billingMode = cluster.billingMode
  clusterForm.expirePolicy = cluster.expirePolicy
  clusterForm.description = cluster.description
  clusterDialogVisible.value = true
}

const closeClusterDialog = () => {
  clusterDialogVisible.value = false
  clusterFormRef.value?.clearValidate?.()
}

const saveClusterDialog = () => {
  clusterFormRef.value?.validate?.((valid: boolean) => {
    if (!valid) return

    cluster.name = clusterForm.name.trim()
    cluster.nodeCount = Number(clusterForm.nodeCount) || cluster.nodeCount
    cluster.endpoint = clusterForm.endpoint.trim()
    cluster.billingMode = clusterForm.billingMode
    cluster.expirePolicy = clusterForm.expirePolicy
    cluster.description = clusterForm.description.trim() || '暂无描述'
    clusterDialogVisible.value = false
    addActivityLog('基础信息更新', `已更新集群名称、规模和交易策略，当前名称为 ${cluster.name}。`, 'success')
    Modal.message({ message: '基础信息已保存', status: 'success' })
  })
}

const resetTaskForm = () => {
  taskForm.name = ''
  taskForm.owner = ''
  taskForm.ownerRole = '架构负责人'
  taskForm.dataValue = ''
  taskForm.status = 'running'
  taskForm.startDate = ''
  taskForm.progress = '45'
  taskForm.remark = ''
}

const openCreateTaskDialog = () => {
  taskDialogMode.value = 'create'
  editingTaskId.value = null
  resetTaskForm()
  taskDialogVisible.value = true
}

const openEditTaskDialog = (row: TaskRow) => {
  taskDialogMode.value = 'edit'
  editingTaskId.value = row.id
  taskForm.name = row.name
  taskForm.owner = row.owner
  taskForm.ownerRole = row.ownerRole
  taskForm.dataValue = row.dataValue
  taskForm.status = row.status
  taskForm.startDate = row.startDate
  taskForm.progress = String(row.progress)
  taskForm.remark = row.remark
  taskDialogVisible.value = true
}

const closeTaskDialog = () => {
  taskDialogVisible.value = false
  editingTaskId.value = null
  taskFormRef.value?.clearValidate?.()
}

const saveTaskDialog = () => {
  taskFormRef.value?.validate?.((valid: boolean) => {
    if (!valid) return

    const progress = Math.max(0, Math.min(100, Number(taskForm.progress) || 0))
    const nextRow: TaskRow = {
      id: editingTaskId.value ?? Date.now(),
      name: taskForm.name.trim(),
      owner: taskForm.owner.trim(),
      ownerRole: taskForm.ownerRole,
      dataValue: taskForm.dataValue.trim(),
      status: taskForm.status,
      statusLabel: getTaskStatusMeta(taskForm.status).label,
      startDate: taskForm.startDate,
      progress,
      selected: false,
      remark: taskForm.remark.trim() || '暂无备注',
    }

    if (taskDialogMode.value === 'create') {
      allTasks.value = [nextRow, ...allTasks.value]
      addActivityLog('新任务创建', `已创建任务“${nextRow.name}”，负责人为 ${nextRow.owner}。`, 'success')
      Modal.message({ message: '任务已创建', status: 'success' })
    } else {
      allTasks.value = allTasks.value.map((item) => (item.id === nextRow.id ? nextRow : item))
      addActivityLog('任务更新', `已更新任务“${nextRow.name}”的基础信息和进度。`, 'info')
      Modal.message({ message: '任务已更新', status: 'success' })
    }

    taskDialogVisible.value = false
  })
}

const handleAdvanceTask = (row: TaskRow) => {
  const nextProgress = Math.min(row.progress + 12, 100)
  row.progress = nextProgress
  row.status = 'running'
  row.statusLabel = '运行中'
  addActivityLog('任务推进', `任务“${row.name}”已推进到 ${nextProgress}%，并恢复为运行中。`, 'success')
  Modal.message({ message: `${row.name} 已推进到 ${nextProgress}%`, status: 'success' })
}

const openDeleteDialog = (rows: TaskRow[]) => {
  deleteTargets.value = rows.map((item) => ({ ...item }))
  deleteDialogVisible.value = true
}

const closeDeleteDialog = () => {
  deleteDialogVisible.value = false
  deleteTargets.value = []
}

const handleDeleteTask = (row: TaskRow) => {
  openDeleteDialog([row])
}

const handleBatchDelete = () => {
  if (!selectedRows.value.length) {
    Modal.message({ message: '请先选择要删除的任务', status: 'warning' })
    return
  }

  openDeleteDialog(selectedRows.value)
}

const confirmDelete = () => {
  const idSet = new Set(deleteTargets.value.map((item) => item.id))
  const deletedNames = deleteTargets.value.map((item) => item.name).join('、')

  allTasks.value = allTasks.value.filter((item) => !idSet.has(item.id))
  deleteDialogVisible.value = false
  deleteTargets.value = []
  addActivityLog('任务删除', `已删除 ${idSet.size} 个任务：${deletedNames}。`, 'warning')
  Modal.message({ message: '任务已删除', status: 'success' })
}

const handleBatchFreeze = () => {
  if (!selectedRows.value.length) {
    Modal.message({ message: '请先选择需要冻结的任务', status: 'warning' })
    return
  }

  const targets = selectedRows.value
  const names = targets.map((item) => item.name).join('、')

  allTasks.value = allTasks.value.map((item) =>
    item.selected ? { ...item, status: 'freeze', statusLabel: '冻结', selected: false } : item,
  )

  addActivityLog('批量冻结', `已冻结 ${targets.length} 个任务：${names}。`, 'warning')
  Modal.message({ message: '所选任务已冻结', status: 'success' })
}

const getOwnerBadge = (name: string) => name.slice(0, 1)
const getOwnerTone = (owner: string) => {
  const palette = ['tone-blue', 'tone-green', 'tone-orange', 'tone-purple']
  return palette[(owner.charCodeAt(0) || 0) % palette.length]
}
</script>

<template>
  <div class="basic-detail-page">
    <section class="page-header">
      <div>
        <h1>详情信息</h1>
        <p>按照真实运维场景展示基础详情，并支持直接维护集群与任务状态。</p>
      </div>

      <div class="page-header__actions">
        <tiny-button round @click="handleRefreshPage">
          刷新状态
        </tiny-button>
        <tiny-button round @click="handleClusterPower">
          {{ cluster.status === 'stopped' ? '启动集群' : '停止集群' }}
        </tiny-button>
        <tiny-button type="primary" round @click="openClusterDialog">
          编辑基础信息
        </tiny-button>
      </div>
    </section>

    <section class="detail-card">
      <div class="detail-card__header">
        <div>
          <h2>详细信息</h2>
          <p>支持复制关键信息、调整运维策略并查看最近变更。</p>
        </div>

        <div class="detail-card__header-side">
          <tiny-tag :type="clusterTagType">{{ clusterStatusLabel }}</tiny-tag>
          <span>上次同步：{{ lastSyncAt }}</span>
        </div>
      </div>

      <div class="detail-stats">
        <article v-for="item in detailStats" :key="item.label" class="detail-stat">
          <span class="detail-stat__label">{{ item.label }}</span>
          <div class="detail-stat__value">{{ item.value }}</div>
          <span class="detail-stat__helper">{{ item.helper }}</span>
        </article>
      </div>

      <div class="detail-grid">
        <article v-for="group in detailGroups" :key="group.title" class="detail-group">
          <h3>{{ group.title }}</h3>

          <div class="detail-fields">
            <div v-for="item in group.items" :key="item.label" class="detail-field">
              <span class="detail-field__label">{{ item.label }}</span>

              <div class="detail-field__content">
                <template v-if="item.isStatus">
                  <span class="status-chip" :class="`is-${cluster.status}`">
                    <span class="status-chip__dot" />
                    <span>{{ item.value }}</span>
                  </span>
                </template>

                <template v-else>
                  <span class="detail-field__value">{{ item.value }}</span>
                </template>

                <tiny-button
                  v-if="item.copyable"
                  type="text"
                  class="field-copy-btn"
                  @click="copyText(item.value, item.label)"
                >
                  <component :is="TinyIconCopy" />
                </tiny-button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="detail-footer">
        <div class="detail-switches">
          <div class="strategy-card">
            <span class="strategy-card__label">维护模式</span>
            <div class="strategy-card__control">
              <tiny-switch :model-value="maintenanceMode" @change="handleMaintenanceChange" />
              <span>{{ maintenanceMode ? '已开启' : '已关闭' }}</span>
            </div>
          </div>

          <div class="strategy-card">
            <span class="strategy-card__label">自动续费</span>
            <div class="strategy-card__control">
              <tiny-switch :model-value="autoRenewEnabled" @change="handleAutoRenewChange" />
              <span>{{ autoRenewEnabled ? '已启用' : '已关闭' }}</span>
            </div>
          </div>
        </div>

        <div class="activity-panel">
          <div class="activity-panel__header">
            <h3>最近操作</h3>
            <tiny-button type="text" @click="handleRefreshPage">同步日志</tiny-button>
          </div>

          <div class="activity-list">
            <article
              v-for="item in activityLogs"
              :key="item.id"
              class="activity-item"
              :class="`is-${item.tone}`"
            >
              <div class="activity-item__top">
                <div>{{ item.title }}</div>
                <span>{{ item.time }}</span>
              </div>
              <p>{{ item.detail }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="task-card">
      <div class="task-card__header">
        <div>
          <h2>项目任务</h2>
          <p>任务支持筛选、分页、创建、编辑、批量冻结和删除。</p>
        </div>

        <div class="task-card__summary">
          <span>共 {{ total }} 条</span>
          <span>已选 {{ selectedCount }} 条</span>
        </div>
      </div>

      <div class="task-toolbar">
        <div class="task-toolbar__actions">
          <tiny-button type="primary" round @click="openCreateTaskDialog">
            新建任务
          </tiny-button>
          <tiny-button round @click="handleBatchFreeze">批量冻结</tiny-button>
          <tiny-button round @click="handleBatchDelete">
            批量删除
          </tiny-button>
        </div>

        <div class="task-toolbar__filters">
          <tiny-select
            v-model="statusFilter"
            class="task-toolbar__select"
            :options="statusOptions"
            text-field="label"
            value-field="value"
            placeholder="请选择状态"
          />
          <tiny-input
            v-model="keyword"
            class="task-toolbar__search"
            :prefix-icon="TinyIconSearch"
            placeholder="请输入任务关键词"
            clearable
          />
        </div>
      </div>

      <tiny-grid
        class="task-grid"
        :data="pagedTasks"
        :select-config="selectConfig"
        :show-overflow="true"
        :show-header-overflow="true"
      >
        <tiny-grid-column type="selection" width="54" />
        <tiny-grid-column field="name" title="项目名称" min-width="220" />

        <tiny-grid-column field="owner" title="负责人" min-width="180">
          <template #default="{ row }">
            <div class="owner-cell">
              <span class="owner-cell__avatar" :class="getOwnerTone(row.owner)">
                {{ getOwnerBadge(row.owner) }}
              </span>
              <div>
                <div>{{ row.owner }}</div>
                <span>{{ row.ownerRole }}</span>
              </div>
            </div>
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="dataValue" title="数据" min-width="130" />

        <tiny-grid-column field="statusLabel" title="状态" min-width="130">
          <template #default="{ row }">
            <span class="status-chip" :class="getTaskStatusMeta(row.status).className">
              <span class="status-chip__dot" />
              <span>{{ row.statusLabel }}</span>
            </span>
          </template>
        </tiny-grid-column>

        <tiny-grid-column field="startDate" title="开始日期" min-width="140" sortable />

        <tiny-grid-column field="progress" title="当前进度" min-width="220">
          <template #default="{ row }">
            <div class="progress-cell">
              <tiny-progress :percentage="row.progress" :show-text="false" :stroke-width="8" />
              <span>{{ row.progress }}%</span>
            </div>
          </template>
        </tiny-grid-column>

        <tiny-grid-column title="操作" min-width="240">
          <template #default="{ row }">
            <div class="row-actions">
              <tiny-button type="text" @click="openEditTaskDialog(row)">编辑</tiny-button>
              <tiny-button type="text" @click="handleAdvanceTask(row)">推进</tiny-button>
              <tiny-button type="text" @click="handleDeleteTask(row)">删除</tiny-button>
            </div>
          </template>
        </tiny-grid-column>
      </tiny-grid>

      <div class="task-footer">
        <div class="task-footer__tip">
          <span>展示 {{ pagedTasks.length }} / {{ total }} 条任务</span>
          <span>运行中 {{ activeTaskCount }} 条</span>
        </div>

        <tiny-pager
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[6, 12, 18]"
          :pager-count="7"
          :total="total"
          layout="sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </section>

    <tiny-dialog-box
      v-model:visible="clusterDialogVisible"
      title="编辑基础信息"
      width="680px"
      top="10vh"
      class="detail-dialog"
    >
      <div class="detail-dialog__body">
        <tiny-form ref="clusterFormRef" :model="clusterForm" :rules="clusterRules" label-position="top" class="dialog-form">
          <div class="dialog-form__grid">
            <tiny-form-item label="集群名称" prop="name">
              <tiny-input v-model="clusterForm.name" placeholder="请输入集群名称" />
            </tiny-form-item>
            <tiny-form-item label="节点规模" prop="nodeCount">
              <tiny-input v-model="clusterForm.nodeCount" placeholder="请输入节点数" />
            </tiny-form-item>
            <tiny-form-item label="内网地址" prop="endpoint" class="dialog-form__full">
              <tiny-input v-model="clusterForm.endpoint" placeholder="请输入访问地址" />
            </tiny-form-item>
            <tiny-form-item label="计费模式" prop="billingMode">
              <tiny-select v-model="clusterForm.billingMode" :options="billingOptions" text-field="label" value-field="value" placeholder="请选择" />
            </tiny-form-item>
            <tiny-form-item label="到期处理策略" prop="expirePolicy">
              <tiny-select v-model="clusterForm.expirePolicy" :options="expirePolicyOptions" text-field="label" value-field="value" placeholder="请选择" />
            </tiny-form-item>
            <tiny-form-item label="备注" class="dialog-form__full">
              <tiny-input v-model="clusterForm.description" type="textarea" :rows="4" placeholder="请输入补充说明" />
            </tiny-form-item>
          </div>
        </tiny-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <tiny-button round @click="closeClusterDialog">取消</tiny-button>
          <tiny-button type="primary" round @click="saveClusterDialog">保存</tiny-button>
        </div>
      </template>
    </tiny-dialog-box>

    <tiny-dialog-box
      v-model:visible="taskDialogVisible"
      :title="taskDialogMode === 'create' ? '新建任务' : '编辑任务'"
      width="720px"
      top="10vh"
      class="detail-dialog"
    >
      <div class="detail-dialog__body">
        <tiny-form ref="taskFormRef" :model="taskForm" :rules="taskRules" label-position="top" class="dialog-form">
          <div class="dialog-form__grid">
            <tiny-form-item label="项目名称" prop="name">
              <tiny-input v-model="taskForm.name" placeholder="请输入项目名称" />
            </tiny-form-item>
            <tiny-form-item label="负责人" prop="owner">
              <tiny-input v-model="taskForm.owner" placeholder="请输入负责人" />
            </tiny-form-item>
            <tiny-form-item label="负责人角色" prop="ownerRole">
              <tiny-select v-model="taskForm.ownerRole" :options="ownerRoleOptions" text-field="label" value-field="value" placeholder="请选择" />
            </tiny-form-item>
            <tiny-form-item label="状态" prop="status">
              <tiny-select v-model="taskForm.status" :options="taskStatusOptions" text-field="label" value-field="value" placeholder="请选择" />
            </tiny-form-item>
            <tiny-form-item label="数据" prop="dataValue">
              <tiny-input v-model="taskForm.dataValue" placeholder="请输入数据值" />
            </tiny-form-item>
            <tiny-form-item label="开始日期" prop="startDate">
              <tiny-date-picker v-model="taskForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始日期" />
            </tiny-form-item>
            <tiny-form-item label="当前进度" prop="progress">
              <tiny-input v-model="taskForm.progress" placeholder="请输入 0-100" />
            </tiny-form-item>
            <tiny-form-item label="备注" class="dialog-form__full">
              <tiny-input v-model="taskForm.remark" type="textarea" :rows="4" placeholder="请输入任务说明" />
            </tiny-form-item>
          </div>
        </tiny-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <tiny-button round @click="closeTaskDialog">取消</tiny-button>
          <tiny-button type="primary" round @click="saveTaskDialog">确定</tiny-button>
        </div>
      </template>
    </tiny-dialog-box>

    <tiny-dialog-box
      v-model:visible="deleteDialogVisible"
      title="删除任务"
      width="640px"
      top="10vh"
      class="detail-dialog detail-dialog--delete"
    >
      <div class="delete-dialog__body">
        <p class="delete-dialog__tip">您即将删除以下 {{ deleteTargets.length }} 个任务，删除后不可恢复。</p>

        <tiny-grid :data="deleteTargets" :show-overflow="true" :show-header-overflow="true">
          <tiny-grid-column field="name" title="项目名称" min-width="180" />
          <tiny-grid-column field="owner" title="负责人" min-width="120" />
          <tiny-grid-column field="statusLabel" title="状态" min-width="120">
            <template #default="{ row }">
              <span class="status-chip" :class="getTaskStatusMeta(row.status).className">
                <span class="status-chip__dot" />
                <span>{{ row.statusLabel }}</span>
              </span>
            </template>
          </tiny-grid-column>
        </tiny-grid>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <tiny-button round @click="closeDeleteDialog">取消</tiny-button>
          <tiny-button type="primary" round @click="confirmDelete">删除</tiny-button>
        </div>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<style scoped>
.basic-detail-page {
  padding: 24px;
}

.page-header,
.detail-card,
.task-card {
  border-radius: 8px;
  background: #fff;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
}

.page-header h1,
.detail-card h2,
.task-card h2 {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  color: #191919;
}

.page-header p,
.detail-card__header p,
.task-card__header p {
  margin: 8px 0 0;
  font-size: 14px;
  color: #595959;
}

.page-header__actions,
.detail-card__header-side,
.task-toolbar,
.task-toolbar__actions,
.task-toolbar__filters{
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.detail-card,
.task-card {
  margin-top: 16px;
  padding: 24px;
}

.detail-card__header,
.task-card__header,
.task-footer,
.detail-footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.detail-card__header-side {
  font-size: 13px;
  color: #595959;
}

.detail-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 24px;
}

.detail-stat,
.strategy-card {
  padding: 16px 18px;
  border-radius: 8px;
}

.detail-stat {
  border: 1px solid #e4ebf6;
  background: linear-gradient(180deg, #f9fbff 0%, #f5f8ff 100%);
}

.detail-stat__label,
.detail-field__label,
.strategy-card__label {
  display: block;
  font-size: 13px;
  color: #595959;
}

.detail-stat__value {
  display: block;
  margin-top: 8px;
  font-size: 22px;
  color: #191919;
}

.detail-stat__helper {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #808080;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.detail-group h3,
.activity-panel h3 {
  margin: 0 0 20px;
  font-size: 15px;
  color: #191919;
}

.detail-fields,
.activity-list,
.detail-switches {
  display: grid;
  gap: 14px;
}

.detail-field__content {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.detail-field__value {
  font-size: 14px;
  line-height: 1.6;
  color: #191919;
  word-break: break-word;
}

.field-copy-btn {
  min-width: 28px;
  padding: 0;
}

.detail-footer {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #eef2f6;
}

.detail-switches {
  min-width: 240px;
}

.strategy-card {
  background: #f8fafc;
}

.strategy-card__control {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  font-size: 13px;
  color: #191919;
}

.activity-panel {
  flex: 1;
  min-width: 0;
}

.activity-panel__header,
.activity-item__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.activity-item {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #eef2f6;
  background: #fbfcfe;
}

.activity-item__top {
  margin-bottom: 8px;
}

.activity-item__top div {
  font-size: 14px;
  color: #191919;
}

.activity-item__top span,
.activity-item p {
  font-size: 13px;
  color: #595959;
}

.activity-item p {
  margin: 0;
  line-height: 1.6;
}

.activity-item.is-success {
  border-color: #d8f0de;
  background: #f4fbf6;
}

.activity-item.is-warning {
  border-color: #f8e4bd;
  background: #fff9ef;
}

.task-card__summary,
.task-footer__tip {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: #595959;
}

.task-toolbar {
  justify-content: space-between;
  margin: 22px 0 16px;
}

.task-toolbar__select {
  width: 160px;
}

.task-toolbar__search {
  width: 260px;
}

.owner-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}


.owner-cell div,
.owner-cell span {
  display: block;
}

.owner-cell div {
  font-size: 14px;
  color: #191919;
}

.owner-cell span {
  margin-top: 2px;
  font-size: 12px;
  color: #808080;
}

.owner-cell__avatar.owner-cell__avatar {
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
}

.status-chip__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-chip.is-running { color: #2ba246; }
.status-chip.is-maintenance,
.status-chip.is-freeze { color: #f59e0b; }
.status-chip.is-fail,
.status-chip.is-stopped { color: #ef4444; }
.status-chip.is-shutdown { color: #98a2b3; }

.progress-cell,
.row-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-cell span {
  min-width: 40px;
  font-size: 13px;
  color: #475467;
}

.task-footer {
  margin-top: 18px;
  align-items: center;
}

.detail-dialog__body,
.delete-dialog__body {
  padding: 6px 2px 0;
}

.dialog-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.dialog-form__full {
  grid-column: 1 / -1;
}

.delete-dialog__tip {
  margin: 0 0 16px;
  font-size: 14px;
  color: #475467;
}

.task-grid :deep(.tiny-grid) {
  border: none;
}

.task-grid :deep(.tiny-grid__header-wrapper),
.task-grid :deep(.tiny-grid__body-wrapper) {
  border-bottom: 1px solid #edf1f5;
}

.task-grid :deep(.tiny-grid-header__row) {
  height: 42px;
  background: #f7f8fa;
}

.task-grid :deep(.tiny-grid-header__column) {
  border-right: none;
  color: #4b5565;
  font-size: 13px;
  font-weight: 600;
}

.task-grid :deep(.tiny-grid-body__column) {
  border-right: none;
  color: #191919;
  font-size: 14px;
}

.task-grid :deep(.tiny-grid-body__row:hover .tiny-grid-body__column) {
  background: #f9fbff;
}

.task-grid :deep(.tiny-grid-cell) {
  padding-top: 15px;
  padding-bottom: 15px;
}

.progress-cell :deep(.tiny-progress) {
  flex: 1;
}

.progress-cell :deep(.tiny-progress-bar__outer) {
  background: #edf2f7;
}

.progress-cell :deep(.tiny-progress-bar__inner) {
  background: linear-gradient(90deg, #7ac70c 0%, #59b300 100%);
}

:deep(.task-toolbar__select .tiny-input__inner),
:deep(.task-toolbar__search .tiny-input__inner),
:deep(.dialog-form .tiny-input__inner),
:deep(.dialog-form .tiny-base-select .tiny-input__inner),
:deep(.dialog-form .tiny-date-editor .tiny-input__inner) {
  height: 36px;
  border-radius: 6px;
}

:deep(.dialog-form .tiny-textarea__inner) {
  border-radius: 6px;
}

:deep(.detail-dialog .tiny-dialog-box) {
  border-radius: 12px;
}

:deep(.detail-dialog .tiny-dialog-box__header) {
  padding: 22px 24px 0;
}

:deep(.detail-dialog .tiny-dialog-box__title) {
  font-size: 18px;
  color: #191919;
}

:deep(.detail-dialog .tiny-dialog-box__body) {
  padding: 12px 24px 8px;
}

:deep(.detail-dialog .tiny-dialog-box__footer) {
  padding: 0 24px 22px;
}

:deep(.tiny-tag) {
  border-radius: 999px;
}

@media (max-width: 1400px) {
  .detail-grid,
  .detail-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .basic-detail-page {
    padding: 16px;
  }

  .page-header,
  .detail-card__header,
  .detail-footer,
  .task-card__header,
  .task-toolbar,
  .task-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header__actions,
  .task-toolbar__actions,
  .task-toolbar__filters,
  .task-card__summary,
  .task-footer__tip {
    flex-wrap: wrap;
  }

  .detail-grid,
  .detail-stats,
  .dialog-form__grid {
    grid-template-columns: 1fr;
  }

  .task-toolbar__search,
  .task-toolbar__select {
    width: 100%;
  }
}
</style>
