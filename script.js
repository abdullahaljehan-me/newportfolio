/* ═══════════════════════════════════════════════════════
   Portfolio JS — Abdullah Al Jehan
   Interactive Cyber/Terminal Shell, Dynamic GitHub API, 
   Particle Canvas, Code Showcase, & Smooth Micro-interactions
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM Elements ────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');
  const toastContainer = document.getElementById('toastContainer');

  // ─── Toast Notification System ──────────────────────
  function showToast(message, icon = '⚡') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  // ─── Theme Management ───────────────────────────────
  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Initialize theme
  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme} mode`, nextTheme === 'dark' ? '🌙' : '☀️');
    });
  }

  // Listen for OS preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ─── Mobile Menu ─────────────────────────────────────
  function toggleMenu() {
    const isOpen = navLinks.classList.contains('active');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
    mobileOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  allNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
      closeMenu();
    }
  });

  // ─── Navbar Scroll & Active Link ─────────────────────
  const sections = document.querySelectorAll('section[id]');

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active Section Tracking
    const scrollPosition = scrollY + 120;
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        allNavLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ─── Reveal on Scroll ────────────────────────────────
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Stagger delays
  document.querySelectorAll('.skills-grid .skill-category').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
  document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });

  // ─── Number Counter Animation for Highlights ─────────
  const highlightCards = document.querySelectorAll('.about-highlights .highlight-card');
  let hasAnimatedCounters = false;

  function animateCounters() {
    if (hasAnimatedCounters) return;
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;

    const rect = aboutSection.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.8) {
      hasAnimatedCounters = true;
      highlightCards.forEach((card) => {
        const targetAttr = card.getAttribute('data-target');
        const suffix = card.getAttribute('data-suffix') || '';
        const isFloat = card.getAttribute('data-is-float') === 'true';
        const numberEl = card.querySelector('.highlight-number');
        if (!numberEl || !targetAttr) return;

        const targetNum = parseFloat(targetAttr);
        let currentNum = 0;
        const duration = 1500;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          currentNum = targetNum * easeProgress;

          if (isFloat) {
            numberEl.textContent = currentNum.toFixed(2) + suffix;
          } else {
            numberEl.textContent = Math.floor(currentNum) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            numberEl.textContent = (isFloat ? targetNum.toFixed(2) : targetNum) + suffix;
          }
        }
        requestAnimationFrame(update);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters(); // Initial check

  // ─── Code Showcase Tab Switcher ──────────────────────
  const codeTabs = document.querySelectorAll('.code-editor-card .tab-btn');
  const codeContents = document.querySelectorAll('.code-editor-card .code-tab');
  const copyCodeBtn = document.getElementById('copyCodeBtn');

  codeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      codeContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const activeCode = document.querySelector('.code-tab.active');
      if (activeCode) {
        const text = activeCode.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            showToast('Code snippet copied to clipboard!', '📋');
          });
        }
      }
    });
  }

  // ─── Project Category Filter ─────────────────────────
  const filterBtns = document.querySelectorAll('.project-filter-container .filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ─── Dynamic Live GitHub REST API Feed ──────────────
  const repoContainer = document.getElementById('githubRepoContainer');

  async function fetchGitHubRepos() {
    if (!repoContainer) return;
    try {
      const response = await fetch('https://api.github.com/users/abdullahaljehan-me/repos?sort=updated&per_page=6');
      if (!response.ok) throw new Error('GitHub API rate limit or network issue');
      const repos = await response.json();

      if (!Array.isArray(repos) || repos.length === 0) return;

      repoContainer.innerHTML = '';
      
      // Filter non-forks or top repos
      const displayRepos = repos.slice(0, 6);

      displayRepos.forEach((repo) => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        
        const langColor = getLangColor(repo.language);
        const description = repo.description || 'Public repository by Abdullah Al Jehan';
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;

        card.innerHTML = `
          <h4 class="repo-name">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
          </h4>
          <p class="repo-desc">${escapeHTML(description)}</p>
          <div class="repo-meta">
            ${repo.language ? `<span class="repo-lang"><span class="repo-lang-dot" style="background:${langColor}"></span> ${repo.language}</span>` : ''}
            <span>★ ${stars}</span>
            <span>⑂ ${forks}</span>
          </div>
        `;
        repoContainer.appendChild(card);
      });
    } catch (err) {
      console.warn('GitHub API fetch fallback:', err);
      // Fallback static cards if offline or rate limited
      renderFallbackRepos();
    }
  }

  function getLangColor(lang) {
    const colors = {
      'C': '#555555',
      'C++': '#f34b7d',
      'HTML': '#e34c26',
      'CSS': '#563d7c',
      'JavaScript': '#f1e05a',
      'Python': '#3572A5'
    };
    return colors[lang] || '#818cf8';
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
  }

  function renderFallbackRepos() {
    if (!repoContainer) return;
    repoContainer.innerHTML = `
      <div class="repo-card">
        <h4 class="repo-name"><a href="https://github.com/abdullahaljehan-me/contact-management-system-c" target="_blank">contact-management-system-c</a></h4>
        <p class="repo-desc">A simple menu-driven Contact Management System written in C using binary file handling.</p>
        <div class="repo-meta">
          <span class="repo-lang"><span class="repo-lang-dot" style="background:#555555"></span> C</span>
          <span>★ 0</span>
          <span>⑂ 0</span>
        </div>
      </div>
      <div class="repo-card">
        <h4 class="repo-name"><a href="https://github.com/abdullahaljehan-me/portfolio" target="_blank">portfolio</a></h4>
        <p class="repo-desc">Personal portfolio site — terminal/cyber aesthetic with live GitHub REST API & CLI drawer.</p>
        <div class="repo-meta">
          <span class="repo-lang"><span class="repo-lang-dot" style="background:#e34c26"></span> HTML</span>
          <span>★ 0</span>
          <span>⑂ 0</span>
        </div>
      </div>
      <div class="repo-card">
        <h4 class="repo-name"><a href="https://github.com/Kynatium-Labs/workshop_obstracle_avoiding_robot" target="_blank">workshop_obstracle_avoiding_robot</a></h4>
        <p class="repo-desc">Autonomous obstacle avoiding robot C++ firmware built for Kynatium Labs hardware workshops.</p>
        <div class="repo-meta">
          <span class="repo-lang"><span class="repo-lang-dot" style="background:#f34b7d"></span> C++</span>
          <span>★ 0</span>
          <span>⑂ 0</span>
        </div>
      </div>
    `;
  }

  fetchGitHubRepos();

  // ─── Particle Canvas Network ─────────────────────────
  const canvas = document.getElementById('particleCanvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 25), 45);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const particleColor = isDark ? 'rgba(129, 140, 248, 0.4)' : 'rgba(79, 70, 229, 0.25)';
      const lineColor = isDark ? 'rgba(129, 140, 248, 0.08)' : 'rgba(79, 70, 229, 0.06)';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(renderParticles);
    }
    requestAnimationFrame(renderParticles);
  }

  // ─── Interactive CLI Terminal Drawer Component ──────
  const terminalDrawer = document.getElementById('terminalDrawer');
  const cliToggleBtn = document.getElementById('cliToggleBtn');
  const heroCliBtn = document.getElementById('heroCliBtn');
  const termCloseBtn = document.getElementById('termCloseBtn');
  const termMinBtn = document.getElementById('termMinBtn');
  const termMaxBtn = document.getElementById('termMaxBtn');
  const termClearBtn = document.getElementById('termClearBtn');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  function openTerminal() {
    if (terminalDrawer) {
      terminalDrawer.classList.add('active');
      terminalDrawer.classList.remove('minimized');
      if (terminalInput) terminalInput.focus();
    }
  }

  function closeTerminal() {
    if (terminalDrawer) terminalDrawer.classList.remove('active');
  }

  if (cliToggleBtn) cliToggleBtn.addEventListener('click', openTerminal);
  if (heroCliBtn) heroCliBtn.addEventListener('click', openTerminal);
  if (termCloseBtn) termCloseBtn.addEventListener('click', closeTerminal);
  if (termMinBtn) termMinBtn.addEventListener('click', () => terminalDrawer.classList.toggle('minimized'));
  if (termMaxBtn) termMaxBtn.addEventListener('click', () => terminalDrawer.classList.toggle('maximized'));
  if (termClearBtn) termClearBtn.addEventListener('click', () => {
    if (terminalOutput) {
      terminalOutput.innerHTML = '<div class="term-line info">Console cleared. Type <span class="term-cmd">help</span> for commands.</div>';
    }
  });

  // Shortcut Listener: Ctrl+~ or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey && e.key === '`') || (e.metaKey && e.key === 'k')) {
      e.preventDefault();
      if (terminalDrawer.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });

  // CLI Command Interpreter
  const commandHistory = [];
  let historyIndex = -1;

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawInput = terminalInput.value.trim();
        if (!rawInput) return;

        commandHistory.push(rawInput);
        historyIndex = commandHistory.length;
        terminalInput.value = '';

        appendTermLine(`jehan@system:~$ ${escapeHTML(rawInput)}`, 'prompt-echo');
        processCLICommand(rawInput.toLowerCase());
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  function appendTermLine(html, type = 'output') {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.innerHTML = html;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function processCLICommand(cmd) {
    const parts = cmd.split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        appendTermLine(`
          Available Commands:<br/>
          • <span class="term-cmd">bio</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;— View Jehan's summary & engineering vision<br/>
          • <span class="term-cmd">skills</span> &nbsp;&nbsp;&nbsp;— Print programming languages & hardware tools<br/>
          • <span class="term-cmd">projects</span> — List featured projects & live repositories<br/>
          • <span class="term-cmd">contact</span> &nbsp;— Show email address & social profiles<br/>
          • <span class="term-cmd">github</span> &nbsp;&nbsp;— Open GitHub profile in new tab<br/>
          • <span class="term-cmd">theme</span> &nbsp;&nbsp;&nbsp;— Toggle light/dark theme<br/>
          • <span class="term-cmd">clear</span> &nbsp;&nbsp;&nbsp;— Clear the console screen<br/>
          • <span class="term-cmd">date</span> &nbsp;&nbsp;&nbsp;&nbsp;— Display system timestamp
        `, 'info');
        break;

      case 'bio':
        appendTermLine(`
          <strong>Abdullah Al Jehan (Jehan)</strong><br/>
          Location: Dhaka, Bangladesh | Role: Founding Advisor @ Kynatium Labs<br/>
          Focus: Embedded Systems, C Programming, Linux Systems, IoT, & Robotics.<br/>
          Philosophy: <em>"Build, break, and iterate until the system is robust."</em>
        `, 'output');
        break;

      case 'skills':
        appendTermLine(`
          [Languages] C, C++ (Arduino), HTML5, CSS3, JavaScript<br/>
          [Systems] &nbsp;&nbsp;Linux (Debian/Ubuntu), Bash, Git, GCC, Make<br/>
          [Hardware] &nbsp;Arduino, HC-SR04 Sensors, L298N Motors, PWM Servo Control
        `, 'success');
        break;

      case 'projects':
        appendTermLine(`
          1. <strong>Contact Management System</strong> [C, Binary Files, CLI]<br/>
          2. <strong>Obstacle Avoiding Robot</strong> [C++, Ultrasonic, Motors]<br/>
          3. <strong>Arduino Fundamentals Workshop</strong> [Curriculum, Kynatium Labs]<br/>
          4. <strong>Personal Portfolio Site</strong> [HTML/CSS/JS, REST API, CLI]
        `, 'output');
        break;

      case 'contact':
        appendTermLine(`
          Email: <a href="mailto:abdullahaljehan.me@gmail.com" class="term-cmd">abdullahaljehan.me@gmail.com</a><br/>
          GitHub: <a href="https://github.com/abdullahaljehan-me" target="_blank">github.com/abdullahaljehan-me</a><br/>
          LinkedIn: <a href="https://www.linkedin.com/in/abdullah-al-jehan" target="_blank">in/abdullah-al-jehan</a>
        `, 'info');
        break;

      case 'github':
        appendTermLine('Opening github.com/abdullahaljehan-me...', 'success');
        window.open('https://github.com/abdullahaljehan-me', '_blank');
        break;

      case 'theme':
        if (themeToggle) themeToggle.click();
        appendTermLine('Theme toggled successfully.', 'success');
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      case 'date':
        appendTermLine(new Date().toString(), 'info');
        break;

      case 'sudo':
        appendTermLine('Permission denied: You are in guest shell mode. ⚡', 'error');
        break;

      default:
        appendTermLine(`Command not found: '${escapeHTML(cmd)}'. Type <span class="term-cmd">help</span> for assistance.`, 'error');
        break;
    }
  }

  // ─── Copy Email Handler ──────────────────────────────
  const emailLink = document.getElementById('emailLink');
  if (emailLink) {
    emailLink.addEventListener('click', function (e) {
      e.preventDefault();
      const emailText = 'abdullahaljehan.me@gmail.com';

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText).then(() => {
          showToast('Email address copied to clipboard!', '📧');
        });
      } else {
        window.location.href = 'mailto:' + emailText;
      }
    });
  }

  // ─── Contact Form Submission Feedback ────────────────
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        e.preventDefault();
        showToast('Please fill in all required fields.', '⚠️');
        return;
      }

      showToast('Sending message...', '🚀');
    });
  }

  // ─── Initial Nav Check ──────────────────────────────
  handleNavScroll();

})();
