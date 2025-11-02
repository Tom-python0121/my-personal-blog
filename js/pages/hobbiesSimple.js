// 兴趣爱好页面脚本
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM加载完成，开始初始化页面');
  
  // 模拟兴趣爱好数据
  const mockHobbies = [
    {
      id: 1,
      name: '跑步健身',
      category: '运动健身',
      status: 'active',
      startDate: '2023-01-15',
      skillLevel: 4,
      hours: 480,
      achievements: 8,
      shortDescription: '每周坚持跑步3-4次，保持身体健康和良好的精神状态',
      mainImage: 'https://picsum.photos/seed/run123/300/200'
    },
    {
      id: 2,
      name: '摄影创作',
      category: '艺术创作',
      status: 'active',
      startDate: '2022-08-10',
      skillLevel: 3,
      hours: 320,
      achievements: 6,
      shortDescription: '记录生活中的美好瞬间，探索光影艺术',
      mainImage: 'https://picsum.photos/seed/photo456/300/200'
    },
    {
      id: 3,
      name: '编程学习',
      category: '科技数码',
      status: 'active',
      startDate: '2023-03-05',
      skillLevel: 4,
      hours: 550,
      achievements: 5,
      shortDescription: '不断学习新技术，提升编程能力',
      mainImage: 'https://picsum.photos/seed/code789/300/200'
    },
    {
      id: 4,
      name: '阅读书籍',
      category: '阅读学习',
      status: 'active',
      startDate: '2023-02-20',
      skillLevel: 3,
      hours: 120,
      achievements: 3,
      shortDescription: '每周阅读至少一本书，拓宽知识面',
      mainImage: 'https://picsum.photos/seed/book101/300/200'
    },
    {
      id: 5,
      name: '手工制作',
      category: '艺术创作',
      status: 'active',
      startDate: '2023-04-12',
      skillLevel: 2,
      hours: 40,
      achievements: 1,
      shortDescription: '制作手工艺品，锻炼动手能力',
      mainImage: 'https://picsum.photos/seed/craft202/300/200'
    },
    {
      id: 6,
      name: '烹饪美食',
      category: '其他爱好',
      status: 'active',
      startDate: '2023-05-08',
      skillLevel: 3,
      hours: 20,
      achievements: 0,
      shortDescription: '学习制作各种美食，享受烹饪乐趣',
      mainImage: 'https://picsum.photos/seed/cooking303/300/200'
    }
  ];
  
  // 当前选中的分类
  let currentCategory = 'all';
  
  // 显示统计数据
  updateStats(mockHobbies);
  
  // 渲染兴趣爱好卡片
  renderHobbyCards(mockHobbies);
  
  // 设置分类按钮事件
  setupCategoryButtons();
  
  // 添加按钮功能
  setupAddButton();
  
  console.log('页面初始化完成');
  
  /**
   * 更新统计数据
   * @param {Array} hobbies - 兴趣爱好数据数组
   */
  function updateStats(hobbies) {
    const stats = {
      'total-hobbies': hobbies.length.toString(),
      'active-hobbies': hobbies.filter(h => h.status === 'active').length.toString(),
      'total-achievements': hobbies.reduce((sum, h) => sum + h.achievements, 0).toString(),
      'total-hours': hobbies.reduce((sum, h) => sum + h.hours, 0).toString()
    };
    
    for (const [id, value] of Object.entries(stats)) {
      const el = document.getElementById(id);
      if (el) {
        el.textContent = value;
      }
    }
  }
  
  /**
   * 渲染兴趣爱好卡片
   * @param {Array} hobbies - 要渲染的兴趣爱好数组
   */
  function renderHobbyCards(hobbies) {
    const hobbiesGrid = document.getElementById('hobbies-grid');
    if (!hobbiesGrid) return;
    
    // 清空网格
    hobbiesGrid.innerHTML = '';
    
    // 根据当前分类筛选
    const filteredHobbies = currentCategory === 'all' 
      ? hobbies 
      : hobbies.filter(hobby => hobby.category === currentCategory);
    
    if (filteredHobbies.length === 0) {
      // 显示空状态
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 60px 20px;
        color: #666;
        font-size: 1.2rem;
      `;
      emptyMessage.textContent = '没有找到相关的兴趣爱好';
      hobbiesGrid.appendChild(emptyMessage);
      return;
    }
    
    // 创建并添加卡片
    filteredHobbies.forEach(hobby => {
      const card = createHobbyCard(hobby);
      hobbiesGrid.appendChild(card);
    });
  }
  
  /**
   * 创建兴趣爱好卡片
   * @param {Object} hobby - 兴趣爱好对象
   * @returns {HTMLElement} 创建的卡片元素
   */
  function createHobbyCard(hobby) {
    const card = document.createElement('div');
    card.className = 'hobby-card';
    
    // 设置卡片样式（简单版本）
    card.style.cssText = `
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      height: 100%;
    `;
    
    // 卡片点击事件
    card.addEventListener('click', () => {
      window.location.href = `hobby-detail.html?id=${hobby.id}`;
    });
    
    // 悬停效果
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    });
    
    // 生成评分星星
    const ratingStars = createRatingStars(hobby.skillLevel);
    
    // 构建卡片内容
    card.innerHTML = `
      <img src="${hobby.mainImage}" alt="${hobby.name}" style="width: 100%; height: 180px; object-fit: cover;">
      <div style="padding: 16px; flex: 1; display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 1.2rem; font-weight: 600;">${hobby.name}</h3>
          <span style="padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; background: #4CAF50; color: white;">
            ${hobby.status === 'active' ? '活跃中' : '已暂停'}
          </span>
        </div>
        <span style="display: inline-block; padding: 2px 8px; background: #E3F2FD; color: #1976D2; border-radius: 4px; font-size: 0.8rem; margin-bottom: 12px;">
          ${hobby.category}
        </span>
        <div style="margin-bottom: 12px;">
          <span style="font-size: 0.9rem; color: #666;">🎯 ${hobby.startDate}</span>
        </div>
        ${ratingStars}
        <p style="margin: 12px 0; font-size: 0.9rem; color: #333; line-height: 1.5; flex: 1;">
          ${hobby.shortDescription}
        </p>
        <div style="display: flex; justify-content: space-between; margin-top: auto;">
          <div style="text-align: center;">
            <div style="font-size: 1.2rem; font-weight: 600; color: #2196F3;">${hobby.hours}</div>
            <div style="font-size: 0.8rem; color: #666;">小时</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 1.2rem; font-weight: 600; color: #FF9800;">${hobby.achievements}</div>
            <div style="font-size: 0.8rem; color: #666;">成就</div>
          </div>
        </div>
      </div>
    `;
    
    return card;
  }
  
  /**
   * 创建评分星星
   * @param {number} rating - 评分（1-5）
   * @returns {string} HTML字符串
   */
  function createRatingStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        starsHTML += '<span style="color: #FFC107; font-size: 1rem;">★</span>';
      } else {
        starsHTML += '<span style="color: #E0E0E0; font-size: 1rem;">☆</span>';
      }
    }
    return `<div style="margin-bottom: 8px;">${starsHTML}</div>`;
  }
  
  /**
   * 设置分类按钮事件
   */
  function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    if (categoryButtons.length > 0) {
      categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
          // 更新当前分类
          currentCategory = this.dataset.category;
          
          // 更新按钮样式
          categoryButtons.forEach(btn => {
            btn.classList.remove('active');
          });
          this.classList.add('active');
          
          // 重新渲染卡片
          renderHobbyCards(mockHobbies);
        });
      });
    }
  }
  
  /**
   * 设置添加按钮功能
   */
  function setupAddButton() {
    const addBtn = document.getElementById('add-hobby-btn');
    if (addBtn) {
      addBtn.onclick = function() {
        window.location.href = 'hobby-edit.html';
      };
    }
  }
});