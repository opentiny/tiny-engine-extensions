<script setup lang="ts">
import { ref } from 'vue'
import {
  ButtonGroup as TinyButtonGroup,
  Progress as TinyProgress,
  Tag as TinyTag,
} from '@opentiny/vue'
import ServiceFeatureCard from '../components/ServiceFeatureCard.vue'
import StorageMetricCard from '../components/StorageMetricCard.vue'
import {
  TinyHuichartsHistogram,
  TinyHuichartsLine,
} from '@opentiny/vue-huicharts'
import { iconRefresh } from '@opentiny/vue-icon'
const activeBoundary = ref('internet')
const activePeriod = ref('week')
const TinyIconRefresh = iconRefresh()

type TinyChartOptions = Record<string, any>
type StorageCard = {
  title: string
  value: string
  unit: string
  footLabel: string
  footValue: string
  tagType: 'info' | 'success' | 'danger' | 'warning'
  color: string
  chartOptions: TinyChartOptions
}

type RelatedService = {
  title: string
  description: string
  badge: string
  badgeType: 'danger' | 'success' | 'info' | 'warning'
  accent: string
  category: string
}

const boundaryTabs = [
  { text: '互联网边界', value: 'internet' },
  { text: 'VPC边界', value: 'vpc' },
  { text: 'VGW', value: 'vgw' },
]

const periodTabs = [
  { text: '一周', value: 'week' },
  { text: '24小时', value: 'day' },
  { text: '1小时', value: 'hour' },
]

