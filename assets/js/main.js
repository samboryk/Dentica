// ==========================================
// MOBILE MENU (Повноекранне мобільне меню)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Ініціалізація анімацій відразу (не чекаючи 3D модель)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
            offset: 50,
            disable: false
        });
    }

    // Оновлюємо координати при скролі (лікує "залипання" на мобайлі)
    window.addEventListener('scroll', () => {
        AOS.refresh();
    });

    const menuBtn     = document.querySelector('.menu');
    const drawerNav   = document.getElementById('drawerNav');

    if (menuBtn && drawerNav) {
        menuBtn.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('menu-open');
            menuBtn.classList.toggle('is-open', isOpen);
        });

        // Закриття при кліку на посилання
        drawerNav.querySelectorAll('a, .drawer-btn, .drawer-cta').forEach(link => {
            link.addEventListener('click', () => {
                if (!link.closest('.theme-toggle')) {
                    document.body.classList.remove('menu-open');
                    menuBtn.classList.remove('is-open');
                }
            });
        });
    }

    // Закриття клавішею Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
            menuBtn.classList.remove('is-open');
        }
    });

    // Автозакриття при збільшенні вікна до десктопного розміру
    window.addEventListener('resize', () => {
        if (window.innerWidth > 480 && overlay.classList.contains('is-active')) {
            closeMenu();
        }
    });
});





