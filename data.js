// Mahima's Personal Diet Tracker — single-profile, thyroid-focused
// TSH 9.5 (borderline hypothyroid, no medication) | 60kg | 5'3" | 0 sugar | Gym 4x/week

const PROFILE = {
  name: "Mahima",
  emoji: "🌸",
  weight: 60,
  height: "5'3\"",
  goals: ["Weight loss", "Strength", "Toning", "Thyroid support", "Cycle health"],
  notes: "TSH 9.5 — borderline hypothyroid. Brazil nuts for selenium, pumpkin seeds for zinc. Limit raw cruciferous, excess soy, millets.",
  proteinTarget: 90,
  waterTarget: 8,
  stepsTarget: 8000,
  supplements: ["Vitamin B12", "Vitamin D", "1-2 Brazil nuts (selenium)"]
};

// Compact thyroid quick-note for header card (replaces verbose warning)
const THYROID_GUIDE = {
  eat: [
    { item: 'Brazil nuts',    why: 'selenium' },
    { item: 'Pumpkin seeds',  why: 'zinc' },
    { item: 'Iodised salt',   why: 'iodine' },
    { item: 'Spinach, dates', why: 'iron' }
  ],
  avoid: [
    { item: 'Raw cruciferous', why: 'cabbage, broccoli — cooked OK' },
    { item: 'Excess soy',      why: 'tofu, soya chunks' },
    { item: 'Millets',         why: 'bajra, ragi, jowar' }
  ]
};

const DAILY_ESSENTIALS = {
  seedMix: "1 tsp each: chia + flax + pumpkin + sunflower + sesame",
  nuts: "5 almonds + 2 walnuts + 1 Brazil nut (for thyroid)",
  dailySoak: [
    "5-8 almonds (in ½ cup water) — easier digestion + better absorption",
    "1 tsp chia seeds (in 3 tbsp water) — for morning"
  ],
  fruits: ["Apple", "Guava", "Papaya", "Orange", "Pear", "Pomegranate", "Berries", "Watermelon", "Banana (only around workout)"],
  rules: [
    "0 sugar — no exceptions",
    "10-min walk after lunch and dinner",
    "Sleep 7-8 hours",
    "Stand/stretch every 45 mins during desk work",
    "Stop eating 2 hours before bed",
    "Coffee/tea: no more than 2/day, never with supplements",
    "Track iron-rich foods during menstrual phase"
  ]
};

// ============================================
// CYCLE PHASES — for period tracker
// Each phase has thyroid + 0-sugar conscious diet tips
// ============================================
const PHASES = {
  menstrual: {
    emoji: "🌑",
    label: "Menstrual",
    color: "#dc2626",
    bg: "#fee2e2",
    description: "Day 1–5 · Period",
    tips: [
      "🩸 Iron-rich: spinach, sesame seeds, dates, beetroot, pomegranate",
      "🌡️ Warm cooked meals — avoid raw/cold foods",
      "🫖 Ginger or fennel tea for cramps",
      "💪 Light workouts only (yoga, walks) — be gentle",
      "🌰 Pumpkin seeds: magnesium for cramps + zinc for thyroid",
      "❌ Avoid caffeine and excess salt (worsens bloating)"
    ]
  },
  follicular: {
    emoji: "🌱",
    label: "Follicular",
    color: "#10b981",
    bg: "#d1fae5",
    description: "Day 6–13 · Energy rising",
    tips: [
      "⚡ Energy peaks — best time for strength training & HIIT",
      "🥚 High protein focus (paneer, dal, sprouts)",
      "🥬 Fermented foods (curd, sprouts) for gut health",
      "🍎 Antioxidants: berries, apples, pomegranate",
      "💧 Hydrate well — supports metabolism",
      "🌿 Great window to push gym intensity"
    ]
  },
  ovulation: {
    emoji: "🌕",
    label: "Ovulation",
    color: "#f59e0b",
    bg: "#fef3c7",
    description: "Day 13–16 · Peak energy",
    tips: [
      "✨ Peak energy — go heavy at gym",
      "🥗 Light, fibrous meals; raw salads OK now (NOT during menstrual)",
      "🌰 Nuts & seeds for magnesium",
      "🍓 Antioxidants: berries, dark leafy greens",
      "💧 Extra hydration",
      "🥒 Cooked cruciferous (broccoli, cabbage) helps estrogen metabolism"
    ]
  },
  luteal: {
    emoji: "🌗",
    label: "Luteal",
    color: "#8b5cf6",
    bg: "#ede9fe",
    description: "Day 17–28 · PMS may begin",
    tips: [
      "🍠 Complex carbs to stabilize mood (oats, sweet potato in moderation)",
      "🥜 Healthy fats: walnuts, almonds, peanut butter",
      "🍌 B6-rich: banana, chickpeas — eases PMS",
      "🧂 Reduce salt to prevent bloating",
      "🍫 Cravings normal — peanut butter / dates (not sugar)",
      "🧘 Lower workout intensity in second half"
    ]
  },
  late: {
    emoji: "⏰",
    label: "Late",
    color: "#6b7280",
    bg: "#f3f4f6",
    description: "Cycle overdue — hypothyroidism often causes irregular periods.",
    tips: [
      "⚠️ Cycles >35 days are common with high TSH — please see an endocrinologist",
      "🧘 Reduce stress (cortisol affects cycles)",
      "🌰 Selenium (Brazil nuts) + zinc (pumpkin seeds) — both critical now",
      "💤 Prioritize 8 hours of sleep",
      "📞 Get TSH, T3, T4 + a gynecologist check if recurring"
    ]
  },
  unknown: {
    emoji: "❓",
    label: "Not tracked yet",
    color: "#6b7280",
    bg: "#f3f4f6",
    description: "Log your last period start date to begin tracking",
    tips: [
      "Tap 'Log Period Start' to begin",
      "Track for 2-3 cycles to see your patterns",
      "Hypothyroidism can cause irregular cycles — tracking helps spot patterns"
    ]
  }
};

