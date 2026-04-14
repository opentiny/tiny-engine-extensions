<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  Button as TinyButton,
  DatePicker as TinyDatePicker,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Input as TinyInput,
  Radio as TinyRadio,
  RadioGroup as TinyRadioGroup,
  Select as TinySelect,
  Steps as TinySteps,
  Modal
} from '@opentiny/vue'

const currentStep = ref(1)
const stepOneRef = ref<any>(null)
const stepTwoRef = ref<any>(null)
const stepThreeRef = ref<any>(null)

const positionOptions = [
  { label: '请选择', value: '' },
  { label: '前端工程师', value: 'frontend' },
  { label: '测试工程师', value: 'tester' },
  { label: '交互设计师', value: 'designer' },
]

const mentorOptions = [
  { label: '请选择', value: '' },
  { label: '张老师', value: 'zhang' },
  { label: '王老师', value: 'wang' },
  { label: '刘老师', value: 'liu' },
]

const supervisorNoteOptions = [
  { label: '请选择', value: '' },
  { label: '导师已确认', value: 'confirmed' },
  { label: '需补充资料', value: 'supplement' },
  { label: '待线下面谈', value: 'interview' },
]

const stepOneData = reactive({
  department: '',
  position: '',
  hr: '',
  mentor: '',
  startDate: '',
  endDate: '',
})

const stepTwoData = reactive({
  supervisor: '',
  note: '',
  guideStartDate: '',
  guideEndDate: '',
})

const stepThreeData = reactive({
  enableDepartment: 'no',
  targetEffect: 'mentor',
  remark: '',
})

const initialStepOne = JSON.parse(JSON.stringify(stepOneData))
const initialStepTwo = JSON.parse(JSON.stringify(stepTwoData))
const initialStepThree = JSON.parse(JSON.stringify(stepThreeData))

