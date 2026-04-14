<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  Button as TinyButton,
  DialogBox as TinyDialogBox,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Select as TinySelect,
  Switch as TinySwitch,
} from "@opentiny/vue";
import { iconClose, iconEyeclose, iconLocation } from "@opentiny/vue-icon";

type SettingSection = "basic" | "security" | "message";

type SecurityItem = {
  title: string;
  detail: string;
  action: string;
};

type MessageItem = {
  key: string;
  title: string;
  detail: string;
  enabled: boolean;
};

const TinyIconClose = iconClose();
const TinyIconEyeclose = iconEyeclose();
const TinyIconLocation = iconLocation();

const activeSection = ref<SettingSection>("basic");
const passwordDialogVisible = ref(false);

const basicSections: Array<{ label: string; value: SettingSection }> = [
  { label: "基本设置", value: "basic" },
  { label: "安全设置", value: "security" },
  { label: "新消息通知", value: "message" },
];

const basicForm = reactive({
  email: "",
  nickname: "",
  profile: "",
  region: "",
  street: "",
  phone: "",
});

const regionOptions = [
  { label: "深圳市 / 南山区", value: "shenzhen-nanshan" },
  { label: "深圳市 / 福田区", value: "shenzhen-futian" },
  { label: "广州市 / 天河区", value: "guangzhou-tianhe" },
];

const securityItems: SecurityItem[] = [
  { title: "账户密码", detail: "当前密码强度： 强", action: "修改" },
  { title: "绑定手机", detail: "已绑定手机： 138****8293", action: "修改" },
  {
    title: "备用邮箱",
    detail: "已绑定邮件： opentiny****@huawei.com",
    action: "修改",
  },
];

const messageItems = ref<MessageItem[]>([
  {
    key: "user",
    title: "用户消息",
    detail: "其他用户的消息将以welink的形式通知",
    enabled: true,
  },
  {
    key: "system",
    title: "系统消息",
    detail: "系统消息将以站内welink形式通知",
    enabled: true,
  },
  {
    key: "task",
    title: "代办任务",
    detail: "代办任务将以站内welink形式通知",
    enabled: true,
  },
]);

const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const handleSecurityAction = (title: string) => {
  if (title === "账户密码") {
    passwordDialogVisible.value = true;
  }
};

const closePasswordDialog = () => {
  passwordDialogVisible.value = false;
};
</script>

<template>
  <div class="profile-settings-page">
    <section class="settings-panel">
      <aside class="settings-sidebar">
        <button
          v-for="item in basicSections"
          :key="item.value"
          type="button"
          class="settings-sidebar__item"
          :class="{ 'is-active': activeSection === item.value }"
          @click="activeSection = item.value"
        >
          {{ item.label }}
        </button>
      </aside>

      <div class="settings-content">
        <section v-if="activeSection === 'basic'" class="settings-section">
          <h1>基本信息</h1>

          <div class="basic-profile">
            <img class="basic-profile__avatar" src="/avatar1.svg" alt="" />
            <tiny-button round class="basic-profile__button"
              >更换头像</tiny-button
            >
          </div>

          <tiny-form label-position="top" class="basic-form">
            <tiny-form-item label="邮箱">
              <tiny-input v-model="basicForm.email" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="昵称">
              <tiny-input v-model="basicForm.nickname" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="个人简介">
              <tiny-input v-model="basicForm.profile" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="国家/地区/省市">
              <div class="select-field">
                <tiny-select
                  v-model="basicForm.region"
                  :options="regionOptions"
                  text-field="label"
                  value-field="value"
                  placeholder="请选择区域"
                />
              </div>
            </tiny-form-item>

            <tiny-form-item label="街道地址">
              <tiny-input v-model="basicForm.street" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="联系电话">
              <tiny-input v-model="basicForm.phone" placeholder="请输入" />
            </tiny-form-item>

            <tiny-button class="submit-button" type="primary" round
              >更新基本信息</tiny-button
            >
          </tiny-form>
        </section>

        <section
          v-else-if="activeSection === 'security'"
          class="settings-section"
        >
          <h1>安全设置</h1>

          <div class="security-list">
            <article
              v-for="item in securityItems"
              :key="item.title"
              class="security-item"
            >
              <div>
                <h2>{{ item.title }}</h2>
                <p>{{ item.detail }}</p>
              </div>

              <tiny-button
                type="text"
                class="security-item__action"
                @click="handleSecurityAction(item.title)"
              >
                {{ item.action }}
              </tiny-button>
            </article>
          </div>
        </section>

        <section v-else class="settings-section">
          <h1>新消息通知</h1>

          <div class="message-list">
            <article
              v-for="item in messageItems"
              :key="item.key"
              class="message-item"
            >
              <div>
                <h2>{{ item.title }}</h2>
                <p>{{ item.detail }}</p>
              </div>

              <tiny-switch v-model="item.enabled" />
            </article>
          </div>
        </section>
      </div>
    </section>

    <tiny-dialog-box
      v-model:visible="passwordDialogVisible"
      title=""
      width="412px"
      class="password-dialog"
    >
      <template #title>
        <div class="password-dialog__header">
          <div>修改密码</div>
        </div>
      </template>

      <div class="password-dialog__body">
        <div class="dialog-email-row">
          <span>邮箱</span>
          <span>opentiny@huawei.com</span>
        </div>

        <tiny-form
          label-position="left"
          label-width="100px"
          class="password-form"
        >
          <tiny-form-item>
            <template #label>
              <span class="required-label">旧密码</span>
            </template>
            <tiny-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入"
              :suffix-icon="TinyIconEyeclose"
            />
          </tiny-form-item>

          <tiny-form-item>
            <template #label>
              <span class="required-label">新密码</span>
            </template>
            <tiny-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入"
              :suffix-icon="TinyIconEyeclose"
            />
          </tiny-form-item>

          <tiny-form-item>
            <template #label>
              <span class="required-label">确认新密码</span>
            </template>
            <tiny-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请输入"
              :suffix-icon="TinyIconEyeclose"
            />
          </tiny-form-item>
        </tiny-form>
      </div>
      <template #footer>
        <div class="password-dialog__footer">
          <tiny-button
            round
            class="dialog-button dialog-button--ghost"
            @click="closePasswordDialog"
            >取消</tiny-button
          >
          <tiny-button type="primary" round class="dialog-button"
            >确定</tiny-button
          >
        </div>
      </template>
    </tiny-dialog-box>
  </div>
