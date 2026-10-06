/* =====================================================================
   Galaxy Bicycles — site data
   Edit this file to update shop details, bikes and services.
   Fields marked  // CHECK  were guessed from photos — please verify.
   ===================================================================== */
window.GALAXY = {
  business: {
    name: "Galaxy Bicycles",
    nameKn: "ಗ್ಯಾಲಕ್ಸಿ ಬೈ ಸೈಕಲ್ಸ್",
    tagline: "Sales · Service · Accessories · Spares",
    phone: "+919533282965",
    phoneDisplay: "95332 82965",
    whatsapp: "919533282965",            // CHECK: is this number on WhatsApp?
    gst: "29AAXFG0822H1Z3",
    address: "",                          // CHECK: add the full shop address here
    hours: "",                            // CHECK: e.g. "Mon–Sun · 9:30 AM – 9:00 PM"
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Galaxy+Bicycles", // CHECK: paste your Google Maps share link
    rating: 5.0,
    reviewCount: 907,
    ratingBars: [100, 0, 0, 0, 0]          // 5★ → 1★ share (%), from the Google review summary
  },

  // Brands visible inside the store (signage & posters)
  brands: ["Hero Sprint", "cult.sport", "Roadeo", "Ninety One", "EMotorad", "Hero Kids"],

  categories: [
    { id: "all", label: "All bikes" },
    { id: "mtb", label: "Mountain" },
    { id: "electric", label: "Electric" },
    { id: "kids", label: "Kids" }
  ],

  // Prices are not listed — every bike opens a "best price" enquiry.
  products: [
    {
      id: "drago",
      brand: "Ninety One",
      name: "Drago",
      category: "mtb",
      colour: "Black · Fiery Red",
      swatch: ["#111", "#d4231c"],
      img: "drago",
      cut: "drago-cut",
      wheel: "27.5″ / 29″",        // CHECK
      features: ["Front suspension fork", "Dual mechanical disc brakes", "Multi-speed gearing", "Full-length mudguards"],
      blurb: "A gradient-red trail hardtail that looks quick standing still. Built for city commutes that end on dirt."
    },
    {
      id: "emotorad",
      brand: "EMotorad",
      name: "Electric MTB",                 // CHECK: exact model name
      category: "electric",
      colour: "Electric Blue · Graphite",
      swatch: ["#1e8fe0", "#55595e"],
      img: "emotorad",
      cut: "emotorad-cut",
      wheel: "27.5″",                    // CHECK
      features: ["Pedal-assist rear hub motor", "Removable down-tube battery", "Front suspension fork", "Front & rear disc brakes"],
      blurb: "Pedal when you want, glide when you don't. A removable battery and suspension for effortless daily miles."
    },
    {
      id: "fantom",
      brand: "Fantom",                      // CHECK: brand / series
      name: "Fantom MTB",
      category: "mtb",
      colour: "Black · Orange · Blue",
      swatch: ["#111", "#f07a1a", "#1e7fd6"],
      img: "fantom",
      cut: "fantom-cut",
      wheel: "27.5″",                    // CHECK
      features: ["Front suspension fork", "Dual disc brakes", "Multi-speed gearing", "Branded alloy rims"],
      blurb: "Bold graphics, sure stops and plenty of gears — the all-rounder for riders who want to stand out."
    },
    {
      id: "boomer",
      brand: "Hero",
      name: "Boomer",
      category: "kids",
      colour: "Black · Pink",
      swatch: ["#111", "#f2559a"],
      img: "kid-boomer",
      wheel: "14″",                      // CHECK
      age: "3–5 yrs",                       // CHECK
      features: ["Training wheels", "Front basket", "Padded backrest seat", "Chain guard"],
      blurb: "First-ride confidence with a supportive backrest, stabilisers and a basket for treasures."
    },
    {
      id: "wave",
      brand: "Hero",
      name: "Herowave",                     // CHECK: name on top tube is hard to read
      category: "kids",
      colour: "Black · Yellow",
      swatch: ["#111", "#f6c90e"],
      img: "kid-wave",
      wheel: "16″",                      // CHECK
      age: "4–7 yrs",                       // CHECK
      features: ["Training wheels", "Bell included", "Cartoon chain cover", "Chunky tyres"],
      blurb: "Football-themed fun with chunky tyres and stabilisers — made for the colony lanes."
    },
    {
      id: "tempo",
      brand: "Hero",
      name: "Tempo",
      category: "kids",
      colour: "Teal · White",
      swatch: ["#13b3b0", "#f4f4f4"],
      img: "kid-tempo",
      wheel: "20″",                      // CHECK
      age: "6–9 yrs",                       // CHECK
      features: ["Removable training wheels", "Front basket", "Rear carrier", "White suspension-style fork"],
      blurb: "The big-kid upgrade: a carrier, a basket and stabilisers that come off when they're ready."
    }
  ],

  services: [
    { id: "sales", title: "Sales", text: "Mountain, city, electric and kids' bikes from trusted brands — test-ride before you buy.", icon: "bike" },
    { id: "service", title: "Service", text: "Tune-ups, puncture repairs, brake and gear adjustments by experienced mechanics.", icon: "wrench" },
    { id: "accessories", title: "Accessories", text: "Helmets, lights, locks, bottles, bells and baskets to complete your ride.", icon: "helmet" },
    { id: "spares", title: "Spares", text: "Genuine tyres, tubes, chains, brake pads and parts — fitted while you wait.", icon: "gear" }
  ]
};
