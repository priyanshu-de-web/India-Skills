/* ===== Taiwan Explorer – Main JS ===== */

document.addEventListener("DOMContentLoaded", () => {
  Navigation.init();
  RegionalGuide.init();
  Experiences.init();
  PracticalInfo.init();
  ContactForm.init();
  TTS.init();
  ScrollFade.init();
  document.getElementById("footerYear").textContent = new Date().getFullYear();
});

/* ========== NAVIGATION ========== */
const Navigation = {
  init() {
    const toggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileClose = document.getElementById("mobileClose");

    // Create overlay element
    const overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    document.body.appendChild(overlay);

    const open = () => {
      mobileMenu.classList.add("open");
      mobileMenu.setAttribute("aria-hidden", "false");
      overlay.classList.add("active");
      toggle.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
    };

    const close = () => {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      overlay.classList.remove("active");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      mobileMenu.classList.contains("open") ? close() : open();
    });

    mobileClose.addEventListener("click", close);
    overlay.addEventListener("click", close);

    // Close mobile menu on link click
    document.querySelectorAll(".mobile-menu__link").forEach((link) => {
      link.addEventListener("click", close);
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  },
};

/* ========== REGIONAL GUIDE (Dynamic from DB) ========== */
const RegionalGuide = {
  // Map SVG region IDs to our region keys
  regionMap: {
    north: ["TWTPE", "TWNWT", "TWKEE", "TWTAO", "TWHSQ", "TWHSZ", "TWMIA", "TWILA"],
    central: ["TWTXG", "TWCHA", "TWNAN", "TWYUN"],
    south: ["TWCYQ", "TWCYI", "TWTNN", "TWKHH", "TWPIF", "TWPEN"],
    east: ["TWHUA", "TWTTT"],
  },

  regionColors: {
    north: "#22c55e",
    central: "#06b6d4",
    south: "#f97316",
    east: "#8b5cf6",
  },

  async init() {
    await this.loadMap();
    await this.loadRegions();
  },

  async loadMap() {
    const mapContainer = document.querySelector(".regional-guide__map");
    try {
      const resp = await fetch("/media/images/taiwan-map.svg");
      const svgText = await resp.text();
      mapContainer.innerHTML = svgText;

      // Color the regions
      const svg = mapContainer.querySelector("svg");
      if (svg) {
        // Hide labels and points
        const labels = svg.querySelector("#label_points");
        const points = svg.querySelector("#points");
        if (labels) labels.style.display = "none";
        if (points) points.style.display = "none";

        // Color each region group
        Object.entries(this.regionMap).forEach(([key, ids]) => {
          ids.forEach((id) => {
            const path = svg.querySelector(`#${id}`);
            if (path) {
              path.setAttribute("fill", this.regionColors[key]);
              path.setAttribute("data-region", key);
              path.style.cursor = "pointer";
              path.addEventListener("click", () => this.highlightRegion(key));
              path.addEventListener("mouseenter", () => {
                path.style.opacity = "0.7";
              });
              path.addEventListener("mouseleave", () => {
                path.style.opacity = "1";
              });
            }
          });
        });
      }
    } catch (err) {
      mapContainer.innerHTML = '<p>Map could not be loaded.</p>';
    }
  },

  async loadRegions() {
    const container = document.getElementById("regionCards");
    try {
      const resp = await fetch("/api/regions");
      const json = await resp.json();

      if (json.success && json.data) {
        container.innerHTML = json.data
          .map(
            (region) => `
          <article class="region-card fade-in" data-region="${region.key}" style="--region-color: ${region.color}" tabindex="0" role="button" aria-label="${region.name} region">
            <div class="region-card__header">
              <span class="region-card__dot" aria-hidden="true"></span>
              <h3 class="region-card__name">${region.name}</h3>
            </div>
            <p class="region-card__summary">${region.summary}</p>
            <div class="region-card__attractions">
              ${region.attractions
                .map(
                  (a) => `
                <div class="region-card__attraction">
                  <strong>${a.name}</strong>
                  <span>— ${a.description}</span>
                </div>`
                )
                .join("")}
            </div>
          </article>`
          )
          .join("");

        // Click on card => highlight on map
        container.querySelectorAll(".region-card").forEach((card) => {
          card.addEventListener("click", () => {
            this.highlightRegion(card.dataset.region);
          });
        });

        // Trigger fade-in for new cards
        ScrollFade.observe();
      }
    } catch (err) {
      container.innerHTML = '<p>Could not load regional data.</p>';
    }
  },

  highlightRegion(key) {
    // Highlight card
    document.querySelectorAll(".region-card").forEach((c) => {
      c.classList.toggle("active", c.dataset.region === key);
    });

    // Highlight map paths
    const svg = document.querySelector(".regional-guide__map svg");
    if (!svg) return;
    svg.querySelectorAll("path").forEach((p) => p.classList.remove("region-active"));

    const ids = this.regionMap[key] || [];
    ids.forEach((id) => {
      const el = svg.querySelector(`#${id}`);
      if (el) el.classList.add("region-active");
    });

    // Scroll card into view
    const activeCard = document.querySelector(`.region-card[data-region="${key}"]`);
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  },
};

/* ========== EXPERIENCES TABS + SLIDER ========== */
const Experiences = {
  init() {
    this.initTabs();
    this.initSliders();
  },

  initTabs() {
    const tabs = document.querySelectorAll("#experiences .tab-btn");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.remove("tab-btn--active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("tab-btn--active");
        tab.setAttribute("aria-selected", "true");

        const target = tab.dataset.tab;
        document.querySelectorAll(".experiences__panel").forEach((panel) => {
          const isTarget = panel.id === `${target}-panel`;
          panel.classList.toggle("experiences__panel--hidden", !isTarget);
          panel.hidden = !isTarget;
        });
      });
    });
  },

  initSliders() {
    document.querySelectorAll(".experiences__slider").forEach((slider) => {
      const track = slider.querySelector(".slider__track");
      const prev = slider.querySelector(".slider__btn--prev");
      const next = slider.querySelector(".slider__btn--next");
      const slides = track.querySelectorAll(".slider__slide");
      let current = 0;

      const update = () => {
        track.style.transform = `translateX(-${current * 100}%)`;
      };

      prev.addEventListener("click", () => {
        current = current > 0 ? current - 1 : slides.length - 1;
        update();
      });

      next.addEventListener("click", () => {
        current = current < slides.length - 1 ? current + 1 : 0;
        update();
      });
    });
  },
};

