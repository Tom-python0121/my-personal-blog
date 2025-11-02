// 通知提示工具函数

/**
 * 显示通知提示
 * @param {string} message - 通知消息内容
 * @param {string} type - 通知类型：'success'、'error'、'info'、'warning'
 * @param {number} duration - 显示持续时间（毫秒），默认3000
 */
function showNotification(message, type = 'info', duration = 3000) {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // 添加到文档
  document.body.appendChild(notification);
  
  // 显示动画
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // 自动关闭
  setTimeout(() => {
    notification.classList.remove('show');
    
    // 动画结束后移除元素
    notification.addEventListener('transitionend', () => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, { once: true });
  }, duration);
}

/**
 * 显示成功通知
 * @param {string} message - 通知消息
 * @param {number} duration - 显示持续时间
 */
function showSuccessNotification(message, duration = 3000) {
  showNotification(message, 'success', duration);
}

/**
 * 显示错误通知
 * @param {string} message - 通知消息
 * @param {number} duration - 显示持续时间
 */
function showErrorNotification(message, duration = 3000) {
  showNotification(message, 'error', duration);
}

/**
 * 显示信息通知
 * @param {string} message - 通知消息
 * @param {number} duration - 显示持续时间
 */
function showInfoNotification(message, duration = 3000) {
  showNotification(message, 'info', duration);
}

/**
 * 显示警告通知
 * @param {string} message - 通知消息
 * @param {number} duration - 显示持续时间
 */
function showWarningNotification(message, duration = 3000) {
  showNotification(message, 'warning', duration);
}

/**
 * 初始化通知样式（如果还没有添加）
 */
function initNotificationStyles() {
  if (document.getElementById('notification-styles')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'notification-styles';
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      transform: translateX(100%);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
      max-width: 350px;
      word-wrap: break-word;
    }
    
    .notification.show {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-success {
      background-color: #52c41a;
    }
    
    .notification-error {
      background-color: #f5222d;
    }
    
    .notification-info {
      background-color: #1890ff;
    }
    
    .notification-warning {
      background-color: #faad14;
    }
    
    @media (max-width: 768px) {
      .notification {
        right: 10px;
        left: 10px;
        max-width: none;
      }
    }
  `;
  
  document.head.appendChild(style);
}

// 初始化通知样式
initNotificationStyles();