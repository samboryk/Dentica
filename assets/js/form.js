document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('appointmentModal');
    const openBtns = document.querySelectorAll('.js-open-modal');
    const closeBtn = document.getElementById('closeModalBtn');

    window.addEventListener('load', () => {
        if (!document.getElementById('flag-icons-css')) {
            const link = document.createElement('link');
            link.id = 'flag-icons-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css';
            document.head.appendChild(link);
            
            const img = new Image();
            img.src = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/flags/4x3/ua.svg';
        }
    });

    // Функція відкриття модалки
    const openModal = () => {
        modalOverlay.classList.add('is-active');
      
        // Завантажуємо решту прапорів відразу після відкриття модалки
        document.querySelectorAll('.lazy-flag').forEach(span => {
            if (span.dataset.flag) {
                span.className = span.dataset.flag;
                span.removeAttribute('data-flag');
            }
        });

        // Фокус на інпут з невеликою затримкою для плавності
        setTimeout(() => {
            document.getElementById('phoneInput').focus();
        }, 100);
    };

    // Функція закриття модалки
    const closeModal = () => {
        modalOverlay.classList.remove('is-active');
       
    };

   if (openBtns.length > 0) {
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Зупиняє перехід по посиланню, якщо це тег <a>
            openModal();
        });
    });
}

    if(closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Закриття при кліку на темний фон поза карткою
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Закриття клавішею Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
            closeModal();
        }
    });
});


    // Налаштування Telegram тепер захищено на бекенді
    const API_URL = "/api/telegram";



    const input = document.getElementById("phoneInput");
    const wrapper = document.getElementById("customPhoneWrapper");
    const msgEl = document.getElementById("msg");
    const submitBtn = document.getElementById("submitBtn");
    const formState = document.getElementById("formState");
    const successState = document.getElementById("successState");

    const countrySelector = document.getElementById("countrySelector");
    const countryList = document.getElementById("countryList");
    const selectedFlag = document.getElementById("selectedFlag");
    const selectedCode = document.getElementById("selectedCode");

    let currentCountry = 'UA';
    let currentCode = '+380';

    // === 1. ГЕНЕРАЦІЯ КРАЇН ТА ПРАПОРІВ ===
    const regionNames = new Intl.DisplayNames(['uk'], { type: 'region' });

    let countriesData = libphonenumber.getCountries().map(code => {
        try {
            return {
                code: code,
                dial: '+' + libphonenumber.getCountryCallingCode(code),
                name: regionNames.of(code)
            };
        } catch (e) {
            return null;
        }
    }).filter(Boolean);

    countriesData.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
    const uaIndex = countriesData.findIndex(c => c.code === 'UA');
    if (uaIndex > -1) countriesData.unshift(countriesData.splice(uaIndex, 1)[0]);

    function renderCountries() {
        countryList.innerHTML = ''; 
        countriesData.forEach(country => {
            const li = document.createElement('li');
            li.className = `country-item ${country.code === currentCountry ? 'active' : ''}`;
            
            const flagClass = `fi fi-${country.code.toLowerCase()}`;
            li.innerHTML = `<span class="lazy-flag" data-flag="${flagClass}" style="font-size: 16px; border-radius: 2px;"></span> ${country.name} (${country.dial})`;
            
            li.addEventListener('click', () => {
                document.querySelectorAll('.country-item').forEach(i => i.classList.remove('active'));
                li.classList.add('active');
                
                currentCountry = country.code;
                currentCode = country.dial;
                
                selectedFlag.className = `fi fi-${country.code.toLowerCase()}`;
                selectedCode.textContent = country.dial;
                
                // Очищаємо інпут при зміні країни
                input.value = ''; 
                countryList.classList.remove('open');
                input.focus();
                resetValidation();
            });
            
            countryList.appendChild(li);
        });
    }

    renderCountries();

    // Відкрити/Закрити список
    countrySelector.addEventListener('click', () => countryList.classList.toggle('open'));
    document.addEventListener('click', (e) => {
        if (!countrySelector.contains(e.target) && !countryList.contains(e.target)) {
            countryList.classList.remove('open');
        }
    });

    // === 2. РОЗУМНА МАСКА (БЕЗ CLEAVE) ===
    input.addEventListener('focus', () => wrapper.classList.add('focused'));
    input.addEventListener('blur', () => wrapper.classList.remove('focused'));

    input.addEventListener('input', () => {
        resetValidation();
        
        // 1. Залишаємо тільки цифри
        let rawDigits = input.value.replace(/\D/g, ''); 

        // 2. ФІШКА ДЛЯ УКРАЇНИ: якщо людина вводить "050", прибираємо перший "0"
        if (currentCountry === 'UA' && rawDigits.startsWith('0')) {
            rawDigits = rawDigits.substring(1);
        }

        if (!rawDigits) {
            input.value = '';
            return;
        }

        // 3. Віддаємо бібліотеці код + цифри для красивого форматування
        let formatter = new libphonenumber.AsYouType(currentCountry);
        let formattedFull = formatter.input(currentCode + rawDigits);

        // 4. Відрізаємо код країни (напр. "+380 ") від результату
        let displayValue = formattedFull;
        if (displayValue.startsWith(currentCode)) {
            displayValue = displayValue.slice(currentCode.length).trim();
        }

        // 5. Виводимо готову маску в інпут
        input.value = displayValue;
    });

    function resetValidation() {
        wrapper.classList.remove("error");
        msgEl.innerHTML = "";
        msgEl.classList.remove("show");
    }

    // === 3. ВАЛІДАЦІЯ ТА ВІДПРАВКА ===
    submitBtn.addEventListener('click', async () => {
        resetValidation();

        let rawNumber = input.value.replace(/\D/g, '');
        
        // Повертаємо 0 для України перед перевіркою, якщо його немає, 
        // щоб бібліотека 100% правильно перевірила валідність
        if (currentCountry === 'UA' && rawNumber.length === 9) {
            rawNumber = '0' + rawNumber;
        }

        let fullNumberForValidation = currentCode + rawNumber;
        let parsedNumber = libphonenumber.parsePhoneNumberFromString(fullNumberForValidation, currentCountry);

        // Перевіряємо чи номер до кінця введений
        if (!parsedNumber || !parsedNumber.isValid()) {
            wrapper.classList.add("error");
            msgEl.innerHTML = "⚠ Введіть повний та коректний номер";
            msgEl.classList.add("show");
            return;
        }

        const finalNumber = parsedNumber.format('E.164');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = "Відправка...";
        submitBtn.disabled = true;

        try {
            const res = await fetch(API_URL, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: finalNumber }) 
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Помилка сервера");

            formState.style.display = 'none';
            successState.style.display = 'flex';

        } catch (e) {
            wrapper.classList.add("error");
            msgEl.innerHTML = "⚠ Помилка відправки. Спробуйте пізніше.";
            msgEl.classList.add("show");
        } finally {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    input.addEventListener('keydown', (e) => { 
        if (e.key === 'Enter') { e.preventDefault(); submitBtn.click(); }
    });