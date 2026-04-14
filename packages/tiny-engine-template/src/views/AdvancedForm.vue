<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  Button as TinyButton,
  DatePicker as TinyDatePicker,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Grid as TinyGrid,
  GridColumn as TinyGridColumn,
  Input as TinyInput,
  Progress as TinyProgress,
  Select as TinySelect,
  Modal
} from "@opentiny/vue";

type TaskStatus = "freeze" | "fail" | "running";

type AdvancedTask = {
  id: number;
  name: string;
  code: string;
  departmentLevel: string;
  status: TaskStatus;
  statusLabel: string;
  startDate: string;
  progress: number;
  isEditor?: boolean;
};

const formRef = ref<any>(null);

const positionOptions = [
  { label: "请选择", value: "" },
  { label: "前端工程师", value: "frontend" },
  { label: "测试工程师", value: "tester" },
  { label: "交互设计师", value: "designer" },
];

const mentorOptions = [
  { label: "请选择", value: "" },
  { label: "张老师", value: "zhang" },
  { label: "王老师", value: "wang" },
  { label: "刘老师", value: "liu" },
];

const departmentLevelOptions = [
  { label: "请选择", value: "" },
  { label: "department01", value: "department01" },
  { label: "department02", value: "department02" },
  { label: "department03", value: "department03" },
];

const statusOptions = [
  { label: "请选择", value: "" },
  { label: "冻结", value: "冻结" },
  { label: "失败", value: "失败" },
  { label: "运行中", value: "运行中" },
];

const taskProgressOptions = [
  { label: "请选择", value: 0 },
  { label: "20%", value: 20 },
  { label: "45%", value: 45 },
  { label: "60%", value: 60 },
  { label: "80%", value: 80 },
];

const formData = reactive({
  projectName: "",
  position: "",
  hr: "",
  mentor: "",
  startDate: "",
  endDate: "",
  phone: "",
  address: "",
  remark: "",
});

const initialFormData = JSON.parse(JSON.stringify(formData));

const formRules = {
  projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  position: [{ required: true, message: "请选择培养职位", trigger: "change" }],
  hr: [{ required: true, message: "请输入HR", trigger: "blur" }],
  mentor: [{ required: true, message: "请选择导师", trigger: "change" }],
  startDate: [
    { required: true, message: "请选择实际辅导开始日期", trigger: "change" },
  ],
  endDate: [
    {
      required: true,
      message: "请选择培养实际辅导结束日期",
      trigger: "change",
    },
  ],
  phone: [{ required: true, message: "请输入电话号码", trigger: "blur" }],
  address: [{ required: true, message: "请输入地址", trigger: "blur" }],
  remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
};

const tasks = ref<AdvancedTask[]>([
  {
    id: 1,
    name: "李晓刚",
    code: "a00101227",
    departmentLevel: "department01",
    status: "freeze",
    statusLabel: "冻结",
    startDate: "2022-01-15",
    progress: 45,
  },
  {
    id: 2,
    name: "张维勇",
    code: "a00101228",
    departmentLevel: "department01",
    status: "fail",
    statusLabel: "失败",
    startDate: "2021-07-28",
    progress: 45,
  },
]);

const initialTasks = JSON.parse(JSON.stringify(tasks.value));

const taskDraft = reactive({
  name: "",
  code: "",
  departmentLevel: "",
  statusLabel: "",
  startDate: "",
  progress: 0,
});

const editingTaskId = ref<number | null>(null);

const taskTableRows = computed(() => [
  {
    id: 0,
    name: taskDraft.name,
    code: taskDraft.code,
    departmentLevel: taskDraft.departmentLevel,
    status: "freeze" as TaskStatus,
    statusLabel: taskDraft.statusLabel,
    startDate: taskDraft.startDate,
    progress: taskDraft.progress,
    isEditor: true,
  },
  ...tasks.value,
]);

