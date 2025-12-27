import jsPDF from 'jspdf';
import { QuoteRequest, Hotel, CostBreakdown } from '../types';
import { formatCurrency, formatDate } from './calculator';

export const generatePDF = (hotel: Hotel, request: QuoteRequest, breakdown: CostBreakdown) => {
  const doc = new jsPDF();
  const lineHeight = 7;
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setTextColor(24, 114, 125); // Brand Teal
  doc.text('Living the Globe', 105, y, { align: 'center' });
  
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'bold');
  doc.text('Agent Name: Living the Globe', 105, y, { align: 'center' });

  y += 10;
  doc.setFontSize(14);
  doc.text('Estimated Hotel Quote', 105, y, { align: 'center' });

  y += 20;
  
  // Client Info
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information', 14, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  
  // Dynamic Guest Names
  const guestDetails = request.guestNames || 'Not provided';
  const splitNames = doc.splitTextToSize(`Guests: ${guestDetails}`, 180);
  doc.text(splitNames, 14, y);
  y += (splitNames.length * 5);
  
  doc.text(`Email: ${request.customerEmail || 'Not provided'}`, 14, y);

  y += 12;
  
  // Property Info
  doc.setFont('helvetica', 'bold');
  doc.text('Property', 14, y);
  doc.setFont('helvetica', 'normal');
  y += 6;
  doc.text(hotel.name, 14, y);
  y += 5;
  doc.text(`${hotel.island}, ${hotel.atoll}`, 14, y);

  // Stay Details
  y += 12;
  doc.line(14, y - 5, 196, y - 5);
  doc.setFont('helvetica', 'bold');
  doc.text('Stay Details', 14, y);
  doc.setFont('helvetica', 'normal');
  
  y += 7;
  if (request.checkIn && request.checkOut) {
    doc.text(`Check-in: ${formatDate(request.checkIn)}`, 14, y);
    doc.text(`Check-out: ${formatDate(request.checkOut)}`, 80, y);
    doc.text(`Nights: ${breakdown.nights}`, 150, y);
  }

  // Party
  y += 7;
  let totalAdults = 0;
  let totalChildren = 0;
  let totalInfants = 0;
  request.rooms.forEach(r => {
    r.guests.forEach(g => {
      if (g.type === 'adult') totalAdults++;
      if (g.type === 'child') totalChildren++;
      if (g.type === 'infant') totalInfants++;
    });
  });
  doc.text(`Rooms: ${request.rooms.length}`, 14, y);
  doc.text(`Party: ${totalAdults} Adults, ${totalChildren} Children, ${totalInfants} Infants`, 80, y);

  // Special Occasions
  if (request.celebrations?.birthday || request.celebrations?.anniversary || request.specialRequests) {
    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.text('Special Occasions & Requests', 14, y);
    doc.setFont('helvetica', 'normal');
    y += 7;
    
    let occurrences = [];
    if (request.celebrations?.birthday) occurrences.push('Birthday');
    if (request.celebrations?.anniversary) occurrences.push('Anniversary');
    
    if (occurrences.length > 0) {
      doc.text(`Occasion: ${occurrences.join(' & ')}`, 14, y);
      if (request.celebrationDate) {
        doc.text(`Date: ${request.celebrationDate}`, 80, y);
      }
      y += 6;
    }
    
    if (request.specialRequests) {
      doc.text('Special Requests:', 14, y);
      const splitReqs = doc.splitTextToSize(request.specialRequests, 160);
      doc.text(splitReqs, 45, y);
      y += (splitReqs.length * 5);
    }
  }

  // Package
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.text('Package Selection', 14, y);
  doc.setFont('helvetica', 'normal');
  y += 7;
  
  const mealPlan = hotel.mealPlans.find(mp => mp.id === request.mealPlanId);
  // Fix: Handle empty transferId (Not Selected) correctly
  const transferName = request.transferId === 'no-transfer' 
    ? 'I will book my own transfer' 
    : (hotel.transfers.find(t => t.id === request.transferId)?.name || 'Not Selected');

  doc.text(`• Accommodation: ${request.rooms.map(r => r.roomType).join(', ')}`, 14, y);
  y += 6;
  doc.text(`• Meal Plan: ${mealPlan?.name || 'Standard'}`, 14, y);
  y += 6;
  doc.text(`• Transfer: ${transferName}`, 14, y);
  y += 6;
  doc.text(`• Mandatory Green Tax ($6.00 per person per night) - Included in Total`, 14, y);

  // Pricing Table
  y += 15;
  doc.line(14, y - 2, 196, y - 2);
  doc.setFont('helvetica', 'bold');
  doc.text('Cost Breakdown', 14, y + 4);
  doc.text('Amount (USD)', 196, y + 4, { align: 'right' });
  y += 10;

  const addLine = (label: string, value: number, isBold: boolean = false) => {
    if (value < 0) return;
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(label, 14, y);
    doc.text(formatCurrency(value), 196, y, { align: 'right' });
    y += lineHeight;
  };

  addLine('Accommodation Cost', breakdown.totalRoomCost);
  addLine('Meal Plan Supplements', breakdown.totalMealCost);
  addLine('Transfers', breakdown.totalTransferCost);
  addLine('Green Tax (Mandatory)', breakdown.totalGreenTax);
  if (breakdown.totalOccasionSupplements > 0) {
    addLine('Holiday Supplements', breakdown.totalOccasionSupplements);
  }

  y += 2;
  doc.line(14, y, 196, y);
  y += 8;
  doc.setFontSize(12);
  addLine('Grand Total (Estimated)', breakdown.grandTotal, true);

  y += 20;
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'italic');
  doc.text('Note: Suggested rates are estimated based on direct property rates provided to Living the Globe.', 14, y);
  y += 5;
  doc.text('All rates and room categories are subject to availability at the time of final booking confirmation by the property.', 14, y);

  doc.save(`Quote_LTG_${hotel.name.replace(/\s/g, '_')}.pdf`);
};