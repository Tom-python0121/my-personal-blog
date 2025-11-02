// Node.js脚本 - 直接更新宠物数据
// 由于是模拟浏览器环境，我们需要创建一些必要的全局对象

// 创建localStorage模拟
const localStorage = {
    _data: {},
    getItem: function(key, defaultValue = null) {
        try {
            const value = this._data[key];
            return value ? JSON.parse(value) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },
    setItem: function(key, value) {
        this._data[key] = JSON.stringify(value);
    },
    removeItem: function(key) {
        delete this._data[key];
    },
    clear: function() {
        this._data = {};
    }
};

// 将localStorage挂载到全局
global.localStorage = localStorage;

// 模拟StorageManager
class StorageManager {
    static getItem(key, defaultValue = null) {
        return localStorage.getItem(key, defaultValue);
    }
    
    static setItem(key, value) {
        localStorage.setItem(key, value);
        return true;
    }
    
    static removeItem(key) {
        localStorage.removeItem(key);
        return true;
    }
    
    static clear() {
        localStorage.clear();
        return true;
    }
}

// 模拟PetModule
const PetModule = {
    STORAGE_KEY: 'personal_growth_pets',
    
    getAllPets() {
        try {
            const pets = StorageManager.getItem(this.STORAGE_KEY, []);
            return Array.isArray(pets) ? pets : [];
        } catch (error) {
            console.error('获取宠物数据失败:', error);
            return [];
        }
    },
    
    getPetById(id) {
        const pets = this.getAllPets();
        return pets.find(pet => pet.id === id) || null;
    },
    
    savePet(petData) {
        try {
            const pets = this.getAllPets();
            
            if (petData.id) {
                const index = pets.findIndex(pet => pet.id === petData.id);
                if (index !== -1) {
                    pets[index] = { ...pets[index], ...petData };
                } else {
                    pets.push(petData);
                }
            } else {
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
    
    addPhoto(petId, photoData) {
        try {
            const pet = this.getPetById(petId);
            if (!pet) return null;
            
            if (!pet.photos) {
                pet.photos = [];
            }
            
            const newPhoto = {
                id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                url: photoData.url,
                date: photoData.date || new Date().toISOString().split('T')[0],
                description: photoData.description || '',
                likeCount: 0,
                liked: false
            };
            
            pet.photos.unshift(newPhoto);
            
            if (this.savePet(pet)) {
                return newPhoto;
            }
            
            return null;
        } catch (error) {
            console.error('添加照片失败:', error);
            return null;
        }
    }
};

// 执行更新逻辑
function updatePetWithPuppyPhotos() {
    console.log('开始更新宠物数据...');
    
    // 小狗图片路径
    const puppyImages = [
        './images/puppy_1.jpg',
        './images/puppy_2.jpg',
        './images/puppy_3.jpg'
    ];

    // 描述信息
    const descriptions = [
        '可爱的小狗正面照',
        '活泼的小狗玩耍中',
        '小狗的侧面特写'
    ];

    // 获取当前时间作为日期
    const today = new Date().toISOString().split('T')[0];

    try {
        // 模拟一些现有宠物数据
        const mockPets = [
            {
                id: '1',
                name: '花花',
                breed: '英短蓝白',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=cat1&backgroundColor=b6e3f4',
                photos: []
            }
        ];
        
        // 设置模拟数据
        StorageManager.setItem(PetModule.STORAGE_KEY, mockPets);
        
        // 获取宠物数据
        const pets = PetModule.getAllPets();
        
        if (pets && pets.length > 0) {
            const pet = pets[0];
            console.log(`找到宠物: ${pet.name}`);
            
            // 清空现有照片
            pet.photos = [];
            
            // 添加小狗照片
            puppyImages.forEach((imageUrl, index) => {
                const photoData = {
                    url: imageUrl,
                    date: today,
                    description: descriptions[index]
                };
                
                const newPhoto = PetModule.addPhoto(pet.id, photoData);
                if (newPhoto) {
                    console.log(`成功添加照片: ${newPhoto.description} - ${newPhoto.url}`);
                }
            });
            
            // 更新宠物信息
            pet.avatar = puppyImages[0];
            pet.name = '小白';
            pet.breed = '混血小狗';
            
            PetModule.savePet(pet);
            
            console.log('\n宠物数据更新成功！');
            console.log(`- 宠物名称: ${pet.name}`);
            console.log(`- 品种: ${pet.breed}`);
            console.log(`- 头像已更新为小狗图片`);
            console.log(`- 添加了 ${puppyImages.length} 张小狗照片到照片合集`);
            
            // 输出更新后的数据到JSON文件，供前端使用
            const updatedData = StorageManager.getItem(PetModule.STORAGE_KEY);
            console.log('\n更新后的数据:');
            console.log(JSON.stringify(updatedData, null, 2));
            
            // 提示如何在前端使用这些数据
            console.log('\n请将上述数据复制到您的前端应用中，或者通过localStorage.setItem(\'personal_growth_pets\', JSON.stringify(updatedData))来设置数据。');
        }
    } catch (error) {
        console.error('更新宠物数据时出错:', error);
    }
}

// 执行更新
updatePetWithPuppyPhotos();