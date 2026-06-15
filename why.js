(function() {
  'use strict';

  const burger = document.getElementById('burgerBtn');
  const nav = document.getElementById('mainNav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('header__nav--open');
      burger.classList.toggle('header__burger--open');
    });

    nav.querySelectorAll('.header__nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('header__nav--open')) burger.click();
      });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('header__nav--open')) {
      burger.click();
    }
  });
})();