const getStatusMeta = (
  statusLabel: string
): Pick<AdvancedTask, "status" | "statusLabel"> => {
  if (statusLabel === "失败") {
    return { status: "fail", statusLabel };
  }

  if (statusLabel === "运行中") {
    return { status: "running", statusLabel };
  }

  return { status: "freeze", statusLabel: statusLabel || "冻结" };
};

const resetTaskDraft = () => {
  taskDraft.name = "";
  taskDraft.code = "";
  taskDraft.departmentLevel = "";
  taskDraft.statusLabel = "";
  taskDraft.startDate = "";
  taskDraft.progress = 0;
  editingTaskId.value = null;
};

const handleTaskSave = () => {
  const { name, code, departmentLevel, statusLabel, startDate, progress } =
    taskDraft;

  if (
    !name ||
    !code ||
    !departmentLevel ||
    !statusLabel ||
    !startDate ||
    !progress
  ) {
    Modal.message({
      message: "请先补全任务管理中的必填信息",
      status: "warning",
    });
    return;
  }

  const statusMeta = getStatusMeta(statusLabel);

  if (editingTaskId.value === null) {
    const nextId =
      tasks.value.reduce((max, item) => Math.max(max, item.id), 0) + 1;

    tasks.value = [
      {
        id: nextId,
        name,
        code,
        departmentLevel,
        status: statusMeta.status,
        statusLabel: statusMeta.statusLabel,
        startDate,
        progress,
      },
      ...tasks.value,
    ];
  } else {
    tasks.value = tasks.value.map((item) =>
      item.id === editingTaskId.value
        ? {
            ...item,
            name,
            code,
            departmentLevel,
            status: statusMeta.status,
            statusLabel: statusMeta.statusLabel,
            startDate,
            progress,
          }
        : item
    );
  }

  resetTaskDraft();
};

const handleTaskEdit = (task: AdvancedTask) => {
  editingTaskId.value = task.id;
  taskDraft.name = task.name;
  taskDraft.code = task.code;
  taskDraft.departmentLevel = task.departmentLevel;
  taskDraft.statusLabel = task.statusLabel;
  taskDraft.startDate = task.startDate;
  taskDraft.progress = task.progress;
};

const handleTaskDelete = (task: AdvancedTask) => {
  Modal.confirm({
    title: "删除",
    message: `确认删除任务“${task.name}”吗？`,
  })
    .then(() => {
      tasks.value = tasks.value.filter((item) => item.id !== task.id);

      if (editingTaskId.value === task.id) {
        resetTaskDraft();
      }
    })
    .catch(() => {});
};

const handleTaskDraftClear = () => {
  resetTaskDraft();
};

const handleCancel = () => {
  Object.assign(formData, JSON.parse(JSON.stringify(initialFormData)));
  formRef.value?.resetFields?.();
  tasks.value = JSON.parse(JSON.stringify(initialTasks));
  resetTaskDraft();
};

const handleSubmit = () => {
  formRef.value?.validate?.((valid: boolean) => {
    if (!valid) {
      Modal.message({
        message: "请先补全基本信息中的必填项",
        status: "warning",
      });
      return;
    }

    Modal.message({
      message: "高级表单保存成功",
      status: "success",
    });
  });
};
</script>

