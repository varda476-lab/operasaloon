/* ==========================================================================
   Opera Prime Salon - Interactivity & Luxury Web Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Navbar Scroll Effect & Active Nav Link Highlighter
  const header = document.querySelector('.navbar-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header Glassmorphism scroll change
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Nav-link scroll highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Hamburger Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }


  // 2. Cursor Glow Tracker (Desktop Only)
  const cursorGlow = document.getElementById('cursorGlow');
  
  if (cursorGlow && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }


  // 3. Floating Gold Particles Canvas
  const canvas = document.getElementById('particlesCanvas');
  
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    // Set Canvas Size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * -0.5 - 0.1; // Slow rise upwards
        this.alpha = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Fading out
        this.alpha -= this.fadeSpeed;

        // Reset particle if out of screen or invisible
        if (this.y < 0 || this.alpha <= 0 || this.x < 0 || this.x > canvas.width) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 10;
          this.alpha = Math.random() * 0.6 + 0.2;
          this.size = Math.random() * 2 + 0.5;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#cca870'; // Champagne gold color
        ctx.shadowColor = '#cca870';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }
    }

    // Populate Particles array
    const maxParticles = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < maxParticles; i++) {
      particlesArray.push(new Particle());
    }

    // Animate loop
    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }


  // 4. Scroll Reveal Animations (Fade up on scroll)
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Trigger once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // 5. Count-Up Animation (Intersection Observer Triggered)
  const counterElements = document.querySelectorAll('.counter-val');

  const countUp = (element) => {
    const target = parseFloat(element.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out quad formula
      const easedProgress = progress * (2 - progress);
      const currentVal = easedProgress * target;

      if (isDecimal) {
        element.innerText = currentVal.toFixed(1);
      } else {
        element.innerText = Math.floor(currentVal).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure final value is exact
        if (isDecimal) {
          element.innerText = target.toFixed(1);
        } else {
          element.innerText = target.toLocaleString() + (target === 1900 ? '+' : '');
        }
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));


  // 6. Before / After Interactive Slider (Drag-to-compare)
  const container = document.getElementById('beforeAfterContainer');
  const afterImg = document.getElementById('afterImgContainer');
  const handle = document.getElementById('sliderHandle');

  if (container && afterImg && handle) {
    let isDragging = false;

    // Core function to adjust positions
    const setSliderPosition = (clientX) => {
      const rect = container.getBoundingClientRect();
      const positionX = clientX - rect.left;
      
      // Calculate percentage clamped between 0% and 100%
      let percentage = (positionX / rect.width) * 100;
      percentage = Math.max(0, Math.min(percentage, 100));

      // Apply styling updates
      afterImg.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Event listeners for dragging (Mouse & Touch)
    const onDragStart = () => { isDragging = true; };
    const onDragEnd = () => { isDragging = false; };
    const onDragMove = (e) => {
      if (!isDragging) return;
      
      // Handle touch coordinates vs mouse coordinates
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    };

    handle.addEventListener('mousedown', onDragStart);
    handle.addEventListener('touchstart', onDragStart, { passive: true });

    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);

    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('touchmove', onDragMove, { passive: false });

    // Allow clicking the container to jump slider
    container.addEventListener('click', (e) => {
      // Don't jump if dragging the handle specifically
      if (e.target === handle || handle.contains(e.target)) return;
      setSliderPosition(e.clientX);
    });
  }


  // 7. Interactive Services Filter & Live Search
  const serviceSearch = document.getElementById('serviceSearch');
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceTabBtns = document.querySelectorAll('.tab-btn');
  const pricingRows = document.querySelectorAll('.pricing-row');
  let activeServiceFilter = 'all';

  // Services Tab Filter Logic
  serviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      activeServiceFilter = btn.getAttribute('data-filter');
      filterServices();
    });
  });

  // Services Search Input Logic
  if (serviceSearch) {
    serviceSearch.addEventListener('input', () => {
      filterServices();
    });
  }

  function filterServices() {
    const query = serviceSearch ? serviceSearch.value.toLowerCase().trim() : '';

    // Filter Service Cards
    serviceCards.forEach(card => {
      const matchesCategory = activeServiceFilter === 'all' || card.getAttribute('data-category') === activeServiceFilter;
      const cardTitle = card.querySelector('h3').innerText.toLowerCase();
      const cardText = card.querySelector('.service-text').innerText.toLowerCase();
      const matchesQuery = cardTitle.includes(query) || cardText.includes(query);

      if (matchesCategory && matchesQuery) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });

    // Filter Pricing Rows In Rate Card Table
    pricingRows.forEach(row => {
      const serviceName = row.querySelector('.pricing-name').innerText.toLowerCase();
      const serviceCategory = row.cells[1].innerText.toLowerCase();
      const matchesQuery = serviceName.includes(query) || serviceCategory.includes(query);

      if (matchesQuery) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }


  // 8. Simulated Instagram Feed Tabs
  const instaTabBtns = document.querySelectorAll('.insta-tab-btn');
  const instaTabContents = document.querySelectorAll('.insta-tab-content');

  instaTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active states
      instaTabBtns.forEach(b => b.classList.remove('active'));
      instaTabContents.forEach(c => c.classList.remove('active'));

      // Add active state to current
      btn.classList.add('active');
      const targetTabId = `tab-${btn.getAttribute('data-tab')}`;
      document.getElementById(targetTabId).classList.add('active');
    });
  });


  // 9. Work Portfolio Gallery Filter & Lazy Loading
  const galleryTabBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-card-item');

  galleryTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCat = btn.getAttribute('data-gallery-tab');
      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-gallery-cat');
        if (filterCat === 'all' || itemCat === filterCat) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Lazy Loading Images Observer
  const lazyImages = document.querySelectorAll('img.lazy-load');
  
  if ('IntersectionObserver' in window) {
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove('lazy-load');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(image => lazyImageObserver.observe(image));
  } else {
    // Fallback if observer not supported
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }


  // 10. Contact Section Form Submission Validation (Mock)
  const contactForm = document.getElementById('salonContactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const service = document.getElementById('formServiceInterest').value;
      const message = document.getElementById('formMessage').value.trim();

      // Mobile number validation (10 digit Check)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid 10-digit mobile number starting with 6-9');
        return;
      }

      // Simulate API submit
      showToast('Sending enquiry...');
      setTimeout(() => {
        showToast('Thank you! Your enquiry has been sent successfully.', 4000);
        contactForm.reset();
      }, 1500);
    });
  }

});


// ==========================================================================
// 11. Global Interactive Modal Wizard Logic
// ==========================================================================
let currentWizardStep = 1;
const totalWizardSteps = 3;

function openBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.add('open');
  resetBookingWizard();
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  modal.classList.remove('open');
}

function resetBookingWizard() {
  currentWizardStep = 1;
  updateWizardUI();
  // Clear inputs
  document.getElementById('bookingName').value = '';
  document.getElementById('bookingPhone').value = '';
  document.getElementById('bookingDate').value = '';
}

function nextWizardStep(step) {
  // Validate Step Inputs
  if (step === 2 && currentWizardStep === 1) {
    // Step 1 validation (None needed as select always has a value)
  }
  
  if (step === 3 && currentWizardStep === 2) {
    const dateVal = document.getElementById('bookingDate').value;
    if (!dateVal) {
      showToast('Please select a preferred date.');
      return;
    }
    
    // Check if date is in past
    const selectedDate = new Date(dateVal);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDate < today) {
      showToast('Preferred date cannot be in the past.');
      return;
    }
  }

  currentWizardStep = step;
  updateWizardUI();
}

function prevWizardStep(step) {
  currentWizardStep = step;
  updateWizardUI();
}

function updateWizardUI() {
  // Hide all steps
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`bookingStep${i}`);
    if (stepEl) stepEl.classList.remove('active');
  }

  // Show current step
  document.getElementById(`bookingStep${currentWizardStep}`).classList.add('active');

  // Update step indicators top bar
  for (let i = 1; i <= totalWizardSteps; i++) {
    const indicator = document.getElementById(`indicatorStep${i}`);
    if (indicator) {
      if (i <= currentWizardStep) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    }
  }
}

// Enquire from service card (Pre-fills and opens modal)
function bookSpecificService(serviceName) {
  openBookingModal();
  const serviceSelect = document.getElementById('bookingServiceSelect');
  if (serviceSelect) {
    // Locate and select serviceName matching option
    for (let option of serviceSelect.options) {
      if (option.value === serviceName) {
        serviceSelect.value = serviceName;
        break;
      }
    }
  }
}

// Submit Booking Wizard Flow
function submitBooking(method) {
  const name = document.getElementById('bookingName').value.trim();
  const phone = document.getElementById('bookingPhone').value.trim();
  const service = document.getElementById('bookingServiceSelect').value;
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('bookingTime').value;

  if (!name || !phone) {
    showToast('Please complete name and phone number fields.');
    return;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    showToast('Please enter a valid 10-digit mobile number.');
    return;
  }

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  if (method === 'whatsapp') {
    // Generate Pre-Filled WhatsApp message
    const waText = `Hi Opera Prime Salon, I'd like to book an appointment.%0A%0A*Client Name:* ${encodeURIComponent(name)}%0A*Phone Number:* ${encodeURIComponent(phone)}%0A*Service:* ${encodeURIComponent(service)}%0A*Preferred Date:* ${encodeURIComponent(formattedDate)}%0A*Time Slot:* ${encodeURIComponent(time)}`;
    const waUrl = `https://wa.me/919827881280?text=${waText}`;
    
    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');
    
    // Close modal
    closeBookingModal();
    showToast('Redirected to WhatsApp for booking confirmation!', 4000);
  } else {
    // Request via callback
    // Update step 4 text
    const successMsg = document.getElementById('successMessageText');
    successMsg.innerText = `Thank you, ${name}! We have registered your request for ${service} on ${formattedDate} at ${time}. Our booking representative will call you at ${phone} to confirm your slot shortly.`;
    
    currentWizardStep = 4;
    updateWizardUI();
  }
}

// Global Toast Alert Helper
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toastAlert');
  const msgEl = document.getElementById('toastMessage');
  
  if (toast && msgEl) {
    msgEl.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}

// Helper to filter from external footer links
function filterServiceCategory(catName) {
  const tab = document.querySelector(`.tab-btn[data-filter="${catName}"]`);
  if (tab) {
    tab.click();
  }
}
