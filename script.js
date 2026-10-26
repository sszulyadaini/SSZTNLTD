const siteConfig = window.SSZulyadainiConfig;

if (siteConfig) {
  document.querySelectorAll("[data-config-contact]").forEach((element) => {
    const key = element.dataset.configContact;
    const value = key ? siteConfig.contact[key] : "";
    if (!value) return;
    element.hidden = false;
    const output = element.querySelector("[data-config-value]");
    if (output) output.textContent = value;
  });
  let hasConfiguredSocial = false;
  document.querySelectorAll("[data-config-social]").forEach((element) => {
    const key = element.dataset.configSocial;
    const value = key ? siteConfig.social[key] : "";
    if (!value) return;
    let url;
    try {
      url = new URL(value);
    } catch (error) {
      console.error(`Invalid ${key} URL in company-config.js.`, error);
      return;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      console.error(`Invalid ${key} URL protocol in company-config.js.`);
      return;
    }
    element.hidden = false;
    hasConfiguredSocial = true;
    const output = element.querySelector("[data-config-value]");
    if (output instanceof HTMLAnchorElement) {
      output.href = url.href;
      output.target = "_blank";
      output.rel = "noopener noreferrer";
      output.textContent = url.hostname;
    }
  });
  const unavailableContact = document.querySelector("[data-config-unavailable]");
  const hasConfiguredContact = ["email", "phone", "whatsapp", "registeredAddress"]
    .some((key) => Boolean(siteConfig.contact[key]));
  if (unavailableContact && (hasConfiguredContact || hasConfiguredSocial)) {
    unavailableContact.hidden = true;
  }
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-nav");

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const themeButton = document.querySelector(".theme-toggle");

if (themeButton) {
  const root = document.documentElement;
  const updateThemeButton = () => {
    const darkMode = root.dataset.theme === "dark";
    themeButton.setAttribute("aria-pressed", String(darkMode));
    themeButton.setAttribute("aria-label", darkMode ? "Switch to light theme" : "Switch to dark theme");
    themeButton.textContent = darkMode ? "Light theme" : "Dark theme";
  };

  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    updateThemeButton();
  });

  updateThemeButton();
}

const heroCarousel = document.querySelector("[data-hero-carousel]");

if (heroCarousel) {
  const slides = Array.from(heroCarousel.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(heroCarousel.querySelectorAll("[data-hero-dot]"));
  const previousButton = heroCarousel.querySelector("[data-hero-prev]");
  const nextButton = heroCarousel.querySelector("[data-hero-next]");
  const pauseButton = heroCarousel.querySelector("[data-hero-pause]");
  const currentSlide = heroCarousel.querySelector("[data-hero-current]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const interval = 7000;
  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let timer;
  let manuallyPaused = reducedMotion.matches;
  let pointerInside = false;
  let focusInside = false;

  const updatePauseButton = () => {
    if (!pauseButton) return;
    pauseButton.disabled = reducedMotion.matches;
    pauseButton.setAttribute("aria-pressed", String(manuallyPaused || reducedMotion.matches));
    pauseButton.setAttribute(
      "aria-label",
      reducedMotion.matches || manuallyPaused ? "Automatic slide changes are paused" : "Pause automatic slide changes",
    );
    pauseButton.textContent = reducedMotion.matches || manuallyPaused ? "Paused" : "Pause";
  };

  const stopTimer = () => {
    window.clearTimeout(timer);
    timer = undefined;
  };

  const scheduleNext = () => {
    stopTimer();
    if (document.hidden || pointerInside || focusInside || manuallyPaused || reducedMotion.matches) return;
    timer = window.setTimeout(() => {
      showSlide(activeIndex + 1, false);
    }, interval);
  };

  const showSlide = (requestedIndex, interacted) => {
    activeIndex = (requestedIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.inert = !active;
    });
    dots.forEach((dot, index) => {
      const active = index === activeIndex;
      dot.classList.toggle("is-active", active);
      if (active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (currentSlide) currentSlide.textContent = String(activeIndex + 1).padStart(2, "0");
    if (interacted) {
      manuallyPaused = true;
      updatePauseButton();
    }
    scheduleNext();
  };

  previousButton?.addEventListener("click", () => showSlide(activeIndex - 1, true));
  nextButton?.addEventListener("click", () => showSlide(activeIndex + 1, true));
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index, true));
  });

  pauseButton?.addEventListener("click", () => {
    manuallyPaused = !manuallyPaused;
    updatePauseButton();
    scheduleNext();
  });

  heroCarousel.addEventListener("pointerenter", () => {
    pointerInside = true;
    stopTimer();
  });
  heroCarousel.addEventListener("pointerleave", () => {
    pointerInside = false;
    scheduleNext();
  });
  heroCarousel.addEventListener("focusin", () => {
    focusInside = true;
    stopTimer();
  });
  heroCarousel.addEventListener("focusout", (event) => {
    if (!heroCarousel.contains(event.relatedTarget)) {
      focusInside = false;
      scheduleNext();
    }
  });
  heroCarousel.addEventListener("touchstart", () => {
    manuallyPaused = true;
    updatePauseButton();
    stopTimer();
  }, { passive: true });
  heroCarousel.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest("a, button")) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showSlide(activeIndex - 1, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showSlide(activeIndex + 1, true);
    }
  });
  document.addEventListener("visibilitychange", scheduleNext);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) manuallyPaused = true;
    updatePauseButton();
    scheduleNext();
  });

  updatePauseButton();
  showSlide(activeIndex < 0 ? 0 : activeIndex, false);
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const filterButtons = document.querySelectorAll("[data-filter]");
const portfolioCards = document.querySelectorAll(".portfolio-card[data-category]");
const emptyFilter = document.querySelector(".empty-filter");

