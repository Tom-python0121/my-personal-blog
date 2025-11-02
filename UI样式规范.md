# 个人博客项目PC端UI样式规范

基于对 D:\AI\AI编程\my-website 项目的深入分析，为您制定了以下完整的UI样式规范。该项目是一个纯前端的个人成长记录网站，采用原生HTML、CSS和JavaScript开发，具有良好的基础设计系统。

## 1. 设计原则

### 1.1 核心原则
- **简洁优雅**：采用现代扁平化设计，避免过度装饰
- **内容为王**：突出内容的可读性，服务于博客的阅读体验
- **一致性**：统一的视觉语言和交互模式
- **可访问性**：良好的对比度和清晰的视觉层次
- **响应式**：优先考虑PC端体验，兼顾移动端适配

### 1.2 品牌个性
- **温馨自然**：体现个人成长和生活记录的温暖感
- **专业可信**：保持简洁专业的视觉效果
- **活力向上**：通过色彩和动效传达积极正面的情感

## 2. 颜色系统

### 2.1 主色调
```css
/* 主要品牌色 */
--primary-color: #4A90E2;        /* 清新蓝色，用于主要行动点 */
--primary-hover: #357ABD;        /* 悬停状态 */
--primary-active: #2968A8;       /* 激活状态 */
--primary-light: rgba(74, 144, 226, 0.1);  /* 浅色背景 */

/* 辅助色 */
--secondary-color: #50E3C2;      /* 青绿色，用于强调和装饰 */
--accent-color: #6B8E23;         /* 橄榄绿，用于渐变和点缀 */
```

### 2.2 中性色系统
```css
/* 文本色 */
--text-primary: #333333;         /* 主要文本 */
--text-secondary: #666666;       /* 次要文本 */
--text-tertiary: #999999;        /* 辅助文本 */
--text-disabled: #CCCCCC;        /* 禁用状态 */

/* 背景色 */
--background-primary: #FFFFFF;   /* 主背景 */
--background-secondary: #F7F9FC; /* 次要背景 */
--background-tertiary: #EEEEEE;  /* 三级背景 */

/* 边框色 */
--border-color: #E0E0E0;         /* 主要边框 */
--border-light: #F0F0F0;         /* 浅色边框 */
```

### 2.3 语义色系统
```css
/* 状态色 */
--success-color: #52C41A;        /* 成功状态 */
--warning-color: #FAAD14;        /* 警告状态 */
--error-color: #FF4D4F;          /* 错误状态 */
--info-color: #1890FF;           /* 信息提示 */

/* 语义色的浅色版本 */
--success-light: rgba(82, 196, 26, 0.1);
--warning-light: rgba(250, 173, 20, 0.1);
--error-light: rgba(255, 77, 79, 0.1);
--info-light: rgba(24, 144, 255, 0.1);
```

## 3. 排版系统

### 3.1 字体家族
```css
--font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 
                    'Helvetica Neue', Helvetica, Arial, sans-serif;
--font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 
                    'Source Code Pro', monospace;
```

### 3.2 字号系统
```css
--font-size-xs: 12px;           /* 小号文字 */
--font-size-sm: 14px;           /* 次要文字 */
--font-size-base: 16px;         /* 基础文字 */
--font-size-lg: 18px;           /* 大号文字 */
--font-size-xl: 24px;           /* 标题文字 */
--font-size-xxl: 32px;          /* 主标题 */
--font-size-3xl: 48px;          /* 超大标题 */
```

### 3.3 字重系统
```css
--font-weight-normal: 400;      /* 正常字重 */
--font-weight-medium: 500;      /* 中等字重 */
--font-weight-semibold: 600;    /* 半粗体 */
--font-weight-bold: 700;        /* 粗体 */
```

### 3.4 行高系统
```css
--line-height-tight: 1.2;      /* 紧密行高 - 标题 */
--line-height-normal: 1.5;     /* 正常行高 - 正文 */
--line-height-loose: 1.8;      /* 宽松行高 - 长文本 */
```

## 4. 布局系统

