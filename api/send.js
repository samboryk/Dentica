function goTo(index) {
  dotsContainer.children[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsContainer.children[current].classList.add('active');
}

document.getElementById('prevBtn')
  .addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn')
  .addEventListener('click', () => goTo(current + 1));

setInterval(() => goTo(current + 1), 5000);