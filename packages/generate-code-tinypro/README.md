# TinyPro Generate Code Plugin

TinyPro 代码生成插件，为 TinyEngine 提供增强的代码生成和系统集成功能。

## 安装

```bash
npm install @tinypro/generate-code-plugin
```

## 使用方法

### 在 TinyEngine 项目中引入

```javascript
import TinyProGenerateCodePlugin from "@tinypro/generate-code-plugin";
import "@tinypro/generate-code-plugin/style.css";

// 在你的插件注册代码中使用
const plugins = [
  TinyProGenerateCodePlugin,
  // 其他插件...
];
```
