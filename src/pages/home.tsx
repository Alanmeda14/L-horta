import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Garden, getAllGardens } from '../services/gardenService';

const HomePage = () => {
  const navigate = useNavigate();
  const [ gardens, setGardens ] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  console.log(gardens);


  const handleNameChange = (id: number, newName: string) => {
    const updatedProducts = gardens.map(garden =>
      garden.id === id ? { ...garden, name: newName } : garden
    );
    setGardens(updatedProducts);
  };

  const handleGardenClick = (garden: any) => {
    localStorage.setItem('selectedGarden', JSON.stringify(garden));
    navigate(`/garden/${garden.id}`);
  };

  /*  const filteredGardens = gardens.filter(garden =>
        garden.name.toLowerCase().includes(search.toLowerCase()) &&
        (locationFilter ? garden.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
        (productFilter ? (garden.isProductAvailable ? 'disponible' : 'no disponible').includes(productFilter.toLowerCase()) : true)
    ); */

  /* const filteredProducts = gardens.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase()) &&
    (locationFilter ? product.location.toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
    (productFilter ? (product.isProductAvailable ? 'disponible' : 'no disponible').includes(productFilter.toLowerCase()) : true)
  ); */

  return (
    <div className="pt- px-4 py-2 md:px-6 md:py-4 bg-[url('/img/Fondo.png')] bg-cover bg-center min-h-screen relative">
      <div className="w-full mx-auto max-w-7xl mb-6 sticky top-16 z-20 rounded-lg p-4">
        <div className="flex flex-wrap items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md sticky top-20 z-10">
          <div className="mt-8 flex justify-center gap-4">
              <Link to="/gardenForm" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
                  Create a Garden
              </Link>
          </div>
          <input 
            type="text" 
            placeholder="🔍 Buscar huertos" 
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {gardens.map((garden) => (
            <div 
              key={garden.id} 
              className="relative rounded-lg overflow-hidden shadow-lg bg-white cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleGardenClick(garden)}
            >
              <img src={`http://localhost:8080/${garden.image}`} alt={garden.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2">{garden.name}</h3>
                <p className="text-gray-600">{garden.location}</p>
                <div className="mt-2 flex gap-2">
                  {/* <span className={`px-2 py-1 text-xs rounded-md ${garden.isVolunteerAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {garden.isVolunteerAvailable ? 'Voluntariado Disponible' : 'Sin Voluntariado'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-md ${garden.isProductAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {garden.isProductAvailable ? 'Productos Disponibles' : 'Sin Productos'}
                  </span> */}
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