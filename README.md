# Omer Yousif – portfolio website

A plain HTML, CSS and JavaScript site. No build tools, no frameworks, nothing to install.

## Pages

| Page | File | What it shows |
|---|---|---|
| Home | `index.html` | The stage intro (your cut-out photo in front of a giant word), numbers, and a short summary of every section, ending with Contact |
| About | `about.html` | Your full story, quick facts, journey timeline, skills, leadership and awards |
| Experience | `experience.html` | The internship: company details, the 12-week timeline and the photo gallery |
| Projects | `projects.html` | All projects with category filters |
| One project | `project.html?id=robot` | The problem, what you did step by step (with photos), results, gallery, next and previous project |
| Sustainability | `sustainability.html` | LEED, the Sunway figures and a timeline of activities with photo galleries |
| Services | `services.html` | The services, how it works, and WhatsApp buttons |
| SolarSpec tool | `solar/index.html` | Free solar PV design and proposal tool, linked from Services. See `solar/README.md` |

Each page has its own colour: About violet, Experience orange, Projects cyan, Sustainability green, Services pink.

## Folder layout

```
site/
├── index.html, about.html, …   page skeletons (rarely need editing)
├── js/
│   ├── content.js          ← ALL TEXT, IN ENGLISH AND ARABIC. Edit this.
│   └── main.js             builds every page from content.js
├── css/
│   └── style.css           colours, fonts, layout and animations
└── assets/
    ├── img/                photos and figures (.webp)
    │   └── omer-cutout.webp   your photo with the background removed (home page)
    └── cv/Omer_Yousif_CV.pdf
```

## See the site on your computer

Double-click `index.html`. It opens in your browser and works offline, except for the fonts.

## Change text

1. Open `js/content.js` in any text editor. VS Code or Notepad++ handle Arabic well.
2. Find the sentence you want to change. The Arabic version sits right next to the English one:
   ```js
   title: { en: "Self-balancing robot", ar: "روبوت ذاتي التوازن" },
   ```
3. Change the words between the quotes. Keep the quotes, colons and commas.
4. Save the file and refresh the browser.

If an Arabic value is left as `""`, the English text is shown instead.

In headings, put words between `*stars*` to give them the coloured accent style, for example `"How I can *help.*"`.

## Common updates

| You want to… | Do this |
|---|---|
| Update your CV | Replace `assets/cv/Omer_Yousif_CV.pdf` with the new file, using the same name. |
| Change your CGPA or stats | Edit `stats`, `hero.badges` and `nameplate` near the top of `content.js`. |
| Change the giant word on the home page | Edit `hero.bigWord`, `hero.sideLeft` and `hero.sideRight`. |
| Change the home page photo | Make a photo with a transparent background (PNG or WebP), put it in `assets/img/` and point `hero.cutout` to it. |
| Mark LEED GA as passed | In `sustainability.leed`, change `status` to `"Certified, 2027"`. Also update `hero.badges` and `nameplate`. |
| Add a project | Copy one whole `{ id: ..., }` block inside `projects`, paste it, then give it a new `id`, a `tone` colour and new text. The first three projects are featured on the home page. |
| Add a photo to a project step | Add `image: "assets/img/your-photo.webp"` to that line in the project's `did` list. |
| Add photos to a sustainability activity | Add them to that item's `gallery` list. They open when the cover photo is clicked. |
| Add a price to a service | In `services.items`, fill in `price`, for example `{ en: "From RM60 / hour", ar: "ابتداءً من 60 رينغت للساعة" }`. |
| Change colours | Edit the colour values at the top of `css/style.css`. |
| Changes don't show up | Press Ctrl+F5 to refresh without the cache. Before uploading an update, raise the `?v=3` number on the `style.css`, `content.js` and `main.js` lines in every `.html` file (for example to `?v=4`) so visitors get the new files. |

## Add photos

1. Resize the photo to about 1400 px on its longest side. Phone photos are usually 4000 px or more, which makes the site slow.
   Free tool: https://squoosh.app. Choose **WebP** at quality 80.
2. Put the file in `assets/img/`, for example `assets/img/fyp-prototype.webp`.
3. Refer to it in `content.js`:
   ```js
   { src: "assets/img/fyp-prototype.webp", caption: { en: "FYP prototype", ar: "النموذج الأولي لمشروع التخرج" } }
   ```

## Put the site online (free)

### Option A: Netlify Drop (about 2 minutes, no account needed to try)

1. Go to https://app.netlify.com/drop
2. Drag the whole `site` folder onto the page.
3. You get a link like `https://something.netlify.app`. Create a free account to keep it and to rename it, for example `omeryousif.netlify.app`.
4. To update the site later, drag the folder onto your site's **Deploys** page again.

### Option B: GitHub Pages

1. Create a free GitHub account and a new public repository named `omeryousif.github.io`.
2. Upload everything inside the `site` folder: **Add file → Upload files**.
3. Open **Settings → Pages**, set **Source** to `main` branch, root folder, and save.
4. After a minute the site is live at `https://omeryousif.github.io`.
5. To update it, upload the changed files again.

### Your own domain (optional, about RM50 a year)

Buy a domain such as `omeryousif.com` from Namecheap, Cloudflare or Exabytes. Then connect it in Netlify (**Domain management**) or GitHub (**Settings → Pages → Custom domain**). Both give you free HTTPS.

## Useful links into the site

- `yoursite.com/projects.html` opens all projects
- `yoursite.com/project.html?id=ieee14` opens one project. Every project `id` in `content.js` works this way.
- `yoursite.com/index.html#contact` jumps to the contact section
- Add `?lang=ar` to any link to open it in Arabic, for example `yoursite.com/?lang=ar`
