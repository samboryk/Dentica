// Зачекаємо, поки DOM завантажиться
document.addEventListener("DOMContentLoaded", function() {
  const themeToggle = document.querySelector(".theme-toggle");
  
  // Додаємо обробник кліку
  themeToggle.addEventListener("click", function() {
    // toggles .active class on and off
    this.classList.toggle("active");
  });
});





document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // 1. Перевіряємо, чи користувач вже обирав тему раніше
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeToggle.classList.add('active');
    }

    // 2. Функція перемикання
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        themeToggle.classList.toggle('active');

        // Зберігаємо вибір
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
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
        
        // --- ДИНАМІЧНА ЛОГІКА ДЛЯ ПК ТА МОБІЛЬНИХ ---
        // Визначаємо, скільки карток ми бачимо одночасно
        const visibleCards = window.innerWidth <= 480 ? 1 : 3;
        
        // Вираховуємо, скільки всього "кроків" потрібно, щоб прогортати всі відгуки
        const totalSteps = Math.max(1, cards.length - visibleCards + 1);
        
        // Обмежуємо кількість крапочок до 5 (щоб дизайн не ламався, якщо відгуків буде 20)
        const MAX_DOTS = 5;
        const numDots = Math.min(totalSteps, MAX_DOTS);
        
        // Генеруємо крапочки
        dotsContainer.innerHTML = '';
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('span');
            dot.classList.add('reviews-dot');
            if (i === 0) dot.classList.add('reviews-dot--active');
            dotsContainer.appendChild(dot);
        }
        const dots = document.querySelectorAll('.reviews-dot');

        const getScrollAmount = () => {
            const gap = parseInt(window.getComputedStyle(slider).gap) || 0;
            return cards[0].offsetWidth + gap;
        };

        const updateActiveDot = () => {
            const scrollLeft = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            
            if (maxScroll <= 0) return; // Захист від помилок, якщо скролу немає

            const progress = scrollLeft / maxScroll;
            let activeDotIndex = Math.round(progress * (numDots - 1));

            dots.forEach((dot, index) => {
                dot.classList.toggle('reviews-dot--active', index === activeDotIndex);
            });
        };

        slider.addEventListener('scroll', updateActiveDot);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                const targetScroll = (maxScroll / (numDots - 1)) * index;
                
                slider.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            });
        });

        const moveNext = () => {
            const isEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 10;
            if (isEnd) {
                slider.scrollTo({ left: 0, behavior: 'smooth' }); // Зациклення на початок
            } else {
                slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            }
        };

        const movePrev = () => {
            const isStart = slider.scrollLeft <= 10;
            if (isStart) {
                slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' }); // Зациклення в кінець
            } else {
                slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            }
        };

        if (btnNext) btnNext.addEventListener('click', moveNext);
        if (btnPrev) btnPrev.addEventListener('click', movePrev);

        let autoScroll = setInterval(moveNext, 5000);

        const resetTimer = () => {
            clearInterval(autoScroll);
            autoScroll = setInterval(moveNext, 5000);
        };

        slider.addEventListener('mousedown', () => clearInterval(autoScroll));
        slider.addEventListener('touchstart', () => clearInterval(autoScroll));
        
        if (btnNext) btnNext.addEventListener('click', resetTimer);
        if (btnPrev) btnPrev.addEventListener('click', resetTimer);
        
        // Оновлюємо крапочки, якщо користувач переверне телефон
        window.addEventListener('resize', () => {
            updateActiveDot();
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
    const filter = document.querySelector('.price-page-filter');
    const buttons = document.querySelectorAll('.price-page-filter-btn');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    // 1. Поява кнопки "Вгору" та границя фільтра при скролі
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Кнопка вгору
        if (scrollY > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Границя для фільтра (is-pinned)
        if (filter.getBoundingClientRect().top <= 0) {
            filter.classList.add('is-pinned');
        } else {
            filter.classList.remove('is-pinned');
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
                const offset = filter.offsetHeight + 20;
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

        const visibleCards = 3; 
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
            // Беремо ширину першої картки ТІЛЬКИ коли вона вже відмальована
            const cardWidth = cards[0].offsetWidth;
            const gap = 24; 
            const moveDistance = (cardWidth + gap) * currentIndex;
            
            track.style.transform = `translateX(-${moveDistance}px)`;

            // Оновлюємо активну цятку
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

        // Кліки по кнопках
        btnNext.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        btnPrev.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
            updateSlider();
            resetAutoPlay();
        });

        // Пауза при наведенні
        track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
        track.addEventListener('mouseleave', startAutoPlay);

        // Перший запуск
        updateSlider();
        startAutoPlay();
        
        // Оновлюємо при зміні розміру вікна
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
    const slides = document.querySelectorAll('.result-slide');
    const btnNext = document.getElementById('res-next');
    const btnPrev = document.getElementById('res-prev');
    const paginationContainer = document.getElementById('res-pagination');
    const wrapper = document.getElementById('results-wrapper');
    
    if (!slides.length || !btnNext || !btnPrev || !paginationContainer) return;

    let currentIndex = 2; // Починаємо з центрального (3-го)
    const totalSlides = slides.length;
    
    // СПОВІЛЬНЕНО АВТОПЛЕЙ ДО 5 СЕКУНД
    const autoPlayDelay = 3000; 
    let autoPlayTimer;

    // Створюємо цятки
    paginationContainer.innerHTML = ''; 
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('res-dot');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSlider();
            resetAutoPlay();
        });
        paginationContainer.appendChild(dot);
    });
    const dots = paginationContainer.querySelectorAll('.res-dot');

    function updateSlider() {
        slides.forEach((slide, i) => {
            slide.className = 'result-slide';
            slide.onclick = null;
            
            // Розраховуємо індекси сусідів по колу
            const prev1 = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
            const next1 = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            const prev2 = (prev1 === 0) ? totalSlides - 1 : prev1 - 1;
            const next2 = (next1 === totalSlides - 1) ? 0 : next1 + 1;

            // Призначаємо класи для 5-ти видимих карток
            if (i === currentIndex) {
                slide.classList.add('active');
            } else if (i === prev1) {
                slide.classList.add('prev-1');
                slide.onclick = () => { currentIndex = i; updateSlider(); resetAutoPlay(); };
            } else if (i === next1) {
                slide.classList.add('next-1');
                slide.onclick = () => { currentIndex = i; updateSlider(); resetAutoPlay(); };
            } else if (i === prev2) {
                slide.classList.add('prev-2');
                slide.onclick = () => { currentIndex = i; updateSlider(); resetAutoPlay(); };
            } else if (i === next2) {
                slide.classList.add('next-2');
                slide.onclick = () => { currentIndex = i; updateSlider(); resetAutoPlay(); };
            }
        });

        // Оновлюємо цятки
        dots.forEach((dot, index) => {
            if (index === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    function goToNext() {
        currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
        updateSlider();
    }

    function goToPrev() {
        currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
        updateSlider();
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(goToNext, autoPlayDelay);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    btnNext.addEventListener('click', () => {
        goToNext();
        resetAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        goToPrev();
        resetAutoPlay();
    });

    wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    wrapper.addEventListener('mouseleave', startAutoPlay);

    // Перший запуск
    updateSlider();
    startAutoPlay();
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