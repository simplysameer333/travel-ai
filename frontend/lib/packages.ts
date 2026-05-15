import { getDestinationImage } from './destinationImages'

// ── Types ─────────────────────────────────────────────────────────────────────

export type PackageType       = 'basic' | 'standard' | 'premium' | 'luxury'
export type PackageCategory   = 'domestic' | 'international'
export type MealPlan          = 'none' | 'breakfast' | 'breakfast_dinner' | 'all_inclusive'
export type CancellationPolicy = 'free' | 'partial' | 'non_refundable'
export type DealType          = 'flash' | 'last_minute' | 'early_bird' | 'seasonal'

export interface ItineraryDay {
  day: number
  title: string
  description: string
  activities: string[]
  meals: string[]
  accommodation: string
  highlight?: string
}

export interface PackageInclusion {
  flights: boolean
  hotel_stars: number
  meals: MealPlan
  transfers: boolean
  tours: boolean
  visa_assistance: boolean
  activities: string[]
}

export interface TravelPackage {
  id: string
  title: string
  destinations: string[]
  primary_destination: string
  duration_nights: number
  duration_days: number
  type: PackageType
  category: PackageCategory
  tags: string[]
  price_per_person: number
  original_price: number
  total_price: number
  savings: number
  inclusions: PackageInclusion
  itinerary: ItineraryDay[]
  ai_summary: string
  ai_insights: string[]
  rating: number
  reviews_count: number
  is_trending: boolean
  is_ai_recommended: boolean
  is_bestseller: boolean
  departure_cities: string[]
  visa_required: boolean
  cancellation_policy: CancellationPolicy
}

