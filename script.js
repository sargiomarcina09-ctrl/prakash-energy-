const phone = "918318643370";
const defaultMessage = "Hello Prakash Energy, I want a free solar site survey / quotation.";
const GOOGLE_SHEETS_WEB_APP_URL = window.PRAKASH_CONFIG?.googleSheetsWebAppUrl || "";

const formatINR = (value) =>
  `Rs. ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value)}`;

const compactINR = (value) => {
  if (value >= 10000000) return `Rs. ${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `Rs. ${(value / 100000).toFixed(1)}L`;
  return formatINR(value);
};

const whatsappUrl = (message = defaultMessage) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

const hideLoader = () => document.querySelector(".loader")?.classList.add("loaded");
window.addEventListener("DOMContentLoaded", () => setTimeout(hideLoader, 500));
window.addEventListener("load", hideLoader);
setTimeout(hideLoader, 1800);

const header = document.querySelector(".site-header");
const setHeaderState = () => header?.classList.toggle("scrolled", window.scrollY > 24);
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const heroSlides = [...document.querySelectorAll(".hero-slide")];
let activeHeroSlide = 0;

function showHeroSlide(index) {
  activeHeroSlide = index;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
  });
}

if (heroSlides.length > 1) {
  setInterval(() => showHeroSlide((activeHeroSlide + 1) % heroSlides.length), 5200);
}

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.setAttribute("href", whatsappUrl());
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noreferrer");
});

const navToggle = document.querySelector(".nav-toggle");
navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 55}ms`);
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const duration = 1300;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN");
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll("[data-count]").forEach((counter) => countObserver.observe(counter));

const billInput = document.querySelector("#bill");
const billRange = document.querySelector("#billRange");
const solarSize = document.querySelector("#solarSize");
const annualSavings = document.querySelector("#annualSavings");
const payback = document.querySelector("#payback");
const lifetimeSavings = document.querySelector("#lifetimeSavings");

function updateCalculator(value) {
  const bill = Math.max(Number(value) || 0, 500);
  const size = Math.max(1, bill / 900);
  const annual = bill * 12 * 0.85;
  const systemCost = size * 60000;
  const years = Math.max(3.2, Math.min(8.5, systemCost / annual));
  const lifetime = annual * 25;

  solarSize.textContent = `${size.toFixed(1)} kW`;
  annualSavings.textContent = compactINR(annual);
  payback.textContent = `${years.toFixed(1)} yrs`;
  lifetimeSavings.textContent = compactINR(lifetime);
}

billInput?.addEventListener("input", (event) => {
  const value = event.target.value;
  if (billRange) billRange.value = Math.min(Number(value) || 0, Number(billRange.max));
  updateCalculator(value);
});

billRange?.addEventListener("input", (event) => {
  const value = event.target.value;
  if (billInput) billInput.value = value;
  updateCalculator(value);
});

updateCalculator(billInput?.value || 7500);

const slides = [...document.querySelectorAll(".slide")];
const slideButtons = [...document.querySelectorAll("[data-slide]")];
let activeSlide = 0;

function showSlide(index) {
  activeSlide = index;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  slideButtons.forEach((button, i) => button.classList.toggle("active", i === index));
}

slideButtons.forEach((button) => {
  button.addEventListener("click", () => showSlide(Number(button.dataset.slide)));
});

if (slides.length) {
  setInterval(() => showSlide((activeSlide + 1) % slides.length), 5200);
}

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("p");

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    if (!lightbox || !lightboxImage || !image || !lightboxCaption) return;
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = item.dataset.title || image.alt;
    lightbox.hidden = false;
  });
});

function closeLightbox() {
  if (lightbox) lightbox.hidden = true;
}

lightbox?.querySelector("button")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

const heroVisuals = heroSlides;
const hero = document.querySelector("[data-parallax]");

window.addEventListener(
  "scroll",
  () => {
    if (!heroVisuals.length || !hero) return;
    const offset = Math.min(window.scrollY * 0.08, 46);
    heroVisuals.forEach((visual) => {
      visual.style.setProperty("--hero-offset", `${offset}px`);
    });
  },
  { passive: true }
);

hero?.addEventListener("pointermove", (event) => {
  const rect = hero.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  hero.style.setProperty("--mx", `${x * 20}px`);
  hero.style.setProperty("--my", `${y * 20}px`);
});

async function sendLeadToGoogleSheets(payload) {
  if (!GOOGLE_SHEETS_WEB_APP_URL) return false;

  const body = new URLSearchParams(payload);
  await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
    method: "POST",
    mode: "no-cors",
    body,
  });
  return true;
}

function buildLeadMessage(payload) {
  const parts = [];

  if (payload.message) parts.push(payload.message);
  if (payload.address) parts.push(`Address: ${payload.address}`);
  if (payload.bill) parts.push(`Monthly bill: Rs. ${payload.bill}`);
  if (payload.estimatedSolarSize) parts.push(`Estimated solar size: ${payload.estimatedSolarSize}`);
  if (payload.estimatedAnnualSavings) parts.push(`Estimated annual savings: ${payload.estimatedAnnualSavings}`);
  if (payload.estimatedPayback) parts.push(`Estimated payback: ${payload.estimatedPayback}`);
  if (payload.estimatedLifetimeSavings) parts.push(`Estimated lifetime savings: ${payload.estimatedLifetimeSavings}`);

  return parts.join("\n");
}

document.querySelector("#leadForm")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = {
    action: "saveLead",
    timestamp: new Date().toISOString(),
    source: "Prakash Energy website",
    page: window.location.href,
    name: form.get("name") || "",
    phone: form.get("phone") || "",
    email: form.get("email") || "",
    address: form.get("address") || "",
    bill: form.get("bill") || "",
    message: form.get("message") || "",
    estimatedSolarSize: solarSize?.textContent || "",
    estimatedAnnualSavings: annualSavings?.textContent || "",
    estimatedPayback: payback?.textContent || "",
    estimatedLifetimeSavings: lifetimeSavings?.textContent || "",
  };
  payload.message = buildLeadMessage(payload);
  const details = [
    "Hello Prakash Energy, I want a free solar site survey / quotation.",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    payload.message ? `Details:\n${payload.message}` : "",
  ].filter(Boolean).join("\n");

  const status = document.querySelector("#formStatus");
  if (status) status.textContent = "Saving your inquiry and opening WhatsApp...";
  try {
    const saved = await sendLeadToGoogleSheets(payload);
    if (status && saved) status.textContent = "Inquiry saved. Opening WhatsApp...";
    if (status && !saved) status.textContent = "Opening WhatsApp with your inquiry...";
  } catch (error) {
    if (status) status.textContent = "WhatsApp is opening. We could not save to Sheets right now.";
  }
  window.open(whatsappUrl(details), "_blank", "noreferrer");
});
