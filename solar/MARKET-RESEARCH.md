# Market research: what to build and sell

Research date: 28 October 2026. Sources are public freelance listings and news found by web search. Fiverr blocks automated browsing, so these are not complete platform statistics. The links are at the end.

## 1. What sells in this field

| Niche | Typical price on Fiverr / Upwork | Demand signal | Competition | Fit for Omer |
|---|---|---|---|---|
| **Solar PV design and proposals** (sizing, layout, yield, payback) | Fiverr: under $50 for basic sizing, $50–200 typical, $200–400 for PVsyst/PV*SOL reports with BOM and financials. Upwork: $10–80/h | Upwork lists 100+ open solar design jobs at a time. Installers want "outsourced design + proposal" help | High at the bottom (cheap sizing), thinner at the top (full report + financials + bill modelling) | **Best.** EE degree, PV design training, Malaysian market knowledge |
| Carbon footprint (Scope 1–2, some 3) for SMEs | $50–500 per inventory | Malaysian listed companies must report Scope 1–2 now and Scope 3 from 2027–28, and must collect data from their SME suppliers. Bursa's supply-chain programme pushes SMEs to measure | Few sellers; most target UK/EU | Strong second product (already on your services page) |
| LEED / green building documentation | $100–1,000 per credit package | Steady, niche | Low, needs credentials | Later, after LEED GA |
| Electrical tutoring | $10–30/h | Steady | Very high | Fills gaps, does not scale |

## 2. The gaps

1. **Malaysia's new Solar ATAP scheme (from 1 Jan 2026) has no neutral, technical calculator.** Every online calculator comes from an installer. They assume a flat 4.5 peak sun hours, ignore the monthly credit reset and the "credit only up to imports" rule, and are built to sell systems. Homeowners and small installers need an independent check.
2. **Cheap Fiverr solar gigs stop at sizing.** Buyers who want a client-ready proposal with bill modelling, payback, IRR and string design pay $200–400. Most sellers do that by hand in PVsyst + Excel, which takes hours.
3. **Small installers can't justify Aurora or PVsyst** (hundreds to thousands of dollars a year) for residential quotes, but still need a professional, branded proposal for each lead.
4. **Self-consumption is the new money-maker.** Under net billing (Solar ATAP, many US states, the Gulf, Australia), exported power is worth much less than self-used power, so the right size depends on the hourly match between solar output and use. Simple calculators can't show that. SolarSpec does, and its optimiser finds the size with the best NPV.

## 3. What was built: SolarSpec (`/solar/`)

A free, browser-only tool that turns a bill, a location and a roof into a full early-stage design and a printable proposal:

- Hour-by-hour solar model (HDKR sky model, temperature, losses, clipping), within ±5 % of PVGIS on 8 test sites worldwide and within 0.1 % for Kuala Lumpur
- String sizing with temperature-corrected voltages, current checks, string fuses, AC breaker and DC voltage drop
- Malaysian TNB domestic tariff (July 2025 structure, EEI, KWTBB, SST, AFA) with Solar ATAP rules, plus a generic tariff (blocks, net billing, net metering) for any country
- Battery self-consumption, 25-year cash flow, NPV, IRR, LCOE, payback, financing, CO₂
- Size optimiser (best NPV)
- White-label proposal (your name and logo line) that prints to PDF, plus CSV export, project files and share links

## 4. How to earn from it

| Stream | How | Price idea |
|---|---|---|
| **Fiverr / Upwork gigs** | Deliver PV sizing + proposal gigs in 30–60 minutes instead of 3–4 hours. Basic: sizing + payback. Standard: + string design + monthly bill model. Premium: + battery comparison, optimiser, branded PDF, 1 revision | $40 / $120 / $250 |
| **Solar ATAP bill check (Malaysia)** | Homeowners send their TNB bill and a quote they received; you check whether the size and payback claims are realistic | RM 80–150 per check |
| **White-label proposals for installers** | Small Malaysian installers send you leads; you return a branded proposal within 24 hours | RM 50–100 per proposal, or a monthly retainer |
| **Lead magnet** | The tool on your site brings homeowners who then ask for a review or a design (WhatsApp button on the Services page) | Free → paid review |
| **Later: paid "Pro" version** | Saved client lists, a logo upload, more equipment datasets, PVGIS hourly data, a commercial (Tariff B/C/D) model | Subscription |

