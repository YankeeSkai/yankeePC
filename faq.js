(function() {
  'use strict';

  // ---------- Аккордеон FAQ ----------
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-item__question');
    btn.addEventListener('click', () => {
      items.forEach(other => {
        if (other !== item) other.classList.remove('faq-item--open');
      });
      item.classList.toggle('faq-item--open');
    });
  });

  // ---------- Бургер-меню ----------
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

  // ---------- Переключение полей контакта ----------
  const contactRadios = document.querySelectorAll('input[name="faqContactType"]');
  const phoneField = document.getElementById('faqPhoneField');
  const telegramField = document.getElementById('faqTelegramField');
  const vkField = document.getElementById('faqVkField');

  function showContactField(value) {
    phoneField.style.display = 'none';
    telegramField.style.display = 'none';
    vkField.style.display = 'none';
    if (value === 'phone') phoneField.style.display = 'block';
    else if (value === 'telegram') telegramField.style.display = 'block';
    else if (value === 'vk') vkField.style.display = 'block';
  }

  contactRadios.forEach(radio => {
    radio.addEventListener('change', (e) => showContactField(e.target.value));
  });
  showContactField('phone');

  // ---------- Маска телефона ----------
  const phoneInput = document.getElementById('faqPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let value = phoneInput.value.replace(/\D/g, '');
      if (!value.startsWith('7')) {
        value = '7' + value.replace(/^8/, '');
      }
      const part1 = value.substring(1, 4);
      const part2 = value.substring(4, 7);
      const part3 = value.substring(7, 9);
      const part4 = value.substring(9, 11);
      let formatted = '+7';
      if (part1) formatted += ` (${part1}`;
      if (part2) formatted += `) ${part2}`;
      if (part3) formatted += `-${part3}`;
      if (part4) formatted += `-${part4}`;
      phoneInput.value = formatted;
    });
  }

  // ---------- Отправка формы ----------
  const faqForm = document.getElementById('faqAskForm');
  const faqSuccess = document.getElementById('faqSuccess');
  const faqSection = document.getElementById('faqAskSection');

  faqForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('faqName').value.trim();
    const question = document.getElementById('faqQuestion').value.trim();
    if (!name || !question) {
      alert('Пожалуйста, заполните имя и вопрос.');
      return;
    }

    const contactType = document.querySelector('input[name="faqContactType"]:checked').value;
    let contactDetail = '';
    if (contactType === 'phone') {
      const phone = document.getElementById('faqPhone').value.trim();
      if (!phone) { alert('Введите номер телефона.'); return; }
      contactDetail = phone;
    } else if (contactType === 'telegram') {
      const tg = document.getElementById('faqTelegram').value.trim();
      if (!tg) { alert('Введите ник в Telegram.'); return; }
      contactDetail = '@' + tg.replace('@', '');
    } else if (contactType === 'vk') {
      const vk = document.getElementById('faqVk').value.trim();
      if (!vk) { alert('Введите ссылку на ВК.'); return; }
      contactDetail = vk;
    }

    const message = `❓ Новый вопрос с сайта\n👤 Имя: ${name}\n📞 Связь: ${contactDetail}\n💬 Вопрос: ${question}`;

    try {
      await sendToTelegram(message);
      // Показываем анимацию успеха
      faqForm.style.display = 'none';
      faqSuccess.classList.add('faq-ask__success--visible');

      // Через 5 секунд плавно скрываем всю секцию
      setTimeout(() => {
        faqSection.classList.add('faq-ask--hidden');
      }, 5000);
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка. Попробуйте позже.');
    }
  });

  async function sendToTelegram(text) {
    const TELEGRAM_TOKEN = '8809007843:AAH9afSTjM9oitKsCY36fPhMx4TMk8f-vBY';
    const TELEGRAM_CHAT_ID = '8731777136';
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
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    return response.json();
  }
})();