const overviewCards: StorageCard[] = [
  {
    title: 'Token消耗',
    value: '0.12',
    unit: '万Tokens',
    footLabel: '今日消耗',
    footValue: '0.54万Tokens',
    tagType: 'info',
    color: '#1fc7c9',
    chartOptions: {
      padding: [0, 0, 0, 0],
      color: ['#1fc7c9'],
      smooth: true,
      area: true,
      silent: true,
      legend: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      xAxis: {
        keyName: '时间',
        show: false,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        show: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      data: [
        { 时间: '1', 数值: 45 },
        { 时间: '2', 数值: 45 },
        { 时间: '3', 数值: 41 },
        { 时间: '4', 数值: 43 },
        { 时间: '5', 数值: 46 },
        { 时间: '6', 数值: 45 },
        { 时间: '7', 数值: 48 },
        { 时间: '8', 数值: 48 },
        { 时间: '9', 数值: 41 },
        { 时间: '10', 数值: 34 },
        { 时间: '11', 数值: 46 },
        { 时间: '12', 数值: 52 },
        { 时间: '13', 数值: 46 },
        { 时间: '14', 数值: 38 },
      ],
      series: [
        {
          name: '数值',
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: '#1fc7c9',
          },
        },
      ],
    },
  },
  {
    title: '用户数',
    value: '232',
    unit: '',
    footLabel: '今日新增',
    footValue: '21.5',
    tagType: 'success',
    color: '#4a93ff',
    chartOptions: {
      padding: [0, 0, 0, 0],
      color: ['#4a93ff'],
      smooth: true,
      area: true,
      silent: true,
      legend: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      xAxis: {
        keyName: '时间',
        show: false,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        show: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      data: [
        { 时间: '1', 数值: 38 },
        { 时间: '2', 数值: 37 },
        { 时间: '3', 数值: 31 },
        { 时间: '4', 数值: 29 },
        { 时间: '5', 数值: 34 },
        { 时间: '6', 数值: 33 },
        { 时间: '7', 数值: 36 },
        { 时间: '8', 数值: 38 },
        { 时间: '9', 数值: 32 },
        { 时间: '10', 数值: 18 },
        { 时间: '11', 数值: 36 },
        { 时间: '12', 数值: 44 },
        { 时间: '13', 数值: 41 },
        { 时间: '14', 数值: 33 },
      ],
      series: [
        {
          name: '数值',
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: '#4a93ff',
          },
        },
      ],
    },
  },
  {
    title: '在线应用数',
    value: '1236',
    unit: '',
    footLabel: '今日新增',
    footValue: '21.5%',
    tagType: 'success',
    color: '#7b62ff',
    chartOptions: {
      padding: [0, 0, 0, 0],
      color: ['#7b62ff'],
      smooth: true,
      area: true,
      silent: true,
      legend: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      xAxis: {
        keyName: '时间',
        show: false,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        show: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      data: [
        { 时间: '1', 数值: 36 },
        { 时间: '2', 数值: 35 },
        { 时间: '3', 数值: 30 },
        { 时间: '4', 数值: 28 },
        { 时间: '5', 数值: 32 },
        { 时间: '6', 数值: 35 },
        { 时间: '7', 数值: 34 },
        { 时间: '8', 数值: 37 },
        { 时间: '9', 数值: 30 },
        { 时间: '10', 数值: 18 },
        { 时间: '11', 数值: 36 },
        { 时间: '12', 数值: 42 },
        { 时间: '13', 数值: 35 },
        { 时间: '14', 数值: 31 },
      ],
      series: [
        {
          name: '数值',
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: '#7b62ff',
          },
        },
      ],
    },
  },
  {
    title: '会话数',
    value: '375',
    unit: '',
    footLabel: '日环比',
    footValue: '18.3%',
    tagType: 'danger',
    color: '#f3c536',
    chartOptions: {
      padding: [0, 0, 0, 0],
      color: ['#f3c536'],
      smooth: true,
      area: true,
      silent: true,
      legend: {
        show: false,
      },
      tooltip: {
        show: false,
      },
      xAxis: {
        keyName: '时间',
        show: false,
        boundaryGap: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      yAxis: {
        show: false,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false },
      },
      data: [
        { 时间: '1', 数值: 42 },
        { 时间: '2', 数值: 41 },
        { 时间: '3', 数值: 37 },
        { 时间: '4', 数值: 40 },
        { 时间: '5', 数值: 44 },
        { 时间: '6', 数值: 44 },
        { 时间: '7', 数值: 47 },
        { 时间: '8', 数值: 42 },
        { 时间: '9', 数值: 35 },
        { 时间: '10', 数值: 49 },
        { 时间: '11', 数值: 53 },
        { 时间: '12', 数值: 46 },
        { 时间: '13', 数值: 39 },
        { 时间: '14', 数值: 42 },
      ],
      series: [
        {
          name: '数值',
          showSymbol: false,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
          },
          itemStyle: {
            color: '#f3c536',
          },
        },
      ],
    },
  },
]

const operationStats = [
  { label: '访问控制拦截', value: '6576', suffix: '次' },
  { label: '入侵防御', value: '3659', suffix: '次', tag: '拦截' },
  { label: '出方向流量峰值', value: '68.23', suffix: 'bps' },
  { label: '入方向流量峰值', value: '23.34', suffix: 'bps' },
]

const flowTrendOptions = ref<TinyChartOptions>({
  padding: [54, 18, 20, 18],
  color: ['#22c3c7', '#f3c536', '#7d68f9'],
  smooth: true,
  area: true,
  data: [
    { 时间: '10:10', 入方向: 60, 出方向: 46, 总体: 54 },
    { 时间: '10:20', 入方向: 71, 出方向: 31, 总体: 52 },
    { 时间: '10:30', 入方向: 54, 出方向: 49, 总体: 57 },
    { 时间: '10:40', 入方向: 52, 出方向: 34, 总体: 49 },
    { 时间: '10:50', 入方向: 69, 出方向: 47, 总体: 63 },
    { 时间: '11:00', 入方向: 48, 出方向: 58, 总体: 66 },
  ],
  legend: {
    show: true,
    position: {
      left: 0,
      top: 4,
    },
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
    textStyle: {
      color: '#667085',
      fontSize: 12,
    },
  },
  xAxis: {
    keyName: '时间',
    boundaryGap: false,
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#98a2b3',
      margin: 12,
    },
    splitLine: { show: false },
  },
  yAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#98a2b3',
      margin: 12,
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#e7edf7',
      },
    },
  },
  series: [
    { name: '入方向', lineStyle: { width: 2.25 }, areaStyle: { opacity: 0.08 }, showSymbol: false },
    { name: '出方向', lineStyle: { width: 2.25 }, areaStyle: { opacity: 0.08 }, showSymbol: false },
    { name: '总体', lineStyle: { width: 2.25 }, areaStyle: { opacity: 0.08 }, showSymbol: false },
  ],
})

