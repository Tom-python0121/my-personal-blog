// 兴趣爱好详情页面应用模块
class HobbyDetailApp {
  constructor() {
    this.hobbyId = this.getHobbyIdFromUrl();
    this.hobby = null;
    
    // DOM 元素引用
    this.backBtn = document.getElementById('back-btn');
    this.editBtn = document.getElementById('edit-btn');
    this.deleteBtn = document.getElementById('delete-btn');
    this.detailContainer = document.querySelector('.detail-container');
    
    // 初始化应用
    this.init();
  }
  
  // 从URL获取兴趣爱好ID
  getHobbyIdFromUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      return id ? parseInt(id, 10) : null;
    } catch (error) {
      console.error('获取URL参数失败:', error);
      return null;
    }
  }
  
  // 初始化应用
  async init() {
    try {
      // 加载兴趣爱好数据
      await this.loadHobbyData();
      
      if (!this.hobby) {
        this.renderNotFound();
        return;
      }
      
      // 设置事件监听
      this.setupEventListeners();
      
      // 渲染页面
      this.render();
      
    } catch (error) {
      console.error('加载兴趣爱好详情失败:', error);
      showNotification('加载详情失败', 'error');
    }
  }
  
  // 加载兴趣爱好数据
  async loadHobbyData() {
    try {
      // 使用正确的storageManager（小写）
      const hobbies = storageManager.getHobbies() || [];
      this.hobby = hobbies.find(h => h.id === (typeof this.hobbyId === 'number' ? this.hobbyId : parseInt(this.hobbyId)));
      
      // 如果没找到数据，使用默认数据
      if (!this.hobby) {
        console.warn(`未找到ID为${this.hobbyId}的兴趣爱好，使用模拟数据`);
        this.hobby = this.getMockHobbyData();
        this.showNotification('加载数据失败，显示示例数据', 'warning');
      }
    } catch (error) {
      console.error('加载兴趣爱好数据失败:', error);
      this.hobby = this.getMockHobbyData();
      this.showNotification('加载数据失败，显示示例数据', 'error');
      // 不抛出错误，让程序继续运行
    }
  }
  
  // 获取模拟数据
  getMockHobbyData() {
    return {
      id: this.hobbyId || 1,
      name: '示例兴趣爱好',
      description: '这是一个示例兴趣爱好的详细描述。',
      category: '未分类',
      startDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true,
      rating: 4.5,
      totalHours: 10,
      skills: ['示例技能1', '示例技能2'],
      images: ['../assets/images/placeholder.svg'],
      photos: [],
      achievements: [],
      timeline: []
    };
  }
  
  // 设置事件监听
  setupEventListeners() {
    // 返回按钮点击事件
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => {
        window.location.href = 'hobbies.html';
      });
    }
    
    // 编辑按钮点击事件
    if (this.editBtn) {
      this.editBtn.addEventListener('click', () => {
        window.location.href = `hobby-edit.html?id=${this.hobbyId}`;
      });
    }
    
    // 删除按钮点击事件
      if (this.deleteBtn) {
        this.deleteBtn.addEventListener('click', async () => {
          if (confirm('确定要删除这个兴趣爱好吗？')) {
            try {
              await this.deleteHobby();
              window.location.href = 'hobbies.html';
            } catch (error) {
              // 使用this.showNotification而不是全局函数
              this.showNotification('删除失败', 'error');
            }
          }
        });
      }
    
    // 点赞功能
    if (this.detailContainer) {
      this.detailContainer.addEventListener('click', (e) => {
        const likeBtn = e.target.closest('.like-btn');
        if (likeBtn) {
          const photoIndex = parseInt(likeBtn.getAttribute('data-index'));
          if (!isNaN(photoIndex)) {
            this.toggleLikePhoto(photoIndex);
          }
        }
      });
    }
  }
  
  // 删除兴趣爱好
  async deleteHobby() {
    try {
      const hobbies = StorageManager.getItem('hobbies') || [];
      const updatedHobbies = hobbies.filter(h => h.id !== this.hobbyId);
      StorageManager.setItem('hobbies', updatedHobbies);
      showNotification('删除成功', 'success');
    } catch (error) {
      console.error('删除兴趣爱好失败:', error);
      throw error;
    }
  }
  
  // 切换照片点赞状态
  toggleLikePhoto(photoIndex) {
    // 由于我们的照片数据是简单的URL数组，这里简化实现
    this.showNotification('点赞功能暂未实现', 'info');
  }
  
  // 显示通知
  showNotification(message, type = 'info') {
    // 简单的通知实现
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 设置基本样式
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      border-radius: 4px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      transition: opacity 0.3s;
    `;
    
    // 设置不同类型的背景色
    if (type === 'error') {
      notification.style.backgroundColor = '#e74c3c';
    } else if (type === 'success') {
      notification.style.backgroundColor = '#2ecc71';
    } else if (type === 'warning') {
      notification.style.backgroundColor = '#f39c12';
    }
    
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // 更新存储中的兴趣爱好数据
  updateHobbyInStorage() {
    const hobbies = StorageManager.getItem('hobbies') || [];
    const updatedHobbies = hobbies.map(h => h.id === this.hobbyId ? this.hobby : h);
    StorageManager.setItem('hobbies', updatedHobbies);
  }
  
  // 渲染未找到页面
  renderNotFound() {
    this.detailContainer.innerHTML = `
      <div class="not-found">
        <h2>兴趣爱好未找到</h2>
        <p>抱歉，找不到您请求的兴趣爱好信息。</p>
        <button id="go-back-btn" class="back-btn">返回列表</button>
      </div>
    `;
    
    document.getElementById('go-back-btn').addEventListener('click', () => {
      window.location.href = 'hobbies.html';
    });
  }
  
  // 生成评分星星
  createRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // 全星
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    
    // 半星（可选）
    if (hasHalfStar) {
      stars += '✨';
    }
    
    // 空星
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars += '☆';
    }
    
    return stars;
  }

  // 创建状态标签
  createStatusLabel(isActive) {
    return `<span class="status-badge ${isActive ? 'active' : 'inactive'}">${isActive ? '活跃中' : '已暂停'}</span>`;
  }

  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // 渲染整个页面
  render() {
    if (!this.hobby) return;
    
    this.renderBasicInfo();
    this.renderStats();
    this.renderPhotoGallery();
    this.renderTimeline();
  }
  
  // 渲染基本信息
  renderBasicInfo() {
    if (!this.hobby) return;
    
    const mainImage = this.hobby.images?.[0] || '../assets/images/placeholder.svg';
    const rating = this.hobby.rating || 0;
    const ratingStars = this.createRatingStars(rating);
    
    // 安全地更新DOM元素
    try {
      const elements = {
        'hobby-main-image': { prop: 'src', value: mainImage },
        'hobby-main-image': { prop: 'alt', value: this.hobby.name || '兴趣爱好图片' },
        'hobby-title': { prop: 'textContent', value: this.hobby.name || '未命名兴趣爱好' },
        'hobby-category': { prop: 'textContent', value: this.hobby.category || '未分类' },
        'hobby-start-date': { prop: 'textContent', value: this.formatDate(this.hobby.startDate || new Date()) },
        'hobby-rating': { prop: 'innerHTML', value: ratingStars },
        'hobby-long-description': { prop: 'textContent', value: this.hobby.description || '暂无描述' },
        'detail-name': { prop: 'textContent', value: this.hobby.name || '未命名兴趣爱好' },
        'detail-category': { prop: 'textContent', value: this.hobby.category || '未分类' },
        'detail-start-date': { prop: 'textContent', value: this.formatDate(this.hobby.startDate || new Date()) },
        'detail-status': { prop: 'textContent', value: (this.hobby.isActive !== false) ? '活跃中' : '已暂停' },
        'detail-skill-level': { prop: 'textContent', value: ratingStars }
      };
      
      // 批量更新DOM元素，避免每个元素都做错误处理
      for (const [id, { prop, value }] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
          element[prop] = value;
        }
      }
    } catch (error) {
      console.error('渲染基本信息失败:', error);
    }
  }
  
  // 渲染统计数据
  renderStats() {
    if (!this.hobby) return;
    
    try {
      // 计算持续天数
      const startDate = new Date(this.hobby.startDate || new Date());
      const today = new Date();
      const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      
      // 安全地更新DOM元素
      const statsElements = {
        'detail-hours': { prop: 'textContent', value: (this.hobby.totalHours || 0) + ' 小时' },
        'detail-achievements': { prop: 'textContent', value: (this.hobby.achievements?.length || 0) + ' 次' },
        'detail-days': { prop: 'textContent', value: Math.max(0, days) + ' 天' },
        'detail-last-activity': { prop: 'textContent', value: this.formatDate(this.hobby.lastActivity || new Date()) }
      };
      
      for (const [id, { prop, value }] of Object.entries(statsElements)) {
        const element = document.getElementById(id);
        if (element) {
          element[prop] = value;
        }
      }
    } catch (error) {
      console.error('渲染统计数据失败:', error);
    }
  }
  
  // 渲染照片库
  renderPhotoGallery() {
    const photosGrid = document.getElementById('photos-grid');
    if (!photosGrid) return;
    
    photosGrid.innerHTML = '';
    
    if (this.hobby.photos && this.hobby.photos.length > 0) {
      this.hobby.photos.forEach((photoUrl, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
          <img src="${photoUrl}" alt="作品照片 ${index + 1}" class="photo-thumbnail">
        `;
        photosGrid.appendChild(photoItem);
      });
    } else {
      photosGrid.innerHTML = '<p>暂无作品照片</p>';
    }
  }
  
  // 渲染时间轴
  renderTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;
    
    timeline.innerHTML = '';
    
    if (this.hobby.timeline && this.hobby.timeline.length > 0) {
      this.hobby.timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
          <div class="timeline-item-header">
            <strong>${this.formatDate(item.date)}</strong>
          </div>
          <div class="timeline-item-content">
            ${item.description}
          </div>
        `;
        timeline.appendChild(timelineItem);
      });
    } else {
      timeline.innerHTML = '<p>暂无时间轴记录</p>';
    }
  }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  const hobbyDetailApp = new HobbyDetailApp();
});