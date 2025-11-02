// 读书模块主文件
// 负责书籍列表展示、笔记管理、搜索过滤等核心功能

import { initializeMockData } from '../utils/mockDataGenerator.js';
import { createRatingStars, formatDate, showNotification, createLoader } from '../utils/uiComponents.js';
import router from '../modules/router.js';
import StorageManager from '../utils/storage.js';

/**
 * 读书应用主类
 */
class ReadingApp {
  constructor() {
    // 应用状态
    this.books = [];
    this.notes = {};
    this.currentBook = null;
    this.searchQuery = '';
    
    // DOM元素引用
    this.appContainer = null;
    this.booksList = null;
    this.searchInput = null;
    
    // 初始化应用
    this.init();
  }

  /**
   * 初始化应用
   */
  async init() {
    // 初始化应用容器
    this.appContainer = document.getElementById('reading-app');
    if (!this.appContainer) {
      console.error('找不到应用容器');
      return;
    }
    
    // 确保模拟数据已初始化
    initializeMockData();
    
    // 加载数据
    this.loadData();
    
    // 设置简单的导航系统
    this.setupNavigation();
    
    // 初始渲染
    this.renderLibrary();
  }

  /**
   * 从localStorage加载数据
   */
  loadData() {
    try {
      this.books = StorageManager.getItem('books', []);
      this.notes = StorageManager.getItem('notes', {});
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
      StorageManager.setItem('books', this.books);
      StorageManager.setItem('notes', this.notes);
    } catch (error) {
      console.error('保存数据失败:', error);
      showNotification('保存数据失败', 'error');
    }
  }

  /**
   * 设置导航处理
   * 使用简单的页面导航替代复杂的路由系统
   */
  setupNavigation() {
    // 监听URL变化（通过hashchange事件）
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
  }
  
