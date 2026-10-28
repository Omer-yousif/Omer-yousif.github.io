/* Quick checks for engine.js: node solar/test.js */
var E = require("./engine.js");
var C = require("./climate.js");
var assert = require("assert");
function city(n) { return C.filter(function (c) { return c.n.indexOf(n) === 0; })[0]; }

function project(site, kWp, kWac, extra) {
  var tariff = Object.assign({ type: "tnb" }, E.TNB_DEFAULTS);
  var p = {
    site: site, module: E.MODULES.m585, kWp: kWp, kWac: kWac, tilt: 10, azimuth: 180, albedo: 0.2, mount: "roof",
    dcLossPct: 9, acLossPct: 1.5, invEffPct: 97.5,
    loadMonthly: E.DAYS.map(function () { return 900; }), profile: E.LOAD_PROFILES.home.h,
    battery: { kWh: 0, kW: 0, rtePct: 90 }, tariff: tariff,
    fin: { capexPerKWp: 3300, fixedCost: 0, battCostPerKWh: 1800, rebate: 0, years: 25, degrPct: 0.4, escPct: 2,
      discPct: 6, omPct: 1, omEscPct: 2, invReplaceYear: 12, invReplacePerKWac: 600, battReplaceYear: 12, loanPct: 0, loanRatePct: 0, loanYears: 0 },
    ef: 0.769
  };
  return Object.assign(p, extra || {});
}

// 1. Irradiance: monthly POA should integrate GHI exactly for a flat panel.
var kl = city("Kuala Lumpur");
for (var m = 0; m < 12; m++) {
  var flat = E.poaDay(kl, m, 0, 180, 0.2);
  assert(Math.abs(flat.poaDaily - kl.ghi[m]) < 1e-6, "flat POA = GHI in month " + m);
}
// Tilted south in London gains a lot; in KL a 10° tilt changes little.
var lon = city("London");
var lonP = E.simulatePV(lon, project(lon, 1, 1, { tilt: 35 }));
var klP = E.simulatePV(kl, project(kl, 1, 1));
console.log("KL  specific yield %s kWh/kWp, PR %s, transposition %s%%", klP.specificYield.toFixed(0), klP.pr.toFixed(3), (klP.transpositionGain * 100).toFixed(1));
console.log("LON specific yield %s kWh/kWp, PR %s, transposition %s%%", lonP.specificYield.toFixed(0), lonP.pr.toFixed(3), (lonP.transpositionGain * 100).toFixed(1));
assert(klP.specificYield > 1100 && klP.specificYield < 1450, "KL yield in a sane range");
assert(lonP.transpositionGain > 0.08, "London tilt gain");
// Azimuth symmetry: east and west give about the same in a symmetric model.
var east = E.simulatePV(kl, project(kl, 1, 1, { tilt: 20, azimuth: 90 })).annual;
var west = E.simulatePV(kl, project(kl, 1, 1, { tilt: 20, azimuth: 270 })).annual;
assert(Math.abs(east - west) / east < 0.02, "east/west symmetric");
// Southern hemisphere: north-facing beats south-facing in Perth.
var per = city("Perth");
var pn = E.simulatePV(per, project(per, 1, 1, { tilt: 30, azimuth: 0 })).annual;
var ps = E.simulatePV(per, project(per, 1, 1, { tilt: 30, azimuth: 180 })).annual;
assert(pn > ps * 1.2, "Perth north-facing wins");

// 2. TNB bill sanity: 600 kWh, no AFA.
var t = E.TNB_DEFAULTS;
var b600 = E.tnbBill(600, t, 1);
console.log("TNB 300 kWh RM%s, 600 kWh RM%s, 900 kWh RM%s, 1600 kWh RM%s", E.tnbBill(300, t, 1).total.toFixed(2), b600.total.toFixed(2), E.tnbBill(900, t, 1).total.toFixed(2), E.tnbBill(1600, t, 1).total.toFixed(2));
assert(Math.abs(E.kwhFromBill(b600.total, Object.assign({ type: "tnb" }, t)) - 600) < 1, "bill -> kWh inverse");

// 3. Finance helpers.
assert(Math.abs(E.irr([-100, 110]) - 0.1) < 1e-6, "irr");
assert(Math.abs(E.payback([-100, 40, 40, 40]) - 2.5) < 1e-9, "payback");
assert(Math.abs(E.loanPayment(1000, 0, 4) - 250) < 1e-9, "loan 0%");

// 4. Full run, 6 kWp / 5 kWac in KL for a 900 kWh/month home.
var r = E.run(project(kl, 6, 5));
console.log("6 kWp KL: gen %s kWh, self %s%%, savings Y1 RM%s, payback %s y, IRR %s%%, NPV RM%s, LCOE RM%s/kWh",
  r.pv.annual.toFixed(0), (r.selfConsumption * 100).toFixed(0), r.savingsY1.toFixed(0), r.payback.toFixed(1), (r.irr * 100).toFixed(1), r.npv.toFixed(0), r.lcoe.toFixed(3));
assert(r.y1.self + r.y1.exp - r.y1.gen < 1e-6 || Math.abs(r.y1.self + r.y1.exp - r.y1.gen) < 1e-6, "energy balance without battery");
assert(Math.abs(r.y1.self + r.y1.imp - r.y1.load) < 1e-6, "load balance");

// 5. Battery raises self-consumption and keeps energy balance.
var rb = E.run(project(kl, 6, 5, { battery: { kWh: 10, kW: 5, rtePct: 90 } }));
console.log("with 10 kWh battery: self %s%%, savings Y1 RM%s, payback %s y", (rb.selfConsumption * 100).toFixed(0), rb.savingsY1.toFixed(0), rb.payback && rb.payback.toFixed(1));
assert(rb.selfConsumption > r.selfConsumption, "battery helps self-consumption");
assert(Math.abs(rb.y1.self + rb.y1.battOut + rb.y1.imp - rb.y1.load) < 1e-6, "load balance with battery");

// 6. String design: 5 kW single-phase, 10 × 585 W.
var sd = E.stringDesign(E.MODULES.m585, E.INVERTERS.i5s, 1, 10, kl, { mount: "roof", dcLength: 25, dcArea: 4 });
console.log("strings: %s–%s modules, layout %s × %s, Voc cold %s V, Vmp hot %s V, drop %s%%",
  sd.nMin, sd.nMax, sd.layout.strings, sd.layout.len, sd.layout.vocCold.toFixed(0), sd.layout.vmpHot.toFixed(0), sd.cable.pct.toFixed(2));
assert(sd.layout.vocCold < 600 && sd.layout.vmpHot > 90, "string within limits");

// 7. Sweep finds an optimum inside the range.
var sw = E.sweep(function (k) { return project(kl, k, Math.min(5, k / 1.1)); }, 2, 8, 0.5);
console.log("best NPV at %s kWp (RM%s)", sw.best.kWp, sw.best.npv.toFixed(0));

// 8. Generic tariff, net metering vs net billing.
var g = Object.assign({ type: "generic" }, E.GENERIC_DEFAULTS);
var nm = E.run(project(city("Houston"), 6, 6, { tariff: Object.assign({}, g, { exportMode: "netmetering" }) }));
var nb = E.run(project(city("Houston"), 6, 6, { tariff: Object.assign({}, g, { exportMode: "netbilling" }) }));
assert(nm.savingsY1 > nb.savingsY1, "net metering beats net billing");
console.log("Houston 6 kWp: net metering $%s/yr, net billing $%s/yr", nm.savingsY1.toFixed(0), nb.savingsY1.toFixed(0));
console.log("All checks passed.");
