// Зачекаємо, поки DOM завантажиться
document.addEventListener("DOMContentLoaded", function() {
  const themeToggle = document.querySelector(".theme-toggle");
  
  // Додаємо обробник кліку
  themeToggle.addEventListener("click", function() {
    // toggles .active class on and off
    this.classList.toggle("active");
  });
});


// 1. Сюди треба буде вставити ваш публічний токен
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtYm9yeWsiLCJhIjoiY21uMmM4dDF2MHphYjJwcXNranh4M2ZwbyJ9.guETzstSNyXsukmzNScjMg';

// 2. Ініціалізуємо карту
const map = new mapboxgl.Map({
    container: 'map', // ID нашого div
    style: 'mapbox://styles/mapbox/dark-v11', // Розкішна темна тема Mapbox
    center: [30.5332, 50.4265], // Координати: [Довгота, Широта]
    zoom: 15.5 // Рівень наближення
});

// 3. Додаємо маркер, колір якого збігається з вашою кнопкою (#BFDCFF)
const marker = new mapboxgl.Marker({ color: '#BFDCFF' })
    .setLngLat([30.5332, 50.4265])
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // Спливаюче вікно при кліку
            .setHTML('<h3 style="color:#000; margin:0; font-family:sans-serif;">Dentica</h3><p style="color:#333; margin:5px 0 0; font-family:sans-serif;">вул. Євгена Коновальця, 36Е</p>')
    )
    .addTo(map);

// Вимикаємо зум скролом миші, щоб сторінка не "застрягала" при прокручуванні вниз
map.scrollZoom.disable();