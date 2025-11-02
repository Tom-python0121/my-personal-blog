/**
 * 宠物模块 - 处理宠物相关的数据和业务逻辑
 */

// 导入存储管理器
import StorageManager from '../utils/storage.js';

/**
 * 宠物数据管理模块
 */
const PetModule = {
    // 存储键名
    STORAGE_KEY: 'personal_growth_pets',
    
    /**
     * 获取所有宠物数据
     * @returns {Array} 宠物数据数组
     */
    getAllPets() {
        try {
            const pets = StorageManager.getItem(this.STORAGE_KEY, []);
            return Array.isArray(pets) ? pets : [];
        } catch (error) {
            console.error('获取宠物数据失败:', error);
            return [];
        }
    },
    
    /**
     * 根据ID获取宠物数据
     * @param {string} id - 宠物ID
     * @returns {Object|null} 宠物数据对象或null
     */
    getPetById(id) {
        const pets = this.getAllPets();
        return pets.find(pet => pet.id === id) || null;
    },
    
    /**
     * 保存宠物数据
     * @param {Object} petData - 宠物数据对象
     * @returns {boolean} 是否保存成功
     */
    savePet(petData) {
        try {
            const pets = this.getAllPets();
            
            // 如果有ID，更新现有宠物
            if (petData.id) {
                const index = pets.findIndex(pet => pet.id === petData.id);
                if (index !== -1) {
                    pets[index] = { ...pets[index], ...petData };
                } else {
                    // ID不存在，创建新宠物
                    pets.push(petData);
                }
            } else {
                // 新宠物，生成ID
                petData.id = Date.now().toString();
                pets.push(petData);
            }
            
            StorageManager.setItem(this.STORAGE_KEY, pets);
            return true;
        } catch (error) {
            console.error('保存宠物数据失败:', error);
            return false;
        }
    },
    
    /**
     * 删除宠物
     * @param {string} id - 宠物ID
     * @returns {boolean} 是否删除成功
     */
    deletePet(id) {
        try {
            let pets = this.getAllPets();
            pets = pets.filter(pet => pet.id !== id);
            StorageManager.setItem(this.STORAGE_KEY, pets);
            return true;
        } catch (error) {
            console.error('删除宠物失败:', error);
            return false;
        }
    },
    
    /**
     * 添加成长记录
     * @param {string} petId - 宠物ID
     * @param {Object} record - 成长记录对象
     * @returns {boolean} 是否添加成功
     */
    addGrowthRecord(petId, record) {
        try {
            const pet = this.getPetById(petId);
            if (!pet) return false;
            
            if (!pet.growthRecords) {
                pet.growthRecords = [];
            }
            
            record.id = Date.now().toString();
            record.date = record.date || new Date().toISOString().split('T')[0];
            
            pet.growthRecords.push(record);
            // 按日期排序
            pet.growthRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            return this.savePet(pet);
        } catch (error) {
            console.error('添加成长记录失败:', error);
            return false;
        }
    },
    
    /**
     * 添加照片
     * @param {string} petId - 宠物ID
     * @param {Object} photo - 照片对象
     * @returns {boolean} 是否添加成功
     */
    addPhoto(petId, photo) {
        try {
            const pet = this.getPetById(petId);
            if (!pet) return false;
            
            if (!pet.photos) {
                pet.photos = [];
            }
            
            photo.id = Date.now().toString();
            photo.date = photo.date || new Date().toISOString();
            photo.liked = photo.liked || false;
            photo.likeCount = photo.likeCount || 0;
            
            pet.photos.push(photo);
            
            return this.savePet(pet);
        } catch (error) {
            console.error('添加照片失败:', error);
            return false;
        }
    },
    
    /**
     * 切换照片点赞状态
     * @param {string} petId - 宠物ID
     * @param {string} photoId - 照片ID
     * @returns {Object|null} 更新后的照片对象或null
     */
    togglePhotoLike(petId, photoId) {
        try {
            const pet = this.getPetById(petId);
            if (!pet || !pet.photos) return null;
            
            const photo = pet.photos.find(p => p.id === photoId);
            if (!photo) return null;
            
            photo.liked = !photo.liked;
            photo.likeCount = photo.liked ? (photo.likeCount + 1) : (photo.likeCount - 1);
            
            if (this.savePet(pet)) {
                return photo;
            }
            return null;
        } catch (error) {
            console.error('切换照片点赞状态失败:', error);
            return null;
        }
    },
    
    /**
     * 删除宠物照片
     * @param {string} petId - 宠物ID
     * @param {string} photoId - 照片ID
     * @returns {boolean} 是否删除成功
     */
    deletePhoto(petId, photoId) {
        try {
            const pet = this.getPetById(petId);
            if (!pet || !pet.photos) return false;
            
            // 过滤掉要删除的照片
            const initialLength = pet.photos.length;
            pet.photos = pet.photos.filter(photo => photo.id !== photoId);
            
            // 如果有照片被删除，保存更新后的数据
            if (pet.photos.length < initialLength) {
                return this.savePet(pet);
            }
            
            return false;
        } catch (error) {
            console.error('删除照片失败:', error);
            return false;
        }
    },
    
    /**
     * 添加宠物照片
     * @param {string} petId - 宠物ID
     * @param {Object} photoData - 照片数据
     * @param {string} photoData.url - 照片URL
     * @param {string} photoData.date - 照片日期
     * @param {string} photoData.description - 照片描述
     * @returns {Object|null} 添加的照片对象
     */
    addPhoto(petId, photoData) {
        try {
            const pet = this.getPetById(petId);
            if (!pet) return null;
            
            // 确保photos数组存在
            if (!pet.photos) {
                pet.photos = [];
            }
            
            // 创建新照片对象
            const newPhoto = {
                id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                url: photoData.url,
                date: photoData.date || new Date().toISOString().split('T')[0],
                description: photoData.description || '',
                likeCount: 0,
                liked: false
            };
            
            // 添加到照片数组并保存
            pet.photos.unshift(newPhoto); // 添加到开头
            
            if (this.savePet(pet)) {
                return newPhoto;
            }
            
            return null;
        } catch (error) {
            console.error('添加照片失败:', error);
            return null;
        }
    },
    
    /**
     * 添加日记
     * @param {string} petId - 宠物ID
     * @param {Object} diary - 日记对象
     * @returns {boolean} 是否添加成功
     */
    addDiary(petId, diary) {
        try {
            const pet = this.getPetById(petId);
            if (!pet) return false;
            
            if (!pet.diaries) {
                pet.diaries = [];
            }
            
            diary.id = Date.now().toString();
            diary.date = diary.date || new Date().toISOString().split('T')[0];
            diary.tags = diary.tags || [];
            
            pet.diaries.push(diary);
            // 按日期排序
            pet.diaries.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            return this.savePet(pet);
        } catch (error) {
            console.error('添加日记失败:', error);
            return false;
        }
    },
    
    /**
     * 获取宠物的体重数据（用于图表）
     * @param {string} petId - 宠物ID
     * @returns {Array} 体重数据数组
     */
    getWeightData(petId) {
        const pet = this.getPetById(petId);
        if (!pet || !pet.growthRecords) return [];
        
        // 过滤出体重记录并按日期排序
        const weightRecords = pet.growthRecords
            .filter(record => record.type === 'weight' && record.weight)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        return weightRecords;
    },
    
    /**
     * 初始化默认宠物数据
     */
    initializeDefaultData() {
        const pets = this.getAllPets();
        if (pets.length === 0) {
            // 默认宠物数据 - 小狗
            const defaultPet = {
                id: '1',
                name: '小白',
                breed: '混血小狗',
                birthDate: '2023-06-01',
                gender: '公',
                color: '白色',
                weight: '8kg',
                personality: ['活泼', '友好', '聪明'],
                avatar: '../images/puppy_1.jpg',
                growthRecords: [
                    {
                        id: '101',
                        date: '2024-01-15',
                        type: 'milestone',
                        content: '学会了新技能：握手'
                    },
                    {
                        id: '102',
                        date: '2024-01-10',
                        type: 'weight',
                        weight: 3.8,
                        unit: 'kg'
                    },
                    {
                        id: '103',
                        date: '2023-12-25',
                        type: 'milestone',
                        content: '第一次过圣诞节，收到了新玩具'
                    }
                ],
                photos: [
                    {
                        id: '201',
                        url: '../images/puppy_1.jpg',
                        date: '2024-01-20T10:00:00Z',
                        liked: false,
                        likeCount: 2,
                        description: '小白的正面照'
                    },
                    {
                        id: '202',
                        url: '../images/puppy_2.jpg',
                        date: '2024-01-18T15:30:00Z',
                        liked: true,
                        likeCount: 3,
                        description: '可爱的小白侧面'
                    },
                    {
                        id: '203',
                        url: '../images/puppy_3.jpg',
                        date: '2024-01-15T09:20:00Z',
                        liked: true,
                        likeCount: 5,
                        description: '活泼的小白玩耍中'
                    }
                ],
                diaries: [
                    {
                        id: '301',
                        date: '2024-01-20',
                        title: '今天很开心',
                        content: '今天带花花去公园玩了，它特别兴奋，跑来跑去的。',
                        tags: ['公园', '开心']
                    },
                    {
                        id: '302',
                        date: '2024-01-19',
                        title: '新食物尝试',
                        content: '给花花买了新的猫粮，它很喜欢吃。',
                        tags: ['食物', '日常']
                    }
                ]
            };
            
            this.savePet(defaultPet);
        }
    }
};

export default PetModule;