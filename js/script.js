// 主题切换
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// 初始化主题
const savedTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
setTheme(savedTheme);

// 移动端菜单
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// 语言切换
function getCurrentLang() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || 'zh';
}

// Markdown加载和渲染
async function loadMarkdownContent(page = 'home') {
    const lang = getCurrentLang();
    try {
        const response = await fetch(`/md/${lang}/${page}.md`);
        if (!response.ok) throw new Error('Content not found');
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        
        const content = document.getElementById('content');
        content.innerHTML = `<div class="markdown-content">${html}</div>`;
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// 路由处理
function handleRoute() {
    const path = window.location.pathname;
    const page = path.substring(1) || 'home';
    loadMarkdownContent(page);
}

// 初始化
window.addEventListener('popstate', handleRoute);
document.addEventListener('DOMContentLoaded', () => {
    handleRoute();
    
    // 处理导航点击
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            const lang = getCurrentLang();
            
            history.pushState(null, '', `/${page}?lang=${lang}`);
            loadMarkdownContent(page);
        });
    });
}); 