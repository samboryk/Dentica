// Team Data Configuration
    
    
    
const teamData = [
        {
            id: "tkachuk",
            photo: "assets/images/doctor1.webp", 
            photoLarge: "assets/images/doctor1_1.webp",
            name: "Вікторія Ткачук",
            role: "Головний лікар-стоматолог",
            desc: "Експерт з естетичної стоматології та складних реставрацій. Поєднує багаторічний досвід із цифровими технологіями, створюючи ідеальні посмішки з увагою до кожної деталі.",
            about: "Головний лікар клініки з багаторічним досвідом. Вважає, що сучасна стоматологія має бути не лише ефективною, але й абсолютно безболісною та комфортною для пацієнта.",
            education: [
                "<b>2014 – 2019 рр.</b> — Національний медичний університет імені О.О. Богомольця, спеціальність «Стоматологія».",
                "<b>2019 – 2021 рр.</b> — Інтернатура за спеціальністю «Загальна стоматологія» на базі НМАПО ім. П.Л. Шупика.",
                "<b>2021 р.</b> — Отримання вузької спеціалізації «Терапевтична стоматологія».",
                "<b>З 2022 р.</b> — Дійсний член Асоціації стоматологів України."
            ],
            specialization: [
                "Володіє сучасними протоколами лікування карієсу та його ускладнень. Спеціалізується на високоестетичній реставрації зубів, мікроскопічній ендодонтії (лікування каналів під мікроскопом) та професійному відбілюванні.",
                "Регулярно проходить стажування з використання цифрових технологій у стоматології."
            ],
            experience: [
                "Понад 6 років безперервної клінічної практики у провідних стоматологічних центрах Києва. З 2023 року — провідний спеціаліст та головний лікар клініки Dentica."
            ],
            certificates: [
                "assets/images/cert1.webp",
                "assets/images/cert2.webp",
                "assets/images/cert3.webp"
            ],
            number: "01"
        },
        {
            id: "petrenko",
            photo: "assets/images/doctor2.webp", 
            photoLarge: "assets/images/doctor2_1.png",
            name: "Іван Петренко",
            role: "Хірург-імплантолог",
            desc: "Спеціалізується на безболісній хірургії та відновленні втрачених зубів. Використовує передові протоколи лікування для максимального комфорту пацієнтів.",
            about: "Висококваліфікований хірург, який постійно вдосконалює свої навички. Головна мета — забезпечити кожному пацієнту безпечне та прогнозоване лікування.",
            education: [
                "<b>2012 – 2017 рр.</b> — Національний медичний університет імені О.О. Богомольця.",
                "<b>2017 – 2019 рр.</b> — Інтернатура та спеціалізація з хірургічної стоматології."
            ],
            specialization: [
                "Дентальна імплантація будь-якого рівня складності.",
                "Кісткова пластика та синус-ліфтинг.",
                "Атравматичне видалення зубів мудрості."
            ],
            experience: [
                "Понад 7 років досвіду роботи в провідних хірургічних центрах. Тисячі успішно встановлених імплантатів."
            ],
            certificates: [
                "assets/images/cp1.png",
                "assets/images/cp2.png"
            ],
            number: "02"
        },
        {
            id: "koval",
            photo: "assets/images/doctor3.webp", 
            photoLarge: "assets/images/doctor3_1.png",
            name: "Марія Коваль",
            role: "Ортодонт",
            desc: "Допомагає вирівняти зуби та виправити прикус у будь-якому віці за допомогою сучасних брекет-систем та невидимих елайнерів.",
            about: "Марія переконана, що правильний прикус — це основа не лише красивої усмішки, але й здоров'я всього організму. Індивідуальний підхід до кожного.",
            education: [
                "<b>2015 – 2020 рр.</b> — Львівський національний медичний університет.",
                "<b>2020 – 2022 рр.</b> — Спеціалізація з ортодонтії."
            ],
            specialization: [
                "Лікування прикусу за допомогою сучасних брекет-систем.",
                "Ортодонтичне лікування невидимими елайнерами (Invisalign).",
                "Дитяча ортодонтія (пластинки, апарати)."
            ],
            experience: [
                "5 років успішної практики. Більше 500 пацієнтів з ідеальними усмішками після зняття брекетів."
            ],
            certificates: [
                "assets/images/ck1.png",
                "assets/images/ck3.png",
                "assets/images/ck2.png"
            ],
            number: "03"
        }
    ];

    let currentTeamIndex = 0;
    let isTeamAnimating = false;

    
    const els = {
        photo: document.getElementById('team-photo'),
        photoWrapper: document.querySelector('.team-image-wrapper'),
        infoCard: document.getElementById('team-info-card'),
        actionCard: document.querySelector('.contact-action-card'), 
        name: document.getElementById('team-name'),
        role: document.getElementById('team-role'),
        desc: document.getElementById('team-desc'),
        number: document.getElementById('team-number'),
        link: document.querySelector('.team-member-link'),
        btnNext: document.getElementById('team-next'),
        btnPrev: document.getElementById('team-prev')
    };

    
    if (els.photo && els.btnNext && els.btnPrev) {
        
        
        if (els.photoWrapper) els.photoWrapper.classList.add('carousel-center');
        if (els.infoCard) els.infoCard.classList.add('carousel-center');
        if (els.actionCard) els.actionCard.classList.add('carousel-center');

        
        teamData.forEach(member => {
            const img = new Image();
            img.src = member.photo;
        });
        
        // Initialize the first link on page load
        if (els.link && teamData[0]) {
            els.link.href = `doctor.html?id=${teamData[0].id}`;
        }

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

            
            const elementsToAnimate = [els.photoWrapper, els.infoCard, els.actionCard].filter(el => el !== null);

            
            elementsToAnimate.forEach(el => {
                el.classList.remove('carousel-center');
                el.classList.add(outClass);
            });

            
            setTimeout(() => {
                
                if (els.photo) els.photo.src = nextData.photo;
                if (els.name) els.name.textContent = nextData.name;
                if (els.role) els.role.textContent = nextData.role;
                if (els.desc) els.desc.textContent = nextData.desc;
                if (els.number) els.number.textContent = nextData.number;
                if (els.link) els.link.href = `doctor.html?id=${nextData.id}`;

                
                elementsToAnimate.forEach(el => {
                    el.classList.remove(outClass);
                    el.classList.add(readyClass);
                });

                
                requestAnimationFrame(() => {
                    elementsToAnimate.forEach(el => {
                        el.classList.remove(readyClass);
                        el.classList.add('carousel-center');
                    });

                    setTimeout(() => { isTeamAnimating = false; }, 500);
                });

            }, 500); 
        }

        els.btnNext.addEventListener('click', () => changeTeamSlide('next'));
        els.btnPrev.addEventListener('click', () => changeTeamSlide('prev'));

        
        let teamStartX = 0;
        let teamEndX = 0;
        const teamSwipeZone = document.querySelector('.team-content-grid');

        if (teamSwipeZone) {
            teamSwipeZone.addEventListener('touchstart', (e) => {
                teamStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            teamSwipeZone.addEventListener('touchend', (e) => {
                teamEndX = e.changedTouches[0].screenX;
                const diff = teamStartX - teamEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) changeTeamSlide('next');
                    else changeTeamSlide('prev');
                }
            }, { passive: true });
        }
    }


