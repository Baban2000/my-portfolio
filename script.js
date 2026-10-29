/* ==========================================================================
   YOUR DETAILS — edit these values
   Anything left as 'YOUR_...' stays hidden on the website (no fake links).
   ========================================================================== */
const CONFIG = {
  email: 'YOUR_EMAIL@example.com',                              // e.g. 'subhadeep.dev@gmail.com'
  githubUrl: 'https://github.com/YOUR_GITHUB_USERNAME',
  linkedinUrl: 'https://www.linkedin.com/in/YOUR_LINKEDIN_HANDLE',
  joiningDate: 'YOUR_JOINING_DATE',                             // e.g. 'Jan 2024' → shows "Jan 2024 — Present"
  resumeFile: 'resume.pdf',                                     // put resume.pdf next to index.html
  resumeDownloadName: 'Subhadeep-Banerjee-Resume.pdf',
};

/* ==========================================================================
   You normally don't need to edit anything below this line.
   ========================================================================== */

const isSet = (v) => Boolean(v) && !v.includes('YOUR_');

/* ---------- Icons: <i data-icon="name" data-size="18"></i> → inline SVG ---------- */
function renderIcons(root = document) {
  root.querySelectorAll('i[data-icon]').forEach((el) => {
    const paths = ICONS[el.dataset.icon];
    if (!paths) return;
    const size = el.dataset.size || 20;
    const cls = el.getAttribute('class');
    el.outerHTML =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"` +
      `${cls ? ` class="${cls}"` : ''}>${paths}</svg>`;
  });
}

/* ---------- Links & personal details from CONFIG ---------- */
function applyConfig() {
  const links = {
    email: isSet(CONFIG.email) ? `mailto:${CONFIG.email}` : null,
    github: isSet(CONFIG.githubUrl) ? CONFIG.githubUrl : null,
    linkedin: isSet(CONFIG.linkedinUrl) ? CONFIG.linkedinUrl : null,
  };
  const labels = {
    email: CONFIG.email,
    github: CONFIG.githubUrl.replace(/^https?:\/\/(www\.)?/, ''),
    linkedin: CONFIG.linkedinUrl.replace(/^https?:\/\/(www\.)?/, ''),
  };

  document.querySelectorAll('[data-link]').forEach((el) => {
    const url = links[el.dataset.link];
    if (url) {
      el.href = url;
    } else {
      // Hide the whole list item if the link sits in a list, otherwise the element.
      (el.closest('li') || el).remove();
    }
  });

  // Remove icon lists that ended up empty.
  document.querySelectorAll('.social-links').forEach((ul) => {
    if (!ul.querySelector('li')) ul.remove();
  });

  document.querySelectorAll('[data-text]').forEach((el) => {
    el.textContent = labels[el.dataset.text];
  });

  document.querySelectorAll('[data-show-if-missing]').forEach((el) => {
    if (links[el.dataset.showIfMissing]) el.remove();
  });

  if (isSet(CONFIG.joiningDate)) {
    document.getElementById('expPeriod').textContent = `${CONFIG.joiningDate} — Present`;
  }

  document.getElementById('year').textContent = new Date().getFullYear();
}

/* ---------- Navbar: background on scroll, active link, mobile menu ---------- */
function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobile-menu');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12 || !menu.hidden);
    const show = window.scrollY > 900;
    backToTop.classList.toggle('is-shown', show);
    backToTop.tabIndex = show ? 0 : -1;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

  function setMenu(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    toggle.innerHTML = `<i data-icon="${open ? 'x' : 'menu'}" data-size="22"></i>`;
    renderIcons(toggle);
    document.body.classList.toggle('menu-open', open);
    onScroll();
  }

  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => e.matches && setMenu(false));

  // Highlight the nav link of the section currently on screen.
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a:not(.btn)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );
  document.querySelectorAll('main section[id]').forEach((s) => observer.observe(s));
}

/* ---------- Fade-in on scroll ---------- */
function setupReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Resume download (checks the file exists first) ---------- */
function setupResume() {
  document.querySelectorAll('.resume-btn').forEach((btn) => {
    const note = btn.parentElement.querySelector('.resume-note');
    btn.addEventListener('click', async () => {
      const download = () => {
        const a = document.createElement('a');
        a.href = CONFIG.resumeFile;
        a.download = CONFIG.resumeDownloadName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      };

      // Opened by double-clicking index.html: browsers block the check, so just download.
      if (location.protocol === 'file:') return download();

      try {
        const res = await fetch(CONFIG.resumeFile, { method: 'HEAD', cache: 'no-store' });
        const type = res.headers.get('content-type') || '';
        if (!res.ok || !type.includes('pdf')) throw new Error('missing');
        note.textContent = '';
        download();
      } catch {
        note.textContent =
          'The resume isn’t available for download right now — please request it through the contact form.';
      }
    });
  });
}

