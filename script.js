/* ═══════════════════════════════════════════════════════
   Portfolio JS — Abdullah Al Jehan
   Preloader, Typewriter Subtitle, Upgraded Floating Terminal CLI,
   OKLCH Theme System, Scroll Animations & Toast
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ─── Preloader Screen ────────────────────────────────
  const preloader = document.getElementById("skeletonPreloader");
  function hidePreloader() {
    if (preloader) {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 400);
    }
  }

  if (document.readyState === "complete") {
    hidePreloader();
  } else {
    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 1500);
  }

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

  // ─── Floating Tiny Terminal Button & Upgraded Drawer ──
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
    }
  }

  function closeTerminal() {
    if (terminalDrawer) terminalDrawer.classList.remove("active");
  }

  if (floatingTermBtn) {
    floatingTermBtn.addEventListener("click", () => {
      if (terminalDrawer.classList.contains("active")) {
        closeTerminal();
      } else {
        openTerminal();
      }
    });
  }

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
      if (terminalOutput) {
        terminalOutput.innerHTML =
          '<div class="term-line info">Console cleared. Type <span class="term-cmd">help</span> for commands.</div>';
      }
    });

  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      if (terminalDrawer.classList.contains("active")) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });

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

        appendTermLine(
          `jehan@system:~$ ${escapeHTML(rawInput)}`,
          "prompt-echo",
        );
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
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  }

  function processCLICommand(cmd) {
    const mainCmd = cmd.split(" ")[0];

    switch (mainCmd) {
      case "help":
        appendTermLine(
          `
          System Commands:<br/>
          • <span class="term-cmd">neofetch</span> &nbsp;— Display system identity banner<br/>
          • <span class="term-cmd">whoami</span> &nbsp;&nbsp;&nbsp;— Print current user bio<br/>
          • <span class="term-cmd">skills</span> &nbsp;&nbsp;&nbsp;— View technical stack & level<br/>
          • <span class="term-cmd">education</span> — View academic timeline (HSC/SSC)<br/>
          • <span class="term-cmd">experience</span>— Founding Advisor details<br/>
          • <span class="term-cmd">projects</span> &nbsp;— List selected repositories<br/>
          • <span class="term-cmd">blogs</span> &nbsp;&nbsp;&nbsp;&nbsp;— View LinkedIn articles<br/>
          • <span class="term-cmd">contact</span> &nbsp;&nbsp;— Direct email & location<br/>
          • <span class="term-cmd">github</span> &nbsp;&nbsp;&nbsp;— Open GitHub profile<br/>
          • <span class="term-cmd">theme</span> &nbsp;&nbsp;&nbsp;&nbsp;— Toggle light / dark mode<br/>
          • <span class="term-cmd">clear</span> &nbsp;&nbsp;&nbsp;&nbsp;— Clear screen output
        `,
          "info",
        );
        break;

      case "neofetch":
        appendTermLine(
          `
          <pre style="font-family:var(--font-mono); color:#38bdf8; margin:4px 0;">
   /\   AJ OS v2.0
  /  \  User: Jehan
 / /\ \ Host: Embedded Systems & IoT
/ ____ \ Shell: OKLCH Terminal CLI
          </pre>
          <strong>OS:</strong> Debian/Linux Daily Driver<br/>
          <strong>Location:</strong> Dhaka, Bangladesh<br/>
          <strong>Role:</strong> Founding Advisor @ Kynatium Labs
        `,
          "success",
        );
        break;

      case "whoami":
      case "bio":
        appendTermLine(
          `
          "Hi, I’m Jehan! Ambitious science student gearing up for engineering. Deep dive into Embedded systems, IoT, C programming, and Linux."
        `,
          "output",
        );
        break;

      case "skills":
        appendTermLine(
          `
          • Web: HTML5/CSS3 (80%)<br/>
          • Core Languages: C (65%), C++ (45%)<br/>
          • Systems: Git/GitHub (75%), Linux (70%), Bash (60%)<br/>
          • Embedded: Arduino (55%), Sensors (50%), Hardware-Software Integration (45%)
        `,
          "success",
        );
        break;

      case "education":
        appendTermLine(
          `
          1. <strong>HSC (Government Science College)</strong> — Science Stream · GPA 5.00/5.00 [2023-2025]<br/>
          2. <strong>SSC (Dr. Iajuddin Ahmed RMSC)</strong> — Science Stream · GPA 5.00/5.00 [2018-2023]
        `,
          "output",
        );
        break;

      case "experience":
        appendTermLine(
          `
          <strong>Founding Advisor @ Kynatium Labs</strong> [Jan 2026 — Present]<br/>
          Advising on tech outreach, embedded fundamentals education, and roadmap strategy.
        `,
          "output",
        );
        break;

      case "projects":
        appendTermLine(
          `
          1. <strong>Contact Management System</strong> [C, Binary Files]<br/>
          2. <strong>Obstacle Avoiding Robot</strong> [C++, Ultrasonic, Motors]<br/>
          3. <strong>Personal Portfolio Site</strong> [HTML5, OKLCH CSS, JS]
        `,
          "output",
        );
        break;

      case "blogs":
        appendTermLine(
          `
          1. <em>Engineering Aspirations & Embedded Learning Insights</em> (LinkedIn)<br/>
          2. <em>Hands-On Tech Education & Kynatium Labs Outreach</em> (LinkedIn)
        `,
          "info",
        );
        break;

      case "contact":
        appendTermLine(
          `
          Email: <a href="mailto:abdullahaljehan.me@gmail.com" class="term-cmd">abdullahaljehan.me@gmail.com</a><br/>
          LinkedIn: <a href="https://www.linkedin.com/in/abdullah-al-jehan" target="_blank">linkedin.com/in/abdullah-al-jehan</a><br/>
          Location: Dhaka, Bangladesh
        `,
          "info",
        );
        break;

      case "github":
        appendTermLine("Opening github.com/abdullahaljehan-me...", "success");
        window.open("https://github.com/abdullahaljehan-me", "_blank");
        break;

      case "theme":
        if (themeToggle) themeToggle.click();
        appendTermLine("Theme toggled.", "success");
        break;

      case "clear":
        terminalOutput.innerHTML = "";
        break;

      case "date":
        appendTermLine(new Date().toString(), "info");
        break;

      default:
        appendTermLine(
          `Command not found: '${escapeHTML(cmd)}'. Type <span class="term-cmd">help</span> or <span class="term-cmd">neofetch</span>.`,
          "error",
        );
        break;
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

      if (!name || !email || !message) {
        e.preventDefault();
        showToast("Please fill in all required fields.", "⚠️");
        return;
      }
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
})();