document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const html = document.documentElement;

    // 1. Перевіряємо, чи користувач вже обирав тему раніше
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        html.classList.add('dark-mode');
        themeToggle.classList.add('active');
    }

    // 2. Функція перемикання
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        html.classList.toggle('dark-mode');
        themeToggle.classList.toggle('active');

        // Зберігаємо вибір
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    // 3. Відслідковуємо зміну системної теми
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            if (event.matches) {
                body.classList.add('dark-mode');
                html.classList.add('dark-mode');
                themeToggle.classList.add('active');
            } else {
                body.classList.remove('dark-mode');
                html.classList.remove('dark-mode');
                themeToggle.classList.remove('active');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
  // Знаходимо всі кнопки-тригери акордеону
  const triggers = document.querySelectorAll('.faq-item-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      // Знаходимо батьківський елемент (.faq-item) поточної кнопки
      const currentItem = this.closest('.faq-item');
      
      // Перевіряємо, чи цей пункт зараз відкритий
      const isActive = currentItem.classList.contains('faq-item--active');

      // 1. Закриваємо всі пункти (щоб працювало як справжній акордеон)
      // Якщо ви хочете, щоб можна було відкрити кілька пунктів одночасно - видаліть цей блок
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('faq-item--active');
        item.querySelector('.faq-item-trigger').setAttribute('aria-expanded', 'false');
      });

      // 2. Якщо клікнутий пункт був ЗАКРИТИЙ, ми його відкриваємо
      if (!isActive) {
        currentItem.classList.add('faq-item--active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. КАСТОМНИЙ СЛАЙДЕР ВІДГУКІВ (.reviews-slider)
    // ==========================================
    const slider = document.querySelector('.reviews-slider');
    const dotsContainer = document.querySelector('.reviews-dots');
    const btnPrev = document.querySelector('.reviews-btn--prev');
    const btnNext = document.querySelector('.reviews-btn--next');
    const cards = document.querySelectorAll('.review-card');

    if (slider && dotsContainer && cards.length > 0) {
        const MAX_DOTS = 5;
        let dots = [];
        let numDots = 1;

        // --- ДИНАМІЧНА ІНІЦІАЛІЗАЦІЯ КРАПОК ---
        const initDots = () => {
            // Динамічно визначаємо видимі картки на основі реальної ширини елементів (замість хардкоду px)
            const visibleCards = Math.max(1, Math.round(slider.clientWidth / cards[0].offsetWidth));
            const totalSteps = Math.max(1, cards.length - visibleCards + 1);
            numDots = Math.min(totalSteps, MAX_DOTS);

            // Очищаємо контейнер перед (пере)генерацією
            dotsContainer.innerHTML = '';
            
            // Якщо крок лише 1 (всі картки влазять), крапки не потрібні
            if (numDots <= 1) return; 

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('reviews-dot');
                if (i === 0) dot.classList.add('reviews-dot--active');
                
                // Додаємо подію кліку одразу при створенні крапки
                dot.addEventListener('click', () => {
                    const maxScroll = slider.scrollWidth - slider.clientWidth;
                    // Захист від ділення на нуль
                    const targetScroll = numDots > 1 ? (maxScroll / (numDots - 1)) * i : 0;
                    
                    slider.scrollTo({
                        left: targetScroll,
                        behavior: 'smooth'
                    });
                });
                
                dotsContainer.appendChild(dot);
            }
            dots = document.querySelectorAll('.reviews-dot');
            updateActiveDot(); // Оновлюємо стан одразу після генерації
        };

        const getScrollAmount = () => {
            const gap = parseInt(window.getComputedStyle(slider).gap) || 0;
            return cards[0].offsetWidth + gap;
        };

        const updateActiveDot = () => {
            if (dots.length <= 1) return; // Немає сенсу оновлювати, якщо крапок 0 або 1

            const scrollLeft = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            
            if (maxScroll <= 0) return;

            const progress = scrollLeft / maxScroll;
            // Визначаємо поточну активну крапку на основі % прокрутки
            let activeDotIndex = Math.round(progress * (numDots - 1));

            dots.forEach((dot, index) => {
                dot.classList.toggle('reviews-dot--active', index === activeDotIndex);
            });
        };

        // Слухаємо скрол для оновлення крапок
        slider.addEventListener('scroll', updateActiveDot);

        const moveNext = () => {
            // Додано запас у 5px (іноді брайзери рахують дробові пікселі)
            const isEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 5;
            if (isEnd) {
                slider.scrollTo({ left: 0, behavior: 'smooth' }); // Зациклення на початок
            } else {
                slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        };

        const movePrev = () => {
            const isStart = slider.scrollLeft <= 5;
            if (isStart) {
                slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' }); // Зациклення в кінець
            } else {
                slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            }
        };

        if (btnNext) btnNext.addEventListener('click', moveNext);
        if (btnPrev) btnPrev.addEventListener('click', movePrev);

        // --- АВТОСКРОЛ ТА ЙОГО СКИДАННЯ ---
        let autoScroll = setInterval(moveNext, 5000);

        const resetTimer = () => {
            clearInterval(autoScroll);
            autoScroll = setInterval(moveNext, 5000);
        };

        slider.addEventListener('mousedown', () => clearInterval(autoScroll));
        slider.addEventListener('touchstart', () => clearInterval(autoScroll), { passive: true });

        // SWIPE ДЛЯ ВІДГУКІВ (legacy)
        let revStartX = 0;
        let revEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            revStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            revEndX = e.changedTouches[0].screenX;
            const diff = revStartX - revEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) moveNext();
                else movePrev();
                resetTimer();
            }
        }, { passive: true });
        
        if (btnNext) btnNext.addEventListener('click', resetTimer);
        if (btnPrev) btnPrev.addEventListener('click', resetTimer);
        
        // Запускаємо ініціалізацію при завантаженні
        initDots();

        // Оновлюємо крапочки, якщо користувач змінить розмір вікна/переверне телефон
        window.addEventListener('resize', () => {
            initDots(); // Повністю перераховуємо крапки
        });
    }
});
    // ==========================================
    // 2. СЛАЙДЕР SWIPER 3D (.results-swiper)
    // ==========================================
    const swiperElement = document.querySelector('.results-swiper');
    
    // Ініціалізуємо Swiper ТІЛЬКИ якщо елемент існує на сторінці
    if (swiperElement) {
        const swiper = new Swiper('.results-swiper', {
            effect: 'coverflow', 
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto', 
            loop: true,
            
            coverflowEffect: {
                rotate: 0,       
                stretch: -40,    
                depth: 150,      
                modifier: 1,
                slideShadows: true, 
            },

            navigation: {
                nextEl: '.slider-nav.next',
                prevEl: '.slider-nav.prev',
            },
        });
    };

    document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // --- 1. Логіка фону (градієнта) ---
    // Якщо ми не на самому верху - показуємо градієнт
    if (currentScroll > 0) {
      header.classList.add('is-scrolled');
    } else {
      // Якщо на самому верху - робимо повністю прозорим
      header.classList.remove('is-scrolled');
    }

    // --- 2. Логіка ховання/показу хедера ---
    // На верху сторінки гарантовано показуємо хедер
    if (currentScroll <= 0) {
      header.classList.remove('is-hidden');
      return;
    }

    // Скролимо вниз (і вже пройшли більше 100px) — ховаємо хедер
    if (currentScroll > lastScroll && !header.classList.contains('is-hidden') && currentScroll > 100) {
      header.classList.add('is-hidden');
    } 
    // Скролимо вгору — показуємо хедер
    else if (currentScroll < lastScroll && header.classList.contains('is-hidden')) {
      header.classList.remove('is-hidden');
    }

    lastScroll = currentScroll;
  });
});





