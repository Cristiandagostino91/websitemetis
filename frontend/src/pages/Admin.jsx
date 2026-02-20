import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { 
  LayoutDashboard, Package, Sparkles, ShoppingBag, 
  Calendar, FileText, LogOut, Menu, X 
} from 'lucide-react';
import { verifyToken } from '../services/api';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProductManager from './admin/ProductManager';
import ServiceManager from './admin/ServiceManager';
import OrderManager from './admin/OrderManager';
import BookingManager from './admin/BookingManager';
import BlogManager from './admin/BlogManager';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await verifyToken();
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prodotti', label: 'Prodotti', icon: Package },
    { id: 'servizi', label: 'Servizi', icon: Sparkles },
    { id: 'ordini', label: 'Ordini', icon: ShoppingBag },
    { id: 'prenotazioni', label: 'Prenotazioni', icon: Calendar },
    { id: 'blog', label: 'Blog', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button 
                className="lg:hidden p-2 rounded-lg hover:bg-green-500 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div>
                <h1 className="text-xl font-bold">Centro Metis</h1>
                <p className="text-green-200 text-xs">Pannello Amministrativo</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-green-500 hover:text-white"
              onClick={handleLogout}
              data-testid="admin-logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Esci</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b shadow-lg">
          <div className="px-4 py-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tabs */}
          <TabsList className="hidden lg:grid lg:grid-cols-6 w-full bg-white shadow-sm rounded-xl p-1">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg py-3"
                data-testid={`tab-${tab.id}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Mobile Current Tab Indicator */}
          <div className="lg:hidden bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              {tabs.find(t => t.id === activeTab)?.icon && 
                React.createElement(tabs.find(t => t.id === activeTab).icon, { className: "w-5 h-5" })
              }
              {tabs.find(t => t.id === activeTab)?.label}
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="dashboard" className="mt-0">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="prodotti" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Gestione Prodotti
              </h2>
              <ProductManager />
            </div>
          </TabsContent>

          <TabsContent value="servizi" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Gestione Servizi
              </h2>
              <ServiceManager />
            </div>
          </TabsContent>

          <TabsContent value="ordini" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                Gestione Ordini
              </h2>
              <OrderManager />
            </div>
          </TabsContent>

          <TabsContent value="prenotazioni" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                Gestione Prenotazioni
              </h2>
              <BookingManager />
            </div>
          </TabsContent>

          <TabsContent value="blog" className="mt-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-pink-600" />
                Gestione Blog
              </h2>
              <BlogManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