/* ---------- Project "View Details" popup ---------- */
function setupProjects() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  document.querySelectorAll('.details-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      document.getElementById('modalPreview').innerHTML = card.querySelector('.project-preview').outerHTML;
      document.getElementById('modalMeta').innerHTML = card.querySelector('.project-meta').innerHTML;
      document.getElementById('modal-title').textContent = card.querySelector('.project-title').textContent;
      document.getElementById('modalSubtitle').textContent = card.querySelector('.project-subtitle').textContent;
      document.getElementById('modalBody').innerHTML = card.querySelector('.project-details').innerHTML;
      document.getElementById('modalTags').innerHTML = card.querySelector('.tag-list').outerHTML;

      // Add check icons to feature lists.
      modal.querySelectorAll('.check-list li').forEach((li) => {
        li.insertAdjacentHTML('afterbegin', '<i data-icon="check" data-size="16"></i>');
      });
      renderIcons(modal);

      modal.showModal();
      document.body.classList.add('menu-open');
    });
  });

  document.getElementById('modalClose').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close(); // click on the dark backdrop
  });
  modal.addEventListener('close', () => document.body.classList.remove('menu-open'));
}

/* ---------- Contact form (Netlify Forms) ---------- */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const submitHTML = submitBtn.innerHTML;

  const rules = {
    name: (v) => (!v ? 'Please enter your name.' : v.length < 2 ? 'Name looks too short.' : ''),
    email: (v) =>
      !v ? 'Please enter your email address.'
        : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'Please enter a valid email address, e.g. name@example.com.'
        : '',
    subject: (v) => (!v ? 'Please add a subject.' : ''),
    message: (v) =>
      !v ? 'Please write a message.' : v.length < 10 ? 'Please add a little more detail (at least 10 characters).' : '',
  };

  function check(name) {
    const input = form.elements[name];
    const error = document.getElementById(`cf-${name}-error`);
    const msg = rules[name](input.value.trim());
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (msg) {
      error.innerHTML = `<i data-icon="alert" data-size="14"></i> ${msg}`;
      renderIcons(error);
      error.hidden = false;
      input.setAttribute('aria-describedby', error.id);
    } else {
      error.hidden = true;
      input.removeAttribute('aria-describedby');
    }
    return !msg;
  }

  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener('blur', () => check(name));
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') check(name);
      status.innerHTML = '';
    });
  });

  function showStatus(type, text) {
    status.innerHTML = `<p class="status-${type}"><i data-icon="${type === 'success' ? 'circle-check' : 'alert'}" data-size="18"></i> ${text}</p>`;
    renderIcons(status);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalid = Object.keys(rules).filter((name) => !check(name));
    if (invalid.length) {
      form.elements[invalid[0]].focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-icon="loader" data-size="18" class="spin"></i> Sending…';
    renderIcons(submitBtn);

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      showStatus('success', 'Thanks — your message was sent. I’ll get back to you soon.');
    } catch {
      // Only shows success when Netlify actually accepts the message.
      showStatus('error', 'Sorry, the message couldn’t be sent. Please try again in a moment.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitHTML;
    }
  });
}

/* ---------- Icon shapes (from Lucide, ISC licence) ---------- */
const ICONS = {
  'server': '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
  'database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  'layout': '<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/>',
  'sparkles': '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
  'wrench': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/>',
  'git-branch': '<path d="M15 6a9 9 0 0 0-9 9V3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>',
  'folder-git': '<path d="M18 19a5 5 0 0 1-5-5v8"/><path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"/><circle cx="13" cy="12" r="2"/><circle cx="20" cy="19" r="2"/>',
  'cloud-upload': '<path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/>',
  'terminal': '<path d="M12 19h8"/><path d="m4 17 6-6-6-6"/>',
  'code': '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  'rocket': '<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'mail': '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'download': '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  'menu': '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'briefcase': '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
  'calendar': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M16 2v3"/><path d="M3 9h18"/><path d="M8 2v3"/><path d="M17 13h-6"/><path d="M13 17H7"/><path d="M7 13h.01"/><path d="M17 17h.01"/>',
  'boxes': '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
  'plug': '<path d="M12 22v-5"/><path d="M15 8V2"/><path d="M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"/><path d="M9 8V2"/>',
  'chart': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  'trending': '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  'folder-open': '<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>',
  'book': '<path d="M10 2v7.751a.25.25 0 00.407.195l2.28-1.834a.5.5 0 01.627 0l2.28 1.834A.25.25 0 0016 9.751V2"/><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H19a1 1 0 011 1v18a1 1 0 01-1 1H6.5a1 1 0 010-5H20"/>',
  'loader': '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  'alert': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>',
  'send': '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
};

/* ---------- Start ---------- */
applyConfig();
renderIcons();
setupNavbar();
setupReveal();
setupResume();
setupProjects();
setupContactForm();

