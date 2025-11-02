/**
 * 相册页面应用 - 处理相册页面的UI交互和数据展示
 */

/**
 * 相册页面应用类
 */
class GalleryApp {
    constructor() {
        // 初始化应用
        this.init();
    }
    
    /**
     * 初始化应用
     */
    init() {
        // 加载导航栏
        this.loadNavbar();
        
        // 高亮当前页面
        this.highlightCurrentPage('gallery.html');
    }

    /**
     * 加载导航栏
     */
    loadNavbar() {
        // 简单的导航栏实现
        const nav = document.getElementById('navbar');
        if (nav) {
            nav.innerHTML = `
                <div class="nav-container">
                    <a href="../index.html" class="logo">个人成长</a>
                    <div class="nav-links">
                        <a href="trips.html">旅程</a>
                        <a href="gallery.html">相册</a>
                        <a href="reading.html">读书</a>
                        <a href="hobbies.html">兴趣爱好</a>
                        <a href="pets.html">宠物</a>
                        <a href="my-profile.html">我的</a>
                    </div>
                </div>
            `;
        }
    }

    /**
     * 高亮当前页面
     * @param {string} pageName 当前页面文件名
     */
    highlightCurrentPage(pageName) {
        const navLinks = document.querySelectorAll('#navbar a');
        navLinks.forEach(link => {
            if (link.href.includes(pageName)) {
                link.classList.add('active');
            }
        });
    }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
    const galleryApp = new GalleryApp();
});