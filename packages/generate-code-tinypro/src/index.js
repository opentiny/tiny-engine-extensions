/**
 * TinyPro Generate Code 插件入口
 * 基于原有的 generate-code 插件，增加了 TinyPro 系统集成功能
 */

// 导入组件 - Vue 组件的样式会自动被打包
import entry from "./Main.vue";
import SystemIntegration from "./SystemIntegration.vue";
import ToolbarBase from "./components/ToolbarBase.vue";
import ToolbarBaseButton from "./components/ToolbarBaseButton.vue";
import ToolbarBaseIcon from "./components/ToolbarBaseIcon.vue";

// 导入元数据和服务
import metaData from "./meta.js";
import { SaveLocalService } from "./composable/index.js";

// 主插件对象
const TinyProGenerateCodePlugin = {
  ...metaData,
  entry,
  metas: [SaveLocalService],
};

// 默认导出插件
export default TinyProGenerateCodePlugin;

// 命名导出
export {
  SaveLocalService,
  TinyProGenerateCodePlugin,
  // 导出组件供外部使用
  SystemIntegration,
  ToolbarBase,
  ToolbarBaseButton,
  ToolbarBaseIcon,
};
