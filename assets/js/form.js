document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('appointmentModal');
    const openBtns = document.querySelectorAll('.js-open-modal');
    const closeBtn = document.getElementById('closeModalBtn');

    window.addEventListener('load', () => {
        if (!document.getElementById('flag-icons-css')) {
            const link = document.createElement('link');
            link.id = 'flag-icons-css';
            link.rel = 'stylesheet';
            link.href = 'https:
            document.head.appendChild(link);
            
            const img = new Image();
            img.src = 'https:
        }
    });

    
    const openModal = () => {
        modalOverlay.classList.add('is-active');
      
        
        document.querySelectorAll('.lazy-flag').forEach(span => {
            if (span.dataset.flag) {
                span.className = span.dataset.flag;
                span.removeAttribute('data-flag');
            }
        });

        
        setTimeout(() => {
            document.getElementById('phoneInput').focus();
        }, 100);
    };

    
    const closeModal = () => {
        modalOverlay.classList.remove('is-active');
       
    };

   if (openBtns.length > 0) {
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            openModal();
        });
    });
}

    if(closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
            closeModal();
        }
    });
});


    
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
                
                
                input.value = ''; 
                countryList.classList.remove('open');
                input.focus();
                resetValidation();
            });
            
            countryList.appendChild(li);
        });
    }

    renderCountries();

    
    countrySelector.addEventListener('click', () => countryList.classList.toggle('open'));
    document.addEventListener('click', (e) => {
        if (!countrySelector.contains(e.target) && !countryList.contains(e.target)) {
            countryList.classList.remove('open');
        }
    });

    
    input.addEventListener('focus', () => wrapper.classList.add('focused'));
    input.addEventListener('blur', () => wrapper.classList.remove('focused'));

    input.addEventListener('input', () => {
        resetValidation();
        
        
        let rawDigits = input.value.replace(/\D/g, ''); 

        
        if (currentCountry === 'UA' && rawDigits.startsWith('0')) {
            rawDigits = rawDigits.substring(1);
        }

        if (!rawDigits) {
            input.value = '';
            return;
        }

        
        let formatter = new libphonenumber.AsYouType(currentCountry);
        let formattedFull = formatter.input(currentCode + rawDigits);

        
        let displayValue = formattedFull;
        if (displayValue.startsWith(currentCode)) {
            displayValue = displayValue.slice(currentCode.length).trim();
        }

        
        input.value = displayValue;
    });

    function resetValidation() {
        wrapper.classList.remove("error");
        msgEl.innerHTML = "";
        msgEl.classList.remove("show");
    }

    
    submitBtn.addEventListener('click', async () => {
        resetValidation();

        let rawNumber = input.value.replace(/\D/g, '');
        
        
        
        if (currentCountry === 'UA' && rawNumber.length === 9) {
            rawNumber = '0' + rawNumber;
        }

        let fullNumberForValidation = currentCode + rawNumber;
        let parsedNumber = libphonenumber.parsePhoneNumberFromString(fullNumberForValidation, currentCountry);

        
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