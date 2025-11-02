// 本地存储管理工具类
class StorageManager {
  // 存储数据到本地存储
  static setItem(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('存储数据失败:', error);
      return false;
    }
  }
  
  // 从本地存储获取数据
  static getItem(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('获取数据失败:', error);
      return null;
    }
  }
  
  // 从本地存储删除数据
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除数据失败:', error);
      return false;
    }
  }
  
  // 清空所有本地存储
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('清空存储失败:', error);
      return false;
    }
  }
  
  // 检查本地存储是否可用
  static isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // 获取所有存储的键
  static getAllKeys() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      return keys;
    } catch (error) {
      console.error('获取所有键失败:', error);
      return [];
    }
  }
  
  // 获取存储使用情况
  static getStorageInfo() {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalSize += key.length + value.length;
      }
      return {
        itemCount: localStorage.length,
        estimatedSize: totalSize,
        estimatedSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      console.error('获取存储信息失败:', error);
      return null;
    }
  }
}