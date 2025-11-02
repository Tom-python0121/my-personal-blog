静态网站开发指南

官方文档资源

核心文档

Web 标准文档：
MDN Web Docs
https://developer.mozilla.org/zh-CN/

W3C 标准
https://www.w3.org/zh-hans/about/press-media/


开发规范重点

HTML 语法规范
- 使用语义化 HTML5 标签
- 保持良好的文档结构和可访问性
- 图片必须添加 alt 属性
- 表单元素必须有对应的 label
CSS/JavaScript 规则

// ✅ 支持的现代语法
const userName = user?.profile?.name ?? '访客';
const activeUsers = users.filter(user => user.isActive);
const userNames = users.map(user => user.name).join(', ');

// ✅ CSS 现代特性
/* CSS 变量、Grid、Flexbox */
:root {
  --primary-color: #007bff;
}
.container {
  display: grid;
  gap: 1rem;
}

开发要点

项目结构
- 清晰的目录组织（assets、css、js、images）
- index.html 作为入口文件
- 模块化 JavaScript 文件
资源管理
- 静态资源使用相对路径
- 图片优化和懒加载
- CSS/JS 文件压缩和合并
最佳实践

1. 性能优化 - 资源压缩、CDN加速、缓存策略
2. 响应式设计 - 移动优先、媒体查询、弹性布局
3. SEO 优化 - 语义化标签、结构化数据、站点地图
4. 代码质量 - ESLint检查、代码复用、注释规范

常见问题
- 缓存问题：使用版本号或哈希值管理静态资源

开发指导原则

语言和沟通
- 对话语言: 保持中文对话，确保沟通清晰准确
- 需求确认: 先分析和梳理需求，与用户确认一致后再开始开发

代码规范
- 注释要求: 所有函数和复杂逻辑必须添加中文注释
- 代码风格: 遵循标准 Web 开发规范
- 命名规范:
- HTML: 使用 kebab-case 命名 class 和 id
- CSS: BEM 命名法或 kebab-case
- JavaScript: camelCase 命名变量和函数
- 文件名: 使用 kebab-case
开发流程
1. 需求分析: 详细分析用户需求，确保理解准确
2. 方案确认: 与用户确认技术方案和实现思路
3. 代码实现: 按确认的方案进行开发
4. 测试验证: 本地测试功能和兼容性
5. 优化部署: 优化性能并部署到服务器

项目约束
- 渐进开发: 优先实现核心功能，后续迭代完善
- 兼容性: 确保主流浏览器兼容
- 无服务器: 纯前端实现，不依赖后端服务

静态网站特定规范

文件结构
project/
├── index.html          # 主页面
├── pages/              # 其他页面
├── css/                # 样式文件
│   ├── main.css       # 主样式
│   └── components/    # 组件样式
├── js/                 # JavaScript文件
│   ├── main.js        # 主脚本
│   └── modules/       # 模块化脚本
├── assets/             # 静态资源
│   ├── images/        # 图片
│   ├── fonts/         # 字体
│   └── icons/         # 图标
└── libs/               # 第三方库

样式处理
- 使用 CSS 变量管理主题色
- 移动优先的响应式设计
- 关键 CSS 内联，其余异步加载
JavaScript 处理
- 使用模块化开发（ES6 Modules）
- 事件委托优化性能
- 防抖和节流处理高频事件
资源优化
- 图片格式：WebP 优先，JPEG/PNG 降级
- 字体加载：使用 font-display: swap
- 代码分割：按需加载非关键资源