/*
  SolarSpec user interface. Builds the form, runs engine.js on every
  change and draws the results, charts and the printable proposal.
  All state lives in one object (st) that is saved in the browser,
  in project files (.json) and in share links (#p=...).
*/
(function () {
  "use strict";

  var E = window.SolarEngine;
  var CITIES = window.SOLAR_CITIES;
  var MONTHS = E.MONTHS;
  var STORE_KEY = "solarspec.project.v1";

  /* ---------- Defaults ---------- */
  var FIN_MY = { capexPerKWp: 3500, fixedCost: 0, battCostPerKWh: 2000, rebate: 0, years: 25, degrPct: 0.5, escPct: 2, discPct: 6, omPct: 1, omEscPct: 2, invReplaceYear: 12, invReplacePerKWac: 700, battReplaceYear: 12, loanPct: 0, loanRatePct: 4, loanYears: 5 };
  var FIN_GEN = { capexPerKWp: 1100, fixedCost: 0, battCostPerKWh: 450, rebate: 0, years: 25, degrPct: 0.5, escPct: 3, discPct: 6, omPct: 1, omEscPct: 2, invReplaceYear: 12, invReplacePerKWac: 150, battReplaceYear: 12, loanPct: 0, loanRatePct: 6, loanYears: 7 };

  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function defaults() {
    var kl = CITIES[0];
    return {
      v: 1,
      proj: { client: "", address: "", ref: "", by: "Omer Yousif", company: "Solar & energy engineering", contact: "yousifali@graduate.utm.my · wa.me/60196885468", notes: "" },
      site: { city: kl.n, lat: kl.lat, lon: kl.lon, custom: null, phases: 1 },
      load: { mode: "bill", bill: 350, kwh: 800, months: E.DAYS.map(function () { return 800; }), profile: "home" },
      pv: { module: "m585", mod: clone(E.MODULES.m585), kWp: 5, autoInv: true, inv: "i5s", invSpec: clone(E.INVERTERS.i5s), invCount: 1,
        tilt: 10, azimuth: 180, mount: "roof", albedo: 0.2, dcLossPct: 9, acLossPct: 1.5, roofArea: 60, dcLength: 20, dcArea: 4 },
      batt: { kWh: 0, kW: 5, rtePct: 90 },
      tariff: { type: "tnb", currency: "$", tnb: clone(E.TNB_DEFAULTS), gen: clone(E.GENERIC_DEFAULTS) },
      fin: clone(FIN_MY),
      ef: 0.769
    };
  }
  // Fill any keys missing from an older or partial saved project.
  function merge(base, over) {
    if (!over || typeof over !== "object" || Array.isArray(base)) return over === undefined ? base : over;
    var out = {};
    for (var k in base) out[k] = (k in over) ? merge(base[k], over[k]) : base[k];
    for (k in over) if (!(k in out)) out[k] = over[k];
    return out;
  }

  var st = defaults();
  var sweepRes = null;
  var dayMonth = 0;
  var tab = "results";
  var last = null;

  /* ---------- Small helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(x, d) {
    if (x == null || !isFinite(x)) return "–";
    d = d || 0;
    return Number(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function cur() { return st.tariff.type === "tnb" ? "RM" : (st.tariff.currency || "$"); }
  function money(x, d) {
    if (x == null || !isFinite(x)) return "–";
    return (x < 0 ? "−" : "") + cur() + (cur().length > 1 ? " " : "") + fmt(Math.abs(x), d || 0);
  }
  function pct(x, d) { return x == null || !isFinite(x) ? "–" : fmt(x * 100, d == null ? 0 : d) + "%"; }
  function yrs(x) { return x == null ? "not within term" : fmt(x, 1) + " years"; }
  function get(path) { return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, st); }
  function set(path, val) {
    var ks = path.split("."), o = st;
    for (var i = 0; i < ks.length - 1; i++) o = o[ks[i]];
    o[ks[ks.length - 1]] = val;
  }
  function storage(val) {
    try {
      if (val === undefined) return localStorage.getItem(STORE_KEY);
      localStorage.setItem(STORE_KEY, val);
    } catch (e) { return null; }
  }
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }
  function download(name, text, type) {
    var blob = new Blob([text], { type: type });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function slug(s) { return String(s || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project"; }

  /* ---------- Model wiring ---------- */
  function site() {
    if (st.site.custom) return st.site.custom;
    return CITIES.filter(function (c) { return c.n === st.site.city; })[0] || CITIES[0];
  }
  function atapCap() {
    if (st.tariff.type !== "tnb" || !st.tariff.tnb.atap) return Infinity;
    return st.site.phases === 3 ? 15 : 5;
  }
  function tariffObj() {
    return st.tariff.type === "tnb" ? Object.assign({ type: "tnb" }, st.tariff.tnb) : Object.assign({ type: "generic" }, st.tariff.gen);
  }
  function loadMonthly() {
    var L = st.load;
    if (L.mode === "months") return L.months.map(function (x) { return Math.max(0, +x || 0); });
    var k = L.mode === "bill" ? E.kwhFromBill(Math.max(0, +L.bill || 0), tariffObj()) : Math.max(0, +L.kwh || 0);
    return E.DAYS.map(function () { return k; });
  }
  function chooseInverter(kWp) {
    if (!st.pv.autoInv) return { key: st.pv.inv, spec: st.pv.invSpec, count: Math.max(1, st.pv.invCount | 0) };
    var cap = atapCap();
    // A battery needs a hybrid inverter; without one, use a plain grid-tie model.
    var wantHybrid = st.batt.kWh > 0;
    var list = Object.keys(E.INVERTERS).map(function (k) { return { key: k, spec: E.INVERTERS[k] }; })
      .filter(function (x) { return x.spec.phases === st.site.phases && !!x.spec.hybrid === wantHybrid; })
      .sort(function (a, b) { return a.spec.kw - b.spec.kw; });
    var target = Math.min(kWp / 1.25, cap);
    for (var i = 0; i < list.length; i++) {
      if (list[i].spec.kw >= target - 1e-6 && list[i].spec.kw <= cap + 1e-6) return { key: list[i].key, spec: list[i].spec, count: 1 };
    }
    var fits = list.filter(function (x) { return x.spec.kw <= cap + 1e-6; });
    var big = fits.length ? fits[fits.length - 1] : list[0];
    var count = Math.max(1, Math.ceil(target / big.spec.kw - 1e-6));
    while (count > 1 && big.spec.kw * count > cap + 1e-6) count--;
    return { key: big.key, spec: big.spec, count: count };
  }

  function build(kWpTarget) {
    var mod = st.pv.mod;
    var s = site();
    var n = Math.max(1, Math.round(kWpTarget * 1000 / mod.wp));
    var inv = chooseInverter(n * mod.wp / 1000);
    var sd = E.stringDesign(mod, inv.spec, inv.count, n, s, { mount: st.pv.mount, dcLength: +st.pv.dcLength, dcArea: +st.pv.dcArea });
    var used = sd.layout ? sd.layout.modules : n;
    var kWp = used * mod.wp / 1000;
    var kWac = inv.spec.kw * inv.count;
    var proj = {
      site: s, module: mod, kWp: kWp, kWac: kWac, tilt: +st.pv.tilt, azimuth: +st.pv.azimuth, albedo: +st.pv.albedo, mount: st.pv.mount,
      dcLossPct: +st.pv.dcLossPct, acLossPct: +st.pv.acLossPct, invEffPct: inv.spec.eff,
      loadMonthly: loadMonthly(), profile: E.LOAD_PROFILES[st.load.profile].h,
      battery: { kWh: +st.batt.kWh, kW: +st.batt.kW, rtePct: +st.batt.rtePct },
      tariff: tariffObj(), fin: numFin(), ef: +st.ef
    };
    return { proj: proj, sd: sd, inv: inv, n: used };
  }
  function numFin() { var f = {}; for (var k in st.fin) f[k] = +st.fin[k] || 0; return f; }
  function maxModulesOnRoof() {
    var m = st.pv.mod, a = +st.pv.roofArea;
    return a > 0 ? Math.floor(a / (m.l * m.w * 1.15)) : Infinity;
  }

  function calc() {
    var b = build(+st.pv.kWp || 0.5);
    var r = E.run(b.proj);
    var alerts = b.sd.issues.slice();
    var cap = atapCap();
    if (b.proj.kWac > cap + 1e-6) alerts.unshift({ lvl: "err", t: "Inverter capacity " + fmt(b.proj.kWac, 1) + " kWac is above the Solar ATAP limit of " + cap + " kWac for a " + (st.site.phases === 3 ? "three" : "single") + "-phase home." });
    var roofMax = maxModulesOnRoof();
    if (b.n > roofMax) alerts.unshift({ lvl: "err", t: b.n + " modules need about " + fmt(b.n * st.pv.mod.l * st.pv.mod.w * 1.15, 0) + " m² of roof; only " + st.pv.roofArea + " m² is available (fits " + roofMax + ")." });
    var dcac = b.proj.kWp / b.proj.kWac;
    if (dcac > 1.45) alerts.push({ lvl: "warn", t: "DC/AC ratio is " + fmt(dcac, 2) + ". Clipping loses " + fmt(r.pv.clipAnnual, 0) + " kWh a year; check the inverter's maximum DC input." });
    if (dcac < 0.8) alerts.push({ lvl: "info", t: "DC/AC ratio is " + fmt(dcac, 2) + ": the inverter is oversized for the array." });
    if (st.tariff.type === "tnb" && st.tariff.tnb.atap) {
      var lost = r.y1.exp - r.y1.credited;
      if (r.y1.exp > 0 && lost / r.y1.exp > 0.15) alerts.push({ lvl: "warn", t: fmt(lost, 0) + " kWh (" + pct(lost / r.y1.exp) + " of exports) earn no credit under Solar ATAP's monthly reset. A smaller system or a battery would pay back faster." });
    }
    if (r.payback == null) alerts.push({ lvl: "warn", t: "The system does not pay back within " + st.fin.years + " years with these inputs." });
    last = { b: b, r: r, alerts: alerts, site: b.proj.site };
    return last;
  }

  /* ---------- Form ---------- */
  function fNum(path, label, unit, o) {
    o = o || {};
    var v = get(path);
    return '<label class="f' + (o.full ? " full" : "") + '"><span>' + label + '</span>' +
      '<span class="unit"><input type="number" inputmode="decimal" data-k="' + path + '" value="' + esc(v) + '"' +
      (o.step != null ? ' step="' + o.step + '"' : ' step="any"') + (o.min != null ? ' min="' + o.min + '"' : "") + (o.max != null ? ' max="' + o.max + '"' : "") +
      (o.re ? " data-re" : "") + '>' + (unit ? "<em>" + unit + "</em>" : "") + '</span>' + (o.hint ? "<small>" + o.hint + "</small>" : "") + '</label>';
  }
  function fTxt(path, label, o) {
    o = o || {};
    return '<label class="f' + (o.full ? " full" : "") + '"><span>' + label + '</span><input type="text" data-k="' + path + '" value="' + esc(get(path)) + '" placeholder="' + esc(o.ph || "") + '"></label>';
  }
  function fSel(path, label, options, o) {
    o = o || {};
    var v = String(get(path));
    return '<label class="f' + (o.full ? " full" : "") + '"><span>' + label + '</span><select data-k="' + path + '"' + (o.re !== false ? " data-re" : "") + (o.num ? " data-num" : "") + '>' +
      options.map(function (op) { return '<option value="' + esc(op[0]) + '"' + (String(op[0]) === v ? " selected" : "") + '>' + esc(op[1]) + '</option>'; }).join("") +
      '</select>' + (o.hint ? "<small>" + o.hint + "</small>" : "") + '</label>';
  }
  function fChk(path, label, o) {
    o = o || {};
    return '<label class="f f--check' + (o.full ? " full" : "") + '"><input type="checkbox" data-k="' + path + '"' + (get(path) ? " checked" : "") + (o.re ? " data-re" : "") + '><span>' + label + '</span></label>';
  }
  function sec(n, title, body, open) {
    return '<details class="sec"' + (open ? " open" : "") + ' data-sec="' + n + '"><summary><span class="sec__n">' + n + '</span>' + title + '</summary><div class="sec__body">' + body + '</div></details>';
  }
  function sub(title, body) { return '<details class="sub"><summary>' + title + '</summary><div class="sub__grid">' + body + '</div></details>'; }

  function renderForm() {
    var openSecs = {};
    Array.prototype.forEach.call(document.querySelectorAll(".sec"), function (d) { openSecs[d.getAttribute("data-sec")] = d.open; });
    var first = !document.querySelector(".sec");
    function isOpen(n, dflt) { return first ? dflt : !!openSecs[n]; }

    var cityOpts = CITIES.map(function (c) { return [c.n, c.n]; });
    cityOpts.push(["__custom", "Other location (latitude / longitude)"]);
    var s = site();
    var annualGhi = s.ghi.reduce(function (a, x, i) { return a + x * E.DAYS[i]; }, 0);

    var h = "";
    h += sec(1, "Project and branding",
      fTxt("proj.client", "Client name", { ph: "e.g. Mr Tan" }) +
      fTxt("proj.ref", "Proposal ref.", { ph: "e.g. SP-2026-014" }) +
      fTxt("proj.address", "Site address", { full: true, ph: "Street, city" }) +
      fTxt("proj.by", "Prepared by") +
      fTxt("proj.company", "Company / title") +
      fTxt("proj.contact", "Contact line", { full: true }) +
      '<label class="f full"><span>Notes for the client</span><textarea data-k="proj.notes" rows="2" placeholder="Shown in the proposal">' + esc(st.proj.notes) + '</textarea></label>', isOpen(1, false));

    h += sec(2, "Location and climate",
      fSel("site.city", "Location", cityOpts, { full: true, hint: st.site.custom ? "Using NASA POWER data fetched for " + fmt(s.lat, 3) + ", " + fmt(s.lon, 3) + "." : "Built-in NASA POWER climate data." }) +
      ((st.site.city === "__custom") ?
        fNum("site.lat", "Latitude", "°", { step: 0.0001, min: -60, max: 60 }) + fNum("site.lon", "Longitude", "°", { step: 0.0001, min: -180, max: 180 }) +
        '<div class="row-btns"><button type="button" class="btn btn--sm btn--sun" id="btnFetch">Get NASA climate data</button><button type="button" class="btn btn--sm" id="btnGeo">Use my location</button><span class="hint" id="fetchMsg"></span></div>' : "") +
      fSel("site.phases", "Grid connection", [[1, "Single-phase"], [3, "Three-phase"]], { num: true }) +
      '<p class="hint" style="grid-column:auto;align-self:end">Irradiation <b>' + fmt(annualGhi, 0) + ' kWh/m²·yr</b> · mean ' + fmt(s.t.reduce(function (a, x) { return a + x; }, 0) / 12, 1) + ' °C</p>', isOpen(2, true));

    var monthsGrid = "";
    if (st.load.mode === "months") {
      monthsGrid = '<div class="full"><div class="months">' + MONTHS.map(function (m, i) {
        return '<label>' + m + '<input type="number" min="0" step="any" data-k="load.months.' + i + '" value="' + esc(st.load.months[i]) + '"></label>';
      }).join("") + '</div></div>';
    }
    var prof = E.normProfile(E.LOAD_PROFILES[st.load.profile].h);
    var dayShare = prof.slice(7, 19).reduce(function (a, x) { return a + x; }, 0);
    var lm = loadMonthly();
    var annualLoad = lm.reduce(function (a, x) { return a + x; }, 0);
    h += sec(3, "Electricity use",
      fSel("load.mode", "I know my…", [["bill", "Monthly bill"], ["kwh", "Monthly use (kWh)"], ["months", "Use for each month"]]) +
      (st.load.mode === "bill" ? fNum("load.bill", "Average monthly bill", cur(), { min: 0 }) : "") +
      (st.load.mode === "kwh" ? fNum("load.kwh", "Average monthly use", "kWh", { min: 0 }) : "") +
      (st.load.mode === "months" ? '<span></span>' + monthsGrid : "") +
      fSel("load.profile", "When is power used?", Object.keys(E.LOAD_PROFILES).map(function (k) { return [k, E.LOAD_PROFILES[k].name]; }), { full: true }) +
      '<p class="hint">≈ <b>' + fmt(annualLoad / 12, 0) + ' kWh/month</b>, ' + fmt(annualLoad, 0) + ' kWh/year · ' + pct(dayShare) + ' used between 7 am and 7 pm.</p>', isOpen(3, true));

    var modOpts = Object.keys(E.MODULES).map(function (k) { return [k, E.MODULES[k].name]; });
    modOpts.push(["custom", "Custom (edit datasheet values below)"]);
    var invOpts = Object.keys(E.INVERTERS).map(function (k) { return [k, E.INVERTERS[k].name]; });
    invOpts.push(["custom", "Custom (edit values below)"]);
    var roofMax = maxModulesOnRoof();
    h += sec(4, "PV system",
      fNum("pv.kWp", "Target size", "kWp", { step: 0.1, min: 0.5 }) +
      '<div class="f" style="justify-content:flex-end"><button type="button" class="btn btn--sun" id="btnOpt" title="Try every size and pick the best NPV">Find best size</button></div>' +
      fSel("pv.module", "Module", modOpts, { full: true }) +
      sub("Module datasheet values",
        fNum("pv.mod.wp", "Pmax", "W") + fNum("pv.mod.voc", "Voc", "V") + fNum("pv.mod.vmp", "Vmp", "V") + fNum("pv.mod.isc", "Isc", "A") +
        fNum("pv.mod.imp", "Imp", "A") + fNum("pv.mod.noct", "NOCT", "°C") + fNum("pv.mod.bVoc", "Temp. coeff. Voc", "%/°C") + fNum("pv.mod.gPmp", "Temp. coeff. Pmax", "%/°C") +
        fNum("pv.mod.l", "Length", "m") + fNum("pv.mod.w", "Width", "m") + fNum("pv.mod.fuse", "Max series fuse", "A")) +
      fChk("pv.autoInv", "Pick the inverter for me", { re: true, full: true }) +
      (st.pv.autoInv ? "" :
        fSel("pv.inv", "Inverter", invOpts, { full: true }) + fNum("pv.invCount", "Number of inverters", "", { step: 1, min: 1 }) + '<span></span>' +
        sub("Inverter datasheet values",
          fNum("pv.invSpec.kw", "AC rating", "kW") + fSel("pv.invSpec.phases", "Phases", [[1, "1"], [3, "3"]], { num: true, re: false }) +
          fNum("pv.invSpec.vmax", "Max DC voltage", "V") + fNum("pv.invSpec.mpptMin", "MPPT min", "V") + fNum("pv.invSpec.mpptMax", "MPPT max", "V") +
          fNum("pv.invSpec.mppts", "MPPT inputs", "", { step: 1 }) + fNum("pv.invSpec.imax", "Max input current / MPPT", "A") + fNum("pv.invSpec.iscMax", "Max Isc / MPPT", "A") +
          fNum("pv.invSpec.eff", "Efficiency", "%"))) +
      fNum("pv.tilt", "Tilt", "°", { min: 0, max: 90 }) +
      fNum("pv.azimuth", "Facing (azimuth)", "°", { min: 0, max: 360, hint: "0 N · 90 E · 180 S · 270 W" }) +
      fSel("pv.mount", "Mounting", [["open", "Open rack (ground)"], ["roof", "Roof, with air gap"], ["flush", "Flush / in-roof"]], { re: false }) +
      fNum("pv.roofArea", "Usable roof area", "m²", { min: 0, hint: isFinite(roofMax) ? "Fits about " + roofMax + " modules" : "" }) +
      sub("Losses and cabling",
        fNum("pv.dcLossPct", "DC losses", "%", { hint: "Soiling, mismatch, wiring, LID, tolerance" }) +
        fNum("pv.acLossPct", "AC losses", "%", { hint: "AC cable, transformer, downtime" }) +
        fNum("pv.albedo", "Ground reflectance", "", { step: 0.05 }) + '<span></span>' +
        fNum("pv.dcLength", "DC cable run (one way)", "m") + fNum("pv.dcArea", "DC cable size", "mm²")), isOpen(4, true));

    h += sec(5, "Battery (optional)",
      fNum("batt.kWh", "Usable capacity", "kWh", { min: 0, re: true }) + fNum("batt.kW", "Max power", "kW", { min: 0 }) +
      fNum("batt.rtePct", "Round-trip efficiency", "%") +
      '<p class="hint" style="grid-column:auto;align-self:end">Charges from surplus solar, discharges into the evening load.</p>', isOpen(5, false));

    var t = st.tariff;
    var tb = "";
    tb += fSel("tariff.type", "Tariff", [["tnb", "Malaysia · TNB domestic + Solar ATAP"], ["generic", "Any country · custom tariff"]], { full: true });
    if (t.type === "tnb") {
      var b = E.tnbBill(lm[0], st.tariff.tnb, 1);
      tb += fChk("tariff.tnb.atap", "Solar ATAP export credit", { re: true }) + fChk("tariff.tnb.eei", "Energy Efficiency Incentive (EEI)") +
        fNum("tariff.tnb.afa", "AFA surcharge", "sen/kWh", { hint: "Monthly fuel adjustment; 0 if none" }) +
        fNum("tariff.tnb.exportRate", "Export credit rate", "sen/kWh", { hint: "0 = energy charge rate (" + st.tariff.tnb.energyLow + " sen)" }) +
        sub("TNB tariff details (from 1 July 2025)",
          fNum("tariff.tnb.energyLow", "Energy ≤ 1,500 kWh", "sen") + fNum("tariff.tnb.energyHigh", "Energy > 1,500 kWh", "sen") +
          fNum("tariff.tnb.capacity", "Capacity", "sen/kWh") + fNum("tariff.tnb.network", "Network", "sen/kWh") +
          fNum("tariff.tnb.retail", "Retail (above 600 kWh)", "RM/mo") + fNum("tariff.tnb.kwtbbPct", "KWTBB (above 300 kWh)", "%") +
          fNum("tariff.tnb.sstPct", "SST on kWh above 600", "%") + fNum("tariff.tnb.contractYears", "ATAP credit period", "years") +
          fNum("tariff.tnb.maqSunHours", "Export cap (MAQ)", "h × kWac/day")) +
        '<p class="hint">Bill for ' + fmt(lm[0], 0) + ' kWh: <b>RM ' + fmt(b.total, 2) + '</b>. Solar ATAP is for landed homes; condos and other stratified homes are not eligible.</p>';
    } else {
      tb += fTxt("tariff.currency", "Currency symbol") +
        fNum("tariff.gen.importRate", "Import price", cur() + "/kWh", { step: 0.001 }) +
        fNum("tariff.gen.fixed", "Fixed charge", cur() + "/mo") +
        fTxt("tariff.gen.tiers", "Block tariff (optional)", { ph: "200:0.10, 500:0.15, *:0.22" }) +
        fSel("tariff.gen.exportMode", "Export compensation", [["netbilling", "Net billing (paid per kWh)"], ["netmetering", "Net metering (kWh banked, yearly true-up)"], ["none", "No export payment"]], { full: true }) +
        (t.gen.exportMode === "netbilling" ? fNum("tariff.gen.exportRate", "Export price", cur() + "/kWh", { step: 0.001 }) : "") +
        fNum("tariff.gen.contractYears", "Export credit lasts", "years");
    }
    h += sec(6, "Tariff and export rules", tb, isOpen(6, true));

    var f = "";
    f += fNum("fin.capexPerKWp", "Installed cost", cur() + "/kWp", { hint: "Turnkey price incl. installation" }) +
      fNum("fin.fixedCost", "Fixed costs", cur(), { hint: "Permits, meter, survey" });
    if (+st.batt.kWh > 0) f += fNum("fin.battCostPerKWh", "Battery cost", cur() + "/kWh");
    f += fNum("fin.rebate", "Rebate / grant", cur()) +
      (t.type === "tnb" ? '<div class="f" style="justify-content:flex-end"><button type="button" class="btn btn--sm" id="btnSuria" title="RM600 per kWac, up to RM3,000, while quota lasts">Apply SuRIA rebate</button></div>' : '<span></span>') +
      fNum("fin.escPct", "Tariff rise", "%/yr") + fNum("fin.discPct", "Discount rate", "%") +
      sub("Lifetime and O&amp;M",
        fNum("fin.years", "Analysis period", "years", { step: 1 }) + fNum("fin.degrPct", "Module degradation", "%/yr") +
        fNum("fin.omPct", "O&M", "% of cost/yr") + fNum("fin.omEscPct", "O&M inflation", "%/yr") +
        fNum("fin.invReplaceYear", "Replace inverter in year", "", { step: 1 }) + fNum("fin.invReplacePerKWac", "Inverter cost", cur() + "/kWac") +
        fNum("fin.battReplaceYear", "Replace battery in year", "", { step: 1 }) + fNum("ef", "Grid emission factor", "kg/kWh", { hint: "Peninsular MY 2022: 0.769 (ST)" })) +
      sub("Financing",
        fNum("fin.loanPct", "Financed", "%") + fNum("fin.loanRatePct", "Interest", "%/yr") + fNum("fin.loanYears", "Term", "years", { step: 1 }));
    h += sec(7, "Cost and finance", f, isOpen(7, true));

    $("form").innerHTML = h;
  }

  /* Read an input back into state. */
  function onInput(e) {
    var el = e.target, k = el.getAttribute("data-k");
    if (!k) return;
    var v;
    if (el.type === "checkbox") v = el.checked;
    else if (el.type === "number" || el.hasAttribute("data-num")) v = el.value === "" ? 0 : parseFloat(el.value);
    else v = el.value;
    if (k.indexOf("load.months.") === 0) st.load.months[+k.split(".")[2]] = v;
    else if (k === "tariff.type") switchTariff(v);
    else set(k, v);

    var re = el.hasAttribute("data-re") && e.type === "change";
    if (k === "site.city") {
      if (v === "__custom") { st.site.custom = st.site.custom || null; }
      else { st.site.custom = null; var c = site(); st.site.lat = c.lat; st.site.lon = c.lon; }
      // Pick the tariff that suits the place: TNB in Peninsular Malaysia, generic elsewhere.
      if (v !== "__custom") {
        var isMY = / MY$/.test(v);
        if (isMY && st.tariff.type !== "tnb") switchTariff("tnb");
        if (!isMY && st.tariff.type === "tnb") switchTariff("generic");
      }
    }
    if (k === "pv.module" && v !== "custom") st.pv.mod = clone(E.MODULES[v]);
    if (k.indexOf("pv.mod.") === 0) st.pv.module = "custom";
    if (k === "pv.inv" && v !== "custom") st.pv.invSpec = clone(E.INVERTERS[v]);
    if (k.indexOf("pv.invSpec.") === 0) st.pv.inv = "custom";
    if (k === "pv.autoInv" && !v) { var ch = chooseInverterAuto(); st.pv.inv = ch.key; st.pv.invSpec = clone(ch.spec); st.pv.invCount = ch.count; }
    if (k.indexOf("pv.") === 0 || k.indexOf("site.") === 0 || k.indexOf("tariff.") === 0 || k.indexOf("batt.") === 0) sweepRes = null;
    if (re) renderForm();
    schedule(re ? 0 : 150);
  }
  function chooseInverterAuto() { var a = st.pv.autoInv; st.pv.autoInv = true; var r = chooseInverter(+st.pv.kWp); st.pv.autoInv = a; return r; }
  function switchTariff(type) {
    if (st.tariff.type === type) return;
    st.tariff.type = type;
    var fromDefaults = JSON.stringify(st.fin) === JSON.stringify(type === "tnb" ? FIN_GEN : FIN_MY);
    var keep = { years: st.fin.years, discPct: st.fin.discPct };
    st.fin = Object.assign(clone(type === "tnb" ? FIN_MY : FIN_GEN), fromDefaults ? {} : keep);
    if (type === "tnb") st.ef = 0.769;
    toast(type === "tnb" ? "Switched to Malaysian tariff and RM costs" : "Switched to a custom tariff; set the prices for this country");
  }

  var timer;
  function schedule(ms) {
    clearTimeout(timer);
    timer = setTimeout(function () { update(); }, ms);
  }
  function update() {
    try { calc(); } catch (err) { $("panel-results").innerHTML = '<div class="alert alert--err">Could not calculate: ' + esc(err.message) + '</div>'; return; }
    renderPanels();
    storage(JSON.stringify(st));
  }

  /* ---------- Charts (inline SVG) ---------- */
  function nice(max) {
    if (!(max > 0)) return { max: 1, step: 0.25 };
    var raw = max / 4, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var step = [1, 2, 2.5, 5, 10].map(function (x) { return x * mag; }).filter(function (x) { return x >= raw; })[0];
    return { max: Math.ceil(max / step) * step, step: step };
  }
  function short(x) {
    var a = Math.abs(x);
    if (a >= 1e6) return fmt(x / 1e6, 1) + "M";
    if (a >= 1e4) return fmt(x / 1e3, 0) + "k";
    if (a >= 1e3) return fmt(x / 1e3, 1) + "k";
    return fmt(x, a < 10 && a % 1 ? 1 : 0);
  }
  function frame(W, H, pad, yMin, yMax, step, xLabels, yFmt) {
    var g = "";
    var ih = H - pad.t - pad.b;
    for (var v = yMin; v <= yMax + 1e-9; v += step) {
      var y = pad.t + ih - (v - yMin) / (yMax - yMin) * ih;
      g += '<line class="grid" x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + y + '" y2="' + y + '"/>';
      g += '<text x="' + (pad.l - 6) + '" y="' + (y + 3) + '" text-anchor="end">' + (yFmt || short)(v) + '</text>';
    }
    var iw = W - pad.l - pad.r;
    xLabels.forEach(function (lb, i) {
      if (lb == null) return;
      var x = pad.l + (i + 0.5) * iw / xLabels.length;
      g += '<text x="' + x + '" y="' + (H - pad.b + 14) + '" text-anchor="middle">' + esc(lb) + '</text>';
    });
    return g;
  }
  function monthlyChart(rows) {
    var W = 760, H = 250, pad = { l: 44, r: 8, t: 10, b: 22 };
    var max = Math.max.apply(null, rows.map(function (r) { return Math.max(r.load, r.gen); }));
    var sc = nice(max), ih = H - pad.t - pad.b, iw = W - pad.l - pad.r, bw = iw / 12;
    var g = frame(W, H, pad, 0, sc.max, sc.step, MONTHS);
    function y(v) { return pad.t + ih - v / sc.max * ih; }
    rows.forEach(function (r, i) {
      var x0 = pad.l + i * bw + bw * 0.14, w = bw * 0.34;
      g += '<rect class="c-load" x="' + x0 + '" y="' + y(r.load) + '" width="' + w + '" height="' + (ih + pad.t - y(r.load)) + '" rx="2"><title>' + MONTHS[i] + ' use: ' + fmt(r.load, 0) + ' kWh</title></rect>';
      var x1 = x0 + w + bw * 0.04;
      g += '<rect class="c-gen" x="' + x1 + '" y="' + y(r.gen) + '" width="' + w + '" height="' + (ih + pad.t - y(r.gen)) + '" rx="2"><title>' + MONTHS[i] + ' solar: ' + fmt(r.gen, 0) + ' kWh</title></rect>';
      var used = r.self + r.battOut;
      g += '<rect class="c-self" x="' + x1 + '" y="' + y(Math.min(used, r.gen)) + '" width="' + w + '" height="' + (ih + pad.t - y(Math.min(used, r.gen))) + '" rx="2"><title>' + MONTHS[i] + ' solar used on site: ' + fmt(used, 0) + ' kWh</title></rect>';
    });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Monthly electricity use and solar generation">' + g + '</svg>' +
      '<div class="legend"><span><i style="background:var(--cyan)"></i>Use</span><span><i style="background:var(--sun)"></i>Solar exported</span><span><i style="background:var(--green)"></i>Solar used on site</span></div>';
  }
  function dayChart(b, r, m) {
    var W = 440, H = 230;
    var mo = r.pv.months[m];
    var prof = E.normProfile(b.proj.profile);
    var load = prof.map(function (x) { return x * b.proj.loadMonthly[m] / mo.days; });
    var gen = mo.genHourly;
    var pad = { l: 40, r: 8, t: 10, b: 22 };
    var sc = nice(Math.max(Math.max.apply(null, gen), Math.max.apply(null, load)));
    var ih = H - pad.t - pad.b, iw = W - pad.l - pad.r;
    var labels = []; for (var i = 0; i < 24; i++) labels.push(i % 3 === 0 ? String(i).padStart(2, "0") : null);
    var g = frame(W, H, pad, 0, sc.max, sc.step, labels, function (v) { return fmt(v, sc.step < 1 ? 1 : 0); });
    function X(i) { return pad.l + (i + 0.5) * iw / 24; }
    function Y(v) { return pad.t + ih - v / sc.max * ih; }
    var area = "M" + X(0) + "," + Y(0);
    var self = "M" + X(0) + "," + Y(0);
    for (i = 0; i < 24; i++) { area += " L" + X(i) + "," + Y(gen[i]); self += " L" + X(i) + "," + Y(Math.min(gen[i], load[i])); }
    area += " L" + X(23) + "," + Y(0) + " Z"; self += " L" + X(23) + "," + Y(0) + " Z";
    var line = load.map(function (v, j) { return (j ? "L" : "M") + X(j) + "," + Y(v); }).join(" ");
    g += '<path class="c-gen" d="' + area + '" opacity=".85"/>';
    g += '<path class="c-self" d="' + self + '" opacity=".9"/>';
    g += '<path class="s-load" d="' + line + '" fill="none" stroke-width="2.5"/>';
    for (i = 0; i < 24; i++) g += '<rect x="' + (X(i) - iw / 48) + '" y="' + pad.t + '" width="' + iw / 24 + '" height="' + ih + '" fill="transparent"><title>' + String(i).padStart(2, "0") + ':00  solar ' + fmt(gen[i], 2) + ' kW · use ' + fmt(load[i], 2) + ' kW</title></rect>';
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Average day: solar output and use by hour">' + g + '</svg>' +
      '<div class="legend"><span><i style="background:var(--sun)"></i>Solar output (kW)</span><span><i style="background:var(--green)"></i>Used directly</span><span><i style="background:var(--cyan)"></i>Use (kW)</span></div>';
  }
  function cashChart(r, W) {
    W = W || 440;
    var H = W > 600 ? 240 : 230, pad = { l: 52, r: 8, t: 10, b: 22 };
    var cum = [r.flows[0]].concat(r.rows.map(function (x) { return x.cum; }));
    var lo = Math.min(0, Math.min.apply(null, cum)), hi = Math.max(0, Math.max.apply(null, cum));
    var sc = nice(Math.max(Math.abs(lo), Math.abs(hi)));
    var step = sc.step;
    var yMin = Math.floor(lo / step) * step, yMax = Math.ceil(hi / step) * step;
    if (yMax === yMin) yMax = yMin + step;
    var n = cum.length, ih = H - pad.t - pad.b, iw = W - pad.l - pad.r;
    var labels = cum.map(function (_, i) { return i % 5 === 0 ? String(i) : null; });
    var g = frame(W, H, pad, yMin, yMax, step, labels);
    function X(i) { return pad.l + (i + 0.5) * iw / n; }
    function Y(v) { return pad.t + ih - (v - yMin) / (yMax - yMin) * ih; }
    var bw = iw / n * 0.62;
    cum.forEach(function (v, i) {
      var y0 = Y(0), y1 = Y(v);
      g += '<rect class="' + (v < 0 ? "c-neg" : "c-pos") + '" x="' + (X(i) - bw / 2) + '" y="' + Math.min(y0, y1) + '" width="' + bw + '" height="' + Math.max(1, Math.abs(y1 - y0)) + '" rx="1.5"><title>Year ' + i + ': ' + money(v) + ' cumulative</title></rect>';
    });
    g += '<line class="axis" x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + Y(0) + '" y2="' + Y(0) + '"/>';
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Cumulative cash flow by year">' + g + '</svg>' +
      '<div class="legend"><span><i style="background:var(--pink)"></i>Still paying back</span><span><i style="background:var(--green)"></i>In profit</span><span>Year 0 = installation</span></div>';
  }
  function sweepChart(sw, currentKWp) {
    var pts = sw.points;
    var W = 440, H = 230, pad = { l: 52, r: 8, t: 12, b: 26 };
    var vals = pts.map(function (p) { return p.npv; });
    var lo = Math.min(0, Math.min.apply(null, vals)), hi = Math.max(0, Math.max.apply(null, vals));
    var sc = nice(Math.max(Math.abs(lo), Math.abs(hi)));
    var yMin = Math.floor(lo / sc.step) * sc.step, yMax = Math.ceil(hi / sc.step) * sc.step;
    if (yMax === yMin) yMax = yMin + sc.step;
    var ih = H - pad.t - pad.b, iw = W - pad.l - pad.r;
    var x0 = pts[0].kWp, x1 = pts[pts.length - 1].kWp;
    function X(k) { return pad.l + (x1 === x0 ? iw / 2 : (k - x0) / (x1 - x0) * iw); }
    function Y(v) { return pad.t + ih - (v - yMin) / (yMax - yMin) * ih; }
    var g = "";
    for (var v = yMin; v <= yMax + 1e-9; v += sc.step) {
      g += '<line class="grid" x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '"/><text x="' + (pad.l - 6) + '" y="' + (Y(v) + 3) + '" text-anchor="end">' + short(v) + '</text>';
    }
    var ticks = nice(x1 - x0);
    for (var k = Math.ceil(x0 / ticks.step) * ticks.step; k <= x1 + 1e-9; k += ticks.step) g += '<text x="' + X(k) + '" y="' + (H - 8) + '" text-anchor="middle">' + fmt(k, ticks.step < 1 ? 1 : 0) + ' kWp</text>';
    g += '<path class="s-gen" fill="none" stroke-width="2.5" d="' + pts.map(function (p, i) { return (i ? "L" : "M") + X(p.kWp) + "," + Y(p.npv); }).join(" ") + '"/>';
    pts.forEach(function (p) {
      g += '<circle class="c-gen" cx="' + X(p.kWp) + '" cy="' + Y(p.npv) + '" r="' + (p === sw.best ? 6 : 3) + '"' + (p === sw.best ? ' stroke="#fff" stroke-width="2"' : "") + '><title>' + fmt(p.kWp, 2) + ' kWp (' + fmt(p.kWac, 1) + ' kWac): NPV ' + money(p.npv) + ', payback ' + yrs(p.payback) + ', self-use ' + pct(p.self) + '</title></circle>';
    });
    if (currentKWp >= x0 && currentKWp <= x1) g += '<line x1="' + X(currentKWp) + '" x2="' + X(currentKWp) + '" y1="' + pad.t + '" y2="' + (pad.t + ih) + '" stroke="var(--cyan)" stroke-dasharray="4 4"/>';
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Net present value by system size">' + g + '</svg>' +
      '<div class="legend"><span><i style="background:var(--sun)"></i>NPV by size (big dot = best)</span><span><i style="background:var(--cyan)"></i>Current design</span></div>';
  }

  /* ---------- Results panel ---------- */
  function kpi(label, value, subtxt, hero) {
    return '<div class="kpi' + (hero ? " kpi--hero" : "") + '"><div class="kpi__l">' + label + '</div><div class="kpi__v">' + value + '</div>' + (subtxt ? '<div class="kpi__s">' + subtxt + '</div>' : "") + '</div>';
  }
  function gauge(label, lo, hi, okLo, okHi, marks) {
    function P(v) { return Math.max(0, Math.min(100, (v - lo) / (hi - lo) * 100)); }
    return '<div class="gauge"><div class="gauge__lbl"><span>' + label + '</span><span>' + marks.map(function (m) { return esc(m.t); }).join(" · ") + '</span></div>' +
      '<div class="gauge__track"><div class="gauge__ok" style="left:' + P(okLo) + '%;width:' + (P(okHi) - P(okLo)) + '%"></div>' +
      marks.map(function (m) { return '<div class="gauge__mark' + (m.b ? " gauge__mark--b" : "") + '" style="left:calc(' + P(m.v) + '% - 1px)" title="' + esc(m.t) + '"></div>'; }).join("") + '</div></div>';
  }
  function stringCard(b) {
    var sd = b.sd, inv = b.inv, mod = st.pv.mod, L = sd.layout;
    var h = '<dl class="spec">' +
      '<dt>Array</dt><dd>' + b.n + ' × ' + esc(mod.name || (mod.wp + " W module")) + ' = <b>' + fmt(b.proj.kWp, 2) + ' kWp</b></dd>' +
      '<dt>Inverter</dt><dd>' + inv.count + ' × ' + esc(inv.spec.name || (inv.spec.kw + " kW")) + ' = <b>' + fmt(b.proj.kWac, 1) + ' kWac</b> (DC/AC ' + fmt(b.proj.kWp / b.proj.kWac, 2) + ')</dd>';
    if (L) {
      h += '<dt>Strings</dt><dd><b>' + L.strings + ' string' + (L.strings > 1 ? "s" : "") + ' of ' + L.len + '</b> · per MPPT: ' + L.perMppt.join(" / ") + '</dd>' +
        '<dt>Allowed length</dt><dd>' + sd.nMin + '–' + sd.nMax + ' modules (' + fmt(sd.tMin, 0) + ' °C coldest, ' + fmt(sd.tCellMax, 0) + ' °C hottest cell)</dd>' +
        '<dt>Roof area</dt><dd>≈ ' + fmt(b.n * mod.l * mod.w * 1.15, 0) + ' m² incl. spacing</dd>';
    }
    h += '<dt>AC output</dt><dd>' + fmt(sd.iac, 1) + ' A per inverter at ' + sd.vac + ' V → ' + (sd.breaker ? sd.breaker + ' A' : 'large') + ' breaker (curve C)' + '</dd>';
    if (L && L.fuseNeeded) h += '<dt>String fuses</dt><dd>gPV ' + L.fuseMin + '–' + L.fuseMax + ' A, both poles</dd>';
    if (sd.cable) h += '<dt>DC cable</dt><dd>' + st.pv.dcArea + ' mm², ' + st.pv.dcLength + ' m: drop ' + fmt(sd.cable.vd, 1) + ' V (' + fmt(sd.cable.pct, 2) + ' %)</dd>';
    h += '</dl>';
    if (L) {
      var spec = inv.spec;
      h += gauge("String voltage vs inverter (V)", 0, spec.vmax * 1.1, spec.mpptMin, spec.mpptMax, [
        { v: L.vmpHot, t: "Vmp hot " + fmt(L.vmpHot, 0), b: true },
        { v: L.vmpCold, t: "Vmp cold " + fmt(L.vmpCold, 0), b: true },
        { v: L.vocCold, t: "Voc cold " + fmt(L.vocCold, 0) + " / " + spec.vmax + " max" }]);
      h += gauge("Current per MPPT (A)", 0, Math.max(spec.iscMax, L.iscMppt) * 1.1, 0, spec.imax, [
        { v: L.iMppt, t: "Imp " + fmt(L.iMppt, 1) + " / " + spec.imax, b: true },
        { v: L.iscMppt, t: "Isc " + fmt(L.iscMppt, 1) + " / " + spec.iscMax }]);
    }
    return h;
  }
  function monthTable(r, withBills) {
    var rows = r.monthly;
    var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Month</th><th>Use kWh</th><th>Solar kWh</th><th>Used on site</th><th>Exported</th><th>From grid</th>' +
      (withBills ? '<th>Bill before</th><th>Bill after</th><th>Saving</th>' : "") + '</tr></thead><tbody>';
    rows.forEach(function (x) {
      h += '<tr><td>' + MONTHS[x.m] + '</td><td>' + fmt(x.load) + '</td><td>' + fmt(x.gen) + '</td><td>' + fmt(x.self + x.battOut) + '</td><td>' + fmt(x.exp) + '</td><td>' + fmt(x.imp) + '</td>' +
        (withBills ? '<td>' + money(x.billBefore) + '</td><td>' + money(x.billAfter) + '</td><td>' + money(x.billBefore - x.billAfter) + '</td>' : "") + '</tr>';
    });
    var y = r.y1;
    h += '</tbody><tfoot><tr><td>Year 1</td><td>' + fmt(y.load) + '</td><td>' + fmt(y.gen) + '</td><td>' + fmt(y.self + y.battOut) + '</td><td>' + fmt(y.exp) + '</td><td>' + fmt(y.imp) + '</td>' +
      (withBills ? '<td>' + money(y.billBefore) + '</td><td>' + money(y.billAfter) + '</td><td>' + money(y.billBefore - y.billAfter) + '</td>' : "") + '</tr></tfoot></table></div>';
    return h;
  }
  function cashTable(r, every) {
    var h = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Year</th><th>Solar kWh</th><th>Bill before</th><th>Bill after</th><th>Savings</th><th>O&amp;M + parts</th>' + (r.loanPrincipal > 0 ? '<th>Loan</th>' : "") + '<th>Net cash</th><th>Cumulative</th></tr></thead><tbody>';
    h += '<tr><td>0</td><td></td><td></td><td></td><td></td><td></td>' + (r.loanPrincipal > 0 ? '<td></td>' : "") + '<td class="neg">' + money(r.flows[0]) + '</td><td class="neg">' + money(r.flows[0]) + '</td></tr>';
    r.rows.forEach(function (x) {
      if (every && x.year % every !== 0 && x.year !== 1) return;
      h += '<tr><td>' + x.year + '</td><td>' + fmt(x.gen) + '</td><td>' + money(x.billBefore) + '</td><td>' + money(x.billAfter) + '</td><td>' + money(x.savings) + '</td><td>' + money(x.om + x.repl) + '</td>' +
        (r.loanPrincipal > 0 ? '<td>' + money(x.loan) + '</td>' : "") + '<td' + (x.cash < 0 ? ' class="neg"' : "") + '>' + money(x.cash) + '</td><td' + (x.cum < 0 ? ' class="neg"' : "") + '>' + money(x.cum) + '</td></tr>';
    });
    return h + '</tbody></table></div>';
  }

  function renderResults() {
    var b = last.b, r = last.r;
    var h = "";
    if (last.alerts.length) {
      h += '<div class="alerts">' + last.alerts.map(function (a) { return '<div class="alert alert--' + a.lvl + '">' + esc(a.t) + '</div>'; }).join("") + '</div>';
    }
    h += '<div class="kpis">' +
      kpi("Year-1 savings", money(r.savingsY1), money(r.savingsY1 / 12) + " a month", true) +
      kpi("Payback", r.payback == null ? "–" : fmt(r.payback, 1) + " yrs", "Discounted: " + (r.discPayback == null ? "–" : fmt(r.discPayback, 1) + " yrs"), true) +
      kpi("System", fmt(b.proj.kWp, 2) + " kWp", b.n + " modules · " + fmt(b.proj.kWac, 1) + " kWac") +
      kpi("Net cost", money(r.netCapex), money(r.netCapex / b.proj.kWp) + "/kWp" + (r.rebate > 0 ? " after rebate" : "")) +
      kpi("Solar yield", fmt(r.pv.annual) + " kWh", fmt(r.pv.specificYield) + " kWh/kWp · PR " + fmt(r.pv.pr * 100, 1) + "%") +
      kpi("Used on site", pct(r.selfConsumption), "Covers " + pct(r.solarFraction) + " of use") +
      kpi("IRR", r.irr == null ? "–" : pct(r.irr, 1), "NPV " + money(r.npv)) +
      kpi("Solar cost (LCOE)", r.lcoe == null ? "–" : money(r.lcoe, 3) + "/kWh", "vs grid " + money(r.y1.billBefore / Math.max(1, r.y1.load), 3) + "/kWh") +
      kpi(st.fin.years + "-yr net gain", money(r.netGain), "Savings " + money(r.lifetimeSavings)) +
      kpi("CO₂ avoided", fmt(r.co2Y1, 1) + " t/yr", fmt(r.co2Life, 0) + " t over " + st.fin.years + " yrs") +
      '</div>';

    h += '<div class="cards">';
    h += '<div class="card card--wide"><h3>Use vs solar by month <small>kWh, year 1</small></h3>' + monthlyChart(r.monthly) + '</div>';
    h += '<div class="card"><h3>Average day <select id="dayMonth" class="grow" aria-label="Month">' + MONTHS.map(function (m, i) { return '<option value="' + i + '"' + (i === dayMonth ? " selected" : "") + '>' + m + '</option>'; }).join("") + '</select></h3>' + dayChart(b, r, dayMonth) + '</div>';
    h += '<div class="card"><h3>Cumulative cash flow <small>' + cur() + '</small></h3>' + cashChart(r) + '</div>';
    h += '<div class="card"><h3>String design and protection</h3>' + stringCard(b) + '</div>';
    h += '<div class="card"><h3>Size optimiser <button type="button" class="btn btn--sm grow" id="btnOpt2">' + (sweepRes ? "Run again" : "Run") + '</button></h3>' +
      (sweepRes ? sweepChart(sweepRes, b.proj.kWp) +
        '<p class="hint" style="margin-top:8px">Best NPV at <b>' + fmt(sweepRes.best.kWp, 2) + ' kWp</b> (' + fmt(sweepRes.best.kWac, 1) + ' kWac): NPV ' + money(sweepRes.best.npv) + ', payback ' + yrs(sweepRes.best.payback) + '. ' +
        (Math.abs(sweepRes.best.kWp - b.proj.kWp) > 0.01 ? '<button type="button" class="btn btn--sm btn--sun" id="btnApply">Use ' + fmt(sweepRes.best.kWp, 2) + ' kWp</button>' : "This is the current design.") + '</p>'
        : '<p class="hint">Tries every size from one module up to the roof, grid and tariff limits, and shows which one earns the most over the system\'s life (NPV).</p>') + '</div>';
    h += '<div class="card card--wide"><h3>Monthly energy and bills <small>year 1</small></h3>' + monthTable(r, true) + '</div>';
    h += '<div class="card card--wide"><details><summary style="cursor:pointer;font:700 15px var(--f-head)">Year-by-year cash flow</summary><div style="margin-top:10px">' + cashTable(r) + '</div></details></div>';
    h += '</div>';
    $("panel-results").innerHTML = h;
  }

  /* ---------- Proposal ---------- */
  function proposalHTML() {
    var b = last.b, r = last.r, p = st.proj, s = last.site;
    var today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    var client = p.client || "Valued client";
    var tariffName = st.tariff.type === "tnb" ? "TNB domestic tariff (from 1 July 2025)" + (st.tariff.tnb.atap ? " with Solar ATAP export credit" : "") : "the supplied tariff";
    var h = '<article class="paper">';
    h += '<div class="p-head"><div class="p-brand">' + esc(p.by || "") + '<small>' + esc(p.company || "") + '</small><small>' + esc(p.contact || "") + '</small></div>' +
      '<div class="p-meta">' + esc(today) + (p.ref ? '<br>Ref. ' + esc(p.ref) : "") + '</div></div>';
    h += '<h1>Solar PV proposal for ' + esc(client) + '</h1>';
    h += '<p>' + esc(p.address || s.n) + '</p>';
    h += '<p>A <b>' + fmt(b.proj.kWp, 2) + ' kWp</b> rooftop solar system is expected to produce about <b>' + fmt(r.pv.annual) + ' kWh</b> in its first year, covering <b>' + pct(r.solarFraction) +
      '</b> of your electricity use. Under ' + esc(tariffName) + ' it should cut your bills by about <b>' + money(r.savingsY1) + '</b> in year one and pay for itself in about <b>' + (r.payback == null ? "more than " + st.fin.years : fmt(r.payback, 1)) + ' years</b>.</p>';
    h += '<div class="p-kpis">' +
      '<div class="p-kpi"><b>' + fmt(b.proj.kWp, 2) + ' kWp</b><span>System size</span></div>' +
      '<div class="p-kpi"><b>' + money(r.netCapex) + '</b><span>Investment' + (r.rebate > 0 ? " after rebate" : "") + '</span></div>' +
      '<div class="p-kpi"><b>' + money(r.savingsY1) + '</b><span>Savings, year 1</span></div>' +
      '<div class="p-kpi"><b>' + (r.payback == null ? "–" : fmt(r.payback, 1) + ' yrs') + '</b><span>Payback</span></div>' +
      '<div class="p-kpi"><b>' + fmt(r.pv.annual) + '</b><span>kWh a year</span></div>' +
      '<div class="p-kpi"><b>' + (r.irr == null ? "–" : pct(r.irr, 1)) + '</b><span>Return (IRR)</span></div>' +
      '<div class="p-kpi"><b>' + money(r.netGain) + '</b><span>Net gain, ' + st.fin.years + ' years</span></div>' +
      '<div class="p-kpi"><b>' + fmt(r.co2Y1, 1) + ' t</b><span>CO₂ avoided a year</span></div></div>';

    h += '<div class="p-block"><h2>1. Proposed system</h2><div class="p-two"><dl class="spec">' +
      '<dt>Modules</dt><dd>' + b.n + ' × ' + esc(st.pv.mod.name || st.pv.mod.wp + " W") + '</dd>' +
      '<dt>Inverter</dt><dd>' + b.inv.count + ' × ' + esc(b.inv.spec.name || b.inv.spec.kw + " kW") + '</dd>' +
      '<dt>DC / AC</dt><dd>' + fmt(b.proj.kWp, 2) + ' kWp / ' + fmt(b.proj.kWac, 1) + ' kWac</dd>' +
      (b.sd.layout ? '<dt>Strings</dt><dd>' + b.sd.layout.strings + ' × ' + b.sd.layout.len + ' modules</dd>' : "") +
      '<dt>Orientation</dt><dd>' + fmt(+st.pv.tilt) + '° tilt, facing ' + compass(+st.pv.azimuth) + ' (' + fmt(+st.pv.azimuth) + '°)</dd>' +
      '<dt>Roof area</dt><dd>≈ ' + fmt(b.n * st.pv.mod.l * st.pv.mod.w * 1.15) + ' m²</dd>' +
      (+st.batt.kWh > 0 ? '<dt>Battery</dt><dd>' + fmt(+st.batt.kWh, 1) + ' kWh usable, ' + fmt(+st.batt.kW, 1) + ' kW</dd>' : "") +
      '</dl><dl class="spec">' +
      '<dt>Location</dt><dd>' + fmt(s.lat, 3) + ', ' + fmt(s.lon, 3) + '</dd>' +
      '<dt>Sunshine</dt><dd>' + fmt(r.pv.ghiAnnual) + ' kWh/m² a year (' + fmt(r.pv.ghiAnnual / 365, 2) + ' peak sun hours a day)</dd>' +
      '<dt>Specific yield</dt><dd>' + fmt(r.pv.specificYield) + ' kWh/kWp</dd>' +
      '<dt>Performance ratio</dt><dd>' + fmt(r.pv.pr * 100, 1) + ' %</dd>' +
      '<dt>Your use</dt><dd>' + fmt(r.y1.load / 12) + ' kWh a month</dd>' +
      '<dt>Solar used on site</dt><dd>' + pct(r.selfConsumption) + '</dd></dl></div></div>';

    h += '<div class="p-block"><h2>2. Energy, month by month</h2>' + monthlyChart(r.monthly) + '</div>';
    h += '<div class="p-block"><h2>3. Your bills before and after</h2>' + monthTable(r, true) + '</div>';
    h += '<div class="p-block"><h2>4. Return on investment</h2>' + cashChart(r, 760) +
      '<dl class="spec" style="margin-top:12px">' +
      '<dt>Investment</dt><dd>' + money(r.capex) + (r.rebate > 0 ? ' − rebate ' + money(r.rebate) + ' = ' + money(r.netCapex) : "") + '</dd>' +
      (r.loanPrincipal > 0 ? '<dt>Financing</dt><dd>' + money(r.loanPrincipal) + ' over ' + st.fin.loanYears + ' years at ' + st.fin.loanRatePct + ' %: ' + money(r.loanPayment) + ' a year (' + money(r.loanPayment / 12) + ' a month)</dd>' : "") +
      '<dt>Savings over ' + st.fin.years + ' years</dt><dd>' + money(r.lifetimeSavings) + '</dd>' +
      '<dt>Net present value</dt><dd>' + money(r.npv) + ' at ' + st.fin.discPct + ' % discount rate</dd>' +
      '<dt>Cost of solar power</dt><dd>' + (r.lcoe == null ? "–" : money(r.lcoe, 3)) + ' per kWh over the system life</dd></dl>' +
      cashTable(r, 5) + '</div>';
    h += '<div class="p-block"><h2>5. Assumptions</h2><p class="p-small">' + assumptionsText(r).map(esc).join(" ") + '</p>' +
      (p.notes ? '<p>' + esc(p.notes) + '</p>' : "") + '</div>';
    h += '<div class="p-sign"><div>Prepared by ' + esc(p.by || "") + '</div><div>Accepted by ' + esc(p.client || "client") + ', date</div></div>';
    h += '</article>';
    return h;
  }
  function compass(az) { return ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"][Math.round(((az % 360) + 360) % 360 / 45) % 8]; }
  function assumptionsText(r) {
    var f = st.fin, t = st.tariff;
    var a = [
      "Solar output is modelled from NASA POWER long-term monthly climate data using an hour-by-hour average-day simulation (HDKR sky model, NOCT cell temperature, " + st.pv.dcLossPct + " % DC and " + st.pv.acLossPct + " % AC losses, inverter efficiency " + last.b.inv.spec.eff + " %).",
      "Weather varies from year to year, so a single year can be several per cent above or below the estimate.",
      "Modules lose " + f.degrPct + " % of output a year; the tariff rises " + f.escPct + " % a year; O&M costs " + f.omPct + " % of the system price a year.",
      f.invReplaceYear ? "The inverter is replaced in year " + f.invReplaceYear + "." : ""
    ];
    if (t.type === "tnb") {
      a.push("Bills follow the TNB domestic tariff from 1 July 2025 (energy, capacity and network charges, retail charge, EEI rebate, KWTBB and SST)" + (t.tnb.afa ? " with an AFA of " + t.tnb.afa + " sen/kWh" : "") + ".");
      if (t.tnb.atap) a.push("Under Solar ATAP, exported energy is credited at " + (t.tnb.exportRate > 0 ? t.tnb.exportRate + " sen/kWh" : "the energy charge rate") + " up to the energy imported in the same month; unused credit lapses at month end. Credits are assumed for " + t.tnb.contractYears + " years, after which the system is for self-consumption only.");
      a.push("Tariff rules and rebates change; confirm current rates with TNB, SEDA and the Energy Commission.");
    }
    a.push("The design must be confirmed by a site survey, structural check and the final equipment datasheets, and installed by a registered contractor.");
    return a.filter(Boolean);
  }

  /* ---------- Method tab ---------- */
  function methodHTML() {
    return '<div class="prose">' +
      '<h3>What this tool does</h3><p>SolarSpec turns a location, an electricity bill and a roof into a full early-stage design: system size, string layout and protection, hour-by-hour self-consumption, monthly bills under the real tariff, a ' + st.fin.years + '-year cash flow and a client-ready proposal. Everything runs in your browser; nothing is uploaded.</p>' +
      '<h3>Solar model</h3><ul>' +
      '<li><b>Climate.</b> NASA POWER long-term monthly means of global and diffuse irradiation and temperature (built in for 38 cities, fetched live for any other point).</li>' +
      '<li><b>Average day.</b> For each month, Klein\'s representative day is split into 6-minute steps with the Collares-Pereira &amp; Rabl (global) and Liu &amp; Jordan (diffuse) profiles, scaled to match the monthly totals exactly.</li>' +
      '<li><b>Plane of array.</b> HDKR anisotropic sky model (beam, circumsolar, horizon brightening, ground reflection), with an ASHRAE incidence-angle modifier.</li>' +
      '<li><b>Temperature and power.</b> NOCT cell temperature with a mounting adder and a sinusoidal daily temperature swing, the module\'s Pmax coefficient, DC and AC losses, inverter efficiency and clipping at the AC rating.</li>' +
      '<li><b>Self-consumption.</b> Hourly PV against an hourly load shape; an optional battery charges from surplus and discharges to the load.</li></ul>' +
      '<h3>Validation against PVGIS</h3><p>Annual specific yield (kWh/kWp) compared with the EU Joint Research Centre\'s PVGIS 5.3 for the same tilt, azimuth and 12.6 % system losses. Most of the gap comes from the different irradiance databases (NASA POWER vs PVGIS-SARAH/ERA5).</p>' +
      '<div class="tbl-wrap"><table class="tbl" style="max-width:560px"><thead><tr><th>Site</th><th>Tilt / facing</th><th>SolarSpec</th><th>PVGIS</th><th>Diff.</th></tr></thead><tbody>' +
      [["Kuala Lumpur", "10° S", 1396, 1394], ["Kuala Lumpur", "20° E", 1358, 1371], ["Kota Kinabalu", "10° S", 1461, 1405], ["Lagos", "10° S", 1356, 1429], ["Riyadh", "25° S", 1896, 1804], ["Houston", "25° S", 1497, 1422], ["Perth", "30° N", 1802, 1719], ["London", "35° S", 1088, 1035]]
        .map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + '</td><td>' + x[2] + '</td><td>' + x[3] + '</td><td>' + (x[2] >= x[3] ? "+" : "") + fmt((x[2] / x[3] - 1) * 100, 1) + ' %</td></tr>'; }).join("") +
      '</tbody></table></div>' +
      '<h3>String sizing</h3><ul><li>Maximum length: Voc at the record low temperature (NASA, minus 2 °C) must stay under the inverter\'s maximum DC voltage, and Vmp when cold under the MPPT maximum.</li>' +
      '<li>Minimum length: Vmp at the hottest cell temperature (record high air temperature plus NOCT heating at 1,000 W/m²) must stay above the MPPT minimum.</li>' +
      '<li>Strings in parallel are limited by the inverter\'s input current and short-circuit current per MPPT; three or more in parallel need string fuses of 1.5–2.4 × Isc (IEC 62548).</li>' +
      '<li>AC breaker: next standard size at or above 1.25 × the inverter\'s rated current. DC voltage drop: copper at 70 °C, both conductors.</li></ul>' +
      '<h3>Malaysian tariff (TNB domestic, from 1 July 2025)</h3><ul>' +
      '<li>Energy charge 27.03 sen/kWh (37.03 sen if the month\'s use is above 1,500 kWh), capacity 4.55 sen/kWh, network 12.85 sen/kWh, retail charge RM10 a month above 600 kWh.</li>' +
      '<li>Energy Efficiency Incentive rebate from 25 sen/kWh (≤ 200 kWh) down to 0.5 sen/kWh (901–1,000 kWh); KWTBB 1.6 % above 300 kWh; SST 8 % on the share of use above 600 kWh; AFA as entered.</li>' +
      '<li><b>Solar ATAP</b> (from 1 January 2026): self-consumed solar avoids the full rate; exports are credited at the energy charge rate, only up to the month\'s imports and the export cap, and unused credit lapses at month end. Limits: 5 kWac single-phase, 15 kWac three-phase; landed homes only.</li>' +
      '<li>Grid emission factor: 0.769 kg CO₂e/kWh (Energy Commission, Peninsular Malaysia 2022, provisional).</li></ul>' +
      '<p>These rates come from public announcements and secondary sources. Check them against the Energy Commission\'s guideline GP/ST/No. 60/2025 and TNB\'s current tariff book before quoting, and edit them in section 6 if they change.</p>' +
      '<h3>Limits</h3><ul><li>Average-day modelling smooths out cloudy and sunny days, so self-consumption is slightly optimistic and clipping slightly pessimistic.</li><li>No shading model: enter extra DC loss for partial shading, or run a 3D tool (PVsyst, PV*SOL, SketchUp + Skelion) for shaded roofs.</li><li>Not a substitute for a professional engineer\'s design or a registered installer\'s survey.</li></ul>' +
      '</div>';
  }

  function renderPanels() {
    if (!last) return;
    if (tab === "results") renderResults();
    if (tab === "proposal") $("panel-proposal").innerHTML = proposalHTML();
    if (tab === "method") $("panel-method").innerHTML = methodHTML();
  }

  /* ---------- Actions ---------- */
  function optimise() {
    var s = site();
    var cap = atapCap();
    var mod = st.pv.mod;
    var roofMax = maxModulesOnRoof();
    var annual = loadMonthly().reduce(function (a, x) { return a + x; }, 0);
    var yieldGuess = Math.max(700, (last ? last.r.pv.specificYield : 1300));
    var maxKWp = Math.min(isFinite(roofMax) ? roofMax * mod.wp / 1000 : Infinity, isFinite(cap) ? cap * 1.4 : Infinity, Math.max(2, annual / yieldGuess * 2));
    var minKWp = mod.wp / 1000;
    if (!(maxKWp > minKWp)) { toast("Not enough room for more than one module"); return; }
    var step = Math.max(mod.wp / 1000, Math.round((maxKWp - minKWp) / 30 / (mod.wp / 1000)) * mod.wp / 1000);
    sweepRes = E.sweep(function (k) {
      var bb = build(k);
      if (!bb.sd.layout || bb.n > roofMax || bb.proj.kWac > cap + 1e-6) return null;
      return bb.proj;
    }, minKWp, maxKWp, step);
    if (!sweepRes.best) { sweepRes = null; toast("No valid size found: check the inverter and roof inputs"); return; }
    // Collapse duplicate sizes (string rounding can map two targets to one design).
    var seen = {};
    sweepRes.points = sweepRes.points.filter(function (p) { var k = p.kWp.toFixed(3); if (seen[k]) return false; seen[k] = 1; return true; });
    if (tab !== "results") setTab("results");
    renderResults();
    toast("Best NPV at " + fmt(sweepRes.best.kWp, 2) + " kWp");
  }

  function csv() {
    if (!last) return;
    var r = last.r, lines = [];
    function row(a) { lines.push(a.map(function (x) { var s = String(x == null ? "" : x); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(",")); }
    row(["SolarSpec export", st.proj.client, new Date().toISOString().slice(0, 10)]);
    row(["System kWp", last.b.proj.kWp.toFixed(2), "kWac", last.b.proj.kWac]);
    row([]);
    row(["Month", "Use kWh", "Solar kWh", "Used on site kWh", "Exported kWh", "Credited kWh", "From grid kWh", "Bill before", "Bill after"]);
    r.monthly.forEach(function (x) { row([MONTHS[x.m], x.load.toFixed(1), x.gen.toFixed(1), (x.self + x.battOut).toFixed(1), x.exp.toFixed(1), (x.credited || 0).toFixed(1), x.imp.toFixed(1), x.billBefore.toFixed(2), x.billAfter.toFixed(2)]); });
    row([]);
    row(["Year", "Solar kWh", "Bill before", "Bill after", "Savings", "O&M", "Replacements", "Loan", "Net cash", "Cumulative"]);
    row([0, "", "", "", "", "", "", "", r.flows[0].toFixed(2), r.flows[0].toFixed(2)]);
    r.rows.forEach(function (x) { row([x.year, x.gen.toFixed(0), x.billBefore.toFixed(2), x.billAfter.toFixed(2), x.savings.toFixed(2), x.om.toFixed(2), x.repl.toFixed(2), x.loan.toFixed(2), x.cash.toFixed(2), x.cum.toFixed(2)]); });
    download("solarspec-" + slug(st.proj.client) + ".csv", lines.join("\n"), "text/csv");
  }

  function encodeState() {
    var json = JSON.stringify(st);
    return btoa(unescape(encodeURIComponent(json)));
  }
  function decodeState(s) {
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  }
  function load(obj) {
    st = merge(defaults(), obj);
    sweepRes = null;
    renderForm();
    update();
  }

  function fetchNasa() {
    var lat = +st.site.lat, lon = +st.site.lon, msg = $("fetchMsg");
    if (!(lat >= -60 && lat <= 60 && lon >= -180 && lon <= 180)) { if (msg) msg.textContent = "Enter a latitude between −60 and 60 and a longitude between −180 and 180."; return; }
    if (msg) msg.textContent = "Fetching from NASA POWER…";
    var url = "https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=ALLSKY_SFC_SW_DWN,ALLSKY_SFC_SW_DIFF,T2M,T2M_RANGE,T2M_MIN,T2M_MAX&community=RE&format=JSON&latitude=" + lat + "&longitude=" + lon;
    fetch(url).then(function (res) { if (!res.ok) throw new Error("NASA POWER replied " + res.status); return res.json(); }).then(function (d) {
      var P = d.properties.parameter, K = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      function arr(k) { return K.map(function (m) { return P[k][m]; }); }
      var ghi = arr("ALLSKY_SFC_SW_DWN");
      if (ghi.some(function (x) { return !(x > 0); })) throw new Error("no irradiance data for this point");
      var dhi = arr("ALLSKY_SFC_SW_DIFF").map(function (x) { return x > 0 ? x : 0; });
      st.site.custom = { n: "Custom " + lat.toFixed(3) + ", " + lon.toFixed(3), lat: lat, lon: lon, ghi: ghi, dhi: dhi, t: arr("T2M"), tr: arr("T2M_RANGE"), tmin: P.T2M_MIN.ANN, tmax: P.T2M_MAX.ANN };
      sweepRes = null;
      renderForm(); update();
      toast("Climate data loaded");
    }).catch(function (err) { var m = $("fetchMsg"); if (m) m.textContent = "Could not fetch: " + err.message + ". Pick a nearby built-in city instead."; });
  }

  function setTab(name) {
    tab = name;
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      var on = t.getAttribute("data-tab") === name;
      t.classList.toggle("is-on", on); t.setAttribute("aria-selected", on ? "true" : "false");
    });
    ["results", "proposal", "method"].forEach(function (n) { $("panel-" + n).hidden = n !== name; });
    renderPanels();
  }

  function printProposal() {
    if (!last) return;
    $("print").innerHTML = proposalHTML();
    window.print();
  }

  /* ---------- Events ---------- */
  function bind() {
    var form = $("form");
    form.addEventListener("input", onInput);
    form.addEventListener("change", onInput);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    form.addEventListener("click", function (e) {
      var id = e.target.id;
      if (id === "btnOpt") optimise();
      if (id === "btnFetch") fetchNasa();
      if (id === "btnGeo") {
        if (!navigator.geolocation) { toast("Location is not available in this browser"); return; }
        navigator.geolocation.getCurrentPosition(function (pos) {
          st.site.lat = +pos.coords.latitude.toFixed(4); st.site.lon = +pos.coords.longitude.toFixed(4);
          renderForm(); fetchNasa();
        }, function () { toast("Location permission was refused"); });
      }
      if (id === "btnSuria") {
        var kWac = last ? last.b.proj.kWac : 5;
        st.fin.rebate = Math.min(600 * kWac, 3000);
        renderForm(); update(); toast("SuRIA rebate: RM " + fmt(st.fin.rebate));
      }
    });
    $("panel-results").addEventListener("change", function (e) {
      if (e.target.id === "dayMonth") { dayMonth = +e.target.value; renderResults(); }
    });
    $("panel-results").addEventListener("click", function (e) {
      if (e.target.id === "btnOpt2") optimise();
      if (e.target.id === "btnApply" && sweepRes) {
        st.pv.kWp = +sweepRes.best.kWp.toFixed(2);
        renderForm(); update(); toast("Design set to " + fmt(st.pv.kWp, 2) + " kWp");
      }
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      t.addEventListener("click", function () { setTab(t.getAttribute("data-tab")); });
    });
    $("btnPrint").addEventListener("click", printProposal);
    window.addEventListener("beforeprint", function () { if (last && !$("print").innerHTML) $("print").innerHTML = proposalHTML(); });
    window.addEventListener("afterprint", function () { $("print").innerHTML = ""; });
    $("btnCsv").addEventListener("click", csv);
    $("btnSave").addEventListener("click", function () {
      download("solarspec-" + slug(st.proj.client) + ".json", JSON.stringify(st, null, 2), "application/json");
    });
    $("fileOpen").addEventListener("change", function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var rd = new FileReader();
      rd.onload = function () {
        try { load(JSON.parse(rd.result)); toast("Project opened"); }
        catch (err) { toast("That file is not a SolarSpec project"); }
      };
      rd.readAsText(file);
      e.target.value = "";
    });
    $("btnNew").addEventListener("click", function () {
      if (!confirm("Start a new project? Unsaved changes to this one will be lost.")) return;
      history.replaceState(null, "", location.pathname);
      load(defaults());
    });
    $("btnShare").addEventListener("click", function () {
      var url = location.origin + location.pathname + "#p=" + encodeState();
      function done() { toast("Link copied: it opens this exact design"); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { prompt("Copy this link:", url); });
      else prompt("Copy this link:", url);
    });
  }

  /* ---------- Start ---------- */
  function start() {
    var initial = null;
    var m = location.hash.match(/^#p=(.+)$/);
    if (m) { try { initial = decodeState(m[1]); } catch (e) { initial = null; } }
    if (!initial) { try { initial = JSON.parse(storage() || "null"); } catch (e) { initial = null; } }
    if (initial) st = merge(defaults(), initial);
    if (st.site.city !== "__custom" && !CITIES.some(function (c) { return c.n === st.site.city; })) st.site.city = CITIES[0].n;
    bind();
    renderForm();
    update();
  }
  start();
})();
