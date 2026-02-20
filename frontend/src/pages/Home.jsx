import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Calendar, Heart, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { getProducts, getServices, getBlogPosts } from '../services/api';
import { testimonials } from '../mock/mockData';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';

const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, servicesData, blogData] = await Promise.all([
          getProducts(true), // fetch only featured products
          getServices(),
          getBlogPosts(true)
        ]);
        setProducts(productsData);
        setServices(servicesData);
        setBlogPosts(blogData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati. Riprova più tardi.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Prodotto aggiunto!",
      description: `${product.name} è stato aggiunto al carrello.`,
    });
  };

  const featuredProducts = products.filter(p => p.featured);
  const featuredServices = services.slice(0, 3);

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxNmEzNGEiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6TTAgMThjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnpNMzYgNTRjMC0zLjMxNCAyLjY4Ni02IDYtNnM2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <Heart className="w-4 h-4" />
                <span>Il tuo percorso verso il benessere</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Inizia il tuo percorso di
                <span className="text-green-600"> salute</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Centro Metis è uno studio nutrizionale specializzato in bioterapia nutrizionale. 
                Ti seguiamo con un approccio personalizzato per raggiungere i tuoi obiettivi di salute e benessere.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/prenota">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white group w-full sm:w-auto">
                    Prenota una Consulenza
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/chi-siamo">
                  <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto">
                    Scopri di più
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Pazienti soddisfatti</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Anni di esperienza</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-3xl font-bold text-gray-900">5.0</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800" 
                  alt="Consulenza nutrizionale" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -top-6 -right-6 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, title: 'Piani Personalizzati', desc: 'Ogni piano nutrizionale è strutturato sulle tue esigenze individuali' },
              { icon: Heart, title: 'Approccio Olistico', desc: 'Un team di specialisti ti segue in ogni fase del percorso' },
              { icon: Calendar, title: 'Monitoraggio Costante', desc: 'Controlli periodici per ottimizzare i risultati' }
            ].map((benefit, idx) => (
              <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <benefit.icon className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">I Nostri Servizi</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Consulenze specialistiche e piani nutrizionali per ogni esigenza
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {featuredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">{service.category}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  <Link to="/contatti">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Richiedi Informazioni
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/servizi">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Vedi Tutti i Servizi
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Integratori Selezionati</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Prodotti di alta qualità per supportare il tuo benessere
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-green-600">€{product.price.toFixed(2)}</span>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAddToCart(product)}
                    >
                      Aggiungi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/prodotti">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Vedi Tutti i Prodotti
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Cosa Dicono di Noi</h2>
            <p className="text-xl text-green-100">
              La soddisfazione dei nostri pazienti è la nostra priorità
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-green-100">{testimonial.source}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Dal Nostro Blog</h2>
            <p className="text-xl text-gray-600">
              Consigli e approfondimenti sulla nutrizione
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link to={`/blog/${post.id}`} className="text-green-600 font-semibold hover:text-green-700 inline-flex items-center">
                    Leggi di più
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pronto a iniziare il tuo percorso?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Prenota una consulenza e scopri come possiamo aiutarti a raggiungere i tuoi obiettivi di salute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/prenota">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                  Prenota Ora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contatti">
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-white w-full sm:w-auto">
                  Contattaci
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;