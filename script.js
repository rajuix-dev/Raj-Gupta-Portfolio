/* ============================================
   RAJ GUPTA PORTFOLIO — script.js
   EmailJS Integrated for Contact Form
   ============================================ */

/* ── EMAILJS CONFIGURATION ── */
const EMAILJS_PUBLIC_KEY = 'astmiG8XvJkl1qjH3';
const EMAILJS_SERVICE_ID = 'service_yy024al';
const EMAILJS_TEMPLATE_ID = 'template_p6dohh8';

(function () {
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.warn('EmailJS library not loaded');
  }
})();

/* ── MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
}
function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove('open');
}

/* ── ACTIVE NAV LINK ON SCROLL ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.masthead-nav a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop - 160) current = sec.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--green-2)' : '';
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId.length < 2) return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobile();
    }
  });
});

/* ═══════════════════════════════════
   EMAILJS CONTACT FORM HANDLER
   ═══════════════════════════════════ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const formStatus = document.getElementById('formStatus');

    const fromName = document.getElementById('fromName').value.trim();
    const fromEmail = document.getElementById('fromEmail').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Portfolio Contact';
    const message = document.getElementById('message').value.trim();

    if (!fromName || !fromEmail || !message) {
      showFormStatus(formStatus, 'error', 'Please fill all required fields.');
      shakeElement(submitBtn);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail)) {
      showFormStatus(formStatus, 'error', 'Please enter a valid email address.');
      shakeElement(document.getElementById('fromEmail'));
      return;
    }

    submitBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline';
    if (formStatus) formStatus.style.display = 'none';

    const templateParams = {
      from_name: fromName,
      from_email: fromEmail,
      subject: subject,
      message: message,
      timestamp: new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'long'
      }),
      to_email: 'raj.uixwebdev@gmail.com'
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        showFormStatus(formStatus, 'success', 'Message sent — I\'ll get back to you soon.');
        contactForm.reset();
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
        btnText.textContent = 'Sent';
      }
    } catch (error) {
      console.error('EmailJS error:', error);

      let errorMessage = 'Failed to send message. Please try again.';
      if (error.status === 400) errorMessage = 'Invalid request — check template variables.';
      else if (error.status === 412) errorMessage = 'Service unavailable. Try again later.';
      else if (error.status === 403) errorMessage = 'Access denied. Check your API keys.';

      showFormStatus(formStatus, 'error', errorMessage);
      shakeElement(submitBtn);
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        if (btnText) {
          btnText.style.display = 'inline';
          btnText.textContent = 'Send message';
        }
        if (btnLoader) btnLoader.style.display = 'none';

        if (formStatus && formStatus.classList.contains('success')) {
          formStatus.style.display = 'none';
        }
      }, 4000);
    }
  });
}

/* ── FORM HELPER FUNCTIONS ── */
function showFormStatus(element, type, message) {
  if (!element) return;
  element.style.display = 'block';
  element.textContent = message;
  element.className = 'form-status';
  element.classList.add(type);
}

function shakeElement(element) {
  if (!element) return;
  element.style.animation = 'none';
  element.offsetHeight;
  element.style.animation = 'shake 0.5s ease-in-out';
  setTimeout(() => { element.style.animation = ''; }, 500);
}

/* ── RESUME BUTTONS ── */
const resumeUrl = './Raj_Gupta_Resume.docx';

['resumeBtn2'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', e => {
      e.preventDefault();
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Raj_Gupta_Resume.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const toast = document.createElement('div');
      toast.className = 'rg-toast';
      toast.textContent = 'Resume download started';
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2200);
    });
  }
});
