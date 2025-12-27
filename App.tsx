
import { useState, useMemo, useEffect, useRef } from 'react';
import { Download, MapPin, Building2, Copy, MessageCircle, Tag, AlertTriangle, Check, User, Mail, X, ExternalLink, Info, Minus, Plus as PlusIcon, CheckCircle2, Cake, Globe } from 'lucide-react';
import { HOTELS } from './services/hotels';
import { RoomConfig, TransferOption } from './types';
import { calculateQuote, formatCurrency, formatDate, getApplicableDiscount, validateBookingRules } from './services/calculator';
import { generatePDF } from './services/pdfGenerator';
import { DateSelector } from './components/DateSelector';
import { RoomConfigurator } from './components/RoomConfigurator';
import { SearchHero } from './components/SearchHero';

const App: React.FC = () => {
  const [filterAtoll, setFilterAtoll] = useState('');
  const [filterIsland, setFilterIsland] = useState('');
  const [filterHotel, setFilterHotel] = useState('');
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [rooms, setRooms] = useState<RoomConfig[]>([{
    id: 'init', roomType: 'Standard Room', guests: [{ id: '1', type: 'adult', age: 30 }, { id: '2', type: 'adult', age: 30 }]
  }]);

  const [mealPlanId, setMealPlanId] = useState<string>('');
  const [transferId, setTransferId] = useState<string>(''); // Initialized as empty string
  const [selectedOccasionIds, setSelectedOccasionIds] = useState<string[]>([]);
  const [celebrations, setCelebrations] = useState({ birthday: false, anniversary: false });
  const [celebrationDate, setCelebrationDate] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [guestNameInputs, setGuestNameInputs] = useState<{[key: string]: string}>({});
  const [customerEmail, setCustomerEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const selectedHotel = useMemo(() => HOTELS.find(h => h.id === selectedHotelId), [selectedHotelId]);
  const hasRates = useMemo(() => selectedHotel ? selectedHotel.seasons.length > 0 : false, [selectedHotel]);
  
  const availableTransfers = useMemo(() => {
    if (!selectedHotel) return [];
    
    let base: TransferOption[] = [...selectedHotel.transfers];
    if (checkIn) {
      const m = checkIn.getMonth() + 1;
      const d = checkIn.getDate();
      const dateKey = `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      base = base.filter(t => {
        if (!t.fromMonthDay || !t.toMonthDay) return true;
        if (t.fromMonthDay <= t.toMonthDay) return dateKey >= t.fromMonthDay && dateKey <= t.toMonthDay;
        return dateKey >= t.fromMonthDay || dateKey <= t.toMonthDay;
      });
    }

    // Fix: Ensure "I will book my own transfer" is always an option even if not in data
    if (!base.some(t => t.id === 'no-transfer')) {
      base = [
        { id: 'no-transfer', name: 'I will book my own transfer', adultRate: 0, childRate: 0, infantRate: 0 },
        ...base
      ];
    }
    
    return base;
  }, [selectedHotel, checkIn]);

  useEffect(() => {
    // Fix: Remove auto-selection of first transfer. Only clear if current selection becomes invalid.
    if (transferId !== '' && availableTransfers.length > 0) {
      const currentValid = availableTransfers.some(t => t.id === transferId);
      if (!currentValid) setTransferId('');
    }
  }, [availableTransfers, transferId]);

  const calculatedNights = useMemo(() => {
    if (checkIn && checkOut) {
      const oneDay = 24 * 60 * 60 * 1000;
      return Math.round(Math.abs((checkOut.getTime() - checkIn.getTime()) / oneDay));
    }
    return 0;
  }, [checkIn, checkOut]);

  const minStayError = useMemo(() => (selectedHotel && checkIn && checkOut) ? validateBookingRules(selectedHotel, checkIn, checkOut, rooms) : null, [selectedHotel, checkIn, checkOut, rooms]);
  const quote = useMemo(() => (selectedHotel && hasRates && !minStayError) ? calculateQuote(selectedHotel, { hotelId: selectedHotel.id, checkIn, checkOut, rooms, mealPlanId, transferId, selectedOccasionIds }) : null, [selectedHotel, checkIn, checkOut, rooms, mealPlanId, transferId, selectedOccasionIds, hasRates, minStayError]);

  const currentDiscountPercent = useMemo(() => {
    if (!selectedHotel) return "0%";
    return getApplicableDiscount(selectedHotel, calculatedNights);
  }, [selectedHotel, calculatedNights]);

  const reachOutTemplate = useMemo(() => {
    if (!selectedHotel) return "";
    const adults = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type === 'adult').length, 0);
    const childrenCount = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type !== 'adult').length, 0);
    const childAges = rooms.flatMap(r => r.guests.filter(g => g.type !== 'adult').map(g => g.age)).join(', ');
    
    const promo = selectedHotel.promoCode || 'Living the Globe';

    if (hasRates) {
      return `Hi ${selectedHotel.name} Team,\n\nI would like to book a stay. I have attached the booking quote from my agent Living the Globe.\n\nPlease see all my travel dates and booking details and let me know if the selected room type is available for my travel dates.\n\nDates: ${checkIn ? formatDate(checkIn) : '[Dates]'} to ${checkOut ? formatDate(checkOut) : '[Dates]'} (${calculatedNights} Nights)\nGuests: ${adults} Adults, ${childrenCount} Children ${childrenCount > 0 ? `(Ages: ${childAges})` : ''}\nRoom Type: ${rooms.map(r => r.roomType).join(', ')}`;
    } else {
      const celebrationList = [];
      if (celebrations.birthday) celebrationList.push('Birthday');
      if (celebrations.anniversary) celebrationList.push('Anniversary');
      const celebrationSection = celebrationList.length > 0 
        ? `\nCelebration: ${celebrationList.join(' & ')}${celebrationDate ? ` on ${celebrationDate}` : ''}`
        : '';
      const requestsSection = specialRequests.trim() ? `\nSpecial Requests: ${specialRequests.trim()}` : '';

      return `Hi ${selectedHotel.name} Team,\n\nI found your property through Living the Globe. I would like to check availability for my travel dates:\n\nDates: ${checkIn ? formatDate(checkIn) : '[Dates]'} to ${checkOut ? formatDate(checkOut) : '[Dates]'} (${calculatedNights} Nights)\nGuests: ${adults} Adults, ${childrenCount} Children ${childrenCount > 0 ? `(Ages: ${childAges})` : ''}\nPromo Code: ${promo} - ${currentDiscountPercent}${celebrationSection}${requestsSection}\n\nPlease let me know if you have availability. Thank you!`;
    }
  }, [selectedHotel, checkIn, checkOut, calculatedNights, rooms, hasRates, currentDiscountPercent, specialRequests, celebrations, celebrationDate]);

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadClick = () => setShowPdfModal(true);

  const isModalValid = useMemo(() => {
    const email1 = customerEmail.trim().toLowerCase();
    const email2 = confirmEmail.trim().toLowerCase();
    const emailsMatch = email1 !== '' && email1 === email2;
    const allGuestsNamed = rooms.every(room => room.guests.every(guest => (guestNameInputs[`${room.id}-${guest.id}`] || '').trim().length >= 2));
    return emailsMatch && allGuestsNamed;
  }, [customerEmail, confirmEmail, rooms, guestNameInputs]);

  const triggerDownload = () => {
    if (!isModalValid) return;
    const combinedGuestNames = Object.entries(guestNameInputs).sort().map(([k, v]) => v || 'Guest').join(', ');
    if (selectedHotel && quote) {
      generatePDF(selectedHotel, { hotelId: selectedHotel.id, checkIn, checkOut, rooms, mealPlanId, transferId, selectedOccasionIds, celebrations, celebrationDate, specialRequests, guestNames: combinedGuestNames, customerEmail }, quote);
      setShowPdfModal(false);
    }
  };

  useEffect(() => {
    if (selectedHotel) {
      if (selectedHotel.mealPlans.length > 0) setMealPlanId(selectedHotel.mealPlans[0].id);
      // Fix: Don't automatically set transferId to the first option when switching hotels.
      setTransferId(''); 
      const updatedRooms = rooms.map(room => ({ ...room, roomType: selectedHotel.roomTypes.includes(room.roomType) ? room.roomType : selectedHotel.roomTypes[0] }));
      setRooms(updatedRooms);
      setSelectedOccasionIds([]); 
      setCelebrations({ birthday: false, anniversary: false }); 
      setCelebrationDate(''); 
      setSpecialRequests(''); 
      setGuestNameInputs({}); 
      setCustomerEmail(''); 
      setConfirmEmail('');
      setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [selectedHotelId]);

  const filteredHotels = useMemo(() => HOTELS.filter(h => (!filterAtoll || h.atoll === filterAtoll) && (!filterIsland || h.island === filterIsland) && (!filterHotel || h.name === filterHotel)), [filterAtoll, filterIsland, filterHotel]);

  const totals = useMemo(() => {
    const adults = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type === 'adult').length, 0);
    const children = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type !== 'adult').length, 0);
    const childrenList = rooms.flatMap(r => r.guests.filter(g => g.type !== 'adult'));
    return { adults, children, rooms: rooms.length, childrenList };
  }, [rooms]);

  const updateAdults = (delta: number) => {
    const newRooms = [...rooms];
    if (delta > 0) {
      newRooms[0].guests.push({ id: Math.random().toString(), type: 'adult', age: 30 });
    } else {
      let idx = -1;
      for (let i = newRooms[0].guests.length - 1; i >= 0; i--) {
        if (newRooms[0].guests[i].type === 'adult') { idx = i; break; }
      }
      if (idx !== -1 && totals.adults > 1) newRooms[0].guests.splice(idx, 1);
    }
    setRooms(newRooms);
  };

  const updateChildren = (delta: number) => {
    const newRooms = [...rooms];
    if (delta > 0) {
      newRooms[0].guests.push({ id: Math.random().toString(), type: 'child', age: 8 });
    } else {
      let idx = -1;
      for (let i = newRooms[0].guests.length - 1; i >= 0; i--) {
        if (newRooms[0].guests[i].type !== 'adult') { idx = i; break; }
      }
      if (idx !== -1) newRooms[0].guests.splice(idx, 1);
    }
    setRooms(newRooms);
  };

  const updateRoomCount = (delta: number) => {
    if (delta > 0) {
      setRooms([...rooms, { id: Math.random().toString(), roomType: selectedHotel?.roomTypes[0] || 'Standard Room', guests: [{ id: Math.random().toString(), type: 'adult', age: 30 }] }]);
    } else if (rooms.length > 1) {
      setRooms(rooms.slice(0, -1));
    }
  };

  const updateChildAgeAtTravel = (guestId: string, age: number) => {
    const newRooms = [...rooms];
    for (let r of newRooms) {
      const g = r.guests.find(x => x.id === guestId);
      if (g) { g.age = age; break; }
    }
    setRooms(newRooms);
  };

  const isGreenTaxIncluded = useMemo(() => {
    return selectedHotel?.rules.greenTaxPerNight === 0;
  }, [selectedHotel]);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 text-gray-900 font-sans">
      {!selectedHotel && (
        <SearchHero 
          hotels={HOTELS} atoll={filterAtoll} setAtoll={setFilterAtoll} island={filterIsland} setIsland={setFilterIsland} hotelName={filterHotel} setHotelName={setFilterHotel}
          checkIn={checkIn} setCheckIn={setCheckIn} checkOut={checkOut} setCheckOut={setCheckOut} rooms={rooms} setRooms={setRooms}
          onReset={() => {
            setFilterAtoll(''); setFilterIsland(''); setFilterHotel(''); setCheckIn(null); setCheckOut(null);
            setRooms([{id:'init',roomType:'Standard Room',guests:[{id:'1',type:'adult',age:30},{id:'2',type:'adult',age:30}]}]);
          }} 
          resultCount={filteredHotels.length}
        />
      )}

      <main className="container mx-auto max-w-6xl px-4 mt-8" id="results">
        {!selectedHotel && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map(hotel => {
              const disc = getApplicableDiscount(hotel, 0);
              return (
                <div key={hotel.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full relative group transition-all hover:shadow-md">
                  {disc && <div className="absolute top-3 right-3 z-10 bg-brand-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">{disc}</div>}
                  <div className="h-48 bg-gray-50 flex items-center justify-center p-8">
                     {hotel.logoUrl ? <img src={hotel.logoUrl} alt={hotel.name} className="max-w-full max-h-full object-contain" /> : <Building2 size={32} className="text-gray-300" />}
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{hotel.name}</h3>
                      <div className="flex items-center text-gray-500 text-xs mb-4 font-medium"><MapPin size={12} className="mr-1" />{hotel.island}, {hotel.atoll}</div>
                    </div>
                    <button onClick={() => setSelectedHotelId(hotel.id)} className="w-full bg-brand-500 text-white font-semibold py-2.5 px-6 rounded text-sm hover:bg-brand-600 transition-colors">View Property</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedHotel && (
          <div ref={detailsRef} className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
            <div className="lg:col-span-2 space-y-4">
              <button onClick={() => setSelectedHotelId(null)} className="text-[10px] text-gray-400 flex items-center hover:text-brand-500 font-black uppercase tracking-[0.2em] mb-2 transition-colors">← Back to search results</button>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex justify-between items-center">
                 <div><h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedHotel.name}</h2><p className="text-gray-500 font-bold text-xs">{selectedHotel.island}, {selectedHotel.atoll}</p></div>
                 {selectedHotel.logoUrl && <img src={selectedHotel.logoUrl} alt="Logo" className="h-10 w-auto object-contain grayscale opacity-40" />}
              </div>

              {!hasRates ? (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-50">
                      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stay Essentials</h3>
                      {calculatedNights > 0 && <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter">{calculatedNights} Night Stay</span>}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6">
                      <div className="flex-1">
                        <label className="block text-[9px] text-gray-400 font-black uppercase mb-2 tracking-widest">Travel Dates</label>
                        <DateSelector checkIn={checkIn} checkOut={checkOut} onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} />
                      </div>

                      <div className="flex flex-wrap gap-4 items-end">
                        <div className="w-28">
                          <label className="block text-[9px] text-gray-400 font-black uppercase mb-2 tracking-widest text-center">Rooms</label>
                          <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
                            <button onClick={() => updateRoomCount(-1)} className="text-brand-500 hover:text-brand-700 transition-colors p-1"><Minus size={14} strokeWidth={4}/></button>
                            <span className="text-sm font-black text-gray-800">{totals.rooms}</span>
                            <button onClick={() => updateRoomCount(1)} className="text-brand-500 hover:text-brand-700 transition-colors p-1"><PlusIcon size={14} strokeWidth={4}/></button>
                          </div>
                        </div>

                        <div className="w-28">
                          <label className="block text-[9px] text-gray-400 font-black uppercase mb-2 tracking-widest text-center">Adults</label>
                          <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
                            <button onClick={() => updateAdults(-1)} className="text-brand-500 hover:text-brand-700 transition-colors p-1"><Minus size={14} strokeWidth={4}/></button>
                            <span className="text-sm font-black text-gray-800">{totals.adults}</span>
                            <button onClick={() => updateAdults(1)} className="text-brand-500 hover:text-brand-700 transition-colors p-1"><PlusIcon size={14} strokeWidth={4}/></button>
                          </div>
                        </div>

                        <div className="w-28">
                          <label className="block text-[9px] text-gray-400 font-black uppercase mb-2 tracking-widest text-center">Children</label>
                          <div className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
                            <button onClick={() => updateChildren(-1)} className="text-brand-500 hover:text-brand-700 transition-colors p-1"><Minus size={14} strokeWidth={4}/></button>
                            <span className="text-sm font-black text-gray-800">{totals.children}</span>
                            <button onClick={() => updateChildren(1)} className="text-brand-500 hover:text-brand-700 transition-colors p-1"><PlusIcon size={14} strokeWidth={4}/></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {totals.children > 0 && (
                      <div className="mt-6 pt-5 border-t border-gray-50 animate-fade-in">
                        <div className="flex items-center gap-2 mb-3">
                           <Info size={12} className="text-brand-500" />
                           <label className="text-[9px] text-gray-400 font-black uppercase tracking-[0.1em]">Children's Age at Time of Travel</label>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {totals.childrenList.map((child, i) => (
                            <div key={child.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded px-2.5 py-1.5 shadow-sm">
                              <span className="text-[10px] font-black text-brand-600 uppercase tracking-tighter">Child {i+1}:</span>
                              <select 
                                value={child.age || ''} 
                                onChange={(e) => updateChildAgeAtTravel(child.id, parseInt(e.target.value))} 
                                className="text-xs font-black bg-transparent border-none p-0 outline-none focus:ring-0 cursor-pointer text-gray-800"
                              >
                                {Array.from({length: 12}, (_, k) => k + 1).map(age => <option key={age} value={age}>{age} yrs</option>)}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Special Celebrations & Requests</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <div className="flex flex-col gap-3">
                              <label className="flex items-center cursor-pointer group">
                                 <div className={`w-6 h-6 border rounded flex items-center justify-center transition-all ${celebrations.birthday ? 'bg-brand-500 border-brand-500' : 'bg-gray-100 border-gray-400'}`}>{celebrations.birthday && <Check size={16} className="text-white" strokeWidth={4} />}</div>
                                 <input type="checkbox" className="hidden" checked={celebrations.birthday} onChange={e => setCelebrations({...celebrations, birthday: e.target.checked})} />
                                 <span className="ml-3 text-sm font-bold text-gray-700">Birthday Celebration</span>
                              </label>
                              <label className="flex items-center cursor-pointer group">
                                 <div className={`w-6 h-6 border rounded flex items-center justify-center transition-all ${celebrations.anniversary ? 'bg-brand-500 border-brand-500' : 'bg-gray-100 border-gray-400'}`}>{celebrations.anniversary && <Check size={16} className="text-white" strokeWidth={4} />}</div>
                                 <input type="checkbox" className="hidden" checked={celebrations.anniversary} onChange={e => setCelebrations({...celebrations, anniversary: e.target.checked})} />
                                 <span className="ml-3 text-sm font-bold text-gray-700">Anniversary Celebration</span>
                              </label>
                           </div>
                           <div className="pt-2">
                              <label className="block text-[10px] text-gray-400 font-black uppercase mb-1.5 tracking-wider">Date of Occasion</label>
                              <input type="text" value={celebrationDate} onChange={e => setCelebrationDate(e.target.value)} placeholder="e.g. July 6th" className="w-full text-sm px-3 py-2 border border-gray-200 rounded bg-gray-50 font-bold outline-none focus:ring-1 focus:ring-brand-500 transition-all shadow-inner" />
                           </div>
                        </div>
                        <div className="relative h-full flex flex-col">
                           <label className="block text-[10px] text-gray-400 font-black uppercase mb-1.5 tracking-wider">Special Requests / Remarks</label>
                           <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="e.g. Quiet room, specific floor, airport assistance..." className="w-full text-sm px-3 py-3 border border-gray-200 rounded bg-gray-50 h-full min-h-[120px] font-bold outline-none focus:ring-1 focus:ring-brand-500 transition-all shadow-inner" />
                        </div>
                     </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stay Period</h3>
                        {calculatedNights > 0 && <span className="bg-brand-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">{calculatedNights} Night Stay</span>}
                     </div>
                     <DateSelector checkIn={checkIn} checkOut={checkOut} onCheckInChange={setCheckIn} onCheckOutChange={setCheckOut} />
                     {minStayError && <div className="mt-4 bg-red-50 border border-red-100 rounded p-4 flex items-start text-red-600 text-xs font-bold"><AlertTriangle size={16} className="mr-3 shrink-0" /><p>{minStayError}</p></div>}
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Accommodations</h3>
                    <RoomConfigurator rooms={rooms} hotel={selectedHotel} onChange={setRooms} hideRoomType={false} checkIn={checkIn} />
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Package Selection</h3>
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Meal Plan Option</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {selectedHotel.mealPlans.map(mp => (
                            <div 
                              key={mp.id} 
                              onClick={() => setMealPlanId(mp.id)}
                              className={`relative p-3 border rounded-xl cursor-pointer transition-all flex flex-col justify-between ${mealPlanId === mp.id ? 'border-brand-500 bg-brand-5/30 ring-1 ring-brand-500' : 'border-gray-200 bg-white hover:border-brand-200'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-[13px] font-black leading-tight ${mealPlanId === mp.id ? 'text-brand-600' : 'text-gray-700'}`}>{mp.name}</span>
                                {mealPlanId === mp.id && <div className="bg-brand-500 rounded-full p-0.5 shrink-0 ml-1"><Check size={8} className="text-white" strokeWidth={4} /></div>}
                              </div>
                              <div className="flex gap-3">
                                <div className="flex flex-col">
                                   <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Adult</span>
                                   <span className="text-[11px] font-black text-gray-800">{mp.adultSupplement > 0 ? `+${formatCurrency(mp.adultSupplement)}` : 'Incl.'}</span>
                                </div>
                                {totals.children > 0 && (
                                  <div className="flex flex-col">
                                     <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">Child</span>
                                     <span className="text-[11px] font-black text-gray-800">{mp.childSupplement > 0 ? `+${formatCurrency(mp.childSupplement)}` : 'Incl.'}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">Transportation Option</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {availableTransfers.map(t => (
                            <div 
                              key={t.id} 
                              onClick={() => setTransferId(t.id)}
                              className={`relative p-4 border rounded-xl cursor-pointer transition-all ${transferId === t.id ? 'border-brand-500 bg-brand-5/30 ring-1 ring-brand-500' : 'border-gray-200 bg-white hover:border-brand-200'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-black truncate max-w-[80%] ${transferId === t.id ? 'text-brand-600' : 'text-gray-700'}`}>{t.name}</span>
                                {transferId === t.id && <div className="bg-brand-500 rounded-full p-0.5 shrink-0"><Check size={10} className="text-white" strokeWidth={4} /></div>}
                              </div>
                              <div className="flex gap-4">
                                <div className="flex flex-col">
                                   <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{t.isPerBoat ? 'Per Boat' : 'Adult'}</span>
                                   <span className="text-xs font-black text-gray-800">{t.id === 'no-transfer' ? '-' : (t.adultRate > 0 ? formatCurrency(t.adultRate) : 'Included')}</span>
                                </div>
                                {totals.children > 0 && !t.isPerBoat && t.id !== 'no-transfer' && (
                                  <div className="flex flex-col">
                                     <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Child</span>
                                     <span className="text-xs font-black text-gray-800">{t.childRate > 0 ? formatCurrency(t.childRate) : 'Included'}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Special Requests & Occasions</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="flex items-center cursor-pointer group">
                              <div className={`w-6 h-6 border rounded-md flex items-center justify-center transition-all ${celebrations.birthday ? 'bg-brand-500 border-brand-500' : 'bg-gray-100 border-gray-400'}`}>{celebrations.birthday && <Check size={16} className="text-white" strokeWidth={4} />}</div>
                              <input type="checkbox" className="hidden" checked={celebrations.birthday} onChange={e => setCelebrations({...celebrations, birthday: e.target.checked})} />
                              <span className="ml-3 text-sm font-bold text-gray-900 flex items-center"><Cake size={16} className="mr-2 opacity-30" /> Birthday Celebration</span>
                           </label>
                           <label className="flex items-center cursor-pointer group">
                              <div className={`w-6 h-6 border rounded-md flex items-center justify-center transition-all ${celebrations.anniversary ? 'bg-brand-500 border-brand-500' : 'bg-gray-100 border-gray-400'}`}>{celebrations.anniversary && <Check size={16} className="text-white" strokeWidth={4} />}</div>
                              <input type="checkbox" className="hidden" checked={celebrations.anniversary} onChange={e => setCelebrations({...celebrations, anniversary: e.target.checked})} />
                              <span className="ml-3 text-sm font-bold text-gray-900">Anniversary Celebration</span>
                           </label>
                        </div>
                        <div className="space-y-4">
                           <div className="relative">
                              <label className="block text-[10px] text-gray-400 font-black uppercase mb-1.5 tracking-wider">Occasion Date</label>
                              <input type="text" value={celebrationDate} onChange={e => setCelebrationDate(e.target.value)} placeholder="e.g. July 6th" className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 font-bold outline-none focus:ring-1 focus:ring-brand-500" />
                           </div>
                        </div>
                        <div className="md:col-span-2 relative">
                           <label className="block text-[10px] text-gray-400 font-black uppercase mb-1.5 tracking-wider">Special Requests / Remarks</label>
                           <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="e.g. Quiet room..." className="w-full text-sm px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 h-24 font-bold outline-none focus:ring-1 focus:ring-brand-500" />
                        </div>
                     </div>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
               <div className="sticky top-24 space-y-4">
                 {hasRates ? (
                   <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                      <div className="p-6 bg-brand-500 text-white"><h3 className="text-lg font-bold uppercase tracking-widest">Estimated Quote</h3>{quote && quote.nights > 0 && <p className="text-brand-100 text-xs mt-1 font-bold">{quote.nights} Night Stay</p>}</div>
                      <div className="p-6">
                        {minStayError ? <div className="text-center py-8 text-red-500 font-bold"><p className="text-xs uppercase tracking-widest leading-relaxed">Dates unavailable.</p></div> : (quote && quote.nights > 0 ? (
                          <>
                            <div className="space-y-4 text-xs text-gray-600 mb-8 font-bold">
                              <div className="flex justify-between items-center"><span className="uppercase text-gray-400 tracking-tighter">Accommodation</span><span className="text-gray-900">{formatCurrency(quote.totalRoomCost)}</span></div>
                              <div className="flex justify-between items-center"><span className="uppercase text-gray-400 tracking-tighter">{mealPlanId === 'bb' ? "Breakfast Included" : "Meals"}</span><span className="text-gray-900">{mealPlanId === 'bb' ? formatCurrency(0) : formatCurrency(quote.totalMealCost)}</span></div>
                              {quote.totalOccasionSupplements > 0 && <div className="flex justify-between items-center"><span className="uppercase text-gray-400 tracking-tighter">Holiday Extras</span><span className="text-gray-900">{formatCurrency(quote.totalOccasionSupplements)}</span></div>}
                              {quote.totalTransferCost > 0 && <div className="flex justify-between items-center"><span className="uppercase text-gray-400 tracking-tighter">Transfers</span><span className="text-gray-900">{formatCurrency(quote.totalTransferCost)}</span></div>}
                              
                              {/* Green Tax Logic */}
                              <div className="flex justify-between items-center text-gray-600">
                                <span className="uppercase tracking-tighter">Green Tax ($6/pp/nt)</span>
                                {isGreenTaxIncluded ? (
                                  <div className="flex items-center gap-1 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                                    <CheckCircle2 size={10} className="text-brand-500" />
                                    <span className="text-[9px] font-black uppercase text-brand-700">Included</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-900">{formatCurrency(quote.totalGreenTax)}</span>
                                )}
                              </div>

                              <div className="flex justify-between items-center text-brand-600">
                                <span className="uppercase tracking-tighter">Mandatory Taxes & Fees</span>
                                <div className="flex items-center gap-1.5 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                                  <CheckCircle2 size={12} className="text-brand-500" />
                                  <span className="text-[10px] font-black uppercase text-brand-700">Included</span>
                                </div>
                              </div>
                            </div>
                            <div className="border-t border-gray-100 pt-6 flex justify-between items-end mb-2"><span className="font-bold text-sm text-gray-400 uppercase tracking-widest">Total USD</span><span className="font-black text-3xl text-brand-600">{formatCurrency(quote.grandTotal)}</span></div>
                            <div className="flex items-start gap-2 p-3 bg-brand-5/50 border border-brand-100 rounded-lg mb-6"><Info size={14} className="text-brand-500 mt-0.5 shrink-0" /><p className="text-[10px] text-brand-700 font-medium italic leading-snug">Suggested rates are estimates and subject to availability at time of confirmation. All taxes are inclusive.</p></div>
                            <button onClick={handleDownloadClick} className="w-full font-black py-4 rounded bg-brand-500 text-white hover:bg-brand-600 transition-all shadow-md uppercase tracking-widest text-xs flex items-center justify-center gap-2"><Download size={16} /> Download Quote PDF</button>
                          </>
                        ) : <div className="text-center py-10 text-gray-300 italic font-bold text-xs uppercase tracking-widest">Select dates...</div>)}
                      </div>
                   </div>
                 ) : (
                   <div className="bg-white rounded-lg shadow-md border border-brand-100 overflow-hidden">
                      <div className="p-5 bg-brand-5 border-b border-brand-100 flex items-center gap-2"><Tag size={16} className="text-brand-500" /><h3 className="text-[11px] font-black uppercase tracking-widest">Exclusive Travel Guide Discount</h3></div>
                      <div className="p-6">
                        <div className="mb-4"><span className="text-4xl font-black text-brand-600">{getApplicableDiscount(selectedHotel, calculatedNights)}</span><span className="block text-[9px] text-gray-400 font-black uppercase mt-2 tracking-widest">OFF DIRECT RATES</span></div>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Book directly with the hotel. To claim this exclusive offer, follow the instructions below.</p>
                      </div>
                   </div>
                 )}

                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-3">How to book</h3>
                    <div className="space-y-6">
                       {selectedHotel.id === 'luau-beach-fulidhoo' ? (
                         <>
                           <div className="flex gap-4">
                             <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[9px] font-black shrink-0">1</div>
                             <div>
                               <p className="text-[11px] font-bold text-gray-700 leading-snug mb-2">Book directly online through the official website:</p>
                               <a href={selectedHotel.websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 px-3 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600 hover:bg-blue-100 transition-all shadow-sm">
                                 <Globe size={12} className="shrink-0" />
                                 <span>Visit luaubeachinnmaldives.com</span>
                                 <ExternalLink size={10} className="opacity-50" />
                               </a>
                             </div>
                           </div>
                           <div className="flex gap-4">
                             <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[9px] font-black shrink-0">2</div>
                             <div className="flex-grow">
                               <p className="text-[11px] font-bold text-gray-700 mb-2">Use our exclusive promo code at checkout:</p>
                               <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-100 rounded text-[11px] font-black text-brand-700 shadow-inner">
                                 <span>{selectedHotel.promoCode}</span>
                                 <button 
                                   onClick={() => handleCopy(selectedHotel.promoCode!, 'p')} 
                                   className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-[9px] hover:text-brand-500 transition-colors shadow-sm"
                                 >
                                   {copiedId === 'p' ? <><Check size={10} strokeWidth={4} className="text-green-500" /><span>COPIED</span></> : <><Copy size={10} /><span>COPY CODE</span></>}
                                 </button>
                               </div>
                             </div>
                           </div>
                         </>
                       ) : (
                         <>
                           <div className="flex gap-4">
                             <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[9px] font-black shrink-0">1</div>
                             <div><p className="text-[11px] font-bold text-gray-700 leading-snug">{hasRates ? "Download the quote PDF." : "Select your travel dates."}</p></div>
                           </div>
                           <div className="flex gap-4">
                              <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[9px] font-black shrink-0">2</div>
                              <div className="flex-grow space-y-3">
                                 <p className="text-[11px] font-bold text-gray-700">Contact the hotel directly:</p>
                                 <div className="space-y-2 flex flex-col items-center">
                                    {selectedHotel.bookingEmail && (
                                      <div className="w-full flex items-center justify-between gap-2 p-2 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-brand-600"><div className="flex items-center gap-2 truncate"><Mail size={12} className="shrink-0 text-brand-400" /><span className="truncate">{selectedHotel.bookingEmail}</span></div><button onClick={() => handleCopy(selectedHotel.bookingEmail!, 'e')} className="text-gray-300 hover:text-brand-500 shrink-0"><Copy size={12} /></button></div>
                                    )}
                                    {selectedHotel.websiteUrl ? (
                                      <a href={selectedHotel.websiteUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-600 hover:bg-blue-100 transition-all shadow-sm"><Globe size={12} className="shrink-0" /><span>Book Direct Online</span><ExternalLink size={10} className="opacity-50" /></a>
                                    ) : (
                                      selectedHotel.whatsapp && (
                                        <a href={`https://wa.me/${selectedHotel.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(reachOutTemplate)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-green-50 border border-green-100 rounded text-[10px] font-bold text-green-600 hover:bg-green-100 transition-all shadow-sm"><MessageCircle size={12} className="shrink-0" /><span>+{selectedHotel.whatsapp} (WhatsApp)</span><ExternalLink size={10} className="opacity-50" /></a>
                                      )
                                    )}
                                 </div>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[9px] font-black shrink-0">3</div>
                              <div className="flex-grow space-y-2">
                                 <p className="text-[11px] font-bold text-gray-700">Copy this template into your email/chat:</p>
                                 <div className="bg-gray-50 rounded border border-gray-200 p-2.5 max-h-40 overflow-y-auto relative group shadow-inner">
                                    <pre className="text-[9px] text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">{reachOutTemplate}</pre>
                                    <button onClick={() => handleCopy(reachOutTemplate, 't')} className="absolute top-1.5 right-1.5 p-1.5 bg-white border border-gray-200 rounded text-brand-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} /></button>
                                 </div>
                              </div>
                           </div>
                         </>
                       )}
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {showPdfModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
              <div className="p-6 bg-brand-500 text-white flex justify-between items-center">
                 <div><h3 className="text-lg font-bold uppercase tracking-widest">Quote Registration</h3><p className="text-xs text-brand-100 mt-1 opacity-80">Official details for the PDF document.</p></div>
                 <button onClick={() => setShowPdfModal(false)} className="text-white hover:opacity-70 transition-opacity"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                 <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Guest Names</label>
                    <div className="space-y-4">{rooms.map((room, rIdx) => (
                          <div key={room.id} className="space-y-2 pb-4 border-b border-gray-50 last:border-0"><span className="text-[9px] font-black text-brand-600 uppercase">Room {rIdx + 1}: {room.roomType}</span>
                             {room.guests.map((guest, gIdx) => {
                               const guestKey = `${room.id}-${guest.id}`;
                               return (
                                 <div key={guestKey} className="relative mb-2">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                    <input type="text" value={guestNameInputs[guestKey] || ''} onChange={e => setGuestNameInputs(prev => ({...prev, [guestKey]: e.target.value}))} placeholder={`${guest.type.charAt(0).toUpperCase() + guest.type.slice(1)} ${gIdx + 1} Name`} className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-bold bg-gray-50 focus:ring-1 focus:ring-brand-500 outline-none transition-all" />
                                    {guestNameInputs[guestKey] && <button onClick={() => setGuestNameInputs(prev => ({...prev, [guestKey]: ''}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600"><X size={14} /></button>}
                                 </div>
                               );
                             })}
                          </div>
                       ))}</div>
                 </div>
                 <div className="pt-2 border-t border-gray-100 space-y-4">
                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Booking Email</label><div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" /><input type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="hello@example.com" className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-bold bg-gray-50 focus:ring-1 focus:ring-brand-500 outline-none transition-all" /></div></div>
                    <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Confirm Booking Email</label>
                       <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" /><input type="email" value={confirmEmail} onChange={e => setConfirmEmail(e.target.value)} placeholder="Re-enter your email" className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm font-bold bg-gray-50 focus:ring-1 focus:ring-brand-500 outline-none transition-all ${confirmEmail && customerEmail.trim().toLowerCase() !== confirmEmail.trim().toLowerCase() ? 'border-red-300' : 'border-gray-200'}`} /></div>
                       {confirmEmail && customerEmail.trim().toLowerCase() !== confirmEmail.trim().toLowerCase() && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">Emails do not match.</p>}
                    </div>
                 </div>
                 <div className="pt-4 flex gap-3"><button onClick={() => setShowPdfModal(false)} className="flex-1 px-4 py-3 rounded text-xs font-black uppercase text-gray-400 hover:bg-gray-50 transition-colors">Cancel</button><button onClick={triggerDownload} disabled={!isModalValid} className={`flex-[2] px-8 py-3 rounded text-white text-xs font-black uppercase shadow-md transition-all ${isModalValid ? 'bg-brand-500 hover:bg-brand-600' : 'bg-gray-300 cursor-not-allowed opacity-50'}`}>Generate PDF</button></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
