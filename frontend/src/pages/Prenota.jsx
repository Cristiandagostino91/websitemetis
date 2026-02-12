import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getServices, createBooking, getAvailableSlots } from '../services/api';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toast } from '../hooks/use-toast';

const Prenota = () => {
  const [date, setDate] = useState();
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (date) {
        try {
          const dateStr = format(date, 'yyyy-MM-dd');
          const data = await getAvailableSlots(dateStr);
          setAvailableSlots(data.availableSlots);
        } catch (error) {
          console.error('Error fetching available slots:', error);
        }
      }
    };

    fetchAvailableSlots();
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "Errore",
        description: "Seleziona una data per la prenotazione.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const bookingData = {
        serviceId: formData.service,
        date: format(date, 'yyyy-MM-dd'),
        time: formData.time,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        notes: formData.notes
      };

      await createBooking(bookingData);
      
      toast({
        title: "Prenotazione confermata!",
        description: "Ti contatteremo presto per confermare l'appuntamento.",
      });
      
      // Reset form
      setFormData({
        service: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        notes: ''
      });
      setDate(undefined);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Errore",
        description: error.response?.data?.detail || "Impossibile completare la prenotazione.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Prenota una Consulenza</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Scegli il servizio e la data che preferisci per iniziare il tuo percorso
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <Label htmlFor="service">Seleziona Servizio *</Label>
                <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Scegli un servizio" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.title} - €{service.price.toFixed(2)} ({service.duration})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div>
                <Label>Data Preferita *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-1"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: it }) : <span>Seleziona una data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div>
                <Label htmlFor="time">Orario Preferito *</Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData({...formData, time: value})}
                  disabled={!date || availableSlots.length === 0}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={date ? "Scegli un orario" : "Seleziona prima una data"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {time}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {date && availableSlots.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">Nessun orario disponibile per questa data</p>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">I Tuoi Dati</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome e Cognome *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefono *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Note Aggiuntive</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Eventuali richieste particolari o informazioni che vuoi condividere..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  ℹ️ La prenotazione sarà confermata dal nostro staff tramite telefono o email.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Invio in corso...' : 'Invia Richiesta di Prenotazione'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Prenota;