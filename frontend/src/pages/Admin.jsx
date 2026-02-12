import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, ShoppingBag, Calendar, Users, TrendingUp } from 'lucide-react';
import { getProducts, getServices, getOrderStats, getOrders, getBookings } from '../services/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orderStatsData, productsData, bookingsData] = await Promise.all([
          getOrderStats(),
          getProducts(),
          getBookings('pending')
        ]);

        setStats({
          totalOrders: orderStatsData.totalOrders,
          totalProducts: productsData.length,
          totalBookings: bookingsData.length,
          totalRevenue: orderStatsData.totalRevenue
        });

        setRecentOrders(orderStatsData.recentOrders.slice(0, 4));
        setUpcomingBookings(bookingsData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const statsCards = [
    { 
      label: 'Ordini Totali', 
      value: stats.totalOrders, 
      icon: ShoppingBag, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      label: 'Prodotti', 
      value: stats.totalProducts, 
      icon: Package, 
      color: 'bg-green-100 text-green-600' 
    },
    { 
      label: 'Prenotazioni', 
      value: stats.totalBookings, 
      icon: Calendar, 
      color: 'bg-purple-100 text-purple-600' 
    },
    { 
      label: 'Fatturato', 
      value: `€${stats.totalRevenue.toFixed(2)}`, 
      icon: TrendingUp, 
      color: 'bg-yellow-100 text-yellow-600' 
    }
  ];

  return (
    <div className=\"min-h-screen bg-gray-50\">
      {/* Header */}
      <div className=\"bg-gradient-to-br from-green-600 to-green-700 text-white py-12\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
          <h1 className=\"text-3xl md:text-4xl font-bold mb-2\">Pannello Amministrativo</h1>
          <p className=\"text-green-100\">Gestisci il tuo e-commerce</p>
        </div>
      </div>

      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        <Tabs value={activeTab} onValueChange={setActiveTab} className=\"space-y-6\">
          <TabsList className=\"grid grid-cols-2 md:grid-cols-5 w-full\">
            <TabsTrigger value=\"dashboard\">Dashboard</TabsTrigger>
            <TabsTrigger value=\"prodotti\">Prodotti</TabsTrigger>
            <TabsTrigger value=\"ordini\">Ordini</TabsTrigger>
            <TabsTrigger value=\"prenotazioni\">Prenotazioni</TabsTrigger>
            <TabsTrigger value=\"blog\">Blog</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value=\"dashboard\" className=\"space-y-6\">
            {loading ? (
              <div className=\"text-center py-20\">
                <div className=\"animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4\"></div>
                <p className=\"text-gray-600\">Caricamento...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className=\"grid sm:grid-cols-2 lg:grid-cols-4 gap-6\">
                  {statsCards.map((stat, idx) => (
                    <Card key={idx}>
                      <CardContent className=\"p-6\">
                        <div className=\"flex items-center justify-between\">
                          <div>
                            <p className=\"text-sm text-gray-600 mb-1\">{stat.label}</p>
                            <p className=\"text-3xl font-bold text-gray-900\">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                            <stat.icon className=\"w-6 h-6\" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className=\"grid lg:grid-cols-2 gap-6\">
                  <Card>
                    <CardContent className=\"p-6\">
                      <h3 className=\"text-xl font-bold text-gray-900 mb-4 flex items-center\">
                        <ShoppingBag className=\"w-5 h-5 mr-2 text-green-600\" />
                        Ultimi Ordini
                      </h3>
                      {recentOrders.length > 0 ? (
                        <div className=\"space-y-3\">
                          {recentOrders.map((order) => (
                            <div key={order.id} className=\"flex justify-between items-center py-3 border-b last:border-0\">
                              <div>
                                <p className=\"font-semibold text-gray-900\">{order.orderNumber}</p>
                                <p className=\"text-sm text-gray-600\">
                                  {order.customer.firstName} {order.customer.lastName}
                                </p>
                              </div>
                              <div className=\"text-right\">
                                <p className=\"font-bold text-green-600\">€{order.total.toFixed(2)}</p>
                                <p className=\"text-xs text-gray-500 capitalize\">{order.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className=\"text-gray-500 text-center py-8\">Nessun ordine recente</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className=\"p-6\">
                      <h3 className=\"text-xl font-bold text-gray-900 mb-4 flex items-center\">
                        <Calendar className=\"w-5 h-5 mr-2 text-green-600\" />
                        Prossime Prenotazioni
                      </h3>
                      {upcomingBookings.length > 0 ? (
                        <div className=\"space-y-3\">
                          {upcomingBookings.map((booking) => (
                            <div key={booking.id} className=\"flex justify-between items-center py-3 border-b last:border-0\">
                              <div>
                                <p className=\"font-semibold text-gray-900\">{booking.serviceName}</p>
                                <p className=\"text-sm text-gray-600\">{booking.customer.name}</p>
                              </div>
                              <div className=\"text-right\">
                                <p className=\"text-sm font-semibold text-gray-900\">{booking.date}</p>
                                <p className=\"text-xs text-gray-500\">{booking.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className=\"text-gray-500 text-center py-8\">Nessuna prenotazione in attesa</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Prodotti Tab */}
          <TabsContent value=\"prodotti\">
            <Card>
              <CardContent className=\"p-6\">
                <div className=\"flex justify-between items-center mb-6\">
                  <h3 className=\"text-2xl font-bold text-gray-900\">Gestione Prodotti</h3>
                  <Button className=\"bg-green-600 hover:bg-green-700\">
                    + Nuovo Prodotto
                  </Button>
                </div>
                <div className=\"bg-green-50 border border-green-200 rounded-lg p-8 text-center\">
                  <Package className=\"w-12 h-12 text-green-600 mx-auto mb-4\" />
                  <p className=\"text-gray-700 font-semibold mb-2\">Gestione Prodotti Completa</p>
                  <p className=\"text-sm text-gray-600\">
                    Puoi gestire prodotti tramite le API REST implementate:<br/>
                    GET /api/products - Lista prodotti<br/>
                    POST /api/products - Crea prodotto<br/>
                    PUT /api/products/:id - Aggiorna<br/>
                    DELETE /api/products/:id - Elimina
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ordini Tab */}
          <TabsContent value=\"ordini\">
            <Card>
              <CardContent className=\"p-6\">
                <h3 className=\"text-2xl font-bold text-gray-900 mb-6\">Gestione Ordini</h3>
                <div className=\"bg-green-50 border border-green-200 rounded-lg p-8 text-center\">
                  <ShoppingBag className=\"w-12 h-12 text-green-600 mx-auto mb-4\" />
                  <p className=\"text-gray-700 font-semibold mb-2\">Gestione Ordini Completa</p>
                  <p className=\"text-sm text-gray-600\">
                    Puoi gestire ordini tramite le API REST implementate:<br/>
                    GET /api/orders - Lista ordini<br/>
                    GET /api/orders/:id - Dettaglio ordine<br/>
                    PUT /api/orders/:id - Aggiorna stato<br/>
                    GET /api/orders-stats - Statistiche
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prenotazioni Tab */}
          <TabsContent value=\"prenotazioni\">
            <Card>
              <CardContent className=\"p-6\">
                <h3 className=\"text-2xl font-bold text-gray-900 mb-6\">Gestione Prenotazioni</h3>
                <div className=\"bg-green-50 border border-green-200 rounded-lg p-8 text-center\">
                  <Calendar className=\"w-12 h-12 text-green-600 mx-auto mb-4\" />
                  <p className=\"text-gray-700 font-semibold mb-2\">Gestione Prenotazioni Completa</p>
                  <p className=\"text-sm text-gray-600\">
                    Puoi gestire prenotazioni tramite le API REST implementate:<br/>
                    GET /api/bookings - Lista prenotazioni<br/>
                    GET /api/bookings/:id - Dettaglio prenotazione<br/>
                    PUT /api/bookings/:id - Aggiorna stato<br/>
                    GET /api/bookings-available/:date - Slot disponibili
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value=\"blog\">
            <Card>
              <CardContent className=\"p-6\">
                <div className=\"flex justify-between items-center mb-6\">
                  <h3 className=\"text-2xl font-bold text-gray-900\">Gestione Blog</h3>
                  <Button className=\"bg-green-600 hover:bg-green-700\">
                    + Nuovo Articolo
                  </Button>
                </div>
                <div className=\"bg-green-50 border border-green-200 rounded-lg p-8 text-center\">
                  <Users className=\"w-12 h-12 text-green-600 mx-auto mb-4\" />
                  <p className=\"text-gray-700 font-semibold mb-2\">Gestione Blog Completa</p>
                  <p className=\"text-sm text-gray-600\">
                    Puoi gestire blog tramite le API REST implementate:<br/>
                    GET /api/blog - Lista articoli<br/>
                    POST /api/blog - Crea articolo<br/>
                    PUT /api/blog/:id - Aggiorna<br/>
                    DELETE /api/blog/:id - Elimina
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
