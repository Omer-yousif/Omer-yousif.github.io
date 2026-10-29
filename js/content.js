/*
  ============================================================
  EDIT THIS FILE TO UPDATE YOUR WEBSITE
  ============================================================
  Every piece of text on the site lives here, in English (en)
  and Arabic (ar) side by side. Change the words between the
  quotes and save. You don't need to touch index.html,
  style.css or main.js.

  Tips
  - Keep the quotes and the commas at the end of each line.
  - To add a project, copy one whole { ... } block inside
    "projects", paste it after the last one, and change it.
  - Images go in assets/img/. Refer to them as
    "assets/img/your-photo.webp" (jpg and png work too).
  - Leave an Arabic line as "" and the English text is shown
    instead.
  - In headings, words between *stars* get the coloured
    accent style, for example "Things I've *built.*"
  ============================================================
*/

window.SITE = {

  /* ---------- Contact details and files ---------- */
  person: {
    name: { en: "Omer Yousif", ar: "عمر يوسف" },
    fullName: { en: "Omer Yousif Ali Abdelkarim", ar: "عمر يوسف علي عبدالكريم" },
    email: "yousifali@graduate.utm.my",
    linkedin: "https://www.linkedin.com/in/omer-yousif-174630331",
    whatsapp: "60196885468",            // country code + number, digits only
    cv: "assets/cv/Omer_Yousif_CV.pdf",
    photo: "assets/img/omer-portrait.webp",
    location: { en: "Johor Bahru, Malaysia", ar: "جوهور بارو، ماليزيا" }
  },

  /* ---------- Small labels used across the site ---------- */
  ui: {
    nav: {
      about: { en: "About", ar: "نبذة" },
      experience: { en: "Experience", ar: "الخبرة" },
      projects: { en: "Projects", ar: "المشاريع" },
      sustainability: { en: "Sustainability", ar: "الاستدامة" },
      services: { en: "Services", ar: "الخدمات" },
      contact: { en: "Contact", ar: "تواصل" }
    },
    langSwitch: { en: "العربية", ar: "English" },
    themeToggle: { en: "Switch colour theme", ar: "تبديل نمط الألوان" },
    menu: { en: "Menu", ar: "القائمة" },
    downloadCv: { en: "Download CV", ar: "تحميل السيرة الذاتية" },
    viewProjects: { en: "See my projects", ar: "استعرض مشاريعي" },
    readCase: { en: "Read the case study", ar: "اقرأ دراسة الحالة" },
    close: { en: "Close", ar: "إغلاق" },
    context: { en: "The problem", ar: "المشكلة" },
    whatIDid: { en: "What I did", ar: "ما قمت به" },
    results: { en: "Results", ar: "النتائج" },
    tools: { en: "Tools", ar: "الأدوات" },
    gallery: { en: "Gallery", ar: "الصور" },
    team: { en: "Team", ar: "الفريق" },
    askQuote: { en: "Ask on WhatsApp", ar: "اسأل عبر واتساب" },
    copy: { en: "Copy", ar: "نسخ" },
    copied: { en: "Copied", ar: "تم النسخ" },
    email: { en: "Email", ar: "البريد الإلكتروني" },
    linkedin: { en: "LinkedIn", ar: "لينكدإن" },
    whatsapp: { en: "WhatsApp", ar: "واتساب" },
    awards: { en: "Awards and certificates", ar: "الجوائز والشهادات" },
    leadership: { en: "Leadership and volunteering", ar: "القيادة والعمل التطوعي" },
    weeks: { en: "Week", ar: "الأسبوع" },
    inProgress: { en: "In progress", ar: "قيد الإنجاز" },
    footer: { en: "Designed and built for Omer Yousif.", ar: "صُمم وبُني لعمر يوسف." },
    imageOf: { en: "Photo", ar: "صورة" },
    skip: { en: "Skip to content", ar: "انتقل إلى المحتوى" },
    caseStudy: { en: "Case study", ar: "دراسة حالة" },
    recognition: { en: "Recognition", ar: "التقدير" },
    recognitionTitle: { en: "Awards and *certificates*", ar: "الجوائز *والشهادات*" },
    tbCompany: { en: "Company", ar: "الجهة" },
    tbRole: { en: "Role", ar: "الدور" },
    tbPlace: { en: "Location", ar: "الموقع" },
    tbDates: { en: "Period", ar: "الفترة" },
    cv: { en: "CV", ar: "السيرة الذاتية" },
    prev: { en: "Previous photo", ar: "الصورة السابقة" },
    next: { en: "Next photo", ar: "الصورة التالية" },
    home: { en: "Home", ar: "الرئيسية" },
    seeWork: { en: "See my work", ar: "شاهد أعمالي" },
    scroll: { en: "Scroll", ar: "مرّر" },
    moreAbout: { en: "More about me", ar: "المزيد عني" },
    allWeeks: { en: "See all 12 weeks", ar: "شاهد الأسابيع الاثني عشر" },
    allProjects: { en: "All projects", ar: "كل المشاريع" },
    exploreSus: { en: "Explore sustainability", ar: "استكشف الاستدامة" },
    allServices: { en: "All services", ar: "كل الخدمات" },
    filterAll: { en: "All", ar: "الكل" },
    photos: { en: "photos", ar: "صور" },
    tapToEnlarge: { en: "Tap a photo to enlarge it", ar: "اضغط على أي صورة لتكبيرها" },
    prevProject: { en: "Previous project", ar: "المشروع السابق" },
    nextProject: { en: "Next project", ar: "المشروع التالي" },
    notFound: { en: "This project could not be found.", ar: "لم يُعثر على هذا المشروع." },
    backToProjects: { en: "Back to all projects", ar: "العودة إلى كل المشاريع" },
    date: { en: "Date", ar: "التاريخ" },
    howItWorks: { en: "How it *works*", ar: "كيف *نعمل*" },
    haveProject: { en: "Have a project in mind?", ar: "لديك مشروع في بالك؟" },
    messageWa: { en: "Message me on WhatsApp", ar: "راسلني عبر واتساب" },
    journey: { en: "My *journey*", ar: "*رحلتي*" },
    skills: { en: "Skills", ar: "المهارات" },
    languages: { en: "Languages", ar: "اللغات" },
    quickFacts: { en: "Quick facts", ar: "معلومات سريعة" },
    doneSoFar: { en: "What I've *done so far*", ar: "ما *أنجزته* حتى الآن" },
    weekByWeek: { en: "Week by *week*", ar: "أسبوعًا *بأسبوع*" },
    onSite: { en: "On site", ar: "من الموقع" },
    backToTop: { en: "Back to top", ar: "العودة للأعلى" }
  },

  /* ---------- Top of the page ---------- */
  hero: {
    eyebrow: { en: "Electrical Engineering · UTM · Class of 2027", ar: "الهندسة الكهربائية · جامعة UTM · دفعة 2027" },
    tagline: {
      en: "Power systems, building services and clean energy.",
      ar: "أنظمة القدرة، خدمات المباني، والطاقة النظيفة."
    },
    lead: {
      en: "I'm a final-year Electrical Engineering student at Universiti Teknologi Malaysia. I have traced live power distribution and fire alarm systems on construction sites in Saudi Arabia, modelled voltage collapse on a 132 kV network, and I'm preparing for the LEED Green Associate exam.",
      ar: "طالب في السنة الأخيرة بكلية الهندسة الكهربائية في الجامعة التكنولوجية الماليزية. تتبّعت أنظمة توزيع الكهرباء وإنذار الحريق في مواقع إنشاء فعلية بالمملكة العربية السعودية، وحاكيت انهيار الجهد في شبكة 132 كيلوفولت، وأستعد حاليًا لاختبار LEED Green Associate."
    },
    /* The opening screen: your cut-out photo stands in front of a giant word */
    cutout: "assets/img/omer-cutout.webp",
    bigWord: { en: "OMER", ar: "عمر" },
    sideLeft: { en: "POWER", ar: "قدرة" },
    sideRight: { en: "ENERGY", ar: "طاقة" },
    intro: { en: "Final-year Electrical Engineering at UTM.", ar: "طالب السنة الأخيرة في الهندسة الكهربائية بجامعة UTM." },
    /* The two small cards floating beside the photo. tone: yellow, green, cyan, pink, violet, orange */
    badges: [
      { value: "3.90", label: { en: "CGPA out of 4.00", ar: "المعدل التراكمي من 4.00" }, tone: "yellow" },
      { value: "LEED", label: { en: "Green Associate candidate", ar: "مرشح Green Associate" }, tone: "green" }
    ]
  },

  /* Quick facts, shown beside your photo on the About page */
  nameplate: {
    title: { en: "Rating plate", ar: "لوحة البيانات" },
    rows: [
      { key: { en: "Type", ar: "النوع" }, value: { en: "Electrical engineer, final year", ar: "مهندس كهربائي، سنة أخيرة" } },
      { key: { en: "Rating", ar: "المعدل" }, value: { en: "CGPA 3.90 / 4.00", ar: "3.90 / 4.00" } },
      { key: { en: "Class", ar: "الفئة" }, value: { en: "LEED GA candidate", ar: "مرشح LEED GA" } },
      { key: { en: "Languages", ar: "اللغات" }, value: { en: "English · Arabic", ar: "العربية · الإنجليزية" } },
      { key: { en: "Location", ar: "الموقع" }, value: { en: "Johor Bahru, MY", ar: "جوهور بارو، ماليزيا" } },
      { key: { en: "Available", ar: "متاح" }, value: { en: "Graduate roles, Oct 2027", ar: "وظائف الخريجين، أكتوبر 2027" } }
    ]
  },

  /* The row of numbers under the hero */
  stats: [
    { value: "3.90", label: { en: "CGPA out of 4.00", ar: "المعدل التراكمي من 4.00" } },
    { value: "5×", label: { en: "Dean's List semesters", ar: "فصول على قائمة العميد" } },
    { value: "3×", label: { en: "Pioneer Academic Excellence Award", ar: "جائزة بايونير للتميز الأكاديمي" } },
    { value: "12", label: { en: "Weeks of site and office training in Saudi Arabia", ar: "أسبوعًا من التدريب الميداني والمكتبي في السعودية" } },
    { value: "800+", label: { en: "Young innovators' robots judged at IYRC ASEAN", ar: "مشارك حكّمتُ مشاريعهم في IYRC آسيان" } }
  ],

  /* ---------- About ---------- */
  about: {
    heading: { en: "Engineer first, with an eye on *energy use.*", ar: "مهندس أولًا، وعيني على *استهلاك الطاقة*" },
    /* Short version shown on the home page */
    summary: {
      en: "From Khartoum to Malaysia: power systems is my strongest ground, my internship added the building side, and sustainability ties the two together.",
      ar: "من الخرطوم إلى ماليزيا: أنظمة القدرة هي أقوى مجالاتي، وأضاف التدريب العملي جانب المباني، والاستدامة هي ما يربط الاثنين."
    },
    /* The timeline on the About page and the home page */
    journey: [
      { when: { en: "Khartoum", ar: "الخرطوم" }, title: { en: "Secondary school", ar: "الدراسة الثانوية" }, text: { en: "93.1% in Engineering Science", ar: "93.1% في المساق الهندسي" }, tone: "orange" },
      { when: { en: "2023 – 2027", ar: "2023 – 2027" }, title: { en: "Electrical Engineering, UTM", ar: "الهندسة الكهربائية، UTM" }, text: { en: "CGPA 3.90 · Dean's List ×5", ar: "معدل 3.90 · قائمة العميد 5 مرات" }, tone: "pink" },
      { when: { en: "Jul – Oct 2026", ar: "يوليو – أكتوبر 2026" }, title: { en: "Intern in Saudi Arabia", ar: "متدرب في السعودية" }, text: { en: "Rawafd Alrwad Engineering Consultancy", ar: "مكتب روافد الرواد للاستشارات الهندسية" }, tone: "violet" },
      { when: { en: "Oct 2027", ar: "أكتوبر 2027" }, title: { en: "Ready for graduate roles", ar: "جاهز لوظائف الخريجين" }, text: { en: "Power systems, building services, renewables", ar: "أنظمة القدرة، خدمات المباني، الطاقة المتجددة" }, tone: "green" }
    ],
    paragraphs: [
      {
        en: "I finished secondary school in Khartoum, Sudan, with 93.1% in Engineering Science, then moved to Malaysia to study Electrical Engineering at UTM. I've kept a 3.90 CGPA, made the Dean's List five times, and received the Pioneer Academic Excellence Award in 2024, 2025 and 2026.",
        ar: "أنهيت دراستي الثانوية في الخرطوم بالسودان بنسبة 93.1% في المساق الهندسي، ثم انتقلت إلى ماليزيا لدراسة الهندسة الكهربائية في الجامعة التكنولوجية الماليزية. حافظت على معدل تراكمي 3.90، ودخلت قائمة العميد خمس مرات، ونلت جائزة بايونير للتميز الأكاديمي في الأعوام 2024 و2025 و2026."
      },
      {
        en: "My strongest ground is power systems: load flow, voltage stability and reactive power compensation. My internship added the building side: low-voltage distribution, fire alarm logic and standby power. Sustainability ties the two together, which is why I'm studying for the LEED Green Associate credential.",
        ar: "أقوى مجالاتي هو أنظمة القدرة: تحليل سريان الأحمال، واستقرار الجهد، وتعويض القدرة غير الفعّالة. وأضاف لي التدريب العملي جانب المباني: توزيع الجهد المنخفض، ومنطق أنظمة إنذار الحريق، وأنظمة الطاقة الاحتياطية. والاستدامة هي ما يربط الجانبين، ولهذا أدرس حاليًا لشهادة LEED Green Associate."
      },
      {
        en: "I work in English and Arabic, which lets me write and review technical documents for teams in Malaysia and the Gulf.",
        ar: "أعمل باللغتين العربية والإنجليزية، مما يتيح لي كتابة الوثائق الفنية ومراجعتها لفرق العمل في ماليزيا ودول الخليج."
      }
    ],
    skills: [
      {
        group: { en: "Power and renewable energy", ar: "القدرة والطاقة المتجددة" },
        items: { en: "Load flow · Voltage stability · Reactive power compensation · Grid-connected PV sizing · Peak sun hours analysis", ar: "سريان الأحمال · استقرار الجهد · تعويض القدرة غير الفعّالة · تصميم الأنظمة الشمسية المتصلة بالشبكة · تحليل ساعات الذروة الشمسية" }
      },
      {
        group: { en: "Building services (MEP)", ar: "خدمات المباني (MEP)" },
        items: { en: "LV distribution (MDB, EMDB, SMDB) · Single-line diagrams · Fire alarm cause-and-effect · Standby power · SBC 401 · NFPA 72", ar: "توزيع الجهد المنخفض (MDB، EMDB، SMDB) · المخططات أحادية الخط · مصفوفة السبب والنتيجة لإنذار الحريق · الطاقة الاحتياطية · كود البناء السعودي 401 · NFPA 72" }
      },
      {
        group: { en: "Control and electronics", ar: "التحكم والإلكترونيات" },
        items: { en: "PID control · Root locus · Bode plots · ESP32 · ATmega32 · Arduino", ar: "متحكم PID · المحل الهندسي للجذور · مخططات بودي · ESP32 · ATmega32 · Arduino" }
      },
      {
        group: { en: "Software", ar: "البرمجيات" },
        items: { en: "MATLAB · PowerWorld · ETAP · AutoCAD · SolidWorks · KiCad · Proteus · Python · C/C++", ar: "MATLAB · PowerWorld · ETAP · AutoCAD · SolidWorks · KiCad · Proteus · Python · C/C++" }
      }
    ]
  },

  /* ---------- Experience (internship) ---------- */
  experience: {
    heading: { en: "Twelve weeks on live sites in *Saudi Arabia*", ar: "اثنا عشر أسبوعًا في مواقع عمل فعلية *بالسعودية*" },
    /* The four boxes on the home page card */
    highlights: [
      { title: { en: "Fire alarm systems", ar: "أنظمة إنذار الحريق" }, text: { en: "FACP loops and cause-and-effect", ar: "حلقات اللوحات ومصفوفة السبب والنتيجة" } },
      { title: { en: "LV distribution", ar: "توزيع الجهد المنخفض" }, text: { en: "MDB, EMDB and SMDB on site", ar: "اللوحات الرئيسية والفرعية في الموقع" } },
      { title: { en: "Emergency power", ar: "الطاقة الاحتياطية" }, text: { en: "Standby feeders and HVAC", ar: "مغذيات الطوارئ والتكييف" } },
      { title: { en: "Design competition", ar: "مسابقة تصميم" }, text: { en: "Eco-lodge bid near Madinah", ar: "نُزُل بيئي قرب المدينة المنورة" } }
    ],
    /* Company logo (shown on the home page card and the Experience page) */
    logo: "assets/img/rawafd-logo.png",
    /* The two photos beside the logo on the home page card (from the gallery below) */
    homePhotos: ["assets/img/intern-site-walk.webp", "assets/img/intern-smdb-inspection.webp"],
    company: { en: "Rawafd Alrwad Engineering Consultancy", ar: "مكتب روافد الرواد للاستشارات الهندسية" },
    role: { en: "Electrical Engineering Intern · Studies, Designs and Sustainability Department", ar: "متدرب هندسة كهربائية · إدارة الدراسات والتصاميم والاستدامة" },
    place: { en: "Buraidah, Qassim, Saudi Arabia", ar: "بريدة، القصيم، المملكة العربية السعودية" },
    dates: { en: "Jul 2026 – Oct 2026", ar: "يوليو 2026 – أكتوبر 2026" },
    summary: {
      en: "A First-Grade consultancy founded in 2014 that supervises government and public-sector projects. I worked under the director of the Studies, Designs and Sustainability Department, split between site inspections and a design competition bid.",
      ar: "مكتب استشاري مصنّف من الدرجة الأولى تأسس عام 2014، ويشرف على مشاريع حكومية ومشاريع للقطاع العام. عملت تحت إشراف مدير إدارة الدراسات والتصاميم والاستدامة، موزعًا وقتي بين التفتيش الميداني والمشاركة في عرض مسابقة تصميم."
    },
    /* photos: pictures from the gallery below shown under that week */
    timeline: [
      {
        weeks: "1",
        photos: ["assets/img/intern-gantt.webp", "assets/img/intern-safety-sign.webp"],
        title: { en: "Orientation", ar: "التهيئة" },
        text: { en: "Onboarding and a review of active government contracts, including work for Aseer Municipality and Qassim University.", ar: "التعريف بالمكتب ومراجعة العقود الحكومية القائمة، ومنها أعمال لأمانة منطقة عسير وجامعة القصيم." }
      },
      {
        weeks: "2",
        photos: ["assets/img/intern-facp-inspection.webp", "assets/img/intern-smoke-detectors.webp", "assets/img/intern-masterplan-sheet.webp", "assets/img/intern-fire-cause-effect.webp"],
        title: { en: "Fire alarm and firefighting", ar: "إنذار الحريق ومكافحته" },
        text: { en: "Site inspections of addressable FACP loops, smoke detectors and firefighting equipment, checking how design zoning works in a real building.", ar: "تفتيش ميداني لحلقات لوحات إنذار الحريق العنونية وكواشف الدخان ومعدات المكافحة، ومقارنة تقسيم المناطق في التصميم بما هو منفّذ في المبنى." }
      },
      {
        weeks: "3",
        photos: ["assets/img/intern-sld-normal-emergency.webp", "assets/img/intern-smdb-inspection.webp", "assets/img/intern-lighting-panel.webp"],
        title: { en: "Distribution, transformers and switchgear", ar: "التوزيع والمحولات ولوحات المفاتيح" },
        text: { en: "Matched single-line diagrams to installed equipment, from the utility supply through transformers, RMUs and ATS changeover to the MDB, EMDB and sub-boards.", ar: "مطابقة المخططات أحادية الخط مع المعدات المركّبة، من تغذية الشبكة مرورًا بالمحولات ووحدات RMU ومفاتيح التحويل الآلي ATS وصولًا إلى اللوحات الرئيسية والفرعية." }
      },
      {
        weeks: "4",
        photos: ["assets/img/intern-ahu-panel.webp", "assets/img/intern-site-interior.webp"],
        title: { en: "Emergency power and HVAC", ar: "الطاقة الاحتياطية والتكييف" },
        text: { en: "Traced emergency feeders down to lighting control panels and saw how electrical and mechanical teams coordinate chillers and AHUs in Revit to avoid clashes.", ar: "تتبّع مغذيات الطوارئ حتى لوحات التحكم بالإنارة، والتعرف على تنسيق الفرق الكهربائية والميكانيكية للمبردات ووحدات مناولة الهواء عبر برنامج Revit لتجنب التعارضات." }
      },
      {
        weeks: "5",
        photos: ["assets/img/intern-lift-controller.webp", "assets/img/intern-control-panel.webp"],
        title: { en: "System integration and solar backup", ar: "تكامل الأنظمة والطاقة الشمسية الاحتياطية" },
        text: { en: "Inspected sprinkler flow and tamper switches and fire-pump MCCs, mapped cause-and-effect with AHUs, smoke dampers and lifts, and studied solar PV with batteries for life-safety loads.", ar: "فحص مفاتيح التدفق والعبث في شبكات الرشاشات ومراكز التحكم بمضخات الحريق، ورسم علاقات السبب والنتيجة مع وحدات مناولة الهواء ومخمّدات الدخان والمصاعد، ودراسة أنظمة شمسية مع بطاريات لأحمال سلامة الأرواح." }
      },
      {
        weeks: "6–7",
        photos: ["assets/img/intern-competition-concept.webp", "assets/img/intern-competition-workflow.webp", "assets/img/intern-competition-timeline.webp"],
        title: { en: "Jabal Umm Nuthaylah design competition", ar: "مسابقة تصميم جبل أم نثيلة" },
        text: { en: "Supported the company's qualification bid for an eco-lodge on volcanic terrain near Madinah: structured the master plan files, proposed dark-sky lighting concepts, wrote five precedent case studies and assembled the team CV package.", ar: "دعم ملف تأهيل المكتب لتصميم نُزُل بيئي على أرض بركانية قرب المدينة المنورة: تنظيم ملفات المخطط العام، واقتراح مفاهيم إنارة تحافظ على السماء المظلمة، وكتابة خمس دراسات حالة مرجعية، وإعداد ملف السير الذاتية للفريق." }
      },
      {
        weeks: "8–12",
        photos: ["assets/img/intern-neural-network.webp", "assets/img/intern-teachable-machine.webp"],
        title: { en: "Python and machine learning", ar: "بايثون وتعلّم الآلة" },
        text: { en: "Completed MITx 6.00.1x and studied neural network fundamentals, writing tested programs that model electrical loads and components.", ar: "إكمال مقرر MITx 6.00.1x ودراسة أساسيات الشبكات العصبية، مع كتابة برامج مُختبرة لنمذجة الأحمال والمكونات الكهربائية." }
      }
    ],
    gallery: [
      { src: "assets/img/intern-site-building.webp", caption: { en: "Site inspection at a government building project", ar: "تفتيش ميداني في مشروع مبنى حكومي" } },
      { src: "assets/img/intern-lighting-panel.webp", caption: { en: "Checking a lighting panel against the schedule", ar: "مراجعة لوحة إنارة مقابل جدول الأحمال" } },
      { src: "assets/img/intern-ahu-panel.webp", caption: { en: "AHU control panel with VFD keypad and heater stages", ar: "لوحة تحكم وحدة مناولة الهواء مع لوحة مفاتيح محوّل التردد ومراحل التسخين" } },
      { src: "assets/img/intern-facp-inspection.webp", caption: { en: "Fire alarm control panel inspection", ar: "فحص لوحة التحكم بإنذار الحريق" } },
      { src: "assets/img/intern-smdb-inspection.webp", caption: { en: "Sub-main distribution board inspection", ar: "فحص لوحة توزيع فرعية" } },
      { src: "assets/img/intern-lift-controller.webp", caption: { en: "Lift controller, part of the fire alarm cause-and-effect", ar: "متحكم المصعد، ضمن مصفوفة السبب والنتيجة لإنذار الحريق" } },
      { src: "assets/img/intern-smoke-detectors.webp", caption: { en: "Smoke detectors that failed testing, removed and replaced", ar: "كواشف دخان لم تعمل بشكل سليم، أُزيلت واستُبدلت بعد الاختبار" } },
      { src: "assets/img/intern-site-walk.webp", caption: { en: "Site walk with the supervision team", ar: "جولة ميدانية مع فريق الإشراف" } },
      { src: "assets/img/intern-control-panel.webp", caption: { en: "Motor control panel with phase indication", ar: "لوحة تحكم بالمحركات مع مؤشرات الأطوار" } },
      { src: "assets/img/intern-masterplan-sheet.webp", caption: { en: "Building floor plan from the site review, marked up with the rooms, smoke detectors, devices and cabling notes", ar: "مخطط المبنى من المراجعة الميدانية، وعليه الغرف وكواشف الدخان والعناصر وملاحظات الأسلاك" } },
      { src: "assets/img/intern-site-interior.webp", caption: { en: "Building services routes before ceiling closure", ar: "مسارات خدمات المبنى قبل إغلاق السقف" } },
      { src: "assets/img/intern-safety-sign.webp", caption: { en: "Bilingual PPE sign at the site entrance", ar: "لوحة معدات الوقاية الشخصية ثنائية اللغة عند مدخل الموقع" } },
      /* Diagrams and figures from my training report. figure: true shows them whole on white */
      { src: "assets/img/intern-fire-cause-effect.webp", figure: true, caption: { en: "Fire alarm inputs and cause-and-effect outputs, drawn from what I traced on site", ar: "مدخلات إنذار الحريق ومخرجات مصفوفة السبب والنتيجة، رسمتها مما تتبّعته في الموقع" } },
      { src: "assets/img/intern-sld-normal-emergency.webp", figure: true, caption: { en: "Simplified single-line diagram of the normal and emergency supply, drawn from site", ar: "مخطط أحادي الخط مبسّط للتغذية العادية والطارئة، رسمته من الموقع" } },
      { src: "assets/img/intern-competition-concept.webp", figure: true, caption: { en: "The company's master plan concept for the Jabal Umm Nuthaylah bid", ar: "مفهوم المخطط العام الذي قدّمه المكتب لمسابقة جبل أم نثيلة" } },
      { src: "assets/img/intern-competition-timeline.webp", figure: true, caption: { en: "Competition stages and key dates (my diagram)", ar: "مراحل المسابقة وتواريخها الرئيسية (من إعدادي)" } },
      { src: "assets/img/intern-competition-workflow.webp", figure: true, caption: { en: "Workflow for the qualification submission; shaded steps are the tasks I carried out", ar: "سير العمل لملف التأهيل؛ الخطوات المظللة هي المهام التي نفذتها" } },
      { src: "assets/img/intern-neural-network.webp", figure: true, caption: { en: "Self-study: neural network structure and algorithm efficiency", ar: "دراسة ذاتية: بنية الشبكة العصبية وكفاءة الخوارزميات" } },
      { src: "assets/img/intern-teachable-machine.webp", figure: true, caption: { en: "Image-classification exercise in Google Teachable Machine", ar: "تمرين تصنيف الصور في Google Teachable Machine" } },
      { src: "assets/img/intern-gantt.webp", figure: true, caption: { en: "My twelve-week training plan (Gantt chart I drew for the report)", ar: "خطة التدريب على اثني عشر أسبوعًا (مخطط جانت من إعدادي)" } }
    ]
  },

  /* ---------- Projects ----------
     Each project gets its own page. "id" becomes the link,
     for example yoursite.com/project.html?id=ieee14. Use letters,
     numbers and dashes only. The first three are featured on
     the home page, the first one large.
     tone           -> card colour: yellow, cyan, violet, green, orange, pink
     figures: true  -> images are diagrams/screenshots, shown whole
     cover: ""      -> shows the formula card instead of a photo
     did[].image    -> optional photo shown next to that step
     chart          -> optional, only "ieee14" uses one */
  projectsHeading: { en: "Things I've designed, built and *simulated.*", ar: "ما *صممته* وبنيته وحاكيته" },
  projectsIntro: {
    en: "Each project opens on its own page with the problem, what I did step by step, the results and the full photo gallery.",
    ar: "يفتح كل مشروع في صفحته الخاصة: المشكلة، وما قمت به خطوة بخطوة، والنتائج، ومعرض الصور كاملًا."
  },
  projects: [
    {
      id: "ieee14",
      tone: "yellow",
      date: { en: "Jan 2026", ar: "يناير 2026" },
      category: { en: "Power systems", ar: "أنظمة القدرة" },
      title: { en: "Voltage collapse and recovery on the IEEE 14-bus network", ar: "انهيار الجهد واستعادته في شبكة IEEE ذات 14 قضيبًا" },
      summary: { en: "Pushed a 132 kV network to 150% load in PowerWorld, watched Bus 14 fall to 0.646 p.u., then compared two ways of bringing it back.", ar: "رفعتُ أحمال شبكة 132 كيلوفولت إلى 150% في PowerWorld، فانخفض جهد القضيب 14 إلى 0.646 وحدة نسبية، ثم قارنت بين طريقتين لاستعادته." },
      cover: "assets/img/ieee14-one-line.webp",
      figures: true,
      /* Optional chart: one dot per row, drawn to scale between min and max */
      chart: {
        title: { en: "Bus 14 voltage in each case", ar: "جهد القضيب 14 في كل حالة" },
        unit: "p.u.",
        min: 0.6,
        max: 1.0,
        reference: { value: 0.95, label: { en: "Usual lower limit 0.95 p.u.", ar: "الحد الأدنى المعتاد 0.95" } },
        rows: [
          { value: 0.913, tone: "neutral", label: { en: "Normal load", ar: "الحمل الطبيعي" } },
          { value: 0.6455, tone: "bad", label: { en: "150% load", ar: "حمل 150%" } },
          { value: 0.6826, tone: "good", label: { en: "150% + 9 Mvar capacitor", ar: "150% + مكثف 9 ميغافار" } },
          { value: 0.6795, tone: "good", label: { en: "150% + Gen 8 Qmax 32.5 Mvar", ar: "150% + رفع Qmax للمولد 8" } }
        ]
      },
      team: { en: "Group project, 3 members", ar: "مشروع جماعي، 3 أعضاء" },
      tools: ["PowerWorld Simulator", "Newton-Raphson load flow", "Excel"],
      metrics: [
        { value: "0.913", unit: "p.u.", label: { en: "Bus 14 at normal load", ar: "القضيب 14 عند الحمل الطبيعي" } },
        { value: "0.646", unit: "p.u.", label: { en: "Bus 14 at 150% load", ar: "القضيب 14 عند حمل 150%" } },
        { value: "+5.7", unit: "%", label: { en: "With a 9 Mvar shunt capacitor", ar: "بإضافة مكثف توازي 9 ميغافار" } },
        { value: "+5.3", unit: "%", label: { en: "Raising Gen 8 Qmax to 32.5 Mvar", ar: "برفع Qmax للمولد 8 إلى 32.5 ميغافار" } }
      ],
      context: {
        en: "The IEEE 14-bus test system has five generators, eleven loads and twenty lines at 132 kV. Even at normal load, every PV generator sat at its reactive power limit, leaving Bus 14 as the weakest point at 0.913 p.u. The task was to stress the network and restore the voltage by about 5%.",
        ar: "يضم نظام الاختبار IEEE ذو 14 قضيبًا خمسة مولدات وأحد عشر حملًا وعشرين خط نقل بجهد 132 كيلوفولت. وحتى عند الحمل الطبيعي كانت جميع المولدات عند حدّها الأعلى للقدرة غير الفعّالة، فكان القضيب 14 أضعف نقطة بجهد 0.913 وحدة نسبية. وكان المطلوب إجهاد الشبكة ثم استعادة الجهد بنحو 5%."
      },
      did: [
        { en: "Modelled the full network in PowerWorld with generator reactive limits and the slack bus at Bus 1.", ar: "نمذجة الشبكة كاملة في PowerWorld مع حدود القدرة غير الفعّالة للمولدات واعتبار القضيب 1 قضيبَ الموازنة.", image: "assets/img/ieee14-one-line.webp" },
        { en: "Ran a 150% load case: Bus 14 collapsed to 0.646 p.u. and 10 of the 14 buses fell below 0.80 p.u.", ar: "تشغيل حالة حمل 150%: انهار جهد القضيب 14 إلى 0.646 وحدة نسبية، وانخفض 10 من أصل 14 قضيبًا إلى أقل من 0.80." },
        { en: "Method 1: added a 9 Mvar shunt capacitor at Bus 14 for local reactive support.", ar: "الطريقة الأولى: إضافة مكثف توازي بقدرة 9 ميغافار عند القضيب 14 لتوفير دعم محلي للقدرة غير الفعّالة.", image: "assets/img/ieee14-bus-voltages.webp" },
        { en: "Method 2: raised the Bus 8 generator's Qmax to 32.5 Mvar, then compared both methods on voltage support and system losses.", ar: "الطريقة الثانية: رفع الحد الأعلى للقدرة غير الفعّالة لمولد القضيب 8 إلى 32.5 ميغافار، ثم المقارنة بين الطريقتين من حيث دعم الجهد والفقد في النظام." }
      ],
      results: [
        { en: "The capacitor lifted Bus 14 from 0.6455 to 0.6826 p.u. (+5.7%) and also raised Bus 13 to 0.708 and Bus 9 to 0.723 p.u.", ar: "رفع المكثف جهد القضيب 14 من 0.6455 إلى 0.6826 وحدة نسبية (+5.7%)، ورفع كذلك القضيب 13 إلى 0.708 والقضيب 9 إلى 0.723." },
        { en: "The generator change reached 0.6795 p.u. (+5.3%). Local compensation at the weak bus did slightly better than adding reactive capacity further away.", ar: "وصل تعديل المولد إلى 0.6795 وحدة نسبية (+5.3%). أي أن التعويض المحلي عند القضيب الضعيف كان أفضل قليلًا من زيادة القدرة غير الفعّالة في موقع أبعد." },
        { en: "With the capacitor in place, total losses were 51.6 MW and 199.1 Mvar.", ar: "بعد تركيب المكثف بلغ إجمالي الفقد 51.6 ميغاواط و199.1 ميغافار." }
      ],
      gallery: [
        { src: "assets/img/ieee14-one-line.webp", caption: { en: "The IEEE 14-bus network modelled in PowerWorld", ar: "شبكة IEEE ذات 14 قضيبًا كما نُمذجت في PowerWorld" } },
        { src: "assets/img/ieee14-bus-voltages.webp", caption: { en: "Bus voltages at 150% load with the 9 Mvar capacitor", ar: "جهود القضبان عند حمل 150% مع مكثف 9 ميغافار" } }
      ]
    },
    {
      id: "robot",
      tone: "cyan",
      date: { en: "Apr – May 2025", ar: "أبريل – مايو 2025" },
      category: { en: "Control and embedded", ar: "التحكم والأنظمة المدمجة" },
      title: { en: "Self-balancing robot, from CAD to code", ar: "روبوت ذاتي التوازن، من التصميم إلى البرمجة" },
      summary: { en: "A two-wheeled robot that stays upright with a PID loop on an ESP32-C3. I designed the chassis, made the PCB by hand and built the phone app that drives it.", ar: "روبوت بعجلتين يحافظ على توازنه عبر حلقة تحكم PID على متحكم ESP32-C3. صممت الهيكل، وصنعت اللوحة الإلكترونية يدويًا، وبنيت تطبيق الهاتف الذي يتحكم به." },
      cover: "assets/img/robot-cad.webp",
      team: { en: "Individual build in a month-long UTM workshop", ar: "بناء فردي ضمن ورشة عمل لمدة شهر في UTM" },
      tools: ["ESP32-C3", "MPU6050 (I2C)", "C++", "KiCad", "SolidWorks", "Bambu Studio / Cura", "MIT App Inventor"],
      metrics: [
        { value: "6", unit: "", label: { en: "Disciplines in one build", ar: "تخصصات في مشروع واحد" } },
        { value: "1", unit: { en: "month", ar: "شهر" }, label: { en: "From idea to a balancing robot", ar: "من الفكرة إلى روبوت متوازن" } }
      ],
      context: {
        en: "A self-balancing robot is an inverted pendulum: without constant correction it falls over. Getting it to stand needs mechanics, electronics, firmware and control theory to work together.",
        ar: "الروبوت ذاتي التوازن هو بندول مقلوب، يسقط إن لم يُصحَّح وضعه باستمرار. ولكي يقف لا بد أن تعمل الميكانيكا والإلكترونيات والبرمجيات ونظرية التحكم معًا."
      },
      did: [
        { en: "Modelled the chassis in SolidWorks and 3D printed it on Creality and Bambu Lab printers.", ar: "تصميم الهيكل في SolidWorks وطباعته ثلاثيًا على طابعات Creality وBambu Lab.", image: "assets/img/robot-3d-printing.webp" },
        { en: "Designed the PCB in KiCad, exported Gerbers, then etched, drilled and soldered the board myself.", ar: "تصميم اللوحة الإلكترونية في KiCad وتصدير ملفات Gerber، ثم حفرها وثقبها ولحامها بنفسي.", image: "assets/img/robot-pcb-drilling.webp" },
        { en: "Wrote real-time motor control in C++ on the ESP32-C3, reading tilt from an MPU6050 over I2C.", ar: "برمجة التحكم الآني بالمحركات بلغة C++ على ESP32-C3، مع قراءة الميل من حساس MPU6050 عبر I2C.", image: "assets/img/robot-lab.webp" },
        { en: "Tuned the PID gains experimentally until the robot held its balance under pushes.", ar: "ضبط معاملات PID تجريبيًا حتى حافظ الروبوت على توازنه عند دفعه." },
        { en: "Built an Android app in MIT App Inventor to drive the robot over WiFi.", ar: "بناء تطبيق أندرويد عبر MIT App Inventor للتحكم بالروبوت لاسلكيًا عبر WiFi.", image: "assets/img/robot-track-test.webp" }
      ],
      results: [
        { en: "A working robot that balances on its own and can be driven from a phone.", ar: "روبوت يعمل ويتوازن ذاتيًا ويمكن قيادته من الهاتف." },
        { en: "Hands-on experience across the full chain, from CAD to fabrication to control tuning.", ar: "خبرة عملية في السلسلة الكاملة، من التصميم إلى التصنيع إلى ضبط التحكم." }
      ],
      gallery: [
        { src: "assets/img/robot-cad.webp", caption: { en: "Chassis model in SolidWorks", ar: "نموذج الهيكل في SolidWorks" } },
        { src: "assets/img/robot-3d-printing.webp", caption: { en: "3D printing the chassis parts", ar: "الطباعة ثلاثية الأبعاد لأجزاء الهيكل" } },
        { src: "assets/img/robot-pcb-drilling.webp", caption: { en: "Drilling the hand-made PCB", ar: "ثقب اللوحة الإلكترونية المصنوعة يدويًا" } },
        { src: "assets/img/robot-track-test.webp", caption: { en: "Testing the robot on the track", ar: "اختبار الروبوت على المسار" } },
        { src: "assets/img/robot-lab.webp", caption: { en: "Programming the ESP32 in the lab", ar: "برمجة ESP32 في المختبر" } }
      ]
    },
    {
      id: "control",
      tone: "violet",
      date: { en: "Feb 2026", ar: "فبراير 2026" },
      category: { en: "Control systems", ar: "أنظمة التحكم" },
      title: { en: "Controller design checked three different ways", ar: "تصميم متحكم والتحقق منه بثلاث طرق" },
      summary: { en: "Designed proportional controllers for 10% and 20% overshoot. MATLAB iteration, analytical design and root locus all agreed within 0.6%.", ar: "صممت متحكمات تناسبية لتحقيق تجاوز بنسبة 10% و20%. وتطابقت نتائج التكرار في MATLAB والتصميم التحليلي والمحل الهندسي للجذور بفارق لا يتجاوز 0.6%." },
      cover: "assets/img/control-root-locus.webp",
      figures: true,
      team: { en: "Course project, SKEE3143 Control Systems", ar: "مشروع مقرر SKEE3143 أنظمة التحكم" },
      tools: ["MATLAB", "Control System Toolbox", "Root locus", "Bode plots"],
      metrics: [
        { value: "0.6", unit: "%", label: { en: "Largest gap between the three methods", ar: "أكبر فرق بين الطرق الثلاث" } },
        { value: "3", unit: "", label: { en: "Open-loop systems compared for robustness", ar: "أنظمة حلقة مفتوحة قورنت متانتها" } }
      ],
      context: {
        en: "Second- and third-order plants needed a proportional gain that gives a specific overshoot. A single method can hide mistakes, so I solved each case three ways and compared.",
        ar: "احتاجت أنظمة من الرتبتين الثانية والثالثة إلى كسب تناسبي يحقق نسبة تجاوز محددة. والاعتماد على طريقة واحدة قد يخفي الأخطاء، لذا حللت كل حالة بثلاث طرق وقارنت بينها."
      },
      did: [
        { en: "Found the gain by MATLAB iteration, by analytical damping-ratio design and from the root locus.", ar: "إيجاد الكسب بالتكرار في MATLAB، وبالتصميم التحليلي لنسبة التخميد، ومن المحل الهندسي للجذور.", image: "assets/img/control-overshoot-gain.webp" },
        { en: "Read gain margin, phase margin and crossover frequencies from the Bode plots of three open-loop systems.", ar: "استخراج هامش الكسب وهامش الطور وترددات العبور من مخططات بودي لثلاثة أنظمة ذات حلقة مفتوحة.", image: "assets/img/control-bode.webp" },
        { en: "Identified each system type and calculated the error constants Kp, Kv and Ka.", ar: "تحديد نوع كل نظام وحساب ثوابت الخطأ Kp وKv وKa." }
      ],
      results: [
        { en: "All three methods agreed within 0.6% for the 10% overshoot target.", ar: "تطابقت الطرق الثلاث بفارق لا يتجاوز 0.6% لهدف التجاوز 10%." },
        { en: "A clear comparison of how robust each system is, based on its stability margins.", ar: "مقارنة واضحة لمتانة كل نظام بناءً على هوامش الاستقرار." }
      ],
      gallery: [
        { src: "assets/img/control-root-locus.webp", caption: { en: "Root locus with the damping-ratio line", ar: "المحل الهندسي للجذور مع خط نسبة التخميد" } },
        { src: "assets/img/control-overshoot-gain.webp", caption: { en: "Overshoot against gain, with the 10% target", ar: "نسبة التجاوز مقابل الكسب، مع هدف 10%" } },
        { src: "assets/img/control-step-response.webp", caption: { en: "Step response with peak, rise and settling times", ar: "الاستجابة الخطوية مع زمن الذروة والصعود والاستقرار" } },
        { src: "assets/img/control-bode.webp", caption: { en: "Bode plot with gain and phase margins", ar: "مخطط بودي مع هامشي الكسب والطور" } }
      ]
    },
    {
      id: "solar-pv",
      tone: "green",
      date: { en: "Dec 2024", ar: "ديسمبر 2024" },
      category: { en: "Renewable energy", ar: "الطاقة المتجددة" },
      title: { en: "Grid-connected solar PV design", ar: "تصميم الأنظمة الشمسية المتصلة بالشبكة" },
      summary: { en: "Sized grid-connected PV systems from peak sun hours and module datasheets, then installed modules and MC4 connectors by hand.", ar: "صممت أنظمة شمسية متصلة بالشبكة اعتمادًا على ساعات الذروة الشمسية وبيانات الألواح، ثم ركّبت الألواح ووصلات MC4 بنفسي." },
      cover: "assets/img/solar-group.webp",
      team: { en: "Workshop by Assoc. Prof. Ir. Ts. Dr. Jasrul Jamani Jamian, IEEE PES UTM", ar: "ورشة قدّمها الأستاذ المشارك د. جسرل جماني جاميان، فرع IEEE PES بجامعة UTM" },
      tools: ["PSH analysis", "Module datasheets", "Inverter selection", "MC4 crimping"],
      metrics: [
        { value: "3", unit: "", label: { en: "Module types compared: mono, poly, thin film", ar: "أنواع ألواح قورنت: أحادي، متعدد، رقيق" } }
      ],
      context: {
        en: "Rooftop solar is growing fast in Malaysia. Sizing it well means reading the site's sun resource and the module datasheets correctly, then wiring the DC side safely.",
        ar: "تنمو الطاقة الشمسية على الأسطح بسرعة في ماليزيا. والتصميم الجيد يتطلب قراءة صحيحة لمورد الشمس في الموقع ولبيانات الألواح، ثم توصيل جانب التيار المستمر بأمان."
      },
      did: [
        { en: "Calculated peak sun hours and module efficiency to size GCPV systems.", ar: "حساب ساعات الذروة الشمسية وكفاءة الألواح لتحديد حجم الأنظمة الشمسية المتصلة بالشبكة." },
        { en: "Read datasheets for mono, poly and thin-film modules and compared inverter types.", ar: "قراءة بيانات الألواح أحادية البلورة ومتعددة البلورات والرقيقة، والمقارنة بين أنواع العاكسات." },
        { en: "Installed PV modules and crimped MC4 connectors, following high-voltage DC safety practice.", ar: "تركيب الألواح وتجهيز وصلات MC4 مع الالتزام بممارسات السلامة للتيار المستمر عالي الجهد.", image: "assets/img/solar-mc4-crimping.webp" }
      ],
      results: [
        { en: "The basis for the solar sizing and bill-check service I offer below.", ar: "أساس خدمة تصميم الأنظمة الشمسية ومراجعة الفواتير التي أقدّمها أدناه." }
      ],
      gallery: [
        { src: "assets/img/solar-mc4-crimping.webp", caption: { en: "Crimping an MC4 connector", ar: "تجهيز وصلة MC4" } },
        { src: "assets/img/solar-certificate.webp", caption: { en: "Receiving the workshop certificate", ar: "استلام شهادة الورشة" } },
        { src: "assets/img/solar-group.webp", caption: { en: "Workshop participants", ar: "المشاركون في الورشة" } }
      ]
    },
    {
      id: "safe",
      tone: "orange",
      date: { en: "Jan 2024", ar: "يناير 2024" },
      category: { en: "Microcontrollers", ar: "المتحكمات الدقيقة" },
      title: { en: "Automatic safe on an ATmega32", ar: "خزنة آلية بمتحكم ATmega32" },
      summary: { en: "A keypad safe with a 4-digit code, a 7-segment countdown and a servo-driven door, written in C and validated in Proteus.", ar: "خزنة برمز من 4 أرقام ولوحة مفاتيح، مع عدّ تنازلي على شاشة سباعية وباب يتحرك بمحرك سيرفو، مبرمجة بلغة C ومُختبرة في Proteus." },
      cover: "assets/img/safe-proteus.webp",
      figures: true,
      team: { en: "Group project, 3 members, SEEE3223 Microprocessors", ar: "مشروع جماعي، 3 أعضاء، مقرر SEEE3223 المعالجات الدقيقة" },
      tools: ["ATmega32", "C", "Microchip Studio", "Proteus VSM"],
      metrics: [
        { value: "4", unit: { en: "digits", ar: "أرقام" }, label: { en: "Password entered on a keypad", ar: "رمز يُدخل عبر لوحة المفاتيح" } },
        { value: "9→0", unit: "", label: { en: "Countdown before the door closes", ar: "عدّ تنازلي قبل إغلاق الباب" } }
      ],
      context: {
        en: "The brief was a C program on an ATmega32 driving at least four input and output devices, using subroutines and interrupts.",
        ar: "كان المطلوب برنامجًا بلغة C على متحكم ATmega32 يشغّل أربعة أجهزة إدخال وإخراج على الأقل، مع استخدام البرامج الفرعية والمقاطعات."
      },
      did: [
        { en: "Wrote the password logic: each key press shows on the 7-segment display and the code is checked against the stored one.", ar: "برمجة منطق الرمز: يظهر كل رقم مُدخل على الشاشة السباعية، ثم يُقارن الرمز بالرمز المخزّن.", image: "assets/img/safe-keypad-display.webp" },
        { en: "On a correct code: green LED, servo opens the door 90°, 9-to-0 countdown, then the door closes. On a wrong code: red LED.", ar: "عند الرمز الصحيح: يضيء المؤشر الأخضر ويفتح السيرفو الباب 90 درجة ثم يبدأ عدّ تنازلي من 9 إلى 0 ويُغلق الباب. وعند الرمز الخاطئ: يضيء المؤشر الأحمر.", image: "assets/img/safe-video-correct-code.webp" },
        { en: "Drew the full circuit and flowchart, and tested every state in Proteus before hardware.", ar: "رسم الدائرة كاملة ومخطط التدفق، واختبار جميع الحالات في Proteus قبل التنفيذ الفعلي.", image: "assets/img/safe-flowchart.webp" }
      ],
      results: [
        { en: "A working simulation covering start-up, success, failure and countdown states.", ar: "محاكاة تعمل تغطي حالات التشغيل والنجاح والفشل والعدّ التنازلي." }
      ],
      gallery: [
        { src: "assets/img/safe-proteus.webp", caption: { en: "Full circuit running in Proteus", ar: "الدائرة كاملة أثناء التشغيل في Proteus" } },
        { src: "assets/img/safe-flowchart.webp", caption: { en: "Program flowchart", ar: "مخطط تدفق البرنامج" } },
        { src: "assets/img/safe-keypad-display.webp", caption: { en: "Keypad and 7-segment display", ar: "لوحة المفاتيح والشاشة السباعية" } },
        /* Frames from the project video. photo: true shows them full-frame */
        { src: "assets/img/safe-video-correct-code.webp", photo: true, caption: { en: "Hardware demo: correct code, green LED on and the door countdown running", ar: "تجربة الدائرة: رمز صحيح، يضيء المؤشر الأخضر ويبدأ العد التنازلي لإغلاق الباب" } },
        { src: "assets/img/safe-video-wrong-code.webp", photo: true, caption: { en: "Hardware demo: wrong code, red LED on and the door stays shut", ar: "تجربة الدائرة: رمز خاطئ، يضيء المؤشر الأحمر ويبقى الباب مغلقًا" } },
        { src: "assets/img/safe-video-presenting.webp", photo: true, caption: { en: "Presenting the project in our video", ar: "أشرح المشروع في الفيديو" } }
      ]
    },
    {
      id: "electromagnet",
      tone: "pink",
      date: { en: "Jan 2025", ar: "يناير 2025" },
      category: { en: "Applied electromagnetics", ar: "الكهرومغناطيسية التطبيقية" },
      title: { en: "What makes an electromagnet stronger", ar: "ما الذي يجعل المغناطيس الكهربائي أقوى" },
      summary: { en: "Wound copper wire on an iron nail and changed one thing at a time: turns, voltage, wire diameter and core. Raising the voltage from 1.5 V to 3.3 V doubled its pull. I was lead author of the journal-style report.", ar: "لففت سلكًا نحاسيًا على مسمار حديدي وغيّرت عاملًا واحدًا في كل مرة: عدد اللفات، والجهد، وقطر السلك، ونوع القلب. رفع الجهد من 1.5 إلى 3.3 فولت ضاعف قوة الجذب. وكنت المؤلف الرئيسي للتقرير المكتوب بأسلوب الأوراق العلمية." },
      cover: "assets/img/emt-battery-20-turns.webp",
      team: { en: "Group project, 5 members, SEEE2523 Electromagnetic Field Theory", ar: "مشروع جماعي، 5 أعضاء، مقرر SEEE2523 نظرية المجال الكهرومغناطيسي" },
      tools: ["Copper wire 0.5 mm and 0.8 mm", "Iron nail and wooden core", "1.5 V and 3.3 V cells", "Paper-clip pull test", "Ampère's law"],
      metrics: [
        { value: "2→4", unit: { en: "clips", ar: "مشابك" }, label: { en: "Voltage raised from 1.5 V to 3.3 V", ar: "برفع الجهد من 1.5 إلى 3.3 فولت" } },
        { value: "2→3", unit: { en: "clips", ar: "مشابك" }, label: { en: "From 20 to 30 turns", ar: "من 20 إلى 30 لفة" } },
        { value: "2→3", unit: { en: "clips", ar: "مشابك" }, label: { en: "Thicker wire, 0.5 mm to 0.8 mm", ar: "سلك أسمك، من 0.5 إلى 0.8 مم" } },
        { value: "0", unit: { en: "clips", ar: "مشابك" }, label: { en: "With a wooden core instead of iron", ar: "بقلب خشبي بدل الحديد" } }
      ],
      /* Optional chart: one dot per row. step and decimals set the axis ticks */
      chart: {
        title: { en: "Paper clips attracted in each test", ar: "عدد المشابك المجذوبة في كل اختبار" },
        unit: { en: "clips", ar: "مشابك" },
        min: 0,
        max: 4,
        step: 1,
        decimals: 0,
        rows: [
          { value: 2, tone: "neutral", label: { en: "Baseline: 20 turns, 1.5 V, 0.5 mm, iron", ar: "الأساس: 20 لفة، 1.5 فولت، 0.5 مم، حديد" } },
          { value: 3, tone: "good", label: { en: "30 turns", ar: "30 لفة" } },
          { value: 4, tone: "good", label: { en: "3.3 V cell", ar: "بطارية 3.3 فولت" } },
          { value: 3, tone: "good", label: { en: "0.8 mm wire", ar: "سلك 0.8 مم" } },
          { value: 0, tone: "bad", label: { en: "Wooden core", ar: "قلب خشبي" } }
        ]
      },
      context: {
        en: "Ampère's law says the field of a coil grows with the current and the number of turns, and an iron core concentrates it. We wanted to see how much each design choice matters when you build an electromagnet by hand.",
        ar: "ينص قانون أمبير على أن المجال المغناطيسي للملف يزداد بزيادة التيار وعدد اللفات، وأن القلب الحديدي يركّزه. وأردنا أن نرى مقدار تأثير كل قرار تصميمي عند بناء المغناطيس الكهربائي يدويًا."
      },
      did: [
        { en: "Built the baseline: 20 turns of 0.5 mm copper wire on an iron nail, powered by a 1.5 V cell, with strength measured by how many paper clips it picked up.", ar: "بناء النموذج الأساسي: 20 لفة من سلك نحاسي قطره 0.5 مم على مسمار حديدي، تغذيه بطارية 1.5 فولت، وتُقاس القوة بعدد المشابك الورقية التي يلتقطها.", image: "assets/img/emt-battery-20-turns.webp" },
        { en: "Changed the number of turns from 20 to 30, keeping everything else fixed.", ar: "تغيير عدد اللفات من 20 إلى 30 مع تثبيت بقية العوامل.", image: "assets/img/emt-turns-20-30.webp" },
        { en: "Swapped the 1.5 V cell for a 3.3 V cell.", ar: "استبدال بطارية 1.5 فولت ببطارية 3.3 فولت.", image: "assets/img/emt-battery-3v3.webp" },
        { en: "Rewound the coil with thicker 0.8 mm wire.", ar: "إعادة لف الملف بسلك أسمك قطره 0.8 مم.", image: "assets/img/emt-wire-diameters.webp" },
        { en: "Replaced the iron nail with a wooden stick to test the core.", ar: "استبدال المسمار الحديدي بعود خشبي لاختبار أثر القلب.", image: "assets/img/emt-cores.webp" },
        { en: "Wrote the journal-format report as lead author, linking each result to Ampère's and Ohm's laws.", ar: "كتابة التقرير بصيغة الأوراق العلمية بصفتي المؤلف الرئيسي، وربط كل نتيجة بقانوني أمبير وأوم." }
      ],
      results: [
        { en: "Voltage had the biggest effect: 3.3 V picked up 4 clips against 2 at 1.5 V, because more voltage drives more current through the coil.", ar: "كان للجهد الأثر الأكبر: التقط المغناطيس 4 مشابك عند 3.3 فولت مقابل مشبكين عند 1.5 فولت، لأن الجهد الأعلى يمرر تيارًا أكبر في الملف." },
        { en: "More turns and thicker wire each raised the count from 2 to 3. Thicker wire has lower resistance, so more current flows.", ar: "رفعت زيادة اللفات وزيادة سُمك السلك العدد من 2 إلى 3 لكل منهما، لأن السلك الأسمك أقل مقاومة فيمر تيار أكبر." },
        { en: "The wooden core attracted nothing, while iron attracted 2 clips: a ferromagnetic core is essential.", ar: "لم يجذب القلب الخشبي أي مشبك، بينما جذب الحديد مشبكين، فالقلب المغناطيسي الحديدي ضروري." }
      ],
      gallery: [
        { src: "assets/img/emt-battery-20-turns.webp", caption: { en: "Baseline electromagnet: 20 turns on an iron nail with a 1.5 V cell", ar: "النموذج الأساسي: 20 لفة على مسمار حديدي مع بطارية 1.5 فولت" } },
        { src: "assets/img/emt-turns-20-30.webp", caption: { en: "Coils with 20 and 30 turns", ar: "ملفان بعدد 20 و30 لفة" } },
        { src: "assets/img/emt-battery-3v3.webp", caption: { en: "The 3.3 V cell used in the voltage test", ar: "بطارية 3.3 فولت المستخدمة في اختبار الجهد" } },
        { src: "assets/img/emt-wire-diameters.webp", caption: { en: "0.5 mm and 0.8 mm copper wire", ar: "سلك نحاسي بقطر 0.5 و0.8 مم" } },
        { src: "assets/img/emt-cores.webp", caption: { en: "The two cores: iron nail and wooden stick", ar: "القلبان المستخدمان: مسمار حديدي وعود خشبي" } }
      ]
    }
  ],

  /* ---------- Sustainability ---------- */
  sustainability: {
    heading: { en: "Where my engineering is *heading.*", ar: "إلى أين *تتجه* هندستي" },
    intro: {
      en: "Buildings use a large share of the world's electricity. I want to design the power side of buildings so they use less and run on cleaner sources.",
      ar: "تستهلك المباني حصة كبيرة من كهرباء العالم. أريد أن أصمم الجانب الكهربائي للمباني بحيث تستهلك أقل وتعمل بمصادر أنظف."
    },
    /* The three photos at the top of the Sustainability page; the first one is also used on the home page */
    heroImages: ["assets/img/green-icon-team.webp", "assets/img/sunway-warehouse.webp", "assets/img/iyrc-judge.webp"],
    leed: {
      title: { en: "LEED Green Associate", ar: "LEED Green Associate" },
      status: { en: "Preparing for the exam", ar: "أستعد للاختبار" },
      text: { en: "Studying the LEED rating systems, energy efficiency and sustainable building strategies.", ar: "أدرس أنظمة تقييم LEED، وكفاءة الطاقة، واستراتيجيات المباني المستدامة." }
    },
    /* Figures from the Sunway Paving visit (their published numbers) */
    figures: {
      title: { en: "Seen on site: Sunway Paving Solutions, Dec 2025", ar: "من الزيارة الميدانية: Sunway Paving Solutions، ديسمبر 2025" },
      note: { en: "Figures shared by Sunway Paving during the visit.", ar: "أرقام عرضتها الشركة أثناء الزيارة." },
      items: [
        { value: "2,327", unit: "MWh", label: { en: "Generated by their solar PV systems", ar: "أنتجتها أنظمتهم الشمسية" } },
        { value: "1,361", unit: "t CO₂", label: { en: "Emissions cut by that solar output", ar: "انبعاثات خُفّضت بفضل هذا الإنتاج الشمسي" } },
        { value: "6,450", unit: "t CO₂", label: { en: "Avoided with lower-carbon cement alternatives", ar: "تم تجنبها باستخدام بدائل إسمنت أقل كربونًا" } }
      ]
    },
    items: [
      {
        date: { en: "Feb 2026", ar: "فبراير 2026" },
        title: { en: "Green Icon: Training for Trainers", ar: "Green Icon: تدريب المدربين" },
        text: { en: "Trained at UTM Living Lab to lead hands-on green activities with other students.", ar: "تدربت في مختبر UTM الحي على قيادة الأنشطة البيئية العملية مع الطلاب." },
        image: "assets/img/green-icon-team.webp",
        /* More photos, opened when the cover photo is clicked */
        gallery: [
          { src: "assets/img/green-icon-team.webp", caption: { en: "With the Green Icon trainees at UTM Living Lab", ar: "مع متدربي Green Icon في مختبر UTM الحي" } },
          { src: "assets/img/green-icon-2.webp", caption: { en: "Preparing the planting beds", ar: "تجهيز أحواض الزراعة" } },
          { src: "assets/img/green-icon-3.webp", caption: { en: "Clearing the site", ar: "تنظيف الموقع" } },
          { src: "assets/img/green-icon-1.webp", caption: { en: "Collecting green waste", ar: "جمع المخلفات الخضراء" } }
        ]
      },
      {
        date: { en: "Dec 2025", ar: "ديسمبر 2025" },
        title: { en: "Net Zero manufacturing visit", ar: "زيارة لمصنع يسعى إلى الحياد الكربوني" },
        text: { en: "Saw how Sunway Paving works toward Net Zero by 2050 with solar PV, low-carbon materials and high-SRI pavers that cool urban surfaces.", ar: "اطلعت على مساعي Sunway Paving للوصول إلى الحياد الكربوني بحلول 2050 عبر الطاقة الشمسية والمواد منخفضة الكربون وبلاطات ذات انعكاسية شمسية عالية تخفف حرارة المدن." },
        image: "assets/img/sunway-site.webp",
        gallery: [
          { src: "assets/img/sunway-site.webp", caption: { en: "On site at Sunway Paving", ar: "في موقع Sunway Paving" } },
          { src: "assets/img/sunway-warehouse.webp", caption: { en: "Low-carbon pavers in the warehouse", ar: "بلاطات منخفضة الكربون في المستودع" } },
          { src: "assets/img/sunway-sign.webp", caption: { en: "Sunway Paving Solutions", ar: "Sunway Paving Solutions" } }
        ]
      },
      {
        date: { en: "Jun 2025", ar: "يونيو 2025" },
        title: { en: "Judge at IYRC ASEAN, Green Energy theme", ar: "محكّم في IYRC آسيان، محور الطاقة الخضراء" },
        text: { en: "Evaluated robotics projects from 800+ young innovators on technical logic and sustainable design.", ar: "قيّمت مشاريع روبوتية لأكثر من 800 مبتكر شاب من حيث المنطق التقني والتصميم المستدام." },
        image: "assets/img/iyrc-judge.webp",
        gallery: [
          { src: "assets/img/iyrc-judge.webp", caption: { en: "Judging at IYRC ASEAN", ar: "التحكيم في IYRC آسيان" } },
          { src: "assets/img/iyrc-judging-desk.webp", caption: { en: "At the judging desk", ar: "على طاولة التحكيم" } },
          { src: "assets/img/iyrc-hall.webp", caption: { en: "The competition hall", ar: "قاعة المسابقة" } },
          { src: "assets/img/iyrc-robots.webp", caption: { en: "Robots built by young innovators", ar: "روبوتات صنعها مبتكرون شباب" } }
        ]
      },
      {
        date: { en: "Since Oct 2024", ar: "منذ أكتوبر 2024" },
        title: { en: "UTM Green DNA member", ar: "عضو في UTM Green DNA" },
        text: { en: "Supporting carbon-neutral and zero-waste initiatives on campus.", ar: "أدعم مبادرات الحياد الكربوني وصفر نفايات داخل الحرم الجامعي." },
        /* logo: true shows the image whole on a white card */
        image: "assets/img/green-dna-logo.png",
        logo: true
      }
    ]
  },

  /* ---------- Services ----------
     "price" is optional. Leave it as "" to hide it.
     "featured": true shows that service as the wide card on top.
     tone -> card colour: yellow, cyan, violet, green, orange, pink */
  services: {
    heading: { en: "How I can *help.*", ar: "كيف يمكنني *المساعدة*" },
    intro: {
      en: "Alongside my studies I take on a small number of projects, in English or Arabic.",
      ar: "إلى جانب دراستي أقبل عددًا محدودًا من المشاريع، بالعربية أو الإنجليزية."
    },
    note: {
      en: "All work is desk-based or low-voltage. Any installation or wiring is referred to a licensed contractor.",
      ar: "جميع الأعمال مكتبية أو على الجهد المنخفض، وأي تركيب أو تمديدات كهربائية تُحال إلى مقاول مرخّص."
    },
    steps: [
      { title: { en: "Send a message", ar: "أرسل رسالة" }, text: { en: "WhatsApp or email, in English or Arabic.", ar: "عبر واتساب أو البريد، بالعربية أو الإنجليزية." } },
      { title: { en: "Agree on the scope", ar: "نتفق على النطاق" }, text: { en: "What you need, the files I'll work from and when.", ar: "ما تحتاجه، والملفات التي سأعمل عليها، والموعد." } },
      { title: { en: "Get the result", ar: "استلم النتيجة" }, text: { en: "A clear report, design or session you can use.", ar: "تقرير أو تصميم أو جلسة واضحة يمكنك الاستفادة منها." } }
    ],
    items: [
      {
        icon: "tutor",
        tone: "violet",
        title: { en: "Electrical engineering tutoring", ar: "دروس خصوصية في الهندسة الكهربائية" },
        text: { en: "Circuits, power systems, control, MATLAB and PowerWorld for university students, plus physics and maths for school students. In English or Arabic.", ar: "الدوائر، وأنظمة القدرة، والتحكم، وMATLAB وPowerWorld لطلاب الجامعات، إضافة إلى الفيزياء والرياضيات لطلاب المدارس. بالعربية أو الإنجليزية." },
        price: { en: "", ar: "" }
      },
      {
        icon: "solar",
        tone: "yellow",
        featured: true,
        title: { en: "Solar PV sizing and bill check", ar: "تصميم الأنظمة الشمسية ومراجعة الفواتير" },
        text: { en: "System sizing and payback estimate from your electricity bills, or a performance check of an existing system from its inverter data. Try my free Solar ATAP checker for a quick estimate first.", ar: "تحديد حجم النظام وتقدير فترة استرداد التكلفة من فواتير الكهرباء، أو فحص أداء نظام قائم من بيانات العاكس. جرّب أداة Solar ATAP المجانية للحصول على تقدير سريع أولًا." },
        price: { en: "", ar: "" },
        tool: { href: "solar/", label: { en: "Free Solar ATAP checker", ar: "أداة Solar ATAP المجانية" } }
      },
      {
        icon: "leaf",
        tone: "green",
        title: { en: "Carbon footprint for small businesses", ar: "البصمة الكربونية للشركات الصغيرة" },
        text: { en: "A Scope 1 and 2 emissions inventory from your fuel and electricity records, written up so you can share it with customers.", ar: "جرد لانبعاثات النطاقين 1 و2 من سجلات الوقود والكهرباء، في تقرير يمكنك مشاركته مع عملائك." },
        price: { en: "", ar: "" }
      },
      {
        icon: "doc",
        tone: "pink",
        title: { en: "Technical writing and translation", ar: "الكتابة الفنية والترجمة" },
        text: { en: "Reports, proposals and green-building documents, written in English or Arabic or translated between the two.", ar: "تقارير وعروض فنية ووثائق المباني الخضراء، تُكتب بالعربية أو الإنجليزية أو تُترجم بينهما." },
        price: { en: "", ar: "" }
      },
      {
        icon: "chip",
        tone: "cyan",
        title: { en: "ESP32 and PCB prototypes", ar: "نماذج أولية بـ ESP32 ولوحات PCB" },
        text: { en: "Low-voltage prototypes such as sensors, monitors and small controllers, with KiCad PCB design.", ar: "نماذج أولية منخفضة الجهد مثل الحساسات وأجهزة المراقبة والمتحكمات الصغيرة، مع تصميم اللوحات في KiCad." },
        price: { en: "", ar: "" }
      }
    ]
  },

  /* ---------- Awards and certificates ---------- */
  awards: [
    { year: "2024–26", title: { en: "Pioneer's Academic Excellence Award, three years running", ar: "جائزة بايونير للتميز الأكاديمي، ثلاث سنوات متتالية" } },
    { year: "2023–26", title: { en: "Dean's List, 5 semesters (GPA 4.00 in my first semester)", ar: "قائمة العميد، 5 فصول (معدل 4.00 في الفصل الأول)" } },
    { year: "2026", title: { en: "MITx 6.00.1x Introduction to Computer Science and Programming Using Python", ar: "MITx 6.00.1x مقدمة في علوم الحاسوب والبرمجة باستخدام بايثون" } },
    { year: "2025", title: { en: "IEM-UTM industry site visit, A Date with Engineers 8.0", ar: "زيارة ميدانية مع IEM-UTM، فعالية A Date with Engineers 8.0" } },
    { year: "2025", title: { en: "Self-Balancing Robot Workshop certificate, UTM", ar: "شهادة ورشة الروبوت ذاتي التوازن، UTM" } },
    { year: "2024", title: { en: "Training on PV Design: Solar, IEEE PES UTM", ar: "تدريب تصميم الأنظمة الشمسية، IEEE PES بجامعة UTM" } },
    { year: "2024", title: { en: "The AI-Driven Third Millennium Smart World, Elite Global Excellence", ar: "ورشة عالم الألفية الثالثة الذكي المدفوع بالذكاء الاصطناعي، Elite Global Excellence" } }
  ],
  awardImages: [
    { src: "assets/img/pioneer-stage.webp", caption: { en: "Pioneer Ceremony for Academic Excellence", ar: "حفل بايونير للتميز الأكاديمي" } },
    { src: "assets/img/deans-list.webp", caption: { en: "Dean's List, GPA 4.00", ar: "قائمة العميد، معدل 4.00" } }
  ],

  /* ---------- Leadership and volunteering ---------- */
  leadership: [
    { date: { en: "2025", ar: "2025" }, title: { en: "Judge, International Youth Robot Competition ASEAN", ar: "محكّم، المسابقة الدولية لروبوتات الشباب آسيان" } },
    { date: { en: "Since 2025", ar: "منذ 2025" }, title: { en: "Student member, The Institution of Engineers, Malaysia (IEM)", ar: "عضو طالب، معهد المهندسين الماليزي (IEM)" } },
    { date: { en: "Since 2024", ar: "منذ 2024" }, title: { en: "Member, UTM Green DNA", ar: "عضو، UTM Green DNA" } },
    { date: { en: "2020–22", ar: "2020–22" }, title: { en: "Volunteer, Wellness Charity, Khartoum", ar: "متطوع، جمعية ويلنس الخيرية، الخرطوم" } },
    { date: { en: "2020–21", ar: "2020–21" }, title: { en: "PR and Career Fair team, Steering Engineering Society, University of Khartoum", ar: "فريق العلاقات العامة ومعرض التوظيف، الجمعية الهندسية التسييرية، جامعة الخرطوم" } }
  ],

  /* ---------- Contact ---------- */
  contact: {
    heading: { en: "Let's *talk.*", ar: "*لنتحدث*" },
    text: {
      en: "I'm looking for graduate roles in power systems, building services or renewable energy from October 2027, and I'm open to freelance projects now. Messages in English or Arabic are welcome.",
      ar: "أبحث عن وظيفة للخريجين في أنظمة القدرة أو خدمات المباني أو الطاقة المتجددة اعتبارًا من أكتوبر 2027، ومتاح للمشاريع الحرة الآن. أرحب بالرسائل بالعربية أو الإنجليزية."
    },
    whatsappMessage: {
      en: "Hi Omer, I found your website and would like to ask about",
      ar: "مرحبًا عمر، وجدت موقعك وأود الاستفسار عن"
    }
  }
};