  /**
   * 处理URL hash变化
   */
  handleHashChange() {
    const hash = window.location.hash;
    
    // 检查是否是书籍详情页面
    const match = hash.match(/^#\/book\/(\d+)$/);
    if (match && match[1]) {
      this.renderBookDetail(match[1]);
    } else {
      // 其他情况都渲染书籍列表
      this.renderLibrary();
    }
  }
  
  /**
   * 导航到指定页面
   * @param {string} path 导航路径
   */
  navigate(path) {
    window.location.hash = path;
  }

  /**
   * 主渲染函数
   * 这个方法现在主要用于重新渲染
   */
  render() {
    if (!this.appContainer) {
      this.appContainer = document.getElementById('reading-app');
      if (!this.appContainer) {
        console.error('找不到应用容器');
        return;
      }
    }
  }

  /**
   * 渲染书籍列表页面
   */
  renderLibrary() {
    this.appContainer.innerHTML = `
      <div class="reading-library">
        <div class="page-header">
          <h1>我的书架</h1>
        </div>
        
        <div class="search-bar">
          <input 
            type="text" 
            class="search-input" 
            placeholder="搜索书籍..."
            id="book-search"
          >
          <button class="btn btn-primary" id="add-book-btn">
            <i class="fas fa-plus"></i> 添加书籍
          </button>
        </div>
        
        <div id="books-list" class="books-list">
          ${this.renderBooksList()}
        </div>
      </div>
    `;
    
    // 绑定事件
    this.bindLibraryEvents();
  }

  /**
   * 渲染书籍列表内容
   * @returns {string} HTML字符串
   */
  renderBooksList() {
    // 过滤书籍
    const filteredBooks = this.filterBooks();
    
    if (filteredBooks.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fas fa-book"></i></div>
          <h3 class="empty-state-title">暂无书籍</h3>
          <p>添加您的第一本书吧</p>
        </div>
      `;
    }
    
    // 按阅读日期倒序排序
    const sortedBooks = [...filteredBooks].sort((a, b) => {
      const dateA = a.readDate ? new Date(a.readDate) : new Date(0);
      const dateB = b.readDate ? new Date(b.readDate) : new Date(0);
      return dateB - dateA;
    });
    
    // 渲染表格
    return `
      <table class="books-table">
        <thead>
          <tr>
            <th>封面</th>
            <th>书名</th>
            <th>作者</th>
            <th>评分</th>
            <th>阅读日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${sortedBooks.map(book => this.renderBookRow(book)).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * 渲染单行书籍信息
   * @param {Object} book 书籍对象
   * @returns {string} HTML字符串
   */

  
  /**
   * 生成基于书名的颜色封面
   * @param {string} title 书籍标题
   * @returns {Object} 包含背景色、文字颜色和首字母的对象
   */
  generateColorCover(title) {
    // 预定义的颜色数组
    const colors = [
      { bg: '#FF6B6B', text: '#FFFFFF' }, // 红色系
      { bg: '#4ECDC4', text: '#FFFFFF' }, // 青色系
      { bg: '#45B7D1', text: '#FFFFFF' }, // 蓝色系
      { bg: '#96CEB4', text: '#FFFFFF' }, // 绿色系
      { bg: '#FFEAA7', text: '#2C3E50' }, // 黄色系
      { bg: '#DDA0DD', text: '#FFFFFF' }, // 紫色系
      { bg: '#98D8C8', text: '#2C3E50' }, // 薄荷绿
      { bg: '#F7DC6F', text: '#2C3E50' }, // 金黄色
      { bg: '#BB8FCE', text: '#FFFFFF' }, // 薰衣草紫
      { bg: '#52C41A', text: '#FFFFFF' }  // 翠绿色
    ];
    
    // 基于书名生成哈希值
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    
    // 使用哈希值选择颜色
    const colorIndex = Math.abs(hash) % colors.length;
    const selectedColor = colors[colorIndex];
    
    // 获取书名的首字母作为封面显示
    const initial = title.charAt(0).toUpperCase();
    
    return {
      backgroundColor: selectedColor.bg,
      textColor: selectedColor.text,
      initial: initial
    };
  }
  
  /**
   * 渲染单行书籍信息
   * @param {Object} book 书籍对象
   * @returns {string} HTML字符串
   */
  renderBookRow(book) {
    const statusClass = book.status === 'finished' ? 'finished' : 
                       book.status === 'reading' ? 'reading' : 'planned';
    
    const statusText = book.status === 'finished' ? '已读' : 
                      book.status === 'reading' ? '阅读中' : '计划读';
    
    // 获取笔记数量
    const notesCount = this.notes[book.id] ? this.notes[book.id].length : 0;
    
    // 生成基于书名的颜色封面
    const { backgroundColor, textColor, initial } = this.generateColorCover(book.title);
    const coverStyle = `background-color: ${backgroundColor}; color: ${textColor}; display: flex; justify-content: center; align-items: center; font-size: 24px; font-weight: bold;`;
    
    // 自定义创建评分星星的函数，确保是黄色星星
    const renderStars = (rating) => {
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
          starsHtml += '<i class="fas fa-star" style="color: #ffc107;"></i>';
        } else if (i < rating) {
          starsHtml += '<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>';
        } else {
          starsHtml += '<i class="far fa-star" style="color: #ffc107;"></i>';
        }
      }
      return starsHtml;
    };
    
    // 状态标签样式
    const statusBadgeStyle = book.status === 'finished' 
      ? 'background-color: #52c41a; color: white; padding: 2px 6px; font-size: 12px; border-radius: 4px; display: inline-block; margin-right: 8px;'
      : 'background-color: #1890ff; color: white; padding: 2px 6px; font-size: 12px; border-radius: 4px; display: inline-block; margin-right: 8px;';
    
    return `
      <tr class="book-row fade-in" data-id="${book.id}">
        <td style="padding: 12px; vertical-align: top;">
          <div class="book-cover-small" style="${coverStyle}; width: 60px; height: 90px; border-radius: 4px;">${initial}</div>
        </td>
        <td style="padding: 12px;">
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <span style="${statusBadgeStyle}">${statusText}</span>
            <h3 class="book-title" style="margin: 0; cursor: pointer; color: #333; font-size: 16px; font-weight: 600;">${book.title}</h3>
          </div>
          ${book.summary ? `<p style="margin: 5px 0 8px 0; font-size: 14px; color: #666; line-height: 1.4;">${book.summary}</p>` : ''}
          <small style="color: #999; font-size: 12px;">${notesCount}条笔记</small>
        </td>
        <td style="padding: 12px; vertical-align: top;">${book.author}</td>
        <td style="padding: 12px; vertical-align: top;">
          ${book.rating ? `${renderStars(book.rating)} <span style="font-size: 14px; color: #666; margin-left: 5px;">${book.rating}</span>` : ''}
        </td>
        <td style="padding: 12px; vertical-align: top;">${book.readDate ? formatDate(book.readDate) : ''}</td>
        <td style="padding: 12px; vertical-align: top;">
          <button class="view-book" style="background: none; border: none; color: #007bff; cursor: pointer; padding: 5px;">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>
    `;
  }

  /**
   * 根据搜索条件过滤书籍
   * @returns {Array} 过滤后的书籍数组
   */
  filterBooks() {
    if (!this.searchQuery) return this.books;
    
    const query = this.searchQuery.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query) ||
      (book.summary && book.summary.toLowerCase().includes(query))
    );
  }

