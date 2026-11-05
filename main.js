(() => {
  const S = window.SITE, APPS = window.APPS, P = window.PEOPLE, ART = window.ART || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (t = "") => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pad = n => String(n).padStart(2, "0");
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const person = k => { const p = P[k] || { name: k }; return p.gh ? `<a href="${esc(p.gh)}" target="_blank" rel="noopener">${esc(p.name)}</a>` : esc(p.name); };
  const list = arr => arr.length < 2 ? arr.join("") : `${arr.slice(0, -1).join(", ")} e ${arr.at(-1)}`;
  const fullName = a => a.sub ? `${a.name} ${a.sub}` : a.name;

  /* ---------- ícones ---------- */
  const GLYPH = c => `<rect x="6" y="6" width="12" height="12" fill="${c}"/><rect x="18" y="18" width="12" height="12" fill="${c}"/><rect x="6" y="6" width="24" height="24" fill="none" stroke="${c}" stroke-width="2"/>`;
  const icon = a => a.icon
    ? `<span class="shelf__icon ${a.adaptive ? "is-adaptive" : ""}" style="background:${a.iconBg || "transparent"}"><img src="${esc(a.icon)}" alt=""></span>`
    : `<span class="shelf__icon" style="background:${a.accent}"><svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">${GLYPH(a.screen || "#111")}</svg></span>`;

  /* ---------- aparelho ---------- */
  const screenContent = a => {
    if (a.shots && a.shots.length) return `<div class="slides" data-fit="${a.fit || "cover"}">${a.shots.map((s, i) =>
      `<img src="${esc(s)}" alt="${esc(fullName(a))}, tela ${i + 1}" ${i ? 'loading="lazy"' : ""} class="${i ? "" : "on"}">`).join("")}</div>`;
    if (a.splash) return `<div class="splash splash--brand" style="background:${a.splash.bg}">
        <img src="${esc(a.splash.img)}" alt="">
        <p class="splash__title">${esc(a.name)}</p><p class="splash__sub">${esc(a.kind)}</p></div>`;
    return `<div class="splash"><div class="splash__text"><p class="splash__title">${esc(a.name)}</p><p class="splash__sub">${esc(a.kind)}</p></div>
        <div class="splash__art">${ART[a.art] ? ART[a.art](a) : ""}</div></div>`;
  };
  const device = a => {
    const land = a.device === "landscape";
    return `<div class="device phone ${land ? "is-land" : ""}"><div class="screen" style="--screen:${a.screen || "#0b0b0c"};--accent:${a.accent};--zoom:1.12">
        <span class="cam"></span>
        ${!land && !(a.shots && a.shots.length) && !a.splash ? `<div class="status"><span>12:00</span><span><em>••••</em><i></i></span></div>` : ""}
        ${screenContent(a)}
      </div></div>`;
  };
  const thumbs = a => a.shots && a.shots.length > 1
    ? `<div class="thumbs ${a.device === "landscape" ? "is-land" : ""}">${a.shots.map((s, i) => `<button class="${i ? "" : "on"}" data-i="${i}" aria-label="Ver tela ${i + 1}"><img src="${esc(s)}" alt="" loading="lazy"></button>`).join("")}</div>` : "";

  const arrow = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2.5v12M3.5 9.5 9 15l5.5-5.5"/></svg>`;

  /* ---------- seções ---------- */
  $("#projetos").innerHTML = APPS.map((a, i) => {
    const autores = a.authors.filter(x => x.role === "autor").map(x => person(x.who));
    const parceiros = a.authors.filter(x => x.role === "parceria").map(x => person(x.who));
    const extra = (a.credits || []).map(([label, ks]) => `<dt>${esc(label)}</dt><dd>${list(ks.map(person))}</dd>`).join("");
    const links = (a.links || []).map(l => `<a class="link" href="${esc(l.url)}" ${l.internal ? "" : 'target="_blank" rel="noopener"'}>${esc(l.label)} <span>↗</span></a>`).join("");
    return `
    <section class="app zone app--${a.device}" id="${a.id}" data-bg="${a.bg}" data-ink="${a.ink}" style="--accent:${a.accent}">
      <div class="sec-head r"><span><b>${pad(i + 1)}</b> / ${pad(APPS.length)}</span><span>${esc(a.kind)}</span></div>
      <h2 class="app__name r">${esc(a.name)}${a.sub ? ` <span class="app__sub">${esc(a.sub)}</span>` : ""}</h2>
      <div class="app__body">
        <div class="app__stage r">${device(a)}${thumbs(a)}</div>
        <div class="app__copy">
          <div class="copy-a">
            <p class="app__tagline r">${esc(a.tagline)}</p>
            <p class="app__desc r">${esc(a.desc)}</p>
          </div>
          <div class="copy-b">
            <dl class="credits r">
              <dt>Desenvolvido por</dt><dd>${list(autores)}</dd>
              ${parceiros.length ? `<dt>Em parceria com</dt><dd>${list(parceiros)}</dd>` : ""}
              ${extra}
              <dt>Feito com</dt><dd>${a.tech.map(esc).join(", ")}</dd>
            </dl>
            <div class="dl r">
              ${a.download
                ? `<a class="btn" href="${esc(a.download)}">Baixar APK<span class="btn__arrow">${arrow}</span></a>`
                : `<span class="btn" aria-disabled="true">Download em breve</span>`}
              ${a.downloadNote ? `<p class="dl__meta">${esc(a.downloadNote)}</p>` : ""}
            </div>
            ${links ? `<div class="links r">${links}</div>` : ""}
          </div>
        </div>
      </div>
    </section>`;
  }).join("");

  /* ---------- créditos (pessoas) ---------- */
  const roles = {};
  const add = (k, app, role) => (roles[k] = roles[k] || []).push([app, role]);
  APPS.forEach(a => {
    a.authors.forEach(x => add(x.who, fullName(a), x.role === "autor" ? "Desenvolvimento" : "Parceria"));
    (a.credits || []).forEach(([label, ks]) => ks.forEach(k => add(k, a.name + " (original)", label.includes("Orienta") ? "Orientação" : "Desenvolvimento")));
  });
  const order = Object.keys(P).filter(k => roles[k]).sort((x, y) => ({ murilo: 1, mauri: 2 }[x] || 0) - ({ murilo: 1, mauri: 2 }[y] || 0));
  $("#people").innerHTML = order.map(k => `
    <article class="person r">
      <h3>${person(k)}</h3>
      <ul>${roles[k].map(([app, role]) => `<li><span>${esc(app)}</span><span>${esc(role)}</span></li>`).join("")}</ul>
    </article>`).join("");

  /* ---------- hero / nav / rodapé ---------- */
  $("#shelf").innerHTML = APPS.map(a => `<li><a href="#${a.id}">${icon(a)}<span class="shelf__name">${esc(a.name)}</span></a></li>`).join("");
  $("#navIg").href = S.links[0].url;
  $("#footLinks").innerHTML = S.links.map(l => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");
  $("#footOrg").href = S.organizer.gh; $("#footOrg").textContent = S.organizer.name;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- slides dentro do aparelho ---------- */
  $$(".app").forEach(sec => {
    const imgs = $$(".slides img", sec), btns = $$(".thumbs button", sec);
    if (imgs.length < 2) return;
    let cur = 0, timer = null, visible = false, hold = 0;
    const go = i => { cur = (i + imgs.length) % imgs.length; imgs.forEach((im, j) => im.classList.toggle("on", j === cur)); btns.forEach((b, j) => b.classList.toggle("on", j === cur)); };
    const tick = () => { if (visible && Date.now() > hold) go(cur + 1); };
    btns.forEach(b => b.addEventListener("click", () => { go(+b.dataset.i); hold = Date.now() + 9000; }));
    if (!reduce) timer = setInterval(tick, 3600);
    new IntersectionObserver(([e]) => visible = e.isIntersecting, { threshold: .4 }).observe(sec.querySelector(".device"));
    sec.querySelector(".slides").addEventListener("click", () => openLb(imgs[cur].src));
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("img", lb);
  const openLb = src => { lbImg.src = src; lb.hidden = false; requestAnimationFrame(() => lb.classList.add("on")); };
  const closeLb = () => { lb.classList.remove("on"); setTimeout(() => lb.hidden = true, 400); };
  lb.addEventListener("click", closeLb);
  addEventListener("keydown", e => e.key === "Escape" && !lb.hidden && closeLb());
  $$("[data-zoom]").forEach(b => b.addEventListener("click", () => openLb(b.dataset.zoom)));

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const sibs = $$(":scope > .r", e.target.parentElement);
    e.target.style.transitionDelay = `${Math.max(0, sibs.indexOf(e.target)) * 80}ms`;
    e.target.classList.add("in");
    io.unobserve(e.target);
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
  $$(".r").forEach(el => io.observe(el));

  /* ---------- cor da página por seção + parallax ---------- */
  const zones = $$(".zone"), root = document.documentElement, nav = $("#nav"), bar = $("#progress");
  const meta = $('meta[name="theme-color"]');
  const devices = $$(".device");
  let ticking = false, lastId = "";
  function frame() {
    ticking = false;
    const vh = innerHeight, line = vh * .55;
    let z = zones[0];
    for (const el of zones) { const r = el.getBoundingClientRect(); if (r.top <= line && r.bottom > line) { z = el; break; } }
    if (z.id !== lastId) {
      lastId = z.id;
      root.style.setProperty("--bg", z.dataset.bg);
      root.style.setProperty("--ink", z.dataset.ink);
      meta.content = z.dataset.bg;
    }
    nav.classList.toggle("solid", scrollY > 40);
    bar.style.transform = `scaleX(${scrollY / (document.documentElement.scrollHeight - vh)})`;
    if (!reduce) {
      const mid = vh * .5;
      devices.forEach(el => {
        const r = el.getBoundingClientRect(); const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / vh));
        el.style.transform = el.classList.contains("is-land")
          ? `translateY(${p * 30}px) perspective(1600px) rotateX(${p * 8}deg)`
          : `translateY(${p * 40}px) rotate(${p * -2.5}deg)`;
      });
    }
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener("scroll", req, { passive: true });
  addEventListener("resize", req);
  frame();
})();
