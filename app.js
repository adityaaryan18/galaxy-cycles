/* =====================================================================
   Galaxy Bicycles — interactions
   ===================================================================== */
(() => {
  "use strict";
  const D = window.GALAXY;
  const B = D.business;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const IMG = "assets/img/";

  const waLink = (text) => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(text)}`;
  const enquiry = (p) => `Hi Galaxy Bicycles! I'm interested in the ${fullName(p)} (${p.colour}). Could you share today's best price and availability?`;
  const fullName = (p) => (p.name.startsWith(p.brand) ? p.name : `${p.brand} ${p.name}`);
  const brandLine = (p) => (p.name.startsWith(p.brand) ? `${catLabel(p.category)} bike` : p.brand);
  const catLabel = (id) => (D.categories.find((c) => c.id === id) || {}).label || id;

  /* ---------- Business details ---------- */
  $$("[data-tel]").forEach((a) => (a.href = `tel:${B.phone}`));
  $$("[data-phone]").forEach((el) => (el.textContent = B.phoneDisplay));
  $$("[data-review-count]").forEach((el) => (el.textContent = B.reviewCount));
  $$("[data-wa]").forEach((a) => (a.href = waLink("Hi Galaxy Bicycles! I'd like to know more about your bikes.")));
  $("#dirLink").href = B.mapsUrl;
  $("#reviewsLink").href = B.mapsUrl;
  $("#gst").textContent = B.gst;
  $("#year").textContent = new Date().getFullYear();
  if (B.address) $("#addr").textContent = B.address;
  if (B.hours) { $("#hours").textContent = B.hours; $("#hoursRow").hidden = false; }

  /* ---------- Header: solid on scroll, hide on scroll-down, active link ---------- */
  const nav = $("#nav");
  const dock = $("#dock");
  const hero = $("#hero");
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 20);
    const pastHero = y > hero.offsetHeight * 0.7;
    nav.classList.toggle("is-hidden", pastHero && y > lastY + 4 && !nav.classList.contains("is-open"));
    if (y < lastY - 4 || !pastHero) nav.classList.remove("is-hidden");
    dock.classList.toggle("is-shown", pastHero);
    if (!reduce && y < innerHeight * 1.2) hero.style.setProperty("--py", `${y * 0.25}px`);
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger");
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  $$("#navLinks a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  const links = $$("#navLinks a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.hash === `#${en.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["bikes", "fit", "services", "reviews", "visit"].forEach((id) => spy.observe(document.getElementById(id)));

  /* ---------- Hero stage: featured bikes ---------- */
  const featured = D.products.filter((p) => p.cut);
  const stage = $("#stage");
  const stageBikes = $("#stageBikes");
  const tabs = $("#stageTabs");
  const AUTOPLAY = 5000;
  stage.style.setProperty("--autoplay", `${AUTOPLAY}ms`);

  featured.forEach((p, i) => {
    const img = new Image();
    img.className = "stage__bike" + (i === 0 ? " is-active" : "");
    img.src = `${IMG}${p.cut}-sm.webp`;
    img.srcset = `${IMG}${p.cut}-sm.webp 620w, ${IMG}${p.cut}-lg.webp 1100w`;
    img.sizes = "(min-width: 960px) 52vw, 100vw";
    img.alt = `${p.brand} ${p.name} in ${p.colour}`;
    img.decoding = "async";
    if (i > 0) img.loading = "lazy";
    img.width = 1100; img.height = 680;
    stageBikes.appendChild(img);

    const t = document.createElement("button");
    t.className = "stage__tab";
    t.type = "button";
    t.setAttribute("role", "tab");
    t.setAttribute("aria-selected", i === 0 ? "true" : "false");
    t.setAttribute("aria-label", `${p.brand} ${p.name}`);
    t.innerHTML = `<img src="${IMG}${p.cut}-sm.webp" alt="" width="62" height="38" loading="lazy">`;
    t.addEventListener("click", () => { show(i); restart(); });
    tabs.appendChild(t);
  });

  let current = 0, timer = null;
  const bikes = $$(".stage__bike", stageBikes);
  const tabBtns = $$(".stage__tab", tabs);
  const setMeta = (p) => { $("#stageBrand").textContent = brandLine(p); $("#stageName").textContent = p.name; };
  setMeta(featured[0]);

  function show(i) {
    if (i === current) return;
    const prev = bikes[current];
    prev.classList.remove("is-active");
    prev.classList.add("is-leaving");
    setTimeout(() => prev.classList.remove("is-leaving"), 900);
    bikes[i].classList.add("is-active");
    tabBtns.forEach((b, k) => b.setAttribute("aria-selected", k === i ? "true" : "false"));
    current = i;
    setMeta(featured[i]);
  }
  const next = (dir = 1) => show((current + dir + featured.length) % featured.length);
  function restart() {
    clearInterval(timer);
    if (reduce) return;
    // re-trigger the progress bar on the selected tab
    tabBtns.forEach((b) => { b.style.animation = "none"; void b.offsetWidth; b.style.animation = ""; });
    timer = setInterval(() => !stage.classList.contains("is-paused") && next(), AUTOPLAY);
  }
  restart();
  stage.addEventListener("mouseenter", () => stage.classList.add("is-paused"));
  stage.addEventListener("mouseleave", () => { stage.classList.remove("is-paused"); stageBikes.style.setProperty("--ry", "0deg"); stageBikes.style.setProperty("--rx", "0deg"); });
  stage.addEventListener("focusin", () => stage.classList.add("is-paused"));
  stage.addEventListener("focusout", () => stage.classList.remove("is-paused"));
  document.addEventListener("visibilitychange", () => stage.classList.toggle("is-paused", document.hidden));
  tabs.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    next(e.key === "ArrowRight" ? 1 : -1); tabBtns[current].focus(); restart();
  });

  // subtle 3D tilt toward the pointer
  if (finePointer && !reduce) {
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      stageBikes.style.setProperty("--ry", `${x * 14}deg`);
      stageBikes.style.setProperty("--rx", `${-y * 8}deg`);
    });
  }
  // swipe on touch
  let sx = null;
  stage.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { next(dx < 0 ? 1 : -1); restart(); }
    sx = null;
  });
  // click the bike to open its details
  stageBikes.addEventListener("click", () => openQV(featured[current]));
  stageBikes.style.cursor = "pointer";

  /* ---------- Brands marquee ---------- */
  const mq = $("#marquee");
  const row = D.brands.map((b) => `<span class="marquee__item">${b}</span>`).join("");
  mq.innerHTML = row + row.replace(/class="marquee__item"/g, 'class="marquee__item" aria-hidden="true"');

  /* ---------- Product grid + filters ---------- */
  const grid = $("#grid");
  const filters = $("#filters");
  const pill = $(".filters__pill", filters);

  D.categories.forEach((c, i) => {
    const n = c.id === "all" ? D.products.length : D.products.filter((p) => p.category === c.id).length;
    const b = document.createElement("button");
    b.className = "filter";
    b.type = "button";
    b.dataset.cat = c.id;
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", i === 0 ? "true" : "false");
    b.innerHTML = `${c.label} <span class="filter__n">${n}</span>`;
    b.addEventListener("click", () => applyFilter(c.id));
    filters.appendChild(b);
  });

  const specChips = (p) => {
    const chips = [p.wheel && `${p.wheel} wheels`, p.age, p.features[0]].filter(Boolean);
    return chips.map((c) => `<span class="chip">${c}</span>`).join("");
  };

  D.products.forEach((p) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "card";
    card.dataset.cat = p.category;
    card.setAttribute("aria-label", `${p.brand} ${p.name}: view details`);
    card.innerHTML = `
      <div class="card__media">
        <span class="card__tag card__tag--${p.category}">${catLabel(p.category)}</span>
        <img src="${IMG}${p.img}-sm.webp" srcset="${IMG}${p.img}-sm.webp 520w, ${IMG}${p.img}-lg.webp 1000w"
             sizes="(min-width: 960px) 30vw, (min-width: 640px) 45vw, 92vw" width="520" height="390"
             alt="${p.brand} ${p.name}, ${p.colour}" loading="lazy" decoding="async">
      </div>
      <div class="card__body">
        <div class="card__top">
          <div><span class="card__brand">${brandLine(p)}</span><h3 class="card__name">${p.name}</h3></div>
          <span class="swatches" title="${p.colour}">${p.swatch.map((c) => `<i style="background:${c}"></i>`).join("")}</span>
        </div>
        <div class="card__specs">${specChips(p)}</div>
        <div class="card__foot">
          <span class="card__price">Price on request<b>Get today's best price</b></span>
          <span class="card__go" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span>
        </div>
      </div>`;
    card.addEventListener("click", () => openQV(p));
    if (finePointer && !reduce) {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--ty", `${((e.clientX - r.left) / r.width - 0.5) * 6}deg`);
        card.style.setProperty("--tx", `${-((e.clientY - r.top) / r.height - 0.5) * 6}deg`);
      });
      card.addEventListener("pointerleave", () => { card.style.setProperty("--tx", "0deg"); card.style.setProperty("--ty", "0deg"); });
    }
    grid.appendChild(card);
  });

  function movePill() {
    const active = $(".filter[aria-selected='true']", filters);
    if (!active) return;
    pill.style.width = `${active.offsetWidth}px`;
    pill.style.transform = `translateX(${active.offsetLeft}px)`;
  }
  function applyFilter(cat) {
    $$(".filter", filters).forEach((b) => b.setAttribute("aria-selected", b.dataset.cat === cat ? "true" : "false"));
    movePill();
    const run = () => {
      let k = 0;
      $$(".card", grid).forEach((c) => {
        const show = cat === "all" || c.dataset.cat === cat;
        c.classList.toggle("is-hidden", !show);
        c.classList.remove("is-entering");
        if (show && !reduce) { void c.offsetWidth; c.style.setProperty("--d", `${k++ * 70}ms`); c.classList.add("is-entering"); }
      });
    };
    run();
  }
  movePill();
  addEventListener("resize", movePill);
  document.fonts && document.fonts.ready.then(movePill);

  /* ---------- Quick view dialog ---------- */
  const qv = $("#qv");
  function openQV(p) {
    $("#qvImg").src = `${IMG}${p.img}-lg.webp`;
    $("#qvImg").alt = `${p.brand} ${p.name}, ${p.colour}`;
    $("#qvBrand").textContent = p.name.startsWith(p.brand) ? `${catLabel(p.category)} bike` : `${p.brand} · ${catLabel(p.category)}`;
    $("#qvTitle").textContent = p.name;
    $("#qvBlurb").textContent = p.blurb;
    const specs = [["Colour", p.colour], ["Wheel", p.wheel], p.age && ["Age", p.age], ["Price", "On request"]].filter(Boolean);
    $("#qvSpecs").innerHTML = specs.map(([k, v]) => `<div class="qv__spec"><span>${k}</span><b>${v}</b></div>`).join("");
    $("#qvFeatures").innerHTML = p.features.map((f) => `<li><svg aria-hidden="true"><use href="#i-check"/></svg>${f}</li>`).join("");
    $("#qvWa").href = waLink(enquiry(p));
    const img = $("#qvImg"); img.style.animation = "none"; void img.offsetWidth; img.style.animation = "";
    qv.classList.remove("is-closing");
    if (typeof qv.showModal === "function") qv.showModal(); else qv.setAttribute("open", "");
  }
  function closeQV() {
    if (!qv.open) return;
    if (reduce) return qv.close();
    qv.classList.add("is-closing");
    qv.addEventListener("animationend", () => { qv.classList.remove("is-closing"); qv.close(); }, { once: true });
  }
  $("#qvClose").addEventListener("click", closeQV);
  qv.addEventListener("click", (e) => e.target === qv && closeQV());
  qv.addEventListener("cancel", (e) => { e.preventDefault(); closeQV(); });

  /* ---------- Size finder ---------- */
  const SIZES = [
    { max: 100, wheel: 12, label: "12″", frame: "Kids", who: "2–4 yrs" },
    { max: 110, wheel: 14, label: "14″", frame: "Kids", who: "3–5 yrs" },
    { max: 122, wheel: 16, label: "16″", frame: "Kids", who: "4–7 yrs" },
    { max: 137, wheel: 20, label: "20″", frame: "Kids", who: "6–9 yrs" },
    { max: 150, wheel: 24, label: "24″", frame: "XS · 13″", who: "Teen" },
    { max: 163, wheel: 26, label: "26–27.5″", frame: "S · 15″", who: "Adult" },
    { max: 175, wheel: 27.5, label: "27.5″", frame: "M · 17″", who: "Adult" },
    { max: 186, wheel: 29, label: "27.5–29″", frame: "L · 19″", who: "Adult" },
    { max: 999, wheel: 29, label: "29″", frame: "XL · 21″", who: "Adult" }
  ];
  const range = $("#height");
  const out = $("#heightOut");
  const fitWheel = $("#fitWheel"), fitFrame = $("#fitFrame"), fitWho = $("#fitWho"), fitSuggest = $("#fitSuggest");
  let lastBand = null;

  function drawBike(size, h) {
    const G = 262, IN = 4.4;                          // ground line, px per inch
    const R = size.wheel * IN / 2;
    const wb = R * 3.3;
    const xr = (380 - (2 * R + wb)) / 2 + R, xf = xr + wb, ya = G - R;
    const frameIn = size.frame.includes("″") ? parseFloat(size.frame.split("·")[1]) : size.wheel * 0.55;
    const L = frameIn * IN;
    const BB = [xr + wb * 0.42, ya + R * 0.12];
    const S = [BB[0] - L * 0.29, BB[1] - L * 0.956];
    const S2 = [BB[0] - L * 0.85 * 0.29, BB[1] - L * 0.85 * 0.956];
    const HB = [xf - R * 0.342, ya - R * 0.94];
    const HT = [HB[0] - R * 0.34 * 0.342, HB[1] - R * 0.34 * 0.94];
    const saddleH = h * 0.688;                         // saddle height above BB (cm → px)
    const post = Math.max(10, Math.min(saddleH - L, L * 0.9 + 30));
    const P = [S[0] - post * 0.29, S[1] - post * 0.956];
    const stemTop = [HT[0] - 6, HT[1] - R * 0.28];
    const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    $("#fitFramePath").setAttribute("d", `M${xr} ${ya} L${f(BB)} L${f(S)} M${xr} ${ya} L${f(S2)} L${f(HT)} L${f(HB)} L${f(BB)}`);
    $("#fitParts").setAttribute("d", `M${xf} ${ya} L${f(HB)} M${f(S)} L${f(P)} M${P[0] - 16} ${P[1] - 2} L${P[0] + 14} ${P[1] - 2} M${f(HT)} L${f(stemTop)} L${stemTop[0] + 18} ${stemTop[1] - 2}`);
    const wheel = (el, x) => {
      el.setAttribute("transform", `translate(${x} ${ya}) scale(${(R / 60).toFixed(3)})`);
    };
    wheel($("#wheelBack"), xr);
    wheel($("#wheelFront"), xf);
    const top = G - h * 0.95;
    $("#rulerLine").setAttribute("y2", top);
    $("#rulerText").setAttribute("y", top - 8);
    $("#rulerText").textContent = `${h} cm`;
  }

  function updateFit() {
    const h = +range.value;
    const pct = ((h - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty("--p", `${pct}%`);
    out.textContent = `${h} cm`;
    const size = SIZES.find((s) => h <= s.max);
    if (size !== lastBand) {
      fitWheel.textContent = size.label;
      fitFrame.textContent = size.frame;
      fitWho.textContent = size.who;
      if (lastBand && !reduce) [fitWheel, fitFrame, fitWho].forEach((el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
      const kids = size.wheel <= 20;
      let picks = kids
        ? D.products.filter((p) => p.category === "kids" && parseFloat(p.wheel) === size.wheel)
        : D.products.filter((p) => p.category !== "kids");
      if (kids && !picks.length) picks = D.products.filter((p) => p.category === "kids");
      if (size.wheel === 24) picks = [];
      fitSuggest.innerHTML = picks.length
        ? `Try: ${picks.map((p) => `<a href="#bikes" data-open="${p.id}">${fullName(p)}</a>`).join(", ")}. Or drop in and we'll fit you properly.`
        : `Ask us about 24″ teen bikes. We'll help you pick the right one in store.`;
      lastBand = size;
    }
    drawBike(size, h);
  }
  range.addEventListener("input", updateFit);
  updateFit();
  fitSuggest.addEventListener("click", (e) => {
    const a = e.target.closest("[data-open]");
    if (!a) return;
    e.preventDefault();
    openQV(D.products.find((p) => p.id === a.dataset.open));
  });

  /* ---------- Services ---------- */
  const icons = { bike: "i-bike", wrench: "i-wrench", helmet: "i-helmet", gear: "i-gear" };
  $("#servicesGrid").innerHTML = D.services.map((s, i) => `
    <article class="svc reveal" style="--d:${i * 90}ms">
      <span class="svc__n">0${i + 1}</span>
      <span class="svc__icon"><svg aria-hidden="true"><use href="#${icons[s.icon]}"/></svg></span>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </article>`).join("");
  if (finePointer) {
    $$(".svc").forEach((el) => el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }));
  }

  /* ---------- Reviews ---------- */
  $("#bars").innerHTML = B.ratingBars.map((v, i) => `
    <div class="bar"><span>${5 - i}★</span><div class="bar__track"><div class="bar__fill" data-w="${v}"></div></div></div>`).join("");

  function countUp(el) {
    const to = parseFloat(el.dataset.countTo);
    const dec = +(el.dataset.decimals || 0);
    if (reduce) { el.textContent = to.toFixed(dec); return; }
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 4);
      el.textContent = (to * e).toFixed(dec);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const revObs = new IntersectionObserver((entries, o) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      $$("[data-count-to]", en.target).forEach(countUp);
      $$(".bar__fill", en.target).forEach((b) => (b.style.width = `${b.dataset.w}%`));
      o.unobserve(en.target);
    });
  }, { threshold: 0.35 });
  revObs.observe($("#reviews"));

  /* ---------- Reveal on scroll ---------- */
  const groups = new Map();
  $$(".reveal").forEach((el) => {
    const parent = el.parentElement;
    const idx = groups.get(parent) || 0;
    groups.set(parent, idx + 1);
    if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", `${idx * 90}ms`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
})();
