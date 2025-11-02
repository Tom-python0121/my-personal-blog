/**
 * 宠物页面应用 - 处理宠物页面的UI交互和数据展示
 */

// 导入宠物模块
import PetModule from '../modules/petModule.js';

/**
 * 宠物页面应用类
 */
class PetsApp {
    constructor() {
        this.currentPetId = '1'; // 默认宠物ID
        this.currentTab = 'profile'; // 默认Tab
        this.weightChart = null; // 体重图表实例
    }
    
    /**
     * 初始化应用
     */
    init() {
        // 初始化默认数据
        PetModule.initializeDefaultData();
        
        // 加载导航栏
        this.loadNavbar();
        
        // 获取URL参数
        this.parseUrlParams();
        
        // 绑定事件
        this.bindEvents();
        
        // 加载宠物数据
        this.loadPetData();
    }
    
    /**
     * 解析URL参数
     */
    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const petId = urlParams.get('id');
        if (petId) {
            this.currentPetId = petId;
        }
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        var self = this;
        
        // Tab切换事件
        document.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.switchTab(btn.dataset.tab);
            });
        });
        
        // 编辑按钮事件
        var editBtn = document.getElementById('edit-pet-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                self.handleEditPet();
            });
        }
        
        // 删除按钮事件
        var deleteBtn = document.getElementById('delete-pet-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                self.handleDeletePet();
            });
        }
        
        // 照片点赞事件（使用事件委托）
        var photoMasonry = document.querySelector('.photo-masonry');
        if (photoMasonry) {
            photoMasonry.addEventListener('click', function(e) {
                var likeBtn = e.target.closest('.photo-like-btn');
                if (likeBtn) {
                    var photoId = likeBtn.dataset.photoId;
                    self.handlePhotoLike(photoId);
                }
            });
        }
        
        // 添加日记按钮事件
        var addDiaryBtn = document.getElementById('add-diary-btn');
        if (addDiaryBtn) {
            addDiaryBtn.addEventListener('click', function() {
                self.handleAddDiary();
            });
        }
        
        // 添加成长记录按钮事件
        document.addEventListener('click', function(e) {
            var addGrowthBtn = e.target.closest('.add-growth-btn');
            if (addGrowthBtn) {
                self.handleAddGrowthRecord();
            }
        });
        
        // 添加照片按钮事件
        document.addEventListener('click', function(e) {
            var addPhotoBtn = e.target.closest('.add-photo-btn');
            if (addPhotoBtn) {
                // 滚动到上传表单区域
                const uploadForm = document.querySelector('.photo-upload-form');
                if (uploadForm) {
                    uploadForm.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }
    
    /**
     * 处理添加日记
     */
    handleAddDiary() {
        // 移除之前的模态框（如果存在）
        var existingModal = document.getElementById('add-diary-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 显示添加日记模态框
        this.showAddDiaryModal();
    }
    
    /**
     * 显示添加日记模态框
     */
    showAddDiaryModal() {
        // 获取当前日期
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        var dateStr = year + '-' + month + '-' + day;
        
        // 创建添加日记表单
        var modalHTML = "<div id='add-diary-modal' class='modal-overlay'>" +
            "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                    "<h3>添加日记</h3>" +
                    "<button id='close-diary-modal' class='close-btn'>×</button>" +
                "</div>" +
                "<form id='add-diary-form'>" +
                    "<div class='form-group'>" +
                        "<label for='diary-title'>标题：</label>" +
                        "<input type='text' id='diary-title' placeholder='请输入日记标题' required>" +
                    "</div>" +
                    "<div class='form-group'>" +
                        "<label for='diary-date'>日期：</label>" +
                        "<input type='date' id='diary-date' value='" + dateStr + "' required>" +
                    "</div>" +
                    "<div class='form-group'>" +
                        "<label for='diary-content'>内容：</label>" +
                        "<textarea id='diary-content' rows='6' placeholder='请输入日记内容' required></textarea>" +
                    "</div>" +
                    "<div class='form-group'>" +
                        "<label for='diary-tags'>标签（用逗号分隔）：</label>" +
                        "<input type='text' id='diary-tags' placeholder='例如：开心,日常,散步'>" +
                    "</div>" +
                    "<div class='form-actions'>" +
                        "<button type='submit' class='btn btn-primary'>保存</button>" +
                        "<button type='button' id='cancel-add-diary' class='btn btn-secondary'>取消</button>" +
                    "</div>" +
                "</form>" +
            "</div>" +
        "</div>";
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 初始化模态框事件
        this.initAddDiaryModalEvents();
    }
    
    /**
     * 初始化添加日记模态框事件
     */
    initAddDiaryModalEvents() {
        var self = this;
        
        // 确保模态框存在
        var modal = document.getElementById('add-diary-modal');
        if (!modal) return;
        
        // 关闭按钮事件
        var closeBtn = document.getElementById('close-diary-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });
        }
        
        // 取消按钮事件
        var cancelBtn = document.getElementById('cancel-add-diary');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                modal.remove();
            });
        }
        
        // 点击外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 表单提交事件
        var form = document.getElementById('add-diary-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 获取表单数据
                var title = document.getElementById('diary-title').value.trim();
                var date = document.getElementById('diary-date').value;
                var content = document.getElementById('diary-content').value.trim();
                var tagsInput = document.getElementById('diary-tags').value.trim();
                
                // 处理标签
                var tags = [];
                if (tagsInput) {
                    var tagArray = tagsInput.split(',');
                    for (var i = 0; i < tagArray.length; i++) {
                        var tag = tagArray[i].trim();
                        if (tag) {
                            tags.push(tag);
                        }
                    }
                }
                
                // 验证表单
                if (!title || !content) {
                    alert('请填写标题和内容');
                    return;
                }
                
                // 创建日记对象
                var diary = {};
                diary.title = title;
                diary.date = date;
                diary.content = content;
                diary.tags = tags;
                
                // 保存日记
                if (PetModule.addDiary(self.currentPetId, diary)) {
                    alert('日记添加成功');
                    modal.remove();
                    // 重新加载日记标签内容
                    var pet = PetModule.getPetById(self.currentPetId);
                    self.updateDiaryTab(pet);
                } else {
                    alert('日记添加失败，请重试');
                }
            });
        }
    }
    
    /**
     * 加载导航栏
     */
    loadNavbar() {
        // 简单的导航栏实现
        const nav = document.getElementById('main-nav');
        if (nav) {
            nav.innerHTML = `
                <div class="nav-container">
                    <a href="../index.html" class="logo">个人成长</a>
                    <div class="nav-links">
                        <a href="trips.html">旅程</a>
                        <a href="gallery.html">相册</a>
                        <a href="reading.html">读书</a>
                        <a href="hobbies.html">兴趣爱好</a>
                        <a href="pets.html" class="active">宠物</a>
                        <a href="my-profile.html">我的</a>
                    </div>
                </div>
            `;
        }
    }
    
    /**
     * 加载宠物数据
     * @param {number} petId - 可选参数，宠物ID，如果不提供则使用当前宠物ID
     */
    loadPetData(petId) {
        // 使用传入的petId或当前宠物ID
        const targetPetId = petId !== undefined ? petId : this.currentPetId;
        const pet = PetModule.getPetById(targetPetId);
        if (!pet) {
            console.error('宠物数据不存在');
            return;
        }
        
        // 更新当前宠物ID
        this.currentPetId = targetPetId;
        
        // 更新头部信息
        this.updatePetHeader(pet);
        
        // 更新各个Tab内容
        this.updateProfileTab(pet);
        this.updateGrowthTab(pet);
        this.updatePhotosTab(pet);
        this.updateDiaryTab(pet);
    }
    
    /**
     * 更新宠物头部信息
     * @param {Object} pet - 宠物数据
     */
    updatePetHeader(pet) {
        // 更新宠物名称
        const petName = document.getElementById('pet-name');
        if (petName) {
            petName.textContent = pet.name;
        }
        
        // 确保头像URL存在，如果不存在使用默认头像
        const avatarImg = document.getElementById('pet-avatar-img');
        if (avatarImg) {
            if (pet.avatar && pet.avatar.trim() !== '') {
                avatarImg.src = pet.avatar;
            } else {
                // 使用默认宠物头像
                avatarImg.src = 'https://picsum.photos/id/237/200/200';
                // 更新宠物数据中的头像URL
                pet.avatar = avatarImg.src;
                PetModule.savePet(pet);
            }
        }
        
        // 更新宠物元数据
        const petMeta = document.querySelector('.pet-meta');
        if (petMeta) {
            petMeta.innerHTML = `
                <span class="meta-item">品种: ${pet.breed || '未知'}</span>
                <span class="meta-item">年龄: ${this.calculateAge(pet.birthDate)}</span>
                <span class="meta-item">性别: ${pet.gender}</span>
            `;
        }
        
        // 重新绑定按钮事件（移除旧的监听器）
        const editBtn = document.getElementById('edit-pet-btn');
        if (editBtn) {
            const newEditBtn = editBtn.cloneNode(true);
            editBtn.parentNode.replaceChild(newEditBtn, editBtn);
            newEditBtn.addEventListener('click', () => this.handleEditPet());
        }
        
        const deleteBtn = document.getElementById('delete-pet-btn');
        if (deleteBtn) {
            const newDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
            newDeleteBtn.addEventListener('click', () => this.handleDeletePet());
        }
    }
    
    /**
     * 计算宠物年龄
     * @param {string} birthDate - 出生日期
     * @returns {string} 年龄字符串
     */
    calculateAge(birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        return `${years}岁${months}个月`;
    }
    
    /**
     * 切换Tab
     * @param {string} tabName - Tab名称
     */
    switchTab(tabName) {
        // 移除所有tab的active状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 添加当前tab的active状态
        const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // 隐藏所有tab内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 显示当前tab内容
        const tabContent = document.getElementById(`${tabName}-content`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
        
        // 根据tab加载不同的内容
        const pet = PetModule.getPetById(this.currentPetId);
        if (pet) {
            switch (tabName) {
                case 'profile':
                    this.updateProfileTab(pet);
                    break;
                case 'growth':
                    this.updateGrowthTab(pet);
                    break;
                case 'photos':
                    this.updatePhotosTab(pet);
                    break;
                case 'diary':
                    this.updateDiaryTab(pet);
                    break;
            }
        }
        
        // 更新当前tab
        this.currentTab = tabName;
    }
    
    /**
     * 更新档案Tab内容
     * @param {Object} pet - 宠物数据
     */
    updateProfileTab(pet) {
        // 更新基础信息
        const profileContent = document.getElementById('profile-content');
        if (profileContent) {
            const infoItems = profileContent.querySelectorAll('.info-item');
            infoItems.forEach(item => {
                const label = item.querySelector('.label').textContent;
                const valueEl = item.querySelector('.value');
                
                if (valueEl) {
                    switch (label) {
                        case '宠物名称:':
                            valueEl.textContent = pet.name;
                            break;
                        case '品种:':
                            valueEl.textContent = pet.breed;
                            break;
                        case '出生日期:':
                            valueEl.textContent = pet.birthDate;
                            break;
                        case '性别:':
                            valueEl.textContent = pet.gender;
                            break;
                        case '颜色:':
                            valueEl.textContent = pet.color;
                            break;
                        case '体重:':
                            valueEl.textContent = pet.weight;
                            break;
                    }
                }
            });
            
            // 更新个性标签
            const tagsContainer = profileContent.querySelector('.tags');
            if (tagsContainer && pet.personality) {
                tagsContainer.innerHTML = pet.personality
                    .map(tag => `<span class="tag">${tag}</span>`)
                    .join('');
            }
        }
        
        // 初始化体重图表
        this.initWeightChart();
    }
    
    /**
     * 初始化体重图表
     */
    initWeightChart() {
        const chartDom = document.getElementById('weight-chart');
        if (!chartDom) return;
        
        const weightData = PetModule.getWeightData(this.currentPetId);
        
        if (weightData.length > 0) {
            // 检查echarts是否已加载
            if (typeof echarts !== 'undefined') {
                // 销毁现有图表
                if (this.weightChart) {
                    this.weightChart.dispose();
                }
                
                // 创建新图表
                this.weightChart = echarts.init(chartDom);
                
                const option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: function(params) {
                        const data = params[0];
                        return `${data.name}<br/>体重: ${data.value}kg`;
                    }
                },
                xAxis: {
                    type: 'category',
                    data: weightData.map(item => item.date)
                },
                yAxis: {
                    type: 'value',
                    name: '体重 (kg)'
                },
                series: [{
                    data: weightData.map(item => item.weight),
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3,
                        color: '#007bff'
                    },
                    itemStyle: {
                        color: '#007bff'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: 'rgba(0,123,255,0.3)' },
                                { offset: 1, color: 'rgba(0,123,255,0.05)' }
                            ]
                        }
                    }
                }]
            };
            
            this.weightChart.setOption(option);
                
                // 响应式调整
                window.addEventListener('resize', () => {
                    if (this.weightChart) {
                        this.weightChart.resize();
                    }
                });
            } else {
                // 如果echarts未加载，显示简单的体重数据列表
                chartDom.innerHTML = `
                    <div class="simple-weight-data">
                        <h4>体重记录</h4>
                        <ul>
                            ${weightData.map(item => `<li>${item.date}: ${item.weight}kg</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
        } else {
            chartDom.innerHTML = '<div class="no-data">暂无体重数据</div>';
        }
    }
    
    /**
     * 更新成长记录Tab内容
     * @param {Object} pet - 宠物数据
     */
    updateGrowthTab(pet) {
        const timeline = document.querySelector('.growth-timeline');
        if (!timeline || !pet.growthRecords || pet.growthRecords.length === 0) {
            timeline.innerHTML = '<div class="no-data">暂无成长记录</div>';
            return;
        }
        
        timeline.innerHTML = pet.growthRecords.map(record => {
            const itemClass = record.type === 'weight' ? 'growth-item weight' : 'growth-item';
            const content = record.type === 'weight' 
                ? `<p>体重: ${record.weight}${record.unit || 'kg'}</p>`
                : `<p>${record.content}</p>`;
            
            return `
                <div class="${itemClass}" data-id="${record.id}">
                    <div class="growth-date">${record.date}</div>
                    <div class="growth-content">
                        ${content}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * 更新照片合集Tab内容
     * @param {Object} pet - 宠物数据
     */
    updatePhotosTab(pet) {
        const photoGrid = document.querySelector('.photo-masonry');
        
        // 确保宠物数据包含photos数组
        if (!pet.photos) {
            pet.photos = [];
        }
        
        // 如果没有照片，添加默认照片
        if (pet.photos.length === 0) {
            // 生成默认照片数据
            const defaultPhotos = [
                {
                    id: Date.now() + 1,
                    url: 'https://picsum.photos/id/237/400/400',
                    date: new Date().toISOString().split('T')[0],
                    description: '宠物可爱照片',
                    liked: false,
                    likeCount: 3
                },
                {
                    id: Date.now() + 2,
                    url: 'https://picsum.photos/id/40/400/300',
                    date: new Date().toISOString().split('T')[0],
                    description: '宠物日常照',
                    liked: true,
                    likeCount: 5
                },
                {
                    id: Date.now() + 3,
                    url: 'https://picsum.photos/id/169/300/400',
                    date: new Date().toISOString().split('T')[0],
                    description: '宠物卖萌',
                    liked: false,
                    likeCount: 2
                }
            ];
            
            // 保存默认照片到宠物数据
            pet.photos = defaultPhotos;
            PetModule.savePet(pet);
        }
        
        // 添加照片上传表单
        const uploadFormContainer = document.createElement('div');
        uploadFormContainer.className = 'photo-upload-form';
        uploadFormContainer.innerHTML = `
            <h3>上传新照片</h3>
            <div class="form-group">
                <label for="photo-url">照片URL：</label>
                <input type="url" id="photo-url" placeholder="https://picsum.photos/id/237/400/300">
                <small>提示：可以使用 https://picsum.photos/id/[数字]/400/300 获取示例图片</small>
            </div>
            <div class="form-group">
                <label for="photo-date">拍摄日期：</label>
                <input type="date" id="photo-date" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label for="photo-description">照片描述：</label>
                <textarea id="photo-description" placeholder="输入照片描述..."></textarea>
            </div>
            <button id="upload-photo-btn" class="btn btn-primary">上传照片</button>
        `;
        
        // 获取照片tab内容元素并添加上传表单
        const photosContent = document.getElementById('photos-content');
        if (photosContent) {
            photosContent.appendChild(uploadFormContainer);
        }
        
        // 绑定上传按钮事件
        const uploadBtn = document.getElementById('upload-photo-btn');
        uploadBtn.addEventListener('click', () => {
            const photoUrl = document.getElementById('photo-url').value.trim();
            const photoDate = document.getElementById('photo-date').value;
            const photoDescription = document.getElementById('photo-description').value.trim();
            
            if (!photoUrl) {
                alert('请输入照片URL');
                return;
            }
            
            const newPhoto = PetModule.addPhoto(this.currentPetId, {
                url: photoUrl,
                date: photoDate,
                description: photoDescription
            });
            
            if (newPhoto) {
                // 清空表单
                document.getElementById('photo-url').value = '';
                document.getElementById('photo-description').value = '';
                // 更新照片显示
                this.updatePhotosTab(pet);
                alert('照片上传成功！');
            } else {
                alert('照片上传失败，请重试');
            }
        });
        
        // 渲染照片网格
        photoGrid.innerHTML = pet.photos.map(photo => {
            const likedClass = photo.liked ? 'liked' : '';
            const heartIcon = photo.liked ? 'fas' : 'far';
            
            return `
                <div class="photo-item" data-id="${photo.id}">
                    <img src="${photo.url}" alt="${photo.description || '宠物照片'}">
                    <div class="photo-overlay">
                        <p class="photo-date">${photo.date}</p>
                        <p class="photo-desc">${photo.description || ''}</p>
                    </div>
                    <div class="photo-actions">
                        <button class="photo-like-btn ${likedClass}" data-photo-id="${photo.id}">
                            <i class="${heartIcon} fa-heart"></i>
                            <span>${photo.likeCount}</span>
                        </button>
                        <button class="photo-delete-btn" data-photo-id="${photo.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // 绑定照片删除事件
        document.querySelectorAll('.photo-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const photoId = btn.dataset.photoId;
                if (confirm('确定要删除这张照片吗？')) {
                    if (PetModule.deletePhoto(this.currentPetId, photoId)) {
                        this.updatePhotosTab(pet);
                    } else {
                        alert('删除失败，请重试');
                    }
                }
            });
        });
        
        // 更新年份筛选
        this.updateYearFilter(pet.photos);
    }
    
    /**
     * 更新年份筛选器
     * @param {Array} photos - 照片数组
     */
    updateYearFilter(photos) {
        const yearFilter = document.getElementById('year-filter');
        if (!yearFilter || !photos || photos.length === 0) return;
        
        // 提取所有年份
        const years = [...new Set(photos.map(photo => {
            return new Date(photo.date).getFullYear();
        }))].sort((a, b) => b - a);
        
        // 添加年份选项
        yearFilter.innerHTML = '<option value="all">全部年份</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + '年';
            yearFilter.appendChild(option);
        });
        
        // 添加筛选事件
        yearFilter.removeEventListener('change', this.handleYearFilterChange);
        yearFilter.addEventListener('change', this.handleYearFilterChange.bind(this));
    }
    
    /**
     * 处理年份筛选变化
     */
    handleYearFilterChange() {
        const selectedYear = document.getElementById('year-filter').value;
        const pet = PetModule.getPetById(this.currentPetId);
        
        if (!pet || !pet.photos) return;
        
        let filteredPhotos = pet.photos;
        if (selectedYear !== 'all') {
            filteredPhotos = pet.photos.filter(photo => {
                return new Date(photo.date).getFullYear().toString() === selectedYear;
            });
        }
        
        const photoGrid = document.querySelector('.photo-masonry');
        if (filteredPhotos.length === 0) {
            photoGrid.innerHTML = '<div class="no-data">该年份暂无照片</div>';
            return;
        }
        
        // 重新渲染照片
        photoGrid.innerHTML = filteredPhotos.map(photo => {
            const likedClass = photo.liked ? 'liked' : '';
            const heartIcon = photo.liked ? 'fas' : 'far';
            
            return `
                <div class="photo-item" data-id="${photo.id}">
                    <img src="${photo.url}" alt="${photo.description || '宠物照片'}">
                    <div class="photo-overlay">
                        <p class="photo-date">${photo.date}</p>
                        <p class="photo-desc">${photo.description || ''}</p>
                    </div>
                    <div class="photo-actions">
                        <button class="photo-like-btn ${likedClass}" data-photo-id="${photo.id}">
                            <i class="${heartIcon} fa-heart"></i>
                            <span>${photo.likeCount}</span>
                        </button>
                        <button class="photo-delete-btn" data-photo-id="${photo.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        // 绑定照片删除事件
        document.querySelectorAll('.photo-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const photoId = btn.dataset.photoId;
                if (confirm('确定要删除这张照片吗？')) {
                    if (PetModule.deletePhoto(this.currentPetId, photoId)) {
                        this.handleYearFilterChange();
                    } else {
                        alert('删除失败，请重试');
                    }
                }
            });
        });
        
        // 绑定照片点赞事件
        document.querySelectorAll('.photo-like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const photoId = btn.dataset.photoId;
                const updatedPhoto = PetModule.togglePhotoLike(this.currentPetId, photoId);
                if (updatedPhoto) {
                    // 更新按钮样式和点赞数
                    const likeBtn = document.querySelector(`.photo-like-btn[data-photo-id="${photoId}"]`);
                    if (likeBtn) {
                        if (updatedPhoto.liked) {
                            likeBtn.classList.add('liked');
                            likeBtn.querySelector('i').classList.remove('far');
                            likeBtn.querySelector('i').classList.add('fas');
                        } else {
                            likeBtn.classList.remove('liked');
                            likeBtn.querySelector('i').classList.remove('fas');
                            likeBtn.querySelector('i').classList.add('far');
                        }
                        likeBtn.querySelector('span').textContent = updatedPhoto.likeCount;
                    }
                }
            });
        });
    }
    
    /**
     * 更新日记Tab内容
     * @param {Object} pet - 宠物数据
     */
    updateDiaryTab(pet) {
        const diaryEntries = document.querySelector('.diary-entries');
        if (!diaryEntries || !pet.diaries || pet.diaries.length === 0) {
            diaryEntries.innerHTML = '<div class="no-data">暂无日记</div>';
            return;
        }
        
        diaryEntries.innerHTML = pet.diaries.map(diary => {
            const tagsHtml = diary.tags && diary.tags.length > 0
                ? `<div class="diary-tags">
                    ${diary.tags.map(tag => `<span class="diary-tag">${tag}</span>`).join('')}
                  </div>`
                : '';
            
            return `
                <div class="diary-entry" data-id="${diary.id}">
                    <div class="diary-date">${diary.date} - ${diary.title}</div>
                    <div class="diary-content">${diary.content}</div>
                    ${tagsHtml}
                </div>
            `;
        }).join('');
        
        // 简单的月历实现
        this.renderCalendar();
    }
    
    /**
     * 渲染简单的月历
     */
    renderCalendar() {
        const calendarContainer = document.querySelector('.calendar-container');
        if (!calendarContainer) return;
        
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        let calendarHtml = `<div class="calendar-header">${year}年${month + 1}月</div>`;
        calendarHtml += '<div class="calendar-weekdays">日 一 二 三 四 五 六</div>';
        calendarHtml += '<div class="calendar-days">';
        
        // 空白日期
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarHtml += '<div class="calendar-day empty"></div>';
        }
        
        // 日期
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEntry = this.checkDateHasDiary(dateStr);
            const dayClass = hasEntry ? 'has-entry' : '';
            
            calendarHtml += `<div class="calendar-day ${dayClass}" data-date="${dateStr}">${day}</div>`;
        }
        
        calendarHtml += '</div>';
        calendarContainer.innerHTML = calendarHtml;
    }
    
    /**
     * 检查日期是否有日记
     * @param {string} date - 日期字符串 YYYY-MM-DD
     * @returns {boolean} 是否有日记
     */
    checkDateHasDiary(date) {
        const pet = PetModule.getPetById(this.currentPetId);
        if (!pet || !pet.diaries) return false;
        
        return pet.diaries.some(diary => diary.date === date);
    }
    
    /**
     * 处理照片点赞
     * @param {string} photoId - 照片ID
     */
    handlePhotoLike(photoId) {
        const updatedPhoto = PetModule.togglePhotoLike(this.currentPetId, photoId);
        if (updatedPhoto) {
            const likeBtn = document.querySelector(`.photo-like-btn[data-photo-id="${photoId}"]`);
            if (likeBtn) {
                // 更新点赞状态和数量
                if (updatedPhoto.liked) {
                    likeBtn.classList.add('liked');
                    likeBtn.querySelector('i').className = 'fas fa-heart';
                } else {
                    likeBtn.classList.remove('liked');
                    likeBtn.querySelector('i').className = 'far fa-heart';
                }
                likeBtn.querySelector('span').textContent = updatedPhoto.likeCount;
            }
        }
    }
    
    /**
     * 处理添加成长记录
     */
    handleAddGrowthRecord() {
        // 移除之前的模态框（如果存在）
        var existingModal = document.getElementById('add-growth-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 显示添加成长记录模态框
        this.showAddGrowthModal();
    }
    
    /**
     * 显示添加成长记录模态框
     */
    showAddGrowthModal() {
        // 获取当前日期
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        var dateStr = year + '-' + month + '-' + day;
        
        // 创建添加成长记录表单
        var modalHTML = "<div id='add-growth-modal' class='modal-overlay'>" +
            "<div class='modal-content'>" +
                "<div class='modal-header'>" +
                    "<h3>添加成长记录</h3>" +
                    "<button id='close-growth-modal' class='close-btn'>×</button>" +
                "</div>" +
                "<form id='add-growth-form'>" +
                    "<div class='form-group'>" +
                        "<label for='record-type'>记录类型：</label>" +
                        "<select id='record-type'>" +
                            "<option value='milestone'>里程碑</option>" +
                            "<option value='weight'>体重记录</option>" +
                        "</select>" +
                    "</div>" +
                    "<div class='form-group'>" +
                        "<label for='record-date'>日期：</label>" +
                        "<input type='date' id='record-date' value='" + dateStr + "' required>" +
                    "</div>" +
                    "<div id='milestone-content-group' class='form-group'>" +
                        "<label for='milestone-content'>内容：</label>" +
                        "<textarea id='milestone-content' rows='4' placeholder='请输入里程碑内容'></textarea>" +
                    "</div>" +
                    "<div id='weight-content-group' class='form-group' style='display: none;'>" +
                        "<label for='weight-value'>体重：</label>" +
                        "<input type='number' id='weight-value' step='0.1' placeholder='请输入体重'>" +
                        "<input type='text' id='weight-unit' value='kg' placeholder='单位'>" +
                    "</div>" +
                    "<div class='form-actions'>" +
                        "<button type='submit' class='btn btn-primary'>保存</button>" +
                        "<button type='button' id='cancel-add-growth' class='btn btn-secondary'>取消</button>" +
                    "</div>" +
                "</form>" +
            "</div>" +
        "</div>";
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 初始化模态框事件
        this.initAddGrowthModalEvents();
    }
    
    /**
     * 初始化添加成长记录模态框事件
     */
    initAddGrowthModalEvents() {
        var self = this;
        
        // 确保模态框存在
        var modal = document.getElementById('add-growth-modal');
        if (!modal) return;
        
        // 关闭按钮事件
        var closeBtn = document.getElementById('close-growth-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });
        }
        
        // 取消按钮事件
        var cancelBtn = document.getElementById('cancel-add-growth');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                modal.remove();
            });
        }
        
        // 点击外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 记录类型切换事件
        var recordType = document.getElementById('record-type');
        if (recordType) {
            recordType.addEventListener('change', function() {
                const milestoneGroup = document.getElementById('milestone-content-group');
                const weightGroup = document.getElementById('weight-content-group');
                
                if (this.value === 'milestone') {
                    milestoneGroup.style.display = 'block';
                    weightGroup.style.display = 'none';
                } else {
                    milestoneGroup.style.display = 'none';
                    weightGroup.style.display = 'block';
                }
            });
        }
        
        // 表单提交事件
        var form = document.getElementById('add-growth-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // 获取表单数据
                var type = document.getElementById('record-type').value;
                var date = document.getElementById('record-date').value;
                
                // 根据类型获取不同的内容
                var record = {
                    type: type,
                    date: date
                };
                
                if (type === 'milestone') {
                    var content = document.getElementById('milestone-content').value.trim();
                    if (!content) {
                        alert('请填写里程碑内容');
                        return;
                    }
                    record.content = content;
                } else if (type === 'weight') {
                    var weight = document.getElementById('weight-value').value;
                    var unit = document.getElementById('weight-unit').value.trim();
                    
                    if (!weight) {
                        alert('请填写体重');
                        return;
                    }
                    
                    record.weight = parseFloat(weight);
                    record.unit = unit || 'kg';
                }
                
                // 保存成长记录
                if (PetModule.addGrowthRecord(self.currentPetId, record)) {
                    alert('成长记录添加成功');
                    modal.remove();
                    // 重新加载成长记录
                    var pet = PetModule.getPetById(self.currentPetId);
                    self.updateGrowthTab(pet);
                } else {
                    alert('成长记录添加失败，请重试');
                }
            });
        }
    }
    
    /**
     * 处理编辑宠物
     */
    handleEditPet() {
        // 移除之前的模态框（如果存在）
        const existingModal = document.getElementById('edit-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 显示编辑模态框
        this.showEditModal();
    }
    
    /**
     * 处理删除宠物
     */
    handleDeletePet() {
        if (confirm('确定要删除这个宠物吗？此操作不可恢复。')) {
            if (PetModule.deletePet(this.currentPetId)) {
                alert('宠物删除成功');
                window.location.href = 'pets.html';
            } else {
                alert('删除失败，请重试');
            }
        }
    }
    
    /**
     * 显示编辑模态框
     */
    showEditModal() {
        const pet = PetModule.getPetById(this.currentPetId);
        if (!pet) return;
        
        // 创建编辑表单
        const modalHTML = `
        <div id="edit-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>编辑宠物信息</h3>
                    <button id="close-modal" class="close-btn">×</button>
                </div>
                <form id="edit-form">
                    <div class="form-group">
                        <label for="pet-name">宠物名称：</label>
                        <input type="text" id="pet-name" value="${pet.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="pet-breed">品种：</label>
                        <input type="text" id="pet-breed" value="${pet.breed || ''}">
                    </div>
                    <div class="form-group">
                        <label for="pet-birthdate">出生日期：</label>
                        <input type="date" id="pet-birthdate" value="${pet.birthDate || ''}">
                    </div>
                    <div class="form-group">
                        <label for="pet-gender">性别：</label>
                        <select id="pet-gender">
                            <option value="公" ${pet.gender === '公' ? 'selected' : ''}>公</option>
                            <option value="母" ${pet.gender === '母' ? 'selected' : ''}>母</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="pet-weight">体重（kg）：</label>
                        <input type="number" id="pet-weight" value="${pet.weight || ''}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label for="pet-color">毛色：</label>
                        <input type="text" id="pet-color" value="${pet.color || ''}">
                    </div>
                    <div class="form-group">
                        <label for="pet-personality">个性特点（用逗号分隔）：</label>
                        <input type="text" id="pet-personality" value="${Array.isArray(pet.personality) ? pet.personality.join(', ') : (pet.personality || '')}" placeholder="用逗号分隔">
                    </div>
                    <div class="form-group">
                        <label for="pet-avatar">头像URL：</label>
                        <input type="url" id="pet-avatar" value="${pet.avatar || 'https://picsum.photos/id/237/200/200'}">
                        <small>提示：可以使用 https://picsum.photos/id/237/200/200 获取示例图片</small>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">保存</button>
                        <button type="button" id="cancel-edit" class="btn btn-secondary">取消</button>
                    </div>
                </form>
            </div>
        </div>
        `;
        
        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 初始化模态框事件
        this.initModalEvents();
    }
    
    /**
     * 初始化模态框事件
     */
    initModalEvents() {
        // 确保模态框存在
        const modal = document.getElementById('edit-modal');
        if (!modal) return;
        
        // 获取当前宠物数据
        const pet = PetModule.getPetById(this.currentPetId);
        if (!pet) {
            alert('无法获取宠物数据');
            modal.remove();
            return;
        }
        
        // 移除旧的事件监听器 - 关闭按钮
        const closeBtn = document.getElementById('close-modal');
        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            newCloseBtn.addEventListener('click', () => modal.remove());
        }
        
        // 移除旧的事件监听器 - 取消按钮
        const cancelBtn = document.getElementById('cancel-edit');
        if (cancelBtn) {
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            newCancelBtn.addEventListener('click', () => modal.remove());
        }
        
        // 点击外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // 移除旧的事件监听器 - 表单提交
        const form = document.getElementById('edit-form');
        if (form) {
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // 获取表单数据
                const updatedPet = {
                    ...pet,
                    name: newForm.querySelector('#pet-name').value.trim(),
                    breed: newForm.querySelector('#pet-breed').value.trim(),
                    gender: newForm.querySelector('#pet-gender').value,
                    birthDate: newForm.querySelector('#pet-birthdate').value,
                    weight: newForm.querySelector('#pet-weight').value,
                    color: newForm.querySelector('#pet-color').value.trim(),
                    personality: newForm.querySelector('#pet-personality').value.trim()
                        .split(',')
                        .map(p => p.trim())
                        .filter(p => p !== ''),
                    avatar: newForm.querySelector('#pet-avatar').value.trim() || 'https://picsum.photos/id/237/200/200'
                };
                
                // 验证表单
                if (!updatedPet.name) {
                    alert('请输入宠物名称');
                    return;
                }
                
                // 保存更新后的宠物数据
                if (PetModule.savePet(updatedPet)) {
                    alert('宠物信息更新成功');
                    modal.remove();
                    // 重新加载宠物数据
                    this.loadPetData(this.currentPetId);
                } else {
                    alert('更新失败，请重试');
                }
            });
        }
    }
}

// 导出默认模块
export default PetsApp;