(() => {
  // ========= CONSTANTES Y CONFIGURACIÓN =========
  const SCROLL_THRESHOLD = 400;
  const LIGHTBOX_EXCLUDE_SELECTOR = '[data-lightbox="off"]';
  const REVEAL_SELECTORS = 'p, img, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11';
  
  // ========= Botón volver arriba =========
  const backBtn = document.getElementById('backToTop');
  const updateBackBtn = () => {
    if (!backBtn) return;
    backBtn.hidden = window.scrollY < SCROLL_THRESHOLD;
  };
  
  if (backBtn) {
    window.addEventListener('scroll', updateBackBtn, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    updateBackBtn();
  }

  // ========= Lightbox para imágenes =========
  const images = Array.from(document.querySelectorAll(`img:not(${LIGHTBOX_EXCLUDE_SELECTOR})`));
  
  if (images.length) {
    let current = -1;
    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.innerHTML = `
      <button class="lb-close" aria-label="Cerrar">×</button>
      <img class="lb-img" alt=""/>
      <button class="lb-prev" aria-label="Anterior">‹</button>
      <button class="lb-next" aria-label="Siguiente">›</button>
    `;
    document.body.appendChild(overlay);

    const lbImg = overlay.querySelector('.lb-img');
    
    const open = (index) => {
      current = index;
      lbImg.src = images[current].src;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    
    const close = () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    
    const prev = () => open((current - 1 + images.length) % images.length);
    const next = () => open((current + 1) % images.length);

    images.forEach((img, idx) => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => open(idx));
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('lb-close')) close();
    });
    
    overlay.querySelector('.lb-prev').addEventListener('click', (e) => { 
      e.stopPropagation(); 
      prev(); 
    });
    
    overlay.querySelector('.lb-next').addEventListener('click', (e) => { 
      e.stopPropagation(); 
      next(); 
    });

    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });
  }

  // ========= Animaciones de aparición al hacer scroll =========
  const revealEls = document.querySelectorAll(REVEAL_SELECTORS);
  
  if (revealEls.length) {
    revealEls.forEach(el => el.classList.add('to-reveal'));
    
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    revealEls.forEach(el => io.observe(el));
  }

  // ========= Botón de cambio de tema =========
  // Eliminar cualquier botón de tema existente para evitar duplicados
  const existingThemeButtons = document.querySelectorAll('#themeToggle, .theme-toggle');
  existingThemeButtons.forEach(btn => btn.remove());

  // Crear un único botón de cambio de tema
  const themeToggleBtn = document.createElement('button');
  themeToggleBtn.id = 'themeToggle';
  themeToggleBtn.className = 'theme-toggle';
  themeToggleBtn.setAttribute('aria-label', 'Cambiar entre Modo claro y oscuro');

  // Insertar el botón después del enlace "Ir al Final"
  const goToEndLink = document.querySelector('.ID');
  if (goToEndLink && goToEndLink.parentNode) {
    goToEndLink.parentNode.insertBefore(themeToggleBtn, goToEndLink.nextSibling);
  } else {
    // Fallback: insertar al principio del body si no se encuentra el enlace
    document.body.insertBefore(themeToggleBtn, document.body.firstChild);
  }

  // Función para actualizar el botón según el tema actual
  function updateThemeButton(isLightTheme) {
    if (isLightTheme) {
      themeToggleBtn.textContent = 'Modo ☀️'; // Modo claro - muestra sol
    } else {
      themeToggleBtn.textContent = 'Modo 🌙'; // Modo oscuro - muestra luna
    }
  }

  // Función para cambiar entre temas
  themeToggleBtn.addEventListener('click', () => {
    const isLightTheme = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    updateThemeButton(isLightTheme);
  });

  // Cargar tema guardado al iniciar
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    updateThemeButton(true);
  } else {
    // Por defecto: modo oscuro
    document.body.classList.remove('light-theme');
    updateThemeButton(false);
  }
})();