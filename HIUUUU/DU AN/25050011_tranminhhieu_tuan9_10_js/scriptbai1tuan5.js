/**
 * Thanh điều hướng trực tiếp (Direct Navigation Toolbar)
 * - Bấm 1 lần vô thẳng nội dung trang (Không dùng menu xổ xuống)
 * - Hiệu ứng ẩn thanh công cụ khi click vào trang
 * - Rê chuột lên đỉnh hoặc cuộn lên để hiện lại thanh công cụ
 * - Hỗ trợ tương tác Action Toast & Cuộn lên đầu trang
 */

document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo hiệu ứng AOS (nếu có)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic'
    });
  }

  const navbar = document.getElementById('mainNavbar');
  const navbarCollapse = document.getElementById('navbarContent');
  const navLinks = document.querySelectorAll('.custom-navbar .nav-link, .custom-navbar .navbar-brand');
  const btnBackToTop = document.getElementById('btnBackToTop');
  const toastEl = document.getElementById('actionToast');
  const toastMsg = document.getElementById('toastMessage');
  const actionBtns = document.querySelectorAll('.btn-action');

  let toastInstance = null;
  if (toastEl && typeof bootstrap !== 'undefined') {
    toastInstance = new bootstrap.Toast(toastEl, { delay: 2800 });
  }

  // Đóng menu di động nếu đang mở
  function closeMobileNav() {
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
        bsCollapse.hide();
      } else {
        navbarCollapse.classList.remove('show');
      }
    }
  }

  // 1. THAO TÁC BẤM 1 LẦN VÔ HẲNG TRANG:
  // Bấm vào bất kỳ nút nào trên thanh công cụ -> Cuộn mượt ngay tới phần tương ứng
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      closeMobileNav();

      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();

        // Cập nhật trạng thái active
        document.querySelectorAll('.custom-navbar .nav-link').forEach(nl => nl.classList.remove('active'));
        if (link.classList.contains('nav-link')) {
          link.classList.add('active');
        }

        if (href === '#' || href === '#top') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
          return;
        }

        const targetElement = document.querySelector(href);
        if (targetElement) {
          const navHeight = navbar ? navbar.offsetHeight : 70;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight + 5;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 2. HIỆU ỨNG ẨN KHI CLICK VÀO TRANG:
  // Khi người dùng click vào bất kỳ đâu trên nội dung trang (ngoài thanh công cụ)
  // -> Thanh công cụ sẽ tự động trượt ẩn lên trên
  document.addEventListener('click', (e) => {
    if (navbar && !navbar.contains(e.target)) {
      navbar.classList.add('navbar-hidden');
      closeMobileNav();
    }
  });

  // 3. HIỆN LẠI THANH CÔNG CỤ:
  // - Rê chuột lên sát mép trên màn hình (vùng 0-55px) -> Hiện lại navbar
  document.addEventListener('mousemove', (e) => {
    if (e.clientY <= 55 && navbar) {
      navbar.classList.remove('navbar-hidden');
    }
  });

  // - Chạm vào mép trên màn hình trên điện thoại -> Hiện lại navbar
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0] && e.touches[0].clientY <= 55 && navbar) {
      navbar.classList.remove('navbar-hidden');
    }
  }, { passive: true });

  // 4. HIỆU ỨNG CUỘN TRANG (Scroll behavior):
  let lastScrollY = window.pageYOffset;
  const scrollThreshold = 10;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.pageYOffset;

    if (navbar) {
      // Đổi nền đậm khi cuộn qua đỉnh
      if (currentScrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
        // Ở đỉnh trang thì luôn hiển thị navbar
        navbar.classList.remove('navbar-hidden');
      }

      // Cuộn lên -> Tự động hiện lại navbar
      if (currentScrollY < lastScrollY - scrollThreshold) {
        navbar.classList.remove('navbar-hidden');
      }
      // Cuộn xuống qua 150px -> Tự động ẩn navbar
      else if (currentScrollY > lastScrollY + scrollThreshold && currentScrollY > 150) {
        const isMobileOpen = navbarCollapse && navbarCollapse.classList.contains('show');
        if (!isMobileOpen) {
          navbar.classList.add('navbar-hidden');
        }
      }
    }

    // Hiển thị nút Back to Top khi cuộn sâu
    if (btnBackToTop) {
      if (currentScrollY > 300) {
        btnBackToTop.classList.add('show');
      } else {
        btnBackToTop.classList.remove('show');
      }
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });

  // Nút cuộn lên đầu trang
  if (btnBackToTop) {
    btnBackToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      if (navbar) {
        navbar.classList.remove('navbar-hidden');
      }
    });
  }

  // 5. Nút tương tác hiển thị Toast (DOWNLOAD NOW!, New Menu,...)
  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const actionName = btn.getAttribute('data-action') || btn.innerText.trim();
      if (toastInstance && toastMsg) {
        toastMsg.innerHTML = `<strong>Thao tác:</strong> ${actionName}`;
        toastInstance.show();
      }
    });
  });
});