<template>
  <div class="advanced-form-page">
    <section class="advanced-panel">
      <div class="advanced-panel__header">
        <h2>基本信息</h2>
      </div>

      <tiny-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="advanced-form"
      >
        <div class="advanced-form-grid">
          <tiny-form-item label="项目名称" prop="projectName" required>
            <tiny-input v-model="formData.projectName" placeholder="请输入" />
          </tiny-form-item>

          <tiny-form-item label="培养职位" prop="position" required>
            <tiny-select
              v-model="formData.position"
              :options="positionOptions"
              text-field="label"
              value-field="value"
              placeholder="请选择"
            />
          </tiny-form-item>

          <tiny-form-item label="HR" prop="hr" required>
            <tiny-input v-model="formData.hr" placeholder="请输入" />
          </tiny-form-item>

          <tiny-form-item label="导师" prop="mentor" required>
            <tiny-select
              v-model="formData.mentor"
              :options="mentorOptions"
              text-field="label"
              value-field="value"
              placeholder="请选择"
            />
          </tiny-form-item>

          <tiny-form-item label="实际辅导开始日期" prop="startDate" required>
            <tiny-date-picker
              v-model="formData.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            />
          </tiny-form-item>

          <tiny-form-item label="培养实际辅导结束日期" prop="endDate" required>
            <tiny-date-picker
              v-model="formData.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            />
          </tiny-form-item>

          <tiny-form-item label="电话号码" prop="phone" required>
            <tiny-input v-model="formData.phone" placeholder="请输入" />
          </tiny-form-item>

          <tiny-form-item label="地址" prop="address" required>
            <tiny-input v-model="formData.address" placeholder="请输入" />
          </tiny-form-item>

          <tiny-form-item label="备注" prop="remark" required>
            <tiny-input v-model="formData.remark" placeholder="请输入" />
          </tiny-form-item>
        </div>
      </tiny-form>
    </section>

    <section class="advanced-panel">
      <div class="advanced-panel__header">
        <h2>任务管理</h2>
      </div>

      <div class="task-manager">
        <tiny-grid
          class="task-grid"
          :data="taskTableRows"
          :show-overflow="true"
          :show-header-overflow="true"
          :row-id="'id'"
        >
          <tiny-grid-column field="name" title="姓名" width="220">
            <template #default="{ row }">
              <tiny-input
                v-if="row.isEditor"
                v-model="taskDraft.name"
                placeholder="请输入"
              />
              <span v-else>{{ row.name }}</span>
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="code" title="工号">
            <template #default="{ row }">
              <tiny-input
                v-if="row.isEditor"
                v-model="taskDraft.code"
                placeholder="请输入"
              />
              <span v-else>{{ row.code }}</span>
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="departmentLevel" title="部门层级">
            <template #default="{ row }">
              <tiny-select
                v-if="row.isEditor"
                v-model="taskDraft.departmentLevel"
                :options="departmentLevelOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择"
              />
              <span v-else>{{ row.departmentLevel }}</span>
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="statusLabel" title="状态">
            <template #default="{ row }">
              <tiny-select
                v-if="row.isEditor"
                v-model="taskDraft.statusLabel"
                :options="statusOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择"
              />
              <span v-else class="task-status" :class="`is-${row.status}`">
                <span class="task-status__icon" />
                <span>{{ row.statusLabel }}</span>
              </span>
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="startDate" title="开始日期">
            <template #default="{ row }">
              <tiny-date-picker
                v-if="row.isEditor"
                v-model="taskDraft.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              />
              <span v-else>{{ row.startDate }}</span>
            </template>
          </tiny-grid-column>
          <tiny-grid-column field="progress" title="运行任务状态">
            <template #default="{ row }">
              <tiny-select
                v-if="row.isEditor"
                v-model="taskDraft.progress"
                :options="taskProgressOptions"
                text-field="label"
                value-field="value"
                placeholder="请选择"
              />
              <div v-else class="task-progress">
                <tiny-progress
                  :percentage="row.progress"
                  :show-text="false"
                  :stroke-width="6"
                  color="#74c01b"
                />
                <span>{{ row.progress }}%</span>
              </div>
            </template>
          </tiny-grid-column>
          <tiny-grid-column title="操作" width="180">
            <template #default="{ row }">
              <div class="task-actions">
                <tiny-button
                  v-if="row.isEditor"
                  type="text"
                  class="task-row-action"
                  @click="handleTaskSave"
                >
                  保存
                </tiny-button>
                <tiny-button
                  v-if="row.isEditor"
                  type="text"
                  class="task-row-action"
                  @click="handleTaskDraftClear"
                >
                  删除
                </tiny-button>
                <tiny-button
                  v-if="!row.isEditor"
                  type="text"
                  class="task-row-action"
                  @click="handleTaskEdit(row)"
                >
                  编辑
                </tiny-button>
                <tiny-button
                  v-if="!row.isEditor"
                  type="text"
                  class="task-row-action"
                  @click="handleTaskDelete(row)"
                >
                  删除
                </tiny-button>
              </div>
            </template>
          </tiny-grid-column>
        </tiny-grid>
      </div>
    </section>

    <div class="advanced-form-footer-bar">
      <div class="advanced-form-footer">
        <tiny-button round @click="handleCancel">取消</tiny-button>
        <tiny-button type="primary" round @click="handleSubmit"
          >保存</tiny-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.advanced-form-page {
  padding: 24px;
  padding-bottom: 88px;
}

