import { useState } from 'react';
import { FiSearch, FiArrowLeft, FiUser } from 'react-icons/fi';
import { GiTomato } from 'react-icons/gi';
import image1 from '../assets/imagen1.jpg';
import image2 from '../assets/imagen2.png';
import image3 from '../assets/imagen3.jpg';
import image4 from '../assets/imagen4.png';


const HomePage = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "L'Hort de Gavà", location: 'Gavà de Mar', image: image1, isVolunteerAvailable: true, isProductAvailable: true },
    { id: 2, name: "L'Hort del Sol", location: 'Roda de Bará', image: image2, isVolunteerAvailable: false, isProductAvailable: true },
    { id: 3, name: "Planters d'horta Mas Pastoret", location: 'Torredembarra', image: image3, isVolunteerAvailable: true, isProductAvailable: false },
    { id: 4, name: 'Los huertos de los Abuelos de Sitges', location: 'Sitges', image: image4, isVolunteerAvailable: false, isProductAvailable: false }
  ]);

  const handleNameChange = (id: number, newName: string) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, name: newName } : product
    );
    setProducts(updatedProducts);
  };

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (locationFilter ? product.location.toLowerCase().includes(locationFilter.toLowerCase()) : true)
  );

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Huertos Colaborativo</h1>

      <div className="flex items-center gap-4 mb-4">
        <input type="text" placeholder="Search in gardens" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full px-4 py-2 rounded-md border" />
        <input type="text" placeholder="Filter by location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="px-4 py-2 rounded-md border" />
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-4 py-2 rounded-md border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="rounded-lg overflow-hidden shadow-md">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <input 
                type="text" 
                value={product.name} 
                onChange={(e) => handleNameChange(product.id, e.target.value)} 
                className="font-bold text-xl mb-2 w-full border-b"
              />
              <p className="text-gray-600">{product.location}</p>
              <div className="mt-2 flex gap-2">
                <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md ${product.isVolunteerAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <FiUser />
                  {product.isVolunteerAvailable ? 'Disponible para Voluntariado' : 'Voluntariado No Disponible'}
                </span>
                <span className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md ${product.isProductAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <GiTomato />
                  {product.isProductAvailable ? 'Productos Disponibles' : 'Sin Productos'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
