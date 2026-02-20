import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { CheckCircle, Truck, ShieldCheck, Package } from 'lucide-react';

// PayPal Configuration
const PAYPAL_CLIENT_ID = "sb"; // Sandbox for testing - will show PayPal sandbox buttons
const PAYPAL_MERCHANT_EMAIL = "memoli.metis.pos@gmail.com";
const SHIPPING_COST = 8.90; // €8.90 for 1-3 products
const MAX_PRODUCTS_FREE_SHIPPING_CALC = 3;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [formValid, setFormValid] = useState(false);
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

  // Calculate total quantity
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate shipping cost: €8.90 for 1-3 products, additional €8.90 for each additional group of 3
  const getShippingCost = () => {
    const totalQty = getTotalQuantity();
    if (totalQty === 0) return 0;
    const shippingGroups = Math.ceil(totalQty / MAX_PRODUCTS_FREE_SHIPPING_CALC);
    return shippingGroups * SHIPPING_COST;
  };

  // Get final total
  const getFinalTotal = () => {
    return getCartTotal() + getShippingCost();
  };

  // Check form validity
  useEffect(() => {
    const isValid = 
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.zipCode.trim() !== '';
    setFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Create order in database
  const createOrderInDB = async (paypalOrderId = null, paymentStatus = 'pending') => {
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
      total: getFinalTotal(),
      paypalOrderId: paypalOrderId,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      shippingCost: getShippingCost()
    };

    return await createOrder(orderData);
  };

  // PayPal create order
  const createPayPalOrder = (data, actions) => {
    if (!formValid) {
      toast({
        title: "Compila tutti i campi",
        description: "Per favore compila tutti i campi obbligatori prima di procedere al pagamento.",
        variant: "destructive"
      });
      return Promise.reject('Form not valid');
    }

    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: "EUR",
          value: getFinalTotal().toFixed(2),
          breakdown: {
            item_total: {
              currency_code: "EUR",
              value: getCartTotal().toFixed(2)
            },
            shipping: {
              currency_code: "EUR",
              value: getShippingCost().toFixed(2)
            }
          }
        },
        description: `Ordine Centro Metis - ${getTotalQuantity()} prodotti`,
        payee: {
          email_address: PAYPAL_MERCHANT_EMAIL
        }
      }]
    });
  };

  // PayPal on approve
  const onPayPalApprove = async (data, actions) => {
    setLoading(true);
    try {
      const details = await actions.order.capture();
      
      // Create order in database with PayPal order ID
      await createOrderInDB(data.orderID, 'paid');
      
      toast({
        title: "Pagamento completato!",
        description: `Grazie ${details.payer.name.given_name}! Il tuo ordine è stato confermato.`,
      });
      
      clearCart();
      setOrderCompleted(true);
      
      // Redirect after 3 seconds
      setTimeout(() => navigate('/'), 3000);
      
    } catch (error) {
      console.error('PayPal capture error:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il pagamento. Riprova.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle cash on delivery
  const handleCashOnDelivery = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    
    setLoading(true);
    try {
      await createOrderInDB(null, 'pending');
      
      toast({
        title: "Ordine completato!",
        description: "Riceverai una email di conferma. Pagherai alla consegna.",
      });
      
      clearCart();
      setOrderCompleted(true);
      setTimeout(() => navigate('/'), 3000);
      
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

  if (cartItems.length === 0 && !orderCompleted) {
    navigate('/carrello');
    return null;
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ordine Confermato!</h2>
            <p className="text-gray-600 mb-6">
              Grazie per il tuo acquisto. Riceverai una email di conferma a breve.
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-green-600 hover:bg-green-700"
            >
              Torna alla Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ 
      clientId: PAYPAL_CLIENT_ID, 
      currency: "EUR",
      intent: "capture"
    }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Checkout</h1>
            <p className="text-xl text-green-100">
              Completa il tuo ordine in sicurezza
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                        data-testid="checkout-firstname"
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
                        data-testid="checkout-lastname"
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
                        data-testid="checkout-email"
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
                        data-testid="checkout-phone"
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
                        data-testid="checkout-address"
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
                          data-testid="checkout-city"
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
                          data-testid="checkout-zipcode"
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
                        placeholder="Es: Citofono secondo piano, lasciare al portiere..."
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
                    {/* PayPal Option */}
                    <div 
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'paypal' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid="payment-paypal"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex items-center space-x-2 flex-1">
                        <svg className="w-20 h-6" viewBox="0 0 101 32">
                          <path fill="#003087" d="M12.237 2.8h-7.8c-.5 0-1 .4-1.1.9L.6 22.2c-.1.4.2.8.6.8h3.7c.5 0 1-.4 1.1-.9l.8-5.3c.1-.5.5-.9 1.1-.9h2.5c5.1 0 8.1-2.5 8.8-7.4.3-2.1 0-3.8-1-5-1.1-1.3-3-2-5.9-2zm.9 7.3c-.4 2.8-2.6 2.8-4.6 2.8h-1.2l.8-5.2c0-.3.3-.5.6-.5h.5c1.4 0 2.7 0 3.4.8.4.5.6 1.2.5 2.1z"/>
                          <path fill="#003087" d="M35.237 10h-3.7c-.3 0-.6.2-.6.5l-.2 1-.3-.4c-.8-1.2-2.6-1.6-4.4-1.6-4.1 0-7.6 3.1-8.3 7.5-.4 2.2.1 4.3 1.4 5.7 1.2 1.3 2.9 1.9 4.9 1.9 3.5 0 5.4-2.2 5.4-2.2l-.2 1.1c-.1.4.2.8.6.8h3.4c.5 0 1-.4 1.1-.9l2-12.6c.1-.4-.2-.8-.6-.8zm-5.4 7.2c-.4 2.1-2 3.6-4.2 3.6-1.1 0-2-.3-2.5-1-.5-.6-.7-1.5-.5-2.5.3-2.1 2.1-3.6 4.1-3.6 1.1 0 1.9.4 2.5 1 .6.7.8 1.6.6 2.5z"/>
                          <path fill="#003087" d="M55.337 10h-3.7c-.4 0-.7.2-.9.5l-5.2 7.6-2.2-7.3c-.1-.5-.6-.8-1.1-.8h-3.6c-.5 0-.8.4-.7.9l4.1 12.1-3.9 5.4c-.3.4 0 1 .5 1h3.7c.4 0 .7-.2.9-.5l12.5-18c.3-.4 0-.9-.4-.9z"/>
                          <path fill="#009cde" d="M67.737 2.8h-7.8c-.5 0-1 .4-1.1.9l-2.8 18.5c-.1.4.2.8.6.8h4c.4 0 .7-.3.7-.6l.8-5.1c.1-.5.5-.9 1.1-.9h2.5c5.1 0 8.1-2.5 8.8-7.4.3-2.1 0-3.8-1-5-1.1-1.4-3-2-5.8-2.2zm.9 7.3c-.4 2.8-2.6 2.8-4.6 2.8h-1.2l.8-5.2c0-.3.3-.5.6-.5h.5c1.4 0 2.7 0 3.4.8.4.5.5 1.2.5 2.1z"/>
                          <path fill="#009cde" d="M90.737 10h-3.7c-.3 0-.6.2-.6.5l-.2 1-.3-.4c-.8-1.2-2.6-1.6-4.4-1.6-4.1 0-7.6 3.1-8.3 7.5-.4 2.2.1 4.3 1.4 5.7 1.2 1.3 2.9 1.9 4.9 1.9 3.5 0 5.4-2.2 5.4-2.2l-.2 1.1c-.1.4.2.8.6.8h3.4c.5 0 1-.4 1.1-.9l2-12.6c.1-.4-.2-.8-.6-.8zm-5.3 7.2c-.4 2.1-2 3.6-4.2 3.6-1.1 0-2-.3-2.5-1-.5-.6-.7-1.5-.5-2.5.3-2.1 2.1-3.6 4.1-3.6 1.1 0 1.9.4 2.5 1 .5.7.7 1.6.5 2.5z"/>
                          <path fill="#009cde" d="M95.337 3.3l-2.9 18.3c-.1.4.2.8.6.8h3.2c.5 0 1-.4 1.1-.9l2.8-18.5c.1-.4-.2-.8-.6-.8h-3.6c-.3 0-.5.2-.6.5z"/>
                        </svg>
                        <span className="font-semibold text-gray-900">Paga con PayPal</span>
                      </div>
                    </div>

                    {/* Cash on Delivery Option */}
                    <div 
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'cash' 
                          ? 'border-green-600 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      data-testid="payment-cash"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="w-4 h-4 text-green-600"
                      />
                      <div className="flex items-center space-x-2">
                        <Truck className="w-6 h-6 text-green-600" />
                        <span className="font-semibold text-gray-900">Pagamento alla consegna</span>
                      </div>
                    </div>

                    {/* PayPal Buttons */}
                    {paymentMethod === 'paypal' && formValid && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-4">
                          Clicca sul pulsante PayPal per completare il pagamento in sicurezza:
                        </p>
                        <PayPalButtons
                          style={{ 
                            layout: "vertical",
                            color: "blue",
                            shape: "rect",
                            label: "pay"
                          }}
                          createOrder={createPayPalOrder}
                          onApprove={onPayPalApprove}
                          onError={(err) => {
                            console.error('PayPal error:', err);
                            toast({
                              title: "Errore PayPal",
                              description: "Si è verificato un errore. Riprova.",
                              variant: "destructive"
                            });
                          }}
                          disabled={!formValid || loading}
                        />
                      </div>
                    )}

                    {paymentMethod === 'paypal' && !formValid && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Compila tutti i campi obbligatori per abilitare il pagamento PayPal
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'cash' && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-4">
                          Pagherai in contanti al corriere al momento della consegna.
                        </p>
                        <Button
                          onClick={handleCashOnDelivery}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="lg"
                          disabled={!formValid || loading}
                          data-testid="confirm-cash-order"
                        >
                          {loading ? (
                            <span>Elaborazione...</span>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 w-5 h-5" />
                              Conferma Ordine (Pagamento alla consegna)
                            </>
                          )}
                        </Button>
                      </div>
                    )}
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
                      <span>Subtotale ({getTotalQuantity()} prodotti)</span>
                      <span>€{getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>Spedizione</span>
                      </div>
                      <span className="font-semibold">€{getShippingCost().toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Costo spedizione: €8,90 per 1-3 prodotti
                    </p>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Totale</span>
                        <span className="text-green-600">€{getFinalTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>Pagamento sicuro con PayPal</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-green-600" />
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
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;
