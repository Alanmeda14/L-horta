import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Garden, getAllGardens } from '../services/gardenService';
import { MapPin, Package, Search } from 'lucide-react';
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const navigate = useNavigate();
  const [ gardens, setGardens ] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGardens = async () => {
        try {
            const data = await getAllGardens();
            setGardens(data);
        } catch (err) {
            setError('Failed to fetch gardens. Please try again later.');
            console.error('Error fetching gardens:', err);
        } finally {
            setLoading(false);
        }
    };

      fetchGardens();
  }, []);


  const handleNameChange = (id: number, newName: string) => {
    const updatedProducts = gardens.map(garden =>
      garden.id === id ? { ...garden, name: newName } : garden
    );
    setGardens(updatedProducts);
  };

  const handleGardenClick = (garden: any) => {
    navigate(`/garden/${garden.id}`);
  };

   const filteredGardens = gardens.filter(garden =>
        garden.name.toLowerCase().includes(search.toLowerCase()) &&
        (locationFilter ? garden.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
        (productFilter ? (garden.productAvailable ? 'disponible' : 'no disponible').includes(productFilter.toLowerCase()) : true)
    );

  /* const filteredProducts = gardens.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (locationFilter ? product.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
    (productFilter ? (product.isProductAvailable ? 'disponible' : 'no disponible').includes(productFilter.toLowerCase()) : true)
  ); */

  console.log(gardens)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {t("discovering the garden")}</h1>
          <p className="text-lg text-green-100 mb-2">
          {t("connects_home")}  
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder= {t("Search gardens") }
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors" 
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder={t("Filter by location")} 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors" 
              />
            </div>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder={t("Filter by products")} 
                value={productFilter} 
                onChange={(e) => setProductFilter(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-6 py-8">
        {/* Garden cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGardens.map((garden) => (
              <div 
                key={garden.id} 
                className="relative rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer transform transition-transform hover:scale-102"
                onClick={() => handleGardenClick(garden)}
              >
                <img src={`http://localhost:8080${garden.image}`} alt={garden.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-xl mb-2">{garden.name}</h3>
                  <p className="text-gray-600">{garden.location}</p>
                  <div className="mt-2 flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-md ${garden.sessionAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {garden.sessionAvailable ? t("Volunteering Available") : t ("Without Volunteering")}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-md ${garden.productAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {garden.productAvailable ? t("products_available") : t("no_products")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
    
    
  );
};

export default HomePage;