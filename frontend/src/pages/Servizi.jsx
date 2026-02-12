import React, { useState, useEffect } from 'react';
import { getServices } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Servizi = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i servizi.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const categoryNames = {
    consulenze: 'Consulenze Nutrizionali',
    analisi: 'Analisi e Test',
    programmi: 'Programmi Specializzati'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">I Nostri Servizi</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Consulenze specialistiche e percorsi personalizzati per il tuo benessere
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category} className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {categoryNames[category] || category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-2 text-white">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-semibold">{service.duration}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-3xl font-bold text-green-600">€{service.price.toFixed(2)}</span>
                      </div>
                      <Link to="/prenota">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Calendar className="w-4 h-4 mr-2" />
                          Prenota
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Come funziona?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Prenota</h3>
                <p className="text-gray-600">
                  Scegli il servizio più adatto alle tue esigenze e prenota una consulenza
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Valutazione</h3>
                <p className="text-gray-600">
                  Effettuiamo un'analisi completa con strumentazione avanzata
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Piano Personalizzato</h3>
                <p className="text-gray-600">
                  Ricevi il tuo piano alimentare personalizzato e inizia il percorso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servizi;