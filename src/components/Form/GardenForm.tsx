import React, { useState } from 'react';
import { Home, FileText, MapPin, Mail, Image as ImageIcon, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createGarden } from '../../services/gardenService';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

interface ProductItem {
  name: string;
  cantidad: string;
  unidad: string;
}

interface GardenFormData {
  name: string;
  description: string;
  location: string;
  postalCode: string;
  image: File | null;
  products: ProductItem[];
}

const productList = [
  "Manzana ", "Pera ", "Melocotón ", "Nectarina",
  "Cereza", "Ciruela", "Albaricoque", "Uva ", "Melón", "Sandía",
  "Higos", "Granada", "Kiwi", "Caqui", "Fresa", "Castaña", "Avellana",
  "Almendra", "Calabacin", "Oliva", "Tomate", "Pimiento", "Berenjena",
  "Pepino","Lechuga","Escarola","Espinacas","Acelga","Col","Coliflor",
  "Brocoli","Col de Bruselas","Zanahoria","Nabo","Rábano","Puerro",
  "Cebolla","Patata","Judia","Haba","Guisante","Calabaza","Remolacha",
  "Apio","Hinojo","Alcachofa","Escaluña","Achicoria"
];


const GardenForm: React.FC = () => {
  const [formData, setFormData] = useState<GardenFormData>({
    name: '',
    description: '',
    location: '',
    postalCode: '',
    image: null,
    products: []
  });

  const [productInput, setProductInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const {t} = useTranslation();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleRemoveProduct = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.name !== product)
    }));
  };

  const handleCantidadInput = (product: string, cantidad: string) => {
    const cleaned = cantidad.replace(',', '.');
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.name === product ? { ...p, cantidad: cleaned } : p
      )
    }));
  };

  const handleUnidadChange = (product: string, unidad: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.name === product ? { ...p, unidad } : p
      )
    }));
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductInput(value);
    if (value.trim()) {
      const filtered = productList.filter(product =>
        product.toLowerCase().startsWith(value.toLowerCase()) &&
        !formData.products.some(p => p.name === product)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleProductSelect = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: product, cantidad: '', unidad: 'kg' }]
    }));
    setProductInput('');
    setSuggestions([]);
  };

  const handleProductInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && productInput.trim()) {
      e.preventDefault();
      const match = productList.find(p => p.toLowerCase() === productInput.trim().toLowerCase());
      const productToAdd = match || productInput.trim();

      if (!formData.products.some(p => p.name === productToAdd)) {
        setFormData(prev => ({
          ...prev,
          products: [...prev.products, { name: productToAdd, cantidad: '', unidad: 'kg' }]
        }));
      }
      setProductInput('');
      setSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    try {
        const gardenFormData = new FormData();
      
        gardenFormData.append('name', formData.name);
        gardenFormData.append('description', formData.description);
        gardenFormData.append('location', formData.location);
        
        // Add products as JSON string
        const products = formData.products.map(item => ({
            name: item.name,
            unitPrice: 0,
            stock: parseFloat(item.cantidad) || 0
        }));
        gardenFormData.append('products', JSON.stringify(products));
        
        // Add image if exists
        if (formData.image) {
            gardenFormData.append('image', formData.image);
        }
        await createGarden(gardenFormData);
        //toast.success("Garden created successfully!");
        //navigate("/home");
    } catch (error) {
        console.error('Error creating garden:', error);
        toast.error("Error creating garden");
    }
  };


  return (
    <div className="mt-16 p-4 space-y-4 max-w-3xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-green-700 mb-4">Formulario del Huerto </h2>

      {/* name */}
      <div className="flex items-center gap-2 text-sm">
        <Home className="text-green-500" size={18} />
        <input
          type="text"
          name="name"
          placeholder="name del huerto"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-1.5 border rounded text-sm"
        />
      </div>

      {/* Descripción */}
      <div className="flex items-start gap-2 text-sm">
        <FileText className="text-green-500 mt-1" size={18} />
        <textarea
          name="description"
          placeholder="Descripción"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-1.5 border rounded h-20 text-sm"
        />
      </div>

      {/* Ciudad */}
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="text-green-500" size={18} />
        <input
          type="text"
          name="location"
          placeholder="Ciudad"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-1.5 border rounded text-sm"
        />
      </div>

      {/* Código Postal */}
      <div className="flex items-center gap-2 text-sm">
        <Mail className="text-green-500" size={18} />
        <input
          type="text"
          name="postalCode"
          placeholder="Código Postal"
          value={formData.postalCode}
          onChange={handleChange}
          className="w-full p-1.5 border rounded text-sm"
        />
      </div>

      {/* Imagen */}
      <div className="flex items-center gap-2 text-sm">
        <ImageIcon className="text-green-500" size={18} />
        <input type="file" name="image" onChange={handleImageChange} className="text-sm" />
      </div>
      {formData.image && (
        <img
          src={URL.createObjectURL(formData.image)}
          alt="Vista previa"
          className="w-full max-h-40 object-contain rounded shadow"
        />
      )}

      {/* Productos con autocompletado */}
      <div className="flex items-center gap-2 relative text-sm">
        <Leaf className="text-green-500" size={18} />
        <input
          type="text"
          value={productInput}
          onChange={handleProductInputChange}
          onKeyDown={handleProductInputKeyDown}
          placeholder="Escriba y presione Enter para agregar"
          className="w-full p-1.5 border rounded text-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 left-8 right-0 bg-white border border-green-200 rounded shadow z-10 text-sm">
            {suggestions.map((product) => (
              <li
                key={product}
                onClick={() => handleProductSelect(product)}
                className="px-3 py-1 hover:bg-green-100 cursor-pointer"
              >
                {product}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {formData.products.map((product) => (
          <div key={product.name} className="bg-green-100 text-green-900 px-3 py-2 rounded flex items-center gap-2 text-sm">
            <span className="font-medium whitespace-nowrap">{product.name}</span>
            <input
              type="text"
              inputMode="decimal"
              value={product.cantidad}
              onChange={(e) => handleCantidadInput(product.name, e.target.value)}
              className="w-16 p-1 border rounded text-center text-sm"
              pattern="[0-9]*[.,]?[0-9]*"
            />
            <select
              value={product.unidad}
              onChange={(e) => handleUnidadChange(product.name, e.target.value)}
              className="border rounded px-1 py-0.5 text-sm"
            >
              <option value="kg">kg</option>
            </select>
            <button
              type="button"
              onClick={() => handleRemoveProduct(product.name)}
              className="text-gray-500 hover:text-black"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm" onClick={handleSubmit}>
        {t("save")}
      </button>
    </div>
  );
};

export default GardenForm;
