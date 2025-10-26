<template>
  <button class="toolbar-button" :class="{ active: active }" :title="content">
    <svg v-if="icon" class="button-icon">
      <use :xlink:href="`#icon-${icon}`"></use>
    </svg>
    <span class="button-text">{{ content || "按钮" }}</span>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.toolbar-button {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #191919;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  height: 24px;
}

.button-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.button-text {
  white-space: nowrap;
}
</style>
