/**
 * 宠物页面主入口 - 初始化宠物页面应用
 */

// 导入宠物应用类
import PetsApp from './petsApp.js';

/**
 * 页面加载完成后初始化应用
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 创建PetsApp实例
        const petsApp = new PetsApp();
        
        // 初始化应用
        petsApp.init();
        
        console.log('宠物页面初始化成功');
    } catch (error) {
        console.error('宠物页面初始化失败:', error);
        alert('页面加载出错，请刷新重试');
    }
});