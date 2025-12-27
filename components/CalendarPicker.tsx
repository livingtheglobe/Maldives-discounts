import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarPickerProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onDatesChange: (checkIn: Date | null, checkOut: Date | null) => void;
  minDate?: Date;
  className?: string;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ checkIn, checkOut, onDatesChange, minDate, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize view date. Use checkIn if available, otherwise minDate or today.
  const initialDate = checkIn || (minDate && minDate > new Date() ? minDate : new Date());
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);

    // Block disabled dates
    if (isDisabled(day)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      onDatesChange(clickedDate, null);
    } else if (checkIn && !checkOut) {
      // If user clicks before checkIn, reset start date
      if (clickedDate <= checkIn) {
        onDatesChange(clickedDate, null);
      } else {
        onDatesChange(checkIn, clickedDate);
        setIsOpen(false);
      }
    }
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    
    // Check against global minDate (Today + 2)
    if (minDate) {
      const md = new Date(minDate);
      md.setHours(0,0,0,0);
      if (date < md) return true;
    }
    
    return false;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    
    if (checkIn && date.getTime() === checkIn.getTime()) return true;
    if (checkOut && date.getTime() === checkOut.getTime()) return true;
    return false;
  };

  const isDateInRange = (day: number) => {
    if (!checkIn || !checkOut) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    date.setHours(0, 0, 0, 0);
    return date > checkIn && date < checkOut;
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return null;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };

  const { days, firstDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full bg-white rounded-md border border-gray-200 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm min-h-[48px]"
      >
        <CalendarIcon size={18} className="text-brand-500 mr-3 flex-shrink-0" />
        <div className="flex flex-col overflow-hidden">
           <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider truncate">Dates of Stay</span>
           <span className="text-sm font-medium text-gray-700 truncate">
             {checkIn ? formatDateDisplay(checkIn) : 'Check-in'} — {checkOut ? formatDateDisplay(checkOut) : 'Check-out'}
           </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl p-4 z-50 w-80 border border-gray-100 animate-fade-in block">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
              <ChevronLeft size={20} />
            </button>
            <span className="font-bold text-gray-800">{monthName}</span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-600">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <span key={d} className="text-xs font-bold text-gray-400">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: days }).map((_, i) => {
              const day = i + 1;
              const disabled = isDisabled(day);
              const isSelected = !disabled && isDateSelected(day);
              const isInRange = !disabled && isDateInRange(day);
              
              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  disabled={disabled}
                  className={`
                    h-9 w-9 text-sm rounded-full flex items-center justify-center transition-colors
                    ${disabled ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}
                    ${isSelected ? 'bg-brand-500 text-white font-bold' : ''}
                    ${isInRange ? 'bg-brand-100 text-brand-700' : ''}
                    ${!isSelected && !isInRange && !disabled ? 'hover:bg-gray-100 text-gray-700' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
