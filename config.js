/* ================================================================
   davekorr.com — SITE CONFIG
   This is the only file you need to edit for day-to-day changes.
   - Text in quotes is shown on the site.
   - Image paths are relative to this folder (e.g. 'img/my-photo.jpg').
   - Keep the commas between items.
   ================================================================ */

window.SITE = {

  name: 'Dave Korr',
  menuName: 'davekorr',            // bold name at top-left of the Mac menu bar
  instagram: 'dave_korir',         // used for every Instagram link
  email: 'hello@davekorr.com',     // routes to Gmail via Cloudflare Email Routing

  /* ---------- Wallpapers (swap in your own photos) ---------- */
  wallpapers: {
    lockDesktop: 'img/hero.jpg',            // lock screen on a computer (landscape) — original davekorr.com hero
    lockPhone:   'img/hero-portrait.jpg',   // lock screen on a phone (portrait crop of the same photo)
    desktop:     'img/hero.jpg',            // Mac desktop after unlocking
    phoneHome:   'img/hero-portrait.jpg'    // iPhone home screen after unlocking
  },

  /* ---------- Lock-screen notifications ----------
     app:   which icon to show (photos, instagram, notes, safari, calendar, camera, mail)
     title: bold first line
     body:  second line
     time:  small grey text on the right ('now', '2h ago', 'Tue'...)
     open:  what happens on tap — opens an app inside the site
            e.g. { app: 'photos', album: 'letchworth' }
     link:  OR a web link instead (e.g. your Instagram profile)        */
  notifications: [
    { app: 'photos',    title: 'Fall photos have dropped 🍂',
      body: 'Letchworth 2026 is live — fresh frames from golden hour.',
      time: 'now', open: { app: 'photos', album: 'letchworth' } },

    { app: 'instagram', title: 'New Instagram post',
      body: '@dave_korir shared a new post. Tap to see it.',
      time: '2h ago', link: 'https://instagram.com/dave_korir' },

    { app: 'safari',    title: 'Buy my prints 🖼',
      body: 'Signed prints, made to order — browse the print shop.',
      time: 'now', open: { app: 'safari', tab: 'shop' } }
  ],

  /* ---------- Albums (shown in Photos → Albums) ----------
     eyebrow = small label above the album text; story = paragraphs shown at the top of the album. */
  albums: [
    { id: "letchworth", pin: "Letchworth", name: "Letchworth 2026", eyebrow: "Portfolio · Local",
      story: [] },
    { id: "nyc-fall-2026", name: "New York, Fall 2026", eyebrow: "Portfolio · Travel",
      // [DRAFT] written by Claude from the photos — rewrite in your own words
      story: ["One October day in New York, start to finish: a quiet morning in Brooklyn, across the bridge, down into the subway, up through Manhattan, and out into Times Square as the light goes.",
        "Brooklyn is slow — Cadman Plaza, Fulton Ferry, the park, leaves just turning. The bridge does the talking: granite, cables pulling every line to one point, runners and walkers under them. Below ground the city is all signs and waiting. Above it, old stone and new glass, a few performers, and then the noise of 46th Street, finished in black and white."] },
    { id: "rochester-summer-2026", pin: "Rochester ☀︎", name: "Rochester, Summer 2026", eyebrow: "Portfolio · Local",
      story: ["Since moving to the US, Rochester has shown me time and time again that it is a hidden gem. It does not announce itself. It just keeps quietly rewarding you for staying.",
        "The winters are long and cold, and they are worth it, purely for what comes after. Spring arrives like a reward, summer turns everything green and loud, and fall sets the whole region on fire. Living through the cold is what makes the other three seasons feel earned.",
        "This set is one long summer day at home: the Genesee in the morning, High Falls and the Kodak tower through the afternoon, the Strong glowing after a rain, and Cobbs Hill to close it out as the sun drops behind the tower."] },
    { id: "hemlock-lake", pin: "Hemlock", name: "Hemlock Lake", eyebrow: "Portfolio · Local",
      story: ["The road is still dark when the cooler goes in the trunk. By the time the sky starts to pale, the chair is set, the line is out, and the only sound is the water moving against the stones.",
        "The sun comes up slowly over the valley. The phone stays face down in a bag somewhere. Nothing to answer, nothing to post, nothing to check. The hat comes down a little lower and the morning stretches out.",
        "By noon there is smoke from the grill and a cold Genesee sweating in the shade. The drive home is quiet, the afternoon is warm, and the nap comes easy."] },
    { id: "detroit", name: "Detroit", eyebrow: "Portfolio · Travel",
      // [DRAFT]
      story: ["Detroit from the river up: the Renaissance Center in hard blue sky, a café window at golden hour, and Windsor lighting up across the water at dusk.",
        "Then down a marble staircase into Hiroki-San — the quiet before service, the bar glowing amber, the sushi counter and the line at work, a steak don and dessert for the table, and the rain on the glass on the way out."] },
    { id: "southwest-summer-2026", pin: "Dallas · Tulsa", name: "Southwest Summer 2026", eyebrow: "Portfolio · Travel",
      // [DRAFT]
      story: ["Two stops in the south-central states: the pumpkin village at the Dallas Arboretum, and the water at Gathering Place in Tulsa, shot straight down from the bridge."] },
    { id: "chicago-summer-2025", name: "Chicago, Summer 2025", eyebrow: "Portfolio · Travel",
      story: ["Sit Chicago on a map and it makes immediate sense. Planted at the southwestern tip of Lake Michigan, midway between the coasts, it became the place where everything had to pass through. The railroads came, then the stockyards, then the money, then the people. By the early twentieth century Chicago was one of the fastest growing cities on earth and it carried that energy like a fact about itself.",
        "The Great Chicago Fire of 1871 burned most of it to the ground. The city rebuilt in a decade. That tells you everything you need to know about the character of this place.",
        "Chicago gave the world the skyscraper, the blues, and deep dish pizza. It gave jazz a northern home when musicians rode the Illinois Central Railroad up from New Orleans during the Great Migration. On any given summer night in the 1920s, Louis Armstrong was playing the South Side and the city was rewriting what American music could sound like. That thread runs forward. Chicago gave us house music in the eighties, Kanye West in the nineties, Chance the Rapper after that. The city has never stopped producing.",
        "Barack Obama organized communities on the South Side before he organized a country. Oprah Winfrey built a media empire from a local television station on State Street. These are not coincidences. Chicago has always been a place where ambition finds room.",
        "The food scene reflects the same restlessness. Deep dish at Lou Malnati's is the obligation and worth every calorie. But Chicago also does the Italian beef sandwich, the Chicago-style hot dog loaded with everything except ketchup, and some of the best Mexican food outside of Mexico itself. The city's Pilsen neighborhood and Little Village carry a culinary tradition that takes margaritas seriously. Not the sour mix version. The real one, lime-forward and cold, served in a salted glass with something grilled alongside it, eaten outside while the summer light holds on longer than it has any right to.",
        "I came for four days in the summer of 2025 with the Chicago City Pass in hand. The pass bundles the major attractions into one purchase and it does something useful beyond saving money. It gives you an anchor. Each morning started with a destination. The Art Institute. The 360 Chicago deck. The Shedd Aquarium. The Field Museum. One landmark per day, then let the streets take over from there.",
        "The Loop at golden hour with the El train rattling overhead. The Bean catching the skyline in its surface. The Wrigley Building white against that specific Chicago blue sky. This is architecture that earned its reputation over a century and has not stopped earning it. Of all the American cities I have visited so far, Chicago is my favorite. It is a real city — dense, loud, lived in, and completely sure of itself. No performance required."] },
    { id: "rochester-winter", pin: "Rochester ❄︎", name: "Rochester, Winter", eyebrow: "Portfolio · Local",
      story: ["Rochester in winter strips things back to structure. Trees, streets, brick, water, and the hard edge of cold light become more visible when everything decorative falls away.",
        "The city rewards patience. Winter photography here is less about spectacle and more about waiting for quiet alignment — a bare branch against snow, a sidewalk carrying low afternoon light, or a frame where the weather becomes the subject.",
        "What I like about Rochester is that it does not beg to be photographed. You have to work for it. That makes the keepers feel earned."] },
    { id: "st-augustine", name: "St. Augustine", eyebrow: "Portfolio · Travel",
      story: ["St. Augustine moves at a different pace. The light is softer, the walls hold texture, and the streets seem built for wandering rather than rushing.",
        "What stands out here is not scale but surface — worn stone, painted facades, bicycles, shadows, and the kind of coastal brightness that turns ordinary corners into photographs.",
        "This set is less about chasing action and more about observing atmosphere. The place reveals itself slowly, which is exactly why it works on camera."] }
  ],

  /* ---------- Photos ----------
     src = full image, thumb = small grid version, album = album id above.
     Camera settings are optional; they show in the Info panel and Camera app when present.
     Photos appear in this order everywhere (newest album first). */
  photos: [
    { id: "letchworth-7", album: "letchworth", title: "Middle Falls in full fall color", src: 'img/letchworth-7.jpg', thumb: 'img/thumb/letchworth-7.jpg', alt: "Middle Falls in full fall color" },
    { id: "letchworth-8", album: "letchworth", title: "The gorge from the overlook", src: 'img/letchworth-8.jpg', thumb: 'img/thumb/letchworth-8.jpg', alt: "The gorge from the overlook" },
    { id: "letchworth-9", album: "letchworth", title: "Park road under the maples", src: 'img/letchworth-9.jpg', thumb: 'img/thumb/letchworth-9.jpg', alt: "Park road under the maples" },
    { id: 'l1', album: 'letchworth', src: 'img/letchworth-1.jpg', thumb: 'img/thumb/letchworth-1.jpg',
      alt: 'Sunburst through red maples over a leaf-covered path',
      taken: '2026-10-24T17:45', camera: 'FUJIFILM X-T5', lens: 'Viltrox AF 9mm F2.8 Air', fl: '9mm', f: 'f/5.6', ss: '1/220', iso: '500' },
    { id: 'l2', album: 'letchworth', src: 'img/letchworth-2.jpg', thumb: 'img/thumb/letchworth-2.jpg',
      alt: 'Gorge overlook framed by red and gold trees',
      taken: '2026-10-24T17:42', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '16mm', f: 'f/2.8', ss: '1/750', iso: '500' },
    { id: 'l3', album: 'letchworth', src: 'img/letchworth-3.jpg', thumb: 'img/thumb/letchworth-3.jpg',
      alt: 'Low sun flaring between trees at the overlook',
      taken: '2026-10-24T17:42', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '16mm', f: 'f/2.8', ss: '1/750', iso: '500' },
    { id: 'l4', album: 'letchworth', src: 'img/letchworth-4.jpg', thumb: 'img/thumb/letchworth-4.jpg',
      alt: 'Two riders beside motorcycles under yellow foliage',
      taken: '2026-10-24T17:08', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '55mm', f: 'f/2.8', ss: '1/250', iso: '1250' },
    { id: 'l5', album: 'letchworth', src: 'img/letchworth-5.jpg', thumb: 'img/thumb/letchworth-5.jpg',
      alt: 'Tripod standing in red leaves facing the sunburst',
      taken: '2026-10-24T17:48', camera: 'FUJIFILM X-T5', lens: 'Viltrox AF 9mm F2.8 Air', fl: '9mm', f: 'f/5.0', ss: '1/200', iso: '500' },
    { id: 'l6', album: 'letchworth', src: 'img/letchworth-6.jpg', thumb: 'img/thumb/letchworth-6.jpg',
      alt: 'Long tree shadow across orange leaves at golden hour',
      taken: '2026-10-24T17:42', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '16mm', f: 'f/2.8', ss: '1/340', iso: '500' },

    // ---- New York, Fall 2026 (story order) ----
    { id: "nyc-01-cadman-plaza", album: "nyc-fall-2026", title: "Morning, Cadman Plaza", src: 'img/nyc-01-cadman-plaza.jpg', thumb: 'img/thumb/nyc-01-cadman-plaza.jpg', alt: "Morning, Cadman Plaza" },
    { id: "nyc-02-fulton-ferry", album: "nyc-fall-2026", title: "Toward Fulton Ferry", src: 'img/nyc-02-fulton-ferry.jpg', thumb: 'img/thumb/nyc-02-fulton-ferry.jpg', alt: "Toward Fulton Ferry" },
    { id: "nyc-03-flare", album: "nyc-fall-2026", title: "Old Fulton Flare", src: 'img/nyc-03-flare.jpg', thumb: 'img/thumb/nyc-03-flare.jpg', alt: "Old Fulton Flare" },
    { id: "nyc-04-dumbo-signs", album: "nyc-fall-2026", title: "DUMBO Wayfinding", src: 'img/nyc-04-dumbo-signs.jpg', thumb: 'img/thumb/nyc-04-dumbo-signs.jpg', alt: "DUMBO Wayfinding" },
    { id: "nyc-05-park", album: "nyc-fall-2026", title: "Brooklyn Bridge Park", src: 'img/nyc-05-park.jpg', thumb: 'img/thumb/nyc-05-park.jpg', alt: "Brooklyn Bridge Park" },
    { id: "nyc-26-brooklyn-bridge", album: "nyc-fall-2026", title: "Under the Brooklyn Bridge", src: 'img/nyc-26-brooklyn-bridge.jpg', thumb: 'img/thumb/nyc-26-brooklyn-bridge.jpg', alt: "Under the Brooklyn Bridge" },
    { id: "nyc-06-gold-leaves", album: "nyc-fall-2026", title: "Tower and Gold Leaves", src: 'img/nyc-06-gold-leaves.jpg', thumb: 'img/thumb/nyc-06-gold-leaves.jpg', alt: "Tower and Gold Leaves" },
    { id: "nyc-07-brooklyn-bound", album: "nyc-fall-2026", title: "Brooklyn Bound", src: 'img/nyc-07-brooklyn-bound.jpg', thumb: 'img/thumb/nyc-07-brooklyn-bound.jpg', alt: "Brooklyn Bound" },
    { id: "nyc-08-tower", album: "nyc-fall-2026", title: "The Tower", src: 'img/nyc-08-tower.jpg', thumb: 'img/thumb/nyc-08-tower.jpg', alt: "The Tower" },
    { id: "nyc-09-cables", album: "nyc-fall-2026", title: "Cables", src: 'img/nyc-09-cables.jpg', thumb: 'img/thumb/nyc-09-cables.jpg', alt: "Cables" },
    { id: "nyc-10-crossing", album: "nyc-fall-2026", title: "Crossing", src: 'img/nyc-10-crossing.jpg', thumb: 'img/thumb/nyc-10-crossing.jpg', alt: "Crossing" },
    { id: "nyc-11-runner", album: "nyc-fall-2026", title: "The Runner", src: 'img/nyc-11-runner.jpg', thumb: 'img/thumb/nyc-11-runner.jpg', alt: "The Runner" },
    { id: "nyc-12-manhattan-bridge", album: "nyc-fall-2026", title: "Manhattan Bridge Through the Cables", src: 'img/nyc-12-manhattan-bridge.jpg', thumb: 'img/thumb/nyc-12-manhattan-bridge.jpg', alt: "Manhattan Bridge Through the Cables" },
    { id: "nyc-13-fdr", album: "nyc-fall-2026", title: "FDR Drive North", src: 'img/nyc-13-fdr.jpg', thumb: 'img/thumb/nyc-13-fdr.jpg', alt: "FDR Drive North" },
    { id: "nyc-14-canal-exit", album: "nyc-fall-2026", title: "Exit, Canal Street", src: 'img/nyc-14-canal-exit.jpg', thumb: 'img/thumb/nyc-14-canal-exit.jpg', alt: "Exit, Canal Street" },
    { id: "nyc-15-west-4", album: "nyc-fall-2026", title: "West 4th Street Platform", src: 'img/nyc-15-west-4.jpg', thumb: 'img/thumb/nyc-15-west-4.jpg', alt: "West 4th Street Platform" },
    { id: "nyc-27-w4-platform", album: "nyc-fall-2026", title: "W 4th St Platform", src: 'img/nyc-27-w4-platform.jpg', thumb: 'img/thumb/nyc-27-w4-platform.jpg', alt: "W 4th St Platform" },
    { id: "nyc-16-c-train", album: "nyc-fall-2026", title: "C Train, Downtown Platform", src: 'img/nyc-16-c-train.jpg', thumb: 'img/thumb/nyc-16-c-train.jpg', alt: "C Train, Downtown Platform" },
    { id: "nyc-17-one-wtc", album: "nyc-fall-2026", title: "One World Trade", src: 'img/nyc-17-one-wtc.jpg', thumb: 'img/thumb/nyc-17-one-wtc.jpg', alt: "One World Trade" },
    { id: "nyc-18-courthouse", album: "nyc-fall-2026", title: "The Courthouse Dome", src: 'img/nyc-18-courthouse.jpg', thumb: 'img/thumb/nyc-18-courthouse.jpg', alt: "The Courthouse Dome" },
    { id: "nyc-19-justice", album: "nyc-fall-2026", title: "Justice, Rooftop", src: 'img/nyc-19-justice.jpg', thumb: 'img/thumb/nyc-19-justice.jpg', alt: "Justice, Rooftop" },
    { id: "nyc-20-chrysler", album: "nyc-fall-2026", title: "Chrysler, Down the Block", src: 'img/nyc-20-chrysler.jpg', thumb: 'img/thumb/nyc-20-chrysler.jpg', alt: "Chrysler, Down the Block" },
    { id: "nyc-21-performers", album: "nyc-fall-2026", title: "Performers, Graffiti Wall", src: 'img/nyc-21-performers.jpg', thumb: 'img/thumb/nyc-21-performers.jpg', alt: "Performers, Graffiti Wall" },
    { id: "nyc-22-times-square", album: "nyc-fall-2026", title: "Times Square, Looking Up", src: 'img/nyc-22-times-square.jpg', thumb: 'img/thumb/nyc-22-times-square.jpg', alt: "Times Square, Looking Up" },
    { id: "nyc-23-canyon", album: "nyc-fall-2026", title: "Canyon of Light", src: 'img/nyc-23-canyon.jpg', thumb: 'img/thumb/nyc-23-canyon.jpg', alt: "Canyon of Light" },
    { id: "nyc-24-paramount", album: "nyc-fall-2026", title: "The Paramount Clock", src: 'img/nyc-24-paramount.jpg', thumb: 'img/thumb/nyc-24-paramount.jpg', alt: "The Paramount Clock" },
    { id: "nyc-25-w46", album: "nyc-fall-2026", title: "W 46th St, Black and White", src: 'img/nyc-25-w46.jpg', thumb: 'img/thumb/nyc-25-w46.jpg', alt: "W 46th St, Black and White" },
    // ---- Rochester, Summer 2026 (story order) ----
    { id: "roc-01-river", album: "rochester-summer-2026", title: "The Genesee and the Smokestack", src: 'img/roc-01-river.jpg', thumb: 'img/thumb/roc-01-river.jpg', alt: "The Genesee and the Smokestack" },
    { id: "roc-02-high-falls", album: "rochester-summer-2026", title: "High Falls", src: 'img/roc-02-high-falls.jpg', thumb: 'img/thumb/roc-02-high-falls.jpg', alt: "High Falls" },
    { id: "roc-03-love-lock", album: "rochester-summer-2026", title: "Love Lock, High Falls", src: 'img/roc-03-love-lock.jpg', thumb: 'img/thumb/roc-03-love-lock.jpg', alt: "Love Lock, High Falls" },
    { id: "roc-04-welcome", album: "rochester-summer-2026", title: "Welcome to High Falls", src: 'img/roc-04-welcome.jpg', thumb: 'img/thumb/roc-04-welcome.jpg', alt: "Welcome to High Falls" },
    { id: "roc-05-browns-race", album: "rochester-summer-2026", title: "Brown's Race", src: 'img/roc-05-browns-race.jpg', thumb: 'img/thumb/roc-05-browns-race.jpg', alt: "Brown's Race" },
    { id: "roc-06-kodak", album: "rochester-summer-2026", title: "Kodak Tower", src: 'img/roc-06-kodak.jpg', thumb: 'img/thumb/roc-06-kodak.jpg', alt: "Kodak Tower" },
    { id: "roc-07-kodak-spire", album: "rochester-summer-2026", title: "The Spire", src: 'img/roc-07-kodak-spire.jpg', thumb: 'img/thumb/roc-07-kodak-spire.jpg', alt: "The Spire" },
    { id: "roc-08-mcc", album: "rochester-summer-2026", title: "Downtown Crossing", src: 'img/roc-08-mcc.jpg', thumb: 'img/thumb/roc-08-mcc.jpg', alt: "Downtown Crossing" },
    { id: "roc-09-round-tower", album: "rochester-summer-2026", title: "The Round Top", src: 'img/roc-09-round-tower.jpg', thumb: 'img/thumb/roc-09-round-tower.jpg', alt: "The Round Top" },
    { id: "roc-10-the-strong", album: "rochester-summer-2026", title: "The Strong After Rain", src: 'img/roc-10-the-strong.jpg', thumb: 'img/thumb/roc-10-the-strong.jpg', alt: "The Strong After Rain" },
    { id: "roc-11-cobbs-sun-tower", album: "rochester-summer-2026", title: "Sun on the Tower, Cobbs Hill", src: 'img/roc-11-cobbs-sun-tower.jpg', thumb: 'img/thumb/roc-11-cobbs-sun-tower.jpg', alt: "Sun on the Tower, Cobbs Hill" },
    { id: "roc-12-cobbs-sunset", album: "rochester-summer-2026", title: "Last Light, Cobbs Hill", src: 'img/roc-12-cobbs-sunset.jpg', thumb: 'img/thumb/roc-12-cobbs-sunset.jpg', alt: "Last Light, Cobbs Hill" },
    { id: "roc-13-cobbs-reservoir", album: "rochester-summer-2026", title: "Reservoir Afterglow", src: 'img/roc-13-cobbs-reservoir.jpg', thumb: 'img/thumb/roc-13-cobbs-reservoir.jpg', alt: "Reservoir Afterglow" },
    { id: "roc-14-cobbs-blue-hour", album: "rochester-summer-2026", title: "Blue Hour, Cobbs Hill", src: 'img/roc-14-cobbs-blue-hour.jpg', thumb: 'img/thumb/roc-14-cobbs-blue-hour.jpg', alt: "Blue Hour, Cobbs Hill" },

    // ---- Hemlock Lake (story order) ----
    { id: "hemlock-01-valley", album: "hemlock-lake", title: "The Long View South", src: 'img/hemlock-01-valley.jpg', thumb: 'img/thumb/hemlock-01-valley.jpg', alt: "The Long View South" },
    { id: "hemlock-02-branches", album: "hemlock-lake", title: "Under the Branches", src: 'img/hemlock-02-branches.jpg', thumb: 'img/thumb/hemlock-02-branches.jpg', alt: "Under the Branches" },
    { id: "hemlock-03-hillside", album: "hemlock-lake", title: "Far Shore", src: 'img/hemlock-03-hillside.jpg', thumb: 'img/thumb/hemlock-03-hillside.jpg', alt: "Far Shore" },
    { id: "hemlock-04-chair", album: "hemlock-lake", title: "The Red Chair", src: 'img/hemlock-04-chair.jpg', thumb: 'img/thumb/hemlock-04-chair.jpg', alt: "The Red Chair" },
    { id: "hemlock-05-rod", album: "hemlock-lake", title: "Line in the Water", src: 'img/hemlock-05-rod.jpg', thumb: 'img/thumb/hemlock-05-rod.jpg', alt: "Line in the Water" },
    { id: "hemlock-06-shade", album: "hemlock-lake", title: "Shade at the Shoreline", src: 'img/hemlock-06-shade.jpg', thumb: 'img/thumb/hemlock-06-shade.jpg', alt: "Shade at the Shoreline" },

    // ---- Detroit (story order) ----
    { id: "det-01-rencen", album: "detroit", title: "Renaissance Center", src: 'img/det-01-rencen.jpg', thumb: 'img/thumb/det-01-rencen.jpg', alt: "Renaissance Center" },
    { id: "det-02-cafe", album: "detroit", title: "Café Window", src: 'img/det-02-cafe.jpg', thumb: 'img/thumb/det-02-cafe.jpg', alt: "Café Window" },
    { id: "det-03-windsor", album: "detroit", title: "Windsor from the Riverwalk", src: 'img/det-03-windsor.jpg', thumb: 'img/thumb/det-03-windsor.jpg', alt: "Windsor from the Riverwalk" },
    { id: "det-04-stairs", album: "detroit", title: "Down the Stairs", src: 'img/det-04-stairs.jpg', thumb: 'img/thumb/det-04-stairs.jpg', alt: "Down the Stairs" },
    { id: "det-05-dining-room", album: "detroit", title: "Hiroki-San, Before Service", src: 'img/det-05-dining-room.jpg', thumb: 'img/thumb/det-05-dining-room.jpg', alt: "Hiroki-San, Before Service" },
    { id: "det-06-bar", album: "detroit", title: "The Bar", src: 'img/det-06-bar.jpg', thumb: 'img/thumb/det-06-bar.jpg', alt: "The Bar" },
    { id: "det-07-sushi", album: "detroit", title: "Sushi Counter", src: 'img/det-07-sushi.jpg', thumb: 'img/thumb/det-07-sushi.jpg', alt: "Sushi Counter" },
    { id: "det-08-kitchen", album: "detroit", title: "The Line", src: 'img/det-08-kitchen.jpg', thumb: 'img/thumb/det-08-kitchen.jpg', alt: "The Line" },
    { id: "det-09-wok", album: "detroit", title: "At the Wok Station", src: 'img/det-09-wok.jpg', thumb: 'img/thumb/det-09-wok.jpg', alt: "At the Wok Station" },
    { id: "det-10-red-window", album: "detroit", title: "The Red Window", src: 'img/det-10-red-window.jpg', thumb: 'img/thumb/det-10-red-window.jpg', alt: "The Red Window" },
    { id: "det-13-dinner", album: "detroit", title: "Steak Don and a Cocktail", src: 'img/det-13-dinner.jpg', thumb: 'img/thumb/det-13-dinner.jpg', alt: "Steak Don and a Cocktail" },
    { id: "det-14-dessert", album: "detroit", title: "Dessert for the Table", src: 'img/det-14-dessert.jpg', thumb: 'img/thumb/det-14-dessert.jpg', alt: "Dessert for the Table" },
    { id: "det-11-floor", album: "detroit", title: "Setting the Floor", src: 'img/det-11-floor.jpg', thumb: 'img/thumb/det-11-floor.jpg', alt: "Setting the Floor" },
    { id: "det-12-rain", album: "detroit", title: "Rain on the Glass", src: 'img/det-12-rain.jpg', thumb: 'img/thumb/det-12-rain.jpg', alt: "Rain on the Glass" },

    // ---- Southwest Summer 2026 (story order) ----
    { id: "sw-01-pumpkin-village", album: "southwest-summer-2026", title: "Pumpkin Village, Dallas", src: 'img/sw-01-pumpkin-village.jpg', thumb: 'img/thumb/sw-01-pumpkin-village.jpg', alt: "Pumpkin Village, Dallas" },
    { id: "sw-02-pumpkins", album: "southwest-summer-2026", title: "Pumpkin Stacks", src: 'img/sw-02-pumpkins.jpg', thumb: 'img/thumb/sw-02-pumpkins.jpg', alt: "Pumpkin Stacks" },
    { id: "sw-03-kayak", album: "southwest-summer-2026", title: "Kayak, Gathering Place", src: 'img/sw-03-kayak.jpg', thumb: 'img/thumb/sw-03-kayak.jpg', alt: "Kayak, Gathering Place" },


    // ---- from the original davekorr.com portfolios ----
    { id: "chi-flag-skyline", album: "chicago-summer-2025", title: "Chicago Flag and Skyline", src: 'img/chi-flag-skyline.jpg', thumb: 'img/thumb/chi-flag-skyline.jpg', alt: "Chicago Flag and Skyline" },
    { id: "chi-loop-pulse", album: "chicago-summer-2025", title: "Pulse of the Loop", src: 'img/chi-loop-pulse.jpg', thumb: 'img/thumb/chi-loop-pulse.jpg', alt: "Pulse of the Loop" },
    { id: "chi-el-train", album: "chicago-summer-2025", title: "The El, Afternoon Light", src: 'img/chi-el-train.jpg', thumb: 'img/thumb/chi-el-train.jpg', alt: "The El, Afternoon Light" },
    { id: "chi-morning-bus", album: "chicago-summer-2025", title: "Morning Crosstown", src: 'img/chi-morning-bus.jpg', thumb: 'img/thumb/chi-morning-bus.jpg', alt: "Morning Crosstown" },
    { id: "chi-wrigley-blue", album: "chicago-summer-2025", title: "Wrigley Building", src: 'img/chi-wrigley-blue.jpg', thumb: 'img/thumb/chi-wrigley-blue.jpg', alt: "Wrigley Building" },
    { id: "chi-wrigley-tower", album: "chicago-summer-2025", title: "Wrigley, Trump Tower, Sun Flare", src: 'img/chi-wrigley-tower.jpg', thumb: 'img/thumb/chi-wrigley-tower.jpg', alt: "Wrigley, Trump Tower, Sun Flare" },
    { id: "chi-plane-sky", album: "chicago-summer-2025", title: "Overhead, Chicago Blue", src: 'img/chi-plane-sky.jpg', thumb: 'img/thumb/chi-plane-sky.jpg', alt: "Overhead, Chicago Blue" },
    { id: "chi-lamp-dusk", album: "chicago-summer-2025", title: "River North at Dusk", src: 'img/chi-lamp-dusk.jpg', thumb: 'img/thumb/chi-lamp-dusk.jpg', alt: "River North at Dusk" },
    { id: "chi-bean", album: "chicago-summer-2025", title: "Cloud Gate, Millennium Park", src: 'img/chi-bean.jpg', thumb: 'img/thumb/chi-bean.jpg', alt: "Cloud Gate, Millennium Park" },
    { id: "chi-art-institute", album: "chicago-summer-2025", title: "Art Institute Lions, Michigan Ave", src: 'img/chi-art-institute.jpg', thumb: 'img/thumb/chi-art-institute.jpg', alt: "Art Institute Lions, Michigan Ave" },
    { id: "rochester-cover", album: "rochester-winter", title: "Rochester", src: 'img/rochester-cover.jpg', thumb: 'img/thumb/rochester-cover.jpg', alt: "Rochester" },
    { id: "roc-hero", album: "rochester-winter", title: "Rochester Hero", src: 'img/roc-hero.jpg', thumb: 'img/thumb/roc-hero.jpg', alt: "Rochester Hero" },
    { id: "roc-blizzard", album: "rochester-winter", title: "Blizzard", src: 'img/roc-blizzard.jpg', thumb: 'img/thumb/roc-blizzard.jpg', alt: "Blizzard" },
    { id: "roc-christmas", album: "rochester-winter", title: "Christmas Lights", src: 'img/roc-christmas.jpg', thumb: 'img/thumb/roc-christmas.jpg', alt: "Christmas Lights" },
    { id: "roc-deer", album: "rochester-winter", title: "Deer", src: 'img/roc-deer.jpg', thumb: 'img/thumb/roc-deer.jpg', alt: "Deer" },
    { id: "roc-dock", album: "rochester-winter", title: "Dock", src: 'img/roc-dock.jpg', thumb: 'img/thumb/roc-dock.jpg', alt: "Dock" },
    { id: "roc-downtown-aerial", album: "rochester-winter", title: "Downtown Aerial", src: 'img/roc-downtown-aerial.jpg', thumb: 'img/thumb/roc-downtown-aerial.jpg', alt: "Downtown Aerial" },
    { id: "roc-geese", album: "rochester-winter", title: "Geese", src: 'img/roc-geese.jpg', thumb: 'img/thumb/roc-geese.jpg', alt: "Geese" },
    { id: "roc-genesee-river", album: "rochester-winter", title: "Genesee River", src: 'img/roc-genesee-river.jpg', thumb: 'img/thumb/roc-genesee-river.jpg', alt: "Genesee River" },
    { id: "roc-genesee-sign", album: "rochester-winter", title: "Genesee Sign", src: 'img/roc-genesee-sign.jpg', thumb: 'img/thumb/roc-genesee-sign.jpg', alt: "Genesee Sign" },
    { id: "roc-hill", album: "rochester-winter", title: "Hill", src: 'img/roc-hill.jpg', thumb: 'img/thumb/roc-hill.jpg', alt: "Hill" },
    { id: "roc-icerink", album: "rochester-winter", title: "Ice Rink", src: 'img/roc-icerink.jpg', thumb: 'img/thumb/roc-icerink.jpg', alt: "Ice Rink" },
    { id: "roc-lobby", album: "rochester-winter", title: "Lobby", src: 'img/roc-lobby.jpg', thumb: 'img/thumb/roc-lobby.jpg', alt: "Lobby" },
    { id: "roc-sledding", album: "rochester-winter", title: "Sledding", src: 'img/roc-sledding.jpg', thumb: 'img/thumb/roc-sledding.jpg', alt: "Sledding" },
    { id: "sta-cyclist", album: "st-augustine", title: "Cyclist", src: 'img/sta-cyclist.jpg', thumb: 'img/thumb/sta-cyclist.jpg', alt: "Cyclist" },
    { id: "sta-hero", album: "st-augustine", title: "St. Augustine Hero", src: 'img/sta-hero.jpg', thumb: 'img/thumb/sta-hero.jpg', alt: "St. Augustine Hero" },
    { id: "sta-airport", album: "st-augustine", title: "Airport", src: 'img/sta-airport.jpg', thumb: 'img/thumb/sta-airport.jpg', alt: "Airport" },
    { id: "sta-cathedral", album: "st-augustine", title: "Cathedral", src: 'img/sta-cathedral.jpg', thumb: 'img/thumb/sta-cathedral.jpg', alt: "Cathedral" },
    { id: "sta-fountain", album: "st-augustine", title: "Fountain", src: 'img/sta-fountain.jpg', thumb: 'img/thumb/sta-fountain.jpg', alt: "Fountain" },
    { id: "sta-heron-dusk", album: "st-augustine", title: "Heron at Dusk", src: 'img/sta-heron-dusk.jpg', thumb: 'img/thumb/sta-heron-dusk.jpg', alt: "Heron at Dusk" },
    { id: "sta-heron-moon", album: "st-augustine", title: "Heron and Moon", src: 'img/sta-heron-moon.jpg', thumb: 'img/thumb/sta-heron-moon.jpg', alt: "Heron and Moon" },
    { id: "sta-highway", album: "st-augustine", title: "Highway", src: 'img/sta-highway.jpg', thumb: 'img/thumb/sta-highway.jpg', alt: "Highway" },
    { id: "sta-rocks", album: "st-augustine", title: "Rocks", src: 'img/sta-rocks.jpg', thumb: 'img/thumb/sta-rocks.jpg', alt: "Rocks" },
    { id: "sta-truck", album: "st-augustine", title: "Truck", src: 'img/sta-truck.jpg', thumb: 'img/thumb/sta-truck.jpg', alt: "Truck" }
  ],

  /* ---------- Safari tabs (your projects) ---------- */
  projects: [
    { id: 'shop', type: 'store', title: 'Print Shop', url: 'https://gallery.davekorr.com',
      desc: 'Signed, made-to-order prints' },
    { title: 'davekorr.com', url: 'https://davekorr.com',
      desc: 'Photography portfolio — Rochester, New York.',
      image: 'img/letchworth-3.jpg',
      body: 'Photographer based in Rochester, New York. Welcome to my canvas — portfolio, place, and perspective.' }
  ],

  /* ---------- Notes (Johnny Decimal: area 10-19 → category 11 → note 11.01) ----------
     type 'text' = a written note, 'compose' = leave-a-note form, 'testimonials' = list below */
  notes: [
    { area: '10–19 Photography', id: '11.00', title: 'Field Notes: Notes from my trips', type: 'text',
      body: 'A growing collection of images shaped by place, season, and atmosphere. Explore the albums in Photos.' },
    { area: '10–19 Photography', id: '11.01', title: 'Rochester, Winter', album: 'rochester-winter', type: 'text' },
    { area: '10–19 Photography', id: '11.02', title: 'St. Augustine', album: 'st-augustine', type: 'text' },
    { area: '10–19 Photography', id: '11.03', title: 'Chicago, Summer 2025', album: 'chicago-summer-2025', type: 'text' },
    { area: '10–19 Photography', id: '11.04', title: 'New York, Fall 2026', album: 'nyc-fall-2026', type: 'text' },
    { area: '10–19 Photography', id: '11.05', title: 'Rochester, Summer 2026', album: 'rochester-summer-2026', type: 'text' },
    { area: '10–19 Photography', id: '11.06', title: 'Hemlock Lake', album: 'hemlock-lake', type: 'text' },
    { area: '10–19 Photography', id: '11.07', title: 'Detroit', album: 'detroit', type: 'text' },
    { area: '10–19 Photography', id: '11.08', title: 'Southwest Summer 2026', album: 'southwest-summer-2026', type: 'text' },
    { area: '10–19 Photography', id: '12.01', title: 'Gear', type: 'text',
      body: 'Body\n• FUJIFILM X-T5\n\nLenses\n• Fujinon XF 16-55mm f/2.8 R LM WR II — everyday carry\n• Viltrox AF 9mm f/2.8 Air — ultra-wide\n• Viltrox 33mm f/1.4\n• Sigma 100-400mm — wildlife\n• Fujinon XF 18-135mm\n• TTArtisan 25mm f/2 and 50mm f/1.2 (manual)\n\nBag\n• PGYTECH OneGo Lite\n\nLook\n• Fuji film simulations, shot in JPEG — Classic Neg, Velvia, Acros+R\n• DR400 with a cool white-balance shift\n\nEditing\n• Photomator, Darktable' },
    { area: '20–29 About', id: '21.01', title: 'About Dave', type: 'text',
      body: 'Photographer based in Rochester, New York.\n\nWelcome to my canvas — photography, place, and perspective.' },
    { area: '20–29 About', id: '21.02', title: 'Leave Dave a note ✍️', type: 'compose' },
    { area: '20–29 About', id: '21.03', title: 'Testimonials', type: 'testimonials' }
  ],
  testimonials: [
    // { name: 'Jane D.', text: 'Loved the Letchworth set!' }
  ],

  /* ---------- Calendar availability ----------
     Weekends up to and including blockWeekendsUntil show as unavailable with this label. */
  calendar: { blockWeekendsUntil: '2027-01-03', label: 'Out of town' },

  /* ---------- Print shop (Pixieset store) ----------
     shopUrl: your Pixieset store link once it exists (e.g. 'https://gallery.davekorr.com').
     While it is null, the Shop buttons say "Opening soon". Prices are open-edition, lustre/fine-art paper. */
  shop: {
    shopUrl: null,
    prices: [ { size: '8 × 10', price: 40 }, { size: '12 × 18', price: 75 },
              { size: '16 × 24', price: 125 }, { size: '20 × 30', price: 195 } ]
  },

  /* ---------- Music (current playlist) ----------
     nowPlaying = index of the song shown on the lock screen and home screen.
     Tapping play opens the song in Apple Music (the site itself plays no audio). */
  music: {
    playlist: 'On Rotation',
    nowPlaying: 18,
    songs: [
      { title: "Stuck On You", artist: "GIVĒON" },
      { title: "For Tonight", artist: "GIVĒON" },
      { title: "VITINHA (Afro)", artist: "Velian Officiel" },
      { title: "BELLE", artist: "Velian Officiel" },
      { title: "Big Flexa", artist: "Costa Titch" },
      { title: "AWAY", artist: "Davido" },
      { title: "FOR THE ROAD", artist: "Davido" },
      { title: "Anna Sun", artist: "WALK THE MOON" },
      { title: "4 Kampé II", artist: "Joé Dwèt Filé & Burna Boy" },
      { title: "Change Your Mind", artist: "Burna Boy" },
      { title: "Intro", artist: "JAY-Z" },
      { title: "Underdog (Remix)", artist: "Alicia Keys" },
      { title: "Is That Your Chick", artist: "Memphis Bleek" },
      { title: "Sweet Love (Re-Recorded)", artist: "Wahu" },
      { title: "4 Alarm Blaze", artist: "M.O.P." },
      { title: "Money Goes, Honey Stay", artist: "Fabolous" },
      { title: "Queen Tings", artist: "Masego" },
      { title: "CHINEKE", artist: "Tobe Nwigwe & Busta Rhymes" },
      { title: "I'll Be Okay", artist: "Bien" },
      { title: "One In Million", artist: "Teejay" },
      { title: "Something I Said", artist: "Protoje" },
      { title: "So Easy (To Fall In Love)", artist: "Olivia Dean" },
      { title: "Bruises", artist: "Lewis Capaldi" }
    ]
  },

  /* ---------- App icon images ----------
     mac   = icon used on the Mac desktop (macOS style, with its own padding/shadow)
     phone = icon used on the iPhone layout (square; the site rounds the corners)
     null  = use the built-in icon. Calendar keeps a live date on top of its artwork. */
  iconImages: {
    photos:    { mac: 'icons/mac/photos.png',    phone: 'icons/ios/photos.png' },
    safari:    { mac: 'icons/mac/safari.png',    phone: 'icons/ios/safari.png' },
    notes:     { mac: 'icons/mac/notes.png',     phone: 'icons/ios/notes.png' },
    calendar:  { mac: 'icons/mac/calendar.png',  phone: 'icons/ios/calendar.png' },
    mail:      { mac: 'icons/mac/mail.png',      phone: 'icons/ios/mail.png' },
    instagram: { mac: 'icons/mac/instagram.png', phone: 'icons/ios/instagram.png' },
    music:     { mac: 'icons/mac/music.png',     phone: 'icons/ios/music.png' },
    camera:    { mac: 'icons/mac/camera.png',    phone: 'icons/ios/camera.png' }
  }
};
