(function() {
  'use strict';

  // ---------- Конфигурация Telegram ----------
  const TELEGRAM_TOKEN = '8809007843:AAH9afSTjM9oitKsCY36fPhMx4TMk8f-vBY';
  const TELEGRAM_CHAT_ID = '8731777136'; // ← замените на реальный ID чата

  // ---------- Бургер-меню ----------
  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');

  if (burger && nav) {
    burger.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('header__nav--open');
      this.classList.toggle('header__burger--open');
    });

    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('header__nav--open')) {
          burger.click();
        }
      });
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('header__nav--open')) {
      burger.click();
    }
  });

  // ---------- Всплывающий баннер ----------
  const banner = document.getElementById('popupBanner');
  const closeBtn = document.getElementById('closePopup');
  const form = document.getElementById('helpForm');

  if (banner && closeBtn) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        if (window.innerWidth > 1024) {
          banner.classList.add('popup-banner--visible');
        }
      }, 300);
    });

    closeBtn.addEventListener('click', function() {
      banner.classList.remove('popup-banner--visible');
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && banner.classList.contains('popup-banner--visible')) {
        banner.classList.remove('popup-banner--visible');
      }
    });

    // ---------- Отправка формы в Telegram ----------
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('userName').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const agree = document.getElementById('agreeCheckbox').checked;

        if (!name || !phone || !agree) {
          alert('Пожалуйста, заполните все поля и согласитесь с политикой конфиденциальности.');
          return;
        }

        // Формируем текст сообщения
        const message = `📩 Новая заявка с сайта YANKEE PC\n👤 Имя: ${name}\n📞 Телефон: ${phone}`;

        // Отправляем в Telegram
        sendToTelegram(message)
          .then(() => {
            alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
            form.reset();
            banner.classList.remove('popup-banner--visible');
          })
          .catch((error) => {
            console.error('Ошибка отправки в Telegram:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
          });
      });
    }
  }

  // Функция отправки сообщения в Telegram
  async function sendToTelegram(text) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}`);
    }
    return response.json();
  }

})();