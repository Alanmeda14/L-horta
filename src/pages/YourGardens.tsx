import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Eye, Plus, Trash2, Loader, MapPin, Leaf } from 'lucide-react'; // <- añadidos MapPin y Leaf
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
    getAllGardens,
    deleteGarden,
    Garden
} from '../services/gardenService';
import { useTranslation } from 'react-i18next';

const YourGardens: React.FC = () => {
    const [gardens, setGardens] = useState<Garden[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        fetchGardens();
    }, []);

    const fetchGardens = async () => {
        try {
            setLoading(true);
            const data = await getAllGardens();
            setGardens(data);
        } catch (err) {
            setError(t("fetch_gardens_error"));
            console.error('Error fetching gardens:', err);
            toast.error(t('load_gardens_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGarden = async (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        if (window.confirm(t('delete_garden_confirmation')))  {
            try {
                setIsDeleting(id);
                await deleteGarden(id);
                toast.success(t('garden_deleted_successfully'));
                setGardens(gardens.filter(garden => garden.id !== id));
            } catch (error) {
                toast.error(t('garden_delete_error'));
                console.error('Error deleting garden:', error);
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const handleEditClick = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/garden/${id}/edit`);
    };

    const handlePreviewClick = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        navigate(`/garden/${id}/preview`);
    };

    const handleGardenClick = (garden: Garden) => {
        navigate(`/my-garden/${garden.id}`);
    };

    if (loading) {
        return <GardensSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 px-4 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md mx-auto">
                    <h2 className="text-xl text-red-600 mb-4">{t("error_title")}</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button 
                        onClick={fetchGardens}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                       {t("try_again")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20 px-4 pb-16">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center mb-8"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t("your_gardens_title")}</h1>
                    {gardens.length > 0 && (
                        <Link
                            to="../garden/new"
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                        >
                            <Plus size={20} className="mr-2" />
                            {t("create_new_garden")}
                        </Link>
                    )}
                </motion.div>

                {gardens.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gardens.map((garden, index) => (
                            <GardenCard 
                                key={garden.id} 
                                garden={garden} 
                                index={index}
                                isDeleting={isDeleting === garden.id}
                                onDelete={handleDeleteGarden}
                                onEdit={handleEditClick}
                                onPreview={handlePreviewClick}
                                onClick={handleGardenClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState: React.FC = () => {
    const { t } = useTranslation();
  
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-md p-8 text-center"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center">
          <Plus size={40} className="text-green-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{t("no_gardens_yet")}</h2>
        <p className="text-gray-500 mb-8">
          {t("create_your_first_garden")}
        </p>
        <Link
          to="/garden/new"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <Plus size={20} className="mr-2" />
          {t("create_garden")}
        </Link>
      </motion.div>
    );
  };

interface GardenCardProps {
    garden: Garden;
    index: number;
    isDeleting: boolean;
    onDelete: (id: number, event: React.MouseEvent) => void;
    onEdit: (id: number, event: React.MouseEvent) => void;
    onPreview: (id: number, event: React.MouseEvent) => void;
    onClick: (garden: Garden) => void;
}

const GardenCard: React.FC<GardenCardProps> = ({ 
    garden, 
    index, 
    isDeleting,
    onDelete, 
    onEdit, 
    onPreview, 
    onClick 
}) => {
    const defaultImage = 'https://images.pexels.com/photos/2292550/pexels-photo-2292550.jpeg';
    const [imageError, setImageError] = useState(false);
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => onClick(garden)}
        >
            <div className="relative">
                <img
                    src={imageError ? defaultImage : (garden.image ? `http://localhost:8080${garden.image}` : defaultImage)}
                    alt={garden.name}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    onError={() => setImageError(true)}
                />
                <div className="absolute top-0 right-0 p-2 flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => onPreview(garden.id!, e)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-colors duration-200"
                        title={t("preview")}
                    >
                        <Eye size={18} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => onEdit(garden.id!, e)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-md transition-colors duration-200"
                        title={t("edit")}
                    >
                        <Edit size={18} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => onDelete(garden.id!, e)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors duration-200"
                        title={t("delete")}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </motion.button>
                </div>
            </div>
            <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{garden.name}</h2>
                <div className="flex items-center text-gray-600 mb-3">
                    <MapPin size={16} className="mr-1 text-green-600" />
                    <p>{garden.location}</p>
                </div>

                {garden.products && garden.products.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <Leaf size={16} className="mr-1 text-green-600" />
                            {t("products")}({garden.products.length})
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {garden.products.slice(0, 3).map((product, index) => (
                                <span 
                                    key={index} 
                                    className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full border border-green-100"
                                >
                                    {product.name}
                                </span>
                            ))}
                            {garden.products.length > 3 && (
                                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                                    +{garden.products.length - 3} más
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const GardensSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="h-48 bg-gray-200 animate-pulse"></div>
                            <div className="p-5">
                                <div className="h-7 w-3/4 bg-gray-200 rounded-md mb-3 animate-pulse"></div>
                                <div className="h-5 w-1/2 bg-gray-200 rounded-md mb-4 animate-pulse"></div>
                                <div className="mt-4">
                                    <div className="h-4 w-1/3 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default YourGardens;