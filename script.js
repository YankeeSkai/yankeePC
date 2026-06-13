(function() {
  'use strict';

  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');

  if (burger && nav) {
    burger.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('header__nav--open');
      this.classList.toggle('header__burger--open');
    });

    // Закрытие меню при клике на любую ссылку
    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('header__nav--open')) {
          burger.click();
        }
      });
    });
  }

  // Закрытие по Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('header__nav--open')) {
      burger.click();
    }
  });

  // ---------- Всплывающий баннер (только десктоп) ----------
  const banner = document.getElementById('popupBanner');
  const closeBtn = document.getElementById('closePopup');
  const form = document.getElementById('helpForm');

  if (banner && closeBtn) {
    // Показываем баннер с задержкой, но только на больших экранах
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

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
        banner.classList.remove('popup-banner--visible');
      });
    }
  }
})();