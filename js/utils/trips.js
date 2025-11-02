/**
 * 旅程相关工具类
 * 提供旅程数据的增删改查和中国省份数据
 */

// 导入存储管理模块
import StorageManager from './storage.js';
const storage = StorageManager;

/**
 * 中国省级行政区数据
 * 包含所有省份、自治区、直辖市和特别行政区的名称
 */
const CHINA_PROVINCES = [
    // 直辖市
    '北京市', '天津市', '上海市', '重庆市',
    // 省份
    '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省',
    '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省',
    '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省',
    '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
    // 自治区
    '内蒙古自治区', '广西壮族自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
    // 特别行政区
    '香港特别行政区', '澳门特别行政区'
];

/**
 * 旅程数据操作类
 */
export class TripService {
    /**
     * 获取所有旅程数据
     * @returns {Array} 旅程数据数组
     */
    static getAllTrips() {
        try {
            const trips = storage.getItem(storage.KEYS.TRIPS);
            return trips || [];
        } catch (error) {
            console.error('获取旅程数据失败:', error);
            return [];
        }
    }

    /**
     * 根据省份名称获取单个旅程数据
     * @param {string} provinceName - 省份名称
     * @returns {Object|null} 旅程数据对象或null
     */
    static getTripByProvince(provinceName) {
        try {
            const trips = this.getAllTrips();
            const targetProvinceId = ProvinceService.generateProvinceId(provinceName);
            
            // 使用标准化的省份ID进行比较
            return trips.find(trip => {
                const tripProvinceId = ProvinceService.generateProvinceId(trip.province);
                return tripProvinceId === targetProvinceId;
            }) || null;
        } catch (error) {
            console.error('获取旅程数据失败:', error);
            return null;
        }
    }

    /**
     * 添加或更新旅程数据
     * @param {Object} tripData - 旅程数据对象
     * @param {string} tripData.province - 省份名称
     * @param {string} tripData.startDate - 开始日期
     * @param {string} tripData.endDate - 结束日期
     * @param {string} tripData.travelers - 同行人
     * @param {number} tripData.rating - 喜欢程度（1-5星）
     * @param {string} tripData.notes - 旅行感想
     * @param {Array} tripData.photos - 照片URL数组
     * @returns {boolean} 是否成功
     */
    static saveTrip(tripData) {
        try {
            // 验证必要字段
            if (!tripData.province) {
                console.error('省份名称不能为空');
                return false;
            }

            // 确保数据完整性
            const trip = {
                province: tripData.province,
                startDate: tripData.startDate || '',
                endDate: tripData.endDate || '',
                travelers: tripData.travelers || '',
                rating: tripData.rating || 0,
                notes: tripData.notes || '',
                photos: tripData.photos || [],
                updatedAt: new Date().toISOString()
            };

            // 获取现有旅程数据
            const trips = this.getAllTrips();
            const targetProvinceId = ProvinceService.generateProvinceId(trip.province);
            
            // 使用标准化的省份ID查找现有旅程
            const existingIndex = trips.findIndex(t => {
                const tripProvinceId = ProvinceService.generateProvinceId(t.province);
                return tripProvinceId === targetProvinceId;
            });

            // 更新或添加数据
            if (existingIndex >= 0) {
                trips[existingIndex] = trip;
            } else {
                trips.push(trip);
            }

            // 保存到localStorage
            storage.setItem(storage.KEYS.TRIPS, trips);
            return true;
        } catch (error) {
            console.error('保存旅程数据失败:', error);
            return false;
        }
    }

    /**
     * 删除旅程数据
     * @param {string} provinceName - 省份名称
     * @returns {boolean} 是否成功
     */
    static deleteTrip(provinceName) {
        try {
            const trips = this.getAllTrips();
            const targetProvinceId = ProvinceService.generateProvinceId(provinceName);
            
            // 使用标准化的省份ID过滤
            const filteredTrips = trips.filter(trip => {
                const tripProvinceId = ProvinceService.generateProvinceId(trip.province);
                return tripProvinceId !== targetProvinceId;
            });
            
            if (filteredTrips.length === trips.length) {
                console.error('未找到该省份的旅程数据');
                return false;
            }

            storage.setItem(storage.KEYS.TRIPS, filteredTrips);
            return true;
        } catch (error) {
            console.error('删除旅程数据失败:', error);
            return false;
        }
    }

    /**
     * 获取已旅行过的省份列表
     * @returns {Array} 已旅行省份名称数组
     */
    static getVisitedProvinces() {
        try {
            const trips = this.getAllTrips();
            return trips.map(trip => trip.province);
        } catch (error) {
            console.error('获取已访问省份列表失败:', error);
            return [];
        }
    }

    /**
     * 添加照片到旅程
     * @param {string} provinceName - 省份名称
     * @param {string} photoUrl - 照片URL
     * @returns {boolean} 是否成功
     */
    static addPhoto(provinceName, photoUrl) {
        try {
            const trip = this.getTripByProvince(provinceName);
            if (!trip) {
                console.error('未找到该省份的旅程数据');
                return false;
            }

            // 确保photos数组存在
            if (!Array.isArray(trip.photos)) {
                trip.photos = [];
            }

            // 添加新照片
            trip.photos.push(photoUrl);
            
            // 保存更新后的旅程数据
            return this.saveTrip(trip);
        } catch (error) {
            console.error('添加照片失败:', error);
            return false;
        }
    }

    /**
     * 从旅程中删除照片
     * @param {string} provinceName - 省份名称
     * @param {number} photoIndex - 照片索引
     * @returns {boolean} 是否成功
     */
    static removePhoto(provinceName, photoIndex) {
        try {
            const trip = this.getTripByProvince(provinceName);
            if (!trip || !Array.isArray(trip.photos) || photoIndex < 0 || photoIndex >= trip.photos.length) {
                console.error('照片不存在');
                return false;
            }

            // 删除照片
            trip.photos.splice(photoIndex, 1);
            
            // 保存更新后的旅程数据
            return this.saveTrip(trip);
        } catch (error) {
            console.error('删除照片失败:', error);
            return false;
        }
    }
}

/**
 * 省份数据服务
 */
export class ProvinceService {
    /**
     * 获取所有中国省份
     * @returns {Array} 省份名称数组
     */
    static getAllProvinces() {
        return CHINA_PROVINCES;
    }

    /**
     * 检查是否为有效的中国省份
     * @param {string} provinceName - 省份名称
     * @returns {boolean} 是否有效
     */
    static isValidProvince(provinceName) {
        return CHINA_PROVINCES.includes(provinceName);
    }

    /**
     * 根据省份名称生成唯一ID（用于地图交互）
     * @param {string} provinceName - 省份名称
     * @returns {string} 简化的省份ID
     */
    static generateProvinceId(provinceName) {
        // 简化省份名称，去除特殊字符和修饰词
        return provinceName
            .replace('省', '')
            .replace('自治区', '')
            .replace('市', '')
            .replace('特别行政区', '')
            .trim();
    }
}

/**
 * 导出公共API
 */
export const trips = {
    getAllTrips: TripService.getAllTrips,
    getTripByProvince: TripService.getTripByProvince,
    saveTrip: TripService.saveTrip,
    deleteTrip: TripService.deleteTrip,
    getVisitedProvinces: TripService.getVisitedProvinces,
    addPhoto: TripService.addPhoto,
    removePhoto: TripService.removePhoto,
    getAllProvinces: ProvinceService.getAllProvinces,
    isValidProvince: ProvinceService.isValidProvince,
    generateProvinceId: ProvinceService.generateProvinceId
};