import { Product, ProductCategory } from "../types";

/**
 * ============================================================================
 * SANATAN SEVA STORE - PRODUCT INVENTORY CONFIGURATION
 * ============================================================================
 * 
 * HOW TO ADD A NEW PRODUCT (EASY STEP-BY-STEP FOR BEGINNERS):
 * -------------------------------------------------------------
 * 1. Copy one of the product blocks below (from { to },).
 * 2. Paste it at the end of the `products` array before the closing `];`.
 * 3. Update the fields:
 *      - id: A unique number/string (e.g., "17", "18")
 *      - name: The title of your product
 *      - slug: URL-friendly version in lowercase with dashes (e.g., "handmade-brass-bell")
 *      - description: A detailed description of the product
 *      - price: Price in Indian Rupees (₹) as a number without quotes
 *      - originalPrice: (Optional) MRP before discount
 *      - image: Path to the image placed in public/products/ (e.g., "/products/my-item.jpg")
 *      - category: MUST be one of these exact 8 categories:
 *          * "Puja & Devotional"
 *          * "Rudraksha & Malas"
 *          * "Hindu Books"
 *          * "Hindu Symbols"
 *          * "Temple & Home Decor"
 *          * "Sanatan Merchandise"
 *          * "Clothing"
 *          * "Gifts"
 *      - stock: Quantity available in inventory (e.g., 25)
 *      - featured: Set `true` to highlight on store home page, or `false`
 * 
 * 4. Place your image file in the `public/products/` folder with the matching filename.
 * ============================================================================
 */

export const STORE_CATEGORIES: ProductCategory[] = [
  "Puja & Devotional",
  "Rudraksha & Malas",
  "Hindu Books",
  "Hindu Symbols",
  "Temple & Home Decor",
  "Sanatan Merchandise",
  "Clothing",
  "Gifts",
];

