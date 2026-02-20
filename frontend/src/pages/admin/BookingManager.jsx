import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Calendar, Search, Eye, User, Clock, Phone, Mail } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { getBookings, updateBookingStatus } from '../../services/api';

const BookingManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const statusOptions = [
    { value: 'pending', label: 'In Attesa', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'confirmed', label: 'Confermato', color: 'bg-green-100 text-green-700' },
    { value: 'completed', label: 'Completato', color: 'bg-blue-100 text-blue-700' },
    { value: 'cancelled', label: 'Annullato', color: 'bg-red-100 text-red-700' }
  ];

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings(filterStatus || null);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      await fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Errore nell\'aggiornamento dello stato');
    }
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find(o => o.value === status) || statusOptions[0];
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${option.color}`}>
        {option.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter(b =>
    b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by date (upcoming first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Cerca prenotazioni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="booking-search-input"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-3 rounded-md border border-gray-200 bg-white min-w-[150px]"
          data-testid="booking-status-filter"
        >
          <option value="">Tutti gli stati</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prenotazione</TableHead>
                <TableHead>Servizio</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data & Ora</TableHead>
                <TableHead className="text-right">Prezzo</TableHead>
                <TableHead className="text-center">Stato</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    Nessuna prenotazione trovata
                  </TableCell>
                </TableRow>
              ) : (
                sortedBookings.map((booking) => {
                  const bookingDate = new Date(`${booking.date}T${booking.time}`);
                  const isPast = bookingDate < new Date();
                  const isToday = new Date(booking.date).toDateString() === new Date().toDateString();
                  
                  return (
                    <TableRow 
                      key={booking.id} 
                      className={isPast ? 'opacity-60' : isToday ? 'bg-green-50' : ''}
                      data-testid={`booking-row-${booking.id}`}
                    >
                      <TableCell>
                        <p className="font-mono font-semibold text-sm">{booking.bookingNumber}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{booking.serviceName}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{booking.customer.name}</p>
                        <p className="text-xs text-gray-500">{booking.customer.email}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {new Date(booking.date).toLocaleDateString('it-IT', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                              })}
                              {isToday && <span className="ml-2 text-xs text-green-600 font-semibold">OGGI</span>}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {booking.time}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        €{booking.servicePrice.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className="h-8 px-2 text-xs rounded border border-gray-200 bg-white"
                            data-testid={`booking-status-select-${booking.id}`}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedBooking(booking)}
                            data-testid={`view-booking-${booking.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Dettagli Prenotazione</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="font-mono text-lg font-bold text-green-700">{selectedBooking.bookingNumber}</p>
                <div className="mt-2">
                  {getStatusBadge(selectedBooking.status)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data e Ora
                  </h4>
                  <p className="font-medium">
                    {new Date(selectedBooking.date).toLocaleDateString('it-IT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-lg font-bold text-green-600">{selectedBooking.time}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Servizio</h4>
                  <p className="font-medium">{selectedBooking.serviceName}</p>
                  <p className="text-lg font-bold text-green-600">€{selectedBooking.servicePrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Dati Cliente
                </h4>
                <div className="space-y-2">
                  <p className="font-medium text-lg">{selectedBooking.customer.name}</p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {selectedBooking.customer.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    {selectedBooking.customer.phone}
                  </p>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-yellow-700 mb-2">Note</h4>
                  <p className="text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                  disabled={selectedBooking.status === 'confirmed'}
                >
                  Conferma
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                  disabled={selectedBooking.status === 'completed'}
                >
                  Completa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManager;
