// 模拟兴趣爱好数据生成器

/**
 * 初始化模拟兴趣爱好数据
 */
function initializeMockHobbies() {
  // 检查是否已有数据
  const existingHobbies = StorageManager.getItem('hobbies');
  if (existingHobbies && existingHobbies.length > 0) {
    console.log('已有兴趣爱好数据，跳过初始化');
    return;
  }
  
  // 模拟兴趣爱好数据
  const mockHobbies = [
    {
      id: '1',
      name: '跑步健身',
      description: '每周进行3-4次跑步训练，主要是晨跑和夜跑。跑步有5-10公里不等，通过跑步保持身体健康，强化心肺功能。',
      category: '运动健身',
      rating: 5,
      startDate: '2022-01-15',
      lastActivity: new Date().toISOString().split('T')[0],
      totalHours: 120,
      isActive: true,
      updateFrequency: '每周',
      skills: ['有氧运动', '耐力训练', '心肺功能'],
      images: [
        'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'
      ],
      photos: [
        'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'
      ],
      achievements: [
        { id: 'a1', title: '完成5公里挑战', date: '2022-03-20' },
        { id: 'a2', title: '完成10公里目标', date: '2022-06-10' },
        { id: 'a3', title: '参加城市马拉松', date: '2022-09-15' },
        { id: 'a4', title: '月跑量突破100公里', date: '2023-02-28' },
        { id: 'a5', title: '连续跑步30天', date: '2023-06-30' }
      ],
      timeline: [
        { date: '2022-01-15', description: '开始了第一次5公里跑步挑战' },
        { date: '2022-03-20', description: '完成了第一个10公里跑步目标' },
        { date: '2022-06-10', description: '参加了城市马拉松比赛' }
      ]
    },
    {
      id: '2',
      name: '摄影创作',
      description: '喜欢用相机记录生活中的美好瞬间，擅长风光摄影和人像摄影。使用单反相机和无人机拍摄，每周会花时间进行后期处理。',
      category: '艺术创作',
      rating: 4,
      startDate: '2020-08-15',
      lastActivity: '2024-01-10',
      totalHours: 180,
      isActive: true,
      updateFrequency: '每周',
      skills: ['构图技巧', '光线控制', '后期处理', '无人机拍摄'],
      images: [
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop'
      ],
      photos: [
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop'
      ],
      achievements: [
        { id: 'a1', title: '作品展出', date: '2021-05-20' },
        { id: 'a2', title: '无人机摄影入门', date: '2022-01-10' },
        { id: 'a3', title: '参加摄影工作坊', date: '2022-06-15' },
        { id: 'a4', title: '获得摄影比赛三等奖', date: '2022-11-05' },
        { id: 'a5', title: '摄影作品集完成', date: '2023-03-20' },
        { id: 'a6', title: '商业拍摄首单', date: '2023-08-10' },
        { id: 'a7', title: '开设摄影博客', date: '2023-12-01' },
        { id: 'a8', title: '发布摄影教程', date: '2024-01-05' }
      ],
      timeline: [
        { date: '2020-08-15', description: '购买了第一台单反相机' },
        { date: '2021-05-20', description: '作品在摄影展中展出' },
        { date: '2022-01-10', description: '开始学习无人机摄影' }
      ]
    },
    {
      id: '3',
      name: '前端开发',
      description: '学习和实践前端开发技术，包括HTML、CSS、JavaScript、React等。参与多个个人项目和开源项目，不断提升自己的技术水平。',
      category: '科技数码',
      rating: 4,
      startDate: '2021-09-01',
      lastActivity: '2024-01-15',
      totalHours: 500,
      isActive: true,
      updateFrequency: '每天',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue', 'Webpack'],
      images: [
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop'
      ],
      photos: [
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop'
      ],
      achievements: [
        { id: 'a1', title: '完成第一个网站', date: '2021-11-15' },
        { id: 'a2', title: 'React入门', date: '2022-02-15' },
        { id: 'a3', title: 'GitHub开源项目', date: '2022-10-01' },
        { id: 'a4', title: 'Vue学习完成', date: '2023-05-20' },
        { id: 'a5', title: 'Webpack配置精通', date: '2023-08-10' },
        { id: 'a6', title: '完成响应式设计课程', date: '2023-09-25' },
        { id: 'a7', title: '通过前端技术认证', date: '2023-11-15' },
        { id: 'a8', title: '贡献开源项目', date: '2023-12-05' },
        { id: 'a9', title: '完成大型单页应用', date: '2024-01-01' },
        { id: 'a10', title: '学习TypeScript', date: '2024-01-10' },
        { id: 'a11', title: '掌握状态管理', date: '2024-01-15' },
        { id: 'a12', title: '性能优化实战', date: '2024-01-20' }
      ],
      timeline: [
        { date: '2021-09-01', description: '开始学习HTML和CSS基础' },
        { date: '2022-02-15', description: '完成第一个React项目' },
        { date: '2022-10-01', description: '在GitHub上开源第一个项目' },
        { date: '2023-05-20', description: '开始学习Vue框架' }
      ]
    },
    {
      id: '4',
      name: '阅读',
      description: '广泛阅读各类书籍，包括文学、历史、科学、技术等。平均每周阅读5-7小时，通过阅读拓宽视野和增加知识储备。',
      category: '阅读学习',
      rating: 5,
      startDate: '2019-03-15',
      lastActivity: '2024-01-12',
      totalHours: 350,
      isActive: true,
      updateFrequency: '每周',
      skills: ['快速阅读', '知识总结', '批判性思维'],
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=400&fit=crop'
      ],
      photos: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=400&fit=crop'
      ],
      achievements: [
        { id: 'a1', title: '月读10本书', date: '2019-04-30' },
        { id: 'a2', title: '完成年度50本书目标', date: '2020-12-31' },
        { id: 'a3', title: '建立阅读笔记系统', date: '2022-06-10' },
        { id: 'a4', title: '读完文学经典20本', date: '2022-09-15' },
        { id: 'a5', title: '科技类书籍阅读达人', date: '2022-12-31' },
        { id: 'a6', title: '历史类书籍专题阅读', date: '2023-03-20' },
        { id: 'a7', title: '阅读分享会主讲', date: '2023-06-10' },
        { id: 'a8', title: '读书笔记破100篇', date: '2023-08-15' },
        { id: 'a9', title: '建立个人图书馆', date: '2023-09-30' },
        { id: 'a10', title: '阅读马拉松24小时', date: '2023-11-15' },
        { id: 'a11', title: '年度阅读70本书', date: '2023-12-31' },
        { id: 'a12', title: '开始写书评', date: '2024-01-05' },
        { id: 'a13', title: '心理学专题阅读', date: '2024-01-12' },
        { id: 'a14', title: '哲学入门阅读', date: '2024-01-15' },
        { id: 'a15', title: '阅读速度提升50%', date: '2024-01-20' }
      ],
      timeline: [
        { date: '2019-03-15', description: '设定年度阅读50本书的目标' },
        { date: '2020-12-31', description: '完成年度阅读目标，共读完52本书' },
        { date: '2022-06-10', description: '开始建立个人阅读笔记系统' }
      ]
    },
    {
      id: '5',
      name: '烹饪',
      description: '喜欢烹饪和尝试各种美食，尤其是家常菜和烘焙，擅长川菜和粤菜。会经常尝试新的菜谱，也会根据家人喜好创新菜品。',
      category: '其他爱好',
      rating: 3,
      startDate: '2020-09-20',
      lastActivity: '2024-01-14',
      totalHours: 120,
      isActive: true,
      updateFrequency: '每周',
      skills: ['刀工技巧', '火候掌握', '调味搭配', '烘焙技术'],
      images: [
        'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=600&h=400&fit=crop'
      ],
      photos: [
        'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=600&h=400&fit=crop'
      ],
      achievements: [
        { id: 'a1', title: '学会基础烹饪技巧', date: '2020-11-10' },
        { id: 'a2', title: '成功制作生日蛋糕', date: '2021-05-10' },
        { id: 'a3', title: '情人节晚餐', date: '2022-02-14' },
        { id: 'a4', title: '学会制作川菜', date: '2022-06-15' },
        { id: 'a5', title: '烘焙技术提升', date: '2023-03-20' },
        { id: 'a6', title: '自创招牌菜', date: '2023-09-15' }
      ],
      timeline: [
        { date: '2020-09-20', description: '开始学习基础烹饪技巧' },
        { date: '2021-05-10', description: '第一次尝试制作生日蛋糕' },
        { date: '2022-02-14', description: '为家人准备了情人节晚餐' }
      ]
    },
    {
      id: '6',
      name: '音乐欣赏',
      description: '喜欢欣赏各种类型的音乐，包括古典音乐、流行音乐、摇滚音乐等。偶尔也会尝试学习乐器，如吉他和钢琴。',
      category: '艺术创作',
      rating: 4,
      startDate: '2018-05-20',
      lastActivity: '2024-01-11',
      totalHours: 260,
      isActive: true,
      updateFrequency: '每天',
      skills: ['音乐鉴赏', '吉他基础', '乐理知识'],
      images: [
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop'
      ],
      photos: [
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop'
      ],
      achievements: [
        { id: 'a1', title: '购买第一把吉他', date: '2018-05-20' },
        { id: 'a2', title: '参加第一场音乐会', date: '2019-08-15' },
        { id: 'a3', title: '学会钢琴基础', date: '2021-03-10' },
        { id: 'a4', title: '组建音乐小组', date: '2023-12-01' }
      ],
      timeline: [
        { date: '2018-05-20', description: '购买了第一把吉他' },
        { date: '2019-08-15', description: '参加了人生第一场音乐会' },
        { date: '2021-03-10', description: '开始学习钢琴基础' }
      ]
    }
  ];
  
  // 保存模拟数据
  try {
    StorageManager.setItem('hobbies', mockHobbies);
    console.log('模拟兴趣爱好数据初始化成功');
  } catch (error) {
    console.error('初始化模拟数据失败:', error);
  }
}

// 导出函数
window.initializeMockHobbies = initializeMockHobbies;