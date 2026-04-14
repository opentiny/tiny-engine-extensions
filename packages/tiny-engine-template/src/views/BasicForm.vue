<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  Button as TinyButton,
  DatePicker as TinyDatePicker,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Radio as TinyRadio,
  RadioGroup as TinyRadioGroup,
  Select as TinySelect,
  Modal
} from '@opentiny/vue'

type MentorOption = {
  label: string
  value: string
}

type PositionOption = {
  label: string
  value: string
}

const formRef = ref<any>(null)

const positionOptions: PositionOption[] = [
  { label: '请选择', value: '' },
  { label: '前端工程师', value: 'frontend' },
  { label: '测试工程师', value: 'tester' },
  { label: '交互设计师', value: 'designer' },
]

const mentorOptions: MentorOption[] = [
  { label: '请选择', value: '' },
  { label: '张老师', value: 'zhang' },
  { label: '王老师', value: 'wang' },
  { label: '刘老师', value: 'liu' },
]

const formData = reactive({
  department: '',
  position: '',
  hr: '',
  mentor: '',
  startDate: '',
  endDate: '',
  enableDepartment: 'yes',
  targetEffect: 'mentor',
  remark: '',
})

const initialData = JSON.parse(JSON.stringify(formData))

const rules = {
  department: [{ required: true, message: '请输入培养部门', trigger: 'blur' }],
  position: [{ required: true, message: '请选择培养职位', trigger: 'change' }],
  hr: [{ required: true, message: '请输入HR', trigger: 'blur' }],
  mentor: [{ required: true, message: '请选择导师', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择实际辅导开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择培养实际辅导结束日期', trigger: 'change' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}

const handleCancel = () => {
  Object.assign(formData, JSON.parse(JSON.stringify(initialData)))
  formRef.value?.resetFields?.()
}

const handleSubmit = () => {
  formRef.value?.validate?.((valid: boolean) => {
    if (!valid) {
      Modal.message({
        message: '请先补全必填信息',
        status: 'warning',
      })
      return
    }

    Modal.message({
      message: '表单提交成功',
      status: 'success',
    })
  })
}
</script>

<template>
  <div class="basic-form-page">
    <tiny-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-position="top"
      class="basic-form"
    >
      <section class="form-panel">
        <div class="form-panel__header">
          <h2>基本信息</h2>
        </div>

        <div class="form-grid">
          <tiny-form-item label="培养部门" prop="department" required class="form-grid__item">
            <tiny-input v-model="formData.department" placeholder="请输入" />
          </tiny-form-item>

          <tiny-form-item label="培养职位" prop="position" required class="form-grid__item">
            <tiny-select
              v-model="formData.position"
              :options="positionOptions"
              text-field="label"
              value-field="value"
              placeholder="请选择"
            />
          </tiny-form-item>

          <tiny-form-item label="HR" prop="hr" required class="form-grid__item">
            <tiny-input v-model="formData.hr" placeholder="请输入" />
          </tiny-form-item>

          <tiny-form-item label="导师" prop="mentor" required class="form-grid__item">
            <tiny-select
              v-model="formData.mentor"
              :options="mentorOptions"
              text-field="label"
              value-field="value"
              placeholder="请选择"
            />
          </tiny-form-item>

          <tiny-form-item label="实际辅导开始日期" prop="startDate" required class="form-grid__item">
            <tiny-date-picker
              v-model="formData.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            />
          </tiny-form-item>

          <tiny-form-item label="培养实际辅导结束日期" prop="endDate" required class="form-grid__item">
            <tiny-date-picker
              v-model="formData.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            />
          </tiny-form-item>
        </div>
      </section>

      <section class="form-panel form-panel--detail">
        <div class="form-panel__header">
          <h2>详细信息</h2>
        </div>

        <div class="detail-group">
          <tiny-form-item label="培养部门" class="detail-group__item">
            <tiny-radio-group v-model="formData.enableDepartment">
              <tiny-radio label="yes">是</tiny-radio>
              <tiny-radio label="no">否</tiny-radio>
            </tiny-radio-group>
          </tiny-form-item>

          <tiny-form-item label="目标生效条件" class="detail-group__item">
            <tiny-radio-group v-model="formData.targetEffect">
              <tiny-radio label="direct">无需审批直接生效</tiny-radio>
              <tiny-radio label="mentor">导师审批</tiny-radio>
              <tiny-radio label="leader">直接主管审批</tiny-radio>
              <tiny-radio label="mentorLeader">导师直接主管审批</tiny-radio>
            </tiny-radio-group>
          </tiny-form-item>

          <tiny-form-item label="备注" prop="remark" class="detail-group__item detail-group__item--remark">
            <tiny-input
              v-model="formData.remark"
              type="textarea"
              :rows="5"
              maxlength="1000"
              show-word-limit
              resize="none"
              placeholder="请输入"
            />
          </tiny-form-item>
        </div>
      </section>
    </tiny-form>

    <div class="form-footer-bar">
      <div class="form-footer">
        <tiny-button round @click="handleCancel">取消</tiny-button>
        <tiny-button type="primary" round @click="handleSubmit">确认</tiny-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.basic-form-page {
  padding: 24px;
  padding-bottom: 84px;
}

.basic-form {
  display: grid;
  gap: 20px;
}

.form-panel {
  padding: 20px 24px 18px;
  border: 1px solid #ebeef2;
  border-radius: 8px;
  background: #fff;
}

.form-panel--detail {
  min-height: 430px;
}

.form-panel__header {
  margin-bottom: 18px;
}

.form-panel__header h2 {
  margin: 0;
  color: #222;
  font-size: 18px;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(320px, 400px);
  gap: 10px;
}

.detail-group {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  max-width: 820px;
}

.detail-group__item--remark {
  max-width: 520px;
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}

.form-footer-bar {
  position: fixed;
  left: 180px;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 60px;
  padding: 14px 0;
  background: #fff;
  border-top: 1px solid #ebeef2;
}

:deep(.basic-form .tiny-form-item) {
  margin-bottom: 8px;
}

:deep(.basic-form .tiny-form-item__label) {
  padding-bottom: 8px;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

:deep(.basic-form .tiny-form-item.is-required .tiny-form-item__label::before) {
  color: #f56c6c;
}

:deep(.basic-form .tiny-input__inner),
:deep(.basic-form .tiny-base-select .tiny-input__inner),
:deep(.basic-form .tiny-date-editor .tiny-input__inner) {
  height: 32px;
  border-radius: 6px;
  font-size: 13px;
}

:deep(.basic-form .tiny-textarea__inner) {
  min-height: 100px;
  border-radius: 6px;
  font-size: 13px;
}

:deep(.detail-group .tiny-radio-group) {
  display: flex;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
}

:deep(.form-footer .tiny-button) {
  min-width: 96px;
  height: 32px;
}

@media (max-width: 900px) {
  .basic-form-page {
    padding: 16px;
    padding-bottom: 96px;
  }

  .form-panel {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .detail-group__item--remark {
    max-width: none;
  }

  .form-footer-bar {
    left: 0;
  }

  .form-footer {
    padding: 0 16px;
  }
}
</style>
