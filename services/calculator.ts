import { Hotel, QuoteRequest, CostBreakdown, AgePolicy, RoomConfig } from '../types';

const getPolicy = (age: number | null, policies: AgePolicy[]) => {
  const safeAge = age ?? 30;
  // If no policies defined, assume standard adult charging rules
  if (!policies || policies.length === 0) return { name: "Adult", minAge: 0, maxAge: 99, greenTax: true, transferChargeable: true, mealChargeable: true, bedChargeable: true };
  return policies.find(p => safeAge >= p.minAge && safeAge <= p.maxAge);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

export const calculateRoomNightCost = (hotel: Hotel, room: RoomConfig, date: Date, totalNights: number = 0): number => {
  const dateStr = date.toISOString().split('T')[0];
  const season = hotel.seasons.find(s => dateStr >= s.from && dateStr <= s.to);
  if (!season) return 0;

  const occupants = room.guests.filter(g => (g.age ?? 30) >= 2).length;
  const adultsCount = room.guests.filter(g => {
    const policy = getPolicy(g.age, hotel.rules.agePolicies);
    return policy?.name === 'Adult';
  }).length;
  
  // 1. Baa Sand Maldives Specific Logic
  if (hotel.id === 'baa-sand-maldives') {
    const adults = room.guests.filter(g => (g.age ?? 30) >= 11).length;
    const kids3to10 = room.guests.filter(g => (g.age ?? 0) >= 3 && (g.age ?? 0) < 11).length;
    const infants = room.guests.filter(g => (g.age ?? 0) < 3).length;

    let baseRate = 0;
    if (room.roomType === 'Super Deluxe Triple Room') {
      baseRate = season.rates['Super Deluxe Triple Room'];
    } else {
      const occKey = adults === 1 ? 'Single' : 'Double';
      baseRate = season.rates[`${room.roomType} ${occKey}`] || 0;
    }

    let extraCost = 0;
    if (room.roomType === 'Super Deluxe Triple Room') {
      const extraAdults = Math.max(0, adults - 3);
      const remainingForKids = Math.max(0, 3 - adults);
      const extraKids = Math.max(0, kids3to10 - remainingForKids);
      extraCost = (extraAdults * 45) + (extraKids * 26);
    } else if (room.roomType === 'Family Room') {
      // Covers 2 adults + 1 infant + 1 child below 10 for free
      const extraAdults = Math.max(0, adults - 2);
      const extraKids = Math.max(0, kids3to10 - 1);
      extraCost = (extraAdults * 45) + (extraKids * 26);
    } else {
      // Standard occupancy covers 1 or 2 adults depending on baseRate
      const coveredAdults = adults === 1 ? 1 : 2;
      const extraAdults = Math.max(0, adults - coveredAdults);
      const extraKids = kids3to10;
      extraCost = (extraAdults * 45) + (extraKids * 26);
    }
    return baseRate + extraCost;
  }

  // 2. Chakz 1964 Specific Logic
  if (hotel.id === 'chakz-1964-beach') {
    const occKey = occupants === 1 ? 'Single' : (occupants === 2 ? 'Double' : 'Triple');
    let baseRate = season.rates[`${room.roomType} ${occKey}`] || 0;
    if (occupants > 3) {
      baseRate += (occupants - 3) * 15; // Extra child rate
    }
    return baseRate;
  }

  // 3. Jeym Lodge Specific Logic
  if (hotel.id === 'jeym-lodge-thoddoo') {
    const occKey = occupants === 1 ? 'Single' : (occupants === 2 ? 'Double' : 'Triple');
    let baseRate = season.rates[`${room.roomType} ${occKey}`] || 0;
    if (occupants > 3) baseRate += (occupants - 3) * 20;
    return baseRate;
  }

  // 4. Thundi Sea View Specific Logic
  if (hotel.id === 'thundi-sea-view') {
    const isDLX4 = room.roomType === 'Premium Sea View with Balcony';
    const baseType = isDLX4 ? 'Premium Sea View with Balcony' : 'Standard Sea View';
    const occKey = occupants === 1 ? 'Single' : 'Double';
    // We search the season for the relevant rate
    const baseRate = season.rates[`${baseType} ${occKey}`] || 0;
    let effectiveRate = baseRate;
    if (totalNights >= 7) effectiveRate -= 5; // Contract implies -5 for 7+ nights

    let extraCost = 0;
    if (occupants > 2) {
      room.guests.slice(2).forEach(g => {
        const age = g.age ?? 30;
        if (age >= 2 && age <= 3) extraCost += 6;
        else if (age >= 4 && age < 10) extraCost += 30;
        else if (age >= 10) extraCost += 50;
      });
    }
    return effectiveRate + extraCost;
  }

  // 5. Watercloud Specific Logic
  if (hotel.id === 'watercloud-mathiveri') {
    const baseRate = season.rates[room.roomType] || 0;
    const stdOcc = room.roomType.includes('Family') || room.roomType.includes('Suite') ? 3 : 2;
    let cost = baseRate;
    const extraAdults = Math.max(0, adultsCount - stdOcc);
    const extraKids = Math.max(0, occupants - Math.max(stdOcc, adultsCount));
    cost += (extraAdults * 30) + (extraKids * 15);
    return cost;
  }

  // 6. Ranvilu Specific Logic
  if (hotel.id === 'ranvilu-rv-thoddoo') {
    const a = room.guests.filter(g => (g.age ?? 30) >= 12).length;
    const k = room.guests.filter(g => (g.age ?? 0) >= 2 && (g.age ?? 0) < 12).length;
    if (a === 1 && k === 0) return season.rates['Standard Room - 1A'];
    if (a === 1 && k === 1) return season.rates['Standard Room - 1A+1K'];
    if (a === 1 && k === 2) return season.rates['Standard Room - 1A+2K'];
    if (a === 2 && k === 0) return season.rates['Standard Room - 2A'];
    if (a === 2 && k === 1) return season.rates['Standard Room - 2A+1K'];
    if (a === 2 && k === 2) return season.rates['Standard Room - 2A+2K'];
    if (a === 3 && k === 0) return season.rates['Standard Room - 3A'];
    return season.rates['Standard Room - 3A'] || 0;
  }

  // 7. Sands Specific Logic
  if (hotel.id.startsWith('sands-')) {
    const baseRate = season.rates[room.roomType] || 0;
    const kidsCount = room.guests.filter(g => {
      const p = getPolicy(g.age, hotel.rules.agePolicies);
      return p?.name === 'Child';
    }).length;
    if (kidsCount > 0) {
      // 50% discount logic for extra child
      return baseRate + (kidsCount * (baseRate / 2));
    }
    return baseRate;
  }

  // 8. Lagoon Villa Thoddoo Specific Logic
  if (hotel.id === 'lagoon-villa-thoddoo') {
    const baseRate = season.rates[room.roomType] || 0;
    const stdOcc = room.roomType === 'Deluxe Family Room' ? 3 : 2;
    let cost = baseRate;
    
    // Check if total occupants exceed standard occupancy for the room type
    if (room.guests.length > stdOcc) {
      // Sort guests by age descending to fill base occupancy with adults first
      const sortedGuests = [...room.guests].sort((a, b) => (b.age ?? 30) - (a.age ?? 30));
      const extraGuests = sortedGuests.slice(stdOcc);
      
      extraGuests.forEach(g => {
        const age = g.age ?? 30;
        if (age >= 2) {
          cost += 18; // Extra bed for adult/child
        } else {
          cost += 8; // Baby cot for infant
        }
      });
    }
    return cost;
  }

  // Standard Logic
  const baseRate = season.rates[room.roomType] || 0;
  let cost = occupants === 1 ? baseRate - hotel.rules.singleReduction : baseRate;
  if (occupants > 2) {
    cost += (Math.max(0, adultsCount - 2) * hotel.rules.extraAdultSupplement);
    const totalKidsCount = room.guests.filter(g => {
        const p = getPolicy(g.age, hotel.rules.agePolicies);
        return p?.name !== 'Adult' && (g.age ?? 30) >= 2;
    }).length;
    cost += (Math.max(0, occupants - Math.max(2, adultsCount)) * hotel.rules.extraChildSupplement);
  }
  return cost;
};

// Added rooms parameter to match usage in App.tsx and refined blackout logic to check specific selected room types
export const validateBookingRules = (hotel: Hotel, checkIn: Date | null, checkOut: Date | null, rooms: RoomConfig[]): string | null => {
  if (!checkIn || !checkOut) return null;
  const nights = Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000)));
  
  // Isla Blackout Check
  if (hotel.id === 'isla-retreat' && hotel.blackoutDates) {
    // Check blackout for selected rooms
    const selectedRoomTypes = Array.from(new Set(rooms.map(r => r.roomType)));
    for (const roomType of selectedRoomTypes) {
      const blackouts = hotel.blackoutDates[roomType] || [];
      for (const range of blackouts) {
        const fromDate = new Date(range.from);
        const toDate = new Date(range.to);
        if (checkIn <= toDate && checkOut >= fromDate) {
          return `${roomType} is closed during your selected dates.`;
        }
      }
    }
  }

  if (hotel.rules.minStayPolicies) {
    for (const policy of hotel.rules.minStayPolicies) {
      const [sm, sd] = policy.start.split('-').map(Number);
      const [em, ed] = policy.end.split('-').map(Number);
      const pStart = new Date(checkIn.getFullYear(), sm - 1, sd);
      const pEnd = new Date(checkIn.getFullYear(), em - 1, ed);
      if (checkIn <= pEnd && checkOut >= pStart && nights < policy.nights) {
        return `A minimum stay of ${policy.nights} nights is required for this period.`;
      }
    }
  }
  return null;
};