document.addEventListener('DOMContentLoaded', () => {
    const filter = document.querySelector('.price-page-filter');
    const buttons = document.querySelectorAll('.price-page-filter-btn');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    // 1. Поява кнопки "Вгору" та границя фільтра при скролі
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Кнопка вгору (додана перевірка, чи існує кнопка на сторінці)
    if (scrollTopBtn) {
        if (scrollY > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }

    // Границя для фільтра (is-pinned) (додана перевірка, чи існує фільтр)
    if (filter) { 
        if (filter.getBoundingClientRect().top <= 0) {
            filter.classList.add('is-pinned');
        } else {
            filter.classList.remove('is-pinned');
        }
    }
});
    // 2. Клік "Вгору"
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. Кліки по фільтрах + підсвітка
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetCard = document.getElementById(targetId);
            
            if (targetCard) {
                // Візуальна висота фільтра при закріпленні на 80px більша через transform
                const offset = filter.offsetHeight + 80 + 20;
                const elementPosition = targetCard.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: elementPosition - offset,
                    behavior: 'smooth'
                });

                // Ефект підсвітки
                document.querySelectorAll('.price-card').forEach(c => c.classList.remove('highlight-card'));
                targetCard.classList.add('highlight-card');
                
                setTimeout(() => {
                    targetCard.classList.remove('highlight-card');
                }, 2000);
            }
        });
    });
});





document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ЛОГІКА АКОРДЕОНА (Ізольована)
    // ==========================================
    function initAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            header.addEventListener('click', () => {
                // Закриваємо всі інші
                accordionItems.forEach(el => {
                    if (el !== item) {
                        el.classList.remove('active');
                        const icon = el.querySelector('.accordion-btn');
                        if (icon) icon.style.transform = 'rotate(0deg)';
                    }
                });

                // Перемикаємо поточний
                item.classList.toggle('active');

                // Анімація стрілки
                const icon = item.querySelector('.accordion-btn');
                if (icon) {
                    icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            });
        });
    }
    
    // Запускаємо акордеон одразу
    initAccordion();




    
    // ==========================================
    // 2. ЛОГІКА СЛАЙДЕРА (Безкінечне коло)
    // ==========================================
 function initCertSlider() {
    const track = document.getElementById('cert-track');
    const btnNext = document.getElementById('cert-next');
    const btnPrev = document.getElementById('cert-prev');
    const paginationContainer = document.getElementById('cert-pagination');
    
    if (!track || !btnNext || !btnPrev || !paginationContainer) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.cert-card');
    if (!cards.length) return;

    // ВРАХОВУЄМО АДАПТИВ: якщо екран менше 768px, вважаємо що видима 1 картка
    const isMobile = window.innerWidth <= 768;
    const visibleCards = isMobile ? 1 : 3; 
    const totalCards = cards.length;
    const maxIndex = Math.max(0, totalCards - visibleCards);
    
    const autoPlayDelay = 3000; 
    let autoPlayTimer;

    // Генерація цяток
    paginationContainer.innerHTML = ''; 
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.classList.add('cert-dot');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
            resetAutoPlay();
        });
        paginationContainer.appendChild(dot);
    }
    const dots = paginationContainer.querySelectorAll('.cert-dot');

    // Функція зсуву треку
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        
        // ДИНАМІЧНИЙ GAP: беремо реальне значення з CSS (працюватиме і 24px для ПК, і 16px для моб)
        const trackStyles = window.getComputedStyle(track);
        const gap = parseFloat(trackStyles.gap) || 0; 
        
        const moveDistance = (cardWidth + gap) * currentIndex;
        
        track.style.transform = `translateX(-${moveDistance}px)`;

        dots.forEach((dot, index) => {
            if (index === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex < maxIndex) ? currentIndex + 1 : 0;
        updateSlider();
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    btnNext.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
        updateSlider();
        resetAutoPlay();
    });

    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoPlay);

    // SWIPE ДЛЯ СЛАЙДЕРА
    let trackStartX = 0;
    let trackEndX = 0;

    track.addEventListener('touchstart', (e) => {
        trackStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        trackEndX = e.changedTouches[0].screenX;
        const diff = trackStartX - trackEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
            updateSlider();
            resetAutoPlay();
        }
    }, { passive: true });

    updateSlider();
    startAutoPlay();
    
    // ==========================================
    // Lightbox для сертифікатів
    // ==========================================
    const modalHtml = `
        <div class="cert-modal" id="cert-lightbox">
            <div class="cert-modal-overlay"></div>
            <button class="cert-modal-close" id="cert-lightbox-close" aria-label="Закрити">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div class="cert-modal-container">
                <button class="team-btn cert-modal-nav cert-modal-prev" id="cert-lightbox-prev" aria-label="Попередній">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                
                <div class="cert-modal-image-wrapper">
                    <img class="cert-modal-content" id="cert-lightbox-img" src="" alt="Сертифікат">
                </div>

                <button class="team-btn cert-modal-nav cert-modal-next" id="cert-lightbox-next" aria-label="Наступний">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            </div>
        </div>
    `;
    
    if (!document.getElementById('cert-lightbox')) {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const lightbox = document.getElementById('cert-lightbox');
    const lightboxImg = document.getElementById('cert-lightbox-img');
    const lightboxClose = document.getElementById('cert-lightbox-close');
    const lightboxPrev = document.getElementById('cert-lightbox-prev');
    const lightboxNext = document.getElementById('cert-lightbox-next');
    let currentLightboxIndex = 0;

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = cards[currentLightboxIndex].src;
        lightboxImg.style.opacity = 1;
        lightbox.classList.add('show');
        document.body.classList.add('modal-open');
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.classList.remove('modal-open');
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }
    
    function navigateLightbox(step) {
        currentLightboxIndex += step;
        if (currentLightboxIndex < 0) currentLightboxIndex = cards.length - 1;
        if (currentLightboxIndex >= cards.length) currentLightboxIndex = 0;
        
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.src = cards[currentLightboxIndex].src;
            lightboxImg.style.opacity = 1;
        }, 150);
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Swipe для Lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleLightboxSwipe();
    }, { passive: true });

    function handleLightboxSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            navigateLightbox(1); // Swipe left -> next
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            navigateLightbox(-1); // Swipe right -> prev
        }
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
    lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('cert-modal-overlay') || e.target.classList.contains('cert-modal-container')) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    window.addEventListener('resize', updateSlider);
}

    // ВАЖЛИВО: Запускаємо слайдер ТІЛЬКИ після повного завантаження всіх картинок (window.load)
    // Це лікує проблему, коли ширина картинок дорівнює нулю на момент запуску скрипта
    if (document.readyState === 'complete') {
        initCertSlider();
    } else {
        window.addEventListener('load', initCertSlider);
    }
});



