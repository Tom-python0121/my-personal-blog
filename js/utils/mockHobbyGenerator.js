// 兴趣爱好模拟数据生成器
import StorageManager from './storage.js';

/**
 * 随机日期生成器
 * @param {Date} start - 开始日期
 * @param {Date} end - 结束日期
 * @returns {Date} 随机日期
 */
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * 随机评分生成器
 * @param {number} min - 最小评分
 * @param {number} max - 最大评分
 * @returns {number} 随机评分
 */
function randomRating(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机小时数生成器
 * @param {number} min - 最小小时数
 * @param {number} max - 最大小时数
 * @returns {number} 随机小时数
 */
function randomHours(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成模拟兴趣爱好数据
 * @returns {Array} 兴趣爱好数据数组
 */
function generateMockHobbies() {
  const categories = ['运动健身', '艺术创作', '科技数码', '阅读学习', '其他爱好'];
  const statuses = ['active', 'inactive'];
  
  // 模拟兴趣爱好数据
  const mockHobbies = [
    {
      id: 'hobby-1',
      name: '跑步健身',
      category: '运动健身',
      startDate: randomDate(new Date(2022, 0, 1), new Date(2023, 0, 1)).toISOString(),
      status: 'active',
      skillLevel: 4,
      shortDescription: '每周进行3-4次跑步训练，主要是短跑和慢跑，能在35分钟内完成5公里',
      longDescription: '我开始跑步是为了改善心肺功能和保持身材。起初只能跑1公里，现在已经可以轻松完成5公里。跑步不仅让我身体更健康，也让我在工作之余有了放松的方式。我会继续坚持，目标是明年完成一个半程马拉松。',
      hours: 120,
      achievements: 5,
      mainImage: 'https://picsum.photos/seed/running/400/300',
      photos: [
        {
          url: 'https://picsum.photos/seed/run1/400/300',
          likes: 12,
          userLiked: false
        },
        {
          url: 'https://picsum.photos/seed/run2/400/300',
          likes: 8,
          userLiked: true
        }
      ],
      timeline: [
        {
          date: '2023-01-15',
          content: '第一次完成5公里跑步，用时38分钟'
        },
        {
          date: '2023-03-20',
          content: '购买了专业跑步装备'
        },
        {
          date: '2023-06-10',
          content: '参加了城市迷你马拉松比赛，获得完赛证书'
        }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hobby-2',
      name: '摄影创作',
      category: '艺术创作',
      startDate: randomDate(new Date(2020, 0, 1), new Date(2021, 0, 1)).toISOString(),
      status: 'active',
      skillLevel: 4,
      shortDescription: '喜欢捕捉生活中的美好瞬间，尤其擅长风景摄影和人像摄影',
      longDescription: '我对摄影的热爱始于大学时期，当时用手机记录生活点滴。后来逐渐学习了构图、光线、后期处理等专业知识，现在主要使用索尼A7M4相机进行拍摄。我的作品曾在校园摄影展中展出，目前正在准备个人摄影集。',
      hours: 180,
      achievements: 8,
      mainImage: 'https://picsum.photos/seed/photography/400/300',
      photos: [
        {
          url: 'https://picsum.photos/seed/photo1/400/300',
          likes: 25,
          userLiked: false
        },
        {
          url: 'https://picsum.photos/seed/photo2/400/300',
          likes: 32,
          userLiked: true
        },
        {
          url: 'https://picsum.photos/seed/photo3/400/300',
          likes: 18,
          userLiked: false
        }
      ],
      timeline: [
        {
          date: '2021-05-10',
          content: '购买第一台专业相机索尼A7M3'
        },
        {
          date: '2021-08-15',
          content: '参加摄影工作坊，学习专业技巧'
        },
        {
          date: '2022-03-20',
          content: '作品《城市之光》在校园摄影展中展出'
        }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hobby-3',
      name: '前端开发',
      category: '科技数码',
      startDate: randomDate(new Date(2019, 0, 1), new Date(2020, 0, 1)).toISOString(),
      status: 'active',
      skillLevel: 5,
      shortDescription: '学习和实践前端开发技术，包括HTML、CSS、JavaScript、React等',
      longDescription: '我从大学开始接触编程，最初学习了C语言，后来对Web开发产生了浓厚兴趣。通过自学和参加在线课程，我掌握了前端开发的核心技能。现在我能够独立开发响应式网站，并参与了多个个人和团队项目。我的目标是成为一名优秀的全栈工程师。',
      hours: 500,
      achievements: 12,
      mainImage: 'https://picsum.photos/seed/coding/400/300',
      photos: [
        {
          url: 'https://picsum.photos/seed/code1/400/300',
          likes: 45,
          userLiked: false
        },
        {
          url: 'https://picsum.photos/seed/code2/400/300',
          likes: 38,
          userLiked: true
        }
      ],
      timeline: [
        {
          date: '2020-01-15',
          content: '完成第一个个人网站项目'
        },
        {
          date: '2020-06-10',
          content: '开始学习React框架'
        },
        {
          date: '2021-03-20',
          content: '参与开源项目贡献'
        },
        {
          date: '2022-08-15',
          content: '完成React进阶课程学习'
        }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hobby-4',
      name: '阅读',
      category: '阅读学习',
      startDate: randomDate(new Date(2018, 0, 1), new Date(2019, 0, 1)).toISOString(),
      status: 'active',
      skillLevel: 4,
      shortDescription: '广泛阅读各类书籍，包括文学、历史、科技、技术等',
      longDescription: '我从小就喜欢阅读，阅读让我开拓了视野，增长了见识。现在我保持每月阅读2-3本书的习惯，特别喜欢技术类和历史类图书。我会在社交媒体上分享我的阅读心得，也会参加读书俱乐部的活动，与其他读者交流。',
      hours: 240,
      achievements: 6,
      mainImage: 'https://picsum.photos/seed/reading/400/300',
      photos: [
        {
          url: 'https://picsum.photos/seed/book1/400/300',
          likes: 15,
          userLiked: false
        },
        {
          url: 'https://picsum.photos/seed/book2/400/300',
          likes: 12,
          userLiked: true
        }
      ],
      timeline: [
        {
          date: '2019-02-10',
          content: '读完《深入理解计算机系统》'
        },
        {
          date: '2019-08-15',
          content: '参加读书俱乐部'
        },
        {
          date: '2020-05-20',
          content: '开始记录阅读笔记'
        }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hobby-5',
      name: '烹饪',
      category: '其他爱好',
      startDate: randomDate(new Date(2021, 0, 1), new Date(2022, 0, 1)).toISOString(),
      status: 'active',
      skillLevel: 3,
      shortDescription: '喜欢尝试制作各种美食，尤其是家常菜和西餐',
      longDescription: '疫情期间开始学习烹饪，最初只是为了填饱肚子，后来逐渐爱上了烹饪的过程。我喜欢尝试不同的菜系和烹饪方法，现在已经能够制作简单的西餐和各种家常菜。烹饪让我学会了耐心和细心，也让我能够享受自己动手的乐趣。',
      hours: 100,
      achievements: 4,
      mainImage: 'https://picsum.photos/seed/cooking/400/300',
      photos: [
        {
          url: 'https://picsum.photos/seed/food1/400/300',
          likes: 22,
          userLiked: false
        },
        {
          url: 'https://picsum.photos/seed/food2/400/300',
          likes: 28,
          userLiked: true
        },
        {
          url: 'https://picsum.photos/seed/food3/400/300',
          likes: 19,
          userLiked: false
        }
      ],
      timeline: [
        {
          date: '2021-03-10',
          content: '成功制作第一份意大利面'
        },
        {
          date: '2021-07-15',
          content: '学习烘焙，制作了第一个蛋糕'
        },
        {
          date: '2022-02-20',
          content: '为家人准备了一顿完整的年夜饭'
        }
      ],
      updatedAt: new Date().toISOString()
    },
    {
      id: 'hobby-6',
      name: '音乐欣赏',
      category: '其他爱好',
      startDate: randomDate(new Date(2017, 0, 1), new Date(2018, 0, 1)).toISOString(),
      status: 'active',
      skillLevel: 3,
      shortDescription: '喜欢听各种类型的音乐，包括古典音乐、流行音乐、摇滚音乐等',
      longDescription: '音乐是我生活中不可或缺的一部分。我从小学习钢琴，虽然现在不常弹奏，但对音乐的热爱一直没变。我喜欢收集各种音乐CD和黑胶唱片，也会去现场听音乐会。音乐能够让我放松心情，也能够激发我的创造力。',
      hours: 150,
      achievements: 3,
      mainImage: 'https://picsum.photos/seed/music/400/300',
      photos: [
        {
          url: 'https://picsum.photos/seed/music1/400/300',
          likes: 18,
          userLiked: false
        },
        {
          url: 'https://picsum.photos/seed/music2/400/300',
          likes: 25,
          userLiked: true
        }
      ],
      timeline: [
        {
          date: '2018-04-10',
          content: '购买第一张黑胶唱片'
        },
        {
          date: '2019-09-15',
          content: '参加音乐节，现场感受音乐魅力'
        },
        {
          date: '2021-05-20',
          content: '开始学习音乐理论知识'
        }
      ],
      updatedAt: new Date().toISOString()
    }
  ];
  
  return mockHobbies;
}

/**
 * 初始化兴趣爱好模拟数据
 */
function initializeMockHobbies() {
  try {
    // 检查是否已有数据
    const existingHobbies = StorageManager.getItem(StorageManager.KEYS.HOBBIES);
    
    // 如果没有数据，生成并存储模拟数据
    if (!existingHobbies || existingHobbies.length === 0) {
      const mockHobbies = generateMockHobbies();
      StorageManager.setItem(StorageManager.KEYS.HOBBIES, mockHobbies);
      console.log('兴趣爱好模拟数据已初始化');
      return mockHobbies;
    } else {
      console.log('兴趣爱好数据已存在，跳过初始化');
      return existingHobbies;
    }
  } catch (error) {
    console.error('初始化兴趣爱好模拟数据失败:', error);
    return [];
  }
}

// 导出功能
export { generateMockHobbies, initializeMockHobbies };