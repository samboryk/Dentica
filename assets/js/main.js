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
  const slider = document.querySelector('.reviews-slider');
  const dotsContainer = document.querySelector('.reviews-dots');
  const btnPrev = document.querySelector('.reviews-btn--prev');
  const btnNext = document.querySelector('.reviews-btn--next');
  const cards = document.querySelectorAll('.review-card');

  if (!slider || !dotsContainer || cards.length === 0) return;

  // --- 1. КОНФІГУРАЦІЯ КРАПОЧОК (МАКСИМУМ 5) ---
  const MAX_DOTS = 5;
  const numDots = Math.min(cards.length, MAX_DOTS);
  
  dotsContainer.innerHTML = '';
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('span');
    dot.classList.add('reviews-dot');
    if (i === 0) dot.classList.add('reviews-dot--active');
    dotsContainer.appendChild(dot);
  }
  const dots = document.querySelectorAll('.reviews-dot');

  // Функція для розрахунку кроку скролу
  const getScrollAmount = () => {
    const gap = parseInt(window.getComputedStyle(slider).gap) || 0;
    return cards[0].offsetWidth + gap;
  };

  // --- 2. ЛОГІКА ПЕРЕМИКАННЯ КРАПОК ---
  const updateActiveDot = () => {
    const scrollLeft = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    
    // Визначаємо прогрес скролу від 0 до 1
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    
    // Визначаємо індекс активної крапки (від 0 до 4)
    let activeDotIndex = Math.round(progress * (numDots - 1));

    dots.forEach((dot, index) => {
      dot.classList.toggle('reviews-dot--active', index === activeDotIndex);
    });
  };

  slider.addEventListener('scroll', updateActiveDot);

  // --- 3. КЛІК ПО КРАПКАХ ---
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

  // --- 4. КНОПКИ ТА ЗАЦИКЛЕННЯ ---
  const moveNext = () => {
    const isEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth - 10;
    if (isEnd) {
      slider.scrollTo({ left: 0, behavior: 'smooth' }); // Повернення на початок (зациклення)
    } else {
      slider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    }
  };

  const movePrev = () => {
    const isStart = slider.scrollLeft <= 10;
    if (isStart) {
      slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' }); // В кінець
    } else {
      slider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    }
  };

  btnNext?.addEventListener('click', moveNext);
  btnPrev?.addEventListener('click', movePrev);

  // --- 5. АВТОПРОКРУТКА ---
  let autoScroll = setInterval(moveNext, 5000);

  const resetTimer = () => {
    clearInterval(autoScroll);
    autoScroll = setInterval(moveNext, 5000);
  };

  // Зупиняємо таймер при взаємодії
  slider.addEventListener('mousedown', () => clearInterval(autoScroll));
  slider.addEventListener('touchstart', () => clearInterval(autoScroll));
  [btnNext, btnPrev].forEach(btn => btn?.addEventListener('click', resetTimer));
});




document.addEventListener("DOMContentLoaded", function() {
  const swiper = new Swiper('.results-swiper', {
    effect: 'coverflow', // Вмикаємо 3D ефект перекриття
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto', // Ширина береться з CSS (.swiper-slide)
    loop: true,
    
    // Налаштування ефекту наїжджання
    coverflowEffect: {
      rotate: 0,       // Не крутимо слайди
      stretch: -40,    // Від'ємне значення "натягує" бокові слайди під центральний
      depth: 150,      // Глибина перспективи
      modifier: 1,
      slideShadows: true, // Додає тіні між слайдами
    },

    navigation: {
      nextEl: '.slider-nav.next',
      prevEl: '.slider-nav.prev',
    },
  });
});


