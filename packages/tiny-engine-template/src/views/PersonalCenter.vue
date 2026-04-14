<script setup lang="ts">
import { ref } from 'vue'
import {
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
} from '@opentiny/vue'

type CenterTab = 'plans' | 'projects'
type PlanStatus = 'completed' | 'expired' | 'unfinished'

type SummaryCard = {
  key: string
  count: number
  label: string
  iconType: 'completed' | 'expired' | 'upcoming' | 'unfinished'
}

type PlanItem = {
  index: number
  name: string
  startDate: string
  endDate: string
  status: PlanStatus
  statusLabel: string
  type: string
}

type ProjectItem = {
  title: string
  description: string
  icon: string
}

const activeTab = ref<CenterTab>('plans')

const centerTabs = [
  { text: '我的计划', value: 'plans' },
  { text: '我的项目', value: 'projects' },
]

const summaryCards: SummaryCard[] = [
  { key: 'completed', count: 6, label: '已完成', iconType: 'completed' },
  { key: 'expired', count: 3, label: '已逾期', iconType: 'expired' },
  { key: 'upcoming', count: 2, label: '已将逾期', iconType: 'upcoming' },
  { key: 'unfinished', count: 23, label: '未完成', iconType: 'unfinished' },
]

const planItems: PlanItem[] = [
  { index: 1, name: '智慧物流系统开发', startDate: '2022-01-15', endDate: '2022-01-15', status: 'unfinished', statusLabel: '未完成', type: '团队安排' },
  { index: 2, name: '智能工厂自动化升级', startDate: '2021-07-28', endDate: '2021-07-28', status: 'expired', statusLabel: '已逾期', type: '阶段计划' },
  { index: 3, name: '环保材料研发计划', startDate: '2023-03-01', endDate: '2023-03-01', status: 'completed', statusLabel: '已完成', type: '临时工单' },
  { index: 4, name: '电商平台优化', startDate: '2022-09-12', endDate: '2022-09-12', status: 'completed', statusLabel: '已完成', type: '团队安排' },
  { index: 5, name: '大数据分析平台建设', startDate: '2021-12-14', endDate: '2021-12-14', status: 'completed', statusLabel: '已完成', type: '团队安排' },
  { index: 6, name: '智能家居产品设计', startDate: '2022-01-15', endDate: '2022-01-15', status: 'completed', statusLabel: '已完成', type: '团队安排' },
]

const projectItems: ProjectItem[] = [
  { title: 'Tiny Design 设计体系', description: '华为云产品和服务的规范体系，包括交互视觉设计、业务流程、国际化、术语词...', icon: '/card_icon9.svg' },
  { title: 'Tiny DesignLink 设计流水线工具', description: '设计+协同+资源管理，一个工具就够了，在线原型设计、设计过程融入DevOps流...', icon: '/card_icon1.svg' },
  { title: 'TinyUI3.0 开发工具', description: 'Cloud Design System 提供了丰富的规范文档及开发组件。', icon: '/card_icon2.svg' },
  { title: 'TinyPlus3.0 开发工具', description: 'TinyPlus3.0 是基于Angular + Typescript的Web前端云业务组件库。', icon: '/card_icon3.svg' },
  { title: 'Tiny Stage 工程工具', description: '一个跨平台的前端工程化cli工具，为开发提供一系列开发套件和工程插件', icon: '/card_icon4.svg' },
  { title: 'Tiny Flow 接口编排工具', description: '端到端的API编排解决方案，通过可视化编程的方式快速生成、发布、调试的API编...', icon: '/card_icon5.svg' },
  { title: 'Tiny Gate 门禁系统', description: '门禁系统，通过卡点方式集成到代餐流水线，在服务发布时间生成预览页面。', icon: '/card_icon6.svg' },
  { title: 'Console Framework 控制台框架', description: '华为云各服务快速构建管理控制台的平台，华为云各服务快速构建管理控制台的平台。', icon: '/card_icon7.svg' },
  { title: 'Nodejs Framework Nodejs应用', description: '基于egg的定制化web服务框架，让你快速上手Nodejs做BFF意见微服务。', icon: '/card_icon8.svg' },
  { title: 'Furion 前端体验监控', description: '提供端到端前端用户体验度量，让产品用户体验可度量、可监控、可优化。', icon: '/card_icon2.svg' },
]

