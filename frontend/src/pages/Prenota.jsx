import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { createContactMessage } from '../services/api';
import { Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Prenota = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createContactMessage({
        name: `${formData.name} ${formData.surname}`,
        email: formData.email,
        phone: formData.phone,
        message: formData.message || 'Richiesta di prenotazione consulenza'
      });
      
      setSubmitted(true);
      toast({
        title: "Richiesta inviata!",
        description: "Ti contatteremo il più presto possibile.",
      });
    } catch (error) {
      console.error('Error sending request:', error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la richiesta. Riprova.",
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Grazie per averci contattato!</h2>
            <p className="text-gray-600 mb-6">
              Ti risponderemo il più presto possibile per fissare un appuntamento.
            </p>
            <Button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', surname: '', email: '', phone: '', message: '' });
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Invia un'altra richiesta
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Richiedi una Consulenza</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Compila il form o chiamaci per prenotare un appuntamento presso lo studio nutrizionale
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Richiedi un Appuntamento</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1"
                        data-testid="prenota-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="surname">Cognome *</Label>
                      <Input
                        id="surname"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                        className="mt-1"
                        data-testid="prenota-surname"
                      />
                    </div>
                  </div>

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
                      data-testid="prenota-email"
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
                      data-testid="prenota-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Messaggio</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Descrivi brevemente il motivo della consulenza o eventuali richieste particolari..."
                      rows={4}
                      className="mt-1"
                      data-testid="prenota-message"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    size="lg"
                    disabled={loading}
                    data-testid="prenota-submit"
                  >
                    {loading ? 'Invio in corso...' : 'Invia Richiesta'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Phone */}
            <Card className="bg-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-green-100 text-sm">Chiama ora</p>
                    <a href="tel:+390828526155" className="text-xl font-bold hover:underline">
                      +39 0828 52615
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <a href="mailto:info@centrometis.it" className="font-semibold text-gray-900 hover:text-green-600">
                      info@centrometis.it
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Sede</p>
                    <p className="font-semibold text-gray-900">
                      Via John Fitzgerald Kennedy, 66
                    </p>
                    <p className="text-gray-600">84092 Bellizzi (SA)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hours */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Orari</p>
                    <p className="font-semibold text-gray-900">Su appuntamento</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Contattaci per fissare un appuntamento in base alle tue esigenze
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Note */}
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                📍 <strong>Iscrizione Albo n. 052079</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prenota;
