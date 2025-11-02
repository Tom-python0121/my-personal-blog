// 兴趣爱好编辑页面应用模块
class HobbyEditApp {
  constructor() {
    this.hobbyId = this.getHobbyIdFromUrl();
    this.hobby = this.hobbyId ? null : this.createNewHobby();
    
    // DOM 元素引用
    this.saveBtn = document.getElementById('save-btn');
    this.backBtn = document.getElementById('back-btn');
    this.form = document.getElementById('hobby-form');
    this.photosUpload = document.getElementById('photos-upload');
    this.photosInput = document.getElementById('photos-input');
    this.uploadPreview = document.getElementById('upload-preview');
    this.starRating = document.getElementById('star-rating');
    this.addTimelineBtn = document.getElementById('add-timeline-item');
    this.timelineContainer = document.getElementById('timeline-items');
    
    // 初始化应用
    this.init();
  }
  
  // 从URL获取兴趣爱好ID
  getHobbyIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }
  
  // 创建新的兴趣爱好对象
  createNewHobby() {
    return {
      id: Date.now().toString(),
      name: '',
      description: '',
      category: '其他爱好',
      rating: 3,
      startDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      totalHours: 0,
      isActive: true,
      updateFrequency: '每周',
      skills: [],
      images: [],
      photos: [],
      achievements: [],
      timeline: []
    };
  }
  
  // 初始化应用
  async init() {
    try {
      // 如果是编辑模式，加载数据
      if (this.hobbyId) {
        await this.loadHobbyData();
      }
      
      // 初始化表单
      this.initForm();
      
      // 设置事件监听
      this.setupEventListeners();
      
    } catch (error) {
      console.error('初始化编辑页面失败:', error);
      showNotification('加载数据失败', 'error');
    }
  }
  
  // 加载兴趣爱好数据
  async loadHobbyData() {
    try {
      const hobbies = StorageManager.getItem('hobbies') || [];
      this.hobby = hobbies.find(h => h.id === this.hobbyId);
      
      if (!this.hobby) {
        showNotification('兴趣爱好不存在', 'error');
        window.location.href = 'hobbies.html';
      }
    } catch (error) {
      console.error('加载兴趣爱好数据失败:', error);
      throw error;
    }
  }
  
  // 初始化表单
  initForm() {
    if (!this.hobby) return;
    
    // 填充基本信息
    document.getElementById('hobby-name').value = this.hobby.name;
    document.getElementById('hobby-description').value = this.hobby.description;
    document.getElementById('hobby-category').value = this.hobby.category;
    document.getElementById('hobby-start-date').value = this.hobby.startDate;
    document.getElementById('hobby-total-hours').value = this.hobby.totalHours;
    document.getElementById('hobby-update-frequency').value = this.hobby.updateFrequency;
    
    // 设置状态
    document.getElementById('hobby-status-active').checked = this.hobby.isActive;
    document.getElementById('hobby-status-inactive').checked = !this.hobby.isActive;
    
    // 设置技能
    document.getElementById('hobby-skills').value = this.hobby.skills.join('、');
    
    // 渲染星级评分
    this.renderStarRating(this.hobby.rating);
    
    // 渲染图片预览
    this.renderImagePreviews();
    
    // 渲染时间轴项目
    this.renderTimelineItems();
  }
  
  // 设置事件监听
  setupEventListeners() {
    // 保存按钮点击事件
    this.saveBtn.addEventListener('click', async () => {
      await this.saveHobby();
    });
    
    // 返回按钮点击事件
    this.backBtn.addEventListener('click', () => {
      window.location.href = this.hobbyId ? `hobby-detail.html?id=${this.hobbyId}` : 'hobbies.html';
    });
    
    // 星级评分点击事件
    this.starRating.addEventListener('click', (e) => {
      const star = e.target.closest('.star');
      if (star) {
        const rating = parseInt(star.getAttribute('data-rating'));
        this.hobby.rating = rating;
        this.renderStarRating(rating);
      }
    });
    
    // 图片上传区域点击事件
    this.photosUpload.addEventListener('click', () => {
      this.photosInput.click();
    });
    
    // 图片选择事件
    this.photosInput.addEventListener('change', (e) => {
      this.handleFileSelection(e.target.files);
    });
    
    // 添加时间轴项目按钮点击事件
    this.addTimelineBtn.addEventListener('click', () => {
      this.addTimelineItem();
    });
    
    // 时间轴项目删除事件（使用事件委托）
    this.timelineContainer.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.remove-timeline-item');
      if (deleteBtn) {
        const itemIndex = parseInt(deleteBtn.getAttribute('data-index'));
        this.hobby.timeline.splice(itemIndex, 1);
        this.renderTimelineItems();
      }
    });
    
    // 时间轴项目内容变化事件（使用事件委托）
    this.timelineContainer.addEventListener('input', (e) => {
      if (e.target.classList.contains('timeline-date')) {
        const itemIndex = parseInt(e.target.closest('.timeline-item').getAttribute('data-index'));
        this.hobby.timeline[itemIndex].date = e.target.value;
      } else if (e.target.classList.contains('timeline-description')) {
        const itemIndex = parseInt(e.target.closest('.timeline-item').getAttribute('data-index'));
        this.hobby.timeline[itemIndex].description = e.target.value;
      }
    });
    
    // 图片删除事件（使用事件委托）
    this.uploadPreview.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('.remove-image');
      if (removeBtn) {
        const imgIndex = parseInt(removeBtn.getAttribute('data-index'));
        this.hobby.images.splice(imgIndex, 1);
        this.renderImagePreviews();
      }
    });
  }
  
  // 处理文件选择
  async handleFileSelection(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = await this.getFileUrl(file);
      this.hobby.images.push(url);
    }
    this.renderImagePreviews();
  }
  
  // 获取文件URL（模拟上传）
  getFileUrl(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }
  
  // 渲染星级评分
  renderStarRating(rating) {
    this.starRating.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = `star ${i <= rating ? 'active' : ''}`;
      star.setAttribute('data-rating', i);
      star.textContent = '★';
      this.starRating.appendChild(star);
    }
  }
  
  // 渲染图片预览
  renderImagePreviews() {
    this.uploadPreview.innerHTML = '';
    
    this.hobby.images.forEach((url, index) => {
      const previewItem = document.createElement('div');
      previewItem.className = 'preview-item';
      previewItem.innerHTML = `
        <img src="${url}" alt="预览图片" class="preview-image">
        <div class="remove-image" data-index="${index}">×</div>
      `;
      this.uploadPreview.appendChild(previewItem);
    });
  }
  
  // 添加时间轴项目
  addTimelineItem() {
    this.hobby.timeline.push({
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    this.renderTimelineItems();
  }
  
  // 渲染时间轴项目
  renderTimelineItems() {
    this.timelineContainer.innerHTML = '';
    
    this.hobby.timeline.forEach((item, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      timelineItem.setAttribute('data-index', index);
      timelineItem.innerHTML = `
        <div class="timeline-item-header">
          <input type="date" class="timeline-date form-input" value="${item.date}">
          <button class="remove-timeline-item" data-index="${index}">删除</button>
        </div>
        <textarea class="timeline-description form-textarea" placeholder="描述这个里程碑事件...">${item.description}</textarea>
      `;
      this.timelineContainer.appendChild(timelineItem);
    });
  }
  
  // 验证表单
  validateForm() {
    if (!this.hobby.name.trim()) {
      showNotification('请输入兴趣爱好名称', 'error');
      return false;
    }
    
    if (!this.hobby.description.trim()) {
      showNotification('请输入兴趣爱好描述', 'error');
      return false;
    }
    
    return true;
  }
  
  // 保存兴趣爱好
  async saveHobby() {
    try {
      // 收集表单数据
      this.hobby.name = document.getElementById('hobby-name').value.trim();
      this.hobby.description = document.getElementById('hobby-description').value.trim();
      this.hobby.category = document.getElementById('hobby-category').value;
      this.hobby.startDate = document.getElementById('hobby-start-date').value;
      this.hobby.totalHours = parseInt(document.getElementById('hobby-total-hours').value) || 0;
      this.hobby.updateFrequency = document.getElementById('hobby-update-frequency').value;
      this.hobby.isActive = document.getElementById('hobby-status-active').checked;
      
      // 处理技能列表
      const skillsText = document.getElementById('hobby-skills').value.trim();
      this.hobby.skills = skillsText ? skillsText.split(/[、,，]/).map(skill => skill.trim()) : [];
      
      // 更新最后活动时间
      this.hobby.lastActivity = new Date().toISOString().split('T')[0];
      
      // 验证表单
      if (!this.validateForm()) return;
      
      // 保存到存储
      await this.saveToStorage();
      
      showNotification(this.hobbyId ? '更新成功' : '创建成功', 'success');
      
      // 跳转到详情页
      window.location.href = `hobby-detail.html?id=${this.hobby.id}`;
      
    } catch (error) {
      console.error('保存兴趣爱好失败:', error);
      showNotification('保存失败', 'error');
    }
  }
  
  // 保存到存储
  async saveToStorage() {
    try {
      const hobbies = StorageManager.getItem('hobbies') || [];
      
      if (this.hobbyId) {
        // 更新现有兴趣爱好
        const index = hobbies.findIndex(h => h.id === this.hobbyId);
        if (index !== -1) {
          hobbies[index] = this.hobby;
        }
      } else {
        // 添加新兴趣爱好
        hobbies.push(this.hobby);
      }
      
      StorageManager.setItem('hobbies', hobbies);
    } catch (error) {
      console.error('保存到存储失败:', error);
      throw error;
    }
  }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  const hobbyEditApp = new HobbyEditApp();
});