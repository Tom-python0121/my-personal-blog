/**
 * 数据存储管理模块
 * 使用localStorage存储所有用户数据
 */
const StorageManager = {
  // 存储键名常量
  KEYS: {
    TRIPS: 'personal_growth_trips',
    PHOTOS: 'personal_growth_photos',
    BOOKS: 'personal_growth_books',
    HOBBIES: 'personal_growth_hobbies',
    PETS: 'personal_growth_pets',
    USER_INFO: 'personal_growth_user_info',
    VIEW_PREFERENCE: 'personal_growth_view_preference'
  },
  
  /**
   * 从localStorage获取数据
   * @param {string} key - 存储键名
   * @param {any} defaultValue - 默认值，当获取不到数据时返回
   * @returns {any} 解析后的数据或默认值
   */
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`获取数据失败 [${key}]:`, error);
      return defaultValue;
    }
  },
  
  /**
   * 保存数据到localStorage
   * @param {string} key - 存储键名
   * @param {any} value - 要存储的数据
   * @returns {boolean} 是否保存成功
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`保存数据失败 [${key}]:`, error);
      return false;
    }
  },
  
  /**
   * 删除指定键的数据
   * @param {string} key - 要删除的键名
   * @returns {boolean} 是否删除成功
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`删除数据失败 [${key}]:`, error);
      return false;
    }
  },
  
  /**
   * 导出所有数据
   * @returns {string} JSON格式的所有数据
   */
  exportAllData() {
    try {
      const allData = {};
      
      // 遍历所有存储键，获取相应数据
      Object.values(this.KEYS).forEach(key => {
        const data = this.getItem(key);
        if (data !== null) {
          allData[key] = data;
        }
      });
      
      return JSON.stringify(allData, null, 2);
    } catch (error) {
      console.error('导出数据失败:', error);
      throw new Error('导出数据失败，请重试');
    }
  },

  /**
   * 导入数据
   * @param {string} jsonData - JSON格式的数据字符串
   * @returns {boolean} 是否导入成功
   */
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      
      // 验证数据格式是否正确
      if (typeof data !== 'object' || data === null) {
        throw new Error('无效的数据格式');
      }
      
      // 保存导入的数据
      Object.entries(data).forEach(([key, value]) => {
        this.setItem(key, value);
      });
      
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      throw new Error('导入数据失败，请检查数据格式');
    }
  }
};

// 导出模块
export default StorageManager;
export const storage = StorageManager;