/* ========== PRACTICAL INFO (Dynamic from DB) ========== */
const PracticalInfo = {
  allItems: [],

  async init() {
    await this.loadItems();
    this.initTabs();
  },

  async loadItems() {
    try {
      const resp = await fetch("/api/info-items");
      const json = await resp.json();
      if (json.success) {
        this.allItems = json.data;
        // Default: show transportation (or all on mobile)
        this.render(window.innerWidth < 760 ? null : "transportation");
      }
    } catch {
      document.getElementById("practicalContent").innerHTML =
        "<p>Could not load practical information.</p>";
    }
  },

  render(category) {
    const container = document.getElementById("practicalContent");
    const items = category
      ? this.allItems.filter((i) => i.category === category)
      : this.allItems;

    // Group by category for mobile (show all as accordion)
    const isMobile = window.innerWidth < 760;

    if (isMobile && !category) {
      // Group items by category
      const groups = {};
      this.allItems.forEach((item) => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      });

      let html = "";
      Object.entries(groups).forEach(([cat, catItems]) => {
        html += `<h3 style="text-transform:capitalize;font-weight:700;color:var(--clr-dark);margin:1rem 0 .5rem;font-size:1.1rem;">${cat}</h3>`;
        catItems.forEach((item) => {
          html += this.accordionHTML(item);
        });
      });
      container.innerHTML = html;
    } else {
      container.innerHTML = items.map((item) => this.accordionHTML(item)).join("");
    }

    // Accordion toggle
    container.querySelectorAll(".info-accordion__header").forEach((header) => {
      header.addEventListener("click", () => {
        header.closest(".info-accordion").classList.toggle("open");
      });
    });
  },

  accordionHTML(item) {
    return `
      <details class="info-accordion">
        <summary class="info-accordion__header">
          <svg class="info-accordion__icon" aria-hidden="true"><use href="${item.icon}"/></svg>
          <span class="info-accordion__title">${item.title}</span>
          <span class="info-accordion__arrow" aria-hidden="true">&#9662;</span>
        </summary>
        <div class="info-accordion__body">
          <div class="info-accordion__body-inner">${item.body}</div>
        </div>
      </details>`;
  },

  initTabs() {
    const tabs = document.querySelectorAll(".practical-info__tabs .tab-btn");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.remove("tab-btn--active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("tab-btn--active");
        tab.setAttribute("aria-selected", "true");
        this.render(tab.dataset.category);
      });
    });

    // Re-render on resize for mobile/desktop switch
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      const nowMobile = window.innerWidth < 760;
      const wasMobile = lastWidth < 760;
      if (nowMobile !== wasMobile) {
        const activeTab = document.querySelector(".practical-info__tabs .tab-btn--active");
        this.render(nowMobile ? null : (activeTab ? activeTab.dataset.category : "transportation"));
        lastWidth = window.innerWidth;
      }
    });
  },
};