document.addEventListener("DOMContentLoaded", () => {
    // ============================================
    // RESULTS SLIDER – адаптивний трековий
    // ============================================
    const track      = document.getElementById('res-track');
    const viewport   = document.getElementById('results-viewport');
    const btnNext    = document.getElementById('res-next');
    const btnPrev    = document.getElementById('res-prev');
    const pagination = document.getElementById('res-pagination');

    if (!track || !btnNext || !btnPrev || !viewport) return;

    const cards     = Array.from(track.querySelectorAll('.result-card'));
    const total     = cards.length;
    const AUTOPLAY  = 5000;
    let current     = 0;
    let autoTimer   = null;
    let userInteracted = false;
    let dots = []; // Зберігатимемо крапки тут для швидкого доступу

    // 1. Динамічно визначаємо кількість видимих карток
    function getVisibleCount() {
        if (!cards[0]) return 1;
        const cardW = cards[0].offsetWidth;
        return cardW < viewport.offsetWidth * 0.6 ? 2 : 1;
    }

    // 2. Динамічно отримуємо максимальний індекс
    function getMaxIndex() {
        return Math.max(0, total - getVisibleCount());
    }

    // 3. Функція рендеру пагінації (генеруємо заново при ресайзі)
    function renderPagination() {
        if (!pagination) return;
        pagination.innerHTML = '';
        dots = [];
        const max = getMaxIndex();
        
        for (let i = 0; i <= max; i++) {
            const dot = document.createElement('div');
            dot.className = 'res-dot';
            if (i === current) dot.classList.add('active');
            dot.addEventListener('click', () => { 
                userInteracted = true; 
                stopAuto(); 
                goTo(i); 
            });
            pagination.appendChild(dot);
            dots.push(dot);
        }
    }

    function getGap() {
        return parseInt(getComputedStyle(track).gap) || 24;
    }

    function goTo(index) {
        const max = getMaxIndex();
        // Переконуємось, що current не виходить за межі після зміни екрану
        current = Math.max(0, Math.min(index, max)); 
        
        const gap = getGap();
        const cardW = cards[0].offsetWidth;
        const offset = current * (cardW + gap);
        
        track.style.transform = `translateX(-${offset}px)`;
        
        // Оновлюємо активну крапку (якщо пагінація існує)
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // Використовуємо динамічний getMaxIndex() замість статичного maxIndex
    function next() { goTo(current < getMaxIndex() ? current + 1 : 0); }
    function prev() { goTo(current > 0 ? current - 1 : getMaxIndex()); }

    function startAuto() { if (userInteracted) return; autoTimer = setInterval(next, AUTOPLAY); }
    function stopAuto()  { clearInterval(autoTimer); }

    // Обробники подій
    btnNext.addEventListener('click', () => { userInteracted = true; stopAuto(); next(); });
    btnPrev.addEventListener('click', () => { userInteracted = true; stopAuto(); prev(); });
    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', () => { if (!userInteracted) startAuto(); });

    // SWIPE ДЛЯ RESULTS
    let resStartX = 0;
    let resEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
        resStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
        resEndX = e.changedTouches[0].screenX;
        const diff = resStartX - resEndX;
        if (Math.abs(diff) > 50) {
            userInteracted = true;
            stopAuto();
            if (diff > 0) next();
            else prev();
        }
    }, { passive: true });

    // 4. Слухаємо зміну розміру вікна (наприклад, поворот телефону)
    window.addEventListener('resize', () => {
        // Якщо кількість видимих карток змінилась, треба оновити крапки та позицію
        renderPagination();
        goTo(current); 
    });

    // Ініціалізація
    renderPagination();
    goTo(0);
    startAuto();

    // ============================================
    // BEFORE / AFTER SLIDER DRAG LOGIC
    // ============================================
    document.querySelectorAll('.ba-slider[data-ba]').forEach(slider => {
        const handle = slider.querySelector('.ba-handle');
        const before = slider.querySelector('.ba-before');
        const lblBefore = slider.querySelector('.ba-label-before');
        const lblAfter  = slider.querySelector('.ba-label-after');
        if (!handle || !before) return;

        let isDragging = false;

        function setPosition(clientX) {
            const rect = slider.getBoundingClientRect();
            let pos = (clientX - rect.left) / rect.width;
            pos = Math.max(0.02, Math.min(0.98, pos));
            const pct = pos * 100;
            handle.style.left = pct + '%';
            before.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
            if (lblBefore) lblBefore.style.opacity = pct < 22 ? '0' : '1';
            if (lblAfter)  lblAfter.style.opacity  = pct > 78 ? '0' : '1';
        }

        handle.addEventListener('mousedown', (e) => {
            isDragging = true; handle.classList.add('dragging');
            userInteracted = true; stopAuto();
            e.preventDefault(); e.stopPropagation();
        });
        document.addEventListener('mousemove', (e) => { if (isDragging) setPosition(e.clientX); });
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false; handle.classList.remove('dragging');
        });

        handle.addEventListener('touchstart', (e) => {
            isDragging = true; handle.classList.add('dragging');
            userInteracted = true; stopAuto();
            e.preventDefault(); e.stopPropagation();
        });
        document.addEventListener('touchmove', (e) => { if (isDragging) setPosition(e.touches[0].clientX); });
        document.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false; handle.classList.remove('dragging');
        });
    });
});