export const products: Product[] = [
  // --------------------------------------------------------------------------
  // Category 1: Puja & Devotional
  // --------------------------------------------------------------------------
  {
    id: "1",
    name: "Pure Brass Traditional Akhand Diya",
    slug: "brass-diya",
    description: "Handcrafted pure brass Akhand Diya with borosilicate glass protector for continuous sacred flame during puja, Navratri, and daily worship. Engineered to maintain steady flame for over 24 hours.",
    price: 499,
    originalPrice: 799,
    image: "/products/brass-diya.jpg",
    category: "Puja & Devotional",
    stock: 24,
    featured: true,
    rating: 4.9,
    reviewsCount: 142,
    details: {
      material: "100% Solid Brass with Heat-Resistant Borosilicate Glass",
      dimensions: "14 cm (H) x 9 cm (W)",
      origin: "Moradabad, Uttar Pradesh (Panchal Artisans)",
      consecration: "Cleaned and prepared in traditional Vedic manner",
      includes: ["1x Brass Akhand Diya", "1x Glass Chimney", "10x Cotton Wicks Pack"],
    },
  },
  {
    id: "2",
    name: "Handcrafted Brass Puja Thali Set (7 Pieces)",
    slug: "brass-puja-thali-set",
    description: "Complete 7-piece auspicious brass puja thali engraved with sacred Gayatri Mantra and central Om engraving. Includes diya, agarbatti stand, bell, roli-chawal bowls, and panchamrit loti.",
    price: 1299,
    originalPrice: 1899,
    image: "/products/brass-puja-thali.jpg",
    category: "Puja & Devotional",
    stock: 15,
    featured: true,
    rating: 4.8,
    reviewsCount: 98,
    details: {
      material: "Heavy Gauge Virgin Brass with Intricate Engravings",
      dimensions: "Thali Diameter: 28 cm",
      origin: "Varanasi Craft Cluster",
      includes: ["Thali (28cm)", "Nandi Ghanti", "Dhoop Dan", "Panchpatra with Achmani", "Diya", "2x Katori"],
    },
  },
  {
    id: "3",
    name: "Natural Pure Mysore Sandalwood Chandan Tika",
    slug: "pure-mysore-sandalwood-tika",
    description: "100% pure authentic red & yellow chandan paste roll infused with natural camphor and saffron for daily tilak, meditation, and deity ornamentation.",
    price: 249,
    originalPrice: 350,
    image: "/products/sandalwood-tika.jpg",
    category: "Puja & Devotional",
    stock: 45,
    featured: false,
    rating: 4.9,
    reviewsCount: 64,
    details: {
      material: "Pure Mysore Sandalwood Powder, Kesar, Camphor",
      dimensions: "Net Wt: 50g jar",
      origin: "Mysuru, Karnataka",
      includes: ["Auspicious copper applicator rod", "Sealed glass jar"],
    },
  },
  {
    id: "4",
    name: "Auspicious Dakshinavarti Shankh (Blowing Conch)",
    slug: "dakshinavarti-shankh",
    description: "Natural oceanic blowing conch shell with resonant Vedic sound frequency to purify negative energies and create auspicious vibrations in home and temples.",
    price: 899,
    originalPrice: 1299,
    image: "/products/dakshinavarti-shankh.jpg",
    category: "Puja & Devotional",
    stock: 8,
    featured: false,
    rating: 4.7,
    reviewsCount: 52,
    details: {
      material: "Natural Calcium Conch Shell with carved brass stand",
      dimensions: "Length: 16-18 cm (Natural variation)",
      origin: "Rameshwaram Coast",
      includes: ["Polished Conch", "Ornate Brass Peacock Stand"],
    },
  },

  // --------------------------------------------------------------------------
  // Category 2: Rudraksha & Malas
  // --------------------------------------------------------------------------
  {
    id: "5",
    name: "Original 5 Mukhi Nepal Rudraksha Japa Mala (108+1)",
    slug: "5-mukhi-nepal-rudraksha-mala",
    description: "Lab-certified authentic 5 Mukhi Nepali Rudraksha beads strung in pure silk thread with traditional knots. Ideal for Shiva mantra japa, mental clarity, and blood pressure regulation.",
    price: 799,
    originalPrice: 1200,
    image: "/products/rudraksha-mala.jpg",
    category: "Rudraksha & Malas",
    stock: 30,
    featured: true,
    rating: 5.0,
    reviewsCount: 215,
    details: {
      material: "Authentic Nepali Rudraksha Seeds (8mm size)",
      dimensions: "Total Length approx 85 cm",
      origin: "Pashupatinath foothills, Nepal",
      consecration: "Prana Pratishtha energized with Maha Mrityunjaya mantra",
      includes: ["108+1 Mala", "Laboratory Authenticity Certificate", "Red Velvet Pouch"],
    },
  },
  {
    id: "6",
    name: "Sacred Tulsi Japa Mala with Cow Gomukhi Japa Bag",
    slug: "sacred-tulsi-japa-mala-with-bag",
    description: "Naturally dried Vrindavan Shyam Tulsi wood beads for Hare Krishna and Vishnu mantra recitation, complete with sacred embroidered Gomukhi japa bag.",
    price: 349,
    originalPrice: 499,
    image: "/products/tulsi-mala.jpg",
    category: "Rudraksha & Malas",
    stock: 40,
    featured: false,
    rating: 4.8,
    reviewsCount: 88,
    details: {
      material: "Natural Vrindavan Holy Basil (Tulsi) Wood",
      dimensions: "Bead size 7mm, 108 beads",
      origin: "Vrindavan Dham, Uttar Pradesh",
      includes: ["Tulsi Mala", "Embroidered Cotton Gomukhi Bag"],
    },
  },
  {
    id: "7",
    name: "Spiritual Lal Chandan (Red Sandalwood) Japa Mala",
    slug: "red-sandalwood-mala",
    description: "Smooth polished red sandalwood mala emitting natural cooling fragrance. Known to pacify Mars/Mangal and enhance spiritual focus and willpower.",
    price: 549,
    originalPrice: 850,
    image: "/products/red-sandalwood-mala.jpg",
    category: "Rudraksha & Malas",
    stock: 18,
    featured: false,
    rating: 4.6,
    reviewsCount: 41,
    details: {
      material: "Natural Raktachandan (Red Sandalwood)",
      dimensions: "Bead size 8mm, 108+1 beads",
      origin: "Andhra Pradesh Reserves",
    },
  },

  // --------------------------------------------------------------------------
  // Category 3: Hindu Books
  // --------------------------------------------------------------------------
  {
    id: "8",
    name: "Shrimad Bhagavad Gita - Deluxe Sanskrit & English/Hindi Edition",
    slug: "shrimad-bhagavad-gita-deluxe",
    description: "Complete 700 verses with original Devanagari Sanskrit, word-to-word transliteration, detailed commentary, and golden-embossed hardbound cover with ribbon bookmark.",
    price: 650,
    originalPrice: 950,
    image: "/products/bhagavad-gita.jpg",
    category: "Hindu Books",
    stock: 50,
    featured: true,
    rating: 5.0,
    reviewsCount: 310,
    details: {
      material: "Hardbound Gold Foil Art Paper with Bookmark",
      dimensions: "720 Pages | 22 cm x 15 cm",
      origin: "Sanatan Seva Publications",
      includes: ["Deluxe Book", "Slipcase Box", "Sanskrit Chanting Audio QR"],
    },
  },
  {
    id: "9",
    name: "Ramcharitmanas of Goswami Tulsidas (Deluxe Gutka)",
    slug: "ramcharitmanas-deluxe",
    description: "Sacred Awadhi text with lucid Hindi translation covering all 7 Kaands, Chaupais, Dohas, and Aarti of Shri Ramachandraji. High quality paper designed for daily paath.",
    price: 850,
    originalPrice: 1200,
    image: "/products/ramcharitmanas.jpg",
    category: "Hindu Books",
    stock: 22,
    featured: false,
    rating: 4.9,
    reviewsCount: 124,
    details: {
      material: "Hardcover with Velvet Dust Jacket",
      dimensions: "1050 Pages | Clear Bold Typeface",
      origin: "Ayodhya Dham Press",
    },
  },
  {
    id: "10",
    name: "Vedic Suktas & Stotra Ratnakar (Hardcover)",
    slug: "vedic-suktas-stotra-ratnakar",
    description: "Essential collection of Purusha Suktam, Sri Suktam, Rudram, Durga Saptashati essentials, and Vedic peace prayers with Swara accents and meaning.",
    price: 420,
    originalPrice: 600,
    image: "/products/stotra-ratnakar.jpg",
    category: "Hindu Books",
    stock: 35,
    featured: false,
    rating: 4.8,
    reviewsCount: 77,
  },

  // --------------------------------------------------------------------------
  // Category 4: Hindu Symbols
  // --------------------------------------------------------------------------
  {
    id: "11",
    name: "Sacred Brass Om Wall Hanging with Sun Radiance",
    slug: "brass-om-wall-hanging",
    description: "Majestic brass Surya-Om wall art cast by master metalsmiths. Emits positive solar energy and cosmic peace when mounted at the main entrance or home altar.",
    price: 699,
    originalPrice: 999,
    image: "/products/brass-om-symbol.jpg",
    category: "Hindu Symbols",
    stock: 19,
    featured: true,
    rating: 4.9,
    reviewsCount: 165,
    details: {
      material: "Antiqued Solid Brass with Protective Lacquer",
      dimensions: "Diameter: 22 cm | Weight: 650g",
      origin: "Thanjavur Art Metal Workshop",
      includes: ["Pre-drilled mounting hole", "Auspicious Roli pouch"],
    },
  },
  {
    id: "12",
    name: "Panchdhatu Shri Yantra 3D Meru Prishta (Blessed)",
    slug: "panchdhatu-shri-yantra-meru",
    description: "Sacred 3D pyramid Meru Shri Yantra crafted according to classical Agamic proportions in Panchdhatu alloys. Attracts Maha Lakshmi's prosperity and cosmic alignment.",
    price: 1499,
    originalPrice: 2200,
    image: "/products/shri-yantra.jpg",
    category: "Hindu Symbols",
    stock: 12,
    featured: true,
    rating: 5.0,
    reviewsCount: 89,
    details: {
      material: "Panchdhatu (5 Sacred Metals with 24K Gold Polish)",
      dimensions: "Base: 8cm x 8cm | Height: 7.5cm",
      origin: "Kashi Yantra Guild",
      consecration: "Kanakadhara and Sri Sukta consecrated",
    },
  },
  {
    id: "13",
    name: "Solid Brass Swastik Trishul Damru Toran",
    slug: "swastik-trishul-damru-toran",
    description: "Tri-Shakti protective symbol combining Trishul, Om, and Swastik in solid polished brass. Traditional Vastu remedy for doorway protection.",
    price: 399,
    originalPrice: 599,
    image: "/products/trishul-om-swastik.jpg",
    category: "Hindu Symbols",
    stock: 28,
    featured: false,
    rating: 4.7,
    reviewsCount: 54,
  },

  // --------------------------------------------------------------------------
  // Category 5: Temple & Home Decor
  // --------------------------------------------------------------------------
  {
    id: "14",
    name: "Carved Teakwood Home Mandir Shrine with Brass Bells",
    slug: "teakwood-home-mandir-shrine",
    description: "Compact wall-hanging or tabletop wooden puja temple with hand-carved shikhara dome, bell cutouts, storage drawer for puja items, and warm LED backlight slot.",
    price: 3499,
    originalPrice: 4999,
    image: "/products/teakwood-mandir.jpg",
    category: "Temple & Home Decor",
    stock: 6,
    featured: true,
    rating: 4.9,
    reviewsCount: 44,
    details: {
      material: "Treated Seasoned Teakwood with Brass Bells",
      dimensions: "45 cm (H) x 32 cm (W) x 22 cm (D)",
      origin: "Saharanpur Master Craftsmen",
      includes: ["Assembled Mandir", "Brass hanging bells", "Drawer pull", "Wall fixtures"],
    },
  },
  {
    id: "15",
    name: "Handcrafted Brass Hanging Temple Bell with Chain",
    slug: "brass-hanging-temple-bell",
    description: "Traditional temple bell cast with heavy resonance tuning in ringing frequency to invoke divinity and silence mental agitation during daily aarti.",
    price: 1199,
    originalPrice: 1699,
    image: "/products/hanging-temple-bell.jpg",
    category: "Temple & Home Decor",
    stock: 14,
    featured: false,
    rating: 4.8,
    reviewsCount: 71,
    details: {
      material: "High-Tin Bell Bronze / Brass Alloy",
      dimensions: "Bell 10cm dia, Chain 45cm",
      origin: "Kerala Bell Metal Cluster",
    },
  },
  {
    id: "16",
    name: "Vedic Brass Lotus Urli Bowl for Floating Flowers & Diyas",
    slug: "brass-lotus-urli-bowl",
    description: "Elegant 12-inch floral scalloped brass urli centerpiece. Add water with fresh rose petals and floating tea-lights to bring calm and prosperity to your living space.",
    price: 999,
    originalPrice: 1450,
    image: "/products/lotus-urli-bowl.jpg",
    category: "Temple & Home Decor",
    stock: 20,
    featured: false,
    rating: 4.8,
    reviewsCount: 92,
  },

  // --------------------------------------------------------------------------
  // Category 6: Sanatan Merchandise
  // --------------------------------------------------------------------------
  {
    id: "17",
    name: "Pure Copper 'Satyam Shivam Sundaram' Engraved Water Bottle",
    slug: "copper-water-bottle-sanatan",
    description: "1000ml pure Ayurvedic copper water bottle with leakproof cap and handcrafted Sanskrit mantra laser engraving. Imparts health benefits of Tamra Jal.",
    price: 799,
    originalPrice: 1199,
    image: "/products/copper-bottle.jpg",
    category: "Sanatan Merchandise",
    stock: 35,
    featured: true,
    rating: 4.9,
    reviewsCount: 180,
    details: {
      material: "99.6% Pure Grade-A Copper (Jointless)",
      dimensions: "Capacity: 1000 ml | Height: 26 cm",
      origin: "Mathura Copperworks",
      includes: ["Copper bottle", "Cotton cleaning pouch", "Usage guide for Tamra Jal"],
    },
  },
  {
    id: "18",
    name: "Dharmic Ceramic Mug - 'Dharmo Rakshati Rakshitah'",
    slug: "dharmic-sanskrit-quote-mug",
    description: "Premium matte black & saffron ceramic coffee/tea mug with golden calligraphy of the ancient Mahabharata wisdom 'Dharmo Rakshati Rakshitah'.",
    price: 349,
    originalPrice: 499,
    image: "/products/ceramic-mug-sanskrit.jpg",
    category: "Sanatan Merchandise",
    stock: 40,
    featured: false,
    rating: 4.7,
    reviewsCount: 63,
  },
  {
    id: "19",
    name: "Embroidered Saffron Sanatan Seva Canvas Tote Bag",
    slug: "sanatan-canvas-tote-bag",
    description: "Eco-friendly heavy-duty 100% organic cotton tote bag with embroidered golden Lotus and Trust insignia. Spacious enough for books, puja items, and daily use.",
    price: 299,
    originalPrice: 450,
    image: "/products/sanatan-tote-bag.jpg",
    category: "Sanatan Merchandise",
    stock: 50,
    featured: false,
    rating: 4.8,
    reviewsCount: 51,
  },

  // --------------------------------------------------------------------------
  // Category 7: Clothing
  // --------------------------------------------------------------------------
  {
    id: "20",
    name: "Pure Khadi Cotton 'Ram Naam' Pitambar Angavastram / Dupatta",
    slug: "khadi-ram-naam-angavastram",
    description: "Handspun saffron khadi shawl adorned with auspicious Ram-Naam prints and golden border tassels. Perfect for temple visits, Havans, and festive occasions.",
    price: 499,
    originalPrice: 750,
    image: "/products/angavastram-shawl.jpg",
    category: "Clothing",
    stock: 25,
    featured: true,
    rating: 4.9,
    reviewsCount: 112,
    details: {
      material: "100% Handwoven Certified Khadi Cotton",
      dimensions: "Length 2.2 meters x Width 1.1 meters",
      origin: "Varanasi Weavers Cooperative",
    },
  },
  {
    id: "21",
    name: "Traditional Silk-Blend Dhoti Kurta Set with Gold Zari Border",
    slug: "traditional-dhoti-kurta-set",
    description: "Classic raw-silk blend ivory kurta paired with readymade pleated pocket dhoti trimmed in temple gold zari. Breathable, comfortable, and regal for rituals.",
    price: 1899,
    originalPrice: 2899,
    image: "/products/dhoti-kurta-set.jpg",
    category: "Clothing",
    stock: 16,
    featured: false,
    rating: 4.8,
    reviewsCount: 47,
  },
  {
    id: "22",
    name: "Pure Cotton Saffron Yoga & Meditation Kurta",
    slug: "cotton-saffron-meditation-kurta",
    description: "Relaxed-fit pure breathable cotton short kurta in auspicious Kesariya saffron color. Designed for unrestrained yoga postures, pranayama, and temple seva.",
    price: 699,
    originalPrice: 999,
    image: "/products/saffron-kurta.jpg",
    category: "Clothing",
    stock: 32,
    featured: false,
    rating: 4.7,
    reviewsCount: 58,
  },

  // --------------------------------------------------------------------------
  // Category 8: Gifts
  // --------------------------------------------------------------------------
  {
    id: "23",
    name: "Auspicious Laxmi-Ganesh Silver Plated Devotional Gift Box",
    slug: "laxmi-ganesh-silver-gift-box",
    description: "Exquisite silver-plated murtis of Lord Ganesha and Goddess Lakshmi enclosed in a royal velvet presentation box with an authentic coin and certificate. Ideal for housewarmings and Diwali.",
    price: 1299,
    originalPrice: 1999,
    image: "/products/laxmi-ganesh-box.jpg",
    category: "Gifts",
    stock: 20,
    featured: true,
    rating: 5.0,
    reviewsCount: 154,
    details: {
      material: "999 Pure Silver Micron Plating on Polyresin base",
      dimensions: "Box: 22 cm x 14 cm x 8 cm",
      origin: "Jaipur Silver Craft",
      includes: ["Silver Plated Murtis", "Velvet Hardcover Box", "Silver Polish Cloth", "Shubh Labh Gift Card"],
    },
  },
  {
    id: "24",
    name: "Divya Dhoop & Guggal Herbal Incense Cones Luxury Gift Pack",
    slug: "divya-dhoop-guggal-luxury-gift-pack",
    description: "Charcoal-free natural temple dhoop crafted with Desi Gir cow ghee, Sambrani, Guggal, and sacred herbs. Produces rich temple aroma for daily peace.",
    price: 399,
    originalPrice: 599,
    image: "/products/dhoop-gift-box.jpg",
    category: "Gifts",
    stock: 60,
    featured: false,
    rating: 4.9,
    reviewsCount: 88,
  },
  {
    id: "25",
    name: "Spiritual Samhita Seva Gift Hamper (Mala, Diya, Gita, Dhoop)",
    slug: "sanatan-spiritual-gift-hamper",
    description: "The complete Sanatan Seva starter hamper containing pure brass diya, 5-Mukhi Rudraksha mala, mini Bhagavad Gita, Mysore chandan, and cow-ghee dhoop in handcrafted pinewood gift crate.",
    price: 2199,
    originalPrice: 3200,
    image: "/products/spiritual-gift-hamper.jpg",
    category: "Gifts",
    stock: 12,
    featured: true,
    rating: 5.0,
    reviewsCount: 76,
    details: {
      material: "Handcrafted Wooden Box + Sacred Devotional Artifacts",
      dimensions: "Box 30cm x 24cm x 12cm",
      includes: ["Akhand Diya", "Rudraksha Mala", "Pocket Gita", "Mysore Chandan", "Dhoop Sticks", "Greeting Card"],
    },
  },
];