/* ========== CONTACT FORM ========== */
const ContactForm = {
  init() {
    const form = document.getElementById("contactForm");
    const fields = {
      name: { el: form.querySelector("#name"), error: "nameError", validate: (v) => v.trim().length > 0 },
      email: { el: form.querySelector("#email"), error: "emailError", validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      message: { el: form.querySelector("#message"), error: "messageError", validate: (v) => v.trim().length > 0 },
    };

    // Real-time validation
    Object.values(fields).forEach((field) => {
      field.el.addEventListener("input", () => {
        const valid = field.validate(field.el.value);
        field.el.classList.toggle("invalid", !valid);
        field.el.closest(".form-group").classList.toggle("show-error", !valid);
      });

      field.el.addEventListener("blur", () => {
        const valid = field.validate(field.el.value);
        field.el.classList.toggle("invalid", !valid);
        field.el.closest(".form-group").classList.toggle("show-error", !valid);
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate all required
      let valid = true;
      Object.values(fields).forEach((field) => {
        const isValid = field.validate(field.el.value);
        field.el.classList.toggle("invalid", !isValid);
        field.el.closest(".form-group").classList.toggle("show-error", !isValid);
        if (!isValid) valid = false;
      });

      if (!valid) return;

      const data = {
        name: form.querySelector("#name").value,
        email: form.querySelector("#email").value,
        country: form.querySelector("#country").value,
        interests: form.querySelector("#interests").value,
        message: form.querySelector("#message").value,
      };

      try {
        const resp = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json = await resp.json();

        if (json.success) {
          form.reset();
          document.getElementById("contactSuccess").hidden = false;
          // Remove error states
          Object.values(fields).forEach((f) => {
            f.el.classList.remove("invalid");
            f.el.closest(".form-group").classList.remove("show-error");
          });
          setTimeout(() => {
            document.getElementById("contactSuccess").hidden = true;
          }, 5000);
        } else {
          alert(json.message || "Submission failed. Please try again.");
        }
      } catch {
        alert("Network error. Please try again.");
      }
    });
  },
};

/* ========== TEXT-TO-SPEECH ========== */
const TTS = {
  init() {
    const readBtn = document.getElementById("ttsRead");
    const stopBtn = document.getElementById("ttsStop");
    const warning = document.getElementById("ttsWarning");

    if (!("speechSynthesis" in window)) {
      readBtn.hidden = true;
      warning.hidden = false;
      return;
    }

    const text =
      "Taiwan Tourism Bureau: Phone plus eight eight six dash two dash zero zero zero zero dash zero zero zero zero. Email info at example dot com. Official site at example dot com. For urgent help, dial zero zero zero for police or zero zero zero for emergencies.";

    readBtn.addEventListener("click", () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onend = () => {
        stopBtn.hidden = true;
        readBtn.hidden = false;
      };
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      readBtn.hidden = true;
      stopBtn.hidden = false;
    });

    stopBtn.addEventListener("click", () => {
      speechSynthesis.cancel();
      stopBtn.hidden = true;
      readBtn.hidden = false;
    });
  },
};

/* ========== SCROLL FADE-IN ========== */
const ScrollFade = {
  observer: null,

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    this.observe();
  },

  observe() {
    document.querySelectorAll(".fade-in:not(.visible)").forEach((el) => {
      this.observer.observe(el);
    });
  },
};