// ============================================
// RECIPES LIBRARY
// Format: ingredients = [[item, quantity], ...]
// ============================================
const RECIPES = {
  "moong-dal-chilla": {
    name: "Moong Dal Chilla with Paneer",
    prepAhead: ["Soak ½ cup moong dal in water overnight"],
    ingredients: [
      ["Moong dal (soaked)", "½ cup"],
      ["Paneer (crumbled)", "75 g"],
      ["Green chilli (chopped)", "1"],
      ["Coriander (chopped)", "2 tbsp"],
      ["Ginger (grated)", "½ tsp"],
      ["Cumin", "½ tsp"],
      ["Salt", "to taste"],
      ["Oil", "1 tsp per chilla"]
    ],
    steps: [
      "Drain the soaked moong dal. Grind to a smooth, pourable batter with very little water.",
      "Mix in green chilli, coriander, ginger, cumin and salt. Batter should be like pancake batter.",
      "Heat a non-stick pan on medium. Lightly grease with oil.",
      "Pour a ladleful and spread thin like dosa. Cook 2 mins till edges lift.",
      "Sprinkle crumbled paneer on top, drizzle ½ tsp oil, flip and cook 1 min.",
      "Fold and serve hot with mint chutney."
    ],
    tip: "Add finely chopped onion + spinach to the batter for extra iron — great for menstrual phase."
  },

  "paneer-bhurji": {
    name: "Paneer Bhurji (Low Oil)",
    prepAhead: [],
    ingredients: [
      ["Paneer (crumbled)", "75 g"],
      ["Onion (finely chopped)", "1 small"],
      ["Tomato (chopped)", "1 small"],
      ["Green chilli", "1"],
      ["Ginger-garlic paste", "½ tsp"],
      ["Turmeric", "¼ tsp"],
      ["Red chilli powder", "½ tsp"],
      ["Garam masala", "¼ tsp"],
      ["Coriander leaves", "1 tbsp"],
      ["Oil", "1 tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Heat oil in a pan. Add onion and sauté till translucent (3 mins).",
      "Add ginger-garlic paste and green chilli, sauté 30 sec.",
      "Add tomato, turmeric, chilli powder, salt. Cook till tomato is mushy (3-4 mins).",
      "Add crumbled paneer. Stir well to coat with masala.",
      "Cook 2-3 mins on low — don't overcook (paneer turns rubbery).",
      "Sprinkle garam masala and coriander. Serve hot."
    ],
    tip: "Don't add water — bhurji should be dry and fluffy."
  },

  "besan-chilla": {
    name: "Besan (Chickpea Flour) Chilla",
    prepAhead: [],
    ingredients: [
      ["Besan", "½ cup"],
      ["Onion (chopped)", "2 tbsp"],
      ["Tomato (chopped)", "2 tbsp"],
      ["Capsicum (chopped)", "2 tbsp"],
      ["Spinach (chopped)", "2 tbsp"],
      ["Green chilli", "1"],
      ["Ajwain (carom seeds)", "¼ tsp"],
      ["Turmeric", "¼ tsp"],
      ["Salt", "to taste"],
      ["Water", "as needed"],
      ["Oil", "1 tsp"]
    ],
    steps: [
      "Whisk besan with water to a smooth, pourable batter (no lumps).",
      "Add all chopped veggies, green chilli, ajwain, turmeric, salt. Mix well.",
      "Heat non-stick pan on medium. Grease lightly with oil.",
      "Pour batter and spread into a thin circle.",
      "Cook 2-3 mins till bottom is golden. Flip carefully, cook 1-2 mins.",
      "Serve hot with mint chutney."
    ],
    tip: "Ajwain helps digest besan — don't skip it."
  },

  "oatmeal-bowl": {
    name: "Oatmeal with Milk, Seeds & Fruit",
    prepAhead: [],
    ingredients: [
      ["Rolled oats", "½ cup"],
      ["Milk (or water)", "1 cup"],
      ["Chia seeds", "1 tsp"],
      ["Almonds (chopped)", "5"],
      ["Walnuts", "2"],
      ["Berries / banana", "½ cup"],
      ["Cinnamon", "a pinch"]
    ],
    steps: [
      "Heat milk in a saucepan. Add oats and cook on medium 3-4 mins, stirring.",
      "When thick and creamy, switch off heat.",
      "Transfer to bowl. Top with chia seeds, chopped nuts, fruit, cinnamon."
    ],
    tip: "Use steel-cut oats for slower release energy if available."
  },

  "overnight-oats": {
    name: "Overnight Oats",
    prepAhead: ["Assemble jar tonight: oats + milk/curd + chia + seeds + fruit. Refrigerate."],
    ingredients: [
      ["Rolled oats", "⅓ cup"],
      ["Milk or curd", "½ cup"],
      ["Chia seeds", "1 tsp"],
      ["Flax seeds (ground)", "1 tsp"],
      ["Berries / chopped apple", "¼ cup"],
      ["Almonds (chopped)", "5"],
      ["Cinnamon", "a pinch"]
    ],
    steps: [
      "In a glass jar, layer oats first.",
      "Pour milk (or curd). Stir.",
      "Add chia, flax, cinnamon. Stir well.",
      "Top with fruit and almonds.",
      "Seal and refrigerate overnight (6-8 hrs).",
      "In the morning: stir, eat cold or warm."
    ],
    tip: "Don't sweeten — fruit gives natural sweetness."
  },

  "idli": {
    name: "Idli (Steamed Rice Cakes)",
    prepAhead: ["Use store-bought idli batter, OR ferment homemade batter 8-12 hrs"],
    ingredients: [
      ["Idli batter", "1 cup"],
      ["Oil (for greasing)", "½ tsp"],
      ["Salt", "if not in batter"]
    ],
    steps: [
      "Grease idli plates lightly.",
      "Pour batter into each mould (¾ full).",
      "Steam in idli cooker for 10-12 mins.",
      "Insert toothpick — should come out clean.",
      "Cool 2 mins, scoop out. Serve with sambar + mint chutney."
    ],
    tip: "For instant version: ½ cup semolina + ½ cup curd + ENO."
  },

  "sambar": {
    name: "Quick Sambar",
    prepAhead: [],
    ingredients: [
      ["Toor dal", "½ cup"],
      ["Tamarind paste", "1 tsp"],
      ["Sambar powder", "1 tbsp"],
      ["Mixed veggies (drumstick, carrot, pumpkin)", "1 cup"],
      ["Tomato", "1"],
      ["Mustard seeds", "½ tsp"],
      ["Curry leaves", "8"],
      ["Hing (asafoetida)", "a pinch"],
      ["Oil", "1 tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Pressure cook toor dal with turmeric and water (3 whistles). Mash.",
      "Boil veggies and tomato till soft in another pan.",
      "Add tamarind paste, sambar powder, salt. Simmer 5 mins.",
      "Add mashed dal. Simmer 5 mins.",
      "Heat oil in a small pan. Crackle mustard seeds, curry leaves, hing.",
      "Pour tadka over sambar. Serve hot."
    ]
  },

  "poha": {
    name: "Poha with Peanuts",
    prepAhead: [],
    ingredients: [
      ["Poha (flattened rice)", "1 cup"],
      ["Peanuts", "1 tbsp"],
      ["Onion (chopped)", "1 small"],
      ["Green chilli", "1"],
      ["Curry leaves", "6"],
      ["Mustard seeds", "½ tsp"],
      ["Turmeric", "¼ tsp"],
      ["Oil", "1 tsp"],
      ["Salt", "to taste"],
      ["Lemon", "¼"],
      ["Coriander", "1 tbsp"]
    ],
    steps: [
      "Rinse poha till soft. Drain. Sprinkle salt and turmeric, mix gently.",
      "Heat oil. Add mustard seeds, peanuts, curry leaves. Roast peanuts till crisp.",
      "Add onion and green chilli. Sauté till translucent.",
      "Add rinsed poha. Mix gently for 2-3 mins on low.",
      "Squeeze lemon, garnish with coriander. Serve hot."
    ],
    tip: "Poha is naturally low calorie — don't add too much oil."
  },

  "dal-tadka": {
    name: "Dal Tadka (Toor or Moong)",
    prepAhead: [],
    ingredients: [
      ["Toor / moong dal", "½ cup"],
      ["Turmeric", "¼ tsp"],
      ["Ginger (grated)", "1 tsp"],
      ["Tomato (chopped)", "1"],
      ["Garlic (chopped)", "3 cloves"],
      ["Jeera (cumin)", "½ tsp"],
      ["Dry red chilli", "1"],
      ["Hing", "a pinch"],
      ["Ghee or oil", "1 tsp"],
      ["Salt", "to taste"],
      ["Coriander", "1 tbsp"]
    ],
    steps: [
      "Wash dal. Pressure cook with water, turmeric, ginger and salt (3 whistles).",
      "Once cooked, lightly mash. Add chopped tomato and simmer 5 mins.",
      "Heat ghee in a small pan. Add jeera, garlic, dry chilli, hing. Cook till garlic is golden.",
      "Pour tadka over dal. Garnish with coriander.",
      "Serve with roti or rice."
    ]
  },

  "rajma-curry": {
    name: "Rajma (Kidney Beans) Curry",
    prepAhead: ["Soak ½ cup rajma in plenty of water overnight"],
    ingredients: [
      ["Soaked rajma", "½ cup"],
      ["Onion (chopped)", "1 medium"],
      ["Tomato (puréed)", "2"],
      ["Ginger-garlic paste", "1 tsp"],
      ["Green chilli", "1"],
      ["Turmeric", "¼ tsp"],
      ["Coriander powder", "1 tsp"],
      ["Cumin powder", "½ tsp"],
      ["Garam masala", "½ tsp"],
      ["Kasuri methi", "1 tsp"],
      ["Oil", "1 tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Drain soaked rajma. Pressure cook with fresh water and salt (5-6 whistles, ~25 mins).",
      "Heat oil in a kadhai. Add cumin, then onion. Sauté till golden brown.",
      "Add ginger-garlic paste, green chilli. Cook 1 min.",
      "Add tomato purée, all dry spices. Cook till oil separates (5-6 mins).",
      "Add cooked rajma with its water. Simmer 10-15 mins.",
      "Crush kasuri methi between palms, add. Sprinkle garam masala."
    ],
    tip: "The longer you simmer, the better the flavour. Aim for 15+ mins after adding rajma."
  },

  "chole-curry": {
    name: "Chole (Chickpea Curry)",
    prepAhead: ["Soak ½ cup chole in plenty of water overnight"],
    ingredients: [
      ["Soaked chole", "½ cup"],
      ["Onion (chopped)", "1 medium"],
      ["Tomato (puréed)", "2"],
      ["Ginger-garlic paste", "1 tsp"],
      ["Green chilli", "1"],
      ["Chana masala", "1 tbsp"],
      ["Turmeric", "¼ tsp"],
      ["Cumin", "½ tsp"],
      ["Tea bag (optional, for colour)", "1"],
      ["Oil", "1 tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Drain chole. Pressure cook with water, salt and a tea bag — 5-6 whistles.",
      "Discard tea bag. Reserve cooking water.",
      "Heat oil. Add cumin, then onion. Sauté till golden.",
      "Add ginger-garlic paste, green chilli. Cook 1 min.",
      "Add tomato purée, all dry spices. Cook 5 mins till oil separates.",
      "Add cooked chole with water. Simmer 10 mins.",
      "Mash some chole to thicken. Serve with rice or roti."
    ]
  },

  "paneer-curry": {
    name: "Paneer Curry (Onion-Tomato Gravy)",
    prepAhead: [],
    ingredients: [
      ["Paneer (cubed)", "100 g"],
      ["Onion (puréed)", "1 medium"],
      ["Tomato (puréed)", "2"],
      ["Ginger-garlic paste", "1 tsp"],
      ["Cashew paste (optional)", "1 tbsp"],
      ["Turmeric", "¼ tsp"],
      ["Red chilli powder", "½ tsp"],
      ["Coriander powder", "1 tsp"],
      ["Garam masala", "½ tsp"],
      ["Kasuri methi", "1 tsp"],
      ["Oil", "1 tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Heat oil in a pan. Add onion purée. Cook 5-6 mins till golden.",
      "Add ginger-garlic paste, cook 1 min.",
      "Add tomato purée, all dry spices. Cook till oil separates (6-7 mins).",
      "Add cashew paste (if using) for richness. Mix well.",
      "Add ½ cup water, simmer 3 mins.",
      "Add paneer cubes. Simmer 2-3 mins.",
      "Crush kasuri methi, sprinkle. Serve hot with roti."
    ],
    tip: "For softer paneer, soak cubes in warm salted water for 10 mins before adding."
  },

  "paneer-sabzi": {
    name: "Paneer Sabzi (Dry)",
    prepAhead: [],
    ingredients: [
      ["Paneer (cubed)", "75 g"],
      ["Capsicum (cubed)", "1 small"],
      ["Onion (cubed)", "1 small"],
      ["Tomato (chopped)", "1"],
      ["Ginger-garlic paste", "½ tsp"],
      ["Turmeric", "¼ tsp"],
      ["Red chilli powder", "½ tsp"],
      ["Cumin", "½ tsp"],
      ["Coriander powder", "½ tsp"],
      ["Garam masala", "¼ tsp"],
      ["Oil", "1 tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Heat oil. Add cumin, then onion. Sauté till translucent.",
      "Add ginger-garlic paste. Cook 30 sec.",
      "Add tomato + all dry spices. Cook till mushy (3 mins).",
      "Add capsicum. Cook 2-3 mins (keep slightly crunchy).",
      "Add paneer. Toss gently to coat. Cook 1-2 mins.",
      "Sprinkle garam masala. Serve."
    ]
  },

  "veg-khichdi": {
    name: "Vegetable Khichdi",
    prepAhead: [],
    ingredients: [
      ["Rice", "¼ cup"],
      ["Moong dal (yellow)", "¼ cup"],
      ["Mixed veggies (carrot, peas, beans)", "1 cup"],
      ["Ginger (grated)", "1 tsp"],
      ["Turmeric", "¼ tsp"],
      ["Cumin", "½ tsp"],
      ["Hing", "a pinch"],
      ["Ghee", "1 tsp"],
      ["Water", "2 cups"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Wash rice and dal together. Drain.",
      "Heat ghee in pressure cooker. Add cumin, hing, ginger.",
      "Add veggies, sauté 2 mins.",
      "Add rice, dal, turmeric, salt, water. Mix.",
      "Pressure cook 3 whistles. Let pressure release naturally.",
      "Fluff gently and serve hot with curd."
    ],
    tip: "Khichdi is comfort food + perfect post-workout + great for menstrual phase."
  },

  "moong-dal-soup": {
    name: "Moong Dal Soup",
    prepAhead: [],
    ingredients: [
      ["Yellow moong dal", "½ cup"],
      ["Garlic (chopped)", "3 cloves"],
      ["Ginger (grated)", "1 tsp"],
      ["Tomato", "1"],
      ["Turmeric", "¼ tsp"],
      ["Black pepper", "½ tsp"],
      ["Cumin", "½ tsp"],
      ["Ghee", "1 tsp"],
      ["Lemon", "½"],
      ["Coriander", "1 tbsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Pressure cook dal with water, turmeric, salt, tomato (3 whistles).",
      "Blend lightly with a hand-blender for a smoother soup.",
      "Heat ghee, add cumin, garlic, ginger. Sauté till fragrant.",
      "Add tadka to dal. Simmer 5 mins.",
      "Add black pepper, squeeze lemon. Garnish with coriander.",
      "Sip warm."
    ]
  },

  "clear-veg-soup": {
    name: "Clear Vegetable Soup",
    prepAhead: [],
    ingredients: [
      ["Carrot (diced)", "½ cup"],
      ["Cabbage (cooked, NOT raw — for thyroid)", "½ cup"],
      ["Beans (chopped)", "¼ cup"],
      ["Capsicum", "¼ cup"],
      ["Garlic (chopped)", "3 cloves"],
      ["Ginger (grated)", "1 tsp"],
      ["Black pepper", "½ tsp"],
      ["Vegetable stock or water", "3 cups"],
      ["Salt", "to taste"],
      ["Lemon", "¼"]
    ],
    steps: [
      "Heat 1 tsp oil. Add garlic and ginger, sauté 30 sec.",
      "Add all veggies. Stir for 2 mins.",
      "Pour stock/water, add salt and pepper.",
      "Bring to boil, then simmer 8-10 mins till veggies are tender.",
      "Squeeze lemon. Serve hot."
    ]
  },

  "paneer-salad-bowl": {
    name: "Grilled Paneer Salad Bowl",
    prepAhead: [],
    ingredients: [
      ["Paneer (cubed)", "75 g"],
      ["Cucumber (chopped)", "½ cup"],
      ["Tomato (chopped)", "½ cup"],
      ["Bell pepper (chopped)", "½ cup"],
      ["Onion (sliced)", "¼"],
      ["Olive oil", "1 tsp"],
      ["Lemon juice", "1 tbsp"],
      ["Black pepper", "½ tsp"],
      ["Chaat masala", "½ tsp"],
      ["Mint leaves", "few"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Marinate paneer cubes in salt, pepper and ½ tsp olive oil for 5 mins.",
      "Heat a grill pan. Grill paneer 1-2 mins each side till golden.",
      "In a bowl, combine all chopped veggies.",
      "Add olive oil, lemon, pepper, chaat masala, salt. Toss.",
      "Top with grilled paneer cubes and mint. Serve."
    ]
  },

  "stir-fry-veggies": {
    name: "Mixed Veggie Stir-Fry",
    prepAhead: [],
    ingredients: [
      ["Bell peppers (sliced)", "1 cup"],
      ["Carrot (julienned)", "½ cup"],
      ["Beans (chopped)", "½ cup"],
      ["Mushrooms (sliced)", "½ cup"],
      ["Cooked broccoli (NOT raw — thyroid)", "½ cup"],
      ["Garlic (chopped)", "3 cloves"],
      ["Soy sauce (low sodium)", "1 tsp"],
      ["Chilli flakes", "½ tsp"],
      ["Sesame oil", "1 tsp"],
      ["Salt & pepper", "to taste"]
    ],
    steps: [
      "Heat sesame oil on high in a wok.",
      "Add garlic, sauté 20 sec.",
      "Add hardest veggies first (carrot, beans). Toss 2 mins.",
      "Add bell peppers, mushrooms, broccoli. Toss 2-3 mins on high.",
      "Add soy sauce, chilli flakes, salt, pepper. Toss 30 sec.",
      "Serve immediately."
    ]
  },

  "grilled-paneer": {
    name: "Grilled Paneer",
    prepAhead: [],
    ingredients: [
      ["Paneer (thick slices)", "75 g"],
      ["Curd (for marinade)", "2 tbsp"],
      ["Ginger-garlic paste", "½ tsp"],
      ["Tandoori or chaat masala", "1 tsp"],
      ["Red chilli powder", "½ tsp"],
      ["Olive oil", "½ tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Mix curd, ginger-garlic paste, masala, salt into marinade.",
      "Coat paneer slices well. Rest 15 mins.",
      "Heat grill pan with ½ tsp oil.",
      "Grill paneer 1-2 mins each side till golden marks appear.",
      "Squeeze lemon, sprinkle chaat masala. Serve."
    ]
  },

  "sauteed-veggies": {
    name: "Sautéed Mixed Veggies",
    prepAhead: [],
    ingredients: [
      ["Zucchini / pumpkin / bottle gourd", "1 cup"],
      ["Capsicum (mixed colours)", "½ cup"],
      ["Spinach", "1 cup"],
      ["Garlic", "3 cloves"],
      ["Cumin", "½ tsp"],
      ["Black pepper", "½ tsp"],
      ["Olive oil", "1 tsp"],
      ["Salt", "to taste"]
    ],
    steps: [
      "Heat olive oil. Add cumin and chopped garlic.",
      "Add chopped zucchini/pumpkin. Sauté 4-5 mins.",
      "Add capsicum. Cook 2 mins.",
      "Add spinach. Wilt for 1 min.",
      "Salt, pepper, finish. Serve."
    ]
  },

  "sprouts-chaat": {
    name: "Sprouts Chaat (Steamed)",
    prepAhead: [
      "Day 1: Soak ½ cup moong / chana in water 8 hrs.",
      "Day 2: Drain, tie in damp muslin cloth, leave in warm spot 12-24 hrs.",
      "Store in fridge up to 3 days."
    ],
    ingredients: [
      ["Sprouts (moong / mixed)", "1 cup"],
      ["Onion (finely chopped)", "2 tbsp"],
      ["Tomato (chopped)", "2 tbsp"],
      ["Cucumber (chopped)", "2 tbsp"],
      ["Green chilli", "½"],
      ["Lemon juice", "1 tbsp"],
      ["Chaat masala", "½ tsp"],
      ["Black salt", "¼ tsp"],
      ["Coriander", "1 tbsp"],
      ["Pomegranate seeds", "2 tbsp"]
    ],
    steps: [
      "Steam sprouts 5 mins for easier digestion (especially for thyroid).",
      "Let cool slightly. Mix everything in a bowl.",
      "Adjust lemon and chaat masala to taste."
    ],
    tip: "Steaming kills bacterial risk and is easier on the gut. Prefer steamed over raw."
  },

  "curd-bowl": {
    name: "Optimised Curd Bowl",
    prepAhead: [],
    ingredients: [
      ["Curd (low fat)", "200 g"],
      ["Apple / papaya / guava / pomegranate", "1 small serving"],
      ["Chia seeds", "1 tsp"],
      ["Flax seeds (ground)", "1 tsp"],
      ["Pumpkin seeds", "1 tsp"],
      ["Almonds (chopped)", "5"],
      ["Walnuts", "2"],
      ["Rolled oats (raw or roasted)", "2 tbsp"],
      ["Cinnamon", "a pinch"]
    ],
    steps: [
      "Whisk curd in a bowl till smooth.",
      "Add chopped fruit, seeds, nuts, oats.",
      "Sprinkle cinnamon. Mix and eat fresh."
    ],
    tip: "Avoid: sugar, honey, jaggery, sweetened granola."
  },

  "roasted-makhana": {
    name: "Roasted Makhana (Fox Nuts)",
    prepAhead: [],
    ingredients: [
      ["Makhana", "1 cup"],
      ["Ghee", "½ tsp"],
      ["Black pepper", "¼ tsp"],
      ["Pink salt", "¼ tsp"],
      ["Turmeric", "a pinch"]
    ],
    steps: [
      "Heat ghee in a pan on low.",
      "Add makhana. Roast on LOW heat 8-10 mins, stirring constantly, till crisp.",
      "Sprinkle pepper, salt, turmeric. Toss well.",
      "Cool and store in airtight jar (up to 5 days)."
    ],
    tip: "Roast a big batch on Sunday — snack-ready all week."
  },

  "mint-chutney": {
    name: "Mint-Coriander Chutney",
    prepAhead: [],
    ingredients: [
      ["Fresh mint leaves", "1 cup"],
      ["Coriander leaves", "1 cup"],
      ["Green chilli", "1-2"],
      ["Ginger", "1 inch"],
      ["Lemon juice", "1 tbsp"],
      ["Salt", "to taste"],
      ["Roasted jeera powder", "½ tsp"]
    ],
    steps: [
      "Wash mint and coriander well.",
      "Blend everything with 2-3 tbsp water to a smooth paste.",
      "Taste, adjust lemon and salt.",
      "Store in fridge up to 4 days."
    ],
    tip: "Make a batch on Sunday — use all week with chillas and snacks."
  },

  "upma": {
    name: "Sooji Upma with Peanuts",
    prepAhead: [],
    ingredients: [
      ["Sooji (semolina)", "½ cup"],
      ["Peanuts", "1 tbsp"],
      ["Onion (chopped)", "1 small"],
      ["Veggies (carrot, peas, beans)", "½ cup"],
      ["Mustard seeds", "½ tsp"],
      ["Curry leaves", "6"],
      ["Green chilli", "1"],
      ["Ginger (grated)", "½ tsp"],
      ["Oil", "1 tsp"],
      ["Water", "1¼ cups"],
      ["Salt", "to taste"],
      ["Lemon", "¼ for finishing"]
    ],
    steps: [
      "Dry-roast sooji on low till slightly golden (3 mins). Set aside.",
      "Heat oil. Add mustard seeds, curry leaves, peanuts. Roast peanuts till crisp.",
      "Add onion, green chilli, ginger. Sauté 2 mins.",
      "Add veggies and salt. Cook 3 mins.",
      "Pour in water, bring to boil.",
      "Slowly add sooji while stirring (to avoid lumps).",
      "Cover and cook 2 mins on low. Squeeze lemon. Serve hot."
    ]
  }
};

// ============================================
// WEEKLY PLAN — Mahima only (single food field per slot)
// ============================================
const WEEKLY_PLAN = {
  Monday: {
    theme: "Push Day 💪 (Chest/Shoulders)",
    seed: "Pumpkin seeds",
    slots: [
      { time: "6:00 AM", type: "wake", title: "Wake-up", food: "Warm water + jeera (cumin) water" },
      { time: "6:45 AM", type: "preworkout", title: "Pre-Workout", food: "1 banana + 5 soaked almonds" },
      { time: "8:15 AM", type: "breakfast", title: "Breakfast",
        food: "2 moong dal chilla with paneer (75g) stuffing + mint chutney",
        recipes: ["moong-dal-chilla", "mint-chutney"] },
      { time: "11:30 AM", type: "snack", title: "Mid-Morning", food: "Coconut water + 1 apple" },
      { time: "1:30 PM", type: "lunch", title: "Lunch",
        food: "1 roti + ½ cup dal + paneer sabzi (75g) + cucumber salad",
        recipes: ["dal-tadka", "paneer-sabzi"] },
      { time: "5:00 PM", type: "snack", title: "Evening Snack",
        food: "Curd bowl: 200g curd + apple + seeds + 5 almonds + 2 tbsp oats",
        recipes: ["curd-bowl"] },
      { time: "8:00 PM", type: "dinner", title: "Dinner",
        food: "Stir-fry veggies + grilled paneer (75g) + clear veg soup",
        recipes: ["stir-fry-veggies", "grilled-paneer", "clear-veg-soup"] },
      { time: "9:30 PM", type: "walk", title: "Night Walk", food: "15-20 min easy walk" }
    ]
  },
  Tuesday: {
    theme: "Pull Day 💪 (Back/Biceps)",
    seed: "Flax seeds",
    slots: [
      { time: "6:00 AM", type: "wake", title: "Wake-up", food: "Warm lemon water" },
      { time: "6:45 AM", type: "preworkout", title: "Pre-Workout", food: "1 banana + 5 almonds" },
      { time: "8:15 AM", type: "breakfast", title: "Breakfast",
        food: "Paneer bhurji (75g) + 1 multigrain toast + cucumber slices",
        recipes: ["paneer-bhurji"] },
      { time: "11:30 AM", type: "snack", title: "Mid-Morning", food: "1 guava + 1 tbsp pumpkin seeds" },
      { time: "1:30 PM", type: "lunch", title: "Lunch",
        food: "Rajma (½ cup) + small rice (½ cup) + salad",
        recipes: ["rajma-curry"] },
      { time: "5:00 PM", type: "snack", title: "Evening Snack", food: "1 apple + 1 tsp peanut butter" },
      { time: "8:00 PM", type: "dinner", title: "Dinner",
        food: "Paneer curry (better than soya for thyroid) + sautéed veggies",
        recipes: ["paneer-curry", "sauteed-veggies"] },
      { time: "9:30 PM", type: "walk", title: "Night Walk", food: "15-20 min easy walk" }
    ]
  },
  Wednesday: {
    theme: "Active Recovery / Legs 🦵",
    seed: "Sunflower seeds",
    slots: [
      { time: "6:00 AM", type: "wake", title: "Wake-up", food: "Warm water" },
      { time: "6:45 AM", type: "preworkout", title: "Pre-Workout", food: "2 dates + 3 almonds" },
      { time: "8:15 AM", type: "breakfast", title: "Breakfast",
        food: "Oats (½ cup) cooked in milk + chia + 5 almonds + berries",
        recipes: ["oatmeal-bowl"] },
      { time: "11:30 AM", type: "snack", title: "Mid-Morning", food: "Papaya bowl" },
      { time: "1:30 PM", type: "lunch", title: "Lunch",
        food: "1 roti + chole (½ cup) + salad",
        recipes: ["chole-curry"] },
      { time: "5:00 PM", type: "snack", title: "Evening Snack",
        food: "Sprouts chaat (steamed for thyroid-friendly)",
        recipes: ["sprouts-chaat"] },
      { time: "8:00 PM", type: "dinner", title: "Dinner",
        food: "Paneer salad bowl + veg soup",
        recipes: ["paneer-salad-bowl", "clear-veg-soup"] },
      { time: "9:30 PM", type: "walk", title: "Night Walk", food: "20 min walk" }
    ]
  },
  Thursday: {
    theme: "Push Day 💪 (Chest/Triceps)",
    seed: "Pumpkin seeds",
    slots: [
      { time: "6:00 AM", type: "wake", title: "Wake-up", food: "Jeera or fennel water" },
      { time: "6:45 AM", type: "preworkout", title: "Pre-Workout", food: "1 banana + 5 almonds" },
      { time: "8:15 AM", type: "breakfast", title: "Breakfast",
        food: "Besan chilla (with veggies) + paneer cubes (50g) + mint chutney",
        recipes: ["besan-chilla", "mint-chutney"] },
      { time: "11:30 AM", type: "snack", title: "Mid-Morning", food: "Coconut water + 1 orange" },
      { time: "1:30 PM", type: "lunch", title: "Lunch",
        food: "Paneer curry (75g) + 1 roti + salad",
        recipes: ["paneer-curry"] },
      { time: "5:00 PM", type: "snack", title: "Evening Snack",
        food: "Roasted makhana (1 cup) + green tea",
        recipes: ["roasted-makhana"] },
      { time: "8:00 PM", type: "dinner", title: "Dinner",
        food: "Grilled paneer (avoid tofu — better for thyroid) + sautéed veggies",
        recipes: ["grilled-paneer", "sauteed-veggies"] },
      { time: "9:30 PM", type: "walk", title: "Night Walk", food: "15-20 min walk" }
    ]
  },
  Friday: {
    theme: "Pull Day 💪 (Back/Arms)",
    seed: "Flax seeds",
    slots: [
      { time: "6:00 AM", type: "wake", title: "Wake-up", food: "Warm lemon water" },
      { time: "6:45 AM", type: "preworkout", title: "Pre-Workout", food: "2 dates + 5 almonds" },
      { time: "8:15 AM", type: "breakfast", title: "Breakfast",
        food: "2 idli + sambar + paneer cubes (50g)",
        recipes: ["idli", "sambar"] },
      { time: "11:30 AM", type: "snack", title: "Mid-Morning", food: "Watermelon or papaya bowl" },
      { time: "1:30 PM", type: "lunch", title: "Lunch",
        food: "Paneer bhurji + small roti + salad",
        recipes: ["paneer-bhurji"] },
      { time: "5:00 PM", type: "snack", title: "Evening Snack",
        food: "Curd bowl (200g) + seeds + fruit",
        recipes: ["curd-bowl"] },
      { time: "8:00 PM", type: "dinner", title: "Dinner",
        food: "Small khichdi + veg soup",
        recipes: ["veg-khichdi", "clear-veg-soup"] },
      { time: "9:30 PM", type: "walk", title: "Night Walk", food: "20 min walk" }
    ]
  },
  Saturday: {
    theme: "Rest or Active Day 🚶",
    seed: "Watermelon seeds (or mixed)",
    slots: [
      { time: "6:30 AM", type: "wake", title: "Wake-up", food: "Lemon water + chia" },
      { time: "7:00 AM", type: "preworkout", title: "Pre-Workout (if gym)", food: "1 banana" },
      { time: "8:30 AM", type: "breakfast", title: "Breakfast",
        food: "Overnight oats + chia + berries + 5 almonds",
        recipes: ["overnight-oats"] },
      { time: "11:30 AM", type: "snack", title: "Mid-Morning", food: "Fruit bowl (papaya + apple + pomegranate)" },
      { time: "1:30 PM", type: "lunch", title: "Lunch",
        food: "Paneer (75g) + veggies + 1 roti",
        recipes: ["paneer-sabzi"] },
      { time: "5:00 PM", type: "snack", title: "Evening Snack",
        food: "Sprouts chaat",
        recipes: ["sprouts-chaat"] },
      { time: "8:00 PM", type: "dinner", title: "Dinner",
        food: "Veg soup + grilled paneer (60g)",
        recipes: ["clear-veg-soup", "grilled-paneer"] },
      { time: "9:30 PM", type: "walk", title: "Night Walk", food: "20-30 min walk" }
    ]
  },
  Sunday: {
    theme: "Rest Day — Clean Comfort 🌿",
    seed: "Mixed seeds",
    slots: [
      { time: "7:00 AM", type: "wake", title: "Wake-up", food: "Warm water + lemon" },
      { time: "8:30 AM", type: "breakfast", title: "Breakfast",
        food: "Poha with peanuts + paneer side (50g)",
        recipes: ["poha"] },
      { time: "11:30 AM", type: "snack", title: "Mid-Morning", food: "Coconut water + apple" },
      { time: "1:30 PM", type: "lunch", title: "Lunch — Home Meal",
        food: "Home food, protein-focused (paneer + dal + 1 roti + salad)",
        recipes: ["paneer-sabzi", "dal-tadka"] },
      { time: "5:00 PM", type: "snack", title: "Evening Snack", food: "Mixed nuts + roasted seeds + herbal tea" },
      { time: "8:00 PM", type: "dinner", title: "Dinner — Light",
        food: "Salad bowl + dal soup",
        recipes: ["moong-dal-soup"] },
      { time: "9:30 PM", type: "walk", title: "Night Walk", food: "Light walk" }
    ]
  }
};

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ============================================
// SHOPPING — daily-use items NOT in recipes
// ============================================
const WEEKLY_ESSENTIALS = [
  { item: 'Bananas',           qty: '6',         cat: 'fruits', note: 'pre-workout' },
  { item: 'Apples',            qty: '5',         cat: 'fruits', note: 'snacks + curd bowl' },
  { item: 'Guava',             qty: '2',         cat: 'fruits' },
  { item: 'Papaya',            qty: '1 medium',  cat: 'fruits' },
  { item: 'Orange',            qty: '2',         cat: 'fruits' },
  { item: 'Pomegranate',       qty: '1',         cat: 'fruits', note: 'iron-rich, great for menstrual phase' },
  { item: 'Berries (mixed)',   qty: '200 g',     cat: 'fruits', note: 'oats topping' },
  { item: 'Watermelon',        qty: '½ small',   cat: 'fruits' },
  { item: 'Dates (medjool)',   qty: '15',        cat: 'fruits', note: 'pre-workout + menstrual iron' },

  { item: 'Almonds',           qty: '200 g',     cat: 'nuts',   note: 'daily + soaked' },
  { item: 'Walnuts',           qty: '100 g',     cat: 'nuts',   note: '2/day' },
  { item: 'Brazil nuts',       qty: '50 g',      cat: 'nuts',   note: '1-2/day — selenium for thyroid' },
  { item: 'Peanuts (raw)',     qty: '100 g',     cat: 'nuts' },
  { item: 'Peanut butter (unsweetened)', qty: '1 small jar', cat: 'nuts' },
  { item: 'Chia seeds',        qty: '100 g',     cat: 'nuts' },
  { item: 'Flax seeds',        qty: '100 g',     cat: 'nuts' },
  { item: 'Pumpkin seeds',     qty: '100 g',     cat: 'nuts',   note: 'zinc for thyroid + magnesium for cramps' },
  { item: 'Sunflower seeds',   qty: '100 g',     cat: 'nuts' },
  { item: 'Sesame seeds',      qty: '50 g',      cat: 'nuts',   note: 'iron for menstrual phase' },
  { item: 'Makhana (fox nuts)',qty: '100 g',     cat: 'nuts' },

  { item: 'Coconut water',     qty: '4 packs',   cat: 'pantry' },
  { item: 'Green tea bags',    qty: '1 pack',    cat: 'pantry' },
  { item: 'Multigrain bread',  qty: '½ loaf',    cat: 'grains' },
  { item: 'Lemons',            qty: '6',         cat: 'vegetables' },
  { item: 'Ginger',            qty: '1 piece',   cat: 'vegetables' },
  { item: 'Garlic',            qty: '2 bulbs',   cat: 'vegetables' },
  { item: 'Salad veggies (cucumber, carrot, onion, tomato)', qty: 'bunch', cat: 'vegetables', note: 'daily salad' },
  { item: 'Spinach (palak)',   qty: '2 bunches', cat: 'vegetables', note: 'iron-rich for cycle' },
];

const CATEGORIES = [
  { id: 'vegetables', label: '🥬 Vegetables', keywords: ['onion','tomato','carrot','capsicum','bell pepper','cucumber','spinach','beans','mushroom','broccoli','cabbage','zucchini','pumpkin','bottle gourd','cauliflower','peas','mint','coriander','ginger','garlic','green chilli','curry leaves','lemon','drumstick','corn','veggies','vegetable','salad','dry red chilli'] },
  { id: 'fruits',     label: '🍎 Fruits',     keywords: ['apple','banana','guava','papaya','orange','pear','pomegranate','berr','watermelon','fruit','date'] },
  { id: 'grains',     label: '🌾 Grains',     keywords: ['rice','roti','oats','sooji','semolina','poha','besan','idli batter','multigrain','wheat','flour','bread'] },
  { id: 'pulses',     label: '🫘 Pulses & Legumes', keywords: ['moong dal','toor dal','urad dal','rajma','chole','chana','chickpea','sprouts','dal','soya'] },
  { id: 'dairy',      label: '🥛 Dairy & Protein', keywords: ['paneer','tofu','curd','milk','cashew paste','egg'] },
  { id: 'nuts',       label: '🌰 Nuts & Seeds', keywords: ['almond','walnut','cashew','peanut','brazil','chia','flax','pumpkin seed','sunflower seed','sesame','watermelon seed','seed','nuts','makhana'] },
  { id: 'spices',     label: '🧂 Spices', keywords: ['salt','turmeric','cumin','jeera','mustard','pepper','chilli powder','coriander powder','garam masala','kasuri methi','chana masala','chole masala','chaat masala','tandoori masala','sambar powder','hing','asafoetida','cinnamon','ajwain','tea bag','black salt'] },
  { id: 'pantry',     label: '🍶 Oils & Pantry', keywords: ['oil','ghee','soy sauce','tamarind','chilli flake','lemon juice','peanut butter','coconut water','green tea','sauce','stock','butter'] },
  { id: 'other',      label: '📦 Other',     keywords: [] }
];

function categorize(itemName) {
  const lower = itemName.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some(kw => lower.includes(kw))) return cat.id;
  }
  return 'other';
}
