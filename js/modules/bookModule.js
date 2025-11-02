// 读书模块管理类
import StorageManager from '../utils/storage.js';

class BookModule {
  constructor() {
    this.books = [];
    this.loadBooks();
  }

  /**
   * 从localStorage加载书籍数据
   * @returns {Array} 书籍数据数组
   */
  loadBooks() {
    try {
      this.books = StorageManager.getItem('books', []);
      return this.books;
    } catch (error) {
      console.error('加载书籍数据失败:', error);
      return [];
    }
  }

  /**
   * 保存书籍数据到localStorage
   * @returns {boolean} 保存是否成功
   */
  saveBooks() {
    try {
      StorageManager.setItem('books', this.books);
      return true;
    } catch (error) {
      console.error('保存书籍数据失败:', error);
      return false;
    }
  }

  /**
   * 获取所有书籍
   * @returns {Array} 书籍数据数组
   */
  getAllBooks() {
    return this.books;
  }

  /**
   * 根据ID获取书籍
   * @param {string} bookId 书籍ID
   * @returns {Object|null} 书籍对象或null
   */
  getBookById(bookId) {
    return this.books.find(book => book.id === bookId) || null;
  }

  /**
   * 添加新书籍
   * @param {Object} book 书籍对象
   * @returns {Object} 添加的书籍对象
   */
  addBook(book) {
    const newBook = {
      id: Date.now().toString(),
      title: book.title,
      author: book.author,
      rating: book.rating || 0,
      readDate: book.readDate,
      status: book.status || 'reading',
      cover: book.cover || '',
      summary: book.summary || '',
      notes: []
    };
    
    this.books.push(newBook);
    this.saveBooks();
    return newBook;
  }

  /**
   * 更新书籍信息
   * @param {string} bookId 书籍ID
   * @param {Object} updates 更新的字段
   * @returns {Object|null} 更新后的书籍对象或null
   */
  updateBook(bookId, updates) {
    const bookIndex = this.books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) return null;
    
    // 不允许修改ID和笔记数组
    const { id, notes, ...safeUpdates } = updates;
    
    this.books[bookIndex] = { ...this.books[bookIndex], ...safeUpdates };
    this.saveBooks();
    return this.books[bookIndex];
  }

  /**
   * 删除书籍
   * @param {string} bookId 书籍ID
   * @returns {boolean} 删除是否成功
   */
  deleteBook(bookId) {
    const initialLength = this.books.length;
    this.books = this.books.filter(book => book.id !== bookId);
    const success = this.books.length !== initialLength;
    
    if (success) {
      this.saveBooks();
    }
    
    return success;
  }

  /**
   * 添加笔记到书籍
   * @param {string} bookId 书籍ID
   * @param {string} content 笔记内容
   * @returns {Object|null} 添加的笔记对象或null
   */
  addNote(bookId, content) {
    const book = this.getBookById(bookId);
    if (!book) return null;
    
    const newNote = {
      id: Date.now().toString(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    
    book.notes.push(newNote);
    this.saveBooks();
    return newNote;
  }

  /**
   * 更新笔记内容
   * @param {string} bookId 书籍ID
   * @param {string} noteId 笔记ID
   * @param {string} content 新的笔记内容
   * @returns {Object|null} 更新后的笔记对象或null
   */
  updateNote(bookId, noteId, content) {
    const book = this.getBookById(bookId);
    if (!book) return null;
    
    const note = book.notes.find(note => note.id === noteId);
    if (!note) return null;
    
    note.content = content.trim();
    this.saveBooks();
    return note;
  }

  /**
   * 删除笔记
   * @param {string} bookId 书籍ID
   * @param {string} noteId 笔记ID
   * @returns {boolean} 删除是否成功
   */
  deleteNote(bookId, noteId) {
    const book = this.getBookById(bookId);
    if (!book) return false;
    
    const initialLength = book.notes.length;
    book.notes = book.notes.filter(note => note.id !== noteId);
    const success = book.notes.length !== initialLength;
    
    if (success) {
      this.saveBooks();
    }
    
    return success;
  }

  /**
   * 获取书籍的所有笔记
   * @param {string} bookId 书籍ID
   * @returns {Array} 笔记数组
   */
  getBookNotes(bookId) {
    const book = this.getBookById(bookId);
    return book ? book.notes : [];
  }
}

// 导出模块实例
export const bookModule = new BookModule();