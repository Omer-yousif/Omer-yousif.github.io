# SolarSpec: PV design and proposal studio

A free solar design tool that runs entirely in the browser. Open `solar/index.html`, or `https://<your-site>/solar/` once the site is published.

Enter a location, an electricity bill and a roof, and it gives you:

- **System size and yield.** Hour-by-hour average-day simulation for each month using NASA POWER climate data, the HDKR sky model, cell temperature, losses and inverter clipping.
- **String design.** Allowed string lengths at the coldest and hottest temperatures, strings per MPPT, current checks, string fuses, AC breaker and DC voltage drop.
- **Bills.** Malaysian TNB domestic tariff (from July 2025) with Solar ATAP export credit, or a custom tariff for any country (block rates, net billing, net metering).
- **Money.** Year-1 savings, payback, IRR, NPV, LCOE, a 25-year cash flow, financing, battery option, and CO₂ avoided.
- **Best size.** "Find best size" tries every size and picks the one with the highest NPV.
- **Proposal.** A branded client proposal: click **Print proposal** and choose "Save as PDF".

See `MARKET-RESEARCH.md` for why this tool and how to earn from it.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `app.js` | Form, charts, proposal, save/open/share |
| `engine.js` | All calculations (no page code, also runs in Node) |
| `climate.js` | Built-in NASA POWER climate data for 38 cities |
| `solar.css` | Styles, including the print layout |
| `test.js` | Checks for the engine: `node solar/test.js` |

## Everyday use

1. **Project and branding.** Enter the client's name and address, and your name and contact line. They appear at the top of the proposal.
2. **Location.** Pick a city. For anywhere else, choose "Other location", enter the latitude and longitude and click **Get NASA climate data** (needs internet).
3. **Electricity use.** Enter the monthly bill, the monthly kWh, or all 12 months. Choose when the power is used. This matters a lot under Solar ATAP.
4. **PV system.** Pick a module (or type in datasheet values) and a target size, then click **Find best size**. The inverter is picked automatically unless you untick that box.
5. **Tariff.** For Malaysia, check the AFA on the latest bill. For other countries, enter the import price, fixed charge and export rules.
6. **Cost.** Enter the installed price per kWp from the installer's quote.
7. Check the warnings at the top of the Results tab, then open **Proposal preview** and **Print proposal**.

**Save** downloads a project file you can **Open** later. **Copy link** makes a link that opens the exact design, which is handy for sending to a client. **CSV** exports the monthly and yearly tables for Excel.

## Keeping it correct

- Tariff and Solar ATAP figures are in section 6 of the form (and in `TNB_DEFAULTS` in `engine.js`). When TNB or the Energy Commission changes them, update the defaults and bump `?v=1` in `index.html`.
- Equipment presets are generic. For a real quote, choose "Custom" and type in the datasheet values of the actual module and inverter.
- Validation: annual yield is within ±5 % of PVGIS 5.3 on 8 sites, and within 0.1 % for Kuala Lumpur (details in the Method tab).
- This is an early-stage design and sales tool. Final designs need a site survey, a shading check and a registered installer.
