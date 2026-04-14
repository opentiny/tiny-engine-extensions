<script setup lang="ts">
import { computed } from 'vue'
import { Tag as TinyTag } from '@opentiny/vue'
import { TinyHuichartsLine } from '@opentiny/vue-huicharts'

const props = withDefaults(
  defineProps<{
    title: string
    value: string | number
    unit?: string
    footLabel: string
    footValue: string
    tagType?: 'info' | 'success' | 'danger' | 'warning'
    chartOptions: Record<string, any>
  }>(),
  {
    unit: '',
    tagType: 'info',
  },
)

const trendPrefix = computed(() => {
  if (props.tagType === 'success') return '↑'
  if (props.tagType === 'danger') return '↓'

  return ''
})

const trendText = computed(() =>
  trendPrefix.value ? `${trendPrefix.value} ${props.footValue}` : props.footValue,
)
</script>

<template>
  <div class="storage-card">
    <div class="storage-card__content">
      <p class="storage-card__title">{{ title }}</p>

      <div class="storage-card__value-row">
        <span class="storage-card__value">{{ value }}</span>
        <span v-if="unit" class="storage-card__unit">{{ unit }}</span>
      </div>

      <div class="storage-card__footer">
        <span class="storage-card__foot-label">{{ footLabel }}</span>
        <tiny-tag
          effect="light"
          size="small"
          :type="tagType"
          class="storage-card__tag"
          :class="`is-${tagType}`"
        >
          {{ trendText }}
        </tiny-tag>
      </div>
    </div>

    <div class="storage-card__chart">
      <tiny-huicharts-line
        :options="chartOptions"
        width="170px"
        height="58px"
      />
    </div>
  </div>
</template>

<style scoped>
.storage-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-height: 126px;
  padding: 22px 20px 18px;
  border: 1px solid #ebeef2;
  border-radius: 8px;
  background: #fafafa;
}

.storage-card__content {
  min-width: 0;
  flex: 1;
}

.storage-card__title {
  margin: 0;
  color: #222;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
}

.storage-card__value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 26px;
}

.storage-card__value {
  color: #222;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

.storage-card__unit {
  color: #333;
  font-size: 14px;
  line-height: 1;
}

.storage-card__footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  min-height: 22px;
  flex-wrap: wrap;
}

.storage-card__foot-label {
  color: #8a94a6;
  font-size: 12px;
  line-height: 1;
}

.storage-card__chart {
  width: 170px;
  margin-top: 22px;
  flex: none;
}

.storage-card__tag {
  border: none;
  font-size: 12px;
}

.storage-card__tag.is-info {
  color: #2f7df6;
}

.storage-card__tag.is-success {
  color: #63a103;
}

.storage-card__tag.is-danger {
  color: #eb5b61;
}

@media (max-width: 640px) {
  .storage-card {
    flex-direction: column;
    padding: 18px 16px 16px;
  }

  .storage-card__value-row {
    margin-top: 18px;
  }

  .storage-card__chart {
    width: 100%;
    margin-top: 8px;
  }
}
</style>
