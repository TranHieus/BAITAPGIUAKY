document.addEventListener('DOMContentLoaded', () => {

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }

  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');

  if (searchBtn && searchBar) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      searchBar.classList.toggle('open');
      const searchInput = searchBar.querySelector('input');
      if (searchBar.classList.contains('open') && searchInput) {
        searchInput.focus();
      }
    });
  }

  let cartCount = parseInt(localStorage.getItem('feane_cart_count') || '0', 10);
  const cartBadges = document.querySelectorAll('.cart-count');

  function updateCartBadges() {
    cartBadges.forEach(badge => {
      badge.textContent = cartCount;
    });
  }
  updateCartBadges();

  const addCartBtns = document.querySelectorAll('.btn-cart-circle');
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.getAttribute('data-name') || 'Item';
      cartCount++;
      localStorage.setItem('feane_cart_count', cartCount);
      updateCartBadges();
      showToast(`Added "${itemName}" to cart! 🍔`);
    });
  });

  function showToast(message) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      toast.innerHTML = `<i class="fa fa-check-circle"></i> <span id="toastMsg"></span>`;
      document.body.appendChild(toast);
    }
    const toastMsg = document.getElementById('toastMsg');
    if (toastMsg) toastMsg.textContent = message;

    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const filterItems = document.querySelectorAll('.filters_menu li');
  const foodCards = document.querySelectorAll('.food_card');

  if (filterItems.length > 0 && foodCards.length > 0) {
    filterItems.forEach(item => {
      item.addEventListener('click', () => {
        filterItems.forEach(fi => fi.classList.remove('active'));
        item.classList.add('active');

        const filterValue = item.getAttribute('data-filter');

        foodCards.forEach(card => {
          card.classList.remove('fade-in');
          const category = card.getAttribute('data-category');

          if (filterValue === '*' || filterValue === category) {
            card.classList.remove('hidden');
            setTimeout(() => card.classList.add('fade-in'), 10);
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }
  const slides = [
    {
      title: 'Fast Food Restaurant',
      text: 'Doloremque, itaque aperiam facilis rerum, commodi, temporibus sapiente ad mollitia laborum quam quisquam esse error unde. Tempora ex doloremque, labore, sunt repellat dolore, iste magni quos nihil ducimus libero ipsam.'
    },
    {
      title: 'Delicious Cheesy Pizza',
      text: 'Experience the authentic taste of wood-fired Italian pizzas topped with imported mozzarella, fresh basil, and chef special secret herb tomato reduction.'
    },
    {
      title: 'Gourmet Double Burger',
      text: 'Juicy Angus beef patties grilled to absolute perfection, layered with melting cheddar cheese, crispy bacon, and golden french fries on the side.'
    }
  ];

  const sliderDots = document.querySelectorAll('.slider_dot');
  const heroTitle = document.getElementById('heroSliderTitle');
  const heroText = document.getElementById('heroSliderText');

  if (sliderDots.length > 0 && heroTitle && heroText) {
    let currentSlide = 0;

    function goToSlide(index) {
      currentSlide = index;
      sliderDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
      heroTitle.style.opacity = '0';
      heroText.style.opacity = '0';
      setTimeout(() => {
        heroTitle.textContent = slides[index].title;
        heroText.textContent = slides[index].text;
        heroTitle.style.opacity = '1';
        heroText.style.opacity = '1';
      }, 200);
    }

    sliderDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
    });

    setInterval(() => {
      let nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, 5000);
  }

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bookName')?.value;
      const persons = document.getElementById('bookPersons')?.value;
      const date = document.getElementById('bookDate')?.value;

      showToast(`Thank you ${name}! Table for ${persons} reserved on ${date}. 🎉`);
      bookingForm.reset();
    });
  }
  const orderBackdrop = document.getElementById('orderModalBackdrop');
  if (orderBackdrop) {
    orderBackdrop.addEventListener('click', (e) => {
      if (e.target === orderBackdrop) {
        window.location.href = 'home.html';
      }
    });
  }

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('orderPhone')?.value;
      const email = document.getElementById('orderEmail')?.value;

      showToast(`Order confirmed for ${phone || email}! It's on the way! 🚀`);
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1500);
    });
  }
});
