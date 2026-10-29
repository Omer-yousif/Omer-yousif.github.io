/*
  SolarSpec Lite: a quick Solar ATAP estimate for Peninsular Malaysia.
  Rough by design (monthly sunshine × a fixed performance ratio). The full
  design report (hourly model, string design, battery, cash flow, PDF
  proposal) is a paid service, ordered with the WhatsApp button.
*/
(function () {
  "use strict";

  var WHATSAPP = "60196885468";
  var DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var PR = 0.78;            // typical performance ratio for a rooftop system
  var COST_PER_KWP = 3500;  // RM, typical turnkey price for homes
  var EF = 0.769;           // kg CO2e/kWh, Peninsular Malaysia 2022 (Energy Commission)
  // Present-value factors for years 1-10 and 11-25 (6 % discount, +2 % tariff, -0.5 % output a year).
  var A_FIRST10 = 0, A_LATER = 0;
  for (var t = 1; t <= 25; t++) { var f = Math.pow(1.02 * 0.995, t - 1) / Math.pow(1.06, t); if (t <= 10) A_FIRST10 += f; else A_LATER += f; }

  // NASA POWER long-term monthly global horizontal irradiation, kWh/m2/day.
  var CITIES = [
    { n: "Kuala Lumpur", ghi: [4.63,5.17,5.27,5.16,4.99,4.88,4.79,4.84,4.7,4.58,4.39,4.21] },
    { n: "Johor Bahru", ghi: [4.51,5.15,5.15,4.97,4.62,4.41,4.41,4.51,4.46,4.5,4.3,4.15] },
    { n: "George Town (Penang)", ghi: [5.06,5.76,5.78,5.54,5.11,5.04,4.99,4.95,4.72,4.67,4.58,4.54] },
    { n: "Ipoh", ghi: [4.46,5.26,5.46,5.39,5.13,5.06,4.96,5.02,4.88,4.67,4.36,4.05] },
    { n: "Kuantan", ghi: [4.36,5.2,5.44,5.47,5.14,4.95,4.98,5.19,5.08,4.71,4.16,3.76] },
    { n: "Melaka", ghi: [4.59,5.22,5.27,5.19,4.87,4.69,4.66,4.79,4.73,4.71,4.46,4.19] },
    { n: "Kota Bharu", ghi: [4.78,5.77,6.05,6.02,5.42,5.14,5.14,5.3,5.31,4.66,4.06,4.06] },
    { n: "Alor Setar", ghi: [4.95,5.79,5.91,5.79,5.14,4.96,4.89,4.96,4.81,4.6,4.33,4.19] }
  ];

  // Most of the month's use that solar can cover directly, by daytime habits.
  // Calibrated against the hourly model of the full design tool.
  var PATTERNS = {
    out: { label: "Out at work or school on weekdays", day: 0.40 },
    some: { label: "Someone at home part of the day", day: 0.45 },
    home: { label: "Someone at home all day / work from home", day: 0.50 }
  };

  /* TNB domestic tariff from 1 July 2025, sen/kWh unless noted. */
  var EEI = [[200, 25], [250, 24.5], [300, 22.5], [350, 21], [400, 17], [450, 14.5], [500, 12], [550, 10.5], [600, 9], [650, 7.5], [700, 5.5], [750, 4.5], [800, 4], [850, 2.5], [900, 1], [1000, 0.5]];
  function eeiRate(k) { for (var i = 0; i < EEI.length; i++) if (k <= EEI[i][0]) return EEI[i][1]; return 0; }
  function energyRate(k) { return (k <= 1500 ? 27.03 : 37.03) / 100; }
  function bill(k) {
    k = Math.max(0, k);
    var base = k * (energyRate(k) + 0.0455 + 0.1285) + (k > 600 ? 10 : 0) - k * eeiRate(k) / 100;
    var kwtbb = k > 300 ? Math.max(0, base) * 0.016 : 0;
    var sst = k > 600 ? Math.max(0, base) * (k - 600) / k * 0.08 : 0;
    return Math.max(0, base + kwtbb + sst);
  }
  function kwhFromBill(rm) {
    var lo = 0, hi = 20000;
    for (var i = 0; i < 50; i++) { var mid = (lo + hi) / 2; if (bill(mid) < rm) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  /* One year under Solar ATAP for a given size. */
  function year(city, kwh, dayShare, kWp, noCredit) {
    var r = { gen: 0, self: 0, exp: 0, before: 0, after: 0 };
    for (var m = 0; m < 12; m++) {
      var gen = kWp * city.ghi[m] * DAYS[m] * PR;
      var load = kwh; // the bill gives one month; assume it is typical of every month
      // Solar used at home saturates as the system grows: midday output outruns the household's daytime use.
      var self = load * dayShare * Math.tanh(gen / (load * dayShare));
      var exp = gen - self, imp = load - self;
      var credit = noCredit ? 0 : Math.min(exp, imp) * energyRate(imp); // credit only up to imports; the rest lapses
      r.gen += gen; r.self += self; r.exp += exp;
      r.before += bill(load); r.after += Math.max(0, bill(imp) - credit);
    }
    r.save = r.before - r.after;
    return r;
  }

  function estimate(cityIdx, rm, pattern, phases) {
    var city = CITIES[cityIdx];
    var kwh = kwhFromBill(rm);
    var day = PATTERNS[pattern].day;
    var maxKWp = phases === 3 ? 18 : 6; // Solar ATAP: 5 kWac / 15 kWac, ~1.2 DC/AC
    var best = null;
    for (var k = 1.5; k <= maxKWp + 1e-9; k += 0.5) {
      var y = year(city, kwh, day, k);
      var late = year(city, kwh, day, k, true); // ATAP export credit lasts 10 years
      var cost = k * COST_PER_KWP;
      // ≈ 25-year NPV at 6 %, tariff +2 %/yr, with O&M and an inverter replacement
      var score = y.save * A_FIRST10 + late.save * A_LATER - cost * 1.15;
      if (!best || score > best.score) best = { kWp: k, y: y, cost: cost, score: score };
    }
    best.kwh = kwh;
    best.payback = best.y.save > 0 ? best.cost / best.y.save : null;
    best.co2 = best.y.gen * EF / 1000;
    return best;
  }

  /* ---------- Page ---------- */
  function $(id) { return document.getElementById(id); }
  function fmt(x, d) { return Number(x).toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function rm(x) { return "RM " + fmt(Math.round(x / 10) * 10); }

  function fill() {
    $("city").innerHTML = CITIES.map(function (c, i) { return '<option value="' + i + '">' + c.n + '</option>'; }).join("");
    $("pattern").innerHTML = Object.keys(PATTERNS).map(function (k) { return '<option value="' + k + '"' + (k === "some" ? " selected" : "") + '>' + PATTERNS[k].label + '</option>'; }).join("");
  }

  function render() {
    var rmBill = Math.max(0, parseFloat($("bill").value) || 0);
    var out = $("out");
    if (rmBill < 80) { out.innerHTML = '<p class="hint">Enter a monthly bill of at least RM 80. Below that, solar rarely pays back.</p>'; return; }
    var phases = +document.querySelector('input[name="phase"]:checked').value;
    var e = estimate(+$("city").value, rmBill, $("pattern").value, phases);
    var y = e.y;
    var used = y.gen > 0 ? y.self / y.gen : 0;
    var pbLo = e.payback * 0.85, pbHi = e.payback * 1.15;
    out.innerHTML =
      '<div class="kpis">' +
        '<div class="kpi kpi--hero"><span>Suggested size</span><b>about ' + fmt(e.kWp, 1) + ' kWp</b><small>' + Math.round(e.kWp * 1000 / 585) + ' panels · ' + fmt(e.kWp * 1000 / 585 * 2.6, 0) + ' m² of roof</small></div>' +
        '<div class="kpi kpi--hero"><span>Bill saving</span><b>' + rm(y.save / 12) + ' a month</b><small>' + rm(y.save) + ' in the first year</small></div>' +
        '<div class="kpi"><span>Payback</span><b>' + (e.payback ? fmt(pbLo, 0) + '–' + fmt(pbHi, 0) + ' years' : '–') + '</b><small>for about ' + rm(e.cost * 0.9) + '–' + rm(e.cost * 1.1) + '</small></div>' +
        '<div class="kpi"><span>Solar used at home</span><b>' + fmt(used * 100, 0) + '%</b><small>the rest is exported for ATAP credit</small></div>' +
        '<div class="kpi"><span>Your use</span><b>≈ ' + fmt(e.kwh, 0) + ' kWh</b><small>a month, from your bill</small></div>' +
        '<div class="kpi"><span>CO₂ avoided</span><b>' + fmt(e.co2, 1) + ' t a year</b><small>Peninsular grid factor</small></div>' +
      '</div>' +
      '<p class="hint">A quick estimate, typically within ±15%. It does not check your roof, shading, the exact panels and inverter, or a battery.</p>';
    var msg = "Hi Omer, I used your Solar ATAP checker. " + CITIES[+$("city").value].n + ", bill about RM " + fmt(rmBill) + "/month, " +
      (phases === 3 ? "three" : "single") + "-phase. It suggests about " + fmt(e.kWp, 1) + " kWp. I'd like a full design report" + ($("hasQuote").checked ? " and a check of the installer quote I received." : ".");
    $("wa").href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg);
  }

  if (typeof document === "undefined") { module.exports = { estimate: estimate }; return; }
  fill();
  ["city", "bill", "pattern", "hasQuote"].forEach(function (id) { $(id).addEventListener("input", render); $(id).addEventListener("change", render); });
  Array.prototype.forEach.call(document.querySelectorAll('input[name="phase"]'), function (el) { el.addEventListener("change", render); });
  render();

})();
