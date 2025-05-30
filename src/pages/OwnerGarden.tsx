import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { getGardenById } from '../services/gardenService';
import { CreateSessionModal } from '../components/Modal/CreateSessionModal';
import { EditProductModal } from '../components/Modal/EditProductModal';
import { GardenSessionsList } from '../components/Table/GardenSessionsList';
import { GardenProductsTable } from '../components/Table/GardenProductsTable';
import { GardenProduct } from 'types/types';
import { useAuth } from '../context/AuthContext';
import { getSessionsByGardenId, VolunteerSession } from '../services/volunteerSessionService';



const GardenOwnerView = () => {
    const navigate = useNavigate();
    const { userId } = useAuth(); 
    const { id } = useParams();
    const [garden, setGarden] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
    const [showCreateSession, setShowCreateSession] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false)
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [productLookup, setProductLookup] = useState<Record<string, any>>({});
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [sessions, setSessions] = useState<VolunteerSession[]>([]);
    const [showAddedMessage, setShowAddedMessage] = useState(false);
    const isOwner = userId === garden?.userId;
    

    useEffect(() => {
        const fetchGarden = async () => {
            try {
                const data = await getGardenById(Number(id));
                setGarden(data);

                if (data.gardenProducts) {
                    setProducts(data.gardenProducts);
                }

                const gardenSessions = await getSessionsByGardenId(Number(id));
                setSessions(gardenSessions);
            } catch (err) {
                console.error('Error fetching garden:', err);
            }


        };
        fetchGarden();

        
    }, [id]);

    const handleDeleteGarden = () => {
        // lógica para eliminar el huerto
    };

    const handleEditProduct = (product: any) => {
        setProductToEdit(product);
        setShowEditModal(true);
    };

    const handleDeleteProduct = (productId: number) => {
        // lógica para eliminar producto
    };

    const handleAddVolunteerSession = () => {
        // lógica para crear sesión de voluntariado
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {garden && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="relative h-64 mb-6">
                        <img
                            src={`http://localhost:8080${garden.image}`}
                            alt={garden.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => navigate(`/GardenForm/${garden.id}`)}
                                className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600"
                            >
                                <Pencil size={20} />
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <h1 className="text-white text-3xl font-bold">{garden.name}</h1>
                            <p className="text-white">{garden.location}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 mb-6 border-b">
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'productos' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-500'}`}
                            onClick={() => setActiveTab('productos')}
                        >
                            Productos
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'voluntariado' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-500'}`}
                            onClick={() => setActiveTab('voluntariado')}
                        >
                            Voluntariado
                        </button>
                    </div>

                    {activeTab === 'productos' && garden.productAvailable && (
                                        <GardenProductsTable
                                            products={products}
                                            quantities={quantities}
                                            productLookup={productLookup}
                                            showAddedMessage={showAddedMessage}
                                            onNavigate={navigate}
                                            showActions={!isOwner}
                                        />
                                    )}
                    
                                    {activeTab === 'voluntariado' && (
                                        <GardenSessionsList
                                            sessions={sessions}
                                            onNavigate={navigate}
                                            showActions={!isOwner}
                                        />
                                    )}
                    
                                    {activeTab === 'productos' && !garden.productAvailable && (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600 text-lg">Este huerto no tiene productos disponibles actualmente.</p>
                                            <button
                                                onClick={() => navigate('/home')}
                                                className="mt-4 px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                                            >
                                                Volver al listado
                                            </button>
                                        </div>
                                    )}
                                </div>)}
                            </div>
    );
};

export default GardenOwnerView;
