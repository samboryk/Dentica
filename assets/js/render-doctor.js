document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get('id');

    if (!doctorId) {
        window.location.href = '/specialists.html';
        return;
    }

    const doctor = teamData.find(d => d.id === doctorId);

    if (!doctor) {
        window.location.href = '/specialists.html';
        return;
    }

    // Оновлення мета-тегів та title
    document.title = `${doctor.name} - Dentica`;
    
    // Оновлення основної інформації
    const nameEl = document.getElementById('doc-name');
    if (nameEl) nameEl.textContent = doctor.name;

    const photoEl = document.getElementById('doc-photo');
    if (photoEl) {
        photoEl.src = doctor.photoLarge || doctor.photo;
        photoEl.alt = doctor.name;
    }

    // Генерація акордеону
    const accordionWrapper = document.getElementById('doc-accordion');
    if (accordionWrapper) {
        let accordionHTML = '';
        let delay = 100;

        const sections = [
            { title: "Про лікаря", content: `<p>${doctor.about || doctor.desc}</p>` },
            { title: "Освіта та кваліфікація", content: doctor.education ? doctor.education.map(item => `<p>${item}</p>`).join('') : '' },
            { title: "Спеціалізація та навички", content: doctor.specialization ? doctor.specialization.map(item => `<p>${item}</p>`).join('') : '' },
            { title: "Досвід роботи", content: doctor.experience ? doctor.experience.map(item => `<p>${item}</p>`).join('') : '' }
        ];

        sections.forEach(sec => {
            if (sec.content) {
                accordionHTML += `
                <div data-aos="fade-up" data-aos-delay="${delay}" class="accordion-item">
                    <div class="accordion-header">
                        <h3 class="accordion-title">${sec.title}</h3>
                        <button class="accordion-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
                        </button>
                    </div>
                    <div class="accordion-content">
                        <div class="accordion-inner-text">
                            <div class="accordion-text-block">
                                ${sec.content}
                            </div>
                        </div>
                    </div>
                </div>
                `;
                delay += 100;
            }
        });

        accordionWrapper.innerHTML = accordionHTML;
        
        // Перепідключення логіки акордеону (вона зазвичай ініціалізується в main.js, 
        // але оскільки ми додали елементи динамічно, може знадобитись її ручна ініціалізація тут)
        const accordionItems = accordionWrapper.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                accordionItems.forEach(i => {
                    i.classList.remove('active');
                });

                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
        if (typeof AOS !== 'undefined') {
            setTimeout(() => AOS.refreshHard(), 100);
        }
    }

    // Сертифікати
    const certTrack = document.getElementById('cert-track');
    const certSection = document.querySelector('.certificates');
    if (certTrack && certSection) {
        if (doctor.certificates && doctor.certificates.length > 0) {
            certTrack.innerHTML = doctor.certificates.map((cert, index) => 
                `<img src="${cert}" alt="Сертифікат ${index + 1}" class="cert-card">`
            ).join('');
        } else {
            certSection.style.display = 'none';
        }
    }
});
