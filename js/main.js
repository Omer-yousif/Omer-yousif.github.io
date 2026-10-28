/*
  Builds every page from content.js. You normally don't need to edit
  this file: change text and images in content.js instead.
  Each HTML file says which page it is with <body data-page="...">.
*/
(function () {
  "use strict";

  var S = window.SITE;
  var page = document.body.getAttribute("data-page") || "home";
  var lang = "en";
  var galleries = {};
  var lightboxList = [];
  var lightboxIndex = 0;
  document.documentElement.classList.add("js");

  /* ---------- Helpers ---------- */
  function T(v) {
    if (v == null) return "";
    if (typeof v === "string" || typeof v === "number") return String(v);
    return v[lang] || v.en || "";
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function plain(v) { return T(v).replace(/\*/g, ""); }
  function t(v) { return esc(plain(v)); }
  /* Headings: words between *stars* get the accent style */
  function rich(v) { return esc(T(v)).replace(/\*([^*]+)\*/g, "<em>$1</em>"); }
  function $(id) { return document.getElementById(id); }
  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      if (value === null) localStorage.removeItem(key); else localStorage.setItem(key, value);
    } catch (e) { return null; }
  }
  function waLink(text) { return "https://wa.me/" + S.person.whatsapp + "?text=" + encodeURIComponent(text); }
  function phoneDisplay(d) {
    var m = /^60(\d{2})(\d{3})(\d+)$/.exec(d);
    return m ? "+60 " + m[1] + "-" + m[2] + " " + m[3] : "+" + d;
  }
  /* Internal links keep the chosen language */
  function link(file, params, hash) {
    var q = [];
    params = params || {};
    Object.keys(params).forEach(function (k) { q.push(k + "=" + encodeURIComponent(params[k])); });
    if (lang === "ar") q.push("lang=ar");
    return file + (q.length ? "?" + q.join("&") : "") + (hash || "");
  }
  function contactHref() { return page === "home" ? "#contact" : link("index.html", null, "#contact"); }
  function tone(name) { return name ? " t-" + name : ""; }
  function num(v) { return '<bdi dir="ltr">' + esc(v) + '</bdi>'; }

  var TONES = ["yellow", "violet", "pink", "orange", "cyan", "green"];

  var ICON = {
    arrow: '<svg class="icon icon--dir" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    back: '<svg class="icon icon--dir" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    download: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    close: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    check: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    left: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    tutor: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-5 9 5-9 5-9-5z"/><path d="M7 11v5c3 2 7 2 10 0v-5"/></svg>',
    solar: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>',
    leaf: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/></svg>',
    doc: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/></svg>',
    chip: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></svg>'
  };

  /* ---------- Shared pieces ---------- */
  function head(eyebrow, title, extra, cls) {
    return '<div class="sec-head rv' + (cls ? " " + cls : "") + '"><div><span class="eyebrow">' + t(eyebrow) + '</span>' +
      '<h2 class="h2">' + rich(title) + '</h2></div>' + (extra || "") + '</div>';
  }
  function more(href, label) {
    return '<a class="more" href="' + esc(href) + '">' + t(label) + '<i>' + ICON.arrow + '</i></a>';
  }
  function zoom(group, i, item, cls, inner) {
    if (item.figure) cls = (cls ? cls + " " : "") + "is-figure";
    return '<button type="button" class="zoomable' + (cls ? " " + cls : "") + '" data-gallery="' + esc(group) + '" data-index="' + i + '" aria-label="' + t(item.caption) + '">' +
      '<img src="' + esc(item.src) + '" alt="' + t(item.caption) + '" loading="lazy" decoding="async">' + (inner || "") + '</button>';
  }
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="Breadcrumb">' + items.map(function (it) {
      return it[1] ? '<a href="' + esc(it[1]) + '">' + t(it[0]) + '</a>' : '<span>' + t(it[0]) + '</span>';
    }).join(" / ") + '</nav>';
  }
  function pageHero(inner, wrapCls) {
    return '<section class="page-hero"><div class="glow" aria-hidden="true"></div><div class="wrap' + (wrapCls ? " " + wrapCls : "") + '">' + inner + '</div></section>';
  }
  function ctaBand(title, text, label) {
    return '<div class="cta-band rv"><div><h2 class="h2">' + rich(title || S.contact.heading) + '</h2>' +
      (text ? '<p>' + t(text) + '</p>' : '') + '</div>' +
      '<a class="btn" href="' + esc(waLink(T(S.contact.whatsappMessage))) + '" target="_blank" rel="noopener">' + t(label || S.ui.messageWa) + ICON.arrow + '</a></div>';
  }
  function metricHtml(m) {
    return num(m.value) + (m.unit ? '<small>' + t(m.unit) + '</small>' : '');
  }
  function projectCover(p) {
    if (!p.cover) return '<div class="formula" aria-hidden="true">B = μNI / ℓ</div>';
    return '<img src="' + esc(p.cover) + '" alt="" loading="lazy" decoding="async">';
  }
  function projectCard(p, mode) {
    var count = (p.gallery || []).length;
    var full = mode !== "mini";
    var kpis = full && p.metrics && p.metrics.length ? '<div class="kpis">' + p.metrics.slice(0, 2).map(function (m) {
      return '<div><b>' + metricHtml(m) + '</b><span>' + t(m.label) + '</span></div>';
    }).join("") + '</div>' : '';
    return '<a class="card pcard lift rv' + tone(p.tone) + '" href="' + esc(link("project.html", { id: p.id })) + '" data-cat="' + t(p.category) + '">' +
      '<div class="pcard__img' + (p.figures ? ' is-figure' : '') + '">' + projectCover(p) +
        (count ? '<span class="pcard__count">' + count + ' ' + t(S.ui.photos) + '</span>' : '') + '</div>' +
      '<div class="pcard__body">' +
        '<div class="pcard__meta"><span class="chip">' + t(p.category) + '</span><span>' + t(p.date) + '</span></div>' +
        '<h3 class="h3">' + t(p.title) + '</h3>' +
        (mode !== "mini" ? '<p>' + t(p.summary) + '</p>' : '') + kpis +
        '<span class="pcard__read">' + t(S.ui.readCase) + ICON.arrow + '</span>' +
      '</div></a>';
  }

  /* ---------- Header and footer ---------- */
  var NAV = [
    ["home", "index.html"], ["about", "about.html"], ["experience", "experience.html"],
    ["projects", "projects.html"], ["sustainability", "sustainability.html"], ["services", "services.html"]
  ];
  function navLabel(k) { return k === "home" ? S.ui.home : S.ui.nav[k]; }
  function renderHeader() {
    var active = page === "project" ? "projects" : page;
    var links = NAV.map(function (n) {
      return '<a href="' + esc(link(n[1])) + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + t(navLabel(n[0])) + '</a>';
    }).join("");
    $("topbar").innerHTML = '<div class="topbar__inner">' +
      '<a class="brand" href="' + esc(link("index.html")) + '" aria-label="' + t(S.person.name) + '"><span class="brand__mark" aria-hidden="true">OY</span><span class="brand__name">' + t(S.person.name) + '</span></a>' +
      '<nav class="nav" id="siteNav" aria-label="Main">' + links +
        '<div class="nav__extra"><a class="btn btn--grad" href="' + esc(contactHref()) + '">' + t(S.ui.nav.contact) + ICON.arrow + '</a></div></nav>' +
      '<div class="topbar__actions">' +
        '<button class="lang-btn" id="langBtn" type="button" lang="' + (lang === "ar" ? "en" : "ar") + '">' + t(S.ui.langSwitch) + '</button>' +
        '<a class="btn btn--light btn--sm" href="' + esc(contactHref()) + '">' + t(S.ui.nav.contact) + '</a>' +
        '<button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="siteNav" aria-label="' + t(S.ui.menu) + '">' + ICON.menu + '</button>' +
      '</div></div>';
  }
  function renderFooter() {
    var p = S.person;
    var links = NAV.map(function (n) { return '<a href="' + esc(link(n[1])) + '">' + t(navLabel(n[0])) + '</a>'; }).join("");
    $("footer").innerHTML = '<div class="wrap">' +
      '<div class="footer__top">' +
        '<a class="brand" href="' + esc(link("index.html")) + '"><span class="brand__mark" aria-hidden="true">OY</span><span>' + t(p.name) + '</span></a>' +
        '<nav class="footer__nav" aria-label="Footer">' + links + '<a href="' + esc(contactHref()) + '">' + t(S.ui.nav.contact) + '</a></nav>' +
      '</div>' +
      '<div class="footer__bottom"><span>© ' + new Date().getFullYear() + ' ' + t(p.fullName) + '</span>' +
        '<span><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a> · <a href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">' + t(S.ui.linkedin) + '</a> · <a href="#top">' + t(S.ui.backToTop) + ' ↑</a></span></div>' +
      '</div>';
  }
  function contactSection() {
    var p = S.person, c = S.contact, u = S.ui;
    return '<section class="contact rv" id="contact" aria-labelledby="contact-title">' +
      '<div class="glow" style="width:520px;height:320px;inset-inline-start:-90px;top:-110px;background:var(--pink);opacity:.35" aria-hidden="true"></div>' +
      '<div class="glow" style="width:520px;height:320px;inset-inline-end:-90px;bottom:-130px;background:var(--cyan);opacity:.35" aria-hidden="true"></div>' +
      '<div style="position:relative">' +
        '<h2 class="contact__big em-grad" id="contact-title">' + rich(c.heading) + '</h2>' +
        '<p class="lead">' + t(c.text) + '</p>' +
        '<div class="contact__ways">' +
          '<a class="btn btn--wa" href="' + esc(waLink(T(c.whatsappMessage))) + '" target="_blank" rel="noopener">' + t(u.whatsapp) + ICON.arrow + '</a>' +
          '<a class="btn btn--light" href="mailto:' + esc(p.email) + '">' + t(u.email) + '</a>' +
          '<a class="btn btn--ghost" href="' + esc(p.linkedin) + '" target="_blank" rel="noopener">' + t(u.linkedin) + '</a>' +
          '<a class="btn btn--ghost" href="' + esc(p.cv) + '" target="_blank" rel="noopener" download>' + ICON.download + t(u.downloadCv) + '</a>' +
        '</div>' +
        '<ul class="contact__list">' +
          '<li><span id="emailValue"><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a></span><button class="copy-btn" type="button" id="copyEmail">' + t(u.copy) + '</button></li>' +
          '<li dir="ltr"><a href="' + esc(waLink(T(c.whatsappMessage))) + '" target="_blank" rel="noopener">' + esc(phoneDisplay(p.whatsapp)) + '</a></li>' +
          '<li>' + t(p.location) + '</li>' +
        '</ul>' +
      '</div></section>';
  }

  /* ---------- Home ---------- */
  function renderHome() {
    var h = S.hero, u = S.ui, p = S.person, a = S.about, e = S.experience, s = S.sustainability;
    var badges = (h.badges || []).map(function (b, i) {
      return '<div class="badge badge--' + (i + 1) + tone(b.tone) + '"><b>' + num(b.value) + '</b>' + t(b.label) + '</div>';
    }).join("");
    var stats = S.stats.map(function (st, i) {
      return '<div class="stat rv' + tone(TONES[i % TONES.length]) + '" style="--d:' + (i * 0.08) + 's"><b data-count="' + esc(st.value) + '">' + num(st.value) + '</b><span>' + t(st.label) + '</span></div>';
    }).join("");
    var journey = a.journey.map(function (j) {
      return '<li class="' + tone(j.tone) + '"><em>' + t(j.when) + '</em><div><b>' + t(j.title) + '</b><span>' + t(j.text) + '</span></div></li>';
    }).join("");
    var facts = e.highlights.map(function (f) { return '<div><b>' + t(f.title) + '</b>' + t(f.text) + '</div>'; }).join("");
    galleries.homeExp = e.homePhotos.map(function (src) {
      var g = e.gallery.filter(function (x) { return x.src === src; })[0];
      return { src: src, caption: g ? g.caption : "" };
    });
    var expPics = (e.logo ? '<div class="exp-card__logo"><img src="' + esc(e.logo) + '" alt="' + t(e.company) + '" loading="lazy" decoding="async"></div>' : '') +
      galleries.homeExp.map(function (g) { return '<img src="' + esc(g.src) + '" alt="' + t(g.caption) + '" loading="lazy" decoding="async">'; }).join("");
    var feat = S.projects.slice(0, 3).map(function (pr, i) { return projectCard(pr, i === 0 ? "featured" : "mini"); }).join("");
    var nums = s.figures.items.slice(0, 2).map(function (f) {
      return '<div><b>' + num(f.value) + '<small>' + num(f.unit) + '</small></b><span>' + t(f.label) + '</span></div>';
    }).join("") + '<div><b>' + num("800+") + '</b><span>' + t(s.items[2].title) + '</span></div>';
    var svcs = S.services.items.map(function (sv, i) {
      return '<a class="svc lift rv' + tone(sv.tone) + '" href="' + esc(link("services.html")) + '" style="--d:' + (i * 0.06) + 's"><span class="svc__ic">' + (ICON[sv.icon] || ICON.doc) + '</span><b>' + t(sv.title) + '</b><span>' + t(firstSentence(sv.text)) + '</span></a>';
    }).join("");
    galleries.awards = S.awardImages;
    var awardPhotos = S.awardImages.map(function (g, i) { return '<div class="recog__photo rv">' + zoom("awards", i, g) + '</div>'; }).join("");
    var awards = S.awards.slice(0, 4).map(function (aw) { return '<li><em>' + num(aw.year) + '</em><span>' + t(aw.title) + '</span></li>'; }).join("");

    $("main").innerHTML =
      '<section class="hero" id="top" aria-labelledby="heroName">' +
        '<div class="hero__stage" aria-hidden="true">' +
          '<div class="glow glow--1"></div><div class="glow glow--2"></div><div class="glow glow--3"></div>' +
          '<div class="beam beam--1"></div><div class="beam beam--2"></div><div class="beam beam--3"></div><div class="beam beam--4"></div>' +
          '<div class="smoke smoke--1"></div><div class="smoke smoke--2"></div><div class="smoke smoke--3"></div>' +
        '</div>' +
        '<div class="hero__side hero__side--start" aria-hidden="true"><span>' + t(h.sideLeft) + '</span><i></i></div>' +
        '<div class="hero__word" aria-hidden="true">' + t(h.bigWord) + '</div>' +
        '<div class="hero__side hero__side--end" aria-hidden="true"><i></i><span>' + t(h.sideRight) + '</span></div>' +
        '<div class="hero__fig"><img src="' + esc(h.cutout) + '" alt="' + t(p.name) + '" width="856" height="980" fetchpriority="high" decoding="async">' + badges + '</div>' +
        '<div class="hero__shade" aria-hidden="true"></div>' +
        '<div class="hero__foot">' +
          '<p class="hero__me"><b id="heroName">' + t(p.name) + '</b>' + t(h.intro) + ' <span>' + t(h.tagline) + '</span></p>' +
          '<div class="hero__cta"><a class="btn btn--grad" href="' + esc(link("projects.html")) + '">' + t(u.seeWork) + ICON.arrow + '</a>' +
            '<a class="btn btn--ghost" href="' + esc(p.cv) + '" target="_blank" rel="noopener" download>' + ICON.download + t(u.downloadCv) + '</a></div>' +
        '</div>' +
        '<div class="hero__scroll" aria-hidden="true"><i></i>' + t(u.scroll) + '</div>' +
      '</section>' +
      '<div class="rainbow" aria-hidden="true"></div>' +
      '<div class="stats">' + stats + '</div>' +
      '<div class="wrap">' +
        '<section class="sec t-violet" aria-label="' + t(u.nav.about) + '"><div class="about-sum">' +
          '<div class="rv"><span class="eyebrow">' + t(u.nav.about) + '</span><h2 class="h2">' + rich(a.heading) + '</h2><p class="lead">' + t(a.summary) + '</p>' + more(link("about.html"), u.moreAbout) + '</div>' +
          '<ul class="journey-list rv" style="--d:.15s">' + journey + '</ul>' +
        '</div></section>' +
        '<section class="sec t-orange" aria-label="' + t(u.nav.experience) + '">' + head(u.nav.experience, e.heading) +
          '<div class="card exp-card rv">' +
            '<div class="exp-card__txt"><span class="chip">' + t(e.dates) + '</span><h3 class="h3">' + t(e.company) + '</h3><p class="muted small" style="margin-top:6px">' + t(e.role) + '</p>' +
              '<div class="facts">' + facts + '</div>' + more(link("experience.html"), u.allWeeks) + '</div>' +
            '<div class="exp-card__pics">' + expPics + '</div>' +
          '</div></section>' +
        '<section class="sec t-cyan" aria-label="' + t(u.nav.projects) + '">' + head(u.nav.projects, S.projectsHeading, more(link("projects.html"), u.allProjects)) +
          '<div class="feat">' + feat + '</div></section>' +
        '<section class="sec t-green" aria-label="' + t(u.nav.sustainability) + '"><div class="sus-panel rv">' +
          '<div class="glow" style="width:420px;height:420px;inset-inline-start:-100px;top:-120px;background:var(--green);opacity:.22" aria-hidden="true"></div>' +
          '<div style="position:relative"><span class="eyebrow">' + t(u.nav.sustainability) + '</span><h2 class="h2">' + rich(s.heading) + '</h2><p class="lead">' + t(s.intro) + '</p>' +
            '<div class="nums">' + nums + '</div>' + more(link("sustainability.html"), u.exploreSus) + '</div>' +
          '<div class="sus-panel__photo"><img src="' + esc(s.heroImages[0]) + '" alt="' + t(s.items[0].title) + '" decoding="async">' +
            '<div class="leed-tag"><b>' + t(s.leed.title) + '</b><span>' + t(s.leed.status) + '</span></div></div>' +
        '</div></section>' +
        '<section class="sec t-pink" aria-label="' + t(u.nav.services) + '">' + head(u.nav.services, S.services.heading, more(link("services.html"), u.allServices)) +
          '<div class="svc-row">' + svcs + '</div></section>' +
        '<section class="sec t-yellow" aria-label="' + t(u.recognition) + '">' + head(u.recognition, u.recognitionTitle, more(link("about.html"), u.moreAbout)) +
          '<div class="recog">' + awardPhotos + '<ul class="ledger rv">' + awards + '</ul></div></section>' +
        contactSection() +
      '</div>';
  }
  function firstSentence(v) {
    var s = T(v);
    var m = /^(.+?[.!؟?])(\s|$)/.exec(s);
    return m ? m[1] : s;
  }

  /* ---------- About ---------- */
  function renderAbout() {
    var a = S.about, u = S.ui, p = S.person;
    var paras = a.paragraphs.map(function (x) { return '<p>' + t(x) + '</p>'; }).join("");
    var facts = S.nameplate.rows.map(function (r) { return '<div><dt>' + t(r.key) + '</dt><dd>' + t(r.value) + '</dd></div>'; }).join("");
    var road = a.journey.map(function (j, i) {
      return '<li class="rv' + tone(j.tone) + '" style="--d:' + (i * 0.1) + 's"><i></i><em>' + t(j.when) + '</em><b>' + t(j.title) + '</b><span>' + t(j.text) + '</span></li>';
    }).join("");
    var skillTones = ["yellow", "orange", "cyan", "pink"];
    var skills = a.skills.map(function (s, i) {
      var items = T(s.items).split("·").map(function (x) { return '<li><bdi>' + esc(x.trim()) + '</bdi></li>'; }).join("");
      return '<div class="skill rv' + tone(skillTones[i % 4]) + '"><h3 class="h3">' + t(s.group) + '</h3><ul>' + items + '</ul></div>';
    }).join("");
    var lead = S.leadership.map(function (x) { return '<li><em>' + t(x.date) + '</em><span>' + t(x.title) + '</span></li>'; }).join("");
    var awards = S.awards.map(function (x) { return '<li><em>' + num(x.year) + '</em><span>' + t(x.title) + '</span></li>'; }).join("");
    galleries.awards = S.awardImages;
    var photos = S.awardImages.map(function (g, i) { return zoom("awards", i, g); }).join("");
    galleries.portrait = [{ src: p.photo, caption: p.name }];

    $("main").innerHTML =
      pageHero(
        '<div class="story rv">' + crumbs([[u.home, link("index.html")], [u.nav.about]]) +
          '<span class="eyebrow">' + t(u.nav.about) + '</span><h1 class="h1">' + rich(a.heading) + '</h1>' + paras + '</div>' +
        '<div class="portrait rv" style="--d:.15s"><img src="' + esc(p.photo) + '" alt="' + t(p.name) + '" width="822" height="1100"></div>', "split") +
      '<div class="wrap">' +
        '<dl class="qfacts rv">' + facts + '</dl>' +
        '<section class="sec">' + head(u.nav.about, u.journey) + '<ol class="road">' + road + '</ol></section>' +
        '<section class="sec">' + head(u.nav.about, u.skills) + '<div class="skill-grid">' + skills + '</div></section>' +
        '<section class="sec"><div class="two">' +
          '<div class="ledger rv t-yellow"><h3 class="h3">' + t(u.leadership) + '</h3><ul>' + lead + '</ul></div>' +
          '<div class="ledger rv t-violet"><h3 class="h3">' + t(u.awards) + '</h3><ul>' + awards + '</ul>' +
            '<div class="award-photos">' + photos + '</div></div>' +
        '</div></section>' +
        ctaBand(null, S.contact.text, S.ui.whatsapp) +
      '</div>';
  }

  /* ---------- Experience ---------- */
  function renderExperience() {
    var e = S.experience, u = S.ui;
    galleries.experience = e.gallery;
    var meta = [[u.tbCompany, e.company], [u.tbRole, e.role], [u.tbPlace, e.place], [u.tbDates, e.dates]].map(function (m) {
      return '<div><dt>' + t(m[0]) + '</dt><dd>' + t(m[1]) + '</dd></div>';
    }).join("");
    var weekTones = ["orange", "pink", "violet", "cyan", "green", "yellow", "orange"];
    var weeks = e.timeline.map(function (w, i) {
      var thumbs = (w.photos || []).map(function (src) {
        var gi = -1;
        e.gallery.forEach(function (g, j) { if (g.src === src && gi < 0) gi = j; });
        return gi < 0 ? '' : zoom("experience", gi, e.gallery[gi]);
      }).join("");
      return '<li class="week rv' + tone(weekTones[i % weekTones.length]) + '"><div class="week__no"><div><small>' + t(u.weeks) + '</small><b>' + num(w.weeks) + '</b></div></div>' +
        '<div class="week__body"><h3 class="h3">' + t(w.title) + '</h3><p>' + t(w.text) + '</p>' +
        (thumbs ? '<div class="week__pics">' + thumbs + '</div>' : '') + '</div></li>';
    }).join("");
    var photos = e.gallery.map(function (g, i) { return zoom("experience", i, g, "rv", '<span class="cap">' + t(g.caption) + '</span>'); }).join("");

    $("main").innerHTML =
      pageHero('<div class="rv">' + crumbs([[u.home, link("index.html")], [u.nav.experience]]) +
        '<span class="eyebrow">' + t(u.nav.experience) + '</span><h1 class="h1">' + rich(e.heading) + '</h1>' +
        '<p class="lead">' + t(e.summary) + '</p></div>' +
        (e.logo ? '<div class="exp-logo rv" style="--d:.1s"><img src="' + esc(e.logo) + '" alt="' + t(e.company) + '"></div>' : '') +
        '<dl class="exp-meta rv" style="--d:.1s">' + meta + '</dl>', e.logo ? "split" : "") +
      '<div class="wrap">' +
        '<section class="sec">' + head(u.nav.experience, u.weekByWeek) + '<ol class="weeks">' + weeks + '</ol></section>' +
        '<section class="sec">' + head(u.onSite, u.gallery, '<span class="muted small">' + e.gallery.length + ' ' + t(u.photos) + ' · ' + t(u.tapToEnlarge) + '</span>') +
          '<div class="masonry">' + photos + '</div></section>' +
        ctaBand(null, S.contact.text, S.ui.whatsapp) +
      '</div>';
  }

  /* ---------- Projects ---------- */
  function renderProjects() {
    var u = S.ui;
    var cats = [];
    S.projects.forEach(function (p) { var c = plain(p.category); if (cats.indexOf(c) < 0) cats.push(c); });
    var filters = '<button type="button" aria-pressed="true" data-filter="">' + t(u.filterAll) + ' <bdi>' + S.projects.length + '</bdi></button>' +
      cats.map(function (c) { return '<button type="button" aria-pressed="false" data-filter="' + esc(c) + '">' + esc(c) + '</button>'; }).join("");
    var cards = S.projects.map(function (p) { return projectCard(p, "full"); }).join("");
    $("main").innerHTML =
      pageHero('<div class="rv">' + crumbs([[u.home, link("index.html")], [u.nav.projects]]) +
        '<span class="eyebrow">' + t(u.nav.projects) + ' · ' + num(S.projects.length) + '</span><h1 class="h1">' + rich(S.projectsHeading) + '</h1>' +
        '<p class="lead">' + t(S.projectsIntro) + '</p>' +
        '<div class="filters" role="group" aria-label="' + t(u.nav.projects) + '">' + filters + '</div></div>') +
      '<div class="wrap"><div class="pgrid sec" id="projectGrid">' + cards + '</div>' +
        ctaBand(null, S.contact.text, S.ui.whatsapp) + '</div>';
  }

  function chartSvg(c) {
    var W = 640, left = 250, right = 610, top = 44, rowH = 46;
    var H = top + c.rows.length * rowH + 30;
    var x = function (v) { return left + (v - c.min) / (c.max - c.min) * (right - left); };
    var ticks = "", v;
    var step = c.step || 0.1, dec = c.decimals != null ? c.decimals : 2;
    for (v = c.min; v <= c.max + 1e-9; v += step) {
      var tx = x(v).toFixed(1);
      ticks += '<line class="grid" x1="' + tx + '" y1="' + (top - 16) + '" x2="' + tx + '" y2="' + (H - 26) + '"/>' +
        '<text class="axis-lbl" x="' + tx + '" y="' + (H - 8) + '" text-anchor="middle">' + v.toFixed(dec) + '</text>';
    }
    var ref = "";
    if (c.reference) {
      var rx = x(c.reference.value).toFixed(1);
      ref = '<line class="ref" x1="' + rx + '" y1="' + (top - 20) + '" x2="' + rx + '" y2="' + (H - 26) + '"/>' +
        '<text class="axis-lbl" x="' + (rx - 6) + '" y="' + (top - 26) + '" text-anchor="end">' + t(c.reference.label) + '</text>';
    }
    var rows = c.rows.map(function (r, i) {
      var y = top + i * rowH + rowH / 2;
      var dx = x(r.value).toFixed(1);
      return '<text class="row-lbl" x="' + (left - 16) + '" y="' + (y + 5) + '" text-anchor="end">' + t(r.label) + '</text>' +
        '<line class="stem" x1="' + left + '" y1="' + y + '" x2="' + dx + '" y2="' + y + '"/>' +
        '<circle class="dot--' + esc(r.tone || "neutral") + '" cx="' + dx + '" cy="' + y + '" r="7"/>' +
        '<text class="val-lbl" x="' + dx + '" y="' + (y - 13) + '" text-anchor="middle">' + esc(r.value) + '</text>';
    }).join("");
    return '<div class="chart rv"><h3>' + t(c.title) + ' (' + t(c.unit) + ')</h3><div class="chart__scroll" dir="ltr">' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + t(c.title) + '">' + ticks + ref + rows + '</svg></div></div>';
  }

  /* ---------- One project ---------- */
  /* Gallery layout by photo count: one large photo when the rest fill the rows evenly */
  function galClass(n) {
    if (n < 3) return " gal--few";
    return n % 4 === 1 ? "" : " gal--uniform";
  }
  function coverZoom(p, group) {
    var list = galleries[group];
    var i = -1;
    list.forEach(function (g, j) { if (g.src === p.cover && i < 0) i = j; });
    if (i < 0) { galleries[group + "-cover"] = [{ src: p.cover, caption: p.title }]; return zoom(group + "-cover", 0, galleries[group + "-cover"][0]); }
    return zoom(group, i, list[i]);
  }
  function renderProject() {
    var u = S.ui;
    var id = new URLSearchParams(location.search).get("id") || decodeURIComponent(location.hash.slice(1));
    var idx = -1;
    S.projects.forEach(function (x, i) { if (x.id === id) idx = i; });
    var p = S.projects[idx];
    document.body.className = "t-" + ((p && p.tone) || "cyan");
    if (!p) {
      $("main").innerHTML = pageHero('<div>' + crumbs([[u.home, link("index.html")], [u.nav.projects, link("projects.html")]]) +
        '<h1 class="h1">' + t(u.notFound) + '</h1><p style="margin-top:30px">' + more(link("projects.html"), u.backToProjects) + '</p></div>');
      return null;
    }
    var group = "case-" + p.id;
    galleries[group] = p.gallery || [];
    var fig = p.figures ? " is-figure" : "";
    var tools = (p.tools || []).map(function (x) { return '<span><bdi>' + t(x) + '</bdi></span>'; }).join("");
    var kpis = (p.metrics || []).map(function (m, i) {
      return '<div class="kpi rv" style="--d:' + (i * 0.08) + 's"><b>' + metricHtml(m) + '</b><span>' + t(m.label) + '</span></div>';
    }).join("");
    var steps = (p.did || []).map(function (d, i) {
      var img = "";
      if (d.image) {
        var gi = -1;
        galleries[group].forEach(function (g, j) { if (g.src === d.image) gi = j; });
        if (gi < 0) { galleries[group + "-s" + i] = [{ src: d.image, caption: d }]; }
        var stepFig = gi >= 0 && galleries[group][gi].photo ? "" : fig;
        img = zoom(gi < 0 ? group + "-s" + i : group, gi < 0 ? 0 : gi, { src: d.image, caption: gi < 0 ? d : galleries[group][gi].caption }, "step__img" + stepFig);
      }
      return '<li class="step rv' + (img ? '' : ' no-img') + '"><div class="step__txt"><div class="step__num">' + (i + 1) + '</div><p>' + t(d) + '</p></div>' + img + '</li>';
    }).join("");
    var results = (p.results || []).map(function (r) { return '<li class="rv"><i>' + ICON.check + '</i><span>' + t(r) + '</span></li>'; }).join("");
    var gal = (p.gallery || []).map(function (g, i) {
      return zoom(group, i, g, g.photo ? "" : fig.trim(), '<figcaption>' + t(g.caption) + '</figcaption>');
    }).join("");
    var prev = S.projects[(idx - 1 + S.projects.length) % S.projects.length];
    var next = S.projects[(idx + 1) % S.projects.length];

    $("main").innerHTML =
      pageHero(
        '<div class="rv">' + crumbs([[u.home, link("index.html")], [u.nav.projects, link("projects.html")], [p.title]]) +
          '<span class="chip">' + t(p.category) + ' · ' + t(p.date) + '</span>' +
          '<h1 class="h1" style="font-size:clamp(2.3rem,1.5rem + 2.6vw,3.8rem)">' + t(p.title) + '</h1>' +
          '<p class="lead">' + t(p.summary) + '</p>' +
          '<dl class="meta-grid">' + (p.team ? '<div><dt>' + t(u.team) + '</dt><dd>' + t(p.team) + '</dd></div>' : '') +
            '<div><dt>' + t(u.date) + '</dt><dd>' + t(p.date) + '</dd></div></dl>' +
          (tools ? '<div class="tools">' + tools + '</div>' : '') + '</div>' +
        '<div class="p-cover rv' + fig + '" style="--d:.15s">' + (p.cover ? coverZoom(p, group) : projectCover(p)) + '</div>', "split") +
      '<div class="wrap">' +
        (kpis ? '<div class="kpi-row">' + kpis + '</div>' : '') +
        (p.chart ? chartSvg(p.chart) : '') +
        '<section class="block"><h2 class="h2 rv">' + t(u.context) + '</h2><p class="block__lead rv">' + t(p.context) + '</p></section>' +
        (steps ? '<section class="block"><h2 class="h2 rv">' + t(u.whatIDid) + '</h2><ol class="steps">' + steps + '</ol></section>' : '') +
        (results ? '<section class="block"><h2 class="h2 rv">' + t(u.results) + '</h2><ul class="results">' + results + '</ul></section>' : '') +
        (gal ? '<section class="sec">' + head(u.caseStudy, u.gallery, '<span class="muted small">' + p.gallery.length + ' ' + t(u.photos) + ' · ' + t(u.tapToEnlarge) + '</span>') + '<div class="gal rv' + galClass(p.gallery.length) + '" style="--cols:' + (p.gallery.length % 3 === 0 ? 3 : 4) + '">' + gal + '</div></section>' : '') +
        '<nav class="nextprev rv" aria-label="' + t(u.nav.projects) + '">' +
          '<a class="lift' + tone(prev.tone) + '" href="' + esc(link("project.html", { id: prev.id })) + '"><small>' + ICON.back + t(u.prevProject) + '</small><b>' + t(prev.title) + '</b></a>' +
          '<a class="lift' + tone(next.tone) + '" href="' + esc(link("project.html", { id: next.id })) + '"><small>' + t(u.nextProject) + ICON.arrow + '</small><b>' + t(next.title) + '</b></a>' +
        '</nav>' +
        ctaBand(null, S.contact.text, S.ui.whatsapp) +
      '</div>';
    return p;
  }

  /* ---------- Sustainability ---------- */
  function renderSustainability() {
    var s = S.sustainability, u = S.ui;
    galleries.susHero = s.heroImages.map(function (src) {
      var cap = "";
      s.items.forEach(function (it) { (it.gallery || []).forEach(function (g) { if (g.src === src && !cap) cap = g.caption; }); });
      return { src: src, caption: cap };
    });
    var collage = galleries.susHero.map(function (g, i) { return zoom("susHero", i, g); }).join("");
    var figs = s.figures.items.map(function (f, i) {
      return '<div class="' + tone(["yellow", "green", "cyan"][i % 3]).trim() + '"><b>' + num(f.value) + '<small>' + num(f.unit) + '</small></b><span>' + t(f.label) + '</span></div>';
    }).join("");
    var items = s.items.map(function (it, i) {
      var pic;
      if (it.image && it.logo) {
        pic = '<div class="tl-item__logo"><img src="' + esc(it.image) + '" alt="' + t(it.title) + '" loading="lazy" decoding="async"></div>';
      } else if (it.image) {
        var list = it.gallery && it.gallery.length ? it.gallery : [{ src: it.image, caption: it.title }];
        galleries["sus-" + i] = list;
        pic = zoom("sus-" + i, 0, { src: it.image, caption: it.title }, "tl-item__pic", list.length > 1 ? '<span class="pcard__count">' + list.length + ' ' + t(u.photos) + '</span>' : '');
      } else {
        pic = '<div class="tl-item__art" aria-hidden="true">' + ICON.leaf + '</div>';
      }
      return '<div class="tl-item rv">' + pic + '<div><span class="tl-item__date">' + t(it.date) + '</span><h3 class="h3">' + t(it.title) + '</h3><p>' + t(it.text) + '</p></div></div>';
    }).join("");

    $("main").innerHTML =
      pageHero('<div class="rv">' + crumbs([[u.home, link("index.html")], [u.nav.sustainability]]) +
          '<span class="eyebrow">' + t(u.nav.sustainability) + '</span><h1 class="h1">' + rich(s.heading) + '</h1><p class="lead">' + t(s.intro) + '</p></div>' +
        '<div class="collage rv" style="--d:.15s">' + collage + '</div>', "split") +
      '<div class="wrap">' +
        '<div class="leed-row">' +
          '<div class="leed-badge rv"><div class="glow" aria-hidden="true"></div><span class="leed-status"><i></i>' + t(s.leed.status) + '</span><h3>' + t(s.leed.title) + '</h3><p>' + t(s.leed.text) + '</p></div>' +
          '<div class="figs rv t-green" style="--d:.1s"><span class="eyebrow">' + t(s.figures.title) + '</span><div class="figs__row">' + figs + '</div><p class="figs__note">' + t(s.figures.note) + '</p></div>' +
        '</div>' +
        '<section class="sec">' + head(u.nav.sustainability, u.doneSoFar, "", "sec-head--center") + '<div class="tl">' + items + '</div></section>' +
        ctaBand(null, S.contact.text, S.ui.whatsapp) +
      '</div>';
  }

  /* ---------- Services ---------- */
  function renderServices() {
    var s = S.services, u = S.ui, c = S.contact;
    var cards = s.items.slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); }).map(function (it, i) {
      var price = T(it.price);
      var href = waLink(T(c.whatsappMessage) + " " + T(it.title));
      return '<div class="svc-card lift rv' + (it.featured ? ' is-wide' : '') + tone(it.tone) + '" style="--d:' + (i % 2) * 0.08 + 's">' +
        '<div class="glow" aria-hidden="true"></div>' +
        '<span class="svc__ic" style="position:relative">' + (ICON[it.icon] || ICON.doc) + '</span>' +
        '<div style="position:relative;display:flex;flex-direction:column;align-items:flex-start;flex:1">' +
          '<h2 class="h3">' + t(it.title) + '</h2><p>' + t(it.text) + '</p>' +
          (price ? '<p class="price">' + esc(price) + '</p>' : '') +
          '<a class="btn btn--wa btn--sm" href="' + esc(href) + '" target="_blank" rel="noopener">' + t(u.askQuote) + ICON.arrow + '</a>' +
        '</div></div>';
    }).join("");
    var steps = (s.steps || []).map(function (st, i) {
      return '<li class="rv" style="--d:' + (i * 0.1) + 's"><b>' + num("0" + (i + 1)) + '</b><h3 class="h3">' + t(st.title) + '</h3><p class="muted">' + t(st.text) + '</p></li>';
    }).join("");
    $("main").innerHTML =
      pageHero('<div class="rv">' + crumbs([[u.home, link("index.html")], [u.nav.services]]) +
        '<span class="eyebrow">' + t(u.nav.services) + ' · ' + num(s.items.length) + '</span><h1 class="h1">' + rich(s.heading) + '</h1>' +
        '<p class="lead">' + t(s.intro) + '</p>' +
        (s.note ? '<div class="note"><b>!</b><span>' + t(s.note) + '</span></div>' : '') + '</div>') +
      '<div class="wrap">' +
        '<div class="svc-grid sec">' + cards + '</div>' +
        (steps ? '<section class="sec">' + head(u.nav.services, u.howItWorks) + '<ol class="how">' + steps + '</ol></section>' : '') +
        ctaBand(u.haveProject, null, u.messageWa) +
      '</div>';
  }

  /* ---------- Behaviour ---------- */
  var revealObs;
  function reveal() {
    var els = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
    if (revealObs) revealObs.disconnect();
    revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        revealObs.unobserve(en.target);
        var counter = en.target.querySelector("[data-count]");
        if (counter) countUp(counter);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { revealObs.observe(el); });
  }
  function countUp(el) {
    var raw = el.getAttribute("data-count");
    var m = /^([^0-9]*)([0-9][0-9,]*\.?[0-9]*)(.*)$/.exec(raw);
    if (!m || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    var target = parseFloat(m[2].replace(/,/g, ""));
    var decimals = (m[2].split(".")[1] || "").length;
    var start = null, dur = 1400;
    var b = el.querySelector("bdi") || el;
    function frame(ts) {
      if (!start) start = ts;
      var k = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      b.textContent = m[1] + (target * eased).toFixed(decimals) + m[3];
      if (k < 1) requestAnimationFrame(frame); else b.textContent = raw;
    }
    requestAnimationFrame(frame);
  }
  function onScroll() {
    var bar = $("topbar");
    var open = $("siteNav") && $("siteNav").classList.contains("is-open");
    bar.classList.toggle("is-solid", window.scrollY > 24 || open);
  }
  function bindPage() {
    var nav = $("siteNav"), menu = $("menuBtn");
    menu.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
      document.documentElement.style.overflow = open ? "hidden" : "";
      onScroll();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { nav.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); document.documentElement.style.overflow = ""; }
    });
    $("langBtn").addEventListener("click", function () {
      var next = lang === "ar" ? "en" : "ar";
      store("lang", next);
      var y = window.scrollY;
      applyLang(next);
      try {
        var params = new URLSearchParams(location.search);
        if (next === "ar") params.set("lang", "ar"); else params.delete("lang");
        var qs = params.toString();
        history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
      } catch (err) { /* file:// may refuse; the stored choice still applies */ }
      window.scrollTo(0, y);
    });
    var copy = $("copyEmail");
    if (copy) copy.addEventListener("click", function () {
      var btn = this, email = S.person.email;
      var done = function () { btn.textContent = T(S.ui.copied); setTimeout(function () { btn.textContent = T(S.ui.copy); }, 1800); };
      var fallback = function () {
        var r = document.createRange();
        r.selectNodeContents($("emailValue"));
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done, fallback); else fallback();
    });
    var grid = $("projectGrid");
    if (grid) document.querySelectorAll("[data-filter]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.getAttribute("data-filter");
        document.querySelectorAll("[data-filter]").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
        grid.querySelectorAll(".pcard").forEach(function (card) {
          card.classList.toggle("is-hidden", !!f && card.getAttribute("data-cat") !== f);
          card.classList.add("in");
        });
      });
    });
  }

  /* ---------- Language ---------- */
  var TITLE_KEYS = { about: "about", experience: "experience", projects: "projects", sustainability: "sustainability", services: "services" };
  function applyLang(next) {
    lang = next === "ar" ? "ar" : "en";
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    galleries = {};
    var skip = document.querySelector(".skip-link");
    if (skip) skip.textContent = T(S.ui.skip);
    var tones = { about: "violet", experience: "orange", projects: "cyan", sustainability: "green", services: "pink" };
    document.body.className = tones[page] ? "t-" + tones[page] : "";
    renderHeader();
    var title = plain(S.person.name);
    if (page === "about") renderAbout();
    else if (page === "experience") renderExperience();
    else if (page === "projects") renderProjects();
    else if (page === "project") { var p = renderProject(); if (p) title = plain(p.title) + " · " + title; }
    else if (page === "sustainability") renderSustainability();
    else if (page === "services") renderServices();
    else { renderHome(); title = title + " · " + plain(S.hero.tagline); }
    if (TITLE_KEYS[page]) title = plain(S.ui.nav[TITLE_KEYS[page]]) + " · " + title;
    document.title = title;
    renderFooter();
    $("lbPrev").setAttribute("aria-label", T(S.ui.prev));
    $("lbNext").setAttribute("aria-label", T(S.ui.next));
    $("lbClose").setAttribute("aria-label", T(S.ui.close));
    bindPage();
    reveal();
    onScroll();
  }

  /* ---------- Lightbox ---------- */
  function showLightbox() {
    var item = lightboxList[lightboxIndex];
    if (!item) return;
    $("lightboxImg").src = item.src;
    $("lightboxImg").alt = plain(item.caption);
    $("lightboxCaption").textContent = plain(item.caption) + (lightboxList.length > 1 ? "  ·  " + (lightboxIndex + 1) + " / " + lightboxList.length : "");
    var many = lightboxList.length > 1;
    $("lbPrev").hidden = !many;
    $("lbNext").hidden = !many;
  }
  function openLightbox(group, index) {
    lightboxList = galleries[group] || [];
    lightboxIndex = index;
    showLightbox();
    var lb = $("lightbox");
    if (!lb.open) { lb.showModal(); document.documentElement.style.overflow = "hidden"; }
  }
  function stepLightbox(d) {
    if (!lightboxList.length) return;
    lightboxIndex = (lightboxIndex + d + lightboxList.length) % lightboxList.length;
    showLightbox();
  }

  /* ---------- Start ---------- */
  function init() {
    var params = new URLSearchParams(location.search);
    var initial = params.get("lang") || store("lang") || ((navigator.language || "").toLowerCase().indexOf("ar") === 0 ? "ar" : "en");
    applyLang(initial);

    document.addEventListener("click", function (e) {
      var g = e.target.closest("[data-gallery]");
      if (g) { e.preventDefault(); openLightbox(g.getAttribute("data-gallery"), Number(g.getAttribute("data-index"))); }
    });
    var lb = $("lightbox");
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lightbox__figure")) lb.close(); });
    lb.addEventListener("close", function () { document.documentElement.style.overflow = ""; });
    $("lbClose").addEventListener("click", function () { lb.close(); });
    $("lbPrev").addEventListener("click", function () { stepLightbox(-1); });
    $("lbNext").addEventListener("click", function () { stepLightbox(1); });
    lb.addEventListener("keydown", function (e) {
      var back = lang === "ar" ? "ArrowRight" : "ArrowLeft";
      var fwd = lang === "ar" ? "ArrowLeft" : "ArrowRight";
      if (e.key === back) stepLightbox(-1);
      if (e.key === fwd) stepLightbox(1);
    });
    var touchX = null;
    lb.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (touchX == null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) stepLightbox((dx < 0 ? 1 : -1) * (lang === "ar" ? -1 : 1));
      touchX = null;
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    if (location.hash && page === "home") {
      var target = document.getElementById(location.hash.slice(1));
      if (target) setTimeout(function () { target.scrollIntoView(); }, 60);
    }
  }

  init();
})();
