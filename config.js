/* ================================================================
   davekorr.com — SITE CONFIG
   This is the only file you need to edit for day-to-day changes.
   - Text in quotes is shown on the site.
   - Image paths are relative to this folder (e.g. 'img/my-photo.webp').
   - Keep the commas between items.
   ================================================================ */

window.SITE = {

  name: 'Dave Korr',
  menuName: 'davekorr',            // bold name at top-left of the Mac menu bar
  instagram: 'dave_korir',         // used for every Instagram link
  email: 'hello@davekorr.com',     // routes to Gmail via Cloudflare Email Routing

  /* ---------- Wallpapers (swap in your own photos) ---------- */
  wallpapers: {
    lockDesktop: 'img/hero.webp',            // lock screen on a computer (landscape) — original davekorr.com hero
    lockPhone:   'img/hero-portrait.webp',   // lock screen on a phone (portrait crop of the same photo)
    desktop:     'img/hero.webp',            // Mac desktop after unlocking
    phoneHome:   'img/hero-portrait.webp'    // iPhone home screen after unlocking
  },

  /* ---------- Lock-screen notifications ----------
     The lock screen shows up to 3, each with its own job:
       1. Live: Rochester's light right now (golden hour countdown, blue hour, sunrise...). Worked out
          in the visitor's browser from the date and Rochester's sunset; nothing to update.
       2. News: newest of "N new photos in <album>" (written by publish-site --live, shown 14 days)
          or "Playlist refreshed" (from the Sunday playlist update, shown 7 days).
       3. Always on: one of the notifications below, a different one each day.
     For these: app = icon, title / body = the two lines,
     open = what a tap opens inside the site, e.g. { app: 'safari', tab: 'shop' }; link = a web link instead. */
  notifications: [
    { app: 'safari',    title: 'Buy my prints 🖼',
      body: 'Signed prints, made to order — browse the print shop.',
      open: { app: 'safari', tab: 'shop' } },

    { app: 'instagram', title: 'Follow along on Instagram',
      body: '@dave_korir: new shots and behind the scenes.',
      link: 'https://instagram.com/dave_korir' }
  ],

  /* ---------- Contacts app (About Dave) ----------
     Front of the card = contact details; back = the pass with a QR code that saves the contact.
     availableFor: leave "" to hide that row. bio: the one-line note on the card. */
  about: {
    name: "Dave Korr",
    role: "Photographer",
    home: "Rochester, NY · roots in Kenya",
    camera: "Fujifilm X-T5",
    bio: "I shoot the lakes and gorges of upstate New York and the cities I travel through, mostly at golden hour.",
    availableFor: ""
  },

  /* ---------- Albums (shown in Photos → Albums) ----------
     eyebrow = small label above the album text; story = paragraphs shown at the top of the album. */
  albums: [
    { id: "seneca-lake-2026", pin: "Seneca", name: "Seneca Lake Park, Fall 2026", eyebrow: "Portfolio · Local",
      story: [] },
    { id: "letchworth", pin: "Letchworth", name: "Letchworth 2026", eyebrow: "Portfolio · Local",
      story: [] },
    { id: "nyc-fall-2026", name: "New York City, Fall 2026", eyebrow: "Portfolio · Travel",
      story: ["One October day in New York, start to finish: a quiet morning in Brooklyn, across the bridge, down into the subway, up through Manhattan, and out into Times Square as the light goes.",
        "Brooklyn is slow — Cadman Plaza, Fulton Ferry, the park, leaves just turning. The bridge does the talking: granite, cables pulling every line to one point, runners and walkers under them. Below ground the city is all signs and waiting. Above it, old stone and new glass, a few performers, and then the noise of 46th Street, finished in black and white.",
        "It is a trip best taken with friends. No itinerary, no checklist, just walking the streets with people you like, cameras out, stopping wherever something catches the light. Give New York a chance and it will surprise you."] },
    { id: "rochester-summer-2026", pin: "Rochester ☀︎", name: "Rochester, Summer 2026", eyebrow: "Portfolio · Local",
      story: ["Since moving to the US, Rochester has shown me time and time again that it is a hidden gem. It does not announce itself. It just keeps quietly rewarding you for staying.",
        "The winters are long and cold, and they are worth it, purely for what comes after. Spring arrives like a reward, summer turns everything green and loud, and fall sets the whole region on fire. Living through the cold is what makes the other three seasons feel earned.",
        "This set is one long summer day at home: the Genesee in the morning, High Falls and the Kodak tower through the afternoon, the Strong glowing after a rain, and Cobbs Hill to close it out as the sun drops behind the tower."] },
    { id: "hemlock-lake", pin: "Hemlock", name: "Hemlock Lake", eyebrow: "Portfolio · Local",
      story: ["The road is still dark when the cooler goes in the trunk. By the time the sky starts to pale, the chair is set, the line is out, and the only sound is the water moving against the stones.",
        "The sun comes up slowly over the valley, and the color comes with it: water so blue it looks lit from underneath, and hills in that deep early-summer green that cannot really be explained, only experienced. The phone stays face down in a bag somewhere, and stays there. The hat comes down a little lower and the morning stretches out.",
        "By noon there is smoke from the grill and a cold Genesee sweating in the shade. The drive home is quiet, the afternoon is warm, and the nap comes easy."] },
    { id: "detroit", name: "Detroit", eyebrow: "Portfolio · Travel",
      story: ["Detroit has grit and finesse, sometimes on the same block. Start under the RenCen, glass towers throwing the sky back at you, then walk the Riverwalk as the sun goes down and Windsor lights up across the water.",
        "The steak at Prime + Proper is everything people say it is. But the city you actually feel is somewhere else: a dark bar on a Tuesday night, rain on the window, a candle and a short menu. Or down a marble staircase into Hiroki-San on a Thursday, where the room is hushed before service, the bar glows amber, and the kitchen works like it has something to prove.",
        "Detroit does not dress itself up for you. It shows you what it has and lets you decide. Most people who look closely end up staying a little longer than they planned."] },
    { id: "southwest-summer-2026", pin: "Dallas · Tulsa", name: "Southwest Summer 2026", eyebrow: "Portfolio · Travel",
      story: ["Timing is everything. The pumpkin village at the Dallas Arboretum only stands for part of the season; a week later and the stacks are gone. In Tulsa, the light on the water at Gathering Place lined up for a few minutes, just as a kayak drifted out below.",
        "Three frames are not enough for country this big. Texas and Oklahoma are on the 2027 list: more time, more back roads, better timing.",
        "To be continued."] },
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

  /* ---------- Photos from Titan (via Cloudflare R2) ----------
     Albums whose folder in Titan's "15 Web" has photos are published by tools/publish/publish-site.
     albums: 'replace' = Titan photos replace the ones listed below (default)
             'append'  = Titan photos are added after the ones listed below
     text:   title + alt text (description for screen readers) per camera file name. */
  r2: {
    albums: { 'rochester-summer-2026': 'append' },
    text: {
      // Letchworth 2026
      DSCF6663: { title: 'Riders under the maples', alt: 'Two motorcyclists ride a leaf-covered park road under orange and yellow maples' },
      DSCF6674: { title: 'The road bends into color', alt: 'A winding park road with a double yellow line curves into red and orange trees under a clear sky' },
      DSCF6689: { title: 'Golden hour at the overlook', alt: 'Low sun flares through autumn trees, casting long shadows across the road by the gorge overlook' },
      DSCF6698: { title: 'Sunburst over the gorge', alt: 'The sun bursts through fall trees above the gorge, the ground carpeted in orange leaves' },
      DSCF6703: { title: 'Leaves on fire', alt: 'Backlit red and orange leaves glow as the sun sets behind a stand of trees' },
      DSCF6707: { title: 'Last light in the grove', alt: 'The setting sun shines through a grove of red trees onto a leaf-covered path' },
      DSCF6709: { title: 'Tripod, sunburst', alt: 'A tripod stands in red leaves facing a sunburst between tall trees' },
      DSCF6716: { title: 'The Genesee below', alt: 'The Genesee River bends through the Letchworth gorge, cliffs and fall foliage on both sides' },
      DSCF6719: { title: 'The overlook', alt: 'A stone wall and viewing binoculars at an overlook above the hazy gorge at sunset' },
      DSCF6722: { title: 'Canyon in full color', alt: 'The Letchworth canyon in peak fall color, the river winding past a pale cliff face' },
      // Seneca Lake Park, Fall 2026
      DSCF6849: { title: 'Mallard', alt: 'A male mallard duck swims across rippled water reflecting autumn trees' },
      DSCF6850: { title: 'Mallard, turning', alt: 'A male mallard turns on the pond, gold and green reflections around him' },
      DSCF6853: { title: 'Mallard, at ease', alt: 'A male mallard floats calmly on the pond with other ducks soft in the background' },
      DSCF6860: { title: 'The far shore', alt: 'A mallard drifts on the pond below the park lawn and turning trees' },
      DSCF6895: { title: 'Hen in soft light', alt: 'A female mallard rests on pale, still water beside her reflection' },
      DSCF6985: { title: 'Gold water', alt: 'A lone duck crosses water glowing gold with reflected trees' },
      DSCF6996: { title: 'Under the red maple', alt: 'A duck swims on blue water beneath overhanging red maple branches' },
      DSCF7005: { title: 'Evening on the pond', alt: 'Ducks float on dark blue water at dusk under red autumn leaves' },
      DSCF7037: { title: 'Squirrel in the oak', alt: 'A gray squirrel sits in the fork of a tree among dry autumn leaves' },
      DSCF7125: { title: 'Kit and leaves', alt: 'A camera lens rests on dark grass scattered with red and pink fallen leaves' },
      // Hemlock Lake
      DSCF9234: { title: 'Morning on Hemlock', alt: 'Hemlock Lake stretches between green hills under a blue sky, a path along the shore' },
      DSCF9238: { title: 'The valley opens', alt: 'The lake and distant hills seen from a grassy shore framed by trees' },
      DSCF9240: { title: 'Through the branches', alt: 'Bright lake water seen through dark overhanging branches' },
      DSCF9262: { title: 'Still water', alt: 'A wooded shoreline mirrored in calm, clear water' },
      DSCF9274: { title: 'Clouds on the water', alt: 'Clouds reflected in the still lake, a driftwood log in the foreground' },
      DSCF9277: { title: 'Line out', alt: 'A fishing rod rests on the rocky shore with the lake and hills beyond' },
      DSCF9292: { title: 'The bobber', alt: 'A red and white fishing bobber floats alone on blue water' },
      DSCF9296: { title: 'Framed by green', alt: 'The lake framed by leafy trees on both sides under a bright sky' },
      DSCF9305: { title: 'Shade by the shore', alt: 'Calm water and distant hills seen from under shoreline trees' },
      DSCF9359: { title: 'Noon, Genesee in hand', alt: 'A can of Genesee beer on a wooden table in dappled shade' },
      // Rochester, Summer 2026 — Durand Beach and around town
      DSCF8778: { title: 'Durand at sundown', alt: 'People walk the shore at Durand Beach in a haze of golden evening light' },
      DSCF8779: { title: 'Walking the shoreline', alt: 'Silhouettes stroll the Lake Ontario shore at Durand Beach in golden light' },
      DSCF8994: { title: 'The sun goes under', alt: 'A large orange sun sinks behind a silhouetted treeline under a red sky' },
      DSCF8995: { title: 'Sun through the bands', alt: 'Thin clouds cross a glowing sun setting over dark trees' },
      DSCF8996: { title: 'Red sky', alt: 'A red sunset sky with the sun sitting just above the treeline' },
      DSCF8998: { title: 'Sinking', alt: 'The sun half hidden in cloud bands as it sets over the trees' },
      DSCF9003: { title: 'Sun on the water', alt: 'The setting sun over a treeline, its reflection a red streak on the water' },
      DSCF9004: { title: 'Last streak', alt: 'A vertical frame of the sun dropping behind trees, red light on the lake' },
      DSCF9005: { title: 'Just above the trees', alt: 'A glowing sun rests on the treeline under a deep red sky' },
      DSCF9010: { title: 'Swimmers at dusk', alt: 'Swimmers in an orange lake beneath the setting sun and a wooded point' },
      DSCF9052: { title: 'Downtown, deep blue', alt: 'A red brick church and office building in silhouette against a deep blue sky' },
      DSCF9096: { title: 'Sun through the canopy', alt: 'Afternoon sun shines through a large tree in a riverside park' },
      DSCF9103: { title: 'The skyline across the water', alt: 'The Rochester skyline seen across calm blue water' },
      DSCF9112: { title: 'Skyline through the leaves', alt: 'The Rochester skyline across the water, framed by green leaves' },
      DSCF9539: { title: 'Gull overhead', alt: 'A gull glides against a soft blue sky' },
      DSCF9540: { title: 'Wings out', alt: 'A gull soars with wings spread across a deep blue sky' },
      DSCF9570: { title: 'The beach path', alt: 'Silhouetted trees above a sandy beach with people at the water at sunset' },
      DSCF9601: { title: 'Ontario sunset', alt: 'The sun sets over Lake Ontario, waves washing a dark shoreline' },
      DSCF9602: { title: 'Ontario sunset, waves', alt: 'Golden sunset over Lake Ontario with small waves on the beach' },
      DSCF0612_SnapseedCopy: { title: 'The Strong after dark', alt: 'The Strong National Museum of Play lit up at night, its glass facade glowing' }
    }
  },

  /* ---------- Photos ----------
     src = full image, thumb = small grid version, album = album id above.
     Camera settings are optional; they show in the Info panel and Camera app when present.
     Photos appear in this order everywhere (newest album first). */
  photos: [
    { id: "letchworth-7", album: "letchworth", title: "Middle Falls in full fall color", src: 'img/letchworth-7.webp', thumb: 'img/thumb/letchworth-7.webp', alt: "Middle Falls in full fall color" },
    { id: "letchworth-8", album: "letchworth", title: "The gorge from the overlook", src: 'img/letchworth-8.webp', thumb: 'img/thumb/letchworth-8.webp', alt: "The gorge from the overlook" },
    { id: "letchworth-9", album: "letchworth", title: "Park road under the maples", src: 'img/letchworth-9.webp', thumb: 'img/thumb/letchworth-9.webp', alt: "Park road under the maples" },
    { id: 'l1', album: 'letchworth', src: 'img/letchworth-1.webp', thumb: 'img/thumb/letchworth-1.webp',
      alt: 'Sunburst through red maples over a leaf-covered path',
      taken: '2026-10-24T17:45', camera: 'FUJIFILM X-T5', lens: 'Viltrox AF 9mm F2.8 Air', fl: '9mm', f: 'f/5.6', ss: '1/220', iso: '500' },
    { id: 'l2', album: 'letchworth', src: 'img/letchworth-2.webp', thumb: 'img/thumb/letchworth-2.webp',
      alt: 'Gorge overlook framed by red and gold trees',
      taken: '2026-10-24T17:42', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '16mm', f: 'f/2.8', ss: '1/750', iso: '500' },
    { id: 'l3', album: 'letchworth', src: 'img/letchworth-3.webp', thumb: 'img/thumb/letchworth-3.webp',
      alt: 'Low sun flaring between trees at the overlook',
      taken: '2026-10-24T17:42', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '16mm', f: 'f/2.8', ss: '1/750', iso: '500' },
    { id: 'l4', album: 'letchworth', src: 'img/letchworth-4.webp', thumb: 'img/thumb/letchworth-4.webp',
      alt: 'Two riders beside motorcycles under yellow foliage',
      taken: '2026-10-24T17:08', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '55mm', f: 'f/2.8', ss: '1/250', iso: '1250' },
    { id: 'l5', album: 'letchworth', src: 'img/letchworth-5.webp', thumb: 'img/thumb/letchworth-5.webp',
      alt: 'Tripod standing in red leaves facing the sunburst',
      taken: '2026-10-24T17:48', camera: 'FUJIFILM X-T5', lens: 'Viltrox AF 9mm F2.8 Air', fl: '9mm', f: 'f/5.0', ss: '1/200', iso: '500' },
    { id: 'l6', album: 'letchworth', src: 'img/letchworth-6.webp', thumb: 'img/thumb/letchworth-6.webp',
      alt: 'Long tree shadow across orange leaves at golden hour',
      taken: '2026-10-24T17:42', camera: 'FUJIFILM X-T5', lens: 'XF 16-55mm F2.8', fl: '16mm', f: 'f/2.8', ss: '1/340', iso: '500' },

    // ---- New York City, Fall 2026 (story order) ----
    { id: "nyc-01-cadman-plaza", album: "nyc-fall-2026", title: "Morning, Cadman Plaza", src: 'img/nyc-01-cadman-plaza.webp', thumb: 'img/thumb/nyc-01-cadman-plaza.webp', alt: "Morning, Cadman Plaza" },
    { id: "nyc-02-fulton-ferry", album: "nyc-fall-2026", title: "Toward Fulton Ferry", src: 'img/nyc-02-fulton-ferry.webp', thumb: 'img/thumb/nyc-02-fulton-ferry.webp', alt: "Toward Fulton Ferry" },
    { id: "nyc-03-flare", album: "nyc-fall-2026", title: "Old Fulton Flare", src: 'img/nyc-03-flare.webp', thumb: 'img/thumb/nyc-03-flare.webp', alt: "Old Fulton Flare" },
    { id: "nyc-04-dumbo-signs", album: "nyc-fall-2026", title: "DUMBO Wayfinding", src: 'img/nyc-04-dumbo-signs.webp', thumb: 'img/thumb/nyc-04-dumbo-signs.webp', alt: "DUMBO Wayfinding" },
    { id: "nyc-05-park", album: "nyc-fall-2026", title: "Brooklyn Bridge Park", src: 'img/nyc-05-park.webp', thumb: 'img/thumb/nyc-05-park.webp', alt: "Brooklyn Bridge Park" },
    { id: "nyc-26-brooklyn-bridge", album: "nyc-fall-2026", title: "Under the Brooklyn Bridge", src: 'img/nyc-26-brooklyn-bridge.webp', thumb: 'img/thumb/nyc-26-brooklyn-bridge.webp', alt: "Under the Brooklyn Bridge" },
    { id: "nyc-06-gold-leaves", album: "nyc-fall-2026", title: "Tower and Gold Leaves", src: 'img/nyc-06-gold-leaves.webp', thumb: 'img/thumb/nyc-06-gold-leaves.webp', alt: "Tower and Gold Leaves" },
    { id: "nyc-07-brooklyn-bound", album: "nyc-fall-2026", title: "Brooklyn Bound", src: 'img/nyc-07-brooklyn-bound.webp', thumb: 'img/thumb/nyc-07-brooklyn-bound.webp', alt: "Brooklyn Bound" },
    { id: "nyc-08-tower", album: "nyc-fall-2026", title: "The Tower", src: 'img/nyc-08-tower.webp', thumb: 'img/thumb/nyc-08-tower.webp', alt: "The Tower" },
    { id: "nyc-09-cables", album: "nyc-fall-2026", title: "Cables", src: 'img/nyc-09-cables.webp', thumb: 'img/thumb/nyc-09-cables.webp', alt: "Cables" },
    { id: "nyc-10-crossing", album: "nyc-fall-2026", title: "Crossing", src: 'img/nyc-10-crossing.webp', thumb: 'img/thumb/nyc-10-crossing.webp', alt: "Crossing" },
    { id: "nyc-11-runner", album: "nyc-fall-2026", title: "The Runner", src: 'img/nyc-11-runner.webp', thumb: 'img/thumb/nyc-11-runner.webp', alt: "The Runner" },
    { id: "nyc-12-manhattan-bridge", album: "nyc-fall-2026", title: "Manhattan Bridge Through the Cables", src: 'img/nyc-12-manhattan-bridge.webp', thumb: 'img/thumb/nyc-12-manhattan-bridge.webp', alt: "Manhattan Bridge Through the Cables" },
    { id: "nyc-13-fdr", album: "nyc-fall-2026", title: "FDR Drive North", src: 'img/nyc-13-fdr.webp', thumb: 'img/thumb/nyc-13-fdr.webp', alt: "FDR Drive North" },
    { id: "nyc-14-canal-exit", album: "nyc-fall-2026", title: "Exit, Canal Street", src: 'img/nyc-14-canal-exit.webp', thumb: 'img/thumb/nyc-14-canal-exit.webp', alt: "Exit, Canal Street" },
    { id: "nyc-15-west-4", album: "nyc-fall-2026", title: "West 4th Street Platform", src: 'img/nyc-15-west-4.webp', thumb: 'img/thumb/nyc-15-west-4.webp', alt: "West 4th Street Platform" },
    { id: "nyc-27-w4-platform", album: "nyc-fall-2026", title: "W 4th St Platform", src: 'img/nyc-27-w4-platform.webp', thumb: 'img/thumb/nyc-27-w4-platform.webp', alt: "W 4th St Platform" },
    { id: "nyc-16-c-train", album: "nyc-fall-2026", title: "C Train, Downtown Platform", src: 'img/nyc-16-c-train.webp', thumb: 'img/thumb/nyc-16-c-train.webp', alt: "C Train, Downtown Platform" },
    { id: "nyc-17-one-wtc", album: "nyc-fall-2026", title: "One World Trade", src: 'img/nyc-17-one-wtc.webp', thumb: 'img/thumb/nyc-17-one-wtc.webp', alt: "One World Trade" },
    { id: "nyc-18-courthouse", album: "nyc-fall-2026", title: "The Courthouse Dome", src: 'img/nyc-18-courthouse.webp', thumb: 'img/thumb/nyc-18-courthouse.webp', alt: "The Courthouse Dome" },
    { id: "nyc-19-justice", album: "nyc-fall-2026", title: "Justice, Rooftop", src: 'img/nyc-19-justice.webp', thumb: 'img/thumb/nyc-19-justice.webp', alt: "Justice, Rooftop" },
    { id: "nyc-20-chrysler", album: "nyc-fall-2026", title: "Chrysler, Down the Block", src: 'img/nyc-20-chrysler.webp', thumb: 'img/thumb/nyc-20-chrysler.webp', alt: "Chrysler, Down the Block" },
    { id: "nyc-21-performers", album: "nyc-fall-2026", title: "Performers, Graffiti Wall", src: 'img/nyc-21-performers.webp', thumb: 'img/thumb/nyc-21-performers.webp', alt: "Performers, Graffiti Wall" },
    { id: "nyc-22-times-square", album: "nyc-fall-2026", title: "Times Square, Looking Up", src: 'img/nyc-22-times-square.webp', thumb: 'img/thumb/nyc-22-times-square.webp', alt: "Times Square, Looking Up" },
    { id: "nyc-23-canyon", album: "nyc-fall-2026", title: "Canyon of Light", src: 'img/nyc-23-canyon.webp', thumb: 'img/thumb/nyc-23-canyon.webp', alt: "Canyon of Light" },
    { id: "nyc-24-paramount", album: "nyc-fall-2026", title: "The Paramount Clock", src: 'img/nyc-24-paramount.webp', thumb: 'img/thumb/nyc-24-paramount.webp', alt: "The Paramount Clock" },
    { id: "nyc-25-w46", album: "nyc-fall-2026", title: "W 46th St, Black and White", src: 'img/nyc-25-w46.webp', thumb: 'img/thumb/nyc-25-w46.webp', alt: "W 46th St, Black and White" },
    // ---- Rochester, Summer 2026 (story order) ----
    { id: "roc-01-river", album: "rochester-summer-2026", title: "The Genesee and the Smokestack", src: 'img/roc-01-river.webp', thumb: 'img/thumb/roc-01-river.webp', alt: "The Genesee and the Smokestack" },
    { id: "roc-02-high-falls", album: "rochester-summer-2026", title: "High Falls", src: 'img/roc-02-high-falls.webp', thumb: 'img/thumb/roc-02-high-falls.webp', alt: "High Falls" },
    { id: "roc-03-love-lock", album: "rochester-summer-2026", title: "Love Lock, High Falls", src: 'img/roc-03-love-lock.webp', thumb: 'img/thumb/roc-03-love-lock.webp', alt: "Love Lock, High Falls" },
    { id: "roc-04-welcome", album: "rochester-summer-2026", title: "Welcome to High Falls", src: 'img/roc-04-welcome.webp', thumb: 'img/thumb/roc-04-welcome.webp', alt: "Welcome to High Falls" },
    { id: "roc-05-browns-race", album: "rochester-summer-2026", title: "Brown's Race", src: 'img/roc-05-browns-race.webp', thumb: 'img/thumb/roc-05-browns-race.webp', alt: "Brown's Race" },
    { id: "roc-06-kodak", album: "rochester-summer-2026", title: "Kodak Tower", src: 'img/roc-06-kodak.webp', thumb: 'img/thumb/roc-06-kodak.webp', alt: "Kodak Tower" },
    { id: "roc-07-kodak-spire", album: "rochester-summer-2026", title: "The Spire", src: 'img/roc-07-kodak-spire.webp', thumb: 'img/thumb/roc-07-kodak-spire.webp', alt: "The Spire" },
    { id: "roc-08-mcc", album: "rochester-summer-2026", title: "Downtown Crossing", src: 'img/roc-08-mcc.webp', thumb: 'img/thumb/roc-08-mcc.webp', alt: "Downtown Crossing" },
    { id: "roc-09-round-tower", album: "rochester-summer-2026", title: "The Round Top", src: 'img/roc-09-round-tower.webp', thumb: 'img/thumb/roc-09-round-tower.webp', alt: "The Round Top" },
    { id: "roc-10-the-strong", album: "rochester-summer-2026", title: "The Strong After Rain", src: 'img/roc-10-the-strong.webp', thumb: 'img/thumb/roc-10-the-strong.webp', alt: "The Strong After Rain" },
    { id: "roc-11-cobbs-sun-tower", album: "rochester-summer-2026", title: "Sun on the Tower, Cobbs Hill", src: 'img/roc-11-cobbs-sun-tower.webp', thumb: 'img/thumb/roc-11-cobbs-sun-tower.webp', alt: "Sun on the Tower, Cobbs Hill" },
    { id: "roc-12-cobbs-sunset", album: "rochester-summer-2026", title: "Last Light, Cobbs Hill", src: 'img/roc-12-cobbs-sunset.webp', thumb: 'img/thumb/roc-12-cobbs-sunset.webp', alt: "Last Light, Cobbs Hill" },
    { id: "roc-13-cobbs-reservoir", album: "rochester-summer-2026", title: "Reservoir Afterglow", src: 'img/roc-13-cobbs-reservoir.webp', thumb: 'img/thumb/roc-13-cobbs-reservoir.webp', alt: "Reservoir Afterglow" },
    { id: "roc-14-cobbs-blue-hour", album: "rochester-summer-2026", title: "Blue Hour, Cobbs Hill", src: 'img/roc-14-cobbs-blue-hour.webp', thumb: 'img/thumb/roc-14-cobbs-blue-hour.webp', alt: "Blue Hour, Cobbs Hill" },

    // ---- Hemlock Lake (story order) ----
    { id: "hemlock-01-valley", album: "hemlock-lake", title: "The Long View South", src: 'img/hemlock-01-valley.webp', thumb: 'img/thumb/hemlock-01-valley.webp', alt: "The Long View South" },
    { id: "hemlock-02-branches", album: "hemlock-lake", title: "Under the Branches", src: 'img/hemlock-02-branches.webp', thumb: 'img/thumb/hemlock-02-branches.webp', alt: "Under the Branches" },
    { id: "hemlock-03-hillside", album: "hemlock-lake", title: "Far Shore", src: 'img/hemlock-03-hillside.webp', thumb: 'img/thumb/hemlock-03-hillside.webp', alt: "Far Shore" },
    { id: "hemlock-04-chair", album: "hemlock-lake", title: "The Red Chair", src: 'img/hemlock-04-chair.webp', thumb: 'img/thumb/hemlock-04-chair.webp', alt: "The Red Chair" },
    { id: "hemlock-05-rod", album: "hemlock-lake", title: "Line in the Water", src: 'img/hemlock-05-rod.webp', thumb: 'img/thumb/hemlock-05-rod.webp', alt: "Line in the Water" },
    { id: "hemlock-06-shade", album: "hemlock-lake", title: "Shade at the Shoreline", src: 'img/hemlock-06-shade.webp', thumb: 'img/thumb/hemlock-06-shade.webp', alt: "Shade at the Shoreline" },

    // ---- Detroit (story order) ----
    { id: "det-01-rencen", album: "detroit", title: "Renaissance Center", src: 'img/det-01-rencen.webp', thumb: 'img/thumb/det-01-rencen.webp', alt: "Renaissance Center" },
    { id: "det-02-cafe", album: "detroit", title: "Café Window", src: 'img/det-02-cafe.webp', thumb: 'img/thumb/det-02-cafe.webp', alt: "Café Window" },
    { id: "det-03-windsor", album: "detroit", title: "Windsor from the Riverwalk", src: 'img/det-03-windsor.webp', thumb: 'img/thumb/det-03-windsor.webp', alt: "Windsor from the Riverwalk" },
    { id: "det-04-stairs", album: "detroit", title: "Down the Stairs", src: 'img/det-04-stairs.webp', thumb: 'img/thumb/det-04-stairs.webp', alt: "Down the Stairs" },
    { id: "det-05-dining-room", album: "detroit", title: "Hiroki-San, Before Service", src: 'img/det-05-dining-room.webp', thumb: 'img/thumb/det-05-dining-room.webp', alt: "Hiroki-San, Before Service" },
    { id: "det-06-bar", album: "detroit", title: "The Bar", src: 'img/det-06-bar.webp', thumb: 'img/thumb/det-06-bar.webp', alt: "The Bar" },
    { id: "det-07-sushi", album: "detroit", title: "Sushi Counter", src: 'img/det-07-sushi.webp', thumb: 'img/thumb/det-07-sushi.webp', alt: "Sushi Counter" },
    { id: "det-08-kitchen", album: "detroit", title: "The Line", src: 'img/det-08-kitchen.webp', thumb: 'img/thumb/det-08-kitchen.webp', alt: "The Line" },
    { id: "det-09-wok", album: "detroit", title: "At the Wok Station", src: 'img/det-09-wok.webp', thumb: 'img/thumb/det-09-wok.webp', alt: "At the Wok Station" },
    { id: "det-10-red-window", album: "detroit", title: "The Red Window", src: 'img/det-10-red-window.webp', thumb: 'img/thumb/det-10-red-window.webp', alt: "The Red Window" },
    { id: "det-13-dinner", album: "detroit", title: "Steak Don and a Cocktail", src: 'img/det-13-dinner.webp', thumb: 'img/thumb/det-13-dinner.webp', alt: "Steak Don and a Cocktail" },
    { id: "det-14-dessert", album: "detroit", title: "Dessert for the Table", src: 'img/det-14-dessert.webp', thumb: 'img/thumb/det-14-dessert.webp', alt: "Dessert for the Table" },
    { id: "det-11-floor", album: "detroit", title: "Setting the Floor", src: 'img/det-11-floor.webp', thumb: 'img/thumb/det-11-floor.webp', alt: "Setting the Floor" },
    { id: "det-12-rain", album: "detroit", title: "Rain on the Glass", src: 'img/det-12-rain.webp', thumb: 'img/thumb/det-12-rain.webp', alt: "Rain on the Glass" },

    // ---- Southwest Summer 2026 (story order) ----
    { id: "sw-01-pumpkin-village", album: "southwest-summer-2026", title: "Pumpkin Village, Dallas", src: 'img/sw-01-pumpkin-village.webp', thumb: 'img/thumb/sw-01-pumpkin-village.webp', alt: "Pumpkin Village, Dallas" },
    { id: "sw-02-pumpkins", album: "southwest-summer-2026", title: "Pumpkin Stacks", src: 'img/sw-02-pumpkins.webp', thumb: 'img/thumb/sw-02-pumpkins.webp', alt: "Pumpkin Stacks" },
    { id: "sw-03-kayak", album: "southwest-summer-2026", title: "Kayak, Gathering Place", src: 'img/sw-03-kayak.webp', thumb: 'img/thumb/sw-03-kayak.webp', alt: "Kayak, Gathering Place" },


    // ---- from the original davekorr.com portfolios ----
    { id: "chi-flag-skyline", album: "chicago-summer-2025", title: "Chicago Flag and Skyline", src: 'img/chi-flag-skyline.webp', thumb: 'img/thumb/chi-flag-skyline.webp', alt: "Chicago Flag and Skyline" },
    { id: "chi-loop-pulse", album: "chicago-summer-2025", title: "Pulse of the Loop", src: 'img/chi-loop-pulse.webp', thumb: 'img/thumb/chi-loop-pulse.webp', alt: "Pulse of the Loop" },
    { id: "chi-el-train", album: "chicago-summer-2025", title: "The El, Afternoon Light", src: 'img/chi-el-train.webp', thumb: 'img/thumb/chi-el-train.webp', alt: "The El, Afternoon Light" },
    { id: "chi-morning-bus", album: "chicago-summer-2025", title: "Morning Crosstown", src: 'img/chi-morning-bus.webp', thumb: 'img/thumb/chi-morning-bus.webp', alt: "Morning Crosstown" },
    { id: "chi-wrigley-blue", album: "chicago-summer-2025", title: "Wrigley Building", src: 'img/chi-wrigley-blue.webp', thumb: 'img/thumb/chi-wrigley-blue.webp', alt: "Wrigley Building" },
    { id: "chi-wrigley-tower", album: "chicago-summer-2025", title: "Wrigley, Trump Tower, Sun Flare", src: 'img/chi-wrigley-tower.webp', thumb: 'img/thumb/chi-wrigley-tower.webp', alt: "Wrigley, Trump Tower, Sun Flare" },
    { id: "chi-plane-sky", album: "chicago-summer-2025", title: "Overhead, Chicago Blue", src: 'img/chi-plane-sky.webp', thumb: 'img/thumb/chi-plane-sky.webp', alt: "Overhead, Chicago Blue" },
    { id: "chi-lamp-dusk", album: "chicago-summer-2025", title: "River North at Dusk", src: 'img/chi-lamp-dusk.webp', thumb: 'img/thumb/chi-lamp-dusk.webp', alt: "River North at Dusk" },
    { id: "chi-bean", album: "chicago-summer-2025", title: "Cloud Gate, Millennium Park", src: 'img/chi-bean.webp', thumb: 'img/thumb/chi-bean.webp', alt: "Cloud Gate, Millennium Park" },
    { id: "chi-art-institute", album: "chicago-summer-2025", title: "Art Institute Lions, Michigan Ave", src: 'img/chi-art-institute.webp', thumb: 'img/thumb/chi-art-institute.webp', alt: "Art Institute Lions, Michigan Ave" },
    { id: "rochester-cover", album: "rochester-winter", title: "Rochester", src: 'img/rochester-cover.webp', thumb: 'img/thumb/rochester-cover.webp', alt: "Rochester" },
    { id: "roc-hero", album: "rochester-winter", title: "Rochester Hero", src: 'img/roc-hero.webp', thumb: 'img/thumb/roc-hero.webp', alt: "Rochester Hero" },
    { id: "roc-blizzard", album: "rochester-winter", title: "Blizzard", src: 'img/roc-blizzard.webp', thumb: 'img/thumb/roc-blizzard.webp', alt: "Blizzard" },
    { id: "roc-christmas", album: "rochester-winter", title: "Christmas Lights", src: 'img/roc-christmas.webp', thumb: 'img/thumb/roc-christmas.webp', alt: "Christmas Lights" },
    { id: "roc-deer", album: "rochester-winter", title: "Deer", src: 'img/roc-deer.webp', thumb: 'img/thumb/roc-deer.webp', alt: "Deer" },
    { id: "roc-dock", album: "rochester-winter", title: "Dock", src: 'img/roc-dock.webp', thumb: 'img/thumb/roc-dock.webp', alt: "Dock" },
    { id: "roc-downtown-aerial", album: "rochester-winter", title: "Downtown Aerial", src: 'img/roc-downtown-aerial.webp', thumb: 'img/thumb/roc-downtown-aerial.webp', alt: "Downtown Aerial" },
    { id: "roc-geese", album: "rochester-winter", title: "Geese", src: 'img/roc-geese.webp', thumb: 'img/thumb/roc-geese.webp', alt: "Geese" },
    { id: "roc-genesee-river", album: "rochester-winter", title: "Genesee River", src: 'img/roc-genesee-river.webp', thumb: 'img/thumb/roc-genesee-river.webp', alt: "Genesee River" },
    { id: "roc-genesee-sign", album: "rochester-winter", title: "Genesee Sign", src: 'img/roc-genesee-sign.webp', thumb: 'img/thumb/roc-genesee-sign.webp', alt: "Genesee Sign" },
    { id: "roc-hill", album: "rochester-winter", title: "Hill", src: 'img/roc-hill.webp', thumb: 'img/thumb/roc-hill.webp', alt: "Hill" },
    { id: "roc-icerink", album: "rochester-winter", title: "Ice Rink", src: 'img/roc-icerink.webp', thumb: 'img/thumb/roc-icerink.webp', alt: "Ice Rink" },
    { id: "roc-lobby", album: "rochester-winter", title: "Lobby", src: 'img/roc-lobby.webp', thumb: 'img/thumb/roc-lobby.webp', alt: "Lobby" },
    { id: "roc-sledding", album: "rochester-winter", title: "Sledding", src: 'img/roc-sledding.webp', thumb: 'img/thumb/roc-sledding.webp', alt: "Sledding" },
    { id: "sta-cyclist", album: "st-augustine", title: "Cyclist", src: 'img/sta-cyclist.webp', thumb: 'img/thumb/sta-cyclist.webp', alt: "Cyclist" },
    { id: "sta-hero", album: "st-augustine", title: "St. Augustine Hero", src: 'img/sta-hero.webp', thumb: 'img/thumb/sta-hero.webp', alt: "St. Augustine Hero" },
    { id: "sta-airport", album: "st-augustine", title: "Airport", src: 'img/sta-airport.webp', thumb: 'img/thumb/sta-airport.webp', alt: "Airport" },
    { id: "sta-cathedral", album: "st-augustine", title: "Cathedral", src: 'img/sta-cathedral.webp', thumb: 'img/thumb/sta-cathedral.webp', alt: "Cathedral" },
    { id: "sta-fountain", album: "st-augustine", title: "Fountain", src: 'img/sta-fountain.webp', thumb: 'img/thumb/sta-fountain.webp', alt: "Fountain" },
    { id: "sta-heron-dusk", album: "st-augustine", title: "Heron at Dusk", src: 'img/sta-heron-dusk.webp', thumb: 'img/thumb/sta-heron-dusk.webp', alt: "Heron at Dusk" },
    { id: "sta-heron-moon", album: "st-augustine", title: "Heron and Moon", src: 'img/sta-heron-moon.webp', thumb: 'img/thumb/sta-heron-moon.webp', alt: "Heron and Moon" },
    { id: "sta-highway", album: "st-augustine", title: "Highway", src: 'img/sta-highway.webp', thumb: 'img/thumb/sta-highway.webp', alt: "Highway" },
    { id: "sta-rocks", album: "st-augustine", title: "Rocks", src: 'img/sta-rocks.webp', thumb: 'img/thumb/sta-rocks.webp', alt: "Rocks" },
    { id: "sta-truck", album: "st-augustine", title: "Truck", src: 'img/sta-truck.webp', thumb: 'img/thumb/sta-truck.webp', alt: "Truck" }
  ],

  /* ---------- Safari tabs (your projects) ---------- */
  projects: [
    { id: 'shop', type: 'store', title: 'Print Shop', url: 'https://gallery.davekorr.com',
      desc: 'Signed, made-to-order prints' },
    { title: 'davekorr.com', url: 'https://davekorr.com',
      desc: 'Photography portfolio — Rochester, New York.',
      image: 'img/letchworth-3.webp',
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
    { area: '10–19 Photography', id: '11.04', title: 'New York City, Fall 2026', album: 'nyc-fall-2026', type: 'text' },
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
    /* Since 2026-11: the list below is only a fallback. Every Sunday Forager-01 (Vega) publishes
       images.davekorr.com/music.js with your hand-picked "On Rotation" songs + your most played of the last 30 days. */
    pin: { title: "Monster (feat. Avelino)", artist: "Jacob Banks" },   // the song on the lock screen card
    suggest: { turnstileSiteKey: "0x4AAAAAAF7snZ2RLvU7uH6U" },   // paste the Turnstile site key (public, not secret) to switch on "Suggest a song"
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
      { title: "Monster (feat. Avelino)", artist: "Jacob Banks" },
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
    camera:    { mac: 'icons/mac/camera.png',    phone: 'icons/ios/camera.png' },
    contacts:  { mac: 'icons/mac/contacts-ab.png',  phone: 'icons/ios/contacts-ab.png' }
  }
};
