// ===== Theme Toggle =====
function initTheme() {
  const saved = localStorage.getItem('alexanders-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('alexanders-theme', next);
}

// ===== Mobile Menu =====
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in, .fade-in-right, .fade-in-left, .stagger-children').forEach(el => {
    observer.observe(el);
  });
}

// ===== Committees Slider =====
function initCommitteesSlider() {
  const slider = document.querySelector('.committees-slider');
  const prevBtn = document.querySelector('.committees-prev');
  const nextBtn = document.querySelector('.committees-next');

  if (!slider || !prevBtn || !nextBtn) return;

  const scrollAmount = 370;

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

// ===== Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = counter.getAttribute('data-target');
        if (!target) return;

        const targetNum = parseInt(target);
        const prefix = target.includes('+') ? '+' : '';
        let current = 0;
        const increment = targetNum / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= targetNum) {
            current = targetNum;
            clearInterval(timer);
          }
          counter.textContent = prefix + Math.floor(current);
        }, 30);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===== Navbar scroll effect =====
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollAnimations();
  initCommitteesSlider();
  animateCounters();
  initNavbarScroll();
});
