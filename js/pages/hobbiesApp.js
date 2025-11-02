// 完全独立的兴趣爱好页面脚本
class HobbiesApp {
  constructor() {
    this.init();
  }

  init() {
    try {
      // 确保DOM加载完成后执行
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this.onDOMLoaded.bind(this));
      } else {
        this.onDOMLoaded();
      }
    } catch (e) {
      console.error('初始化错误:', e);
    }
  }

  onDOMLoaded() {
    try {
      // 显示模拟统计数据
      const stats = {
        'total-hobbies': '6',
        'active-hobbies': '6',
        'total-achievements': '23',
        'total-hours': '1530'
      };

      // 更新统计数据
      Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      });

      // 添加按钮功能
      const addBtn = document.getElementById('add-hobby-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          window.location.href = 'hobby-edit.html';
        });
      }

      console.log('兴趣爱好页面脚本加载成功');
    } catch (e) {
      console.error('DOM加载后执行错误:', e);
    }
  }
}

// 立即执行
(function() {
  try {
    new HobbiesApp();
  } catch (e) {
    console.error('应用实例化错误:', e);
  }
})();