import React from 'react';
import { RoomConfig, Hotel } from '../types';
import { Plus, Trash2, ChevronDown, Users } from 'lucide-react';
import { formatCurrency, calculateRoomNightCost } from '../services/calculator';

interface RoomConfiguratorProps {
  rooms: RoomConfig[];
  hotel: Hotel;
  onChange: (rooms: RoomConfig[]) => void;
  hideRoomType?: boolean;
  checkIn?: Date | null;
  minimal?: boolean;
}

export const RoomConfigurator: React.FC<RoomConfiguratorProps> = ({ rooms, hotel, onChange, hideRoomType = false, checkIn, minimal = false }) => {
  const addRoom = () => {
    const newRoom: RoomConfig = {
      id: Math.random().toString(36).substr(2, 9),
      roomType: hotel.roomTypes[0],
      guests: [{ id: Math.random().toString(), type: 'adult', age: 30 }, { id: Math.random().toString(), type: 'adult', age: 30 }]
    };
    onChange([...rooms, newRoom]);
  };

  const removeRoom = (index: number) => {
    const newRooms = [...rooms];
    newRooms.splice(index, 1);
    onChange(newRooms);
  };

  const updateRoomType = (index: number, type: string) => {
    const newRooms = [...rooms];
    newRooms[index].roomType = type;
    onChange(newRooms);
  };

  const updateAdultCount = (roomIndex: number, delta: number) => {
    const newRooms = [...rooms];
    const room = newRooms[roomIndex];
    const currentAdults = room.guests.filter(g => g.type === 'adult').length;
    
    if (delta > 0) {
      if (currentAdults < 4) {
        room.guests.push({ id: Math.random().toString(), type: 'adult', age: 30 });
      }
    } else if (delta < 0 && currentAdults > 1) {
      let idx = -1;
      for (let i = room.guests.length - 1; i >= 0; i--) {
        if (room.guests[i].type === 'adult') {
          idx = i;
          break;
        }
      }
      if (idx !== -1) room.guests.splice(idx, 1);
    }
    onChange(newRooms);
  };

  const addChild = (roomIndex: number) => {
    const newRooms = [...rooms];
    newRooms[roomIndex].guests.push({ id: Math.random().toString(), type: 'child', age: null });
    onChange(newRooms);
  };

  const removeChild = (roomIndex: number, guestId: string) => {
    const newRooms = [...rooms];
    const idx = newRooms[roomIndex].guests.findIndex(g => g.id === guestId);
    if (idx !== -1) newRooms[roomIndex].guests.splice(idx, 1);
    onChange(newRooms);
  };

  const updateChildAge = (roomIndex: number, guestId: string, age: number) => {
    const newRooms = [...rooms];
    const guest = newRooms[roomIndex].guests.find(g => g.id === guestId);
    if (guest) {
      guest.age = age;
      const infantPolicy = hotel.rules.agePolicies.find(p => p.name.toLowerCase() === 'infant');
      guest.type = (infantPolicy && age <= infantPolicy.maxAge) ? 'infant' : 'child';
    }
    onChange(newRooms);
  };

  const getPriceForType = (room: RoomConfig, type: string) => {
    if (!checkIn) return null;
    const tempRoom = { ...room, roomType: type };
    return calculateRoomNightCost(hotel, tempRoom, checkIn);
  };

  return (
    <div className={minimal ? "space-y-3" : "space-y-6"}>
      {rooms.map((room, rIndex) => {
        return (
          <div key={room.id} className={`border border-gray-100 shadow-sm rounded-lg bg-white transition-all ${minimal ? 'p-3' : 'p-5'}`}>
            <div className={`flex justify-between items-center ${minimal ? 'mb-2' : 'mb-6'}`}>
              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Room {rIndex + 1}</h4>
              {rooms.length > 1 && (
                <button onClick={() => removeRoom(rIndex)} className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest flex items-center">
                  <Trash2 size={12} className="mr-1" /> {minimal ? '' : 'Remove'}
                </button>
              )}
            </div>

            {!hideRoomType && !minimal && (
              <div className="mb-8">
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Select Room Type</label>
                <div className="relative">
                  <select 
                    value={room.roomType} 
                    onChange={(e) => updateRoomType(rIndex, e.target.value)}
                    className="w-full bg-brand-50 border border-brand-500 rounded-md text-sm p-3 focus:ring-1 focus:ring-brand-500 text-gray-900 appearance-none font-bold cursor-pointer transition-all"
                  >
                    {hotel.roomTypes.map(t => {
                      const price = getPriceForType(room, t);
                      return (
                        <option key={t} value={t} className="text-gray-900">
                          {t} {price ? `(${formatCurrency(price)})` : ''}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-600"><ChevronDown size={18} /></div>
                </div>
              </div>
            )}

            <div className={`${minimal ? 'p-2' : 'p-4'} bg-gray-50 rounded-lg border border-gray-100`}>
              <div className={`flex justify-between items-center bg-white rounded-md border border-gray-200 shadow-sm ${minimal ? 'p-2 mb-2' : 'p-3 mb-4'}`}>
                <span className={`${minimal ? 'text-[11px]' : 'text-sm'} font-bold text-gray-700`}>Adults <span className="text-gray-400 text-[9px] uppercase">(12+)</span></span>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateAdultCount(rIndex, -1)} className={`${minimal ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-gray-50 font-bold`}>-</button>
                  <span className={`${minimal ? 'text-xs' : 'text-sm'} font-black text-brand-600`}>{room.guests.filter(g => g.type === 'adult').length}</span>
                  <button 
                    onClick={() => updateAdultCount(rIndex, 1)} 
                    disabled={room.guests.filter(g => g.type === 'adult').length >= 4}
                    className={`${minimal ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg border flex items-center justify-center font-bold ${room.guests.filter(g => g.type === 'adult').length >= 4 ? 'border-gray-100 text-gray-200 cursor-not-allowed' : 'border-brand-500 text-brand-500 hover:bg-gray-50'}`}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                 {room.guests.filter(g => g.type !== 'adult').map((child, cIndex) => (
                   <div key={child.id} className={`flex flex-col gap-1.5 bg-white rounded-md border border-gray-200 shadow-sm animate-fade-in mb-1 ${minimal ? 'p-1.5' : 'p-2'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`${minimal ? 'text-[9px]' : 'text-[11px]'} font-bold text-gray-600 ml-1`}>Child {cIndex + 1} Age at time of travel:</span>
                        <div className="flex items-center gap-2">
                           <select 
                             value={child.age === null ? '' : child.age} 
                             onChange={(e) => updateChildAge(rIndex, child.id, parseInt(e.target.value))} 
                             className={`border rounded px-1.5 py-0.5 font-bold outline-none transition-all ${minimal ? 'text-[10px]' : 'text-sm'} ${child.age === null ? 'border-red-300 bg-white text-gray-400' : 'bg-white border-gray-200 text-gray-900'}`}
                           >
                             <option value="" disabled>?</option>
                             {Array.from({length: 13}, (_, i) => i).map(age => <option key={age} value={age} className="text-gray-900">{age} yrs</option>)}
                           </select>
                           <button onClick={() => removeChild(rIndex, child.id)} className="text-red-400 hover:text-red-600"><Trash2 size={minimal ? 14 : 16} /></button>
                        </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button onClick={() => addChild(rIndex)} className={`w-full bg-white border border-brand-500 text-brand-600 rounded-md font-bold uppercase tracking-widest hover:bg-brand-5 transition-all flex items-center justify-center gap-2 shadow-sm mt-2 ${minimal ? 'py-1 text-[8px]' : 'py-2 text-[10px]'}`}><Plus size={minimal ? 10 : 14} strokeWidth={3} /> Add Child / Infant</button>
            </div>
          </div>
        );
      })}
      <button onClick={addRoom} className={`w-full border-2 border-dashed border-gray-200 rounded-lg text-gray-400 font-bold uppercase tracking-widest hover:border-brand-500 transition-all flex justify-center items-center ${minimal ? 'py-2 text-[9px]' : 'py-3 text-xs'}`}><Plus size={minimal ? 14 : 18} className="mr-2" /> Add Room</button>
    </div>
  );
};