// ==========================================
    // БІЧНА НАВІГАЦІЯ (Scroll Spy)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.side-scroller a');

    if (sections.length > 0 && navLinks.length > 0) {
        // Налаштування для "спостерігача"
        const observerOptions = {
            root: null,
            // Спрацьовує, коли секція доходить приблизно до середини екрана
            rootMargin: '-30% 0px -60% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    // Проходимось по всіх посиланнях
                    navLinks.forEach(link => {
                        // Забираємо клас active у всіх `<li>`
                        link.parentElement.classList.remove('active');
                        // Додаємо клас active тому `<li>`, чий href співпадає з id секції
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.parentElement.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        // Вішаємо "спостерігача" на кожну секцію
        sections.forEach(section => observer.observe(section));
    }



  document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // СКРОЛ-ШПИГУН (Side Nav Update 01, 02...)
    // ==========================================
    const sections = document.querySelectorAll('.hero-background, section[id]');
    const navLinks = document.querySelectorAll('.side-scroller li');

    const observerOptions = {
        root: null,
        threshold: 0.3 // Спрацьовує, коли 30% секції на екрані
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id') || 'hero';
                
                navLinks.forEach(li => {
                    li.classList.remove('active');
                    const link = li.querySelector('a');
                    if (link && link.getAttribute('href') === `#${currentId}`) {
                        li.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Клік по цифрах
    navLinks.forEach((li) => {
        li.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = li.querySelector('a').getAttribute('href');
            const targetSection = document.querySelector(targetId === '#hero' ? '.hero-background' : targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ТУТ ТВІЙ КОД ДЛЯ АКОРДЕОНА (initAccordion)
});