const attackTrendOptions = ref<TinyChartOptions>({
  type: "stack",
  padding: [54, 12, 8, 12],
  color: ['#1f7aff', '#20c7c9'],
  data: [
    { 时间: '10:10', 拦截: 60, 放行: 32 },
    { 时间: '10:20', 拦截: 48, 放行: 21 },
    { 时间: '10:30', 拦截: 55, 放行: 16 },
    { 时间: '10:40', 拦截: 42, 放行: 12 },
    { 时间: '10:50', 拦截: 63, 放行: 24 },
    { 时间: '11:00', 拦截: 44, 放行: 31 },
    { 时间: '11:10', 拦截: 45, 放行: 30 },
    { 时间: '11:20', 拦截: 42, 放行: 26 },
    { 时间: '11:30', 拦截: 67, 放行: 11 },
    { 时间: '11:40', 拦截: 38, 放行: 27 },
    { 时间: '11:50', 拦截: 33, 放行: 19 },
    { 时间: '12:00', 拦截: 37, 放行: 20 },
  ],
  legend: {
    show: true,
    position: {
      left: 0,
      top: 4,
    },
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
    textStyle: {
      color: '#667085',
      fontSize: 12,
    },
  },
  tooltip: {
    show: true,
  },
  xAxis: {
    keyName: '时间',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#98a2b3',
      interval: 0,
      fontSize: 11,
    },
  },
  yAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#98a2b3',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#e7edf7',
      },
    },
  },
  itemStyle: {
    borderRadius: [6, 6, 0, 0],
  },
  series: [
    { name: '拦截', barMaxWidth: 14 },
    { name: '放行', barMaxWidth: 14 },
  ],
})

const accessControlOptions = ref<TinyChartOptions>({
  type: "stack",
  padding: [54, 12, 8, 12],
  color: ['#1f7aff', '#20c7c9'],
  data: [
    { 时间: '10:10', 拦截: 58, 放行: 30 },
    { 时间: '10:20', 拦截: 44, 放行: 24 },
    { 时间: '10:30', 拦截: 52, 放行: 18 },
    { 时间: '10:40', 拦截: 40, 放行: 14 },
    { 时间: '10:50', 拦截: 65, 放行: 22 },
    { 时间: '11:00', 拦截: 46, 放行: 29 },
    { 时间: '11:10', 拦截: 44, 放行: 28 },
    { 时间: '11:20', 拦截: 39, 放行: 25 },
    { 时间: '11:30', 拦截: 61, 放行: 12 },
    { 时间: '11:40', 拦截: 41, 放行: 26 },
    { 时间: '11:50', 拦截: 31, 放行: 20 },
    { 时间: '12:00', 拦截: 35, 放行: 22 },
  ],
  legend: {
    show: true,
    position: {
      left: 0,
      top: 4,
    },
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
    textStyle: {
      color: '#667085',
      fontSize: 12,
    },
  },
  tooltip: {
    show: true,
  },
  xAxis: {
    keyName: '时间',
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#98a2b3',
      interval: 0,
      fontSize: 11,
    },
  },
  yAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: '#98a2b3',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#e7edf7',
      },
    },
  },
  itemStyle: {
    borderRadius: [6, 6, 0, 0],
  },
  series: [
    { name: '拦截', barMaxWidth: 14 },
    { name: '放行', barMaxWidth: 14 },
  ],
})

