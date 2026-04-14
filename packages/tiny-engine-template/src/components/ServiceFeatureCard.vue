<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    description: string
    badge: string
    badgeType?: 'danger' | 'success' | 'info' | 'warning'
    accent: string
    category?: string
  }>(),
  {
    badgeType: 'info',
    category: '企业建站首备',
  },
)
</script>

<template>
  <div class="service-feature-card">
    <div class="service-feature-card__icon" >
      <img :src="accent"/>
    </div>

    <h3>{{ title }}</h3>
    <p>{{ description }}</p>

    <div class="service-feature-card__meta">
      <span class="service-feature-card__badge" :class="`is-${badgeType}`">{{ badge }}</span>
      <span class="service-feature-card__category">{{ category }}</span>
    </div>
  </div>
</template>

<style scoped>
.service-feature-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 188px;
  padding: 16px 10px 10px;
  background: #fff;
}

.service-feature-card__icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
}

.service-feature-card h3 {
  margin: 14px 0 0;
  color: #222;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.45;
}

.service-feature-card p {
  margin: 10px 0 0;
  color: #8a94a6;
  font-size: 12px;
  line-height: 1.85;
}

.service-feature-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 12px;
  flex-wrap: wrap;
}

.service-feature-card__badge,
.service-feature-card__category {
  display: inline-flex;
  align-items: center;
  height: 18px;
  padding: 0 4px;
  border-radius: 3px;
  font-size: 12px;
  line-height: 18px;
}

.service-feature-card__badge {
  font-weight: 500;
}

.service-feature-card__badge.is-danger {
  color: #f56c6c;
  background: #fff1f0;
}

.service-feature-card__badge.is-success {
  color: #67c23a;
  background: #f0f9eb;
}

.service-feature-card__badge.is-info {
  color: #2f7df6;
  background: #edf4ff;
}

.service-feature-card__badge.is-warning {
  color: #e6a23c;
  background: #fff7e8;
}

.service-feature-card__category {
  color: #606266;
  background: #f5f7fa;
}
</style>
