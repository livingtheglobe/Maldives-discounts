export interface Season {
  name: string;
  from: string; // "YYYY-MM-DD"
  to: string;
  rates: {
    [roomType: string]: number; // Base Double Rate per night
  };
}

export interface MealPlan {
  id: string;
  name: string;
  adultSupplement: number;
  childSupplement: number; 
  roomTypeOverrides?: {
    [roomType: string]: {
      adultSupplement: number;
      childSupplement: number;
    };
  };
}

export interface TransferOption {
  id: string;
  name: string;
  adultRate: number;
  childRate: number; 
  infantRate: number;
  isPerBoat?: boolean; 
  fromMonthDay?: string; // "MM-DD"
  toMonthDay?: string;   // "MM-DD"
}

export interface AgePolicy {
  minAge: number;
  maxAge: number; 
  name: string; 
  greenTax: boolean; 
  transferChargeable: boolean; 
  mealChargeable: boolean;
  bedChargeable: boolean; 
}

export interface Occasion {
  id: string;
  date: string; // MM-DD
  name: string;
  adultSupplement: number;
  childSupplement: number;
  optional?: boolean; 
}

export interface MinStayPolicy {
  start: string; // MM-DD
  end: string;   // MM-DD
  nights: number;
}

export interface Guest {
  id: string;
  type: 'adult' | 'child' | 'infant';
  age: number | null; 
}

export interface RoomConfig {
  id: string;
  roomType: string;
  guests: Guest[];
}

export interface BlackoutRange {
  from: string;
  to: string;
}

export interface Hotel {
  id: string;
  name: string;
  atoll: string;
  island: string;
  logoUrl?: string;
  bookingEmail?: string;
  bookingCC?: string;
  whatsapp?: string;
  websiteUrl?: string;
  mapUrl?: string;
  roomTypes: string[];
  rules: {
    singleReduction: number;
    extraAdultSupplement: number;
    extraChildSupplement: number;
    greenTaxPerNight: number;
    serviceChargePercent: number;
    tgstPercent: number;
    agePolicies: AgePolicy[];
    occasions: Occasion[];
    minStayPolicies?: MinStayPolicy[];
  };
  transfers: TransferOption[];
  mealPlans: MealPlan[];
  seasons: Season[];
  blackoutDates?: { [roomType: string]: BlackoutRange[] };
  specialOffer?: string; 
  tieredOffers?: { minNights: number; maxNights?: number; discountPercentage: number }[];
  promoCode?: string;
}

export interface QuoteRequest {
  hotelId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  rooms: RoomConfig[];
  mealPlanId: string;
  transferId: string;
  selectedOccasionIds: string[];
  celebrations?: {
    birthday: boolean;
    anniversary: boolean;
  };
  celebrationDate?: string;
  specialRequests?: string;
  guestNames?: string;
  customerEmail?: string;
}

export interface CostBreakdown {
  totalRoomCost: number;
  totalMealCost: number;
  totalTransferCost: number;
  totalGreenTax: number;
  totalOccasionSupplements: number;
  grandTotal: number;
  nights: number;
  details: {
    roomBreakdown: { roomType: string; cost: number }[];
    supplements: string[];
  };
}