import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Users, MapPin, Building2, RotateCcw } from 'lucide-react';
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
    const handleClickOutside = (e: MouseEvent) => { if (guestDropdownRef.current && !guestDropdownRef.current.contains(e.target as Node)) setIsGuestOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const atollOptions = useMemo(() => Array.from(new Set(hotels.map(h => h.atoll))).sort(), [hotels]);
  const islandOptions = useMemo(() => Array.from(new Set(hotels.filter(h => !atoll || h.atoll === atoll).map(h => h.island))).sort(), [hotels, atoll]);
  const hotelOptions = useMemo(() => hotels.filter(h => (!atoll || h.atoll === atoll) && (!island || h.island === island)).map(h => h.name).sort(), [hotels, atoll, island]);

  const totalAdults = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type === 'adult').length, 0);
  const totalChildrenCount = rooms.reduce((acc, r) => acc + r.guests.filter(g => g.type !== 'adult').length, 0);

  return (
    <div className="bg-brand-500 text-white pt-8 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find your perfect Maldives getaway</h1>
        <div className="flex justify-between items-end mb-8"><p className="text-brand-100 opacity-90">Exclusive Direct Hotel Rates for Maldives travel guide followers.</p><span className="hidden md:inline-block text-sm font-semibold bg-brand-600 px-3 py-1 rounded-full border border-brand-400">{resultCount} Propert{resultCount !== 1 ? 'ies' : 'y'} Found</span></div>
        <div className="bg-white p-4 rounded-xl shadow-xl text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-3 relative bg-gray-50 rounded-md border border-gray-200">
              <MapPin size={16} className="absolute top-3 left-2 text-brand-500 pointer-events-none" />
              <select value={atoll} onChange={(e) => { setAtoll(e.target.value); setIsland(''); setHotelName(''); }} className="w-full h-full pl-8 pr-2 py-2 bg-transparent text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 rounded-md appearance-none cursor-pointer"><option value="">All Atolls</option>{atollOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
            </div>
            <div className="md:col-span-2 relative bg-gray-50 rounded-md border border-gray-200">
              <MapPin size={16} className="absolute top-3 left-2 text-brand-500 pointer-events-none" />
              <select value={island} onChange={(e) => { setIsland(e.target.value); setHotelName(''); }} className="w-full h-full pl-8 pr-2 py-2 bg-transparent text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 rounded-md appearance-none cursor-pointer"><option value="">All Islands</option>{islandOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
            </div>
            <div className="md:col-span-2 relative bg-gray-50 rounded-md border border-gray-200">
               <Building2 size={16} className="absolute top-3 left-3 text-brand-500 pointer-events-none" />
               <select value={hotelName} onChange={(e) => setHotelName(e.target.value)} className="w-full h-full pl-9 pr-4 py-2 bg-transparent text-sm font-medium focus:outline-none focus:ring-1 focus:ring-brand-500 rounded-md appearance-none cursor-pointer"><option value="">All Hotels</option>{hotelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select>
            </div>
            <div className="md:col-span-2 relative" ref={guestDropdownRef}>
              <div onClick={() => setIsGuestOpen(!isGuestOpen)} className="w-full h-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 flex items-center cursor-pointer hover:bg-gray-100">
                <Users size={18} className="text-brand-500 mr-2 flex-shrink-0" /><div className="flex flex-col overflow-hidden"><span className="text-[10px] text-gray-400 font-bold uppercase">Guests</span><span className="text-sm font-semibold truncate">{totalAdults} Ad, {totalChildrenCount} Ch</span></div>
              </div>
              {isGuestOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-fade-in">
                  <p className="text-xs text-gray-400 font-bold mb-2 uppercase">Guest Summary</p>
                  <p className="text-sm font-semibold text-brand-700">{totalAdults} Adults, {totalChildrenCount} Children</p>
                  <p className="text-[10px] text-gray-500 mt-3 italic leading-snug border-t pt-2">Refine occupant details and room categories on the property details page after selecting your hotel.</p>
                </div>
              )}
            </div>
            <div className="md:col-span-2 relative h-full"><CalendarPicker checkIn={checkIn} checkOut={checkOut} onDatesChange={(inD, outD) => { setCheckIn(inD); setCheckOut(outD); }} minDate={(() => { const d = new Date(); d.setDate(d.getDate() + 2); d.setHours(0,0,0,0); return d; })()} className="h-full" /></div>
            <div className="md:col-span-1">
              <button onClick={onReset} className="w-full h-full min-h-[48px] bg-gray-50 border border-gray-200 text-gray-500 hover:text-brand-500 rounded-md flex items-center justify-center transition-colors font-medium text-sm"><RotateCcw size={18} /><span className="md:hidden lg:ml-2 lg:inline">Reset</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
