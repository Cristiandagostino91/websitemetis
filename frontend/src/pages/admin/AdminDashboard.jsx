import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { ShoppingBag, Package, Calendar, TrendingUp, FileText, MessageSquare, Users } from 'lucide-react';
import { getProducts, getServices, getOrderStats, getBookings, getBlogPosts, getContactMessages } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalServices: 0,
    totalBookings: 0,
    totalBlogPosts: 0,
    totalMessages: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [orderStatsData, productsData, servicesData, bookingsData, blogData, messagesData] = await Promise.all([
        getOrderStats(),
        getProducts(),
        getServices(),
        getBookings('pending'),
        getBlogPosts(),
        getContactMessages().catch(() => [])
      ]);

      setStats({
        totalOrders: orderStatsData.totalOrders,
        totalProducts: productsData.length,
        totalServices: servicesData.length,
        totalBookings: bookingsData.length,
        totalBlogPosts: blogData.length,
        totalMessages: messagesData.length || 0,
        totalRevenue: orderStatsData.totalRevenue,
        pendingOrders: orderStatsData.pendingOrders
      });

      setRecentOrders(orderStatsData.recentOrders?.slice(0, 5) || []);
      setUpcomingBookings(bookingsData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      label: 'Fatturato Totale', 
      value: `€${stats.totalRevenue.toFixed(2)}`, 
      icon: TrendingUp, 
      color: 'bg-green-500',
      subtext: `${stats.totalOrders} ordini totali`
    },
    { 
      label: 'Ordini in Attesa', 
      value: stats.pendingOrders, 
      icon: ShoppingBag, 
      color: 'bg-yellow-500',
      subtext: 'Da processare'
    },
    { 
      label: 'Prenotazioni', 
      value: stats.totalBookings, 
      icon: Calendar, 
      color: 'bg-purple-500',
      subtext: 'In attesa di conferma'
    },
    { 
      label: 'Prodotti', 
      value: stats.totalProducts, 
      icon: Package, 
      color: 'bg-blue-500',
      subtext: 'Nel catalogo'
    },
    { 
      label: 'Servizi', 
      value: stats.totalServices, 
      icon: Users, 
      color: 'bg-indigo-500',
      subtext: 'Disponibili'
    },
    { 
      label: 'Articoli Blog', 
      value: stats.totalBlogPosts, 
      icon: FileText, 
      color: 'bg-pink-500',
      subtext: 'Pubblicati'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Caricamento dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsCards.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow" data-testid={`stat-card-${idx}`}>
            <CardContent className="p-4">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-700">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-green-600" />
              Ultimi Ordini
            </h3>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div 
                    key={order.id} 
                    className="flex justify-between items-center py-3 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    data-testid={`recent-order-${order.id}`}
                  >
                    <div>
                      <p className="font-semibold text-gray-900 font-mono text-sm">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">€{order.total?.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {order.status === 'pending' ? 'In attesa' :
                         order.status === 'confirmed' ? 'Confermato' :
                         order.status === 'shipped' ? 'Spedito' : 'Consegnato'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Nessun ordine recente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Prossime Prenotazioni
            </h3>
            {upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => {
                  const isToday = new Date(booking.date).toDateString() === new Date().toDateString();
                  return (
                    <div 
                      key={booking.id} 
                      className={`flex justify-between items-center py-3 px-3 rounded-lg transition-colors ${
                        isToday ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      data-testid={`upcoming-booking-${booking.id}`}
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{booking.serviceName}</p>
                        <p className="text-sm text-gray-600">{booking.customer?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(booking.date).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'short'
                          })}
                          {isToday && <span className="ml-1 text-green-600">(Oggi)</span>}
                        </p>
                        <p className="text-sm text-purple-600 font-medium">{booking.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Nessuna prenotazione in attesa</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-green-800 mb-3">Suggerimenti Rapidi</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-green-700">
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">1.</span>
              <p>Gestisci i tuoi <strong>prodotti</strong> e <strong>servizi</strong> dalle rispettive sezioni</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">2.</span>
              <p>Aggiorna lo stato degli <strong>ordini</strong> per tenere informati i clienti</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500 font-bold">3.</span>
              <p>Pubblica <strong>articoli sul blog</strong> per aumentare la visibilità</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
