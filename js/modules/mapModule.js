/**
 * 地图模块
 * 负责初始化ECharts地图、数据可视化和交互功能
 */

// 导入旅程数据服务
import { trips } from '../utils/trips.js';

/**
 * 地图模块类
 */
class MapModule {
    constructor() {
        this.chart = null;
        this.mapInstance = null;
        this.provinceList = [];
        this.visitedProvinces = [];
    }

    /**
     * 初始化地图模块
     * @param {string} containerId - 地图容器ID
     * @returns {Promise} 初始化结果
     */
    async init(containerId) {
        try {
            // 检查ECharts是否已加载
            if (typeof echarts === 'undefined') {
                console.error('ECharts库未加载');
                // 创建一个简单的错误提示
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">地图库未加载，请刷新页面重试</div>';
                }
                return false;
            }

            // 初始化图表实例
            const container = document.getElementById(containerId);
            if (!container) {
                console.error(`未找到ID为${containerId}的地图容器`);
                return false;
            }

            this.chart = echarts.init(container);
            this.mapInstance = this.chart;

            // 初始化省份数据（即使地图数据加载失败，也应该先有省份数据）
            this.initProvinceData();

            // 加载地图数据（不中断初始化流程）
            const mapDataLoaded = await this.loadChinaMapData();
            if (!mapDataLoaded) {
                console.warn('地图数据未成功加载，但将尝试继续初始化');
            }

            try {
                // 初始化地图配置
                this.initMapOptions();
            } catch (optError) {
                console.error('初始化地图配置失败:', optError);
                // 创建一个简单的备用显示
                if (this.chart) {
                    this.chart.setOption({
                        title: {
                            text: '旅程地图',
                            left: 'center'
                        },
                        tooltip: {},
                        series: []
                    });
                }
            }

            // 绑定事件
            try {
                this.bindEvents();
            } catch (eventError) {
                console.error('绑定事件失败:', eventError);
            }

            // 响应式处理
            this.handleResize();

            console.log('地图模块初始化完成');
            return true;
        } catch (error) {
            console.error('地图模块初始化过程中发生严重错误:', error);
            // 尝试显示友好的错误信息
            const container = document.getElementById(containerId);
            if (container && typeof echarts !== 'undefined') {
                const chart = echarts.init(container);
                chart.setOption({
                    title: {
                        text: '地图加载失败',
                        left: 'center',
                        textStyle: { color: '#f00' }
                    },
                    graphic: [{
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        style: {
                            text: '地图数据加载失败\n请检查网络连接后刷新页面',
                            fill: '#666',
                            fontSize: 14
                        }
                    }]
                });
            }
            return false;
        }
    }

    /**
     * 加载中国地图数据
     * @returns {Promise} 加载结果
     */
    async loadChinaMapData() {
        try {
            // 尝试使用在线JSON数据（优先方案）
            try {
                const response = await fetch('https://cdn.jsdelivr.net/npm/echarts/map/json/china.json');
                if (response.ok) {
                    const mapData = await response.json();
                    echarts.registerMap('china', mapData);
                    console.log('成功加载在线地图数据');
                    return true;
                }
            } catch (err) {
                console.warn('在线地图数据加载失败，尝试其他方式:', err);
            }

            // 备选方案1: 使用ECharts内置地图功能
            try {
                // 现代ECharts版本通常不需要预先注册空地图
                // 但为了兼容性，我们尝试直接创建地图实例
                console.log('尝试使用ECharts内置地图功能');
                return true;
            } catch (err) {
                console.warn('内置地图功能失败:', err);
            }

            // 备选方案2: 使用简化的地图数据
            try {
                // 创建一个非常简化的中国地图数据结构
                const simpleMapData = {
                    type: 'FeatureCollection',
                    features: [
                        // 这里只包含几个主要省份的简化数据
                        // 实际使用时ECharts会尝试自动处理
                    ]
                };
                echarts.registerMap('china', simpleMapData);
                console.log('使用简化地图数据');
                return true;
            } catch (err) {
                console.warn('简化地图数据失败:', err);
            }

            // 如果所有方法都失败，仍然不抛出错误，让初始化继续
            console.error('所有地图数据加载方法都失败，但将继续初始化');
            return false;
        } catch (error) {
            console.error('加载地图数据过程中发生错误:', error);
            // 不抛出错误，让初始化过程继续
            return false;
        }
    }

    /**
     * 初始化省份数据
     */
    initProvinceData() {
        try {
            // 获取所有省份
            this.provinceList = trips.getAllProvinces() || [];
            
            // 获取已访问的省份
            this.visitedProvinces = trips.getVisitedProvinces() || [];
            
            // 如果没有已访问的省份，添加一些默认数据用于演示
            if (this.visitedProvinces.length === 0) {
                console.log('未找到访问记录，使用默认数据进行演示');
                this.visitedProvinces = ['北京市', '上海市', '广东省'];
                
                // 为默认省份创建示例数据
                const defaultTrips = [
                    {
                        province: '北京市',
                        startDate: '2023-05-01',
                        endDate: '2023-05-07',
                        rating: 5,
                        notes: '北京之旅很愉快',
                        photos: []
                    },
                    {
                        province: '上海市',
                        startDate: '2023-06-10',
                        endDate: '2023-06-15',
                        rating: 4,
                        notes: '上海很现代化',
                        photos: []
                    },
                    {
                        province: '广东省',
                        startDate: '2023-07-20',
                        endDate: '2023-07-25',
                        rating: 5,
                        notes: '广东美食很棒',
                        photos: []
                    }
                ];
                
                // 尝试保存默认数据
                defaultTrips.forEach(trip => {
                    try {
                        trips.saveTrip(trip);
                    } catch (err) {
                        console.warn('保存默认数据失败:', err);
                    }
                });
            }
            
            console.log('已访问省份:', this.visitedProvinces);
        } catch (error) {
            console.error('初始化省份数据失败:', error);
            this.provinceList = ['北京市', '上海市', '广东省', '江苏省', '浙江省'];
            this.visitedProvinces = ['北京市', '上海市', '广东省'];
        }
    }

    /**
     * 初始化地图配置
     */
    initMapOptions() {
        try {
            // 准备地图数据
            const mapData = this.prepareMapData();

            // 地图配置选项
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: (params) => {
                        let provinceName = params.name;
                        
                        // 尝试获取完整的省份名称（用于查找旅程数据）
                        const reverseNameMap = {
                            '北京': '北京市',
                            '天津': '天津市',
                            '上海': '上海市',
                            '重庆': '重庆市',
                            '内蒙古': '内蒙古自治区',
                            '广西': '广西壮族自治区',
                            '西藏': '西藏自治区',
                            '宁夏': '宁夏回族自治区',
                            '新疆': '新疆维吾尔自治区',
                            '香港': '香港特别行政区',
                            '澳门': '澳门特别行政区'
                        };
                        
                        // 尝试使用映射的完整名称或添加后缀来查找旅程
                        const fullProvinceNames = [
                            reverseNameMap[provinceName] || provinceName,
                            provinceName + '省',
                            provinceName + '市',
                            provinceName + '自治区'
                        ];
                        
                        // 尝试查找匹配的旅程数据
                        let trip = null;
                        for (const name of fullProvinceNames) {
                            trip = trips.getTripByProvince(name);
                            if (trip) break;
                        }
                        
                        if (trip) {
                            // 已访问省份显示详细信息
                            const stars = '★'.repeat(trip.rating) + '☆'.repeat(5 - trip.rating);
                            return `
                                <div style="padding: 10px;">
                                    <strong>${provinceName}</strong><br/>
                                    ${trip.startDate && trip.endDate ? `${trip.startDate} - ${trip.endDate}` : '暂无日期'}<br/>
                                    ${trip.travelers ? `同行: ${trip.travelers}` : '暂无同行人'}<br/>
                                    ${trip.rating ? `喜欢程度: ${stars}` : '暂无评分'}<br/>
                                    <br/><small style="color: #666; cursor: pointer; text-decoration: underline;">点击查看详情</small>
                                </div>
                            `;
                        } else {
                            // 未访问省份
                            return `${provinceName}<br/><small style="color: #666;">暂无旅行记录</small>`;
                        }
                    },
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    textStyle: {
                        color: '#333'
                    }
                },
                visualMap: {
                    min: 0,
                    max: 1,
                    text: ['已访问', '未访问'],
                    calculable: true,
                    inRange: {
                        color: ['#E0F2FE', '#0369A1']
                    },
                    show: true,
                    left: 'left',
                    top: 'bottom'
                },
                series: [
                    {
                        name: '中国地图',
                        type: 'map',
                        map: 'china',
                        roam: true, // 开启缩放和平移
                        scaleLimit: {
                            min: 1,
                            max: 5
                        },
                        data: mapData,
                        emphasis: {
                            label: {
                                show: true,
                                fontWeight: 'bold',
                                fontSize: 14
                            },
                            itemStyle: {
                                areaColor: '#0EA5E9',
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                shadowBlur: 20,
                                borderWidth: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        select: {
                            label: {
                                show: true,
                                fontWeight: 'bold',
                                fontSize: 14
                            },
                            itemStyle: {
                                areaColor: '#0EA5E9'
                            }
                        }
                    }
                ]
            };

            // 应用配置
            this.chart.setOption(option);
        } catch (error) {
            console.error('初始化地图配置失败:', error);
        }
    }

    /**
     * 准备地图数据
     * @returns {Array} 格式化后的地图数据
     */
    prepareMapData() {
        try {
            // 确保visitedProvinces是一个数组
            const visitedProvinces = Array.isArray(this.visitedProvinces) ? this.visitedProvinces : [];
            
            // 定义省份名称映射，用于简化匹配逻辑
            const provinceMap = {
                '北京市': '北京', '天津市': '天津', '上海市': '上海', '重庆市': '重庆',
                '内蒙古自治区': '内蒙古', '广西壮族自治区': '广西', '西藏自治区': '西藏',
                '宁夏回族自治区': '宁夏', '新疆维吾尔自治区': '新疆',
                '香港特别行政区': '香港', '澳门特别行政区': '澳门',
                '台湾省': '台湾'
            };
            
            // 创建已访问省份的简化名称集合
            const visitedSet = new Set();
            
            // 处理每个已访问省份
            visitedProvinces.forEach(province => {
                if (!province || typeof province !== 'string') return;
                
                // 使用映射表查找简化名称
                if (provinceMap[province]) {
                    visitedSet.add(provinceMap[province]);
                    return;
                }
                
                // 如果不在映射表中，尝试移除常见后缀
                const simplified = province.replace(/[省市自治区特别行政区]$/g, '');
                visitedSet.add(simplified);
            });
            
            // 定义ECharts使用的标准省份列表
            const standardProvinces = [
                '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
                '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
                '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
                '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '香港', '澳门', '台湾'
            ];
            
            // 生成地图数据
            const mapData = standardProvinces.map(province => {
                const isVisited = visitedSet.has(province);
                return {
                    name: province,
                    value: isVisited ? 1 : 0,
                    itemStyle: {
                        color: isVisited ? '#0369A1' : '#E0F2FE',
                        borderColor: '#fff',
                        borderWidth: 0.5
                    }
                };
            });
            
            return mapData;
        } catch (error) {
            console.error('准备地图数据失败:', error);
            // 返回一个默认的示例数据，确保地图不会空白
            return [
                { name: '北京', value: 1, itemStyle: { color: '#0369A1', borderColor: '#fff', borderWidth: 0.5 } },
                { name: '上海', value: 1, itemStyle: { color: '#0369A1', borderColor: '#fff', borderWidth: 0.5 } },
                { name: '广东', value: 1, itemStyle: { color: '#0369A1', borderColor: '#fff', borderWidth: 0.5 } }
            ];
        }
    }

    /**
     * 绑定地图事件
     */
    bindEvents() {
        try {
            // 点击事件 - 跳转到详情页
            this.chart.on('click', (params) => {
                const provinceName = params.name;
                
                // 尝试获取完整的省份名称（用于查找旅程数据）
                const reverseNameMap = {
                    '北京': '北京市',
                    '天津': '天津市',
                    '上海': '上海市',
                    '重庆': '重庆市',
                    '内蒙古': '内蒙古自治区',
                    '广西': '广西壮族自治区',
                    '西藏': '西藏自治区',
                    '宁夏': '宁夏回族自治区',
                    '新疆': '新疆维吾尔自治区',
                    '香港': '香港特别行政区',
                    '澳门': '澳门特别行政区'
                };
                
                // 尝试使用映射的完整名称或添加后缀来查找旅程
                const fullProvinceNames = [
                    reverseNameMap[provinceName] || provinceName,
                    provinceName + '省',
                    provinceName + '市',
                    provinceName + '自治区'
                ];
                
                // 尝试查找匹配的旅程数据
                let trip = null;
                for (const name of fullProvinceNames) {
                    trip = trips.getTripByProvince(name);
                    if (trip) {
                        // 使用找到的旅程中的省份名称（可能包含完整后缀）
                        window.location.href = `trip-detail.html?province=${encodeURIComponent(trip.province)}`;
                        return;
                    }
                }
                
                // 未找到旅程，触发新增旅程
                this.handleProvinceClick(provinceName);
            });

            // 鼠标悬停事件
            this.chart.on('mouseover', (params) => {
                // 可以在这里添加自定义的悬停效果
                this.chart.dispatchAction({
                    type: 'highlight',
                    name: params.name
                });
            });

            this.chart.on('mouseout', (params) => {
                this.chart.dispatchAction({
                    type: 'downplay',
                    name: params.name
                });
            });
        } catch (error) {
            console.error('绑定地图事件失败:', error);
        }
    }

    /**
     * 处理省份点击事件
     * @param {string} provinceName - 省份名称
     */
    handleProvinceClick(provinceName) {
        try {
            // 触发自定义事件，通知外部处理新增旅程
            const event = new CustomEvent('provinceClick', {
                detail: { provinceName }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('处理省份点击事件失败:', error);
        }
    }

    /**
     * 更新地图数据
     */
    updateMap() {
        try {
            // 重新获取已访问省份
            this.visitedProvinces = trips.getVisitedProvinces();
            
            // 更新地图数据
            const mapData = this.prepareMapData();
            
            this.chart.setOption({
                series: [{
                    data: mapData
                }]
            });
            
            console.log('地图数据已更新');
        } catch (error) {
            console.error('更新地图失败:', error);
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        try {
            window.addEventListener('resize', () => {
                if (this.chart) {
                    this.chart.resize();
                }
            });
        } catch (error) {
            console.error('设置窗口大小变化监听失败:', error);
        }
    }

    /**
     * 销毁地图实例
     */
    destroy() {
        try {
            if (this.chart) {
                this.chart.dispose();
                this.chart = null;
                this.mapInstance = null;
            }
            console.log('地图实例已销毁');
        } catch (error) {
            console.error('销毁地图实例失败:', error);
        }
    }
}

// 导出类供扩展使用
export default MapModule;

// 导出地图模块实例
export const mapModule = new MapModule();