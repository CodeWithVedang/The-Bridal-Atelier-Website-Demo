/**
 * The pinned photography source list.
 *
 * Every photograph on the site is named here, by explicit Pexels photo id. The
 * ids are curated by hand and committed, deliberately: a search executed at
 * build time would be non-deterministic, rate-limited and unreviewable, which
 * is exactly the "fragile image hack" the brief rules out. Pinned ids mean the
 * build is reproducible and every image has a named photographer.
 *
 * Licence: Pexels licence — free to use, no attribution required, modification
 * permitted. Attribution is recorded anyway, in `public/photography/index.json`
 * and on the site's credits, because a portfolio project should be able to say
 * where its assets came from.
 *
 * `scripts/fetch-photography.mjs` reads this file and downloads each row at the
 * exact target dimensions, so `src/content/images.ts` and the files on disk
 * cannot disagree. To replace a photograph with real studio work: drop a file
 * at `public/photography/<id>.jpg` at the stated size and delete the row here.
 *
 * Row: [manifestId, pexelsId, width, height, photographer, subject]
 *
 * Target ratios are chosen close to each source photograph's native ratio, so
 * the centre crop Pexels applies never cuts a face.
 */

/** @typedef {readonly [string, number, number, number, string, string]} SourceRow */

/** @type {readonly SourceRow[]} */
export const PHOTOGRAPHY = [
  /* ── Home ─────────────────────────────────────────────────────────────── */
  ['hero-veil', 11742214, 1200, 1500, 'Imad Clicks', 'Bridal close portrait with a maang tikka'],
  ['hero-detail', 37601639, 800, 1000, 'Dhrupal Shiyal', 'Gold jhumka earring at the ear'],
  ['cta-bride', 29805014, 1600, 900, 'Lalyphotos Karthi', 'Bride outdoors in traditional jewellery'],
  ['journey-arch', 6953622, 1200, 800, 'George Milton', 'Artist applying product to a seated client'],
  ['testimonial-portrait', 13048652, 900, 1200, 'Pexels contributor', 'Bride in a red and gold sari'],

  /* ── The five journey stages ───────────────────────────────────────────── */
  ['journey-consultation', 5177992, 800, 600, 'Antoni Shkraba', 'Artist and client in a lit studio'],
  ['journey-bridal-trial', 32009285, 800, 600, 'M1nh Art', 'Makeup applied in a bright studio'],
  ['journey-the-plan', 35963259, 800, 600, 'Deepak Sharma', 'Close view of a veil and jewellery'],
  ['journey-wedding-week', 7446659, 800, 600, 'Gustavo Fring', 'Facial treatment in a spa room'],
  ['journey-the-day', 19869152, 800, 600, 'Look me Photography', 'Bride at a mirror, dressed and ready'],

  /* ── About ─────────────────────────────────────────────────────────────── */
  ['about-studio', 28941551, 1400, 900, 'vicky photography studio', 'Bride reflected in an ornate mirror'],
  ['about-philosophy', 30193762, 900, 1200, 'Rajat Sahu', 'Two women preparing for a wedding'],

  /* ── Page headers ──────────────────────────────────────────────────────── */
  ['services-hero', 10479671, 1200, 1500, 'Jonathan Borba', 'Bride smiling while her hair is dressed'],
  ['services-hero-detail', 35341712, 800, 1000, 'khezez', 'Eyeshadow applied with a brush'],
  ['packages-hero', 19021379, 1200, 800, 'Look me Photography', 'Bride wearing traditional jewellery'],
  ['portfolio-hero', 7234531, 1600, 900, 'Digvijaysinh Rajput', 'Bride in bright traditional accessories'],
  ['looks-hero', 29133472, 1200, 1500, 'SKG Photography', 'Bride smiling in an ornate red gown'],
  ['artists-hero', 13933305, 1400, 900, 'Hadi Saerani', 'Artist applying makeup to a seated bride'],
  ['contact-hero', 15416958, 1200, 800, 'Yogesh Sasane', 'Woman in a traditional saree and jewellery'],
  ['book-hero', 28281391, 1200, 800, 'Israyosoy S.', 'Makeup artist working with a model'],

  /* ── The five service categories ───────────────────────────────────────── */
  ['service-bridal-makeup', 33965317, 900, 1200, 'Fahad Puthawala', 'Makeup applied for a bridal look'],
  ['service-bridal-hair', 35341760, 900, 1200, 'khezez', 'Bridal hair being set in a salon'],
  ['service-skin-and-prep', 37229291, 900, 1200, 'DAVE GARCIA', 'Skincare treatment in a warm-lit room'],
  ['service-hair-care-and-treatments', 11813865, 900, 1200, 'Vladimir Konoplev', 'Hair treated and finished'],
  ['service-grooming-and-add-ons', 3762768, 900, 1200, 'Shiny Diamond', 'Mascara applied to lashes'],

  /* ── The four signature looks ──────────────────────────────────────────── */
  ['look-classic-red', 38917731, 900, 1200, 'Satyam Pixels', 'Bride in a vivid red outfit'],
  ['look-ivory-pearl', 17125530, 900, 1200, 'Yusuf Miah', 'Bride in a pale glamour look'],
  ['look-soft-glam', 30825617, 900, 1200, 'AMA International Academy', 'Warm neutral bridal portrait'],
  ['look-modern-minimal', 2673365, 900, 1200, 'SKG Photography', 'Restrained bridal portrait'],

  /* ── Artists ───────────────────────────────────────────────────────────────
   * Craft photography, one image per artist's stated specialism — not a portrait
   * of the named person. These three artists are demonstration profiles, and a
   * licensed photograph of a stranger presented as "Ananya Mehta" would be a
   * fabricated credential. The cards say so, and the alt text describes the work.
   */
  ['artist-ananya-mehta', 38773208, 800, 1000, 'Satyam vicky', 'Traditional bridal makeup, close'],
  ['artist-rhea-kapoor', 34186057, 800, 1000, 'Studio Dreamview', 'Bridal updo dressed with red flowers'],
  ['artist-meera-shah', 37229301, 800, 1000, 'DAVE GARCIA', 'Facial treatment mask being applied'],

  /* ── The twelve portfolio projects ─────────────────────────────────────── */
  ['portfolio-jaipur-courtyard', 29396108, 1000, 1250, 'apertur 2.8', 'Bride in red, outdoors in daylight'],
  ['portfolio-ivory-morning', 17001511, 1000, 1250, 'Sahil Singh', 'Bride in window light'],
  ['portfolio-monsoon-mehendi', 32029488, 1000, 1400, 'Rina Islam', 'Henna-covered bridal hands'],
  ['portfolio-coastal-sangeet', 34962720, 1000, 1250, 'tushar ahamed', 'Bride in red against greenery'],
  ['portfolio-heirloom-red', 25811178, 1000, 1250, 'SATNAM FILM', 'Bride in a deep red lehenga'],
  ['portfolio-terrace-reception', 12579916, 1000, 1250, 'stardust multimedia', 'Bride in jewellery, evening light'],
  ['portfolio-temple-vows', 19891850, 1000, 1250, 'D. krishna', 'South Indian bridal portrait'],
  ['portfolio-champagne-engagement', 36519701, 1000, 1400, 'BM Capture', 'Bride in soft champagne tones'],
  ['portfolio-desert-haldi', 17493647, 1000, 1250, 'SXYLEN', 'Bride smiling at a haldi ceremony'],
  ['portfolio-winter-nikah', 30780337, 1000, 1250, 'AMA International Academy', 'Bride in layered bridal dress'],
  ['portfolio-garden-christian', 23623618, 1000, 1250, 'Rupinder Korpal', 'Bride outdoors with henna'],
  ['portfolio-studio-portrait', 29368882, 1000, 1250, 'SKG Photography', 'Studio bridal portrait'],

  /* ── Three first-brush / final-look pairings ────────────────────────────── */
  ['before-soft-glam', 7514850, 900, 1200, 'Kampus Production', 'Eyeshadow applied, eyes closed'],
  ['after-soft-glam', 29368881, 900, 1200, 'SKG Photography', 'Finished bridal look with jewellery'],
  ['before-classic-red', 10541310, 900, 1200, 'Lucretius Mooka', 'Eye shadow being applied'],
  ['after-classic-red', 29368884, 900, 1200, 'SKG Photography', 'Finished red bridal look'],
  ['before-modern-minimal', 8990592, 900, 1200, 'Alena Darmel', 'Eye shadow applied by hand'],
  ['after-modern-minimal', 13048651, 900, 1200, 'Pexels contributor', 'Finished restrained bridal look'],

  /* ── The wedding week, function by function ────────────────────────────── */
  ['event-mehendi', 28120522, 900, 1200, 'Anish Bindoriya', 'Bride at her mehendi'],
  ['event-haldi', 35327990, 900, 1200, 'Deepak Sharma', 'Bride at a haldi ceremony'],
  ['event-engagement', 35007727, 900, 1200, 'Vikas Nagity', 'Bride in an engagement look'],
  ['event-wedding', 29370687, 900, 1200, 'SKG Photography', 'Bride on her wedding day'],
  ['event-reception', 32212568, 900, 1200, 'Bhola Chourasia', 'Bride in a reception look'],

  /* ── The eight social tiles, square ────────────────────────────────────── */
  ['instagram-01', 37601638, 600, 600, 'Dhrupal Shiyal', 'Traditional earrings, close'],
  ['instagram-02', 38147796, 600, 600, 'Darshan Dave', 'Mehndi on a pair of hands'],
  ['instagram-03', 9808451, 600, 600, 'star photography', 'Red and gold bangles'],
  ['instagram-04', 35059564, 600, 600, 'Punam Oishy', 'Bridal jewellery on a red saree'],
  ['instagram-05', 8881953, 600, 600, 'Keith Lobo', 'Braid dressed with flowers'],
  ['instagram-06', 2733490, 600, 600, 'Yogendra Singh', 'Earring at the ear'],
  ['instagram-07', 34602190, 600, 600, 'Caleb Oquendo', 'Bridal hair, rear view'],
  ['instagram-08', 8089240, 600, 600, 'Ron Lach', 'Foundation and brushes on a bench'],

  /* ── Mixed-ratio gallery, for the masonry compositions ─────────────────── */
  ['gallery-01', 29368877, 800, 1000, 'SKG Photography', 'Bride in a red sari'],
  ['gallery-02', 17154861, 1000, 700, 'Lucky Digital', 'Bride in a red lehenga, smiling'],
  ['gallery-03', 36354615, 800, 1100, 'Nirav Jani', 'Mehndi being applied'],
  ['gallery-04', 32170148, 1000, 667, 'SAMPARK FILMS', 'Bridal portrait in low light'],
  ['gallery-05', 25225117, 800, 1000, 'Rajib Ahmed', 'Seated bride with a veil'],
  ['gallery-06', 36102603, 1000, 667, 'Gaurav Vishwakarma', 'Bride in traditional attire'],
  ['gallery-07', 29858712, 800, 1200, 'Burak Evlivan', 'Floral bridal updo, rear view'],
  ['gallery-08', 37035227, 1000, 667, 'Akshay Patil', 'Henna and bangles on bridal hands'],
  ['gallery-09', 29624010, 800, 1000, 'Masood Aslami', 'Bride being prepared by her artist'],
  ['gallery-10', 15046691, 1000, 667, 'Xhemi Photo', 'Eye makeup applied with a brush'],
];