  /**
   * 渲染书籍详情页面
   * @param {string} bookId 书籍ID
   */
  renderBookDetail(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (!book) {
      this.appContainer.innerHTML = `
        <div class="empty-state">
          <p>书籍不存在</p>
          <button class="btn btn-secondary mt-2" id="back-to-library">返回书架</button>
        </div>
      `;
      document.getElementById('back-to-library').addEventListener('click', () => {
        this.navigate('#/reading');
      });
      return;
    }
    
    this.currentBook = book;
    const bookNotes = this.notes[bookId] || [];
    
    const statusClass = book.status === 'finished' ? 'finished' : 
                       book.status === 'reading' ? 'reading' : 'planned';
    
    const statusText = book.status === 'finished' ? '已读' : 
                      book.status === 'reading' ? '阅读中' : '计划读';
    
    // 使用书籍标题生成唯一的封面图片
    const generateImageSeed = (title) => {
      let hash = 0;
      for (let i = 0; i < title.length; i++) {
        const char = title.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为32位整数
      }
      return Math.abs(hash);
    };
    
    const { backgroundColor, textColor, initial } = this.generateColorCover(book.title);
    const coverStyle = `background-color: ${backgroundColor}; color: ${textColor}; display: flex; justify-content: center; align-items: center; font-size: 48px; font-weight: bold; width: 200px; height: 300px; border-radius: 4px;`;
    
    // 自定义创建评分星星的函数，确保是黄色星星
    const renderStars = (rating) => {
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
          starsHtml += '<i class="fas fa-star" style="color: #ffc107;"></i>';
        } else if (i < rating) {
          starsHtml += '<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>';
        } else {
          starsHtml += '<i class="far fa-star" style="color: #ffc107;"></i>';
        }
      }
      return starsHtml;
    };
    
    this.appContainer.innerHTML = `
      <div class="book-detail">
        <div class="detail-header">
          <div class="header-content">
            <a href="../index.html" class="personal-space-link">个人空间</a>
            <h1>读书书架</h1>
            <div class="empty-space"></div>
          </div>
        </div>
        
        <div class="book-detail-container">
          <div class="book-info-section">
            <div class="book-cover-container">
              <div class="book-cover-large" style="${coverStyle}">${initial}</div>
            </div>
            
            <div class="book-details">
              <h2 class="book-title-large">${book.title}</h2>
              <div class="author-info">
                <span>作者：${book.author}</span>
              </div>
              
              <div class="book-meta">
                <div class="meta-item">
                  <span class="status-badge" style="background-color: ${book.status === 'finished' ? '#52c41a' : '#1890ff'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 14px;">
                    ${statusText}
                  </span>
                </div>
                
                <div class="meta-item">
                  <div class="rating-section">
                    ${book.rating ? `${renderStars(book.rating)} <span style="font-size: 14px; margin-left: 8px;">${book.rating}</span>` : '未评分'}
                  </div>
                </div>
              </div>
              
              <div class="book-summary-section">
                <h3>内容简介</h3>
                <p class="book-summary">${book.summary || '暂无内容简介'}</p>
              </div>
              
              <button class="btn btn-primary" id="back-btn" style="margin-top: 20px;">
                <i class="fas fa-arrow-left"></i> 返回书架
              </button>
            </div>
          </div>
          
          <div class="notes-section">
            <div class="notes-header">
              <h2>读书笔记</h2>
              <button class="btn btn-secondary" id="export-notes">
                导出笔记
              </button>
            </div>
            
            <div class="note-input-area">
              <textarea 
                class="note-input" 
                id="new-note" 
                placeholder="添加您的读书笔记..."
                style="width: 100%; height: 100px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
              ></textarea>
              <div class="note-input-footer">
                <button class="btn btn-primary" id="add-note-btn" style="margin-top: 10px;">
                  添加笔记
                </button>
              </div>
            </div>
            
            <div id="notes-list" class="notes-list">
              ${bookNotes.length === 0 ? this.renderEmptyNotes() : this.renderNotesList(bookNotes)}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // 绑定详情页事件
    this.bindDetailEvents();
  }

  /**
   * 渲染空笔记状态
   * @returns {string} HTML字符串
   */
  renderEmptyNotes() {
    return `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fas fa-sticky-note"></i></div>
        <h3 class="empty-state-title">暂无笔记</h3>
        <p>开始记录您的读书笔记吧</p>
      </div>
    `;
  }

  /**
   * 渲染笔记列表
   * @param {Array} notes 笔记数组
   * @returns {string} HTML字符串
   */
  renderNotesList(notes) {
    // 按日期倒序排序
    const sortedNotes = [...notes].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    return sortedNotes.map(note => this.renderNoteItem(note)).join('');
  }

  /**
   * 渲染单个笔记项
   * @param {Object} note 笔记对象
   * @returns {string} HTML字符串
   */
  renderNoteItem(note) {
    return `
      <div class="note-item fade-in" data-id="${note.id}">
        <div class="note-header">
          <span class="note-date">${formatDate(note.date)}</span>
          <div class="note-actions">
            <button class="btn btn-sm btn-secondary edit-note">
              <i class="fas fa-edit"></i> 编辑
            </button>
            <button class="btn btn-sm btn-danger delete-note">
              <i class="fas fa-trash"></i> 删除
            </button>
          </div>
        </div>
        <div class="note-content">${note.content}</div>
      </div>
    `;
  }

  /**
   * 绑定书架页面事件
   */
  bindLibraryEvents() {
    // 搜索事件
    this.searchInput = document.getElementById('book-search');
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.updateBooksList();
      });
    }
    
    // 绑定表格事件
    this.bindTableEvents();
    
    // 添加书籍
    const addBookBtn = document.getElementById('add-book-btn');
    if (addBookBtn) {
      addBookBtn.addEventListener('click', () => {
        this.addBook();
      });
    }
  }

  /**
   * 绑定详情页事件
   */
  bindDetailEvents() {
    // 返回书架
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        router.navigate('/reading');
      });
    }
    
    // 添加笔记
    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => {
        this.addNote();
      });
    }
    
    // 编辑笔记
    document.querySelectorAll('.edit-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const noteItem = e.target.closest('.note-item');
        const noteId = noteItem.dataset.id;
        this.editNote(noteId);
      });
    });
    
    // 删除笔记
    document.querySelectorAll('.delete-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const noteItem = e.target.closest('.note-item');
        const noteId = noteItem.dataset.id;
        this.deleteNote(noteId);
      });
    });
    
    // 导出笔记
    const exportBtn = document.getElementById('export-notes');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportNotes();
      });
    }
  }

  /**
   * 更新书籍列表
   */
  updateBooksList() {
    const booksList = document.getElementById('books-list');
    if (booksList) {
      booksList.innerHTML = this.renderBooksList();
      // 移除重新绑定所有事件，避免搜索事件重复绑定导致的无限循环
      // 只绑定表格中需要的交互事件，不重新绑定搜索框事件
      this.bindTableEvents();
    }
  }

  /**
   * 绑定表格行交互事件
   * 用于更新列表后只绑定表格相关事件，避免重复绑定搜索事件
   */
  bindTableEvents() {
    // 查看书籍详情
    document.querySelectorAll('.view-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookId = e.target.closest('.book-row').dataset.id;
        this.navigate(`#/book/${bookId}`);
      });
    });
    
    // 点击书名也能查看详情
    document.querySelectorAll('.book-title').forEach(title => {
      title.addEventListener('click', (e) => {
        const bookId = e.target.closest('.book-row').dataset.id;
        this.navigate(`#/book/${bookId}`);
      });
    });
    
    // 编辑书籍
    document.querySelectorAll('.edit-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡
        const bookId = e.target.closest('.book-row').dataset.id;
        this.editBook(bookId);
      });
    });
    
    // 删除书籍
    document.querySelectorAll('.delete-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // 阻止冒泡
        const bookId = e.target.closest('.book-row').dataset.id;
        this.deleteBook(bookId);
      });
    });
  }

  /**
   * 更新笔记列表
   */
  updateNotesList() {
    const notesList = document.getElementById('notes-list');
    if (notesList && this.currentBook) {
      const bookNotes = this.notes[this.currentBook.id] || [];
      notesList.innerHTML = bookNotes.length === 0 ? this.renderEmptyNotes() : this.renderNotesList(bookNotes);
      this.bindDetailEvents(); // 重新绑定事件
    }
  }

  /**
   * 添加新笔记
   */
  addNote() {
    if (!this.currentBook) return;
    
    const noteInput = document.getElementById('new-note');
    if (!noteInput) return;
    
    const content = noteInput.value.trim();
    if (!content) {
      showNotification('请输入笔记内容', 'info');
      return;
    }
    
    const newNote = {
      id: Date.now().toString(),
      content: content,
      date: new Date().toISOString()
    };
    
    // 确保该书籍的笔记数组存在
    if (!this.notes[this.currentBook.id]) {
      this.notes[this.currentBook.id] = [];
    }
    
    // 添加笔记
    this.notes[this.currentBook.id].push(newNote);
    
    // 保存数据
    this.saveData();
    
    // 清空输入框
    noteInput.value = '';
    
    // 更新UI
    this.updateNotesList();
    
    // 显示通知
    showNotification('笔记添加成功', 'success');
  }

  /**
   * 编辑笔记
   * @param {string} noteId 笔记ID
   */
  editNote(noteId) {
    if (!this.currentBook || !this.notes[this.currentBook.id]) return;
    
    const noteIndex = this.notes[this.currentBook.id].findIndex(n => n.id === noteId);
    if (noteIndex === -1) return;
    
    const note = this.notes[this.currentBook.id][noteIndex];
    const newContent = prompt('编辑笔记:', note.content);
    
    if (newContent !== null) {
      const trimmedContent = newContent.trim();
      if (trimmedContent) {
        // 更新笔记
        note.content = trimmedContent;
        note.date = new Date().toISOString(); // 更新日期
        
        // 保存数据
        this.saveData();
        
        // 更新UI
        this.updateNotesList();
        
        // 显示通知
        showNotification('笔记更新成功', 'success');
      } else {
        showNotification('笔记内容不能为空', 'info');
      }
    }
  }

  /**
   * 删除笔记
   * @param {string} noteId 笔记ID
   */
  deleteNote(noteId) {
    if (!this.currentBook || !this.notes[this.currentBook.id]) return;
    
    if (confirm('确定要删除这条笔记吗？')) {
      // 过滤掉要删除的笔记
      this.notes[this.currentBook.id] = this.notes[this.currentBook.id].filter(
        note => note.id !== noteId
      );
      
      // 保存数据
      this.saveData();
      
      // 更新UI
      this.updateNotesList();
      
      // 显示通知
      showNotification('笔记删除成功', 'success');
    }
  }

  /**
   * 添加书籍
   * 功能：通过自定义表单收集书籍信息并添加到书架
   * 使用基于书名的哈希值生成唯一封面图片
   */
  addBook() {
    // 创建添加书籍的表单弹窗
    const createAddBookForm = () => {
      const formHtml = `
        <div id="add-book-modal" style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        ">
          <div style="
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          ">
            <h2 style="margin-top: 0; margin-bottom: 20px; color: #333;">添加书籍</h2>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">书籍名称 *</label>
              <input type="text" id="book-title" placeholder="请输入书籍名称" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
              ">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">作者名称</label>
              <input type="text" id="book-author" placeholder="请输入作者名称" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
              ">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">书籍简介</label>
              <textarea id="book-summary" rows="4" placeholder="请输入书籍简介" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
                resize: vertical;
              "></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">评分 (1-5)</label>
              <input type="number" id="book-rating" min="0" max="5" step="0.1" value="0" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
              ">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: 500;">阅读状态</label>
              <select id="book-status" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 16px;
              ">
                <option value="planned">计划读</option>
                <option value="reading">阅读中</option>
                <option value="finished">已读</option>
              </select>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button id="cancel-add-book" class="btn btn-secondary" style="padding: 10px 20px;">
                取消
              </button>
              <button id="confirm-add-book" class="btn btn-primary" style="padding: 10px 20px;">
                添加
              </button>
            </div>
          </div>
        </div>
      `;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formHtml;
      document.body.appendChild(tempDiv.firstElementChild);
    };
    
    // 由于使用颜色封面，不再需要外部图片生成函数
    
    // 创建并显示表单
    createAddBookForm();
    
    // 绑定事件处理
    const modal = document.getElementById('add-book-modal');
    const cancelBtn = document.getElementById('cancel-add-book');
    const confirmBtn = document.getElementById('confirm-add-book');
    
    // 取消按钮事件
    cancelBtn.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // 确认添加事件
    confirmBtn.addEventListener('click', () => {
      const titleInput = document.getElementById('book-title');
      const title = titleInput.value.trim();
      
      // 验证书名不能为空
      if (!title) {
        showNotification('请输入书籍名称', 'info');
        titleInput.focus();
        return;
      }
      
      // 获取表单数据
      const author = document.getElementById('book-author').value.trim() || '未知作者';
      const summary = document.getElementById('book-summary').value.trim();
      let rating = parseFloat(document.getElementById('book-rating').value);
      rating = isNaN(rating) ? 0 : Math.min(Math.max(rating, 0), 5);
      const status = document.getElementById('book-status').value;
      const readDate = status === 'finished' ? new Date().toISOString() : null;
      
      // 创建新书籍对象
      // 封面将在渲染时通过 generateColorCover 方法动态生成
      const newBook = {
        id: Date.now().toString(),
        title: title,
        author: author,
        status: status,
        rating: rating,
        readDate: readDate,
        summary: summary
      };
      
      // 添加书籍
      this.books.push(newBook);
      
      // 保存数据
      this.saveData();
      
      // 更新UI
      this.updateBooksList();
      
      // 移除模态框
      document.body.removeChild(modal);
      
      // 显示通知
      showNotification('书籍添加成功', 'success');
    });
    
    // 点击模态框外部关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }

  /**
   * 编辑书籍
   * @param {string} bookId 书籍ID
   */
  editBook(bookId) {
    const bookIndex = this.books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;
    
    const book = this.books[bookIndex];
    
    // 简化版编辑
    const newTitle = prompt('编辑书籍名称:', book.title);
    if (newTitle !== null && newTitle.trim()) {
      book.title = newTitle.trim();
      
      const newAuthor = prompt('编辑作者名称:', book.author);
      if (newAuthor !== null) {
        book.author = newAuthor.trim() || '未知作者';
      }
      
      // 保存数据
      this.saveData();
      
      // 更新UI
      this.updateBooksList();
      
      // 显示通知
      showNotification('书籍更新成功', 'success');
    }
  }

  /**
   * 删除书籍
   * @param {string} bookId 书籍ID
   */
  deleteBook(bookId) {
    if (confirm('确定要删除这本书籍吗？相关的笔记也会被删除。')) {
      // 删除书籍
      this.books = this.books.filter(book => book.id !== bookId);
      
      // 删除相关笔记
      delete this.notes[bookId];
      
      // 保存数据
      this.saveData();
      
      // 更新UI
      this.updateBooksList();
      
      // 显示通知
      showNotification('书籍删除成功', 'success');
    }
  }

  /**
   * 导出笔记
   */
  exportNotes() {
    if (!this.currentBook) return;
    
    const bookNotes = this.notes[this.currentBook.id] || [];
    if (bookNotes.length === 0) {
      showNotification('没有可导出的笔记', 'info');
      return;
    }
    
    // 生成Markdown格式的笔记内容
    let markdownContent = `# ${this.currentBook.title}\n\n`;
    markdownContent += `作者：${this.currentBook.author}\n\n`;
    markdownContent += `## 读书笔记\n\n`;
    
    bookNotes.forEach(note => {
      markdownContent += `### ${formatDate(note.date)}\n`;
      markdownContent += `${note.content}\n\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentBook.title}_笔记.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // 显示通知
    showNotification('笔记导出成功', 'success');
  }
}

// 导出应用实例
export const readingApp = new ReadingApp();