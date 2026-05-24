document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const serviceId = params.get('id');

    if (!serviceId) {
        window.location.href = '/services.html';
        return;
    }

    const service = typeof servicesData !== 'undefined' ? servicesData.find(s => s.id === serviceId) : null;

    if (!service) {
        window.location.href = '/services.html';
        return;
    }

    // Оновлення мета-тегів та title
    document.title = `${service.title} - Dentica`;
    
    // Оновлення основної інформації
    const titleEl = document.getElementById('srv-title');
    if (titleEl) titleEl.textContent = service.title;

    const photoEl = document.getElementById('srv-photo');
    if (photoEl) {
        photoEl.src = service.photo;
        photoEl.alt = service.title;
    }

    // Генерація акордеону
    const accordionWrapper = document.getElementById('srv-accordion');
    if (accordionWrapper) {
        let accordionHTML = '';
        let delay = 100;

        // 1. Про послугу
        if (service.desc) {
            accordionHTML += `
            <div data-aos="fade-up" data-aos-delay="${delay}" class="accordion-item">
                <div class="accordion-header">
                    <h3 class="accordion-title">Про послугу</h3>
                    <button class="accordion-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
                    </button>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner-text">
                        <div class="accordion-text-block">
                            <p>${service.desc}</p>
                        </div>
                    </div>
                </div>
            </div>
            `;
            delay += 100;
        }

        // 2. Прайс-лист
        if (service.prices && service.prices.length > 0) {
            let priceListHTML = '<ul class="price-card-list">';
            service.prices.forEach(price => {
                priceListHTML += `
                    <li class="price-row">
                        <span class="price-row-name">${price.name}</span>
                        <span class="price-row-value">${price.value}</span>
                    </li>
                `;
            });
            priceListHTML += '</ul>';

            accordionHTML += `
            <div data-aos="fade-up" data-aos-delay="${delay}" class="accordion-item">
                <div class="accordion-header">
                    <h3 class="accordion-title">Прайс-лист</h3>
                    <button class="accordion-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
                    </button>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner-text">
                        <div class="accordion-text-block">
                            ${priceListHTML}
                        </div>
                    </div>
                </div>
            </div>
            `;
            delay += 100;
        }

        // 3. Часті запитання
        if (service.faq && service.faq.length > 0) {
            let faqHTML = '';
            service.faq.forEach(item => {
                faqHTML += `
                    <b>${item.q}</b>
                    <p>${item.a}</p>
                `;
            });

            accordionHTML += `
            <div data-aos="fade-up" data-aos-delay="${delay}" class="accordion-item">
                <div class="accordion-header">
                    <h3 class="accordion-title">Часті запитання</h3>
                    <button class="accordion-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
                    </button>
                </div>
                <div class="accordion-content">
                    <div class="accordion-inner-text">
                        <div class="accordion-text-block">
                            ${faqHTML}
                        </div>
                    </div>
                </div>
            </div>
            `;
        }

        accordionWrapper.innerHTML = accordionHTML;

        // Перепідключення логіки акордеону
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
});
