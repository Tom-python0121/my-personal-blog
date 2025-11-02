// 强制修复宠物图片数据的脚本

// 使用正确的路径 - 从pages目录引用images目录
const puppyImages = [
    '../images/puppy_1.jpg',
    '../images/puppy_2.jpg',
    '../images/puppy_3.jpg'
];

const descriptions = [
    '可爱的小狗正面照',
    '活泼的小狗玩耍中',
    '小狗的侧面特写'
];

const today = new Date().toISOString().split('T')[0];

// 创建完整的宠物数据对象
const petData = {
    id: '1',
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
        description: descriptions[index],
        likeCount: Math.floor(Math.random() * 10),
        liked: Math.random() > 0.5
    })),
    growthRecords: [],
    diaries: []
};

// 直接设置到localStorage
localStorage.setItem('personal_growth_pets', JSON.stringify([petData]));

console.log('宠物数据已强制修复:', petData);
console.log('宠物头像路径:', petData.avatar);
console.log('照片路径:', petData.photos.map(p => p.url));
console.log('请刷新宠物页面查看效果。');