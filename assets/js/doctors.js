document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // СЛАЙДЕР КОМАНДИ (ЛІКАРІ)
    // ==========================================
    const teamData = [
        {
            photo: "assets/images/doctor1.png", 
            name: "Олександра Ромашевська",
            role: "Головний лікар-стоматолог",
            desc: "Експерт з естетичної стоматології та складних реставрацій. Поєднує багаторічний досвід із цифровими технологіями, створюючи ідеальні посмішки з увагою до кожної деталі.",
            number: "01"
        },
        {
            photo: "assets/images/doctor2.png", 
            name: "Іван Петренко",
            role: "Хірург-імплантолог",
            desc: "Спеціалізується на безболісній хірургії та відновленні втрачених зубів. Використовує передові протоколи лікування для максимального комфорту пацієнтів.",
            number: "02"
        },
        {
            photo: "assets/images/doctor3.png", 
            name: "Марія Коваль",
            role: "Ортодонт",
            desc: "Допомагає вирівняти зуби та виправити прикус у будь-якому віці за допомогою сучасних брекет-систем та невидимих елайнерів.",
            number: "03"
        }
    ];

    let currentTeamIndex = 0;
    let isTeamAnimating = false;

    // Збираємо всі елементи безпечно
    const els = {
        photo: document.getElementById('team-photo'),
        photoWrapper: document.querySelector('.team-image-wrapper'),
        infoCard: document.getElementById('team-info-card'),
        actionCard: document.querySelector('.contact-action-card'), // Нова картка з графіком
        name: document.getElementById('team-name'),
        role: document.getElementById('team-role'),
        desc: document.getElementById('team-desc'),
        number: document.getElementById('team-number'),
        btnNext: document.getElementById('team-next'),
        btnPrev: document.getElementById('team-prev')
    };

    // Якщо на сторінці немає кнопок або фото (наприклад, це інша сторінка) - виходимо
    if (els.photo && els.btnNext && els.btnPrev) {
        
        // Початковий стан: ставимо існуючі обгортки по центру
        if (els.photoWrapper) els.photoWrapper.classList.add('carousel-center');
        if (els.infoCard) els.infoCard.classList.add('carousel-center');
        if (els.actionCard) els.actionCard.classList.add('carousel-center');

        // Попереднє завантаження картинок
        teamData.forEach(member => {
            const img = new Image();
            img.src = member.photo;
        });

        function changeTeamSlide(direction) {
            if (isTeamAnimating) return;
            isTeamAnimating = true;

            const outClass = direction === 'next' ? 'carousel-out-left' : 'carousel-out-right';
            const readyClass = direction === 'next' ? 'carousel-ready-right' : 'carousel-ready-left';

            if (direction === 'next') {
                currentTeamIndex = (currentTeamIndex + 1) % teamData.length;
            } else {
                currentTeamIndex = (currentTeamIndex - 1 + teamData.length) % teamData.length;
            }

            const nextData = teamData[currentTeamIndex];

            // Фільтруємо тільки ті елементи, які реально існують в HTML
            const elementsToAnimate = [els.photoWrapper, els.infoCard, els.actionCard].filter(el => el !== null);

            // 1. ВІДПРАВЛЯЄМО ВЕСЬ КОНТЕНТ ЗА ЕКРАН
            elementsToAnimate.forEach(el => {
                el.classList.remove('carousel-center');
                el.classList.add(outClass);
            });

            // 2. Чекаємо поки все сховається
            setTimeout(() => {
                // Безпечно міняємо дані (тільки ті, що змінюються і існують)
                if (els.photo) els.photo.src = nextData.photo;
                if (els.name) els.name.textContent = nextData.name;
                if (els.role) els.role.textContent = nextData.role;
                if (els.desc) els.desc.textContent = nextData.desc;
                if (els.number) els.number.textContent = nextData.number;

                // Перекидаємо ОБГОРТКИ на інший бік
                elementsToAnimate.forEach(el => {
                    el.classList.remove(outClass);
                    el.classList.add(readyClass);
                });

                // 3. ВИВОДИМО НОВИЙ КОНТЕНТ У ЦЕНТР
                requestAnimationFrame(() => {
                    void (els.photoWrapper ? els.photoWrapper.offsetWidth : 0); 

                    elementsToAnimate.forEach(el => {
                        el.classList.remove(readyClass);
                        el.classList.add('carousel-center');
                    });

                    setTimeout(() => { isTeamAnimating = false; }, 400);
                });

            }, 400); 
        }

        els.btnNext.addEventListener('click', () => changeTeamSlide('next'));
        els.btnPrev.addEventListener('click', () => changeTeamSlide('prev'));
    }
});


document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // СЛАЙДЕР ВІДГУКІВ
    // ==========================================
    const track = document.getElementById('reviews-track');
    const btnNext = document.getElementById('rev-next');
    const btnPrev = document.getElementById('rev-prev');
    const paginationContainer = document.getElementById('reviews-pagination');
    
    // Якщо елементів відгуків немає на цій сторінці - безпечно виходимо
    if (!track || !btnNext || !btnPrev || !paginationContainer) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.review-card');
    const visibleCards = 3; 
    const totalCards = cards.length;
    const maxIndex = Math.max(0, totalCards - visibleCards);
    const autoPlayInterval = 4000; 
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
            resetAutoPlay(); 
        });
        
        paginationContainer.appendChild(dot);
    }
    const dots = paginationContainer.querySelectorAll('.pagination-dot');

    // --- Оновлення позиції ---
    function updateSliderPosition() {
        if (!cards.length) return;
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
            currentIndex = 0; 
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