document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.price-page-filter-btn');
    const priceCards = document.querySelectorAll('.price-card');
    const priceGrid = document.querySelector('.price-page-grid');

    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const aiChatBtn = document.getElementById('aiChatBtn');

    let isAutoScrolling = false; 
    let scrollTimeout;

    // 1. Кліки по кнопках фільтру
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            isAutoScrolling = true;
            clearTimeout(scrollTimeout);

            // Знімаємо активність з усіх і додаємо ТІЛЬКИ тій, по якій клікнули
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('data-target');
            
            if (targetId) {
                const targetCard = document.getElementById(targetId);
                
                if (targetCard) {
                    priceCards.forEach(card => card.classList.remove('active-card'));
                    targetCard.classList.add('active-card');

                    targetCard.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });

                    scrollTimeout = setTimeout(() => {
                        isAutoScrolling = false;
                    }, 800); 
                }
            }
        });
    });

    // 2. Скрол мишкою/пальцем
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        }

        if (!isAutoScrolling && priceGrid) {
            const gridPosition = priceGrid.getBoundingClientRect().top;
            
            // Якщо проскролили вище блоку з картками
            if (gridPosition > 150) { 
                // ПРОСТО знімаємо всі класи, НІЧОГО не додаємо
                priceCards.forEach(card => card.classList.remove('active-card'));
                filterButtons.forEach(btn => btn.classList.remove('active'));
            }
        }
    });

    // 3. Клік по кнопці "Вгору"
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            isAutoScrolling = true; 
            clearTimeout(scrollTimeout);
            
            // ПРОСТО знімаємо всі класи перед польотом вгору
            priceCards.forEach(card => card.classList.remove('active-card'));
            filterButtons.forEach(btn => btn.classList.remove('active'));

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            scrollTimeout = setTimeout(() => {
                isAutoScrolling = false;
            }, 800);
        });
    }

    // 4. Клік по чату
    if (aiChatBtn) {
        aiChatBtn.addEventListener('click', () => {
            console.log('Відкриття вікна ШІ помічника...');
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Елементи
    const chatBtn = document.getElementById('aiChatBtn');
    const chatWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('aiChatCloseBtn');
    const chatBody = document.getElementById('aiChatBody');
    const chatInput = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('aiChatSendBtn');

    // === НАЛАШТУВАННЯ ===
    const API_KEY = "AIzaSyDv3hdDdrIfkeiBmfoxL3xOr1E8NWAvaYo"; // Твій ключ

    // Актуальна модель на квітень 2026
    const MODEL_NAME = "gemini-2.5-flash";        // Рекомендую для чату (швидко + добре)
    // Альтернативи:
    // const MODEL_NAME = "gemini-2.5-pro";       // потужніша, але дорожча
    // const MODEL_NAME = "gemini-2.5-flash-lite"; // найдешевша для великих обсягів

    const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    let isSending = false; // Захист від подвійних запитів

    // Логіка відкриття/закриття
    if (chatBtn) {
        chatBtn.onclick = () => {
            chatWindow.classList.toggle('show');
            chatInput?.focus();
            console.log("Відкриття вікна Dentica AI...");
        };
    }

    closeBtn?.addEventListener('click', () => {
        chatWindow.classList.remove('show');
    });

    // Функція відправки повідомлення
    async function handleSendMessage() {
        if (isSending) return;
        const message = chatInput.value.trim();
        if (!message) return;

        isSending = true;
        sendBtn.disabled = true;

        // Додаємо повідомлення користувача
        addMessage('user', message);
        chatInput.value = '';
        showTypingIndicator();

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${DENTICA_CONTEXT || ''}\n\nКористувач: ${message}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    }
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("API Error:", data);
                let errorMsg = data.error?.message || "Помилка сервера";

                if (data.error?.code === 404) {
                    errorMsg = `Модель ${MODEL_NAME} не знайдена. Спробуй іншу модель (наприклад gemini-2.5-flash).`;
                }

                throw new Error(errorMsg);
            }

            // Отримуємо текст відповіді
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text 
                || "Вибачте, не вдалося згенерувати відповідь.";

            removeTypingIndicator();
            addMessage('bot', aiText);

        } catch (error) {
            console.error("Chat Error:", error);
            removeTypingIndicator();
            addMessage('bot', "Вибачте, сталася помилка при обробці запиту. Спробуйте ще раз.");
        } finally {
            isSending = false;
            sendBtn.disabled = false;
            chatInput.focus();
        }
    }

    // Рендер повідомлень
    function addMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}-msg`;
        msgDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chat-msg bot-msg typing-indicator';
        indicator.id = 'temp-typing';
        indicator.innerHTML = `<span></span><span></span><span></span>`;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function removeTypingIndicator() {
        document.getElementById('temp-typing')?.remove();
    }

    // Слухачі подій
    sendBtn?.addEventListener('click', handleSendMessage);
    chatInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // Додатковий дебаг: вивести доступні моделі в консоль
    console.log(`Dentica AI запущено з моделлю: ${MODEL_NAME}`);
});





document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.diff-card');
    const toothViewer = document.getElementById('diffToothViewer');
    
    if (cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    let autoplayInterval;
    let cameraRotation = 0; // Для 3D зуба

    // Функція, яка роздає жорсткі стани карткам та крутить зуб
    function updateStates(index) {
        // Зациклення індексів
        if (index >= totalCards) index = 0;
        if (index < 0) index = totalCards - 1;
        
        currentIndex = index;

        // 1. Обертаємо 3D Зуб (через камеру моделі)
        cameraRotation += 60; // Кожен слайд крутить камеру на 60 градусів
        if (toothViewer) {
            // Формат: "горизонталь вертикаль віддалення"
            toothViewer.setAttribute('camera-orbit', `${cameraRotation}deg 90deg auto`);
        }

        // 2. Роздаємо класи карткам
        cards.forEach((card, i) => {
            // Очищаємо всі класи
            card.classList.remove('active', 'next', 'prev', 'hidden');

            if (i === currentIndex) {
                // Активна (по центру, синя)
                card.classList.add('active');
            } else if (i === (currentIndex + 1) % totalCards) {
                // Наступна (визирає справа)
                card.classList.add('next');
            } else if (i === (currentIndex - 1 + totalCards) % totalCards) {
                // Попередня (та, що щойно сховалася за зуб)
                card.classList.add('prev');
            } else {
                // Всі інші далеко справа
                card.classList.add('hidden');
            }
        });
    }

    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            updateStates(currentIndex + 1);
        }, 4000); // 4 секунди на слайд
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Клік по будь-якій картці перемикає слайдер на неї
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            updateStates(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    const container = document.getElementById('diffCardsContainer');
    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);
    }

    // Ініціалізація
    updateStates(0);
    startAutoplay();
});



document.addEventListener("DOMContentLoaded", () => {
    // База даних команди (можеш додати скільки завгодно)
    const teamData = [
        {
            photo: "assets/images/doctor1.png", // Вкажи свої шляхи до фото
            name: "Олександра Ромашевська",
            role: "Головний лікар-стоматолог",
            desc: "Експерт з естетичної стоматології та складних реставрацій. Поєднує багаторічний досвід із цифровими технологіями, створюючи ідеальні посмішки з увагою до кожної деталі.",
            number: "01",
            quote: "Досконалість у кожній деталі вашої посмішки"
        },
        {
            photo: "assets/images/doctor2.png",
            name: "Іван Петренко",
            role: "Хірург-імплантолог",
            desc: "Спеціалізується на безболісній хірургії та відновленні втрачених зубів. Використовує передові протоколи лікування для максимального комфорту пацієнтів.",
            number: "02",
            quote: "Повертаємо впевненість та радість життя"
        },
        {
            photo: "assets/images/doctor3.png",
            name: "Марія Коваль",
            role: "Ортодонт",
            desc: "Допомагає вирівняти зуби та виправити прикус у будь-якому віці за допомогою сучасних брекет-систем та невидимих елайнерів.",
            number: "03",
            quote: "Рівні зуби — це фундамент здоров'я"
        }
    ];

    let currentIndex = 0;
    let isAnimating = false;

    // DOM Елементи
    const els = {
        photo: document.getElementById('team-photo'),
        infoCard: document.getElementById('team-info-card'),
        quoteCard: document.getElementById('team-quote-card'),
        name: document.getElementById('team-name'),
        role: document.getElementById('team-role'),
        desc: document.getElementById('team-desc'),
        number: document.getElementById('team-number'),
        quote: document.getElementById('team-quote'),
        btnNext: document.getElementById('team-next'),
        btnPrev: document.getElementById('team-prev')
    };

    function changeSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        // Обчислення нового індексу
        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % teamData.length;
        } else {
            currentIndex = (currentIndex - 1 + teamData.length) % teamData.length;
        }

        const nextData = teamData[currentIndex];

        // 1. Запускаємо анімації зникнення (OUT)
        els.photo.classList.add('anim-photo-hide');
        els.infoCard.classList.add('anim-info-out');
        els.quoteCard.classList.add('anim-quote-out');

        // Чекаємо половину часу (300ms), поки картки "ребром" до глядача (невидимі)
        setTimeout(() => {
            // Змінюємо контент
            els.photo.src = nextData.photo;
            els.name.textContent = nextData.name;
            els.role.textContent = nextData.role;
            els.desc.textContent = nextData.desc;
            els.number.textContent = nextData.number;
            els.quote.textContent = nextData.quote;

            // Перемикаємо класи на підготовку до появи (IN)
            els.infoCard.classList.remove('anim-info-out');
            els.quoteCard.classList.remove('anim-quote-out');
            
            els.infoCard.classList.add('anim-info-in');
            els.quoteCard.classList.add('anim-quote-in');

            // Мікро-затримка, щоб браузер застосував стартові позиції IN
            requestAnimationFrame(() => {
                els.photo.classList.remove('anim-photo-hide');
                els.infoCard.classList.add('active');
                els.quoteCard.classList.add('active');

                // Чекаємо завершення появи (IN)
                setTimeout(() => {
                    // Очищаємо класи після завершення
                    els.infoCard.classList.remove('anim-info-in', 'active');
                    els.quoteCard.classList.remove('anim-quote-in', 'active');
                    
                    // Знімаємо блокування натискань
                    isAnimating = false;
                }, 300); // Час ease-out
            });
        }, 300); // Час ease-in
    }

    // Обробники подій
    els.btnNext.addEventListener('click', () => changeSlide('next'));
    els.btnPrev.addEventListener('click', () => changeSlide('prev'));
});


document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('reviews-track');
    const btnNext = document.getElementById('rev-next');
    const btnPrev = document.getElementById('rev-prev');
    const paginationContainer = document.getElementById('reviews-pagination');
    
    if (!track || !btnNext || !btnPrev || !paginationContainer) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.review-card');
    const visibleCards = 3; // Показуємо 3 картки
    const totalCards = cards.length;
    const maxIndex = Math.max(0, totalCards - visibleCards);
    const autoPlayInterval = 4000; // Час в мілісекундах (4 секунди)
    let autoPlayTimer;

    if (totalCards <= visibleCards) {
        btnNext.style.display = 'none';
        btnPrev.style.display = 'none';
        return;
    }

    // --- Генерація пагінації ---
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.classList.add('pagination-dot');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateSliderPosition();
            resetAutoPlay(); // Скидаємо таймер при кліку
        });
        
        paginationContainer.appendChild(dot);
    }
    const dots = paginationContainer.querySelectorAll('.pagination-dot');

    // --- Оновлення позиції ---
    function updateSliderPosition() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; 
        
        const moveDistance = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveDistance}px)`;

        // Оновлення кнопок
        btnPrev.style.opacity = currentIndex === 0 ? '0.3' : '1';
        btnPrev.style.cursor = currentIndex === 0 ? 'default' : 'pointer';
        
        btnNext.style.opacity = currentIndex === maxIndex ? '0.3' : '1';
        btnNext.style.cursor = currentIndex === maxIndex ? 'default' : 'pointer';

        // Оновлення крапочок
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // --- Функції авто-гортання ---
    function nextSlide() {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Повертаємось на початок
        }
        updateSliderPosition();
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // --- Обробники кнопок ---
    btnNext.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSliderPosition();
            resetAutoPlay();
        }
    });

    btnPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
            resetAutoPlay();
        }
    });

    // --- Зупинка автоплею при наведенні миші ---
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoPlay);

    // Ініціалізація
    updateSliderPosition();
    startAutoPlay();

    window.addEventListener('resize', updateSliderPosition);
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
