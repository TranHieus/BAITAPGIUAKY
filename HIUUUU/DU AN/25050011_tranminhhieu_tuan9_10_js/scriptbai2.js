document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('#collapsibleNavbar .nav-link:not(.dropdown-toggle)');
    const navbarCollapse = document.getElementById('collapsibleNavbar');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = paymentForm.querySelectorAll('input');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) isValid = false;
            });

            if (!isValid) {
                alert('Vui lòng nhập đầy đủ thông tin thẻ thanh toán!');
                return;
            }

            const cardNumber = paymentForm.querySelector('input[placeholder="Card Number"]').value.trim();
            if (cardNumber.length < 16 || isNaN(cardNumber)) {
                alert('Số thẻ tín dụng không hợp lệ (cần đúng 16 chữ số)!');
                return;
            }

            alert('Thanh toán thành công $320!');
            paymentForm.reset();
        });
    }
    const facebookForm = document.getElementById('facebookForm');
    if (facebookForm) {
        facebookForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = facebookForm.querySelector('input[placeholder*="username"]').value.trim();
            const termsChecked = facebookForm.querySelector('#termsCheck').checked;

            if (!termsChecked) {
                alert('Bạn cần chấp nhận các điều khoản dịch vụ để tiếp tục!');
                return;
            }

            alert(`Tạo tài khoản thành công cho user: ${username}`);
            facebookForm.reset();
        });

        const btnFb = document.getElementById('btnFbLogin');
        if (btnFb) {
            btnFb.addEventListener('click', () => {
                alert('Đang chuyển hướng tới cổng xác thực Facebook...');
            });
        }
    }
    const validationForms = document.querySelectorAll('.needs-validation');

    Array.from(validationForms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                alert('Form đã được gửi thành công!');
            }
            form.classList.add('was-validated');
        }, false);
    });

});