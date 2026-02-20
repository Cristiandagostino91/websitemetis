import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Plus, Pencil, Trash2, Sparkles, Search, Upload, X } from 'lucide-react';
import { getServices, createService, updateService, deleteService, uploadFile } from '../../services/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    image: ''
  });

  const categories = ['Trattamenti Viso', 'Trattamenti Corpo', 'Massaggi', 'Consulenze', 'Benessere'];
  const durations = ['30 min', '45 min', '60 min', '90 min', '120 min'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        category: service.category,
        price: service.price.toString(),
        duration: service.duration,
        description: service.description,
        image: service.image
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        category: '',
        price: '',
        duration: '',
        description: '',
        image: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadFile(file);
      setFormData(prev => ({ ...prev, image: `${BACKEND_URL}${result.url}` }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Errore nel caricamento dell\'immagine');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }
      
      await fetchServices();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Errore nel salvataggio del servizio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo servizio?')) return;
    
    try {
      await deleteService(id);
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Errore nell\'eliminazione del servizio');
    }
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Cerca servizi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="service-search-input"
          />
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-green-600 hover:bg-green-700"
          data-testid="add-service-btn"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Servizio
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Immagine</TableHead>
                <TableHead>Titolo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Durata</TableHead>
                <TableHead className="text-right">Prezzo</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    Nessun servizio trovato
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id} data-testid={`service-row-${service.id}`}>
                    <TableCell>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-14 h-14 object-cover rounded-lg"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/56'; }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {service.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                        {service.duration}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      €{service.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDialog(service)}
                          data-testid={`edit-service-${service.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(service.id)}
                          data-testid={`delete-service-${service.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Modifica Servizio' : 'Nuovo Servizio'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titolo Servizio *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  data-testid="service-title-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white"
                  required
                  data-testid="service-category-select"
                >
                  <option value="">Seleziona categoria</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prezzo (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  required
                  data-testid="service-price-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Durata *</Label>
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white"
                  required
                  data-testid="service-duration-select"
                >
                  <option value="">Seleziona durata</option>
                  {durations.map(dur => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Immagine</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="URL immagine o carica file"
                  className="flex-1"
                  data-testid="service-image-input"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" disabled={uploadingImage} asChild>
                    <span>
                      {uploadingImage ? (
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </span>
                  </Button>
                </label>
              </div>
              {formData.image && (
                <div className="relative w-24 h-24 mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                required
                data-testid="service-description-input"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Annulla
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={saving}
                data-testid="save-service-btn"
              >
                {saving ? 'Salvataggio...' : (editingService ? 'Aggiorna' : 'Crea')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManager;
