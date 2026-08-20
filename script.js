/*
  Portfolio interactions — preloader, theme switching, typewriter subtitle,
  terminal CLI easter egg, scroll reveals, particle background, contact form.
*/

(function () {
  "use strict";

  // ---------- DOM refs ----------
  const preloader = document.getElementById("skeletonPreloader");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const themeToggle = document.getElementById("themeToggle");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contactForm");
  const allNavLinks = document.querySelectorAll(".nav-link");
  const revealElements = document.querySelectorAll(".reveal");
  const toastContainer = document.getElementById("toastContainer");

  // ---------- Preloader ----------
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.add("fade-out");
    setTimeout(() => (preloader.style.display = "none"), 400);
  }

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 1500); // fallback in case load never fires cleanly
  }

  // ---------- Toasts ----------
  function showToast(message, icon = "⚡") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ---------- Theme ----------
  function getPreferredTheme() {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  setTheme(getPreferredTheme());

  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.classList.contains("dark")
      ? "light"
      : "dark";
    setTheme(next);
    showToast(`Switched to ${next} mode`, next === "dark" ? "🌙" : "☀️");
  });

  // ---------- Typewriter subtitle ----------
  const heroAnimatedSubtitle = document.getElementById("heroAnimatedSubtitle");

  if (heroAnimatedSubtitle) {
    const lines = [
      "Engineering Aspirant · Systems & Embedded",
      "C · Linux · IoT",
      "Learning by Building, Breaking, and Iterating",
      "Founding Advisor @ Kynatium Labs",
    ];
    const typingSpeed = 45;
    const deletingSpeed = 25;
    const pauseTime = 900;

    let lineIdx = 0;
    let charIdx = 0;
    let deleting = false;

    (function typeWriter() {
      const line = lines[lineIdx];

      if (!deleting) {
        charIdx++;
        heroAnimatedSubtitle.textContent = line.slice(0, charIdx);
        if (charIdx === line.length) {
          deleting = true;
          setTimeout(typeWriter, pauseTime);
          return;
        }
      } else {
        charIdx--;
        heroAnimatedSubtitle.textContent = line.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          lineIdx = (lineIdx + 1) % lines.length;
        }
      }
      setTimeout(typeWriter, deleting ? deletingSpeed : typingSpeed);
    })();
  }

  // ---------- Mobile menu ----------
  function openMenu() {
    navLinks.classList.add("active");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    navLinks?.classList.remove("active");
    hamburger?.classList.remove("active");
    hamburger?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  hamburger?.addEventListener("click", () => {
    navLinks.classList.contains("active") ? closeMenu() : openMenu();
  });
  mobileOverlay?.addEventListener("click", closeMenu);
  allNavLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // ---------- Scroll state: active nav link + back-to-top ----------
  const sections = document.querySelectorAll("section[id]");

  function handleNavScroll() {
    const scrollY = window.scrollY;
    backToTop?.classList.toggle("visible", scrollY > 400);

    const scrollPosition = scrollY + 120;
    sections.forEach((section) => {
      const { offsetTop: top, offsetHeight: height } = section;
      const inView = scrollPosition >= top && scrollPosition < top + height;
      if (!inView) return;

      const id = section.getAttribute("id");
      allNavLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  // ---------- Scroll reveal ----------
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible", "is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // no IO support — just show everything
    revealElements.forEach((el) => el.classList.add("visible", "is-visible"));
  }

  // ---------- Particle background ----------
  const canvas = document.getElementById("particleCanvas");

  if (
    canvas &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    const particleCount = Math.min(Math.floor(width / 30), 35);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.5 + 1,
    }));

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const particleColor = isDark
        ? "rgba(56, 189, 248, 0.35)"
        : "rgba(14, 165, 233, 0.25)";
      const lineColor = isDark
        ? "rgba(56, 189, 248, 0.06)"
        : "rgba(14, 165, 233, 0.05)";

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

        // connect nearby particles with a faint line
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist >= 100) continue;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      requestAnimationFrame(renderParticles);
    }
    requestAnimationFrame(renderParticles);
  }

  // ---------- Terminal drawer ----------
  const terminalDrawer = document.getElementById("terminalDrawer");
  const floatingTermBtn = document.getElementById("floatingTermBtn");
  const termCloseBtn = document.getElementById("termCloseBtn");
  const termMinBtn = document.getElementById("termMinBtn");
  const termMaxBtn = document.getElementById("termMaxBtn");
  const termClearBtn = document.getElementById("termClearBtn");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");

  function openTerminal() {
    if (!terminalDrawer) return;
    terminalDrawer.classList.add("active");
    terminalInput?.focus();

    // only show the welcome banner the first time it's opened
    if (terminalOutput && terminalOutput.children.length <= 1) {
      appendTermLine(
        `<div class="term-block">
          <strong>Welcome to Jehan's Interactive Shell 🚀</strong><br>
          I've built this terminal to give you a quick overview of my work.<br>
          Type <span class="term-cmd">help</span> to see available commands, or just explore!
        </div>`,
        "info",
      );
    }
  }

  function closeTerminal() {
    terminalDrawer?.classList.remove("active");
  }

  floatingTermBtn?.addEventListener("click", () => {
    terminalDrawer.classList.contains("active")
      ? closeTerminal()
      : openTerminal();
  });
  termCloseBtn?.addEventListener("click", closeTerminal);
  termMinBtn?.addEventListener("click", () =>
    terminalDrawer.classList.toggle("minimized"),
  );
  termMaxBtn?.addEventListener("click", () =>
    terminalDrawer.classList.toggle("maximized"),
  );
  termClearBtn?.addEventListener("click", () => {
    if (terminalOutput) {
      terminalOutput.innerHTML =
        '<div class="term-line info">Console cleared. Type <span class="term-cmd">help</span> for commands.</div>';
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!e.ctrlKey || e.key !== "`") return;
    e.preventDefault();
    terminalDrawer.classList.contains("active")
      ? closeTerminal()
      : openTerminal();
  });

  // ---------- Terminal input + history ----------
  const commandHistory = [];
  let historyIndex = -1;

  terminalInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const raw = terminalInput.value.trim();
      if (!raw) return;

      commandHistory.push(raw);
      historyIndex = commandHistory.length;
      terminalInput.value = "";

      appendTermLine(
        `<div class="term-echo">jehan@sys:~$ <span class="cmd-text">${escapeHTML(raw)}</span></div>`,
      );
      runCommand(raw.toLowerCase());
    } else if (e.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = "";
      }
    }
  });

  function appendTermLine(html, type = "output") {
    if (!terminalOutput) return;
    const line = document.createElement("div");
    line.className = `term-line ${type}`;
    line.innerHTML = html;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------- Terminal commands ----------
  const commands = {
    help: () =>
      appendTermLine(
        `<div class="term-block">
          <strong>Available Commands:</strong><br>
          • <span class="term-cmd">neofetch</span> — View my system identity & role<br>
          • <span class="term-cmd">about</span> — Learn more about me<br>
          • <span class="term-cmd">skills</span> — View my technical stack<br>
          • <span class="term-cmd">projects</span> — See my featured work<br>
          • <span class="term-cmd">contact</span> — Get my email & socials<br>
          • <span class="term-cmd">theme</span> — Toggle light/dark mode<br>
          • <span class="term-cmd">clear</span> — Clear the screen
        </div>`,
        "info",
      ),

    neofetch: () =>
      appendTermLine(
        `<div class="term-block">
          <strong>╭─ SYSTEM IDENTITY ─────────────────╮</strong><br>
          <strong>User:</strong> Abdullah Al Jehan<br>
          <strong>OS:</strong> AJ-OS v2.0 (Linux Daily Driver)<br>
          <strong>Role:</strong> Embedded Systems & IoT Dev<br>
          <strong>Status:</strong> <span class="highlight-text">🟢 Open to Research & Collabs</span><br>
          <strong>Location:</strong> Dhaka, Bangladesh<br>
          <strong>╰──────────────────────────────────╯</strong>
        </div>`,
        "success",
      ),

    about: () =>
      appendTermLine(
        `<div class="term-block">
          <strong>Who am I?</strong><br>
          Hi, I'm Jehan! I'm an ambitious science student with a strong foundation in math and physics, gearing up for an engineering career. I specialize in <span class="highlight-text">Embedded Systems, IoT, and C Programming</span>.<br><br>
          Currently, I'm the Founding Advisor at <strong>Kynatium Labs</strong>, working to make tech education accessible in Bangladesh. My philosophy: <em>"Build, break, and iterate."</em>
        </div>`,
        "output",
      ),

    skills: () =>
      appendTermLine(
        `<div class="term-block">
          <strong>Technical Stack & Proficiency:</strong><br>
          • <strong>Languages:</strong> C (80%), HTML/CSS (65%), C++ (25%)<br>
          • <strong>Systems:</strong> Linux/Debian (55%), Git/GitHub (65%), Bash (45%)<br>
          • <strong>Embedded:</strong> Arduino (45%), Sensors & Hardware Integration (25%)<br>
          • <strong>Currently Learning:</strong> OOP, Advanced Linux Admin, AI/ML basics
        </div>`,
        "success",
      ),

    projects: () =>
      appendTermLine(
        `<div class="term-block">
          <strong>Featured Projects:</strong><br>
          1. <strong>Contact Management System</strong> [C, Binary File I/O, CLI]<br>
          2. <strong>Obstacle Avoiding Robot</strong> [C++, Arduino, Ultrasonic Sensors]<br>
          3. <strong>Personal Portfolio</strong> [HTML5, OKLCH CSS, Vanilla JS]<br><br>
          <em>Tip: Scroll down to the "Projects" section on the main page to see the live GitHub previews!</em>
        </div>`,
        "output",
      ),

    contact: () =>
      appendTermLine(
        `<div class="term-block">
          <strong>Let's Connect:</strong><br>
          📧 <strong>Email:</strong> <a href="mailto:abdullahaljehan.me@gmail.com" class="term-cmd">abdullahaljehan.me@gmail.com</a><br>
          💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/abdullah-al-jehan" target="_blank" class="term-cmd">abdullah-al-jehan</a><br>
          💻 <strong>GitHub:</strong> <a href="https://github.com/abdullahaljehan-me" target="_blank" class="term-cmd">abdullahaljehan-me</a><br>
          📍 <strong>Location:</strong> Dhaka, Bangladesh
        </div>`,
        "info",
      ),

    theme: () => {
      themeToggle?.click();
      appendTermLine("🎨 Theme toggled successfully.", "success");
    },

    clear: () => {
      if (terminalOutput) terminalOutput.innerHTML = "";
    },

    // easter eggs
    sudo: () =>
      appendTermLine(
        "🔒 Nice try! But you don't have root access to my brain. 😉",
        "error",
      ),
    coffee: () =>
      appendTermLine(
        "☕ Brewing a fresh cup of coffee... System performance increasing by 200%.",
        "success",
      ),
    hello: () =>
      appendTermLine(
        '👋 Hello there! How can I help you today? Type <span class="term-cmd">help</span> to see what I can do.',
        "info",
      ),
  };

  commands.whoami = commands.about;
  commands.bio = commands.about;

  function runCommand(raw) {
    const name = raw.split(" ")[0];
    const cmd = commands[name];
    if (cmd) {
      cmd();
    } else {
      appendTermLine(
        `❌ Command not found: '${escapeHTML(name)}'.<br>Type <span class="term-cmd">help</span> to see available options.`,
        "error",
      );
    }
  }

  // ---------- Copy email ----------
  document.getElementById("emailLink")?.addEventListener("click", (e) => {
    e.preventDefault();
    const email = "abdullahaljehan.me@gmail.com";

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(email)
        .then(() => showToast("Email address copied to clipboard!", "📧"));
    } else {
      window.location.href = `mailto:${email}`;
    }
  });

  // ---------- Contact form ----------
  contactForm?.addEventListener("submit", (e) => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      e.preventDefault();
      showToast("Please fill in all required fields.", "⚠️");
      return;
    }

    // don't preventDefault here — let Formsubmit.co handle the actual POST
    showToast("Sending message...", "🚀");
  });

  // ---------- Expandable "view all" grids ----------
  document.querySelectorAll(".view-all-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const grid = document.getElementById(this.getAttribute("data-target"));
      if (!grid) return;

      grid.classList.toggle("grid-expanded");
      this.classList.toggle("expanded");

      const expanded = grid.classList.contains("grid-expanded");
      const label = expanded
        ? this.getAttribute("data-collapse-text") || "Show less"
        : this.getAttribute("data-expand-text") || "View more";

      this.innerHTML = `${label} <span class="arrow">${expanded ? "↑" : "↓"}</span>`;
    });
  });

  // ---------- Project breakdown modal ----------
  const breakdownModal = document.getElementById("breakdownModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  const iconTarget = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
  const iconArch = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`;
  const iconChallenge = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  const iconTakeaway = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.9.27-1.48.27-2.09A5.07 5.07 0 0 0 10 6.82V5a2 2 0 0 1 4 0v1.09a5.07 5.07 0 0 0-5.36 5.09c0 .61.09 1.19.27 2.09"/><circle cx="12" cy="14" r="2"/></svg>`;

  const projectBreakdowns = {
    "contact-management": {
      title: "Contact Management System (C)",
      content: `
        <h4>${iconTarget} The Engineering Problem</h4>
        <p>Needed a persistent, zero-dependency CLI tool to manage contact records in pure C, avoiding heavy databases while ensuring data integrity.</p>

        <h4>${iconArch} Architecture & Implementation</h4>
        <ul>
          <li><strong>Storage Engine:</strong> Implemented binary file I/O (<code>fread</code>/<code>fwrite</code>) using fixed-size C <code>structs</code> for O(1) record retrieval.</li>
          <li><strong>Memory Management:</strong> Used dynamic allocation for variable-length string inputs, carefully tracking pointers to prevent memory leaks during CRUD operations.</li>
          <li><strong>Search Algorithm:</strong> Linear search optimized with early-exit conditions for the CLI environment.</li>
        </ul>

        <h4>${iconChallenge} Challenges & Edge Cases</h4>
        <p>Handling file corruption and unexpected EOF (End of File) states. Solved by implementing robust <code>perror</code> error checking and validating struct sizes before writing to disk.</p>

        <h4>${iconTakeaway} Key Takeaway</h4>
        <p>Deepened understanding of how operating systems handle file descriptors, memory alignment in structs, and low-level data manipulation without abstractions.</p>
      `,
    },
    "obstacle-robot": {
      title: "Obstacle Avoiding Robot (C++/Arduino)",
      content: `
        <h4>${iconTarget} The Engineering Problem</h4>
        <p>Design an autonomous navigation system capable of processing real-time physical environment data and executing low-latency motor control.</p>

        <h4>${iconArch} Architecture & Hardware Stack</h4>
        <ul>
          <li><strong>Compute:</strong> ATmega328P Microcontroller (Arduino).</li>
          <li><strong>Sensors:</strong> HC-SR04 Ultrasonic (measuring pulse width for distance).</li>
          <li><strong>Actuators:</strong> L298N H-Bridge Motor Driver controlling dual DC gear motors via PWM.</li>
        </ul>

        <h4>${iconChallenge} Challenges & Edge Cases</h4>
        <p>Ultrasonic sensors suffer from acoustic noise and multipath interference, causing false positives. Implemented a <strong>moving average filter</strong> in C++ to smooth distance readings before navigation logic made steering decisions.</p>

        <h4>${iconTakeaway} Key Takeaway</h4>
        <p>Bridged the gap between theoretical logic and physical hardware constraints, specifically regarding power delivery voltage drops and sensor calibration.</p>
      `,
    },
    "portfolio-site": {
      title: "Personal Portfolio (Vanilla JS/OKLCH)",
      content: `
        <h4>${iconTarget} The Engineering Problem</h4>
        <p>Build a high-performance, accessible, and visually striking portfolio with zero build tools, npm dependencies, or frontend frameworks.</p>

        <h4>${iconArch} Architecture & Implementation</h4>
        <ul>
          <li><strong>Design System:</strong> Utilized the modern <strong>OKLCH color space</strong> for perceptually uniform light/dark theme transitions.</li>
          <li><strong>Rendering:</strong> Custom HTML5 Canvas API particle mesh background optimized with <code>requestAnimationFrame</code> and reduced-motion media queries.</li>
          <li><strong>State Management:</strong> Vanilla JS for theme persistence (LocalStorage), IntersectionObserver for scroll reveals, and native <code>&lt;dialog&gt;</code> for accessible modals.</li>
        </ul>

        <h4>${iconChallenge} Challenges & Edge Cases</h4>
        <p>Managing Canvas performance on lower-end devices without dropping frames. Solved by dynamically capping particle count based on viewport width and respecting <code>prefers-reduced-motion</code>.</p>

        <h4>${iconTakeaway} Key Takeaway</h4>
        <p>Proved that modern, complex web experiences can be built natively without the bloat of React/Vue, resulting in a 100/100 Lighthouse performance score.</p>
      `,
    },
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".breakdown-btn");
    if (!btn || !breakdownModal) return;

    const data = projectBreakdowns[btn.getAttribute("data-project")];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;
    breakdownModal.showModal();
  });

  modalCloseBtn?.addEventListener("click", () => breakdownModal.close());

  breakdownModal?.addEventListener("click", (e) => {
    // click landed on the backdrop, not the dialog content — close it
    const rect = breakdownModal.getBoundingClientRect();
    const outside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (outside) breakdownModal.close();
  });
})();
