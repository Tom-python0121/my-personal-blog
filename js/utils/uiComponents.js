// UI组件库

/**
 * 创建评分星星元素
 * @param {number} rating - 评分值（1-5）
 * @returns {HTMLElement} 星星评分元素
 */
export function createRatingStars(rating) {
  const stars = document.createElement('div');
  stars.className = 'rating-stars';
  
  // 计算完整星星和半星
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < 5; i++) {
    const star = document.createElement('span');
    if (i < fullStars) {
      star.className = 'star full';
      star.textContent = '★';
    } else if (i === fullStars && hasHalfStar) {
      star.className = 'star half';
      star.textContent = '★';
      // 使用CSS实现半星效果
      star.style.position = 'relative';
      star.innerHTML = '<span class="full-star">★</span><span class="half-star">★</span>';
    } else {
      star.className = 'star empty';
      star.textContent = '☆';
    }
    stars.appendChild(star);
  }
  
  // 添加评分文本
  const ratingText = document.createElement('span');
  ratingText.className = 'rating-text';
  ratingText.textContent = ` ${rating.toFixed(1)}`;
  stars.appendChild(ratingText);
  
  return stars;
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期对象或字符串
 * @returns {string} 格式化后的日期字符串 (YYYY-MM-DD)
 */
export function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 创建状态标签
 * @param {string} status - 状态值 (finished, reading, planned)
 * @returns {HTMLElement} 状态标签元素
 */
export function createStatusBadge(status) {
  const badge = document.createElement('span');
  badge.className = `status-badge ${status}`;
  
  const statusMap = {
    finished: '已读完',
    reading: '阅读中',
    planned: '计划读'
  };
  
  badge.textContent = statusMap[status] || status;
  return badge;
}

/**
 * 显示通知消息
 * @param {string} message - 通知内容
 * @param {string} type - 通知类型 (success, error, info)
 * @param {number} duration - 显示时长（毫秒）
 */
export function showNotification(message, type = 'info', duration = 3000) {
  // 检查是否已存在通知容器
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // 添加到容器
  notificationContainer.appendChild(notification);
  
  // 添加动画类
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // 自动关闭
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notificationContainer.removeChild(notification);
    }, 300);
  }, duration);
}

/**
 * 创建加载指示器
 * @returns {HTMLElement} 加载指示器元素
 */
export function createLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = '<div class="spinner"></div><span>加载中...</span>';
  return loader;
}

/**
 * 验证输入是否为空
 * @param {string} value - 输入值
 * @returns {boolean} 是否为空
 */
export function isEmpty(value) {
  return value === null || value === undefined || value.trim() === '';
}

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}