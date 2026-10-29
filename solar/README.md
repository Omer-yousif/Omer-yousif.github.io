# Solar ATAP checker (free, public)

A quick solar estimate for landed homes in Peninsular Malaysia. A visitor enters their TNB bill, city, daytime use and supply type, and sees:

- a suggested system size
- the monthly bill saving
- a payback range and cost range
- how much solar they would use at home
- CO₂ avoided

It ends with a WhatsApp button that sends Omer a message with their results, asking for a full design report, plus a link to the sample report in `samples/`.

This page is deliberately simple: monthly sunshine × a fixed performance ratio (0.78), the TNB domestic tariff from 1 July 2025, and Solar ATAP's rule that export credit only offsets that month's imports. The full design tool (hourly model, string design, battery, cash flow, PDF proposals) is kept private and is not part of this website.

## Files

| File | What it is |
|---|---|
| `index.html` | The page and its styles |
| `lite.js` | City data, tariff and the estimate |
| `samples/sample-proposal-kuala-lumpur.pdf` | Sample full report, linked from the page |

## Updating

- WhatsApp number: `WHATSAPP` at the top of `lite.js`.
- Installed price per kWp: `COST_PER_KWP` in `lite.js`.
- Tariff rates: the `bill()` function in `lite.js`. After changing it, raise `?v=1` on the `lite.js` line in `index.html`.
