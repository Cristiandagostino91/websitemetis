import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, ShoppingBag, Calendar, Users, FileText, TrendingUp } from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock stats
  const stats = [
    { label: 'Ordini Totali', value: '156', icon: ShoppingBag, change: '+12%' },
    { label: 'Prodotti', value: '24', icon: Package, change: '+3' },
    { label: 'Prenotazioni', value: '89', icon: Calendar, change: '+18%' },
    { label: 'Clienti', value: '342', icon: Users, change: '+24%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pannello Amministrativo</h1>
          <p className="text-green-100">Gestisci il tuo e-commerce</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prodotti">Prodotti</TabsTrigger>
            <TabsTrigger value="ordini">Ordini</TabsTrigger>
            <TabsTrigger value="prenotazioni">Prenotazioni</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600 font-semibold mt-1">
                          {stat.change}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
                    Ultimi Ordini
                  </h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <p className="font-semibold text-gray-900">Ordine #{1000 + i}</p>
                          <p className="text-sm text-gray-600">Mario Rossi</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">€{(29.90 * i).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Oggi</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    Prossime Prenotazioni
                  </h3>
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b last:border-0">
                        <div>
                          <p className="font-semibold text-gray-900">Consulenza Nutrizionale</p>
                          <p className="text-sm text-gray-600">Cliente {i}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">14/{i+10}/2025</p>
                          <p className="text-xs text-gray-500">{9 + i}:00</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Prodotti Tab */}
          <TabsContent value="prodotti">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Gestione Prodotti</h3>
                  <Button className="bg-green-600 hover:bg-green-700">
                    + Nuovo Prodotto
                  </Button>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">Funzionalità in fase di sviluppo backend</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Qui potrai gestire prodotti, categorie, prezzi e stock
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ordini Tab */}
          <TabsContent value="ordini">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Gestione Ordini</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">Funzionalità in fase di sviluppo backend</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Qui potrai gestire ordini, stati di consegna e fatture
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prenotazioni Tab */}
          <TabsContent value="prenotazioni">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Gestione Prenotazioni</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">Funzionalità in fase di sviluppo backend</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Qui potrai gestire le prenotazioni, calendario e disponibilità
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Gestione Blog</h3>
                  <Button className="bg-green-600 hover:bg-green-700">
                    + Nuovo Articolo
                  </Button>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">Funzionalità in fase di sviluppo backend</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Qui potrai creare e gestire articoli del blog
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;