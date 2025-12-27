import { Hotel } from '../types';

const STANDARD_AGE_POLICIES = [
  { name: "Infant", minAge: 0, maxAge: 1.99, greenTax: true, transferChargeable: false, mealChargeable: false, bedChargeable: false },
  { name: "Child", minAge: 2, maxAge: 11.99, greenTax: true, transferChargeable: true, mealChargeable: true, bedChargeable: true },
  { name: "Adult", minAge: 12, maxAge: 99, greenTax: true, transferChargeable: true, mealChargeable: true, bedChargeable: true }
];

const STANDARD_GUESTHOUSE_RULES = {
  singleReduction: 0,
  extraAdultSupplement: 0,
  extraChildSupplement: 0,
  greenTaxPerNight: 6,
  serviceChargePercent: 10,
  tgstPercent: 17,
  agePolicies: STANDARD_AGE_POLICIES,
  occasions: []
};

const TRITON_SISTER_BOOKING = {
  whatsapp: '9607901240',
  bookingEmail: 'info@tritonhotelsandtours.com',
};

const TRITON_SISTER_RULES = {
  singleReduction: 0,
  extraAdultSupplement: 0,
  extraChildSupplement: 0,
  greenTaxPerNight: 0, // Included in rates
  serviceChargePercent: 0,
  tgstPercent: 0,
  agePolicies: STANDARD_AGE_POLICIES,
  occasions: [
    { id: 'xmas', date: '12-24', name: 'Christmas Eve Gala', adultSupplement: 50, childSupplement: 25, optional: true },
    { id: 'nye', date: '12-31', name: 'New Year Eve Gala', adultSupplement: 75, childSupplement: 35, optional: true }
  ]
};

const TRITON_SISTER_MEAL_PLANS = [
  { id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 },
  { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 10 },
  { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 18 }
];

const TRITON_SISTER_TRANSFERS = [
  { id: 'no-transfer', name: 'I will book my own transfer', adultRate: 0, childRate: 0, infantRate: 0 },
  { id: 'speedboat-rt', name: 'Speedboat Transfer (Return)', adultRate: 60, childRate: 30, infantRate: 0 }
];

const SANDS_HOTELS_COMMON = {
  logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Sands_hotel.png?v=1766080310',
  bookingEmail: 'res@sandshotelmaldives.com',
  whatsapp: '9607706819',
  tieredOffers: [
    { minNights: 4, discountPercentage: 5 },
    { minNights: 7, discountPercentage: 10 }
  ],
  rules: {
    singleReduction: 0,
    extraAdultSupplement: 0,
    extraChildSupplement: 0,
    greenTaxPerNight: 0, // Included
    serviceChargePercent: 0,
    tgstPercent: 0,
    agePolicies: STANDARD_AGE_POLICIES,
    minStayPolicies: [{ start: '12-24', end: '01-01', nights: 4 }],
    occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Dinner', adultSupplement: 20, childSupplement: 10 }]
  },
  mealPlans: [
    { id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 },
    { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 8 },
    { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 15 }
  ],
  transfers: [
    { id: 'no-transfer', name: 'I will book my own transfer', adultRate: 0, childRate: 0, infantRate: 0 },
    { id: 'speedboat-rt', name: 'Speedboat Transfer (Return)', adultRate: 70, childRate: 70, infantRate: 0 }
  ]
};

const FOLLOWER_OFFER_BASE = {
  roomTypes: ['Standard Room'],
  seasons: [],
  mealPlans: [],
  transfers: [],
  promoCode: 'Living The Globe',
  rules: { ...STANDARD_GUESTHOUSE_RULES }
};

