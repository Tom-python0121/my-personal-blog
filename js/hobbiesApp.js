// 兴趣爱好应用主模块
class HobbiesApp {
  constructor() {
    this.hobbies = [];
    this.filteredHobbies = [];
    this.currentCategory = '全部';
    this.currentPage = 1;
    this.itemsPerPage = 6;
    
    // DOM 元素引用
    this.hobbiesGrid = document.getElementById('hobbies-grid');
    this.categoryBtns = document.querySelectorAll('.category-btn');
    this.addBtn = document.getElementById('add-hobby-btn');
    this.prevBtn = document.getElementById('prev-page');
    this.nextBtn = document.getElementById('next-page');
    this.pageInfo = document.getElementById('page-info');
    this.statsTotal = document.getElementById('total-hobbies');
    this.statsActive = document.getElementById('active-hobbies');
    this.statsHours = document.getElementById('total-hours');
    this.statsSkills = document.getElementById('total-achievements');
    
    // 初始化应用
    this.init();
  }
  
  // 初始化应用
  async init() {
    try {
      // 尝试从存储中加载兴趣爱好数据
      this.hobbies = await this.loadHobbies();
      this.filteredHobbies = [...this.hobbies];
      
      // 初始化事件监听
      this.setupEventListeners();
      
      // 渲染页面
      this.render();
      
    } catch (error) {
      console.error('初始化兴趣爱好应用失败:', error);
      this.showNotification('加载数据失败', 'error');
    }
  }
  
  // 从存储加载兴趣爱好数据
  async loadHobbies() {
    try {
      const hobbies = StorageManager.getItem('hobbies');
      if (!hobbies || hobbies.length === 0) {
        // 如果没有数据，初始化模拟数据
        await initializeMockHobbies();
        return StorageManager.getItem('hobbies') || [];
      }
      return hobbies;
    } catch (error) {
      console.error('加载兴趣爱好数据失败:', error);
      return [];
    }
  }
  
  // 设置事件监听
  setupEventListeners() {
    // 分类筛选按钮点击事件
    this.categoryBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentCategory = e.currentTarget.getAttribute('data-category');
        this.currentPage = 1;
        this.filterHobbies();
        this.render();
      });
    });
    
    // 添加按钮点击事件
    this.addBtn.addEventListener('click', () => {
      window.location.href = 'hobby-edit.html';
    });
    
    // 分页按钮点击事件
    this.prevBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.render();
      }
    });
    
    this.nextBtn.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.render();
      }
    });
    
    // 点击卡片进入详情页
    this.hobbiesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.hobby-card');
      if (card) {
        const hobbyId = card.getAttribute('data-id');
        window.location.href = `hobby-detail.html?id=${hobbyId}`;
      }
    });
  }
  
  // 筛选兴趣爱好
  filterHobbies() {
    if (this.currentCategory === '全部') {
      this.filteredHobbies = [...this.hobbies];
    } else {
      this.filteredHobbies = this.hobbies.filter(hobby => 
        hobby.category === this.currentCategory
      );
    }
  }
  
  // 计算分页信息
  get paginationInfo() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.totalPages = Math.ceil(this.filteredHobbies.length / this.itemsPerPage);
    
    return {
      items: this.filteredHobbies.slice(startIndex, endIndex),
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, this.filteredHobbies.length),
      total: this.filteredHobbies.length,
      totalPages: this.totalPages
    };
  }
  
  // 计算统计数据
  calculateStats() {
    const total = this.hobbies.length;
    const active = this.hobbies.filter(hobby => hobby.isActive).length;
    const totalHours = this.hobbies.reduce((sum, hobby) => sum + hobby.totalHours, 0);
    const uniqueSkills = new Set(this.hobbies.flatMap(hobby => hobby.skills)).size;
    
    return { total, active, totalHours, uniqueSkills };
  }
  
  // 渲染统计数据
  renderStats() {
    const stats = this.calculateStats();
    this.statsTotal.textContent = stats.total;
    this.statsActive.textContent = stats.active;
    this.statsHours.textContent = stats.totalHours;
    this.statsSkills.textContent = stats.uniqueSkills;
  }
  
  // 渲染分类按钮状态
  renderCategories() {
    this.categoryBtns.forEach(btn => {
      if (btn.getAttribute('data-category') === this.currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  
  // 渲染兴趣爱好卡片
  renderHobbyCards(items) {
    this.hobbiesGrid.innerHTML = '';
    
    if (items.length === 0) {
      this.hobbiesGrid.innerHTML = '<p class="no-hobbies">暂无兴趣爱好</p>';
      return;
    }
    
    items.forEach(hobby => {
      const card = this.createHobbyCard(hobby);
      this.hobbiesGrid.appendChild(card);
    });
  }
  
  // 创建兴趣爱好卡片元素
  createHobbyCard(hobby) {
    const card = document.createElement('div');
    card.className = 'hobby-card';
    card.setAttribute('data-id', hobby.id);
    
    // 生成评分星星
    const ratingStars = this.createRatingStars(hobby.rating);
    
    // 生成分类图标
    const categoryIcon = this.getCategoryIcon(hobby.category);
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    card.innerHTML = `
      <div class="hobby-image-container">
        <img src="${hobby.images[0] || '../assets/images/default-hobby.jpg'}" alt="${hobby.name}" class="hobby-image">
        <span class="status-badge ${hobby.isActive ? 'active' : 'inactive'}">${hobby.isActive ? '进行中' : '已暂停'}</span>
      </div>
      <div class="hobby-content">
        <div class="hobby-header">
          <h3 class="hobby-title">${categoryIcon} ${hobby.name}</h3>
        </div>
        <span class="hobby-category">${hobby.category}</span>
        <div class="hobby-meta">
          <span>${formatDate(hobby.startDate)}</span>
          <span>•</span>
          <span>${hobby.totalHours} 小时</span>
        </div>
        <div class="hobby-description">${hobby.description.substring(0, 100)}...</div>
        <div class="rating-stars">${ratingStars}</div>
        <div class="hobby-stats">
          <div class="stat-item">
            <div class="stat-number">${hobby.achievements?.length || 0}</div>
            <div class="stat-label">成就</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${hobby.photos?.length || 0}</div>
            <div class="stat-label">作品</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${hobby.skills?.length || 0}</div>
            <div class="stat-label">技能</div>
          </div>
        </div>
      </div>
    `;
    
    return card;
  }
  
  // 获取分类图标
  getCategoryIcon(category) {
    const icons = {
      '运动健身': '🏃',
      '艺术创作': '🎨',
      '科技数码': '💻',
      '阅读学习': '📚',
      '其他爱好': '🌟'
    };
    return icons[category] || '🌟';
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

  // 渲染分页控件
  renderPagination() {
    const { startIndex, endIndex, total, totalPages } = this.paginationInfo;
    
    this.pageInfo.textContent = `第 ${this.currentPage} 页`;
    
    this.prevBtn.disabled = this.currentPage === 1;
    this.nextBtn.disabled = this.currentPage === totalPages;
  }
  
  // 显示通知
  showNotification(message, type = 'info') {
    showNotification(message, type);
  }
  
  // 渲染整个页面
  render() {
    this.renderCategories();
    this.renderStats();
    
    const { items } = this.paginationInfo;
    this.renderHobbyCards(items);
    this.renderPagination();
  }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  const hobbiesApp = new HobbiesApp();
});