</template>

<style scoped>
.profile-settings-page {
  padding: 24px;
}

.settings-panel {
  min-height: calc(100vh - 88px);
  display: grid;
  grid-template-columns: 248px minmax(0, 1fr);
  background: #fff;
  border: 1px solid #eef0f2;
  border-radius: 10px;
  overflow: hidden;
}

.settings-sidebar {
  padding: 24px 24px 0 28px;
  border-right: 1px solid #f0f1f3;
}

.settings-sidebar__item {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #1f2329;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

.settings-sidebar__item + .settings-sidebar__item {
  margin-top: 18px;
}

.settings-sidebar__item.is-active {
  background: #f5f6f8;
}

.settings-content {
  padding: 24px 44px 32px;
}

.settings-section h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2329;
}

.basic-profile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 26px;
}

.basic-profile__avatar {
  width: 102px;
  height: 102px;
  border-radius: 50%;
}

.basic-profile__button.basic-profile__button {
  min-width: 106px;
  height: 32px;
  margin-top: 16px;
  border-color: #bfc4cc;
  background: #fff;
  color: #1f2329;
}

.basic-form {
  width: 402px;
  max-width: 100%;
  margin-top: 26px;
}

.submit-button.submit-button {
  min-width: 120px;
  height: 28px;
  margin-top: 10px;
  background: #1f1f1f;
  border-color: #1f1f1f;
}

.select-field {
  position: relative;
}

.security-list,
.message-list {
  margin-top: 24px;
}

.security-item,
.message-item {
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 0 2px;
  border-bottom: 1px solid #f0f1f3;
}

.security-item h2,
.message-item h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #1f2329;
}

.security-item p,
.message-item p {
  margin: 12px 0 0;
  font-size: 14px;
  color: #8a8f99;
}

.security-item__action.security-item__action {
  color: #2f7df6;
}

.password-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.password-dialog__header div {
  font-size: 18px;
  color: #1f2329;
}

.password-dialog__close.password-dialog__close {
  min-width: 20px;
  padding: 0;
  color: #8a8f99;
}

.password-dialog__close :deep(svg) {
  width: 18px;
  height: 18px;
}

.password-dialog__body {
  padding-top: 6px;
}

.dialog-email-row {
  display: grid;
  grid-template-columns: 88px 1fr;
  align-items: center;
  margin-bottom: 18px;
  font-size: 14px;
  color: #1f2329;
}

.dialog-button.dialog-button {
  min-width: 82px;
  height: 28px;
}

.dialog-button--ghost.dialog-button--ghost {
  background: #fff;
  border-color: #9ba0a8;
  color: #1f2329;
}

.required-label {
  color: #1f2329;
}

.required-label::first-letter {
  color: #f23030;
}

:deep(.basic-form .tiny-form-item) {
  margin-bottom: 14px;
}

:deep(.basic-form .tiny-form-item__label) {
  padding-bottom: 8px;
  font-size: 14px;
  color: #1f2329;
}

:deep(.basic-form .tiny-input__inner),
:deep(.basic-form .tiny-base-select .tiny-input__inner),
:deep(.password-form .tiny-input__inner) {
  height: 30px;
  border-radius: 6px;
}

:deep(.basic-form .tiny-base-select .tiny-input__inner) {
  padding-left: 34px;
}

:deep(.message-item .tiny-switch) {
  --tv-Switch-bg-color-checked: #2f7df6;
}

@media (max-width: 980px) {
  .profile-settings-page {
    padding: 16px;
  }

  .settings-panel {
    grid-template-columns: 1fr;
  }

  .settings-sidebar {
    border-right: none;
    border-bottom: 1px solid #f0f1f3;
    padding-bottom: 24px;
  }

  .settings-content {
    padding: 20px 16px 24px;
  }

  .security-item,
  .message-item {
    align-items: flex-start;
    flex-direction: column;
    padding-top: 18px;
    padding-bottom: 18px;
  }
}
</style>
