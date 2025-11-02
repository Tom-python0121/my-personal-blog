// 兴趣爱好详情页面应用
import StorageManager from '../utils/storage.js';
import { createRatingStars, showNotification, formatDate } from '../utils/uiComponents.js';

// 模拟兴趣爱好数据，与列表页面保持一致
const mockHobbies = [
  {
    id: '1',
    name: '跑步健身',
    category: '运动健身',
    status: 'active',
    startDate: '2023-01-15',
    skillLevel: 4,
    hours: 480,
    achievements: 8,
    longDescription: '每周坚持跑步3-4次，保持身体健康和良好的精神状态。跑步不仅能增强心肺功能，还能提高免疫力，改善睡眠质量。我喜欢在清晨或傍晚跑步，感受大自然的美好。',
    mainImage: 'https://picsum.photos/seed/run123/800/600',
    photos: [
      { url: 'https://picsum.photos/seed/run-photo1/400/300', likes: 24, userLiked: false },
      { url: 'https://picsum.photos/seed/run-photo2/400/300', likes: 18, userLiked: true },
      { url: 'https://picsum.photos/seed/run-photo3/400/300', likes: 31, userLiked: false }
    ],
    timeline: [
      { date: '2024-10-10', content: '完成了第一次马拉松比赛' },
      { date: '2024-08-15', content: '突破个人5公里最好成绩' },
      { date: '2024-06-20', content: '加入跑步俱乐部' }
    ]
  },
  {
    id: '2',
    name: '摄影创作',
    category: '艺术创作',
    status: 'active',
    startDate: '2022-08-10',
    skillLevel: 3,
    hours: 320,
    achievements: 6,
    longDescription: '记录生活中的美好瞬间，探索光影艺术。摄影不仅能记录生活，还能培养观察能力和艺术审美。我喜欢在周末外出拍摄风景、人文和街景，享受按下快门的那一刻。',
    mainImage: 'https://picsum.photos/seed/photo456/800/600',
    photos: [
      { url: 'https://picsum.photos/seed/photo1/400/300', likes: 24, userLiked: false },
      { url: 'https://picsum.photos/seed/photo2/400/300', likes: 18, userLiked: true },
      { url: 'https://picsum.photos/seed/photo3/400/300', likes: 31, userLiked: false }
    ],
    timeline: [
      { date: '2024-05-15', content: '参加了城市摄影展，获得了最佳新人奖' },
      { date: '2024-04-20', content: '购买了新的镜头，开始尝试人像摄影' },
      { date: '2024-03-10', content: '完成了第一个摄影作品集《城市之光》' }
    ]
  },
  {
    id: '3',
    name: '编程学习',
    category: '科技数码',
    status: 'active',
    startDate: '2023-03-05',
    skillLevel: 4,
    hours: 550,
    achievements: 5,
    longDescription: '不断学习新技术，提升编程能力。编程是一项富有创造性的活动，通过编写代码解决实际问题，实现自己的想法。我主要学习前端开发，包括HTML、CSS、JavaScript等技术。',
    mainImage: 'https://picsum.photos/seed/code789/800/600',
    photos: [
      { url: 'https://picsum.photos/seed/code-photo1/400/300', likes: 12, userLiked: false },
      { url: 'https://picsum.photos/seed/code-photo2/400/300', likes: 15, userLiked: false },
      { url: 'https://picsum.photos/seed/code-photo3/400/300', likes: 8, userLiked: true }
    ],
    timeline: [
      { date: '2024-09-05', content: '完成了个人网站的开发' },
      { date: '2024-07-20', content: '学习React框架' },
      { date: '2024-05-10', content: '参加了线上编程训练营' }
    ]
  },
  {
    id: '4',
    name: '阅读书籍',
    category: '阅读学习',
    status: 'active',
    startDate: '2023-02-20',
    skillLevel: 3,
    hours: 120,
    achievements: 3,
    longDescription: '每周阅读至少一本书，拓宽知识面。阅读是一种很好的放松方式，也是获取知识的重要途径。我喜欢阅读各类书籍，包括小说、传记、科普等，尤其偏爱科幻类作品。',
    mainImage: 'https://picsum.photos/seed/book101/800/600',
    photos: [
      { url: 'https://picsum.photos/seed/book-photo1/400/300', likes: 19, userLiked: true },
      { url: 'https://picsum.photos/seed/book-photo2/400/300', likes: 23, userLiked: false },
      { url: 'https://picsum.photos/seed/book-photo3/400/300', likes: 11, userLiked: false }
    ],
    timeline: [
      { date: '2024-10-01', content: '读完今年第20本书' },
      { date: '2024-08-15', content: '参加读书俱乐部' },
      { date: '2024-06-10', content: '建立个人读书清单' }
    ]
  },
  {
    id: '5',
    name: '手工制作',
    category: '艺术创作',
    status: 'active',
    startDate: '2023-04-12',
    skillLevel: 2,
    hours: 40,
    achievements: 1,
    longDescription: '制作手工艺品，锻炼动手能力。手工制作可以培养耐心和专注力，同时创造出独特的作品。我喜欢制作纸艺、编织和简单的木艺作品，把创意变成实物的过程很有成就感。',
    mainImage: 'https://picsum.photos/seed/craft202/800/600',
    photos: [
      { url: 'https://picsum.photos/seed/craft-photo1/400/300', likes: 32, userLiked: false },
      { url: 'https://picsum.photos/seed/craft-photo2/400/300', likes: 28, userLiked: true },
      { url: 'https://picsum.photos/seed/craft-photo3/400/300', likes: 21, userLiked: false }
    ],
    timeline: [
      { date: '2024-09-20', content: '完成第一个手工纸雕作品' },
      { date: '2024-07-15', content: '学习编织技术' },
      { date: '2024-05-10', content: '购买基础手工工具' }
    ]
  },
  {
    id: '6',
    name: '烹饪美食',
    category: '其他爱好',
    status: 'active',
    startDate: '2023-05-08',
    skillLevel: 3,
    hours: 20,
    achievements: 0,
    longDescription: '学习制作各种美食，享受烹饪乐趣。烹饪不仅能满足味蕾，还是一种创造的过程。我喜欢尝试不同菜系的菜肴，尤其是家常菜和烘焙，看到家人享用自己做的美食很开心。',
    mainImage: 'https://picsum.photos/seed/cooking303/800/600',
    photos: [
      { url: 'https://picsum.photos/seed/cooking-photo1/400/300', likes: 36, userLiked: true },
      { url: 'https://picsum.photos/seed/cooking-photo2/400/300', likes: 29, userLiked: false },
      { url: 'https://picsum.photos/seed/cooking-photo3/400/300', likes: 42, userLiked: false }
    ],
    timeline: [
      { date: '2024-10-05', content: '成功制作了第一个生日蛋糕' },
      { date: '2024-08-15', content: '学习制作意大利面' },
      { date: '2024-06-10', content: '开始记录自己的烹饪笔记' }
    ]
  }
];

