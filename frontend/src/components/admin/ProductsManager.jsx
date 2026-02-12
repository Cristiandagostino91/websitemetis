import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Edit, Trash2, Plus } from 'lucide-react';

const ProductsManager = ({ 
  products, 
  productDialogOpen, 
  setProductDialogOpen,
  editingProduct,
  productForm,
  setProductForm,
  handleProductSubmit,
  handleProductEdit,
  handleProductDelete,
  resetProductForm 
}) => {
  return (
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
  );
};

export default ProductsManager;