if (filterButtons.length && portfolioCards.length) {
  const applyFilter = (filter) => {
    let visibleCount = 0;
    portfolioCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (emptyFilter) emptyFilter.hidden = visibleCount > 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
  });

  document.querySelector("[data-reset-filter]")?.addEventListener("click", () => applyFilter("all"));
}

const enquiryForms = document.querySelectorAll("#contact-form, #request-form, #feedback-form");

enquiryForms.forEach((contactForm) => {
  if (!(contactForm instanceof HTMLFormElement)) return;
  const status = contactForm.querySelector("#form-status");
  const formStatus = status || contactForm.querySelector("#feedback-status");
  const interest = contactForm.querySelector('[name="interest"]');
  const subject = new URLSearchParams(window.location.search).get("interest");
  const interestOptions = {
    "HALAL EXCHANGER": "HALAL EXCHANGER discussion",
    strategy: "Digital strategy",
    "digital-consulting": "Digital Consulting",
    "it-support": "IT Support",
    "web-development": "Web development",
    "web3": "Web3 and blockchain",
    mobile: "Web and mobile technology",
    cloud: "Cloud and systems",
    ai: "AI and data intelligence",
    cybersecurity: "Cybersecurity",
    web3: "Web3 and blockchain",
    marketing: "Digital marketing",
    ecommerce: "International e-commerce",
    commerce: "International e-commerce",
    data: "AI and data intelligence",
    systems: "Cloud and systems",
    product: "Web and mobile technology",
  };

  if (interest instanceof HTMLSelectElement && subject) {
    const candidates = [interestOptions[subject], subject].filter(Boolean);
    const options = Array.from(interest.options);
    const selected = candidates
      .map((candidate) => options.find((option) => option.value.toLowerCase() === candidate.toLowerCase()))
      .find(Boolean) || candidates
      .map((candidate) => options.find((option) => option.value.toLowerCase().includes(candidate.toLowerCase())))
      .find(Boolean);
    if (selected) interest.value = selected.value;
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const values = new FormData(contactForm);
    const name = String(values.get("name") || "").trim();
    const email = String(values.get("email") || "").trim();
    const company = String(values.get("company") || "").trim();
    const phone = String(values.get("phone") || "").trim();
    const country = String(values.get("country") || "").trim();
    const topic = String(values.get("interest") || "").trim();
    const rating = String(values.get("rating") || "").trim();
    const message = String(values.get("message") || values.get("project-details") || "").trim();
    const timeframe = String(values.get("timeframe") || "").trim();
    const budget = String(values.get("budget") || "").trim();
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "Not provided"}`,
      `Phone / WhatsApp: ${phone || "Not provided"}`,
      `Country: ${country || "Not provided"}`,
      `Topic: ${topic}`,
      ...(rating ? [`Rating: ${rating}`] : []),
      ...(timeframe ? [`Preferred timeframe: ${timeframe}`] : []),
      ...(budget ? [`Budget range: ${budget}`] : []),
      "",
      message,
    ].join("\n");
    const enquiryRecipient = siteConfig?.contact.email.trim() || "";
    const enquiryType = contactForm.id === "request-form"
      ? "Service request"
      : contactForm.id === "feedback-form"
        ? "Website feedback"
        : "Website enquiry";
    if (enquiryRecipient && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryRecipient)) {
      if (formStatus) {
        formStatus.classList.add("error");
        formStatus.textContent = "The configured business email address is invalid. Please correct it in company-config.js.";
      }
      return;
    }
    const mailto = `mailto:${enquiryRecipient}?subject=${encodeURIComponent(`${enquiryType}: ${topic}`)}&body=${encodeURIComponent(body)}`;

    if (formStatus) {
      formStatus.classList.remove("error");
      formStatus.textContent = enquiryRecipient
        ? "Your email draft is ready. Review and send it from your email application."
        : "Your email draft is ready. Add the official business email in To, then review and send it.";
    }
    window.location.href = mailto;
  });
});