/**
 * 兴趣爱好详情应用类
 */
class HobbyDetailApp {
  constructor() {
    // 应用状态
    this.hobbies = [];
    this.currentHobby = null;
    this.hobbyId = null;
    
    // 初始化应用
    this.init();
  }
  
  /**
   * 初始化应用
   */
  async init() {
    // 获取URL参数
    this.hobbyId = this.getUrlParameter('id');
    
    // 加载数据
    this.loadData();
    
    // 设置事件监听器
    this.setupEventListeners();
    
    // 渲染详情
    this.render();
  }
  
  /**
   * 从localStorage加载数据
   */
  loadData() {
    try {
      this.hobbies = StorageManager.getItem(StorageManager.KEYS.HOBBIES, []);
      
      // 首先尝试从localStorage中查找
      this.currentHobby = this.hobbies.find(hobby => hobby.id === this.hobbyId);
      
      // 如果localStorage中找不到，从模拟数据中查找
      if (!this.currentHobby) {
        this.currentHobby = mockHobbies.find(hobby => hobby.id === this.hobbyId);
        console.log('从模拟数据中查找兴趣爱好');
      }
      
      // 如果仍然找不到，使用默认数据
      if (!this.currentHobby) {
        this.currentHobby = this.getMockHobby();
        console.log('找不到指定ID的兴趣爱好，使用默认数据');
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      // 出错时，先尝试从模拟数据中查找
      this.currentHobby = mockHobbies.find(hobby => hobby.id === this.hobbyId) || this.getMockHobby();
      showNotification('加载数据失败，使用模拟数据', 'warning');
    }
  }
  
  /**
   * 获取模拟的兴趣爱好数据
   * @returns {Object} 模拟的兴趣爱好对象
   */
  getMockHobby() {
    return {
      id: this.hobbyId || '1',
      name: '摄影',
      category: '艺术类',
      startDate: '2024-01-01',
      status: 'active',
      skillLevel: 4,
      longDescription: '这是一项令人着迷的兴趣爱好，通过镜头捕捉生活中的美好瞬间。摄影不仅能记录生活，还能培养观察能力和艺术审美。我喜欢在周末外出拍摄风景、人文和街景，享受按下快门的那一刻。',
      mainImage: '../assets/images/placeholder.svg',
      hours: 85,
      achievements: 12,
      photos: [
        {
          url: 'https://picsum.photos/seed/photo1/400/300',
          likes: 24,
          userLiked: false
        },
        {
          url: 'https://picsum.photos/seed/photo2/400/300',
          likes: 18,
          userLiked: true
        },
        {
          url: 'https://picsum.photos/seed/photo3/400/300',
          likes: 31,
          userLiked: false
        }
      ],
      timeline: [
        {
          date: '2024-05-15',
          content: '参加了城市摄影展，获得了最佳新人奖'
        },
        {
          date: '2024-04-20',
          content: '购买了新的镜头，开始尝试人像摄影'
        },
        {
          date: '2024-03-10',
          content: '完成了第一个摄影作品集《城市之光》'
        }
      ]
    };
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
      window.location.href = 'hobbies.html';
    });
    
