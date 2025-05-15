import { useState } from 'react';
import { FiSearch, FiUser } from 'react-icons/fi';
import { GiTomato } from 'react-icons/gi';
import image1 from '../assets/imagen1.jpg';
import image2 from '../assets/imagen2.png';
import image3 from '../assets/imagen3.jpg';
import image4 from '../assets/imagen4.png';
import image5 from '../assets/imegen5.png';
import image6 from '../assets/imagen6.jpg';
import image7 from '../assets/imagen7.jpg';
import image8 from '../assets/imagen8.jpg';

const HomePage = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "L'Hort de Gavà", location: 'Gavà de Mar', image: image1, isVolunteerAvailable: true, isProductAvailable: true, price: 10 },
    { id: 2, name: "L'Hort del Sol", location: 'Roda de Bará', image: image2, isVolunteerAvailable: false, isProductAvailable: true, price: 15 },
    { id: 3, name: "Planters d'horta Mas Pastoret", location: 'Torredembarra', image: image3, isVolunteerAvailable: true, isProductAvailable: false, price: 0 },
    { id: 4, name: 'Los huertos de los Abuelos de Sitges', location: 'Sitges', image: image4, isVolunteerAvailable: false, isProductAvailable: false, price: 0 },
    { id: 5, name: 'Los huertos del mar', location: 'Lloret de Mar', image: image5, isVolunteerAvailable: false, isProductAvailable: false, price: 2 },
    { id: 6, name: "L'Hort de Tarragona", location: 'Tarragona', image: image6, isVolunteerAvailable: true, isProductAvailable: true, price: 10 },
    { id: 7, name: "L'Hort de Salou", location: 'Salou', image: image7, isVolunteerAvailable: true, isProductAvailable: true, price: 10 },
    { id: 8, name: "Planters de Lleida", location: 'LLeida', image: image8, isVolunteerAvailable: true, isProductAvailable: false, price: 0 },
  ]);

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');

  const handleNameChange = (id: number, newName: string) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, name: newName } : product
    );
    setProducts(updatedProducts);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (locationFilter ? product.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
    (productFilter ? (product.isProductAvailable ? 'disponible' : 'no disponible').includes(productFilter.toLowerCase()) : true)
  );

  return (
    <div className="min-h-screen px-2 py-2 md:px-6 md:py-4 bg-[url('/img/Fondo.png')] bg-cover bg-center">
      <div className="w-full mx-auto">
        {/* Filtros en Navbar */}
        <div className="flex flex-wrap items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow w-full">
          <input 
            type="text" 
            placeholder=" 🔍 Buscar huertos" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="px-4 py-2 rounded-md border flex-1 min-w-[150px]" 
          />
          <input 
            type="text" 
            placeholder="🔍 Filtrar por ubicación" 
            value={locationFilter} 
            onChange={(e) => setLocationFilter(e.target.value)} 
            className="px-4 py-2 rounded-md border flex-1 min-w-[150px]" 
          />
          <input 
            type="text" 
            placeholder="🔍 Filtrar por productos" 
            value={productFilter} 
            onChange={(e) => setProductFilter(e.target.value)} 
            className="px-4 py-2 rounded-md border flex-1 min-w-[150px]"
          />
        </div>

        {/* Lista de Productos Filtrados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative rounded-lg overflow-hidden shadow-lg bg-white">
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <input 
                  type="text" 
                  value={product.name} 
                  onChange={(e) => handleNameChange(product.id, e.target.value)} 
                  className="font-bold text-xl mb-2 w-full border-b" 
                />
                <p className="text-gray-600">{product.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
