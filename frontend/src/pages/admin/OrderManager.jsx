import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ShoppingBag, Search, Eye, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { getOrders, updateOrderStatus } from '../../services/api';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const statusOptions = [
    { value: 'pending', label: 'In Attesa', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'confirmed', label: 'Confermato', color: 'bg-blue-100 text-blue-700' },
    { value: 'shipped', label: 'Spedito', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', label: 'Consegnato', color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Annullato', color: 'bg-red-100 text-red-700' }
  ];

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders(filterStatus || null);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Errore nell\'aggiornamento dello stato');
    }
  };

  const getStatusBadge = (status) => {
    const option = statusOptions.find(o => o.value === status) || statusOptions[0];
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${option.color}`}>
        {option.label}
      </span>
    );
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Cerca per numero ordine, nome, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="order-search-input"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 px-3 rounded-md border border-gray-200 bg-white min-w-[150px]"
          data-testid="order-status-filter"
        >
          <option value="">Tutti gli stati</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Ordine</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Totale</TableHead>
                <TableHead className="text-center">Stato</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    Nessun ordine trovato
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow data-testid={`order-row-${order.id}`}>
                      <TableCell>
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        <p className="font-mono font-semibold text-sm">{order.orderNumber}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                        <p className="text-xs text-gray-500">{order.customer.email}</p>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </TableCell>
                      <TableCell className="text-right font-bold text-green-600">
                        €{order.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="h-8 px-2 text-xs rounded border border-gray-200 bg-white"
                            data-testid={`order-status-select-${order.id}`}
                          >
                            {statusOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedOrder(order)}
                            data-testid={`view-order-${order.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedOrder === order.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-gray-50 p-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Prodotti ({order.items.length})
                              </h4>
                              <div className="space-y-2">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border">
                                    <div className="flex items-center gap-2">
                                      <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className="w-10 h-10 object-cover rounded"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                      />
                                      <div>
                                        <p className="font-medium text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                                      </div>
                                    </div>
                                    <p className="font-semibold text-sm">€{(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Spedizione</h4>
                              <div className="bg-white p-3 rounded border text-sm">
                                <p>{order.shipping.address}</p>
                                <p>{order.shipping.zipCode} {order.shipping.city}</p>
                                {order.shipping.notes && (
                                  <p className="text-gray-500 mt-2 italic">Note: {order.shipping.notes}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dettagli Ordine {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Cliente</h4>
                  <p className="font-medium">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p className="text-sm">{selectedOrder.customer.email}</p>
                  <p className="text-sm">{selectedOrder.customer.phone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Spedizione</h4>
                  <p>{selectedOrder.shipping.address}</p>
                  <p>{selectedOrder.shipping.zipCode} {selectedOrder.shipping.city}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Prodotti Ordinati</h4>
                <div className="space-y-2 border rounded-lg divide-y">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/48'; }}
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Quantità: {item.quantity} x €{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-semibold">Totale Ordine</span>
                <span className="text-2xl font-bold text-green-600">€{selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManager;
