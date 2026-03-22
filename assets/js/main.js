// Зачекаємо, поки DOM завантажиться
document.addEventListener("DOMContentLoaded", function() {
  const themeToggle = document.querySelector(".theme-toggle");
  
  // Додаємо обробник кліку
  themeToggle.addEventListener("click", function() {
    // toggles .active class on and off
    this.classList.toggle("active");
  });
});


