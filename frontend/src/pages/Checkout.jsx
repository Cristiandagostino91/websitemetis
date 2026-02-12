import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { CreditCard, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          notes: formData.notes
        },
        total: getCartTotal()
      };

      await createOrder(orderData);
      
      toast({
        title: "Ordine completato!",
        description: "Riceverai una email di conferma a breve.",
      });
      
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Errore",
        description: "Impossibile completare l'ordine. Riprova.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/carrello');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Checkout</h1>
          <p className="text-xl text-green-100">
            Completa il tuo ordine
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dati Personali</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Cognome *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
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
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Indirizzo di Spedizione</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Indirizzo *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Città *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">CAP *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes">Note per la consegna</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Metodo di Pagamento</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border-2 border-green-600 rounded-lg bg-green-50">
                      <input
                        type="radio"
                        id="payment"
                        name="payment"
                        checked
                        readOnly
                        className="w-4 h-4 text-green-600"
                      />
                      <label htmlFor="payment" className="flex items-center space-x-2 cursor-pointer">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">Pagamento alla consegna</span>
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">
                      Pagherai in contanti al momento della consegna
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Riepilogo Ordine</h2>
                  
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotale</span>
                      <span>€{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Spedizione</span>
                      <span className="text-green-600 font-semibold">Gratuita</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Totale</span>
                        <span>€{getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>Elaborazione...</span>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 w-5 h-5" />
                        Conferma Ordine
                      </>
                    )}
                  </Button>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Spedizione gratuita</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Consegna in 2-3 giorni lavorativi</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Garanzia soddisfatti o rimborsati</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;