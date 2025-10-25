// ===== THE BLONDE SALAD BLOG - MOBILE FIRST ===== 
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize simple components
    initHeaderActions();
    initFloatingButtons();
    initArticleInteractions();
    initImageLazyLoading();
    
    console.log('the Blonde Salad Blog Initialized 🚀');
}

// ===== HEADER ACTIONS =====
function initHeaderActions() {
    const searchIcon = document.querySelector('.header-icons .fa-search');
    const menuIcon = document.querySelector('.header-icons .fa-bars');
    
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            showNotification('Funzione di ricerca presto disponibile!', 'info');
        });
    }
    
    if (menuIcon) {
        menuIcon.addEventListener('click', function() {
            showNotification('Menu presto disponibile!', 'info');
        });
    }
}

// ===== FLOATING BUTTONS =====
function initFloatingButtons() {
    const randomBtn = document.querySelector('.floating-btn .fa-random').closest('.floating-btn');
    const linkBtn = document.querySelector('.floating-btn .fa-link').closest('.floating-btn');
    
    if (randomBtn) {
        randomBtn.addEventListener('click', function() {
            showRandomArticle();
        });
    }
    
    if (linkBtn) {
        linkBtn.addEventListener('click', function() {
            copyCurrentUrl();
        });
    }
}

// Show random article
function showRandomArticle() {
    const articles = document.querySelectorAll('.article');
    const randomIndex = Math.floor(Math.random() * articles.length);
    const randomArticle = articles[randomIndex];
    
    if (randomArticle) {
        randomArticle.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Add highlight effect
        randomArticle.style.backgroundColor = '#f8f9fa';
        setTimeout(() => {
            randomArticle.style.backgroundColor = '';
        }, 1000);
        
        showNotification('Articolo casuale selezionato!', 'success');
    }
}

// Copy current URL
function copyCurrentUrl() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Link copiato negli appunti!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

// Fallback for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link copiato negli appunti!', 'success');
    } catch (err) {
        showNotification('Errore nella copia del link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ===== ARTICLE INTERACTIONS =====
function initArticleInteractions() {
    const articles = document.querySelectorAll('.article');
    
    articles.forEach(article => {
        article.addEventListener('click', function(e) {
            // Prevent clicks on floating elements
            if (e.target.closest('.floating-buttons') || e.target.closest('.header')) {
                return;
            }
            
            const title = article.querySelector('.article-title')?.textContent || 'Articolo';
            showNotification(`Apertura: ${title}...`, 'info');
            
            // Simulate navigation (in real app, this would navigate to article)
            setTimeout(() => {
                showNotification(`${title} verrà presto disponibile!`, 'success');
            }, 1500);
        });
        
        // Add subtle hover effect
        article.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
}

// ===== LAZY LOADING =====
function initImageLazyLoading() {
    const images = document.querySelectorAll('.article-image img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 300px;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Get notification color based on type
function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#4CAF50';
        case 'error': return '#f44336';
        case 'info': return '#2196F3';
        default: return '#2196F3';
    }
}

// Get notification icon based on type
function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-bell';
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Smooth scrolling for article navigation
function smoothScrollToElement(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Blog Error:', e.error);
});

// ===== ACCESSIBILITY ENHANCEMENTS =====

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key closes notifications
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }
});

// Focus management for floating buttons
document.addEventListener('focusin', function(e) {
    if (e.target.classList.contains('floating-btn')) {
        e.target.style.boxShadow = '0 6px 16px rgba(255, 51, 153, 0.3)';
    }
});

document.addEventListener('focusout', function(e) {
    if (e.target.classList.contains('floating-btn')) {
        e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }
});

// ===== INITIALIZATION =====
console.log('the Blonde Salad JavaScript Loaded Successfully ✨');