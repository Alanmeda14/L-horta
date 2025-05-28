import React, { useState, useEffect, useRef } from 'react';
import { Home, FileText, MapPin, Mail, Image as ImageIcon, Leaf, AlertCircle, Loader, X, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createGarden } from '../../services/gardenService';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductItem {
  name: string;
  cantidad: string;
  unidad: string;
  price: string;
}

interface GardenFormData {
  name: string;
  description: string;
  location: string;
  postalCode: string;
  image: File | null;
  products: ProductItem[];
}

interface FormErrors {
  name?: string;
  location?: string;
}

const productList = [
  "Manzana", "Pera", "Melocotón", "Nectarina",
  "Cereza", "Ciruela", "Albaricoque", "Uva", "Melón", "Sandía",
  "Higos", "Granada", "Kiwi", "Caqui", "Fresa", "Castaña", "Avellana",
  "Almendra", "Calabacin", "Oliva", "Tomate", "Pimiento", "Berenjena",
  "Pepino", "Lechuga", "Escarola", "Espinacas", "Acelga", "Col", "Coliflor",
  "Brocoli", "Col de Bruselas", "Zanahoria", "Nabo", "Rábano", "Puerro",
  "Cebolla", "Patata", "Judia", "Haba", "Guisante", "Calabaza", "Remolacha",
  "Apio", "Hinojo", "Alcachofa", "Escaluña", "Achicoria"
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t("garden_name_required");
    }
    
    if (!formData.location.trim()) {
      newErrors.location = t("location_required");
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (file.type.match('image.*')) {
        setFormData(prev => ({ ...prev, image: file }));
      } else {
        toast.error(t("invalid_image_file"));
      }
    }
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

  const handlePriceInput = (product: string, price: string) => {
    const cleaned = price.replace(/[^0-9.,]/g, '').replace(',', '.');
    const parts = cleaned.split('.');
    const formattedPrice = parts.length > 1 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : cleaned;
    
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p =>
        p.name === product ? { ...p, price: formattedPrice } : p
      )
    }));
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductInput(value);
    
    if (value.trim()) {
      const filtered = productList.filter(product =>
        product.toLowerCase().includes(value.toLowerCase()) &&
        !formData.products.some(p => p.name === product)
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleProductSelect = (product: string) => {
    if (!formData.products.some(p => p.name === product)) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { name: product, cantidad: '', unidad: 'kg', price: '' }]
      }));
    }
    setProductInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleProductInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && productInput.trim()) {
      e.preventDefault();
      const match = productList.find(p => p.toLowerCase() === productInput.trim().toLowerCase());
      const productToAdd = match || productInput.trim();

      if (!formData.products.some(p => p.name === productToAdd)) {
        setFormData(prev => ({
          ...prev,
          products: [...prev.products, { name: productToAdd, cantidad: '', unidad: 'kg', price: '' }]
        }));
      }
      setProductInput('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleProductInputFocus = () => {
    if (productInput.trim() && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        setFormData(prev => ({ ...prev, image: file }));
      } else {
        toast.error(t("invalid_dragged_image"));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error(t("form_required_fields"));
      return;
    }
    
    try {
      setIsSubmitting(true);
      const gardenFormData = new FormData();
      
      gardenFormData.append('name', formData.name);
      gardenFormData.append('description', formData.description);
      gardenFormData.append('location', formData.location);
      
      const products = formData.products.map(item => ({
        name: item.name,
        unitPrice: parseFloat(item.price) || 0,
        stock: parseFloat(item.cantidad) || 0,
        unit: item.unidad
      }));
      gardenFormData.append('products', JSON.stringify(products));
      
      if (formData.image) {
        gardenFormData.append('image', formData.image);
      }
      
      await createGarden(gardenFormData);
      toast.success(t("garden_created_success"));
      navigate("/home");
    } catch (error) {
      console.error('Error creating garden:', error);
      toast.error(t("garden_creation_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriceLabel = (unidad: string) => {
    switch (unidad) {
      case 'kg': return t("price_per_kg");
    case 'g': return t("price_per_100g");
    case 'unidad': return t("price_per_unit");
    default: return t("price_default");
    }
  };

  const renderFormField = (
    icon: React.ReactNode,
    name: keyof GardenFormData,
    placeholder: string,
    type: string = 'text',
    required: boolean = false,
    as: 'input' | 'textarea' = 'input'
  ) => {
    const hasError = errors[name as keyof FormErrors];

    return (
      <div className="mb-4">
        <div className={`flex items-${as === 'textarea' ? 'start' : 'center'} gap-2`}>
          <div className="text-green-500 mt-1">{icon}</div>
          <div className="w-full">
            {as === 'textarea' ? (
              <textarea
                name={name}
                placeholder={placeholder + (required ? ' *' : '')}
                value={formData[name] as string}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded text-sm focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all h-24 ${
                  hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required={required}
              />
            ) : (
              <input
                type={type}
                name={name}
                placeholder={placeholder + (required ? ' *' : '')}
                value={formData[name] as string}
                onChange={handleChange}
                className={`w-full p-2.5 border rounded text-sm focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all ${
                  hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required={required}
              />
            )}
            {hasError && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {hasError}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-16 p-6 space-y-4 max-w-3xl mx-auto bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6"> {t("garden_form_title")}</h2>

      {renderFormField(<Home size={18} />, 'name', t('garden_name'), 'text', true)}
      {renderFormField(<FileText size={18} />, 'description', t('description'), 'text', false, 'textarea')}
      {renderFormField(<MapPin size={18} />, 'location', t('city'), 'text', true)}
      {renderFormField(<Mail size={18} />, 'postalCode', t('postal_code'), 'text')}
      <div className="mb-6">
        <div className="flex items-start gap-2">
          <ImageIcon className="text-green-500" size={18} />
          <div className="w-full">
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDraggingOver
                  ? 'border-green-500 bg-green-50'
                  : formData.image
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {formData.image ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt={t("image_preview")}
                    className="max-h-48 mx-auto object-contain rounded"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title={t("remove_image")}
                  >
                    <X size={16} />
                  </button>
                  <p className="text-sm text-green-600 mt-2">
                  {t("image_info", {name: formData.image.name,size: (formData.image.size / 1024).toFixed(1)
                  })}
                  </p>
                </div>
              ) : (
                <div className="py-4">
                  <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">{t("drag_image_or")}</p>
                  <label className="mt-2 inline-block bg-green-50 text-green-700 px-4 py-2 rounded cursor-pointer hover:bg-green-100 transition-colors">
                  {t("select_file")}
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 relative">
          <Leaf className="text-green-500" size={18} />
          <div className="w-full relative">
            <input
              type="text"
              value={productInput}
              onChange={handleProductInputChange}
              onKeyDown={handleProductInputKeyDown}
              onFocus={handleProductInputFocus}
              placeholder={t("add_product_placeholder")}
              className="w-full p-2.5 border rounded text-sm focus:ring-2 focus:ring-green-300 focus:border-green-500 transition-all"
            />
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-1 left-0 right-0 bg-white border border-green-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((product) => (
                    <motion.li
                      key={product}
                      whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                      onClick={() => handleProductSelect(product)}
                      className="px-4 py-2 cursor-pointer hover:bg-green-50 border-b border-gray-100 last:border-0 flex items-center"
                    >
                      <Leaf size={14} className="mr-2 text-green-500" />
                      {product}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <AnimatePresence>
          {formData.products.map((product) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="bg-green-50 text-green-900 px-3 py-2 rounded-lg flex items-center gap-2 border border-green-100 flex-wrap"
            >
              <span className="font-medium whitespace-nowrap mr-1">{product.name}</span>
              
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="text"
                  inputMode="decimal"
                  value={product.cantidad}
                  onChange={(e) => handleCantidadInput(product.name, e.target.value)}
                  className="w-16 p-1 border rounded text-center text-sm focus:ring-2 focus:ring-green-300 focus:border-green-500"
                  placeholder={t('ingresar_cantidad')}
                  pattern="[0-9]*[.,]?[0-9]*"
                />
                
                <select
                  value={product.unidad}
                  onChange={(e) => handleUnidadChange(product.name, e.target.value)}
                  className="border rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-green-300 focus:border-green-500"
                >
                  <option value="kg">{t("unit_kg")}</option>
                  <option value="g">{t("unit_g")}</option>
                  <option value="unidad">{t("unit_unidad")}</option>
                </select>
                
                <div className="flex items-center border rounded overflow-hidden bg-white">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm flex items-center">
                    <DollarSign size={14} />
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={product.price}
                    onChange={(e) => handlePriceInput(product.name, e.target.value)}
                    className="w-16 p-1 text-center text-sm focus:ring-2 focus:ring-green-300 focus:border-green-500 border-none"
                    placeholder={t(`price_placeholder_${product.unidad}`)}
                    aria-label={t("aria_price_label", { unidad: t(`unit_${product.unidad}`) })}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => handleRemoveProduct(product.name)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title={t("remove_product")}
                >
                  <X size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader size={20} className="animate-spin mr-2" />
            {t("saving")}
          </>
        ) : (
          t("save")
        )}
      </motion.button>
    </motion.div>
  );
};

export default GardenForm;