Your gig title already fits: "I will size your solar PV system and calculate your payback". Put SolarSpec screenshots and a sample PDF proposal in the gig gallery. A visible deliverable is the strongest selling point on Fiverr.

## 5. Next steps

1. Check the TNB and Solar ATAP rates against GP/ST/No. 60/2025 and TNB's tariff book, and correct them in section 6 of the tool if needed.
2. Make three sample proposals (a Malaysian home, a Malaysian home with a battery, a US home) and use them as gig gallery images.
3. Publish the Fiverr gig with three packages and the solar tool link on your profile.
4. Post the tool in Malaysian solar and homeowner Facebook groups and on LinkedIn as a free, independent Solar ATAP checker.
5. Next product: a carbon footprint (Scope 1–2) calculator for Malaysian SME suppliers built the same way, aimed at Bursa supply-chain requests.

## Sources

- Fiverr solar PV gigs: [ravi709](https://fiverr.com/ravi709/design-your-solar-pv-system), [muddasirkhan](https://fiverr.com/muddasirkhan/design-solar-wiring-inverter-and-battery-size-calculation), [theradiantrays](https://fiverr.com/theradiantrays/design-your-solar-pv-system-using-pvsol), [atahan_zengin](https://fiverr.com/atahan_zengin/design-solar-pv-system-and-make-a-pvsol-simulation-report-3d-shading), [solarsurge](https://fiverr.com/solarsurge/design-solar-layout-on-helioscope-aurora-and-solaredge)
- Upwork: [Solar design jobs](https://www.upwork.com/freelance-jobs/solar-design/), [Solar design freelancers](https://www.upwork.com/hire/solar-design-freelancers/ps/)
- Fiverr carbon gigs: [ruihan_xu](https://fiverr.com/ruihan_xu/calculate-scope-1-2-3-ghg-emissions-per-ghg-protocol-using-r), [irfanali609](https://fiverr.com/irfanali609/carbon-foot-print-calculations)
- Solar ATAP: [pv magazine](https://www.pv-magazine.com/2026/01/09/malaysia-introduces-rooftop-solar-scheme-to-replace-net-metering-program-solar-atap/), [Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/01/malaysia-2026-updates-to-renewable-energy-schemes), [Trexon ATAP vs NEM](https://trexon.my/blog/solar-atap-vs-nem-malaysia-2026-comparison), [Solarvest](https://solarvest.com/solar-atap-malaysia-2026/), [Business Today](https://www.businesstoday.com.my/2026/03/18/what-solar-atap-really-means-for-malaysian-businesses-in-2026/)
- TNB tariff (July 2025): [SoyaCincau](https://soyacincau.com/2025/06/21/tnb-domestic-electricity-tariff-structure-july-2025-impact-changes/), [Carz](https://carz.com.my/2025/06/new-tnb-electricity-tariff-structure-from-july-1-2025), [RinggitPlus](https://ringgitplus.com/en/blog/personal-finance-news/your-new-tnb-bill-explained-understanding-the-monthly-tariff-changes.html)
- Grid emission factor: [Energy Commission GEF 2022–2024 (provisional)](https://myenergystats.st.gov.my/documents/d/guest/grid-emission-factor-gef-in-malaysia-2022-2024-provisional-)
- Carbon reporting in Malaysia: [Eco-Business](https://eco-business.com/news/malaysian-companies-must-report-scope-3-emissions-starting-2027), [Oren](https://www.orennow.com/blog/scope-1-2-3-emissions-malaysia)
- Climate data: [NASA POWER](https://power.larc.nasa.gov/); validation: [PVGIS 5.3](https://re.jrc.ec.europa.eu/pvg_tools/en/)