document.addEventListener("DOMContentLoaded", () => {
    
    
    
    const track = document.getElementById('reviews-track');
    const btnNext = document.getElementById('rev-next');
    const btnPrev = document.getElementById('rev-prev');
    const paginationContainer = document.getElementById('reviews-pagination');
    
    if (!track || !btnNext || !btnPrev || !paginationContainer) return;

    let currentIndex = 0;
    const cards = track.querySelectorAll('.review-card');
    const totalCards = cards.length;
    const autoPlayInterval = 4000; 
    let autoPlayTimer;

    
    function getSliderParams() {
        const visibleCards = window.innerWidth <= 480 ? 1 : 3;
        const maxIndex = Math.max(0, totalCards - visibleCards);
        return { visibleCards, maxIndex };
    }

    let { visibleCards, maxIndex } = getSliderParams();

    
    function renderPagination() {
        paginationContainer.innerHTML = '';
        ({ maxIndex } = getSliderParams()); 
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (i === currentIndex) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSliderPosition();
                resetAutoPlay(); 
            });
            
            paginationContainer.appendChild(dot);
        }
    }

    
    function updateSliderPosition() {
        if (!cards.length) return;
        
        ({ maxIndex } = getSliderParams());
        
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const cardWidth = cards[0].offsetWidth;
        const gap = window.innerWidth <= 480 ? 16 : 24; 
        
        const moveDistance = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveDistance}px)`;

        
        const dots = paginationContainer.querySelectorAll('.pagination-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    
    function nextSlide() {
        ({ maxIndex } = getSliderParams());
        currentIndex = (currentIndex < maxIndex) ? currentIndex + 1 : 0;
        updateSliderPosition();
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    
    btnNext.addEventListener('click', () => {
        ({ maxIndex } = getSliderParams());
        currentIndex = (currentIndex < maxIndex) ? currentIndex + 1 : 0;
        updateSliderPosition();
        resetAutoPlay();
    });

    btnPrev.addEventListener('click', () => {
        ({ maxIndex } = getSliderParams());
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
        updateSliderPosition();
        resetAutoPlay();
    });

    
    track.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    track.addEventListener('mouseleave', startAutoPlay);

    
    let revStartX = 0;
    let revEndX = 0;

    track.addEventListener('touchstart', (e) => {
        revStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        revEndX = e.changedTouches[0].screenX;
        const diff = revStartX - revEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else {
                ({ maxIndex } = getSliderParams());
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
                updateSliderPosition();
            }
            resetAutoPlay();
        }
    }, { passive: true });

    
    renderPagination();
    updateSliderPosition();
    startAutoPlay();

    window.addEventListener('resize', () => {
        renderPagination();
        updateSliderPosition();
    });
});
