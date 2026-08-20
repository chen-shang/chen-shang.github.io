/**
 * AI纪元 - 公共脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化滚动动画
    initScrollAnimations();

    // 初始化导航高亮
    initNavigationHighlight();
});

/**
 * 滚动动画 - 当元素进入视口时触发动画
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0,
        rootMargin: '0px 0px 120px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有需要渐入的元素（文章正文用 .fade-in，首页用 .chapter-card）
    document.querySelectorAll('.fade-in, .chapter-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

/**
 * 导航高亮 - 当前页面的导航链接添加active类
 */
function initNavigationHighlight() {
    const links = Array.from(document.querySelectorAll('.nav-links a'));
    const currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || links.length === 0) return;

    const updateActiveLink = () => {
        const currentHash = window.location.hash;
        const candidates = links.filter(link => {
            const target = new URL(link.getAttribute('href'), window.location.href);
            return target.pathname.split('/').pop() === currentPath;
        });

        let activeLink = null;
        if (candidates.length > 1) {
            activeLink = candidates.find(link => {
                const target = new URL(link.getAttribute('href'), window.location.href);
                return target.hash === currentHash;
            });
            activeLink = activeLink || candidates[0];
        } else if (candidates.length === 1) {
            activeLink = candidates[0];
        } else {
            activeLink = links.find(link => link.classList.contains('active'));
        }

        if (!activeLink) return;

        links.forEach(link => {
            const isActive = link === activeLink;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });

        window.requestAnimationFrame(() => {
            const navList = activeLink.closest('.nav-links');
            if (!navList) return;

            const targetLeft = activeLink.offsetLeft
                - (navList.clientWidth - activeLink.offsetWidth) / 2;
            navList.scrollTo({
                left: Math.max(0, targetLeft),
                behavior: 'smooth'
            });
        });
    };

    updateActiveLink();
    window.addEventListener('hashchange', updateActiveLink);

    // 初始化部门折叠卡片
    initDepartmentAccordion();
}

/**
 * AMC部门折叠卡片 - 点击展开详细职责
 */
function initDepartmentAccordion() {
    const heads = document.querySelectorAll('.dept-head');
    if (!heads.length) return;

    heads.forEach(head => {
        head.addEventListener('click', () => {
            const expanded = head.getAttribute('aria-expanded') === 'true';
            const detail = document.getElementById(head.getAttribute('aria-controls'));
            if (!detail) return;

            head.setAttribute('aria-expanded', String(!expanded));
            if (expanded) {
                detail.setAttribute('hidden', '');
            } else {
                detail.removeAttribute('hidden');
            }
        });
    });
}

/**
 * 平滑滚动到锚点
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


/* ==========================================
   文章目录侧边栏（TOC Sidebar）
   ========================================== */
(function initTocSidebar() {
    const btn = document.querySelector('.toc-toggle-btn');
    const sidebar = document.getElementById('tocSidebar');
    const overlay = document.getElementById('tocOverlay');
    if (!btn || !sidebar || !overlay) return;

    const links = sidebar.querySelectorAll('.toc-link');
    if (!links.length) return;

    const sections = [...links]
        .map((l) => document.getElementById(l.getAttribute('href').replace('#', '')))
        .filter(Boolean);

    const openSidebar = () => {
        sidebar.classList.add('is-open');
        overlay.classList.add('is-open');
        btn.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
    };
    const closeSidebar = () => {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-open');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        document.documentElement.style.removeProperty('overflow');
        document.body.style.removeProperty('overflow');
    };
    window.closeTocSidebar = closeSidebar;

    btn.addEventListener('click', () => {
        sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener('click', closeSidebar);
    links.forEach((link) =>
        link.addEventListener('click', () => {
            setTimeout(closeSidebar, 150);
        }),
    );
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) closeSidebar();
    });

    const setActiveLink = () => {
        let current = sections[0] && sections[0].id;
        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 160) current = section.id;
        }
        links.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.section === current);
        });
    };

    const updateBodyOverflow = () => {
        if (sidebar.classList.contains('is-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.removeProperty('overflow');
        }
    };

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach((link) =>
                        link.classList.toggle('is-active', link.dataset.section === id),
                    );
                }
            }
        },
        { rootMargin: '-160px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((s) => s && observer.observe(s));

    window.addEventListener('scroll', () => {
        setActiveLink();
        updateBodyOverflow();
    }, { passive: true });
    setActiveLink();
})();
