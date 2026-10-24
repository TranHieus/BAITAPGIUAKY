document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initClickRipple();
  initInteractiveCanvas();
  initCardSpotlightAndTilt();
  initMagneticElements();
  initHeroAvatarParallax();
  initSmoothScrollLinks();
  initTypingEffect();
  initReadingProgressBar();
  initScrollSpyAndHeader();
  initScrollToTop();
  initSkillBars();
  initStatCounters();
  initTimelineTabs();
  initProjectFilter();
  initProjectModal();
  initContactForm();
  initEmailCopy();
  initScrollReveal();
  initScrollParallax();
});

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(toggleBtn, newTheme);
    showToast(`Đã chuyển sang giao diện ${newTheme === 'dark' ? 'Tối (Space Grey)' : 'Sáng (Xám Trắng Tinh Tế)'}`, 'info');
  });
}

function updateThemeIcon(btn, theme) {
  btn.setAttribute('aria-label', `Chuyển sang giao diện ${theme === 'dark' ? 'sáng' : 'tối'}`);
}

function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
}

function initInteractiveCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3.5 + 1.8;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.2;
          this.y -= (dy / dist) * force * 2.2;
        }
      }
    }

    draw(isDark) {
      ctx.beginPath();
      const grad = ctx.createRadialGradient(
        this.x - this.size * 0.35,
        this.y - this.size * 0.35,
        this.size * 0.15,
        this.x,
        this.y,
        this.size * 1.4
      );
      if (isDark) {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.35, 'rgba(203, 213, 225, 0.65)');
        grad.addColorStop(1, 'rgba(148, 163, 184, 0.08)');
      } else {
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.35, 'rgba(148, 163, 184, 0.45)');
        grad.addColorStop(1, 'rgba(203, 213, 225, 0.08)');
      }
      ctx.arc(this.x, this.y, this.size * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(isDark);

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          let opacity = (1 - dist / 110) * (isDark ? 0.25 : 0.15);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = isDark ? `rgba(203, 213, 225, ${opacity})` : `rgba(100, 116, 139, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let opacity = (1 - dist / mouse.radius) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isDark ? `rgba(241, 245, 249, ${opacity})` : `rgba(71, 85, 105, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

function initCardSpotlightAndTilt() {
  const cards = document.querySelectorAll(
    '.hero-avatar-circular, .stat-card-glass, .about-card-left, .about-story-card, .objective-card, .skills-showcase-card, .timeline-content-card, .project-card, .extra-card, .contact-info-card, .contact-form-card'
  );

  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  cards.forEach(card => {
    card.classList.add('tilt-card');
    let isHovered = false;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;

    function renderTilt() {
      if (!isHovered) return;
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translate3d(0, -6px, 0)`;
      rafId = requestAnimationFrame(renderTilt);
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      card.classList.add('is-tilting');
      rafId = requestAnimationFrame(renderTilt);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (!isTouch) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        targetX = ((y - centerY) / centerY) * -7;
        targetY = ((x - centerX) / centerX) * 7;
      }
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.classList.remove('is-tilting');
      if (rafId) cancelAnimationFrame(rafId);
      currentX = 0;
      currentY = 0;
      targetX = 0;
      targetY = 0;
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translate3d(0, 0, 0)';
    });
  });
}

function initMagneticElements() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const magnets = document.querySelectorAll(
    '.btn, .theme-switch, .avatar-circle-chip, .about-pill, .hero-tagline, .section-badge'
  );

  magnets.forEach(el => {
    el.classList.add('magnetic-item');

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate3d(${x * 0.24}px, ${y * 0.24}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

function initHeroAvatarParallax() {
  const hero = document.getElementById('home');
  const avatar = document.querySelector('.hero-avatar-circular');
  const chip = document.querySelector('.avatar-circle-chip');
  if (!hero || !avatar || window.matchMedia('(pointer: coarse)').matches) return;

  let targetRotX = 0, targetRotY = 0;
  let curRotX = 0, curRotY = 0;
  let isInside = false;
  let rafId = null;

  function renderHeroAvatar() {
    if (!isInside) return;
    curRotX += (targetRotX - curRotX) * 0.08;
    curRotY += (targetRotY - curRotY) * 0.08;

    avatar.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    if (chip) {
      chip.style.transform = `translateX(calc(-50% + ${(curRotY * 1.5).toFixed(1)}px)) translateY(${(-curRotX * 1.2).toFixed(1)}px)`;
    }

    rafId = requestAnimationFrame(renderHeroAvatar);
  }

  hero.addEventListener('mouseenter', () => {
    isInside = true;
    rafId = requestAnimationFrame(renderHeroAvatar);
  });

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotX = -y * 14;
    targetRotY = x * 14;
  });

  hero.addEventListener('mouseleave', () => {
    isInside = false;
    if (rafId) cancelAnimationFrame(rafId);
    targetRotX = 0;
    targetRotY = 0;
    curRotX = 0;
    curRotY = 0;
    avatar.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    if (chip) chip.style.transform = 'translateX(-50%) translateY(0)';
  });
}

function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || !href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 76;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

function initClickRipple() {
  window.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 650);
  });
}

function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const roles = [
    "Frontend Developer",
    "Sinh viên Kỹ thuật Phần mềm",
    "Web Design Enthusiast",
    "Người đam mê công nghệ"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseEnd = 1900;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let timeout = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      timeout = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      timeout = 400;
    }

    setTimeout(type, timeout);
  }

  type();
}

function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });
}

function initScrollSpyAndHeader() {
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initSkillBars() {
  const progressFills = document.querySelectorAll('.progress-fill');
  if (progressFills.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressFills.forEach(fill => {
          const width = fill.getAttribute('data-width') || '0%';
          fill.style.width = width;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.12 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

function initStatCounters() {
  const statItems = document.querySelectorAll('.stat-item');
  if (statItems.length === 0) return;

  let started = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        statItems.forEach(item => {
          const numEl = item.querySelector('.stat-num');
          if (!numEl) return;
          const text = numEl.textContent.trim();

          if (text.includes('%')) {
            const target = parseInt(text, 10);
            animateCount(numEl, 0, target, 1500, '%');
          } else if (text.includes('+')) {
            const target = parseInt(text, 10);
            animateCount(numEl, 0, target, 1200, '+');
          }
        });
      }
    });
  }, { threshold: 0.5 });

  const heroSection = document.getElementById('home');
  if (heroSection) observer.observe(heroSection);
}

function animateCount(el, start, end, duration, suffix = '') {
  let startTime = null;
  function update(currentTime) {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeOutQuad * (end - start) + start);
    el.textContent = `${current}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = `${end}${suffix}`;
    }
  }
  requestAnimationFrame(update);
}

function initTimelineTabs() {
  const tabBtns = document.querySelectorAll('.timeline-tab-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (tabBtns.length === 0) return;

  function applyTimelineFilter(filterType) {
    timelineItems.forEach(item => {
      if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
        item.style.display = 'block';
        item.classList.add('is-revealed');
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animation = 'fadeInCard 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards';
      } else {
        item.style.display = 'none';
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-tab');
      applyTimelineFilter(filterType);
    });
  });

  const initialActive = document.querySelector('.timeline-tab-btn.active');
  if (initialActive) {
    applyTimelineFilter(initialActive.getAttribute('data-tab'));
  }
}

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

const projectData = {
  1: {
    title: "Feane - Website Nhà Hàng",
    category: "Web Design / Nhà Hàng & Ẩm Thực",
    image: "images/feane-thumb.jpg",
    desc: "Website ẩm thực đa trang với các tính năng chính: xem thực đơn, đặt bàn và đặt món trực tuyến, giao diện tương thích mọi thiết bị.",
    features: [
      "Giao diện đa trang: Trang chủ, Thực đơn, Đặt bàn, Đặt món",
      "Thiết kế Responsive mượt mà trên máy tính và điện thoại",
      "Biểu mẫu đặt bàn và đặt món trực quan, tiện lợi"
    ],
    tech: ["HTML5", "CSS3", "JavaScript", "Responsive"],
    demoUrl: "DU%20AN/BAI%202%20TUAN%205/home.html",
    githubUrl: "https://github.com/TranHieus/BAITAPGIUAKY"
  },
  2: {
    title: "Star Cinema - Rạp Chiếu Phim",
    category: "Web Design / Giải Trí & Điện Ảnh",
    image: "images/cinema-thumb.jpg",
    desc: "Website rạp chiếu phim hiện đại với tính năng xem trailer, lịch chiếu phim, hệ thống đặt vé trực tuyến và quản lý thành viên.",
    features: [
      "Giao diện rạp chiếu phim hiện đại, hỗ trợ hiệu ứng chuyển động mượt mà",
      "Hệ thống lịch chiếu, danh sách phim đang chiếu và sắp chiếu",
      "Biểu mẫu đặt vé, chọn suất chiếu và đăng ký thành viên trực quan"
    ],
    tech: ["HTML5", "CSS3", "Bootstrap 5", "JavaScript DOM"],
    demoUrl: "DU%20AN/BAI%203/index.html",
    githubUrl: "https://github.com/TranHieus/BAITAPGIUAKY"
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const detailBtns = document.querySelectorAll('.btn-detail');

  if (!modalOverlay) return;

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      document.getElementById('modal-img').src = data.image;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.desc;

      const featuresList = document.getElementById('modal-features');
      featuresList.innerHTML = '';
      data.features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        featuresList.appendChild(li);
      });

      const techContainer = document.getElementById('modal-tech');
      techContainer.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        techContainer.appendChild(span);
      });

      const demoBtn = modalOverlay.querySelector('.modal-footer a.btn-primary');
      const gitBtn = modalOverlay.querySelector('.modal-footer a.btn-secondary');
      if (demoBtn && data.demoUrl) demoBtn.href = data.demoUrl;
      if (gitBtn && data.githubUrl) gitBtn.href = data.githubUrl;

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');

  function validateInput(input, condition, errorMsg) {
    const formGroup = input.closest('.form-group');
    const errorDisplay = formGroup.querySelector('.error-message');

    if (!condition) {
      formGroup.classList.add('has-error');
      input.classList.add('invalid');
      input.classList.remove('valid');
      if (errorDisplay) errorDisplay.textContent = errorMsg;
      return false;
    } else {
      formGroup.classList.remove('has-error');
      input.classList.remove('invalid');
      input.classList.add('valid');
      return true;
    }
  }

  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateInput(nameInput, nameInput.value.trim().length >= 2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateInput(emailInput, emailRegex.test(emailInput.value.trim()), 'Vui lòng nhập địa chỉ email hợp lệ');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const val = phoneInput.value.trim();
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (val.length > 0) {
        validateInput(phoneInput, phoneRegex.test(val), 'Số điện thoại gồm 10 số (bắt đầu bằng 03, 05, 07, 08, 09)');
      } else {
        const formGroup = phoneInput.closest('.form-group');
        formGroup.classList.remove('has-error');
        phoneInput.classList.remove('invalid');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      validateInput(messageInput, messageInput.value.trim().length >= 10, 'Nội dung tin nhắn cần tối thiểu 10 ký tự');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isNameValid = validateInput(nameInput, nameInput.value.trim().length >= 2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)');
    const isEmailValid = validateInput(emailInput, emailRegex.test(emailInput.value.trim()), 'Vui lòng nhập địa chỉ email hợp lệ');
    const isMessageValid = validateInput(messageInput, messageInput.value.trim().length >= 10, 'Nội dung tin nhắn cần tối thiểu 10 ký tự');

    let isPhoneValid = true;
    if (phoneInput && phoneInput.value.trim().length > 0) {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      isPhoneValid = validateInput(phoneInput, phoneRegex.test(phoneInput.value.trim()), 'Số điện thoại không hợp lệ');
    }

    if (isNameValid && isEmailValid && isMessageValid && isPhoneValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Đang gửi tin nhắn...</span> <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Cảm ơn bạn! Tin nhắn đã được gửi thành công.', 'success');
        form.reset();
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('valid', 'invalid'));
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    } else {
      showToast('Vui lòng kiểm tra lại các trường thông tin bị lỗi.', 'error');
    }
  });
}

function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
  if (type === 'success') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  }
  if (type === 'error') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  }

  toast.innerHTML = `<span class="toast-icon">${iconSvg}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function initEmailCopy() {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.addEventListener('click', () => {
      const email = link.textContent.trim().replace('mailto:', '');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
          showToast(`Đã sao chép: ${email}`, 'success');
        }).catch(() => {});
      }
    });
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

function initScrollParallax() {
  const blobs = document.querySelectorAll('.liquid-blob');
  const heroStage = document.querySelector('.hero-avatar-circular-stage');
  const bgCanvas = document.getElementById('bg-canvas');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        if (blobs[0]) blobs[0].style.transform = `translate3d(0, ${scrolled * 0.12}px, 0)`;
        if (blobs[1]) blobs[1].style.transform = `translate3d(0, ${scrolled * -0.09}px, 0)`;
        if (blobs[2]) blobs[2].style.transform = `translate3d(0, ${scrolled * 0.16}px, 0)`;
        if (heroStage && scrolled < 900) {
          heroStage.style.transform = `translate3d(0, ${scrolled * 0.08}px, 0)`;
        }
        if (bgCanvas) {
          bgCanvas.style.transform = `translate3d(0, ${scrolled * 0.04}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