export const calculateQuote = (hotel: Hotel, request: QuoteRequest): CostBreakdown => {
  if (!request.checkIn || !request.checkOut) return { totalRoomCost: 0, totalMealCost: 0, totalTransferCost: 0, totalGreenTax: 0, totalOccasionSupplements: 0, grandTotal: 0, nights: 0, details: { roomBreakdown: [], supplements: [] } };
  const nights = Math.round(Math.abs((request.checkOut.getTime() - request.checkIn.getTime()) / (24 * 60 * 60 * 1000)));
  let totalRoomCost = 0, totalMealCost = 0, totalTransferCost = 0, totalGreenTax = 0, totalOccasionSupplements = 0;

  const mealPlan = hotel.mealPlans.find(mp => mp.id === request.mealPlanId);
  const transfer = hotel.transfers.find(t => t.id === request.transferId);

  request.rooms.forEach(room => {
    let roomPrice = 0;
    for (let i = 0; i < nights; i++) {
      const d = new Date(request.checkIn!.getTime() + (i * 24 * 60 * 60 * 1000));
      roomPrice += calculateRoomNightCost(hotel, room, d, nights);
      
      room.guests.forEach(g => {
        const age = g.age ?? 30;
        const policy = getPolicy(age, hotel.rules.agePolicies);
        
        // Green Tax logic: Per person per night if specified
        if (policy?.greenTax && hotel.rules.greenTaxPerNight > 0) {
          totalGreenTax += hotel.rules.greenTaxPerNight;
        }
        
        // Meal Plan supplements: Per person per night
        // Respecting hotel-specific adult/child threshold via policy name
        if (mealPlan && mealPlan.id !== 'bb' && (policy?.mealChargeable ?? true)) {
          totalMealCost += (policy?.name === 'Adult') ? mealPlan.adultSupplement : mealPlan.childSupplement;
        }
      });
    }
    totalRoomCost += roomPrice;

    // Transfers (Return assumed)
    room.guests.forEach(g => {
      if (!transfer || transfer.id === 'no-transfer') return;
      const age = g.age ?? 30;
      const policy = getPolicy(age, hotel.rules.agePolicies);
      if (hotel.id === 'ranvilu-rv-thoddoo') {
        const ow = age >= 12 ? 35 : (age >= 3 ? 20 : 0);
        totalTransferCost += (ow * 2);
      } else {
        totalTransferCost += (policy?.name === 'Adult') ? transfer.adultRate : (policy?.transferChargeable ? transfer.childRate : transfer.infantRate);
      }
    });
  });

  // Festive Supplements: Per person per stay
  hotel.rules.occasions.forEach(occ => {
    const [m, d] = occ.date.split('-').map(Number);
    const occDate = new Date(request.checkIn!.getFullYear(), m - 1, d);
    if (occDate >= request.checkIn! && occDate < request.checkOut!) {
      request.rooms.forEach(r => r.guests.forEach(g => {
        const policy = getPolicy(g.age, hotel.rules.agePolicies);
        totalOccasionSupplements += (policy?.name === 'Adult') ? occ.adultSupplement : occ.childSupplement;
      }));
    }
  });

  const taxFactor = 1 + ((hotel.rules.tgstPercent + hotel.rules.serviceChargePercent) / 100);
  totalRoomCost *= taxFactor;
  totalMealCost *= taxFactor;

  return { totalRoomCost, totalMealCost, totalTransferCost, totalGreenTax, totalOccasionSupplements, grandTotal: totalRoomCost + totalMealCost + totalTransferCost + totalGreenTax + totalOccasionSupplements, nights, details: { roomBreakdown: [], supplements: [] } };
};

export const getApplicableDiscount = (hotel: Hotel, nights: number): string => {
  // If we have specific nights, try to find the exact matching tier
  if (nights > 0 && hotel.tieredOffers && hotel.tieredOffers.length > 0) {
    const offer = hotel.tieredOffers.find(o => nights >= o.minNights && (o.maxNights ? nights <= o.maxNights : true));
    if (offer) return `${offer.discountPercentage}% OFF`;
  }

  // Fallback 1: If nights is 0 or no specific tier found, check if a specialOffer string is hardcoded
  if (hotel.specialOffer) return hotel.specialOffer;

  // Fallback 2: If no specialOffer string exists, but tieredOffers do, construct a range string
  if (hotel.tieredOffers && hotel.tieredOffers.length > 0) {
    const percentages = hotel.tieredOffers.map(o => o.discountPercentage);
    const min = Math.min(...percentages);
    const max = Math.max(...percentages);
    if (min === max) return `${min}% OFF`;
    return `${min}%-${max}% OFF`;
  }

  return '';
};
