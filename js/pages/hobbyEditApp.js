// 兴趣爱好编辑页面应用
import StorageManager from '../utils/storage.js';
import { showNotification } from '../utils/uiComponents.js';

/**
 * 兴趣爱好编辑应用类
 */
class HobbyEditApp {
  constructor() {
    // 应用状态
    this.hobbies = [];
    this.currentHobby = null;
    this.hobbyId = null;
    this.isEditing = false;
    this.photos = [];
    this.timelineItems = [];
    
    // 初始化应用
    this.init();
  }
  
  /**
   * 初始化应用
   */
  async init() {
    // 获取URL参数
    this.hobbyId = this.getUrlParameter('id');
    this.isEditing = !!this.hobbyId;
    
    // 加载数据
    this.loadData();
    
    // 设置事件监听器
    this.setupEventListeners();
    
    // 如果是编辑模式，加载现有数据到表单
    if (this.isEditing) {
      this.loadFormData();
    } else {
      // 设置默认开始日期为今天
      document.getElementById('start-date').value = new Date().toISOString().split('T')[0];
    }
  }
  
  /**
   * 从localStorage加载数据
   */
  loadData() {
    try {
      this.hobbies = StorageManager.getItem(StorageManager.KEYS.HOBBIES, []);
      
      if (this.isEditing) {
        this.currentHobby = this.hobbies.find(hobby => hobby.id === this.hobbyId);
        
        if (!this.currentHobby) {
          showNotification('找不到该兴趣爱好', 'error');
          setTimeout(() => {
            window.location.href = 'hobbies.html';
          }, 1500);
        }
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      showNotification('加载数据失败', 'error');
    }
  }
  
  /**
   * 保存数据到localStorage
   */
  saveData() {
    try {
      StorageManager.setItem(StorageManager.KEYS.HOBBIES, this.hobbies);
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      showNotification('保存数据失败', 'error');
      return false;
    }
  }
  
  /**
   * 设置事件监听器
   */
  setupEventListeners() {
    // 返回按钮
    document.getElementById('back-btn').addEventListener('click', () => {
      if (this.isEditing) {
        window.location.href = `hobby-detail.html?id=${this.hobbyId}`;
      } else {
        window.location.href = 'hobbies.html';
      }
    });
    
    // 保存按钮
    document.getElementById('save-btn').addEventListener('click', () => {
      this.saveHobby();
    });
    
    // 星级评分
    this.setupStarRating();
    
    // 图片上传
    this.setupPhotoUpload();
    
    // 时间轴管理
    this.setupTimelineManagement();
  }
  
  /**
   * 设置星级评分交互
   */
  setupStarRating() {
    const stars = document.querySelectorAll('.star-rating .star');
    const skillLevelInput = document.getElementById('skill-level');
    
    stars.forEach(star => {
      star.addEventListener('mouseover', () => {
        const value = parseInt(star.dataset.value);
        this.highlightStars(value);
      });
      
      star.addEventListener('mouseout', () => {
        const currentValue = parseInt(skillLevelInput.value);
        this.highlightStars(currentValue);
      });
      
      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        skillLevelInput.value = value;
        this.highlightStars(value);
      });
    });
  }
  
  /**
   * 高亮星星
   * @param {number} value - 要高亮的星星数量
   */
  highlightStars(value) {
    const stars = document.querySelectorAll('.star-rating .star');
    
    stars.forEach((star, index) => {
      if (index < value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
  
  /**
   * 设置图片上传功能
   */
  setupPhotoUpload() {
    const uploadArea = document.getElementById('photos-upload');
    const fileInput = document.getElementById('photos-input');
    
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
      this.handleFileUpload(e.target.files);
      // 重置input，允许重复上传相同文件
      fileInput.value = '';
    });
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.style.backgroundColor = '#f0f8ff';
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.style.backgroundColor = '';
      if (e.dataTransfer.files.length > 0) {
        this.handleFileUpload(e.dataTransfer.files);
      }
    });
  }
  
  /**
   * 处理文件上传
   * @param {FileList} files - 上传的文件列表
   */
  handleFileUpload(files) {
    Array.from(files).forEach(file => {
      if (!file.type.match('image.*')) {
        showNotification('请选择图片文件', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo = {
          url: e.target.result,
          likes: 0,
          userLiked: false
        };
        this.photos.push(photo);
        this.renderPhotos();
      };
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * 渲染上传的照片
   */
  renderPhotos() {
    const photosContainer = document.getElementById('uploaded-photos');
    photosContainer.innerHTML = '';
    
    this.photos.forEach((photo, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'uploaded-photo';
      
      photoItem.innerHTML = `
        <img src="${photo.url}" alt="上传的照片">
        <button class="remove-photo" data-index="${index}">×</button>
      `;
      
      photosContainer.appendChild(photoItem);
      
      // 删除按钮事件
      photoItem.querySelector('.remove-photo').addEventListener('click', (e) => {
        e.stopPropagation();
        this.removePhoto(index);
      });
    });
    
    // 更新隐藏字段
    document.getElementById('photos-data').value = JSON.stringify(this.photos);
  }
  
  /**
   * 移除照片
   * @param {number} index - 照片索引
   */
  removePhoto(index) {
    this.photos.splice(index, 1);
    this.renderPhotos();
  }
  
  /**
   * 设置时间轴管理功能
   */
  setupTimelineManagement() {
    const addBtn = document.getElementById('add-timeline-btn');
    
    addBtn.addEventListener('click', () => {
      this.addTimelineItem();
    });
  }
  
  /**
   * 添加时间轴记录
   */
  addTimelineItem() {
    const dateInput = document.getElementById('new-timeline-date');
    const contentInput = document.getElementById('new-timeline-content');
    
    const date = dateInput.value;
    const content = contentInput.value.trim();
    
    if (!date || !content) {
      showNotification('请填写完整的时间轴记录信息', 'error');
      return;
    }
    
    const timelineItem = {
      date: date,
      content: content
    };
    
    this.timelineItems.push(timelineItem);
    this.renderTimelineItems();
    
    // 清空输入
    dateInput.value = '';
    contentInput.value = '';
  }
  
  /**
   * 渲染时间轴记录
   */
  renderTimelineItems() {
    const timelineContainer = document.getElementById('timeline-items');
    timelineContainer.innerHTML = '';
    
    this.timelineItems.forEach((item, index) => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      
      timelineItem.innerHTML = `
        <span class="timeline-item-date">${item.date}</span>
        <span class="timeline-item-content">${item.content}</span>
        <button class="remove-timeline" data-index="${index}">×</button>
      `;
      
      timelineContainer.appendChild(timelineItem);
      
      // 删除按钮事件
      timelineItem.querySelector('.remove-timeline').addEventListener('click', () => {
        this.removeTimelineItem(index);
      });
    });
    
    // 更新隐藏字段
    document.getElementById('timeline-data').value = JSON.stringify(this.timelineItems);
  }
  
  /**
   * 移除时间轴记录
   * @param {number} index - 记录索引
   */
  removeTimelineItem(index) {
    this.timelineItems.splice(index, 1);
    this.renderTimelineItems();
  }
  
  /**
   * 加载表单数据（编辑模式）
   */
  loadFormData() {
    if (!this.currentHobby) return;
    
    const hobby = this.currentHobby;
    
    // 更新页面标题
    document.getElementById('page-title').textContent = '编辑兴趣爱好';
    
    // 填充表单数据
    document.getElementById('name').value = hobby.name || '';
    document.getElementById('category').value = hobby.category || '';
    document.getElementById('start-date').value = hobby.startDate ? new Date(hobby.startDate).toISOString().split('T')[0] : '';
    document.getElementById('status-active').checked = hobby.status === 'active';
    document.getElementById('status-inactive').checked = hobby.status === 'inactive';
    document.getElementById('skill-level').value = hobby.skillLevel || 3;
    document.getElementById('short-description').value = hobby.shortDescription || '';
    document.getElementById('long-description').value = hobby.longDescription || '';
    document.getElementById('hours').value = hobby.hours || 0;
    document.getElementById('achievements').value = hobby.achievements || 0;
    document.getElementById('main-image').value = hobby.mainImage || '';
    
    // 设置星级评分显示
    this.highlightStars(hobby.skillLevel || 3);
    
    // 加载照片数据
    this.photos = hobby.photos || [];
    this.renderPhotos();
    
    // 加载时间轴数据
    this.timelineItems = hobby.timeline || [];
    this.renderTimelineItems();
  }
  
  /**
   * 保存兴趣爱好
   */
  saveHobby() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    // 收集表单数据
    const formData = this.collectFormData();
    
    try {
      if (this.isEditing) {
        // 更新现有兴趣爱好
        const index = this.hobbies.findIndex(h => h.id === this.hobbyId);
        if (index !== -1) {
          this.hobbies[index] = { ...this.hobbies[index], ...formData };
        }
      } else {
        // 添加新兴趣爱好
        formData.id = this.generateUniqueId();
        this.hobbies.push(formData);
      }
      
      // 保存到localStorage
      if (this.saveData()) {
        showNotification(this.isEditing ? '更新成功！' : '添加成功！', 'success');
        
        // 跳转到详情页或列表页
        setTimeout(() => {
          if (this.isEditing) {
            window.location.href = `hobby-detail.html?id=${this.hobbyId}`;
          } else {
            window.location.href = `hobby-detail.html?id=${formData.id}`;
          }
        }, 1500);
      }
    } catch (error) {
      console.error('保存失败:', error);
      showNotification('保存失败，请重试', 'error');
    }
  }
  
  /**
   * 表单验证
   * @returns {boolean} 是否验证通过
   */
  validateForm() {
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value;
    const startDate = document.getElementById('start-date').value;
    
    if (!name) {
      showNotification('请输入兴趣爱好名称', 'error');
      return false;
    }
    
    if (!category) {
      showNotification('请选择分类', 'error');
      return false;
    }
    
    if (!startDate) {
      showNotification('请选择开始日期', 'error');
      return false;
    }
    
    return true;
  }
  
  /**
   * 收集表单数据
   * @returns {Object} 表单数据对象
   */
  collectFormData() {
    return {
      name: document.getElementById('name').value.trim(),
      category: document.getElementById('category').value,
      startDate: document.getElementById('start-date').value,
      status: document.getElementById('status-active').checked ? 'active' : 'inactive',
      skillLevel: parseInt(document.getElementById('skill-level').value),
      shortDescription: document.getElementById('short-description').value.trim(),
      longDescription: document.getElementById('long-description').value.trim(),
      hours: parseFloat(document.getElementById('hours').value) || 0,
      achievements: parseInt(document.getElementById('achievements').value) || 0,
      mainImage: document.getElementById('main-image').value.trim(),
      photos: this.photos,
      timeline: this.timelineItems,
      updatedAt: new Date().toISOString()
    };
  }
  
  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  /**
   * 获取URL参数
   * @param {string} name - 参数名
   * @returns {string|null} 参数值
   */
  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
  new HobbyEditApp();
});