import React, { useMemo } from 'react';
import { CalendarPicker } from './CalendarPicker';

interface DateSelectorProps {
  checkIn: Date | null;
  checkOut: Date | null;
  onCheckInChange: (date: Date | null) => void;
  onCheckOutChange: (date: Date | null) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ checkIn, checkOut, onCheckInChange, onCheckOutChange }) => {
  const handleDatesChange = (inDate: Date | null, outDate: Date | null) => {
    onCheckInChange(inDate);
    onCheckOutChange(outDate);
  };
  
  // Same logic: Today + 2 days minimum
  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setHours(0,0,0,0);
    return d;
  }, []);

  return (
    <div className="mb-6">
      <CalendarPicker 
        checkIn={checkIn}
        checkOut={checkOut}
        onDatesChange={handleDatesChange}
        minDate={minDate}
        className="w-full"
      />
    </div>
  );
};