const getPlanStatusClass = (status: PlanStatus) => {
  if (status === 'expired') return 'is-expired'
  if (status === 'unfinished') return 'is-unfinished'
  return 'is-completed'
}
</script>

<template>
  <div class="personal-center-page">
    <header class="page-heading">
      <h1>个人中心</h1>
    </header>

    <section class="profile-banner">
      <div class="profile-banner__content">
        <img class="profile-banner__avatar" src="/avatar.png" alt="" />
        <h2>王多鱼</h2>

        <div class="profile-banner__meta">
          <span>
            <img src="/personalCenter1.svg" alt="" />
            <span>研发部</span>
          </span>
          <span>
            <img src="/personalCenter2.svg" alt="" />
            <span>高级前端工程师</span>
          </span>
          <span>
            <img src="/personalCenter3.svg" alt="" />
            <span>深圳</span>
          </span>
        </div>
      </div>
    </section>

    <section class="content-card">
      <div class="content-card__tabs">
        <button
          v-for="item in centerTabs"
          :key="item.value"
          type="button"
          class="center-tab"
          :class="{ 'is-active': activeTab === item.value }"
          @click="activeTab = item.value"
        >
          {{ item.text }}
        </button>
      </div>

      <template v-if="activeTab === 'plans'">
        <div class="summary-grid">
          <article v-for="card in summaryCards" :key="card.key" class="summary-card">
            <div class="summary-card__icon" :class="`is-${card.iconType}`">
              <span v-if="card.iconType === 'completed'" class="folder-mark">
                <span class="folder-mark__body" />
                <span class="folder-mark__check">✓</span>
              </span>
              <span v-else-if="card.iconType === 'unfinished'" class="folder-mark">
                <span class="folder-mark__body is-cyan" />
                <span class="folder-mark__check">◔</span>
              </span>
              <span v-else-if="card.iconType === 'expired'" class="alert-mark">!</span>
              <span v-else class="info-mark">i</span>
            </div>

            <div class="summary-card__content">
              <div class="summary-card__count">
                <div>{{ card.count }}</div>
                <span>个</span>
              </div>
              <p>{{ card.label }}</p>
            </div>
          </article>
        </div>

        <tiny-grid class="plan-grid" :data="planItems" :show-overflow="true" :show-header-overflow="true">
          <tiny-grid-column field="index" title="序号" width="70" />
          <tiny-grid-column field="name" title="计划名称" min-width="220" />
          <tiny-grid-column field="startDate" title="开始时间" min-width="160" sortable />
          <tiny-grid-column field="endDate" title="完成时间" min-width="160" sortable />
          <tiny-grid-column field="statusLabel" title="状态" min-width="150">
            <template #default="{ row }">
              <span class="plan-status" :class="getPlanStatusClass(row.status)">
                <span class="plan-status__icon" />
                <span>{{ row.statusLabel }}</span>
              </span>
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="type" title="类型" min-width="140" />
        </tiny-grid>
      </template>

      <div v-else class="project-grid">
        <article v-for="project in projectItems" :key="project.title" class="project-card">
          <img class="project-card__icon" :src="project.icon" alt="" />
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.personal-center-page {
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

.profile-banner {
  min-height: 202px;
  border-radius: 10px;
  background: url('/personalCenterbg.svg') center / cover no-repeat;
  overflow: hidden;
}

.profile-banner__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 202px;
  padding: 18px 24px;
  text-align: center;
}

.profile-banner__avatar {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.75);
  padding: 4px;
}

.profile-banner__content h2 {
  margin: 10px 0 0;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.profile-banner__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 34px;
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.96);
}

.profile-banner__meta span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.profile-banner__meta img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.content-card {
  margin-top: 20px;
  padding: 0 24px 24px;
  background: #fff;
  border: 1px solid #eef0f2;
  border-radius: 10px;
}

.content-card__tabs {
  display: flex;
  align-items: stretch;
  gap: 34px;
  min-height: 58px;
  padding: 0 0 0 2px;
  border-bottom: 1px solid #eef0f2;
}

.center-tab {
  position: relative;
  height: 58px;
  padding: 0;
  border: none;
  background: transparent;
  color: #2f3440;
  font-size: 14px;
  font-weight: 500;
  line-height: 58px;
  cursor: pointer;
}

.center-tab.is-active {
  color: #1f2329;
  font-weight: 600;
}