### 4.1 容器系统
```css
--container-max-width: 1200px;  /* 最大容器宽度 */
--container-padding: 24px;      /* 容器内边距 */

/* 响应式容器 */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* 内容区域宽度 */
--content-width: 800px;         /* 文章内容最佳阅读宽度 */
--sidebar-width: 280px;         /* 侧边栏宽度 */
```

### 4.2 栅格系统
```css
/* 12列栅格系统 */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -12px;
}

.col {
  padding: 0 12px;
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%;
}

/* 响应式栅格类 */
.col-1 { flex: 0 0 8.333333%; }
.col-2 { flex: 0 0 16.666667%; }
.col-3 { flex: 0 0 25%; }
.col-4 { flex: 0 0 33.333333%; }
.col-6 { flex: 0 0 50%; }
.col-8 { flex: 0 0 66.666667%; }
.col-9 { flex: 0 0 75%; }
.col-12 { flex: 0 0 100%; }
```

### 4.3 响应式断点
```css
--breakpoint-sm: 576px;         /* 小屏幕 */
--breakpoint-md: 768px;         /* 平板 */
--breakpoint-lg: 992px;         /* 桌面 */
--breakpoint-xl: 1200px;        /* 大桌面 */
--breakpoint-xxl: 1400px;       /* 超大屏幕 */
```

## 5. 间距系统

### 5.1 间距规范
```css
/* 8像素基础间距系统 */
--spacing-xs: 4px;              /* 微小间距 */
--spacing-sm: 8px;              /* 小间距 */
--spacing-md: 16px;             /* 中等间距 */
--spacing-lg: 24px;             /* 大间距 */
--spacing-xl: 32px;             /* 超大间距 */
--spacing-xxl: 48px;            /* 超超大间距 */
--spacing-3xl: 64px;            /* 巨大间距 */
```

### 5.2 组件内间距
```css
/* 按钮内间距 */
--btn-padding-sm: 6px 12px;     /* 小按钮 */
--btn-padding-md: 8px 16px;     /* 中等按钮 */
--btn-padding-lg: 12px 24px;    /* 大按钮 */

/* 卡片内间距 */
--card-padding: 24px;           /* 卡片内边距 */
--card-header-padding: 16px 24px; /* 卡片头部内边距 */

/* 表单内间距 */
--form-input-padding: 8px 12px; /* 输入框内边距 */
```

## 6. 组件规范

### 6.1 按钮系统
```css
/* 基础按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

/* 按钮变体 */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: var(--background-tertiary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

.btn-outline {
  background-color: transparent;
  border-color: var(--primary-color);
  color: var(--primary-color);
}

/* 按钮尺寸 */
.btn-sm { padding: var(--btn-padding-sm); font-size: var(--font-size-sm); }
.btn-lg { padding: var(--btn-padding-lg); font-size: var(--font-size-lg); }
```

### 6.2 卡片系统
```css
.card {
  background-color: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--card-header-padding);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--background-secondary);
}

.card-body {
  padding: var(--card-padding);
}

.card-footer {
  padding: var(--card-header-padding);
  border-top: 1px solid var(--border-color);
  background-color: var(--background-secondary);
}
```

### 6.3 导航组件
```css
/* 顶部导航栏 */
.navbar {
  height: 60px;
  background-color: var(--background-primary);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* 导航链接 */
.nav-link {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-color);
  background-color: var(--primary-light);
}
```

### 6.4 文章列表组件
```css
/* 文章卡片 */
.article-card {
  display: flex;
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--background-primary);
  transition: all 0.2s ease;
  margin-bottom: var(--spacing-lg);
}

.article-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

/* 文章元信息 */
.article-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

/* 文章标题 */
.article-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  margin-bottom: var(--spacing-sm);
}

/* 文章摘要 */
.article-excerpt {
  color: var(--text-secondary);
  line-height: var(--line-height-normal);
}
```

## 7. 阴影和边框规范

### 7.1 阴影系统
```css
/* 阴影等级 */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);        /* 微阴影 */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);        /* 中阴影 */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);       /* 大阴影 */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);       /* 超大阴影 */

/* 内阴影 */
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
```

