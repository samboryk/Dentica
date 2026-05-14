document.addEventListener("DOMContentLoaded", () => {
    
    
    
    const teamData = [
        {
            photo: "assets/images/doctor1.webp", 
            name: "Вікторія Ткачук",
            role: "Головний лікар-стоматолог",
            desc: "Експерт з естетичної стоматології та складних реставрацій. Поєднує багаторічний досвід із цифровими технологіями, створюючи ідеальні посмішки з увагою до кожної деталі.",
            number: "01"
        },
        {
            photo: "assets/images/doctor2.webp", 
            name: "Іван Петренко",
            role: "Хірург-імплантолог",
            desc: "Спеціалізується на безболісній хірургії та відновленні втрачених зубів. Використовує передові протоколи лікування для максимального комфорту пацієнтів.",
            number: "02"
        },
        {
            photo: "assets/images/doctor3.webp", 
            name: "Марія Коваль",
            role: "Ортодонт",
            desc: "Допомагає вирівняти зуби та виправити прикус у будь-якому віці за допомогою сучасних брекет-систем та невидимих елайнерів.",
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
});


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
