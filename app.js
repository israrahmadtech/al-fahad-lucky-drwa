// mobile menu (simple toggle -> shows links stacked)
const burger = document.getElementById('burgerBtn');
const links = document.querySelector('nav.links');
burger.addEventListener('click', () => {
   const open = links.style.display === 'flex';
   links.style.display = open ? 'none' : 'flex';
   links.style.flexDirection = 'column';
   links.style.position = 'absolute';
   links.style.top = '64px';
   links.style.right = '20px';
   links.style.background = 'rgba(10,46,34,.98)';
   links.style.padding = '18px 24px';
   links.style.borderRadius = '14px';
   links.style.border = '1px solid rgba(232,200,116,.25)';
   burger.setAttribute('aria-expanded', String(!open));
});

// scroll reveal, staggered by position within its own parent
const revealGroups = new Map();
document.querySelectorAll('.reveal').forEach(el => {
   const parent = el.parentElement;
   if (!revealGroups.has(parent)) revealGroups.set(parent, []);
   revealGroups.get(parent).push(el);
});
revealGroups.forEach(list => {
   list.forEach((el, i) => { el.style.transitionDelay = (i * 90) + 'ms'; });
});
const io = new IntersectionObserver((entries) => {
   entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// hero stat count-up, once
const countEls = document.querySelectorAll('.count-up');
const countIO = new IntersectionObserver((entries) => {
   entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
         el.textContent = target + suffix;
         countIO.unobserve(el);
         return;
      }
      const dur = 1100;
      const start = performance.now();
      function tick(now) {
         const p = Math.min(1, (now - start) / dur);
         const eased = 1 - Math.pow(1 - p, 3);
         const val = Math.round(target * eased);
         el.textContent = val + suffix;
         if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countIO.unobserve(el);
   });
}, { threshold: 0.6 });
countEls.forEach(el => countIO.observe(el));

// subtle parallax on hero skyline
const heroSection = document.querySelector('.hero');
window.addEventListener('scroll', () => {
   const y = window.scrollY;
   if (y < window.innerHeight) {
      heroSection.style.backgroundPosition = 'center ' + (y * 0.15) + 'px';
   }
}, { passive: true });

// quantity selector
const qtyInput = document.getElementById('qty');
const qtyTotal = document.getElementById('qtyTotal');
const PRICE = 500;
function updateTotal() {
   const q = parseInt(qtyInput.value, 10) || 1;
   qtyTotal.textContent = 'PKR ' + (q * PRICE).toLocaleString();
}
document.getElementById('qtyPlus').addEventListener('click', () => {
   qtyInput.value = Math.min(50, (parseInt(qtyInput.value, 10) || 1) + 1);
   updateTotal();
});
document.getElementById('qtyMinus').addEventListener('click', () => {
   qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
   updateTotal();
});

// file name display
const fileInput = document.getElementById('fileInput');
const fileName = document.getElementById('fileName');
fileInput.addEventListener('change', () => {
   fileName.textContent = fileInput.files.length ? '✓ ' + fileInput.files[0].name : '';
});

// toast on submit (form still posts to FormSubmit in background/new context)
const form = document.getElementById('ticketForm');
form.addEventListener('submit', () => {
   const toast = document.getElementById('toast');
   toast.classList.add('show');
   setTimeout(() => toast.classList.remove('show'), 4000);
});

// ---------- video modal ----------
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const videoTabs = document.getElementById('videoTabs');
const closeVideoModal = document.getElementById('closeVideoModal');

function openVideo(src, showTabs) {
   modalVideo.src = src;
   videoModal.classList.add('open');
   videoModal.setAttribute('aria-hidden', 'false');
   videoTabs.style.display = showTabs ? 'flex' : 'none';
   modalVideo.play().catch(() => { });
}
function closeVideo() {
   videoModal.classList.remove('open');
   videoModal.setAttribute('aria-hidden', 'true');
   modalVideo.pause();
   modalVideo.removeAttribute('src');
   modalVideo.load();
}
closeVideoModal.addEventListener('click', closeVideo);
videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideo(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideo(); });

document.getElementById('openPromoBtn').addEventListener('click', () => {
   openVideo('assets/video/promo.mp4', false);
});
document.getElementById('civicMediaBtn').addEventListener('click', () => {
   openVideo('assets/video/civic-exterior.mp4', true);
   document.querySelectorAll('.vtab').forEach(t => t.classList.remove('active'));
   videoTabs.querySelector('.vtab').classList.add('active');
});
videoTabs.querySelectorAll('.vtab').forEach(tab => {
   tab.addEventListener('click', () => {
      videoTabs.querySelectorAll('.vtab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      openVideo(tab.dataset.src, true);
   });
});