import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SERVICES, WHATSAPP_NUMBER } from '../constants';
import { Service, Booking as BookingType, BlockedDate, TimeSlot } from '../types';
import { Calendar as CalendarIcon, Clock, CreditCard, Send, Plus, User, AlertCircle } from 'lucide-react';

const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [mode, setMode] = useState<'create' | 'list'>('list');
  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [clientName, setClientName] = useState('');
  const [existingBookings, setExistingBookings] = useState<BookingType[]>([]);
  const [isClientMode, setIsClientMode] = useState(true); // Padrão seguro = TRUE

  // Load initial data
  useEffect(() => {
    // Check user role
    const role = localStorage.getItem('userRole');
    // Se NÃO for admin, é cliente (segurança por padrão)
    const isClient = role !== 'admin';
    setIsClientMode(isClient);

    // Load existing data
    const storedBlocked = localStorage.getItem('blockedDates');
    if (storedBlocked) setBlockedDates(JSON.parse(storedBlocked));

    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) setExistingBookings(JSON.parse(storedBookings));

    // Check for service selection to decide mode
    const state = location.state as { preSelectedServiceId?: string };
    if (state?.preSelectedServiceId) {
      const found = SERVICES.find(s => s.id === state.preSelectedServiceId);
      if (found) {
        setService(found);
        setMode('create');
      }
    } else {
      // If no service selected...
      if (isClient) {
        // If client tries to access list view, force them back to home or show warning
        // We don't want clients seeing the schedule list
        setMode('create'); // Will force "No service selected" view
      } else {
        setMode('list');
      }
    }
  }, [location.state]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTime(null); // Reset time when date changes
  };

  const isDateBlocked = (date: string) => {
    return blockedDates.some(b => b.date === date);
  };

  const isTimeSlotTaken = (date: string, time: TimeSlot) => {
    return existingBookings.some(b => b.date === date && b.time === time && b.status !== 'cancelled');
  };

  const handleBookingConfirm = () => {
    if (!service || !selectedDate || !selectedTime || !clientName) return;

    const newBooking: BookingType = {
      id: Date.now().toString(),
      serviceId: service.id,
      date: selectedDate,
      time: selectedTime,
      clientName,
      status: 'pending'
    };

    const updatedBookings = [...existingBookings, newBooking];
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setExistingBookings(updatedBookings);

    const msg = `Olá Studio Elidiane Monteiro! 🌸%0A%0AGostaria de confirmar meu agendamento:%0A%0A✨ *Serviço:* ${service.name}%0A📅 *Data:* ${selectedDate.split('-').reverse().join('/')}%0A⏰ *Horário:* ${selectedTime}%0A💰 *Valor:* R$ ${service.price},00%0A👤 *Cliente:* ${clientName}%0A%0AAguardo confirmação!`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    navigate('/');
  };

  const getServiceName = (id: string) => SERVICES.find(s => s.id === id)?.name || 'Serviço desconhecido';

  // Sort bookings: Future dates first, then by time
  const sortedBookings = [...existingBookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return dateA - dateB; 
  });

  // Render Logic

  // 1. If Client Mode AND no service selected (trying to access /booking directly)
  if (isClientMode && !service) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <AlertCircle size={48} className="text-studio-pink mb-4" />
        <h2 className="font-serif text-xl mb-2 text-studio-dark">Agendamento</h2>
        <p className="text-studio-gray mb-6 text-sm">Por favor, selecione um serviço na tela inicial para começar seu agendamento.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-studio-dark text-white px-6 py-3 rounded-xl font-bold uppercase text-xs"
        >
          Ver Serviços
        </button>
      </div>
    );
  }

  // 2. Admin List View
  if (mode === 'list' && !isClientMode) {
    return (
      <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen">
        <h1 className="font-serif text-2xl text-studio-dark mb-6">Agenda do Studio</h1>
        
        {sortedBookings.length === 0 ? (
          <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-studio-gray/30">
            <p className="text-studio-gray font-serif mb-4">Nenhum agendamento encontrado.</p>
            <button 
              onClick={() => navigate('/')} 
              className="text-studio-pinkDark font-bold underline hover:text-studio-pink"
            >
              Fazer o primeiro agendamento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBookings.map((booking) => (
              <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-studio-pink flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 text-studio-pinkDark font-bold text-lg">
                      <CalendarIcon size={16} />
                      <span>{booking.date.split('-').reverse().join('/')}</span>
                      <span className="text-studio-gray text-xs font-normal">às {booking.time}</span>
                    </div>
                    <h3 className="font-serif text-studio-dark text-lg mt-1">{getServiceName(booking.serviceId)}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-studio-gray text-sm mt-1 bg-studio-beige/30 p-2 rounded-lg">
                  <User size={14} />
                  <span className="font-semibold uppercase tracking-wide">{booking.clientName}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="fixed bottom-24 right-6 bg-studio-pink text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-studio-pinkDark transition-colors z-40"
          title="Novo Agendamento"
        >
          <Plus size={28} />
        </button>
      </div>
    );
  }

  // 3. Create Mode (Booking Form) - Available to all
  if (!service) return null; 

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <button 
          onClick={() => isClientMode ? navigate('/') : setMode('list')} 
          className="text-studio-gray hover:text-studio-dark text-sm underline"
        >
          &larr; Voltar
        </button>
        <h1 className="font-serif text-2xl text-studio-dark">Finalizar Agendamento</h1>
      </div>

      {/* Service Summary */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-studio-pink/20 mb-6">
        <p className="text-xs text-studio-gray uppercase tracking-wider mb-1">Serviço Escolhido</p>
        <h3 className="font-serif text-xl text-studio-dark">{service.name}</h3>
        <p className="text-studio-gold font-bold mt-1">R$ {service.price.toFixed(2)}</p>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-studio-dark mb-2 flex items-center gap-2">
          <CalendarIcon size={16} /> Escolha a Data
        </label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-3 rounded-xl border border-studio-gray/30 bg-white font-sans text-studio-dark focus:border-studio-pink outline-none"
        />
        {selectedDate && isDateBlocked(selectedDate) && (
          <p className="text-red-400 text-xs mt-2">Data indisponível pelo estabelecimento.</p>
        )}
      </div>

      {/* Time Slots */}
      {selectedDate && !isDateBlocked(selectedDate) && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-studio-dark mb-2 flex items-center gap-2">
            <Clock size={16} /> Horário de Entrada
          </label>
          <p className="text-xs text-studio-gray mb-3">Trabalhamos com turnos fechados para melhor atendimento.</p>
          
          <div className="grid grid-cols-2 gap-4">
            {(['08:00', '14:00'] as TimeSlot[]).map((time) => {
              const isTaken = isTimeSlotTaken(selectedDate, time);
              return (
                <button
                  key={time}
                  disabled={isTaken}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl border transition-all ${
                    isTaken 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : selectedTime === time
                        ? 'bg-studio-pink text-white border-studio-pink shadow-md'
                        : 'bg-white text-studio-dark border-studio-gray/30 hover:border-studio-pink'
                  }`}
                >
                  <span className="text-lg font-sans font-bold">{time}</span>
                  <span className="block text-[10px] uppercase">{time === '08:00' ? 'Manhã' : 'Tarde'}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Client Name */}
      {selectedTime && (
        <div className="mb-8">
           <label className="block text-sm font-semibold text-studio-dark mb-2">
             Seu Nome
          </label>
          <input 
            type="text" 
            placeholder="Digite seu nome completo"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-3 rounded-xl border border-studio-gray/30 bg-white focus:border-studio-pink outline-none"
          />
        </div>
      )}

      {/* Payment Info */}
      <div className="mb-8 bg-studio-beige p-4 rounded-xl border border-studio-pink/10">
        <div className="flex items-center gap-2 mb-2 text-studio-dark font-bold">
          <CreditCard size={18} />
          <span>Pagamento Antecipado?</span>
        </div>
        <p className="text-xs text-studio-gray mb-4">
          Garanta seu horário pagando via Pix.
        </p>
        
        <div className="bg-white p-4 rounded-lg flex flex-col items-center justify-center mb-4">
           {/* Dummy QR Code using an API for visualization */}
           <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020126580014BR.GOV.BCB.PIX0136919887414785204000053039865405${service.price.toFixed(2).replace('.', '')}5802BR5924Elidiane Monteiro6009Belem62070503***6304`} 
            alt="Pix QR Code" 
            className="w-32 h-32 opacity-90"
          />
           <p className="text-[10px] text-gray-400 mt-2">Chave Pix (Celular): 91988741478</p>
        </div>

        <button 
          onClick={() => {
            const msg = `Olá, aqui está meu comprovante de pagamento para ${service.name} no dia ${selectedDate}.`;
            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
          }}
          className="w-full border border-studio-dark/20 bg-transparent py-2 rounded-lg text-xs font-bold uppercase hover:bg-white transition-colors"
        >
          Enviar Comprovante
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleBookingConfirm}
        disabled={!clientName || !selectedTime}
        className="w-full bg-studio-pink hover:bg-studio-pinkDark text-white py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Send size={18} />
        <span className="font-bold">Solicitar Agendamento</span>
      </button>

    </div>
  );
};

export default Booking;