.advanced-form {
  display: contents;
}

.advanced-panel {
  padding: 20px 24px 18px;
  border-radius: 8px;
  background: #fff;
}

.advanced-panel + .advanced-panel {
  margin-top: 20px;
}

.advanced-panel__header {
  margin-bottom: 18px;
}

.advanced-panel__header h2 {
  margin: 0;
  color: #222;
  font-size: 18px;
  font-weight: 600;
}

.advanced-form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px 28px;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.task-row-action {
  padding: 0;
  color: #2f7df6;
}

.task-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  line-height: 1;
}

.task-status__icon {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: 2px solid currentColor;
  box-sizing: border-box;
}

.task-status.is-freeze {
  color: #f59a23;
}

.task-status.is-freeze .task-status__icon {
  width: 0;
  height: 0;
  border: none;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 9px solid #f59a23;
  border-radius: 0;
  transform: translateY(-1px);
}

.task-status.is-fail {
  color: #f56c6c;
}

.task-status.is-running {
  color: #67c23a;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-progress :deep(.tiny-progress) {
  width: 132px;
  flex: none;
}

.task-grid {
  border-top: none;
}

.advanced-form-footer-bar {
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
}

.advanced-form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
  max-width: calc(100% - 50px);
  margin: 0 auto;
  padding: 0 24px;
}

:deep(.advanced-panel .tiny-form-item) {
  margin-bottom: 0;
}

:deep(.advanced-panel .tiny-form-item__label) {
  padding-bottom: 8px;
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

:deep(
    .advanced-panel .tiny-form-item.is-required .tiny-form-item__label::before
  ) {
  color: #f56c6c;
}

:deep(.advanced-panel .tiny-input__inner),
:deep(.advanced-panel .tiny-base-select .tiny-input__inner),
:deep(.advanced-panel .tiny-date-editor .tiny-input__inner) {
  height: 32px;
  border-radius: 6px;
  font-size: 13px;
}

:deep(.task-progress .tiny-progress-bar__outer) {
  background: #e6e8eb;
  border-radius: 999px;
}

:deep(.task-progress .tiny-progress-bar__inner) {
  border-radius: 999px;
}

:deep(.task-row-action .tiny-button) {
  min-width: auto;
  height: auto;
  padding: 0;
  color: #2f7df6;
  font-size: 13px;
}

:deep(.task-row-action .tiny-button .tiny-svg) {
  width: 14px;
  height: 14px;
  margin-right: 2px;
}

:deep(.advanced-form-footer .tiny-button) {
  min-width: 96px;
  height: 32px;
}

@media (max-width: 1220px) {
  .advanced-form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .advanced-form-page {
    padding: 16px;
    padding-bottom: 96px;
  }

  .advanced-panel {
    padding: 16px;
  }

  .advanced-form-grid {
    grid-template-columns: 1fr;
  }

  .advanced-form-footer-bar {
    left: 0;
  }

  .advanced-form-footer {
    padding: 0 16px;
  }
}
</style>
