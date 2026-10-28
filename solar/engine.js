/*
  SolarSpec calculation engine. No DOM code lives here, so the same file
  runs in the browser and in Node (see test.js).

  Method, in order:
    1. Climate: monthly GHI, diffuse and temperature (NASA POWER).
    2. Average day per month (Klein's representative days). Daily GHI is
       split into 6-minute steps with Collares-Pereira & Rabl (total) and
       Liu & Jordan (diffuse) profiles.
    3. Plane-of-array irradiance with the HDKR anisotropic sky model
       (Hay-Davies-Klucher-Reindl) and an ASHRAE incidence-angle modifier.
    4. Cell temperature from NOCT plus a mounting adder, power with the
       module's temperature coefficient, DC and AC losses, inverter
       efficiency and AC clipping.
    5. Hourly load profile against hourly PV, with an optional battery,
       gives self-consumption, export and grid import.
    6. Monthly bills under the chosen tariff (TNB domestic with Solar
       ATAP, or a generic tariff), then a year-by-year cash flow with
       degradation, escalation, O&M, replacements and an optional loan.

  Units: kW, kWh, m2, °C, money in the project currency.
*/
(function (root) {
  "use strict";

  var D2R = Math.PI / 180;
  var GSC = 1367; // solar constant, W/m2
  var DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var REP_DAY = [17, 47, 75, 105, 135, 162, 198, 228, 258, 288, 318, 344];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var STEPS = 10; // sub-steps per hour

  function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }
  function sum(a) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i]; return s; }

  /* ---------------------------------------------------------------
     Equipment presets. Generic values typical of current datasheets;
     replace them with the real datasheet for a final design.
  --------------------------------------------------------------- */
  var MODULES = {
    m450: { name: "Generic 450 W mono PERC (144 half-cell, 166 mm)", wp: 450, voc: 49.5, vmp: 41.5, isc: 11.6, imp: 10.85, bVoc: -0.27, gPmp: -0.35, noct: 45, l: 2.094, w: 1.038, fuse: 20 },
    m550: { name: "Generic 550 W mono PERC (144 half-cell, 182 mm)", wp: 550, voc: 49.9, vmp: 41.96, isc: 14.0, imp: 13.11, bVoc: -0.27, gPmp: -0.35, noct: 45, l: 2.278, w: 1.134, fuse: 25 },
    m585: { name: "Generic 585 W n-type TOPCon (144 half-cell, 182 mm)", wp: 585, voc: 52.1, vmp: 43.4, isc: 14.2, imp: 13.48, bVoc: -0.25, gPmp: -0.29, noct: 43, l: 2.278, w: 1.134, fuse: 25 },
    m620: { name: "Generic 620 W n-type TOPCon (132 half-cell, 210R)", wp: 620, voc: 48.6, vmp: 40.5, isc: 16.1, imp: 15.31, bVoc: -0.25, gPmp: -0.29, noct: 43, l: 2.382, w: 1.134, fuse: 30 }
  };

  var INVERTERS = {
    i3s:  { name: "Generic 3 kW single-phase (1 MPPT)", kw: 3, phases: 1, vmax: 600, mpptMin: 90, mpptMax: 550, mppts: 1, imax: 16, iscMax: 20, eff: 97.0 },
    i5s:  { name: "Generic 5 kW single-phase (2 MPPT)", kw: 5, phases: 1, vmax: 600, mpptMin: 90, mpptMax: 550, mppts: 2, imax: 16, iscMax: 20, eff: 97.2 },
    i5h:  { name: "Generic 5 kW single-phase hybrid (2 MPPT)", kw: 5, phases: 1, vmax: 600, mpptMin: 120, mpptMax: 500, mppts: 2, imax: 16, iscMax: 23, eff: 96.8, hybrid: true },
    i6h:  { name: "Generic 6 kW single-phase hybrid (2 MPPT)", kw: 6, phases: 1, vmax: 600, mpptMin: 120, mpptMax: 500, mppts: 2, imax: 16, iscMax: 23, eff: 96.8, hybrid: true },
    i10h: { name: "Generic 10 kW three-phase hybrid (2 MPPT)", kw: 10, phases: 3, vmax: 1000, mpptMin: 160, mpptMax: 850, mppts: 2, imax: 20, iscMax: 30, eff: 97.6, hybrid: true },
    i8t:  { name: "Generic 8 kW three-phase (2 MPPT)", kw: 8, phases: 3, vmax: 1100, mpptMin: 160, mpptMax: 1000, mppts: 2, imax: 16, iscMax: 20, eff: 97.8 },
    i10t: { name: "Generic 10 kW three-phase (2 MPPT)", kw: 10, phases: 3, vmax: 1100, mpptMin: 160, mpptMax: 1000, mppts: 2, imax: 20, iscMax: 30, eff: 98.0 },
    i15t: { name: "Generic 15 kW three-phase (2 MPPT)", kw: 15, phases: 3, vmax: 1100, mpptMin: 180, mpptMax: 1000, mppts: 2, imax: 32, iscMax: 40, eff: 98.2 },
    i25t: { name: "Generic 25 kW three-phase (3 MPPT)", kw: 25, phases: 3, vmax: 1100, mpptMin: 180, mpptMax: 1000, mppts: 3, imax: 32, iscMax: 40, eff: 98.4 },
    i50t: { name: "Generic 50 kW three-phase (4 MPPT)", kw: 50, phases: 3, vmax: 1100, mpptMin: 200, mpptMax: 1000, mppts: 4, imax: 42, iscMax: 55, eff: 98.6 }
  };

  /* Hourly load shapes (fractions of the day's use, hour 0 = 00:00-01:00). */
  var LOAD_PROFILES = {
    home: { name: "Home, out at work (evening peak)", h: [2.6, 2.3, 2.2, 2.1, 2.1, 2.4, 3.6, 4.3, 3.6, 3.0, 2.9, 3.0, 3.2, 3.2, 3.2, 3.4, 3.8, 4.6, 5.8, 6.6, 6.9, 6.7, 5.6, 4.0] },
    homeDay: { name: "Home, someone in all day", h: [2.5, 2.2, 2.1, 2.0, 2.0, 2.3, 3.2, 3.8, 4.0, 4.2, 4.5, 4.8, 5.0, 5.0, 4.9, 4.8, 4.6, 4.8, 5.4, 5.9, 6.0, 5.7, 4.7, 3.6] },
    office: { name: "Office or shop, weekdays 9-6", h: [1.2, 1.2, 1.2, 1.2, 1.2, 1.3, 2.0, 4.0, 6.8, 7.4, 7.6, 7.7, 7.5, 7.6, 7.7, 7.6, 7.3, 6.2, 3.2, 2.0, 1.6, 1.4, 1.3, 1.2] },
    factory: { name: "Factory, two shifts (6 am - 10 pm)", h: [1.4, 1.3, 1.3, 1.3, 1.4, 2.5, 5.6, 6.0, 6.1, 6.2, 6.2, 6.1, 5.8, 6.1, 6.2, 6.2, 6.0, 5.6, 5.2, 4.9, 4.6, 4.1, 2.2, 1.5] },
    flat: { name: "Flat, round the clock", h: [] }
  };
  for (var fi = 0; fi < 24; fi++) LOAD_PROFILES.flat.h.push(1);
  function normProfile(h) { var s = sum(h); return h.map(function (x) { return x / s; }); }

  /* ---------------------------------------------------------------
     1-3. Irradiance on the plane of array, average day of month m.
     Returns 24 hourly values in kWh/m2 (= mean kW/m2 over the hour),
     plus the effective value after the incidence-angle modifier.
  --------------------------------------------------------------- */
  function declination(n) { return 23.45 * Math.sin(D2R * 360 * (284 + n) / 365); }

  function erbsMonthlyDiffuse(Kt, wsDeg) {
    Kt = clamp(Kt, 0.3, 0.8);
    if (wsDeg <= 81.4) return 1.391 - 3.560 * Kt + 4.189 * Kt * Kt - 2.137 * Kt * Kt * Kt;
    return 1.311 - 3.022 * Kt + 3.427 * Kt * Kt - 1.821 * Kt * Kt * Kt;
  }

  function poaDay(site, m, tiltDeg, azimuthDeg, albedo) {
    var n = REP_DAY[m];
    var phi = site.lat * D2R, dec = declination(n) * D2R;
    var beta = tiltDeg * D2R, gamma = (azimuthDeg - 180) * D2R; // 0 = facing south, west positive
    var E0 = 1 + 0.033 * Math.cos(D2R * 360 * n / 365);
    var cosWs = clamp(-Math.tan(phi) * Math.tan(dec), -1, 1);
    var ws = Math.acos(cosWs);
    var H0 = 24 / Math.PI * GSC * E0 * (Math.cos(phi) * Math.cos(dec) * Math.sin(ws) + ws * Math.sin(phi) * Math.sin(dec)) / 1000;
    var H = site.ghi[m];
    var Kt = H0 > 0 ? H / H0 : 0;
    var Hd = site.dhi && site.dhi[m] > 0 ? Math.min(site.dhi[m], H) : H * erbsMonthlyDiffuse(Kt, ws / D2R);

    var a = 0.409 + 0.5016 * Math.sin(ws - 60 * D2R);
    var b = 0.6609 - 0.4767 * Math.sin(ws - 60 * D2R);
    var denom = Math.sin(ws) - ws * Math.cos(ws);
    var sb = Math.sin(dec), cd = Math.cos(dec), sp = Math.sin(phi), cp = Math.cos(phi);
    var cb = Math.cos(beta), sbe = Math.sin(beta), cg = Math.cos(gamma), sg = Math.sin(gamma);

    // First pass: raw step profiles, so they can be scaled to the monthly totals exactly.
    var stepsI = [], stepsD = [], stepW = [], totI = 0, totD = 0;
    for (var s = 0; s < 24 * STEPS; s++) {
      var t = (s + 0.5) / STEPS;
      var w = (t - 12) * 15 * D2R;
      var cw = Math.cos(w);
      var rt = 0, rd = 0;
      if (cw > cosWs) {
        rt = (a + b * cw) * (cw - cosWs) / denom;
        rd = (cw - cosWs) / denom;
      }
      stepsI.push(rt); stepsD.push(rd); stepW.push(w);
      totI += rt; totD += rd;
    }
    var hourly = [], hourlyEff = [];
    for (var hh = 0; hh < 24; hh++) { hourly.push(0); hourlyEff.push(0); }
    var poaTotal = 0;
    for (s = 0; s < stepsI.length; s++) {
      if (stepsI[s] <= 0) continue;
      var I = H * stepsI[s] / totI;               // kWh/m2 in this step
      var Id = Math.min(I, Hd * stepsD[s] / totD);
      w = stepW[s];
      var cz = cp * cd * Math.cos(w) + sp * sb;
      if (cz <= 0) continue;
      if (cz < 0.06) Id = I; // sun within ~3.5° of the horizon: treat it all as diffuse
      var Ib = I - Id;
      var I0 = GSC * E0 * cz / 1000 / STEPS;      // extraterrestrial on horizontal, kWh/m2
      var cosT = sb * sp * cb - sb * cp * sbe * cg + cd * cp * cb * Math.cos(w)
               + cd * sp * sbe * cg * Math.cos(w) + cd * sbe * sg * Math.sin(w);
      var Rb = Ib > 0 ? Math.max(0, cosT) / cz : 0;
      var Ai = I0 > 0 ? clamp(Ib / I0, 0, 1) : 0;
      var f = I > 0 ? Math.sqrt(Ib / I) : 0;
      var sh = Math.sin(beta / 2);
      var beamPart = (Ib + Id * Ai) * Rb;
      var diffPart = Id * (1 - Ai) * (1 + cb) / 2 * (1 + f * sh * sh * sh);
      var gndPart = I * albedo * (1 - cb) / 2;
      var It = beamPart + diffPart + gndPart;
      // ASHRAE incidence angle modifier (b0 = 0.05) on the beam, fixed 0.95 on diffuse and ground.
      var iam = cosT > 0.087 ? Math.max(0, 1 - 0.05 * (1 / cosT - 1)) : 0;
      var eff = beamPart * iam + (diffPart + gndPart) * 0.95;
      var hr = Math.floor(s / STEPS);
      hourly[hr] += It; hourlyEff[hr] += eff; poaTotal += It;
    }
    return { poa: hourly, poaEff: hourlyEff, poaDaily: poaTotal, H: H, Hd: Hd, H0: H0, Kt: Kt, dayLength: 2 * ws / D2R / 15 };
  }

  /* ---------------------------------------------------------------
     4. PV output for the average day of each month.
  --------------------------------------------------------------- */
  var MOUNT_ADDER = { open: 0, roof: 3, flush: 10 }; // °C added to NOCT

  function simulatePV(site, sys) {
    var mod = sys.module;
    var kWp = sys.kWp, kWac = sys.kWac;
    var dcLoss = sys.dcLossPct / 100, acLoss = sys.acLossPct / 100;
    var invEff = sys.invEffPct / 100;
    var noct = mod.noct + (MOUNT_ADDER[sys.mount] || 0);
    var months = [];
    for (var m = 0; m < 12; m++) {
      var p = poaDay(site, m, sys.tilt, sys.azimuth, sys.albedo);
      var gen = [], tcell = [], clip = 0, dcDay = 0;
      for (var h = 0; h < 24; h++) {
        var G = p.poa[h] * 1000;               // mean W/m2 over the hour
        var Geff = p.poaEff[h] * 1000;
        var ta = site.t[m] + (site.tr ? site.tr[m] : 8) / 2 * Math.cos(2 * Math.PI * (h + 0.5 - 15) / 24);
        var tc = ta + (noct - 20) / 800 * G;
        var pdc = kWp * Geff / 1000 * (1 + mod.gPmp / 100 * (tc - 25)) * (1 - dcLoss);
        pdc = Math.max(0, pdc);
        var pacRaw = pdc * invEff;
        var pac = Math.min(pacRaw, kWac);
        clip += pacRaw - pac;
        dcDay += pdc;
        gen.push(pac * (1 - acLoss));
        tcell.push(G > 50 ? tc : null);
      }
      var day = sum(gen);
      months.push({
        m: m, days: DAYS[m], ghi: p.H, dhi: p.Hd, poa: p.poaDaily, kt: p.Kt,
        genHourly: gen, genDay: day, energy: day * DAYS[m], clipDay: clip,
        tcellMax: Math.max.apply(null, tcell.filter(function (x) { return x !== null; }).concat([site.t[m]])),
        pr: p.poaDaily > 0 ? day / (p.poaDaily * kWp) : 0
      });
    }
    var annual = sum(months.map(function (x) { return x.energy; }));
    var poaAnnual = sum(months.map(function (x) { return x.poa * x.days; }));
    var ghiAnnual = sum(months.map(function (x) { return x.ghi * x.days; }));
    return {
      months: months, annual: annual, specificYield: kWp > 0 ? annual / kWp : 0,
      poaAnnual: poaAnnual, ghiAnnual: ghiAnnual,
      pr: kWp > 0 && poaAnnual > 0 ? annual / (poaAnnual * kWp) : 0,
      transpositionGain: ghiAnnual > 0 ? poaAnnual / ghiAnnual - 1 : 0,
      clipAnnual: sum(months.map(function (x) { return x.clipDay * x.days; }))
    };
  }

  /* ---------------------------------------------------------------
     5. Energy flows: load vs PV, with an optional battery.
     The average day is run twice so the battery starts the counted
     day at its steady-state charge.
  --------------------------------------------------------------- */
  function energyFlows(genHourly, loadHourly, batt) {
    var cap = batt && batt.kWh > 0 ? batt.kWh : 0;
    var pmax = batt && batt.kW > 0 ? batt.kW : 0;
    var ef = cap > 0 ? Math.sqrt((batt.rtePct || 90) / 100) : 1;
    var soc = 0, out;
    for (var pass = 0; pass < 2; pass++) {
      var self = 0, exp = 0, imp = 0, chg = 0, dis = 0;
      for (var h = 0; h < 24; h++) {
        var g = genHourly[h], l = loadHourly[h];
        var direct = Math.min(g, l);
        self += direct;
        var surplus = g - direct, deficit = l - direct;
        if (cap > 0 && surplus > 0) {
          var c = Math.min(surplus, pmax, (cap - soc) / ef);
          soc += c * ef; chg += c; surplus -= c;
        }
        if (cap > 0 && deficit > 0) {
          var d = Math.min(deficit, pmax, soc * ef);
          soc -= d / ef; dis += d; deficit -= d;
        }
        exp += surplus; imp += deficit;
      }
      out = { self: self, battOut: dis, battIn: chg, exp: exp, imp: imp };
    }
    return out;
  }

  /* ---------------------------------------------------------------
     6a. Tariffs. Each returns { total, credit, lines } for one month.
     esc multiplies every money rate (tariff escalation).
  --------------------------------------------------------------- */

  // EEI rebate bands for TNB domestic, sen/kWh, applied to all kWh in the band.
  var EEI_BANDS = [[200, 25], [250, 24.5], [300, 22.5], [350, 21], [400, 17], [450, 14.5], [500, 12], [550, 10.5], [600, 9], [650, 7.5], [700, 5.5], [750, 4.5], [800, 4], [850, 2.5], [900, 1], [1000, 0.5]];
  function eeiRate(kwh) {
    for (var i = 0; i < EEI_BANDS.length; i++) if (kwh <= EEI_BANDS[i][0]) return EEI_BANDS[i][1];
    return 0;
  }

  var TNB_DEFAULTS = {
    energyLow: 27.03, energyHigh: 37.03, tierKWh: 1500, // sen/kWh, rate for the whole month by total use
    capacity: 4.55, network: 12.85, afa: 0,               // sen/kWh
    retail: 10, retailAbove: 600,                         // RM/month if use is above 600 kWh
    eei: true, kwtbbPct: 1.6, kwtbbAbove: 300, sstPct: 8, sstAbove: 600,
    // Solar ATAP (from 1 Jan 2026)
    atap: true, exportRate: 0, contractYears: 10, maqSunHours: 5
  };

  function tnbBill(kwh, p, esc) {
    kwh = Math.max(0, kwh);
    var eRate = (kwh <= p.tierKWh ? p.energyLow : p.energyHigh) / 100 * esc;
    var energy = kwh * eRate;
    var capacity = kwh * p.capacity / 100 * esc;
    var network = kwh * p.network / 100 * esc;
    var afa = kwh * p.afa / 100 * esc;
    var retail = kwh > p.retailAbove ? p.retail * esc : 0;
    var eei = p.eei ? -kwh * eeiRate(kwh) / 100 * esc : 0;
    var base = energy + capacity + network + afa + retail + eei;
    var kwtbb = kwh > p.kwtbbAbove ? Math.max(0, base) * p.kwtbbPct / 100 : 0;
    var sst = kwh > p.sstAbove ? Math.max(0, base) * (kwh - p.sstAbove) / kwh * p.sstPct / 100 : 0;
    return { total: Math.max(0, base + kwtbb + sst), energyRate: eRate,
      lines: { energy: energy, capacity: capacity, network: network, afa: afa, retail: retail, eei: eei, kwtbb: kwtbb, sst: sst } };
  }

  function tnbMonth(imp, exp, ctx) {
    var p = ctx.tariff, b = tnbBill(imp, p, ctx.esc);
    var credit = 0, credited = 0;
    if (p.atap && exp > 0 && ctx.year <= p.contractYears) {
      var maq = ctx.kWac * p.maqSunHours * ctx.days;
      credited = Math.min(exp, imp, maq);
      var rate = p.exportRate > 0 ? p.exportRate / 100 * ctx.esc : b.energyRate;
      credit = Math.min(credited * rate, b.total); // unused credit is forfeited at month end
    }
    return { total: b.total - credit, credit: credit, credited: credited, lines: b.lines };
  }

  var GENERIC_DEFAULTS = {
    importRate: 0.15, tiers: "", fixed: 10, exportMode: "netbilling", exportRate: 0.05,
    contractYears: 99, demandFixedNote: ""
  };

  // "200:0.10, 500:0.15, *:0.22" -> block tariff
  function parseTiers(str) {
    if (!str || !String(str).trim()) return null;
    var out = [];
    String(str).split(/[,;\n]/).forEach(function (part) {
      var kv = part.split(":");
      if (kv.length !== 2) return;
      var lim = kv[0].trim() === "*" ? Infinity : parseFloat(kv[0]);
      var r = parseFloat(kv[1]);
      if (!isNaN(lim) && !isNaN(r)) out.push([lim, r]);
    });
    out.sort(function (x, y) { return x[0] - y[0]; });
    return out.length ? out : null;
  }
  function energyCharge(kwh, p, esc) {
    var tiers = parseTiers(p.tiers);
    if (!tiers) return kwh * p.importRate * esc;
    var cost = 0, prev = 0;
    for (var i = 0; i < tiers.length && kwh > prev; i++) {
      var upto = Math.min(kwh, tiers[i][0]);
      cost += (upto - prev) * tiers[i][1];
      prev = upto;
    }
    if (kwh > prev) cost += (kwh - prev) * tiers[tiers.length - 1][1];
    return cost * esc;
  }

  function genericMonth(imp, exp, ctx) {
    var p = ctx.tariff, esc = ctx.esc;
    var fixed = p.fixed * esc;
    var active = ctx.year <= p.contractYears;
    var credit = 0, total;
    if (active && p.exportMode === "netmetering") {
      // kWh banking: exports offset imports 1:1, surplus kWh rolls over within the year.
      var bank = ctx.bank || 0;
      var net = imp - exp - bank;
      ctx.bankOut = net < 0 ? -net : 0;
      if (ctx.m === 11) ctx.bankOut = 0; // annual true-up, surplus lapses
      var billable = Math.max(0, net);
      total = fixed + energyCharge(billable, p, esc);
      credit = energyCharge(imp, p, esc) - energyCharge(billable, p, esc);
    } else {
      total = fixed + energyCharge(imp, p, esc);
      if (active && p.exportMode === "netbilling") {
        credit = Math.min(exp * p.exportRate * esc, total);
        total -= credit;
      }
    }
    return { total: total, credit: credit, lines: {} };
  }

  function monthBill(imp, exp, ctx) {
    return ctx.tariff.type === "tnb" ? tnbMonth(imp, exp, ctx) : genericMonth(imp, exp, ctx);
  }

  // Monthly kWh that gives a target bill (for users who only know their bill).
  function kwhFromBill(bill, tariff) {
    var lo = 0, hi = 100000;
    var ctx = { tariff: tariff, esc: 1, year: 1, kWac: 0, days: 30, m: 0 };
    for (var i = 0; i < 60; i++) {
      var mid = (lo + hi) / 2;
      if (monthBill(mid, 0, ctx).total < bill) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  /* ---------------------------------------------------------------
     6b. Finance helpers.
  --------------------------------------------------------------- */
  function npv(rate, flows) {
    var v = 0;
    for (var i = 0; i < flows.length; i++) v += flows[i] / Math.pow(1 + rate, i);
    return v;
  }
  function irr(flows) {
    var lo = -0.99, hi = 2, flo = npv(lo, flows), fhi = npv(hi, flows);
    if (flo * fhi > 0) return null;
    for (var i = 0; i < 200; i++) {
      var mid = (lo + hi) / 2, fm = npv(mid, flows);
      if (Math.abs(fm) < 1e-7) return mid;
      if (flo * fm < 0) { hi = mid; fhi = fm; } else { lo = mid; flo = fm; }
    }
    return (lo + hi) / 2;
  }
  function payback(flows) {
    var cum = flows[0];
    if (cum >= 0) return 0;
    for (var i = 1; i < flows.length; i++) {
      var prev = cum;
      cum += flows[i];
      if (cum >= 0) return i - 1 + (flows[i] !== 0 ? -prev / flows[i] : 0);
    }
    return null;
  }
  function loanPayment(principal, ratePct, years) {
    if (principal <= 0 || years <= 0) return 0;
    var r = ratePct / 100;
    if (r === 0) return principal / years;
    return principal * r / (1 - Math.pow(1 + r, -years));
  }

  /* ---------------------------------------------------------------
     Full project run.
     p = {
       site, module, inverter(s): kWac, kWp, tilt, azimuth, albedo, mount,
       dcLossPct, acLossPct, invEffPct,
       loadMonthly[12] (kWh), profile[24],
       battery {kWh, kW, rtePct},
       tariff {type: "tnb"|"generic", ...},
       fin {capexPerKWp, fixedCost, battCostPerKWh, rebate, years, degrPct,
            escPct, discPct, omPct, omEscPct, invReplaceYear, invReplacePerKWac,
            battReplaceYear, loanPct, loanRatePct, loanYears},
       ef (kgCO2/kWh)
     }
  --------------------------------------------------------------- */
  function run(p, opts) {
    opts = opts || {};
    var pv = simulatePV(p.site, p);
    var prof = normProfile(p.profile);
    var f = p.fin;
    var years = f.years;

    // Year 1 energy balance per month (also the basis of the monthly table).
    function yearFlows(scale) {
      return pv.months.map(function (mo, m) {
        var dayLoad = p.loadMonthly[m] / mo.days;
        var load = prof.map(function (x) { return x * dayLoad; });
        var gen = mo.genHourly.map(function (x) { return x * scale; });
        var fl = energyFlows(gen, load, p.battery);
        return {
          m: m, days: mo.days, load: p.loadMonthly[m], gen: mo.energy * scale,
          self: fl.self * mo.days, battOut: fl.battOut * mo.days,
          exp: fl.exp * mo.days, imp: fl.imp * mo.days
        };
      });
    }

    var capexPV = p.kWp * f.capexPerKWp + f.fixedCost;
    var capexBatt = (p.battery && p.battery.kWh > 0) ? p.battery.kWh * f.battCostPerKWh : 0;
    var capex = capexPV + capexBatt;
    var rebate = Math.min(f.rebate || 0, capex);
    var netCapex = capex - rebate;
    var loanP = netCapex * (f.loanPct || 0) / 100;
    var loanPay = loanPayment(loanP, f.loanRatePct || 0, f.loanYears || 0);

    var flows = [-(netCapex - loanP)];
    var flowsUnlev = [-netCapex];
    var rows = [];
    var year1 = null, pvEnergyDisc = 0, costDisc = netCapex;
    var disc = f.discPct / 100;
    for (var y = 1; y <= years; y++) {
      // First-year loss (LID) sits inside the DC losses; degradation starts in year 2.
      var scale = Math.pow(1 - f.degrPct / 100, y - 1);
      var esc = Math.pow(1 + f.escPct / 100, y - 1);
      var mf = yearFlows(scale);
      var base = 0, withPV = 0, credit = 0, gen = 0, bank = 0;
      var monthly = [];
      for (var m = 0; m < 12; m++) {
        var x = mf[m];
        var ctx0 = { tariff: p.tariff, esc: esc, year: y, kWac: p.kWac, days: x.days, m: m };
        var b0 = monthBill(x.load, 0, ctx0).total;
        var ctx = { tariff: p.tariff, esc: esc, year: y, kWac: p.kWac, days: x.days, m: m, bank: bank };
        var b1 = monthBill(x.imp, x.exp, ctx);
        bank = ctx.bankOut || 0;
        base += b0; withPV += b1.total; credit += b1.credit; gen += x.gen;
        if (y === 1) monthly.push({ m: m, load: x.load, gen: x.gen, self: x.self, battOut: x.battOut, exp: x.exp, imp: x.imp,
          credited: b1.credited || 0, billBefore: b0, billAfter: b1.total, credit: b1.credit });
      }
      if (y === 1) year1 = monthly;
      var savings = base - withPV;
      var om = capexPV * f.omPct / 100 * Math.pow(1 + f.omEscPct / 100, y - 1);
      var repl = 0;
      if (f.invReplaceYear && y === f.invReplaceYear) repl += p.kWac * f.invReplacePerKWac;
      if (capexBatt > 0 && f.battReplaceYear && y === f.battReplaceYear) repl += capexBatt * 0.7; // assumes 30% cheaper by then
      var loan = y <= (f.loanYears || 0) ? loanPay : 0;
      var cf = savings - om - repl - loan;
      flows.push(cf);
      flowsUnlev.push(savings - om - repl);
      pvEnergyDisc += gen / Math.pow(1 + disc, y);
      costDisc += (om + repl) / Math.pow(1 + disc, y);
      rows.push({ year: y, gen: gen, billBefore: base, billAfter: withPV, credit: credit, savings: savings, om: om, repl: repl, loan: loan, cash: cf });
    }
    var cum = flows[0];
    rows.forEach(function (r, i) { cum += flows[i + 1]; r.cum = cum; });

    var y1 = { load: 0, gen: 0, self: 0, battOut: 0, exp: 0, imp: 0, credited: 0, billBefore: 0, billAfter: 0, credit: 0 };
    year1.forEach(function (r) { for (var k in y1) y1[k] += r[k]; });
    var discFlows = flows.map(function (v, i) { return v / Math.pow(1 + disc, i); });
    var res = {
      pv: pv, monthly: year1, y1: y1, rows: rows, flows: flows,
      capex: capex, capexPV: capexPV, capexBatt: capexBatt, rebate: rebate, netCapex: netCapex,
      loanPrincipal: loanP, loanPayment: loanPay,
      savingsY1: rows[0].savings,
      npv: npv(disc, flows),
      irr: irr(flows), irrUnlevered: irr(flowsUnlev),
      payback: payback(flowsUnlev), discPayback: payback(flowsUnlev.map(function (v, i) { return v / Math.pow(1 + disc, i); })),
      lcoe: pvEnergyDisc > 0 ? costDisc / pvEnergyDisc : null,
      lifetimeSavings: sum(rows.map(function (r) { return r.savings; })),
      netGain: cum,
      selfConsumption: y1.gen > 0 ? (y1.self + y1.battOut) / y1.gen : 0,
      solarFraction: y1.load > 0 ? (y1.self + y1.battOut) / y1.load : 0,
      co2Y1: pv.annual * (p.ef || 0) / 1000,
      co2Life: sum(rows.map(function (r) { return r.gen; })) * (p.ef || 0) / 1000,
      discFlows: discFlows
    };
    return res;
  }

  /* ---------------------------------------------------------------
     String design and electrical checks.
  --------------------------------------------------------------- */
  var BREAKERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250];

  function stringDesign(mod, inv, nInv, nModules, site, opts) {
    opts = opts || {};
    var issues = [];
    var tMin = opts.tMin != null ? opts.tMin : Math.floor(site.tmin - 2);
    var noct = mod.noct + (MOUNT_ADDER[opts.mount] || 0);
    var tCellMax = (opts.tAmbMax != null ? opts.tAmbMax : site.tmax) + (noct - 20) / 800 * 1000;
    var bV = mod.bVoc / 100;
    var bVmp = (mod.gPmp - 0.05) / 100; // Vmp coefficient is a little steeper than Voc's; Pmp's is a fair proxy
    var vocCold = mod.voc * (1 + bV * (tMin - 25));
    var vmpHot = mod.vmp * (1 + bVmp * (tCellMax - 25));
    var vmpCold = mod.vmp * (1 + bVmp * (tMin - 25));
    var nMaxV = Math.floor(inv.vmax / vocCold);
    var nMaxMppt = Math.floor(inv.mpptMax / vmpCold);
    var nMax = Math.min(nMaxV, nMaxMppt);
    var nMin = Math.ceil(inv.mpptMin / vmpHot);
    var iscStc = mod.isc, iscDesign = mod.isc * 1.25;
    var maxParallel = Math.max(1, Math.floor(inv.iscMax / iscStc));
    var maxParallelOp = Math.max(1, Math.floor(inv.imax / mod.imp + 1e-9));
    var stringsPerMppt = Math.min(maxParallel, Math.max(1, maxParallelOp));
    if (inv.imax < mod.imp) issues.push({ lvl: "warn", t: "Module Imp (" + mod.imp + " A) is above the inverter's max MPPT input current (" + inv.imax + " A): expect current clipping." });
    if (inv.iscMax < mod.isc) issues.push({ lvl: "err", t: "Module Isc (" + mod.isc + " A) is above the inverter's max short-circuit current (" + inv.iscMax + " A)." });

    var layout = null;
    if (nMin > nMax) {
      issues.push({ lvl: "err", t: "No valid string length: at least " + nMin + " modules are needed to stay in the MPPT window when hot, but at most " + nMax + " fit when cold." });
    } else {
      // Spread modules over nInv inverters x mppts, strings of equal length where possible.
      var inputs = nInv * inv.mppts;
      var best = null;
      for (var len = nMax; len >= nMin; len--) {
        var strings = Math.round(nModules / len);
        if (strings < 1) continue;
        if (strings > inputs * stringsPerMppt) continue;
        var used = strings * len;
        var score = Math.abs(used - nModules) * 100 + (nMax - len);
        if (!best || score < best.score) best = { len: len, strings: strings, used: used, score: score };
      }
      if (!best) {
        issues.push({ lvl: "err", t: nModules + " modules do not fit on " + inputs + " MPPT input(s) with up to " + stringsPerMppt + " string(s) each. Add an inverter or choose a bigger one." });
      } else {
        var perMppt = [];
        for (var i = 0; i < inputs; i++) perMppt.push(0);
        for (var s2 = 0; s2 < best.strings; s2++) perMppt[s2 % inputs]++;
        var maxPar = Math.max.apply(null, perMppt);
        layout = {
          len: best.len, strings: best.strings, modules: best.used, perMppt: perMppt,
          vocCold: best.len * vocCold, vmpHot: best.len * vmpHot, vmpCold: best.len * vmpCold,
          vmpStc: best.len * mod.vmp, impStc: mod.imp,
          iMppt: maxPar * mod.imp, iscMppt: maxPar * mod.isc,
          fuseNeeded: maxPar >= 3,
          fuseMin: Math.ceil(1.5 * mod.isc), fuseMax: Math.min(Math.floor(2.4 * mod.isc), mod.fuse || 99)
        };
        if (best.used !== nModules) issues.push({ lvl: "info", t: "Adjusted to " + best.used + " modules (" + best.strings + " × " + best.len + ") so every string is the same length." });
        if (layout.fuseNeeded) issues.push({ lvl: "info", t: "Three or more strings in parallel on one MPPT: fit string fuses (gPV) rated " + layout.fuseMin + "–" + layout.fuseMax + " A." });
      }
    }

    // DC cable voltage drop (copper at 70 °C, both conductors).
    var rho = 0.0225; // ohm·mm2/m
    var cable = null;
    if (layout && opts.dcLength > 0 && opts.dcArea > 0) {
      var vd = 2 * opts.dcLength * layout.impStc * rho / opts.dcArea;
      cable = { vd: vd, pct: vd / layout.vmpStc * 100 };
      if (cable.pct > 1.5) issues.push({ lvl: "warn", t: "DC voltage drop is " + cable.pct.toFixed(2) + " %. Keep it under 1–1.5 %: use a thicker cable or a shorter run." });
    }

    // AC side per inverter.
    var vPh = inv.phases === 3 ? 400 : 230;
    var iac = inv.phases === 3 ? inv.kw * 1000 / (Math.sqrt(3) * vPh) : inv.kw * 1000 / vPh;
    var brk = BREAKERS.filter(function (b) { return b >= iac * 1.25; })[0] || null;

    return {
      tMin: tMin, tCellMax: tCellMax, vocCold: vocCold, vmpHot: vmpHot, vmpCold: vmpCold,
      nMin: nMin, nMax: nMax, nMaxV: nMaxV, nMaxMppt: nMaxMppt, stringsPerMppt: stringsPerMppt,
      layout: layout, cable: cable, iac: iac, breaker: brk, vac: vPh, issues: issues
    };
  }

  /* ---------------------------------------------------------------
     Size sweep: NPV, payback and savings for every candidate size.
     build(kWp) must return a full project object for that size.
  --------------------------------------------------------------- */
  function sweep(build, minKWp, maxKWp, step) {
    var out = [];
    for (var k = minKWp; k <= maxKWp + 1e-9; k += step) {
      var proj = build(Math.round(k * 100) / 100);
      if (!proj) continue;
      var r = run(proj);
      out.push({ kWp: proj.kWp, kWac: proj.kWac, npv: r.npv, irr: r.irr, payback: r.payback, savingsY1: r.savingsY1, self: r.selfConsumption, gen: r.pv.annual });
    }
    var best = null;
    out.forEach(function (o) { if (!best || o.npv > best.npv) best = o; });
    return { points: out, best: best };
  }

  var API = {
    MONTHS: MONTHS, DAYS: DAYS, MODULES: MODULES, INVERTERS: INVERTERS, LOAD_PROFILES: LOAD_PROFILES,
    TNB_DEFAULTS: TNB_DEFAULTS, GENERIC_DEFAULTS: GENERIC_DEFAULTS, EEI_BANDS: EEI_BANDS,
    poaDay: poaDay, simulatePV: simulatePV, energyFlows: energyFlows,
    tnbBill: tnbBill, monthBill: monthBill, kwhFromBill: kwhFromBill, parseTiers: parseTiers,
    npv: npv, irr: irr, payback: payback, loanPayment: loanPayment,
    run: run, stringDesign: stringDesign, sweep: sweep, normProfile: normProfile
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.SolarEngine = API;
})(this);