export interface Deal {
  id: string
  package_id: string
  package_title: string
  destination: string
  original_price: number
  deal_price: number
  discount_percent: number
  discount_amount: number
  deal_type: DealType
  expires_at: string
  description: string
  ai_insight: string
  seats_left?: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function packageCoverImage(destination: string, w = 800, h = 520) {
  return getDestinationImage(destination, w, h)
}

export const TYPE_LABELS: Record<PackageType, string> = {
  basic:    'Basic',
  standard: 'Standard',
  premium:  'Premium',
  luxury:   'Luxury',
}

export const TYPE_COLORS: Record<PackageType, string> = {
  basic:    'bg-slate-700 text-white',
  standard: 'bg-sky-600 text-white',
  premium:  'bg-violet-600 text-white',
  luxury:   'bg-amber-500 text-white',
}

export const MEAL_LABELS: Record<MealPlan, string> = {
  none:              'No Meals',
  breakfast:         'Breakfast',
  breakfast_dinner:  'Breakfast + Dinner',
  all_inclusive:     'All-Inclusive',
}

// ── Mock Packages ─────────────────────────────────────────────────────────────

export const MOCK_PACKAGES: TravelPackage[] = [
  {
    id: 'pkg-001',
    title: 'Goa Sun & Sand Escape',
    destinations: ['Goa'],
    primary_destination: 'Goa',
    duration_nights: 3, duration_days: 4,
    type: 'standard', category: 'domestic',
    tags: ['beach', 'couple', 'budget', 'weekend'],
    price_per_person: 12999, original_price: 16999, total_price: 25998, savings: 8000,
    inclusions: { flights: true, hotel_stars: 3, meals: 'breakfast', transfers: true, tours: false, visa_assistance: false, activities: ['Water sports voucher', 'Beach access'] },
    itinerary: [
      { day: 1, title: 'Arrival & North Goa', description: 'Fly in, check into your beach resort, and spend the evening at Baga beach.', activities: ['Airport pickup', 'Hotel check-in', 'Baga beach sunset', 'Seafood dinner'], meals: ['Dinner'], accommodation: '3★ Beach Resort', highlight: 'Baga beach sunset' },
      { day: 2, title: 'South Goa & Water Sports', description: 'Explore the quieter, pristine beaches of South Goa and try exciting water sports.', activities: ['Colva beach', 'Water sports', 'Anjuna flea market'], meals: ['Breakfast'], accommodation: '3★ Beach Resort' },
      { day: 3, title: 'Heritage & Spice Farm', description: 'Discover Old Goa\'s UNESCO churches and visit a working spice plantation.', activities: ['Old Goa churches', 'Spice plantation tour', 'Dudhsagar waterfall viewpoint'], meals: ['Breakfast'], accommodation: '3★ Beach Resort', highlight: 'Spice plantation lunch' },
      { day: 4, title: 'Departure', description: 'Morning checkout and transfer to airport.', activities: ['Breakfast', 'Hotel checkout', 'Airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Perfect for couples & first-timers craving sun, sand, and seafood 🌊',
    ai_insights: ['Prices rise 30% during Dec–Jan peak — book now to lock in this rate', 'Most booked by couples from Mumbai & Pune', '18% cheaper than booking flights + hotel separately', 'Best months: October to March'],
    rating: 4.6, reviews_count: 1247,
    is_trending: true, is_ai_recommended: true, is_bestseller: true,
    departure_cities: ['Mumbai', 'Delhi', 'Pune', 'Bangalore'],
    visa_required: false, cancellation_policy: 'free',
  },
  {
    id: 'pkg-002',
    title: 'Manali Snow Adventure',
    destinations: ['Manali', 'Solang Valley'],
    primary_destination: 'Manali',
    duration_nights: 5, duration_days: 6,
    type: 'premium', category: 'domestic',
    tags: ['mountains', 'adventure', 'snow', 'solo', 'couple'],
    price_per_person: 22999, original_price: 29999, total_price: 45998, savings: 14000,
    inclusions: { flights: true, hotel_stars: 4, meals: 'breakfast_dinner', transfers: true, tours: true, visa_assistance: false, activities: ['Rohtang Pass permit', 'Solang Valley activities', 'River rafting'] },
    itinerary: [
      { day: 1, title: 'Fly to Kullu, Drive to Manali', description: 'Land at Bhuntar airport and enjoy a scenic drive to Manali along the Beas river.', activities: ['Airport pickup', 'Scenic Beas valley drive', 'Hadimba Temple visit', 'Mall Road exploration'], meals: ['Dinner'], accommodation: '4★ Mountain Resort', highlight: 'First snow sighting' },
      { day: 2, title: 'Rohtang Pass', description: 'Permit-based excursion to the legendary Rohtang Pass at 13,051 ft.', activities: ['Rohtang Pass (permits incl.)', 'Snow activities', 'Photography stops'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Mountain Resort', highlight: 'Snow at 13,000 ft' },
      { day: 3, title: 'Solang Valley & Adventure', description: 'Zorbing, paragliding, and cable car at the adventure hub of Solang Valley.', activities: ['Zorbing', 'Cable car ride', 'Paragliding (optional)', 'Bon fire evening'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Mountain Resort', highlight: 'Paragliding over snow peaks' },
      { day: 4, title: 'River Rafting & Old Manali', description: 'White-water rafting on the Beas river followed by Old Manali café hopping.', activities: ['Beas river rafting', 'Old Manali cafés', 'Vashisht hot spring'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Mountain Resort' },
      { day: 5, title: 'Kullu & Local Markets', description: 'Explore Kullu\'s famous shawl market and Great Himalayan National Park viewpoint.', activities: ['Kullu shawl market', 'Bijli Mahadev temple trek', 'Local cuisine dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Mountain Resort' },
      { day: 6, title: 'Departure', description: 'Transfer to airport for your return flight.', activities: ['Breakfast', 'Hotel checkout', 'Airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Snow peaks, river rapids, and mountain magic for adventure seekers ⛰️',
    ai_insights: ['AI predicts this route will be 25% pricier by December due to snowfall access', 'Solo travellers save ₹4,000 by joining group departures', 'Best time: October–June (avoid monsoon season)', '85% of reviewers say the Rohtang sunrise was worth waking up at 4 AM'],
    rating: 4.8, reviews_count: 892,
    is_trending: true, is_ai_recommended: true, is_bestseller: false,
    departure_cities: ['Delhi', 'Mumbai', 'Chandigarh'],
    visa_required: false, cancellation_policy: 'partial',
  },
  {
    id: 'pkg-003',
    title: 'Kerala Backwater Bliss',
    destinations: ['Kochi', 'Alleppey', 'Munnar'],
    primary_destination: 'Kerala',
    duration_nights: 4, duration_days: 5,
    type: 'luxury', category: 'domestic',
    tags: ['backwaters', 'luxury', 'couple', 'honeymoon', 'wellness'],
    price_per_person: 32999, original_price: 41999, total_price: 65998, savings: 18000,
    inclusions: { flights: true, hotel_stars: 5, meals: 'all_inclusive', transfers: true, tours: true, visa_assistance: false, activities: ['Houseboat night stay', 'Ayurvedic spa', 'Tea estate tour', 'Kathakali show'] },
    itinerary: [
      { day: 1, title: 'Kochi — Fort & Flavours', description: 'Arrive in Kochi and explore the historic Fort Kochi district.', activities: ['Fort Kochi walk', 'Chinese fishing nets', 'Mattancherry spice market', 'Kathakali dance show'], meals: ['Dinner'], accommodation: '5★ Heritage Hotel', highlight: 'Kathakali performance' },
      { day: 2, title: 'Alleppey Houseboat', description: 'Board your private luxury houseboat and cruise the emerald backwaters.', activities: ['Houseboat check-in', 'Backwater cruise', 'Village visits from boat', 'Sunset on deck'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: 'Luxury Houseboat', highlight: 'Private backwater cruise' },
      { day: 3, title: 'Munnar Tea Hills', description: 'Drive through mist-covered tea estates to scenic Munnar.', activities: ['Tea museum visit', 'Tea estate walk', 'Eravikulam National Park', 'Spice garden'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: '5★ Tea Estate Resort', highlight: 'Sunrise over tea gardens' },
      { day: 4, title: 'Wellness & Ayurveda', description: 'Full-day Ayurvedic spa experience at your resort.', activities: ['Ayurvedic consultation', 'Signature Abhyanga massage', 'Yoga session', 'Waterfall trek'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: '5★ Tea Estate Resort', highlight: 'Signature Ayurveda spa' },
      { day: 5, title: 'Departure from Cochin', description: 'Morning checkout and transfer to Cochin International Airport.', activities: ['Breakfast', 'Final shopping', 'Airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Glide through emerald backwaters in a private houseboat — pure Kerala magic 🌴',
    ai_insights: ['Honeymoon couples get complimentary room decoration on request', 'Post-monsoon (Sept–Oct) = lush green scenery at lower prices', 'This package saves ₹18,000 vs booking independently', 'Most popular among Desi couples for first anniversary'],
    rating: 4.9, reviews_count: 634,
    is_trending: false, is_ai_recommended: true, is_bestseller: true,
    departure_cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'],
    visa_required: false, cancellation_policy: 'free',
  },
  {
    id: 'pkg-004',
    title: 'Rajasthan Royal Heritage',
    destinations: ['Jaipur', 'Jodhpur', 'Udaipur'],
    primary_destination: 'Jaipur',
    duration_nights: 6, duration_days: 7,
    type: 'premium', category: 'domestic',
    tags: ['heritage', 'culture', 'family', 'luxury', 'history'],
    price_per_person: 35999, original_price: 44999, total_price: 71998, savings: 18000,
    inclusions: { flights: true, hotel_stars: 4, meals: 'breakfast_dinner', transfers: true, tours: true, visa_assistance: false, activities: ['Palace tours', 'Camel safari', 'Puppet show', 'Mehrangarh Fort tour', 'Lake Pichola boat ride'] },
    itinerary: [
      { day: 1, title: 'Jaipur — Pink City Arrival', description: 'Welcome to the Pink City! Check in and explore the vibrant bazaars.', activities: ['Hotel check-in', 'Hawa Mahal exterior', 'Johari Bazaar shopping', 'Welcome dinner'], meals: ['Dinner'], accommodation: '4★ Heritage Palace Hotel', highlight: 'Hawa Mahal at sunset' },
      { day: 2, title: 'Amber Fort & City Palace', description: 'Full day exploring Jaipur\'s magnificent Mughal and Rajput architecture.', activities: ['Amber Fort (elephant ride)', 'City Palace museum', 'Jantar Mantar observatory', 'Raj Mandir cinema exterior'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Heritage Palace Hotel', highlight: 'Elephant ride at Amber Fort' },
      { day: 3, title: 'Jodhpur — Blue City', description: 'Drive to Jodhpur, the majestic Blue City of Rajasthan.', activities: ['Scenic highway drive', 'Mehrangarh Fort tour', 'Jaswant Thada', 'Blue City old town walk'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Jodhpur Heritage Hotel', highlight: 'Mehrangarh Fort panorama' },
      { day: 4, title: 'Osian Desert & Camel Safari', description: 'Venture to the ancient desert town of Osian for a classic Rajasthani experience.', activities: ['Osian ancient temples', 'Camel safari at sunset', 'Desert camp dinner', 'Folk music evening'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Jodhpur Heritage Hotel', highlight: 'Camel safari at sunset' },
      { day: 5, title: 'Udaipur — Lake City', description: 'Arrive in Udaipur, the most romantic city in Rajasthan.', activities: ['Drive to Udaipur', 'Lake Pichola boat ride', 'City Palace visit', 'Sunset at Sajjangarh'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Lake View Hotel', highlight: 'Lake Pichola sunset cruise' },
      { day: 6, title: 'Udaipur Markets & Temples', description: 'Explore local havelis, temples, and the famous miniature painting art.', activities: ['Eklingji Temple', 'Miniature painting workshop', 'Hathi Pol Bazaar', 'Farewell Rajasthani dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Lake View Hotel' },
      { day: 7, title: 'Departure from Udaipur', description: 'Morning checkout and transfer to Udaipur airport.', activities: ['Breakfast', 'Hotel checkout', 'Airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Palaces, deserts, and lake views — live like royalty across 3 royal cities 👑',
    ai_insights: ['Winter (Nov–Feb) is peak season — these prices won\'t last', 'Family of 4 saves ₹12,000 with shared room options', 'Rajasthan Diwali festival packages book out 3 months early', 'AI finds this 22% cheaper than any OTA combination'],
    rating: 4.7, reviews_count: 1089,
    is_trending: true, is_ai_recommended: false, is_bestseller: true,
    departure_cities: ['Delhi', 'Mumbai', 'Bangalore'],
    visa_required: false, cancellation_policy: 'partial',
  },
  {
    id: 'pkg-005',
    title: 'Bali Island Bliss',
    destinations: ['Bali'],
    primary_destination: 'Bali',
    duration_nights: 6, duration_days: 7,
    type: 'standard', category: 'international',
    tags: ['beach', 'adventure', 'couple', 'temples', 'budget'],
    price_per_person: 44999, original_price: 58999, total_price: 89998, savings: 28000,
    inclusions: { flights: true, hotel_stars: 4, meals: 'breakfast', transfers: true, tours: true, visa_assistance: true, activities: ['Tegallalang Rice Terrace', 'Tanah Lot temple', 'Kecak dance show', 'ATV ride', 'White water rafting'] },
    itinerary: [
      { day: 1, title: 'Welcome to Bali', description: 'Land in Ngurah Rai airport and check in to your Ubud resort.', activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner', 'Seminyak beach walk'], meals: ['Dinner'], accommodation: '4★ Ubud Resort', highlight: 'Jungle resort welcome' },
      { day: 2, title: 'Ubud — Art & Culture', description: 'Explore the cultural heart of Bali — temples, rice terraces, and monkeys.', activities: ['Tegallalang Rice Terrace', 'Monkey Forest sanctuary', 'Ubud art market', 'Kecak fire dance'], meals: ['Breakfast'], accommodation: '4★ Ubud Resort', highlight: 'Kecak fire dance at sunset' },
      { day: 3, title: 'Temple Hopping & Volcano', description: 'Chase Bali\'s most iconic temples and watch sunrise over Mt. Batur.', activities: ['Mt. Batur sunrise trek', 'Tanah Lot sea temple', 'Uluwatu cliff temple', 'Jimbaran seafood dinner'], meals: ['Breakfast'], accommodation: '4★ Ubud Resort', highlight: 'Mt. Batur sunrise trek' },
      { day: 4, title: 'Adventure Day', description: 'White water rafting on Ayung river and ATV jungle ride.', activities: ['Ayung river rafting', 'ATV rice field ride', 'Spa & massage afternoon'], meals: ['Breakfast'], accommodation: '4★ Beach Club Hotel', highlight: 'Ayung river rapids' },
      { day: 5, title: 'Seminyak & Beaches', description: 'Beach clubs, surfing lessons, and Seminyak\'s famous sunset strip.', activities: ['Surfing lesson (beginner)', 'Seminyak beach club', 'Ku De Ta sunset', 'Spa massage'], meals: ['Breakfast'], accommodation: '4★ Beach Club Hotel' },
      { day: 6, title: 'Nusa Penida Day Trip', description: 'Day trip to the dramatic Nusa Penida island — Instagram paradise.', activities: ['Speed boat to Nusa Penida', 'Kelingking beach', 'Angel\'s Billabong', 'Crystal Bay snorkeling'], meals: ['Breakfast'], accommodation: '4★ Beach Club Hotel', highlight: 'Kelingking cliff viewpoint' },
      { day: 7, title: 'Departure', description: 'Morning at leisure then transfer to airport.', activities: ['Breakfast', 'Last-minute shopping', 'Airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Temples, rice terraces, and beach clubs — Bali does it all at Desi prices 🌺',
    ai_insights: ['Visa on arrival included — zero paperwork hassle', 'Most popular Indian honeymoon destination in SE Asia', 'Monsoon (Jun–Aug) is surprisingly affordable and green', 'This package is ₹14,000 cheaper than booking via traditional agents'],
    rating: 4.7, reviews_count: 2341,
    is_trending: true, is_ai_recommended: true, is_bestseller: true,
    departure_cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'],
    visa_required: true, cancellation_policy: 'free',
  },
  {
    id: 'pkg-006',
    title: 'Maldives Honeymoon',
    destinations: ['Maldives'],
    primary_destination: 'Maldives',
    duration_nights: 4, duration_days: 5,
    type: 'luxury', category: 'international',
    tags: ['honeymoon', 'luxury', 'beach', 'overwater', 'couple'],
    price_per_person: 89999, original_price: 1,
    total_price: 179998, savings: 30000,
    inclusions: { flights: true, hotel_stars: 5, meals: 'all_inclusive', transfers: true, tours: false, visa_assistance: false, activities: ['Snorkeling', 'Sunset cruise', 'Dolphin watching', 'Underwater restaurant dinner', 'Couples spa'] },
    itinerary: [
      { day: 1, title: 'Arrival by Seaplane', description: 'Land in Malé and transfer by private seaplane to your overwater villa.', activities: ['Malé airport arrival', 'Private seaplane transfer', 'Water villa check-in', 'Sunset champagne welcome'], meals: ['Dinner'], accommodation: '5★ Overwater Bungalow', highlight: 'Seaplane arrival over blue lagoon' },
      { day: 2, title: 'Snorkeling & Relaxation', description: 'House reef snorkeling at sunrise, couples spa, and sunset cruise.', activities: ['House reef snorkeling', 'Sunrise yoga', 'Couples spa treatment', 'Sunset dolphin cruise'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: '5★ Overwater Bungalow', highlight: 'Dolphin sunset cruise' },
      { day: 3, title: 'Private Island Picnic', description: 'A secluded deserted island lunch experience arranged exclusively for two.', activities: ['Private island boat picnic', 'Coral reef diving (beginner)', 'Private beach bonfire', 'Underwater restaurant dinner'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: '5★ Overwater Bungalow', highlight: 'Private island picnic' },
      { day: 4, title: 'Spa & Free Exploration', description: 'Full day at leisure — spa, pool, or guided snorkeling with marine biologist.', activities: ['Overwater spa session', 'Glass-bottom kayaking', 'Coral garden snorkeling', 'Beach bonfire farewell'], meals: ['Breakfast', 'Lunch', 'Dinner'], accommodation: '5★ Overwater Bungalow' },
      { day: 5, title: 'Departure', description: 'Seaplane back to Malé for your homeward flight.', activities: ['Final breakfast on deck', 'Seaplane transfer', 'Malé shopping'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Your overwater villa awaits — the honeymoon Bollywood heroes dream of 💍',
    ai_insights: ['December–April is perfect — crystal-clear water guaranteed', 'All-inclusive saves ₹25,000+ vs resort dining à la carte', 'AI found an overwater villa upgrade available — limited dates', 'Most booked by newly married couples from Delhi & Mumbai'],
    rating: 4.9, reviews_count: 412,
    is_trending: false, is_ai_recommended: true, is_bestseller: false,
    departure_cities: ['Mumbai', 'Delhi', 'Bangalore'],
    visa_required: false, cancellation_policy: 'partial',
  },
  {
    id: 'pkg-007',
    title: 'Dubai Family Extravaganza',
    destinations: ['Dubai'],
    primary_destination: 'Dubai',
    duration_nights: 5, duration_days: 6,
    type: 'premium', category: 'international',
    tags: ['family', 'adventure', 'luxury', 'theme-parks', 'shopping'],
    price_per_person: 52999, original_price: 67999, total_price: 105998, savings: 30000,
    inclusions: { flights: true, hotel_stars: 4, meals: 'breakfast', transfers: true, tours: true, visa_assistance: true, activities: ['Burj Khalifa (148F)', 'Desert safari', 'Dubai Parks tickets', 'Dubai Mall & fountain show', 'Dhow cruise dinner'] },
    itinerary: [
      { day: 1, title: 'Arrival in Dubai', description: 'Land at DXB and check in to your 4-star hotel near Downtown Dubai.', activities: ['Airport pickup', 'Hotel check-in', 'Dubai Mall exploration', 'Dubai Fountain show'], meals: ['Dinner'], accommodation: '4★ Downtown Hotel', highlight: 'Dubai Fountain night show' },
      { day: 2, title: 'Burj Khalifa & Downtown', description: 'Sky-high views, world-class shopping, and the world\'s best aquarium.', activities: ['Burj Khalifa 148th floor', 'Dubai Aquarium', 'Gold Souk & Spice Souk', 'Dhow cruise dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Downtown Hotel', highlight: 'Burj Khalifa 148F observation deck' },
      { day: 3, title: 'Desert Safari', description: 'Dune bashing, camel rides, and a traditional Bedouin camp experience.', activities: ['4x4 dune bashing', 'Camel ride', 'Sandboarding', 'Bedouin camp BBQ dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '4★ Downtown Hotel', highlight: 'Dune bashing at sunset' },
      { day: 4, title: 'Dubai Parks & Resorts', description: 'Full day at Motiongate / Legoland / Bollywood Parks (family\'s choice).', activities: ['Full day at Dubai Parks', 'Theme park rides', 'Character meets'], meals: ['Breakfast'], accommodation: '4★ Downtown Hotel', highlight: 'Theme park day' },
      { day: 5, title: 'Palm Jumeirah & The Beach', description: 'Atlantis The Palm, waterpark, and JBR beach.', activities: ['Atlantis Aquaventure Waterpark', 'Palm Monorail', 'JBR The Beach', 'Bluewaters Island'], meals: ['Breakfast'], accommodation: '4★ Downtown Hotel', highlight: 'Atlantis waterpark' },
      { day: 6, title: 'Departure', description: 'Final Dubai shopping and airport transfer.', activities: ['Breakfast', 'Last shopping', 'Duty-free', 'Airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'The world\'s most thrilling city — where family fun meets futuristic luxury 🏙️',
    ai_insights: ['Visa for Indians processed in 48 hours — fully managed by us', 'Oct–Apr is peak season — book early for best hotel rates', 'Family of 4 saves ₹22,000 vs booking each component separately', 'Dubai Parks tickets included — saves ₹8,000 at gate price'],
    rating: 4.8, reviews_count: 1876,
    is_trending: true, is_ai_recommended: false, is_bestseller: true,
    departure_cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'],
    visa_required: true, cancellation_policy: 'free',
  },
  {
    id: 'pkg-008',
    title: 'Ladakh Expedition',
    destinations: ['Leh', 'Nubra Valley', 'Pangong Lake'],
    primary_destination: 'Ladakh',
    duration_nights: 7, duration_days: 8,
    type: 'premium', category: 'domestic',
    tags: ['adventure', 'mountains', 'solo', 'expedition', 'photography'],
    price_per_person: 34999, original_price: 43999, total_price: 69998, savings: 18000,
    inclusions: { flights: true, hotel_stars: 3, meals: 'breakfast_dinner', transfers: true, tours: true, visa_assistance: false, activities: ['Khardung La pass (world\'s highest motorable road)', 'Nubra Valley camel ride', 'Pangong Lake camping', 'Diskit Monastery', 'Magnetic Hill'] },
    itinerary: [
      { day: 1, title: 'Fly to Leh — Acclimatize', description: 'Land at Leh airport (11,000 ft) and rest for altitude acclimatization.', activities: ['Flight to Leh', 'Hotel check-in', 'Rest & acclimatization', 'Leh Market walk (evening)'], meals: ['Dinner'], accommodation: '3★ Leh Hotel', highlight: 'First Himalayan panorama' },
      { day: 2, title: 'Leh Palace & Monasteries', description: 'Explore Leh\'s ancient monasteries and the hilltop Leh Palace.', activities: ['Leh Palace', 'Namgyal Tsemo Monastery', 'Hall of Fame museum', 'Local Thali dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '3★ Leh Hotel' },
      { day: 3, title: 'Khardung La & Nubra Valley', description: 'Cross the world\'s highest motorable road (18,380 ft) into Nubra Valley.', activities: ['Khardung La Pass', 'Diskit Monastery', 'Hunder sand dunes', 'Bactrian camel ride'], meals: ['Breakfast', 'Dinner'], accommodation: 'Nubra Camp', highlight: 'Khardung La — 18,380 ft' },
      { day: 4, title: 'Nubra & Siachen Glacier View', description: 'Morning meditation at sunrise, Siachen glacier viewpoint, and local village.', activities: ['Siachen base view', 'Sumur Monastery', 'Shyok river valley'], meals: ['Breakfast', 'Dinner'], accommodation: 'Nubra Camp' },
      { day: 5, title: 'Drive to Pangong Lake', description: 'The legendary 130km journey to the world\'s highest saltwater lake.', activities: ['Scenic mountain drive', 'Pangong Tso arrival', 'Lakeside photography', 'Stargazing night'], meals: ['Breakfast', 'Dinner'], accommodation: 'Pangong Lake Camp', highlight: 'Pangong blue lake at sunset' },
      { day: 6, title: 'Pangong Sunrise & Return', description: 'Capture sunrise over the changing blue-green Pangong and drive to Leh.', activities: ['Sunrise photography', 'Changthang wildlife spotting', 'Hemis Monastery en route'], meals: ['Breakfast', 'Dinner'], accommodation: '3★ Leh Hotel', highlight: 'Pangong sunrise — 14,000 ft' },
      { day: 7, title: 'Magnetic Hill & Gurudwara', description: 'Last day exploring the mystical Magnetic Hill and Pathar Sahib Gurudwara.', activities: ['Magnetic Hill', 'Gurudwara Pathar Sahib', 'Leh bazaar final shopping', 'Farewell dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '3★ Leh Hotel' },
      { day: 8, title: 'Departure', description: 'Early morning transfer to Leh airport.', activities: ['Breakfast', 'Hotel checkout', 'Airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'The last great frontier — land of high passes, blue lakes, and zero crowds 🏔️',
    ai_insights: ['Permit for Nubra & Pangong fully arranged — no paperwork for you', 'Road opens June–October — AI recommends July for best weather', 'Solo travellers join group departures and save ₹6,000', 'Photography packages available — drone permits arranged on request'],
    rating: 4.9, reviews_count: 567,
    is_trending: true, is_ai_recommended: true, is_bestseller: false,
    departure_cities: ['Delhi', 'Mumbai', 'Chandigarh'],
    visa_required: false, cancellation_policy: 'partial',
  },
  {
    id: 'pkg-009',
    title: 'Thailand Family Adventure',
    destinations: ['Bangkok', 'Pattaya', 'Phuket'],
    primary_destination: 'Bangkok',
    duration_nights: 6, duration_days: 7,
    type: 'standard', category: 'international',
    tags: ['family', 'adventure', 'beach', 'temples', 'budget'],
    price_per_person: 54999, original_price: 69999, total_price: 109998, savings: 30000,
    inclusions: { flights: true, hotel_stars: 4, meals: 'breakfast', transfers: true, tours: true, visa_assistance: true, activities: ['Grand Palace tour', 'Coral Island speedboat', 'Safari World Bangkok', 'Phi Phi Island day trip', 'Thai cooking class'] },
    itinerary: [
      { day: 1, title: 'Welcome to Bangkok', description: 'Land at Suvarnabhumi and check in to your city hotel.', activities: ['Airport transfer', 'Hotel check-in', 'Asiatique riverside market', 'Thai dinner'], meals: ['Dinner'], accommodation: '4★ Bangkok Hotel', highlight: 'Asiatique night market' },
      { day: 2, title: 'Royal Bangkok', description: 'Grand Palace, Wat Pho, and a Chao Phraya river cruise.', activities: ['Grand Palace & Emerald Buddha', 'Wat Pho (Reclining Buddha)', 'Chao Phraya river cruise', 'Khao San Road evening'], meals: ['Breakfast'], accommodation: '4★ Bangkok Hotel', highlight: 'Grand Palace golden spires' },
      { day: 3, title: 'Pattaya — Coral Island', description: 'Drive to Pattaya and speedboat to Coral Island for water sports.', activities: ['Speedboat to Coral Island', 'Parasailing & snorkeling', 'Underwater world Pattaya', 'Walking Street evening'], meals: ['Breakfast'], accommodation: '4★ Pattaya Resort', highlight: 'Coral Island water sports' },
      { day: 4, title: 'Fly to Phuket', description: 'Morning flight to Phuket and check in near Patong Beach.', activities: ['Flight to Phuket', 'Hotel check-in', 'Patong Beach', 'Bangla Road evening'], meals: ['Breakfast'], accommodation: '4★ Phuket Beach Resort', highlight: 'Phuket beach arrival' },
      { day: 5, title: 'Phi Phi Island Day Trip', description: 'The iconic day trip to Maya Bay and Phi Phi Island.', activities: ['Speedboat to Phi Phi', 'Maya Bay (The Beach)', 'Snorkeling at coral reefs', 'Viking Cave viewpoint'], meals: ['Breakfast', 'Lunch'], accommodation: '4★ Phuket Beach Resort', highlight: 'Maya Bay — turquoise perfection' },
      { day: 6, title: 'Big Buddha & Night Bazaar', description: 'Visit Big Buddha, Promthep Cape, and the famous Phuket Night Bazaar.', activities: ['Big Buddha temple', 'Promthep Cape sunset', 'Phuket Night Bazaar', 'Thai cooking class'], meals: ['Breakfast'], accommodation: '4★ Phuket Beach Resort' },
      { day: 7, title: 'Departure', description: 'Final morning at Phuket airport.', activities: ['Breakfast', 'Hotel checkout', 'Phuket airport transfer'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Temples, beaches, and Tom Yum soup — Thailand delivers max fun for Desi families 🐘',
    ai_insights: ['Visa on arrival for Indians — no advance application needed', '3 cities in 7 days — our most family-loved international route', 'Book Sept–Nov for off-season prices without sacrificing weather', 'Kids under 5 fly and stay free when sharing parents\' room'],
    rating: 4.6, reviews_count: 2187,
    is_trending: true, is_ai_recommended: true, is_bestseller: true,
    departure_cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'],
    visa_required: true, cancellation_policy: 'free',
  },
  {
    id: 'pkg-010',
    title: 'Switzerland Scenic Express',
    destinations: ['Zurich', 'Interlaken', 'Lucerne', 'Zermatt'],
    primary_destination: 'Amsterdam',
    duration_nights: 8, duration_days: 9,
    type: 'luxury', category: 'international',
    tags: ['luxury', 'mountains', 'couple', 'honeymoon', 'trains', 'scenic'],
    price_per_person: 149999, original_price: 189999, total_price: 299998, savings: 80000,
    inclusions: { flights: true, hotel_stars: 5, meals: 'breakfast_dinner', transfers: true, tours: true, visa_assistance: true, activities: ['Swiss Travel Pass', 'Glacier Express', 'Jungfraujoch (Top of Europe)', 'Matterhorn Glacier Paradise', 'Lake Geneva cruise', 'Rhine Falls visit'] },
    itinerary: [
      { day: 1, title: 'Land in Zurich', description: 'Land at Zurich International and check in to your 5-star city hotel.', activities: ['ZRH airport transfer', 'Hotel check-in', 'Zurich old town walk', 'Rhine waterfront dinner'], meals: ['Dinner'], accommodation: '5★ Zurich Hotel', highlight: 'Zurich old town charm' },
      { day: 2, title: 'Lucerne — Chapel Bridge', description: 'Day trip to the postcard-perfect city of Lucerne.', activities: ['Train to Lucerne (Swiss Pass)', 'Chapel Bridge & Water Tower', 'Lion Monument', 'Lake Lucerne boat cruise'], meals: ['Breakfast', 'Dinner'], accommodation: '5★ Zurich Hotel', highlight: 'Chapel Bridge reflection' },
      { day: 3, title: 'Interlaken — Adventure Capital', description: 'Move to Interlaken, gateway to the Swiss Alps.', activities: ['Train to Interlaken', 'Hotel check-in', 'Harder Kulm viewpoint', 'Paragliding over Eiger (optional)'], meals: ['Breakfast', 'Dinner'], accommodation: '5★ Interlaken Hotel', highlight: 'Eiger, Mönch & Jungfrau panorama' },
      { day: 4, title: 'Jungfraujoch — Top of Europe', description: 'Ascend by cog railway to the highest train station in Europe at 3,454m.', activities: ['Cog train to Jungfraujoch', 'Snow fun at 3,454m', 'Aletsch Glacier view', 'Ice Palace walk'], meals: ['Breakfast', 'Dinner'], accommodation: '5★ Interlaken Hotel', highlight: 'Jungfraujoch — 3,454m above sea level' },
      { day: 5, title: 'Grindelwald & Lauterbrunnen', description: 'Valley of 72 waterfalls and the classic Grindelwald village.', activities: ['Lauterbrunnen valley', 'Staubach Falls', 'Grindelwald village walk', 'Fondue dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '5★ Interlaken Hotel' },
      { day: 6, title: 'Glacier Express to Zermatt', description: 'Board the famous Glacier Express through 91 tunnels and 291 bridges.', activities: ['Glacier Express (panoramic)', 'Scenic alpine photography', 'Zermatt arrival (car-free village)', 'Matterhorn first view'], meals: ['Breakfast', 'Dinner'], accommodation: '5★ Zermatt Hotel', highlight: 'Glacier Express panoramic train' },
      { day: 7, title: 'Matterhorn Glacier Paradise', description: 'Cable car to 3,883m — the highest viewpoint in the Alps.', activities: ['Matterhorn Glacier Paradise cable car', 'Alpine sensation experience', 'Skiing / snowshoeing', 'Zermatt village shopping'], meals: ['Breakfast', 'Dinner'], accommodation: '5★ Zermatt Hotel', highlight: 'Matterhorn at golden hour' },
      { day: 8, title: 'Geneva & Lake Cruise', description: 'Train to Geneva for the famous Jet d\'Eau and lakeside luxury.', activities: ['Train to Geneva', 'Jet d\'Eau fountain', 'Lake Geneva cruise', 'Geneva shopping & farewell dinner'], meals: ['Breakfast', 'Dinner'], accommodation: '5★ Geneva Hotel', highlight: 'Jet d\'Eau & Lake Geneva' },
      { day: 9, title: 'Departure from Geneva', description: 'Transfer to Geneva airport for your flight home.', activities: ['Breakfast', 'GVA airport transfer', 'Duty-free shopping'], meals: ['Breakfast'], accommodation: '' },
    ],
    ai_summary: 'Glacier trains, Alpine peaks, and Swiss luxury — Europe\'s most jaw-dropping journey 🏔️',
    ai_insights: ['Schengen visa fully managed — guaranteed within 10 working days', 'Swiss Travel Pass covers all trains, buses, and boats — zero surprises', 'Dec–Mar = ski season magic; Jun–Sep = green valleys and hiking', 'Most aspirational bucket-list trip for Indian couples in their 30s'],
    rating: 4.9, reviews_count: 298,
    is_trending: false, is_ai_recommended: true, is_bestseller: false,
    departure_cities: ['Mumbai', 'Delhi'],
    visa_required: true, cancellation_policy: 'partial',
  },
]

// ── Mock Deals ────────────────────────────────────────────────────────────────

const addHours = (h: number) => new Date(Date.now() + h * 3600 * 1000).toISOString()
const addDays  = (d: number) => new Date(Date.now() + d * 86400 * 1000).toISOString()

export const MOCK_DEALS: Deal[] = [
  {
    id: 'deal-001', package_id: 'pkg-005', package_title: 'Bali Island Bliss',
    destination: 'Bali', original_price: 58999, deal_price: 44999,
    discount_percent: 24, discount_amount: 14000,
    deal_type: 'flash', expires_at: addHours(9),
    description: '24-hour flash sale — only 8 seats remaining at this price',
    ai_insight: 'AI detected a 24% price drop on this route — lowest in 6 months', seats_left: 8,
  },
  {
    id: 'deal-002', package_id: 'pkg-007', package_title: 'Dubai Family Extravaganza',
    destination: 'Dubai', original_price: 67999, deal_price: 52999,
    discount_percent: 22, discount_amount: 15000,
    deal_type: 'seasonal', expires_at: addDays(3),
    description: 'Summer school holiday special — family packages at record-low prices',
    ai_insight: 'Dubai sees 22% summer drop — families booking 3 months early get best deals',
  },
  {
    id: 'deal-003', package_id: 'pkg-001', package_title: 'Goa Sun & Sand Escape',
    destination: 'Goa', original_price: 16999, deal_price: 10999,
    discount_percent: 35, discount_amount: 6000,
    deal_type: 'last_minute', expires_at: addHours(36),
    description: 'Last-minute cancellation — 3 rooms just freed up for this weekend',
    ai_insight: 'Last-minute Goa packages average 35% off — act fast', seats_left: 3,
  },
  {
    id: 'deal-004', package_id: 'pkg-009', package_title: 'Thailand Family Adventure',
    destination: 'Bangkok', original_price: 69999, deal_price: 54999,
    discount_percent: 21, discount_amount: 15000,
    deal_type: 'early_bird', expires_at: addDays(7),
    description: 'Book December travel now and save ₹15,000 per person',
    ai_insight: 'Thailand peak season packages sell out by September — 21% early-bird saving',
  },
  {
    id: 'deal-005', package_id: 'pkg-002', package_title: 'Manali Snow Adventure',
    destination: 'Manali', original_price: 29999, deal_price: 19999,
    discount_percent: 33, discount_amount: 10000,
    deal_type: 'flash', expires_at: addHours(6),
    description: 'Weekend flash sale — snow season packages at monsoon prices',
    ai_insight: 'Snow season Manali typically costs ₹10k more — lock in now', seats_left: 12,
  },
  {
    id: 'deal-006', package_id: 'pkg-003', package_title: 'Kerala Backwater Bliss',
    destination: 'Kerala', original_price: 41999, deal_price: 29999,
    discount_percent: 29, discount_amount: 12000,
    deal_type: 'seasonal', expires_at: addDays(5),
    description: 'Post-monsoon special — lush greenery, lower prices, fewer crowds',
    ai_insight: 'Sep–Oct Kerala offers 30% savings with the same or better scenery',
  },
]

export function getPackageById(id: string): TravelPackage | undefined {
  return MOCK_PACKAGES.find(p => p.id === id)
}

export function filterPackages(packages: TravelPackage[], filters: {
  category?: PackageCategory | 'all'
  type?: PackageType | 'all'
  maxBudget?: number
  tag?: string
  search?: string
}): TravelPackage[] {
  return packages.filter(p => {
    if (filters.category && filters.category !== 'all' && p.category !== filters.category) return false
    if (filters.type && filters.type !== 'all' && p.type !== filters.type) return false
    if (filters.maxBudget && p.price_per_person > filters.maxBudget) return false
    if (filters.tag && !p.tags.includes(filters.tag)) return false
    if (filters.search) {
      const q = filters.search.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.destinations.some(d => d.toLowerCase().includes(q))) return false
    }
    return true
  })
}