export const HOTELS: Hotel[] = [
  // --- DIRECT FOLLOWER OFFERS ---
  { 
    id: 'luau-beach-fulidhoo', 
    ...FOLLOWER_OFFER_BASE, 
    name: 'Luau Beach Inn', 
    island: 'Fulidhoo', 
    atoll: 'Vaavu Atoll', 
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Luau_Beach_inn_Fulidhoo.png?v=1766835286', 
    specialOffer: '10%-15% OFF', 
    websiteUrl: 'https://www.luaubeachinnmaldives.com/', 
    promoCode: 'TTG00924' 
  },
  { id: 'alesara-thoddoo', name: 'AleSara Guesthouse', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Alesara_guesthouse_Thoddoo.jpg?v=1766841519', specialOffer: '15% OFF', whatsapp: '9607416222', ...FOLLOWER_OFFER_BASE },
  { id: 'beach-stone-gulhi', name: 'Beach Stone Guesthouse', island: 'Gulhi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Beach_Stone_Gulhi.jpg?v=1765981563', specialOffer: '10% OFF', whatsapp: '9607358899', ...FOLLOWER_OFFER_BASE },
  { id: 'sandy-heaven-gulhi', name: 'Sandy Heaven', island: 'Gulhi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Sandy_Heaven_Gulhi.png?v=1765982104', specialOffer: '15% OFF', whatsapp: '9609113288', ...FOLLOWER_OFFER_BASE, promoCode: 'SHM-1090' },
  { id: 'aimi-beach-gulhi', name: 'Aimi Beach', island: 'Gulhi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Aimi_Beach_Gulhi.webp?v=1765982400', specialOffer: '10% OFF', whatsapp: '9607772052', ...FOLLOWER_OFFER_BASE },
  { id: 'pearlshine-boutique-gulhi', name: 'Pearlshine Boutique', island: 'Gulhi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Pearlshine_Boutique_Gulhi.jpg?v=1765982633', specialOffer: '10% OFF', whatsapp: '9607373292', ...FOLLOWER_OFFER_BASE },
  { id: 'beachwalk-villa-gulhi', name: 'Beachwalk Villa', island: 'Gulhi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Beach_Walk_Villa_Gulhi.png?v=1765983332', whatsapp: '9609416465', ...FOLLOWER_OFFER_BASE, tieredOffers: [{ minNights: 1, maxNights: 2, discountPercentage: 10 }, { minNights: 3, discountPercentage: 15 }] },
  { id: 'kaani-hotels-maafushi', name: 'Kaani Hotels', island: 'Maafushi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/kaani_hotels_Maafushi.png?v=1765983569', specialOffer: '10% OFF', whatsapp: '9607988553', bookingEmail: 'reservations2@kaanimaldives.com', ...FOLLOWER_OFFER_BASE, promoCode: 'KH/3626-LivingtheGlobe' },
  { id: 'whiteshell-maafushi', name: 'Whiteshell Island and Spa', island: 'Maafushi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Whiteshel_Maafushi.png?v=1765983707', specialOffer: '15% OFF', whatsapp: '9609898772', ...FOLLOWER_OFFER_BASE },
  { id: 'maamadi-boutique-maafushi', name: 'Maamadi Boutique', island: 'Maafushi', atoll: 'South Male Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Maamadi_Maafushi.jpg?v=1765986259', specialOffer: '40% OFF', whatsapp: '9607776590', ...FOLLOWER_OFFER_BASE },
  { id: 'green-vista-maafushi', name: 'Green Vista', island: 'Maafushi', atoll: 'South Male Atoll', specialOffer: '10% OFF', whatsapp: '9607886955', ...FOLLOWER_OFFER_BASE, tieredOffers: [{ minNights: 1, maxNights: 3, discountPercentage: 10 }, { minNights: 4, discountPercentage: 15 }] },
  { id: 'fairytale-inn-thoddoo', name: 'Fairytale Inn', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Fairytale_Inn.png?v=1765987105', specialOffer: '10% OFF', whatsapp: '9607202587', ...FOLLOWER_OFFER_BASE },
  { id: 'chillax-thoddoo', name: 'Chillax Guesthouse', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Chillax_Thoddoo.png?v=1766078197', specialOffer: '10% OFF', whatsapp: '9609969979', ...FOLLOWER_OFFER_BASE },
  { id: 'royal-stay-thoddoo', name: 'Royal Stay', island: 'Thoddoo', atoll: 'North Ari Atoll', specialOffer: '10% OFF', whatsapp: '9609898899', ...FOLLOWER_OFFER_BASE },
  { id: 'thila-guesthouses-thoddoo', name: 'Thila Guesthouses', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Thilla_Thoddoo.jpg?v=1766079437', specialOffer: '10% OFF', whatsapp: '9609933296', ...FOLLOWER_OFFER_BASE },
  { id: 'manta-stay-thoddoo', name: 'Manta Stay', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Manta_Stay_Thoddoo.jpg?v=1766079358', specialOffer: '5% OFF', whatsapp: '9609746962', ...FOLLOWER_OFFER_BASE },
  { id: 'belvedere-thoddoo', name: 'Belvedere', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Belvedere_Thoddoo.jpg?v=1766079390', whatsapp: '9609190901', ...FOLLOWER_OFFER_BASE, tieredOffers: [{ minNights: 1, maxNights: 5, discountPercentage: 5 }, { minNights: 6, discountPercentage: 10 }] },
  { id: 'brisa-fresca-thoddoo', name: 'Brisa Fresca', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Brisa_Fresca_Thoddoo.jpg?v=1766079661', whatsapp: '9609194733', ...FOLLOWER_OFFER_BASE, tieredOffers: [{ minNights: 1, maxNights: 4, discountPercentage: 6 }, { minNights: 5, discountPercentage: 8 }] },
  { id: 'blue-water-thoddoo', name: 'Blue Water Thoddoo', island: 'Thoddoo', atoll: 'North Ari Atoll', specialOffer: '10% OFF', whatsapp: '9609695682', ...FOLLOWER_OFFER_BASE },
  { id: 'sunny-beach-thoddoo', name: 'Sunny Beach', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Sunny_Beach_Thoddoo.jpg?v=1766781837', specialOffer: '10% OFF', whatsapp: '9607980388', ...FOLLOWER_OFFER_BASE },
  { id: 'vegas-thoddoo', name: 'Vegas Thoddoo', island: 'Thoddoo', atoll: 'North Ari Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Vegas_Thoddoo.png?v=1766313352', specialOffer: '15% OFF', whatsapp: '9609793440', ...FOLLOWER_OFFER_BASE },
  { id: 'rushkokaa-fulidhoo', name: 'Rushkokaa', island: 'Fulidhoo', atoll: 'Vaavu Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Rushkokaa_Fulidhoo.jpg?v=1766082280', specialOffer: '15% OFF', whatsapp: '9609733336', ...FOLLOWER_OFFER_BASE },
  { id: 'dhoani-maldives-kendhoo', name: 'Dhoani Maldives', island: 'Kendhoo', atoll: 'Baa Atoll', logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Dhoani_Maldives_Kendhoo.png?v=1766049775', specialOffer: '15% OFF', whatsapp: '9609941038', ...FOLLOWER_OFFER_BASE },

  // --- HOTELS WITH RATES (Calculated) ---
  {
    id: 'baa-sand-maldives',
    name: 'Baa Sand Maldives',
    island: 'Kudarikilu',
    atoll: 'Baa Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Baa_Sands_Kudarikilu.png?v=1766163744',
    whatsapp: '9609199991',
    bookingEmail: 'info@baasand.mv',
    roomTypes: ['Standard Room', 'City View Room', 'Deluxe Room', 'Superior Deluxe Room', 'Family Room', 'Super Deluxe Triple Room'],
    rules: { 
      ...STANDARD_GUESTHOUSE_RULES, 
      serviceChargePercent: 0, 
      tgstPercent: 0, 
      agePolicies: [
        { name: "Infant", minAge: 0, maxAge: 1.99, greenTax: false, transferChargeable: false, mealChargeable: false, bedChargeable: false },
        { name: "Child (Infant Status)", minAge: 2, maxAge: 2.99, greenTax: true, transferChargeable: false, mealChargeable: false, bedChargeable: false },
        { name: "Child", minAge: 3, maxAge: 10.99, greenTax: true, transferChargeable: true, mealChargeable: true, bedChargeable: true },
        { name: "Adult", minAge: 11, maxAge: 99, greenTax: true, transferChargeable: true, mealChargeable: true, bedChargeable: true }
      ] 
    },
    mealPlans: [
      { id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 },
      { id: 'hb', name: 'Half Board', adultSupplement: 13, childSupplement: 13 },
      { id: 'fb', name: 'Full Board', adultSupplement: 26, childSupplement: 26 }
    ],
    transfers: [{ id: 'no-transfer', name: 'I will book my own transfer', adultRate: 0, childRate: 0, infantRate: 0 }],
    seasons: [
      { 
        name: 'High Season Part 1', 
        from: '2026-01-01', 
        to: '2026-01-10', 
        rates: { 
          'Standard Room Single': 86, 'Standard Room Double': 89, 
          'City View Room Single': 107, 'City View Room Double': 111, 
          'Deluxe Room Single': 114, 'Deluxe Room Double': 117, 
          'Superior Deluxe Room Single': 119, 'Superior Deluxe Room Double': 122, 
          'Family Room Single': 121, 'Family Room Double': 125, 
          'Super Deluxe Triple Room': 171 
        } 
      },
      { 
        name: 'Medium High', 
        from: '2026-01-11', 
        to: '2026-02-28', 
        rates: { 
          'Standard Room Single': 68, 'Standard Room Double': 72, 
          'City View Room Single': 77, 'City View Room Double': 81, 
          'Deluxe Room Single': 87, 'Deluxe Room Double': 91, 
          'Superior Deluxe Room Single': 91, 'Superior Deluxe Room Double': 94, 
          'Family Room Single': 96, 'Family Room Double': 100, 
          'Super Deluxe Triple Room': 150 
        } 
      },
      { 
        name: 'High Season Part 2', 
        from: '2026-03-01', 
        to: '2026-08-10', 
        rates: { 
          'Standard Room Single': 58, 'Standard Room Double': 61, 
          'City View Room Single': 64, 'City View Room Double': 68, 
          'Deluxe Room Single': 70, 'Deluxe Room Double': 74, 
          'Superior Deluxe Room Single': 78, 'Superior Deluxe Room Double': 82, 
          'Family Room Single': 83, 'Family Room Double': 87, 
          'Super Deluxe Triple Room': 135 
        } 
      },
      { 
        name: 'Low', 
        from: '2026-08-11', 
        to: '2026-11-14', 
        rates: { 
          'Standard Room Single': 77, 'Standard Room Double': 81, 
          'City View Room Single': 93, 'City View Room Double': 97, 
          'Deluxe Room Single': 106, 'Deluxe Room Double': 110, 
          'Superior Deluxe Room Single': 114, 'Superior Deluxe Room Double': 117, 
          'Family Room Single': 119, 'Family Room Double': 122, 
          'Super Deluxe Triple Room': 171 
        } 
      },
      { 
        name: 'High Season Part 3', 
        from: '2026-11-15', 
        to: '2026-12-31', 
        rates: { 
          'Standard Room Single': 86, 'Standard Room Double': 89, 
          'City View Room Single': 107, 'City View Room Double': 111, 
          'Deluxe Room Single': 114, 'Deluxe Room Double': 117, 
          'Superior Deluxe Room Single': 119, 'Superior Deluxe Room Double': 122, 
          'Family Room Single': 121, 'Family Room Double': 125, 
          'Super Deluxe Triple Room': 171 
        } 
      }
    ]
  },
  {
    id: 'chakz-1964-beach',
    name: 'Chakz 1964 Beach',
    island: 'Dharavandhoo',
    atoll: 'Baa Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Chakz_Beach_1964_Dharavandhoo.png?v=1766143326',
    bookingEmail: 'reservation@chakzmaldives.com',
    roomTypes: ['King Room Garden View', 'King Room Sea View'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0, agePolicies: STANDARD_AGE_POLICIES, occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Gala', adultSupplement: 40, childSupplement: 20 }, { id: 'nye', date: '12-31', name: 'New Year Eve Gala', adultSupplement: 50, childSupplement: 25 }] },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 10 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 20 }],
    transfers: [{ id: 'speedboat-ow', name: 'Speedboat (One Way)', adultRate: 60, childRate: 60, infantRate: 0 }, { id: 'domestic-ow', name: 'Domestic Flight (One Way)', adultRate: 130, childRate: 130, infantRate: 0 }],
    seasons: [
      { name: 'High', from: '2025-12-27', to: '2026-03-31', rates: { 'King Room Garden View Single': 135, 'King Room Garden View Double': 145, 'King Room Garden View Triple': 190, 'King Room Sea View Single': 150, 'King Room Sea View Double': 160, 'King Room Sea View Triple': 205 } },
      { name: 'Low', from: '2026-04-01', to: '2026-05-31', rates: { 'King Room Garden View Single': 90, 'King Room Garden View Double': 100, 'King Room Garden View Triple': 145, 'King Room Sea View Single': 105, 'King Room Sea View Double': 115, 'King Room Sea View Triple': 160 } }
    ]
  },
  {
    id: 'isla-retreat',
    name: 'Isla Retreat',
    island: 'Fehendhoo Island',
    atoll: 'Baa Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Isla_Retreat_Fehendhoo.png?v=1766050234',
    bookingEmail: 'hello@islaretreat.com',
    roomTypes: ['Island View Room', 'Sea View Room', 'Sea View Deluxe Room'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, serviceChargePercent: 0, tgstPercent: 0, minStayPolicies: [{ start: '12-23', end: '01-10', nights: 4 }], occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Gala', adultSupplement: 50, childSupplement: 30 }, { id: 'nye', date: '12-31', name: 'New Year Eve Gala', adultSupplement: 50, childSupplement: 30 }] },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 25, childSupplement: 12 }, { id: 'fb', name: 'Full Board', adultSupplement: 43, childSupplement: 20 }],
    transfers: [
      { id: 'speedboat-rt-high', name: 'Speedboat RT (High Season Nov-Apr)', adultRate: 130, childRate: 65, infantRate: 0, fromMonthDay: '11-01', toMonthDay: '04-30' },
      { id: 'speedboat-rt-low', name: 'Speedboat RT (Low Season May-Oct)', adultRate: 110, childRate: 55, infantRate: 0, fromMonthDay: '05-01', toMonthDay: '10-31' }
    ],
    seasons: [
      { name: 'Festive', from: '2025-12-27', to: '2026-01-10', rates: { 'Island View Room': 223, 'Sea View Room': 255, 'Sea View Deluxe Room': 265 } },
      { name: 'High', from: '2026-01-11', to: '2026-04-30', rates: { 'Island View Room': 150, 'Sea View Room': 175, 'Sea View Deluxe Room': 185 } },
      { name: 'Low', from: '2026-05-01', to: '2026-10-31', rates: { 'Island View Room': 115, 'Sea View Room': 135, 'Sea View Deluxe Room': 145 } }
    ],
    blackoutDates: {
      'Island View Room': [{ from: '2025-12-27', to: '2025-12-28' }, { from: '2026-01-13', to: '2026-01-19' }],
      'Sea View Room': [{ from: '2025-12-27', to: '2025-12-28' }, { from: '2026-01-11', to: '2026-01-19' }],
      'Sea View Deluxe Room': [{ from: '2025-12-25', to: '2025-12-28' }, { from: '2026-01-11', to: '2026-01-12' }]
    }
  },
  {
    id: 'jeym-lodge-thoddoo',
    name: 'Jeym Lodge',
    island: 'Thoddoo',
    atoll: 'North Ari Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Jeym_Lodge_Thoddoo.jpg?v=1766146258',
    bookingEmail: 'jeymlodge@gmail.com',
    whatsapp: '9609160614',
    roomTypes: ['Standard Room', 'Superior Room'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0 },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 0 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 0 }],
    transfers: [],
    seasons: [
      { name: 'High', from: '2025-12-27', to: '2026-03-31', rates: { 'Standard Room Single': 80, 'Standard Room Double': 100, 'Standard Room Triple': 120, 'Superior Room Single': 90, 'Superior Room Double': 110, 'Superior Room Triple': 130 } },
      { name: 'Low', from: '2026-04-01', to: '2026-10-31', rates: { 'Standard Room Single': 50, 'Standard Room Double': 60, 'Standard Room Triple': 75, 'Superior Room Single': 60, 'Superior Room Double': 70, 'Superior Room Triple': 85 } }
    ]
  },
  {
    id: 'lazzlla-maldives-apartments',
    name: 'Lazla Luxury Apartments',
    island: 'Hulhumalé',
    atoll: 'North Male Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Lazzlla_Maldives_Hulhumale.jpg?v=1766175229',
    bookingEmail: 'hello@lazzllamaldives.com',
    whatsapp: '9607255577',
    roomTypes: ['Beach Front 2 Bedroom', 'Beach Front 1 Bedroom', 'Beach Side Studio', 'City View 2 Bedroom', 'City View 1 Bedroom', 'City View 3 Bedroom', 'Room in a shared apartment'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0 },
    mealPlans: [{ id: 'bb', name: 'Breakfast Included', adultSupplement: 0, childSupplement: 0 }],
    transfers: [],
    seasons: [
      { name: 'High', from: '2026-01-01', to: '2026-03-31', rates: { 'Beach Front 2 Bedroom': 200, 'Beach Front 1 Bedroom': 165, 'Beach Side Studio': 105, 'City View 2 Bedroom': 135, 'City View 1 Bedroom': 110, 'City View 3 Bedroom': 220, 'Room in a shared apartment': 65 } },
      { name: 'Low', from: '2026-04-01', to: '2026-08-31', rates: { 'Beach Front 2 Bedroom': 190, 'Beach Front 1 Bedroom': 145, 'Beach Side Studio': 95, 'City View 2 Bedroom': 125, 'City View 1 Bedroom': 95, 'City View 3 Bedroom': 210, 'Room in a shared apartment': 55 } },
      { name: 'High (End)', from: '2026-09-01', to: '2026-12-31', rates: { 'Beach Front 2 Bedroom': 200, 'Beach Front 1 Bedroom': 165, 'Beach Side Studio': 105, 'City View 2 Bedroom': 135, 'City View 1 Bedroom': 110, 'City View 3 Bedroom': 220, 'Room in a shared apartment': 65 } }
    ]
  },
  {
    id: 'palms-retreat-fulhadhoo',
    name: 'Palms Retreat',
    island: 'Fulhadhoo Island',
    atoll: 'Baa Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Palms_Retreat_Fulhadhoo_logo.jpg?v=1766836790',
    whatsapp: '9609416546',
    bookingEmail: 'palmsretreatmaldives@gmail.com',
    roomTypes: ['Double Room', 'Triple Room'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0 },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 30, childSupplement: 30 }, { id: 'fb', name: 'Full Board', adultSupplement: 50, childSupplement: 50 }],
    transfers: [],
    seasons: [
      { name: 'Jan 2026', from: '2026-01-01', to: '2026-01-31', rates: { 'Double Room': 179, 'Triple Room': 215 } },
      { name: 'Feb 2026', from: '2026-02-01', to: '2026-02-28', rates: { 'Double Room': 189, 'Triple Room': 225 } },
      { name: 'Mar 2026', from: '2026-03-01', to: '2026-03-31', rates: { 'Double Room': 179, 'Triple Room': 215 } }
    ]
  },
  {
    id: 'plumeria-maldives',
    name: 'Plumeria Maldives',
    island: 'Thinadhoo',
    atoll: 'Vaavu Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Plumeria_Maldives_Logo.png?v=1765980763',
    bookingEmail: 'reservations@plumeriamaldives.com',
    bookingCC: 'sales-advisor@plumeriamaldives.com',
    roomTypes: ['Standard Room', 'Deluxe Room', 'Super Deluxe Room', 'Super Deluxe Plus', 'Garden Villa Room', 'Ocean View Room'],
    rules: { 
      ...STANDARD_GUESTHOUSE_RULES, 
      greenTaxPerNight: 6, 
      serviceChargePercent: 0, 
      tgstPercent: 0, 
      agePolicies: [
        { name: "Infant", minAge: 0, maxAge: 4.99, greenTax: true, transferChargeable: false, mealChargeable: false, bedChargeable: false },
        { name: "Child", minAge: 5, maxAge: 11.99, greenTax: true, transferChargeable: true, mealChargeable: true, bedChargeable: true },
        { name: "Adult", minAge: 12, maxAge: 99, greenTax: true, transferChargeable: true, mealChargeable: true, bedChargeable: true }
      ],
      minStayPolicies: [{ start: '01-01', end: '01-07', nights: 5 }], 
      extraAdultSupplement: 70, 
      extraChildSupplement: 35, 
      occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Gala', adultSupplement: 110, childSupplement: 55 }, { id: 'nye', date: '12-31', name: 'New Year Eve Gala', adultSupplement: 110, childSupplement: 55 }] 
    },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 28, childSupplement: 0 }, { id: 'fb', name: 'Full Board', adultSupplement: 36, childSupplement: 0 }],
    transfers: [{ id: 'speedboat-rt', name: 'Speedboat RT', adultRate: 130, childRate: 80, infantRate: 0 }, { id: 'seaplane-ow', name: 'Seaplane One Way', adultRate: 205, childRate: 123, infantRate: 0 }],
    seasons: [
      { name: 'High', from: '2026-01-11', to: '2026-03-31', rates: { 'Ocean View Room': 222, 'Standard Room': 124, 'Deluxe Room': 154, 'Super Deluxe Room': 171, 'Super Deluxe Plus': 191, 'Garden Villa Room': 191 } },
      { name: 'Low', from: '2026-04-01', to: '2026-08-31', rates: { 'Ocean View Room': 184, 'Standard Room': 103, 'Deluxe Room': 132, 'Super Deluxe Room': 136, 'Super Deluxe Plus': 155, 'Garden Villa Room': 155 } }
    ]
  },
  {
    id: 'ranvilu-rv-thoddoo',
    name: 'RANVILU – RV THODDOO MALDIVES',
    atoll: 'North Ari Atoll',
    island: 'Thoddoo',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/RANVILU_-_RV_THODDOO_MALDIVES.jpg?v=1766312692',
    whatsapp: '9607737322',
    roomTypes: ['Standard Room'],
    rules: {
      singleReduction: 0, extraAdultSupplement: 0, extraChildSupplement: 0, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0,
      agePolicies: STANDARD_AGE_POLICIES,
      occasions: []
    },
    mealPlans: [
      { id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 },
      { id: 'hb', name: 'Half Board', adultSupplement: 17, childSupplement: 14 },
      { id: 'fb', name: 'Full Board', adultSupplement: 34, childSupplement: 28 }
    ],
    transfers: [
      { id: 'no-transfer', name: 'I will book my own transfer', adultRate: 0, childRate: 0, infantRate: 0 },
      { id: 'speedboat-rt', name: 'Speedboat Transfer (Return)', adultRate: 70, childRate: 40, infantRate: 0 }
    ],
    seasons: [
      { name: 'High', from: '2026-01-01', to: '2026-03-31', rates: { 'Standard Room - 1A': 75, 'Standard Room - 1A+1K': 89, 'Standard Room - 1A+2K': 103, 'Standard Room - 2A': 92, 'Standard Room - 2A+1K': 106, 'Standard Room - 2A+2K': 120, 'Standard Room - 3A': 109 } },
      { name: 'Low', from: '2026-04-01', to: '2026-11-30', rates: { 'Standard Room - 1A': 65, 'Standard Room - 1A+1K': 79, 'Standard Room - 1A+2K': 93, 'Standard Room - 2A': 82, 'Standard Room - 2A+1K': 96, 'Standard Room - 2A+2K': 110, 'Standard Room - 3A': 99 } },
      { name: 'High (End)', from: '2026-12-01', to: '2026-12-31', rates: { 'Standard Room - 1A': 75, 'Standard Room - 1A+1K': 89, 'Standard Room - 1A+2K': 103, 'Standard Room - 2A': 92, 'Standard Room - 2A+1K': 106, 'Standard Room - 2A+2K': 120, 'Standard Room - 3A': 109 } }
    ]
  },
  {
    id: 'rihiveli-residence-thoddoo',
    name: 'Rihiveli Residence',
    atoll: 'North Ari Atoll',
    island: 'Thoddoo',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Rihiveli_Residence_Thoddoo.png?v=1766311889',
    whatsapp: '9609572544',
    roomTypes: ['Deluxe Double Room Ground Floor New Building', 'Deluxe Double Room with Balcony', 'Deluxe Triple Room with Balcony', 'Deluxe Triple Room with Balcony Plus Extra Bed'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0 },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 15 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 30 }],
    transfers: [{ id: 'no-transfer', name: 'I will book my own transfer', adultRate: 0, childRate: 0, infantRate: 0 }],
    seasons: [
      { name: 'New Year', from: '2026-12-20', to: '2026-12-31', rates: { 'Deluxe Double Room Ground Floor New Building': 90, 'Deluxe Double Room with Balcony': 100, 'Deluxe Triple Room with Balcony': 125, 'Deluxe Triple Room with Balcony Plus Extra Bed': 140 } },
      { name: 'High', from: '2026-01-01', to: '2026-03-31', rates: { 'Deluxe Double Room Ground Floor New Building': 75, 'Deluxe Double Room with Balcony': 85, 'Deluxe Triple Room with Balcony': 100, 'Deluxe Triple Room with Balcony Plus Extra Bed': 120 } },
      { name: 'High (Late)', from: '2026-12-01', to: '2026-12-19', rates: { 'Deluxe Double Room Ground Floor New Building': 75, 'Deluxe Double Room with Balcony': 85, 'Deluxe Triple Room with Balcony': 100, 'Deluxe Triple Room with Balcony Plus Extra Bed': 120 } },
      { name: 'Low', from: '2026-04-01', to: '2026-04-30', rates: { 'Deluxe Double Room Ground Floor New Building': 60, 'Deluxe Double Room with Balcony': 70, 'Deluxe Triple Room with Balcony': 90, 'Deluxe Triple Room with Balcony Plus Extra Bed': 110 } },
      { name: 'Low (Mid)', from: '2026-08-01', to: '2026-08-31', rates: { 'Deluxe Double Room Ground Floor New Building': 60, 'Deluxe Double Room with Balcony': 70, 'Deluxe Triple Room with Balcony': 90, 'Deluxe Triple Room with Balcony Plus Extra Bed': 110 } },
      { name: 'Low (End)', from: '2026-10-01', to: '2026-11-30', rates: { 'Deluxe Double Room Ground Floor New Building': 60, 'Deluxe Double Room with Balcony': 70, 'Deluxe Triple Room with Balcony': 90, 'Deluxe Triple Room with Balcony Plus Extra Bed': 110 } },
      { name: 'Special Low', from: '2026-05-01', to: '2026-07-31', rates: { 'Deluxe Double Room Ground Floor New Building': 50, 'Deluxe Double Room with Balcony': 60, 'Deluxe Triple Room with Balcony': 80, 'Deluxe Triple Room with Balcony Plus Extra Bed': 100 } },
      { name: 'Special Low (Sept)', from: '2026-09-01', to: '2026-09-30', rates: { 'Deluxe Double Room Ground Floor New Building': 50, 'Deluxe Double Room with Balcony': 60, 'Deluxe Triple Room with Balcony': 80, 'Deluxe Triple Room with Balcony Plus Extra Bed': 100 } }
    ]
  },
  {
    id: 'stingray-beach-inn',
    name: 'Stingray Beach Inn',
    island: 'Maafushi',
    atoll: 'South Male Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/stingray_beach_inn.jpg?v=1766007354',
    bookingEmail: 'info@tritonhotelsandtours.com',
    whatsapp: '9607901240',
    roomTypes: ['Standard Room'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0, occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Gala', adultSupplement: 50, childSupplement: 25 }, { id: 'nye', date: '12-31', name: 'New Year Eve Gala', adultSupplement: 75, childSupplement: 35 }] },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 10 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 18 }],
    transfers: [{ id: 'speedboat-ow', name: 'Speedboat Ferry (OW)', adultRate: 30, childRate: 15, infantRate: 0 }],
    seasons: [
      { name: 'Low', from: '2026-05-01', to: '2026-07-31', rates: { 'Standard Room Single': 66, 'Standard Room Double': 80, 'Standard Room Triple': 107 } },
      { name: 'Low (Sept)', from: '2026-09-01', to: '2026-09-30', rates: { 'Standard Room Single': 66, 'Standard Room Double': 80, 'Standard Room Triple': 107 } },
      { name: 'Low (Oct)', from: '2026-10-01', to: '2026-10-31', rates: { 'Standard Room Single': 66, 'Standard Room Double': 80, 'Standard Room Triple': 107 } },
      { name: 'Medium', from: '2026-04-01', to: '2026-04-30', rates: { 'Standard Room Single': 89, 'Standard Room Double': 103, 'Standard Room Triple': 129 } },
      { name: 'Medium (Aug)', from: '2026-08-01', to: '2026-08-31', rates: { 'Standard Room Single': 89, 'Standard Room Double': 103, 'Standard Room Triple': 129 } },
      { name: 'Medium (End)', from: '2026-11-01', to: '2026-12-24', rates: { 'Standard Room Single': 89, 'Standard Room Double': 103, 'Standard Room Triple': 129 } },
      { name: 'High', from: '2026-01-06', to: '2026-03-31', rates: { 'Standard Room Single': 117, 'Standard Room Double': 131, 'Standard Room Triple': 157 } },
      { name: 'New Year', from: '2025-12-25', to: '2026-01-05', rates: { 'Standard Room Single': 162, 'Standard Room Double': 176, 'Standard Room Triple': 204 } }
    ]
  },
  {
    id: 'triton-beach-hotel',
    name: 'Triton Beach Hotel & Spa',
    island: 'Maafushi',
    atoll: 'South Male Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/triton_Beach_Maafushi.jpg?v=1766008129',
    bookingEmail: 'info@tritonhotelsandtours.com',
    whatsapp: '9607901240',
    roomTypes: ['Deluxe Double Room with Pool View', 'Deluxe Double Room with Island View', 'Triple Room with Pool View', 'Triple Room with Island View', 'Superior Suite'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0, occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Gala', adultSupplement: 50, childSupplement: 25 }, { id: 'nye', date: '12-31', name: 'New Year Eve Gala', adultSupplement: 75, childSupplement: 35 }] },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 10 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 18 }],
    transfers: [{ id: 'speedboat-ow', name: 'Speedboat Ferry (OW)', adultRate: 30, childRate: 15, infantRate: 0 }],
    seasons: [
      { name: 'Low', from: '2026-05-01', to: '2026-07-31', rates: { 'Deluxe Double Room with Pool View': 92, 'Deluxe Double Room with Island View': 103, 'Triple Room with Pool View': 118, 'Triple Room with Island View': 141, 'Superior Suite': 176 } },
      { name: 'Low (Sept)', from: '2026-09-01', to: '2026-09-30', rates: { 'Deluxe Double Room with Pool View': 92, 'Deluxe Double Room with Island View': 103, 'Triple Room with Pool View': 118, 'Triple Room with Island View': 141, 'Superior Suite': 176 } },
      { name: 'Low (Oct)', from: '2026-10-01', to: '2026-10-31', rates: { 'Deluxe Double Room with Pool View': 92, 'Deluxe Double Room with Island View': 103, 'Triple Room with Pool View': 118, 'Triple Room with Island View': 141, 'Superior Suite': 176 } },
      { name: 'Medium', from: '2026-04-01', to: '2026-04-30', rates: { 'Deluxe Double Room with Pool View': 114, 'Deluxe Double Room with Island View': 125, 'Triple Room with Pool View': 141, 'Triple Room with Island View': 163, 'Superior Suite': 200 } },
      { name: 'Medium (Aug)', from: '2026-08-01', to: '2026-08-31', rates: { 'Deluxe Double Room with Pool View': 114, 'Deluxe Double Room with Island View': 125, 'Triple Room with Pool View': 141, 'Triple Room with Island View': 163, 'Superior Suite': 200 } },
      { name: 'Medium (End)', from: '2026-11-01', to: '2026-12-24', rates: { 'Deluxe Double Room with Pool View': 114, 'Deluxe Double Room with Island View': 125, 'Triple Room with Pool View': 141, 'Triple Room with Island View': 163, 'Superior Suite': 200 } },
      { name: 'High', from: '2026-01-06', to: '2026-03-31', rates: { 'Deluxe Double Room with Pool View': 142, 'Deluxe Double Room with Island View': 154, 'Triple Room with Pool View': 168, 'Triple Room with Island View': 190, 'Superior Suite': 228 } },
      { name: 'New Year', from: '2025-12-25', to: '2026-01-05', rates: { 'Deluxe Double Room with Pool View': 187, 'Deluxe Double Room with Island View': 200, 'Triple Room with Pool View': 215, 'Triple Room with Island View': 238, 'Superior Suite': 273 } }
    ]
  },
  {
    id: 'triton-prestige',
    name: 'Triton Prestige Seaview & Spa',
    island: 'Maafushi',
    atoll: 'South Male Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Triton_Prestige_Seaview_Maafushi.png?v=1766008243',
    bookingEmail: 'info@tritonhotelsandtours.com',
    whatsapp: '9607901240',
    roomTypes: ['Standard Double or Twin Room with Balcony', 'Deluxe Sea View Single Room', 'Deluxe Sea View Double or Twin Room', 'Deluxe Sea View Triple Room', 'Deluxe Partial Sea View Single Room', 'Deluxe Partial Sea View Double or Twin Room', 'Deluxe Partial Sea View Triple Room', 'Super Deluxe Sea View Room', 'Premium Connecting Room', 'Honeymoon Suite', 'King Suite with Jacuzzi'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0, occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Gala', adultSupplement: 50, childSupplement: 25 }, { id: 'nye', date: '12-31', name: 'New Year Eve Gala', adultSupplement: 75, childSupplement: 35 }] },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 10 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 18 }],
    transfers: [{ id: 'speedboat-ow', name: 'Speedboat Ferry (OW)', adultRate: 30, childRate: 15, infantRate: 0 }],
    seasons: [
      { name: 'Low', from: '2026-05-01', to: '2026-07-31', rates: { 'Standard Double or Twin Room with Balcony': 88, 'Deluxe Sea View Single Room': 113, 'Deluxe Sea View Double or Twin Room': 131, 'Deluxe Sea View Triple Room': 157, 'Deluxe Partial Sea View Single Room': 92, 'Deluxe Partial Sea View Double or Twin Room': 110, 'Deluxe Partial Sea View Triple Room': 135, 'Super Deluxe Sea View Room': 183, 'Premium Connecting Room': 207, 'Honeymoon Suite': 176, 'King Suite with Jacuzzi': 222 } },
      { name: 'Low (Sept/Oct)', from: '2026-09-01', to: '2026-10-31', rates: { 'Standard Double or Twin Room with Balcony': 88, 'Deluxe Sea View Single Room': 113, 'Deluxe Sea View Double or Twin Room': 131, 'Deluxe Sea View Triple Room': 157, 'Deluxe Partial Sea View Single Room': 92, 'Deluxe Partial Sea View Double or Twin Room': 110, 'Deluxe Partial Sea View Triple Room': 135, 'Super Deluxe Sea View Room': 183, 'Premium Connecting Room': 207, 'Honeymoon Suite': 176, 'King Suite with Jacuzzi': 222 } },
      { name: 'Medium', from: '2026-04-01', to: '2026-04-30', rates: { 'Standard Double or Twin Room with Balcony': 110, 'Deluxe Sea View Single Room': 135, 'Deluxe Sea View Double or Twin Room': 152, 'Deluxe Sea View Triple Room': 178, 'Deluxe Partial Sea View Single Room': 113, 'Deluxe Partial Sea View Double or Twin Room': 131, 'Deluxe Partial Sea View Triple Room': 157, 'Super Deluxe Sea View Room': 205, 'Premium Connecting Room': 249, 'Honeymoon Suite': 198, 'King Suite with Jacuzzi': 244 } },
      { name: 'Medium (Aug)', from: '2026-08-01', to: '2026-08-31', rates: { 'Standard Double or Twin Room with Balcony': 110, 'Deluxe Sea View Single Room': 135, 'Deluxe Sea View Double or Twin Room': 152, 'Deluxe Sea View Triple Room': 178, 'Deluxe Partial Sea View Single Room': 113, 'Deluxe Partial Sea View Double or Twin Room': 131, 'Deluxe Partial Sea View Triple Room': 157, 'Super Deluxe Sea View Room': 205, 'Premium Connecting Room': 249, 'Honeymoon Suite': 198, 'King Suite with Jacuzzi': 244 } },
      { name: 'Medium (End)', from: '2026-11-01', to: '2026-12-24', rates: { 'Standard Double or Twin Room with Balcony': 110, 'Deluxe Sea View Single Room': 135, 'Deluxe Sea View Double or Twin Room': 152, 'Deluxe Sea View Triple Room': 178, 'Deluxe Partial Sea View Single Room': 113, 'Deluxe Partial Sea View Double or Twin Room': 131, 'Deluxe Partial Sea View Triple Room': 157, 'Super Deluxe Sea View Room': 205, 'Premium Connecting Room': 249, 'Honeymoon Suite': 198, 'King Suite with Jacuzzi': 244 } },
      { name: 'High', from: '2026-01-06', to: '2026-03-31', rates: { 'Standard Double or Twin Room with Balcony': 131, 'Deluxe Sea View Single Room': 156, 'Deluxe Sea View Double or Twin Room': 174, 'Deluxe Sea View Triple Room': 199, 'Deluxe Partial Sea View Single Room': 135, 'Deluxe Partial Sea View Double or Twin Room': 152, 'Deluxe Partial Sea View Triple Room': 178, 'Super Deluxe Sea View Room': 226, 'Premium Connecting Room': 290, 'Honeymoon Suite': 219, 'King Suite with Jacuzzi': 264 } },
      { name: 'New Year', from: '2025-12-25', to: '2026-01-05', rates: { 'Standard Double or Twin Room with Balcony': 174, 'Deluxe Sea View Single Room': 199, 'Deluxe Sea View Double or Twin Room': 217, 'Deluxe Sea View Triple Room': 242, 'Deluxe Partial Sea View Single Room': 178, 'Deluxe Partial Sea View Double or Twin Room': 195, 'Deluxe Partial Sea View Triple Room': 221, 'Super Deluxe Sea View Room': 268, 'Premium Connecting Room': 376, 'Honeymoon Suite': 262, 'King Suite with Jacuzzi': 307 } }
    ]
  },
  {
    id: 'sands-garden-thoddoo',
    name: 'Sands Garden Thoddoo',
    island: 'Thoddoo',
    atoll: 'North Ari Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Sands_hotel.png?v=1766080310',
    whatsapp: '9607706819',
    bookingEmail: 'res@sandshotelmaldives.com',
    roomTypes: ['Queen Room with Balcony', 'Double Deluxe Room with Balcony', 'Deluxe Room'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0, minStayPolicies: [{ start: '12-24', end: '01-01', nights: 4 }], agePolicies: STANDARD_AGE_POLICIES, occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Dinner', adultSupplement: 20, childSupplement: 10 }, { id: 'nye', date: '12-31', name: 'New Year Eve Dinner', adultSupplement: 65, childSupplement: 35 }] },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 8 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 15 }],
    transfers: [{ id: 'speedboat-rt', name: 'Speedboat RT Thoddoo', adultRate: 70, childRate: 70, infantRate: 0 }],
    seasons: [
      { name: 'Festive', from: '2025-12-27', to: '2026-01-15', rates: { 'Queen Room with Balcony': 98, 'Double Deluxe Room with Balcony': 93, 'Deluxe Room': 85 } },
      { name: 'High', from: '2026-01-16', to: '2026-03-31', rates: { 'Queen Room with Balcony': 95, 'Double Deluxe Room with Balcony': 85, 'Deluxe Room': 75 } }
    ]
  },
  {
    id: 'sands-grand-dhigurah',
    name: 'Sands Grand Dhigurah',
    island: 'Dhigurah',
    atoll: 'South Ari Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Sands_hotel.png?v=1766080310',
    whatsapp: '9607706819',
    bookingEmail: 'res@sandshotelmaldives.com',
    roomTypes: ['Deluxe Room with Balcony', 'Super Deluxe Room with Balcony', 'Family Room with Balcony'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0, minStayPolicies: [{ start: '12-24', end: '01-01', nights: 4 }], occasions: [{ id: 'xmas', date: '12-24', name: 'Christmas Eve Dinner', adultSupplement: 20, childSupplement: 10 }, { id: 'nye', date: '12-31', name: 'New Year Eve Dinner', adultSupplement: 85, childSupplement: 45 }] },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 8 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 15 }],
    transfers: [{ id: 'speedboat-rt', name: 'Speedboat RT Dhigurah', adultRate: 120, childRate: 120, infantRate: 0 }],
    seasons: [
      { name: 'Festive', from: '2025-12-27', to: '2026-01-15', rates: { 'Deluxe Room with Balcony': 98, 'Super Deluxe Room with Balcony': 110, 'Family Room with Balcony': 115 } },
      { name: 'High', from: '2026-01-16', to: '2026-03-31', rates: { 'Deluxe Room with Balcony': 95, 'Super Deluxe Room with Balcony': 98, 'Family Room with Balcony': 110 } }
    ]
  },
  {
    id: 'watercloud-mathiveri',
    name: 'Watercloud Mathiveri',
    island: 'Mathiveri',
    atoll: 'North Ari Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/WATERCLOUD_MATHIVERI.png?v=1766156166',
    whatsapp: '9607552440',
    roomTypes: ['Deluxe Room with Partial Sea View (Balcony)', 'Superior Family Room with Island View', 'Adjoining Family Suite with Partial Sea View (Balcony)'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0 },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 15, childSupplement: 15 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 30 }],
    transfers: [],
    seasons: [
      { name: 'High', from: '2025-12-15', to: '2026-05-31', rates: { 'Deluxe Room with Partial Sea View (Balcony)': 90, 'Superior Family Room with Island View': 120, 'Adjoining Family Suite with Partial Sea View (Balcony)': 140 } },
      { name: 'Low', from: '2026-06-01', to: '2026-12-14', rates: { 'Deluxe Room with Partial Sea View (Balcony)': 60, 'Superior Family Room with Island View': 90, 'Adjoining Family Suite with Partial Sea View (Balcony)': 110 } }
    ]
  },
  {
    id: 'yuvi-blue-himmafushi',
    name: 'YuVi Blue & Spa',
    island: 'Himmafushi',
    atoll: 'North Male Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/yuvi_Blue_himmafushi.png?v=1766055528',
    whatsapp: '9609910999',
    bookingEmail: 'reservations@yuvibluemaldives.com',
    roomTypes: ['Deluxe Room', 'Deluxe Twin Room', 'Family Room', 'Triple Room'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0 },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 20, childSupplement: 20 }, { id: 'fb', name: 'Full Board', adultSupplement: 30, childSupplement: 30 }],
    transfers: [{ id: 'speedboat-rt', name: 'Speedboat RT Himmafushi', adultRate: 50, childRate: 50, infantRate: 0 }],
    seasons: [{ name: 'All Year', from: '2026-01-01', to: '2026-12-31', rates: { 'Deluxe Room': 55, 'Deluxe Twin Room': 55, 'Family Room': 65, 'Triple Room': 65 } }]
  },
  {
    id: 'thundi-sea-view',
    name: 'Thundi Sea View',
    island: 'Fulidhoo Island',
    atoll: 'Vaavu Atoll',
    logoUrl: 'https://cdn.shopify.com/s/files/1/0942/5666/0784/files/Thundi_Seaview_Fulidhoo.png?v=1766157572',
    bookingEmail: 'sales@thundihotels.com',
    roomTypes: ['Standard Sea View', 'Deluxe Sea View with Garden Bathroom', 'Deluxe Sea View with Balcony', 'Super Deluxe Sea View with Balcony', 'Premium Sea View with Balcony'],
    rules: { ...STANDARD_GUESTHOUSE_RULES, greenTaxPerNight: 0, serviceChargePercent: 0, tgstPercent: 0 },
    mealPlans: [{ id: 'bb', name: 'Bed & Breakfast', adultSupplement: 0, childSupplement: 0 }, { id: 'hb', name: 'Half Board', adultSupplement: 10, childSupplement: 10 }, { id: 'fb', name: 'Full Board', adultSupplement: 20, childSupplement: 20 }],
    transfers: [{ id: 'speedboat-ow', name: 'Speedboat OW Fulidhoo', adultRate: 40, childRate: 40, infantRate: 0 }],
    seasons: [
      { name: 'Season A', from: '2026-01-01', to: '2026-02-28', rates: { 'Standard Sea View Single': 110, 'Standard Sea View Double': 120, 'Premium Sea View with Balcony Single': 130, 'Premium Sea View with Balcony Double': 140 } },
      { name: 'Season B', from: '2026-03-01', to: '2026-11-30', rates: { 'Standard Sea View Single': 70, 'Standard Sea View Double': 80, 'Premium Sea View with Balcony Single': 90, 'Premium Sea View with Balcony Double': 100 } },
      { name: 'Season A (End)', from: '2026-12-01', to: '2026-12-31', rates: { 'Standard Sea View Single': 110, 'Standard Sea View Double': 120, 'Premium Sea View with Balcony Single': 130, 'Premium Sea View with Balcony Double': 140 } }
    ]
  }
];

export const getApplicableDiscount = (hotel: Hotel, nights: number): string => {
  // If we have specific nights, try to find the exact matching tier
  if (nights > 0 && hotel.tieredOffers && hotel.tieredOffers.length > 0) {
    const offer = hotel.tieredOffers.find(o => nights >= o.minNights && (o.maxNights ? nights <= o.maxNights : true));
    if (offer) return `${offer.discountPercentage}% OFF`;
  }

  // Fallback 1: If nights is 0 or no specific tier matches, use hardcoded specialOffer if present
  if (hotel.specialOffer) return hotel.specialOffer;

  // Fallback 2: Construct range from tiers if no hardcoded specialOffer
  if (hotel.tieredOffers && hotel.tieredOffers.length > 0) {
    const percentages = hotel.tieredOffers.map(o => o.discountPercentage);
    const min = Math.min(...percentages);
    const max = Math.max(...percentages);
    if (min === max) return `${min}% OFF`;
    return `${min}%-${max}% OFF`;
  }

  return '';
};