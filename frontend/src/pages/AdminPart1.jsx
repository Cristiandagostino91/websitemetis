import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Package, ShoppingBag, Calendar, Users, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
import { 
  getProducts, createProduct, updateProduct, deleteProduct,
  getServices, createService, updateService, deleteService,
  getOrderStats, getOrders, updateOrderStatus,
  getBookings, updateBookingStatus,
  getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost
} from '../services/api';
import { toast } from '../hooks/use-toast';

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

  // Products state
  const [products, setProducts] = useState([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'integratori',
    price: '',
    image: '',
    description: '',
    inStock: true,
    featured: false
  });

  // Services state
  const [services, setServices] = useState([]);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'consulenze',
    price: '',
    duration: '',
    description: '',
    image: ''
  });

  // Orders state
  const [orders, setOrders] = useState([]);

  // Bookings state
  const [bookings, setBookings] = useState([]);

  // Blog state
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Dott.ssa Paola Buoninfante',
    date: new Date().toLocaleDateString('it-IT'),
    image: '',
    category: '',
    published: true
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'prodotti') {
      fetchProducts();
    } else if (activeTab === 'servizi') {
      fetchServices();
    } else if (activeTab === 'ordini') {
      fetchOrders();
    } else if (activeTab === 'prenotazioni') {
      fetchBookings();
    } else if (activeTab === 'blog') {
      fetchBlogPosts();
    }
  }, [activeTab]);

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

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const data = await getBlogPosts();
      setBlogPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  // Product handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
        toast({ title: "Prodotto aggiornato!", description: "Le modifiche sono state salvate." });
      } else {
        await createProduct(data);
        toast({ title: "Prodotto creato!", description: "Il nuovo prodotto è stato aggiunto." });
      }

      setProductDialogOpen(false);
      resetProductForm();
      fetchProducts();
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile salvare il prodotto.", variant: "destructive" });
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      inStock: product.inStock,
      featured: product.featured
    });
    setProductDialogOpen(true);
  };

  const handleProductDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProduct(id);
        toast({ title: "Prodotto eliminato!", description: "Il prodotto è stato rimosso." });
        fetchProducts();
      } catch (error) {
        toast({ title: "Errore", description: "Impossibile eliminare il prodotto.", variant: "destructive" });
      }
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'integratori',
      price: '',
      image: '',
      description: '',
      inStock: true,
      featured: false
    });
  };

  // Service handlers
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...serviceForm,
        price: parseFloat(serviceForm.price)
      };

      if (editingService) {
        await updateService(editingService.id, data);
        toast({ title: "Servizio aggiornato!", description: "Le modifiche sono state salvate." });
      } else {
        await createService(data);
        toast({ title: "Servizio creato!", description: "Il nuovo servizio è stato aggiunto." });
      }

      setServiceDialogOpen(false);
      resetServiceForm();
      fetchServices();
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile salvare il servizio.", variant: "destructive" });
    }
  };

  const handleServiceEdit = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      category: service.category,
      price: service.price.toString(),
      duration: service.duration,
      description: service.description,
      image: service.image
    });
    setServiceDialogOpen(true);
  };

  const handleServiceDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo servizio?')) {
      try {
        await deleteService(id);
        toast({ title: "Servizio eliminato!", description: "Il servizio è stato rimosso." });
        fetchServices();
      } catch (error) {
        toast({ title: "Errore", description: "Impossibile eliminare il servizio.", variant: "destructive" });
      }
    }
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({
      title: '',
      category: 'consulenze',
      price: '',
      duration: '',
      description: '',
      image: ''
    });
  };

  // Order handlers
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({ title: "Stato aggiornato!", description: "Lo stato dell'ordine è stato modificato." });
      fetchOrders();
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile aggiornare lo stato.", variant: "destructive" });
    }
  };

  // Booking handlers
  const handleBookingStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      toast({ title: "Stato aggiornato!", description: "Lo stato della prenotazione è stato modificato." });
      fetchBookings();
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile aggiornare lo stato.", variant: "destructive" });
    }
  };

  // Blog handlers
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await updateBlogPost(editingBlog.id, blogForm);
        toast({ title: "Articolo aggiornato!", description: "Le modifiche sono state salvate." });
      } else {
        await createBlogPost(blogForm);
        toast({ title: "Articolo creato!", description: "Il nuovo articolo è stato pubblicato." });
      }

      setBlogDialogOpen(false);
      resetBlogForm();
      fetchBlogPosts();
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile salvare l'articolo.", variant: "destructive" });
    }
  };

  const handleBlogEdit = (post) => {
    setEditingBlog(post);
    setBlogForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      image: post.image,
      category: post.category,
      published: post.published
    });
    setBlogDialogOpen(true);
  };

  const handleBlogDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo articolo?')) {
      try {
        await deleteBlogPost(id);
        toast({ title: "Articolo eliminato!", description: "L'articolo è stato rimosso." });
        fetchBlogPosts();
      } catch (error) {
        toast({ title: "Errore", description: "Impossibile eliminare l'articolo.", variant: "destructive" });
      }
    }
  };

  const resetBlogForm = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      author: 'Dott.ssa Paola Buoninfante',
      date: new Date().toLocaleDateString('it-IT'),
      image: '',
      category: '',
      published: true
    });
  };

  const statsCards = [
    { label: 'Ordini Totali', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Prodotti', value: stats.totalProducts, icon: Package, color: 'bg-green-100 text-green-600' },
    { label: 'Prenotazioni', value: stats.totalBookings, icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { label: 'Fatturato', value: `€${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: 'bg-yellow-100 text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Pannello Amministrativo</h1>
          <p className="text-green-100">Gestisci il tuo e-commerce</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prodotti">Prodotti</TabsTrigger>
            <TabsTrigger value="servizi">Servizi</TabsTrigger>
            <TabsTrigger value="ordini">Ordini</TabsTrigger>
            <TabsTrigger value="prenotazioni">Prenotazioni</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Caricamento...</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsCards.map((stat, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
                        Ultimi Ordini
                      </h3>
                      {recentOrders.length > 0 ? (
                        <div className="space-y-3">
                          {recentOrders.map((order) => (
                            <div key={order.id} className="flex justify-between items-center py-3 border-b last:border-0">
                              <div>
                                <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                                <p className="text-sm text-gray-600">
                                  {order.customer.firstName} {order.customer.lastName}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">€{order.total.toFixed(2)}</p>
                                <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">Nessun ordine recente</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-600" />
                        Prossime Prenotazioni
                      </h3>
                      {upcomingBookings.length > 0 ? (
                        <div className="space-y-3">
                          {upcomingBookings.map((booking) => (
                            <div key={booking.id} className="flex justify-between items-center py-3 border-b last:border-0">
                              <div>
                                <p className="font-semibold text-gray-900">{booking.serviceName}</p>
                                <p className="text-sm text-gray-600">{booking.customer.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">{booking.date}</p>
                                <p className="text-xs text-gray-500">{booking.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">Nessuna prenotazione in attesa</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Products Tab - I'll continue in the next file part */}
          <TabsContent value="prodotti">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Gestione Prodotti</h3>
                  <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={resetProductForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nuovo Prodotto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome Prodotto *</Label>
                          <Input
                            id="name"
                            value={productForm.name}
                            onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">Categoria</Label>
                            <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="integratori">Integratori</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="price">Prezzo (€) *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={productForm.price}
                              onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="image">URL Immagine *</Label>
                          <Input
                            id="image"
                            value={productForm.image}
                            onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                            placeholder="https://..."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrizione *</Label>
                          <Textarea
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-6">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={productForm.inStock}
                              onChange={(e) => setProductForm({...productForm, inStock: e.target.checked})}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">Disponibile</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={productForm.featured}
                              onChange={(e) => setProductForm({...productForm, featured: e.target.checked})}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">In evidenza</span>
                          </label>
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)}>
                            Annulla
                          </Button>
                          <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            {editingProduct ? 'Salva Modifiche' : 'Crea Prodotto'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="h-40 overflow-hidden bg-gray-100">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-green-600">€{product.price.toFixed(2)}</span>
                          <div className="flex gap-1">
                            {product.inStock && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Disponibile</span>
                            )}
                            {product.featured && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Featured</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleProductEdit(product)} className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifica
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleProductDelete(product.id)} className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with other tabs... I'll send the rest in parts */}
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;