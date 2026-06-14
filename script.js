(function() {
  'use strict';

  const TELEGRAM_TOKEN = '8809007843:AAH9afSTjM9oitKsCY36fPhMx4TMk8f-vBY';
  const TELEGRAM_CHAT_ID = '8731777136';

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

  // ---------- Маска телефона ----------
  function applyPhoneMask(input) {
    input.addEventListener('input', () => {
      let value = input.value.replace(/\D/g, '');
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
      input.value = formatted;
    });
  }

  const phoneInputs = document.querySelectorAll('#userPhone, #phoneNumber');
  phoneInputs.forEach(input => applyPhoneMask(input));

  // ---------- СЛАЙДЕР ----------
  const sliderContainer = document.getElementById('sectionsSlider');
  const sliderTrack = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentIndex = 0;

  function updateSlider(animate = true) {
    if (!animate) {
      sliderTrack.style.transition = 'none';
    } else {
      sliderTrack.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle('slide--active', i === currentIndex);
    });
    document.getElementById('globalLeft').disabled = currentIndex === 0;
    document.getElementById('globalRight').disabled = currentIndex === totalSlides - 1;
  }

  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;
    updateSlider(true);
  }

  document.getElementById('globalLeft').addEventListener('click', () => goToSlide(currentIndex - 1));
  document.getElementById('globalRight').addEventListener('click', () => goToSlide(currentIndex + 1));

  let startX = 0, isDragging = false, startTranslate = 0;
  function handleDragStart(clientX) {
    if (clientX === undefined) return;
    if (event.target.closest('button, a, input')) return;
    startX = clientX;
    isDragging = true;
    sliderTrack.style.transition = 'none';
    startTranslate = -currentIndex * sliderContainer.offsetWidth;
  }
  function handleDragMove(clientX) {
    if (!isDragging) return;
    const diff = clientX - startX;
    sliderTrack.style.transform = `translateX(${startTranslate + diff}px)`;
  }
  function handleDragEnd(clientX) {
    if (!isDragging) return;
    isDragging = false;
    const diff = clientX - startX;
    const threshold = sliderContainer.offsetWidth * 0.2;
    if (diff > threshold && currentIndex > 0) goToSlide(currentIndex - 1);
    else if (diff < -threshold && currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
    else goToSlide(currentIndex);
  }

  sliderContainer.addEventListener('touchstart', (e) => handleDragStart(e.touches[0].clientX), {passive: false});
  sliderContainer.addEventListener('touchmove', (e) => {
    if (isDragging) e.preventDefault();
    handleDragMove(e.touches[0].clientX);
  }, {passive: false});
  sliderContainer.addEventListener('touchend', (e) => handleDragEnd(e.changedTouches[0].clientX));
  sliderContainer.addEventListener('mousedown', (e) => handleDragStart(e.clientX));
  window.addEventListener('mousemove', (e) => handleDragMove(e.clientX));
  window.addEventListener('mouseup', (e) => handleDragEnd(e.clientX));
  sliderContainer.addEventListener('dragstart', (e) => e.preventDefault());
  goToSlide(0);

  // ---------- WIZARD ----------
  const wizardOverlay = document.getElementById('wizardOverlay');
  const wizard = document.getElementById('wizard');
  const openWizardBtn = document.getElementById('openWizard');
  const closeWizardBtn = document.getElementById('closeWizard');
  const wizardSlides = document.querySelectorAll('.wizard__slide');
  const progressFill = document.getElementById('progressFill');
  let currentStep = 1;
  let wizardData = {};

  const budgetRange = document.getElementById('budgetRange');
  const budgetValue = document.getElementById('budgetValue');

  if (budgetRange && budgetValue) {
    budgetRange.addEventListener('input', () => {
      const val = parseInt(budgetRange.value);
      budgetValue.textContent = val.toLocaleString('ru-RU') + ' ₽';
    });
  }

  function updateProgress(step) {
    const percent = ((step - 1) / 3) * 100;
    progressFill.style.width = percent + '%';
  }

  function showWizardSlide(step) {
    wizardSlides.forEach(s => s.classList.remove('active'));
    const activeSlide = document.querySelector(`.wizard__slide[data-slide="${step}"]`);
    if (activeSlide) activeSlide.classList.add('active');
    updateProgress(step);
  }

  function openWizard() {
    wizardOverlay.classList.add('wizard-overlay--open');
    currentStep = 1;
    showWizardSlide(1);
    wizardData = {};
    document.querySelectorAll('.wizard__card').forEach(c => c.classList.remove('wizard__card--selected'));
    resetContactFields();
    if (budgetRange) {
      budgetRange.value = 150000;
      budgetValue.textContent = '150 000 ₽';
    }
  }

  function closeWizard() {
    wizardOverlay.classList.remove('wizard-overlay--open');
  }

  openWizardBtn.addEventListener('click', openWizard);
  closeWizardBtn.addEventListener('click', closeWizard);
  wizardOverlay.addEventListener('click', (e) => {
    if (e.target === wizardOverlay) closeWizard();
  });

  const contactFields = {
    telegram: document.getElementById('fieldTelegram'),
    vk: document.getElementById('fieldVK'),
    call: document.getElementById('fieldCall')
  };
  const contactInputs = {
    telegram: document.getElementById('telegramUsername'),
    vk: document.getElementById('vkLink'),
    call: document.getElementById('phoneNumber')
  };

  function resetContactFields() {
    Object.values(contactFields).forEach(field => field.style.display = 'none');
    Object.values(contactInputs).forEach(input => { if (input) input.value = ''; });
  }

  function showContactField(type) {
    resetContactFields();
    if (contactFields[type]) {
      contactFields[type].style.display = 'block';
      if (type === 'call' && contactInputs.call) {
        contactInputs.call.value = '+7';
        contactInputs.call.focus();
      }
    }
  }

  wizard.addEventListener('click', (e) => {
    const card = e.target.closest('.wizard__card');
    if (!card) return;
    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
      const groupName = radio.name;
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        r.closest('.wizard__card').classList.remove('wizard__card--selected');
      });
      card.classList.add('wizard__card--selected');

      if (groupName === 'contact') {
        const value = radio.value;
        if (value === 'Telegram') showContactField('telegram');
        else if (value === 'ВК') showContactField('vk');
        else if (value === 'Звонок') showContactField('call');
      }
    }
  });

  wizard.addEventListener('click', (e) => {
    if (!e.target.classList.contains('wizard__btn--next')) return;
    const nextStep = parseInt(e.target.dataset.next);

    if (currentStep === 1) {
      const budgetVal = parseInt(budgetRange.value);
      wizardData.budget = budgetVal.toLocaleString('ru-RU') + ' ₽';
    } else {
      const currentSlide = document.querySelector(`.wizard__slide[data-slide="${currentStep}"]`);
      const radioName = currentSlide.querySelector('input[type="radio"]').name;
      const selected = currentSlide.querySelector(`input[name="${radioName}"]:checked`);
      if (!selected) {
        alert('Пожалуйста, выберите вариант.');
        return;
      }
      wizardData[radioName] = selected.value;
    }

    currentStep = nextStep;
    showWizardSlide(nextStep);
    if (nextStep === 4) resetContactFields();
  });

  const submitWizardBtn = document.getElementById('submitWizard');
  submitWizardBtn.addEventListener('click', () => {
    const currentSlide = document.querySelector(`.wizard__slide[data-slide="${currentStep}"]`);
    const radioName = currentSlide.querySelector('input[type="radio"]').name;
    const selected = currentSlide.querySelector(`input[name="${radioName}"]:checked`);
    if (!selected) {
      alert('Выберите способ связи.');
      return;
    }
    wizardData[radioName] = selected.value;

    let contactDetail = '';
    if (selected.value === 'Telegram') {
      const username = contactInputs.telegram.value.trim();
      if (!username) { alert('Введите ник в Telegram.'); return; }
      contactDetail = `@${username.replace('@', '')}`;
    } else if (selected.value === 'ВК') {
      const vkLink = contactInputs.vk.value.trim();
      if (!vkLink) { alert('Введите ссылку на ВК.'); return; }
      contactDetail = vkLink;
    } else if (selected.value === 'Звонок') {
      const phone = contactInputs.call.value.trim();
      if (!phone) { alert('Введите номер телефона.'); return; }
      contactDetail = phone;
    }

    const message = `📋 Новая заявка на подбор ПК\n` +
      `💰 Бюджет: ${wizardData.budget}\n` +
      `🎯 Цели: ${wizardData.purpose}\n` +
      `🖥️ Разрешение: ${wizardData.resolution}\n` +
      `📞 Связь: ${wizardData.contact} (${contactDetail})`;

    sendToTelegram(message)
      .then(() => {
        const body = document.querySelector('.wizard__body');
        body.innerHTML = `<div style="text-align:center; padding:2rem;">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#8655e9" stroke-width="4" stroke-dasharray="226" stroke-dashoffset="226" style="animation: draw-circle 0.6s ease forwards"/>
            <polyline points="25,40 36,52 55,28" fill="none" stroke="#8655e9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="50" stroke-dashoffset="50" style="animation: draw-check 0.4s 0.5s ease forwards"/>
          </svg>
          <p style="color:#ccc; margin-top:1rem; font-family: 'Monocraft', monospace; letter-spacing: 0.5px;">Заявка отправлена!<br>Мы свяжемся с вами.</p>
        </div>`;
        setTimeout(closeWizard, 3000);
      })
      .catch(err => {
        console.error(err);
        alert('Ошибка отправки. Попробуйте позже.');
      });
  });

  // ---------- POPUP ----------
  const banner = document.getElementById('popupBanner');
  const closeBtn = document.getElementById('closePopup');
  const form = document.getElementById('helpForm');
  const formWrapper = document.getElementById('formWrapper');
  const successBlock = document.getElementById('successBlock');

  function resetBanner() {
    if (!banner) return;
    banner.classList.remove('popup-banner--visible');
    if (formWrapper) formWrapper.style.display = '';
    if (successBlock) successBlock.classList.remove('popup-banner__success--visible');
    if (form) form.reset();
  }

  if (banner && closeBtn) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (window.innerWidth > 1024) {
          banner.classList.add('popup-banner--visible');
        }
      }, 300);
    });

    closeBtn.addEventListener('click', resetBanner);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && banner.classList.contains('popup-banner--visible')) {
        resetBanner();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value.trim();
        const phone = document.getElementById('userPhone').value.trim();
        const agree = document.getElementById('agreeCheckbox').checked;
        if (!name || !phone || !agree) {
          alert('Заполните все поля и согласитесь с политикой конфиденциальности.');
          return;
        }
        const msg = `📩 Новая заявка с сайта YANKEE PC\n👤 Имя: ${name}\n📞 Телефон: ${phone}`;
        sendToTelegram(msg)
          .then(() => {
            formWrapper.style.display = 'none';
            successBlock.classList.add('popup-banner__success--visible');
            setTimeout(resetBanner, 4000);
          })
          .catch(error => {
            console.error('Ошибка отправки в Telegram:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
          });
      });
    }
  }

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
    if (!response.ok) throw new Error(`Ошибка ${response.status}`);
    return response.json();
  }
})();