.center-tab.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  width: 54px;
  bottom: -1px;
  height: 2px;
  background: #191919;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 78px;
  padding: 14px 20px;
  border: 1px solid #eef0f2;
  border-radius: 10px;
  background: #fff;
}

.summary-card__icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.folder-mark {
  position: relative;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.folder-mark__body {
  width: 30px;
  height: 24px;
  display: block;
  border-radius: 6px;
  background: linear-gradient(180deg, #8ade90 0%, #67c23a 100%);
}

.folder-mark__body::before {
  content: '';
  position: absolute;
  left: 3px;
  top: 4px;
  width: 12px;
  height: 6px;
  border-radius: 4px 4px 0 0;
  background: #9be6a0;
}

.folder-mark__body.is-cyan {
  background: linear-gradient(180deg, #83e7f0 0%, #48c7d6 100%);
}

.folder-mark__body.is-cyan::before {
  background: #a2eef4;
}

.folder-mark__check {
  position: absolute;
  right: -2px;
  bottom: -1px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.78);
  color: #67c23a;
  font-size: 11px;
  line-height: 1;
}

.summary-card__icon.is-expired {
  color: #f23030;
}

.summary-card__icon.is-upcoming {
  color: #2f7df6;
}

.alert-mark {
  width: 0;
  height: 0;
  position: relative;
  border-left: 17px solid transparent;
  border-right: 17px solid transparent;
  border-bottom: 30px solid currentColor;
}

.alert-mark::after {
  content: '!';
  position: absolute;
  left: -3px;
  top: 10px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.info-mark {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(180deg, #67a7ff 0%, #2f7df6 100%);
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  font-family: Georgia, serif;
}

.summary-card__count {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.summary-card__count div {
  font-size: 18px;
  line-height: 1;
  color: #1f2329;
}

.summary-card__count span,
.summary-card__content p {
  font-size: 13px;
  color: #4b5563;
}

.summary-card__content p {
  margin: 8px 0 0;
}

.plan-grid :deep(.tiny-grid) {
  border: none;
}

.plan-grid :deep(.tiny-grid__header-wrapper),
.plan-grid :deep(.tiny-grid__body-wrapper) {
  border-bottom: none;
}

.plan-grid :deep(.tiny-grid-header__row) {
  height: 40px;
  background: #f6f6f6;
}

.plan-grid :deep(.tiny-grid-header__column) {
  border-right: none;
  color: #4b5563;
  font-size: 13px;
  font-weight: 600;
}

.plan-grid :deep(.tiny-grid-body__column) {
  border-right: none;
  color: #2b2f36;
  font-size: 13px;
}

.plan-grid :deep(.tiny-grid-body__row .tiny-grid-body__column) {
  border-bottom: 1px solid #f0f1f3;
}

.plan-grid :deep(.tiny-grid-cell) {
  padding-top: 12px;
  padding-bottom: 12px;
}

.plan-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.plan-status__icon {
  width: 10px;
  height: 10px;
  position: relative;
  display: inline-block;
  flex: 0 0 auto;
}

.plan-status.is-completed {
  color: #67c23a;
}

.plan-status.is-completed .plan-status__icon,
.plan-status.is-expired .plan-status__icon {
  border: 2px solid currentColor;
  border-radius: 50%;
  box-sizing: border-box;
}

.plan-status.is-expired {
  color: #f23030;
}

.plan-status.is-unfinished {
  color: #f59a23;
}

.plan-status.is-unfinished .plan-status__icon::before {
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

.project-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px 18px;
  padding: 24px 0 8px;
}

.project-card {
  min-height: 168px;
  padding: 22px 20px 18px;
  border: 1px solid #eef0f2;
  border-radius: 10px;
  background: #fff;
}

.project-card__icon {
  width: 40px;
  height: 40px;
}

.project-card h3 {
  margin: 16px 0 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #1f2329;
}

.project-card p {
  margin: 10px 0 0;
  font-size: 13px;
  line-height: 1.65;
  color: #5f6673;
}

@media (max-width: 1500px) {
  .project-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .personal-center-page {
    padding: 16px;
  }

  .content-card {
    padding-left: 16px;
    padding-right: 16px;
  }

  .profile-banner__meta {
    flex-direction: column;
    gap: 10px;
  }

  .summary-grid,
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>
