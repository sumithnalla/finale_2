import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { venuesData } from '../data/artistsData';
import { CreditCard, Building, Users, Calendar, Clock, Info } from 'lucide-react';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const venueId = parseInt(searchParams.get('venue') || '1');
  const venue = venuesData.find((v) => v.id === venueId);
  const [selectedDate, setSelectedDate] = useState('');

  const [formData, setFormData] = useState({
    bookingName: '',
    persons: '1',
    whatsapp: '',
    email: '',
    decoration: 'no',
    slot: '',
  });

  // Filter out past slots for the current day
  const getAvailableSlots = () => {
    if (!venue) return [];
    
    const now = new Date();
    const selectedDateTime = selectedDate ? new Date(selectedDate) : now;
    const isToday = selectedDateTime.toDateString() === now.toDateString();
    
    return venue.slots.filter(slot => {
      if (!isToday) return true;
      
      const [startTime] = slot.split(' - ');
      const [hours, minutes] = startTime.split(':');
      const slotTime = new Date();
      slotTime.setHours(parseInt(hours), parseInt(minutes.replace(/[ap]m/i, '')));
      
      return slotTime > now;
    });
  };

  if (!venue) return <div>Venue not found</div>;

  const basePrice = parseInt(venue.price.replace(/[^\d]/g, ''));
  const decorationFee = formData.decoration === 'yes' ? parseInt(venue.decorationFee.replace(/[^\d]/g, '')) : 0;
  const advanceAmount = 500;
  const balanceAmount = basePrice + decorationFee - advanceAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing payment...', { formData, advanceAmount });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Building className="h-8 w-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-white">Complete Your Booking</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Venue</p>
                      <p className="text-white font-medium">{venue.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-transparent text-white font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="text-gray-400 text-sm">Slots</p>
                      <select
                        value={formData.slot}
                        onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                        className="bg-transparent text-white font-medium focus:outline-none"
                      >
                        <option value="">Select a slot</option>
                        {getAvailableSlots().map((slot) => (
                          <option key={slot} value={slot} className="bg-gray-800">
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6">
                {/* Rest of the form remains unchanged */}
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 sticky top-6">
                {/* Booking summary remains unchanged */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;