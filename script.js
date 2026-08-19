// On touch devices, tapping a link navigates immediately with no time for the
// hover-fill animation to show. Play it first, then open the link.
document.querySelectorAll('a.btn[target="_blank"], .fab-item[target="_blank"]').forEach(link => {
  link.addEventListener('click', function(e){
    if(this.dataset.tapped){ return; } // already played once, let it navigate normally
    e.preventDefault();
    this.classList.add('tap-active');
    this.dataset.tapped = '1';
    const href = this.href, target = this.target || '_self';
    setTimeout(() => { window.open(href, target); }, 380);
  });
});

// Dropdown "Ver tratamientos" — mismo patrón abrir/cerrar que el fab de WhatsApp
const treatToggle = document.getElementById('treatToggle');
const treatMenu = document.getElementById('treatMenu');
if(treatToggle && treatMenu){
  treatToggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = treatMenu.classList.toggle('open');
    treatToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if(treatMenu.classList.contains('open') && !treatToggle.contains(e.target) && !treatMenu.contains(e.target)){
      treatMenu.classList.remove('open');
      treatToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Header scroll state
const header = document.getElementById('siteHeader');
if(header){
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, {passive:true});
}

// Floating contact group (WhatsApp + Instagram)
const fabToggle = document.getElementById('fabToggle');
const fabGroup = document.getElementById('fabGroup');
if(fabToggle && fabGroup){
  fabToggle.addEventListener('click', () => {
    const isOpen = fabGroup.classList.toggle('open');
    fabToggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', (e) => {
    if(fabGroup.classList.contains('open') && !fabGroup.contains(e.target)){
      fabGroup.classList.remove('open');
      fabToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if(burger && mobileMenu){
  burger.addEventListener('click', () => {
    const isOpen = !burger.classList.contains('open');
    burger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    if(isOpen && header) header.classList.add('scrolled');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

// Fade-in de fotos: quedan invisibles hasta que cargan, evitando el "salto" brusco
// que se ve cuando una foto pesada termina de bajar en medio de la animación de la tarjeta.
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  if(img.complete && img.naturalWidth > 0){
    img.classList.add('img-loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('img-loaded'));
    img.addEventListener('error', () => img.classList.add('img-loaded'));
  }
});

// Sequential (non-random) stagger for grids where random order looks messy —
// grouped by parent container so each grid's cards cascade 1, 2, 3, 4 in order.
document.addEventListener('DOMContentLoaded', () => {
  const groups = new Map();
  document.querySelectorAll('.reveal-seq').forEach(el => {
    const parent = el.parentElement;
    if(!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(list => {
    list.forEach((el, i) => { el.dataset.seqDelay = i * 130; });
  });
});

// Apple-style load-in: fade + blur + scale, staggered, for above-the-fold content
document.addEventListener('DOMContentLoaded', () => {
  const loadEls = document.querySelectorAll('.load-reveal');
  loadEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 150 + i * 120);
  });
});

// Scroll reveal (same fade + blur + scale, triggered on entering viewport)
// Elements with "reveal-rand" pop in at a random delay instead of all at once,
// so grids (categories, treatments, cards) feel more lively — like a random cascade.
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target;
    if(el.classList.contains('reveal-rand')){
      const delay = Math.random() * 500;
      const rot = (Math.random() * 6 - 3).toFixed(2);
      el.style.setProperty('--rot', rot + 'deg');
      setTimeout(() => el.classList.add('in'), delay);
    } else if(el.classList.contains('reveal-seq')){
      const delay = Number(el.dataset.seqDelay || 0);
      setTimeout(() => el.classList.add('in'), delay);
    } else {
      el.classList.add('in');
    }
    io.unobserve(el);
  });
}, { threshold:0.05, rootMargin:'0px 0px -2% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if(!q || !a) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(other => {
      if(other !== item){
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      }
    });
    item.classList.toggle('open', !isOpen);
    a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
  });
});

// About "leer más" toggle — animate both open and close using the real content height
// (a fixed max-height would make "open" look instant since it overshoots the real content)
const readMoreBtn = document.querySelector('.read-more-btn');
if(readMoreBtn){
  const extra = document.querySelector('.about-copy .extra');
  readMoreBtn.addEventListener('click', () => {
    const isOpen = extra.classList.contains('open');
    if(!isOpen){
      extra.style.maxHeight = extra.scrollHeight + 'px';
    } else {
      extra.style.maxHeight = extra.scrollHeight + 'px'; // lock current height first
      requestAnimationFrame(() => { extra.style.maxHeight = '0px'; }); // then animate down
    }
    extra.classList.toggle('open', !isOpen);
    readMoreBtn.classList.toggle('open', !isOpen);
    readMoreBtn.querySelector('span').textContent = !isOpen ? 'Leer menos' : 'Leer más';
  });
}
