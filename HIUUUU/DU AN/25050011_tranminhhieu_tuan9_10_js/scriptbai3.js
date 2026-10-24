window.addEventListener('load', function () {
  setTimeout(function () {
    var screen = document.getElementById('loadingScreen');
    if (screen) screen.classList.add('hide');
  }, 1800);
});
window.addEventListener('scroll', function () {
  var navbar = document.querySelector('.main-navbar');
  if (!navbar) return;
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
}

function showToast(title, msg, type) {
  var container = document.getElementById('toastContainer');
  if (!container) return;

  var icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    info: 'bi-info-circle-fill',
    default: 'bi-bell-fill'
  };

  var iconClass = icons[type] || icons['default'];

  var toast = document.createElement('div');
  toast.className = 'toast-custom ' + (type || '');
  toast.innerHTML =
    '<div class="toast-icon"><i class="bi ' + iconClass + '"></i></div>' +
    '<div class="toast-body-custom">' +
      '<div class="toast-title-custom">' + title + '</div>' +
      '<div class="toast-msg-custom">' + msg + '</div>' +
    '</div>';

  container.appendChild(toast);

  setTimeout(function () {
    toast.style.animation = 'toastOut 0.4s ease forwards';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  }, 3500);
}

// ===== AUTH MODAL: SWITCH TAB =====
function switchAuthTab(tab, btn) {
  document.querySelectorAll('.auth-tab-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  var loginForm = document.getElementById('loginForm');
  var regForm = document.getElementById('registerForm');

  if (tab === 'login') {
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
  }
}

function handleLogin() {
  var email = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value.trim();

  if (!email) {
    showToast('Thiếu thông tin', 'Vui lòng nhập địa chỉ Email!', 'error');
    document.getElementById('loginEmail').focus();
    return;
  }

  if (!isValidEmail(email)) {
    showToast('Email không hợp lệ', 'Vui lòng nhập đúng định dạng email.', 'error');
    return;
  }

  if (!password) {
    showToast('Thiếu thông tin', 'Vui lòng nhập Mật khẩu!', 'error');
    document.getElementById('loginPassword').focus();
    return;
  }

  var modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
  modal.hide();

  setTimeout(function () {
    showToast('Đăng nhập thành công! 🎬', 'Chào mừng bạn đến với Star Cinema.', 'success');
    updateNavAfterLogin(email);
  }, 300);
}
function handleRegister() {
  var name = document.getElementById('regName').value.trim();
  var email = document.getElementById('regEmail').value.trim();
  var phone = document.getElementById('regPhone').value.trim();
  var password = document.getElementById('regPassword').value.trim();
  var confirm = document.getElementById('regConfirm').value.trim();
  var captchaInput = document.getElementById('captchaInput').value.trim();
  var captchaValue = document.getElementById('captchaDisplay').textContent.trim();

  if (!name) {
    showToast('Thiếu thông tin', 'Vui lòng nhập Họ tên!', 'error');
    return;
  }
  if (!phone) {
    showToast('Thiếu thông tin', 'Vui lòng nhập Số điện thoại!', 'error');
    return;
  }
  if (!email || !isValidEmail(email)) {
    showToast('Email không hợp lệ', 'Vui lòng nhập đúng định dạng email.', 'error');
    return;
  }
  if (!password || password.length < 6) {
    showToast('Mật khẩu quá ngắn', 'Mật khẩu phải có ít nhất 6 ký tự.', 'error');
    return;
  }
  if (password !== confirm) {
    showToast('Mật khẩu không khớp', 'Vui lòng kiểm tra lại mật khẩu xác nhận.', 'error');
    return;
  }
  if (!captchaInput) {
    showToast('Thiếu mã captcha', 'Vui lòng nhập mã xác minh!', 'error');
    return;
  }
  if (captchaInput.toUpperCase() !== captchaValue.toUpperCase()) {
    showToast('Mã không đúng', 'Mã captcha không khớp. Vui lòng thử lại!', 'error');
    refreshCaptcha();
    document.getElementById('captchaInput').value = '';
    return;
  }

  var modal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
  modal.hide();

  setTimeout(function () {
    showToast('Đăng ký thành công! 🎉', 'Vui lòng kiểm tra email để xác nhận tài khoản.', 'success');
  }, 300);
}

function updateNavAfterLogin(email) {
  var loginBtn = document.querySelector('.btn-nav-login');
  if (loginBtn) {
    loginBtn.innerHTML = '<i class="bi bi-person-fill me-1"></i>' + email.split('@')[0];
    loginBtn.style.background = 'rgba(232,64,28,0.15)';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

var captchaChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateCaptcha() {
  var code = '';
  for (var i = 0; i < 6; i++) {
    code += captchaChars[Math.floor(Math.random() * captchaChars.length)];
  }
  return code;
}

function refreshCaptcha() {
  var el = document.getElementById('captchaDisplay');
  if (el) {
    el.style.transform = 'scale(0)';
    setTimeout(function () {
      el.textContent = generateCaptcha();
      el.style.transform = 'scale(1)';
    }, 150);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  refreshCaptcha();
  initScrollReveal();
  var authModal = document.getElementById('authModal');
  if (authModal) {
    authModal.addEventListener('hidden.bs.modal', function () {
      var loginTabBtn = document.querySelector('.auth-tab-btn');
      if (loginTabBtn) switchAuthTab('login', loginTabBtn);
   
      authModal.querySelectorAll('input').forEach(function (el) { el.value = ''; });
      authModal.querySelectorAll('select').forEach(function (el) { el.selectedIndex = 0; });
    
      refreshCaptcha();
    });
  }
  document.querySelectorAll('.btn-wishlist').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var icon = this.querySelector('i');
      if (icon.classList.contains('bi-heart')) {
        icon.classList.replace('bi-heart', 'bi-heart-fill');
        icon.style.color = '#e74c3c';
        showToast('Đã thêm yêu thích ❤️', 'Phim đã được lưu vào danh sách của bạn.', 'success');
      } else {
        icon.classList.replace('bi-heart-fill', 'bi-heart');
        icon.style.color = '';
        showToast('Đã xóa yêu thích', 'Phim đã được xóa khỏi danh sách.', 'info');
      }
    });
  });

  var captchaEl = document.getElementById('captchaDisplay');
  if (captchaEl) {
    captchaEl.style.transition = 'transform 0.15s ease';
  }

  document.querySelectorAll('.movie-tabs .nav-link').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.movie-tabs .nav-link').forEach(function (t) {
        t.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
  var selects = document.querySelectorAll('.booking-select');
  selects.forEach(function (sel) {
    sel.addEventListener('change', function () {
      this.style.borderColor = '#e8401c';
      this.style.color = '#fff';
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.getElementById('mainCarousel');
  if (!carousel) return;

  carousel.addEventListener('slide.bs.carousel', function (e) {
    var captions = carousel.querySelectorAll('.carousel-caption-custom');
    captions.forEach(function (cap) {
      cap.style.opacity = '0';
      cap.style.transform = 'translateY(-50%) translateX(-30px)';
    });
  });

  carousel.addEventListener('slid.bs.carousel', function (e) {
    var activeCaption = carousel.querySelector('.carousel-item.active .carousel-caption-custom');
    if (activeCaption) {
      activeCaption.style.transition = 'all 0.7s ease';
      activeCaption.style.opacity = '1';
      activeCaption.style.transform = 'translateY(-50%) translateX(0)';
    }
  });
});
