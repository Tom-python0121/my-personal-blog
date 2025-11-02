// 路由管理模块

class Router {
  constructor() {
    this.routes = [];
    this.currentPath = '';
    this.onRouteChange = null;
  }

  /**
   * 注册路由
   * @param {string} path - 路由路径
   * @param {Function} handler - 路由处理函数
   */
  register(path, handler) {
    this.routes.push({ path, handler });
  }

  /**
   * 初始化路由
   */
  init() {
    // 监听URL变化
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });

    // 初始加载时处理路由
    this.handleRouteChange();
  }

  /**
   * 处理路由变化
   */
  handleRouteChange() {
    const path = window.location.hash || '#/';
    this.currentPath = path;
    
    // 找到匹配的路由
    const route = this.routes.find(r => r.path === path);
    
    if (route) {
      route.handler();
    } else {
      // 处理未找到的路由
      console.error(`Route not found: ${path}`);
    }

    // 触发路由变化事件
    if (this.onRouteChange) {
      this.onRouteChange(path);
    }
  }

  /**
   * 导航到指定路径
   * @param {string} path - 要导航到的路径
   * @param {Object} params - 路由参数
   */
  navigate(path, params = {}) {
    // 构建URL
    let url = path;
    
    // 添加参数
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    if (queryString) {
      url += `?${queryString}`;
    }
    
    // 更新URL
    window.location.hash = url;
  }

  /**
   * 获取URL参数
   * @returns {Object} URL参数对象
   */
  getParams() {
    const queryString = window.location.search.substring(1);
    const params = {};
    
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }
    
    return params;
  }

  /**
   * 设置路由变化回调
   * @param {Function} callback - 回调函数
   */
  setRouteChangeCallback(callback) {
    this.onRouteChange = callback;
  }
}

// 导出路由实例
const router = new Router();
export default router;