document.addEventListener("DOMContentLoaded", () => {
    const teamData = [
        {
            photo: "assets/images/doctor1.png", 
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

    const els = {
        photo: document.getElementById('team-photo'), // Картинка (для заміни src)
        photoWrapper: document.querySelector('.team-image-wrapper'), // Обгортка (для АНІМАЦІЇ)
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

    if (!els.photo || !els.btnNext) return;

    // Початковий стан: ставимо по центру
    els.photoWrapper.classList.add('carousel-center');
    els.infoCard.classList.add('carousel-center');
    els.quoteCard.classList.add('carousel-center');

    teamData.forEach(member => {
        const img = new Image();
        img.src = member.photo;
    });

    function changeSlide(direction) {
        if (isAnimating) return;
        isAnimating = true;

        const outClass = direction === 'next' ? 'carousel-out-left' : 'carousel-out-right';
        const readyClass = direction === 'next' ? 'carousel-ready-right' : 'carousel-ready-left';

        if (direction === 'next') {
            currentIndex = (currentIndex + 1) % teamData.length;
        } else {
            currentIndex = (currentIndex - 1 + teamData.length) % teamData.length;
        }

        const nextData = teamData[currentIndex];

        // 1. ВІДПРАВЛЯЄМО ВЕСЬ КОНТЕНТ ЗА ЕКРАН
        els.photoWrapper.classList.remove('carousel-center');
        els.infoCard.classList.remove('carousel-center');
        els.quoteCard.classList.remove('carousel-center');

        els.photoWrapper.classList.add(outClass);
        els.infoCard.classList.add(outClass);
        els.quoteCard.classList.add(outClass);

        // 2. Чекаємо поки все сховається
        setTimeout(() => {
            // Міняємо дані (картинка зараз невидима)
            els.photo.src = nextData.photo;
            els.name.textContent = nextData.name;
            els.role.textContent = nextData.role;
            els.desc.textContent = nextData.desc;
            els.number.textContent = nextData.number;
            els.quote.textContent = nextData.quote;

            // Перекидаємо ОБГОРТКУ на інший бік
            els.photoWrapper.classList.remove(outClass);
            els.infoCard.classList.remove(outClass);
            els.quoteCard.classList.remove(outClass);

            els.photoWrapper.classList.add(readyClass);
            els.infoCard.classList.add(readyClass);
            els.quoteCard.classList.add(readyClass);

            // 3. ВИВОДИМО НОВИЙ КОНТЕНТ У ЦЕНТР
            requestAnimationFrame(() => {
                void els.photoWrapper.offsetWidth; 

                els.photoWrapper.classList.remove(readyClass);
                els.infoCard.classList.remove(readyClass);
                els.quoteCard.classList.remove(readyClass);

                els.photoWrapper.classList.add('carousel-center');
                els.infoCard.classList.add('carousel-center');
                els.quoteCard.classList.add('carousel-center');

                setTimeout(() => { isAnimating = false; }, 400);
            });

        }, 400); 
    }

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


