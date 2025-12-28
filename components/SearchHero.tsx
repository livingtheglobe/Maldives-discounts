
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Users, MapPin, Building2, RotateCcw, Plus, Minus, Trash2 } from 'lucide-react';
import { RoomConfig, Hotel } from '../types';
import { CalendarPicker } from './CalendarPicker';

interface SearchHeroProps {
  hotels: Hotel[];
  atoll: string; setAtoll: (t: string) => void;
  island: string; setIsland: (t: string) => void;
  hotelName: string; setHotelName: (t: string) => void;
  checkIn: Date | null; setCheckIn: (d: Date | null) => void;
  checkOut: Date | null; setCheckOut: (d: Date | null) => void;
  rooms: RoomConfig[]; setRooms: (r: RoomConfig[]) => void;
  onReset: () => void; resultCount: number;
}

export const SearchHero: React.FC<SearchHeroProps> = ({ hotels, atoll, setAtoll, island, setIsland, hotelName, setHotelName, checkIn, setCheckIn, checkOut, setCheckOut, rooms, setRooms, onReset, resultCount }) => {
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { 
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(e.target as Node)) setIsGuestOpen(false); 
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const atollOptions = useMemo(() => Array.from(new Set(hotels.map(h => h.atoll))).sort(), [hotels]);
  const islandOptions = useMemo(() => Array.from(new Set(hotels.filter(h => !atoll || h.atoll === atoll).map(h => h.island))).sort(), [hotels, atoll]);
  const hotelOptions = useMemo(() => hotels.filter(h => (!atoll || h.atoll === atoll) && (!island || h.island === island)).map(h => h.name).sort(), [hotels, atoll, island]);

  const totalAdults = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type === 'adult').length, 0);
  const totalChildrenCount = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type !== 'adult').length, 0);

  const updateAdultCount = (roomIndex: number, delta: number) => {
    const newRooms = [...rooms];
    const room = newRooms[roomIndex];
    const adults = room.guests.filter(g => g.type === 'adult');
    if (delta > 0 && adults.length < 10) {
      room.guests.push({ id: Math.random().toString(), type: 'adult', age: 30 });
    } else if (delta < 0 && adults.length > 1) {
      // Manual implementation of findLastIndex for compatibility with older environments (pre-ES2023)
      let idx = -1;
      for (let i = room.guests.length - 1; i >= 0; i--) {
        if (room.guests[i].type === 'adult') {
          idx = i;
          break;
        }
      }
      if (idx !== -1) room.guests.splice(idx, 1);
    }
    setRooms(newRooms);
  };

  const updateChildCount = (roomIndex: number, delta: number) => {
    const newRooms = [...rooms];
    const room = newRooms[roomIndex];
    const children = room.guests.filter(g => g.type !== 'adult');
    if (delta > 0 && children.length < 6) {
      // Set initial age to null to force user selection
      room.guests.push({ id: Math.random().toString(), type: 'child', age: null });
    } else if (delta < 0 && children.length > 0) {
      // Manual implementation of findLastIndex for compatibility with older environments (pre-ES2023)
      let idx = -1;
      for (let i = room.guests.length - 1; i >= 0; i--) {
        if (room.guests[i].type !== 'adult') {
          idx = i;
          break;
        }
      }
      if (idx !== -1) room.guests.splice(idx, 1);
    }
    setRooms(newRooms);
  };

  const updateChildAge = (roomIndex: number, guestId: string, age: number) => {
    const newRooms = [...rooms];
    const guest = newRooms[roomIndex].guests.find(g => g.id === guestId);
    if (guest) {
      guest.age = age;
      guest.type = age < 2 ? 'infant' : 'child';
    }
    setRooms(newRooms);
  };

  return (
    <div className="bg-brand-500 text-white pt-8 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find exclusive Maldives hotel discounts and direct rates</h1>
        <div className="flex justify-between items-end mb-8">
          <p className="text-brand-100 opacity-90 font-medium">Select your dates to compare seasonal prices, then contact the hotel directly to check availability and request booking.</p>
          <span className="hidden md:inline-block text-sm font-bold bg-brand-600 px-4 py-1.5 rounded-full border border-brand-400 shadow-sm">{resultCount} Propert{resultCount !== 1 ? 'ies' : 'y'} Found</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-2xl text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            <div className="md:col-span-3 flex items-center bg-gray-50 rounded-md border border-gray-200 px-3 hover:border-brand-400 transition-colors">
              <MapPin size={16} className="text-brand-500 shrink-0" />
              <select 
                value={atoll} 
                onChange={(e) => { setAtoll(e.target.value); setIsland(''); setHotelName(''); }} 
                className="flex-1 bg-transparent py-3 pl-2 text-sm font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">All Atolls</option>
                {atollOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex items-center bg-gray-50 rounded-md border border-gray-200 px-3 hover:border-brand-400 transition-colors">
              <MapPin size={16} className="text-brand-500 shrink-0" />
              <select 
                value={island} 
                onChange={(e) => { setIsland(e.target.value); setHotelName(''); }} 
                className="flex-1 bg-transparent py-3 pl-2 text-sm font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">All Islands</option>
                {islandOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex items-center bg-gray-50 rounded-md border border-gray-200 px-3 hover:border-brand-400 transition-colors">
               <Building2 size={16} className="text-brand-500 shrink-0" />
               <select 
                 value={hotelName} 
                 onChange={(e) => setHotelName(e.target.value)} 
                 className="flex-1 bg-transparent py-3 pl-2 text-sm font-semibold focus:outline-none appearance-none cursor-pointer"
               >
                 <option value="">All Hotels</option>
                 {hotelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
               </select>
            </div>
            
            <div className="md:col-span-2 relative" ref={guestDropdownRef}>
              <div 
                onClick={() => setIsGuestOpen(!isGuestOpen)} 
                className={`w-full h-full bg-gray-50 rounded-md border px-3 py-2 flex items-center cursor-pointer transition-all ${isGuestOpen ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:bg-gray-100'}`}
              >
                <Users size={18} className="text-brand-500 mr-2 flex-shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] text-gray-400 font-black uppercase leading-tight tracking-wider">Guests</span>
                  <span className="text-sm font-bold truncate leading-tight">{totalAdults} Adult{totalAdults !== 1 ? 's' : ''}, {totalChildrenCount} Child{totalChildrenCount !== 1 ? 'ren' : ''}</span>
                </div>
              </div>
              
              {isGuestOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 p-5 z-50 animate-fade-in">
                  <div className="space-y-6">
                    {/* Adult row */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">Adults</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">12+ years</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateAdultCount(0, -1)} 
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={14} strokeWidth={3}/>
                        </button>
                        <span className="text-sm font-black text-brand-600 w-4 text-center">{rooms[0].guests.filter(g => g.type === 'adult').length}</span>
                        <button 
                          onClick={() => updateAdultCount(0, 1)} 
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-500 text-brand-500 hover:bg-brand-50 transition-colors"
                        >
                          <Plus size={14} strokeWidth={3}/>
                        </button>
                      </div>
                    </div>

                    {/* Children row */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">Children</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">1 - 11 years</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateChildCount(0, -1)} 
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <Minus size={14} strokeWidth={3}/>
                        </button>
                        <span className="text-sm font-black text-brand-600 w-4 text-center">{rooms[0].guests.filter(g => g.type !== 'adult').length}</span>
                        <button 
                          onClick={() => updateChildCount(0, 1)} 
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-brand-500 text-brand-500 hover:bg-brand-50 transition-colors"
                        >
                          <Plus size={14} strokeWidth={3}/>
                        </button>
                      </div>
                    </div>

                    {/* Child age selects - appear when children are added */}
                    {rooms[0].guests.filter(g => g.type !== 'adult').length > 0 && (
                      <div className="pt-4 space-y-3 border-t border-gray-50">
                        {rooms[0].guests.filter(g => g.type !== 'adult').map((child, cIdx) => (
                          <div key={child.id} className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-gray-600">Child {cIdx + 1} Age</span>
                            <select 
                              value={child.age === null ? '' : child.age} 
                              onChange={(e) => updateChildAge(0, child.id, parseInt(e.target.value))}
                              className={`text-xs font-bold bg-gray-50 border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all ${child.age === null ? 'border-red-300 text-gray-400' : 'border-gray-200 text-gray-900'}`}
                            >
                              <option value="" disabled>Select Age</option>
                              {Array.from({length: 11}, (_, i) => i + 1).map(age => (
                                <option key={age} value={age}>{age} yr{age !== 1 ? 's' : ''}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 relative h-full">
              <CalendarPicker 
                checkIn={checkIn} 
                checkOut={checkOut} 
                onDatesChange={(inD, outD) => { setCheckIn(inD); setCheckOut(outD); }} 
                minDate={(() => { const d = new Date(); d.setDate(d.getDate() + 2); d.setHours(0,0,0,0); return d; })()} 
                className="h-full" 
              />
            </div>
            
            <div className="md:col-span-1">
              <button 
                onClick={onReset} 
                className="w-full h-full min-h-[48px] bg-gray-50 border border-gray-200 text-gray-400 hover:text-brand-500 hover:border-brand-500 rounded-md flex items-center justify-center transition-all shadow-sm"
                title="Reset search"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
