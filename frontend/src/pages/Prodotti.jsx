import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCart } from '../context/CartContext';
import { toast } from '../hooks/use-toast';
import { Search, ShoppingCart, Eye } from 'lucide-react';

const Prodotti = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i prodotti.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Prodotto aggiunto!",
      description: `${product.name} è stato aggiunto al carrello.`,
    });
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">I Nostri Prodotti</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            Integratori e prodotti selezionati per supportare il tuo benessere quotidiano
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cerca prodotti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
              <Link to={`/prodotti/${product.id}`} className="relative h-64 overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                {product.inStock ? (
                  <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Disponibile
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Esaurito
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="bg-white text-green-600 px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                    <Eye className="w-4 h-4" />
                    Vedi Dettagli
                  </span>
                </div>
              </Link>
              <CardContent className="p-5 flex-grow flex flex-col">
                <Link to={`/prodotti/${product.id}`}>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 hover:text-green-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 mb-2">{product.subtitle || product.brand}</p>
                <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.glutenFree && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Senza Glutine</span>
                  )}
                  {product.lactoseFree && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Senza Lattosio</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <span className="text-2xl font-bold text-green-600">€{product.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Link to={`/prodotti/${product.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      disabled={!product.inStock}
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Aggiungi
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Nessun prodotto trovato</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prodotti;