const stepOneRules = {
  department: [{ required: true, message: '请输入培养部门', trigger: 'blur' }],
  position: [{ required: true, message: '请选择培养职位', trigger: 'change' }],
  hr: [{ required: true, message: '请输入HR', trigger: 'blur' }],
  mentor: [{ required: true, message: '请选择导师', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择实际辅导开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择培养实际辅导结束日期', trigger: 'change' }],
}

const stepTwoRules = {
  supervisor: [{ required: true, message: '请输入导师主管', trigger: 'blur' }],
  note: [{ required: true, message: '请选择导师信息备注', trigger: 'change' }],
  guideStartDate: [{ required: true, message: '请选择开始辅导日期', trigger: 'change' }],
  guideEndDate: [{ required: true, message: '请选择结束辅导日期', trigger: 'change' }],
}

const stepThreeRules = {
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
}

const stepsData = computed(() => [
  {
    name: '启动辅导',
    status: currentStep.value > 1 ? 'done' : '',
  },
  {
    name: '录入主管',
    status: currentStep.value > 2 ? 'done' : '',
  },
  {
    name: '定制整体目标',
    status: currentStep.value === 4 ? 'done' : '',
  },
  {
    name: '结束',
    status: currentStep.value === 4 ? 'done' : '',
  },
])

const resetCurrentStep = () => {
  if (currentStep.value === 1) {
    Object.assign(stepOneData, JSON.parse(JSON.stringify(initialStepOne)))
    stepOneRef.value?.resetFields?.()
  }

  if (currentStep.value === 2) {
    Object.assign(stepTwoData, JSON.parse(JSON.stringify(initialStepTwo)))
    stepTwoRef.value?.resetFields?.()
  }

  if (currentStep.value === 3) {
    Object.assign(stepThreeData, JSON.parse(JSON.stringify(initialStepThree)))
    stepThreeRef.value?.resetFields?.()
  }
}

const handleCancel = () => {
  if (currentStep.value === 4) {
    currentStep.value = 1
    Object.assign(stepOneData, JSON.parse(JSON.stringify(initialStepOne)))
    Object.assign(stepTwoData, JSON.parse(JSON.stringify(initialStepTwo)))
    Object.assign(stepThreeData, JSON.parse(JSON.stringify(initialStepThree)))
    stepOneRef.value?.resetFields?.()
    stepTwoRef.value?.resetFields?.()
    stepThreeRef.value?.resetFields?.()
    return
  }

  resetCurrentStep()
}

const goPrev = () => {
  if (currentStep.value > 1) {
    currentStep.value -= 1
  }
}

const handleNext = () => {
  if (currentStep.value === 1) {
    stepOneRef.value?.validate?.((valid: boolean) => {
      if (!valid) return
      currentStep.value = 2
    })
  }

  if (currentStep.value === 2) {
    stepTwoRef.value?.validate?.((valid: boolean) => {
      if (!valid) return
      currentStep.value = 3
    })
  }
}

const handleSubmit = () => {
  stepThreeRef.value?.validate?.((valid: boolean) => {
    if (!valid) return

    currentStep.value = 4
    Modal.message({
      message: '分步表单提交成功',
      status: 'success',
    })
  })
}
</script>

<template>
  <div class="step-form-page">
    <section class="step-panel step-panel--header">
      <div class="step-panel__title">
        <h1>分步表单</h1>
      </div>

      <tiny-steps
        class="step-panel__steps"
        :data="stepsData"
        :active="currentStep - 1"
        line
        no-arrow
      />
    </section>

    <section class="step-panel step-panel--content">
      <template v-if="currentStep === 1">
        <div class="step-section">
          <h2>启动辅导</h2>

          <tiny-form
            ref="stepOneRef"
            :model="stepOneData"
            :rules="stepOneRules"
            label-position="top"
            class="step-form"
          >
            <tiny-form-item label="培养部门" prop="department" required>
              <tiny-input v-model="stepOneData.department" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="培养职位" prop="position" required>
              <tiny-select
                v-model="stepOneData.position"
                :options="positionOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择"
              />
            </tiny-form-item>

            <tiny-form-item label="HR" prop="hr" required>
              <tiny-input v-model="stepOneData.hr" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="导师" prop="mentor" required>
              <tiny-select
                v-model="stepOneData.mentor"
                :options="mentorOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择"
              />
            </tiny-form-item>

            <tiny-form-item label="实际辅导开始日期" prop="startDate" required>
              <tiny-date-picker
                v-model="stepOneData.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              />
            </tiny-form-item>

            <tiny-form-item label="培养实际辅导结束日期" prop="endDate" required>
              <tiny-date-picker
                v-model="stepOneData.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              />
            </tiny-form-item>
          </tiny-form>
        </div>

        <div class="step-actions">
          <tiny-button round @click="handleCancel">取消</tiny-button>
          <tiny-button type="primary" round @click="handleNext">下一步</tiny-button>
        </div>
      </template>

      <template v-else-if="currentStep === 2">
        <div class="step-section">
          <h2>录入主管</h2>

          <tiny-form
            ref="stepTwoRef"
            :model="stepTwoData"
            :rules="stepTwoRules"
            label-position="top"
            class="step-form"
          >
            <tiny-form-item label="导师主管" prop="supervisor" required>
              <tiny-input v-model="stepTwoData.supervisor" placeholder="请输入" />
            </tiny-form-item>

            <tiny-form-item label="导师信息备注" prop="note" required>
              <tiny-select
                v-model="stepTwoData.note"
                :options="supervisorNoteOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择"
              />
            </tiny-form-item>

            <tiny-form-item label="开始辅导日期" prop="guideStartDate" required>
              <tiny-date-picker
                v-model="stepTwoData.guideStartDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              />
            </tiny-form-item>

            <tiny-form-item label="导师结束辅导日期" prop="guideEndDate" required>
              <tiny-date-picker
                v-model="stepTwoData.guideEndDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择日期"
              />
            </tiny-form-item>
          </tiny-form>
        </div>

        <div class="step-actions">
          <tiny-button round @click="handleCancel">取消</tiny-button>
          <tiny-button round @click="goPrev">上一步</tiny-button>
          <tiny-button type="primary" round @click="handleNext">下一步</tiny-button>
        </div>
      </template>

      <template v-else-if="currentStep === 3">
        <div class="step-section">
          <h2>定制整体目标</h2>

          <tiny-form
            ref="stepThreeRef"
            :model="stepThreeData"
            :rules="stepThreeRules"
            label-position="top"
            class="step-form step-form--wide"
          >
            <tiny-form-item label="培养部门">
              <tiny-radio-group v-model="stepThreeData.enableDepartment">
                <tiny-radio label="yes">是</tiny-radio>
                <tiny-radio label="no">否</tiny-radio>
              </tiny-radio-group>
            </tiny-form-item>

            <tiny-form-item label="目标生效条件">
              <tiny-radio-group v-model="stepThreeData.targetEffect">
                <tiny-radio label="direct">无需审批直接生效</tiny-radio>
                <tiny-radio label="mentor">导师审批</tiny-radio>
                <tiny-radio label="leader">直接主管审批</tiny-radio>
                <tiny-radio label="mentorLeader">导师直接主管审批</tiny-radio>
              </tiny-radio-group>
            </tiny-form-item>

            <tiny-form-item label="备注" prop="remark">
              <tiny-input
                v-model="stepThreeData.remark"
                type="textarea"
                :rows="5"
                maxlength="1000"
                show-word-limit
                resize="none"
                placeholder="请输入"
              />
            </tiny-form-item>
          </tiny-form>
        </div>

        <div class="step-actions">
          <tiny-button round @click="handleCancel">取消</tiny-button>
          <tiny-button round @click="goPrev">上一步</tiny-button>
          <tiny-button type="primary" round @click="handleSubmit">提交</tiny-button>
        </div>
      </template>

      <template v-else>
        <div class="step-finish">
          <h2>结束</h2>
          <p>分步表单已经提交完成，可以点击取消重新开始，也可以返回上一步继续修改。</p>
        </div>

        <div class="step-actions">
          <tiny-button round @click="handleCancel">取消</tiny-button>
          <tiny-button round @click="goPrev">上一步</tiny-button>
          <tiny-button type="primary" round @click="handleCancel">重新开始</tiny-button>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.step-form-page {
  padding: 24px;
}

.step-panel {
  border-radius: 8px;
  background: #fff;
}

.step-panel--header {
  padding: 20px 24px 24px;
}

.step-panel--content {
  margin-top: 20px;
  min-height: 720px;
  padding: 26px 24px 28px;
}

.step-panel__title h1 {
  margin: 0;
  color: #222;
  font-size: 18px;
  font-weight: 600;
}

.step-panel__steps {
  margin-top: 22px;
  max-width: 700px;
}

.step-section {
  max-width: 520px;
  padding-top: 2px;
}

.step-section h2,
.step-finish h2 {
  margin: 0 0 18px;
  color: #222;
  font-size: 18px;
  font-weight: 600;
}

.step-form {
  display: grid;
  gap: 6px;
}

.step-form--wide {
  max-width: 760px;
}

.step-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.step-finish {
  max-width: 560px;
}

.step-finish p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.9;
}

:deep(.step-form .tiny-form-item) {
  margin-bottom: 12px;
}

:deep(.step-form .tiny-form-item__label) {
  padding-bottom: 8px;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}

:deep(.step-form .tiny-form-item.is-required .tiny-form-item__label::before) {
  color: #f56c6c;
}

:deep(.step-form .tiny-input__inner),
:deep(.step-form .tiny-base-select .tiny-input__inner),
:deep(.step-form .tiny-date-editor .tiny-input__inner) {
  height: 32px;
  border-radius: 6px;
  font-size: 13px;
  background: #fff;
  border-color: #dcdfe6;
}

:deep(.step-form .tiny-textarea__inner) {
  min-height: 100px;
  border-radius: 6px;
  font-size: 13px;
}

:deep(.step-form--wide .tiny-radio-group) {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

:deep(.step-actions .tiny-button) {
  min-width: 86px;
  height: 30px;
  border-radius: 999px;
  font-size: 14px;
}

:deep(.step-actions .tiny-button--primary) {
  background: #191919;
  border-color: #191919;
}

:deep(.step-actions .tiny-button:not(.tiny-button--primary)) {
  color: #222;
  border-color: #202020;
  background: #fff;
}

:deep(.step-panel__steps .tiny-steps) {
  font-size: 14px;
}

:deep(.step-panel__steps .tiny-steps-standard) {
  width: 100%;
}

:deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right) {
  width: 100%;
}

:deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right .normal) {
  align-items: center;
  min-height: 34px;
}

:deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right .normal .line) {
  height: 1px;
  background: #e3e7ee;
  margin-left: 10px;
  margin-right: 10px;
}

:deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right .normal.line-end .line) {
  width: 0;
  margin-left: 0;
  margin-right: 0;
}

:deep(.step-panel__steps .tiny-timeline .icon) {
  width: 32px;
  height: 32px;
  border: 1px solid #d7dde8;
  background: #fff;
  color: #606266;
  box-shadow: none;
  font-weight: 500;
}

:deep(.step-panel__steps .tiny-timeline .icon .number) {
  font-size: 14px;
}

:deep(.step-panel__steps .tiny-timeline .process-current .icon) {
  border-color: #191919;
  background: #191919;
  color: #fff;
}

:deep(.step-panel__steps .tiny-timeline .process-current .icon .number),
:deep(.step-panel__steps .tiny-timeline .process-current .icon .tiny-svg) {
  color: #fff;
  fill: #fff;
}

:deep(.step-panel__steps .tiny-timeline .process-done .icon) {
  border-color: #191919;
  background: #fff;
  color: #191919;
}

:deep(.step-panel__steps .tiny-timeline .process-done .icon .tiny-svg) {
  fill: #191919;
}

:deep(.step-panel__steps .tiny-timeline .process-done .line) {
  background: #191919;
}

:deep(.step-panel__steps .tiny-timeline .process-done .icon .icon-yes) {
  font-size: 14px;
}

:deep(.step-panel__steps .tiny-timeline .process-disabled .icon) {
  border-color: #d7dde8;
  background: #fff;
  color: #606266;
}

:deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right .normal .node-description) {
  margin-left: 10px;
  line-height: 32px;
}

:deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right .normal .node-description .name) {
  max-width: none;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

:deep(.step-panel__steps .tiny-timeline .process-current .node-description .name) {
  font-weight: 600;
  color: #191919;
}

:deep(.step-panel__steps .tiny-timeline .process-disabled .node-description .name) {
  color: #606266;
}

:deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right .normal.no-flex) {
  flex: none;
}

@media (max-width: 900px) {
  .step-form-page {
    padding: 16px;
  }

  .step-panel--header,
  .step-panel--content {
    padding: 16px;
  }

  .step-panel--content {
    min-height: auto;
  }

  .step-actions {
    flex-wrap: wrap;
  }

  :deep(.step-panel__steps .tiny-timeline .tiny-steps-normal.text-right .normal .node-description .name) {
    white-space: normal;
  }
}
</style>