### 7.2 边框规范
```css
--border-width: 1px;            /* 标准边框宽度 */
--border-radius: 8px;           /* 标准圆角 */
--border-radius-sm: 4px;        /* 小圆角 */
--border-radius-lg: 12px;       /* 大圆角 */
--border-radius-full: 9999px;   /* 完全圆形 */
```

## 8. 动画和过渡效果

### 8.1 过渡时间
```css
--transition-fast: 0.15s ease;      /* 快速过渡 */
--transition-normal: 0.2s ease;     /* 正常过渡 */
--transition-slow: 0.3s ease;       /* 缓慢过渡 */
```

### 8.2 常用动画
```css
/* 淡入动画 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 上滑进入 */
@keyframes slideInUp {
  from { 
    opacity: 0;
    transform: translateY(20px); 
  }
  to { 
    opacity: 1;
    transform: translateY(0); 
  }
}

/* 缩放动画 */
@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.9); 
  }
  to { 
    opacity: 1;
    transform: scale(1); 
  }
}
```

### 8.3 微交互效果
```css
/* 悬停提升效果 */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 按钮点击反馈 */
.btn:active {
  transform: translateY(1px);
}

/* 图标旋转效果 */
.icon-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 9. 深色模式考虑

### 9.1 深色模式色彩变量
```css
[data-theme="dark"] {
  /* 文本色 */
  --text-primary: #E5E7EB;
  --text-secondary: #9CA3AF;
  --text-tertiary: #6B7280;
  
  /* 背景色 */
  --background-primary: #111827;
  --background-secondary: #1F2937;
  --background-tertiary: #374151;
  
  /* 边框色 */
  --border-color: #374151;
  --border-light: #4B5563;
  
  /* 主色调适配 */
  --primary-color: #60A5FA;
  --primary-hover: #3B82F6;
  --primary-active: #2563EB;
}
```

### 9.2 深色模式切换
```css
/* 深色模式切换按钮 */
.theme-toggle {
  padding: 8px;
  border: none;
  border-radius: var(--border-radius-full);
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background-color: var(--background-tertiary);
  color: var(--text-primary);
}
```

## 10. 特殊组件规范

### 10.1 照片画廊
```css
/* 瀑布流布局 */
.masonry-grid {
  columns: 3;
  column-gap: var(--spacing-lg);
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: var(--spacing-lg);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.masonry-item:hover {
  transform: scale(1.02);
}
```

### 10.2 阅读进度条
```css
.reading-progress {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--background-tertiary);
  z-index: 1000;
}

.reading-progress-bar {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.1s ease;
}
```

### 10.3 标签系统
```css
.tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: var(--background-tertiary);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: var(--primary-color);
  color: white;
}
```

## 11. 响应式设计指南

### 11.1 断点策略
- **Desktop First**: 优先设计桌面端体验
- **渐进增强**: 从大屏幕向小屏幕适配
- **关键断点**: 1200px, 768px, 576px

### 11.2 移动端适配
```css
@media (max-width: 768px) {
  :root {
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 24px;
  }
  
  .container {
    padding: 0 var(--spacing-md);
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
```

## 12. 可访问性规范

### 12.1 对比度要求
- 正文文本对比度至少 4.5:1
- 大文本对比度至少 3:1
- 交互元素对比度至少 3:1

### 12.2 焦点状态
```css
/* 键盘焦点样式 */
.btn:focus-visible,
.form-control:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 跳过链接 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--background-primary);
  color: var(--primary-color);
  padding: 8px;
  text-decoration: none;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 6px;
}
```

## 实施建议

### 分阶段实施计划
1. **第一阶段**：建立CSS变量系统，统一颜色和间距
2. **第二阶段**：重构核心组件（按钮、卡片、导航）
3. **第三阶段**：完善特殊组件和交互效果
4. **第四阶段**：优化响应式和可访问性

### 优先级排序
- **高优先级**：颜色系统、排版系统、基础组件
- **中优先级**：动画效果、特殊组件、深色模式
- **低优先级**：高级交互、细节优化

这份UI样式规范基于您现有项目的设计系统，提供了完整而详细的指导原则。建议在实施时分阶段进行，优先完善核心组件，然后逐步扩展到特殊功能组件。