    // 编辑按钮
    document.getElementById('edit-btn').addEventListener('click', () => {
      if (this.hobbyId) {
        window.location.href = `hobby-edit.html?id=${this.hobbyId}`;
      }
    });
    
    // 删除按钮
    document.getElementById('delete-btn').addEventListener('click', () => {
      this.confirmDelete();
    });
  }
  
  /**
   * 渲染详情页面
   */
  render() {
    if (!this.currentHobby) {
      return;
    }
    
    // 渲染基本信息
    this.renderBasicInfo();
    
    // 渲染统计数据
    this.renderStats();
    
    // 渲染照片库（支持点赞功能）
    this.renderPhotos();
    
    // 渲染时间轴
    this.renderTimeline();
  }
  
  /**
   * 渲染基本信息
   */
  renderBasicInfo() {
    const hobby = this.currentHobby;
    
    document.getElementById('hobby-title').textContent = hobby.name;
    document.getElementById('hobby-main-image').src = hobby.mainImage || `https://picsum.photos/seed/${hobby.id}/800/600`;
    document.getElementById('hobby-main-image').alt = hobby.name;
    document.getElementById('hobby-category').textContent = hobby.category;
    document.getElementById('hobby-start-date').textContent = new Date(hobby.startDate).toISOString().split('T')[0];
    document.getElementById('hobby-status').textContent = hobby.status === 'active' ? '活跃中' : '已暂停';
    document.getElementById('hobby-status').className = `status-badge ${hobby.status}`;
    document.getElementById('hobby-long-description').textContent = hobby.longDescription || '暂无详细描述';
    
    // 渲染评分星星
    const ratingStars = createRatingStars(hobby.skillLevel || 3);
    document.getElementById('hobby-rating').innerHTML = ratingStars.innerHTML;
    
    // 渲染详情部分的基本信息
    document.getElementById('detail-name').textContent = hobby.name;
    document.getElementById('detail-category').textContent = hobby.category;
    document.getElementById('detail-start-date').textContent = new Date(hobby.startDate).toISOString().split('T')[0];
    document.getElementById('detail-status').textContent = hobby.status === 'active' ? '活跃中' : '已暂停';
    document.getElementById('detail-skill-level').textContent = `${hobby.skillLevel || 3}/5`;
  }
  
  /**
   * 渲染统计数据
   */
  renderStats() {
    const hobby = this.currentHobby;
    
    // 计算持续天数
    const startDate = new Date(hobby.startDate);
    const today = new Date();
    const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    document.getElementById('detail-hours').textContent = `${hobby.hours || 0} 小时`;
    document.getElementById('detail-achievements').textContent = `${hobby.achievements || 0} 次`;
    document.getElementById('detail-days').textContent = `${days} 天`;
    document.getElementById('detail-last-activity').textContent = this.getLastActivity();
  }
  
  /**
   * 获取最近活动时间
   * @returns {string} 最近活动时间字符串
   */
  getLastActivity() {
    const timeline = this.currentHobby.timeline || [];
    if (timeline.length === 0) {
      return '暂无记录';
    }
    
    // 按日期排序，获取最新的
    const sortedTimeline = [...timeline].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    return new Date(sortedTimeline[0].date).toISOString().split('T')[0];
  }
  
  /**
   * 渲染照片库（支持点赞功能）
   */
  renderPhotos() {
    const photosGrid = document.getElementById('photos-grid');
    photosGrid.innerHTML = '';
    
    const photos = this.currentHobby.photos || [];
    
    if (photos.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = '暂无作品照片';
      emptyMessage.style.cssText = `
        grid-column: 1 / -1;
        text-align: center;
        padding: 40px 20px;
        color: #666;
      `;
      photosGrid.appendChild(emptyMessage);
      return;
    }
    
    photos.forEach((photo, index) => {
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';
      
      photoItem.innerHTML = `
        <img src="${photo.url || `https://picsum.photos/seed/${this.hobbyId}-${index}/300/200`}" alt="作品照片" class="photo-thumbnail">
        <span class="like-count">${photo.likes || 0}</span>
        <button class="photo-like ${photo.userLiked ? 'liked' : ''}" data-index="${index}">
          ❤️
        </button>
      `;
      
      photosGrid.appendChild(photoItem);
      
      // 添加点赞按钮事件
      const likeBtn = photoItem.querySelector('.photo-like');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        this.toggleLike(index);
      });
    });
  }
  
  /**
   * 切换照片点赞状态
   * @param {number} photoIndex - 照片索引
   */
  toggleLike(photoIndex) {
    if (!this.currentHobby.photos) {
      this.currentHobby.photos = [];
    }
    
    const photo = this.currentHobby.photos[photoIndex];
    if (!photo) return;
    
    // 切换点赞状态
    if (photo.userLiked) {
      // 取消点赞
      photo.likes = Math.max(0, (photo.likes || 1) - 1);
      photo.userLiked = false;
    } else {
      // 添加点赞
      photo.likes = (photo.likes || 0) + 1;
      photo.userLiked = true;
    }
    
    // 保存到localStorage（持久化）
    this.saveData();
    
    // 更新UI
    this.renderPhotos();
    
    showNotification(photo.userLiked ? '点赞成功！' : '已取消点赞', 'success');
  }
  
  /**
   * 渲染时间轴
   */
  renderTimeline() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    const timelineItems = this.currentHobby.timeline || [];
    
    if (timelineItems.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.textContent = '暂无时间轴记录';
      emptyMessage.style.cssText = `
        text-align: center;
        padding: 40px 20px;
        color: #666;
      `;
      timeline.appendChild(emptyMessage);
      return;
    }
    
    // 按日期排序，最新的在前
    const sortedTimeline = [...timelineItems].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    sortedTimeline.forEach(item => {
      const timelineItem = document.createElement('div');
      timelineItem.className = 'timeline-item';
      
      const formattedDate = new Date(item.date).toISOString().split('T')[0];
      
      timelineItem.innerHTML = `
        <div class="timeline-date">${formattedDate}</div>
        <div class="timeline-content">${item.content}</div>
      `;
      
      timeline.appendChild(timelineItem);
    });
  }
  
  /**
   * 确认删除
   */
  confirmDelete() {
    if (confirm('确定要删除这个兴趣爱好吗？此操作不可撤销。')) {
      this.deleteHobby();
    }
  }
  
  /**
   * 删除兴趣爱好
   */
  deleteHobby() {
    try {
      // 从数组中移除
      this.hobbies = this.hobbies.filter(hobby => hobby.id !== this.hobbyId);
      
      // 保存到localStorage
      this.saveData();
      
      showNotification('兴趣爱好已删除', 'success');
      
      // 跳转回列表页
      setTimeout(() => {
        window.location.href = 'hobbies.html';
      }, 1500);
    } catch (error) {
      console.error('删除失败:', error);
      showNotification('删除失败，请重试', 'error');
    }
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
  new HobbyDetailApp();
});