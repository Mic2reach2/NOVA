// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

// Appointment form handler
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const messageDiv = document.getElementById('appointmentMessage');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      const response = await fetch('appointment.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      messageDiv.style.display = 'block';

      if (result.success) {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
        messageDiv.textContent = result.message;
        appointmentForm.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
          messageDiv.style.display = 'none';
        }, 5000);
      } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
        messageDiv.textContent = result.message || 'An error occurred. Please try again.';
      }
    } catch (error) {
      messageDiv.style.display = 'block';
      messageDiv.style.backgroundColor = '#f8d7da';
      messageDiv.style.color = '#721c24';
      messageDiv.style.border = '1px solid #f5c6cb';
      messageDiv.textContent = 'Network error. Please check your connection and try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

// Hero Slider functionality
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.querySelector('.slider-dots');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  let currentSlide = 0;
  let autoPlayTimer;

  // Initialize dots
  const createDots = () => {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('data-slide', index);
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  };

  const showSlide = (n) => {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
        dot.classList.remove('active');
      });
    }

    // Add active class to current slide and dot
    slides[n].classList.add('active');
    if (dotsContainer) {
      const activeDot = dotsContainer.querySelector(`[data-slide="${n}"]`);
      if (activeDot) activeDot.classList.add('active');
    }
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    resetAutoPlay();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    resetAutoPlay();
  };

  const goToSlide = (n) => {
    currentSlide = n;
    showSlide(currentSlide);
    resetAutoPlay();
  };

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(nextSlide, 6000); // Change slide every 6 seconds
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Pause autoplay on hover
  heroSlider.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  heroSlider.addEventListener('mouseleave', startAutoPlay);

  // Initialize
  createDots();
  showSlide(0);
  startAutoPlay();
}

// Scroll animation observer - observe all elements with animations
const animatedElements = document.querySelectorAll(
  "[class*='animate'], [class*='slide-left'], [class*='slide-right'], .card, .service-block, .hero-badge, .hero-text h1, .hero-text p, .hero-cta, .hero-features, .page-hero-content, .page-hero-cta, .why-choose-item, .why-choose-content, .why-choose-image"
);

if (animatedElements.length > 0) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  animatedElements.forEach(el => observer.observe(el));
}