const detailBaseInfo = [
  { label: '版本', value: '专业版', tagType: 'info' },
  { label: '防火墙ID', value: '234nd-3344kkjil-34hduo' },
  { label: '引擎类型', value: '直路引擎' },
]

const detailSpecs = [
  { label: '已使用/可防护EIP数', value: '50/100', percentage: 50, color: '#1fc7c9' },
  { label: '总防护VPC数/购买VPC数', value: '400/1000', percentage: 40, color: '#22c3c7' },
]

const detailMeta = [
  { label: '可防护互联网流量峰值', value: '50 Mbps' },
  { label: '可防护VPC流量峰值', value: '200 Mbps' },
  { label: '已使用/可使用防护规则', value: '11/2000 条' },
  { label: '计费模式', value: '包年/包月' },
  { label: '是否自动续费', value: '是' },
  { label: '购买订单', value: 'CS23388477484949890', accent: true },
  { label: '创建时间', value: '2019/03/09 05:01:09  GMT+8:00' },
  { label: '到期时间', value: '2020/12/29 20:10:45  GMT+8:00' },
]

const questions = [
  {
    title: '什么是Object_Id?',
    description:
      'Object_Id防护对象id，是创建云防火墙后用于区分互联网边界防护和VPC边界防护的标志。',
  },
  {
    title: '云防火墙支持哪些维度的访问控制?',
    description:
      '云防火墙当前支持基于五元组、IP地址组、服务组、域名、应用、黑名单、白名单设置访问控制策略。',
  },
  {
    title: '配置阻断IP的防护规则需要注意哪些?',
    description:
      '配置阻断IP的防护规则需注意以下几点：建议优先配置精准的IP（如192.168.10.5），减少误拦截风险。',
  },
  {
    title: '业务流量异常如何排查CFW侧防护?',
    description:
      '当您的业务流量异常，可能被CFW中断时，建议优先查看访问控制、入侵防御与防护规则变更记录。',
  },
]

const relatedServices: RelatedService[] = [
  {
    title: '企业上云数据安全解决方案',
    description: '解决华为云上业务数据生命周期安全问题，保护业务数据安全和业务稳定运行。',
    badge: '热门',
    badgeType: 'danger',
    accent: '/serviceFeature1.svg',
    category: '企业建站首备',
  },
  {
    title: '云服务器快速备份',
    description: '基于最优备份策略，一键式全量备份Region未备份弹性云服务器，配置简单，业务无感知。',
    badge: '热门',
    badgeType: 'danger',
    accent: '/serviceFeature2.svg',
    category: '企业建站首备',
  },
  {
    title: 'Web应用防火墙',
    description: '网站业务流量多维度检测和防护，全面避免网站被黑客恶意攻击和入侵。',
    badge: '热门',
    badgeType: 'danger',
    accent: '/serviceFeature3.svg',
    category: '企业建站首备',
  },
  {
    title: 'CDN下载加速',
    description: '通过CDN+OBS服务组合，有效加速静态资源文件的访问和下载速度，同时降低带宽流量成本。',
    badge: '新品',
    badgeType: 'info',
    accent: '/serviceFeature4.svg',
    category: '网络加速类新产品',
  },
]

const onRefresh = () => {
  console.log('refresh')
}

</script>

