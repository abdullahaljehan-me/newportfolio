/* ═══════════════════════════════════════════════════════
   Portfolio JS — Abdullah Al Jehan
   Preloader, Typewriter Subtitle, Upgraded Floating Terminal CLI,
   OKLCH Theme System, Scroll Animations & Toast
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ─── DOM Elements ────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const themeToggle = document.getElementById("themeToggle");
  const backToTop = document.getElementById("backToTop");
  const contactForm = document.getElementById("contactForm");
  const allNavLinks = document.querySelectorAll(".nav-link");
  const revealElements = document.querySelectorAll(".reveal");
  const toastContainer = document.getElementById("toastContainer");

  // ─── Toast System ───────────────────────────────────
  function showToast(message, icon = "⚡") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
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
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function setTheme(theme) {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", theme);
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const isDark = document.documentElement.classList.contains("dark");
      const nextTheme = isDark ? "light" : "dark";
      setTheme(nextTheme);
      showToast(
        `Switched to ${nextTheme} mode`,
        nextTheme === "dark" ? "🌙" : "☀️",
      );
    });
  }

  // ─── Typewriter Subtitle Animation ──────────────────
  const heroAnimatedSubtitle = document.getElementById("heroAnimatedSubtitle");
  if (heroAnimatedSubtitle) {
    const lines = [
      "Engineering Aspirant · Systems & Embedded",
      "C · Linux · IoT",
      "Learning by Building, Breaking, and Iterating",
      "Founding Advisor @ Kynatium Labs",
    ];
    let lineIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typingSpeed = 45;
    const pauseTime = 900;

    function typeWriter() {
      const currentLine = lines[lineIdx];

      if (!isDeleting) {
        charIdx++;
        heroAnimatedSubtitle.textContent = currentLine.substring(0, charIdx);

        if (charIdx === currentLine.length) {
          isDeleting = true;
          setTimeout(typeWriter, pauseTime);
          return;
        }
      } else {
        charIdx--;
        heroAnimatedSubtitle.textContent = currentLine.substring(0, charIdx);

        if (charIdx === 0) {
          isDeleting = false;
          lineIdx = (lineIdx + 1) % lines.length;
        }
      }
      setTimeout(typeWriter, isDeleting ? 25 : typingSpeed);
    }
    typeWriter();
  }

  // ─── Mobile Menu ─────────────────────────────────────
  function toggleMenu() {
    const isOpen = navLinks.classList.contains("active");
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", !isOpen);
    document.body.style.overflow = isOpen ? "" : "hidden";
  }

  function closeMenu() {
    if (navLinks) navLinks.classList.remove("active");
    if (hamburger) {
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }

  if (hamburger) hamburger.addEventListener("click", toggleMenu);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

  allNavLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // ─── Scroll & Navigation Active State ──────────────
  const sections = document.querySelectorAll("section[id]");

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    }

    const scrollPosition = scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPosition >= top && scrollPosition < top + height) {
        allNavLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });

  // ─── Scroll Reveal (IntersectionObserver) ──────────
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => {
      el.classList.add("visible");
      el.classList.add("is-visible");
    });
  }

  // ─── Particle Canvas Background ─────────────────────
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

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 30), 35);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 1,
      });
    }

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

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
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

  // ─── Floating Terminal Button & Polished Drawer ──────
  const terminalDrawer = document.getElementById("terminalDrawer");
  const floatingTermBtn = document.getElementById("floatingTermBtn");
  const termCloseBtn = document.getElementById("termCloseBtn");
  const termMinBtn = document.getElementById("termMinBtn");
  const termMaxBtn = document.getElementById("termMaxBtn");
  const termClearBtn = document.getElementById("termClearBtn");
  const terminalInput = document.getElementById("terminalInput");
  const terminalOutput = document.getElementById("terminalOutput");

  function openTerminal() {
    if (terminalDrawer) {
      terminalDrawer.classList.add("active");
      if (terminalInput) terminalInput.focus();
      // Show welcome message only on first open
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
  }

  function closeTerminal() {
    if (terminalDrawer) terminalDrawer.classList.remove("active");
  }

  if (floatingTermBtn)
    floatingTermBtn.addEventListener("click", () =>
      terminalDrawer.classList.contains("active")
        ? closeTerminal()
        : openTerminal(),
    );
  if (termCloseBtn) termCloseBtn.addEventListener("click", closeTerminal);
  if (termMinBtn)
    termMinBtn.addEventListener("click", () =>
      terminalDrawer.classList.toggle("minimized"),
    );
  if (termMaxBtn)
    termMaxBtn.addEventListener("click", () =>
      terminalDrawer.classList.toggle("maximized"),
    );
  if (termClearBtn)
    termClearBtn.addEventListener("click", () => {
      if (terminalOutput)
        terminalOutput.innerHTML =
          '<div class="term-line info">Console cleared. Type <span class="term-cmd">help</span> for commands.</div>';
    });

  // Keyboard shortcut to toggle terminal
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      terminalDrawer.classList.contains("active")
        ? closeTerminal()
        : openTerminal();
    }
  });

  // ─── Terminal Input & History ────────────────────────
  const commandHistory = [];
  let historyIndex = -1;

  if (terminalInput) {
    terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const rawInput = terminalInput.value.trim();
        if (!rawInput) return;

        commandHistory.push(rawInput);
        historyIndex = commandHistory.length;
        terminalInput.value = "";

        // Echo the typed command
        appendTermLine(
          `<div class="term-echo">jehan@sys:~$ <span class="cmd-text">${escapeHTML(rawInput)}</span></div>`,
        );

        // Process command (case-insensitive)
        processCLICommand(rawInput.toLowerCase());
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
  }

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

  // ─── Command Dictionary (Clean & Simple) ─────────────
  const commands = {
    help: () => {
      appendTermLine(
        `<div class="term-block">
      <strong>Available Commands:</strong><br>
      • <span class="term-cmd">neofetch</span> &nbsp;— View my system identity & role<br>
      • <span class="term-cmd">about</span> &nbsp;&nbsp;&nbsp;&nbsp;— Learn more about me<br>
      • <span class="term-cmd">skills</span> &nbsp;&nbsp;&nbsp;— View my technical stack<br>
      • <span class="term-cmd">projects</span> &nbsp;— See my featured work<br>
      • <span class="term-cmd">contact</span> &nbsp;&nbsp;— Get my email & socials<br>
      • <span class="term-cmd">theme</span> &nbsp;&nbsp;&nbsp;&nbsp;— Toggle light/dark mode<br>
      • <span class="term-cmd">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;— Clear the screen
    </div>`,
        "info",
      );
    },

    neofetch: () => {
      appendTermLine(
        `<div class="term-block">
      <strong>╭─ SYSTEM IDENTITY ─────────────────╮</strong><br>
      <strong>User:</strong> &nbsp;&nbsp;&nbsp;&nbsp;Abdullah Al Jehan<br>
      <strong>OS:</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AJ-OS v2.0 (Linux Daily Driver)<br>
      <strong>Role:</strong> &nbsp;&nbsp;&nbsp;Embedded Systems & IoT Dev<br>
      <strong>Status:</strong> &nbsp;<span class="highlight-text">🟢 Open to Research & Collabs</span><br>
      <strong>Location:</strong> Dhaka, Bangladesh<br>
      <strong>╰──────────────────────────────────╯</strong>
    </div>`,
        "success",
      );
    },

    about: () => {
      appendTermLine(
        `<div class="term-block">
      <strong>Who am I?</strong><br>
      Hi, I’m Jehan! I'm an ambitious science student with a strong foundation in math and physics, gearing up for an engineering career. I specialize in <span class="highlight-text">Embedded Systems, IoT, and C Programming</span>.<br><br>
      Currently, I'm the Founding Advisor at <strong>Kynatium Labs</strong>, working to make tech education accessible in Bangladesh. My philosophy: <em>"Build, break, and iterate."</em>
    </div>`,
        "output",
      );
    },
    whoami: () => commands.about(), // Alias
    bio: () => commands.about(), // Alias

    skills: () => {
      appendTermLine(
        `<div class="term-block">
      <strong>Technical Stack & Proficiency:</strong><br>
      • <strong>Languages:</strong> C (80%), HTML/CSS (65%), C++ (25%)<br>
      • <strong>Systems:</strong> Linux/Debian (55%), Git/GitHub (65%), Bash (45%)<br>
      • <strong>Embedded:</strong> Arduino (45%), Sensors & Hardware Integration (25%)<br>
      • <strong>Currently Learning:</strong> OOP, Advanced Linux Admin, AI/ML basics
    </div>`,
        "success",
      );
    },

    projects: () => {
      appendTermLine(
        `<div class="term-block">
      <strong>Featured Projects:</strong><br>
      1. <strong>Contact Management System</strong> [C, Binary File I/O, CLI]<br>
      2. <strong>Obstacle Avoiding Robot</strong> [C++, Arduino, Ultrasonic Sensors]<br>
      3. <strong>Personal Portfolio</strong> [HTML5, OKLCH CSS, Vanilla JS]<br><br>
      <em>Tip: Scroll down to the "Projects" section on the main page to see the live GitHub previews!</em>
    </div>`,
        "output",
      );
    },

    contact: () => {
      appendTermLine(
        `<div class="term-block">
      <strong>Let's Connect:</strong><br>
      📧 <strong>Email:</strong> <a href="mailto:abdullahaljehan.me@gmail.com" class="term-cmd">abdullahaljehan.me@gmail.com</a><br>
      💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/abdullah-al-jehan" target="_blank" class="term-cmd">abdullah-al-jehan</a><br>
      💻 <strong>GitHub:</strong> <a href="https://github.com/abdullahaljehan-me" target="_blank" class="term-cmd">abdullahaljehan-me</a><br>
      📍 <strong>Location:</strong> Dhaka, Bangladesh
    </div>`,
        "info",
      );
    },

    theme: () => {
      if (themeToggle) themeToggle.click();
      appendTermLine("🎨 Theme toggled successfully.", "success");
    },

    clear: () => {
      if (terminalOutput) terminalOutput.innerHTML = "";
    },

    // ─── Simple, Friendly Easter Eggs ──────────────────
    sudo: () => {
      appendTermLine(
        "🔒 Nice try! But you don't have root access to my brain. 😉",
        "error",
      );
    },

    coffee: () => {
      appendTermLine(
        "☕ Brewing a fresh cup of coffee... System performance increasing by 200%.",
        "success",
      );
    },

    hello: () => {
      appendTermLine(
        '👋 Hello there! How can I help you today? Type <span class="term-cmd">help</span> to see what I can do.',
        "info",
      );
    },
  };

  // ─── Command Router ──────────────────────────────────
  function processCLICommand(rawCmd) {
    const mainCmd = rawCmd.split(" ")[0];

    if (commands[mainCmd]) {
      commands[mainCmd]();
    } else {
      appendTermLine(
        `❌ Command not found: '${escapeHTML(mainCmd)}'.<br>Type <span class="term-cmd">help</span> to see available options.`,
        "error",
      );
    }
  }

  // ─── Copy Email Click ────────────────────────────────
  const emailLink = document.getElementById("emailLink");
  if (emailLink) {
    emailLink.addEventListener("click", function (e) {
      e.preventDefault();
      const emailText = "abdullahaljehan.me@gmail.com";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText).then(() => {
          showToast("Email address copied to clipboard!", "📧");
        });
      } else {
        window.location.href = "mailto:" + emailText;
      }
    });
  }

  // ─── Contact Form ───────────────────────────────────
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      // Client-side validation
      if (!name || !email || !message) {
        e.preventDefault(); // Stop submission if empty
        showToast("Please fill in all required fields.", "⚠️");
        return;
      }

      // If valid, DO NOT prevent default. Let Formsubmit.co handle the POST request.
      showToast("Sending message...", "🚀");
    });
  }

  handleNavScroll();

  // ─── Expandable Grids (Context-Aware View All / Show Less) ──────────
  const viewAllButtons = document.querySelectorAll(".view-all-btn");
  viewAllButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const grid = document.getElementById(targetId);

      if (grid) {
        grid.classList.toggle("grid-expanded");
        this.classList.toggle("expanded");

        const isExpanded = grid.classList.contains("grid-expanded");

        // Read custom text from HTML data attributes
        const expandText = this.getAttribute("data-expand-text") || "View more";
        const collapseText =
          this.getAttribute("data-collapse-text") || "Show less";

        const newText = isExpanded ? collapseText : expandText;
        const arrow = isExpanded ? "↑" : "↓";

        this.innerHTML = `${newText} <span class="arrow">${arrow}</span>`;
      }
    });
  });

  // ─── Technical Breakdown Modal Logic ─────────────────────
  const breakdownModal = document.getElementById("breakdownModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  // Premium SVG Icons (No emojis, matches website theme)
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

  // Event delegation for buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".breakdown-btn");
    if (!btn || !breakdownModal) return;

    const projectId = btn.getAttribute("data-project");
    const data = projectBreakdowns[projectId];

    if (data) {
      modalTitle.textContent = data.title;
      modalBody.innerHTML = data.content;
      breakdownModal.showModal(); // Native HTML5 dialog method
    } else {
      console.warn(`No breakdown data found for project: ${projectId}`);
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => breakdownModal.close());
  }

  if (breakdownModal) {
    breakdownModal.addEventListener("click", (e) => {
      // Close if clicking the backdrop
      const rect = breakdownModal.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        breakdownModal.close();
      }
    });
  }
})();
