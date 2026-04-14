<script setup lang="ts">
import { ref } from 'vue'
import { Button as TinyButton } from '@opentiny/vue'
import { iconClose } from '@opentiny/vue-icon'

type RecommendCard = {
  icon: string
  title: string
  description: string
}

const TinyIconClose = iconClose()
const showSurvey = ref(true)
const selectedScore = ref<number | null>(null)

const scoreOptions = Array.from({ length: 11 }, (_, index) => index)

const recommendCards: RecommendCard[] = [
  {
    icon: '/interested1.svg',
    title: '主机安全 服务器安全管家',
    description: '2.1元/天起 放爆破, 修漏洞, 杀病毒',
  },
  {
    icon: '/interested2.svg',
    title: '云堡垒机 服务器权限管理',
    description: '主机管理、帐号管理、权限控制、运维审计',
  },
  {
    icon: '/interested3.svg',
    title: '网站建设专场，0代码建网站',
    description: '358元 起建网站，买2年送1年',
  },
  {
    icon: '/interested4.svg',
    title: '企业主机安全 HSS',
    description: '服务器贴身安全管家',
  },
]
</script>

<template>
  <div class="success-page">
    <section class="success-hero">
      <img class="success-hero__icon" src="/successResult.svg" alt="" />
      <h1>订单支付成功</h1>
      <p>您已成功购买CCE集群，并支付 ￥45.00 。</p>
      <tiny-button round class="success-hero__button">查看订单</tiny-button>
    </section>

    <section v-if="showSurvey" class="survey-card">
      <tiny-button type="text" class="survey-card__close" @click="showSurvey = false">
        <component :is="TinyIconClose" />
      </tiny-button>

      <p class="survey-card__title">请您对本次购买流程进行满意度评价。</p>

      <div class="survey-card__labels">
        <span>非常不满意</span>
        <span>非常满意</span>
      </div>

      <div class="survey-card__scores">
        <tiny-button
          v-for="score in scoreOptions"
          :key="score"
          class="survey-score"
          :class="{ 'is-active': selectedScore === score }"
          @click="selectedScore = score"
        >
          {{ score }}
        </tiny-button>
      </div>
    </section>

    <section class="recommend-section">
      <h2>您可能感兴趣</h2>

      <div class="recommend-grid">
        <article v-for="card in recommendCards" :key="card.title" class="recommend-card">
          <img class="recommend-card__icon" :src="card.icon" alt="" />
          <h3>{{ card.title }}</h3>
          <p>{{ card.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.success-page {
  padding: 22px 24px 40px;
}

.success-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 480px;
  text-align: center;
}

.success-hero__icon {
  width: 64px;
  height: 64px;
}

.success-hero h1 {
  margin: 28px 0 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  color: #1f2329;
}

.success-hero p {
  margin: 28px 0 0;
  font-size: 14px;
  color: #1f2329;
}

.success-hero__button.success-hero__button {
  min-width: 122px;
  height: 38px;
  margin-top: 28px;
  padding: 0 28px;
  border-color: #5c5f66;
  color: #1f2329;
  background: #fff;
}

.survey-card {
  position: relative;
  margin-top: 18px;
  padding: 24px 26px 24px;
  background: #fff;
  border: 1px solid #eef0f2;
  border-radius: 10px;
}

.survey-card__close.survey-card__close {
  position: absolute;
  top: 16px;
  right: 16px;
  min-width: 20px;
  padding: 0;
  color: #8a8f99;
}

.survey-card__close :deep(svg) {
  width: 18px;
  height: 18px;
}

.survey-card__title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
}

.survey-card__labels {
  display: flex;
  justify-content: space-between;
  width: 580px;
  max-width: 100%;
  margin-top: 20px;
  font-size: 12px;
  color: #8a8f99;
}

.survey-card__scores {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
}

.survey-score.survey-score {
  min-width: 30px;
  height: 30px;
  padding: 0 8px;
  border: none;
  border-radius: 6px;
  background: #f5f5f5;
  color: #3a3f45;
  font-size: 14px;
}

.survey-score.survey-score:hover,
.survey-score.survey-score:focus {
  border: none;
  background: #eceff3;
  color: #1f2329;
}

.survey-score.is-active.survey-score {
  background: #dfeeff;
  color: #2f7df6;
}

.recommend-section {
  margin-top: 20px;
}

.recommend-section h2 {
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.recommend-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 210px;
  padding: 50px 28px 28px;
  text-align: center;
  background: #fff;
  border: 1px solid #eef0f2;
  border-radius: 10px;
}

.recommend-card__icon {
  width: 72px;
  height: 72px;
}

.recommend-card h3 {
  margin: 24px 0 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: #1f2329;
}

.recommend-card p {
  margin: 12px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #5f6673;
}

@media (max-width: 1400px) {
  .recommend-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .success-page {
    padding: 16px;
  }

  .success-hero {
    min-height: 360px;
    padding: 32px 0;
  }

  .survey-card__labels {
    width: 100%;
  }

  .recommend-grid {
    grid-template-columns: 1fr;
  }
}
</style>
