/**
 * AI纪元 - 学习地图交互脚本
 */

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG = {
        storageKey: 'ai_epoch_progress',
        animationDuration: 300,
        levelCount: 9
    };

    // ==================== 成就定义 ====================
    const ACHIEVEMENTS = [
        {
            id: 'first_step',
            name: '初心学徒',
            icon: '🌟',
            description: '完成序章',
            condition: (progress) => progress.completedLevels.includes(1)
        },
        {
            id: 'historian',
            name: '历史学者',
            icon: '📚',
            description: '完成AI前世今生',
            condition: (progress) => progress.completedLevels.includes(2)
        },
        {
            id: 'ml_warrior',
            name: '算法战士',
            icon: '⚔️',
            description: '完成机器学习',
            condition: (progress) => progress.completedLevels.includes(3)
        },
        {
            id: 'dl_master',
            name: '神经网络大师',
            icon: '🧠',
            description: '完成深度学习',
            condition: (progress) => progress.completedLevels.includes(4)
        },
        {
            id: 'snn_explorer',
            name: '脉冲探索者',
            icon: '💡',
            description: '完成脉冲神经网络',
            condition: (progress) => progress.completedLevels.includes(5)
        },
        {
            id: 'agent_developer',
            name: 'Agent开发者',
            icon: '🤖',
            description: '完成Agent开发',
            condition: (progress) => progress.completedLevels.includes(7)
        },
        {
            id: 'full_stack',
            name: '全栈AI工程师',
            icon: '🏆',
            description: '完成所有章节',
            condition: (progress) => progress.completedLevels.length >= 9
        },
        {
            id: 'deep_learning_explorer',
            name: '深度学习探索者',
            icon: '🔬',
            description: '完成所有深度学习相关章节',
            condition: (progress) => [4, 5].every(id => progress.completedLevels.includes(id))
        },
        {
            id: 'practical',
            name: '实践派',
            icon: '🛠️',
            description: '完成所有实践类章节',
            condition: (progress) => [7, 8].every(id => progress.completedLevels.includes(id))
        },
        {
            id: 'legend',
            name: 'AI纪元传说',
            icon: '👑',
            description: '解锁所有其他成就',
            condition: (progress) => {
                const otherAchievements = ACHIEVEMENTS.filter(a => a.id !== 'legend');
                return otherAchievements.every(a => a.condition(progress));
            }
        }
    ];

    // ==================== 状态管理 ====================
    let progress = {
        completedLevels: [],
        earnedAchievements: [],
        lastVisit: null
    };

    // ==================== DOM元素 ====================
    const elements = {
        achievementGrid: document.getElementById('achievementGrid'),
        progressFill: document.getElementById('progressFill'),
        completedCount: document.getElementById('completedCount'),
        levelNodes: document.querySelectorAll('.level-node'),
        mapPaths: document.querySelector('.map-paths')
    };

    // ==================== 初始化 ====================
    function init() {
        loadProgress();
        renderAchievements();
        renderLevelNodes();
        renderPaths();
        updateProgress();
        bindEvents();
    }

    // ==================== 进度管理 ====================
    function loadProgress() {
        const saved = localStorage.getItem(CONFIG.storageKey);
        if (saved) {
            try {
                progress = JSON.parse(saved);
            } catch (e) {
                console.error('Failed to load progress:', e);
                progress = {
                    completedLevels: [],
                    earnedAchievements: [],
                    lastVisit: null
                };
            }
        }
    }

    function saveProgress() {
        progress.lastVisit = new Date().toISOString();
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(progress));
    }

    function completeLevel(levelId) {
        if (!progress.completedLevels.includes(levelId)) {
            progress.completedLevels.push(levelId);
            checkAchievements();
            saveProgress();
            renderLevelNodes();
            renderPaths();
            updateProgress();
        }
    }

    // ==================== 成就系统 ====================
    function checkAchievements() {
        ACHIEVEMENTS.forEach(achievement => {
            if (!progress.earnedAchievements.includes(achievement.id) &&
                achievement.condition(progress)) {
                progress.earnedAchievements.push(achievement.id);
                showAchievementUnlock(achievement);
            }
        });
    }

    function showAchievementUnlock(achievement) {
        // 创建成就解锁提示
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-notification__content">
                <span class="achievement-notification__icon">${achievement.icon}</span>
                <div class="achievement-notification__text">
                    <strong>成就解锁！</strong>
                    <span>${achievement.name}</span>
                </div>
            </div>
        `;
        document.body.appendChild(notification);

        // 动画效果
        setTimeout(() => {
            notification.classList.add('achievement-notification--show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('achievement-notification--show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function renderAchievements() {
        if (!elements.achievementGrid) return;

        elements.achievementGrid.innerHTML = ACHIEVEMENTS.map(achievement => {
            const isEarned = progress.earnedAchievements.includes(achievement.id);
            return `
                <div class="achievement-badge ${isEarned ? 'achievement-badge--earned' : 'achievement-badge--locked'}"
                     data-achievement="${achievement.id}"
                     title="${achievement.description}">
                    <span class="achievement-badge__icon">${achievement.icon}</span>
                    <span class="achievement-badge__name">${achievement.name}</span>
                </div>
            `;
        }).join('');
    }

    // ==================== 关卡渲染 ====================
    function renderLevelNodes() {
        elements.levelNodes.forEach(node => {
            const levelId = parseInt(node.dataset.level);
            const isCompleted = progress.completedLevels.includes(levelId);
            const isLocked = levelId > 1 && !progress.completedLevels.includes(levelId - 1) && !isCompleted;

            // 移除所有状态类
            node.classList.remove('level-node--completed', 'level-node--current', 'level-node--locked');

            if (isCompleted) {
                node.classList.add('level-node--completed');
                node.querySelector('.level-node__badge').textContent = '✅';
            } else if (isLocked) {
                node.classList.add('level-node--locked');
                node.querySelector('.level-node__badge').textContent = '🔒';
            } else {
                node.classList.add('level-node--current');
                node.querySelector('.level-node__badge').textContent = '🌟';
            }
        });
    }

    // ==================== 路径渲染 ====================
    function renderPaths() {
        if (!elements.mapPaths) return;

        // 清除现有路径
        elements.mapPaths.innerHTML = '';

        // 获取所有关卡节点
        const nodes = Array.from(elements.levelNodes);
        if (nodes.length < 2) return;

        // 创建SVG路径
        const svgNS = 'http://www.w3.org/2000/svg';

        for (let i = 0; i < nodes.length - 1; i++) {
            const currentNode = nodes[i];
            const nextNode = nodes[i + 1];

            const currentRect = currentNode.getBoundingClientRect();
            const nextRect = nextNode.getBoundingClientRect();
            const containerRect = elements.mapPaths.getBoundingClientRect();

            // 计算相对坐标
            const x1 = currentRect.left + currentRect.width / 2 - containerRect.left;
            const y1 = currentRect.top + currentRect.height / 2 - containerRect.top;
            const x2 = nextRect.left + nextRect.width / 2 - containerRect.left;
            const y2 = nextRect.top + nextRect.height / 2 - containerRect.top;

            // 创建贝塞尔曲线路径
            const path = document.createElementNS(svgNS, 'path');
            const controlY1 = y1 + (y2 - y1) / 3;
            const controlY2 = y2 - (y2 - y1) / 3;

            path.setAttribute('d', `M ${x1} ${y1} C ${x1} ${controlY1}, ${x2} ${controlY2}, ${x2} ${y2}`);
            path.setAttribute('class', 'map-path');

            // 检查路径是否激活（前一个关卡已完成）
            const currentLevelId = parseInt(currentNode.dataset.level);
            if (progress.completedLevels.includes(currentLevelId)) {
                path.classList.add('map-path--active');
            }

            elements.mapPaths.appendChild(path);
        }
    }

    // ==================== 进度更新 ====================
    function updateProgress() {
        const completed = progress.completedLevels.length;
        const percentage = (completed / CONFIG.levelCount) * 100;

        if (elements.progressFill) {
            elements.progressFill.style.width = `${percentage}%`;
        }

        if (elements.completedCount) {
            elements.completedCount.textContent = completed;
        }
    }

    // ==================== 事件绑定 ====================
    function bindEvents() {
        // 关卡点击事件
        elements.levelNodes.forEach(node => {
            node.addEventListener('click', handleLevelClick);
            node.addEventListener('mouseenter', handleLevelHover);
            node.addEventListener('mouseleave', handleLevelLeave);
        });

        // 成就点击事件
        if (elements.achievementGrid) {
            elements.achievementGrid.addEventListener('click', handleAchievementClick);
        }

        // 窗口大小改变时重新渲染路径
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(renderPaths, 250);
        });

        // 页面加载完成后标记当前关卡
        window.addEventListener('load', () => {
            // 找到第一个未完成的关卡并标记为当前
            const firstIncomplete = Array.from(elements.levelNodes).find(node => {
                const levelId = parseInt(node.dataset.level);
                return !progress.completedLevels.includes(levelId);
            });

            if (firstIncomplete) {
                const levelId = parseInt(firstIncomplete.dataset.level);
                // 如果是第一关，或者前一关已完成，则可以访问
                if (levelId === 1 || progress.completedLevels.includes(levelId - 1)) {
                    // 关卡已解锁，无需额外处理
                }
            }
        });
    }

    function handleLevelClick(event) {
        const node = event.currentTarget;
        const levelId = parseInt(node.dataset.level);
        const url = node.dataset.url;

        // 检查关卡是否锁定
        if (node.classList.contains('level-node--locked')) {
            // 显示提示
            showNotification('完成前一关卡来解锁此关卡！', 'info');
            return;
        }

        // 标记关卡为已完成（模拟）
        completeLevel(levelId);

        // 跳转到章节页面
        window.location.href = url;
    }

    function handleLevelHover(event) {
        const node = event.currentTarget;
        // 可以在这里添加悬停效果，如显示浮动卡片
    }

    function handleLevelLeave(event) {
        const node = event.currentTarget;
        // 移除悬停效果
    }

    function handleAchievementClick(event) {
        const badge = event.target.closest('.achievement-badge');
        if (!badge) return;

        const achievementId = badge.dataset.achievement;
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);

        if (achievement) {
            const isEarned = progress.earnedAchievements.includes(achievementId);
            const message = isEarned
                ? `✅ 已获得：${achievement.description}`
                : `🔒 未解锁：${achievement.description}`;

            showNotification(message, isEarned ? 'success' : 'info');
        }
    }

    // ==================== 通知系统 ====================
    function showNotification(message, type = 'info') {
        // 移除旧的通知
        const oldNotification = document.querySelector('.notification');
        if (oldNotification) {
            oldNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // ==================== 启动 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