<template>
  <div class="dashboard-main">
    <div class="page-heading">
      <h1>总览</h1>
    </div>
        <div class="panel-div">
          <div class="div-heading">
            <h2>存储</h2>
          </div>

          <div class="overview-grid">
            <storage-metric-card
              v-for="card in overviewCards"
              :key="card.title"
              :title="card.title"
              :value="card.value"
              :unit="card.unit"
              :foot-label="card.footLabel"
              :foot-value="card.footValue"
              :tag-type="card.tagType"
              :chart-options="card.chartOptions"
            />
          </div>
        </div>

        <div class="main-grid">
          <div class="main-grid__primary">
            <div class="panel-card">
              <div class="panel-card__header">
                <div>
                  <h2>运营看板</h2>
                  <p>关键流量、攻击与访问控制趋势</p>
                </div>

                <tiny-button-group
                  v-model="activePeriod"
                  class="compact-group compact-group--light"
                  :data="periodTabs"
                  size="small"
                  plain
                />
              </div>

              <div class="panel-toolbar">
                <tiny-button-group
                  v-model="activeBoundary"
                  class="compact-group"
                  :data="boundaryTabs"
                  size="small"
                />
              </div>

              <div class="stats-row">
                <div v-for="stat in operationStats" :key="stat.label" class="stat-box">
                  <div class="stat-box__value-row">
                    <span class="stat-box__value">{{ stat.value }}</span>
                    <span class="stat-box__suffix">{{ stat.suffix }}</span>
                    <tiny-tag
                      v-if="stat.tag"
                      type="warning"
                      effect="light"
                      size="small"
                      class="stat-box__tag"
                    >
                      {{ stat.tag }}
                    </tiny-tag>
                  </div>
                  <p class="stat-box__label">{{ stat.label }}</p>
                </div>
              </div>

              <div class="chart-panel">
                <div class="subdiv-heading">
                  <h3>流量趋势</h3>
                  <span>Units %</span>
                </div>

                <tiny-huicharts-line
                  :options="flowTrendOptions"
                  width="100%"
                  height="320px"
                />
              </div>

              <div class="mini-chart-grid">
                <div class="chart-panel">
                  <div class="subdiv-heading">
                    <h3>攻击趋势</h3>
                  </div>
                  <tiny-huicharts-histogram
                    :options="attackTrendOptions"
                    width="100%"
                    height="260px"
                  />
                </div>

                <div class="chart-panel">
                  <div class="subdiv-heading">
                    <h3>访问控制</h3>
                  </div>
                  <tiny-huicharts-histogram
                    :options="accessControlOptions"
                    width="100%"
                    height="260px"
                  />
                </div>
              </div>
            </div>

            <div class="panel-card faq-card">
              <div class="faq-card__header">
                <h2>常见问题</h2>
                <span class="faq-card__arrow">›</span>
              </div>

              <div class="faq-grid">
                <div v-for="question in questions" :key="question.title" class="faq-item">
                  <h3>{{ question.title }}</h3>
                  <p>{{ question.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="main-grid__aside">
            <div class="panel-card detail-card">
              <div class="detail-card__title">
                <h2>防火墙详情</h2>
              </div>

              <div class="detail-block">
                <h3>基本信息</h3>
                <div class="detail-list">
                  <div v-for="item in detailBaseInfo" :key="item.label" class="detail-row">
                    <span class="detail-row__label">{{ item.label }}</span>
                    <div class="detail-row__value">
                      <tiny-tag
                        v-if="item.tagType"
                        :type="item.tagType"
                        effect="light"
                        size="small"
                      >
                        {{ item.value }}
                      </tiny-tag>
                      <span v-else class="detail-row__text">{{ item.value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="detail-block">
                <h3>规格</h3>
                <div class="progress-stack">
                  <div v-for="item in detailSpecs" :key="item.label" class="progress-item">
                    <div class="progress-item__header">
                      <span class="progress-item__label">{{ item.label }}</span>
                      <div class="progress-item__value">{{ item.value }} 个</div>
                    </div>
                    <tiny-progress
                      :percentage="item.percentage"
                      :show-text="false"
                      :stroke-width="10"
                      :color="item.color"
                    />
                  </div>
                </div>

                <div class="spec-grid">
                  <div v-for="item in detailMeta.slice(0, 3)" :key="item.label" class="spec-item">
                    <span>{{ item.label }}</span>
                    <div>{{ item.value }}</div>
                  </div>
                </div>
              </div>

              <div class="detail-block">
                <h3>其他信息</h3>
                <div class="detail-meta-grid">
                  <div v-for="item in detailMeta.slice(3)" :key="item.label" class="detail-meta-item">
                    <span class="detail-meta-item__label">{{ item.label }}</span>
                    <span class="detail-meta-item__value" :class="{ 'detail-row__accent': item.accent }">
                      {{ item.value }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="detail-block">
                <h3>标签</h3>
                <div class="tag-line">
                  <span class="detail-tag-icon">🏷</span>
                  <span class="detail-tag-text">20</span>
                </div>
              </div>
            </div>

            <div class="panel-card practice-card">
              <div class="practice-card__header">
                <div>
                  <h2>最佳实践</h2>
                </div>
                <TinyIconRefresh @click="onRefresh" />
              </div>

              <div class="practice-hero">
                <div class="practice-hero__badge">👍 推荐阅读</div>
                <div class="practice-hero__text">
                  <h3>性能调优</h3>
                  <p>3,803人围观</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-card service-card">
          <div class="panel-card__header">
            <div>
              <h2>相关服务</h2>
            </div>
          </div>

          <div class="service-grid">
            <service-feature-card
              v-for="service in relatedServices"
              :key="service.title"
              :title="service.title"
              :description="service.description"
              :badge="service.badge"
              :badge-type="service.badgeType"
              :accent="service.accent"
              :category="service.category"
            />
          </div>
        </div>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  background: #f5f6f8;
}

.dashboard-sidebar {
  position: sticky;
  top: 0;
  align-self: start;
  height: 100vh;
  padding: 0;
  border-right: 1px solid #e7eaef;
  background: #ffffff;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  color: #222;
  text-decoration: none;
  border-bottom: 1px solid #e7eaef;
}

.brand-logo {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: #2f7df6;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.brand-desc {
  display: none;
  margin-top: 2px;
  font-size: 11px;
  color: #98a2b3;
}

.sidebar-nav {
  height: calc(100% - 40px);
  overflow-y: auto;
  padding: 12px 10px 18px;
}

.nav-div + .nav-div {
  margin-top: 8px;
}

.nav-div__title {
  margin: 0;
  padding: 8px 8px 6px;
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.nav-list {
  display: grid;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 10px;
  border-radius: 4px;
  color: #444;
  font-size: 13px;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-item:hover {
  background: #f5f7fa;
  color: #111;
}

.nav-item.is-active {
  background: #f5f7fa;
  color: #111;
  font-weight: 700;
}

.nav-item.is-muted {
  cursor: default;
  color: #666;
}

.nav-item__dot {
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.5;
}

.dashboard-content {
  min-width: 0;
  background: #f5f6f8;
}

.dashboard-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 40px;
  padding: 0 16px 0 18px;
  background: #fff;
  border-bottom: 1px solid #e7eaef;
}

.dashboard-topbar__title h1 {
  margin: 0;
  font-family: 'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  line-height: 1;
  font-weight: 600;
  color: #222;
}

.dashboard-topbar__title p {
  display: none;
}

.dashboard-topbar__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.dashboard-search {
  width: 220px;
}

.profile-pill {
  height: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px 0 4px;
  border-radius: 999px;
  background: transparent;
  color: #333;
  font-size: 12px;
  font-weight: 500;
}

.profile-pill__avatar {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #2f7df6;
  color: #fff;
  font-size: 12px;
}

.dashboard-main {
  padding: 16px;
}

.page-heading {
  margin-bottom: 12px;
}

.page-heading h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.panel-div,
.panel-card {
  border-radius: 8px;
  background: #fff;
  box-shadow: none;
}

.panel-div {
  padding: 16px;
}

.panel-card {
  padding: 16px;
}

.div-heading,
.panel-card__header,
.subdiv-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.div-heading h2,
.panel-card__header h2,
.subdiv-heading h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.panel-card__header p,
.subdiv-heading span {
  margin: 4px 0 0;
  font-size: 12px;
  color: #8a94a6;
}

.overview-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.main-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(360px, 0.82fr);
  gap: 16px;
}

.main-grid__primary,
.main-grid__aside {
  min-width: 0;
  display: grid;
  gap: 16px;
}

.panel-toolbar {
  margin-top: 12px;
}

:deep(.compact-group.tiny-button-group) {
  display: inline-flex;
  border-radius: 4px;
  background: #f3f4f6;
  padding: 0;
  border: 1px solid #eceef2;
}

:deep(.compact-group--light.tiny-button-group) {
  background: #f3f4f6;
  border-color: #f3f4f6;
}

:deep(.compact-group .tiny-button),
:deep(.compact-group--light .tiny-button) {
  min-width: 84px;
  height: 30px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 12px;
  border: none;
  background: transparent;
  color: #666;
  box-shadow: none;
}

:deep(.compact-group .tiny-button.is-checked),
:deep(.compact-group .tiny-button.tiny-button--primary),
:deep(.compact-group--light .tiny-button.is-checked),
:deep(.compact-group--light .tiny-button.tiny-button--primary) {
  background: #fff;
  color: #222;
  border: 1px solid #222;
}

:deep(.compact-group--light .tiny-button) {
  min-width: 72px;
  padding: 0 14px;
}

.stats-row {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-box {
  min-height: 68px;
  padding: 12px 16px 10px;
  border-radius: 6px;
  background: #fff;
}

.stat-box__value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.stat-box__value {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  line-height: 1;
}

.stat-box__suffix {
  color: #666;
  font-size: 12px;
  line-height: 1;
}

.stat-box__tag {
  margin-left: 4px;
}

.stat-box__label {
  margin: 10px 0 0;
  color: #8a94a6;
  font-size: 12px;
  line-height: 1;
}

.main-grid__primary > .panel-card:first-child > .panel-card__header {
  align-items: center;
  margin-bottom: 8px;
}

.main-grid__primary > .panel-card:first-child > .panel-card__header p {
  display: none;
}

.main-grid__primary > .panel-card:first-child .panel-toolbar {
  margin-top: 8px;
}

.main-grid__primary > .panel-card:first-child .panel-card__header h2 {
  font-size: 18px;
  font-weight: 600;
}

:deep(.stat-box__tag.tiny-tag) {
  padding: 0 6px;
  height: 18px;
  line-height: 18px;
  border: none;
  font-size: 12px;
  color: #f59a23;
  background: #fff3e8;
}

.chart-panel {
  margin-top: 12px;
  padding: 12px;
  border-radius: 6px;
  background: #fff;
}

.mini-chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.faq-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.faq-card {
  padding-top: 14px;
}

.faq-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 2px;
}

.faq-card__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.faq-card__arrow {
  color: #8a94a6;
  font-size: 20px;
  line-height: 1;
}

.faq-item {
  padding: 14px 16px 12px;
  border-radius: 6px;
  border: 1px solid #ebeef2;
  background: #fafafa;
}

.faq-item h3 {
  margin: 0;
  color: #222;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

.faq-item p {
  margin-top: 10px;
  color: #8a94a6;
  font-size: 12px;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-card {
  position: relative;
  padding-top: 14px;
}

.detail-card__title {
  margin-bottom: 16px;
}

.detail-card__title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.detail-block + .detail-block {
  border-top: 1px solid #f0f0f0;
  margin-top: 22px;
  padding-top: 18px;
}

.detail-block h3 {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 600;
  color: #222;
}

.detail-list {
  display: grid;
  gap: 12px;
}

.detail-list--compact {
  gap: 10px;
}

.detail-row {
  display: grid;
  gap: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.detail-row__label {
  color: #8a94a6;
}

.detail-row__value {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.detail-row__text {
  color: #222;
  font-size: 14px;
}

.detail-row__accent {
  color: #2473ff;
}

.progress-stack {
  display: grid;
  gap: 18px;
}

.progress-item__header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.progress-item__label {
  color: #8a94a6;
}

.progress-item__value {
  color: #222;
  font-size: 12px;
  font-weight: 500;
}

.progress-item__header div {
  color: #222;
}

.spec-grid {
  margin-top: 18px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 26px;
}

.spec-item {
  padding: 0;
  border-radius: 0;
  background: transparent;
}

.spec-item span {
  display: block;
  font-size: 12px;
  color: #8a94a6;
}

.spec-item div {
  display: block;
  margin-top: 4px;
  color: #222;
  font-size: 14px;
  font-weight: 500;
}

.detail-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 26px;
}

.detail-meta-item {
  display: grid;
  gap: 6px;
}

.detail-meta-item__label {
  color: #8a94a6;
  font-size: 12px;
}

.detail-meta-item__value {
  color: #222;
  font-size: 14px;
  line-height: 1.6;
}

.tag-line {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  color: #222;
  font-size: 14px;
}

.detail-tag-icon {
  font-size: 14px;
  line-height: 1;
}

.detail-tag-text {
  font-size: 14px;
  line-height: 1;
}

.practice-card {
  overflow: hidden;
  padding-top: 14px;
}

.practice-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.practice-card__header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #222;
}

.practice-card__action {
  color: #4b5565;
}

.practice-hero {
  position: relative;
  min-height: 172px;
  border-radius: 6px;
  overflow: hidden;
  background: url('/bastPractices.png') center / cover no-repeat;
}

.practice-hero__badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 10px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 2px;
  border-top-left-radius: 2px;
  border-top-right-radius: 8px;
  color: #2f7df6;
  font-size: 12px;
  background: #edf4ff;
}

.practice-hero__text {
  position: relative;
  z-index: 2;
  padding: 24px 22px;
}

.practice-hero__text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #222;
}

.practice-hero__text p {
  margin-top: 92px;
  color: #8a94a6;
  font-size: 12px;
  line-height: 1;
}

.service-card {
  margin-top: 16px;
}

.service-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
}

:deep(.dashboard-search .tiny-input__inner) {
  height: 28px;
  font-size: 12px;
  background: #f7f8fa;
  border-color: #eef1f4;
}

:deep(.tiny-button.tiny-button--text) {
  font-size: 12px;
  color: #444;
}

:deep(.tiny-tag) {
  font-size: 12px;
}

:deep(.tiny-progress-bar__outer) {
  background: #eceff3;
}

:deep(.detail-card .tiny-progress-bar__inner) {
  border-radius: 999px;
}

:deep(.detail-card .tiny-tag) {
  height: 22px;
  padding: 0 8px;
  border: none;
  font-size: 12px;
  line-height: 22px;
}

:deep(.detail-card .tiny-tag.tiny-tag--info) {
  color: #0ea5e9;
  background: #e7f6ff;
}

@media (max-width: 1440px) {
  .overview-grid,
  .service-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 1220px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }

  .dashboard-sidebar {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e7eaef;
  }

  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .dashboard-topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-topbar__actions {
    width: 100%;
    justify-content: flex-start;
  }

  .dashboard-search {
    width: 100%;
  }

  .overview-grid,
  .stats-row,
  .faq-grid,
  .mini-chart-grid,
  .service-grid,
  .spec-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard-topbar,
  .dashboard-main {
    padding-left: 16px;
    padding-right: 16px;
  }

  .panel-div,
  .panel-card {
    padding: 16px;
    border-radius: 8px;
  }

  .stat-box__value {
    font-size: 18px;
  }
}
</style>
