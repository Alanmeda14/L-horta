import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filterGardens, getOtherGardens } from '../services/gardenService';
import { MapPin, Package, Search } from 'lucide-react';
import { Garden } from 'types/types';
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const navigate = useNavigate();
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        setLoading(true);
        /* const data = await getAllGardens(); // */
        const data = await getOtherGardens();
        setGardens(data);
      } catch (err) {
        console.error("Error fetching gardens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGardens();
  }, []);


  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await filterGardens(search, locationFilter, productFilter);
      setGardens(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching gardens:', err);
      setError(t('fetch_gardens_error') || 'Error al buscar los huertos');
    } finally {
      setLoading(false);
    }
  };


  const handleNameChange = (id: number, newName: string) => {
    const updatedProducts = gardens.map((garden) =>
      garden.id === id ? { ...garden, name: newName } : garden
    );
    setGardens(updatedProducts);
  };

  const handleGardenClick = (garden: any) => {
    navigate(`/garden/${garden.id}`);
  };

  const filteredGardens = gardens.filter(
    (garden) =>
      garden.name.toLowerCase().includes(search.toLowerCase()) &&
      (locationFilter
        ? garden.location.toLowerCase().includes(locationFilter.toLowerCase())
        : true) &&
      (productFilter
        ? (garden.productAvailable ? "disponible" : "no disponible").includes(
            productFilter.toLowerCase()
          )
        : true)
  );

  return (
    <div className="min-h-screen  ">
      <div className="bg-green-700 dark:bg-green-800 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {t("discovering the garden")}</h1>
          <p className="text-lg text-green-100 mb-2">
            {t("connects_home")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <div className="bg-white rounded-xl shadow-md p-6 mb-2 dark:bg-gray-500">
          <div className="flex flex-col md:flex-row md:items-center gap-6 ">

            {/* Input buscar huertos */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("Search gardens")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              />
            </div>

            {/* Filtro ubicación */}
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("Filter by location")}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              />
            </div>

            {/* Filtro productos */}
            <div className="relative flex-1">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t("Filter by products")}
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              />
            </div>

            {/* Botón al final */}
            <div className="ml-auto">
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition-colors"
              >
                {t("search") || "Buscar"}
              </button>
            </div>

          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-6 py-8">
        {/* Garden cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gardens.map((garden) => (
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
                  <span className={`px-2 py-1 text-xs rounded-md ${garden.volunteerSessionAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {garden.volunteerSessionAvailable ? t("Volunteering Available") : t("Without Volunteering")}
                    {/* <span className={`px-2 py-1 text-xs rounded-md ${garden.sessionAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {garden.sessionAvailable ? t("Volunteering Available") : t ("Without Volunteering")} */}
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
