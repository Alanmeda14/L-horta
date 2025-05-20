import React, { useState } from 'react';

interface GardenFormProps {
  onSubmit: (data: GardenFormData) => void;
  initialData?: GardenFormData;
}

interface GardenFormData {
  nom: string;
  descripcio: string;
  imatge: File | null;
  localitzacio: string;
  productes: string[];
  codisPostals: string[];
}

const postalCodes = ["08001", "08002", "08003", "08004", "08005", "08006", "08007", "08008", "08009", "08010"];

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
  

const GardenForm: React.FC<GardenFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<GardenFormData>(
    initialData || {
      nom: '',
      descripcio: '',
      imatge: null,
      localitzacio: '',
      productes: [],
      codisPostals: []
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, imatge: file }));
  };

  const handleRemoveProduct = (product: string) => {
    setFormData(prev => ({ ...prev, productes: prev.productes.filter(p => p !== product) }));
  };

  return (
    <div className="mt-16 p-4 space-y-4 bg-gradient-to-r from-green-100 to-green-200 shadow-lg rounded-2xl max-w-6xl mx-auto">
      <form className="p-6 space-y-4 bg-white rounded-xl shadow-md">
        <input type="text" name="nom" placeholder="Nombre" value={formData.nom} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-green-300" />

        <textarea name="descripcio" placeholder="Descripción" value={formData.descripcio} onChange={handleChange} className="w-full p-2 border rounded h-24 focus:outline-none focus:ring focus:ring-green-300" />

        <input type="file" name="imatge" className="w-full" onChange={handleImageChange} />

        {formData.imatge && <img src={URL.createObjectURL(formData.imatge)} alt="Vista previa" className="w-full max-h-64 object-contain rounded mt-2 shadow-sm" />}

        <select onChange={(e) => setFormData(prev => ({ ...prev, localitzacio: e.target.value }))} className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-green-300">
          <option value="">Seleccione código postal</option>
          {postalCodes.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <select onChange={(e) => {
          const selectedProduct = e.target.value;
          if (selectedProduct && !formData.productes.includes(selectedProduct)) {
            setFormData(prev => ({ ...prev, productes: [...prev.productes, selectedProduct] }));
          }
        }} className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-green-300">
          <option value="">Seleccione productos</option>
          {productList.map((product) => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2 mt-2">
          {formData.productes.map((product) => (
            <div key={product} className="bg-green-200 text-green-800 px-2 py-1 rounded flex items-center">
              {product}
              <button type="button" onClick={() => handleRemoveProduct(product)} className="ml-2 text-red-500 font-bold">&times;</button>
            </div>
          ))}
        </div>

        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all">Guardar</button>
      </form>
    </div>
  );
};

export default GardenForm;
