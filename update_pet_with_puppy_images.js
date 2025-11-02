// 导入必要的模块
import PetModule from './js/modules/petModule.js';

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

/**
 * 更新宠物数据，添加小狗照片
 */
function updatePetWithPuppyPhotos() {
    try {
        // 获取所有宠物
        const pets = PetModule.getAllPets();
        
        if (pets && pets.length > 0) {
            // 使用第一个宠物（花花）
            const pet = pets[0];
            console.log(`找到宠物: ${pet.name}`);
            
            // 清空现有的照片
            pet.photos = [];
            
            // 添加小狗照片
            puppyImages.forEach((imageUrl, index) => {
                const photoData = {
                    url: imageUrl,
                    date: today,
                    description: descriptions[index] || `小狗照片 ${index + 1}`
                };
                
                const newPhoto = PetModule.addPhoto(pet.id, photoData);
                if (newPhoto) {
                    console.log(`成功添加照片: ${newPhoto.description} - ${newPhoto.url}`);
                } else {
                    console.error(`添加照片失败: ${imageUrl}`);
                }
            });
            
            // 更新宠物头像为第一张小狗图片
            pet.avatar = puppyImages[0];
            pet.name = '小白'; // 给宠物改个更适合小狗的名字
            pet.breed = '混血小狗'; // 更新品种
            
            PetModule.savePet(pet);
            console.log('\n宠物数据更新成功！');
            console.log(`- 宠物名称: ${pet.name}`);
            console.log(`- 品种: ${pet.breed}`);
            console.log(`- 头像已更新为小狗图片`);
            console.log(`- 添加了 ${puppyImages.length} 张小狗照片到照片合集`);
        } else {
            console.log('没有找到宠物数据，创建新的小狗宠物...');
            
            // 创建新的小狗宠物
            const newPuppy = {
                id: Date.now().toString(),
                name: '小白',
                breed: '混血小狗',
                birthDate: '2023-06-01',
                gender: '公',
                color: '白色',
                weight: '8kg',
                personality: ['活泼', '友好', '聪明'],
                avatar: puppyImages[0],
                photos: puppyImages.map((url, index) => ({
                    id: `photo_${Date.now()}_${index}`,
                    url: url,
                    date: today,
                    description: descriptions[index] || `小狗照片 ${index + 1}`,
                    likeCount: Math.floor(Math.random() * 10),
                    liked: Math.random() > 0.5
                }))
            };
            
            if (PetModule.savePet(newPuppy)) {
                console.log('\n新的小狗宠物创建成功！');
                console.log(`- 宠物名称: ${newPuppy.name}`);
                console.log(`- 品种: ${newPuppy.breed}`);
                console.log(`- 已添加 ${newPuppy.photos.length} 张照片`);
            }
        }
    } catch (error) {
        console.error('更新宠物数据时出错:', error);
    }
}

// 执行更新
updatePetWithPuppyPhotos();