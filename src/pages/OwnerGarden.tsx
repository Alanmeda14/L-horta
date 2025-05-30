import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { getGardenById, deleteGarden, deleteProduct } from '../services/gardenService';
import { CreateSessionModal } from '../components/Modal/CreateSessionModal';
import { EditProductModal } from '../components/Modal/EditProductModal';
import { GardenSessionsList } from '../components/Table/GardenSessionsList';
import { GardenProductsTable } from '../components/Table/GardenProductsTable';
import { GardenProduct } from 'types/types';
import { useAuth } from '../context/AuthContext';
import { getSessionsByGardenId, VolunteerSession } from '../services/volunteerSessionService';
import { toast } from 'react-toastify';
import { deleteGardenProduct } from '../services/gardenProductService';


// Asegúrate de importar o definir tu Modal aquí:
import Modal from '../components/common/Modal';

const GardenOwnerView = () => {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const { id } = useParams();

    // Tus estados ya existentes
    const [garden, setGarden] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'garden' | 'product'; id: number } | null>(null);
    const [productToEdit, setProductToEdit] = useState<any>(null);
    const [showCreateSession, setShowCreateSession] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [sessions, setSessions] = useState<VolunteerSession[]>([]);
    const [isOwner, setIsOwner] = useState(false);
    const [volunteerStatus, setVolunteerStatus] = useState<Record<number, boolean>>({});
    const [availableSpots, setAvailableSpots] = useState<Record<number, number>>({});

    // **ESTADOS QUE FALTABAN**
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [productLookup, setProductLookup] = useState<Record<number, GardenProduct>>({});
    const showAddedMessage = false;


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

                // Inicializa estados de voluntariado
                const initialVolunteerStatus: Record<number, boolean> = {};
                const initialAvailableSpots: Record<number, number> = {};
                gardenSessions.forEach((session) => {
                    if (session.id) {
                        initialVolunteerStatus[session.id] = false;
                        initialAvailableSpots[session.id] = session.maxVolunteers;
                    }
                });
                setVolunteerStatus(initialVolunteerStatus);
                setAvailableSpots(initialAvailableSpots);
            } catch (err) {
                console.error('Error fetching garden:', err);
            }
        };
        fetchGarden();
    }, [id]);

    useEffect(() => {
        if (garden && userId) {
            setIsOwner(userId === garden.userId);
        }
    }, [garden, userId]);

    // Funciones para abrir modales eliminar
    const openDeleteGardenModal = () => {
        if (garden) {
            setItemToDelete({ type: 'garden', id: garden.id });
            setShowDeleteModal(true);
        }
    };

    const openDeleteProductModal = (productId: number) => {
        setItemToDelete({ type: 'product', id: productId });
        setShowDeleteModal(true);
    };

    // Función para confirmar eliminación
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            if (itemToDelete.type === 'garden') {
                await deleteGarden(itemToDelete.id);
                toast.success('Huerto eliminado correctamente');
                navigate('/home');
            } else if (itemToDelete.type === 'product') {
                await deleteGardenProduct(itemToDelete.id);
                toast.success('Producto eliminado correctamente');
                setProducts((prev) => prev.filter((p) => p.id !== itemToDelete.id));
            }
        } catch (err) {
            console.error('Error eliminando:', err);
            toast.error('Error al eliminar');
        } finally {
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const handleEditGarden = () => {
        if (garden) {
            navigate(`/garden/edit/${garden.id}`, { state: { gardenData: garden } });
        }
    };

    const handleEditProduct = (product: any) => {
        setProductToEdit(product);
        setShowEditProductModal(true);
    };

    const handleDeleteProduct = (productId: number) => {
        openDeleteProductModal(productId);
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
                                onClick={handleEditGarden}
                                className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600"
                            >
                                <Pencil size={20} />
                            </button>
                            <button
                                onClick={openDeleteGardenModal}
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
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'productos'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-600 hover:text-green-500'
                                }`}
                            onClick={() => setActiveTab('productos')}
                        >
                            Productos
                        </button>
                        <button
                            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'voluntariado'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-600 hover:text-green-500'
                                }`}
                            onClick={() => setActiveTab('voluntariado')}
                        >
                            Voluntariado
                        </button>
                    </div>

                    {activeTab === 'productos' && garden.productAvailable && (
                        <GardenProductsTable
                            products={products}
                            isOwner={isOwner}
                            onEditProduct={handleEditProduct}
                            onDeleteProduct={handleDeleteProduct}
                            quantities={quantities}
                            productLookup={productLookup}
                            showAddedMessage={showAddedMessage}
                            onNavigate={navigate}
                        />
                    )}

                    {activeTab === 'voluntariado' && (
                        <>
                            <GardenSessionsList
                                sessions={sessions}
                                onNavigate={navigate}
                                isOwner={isOwner}
                                volunteerStatus={volunteerStatus}
                                availableSpots={availableSpots}
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowCreateSession(true)}
                                    className="mt-5 bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                                >
                                    <PlusCircle size={20} /> Crear sesión de voluntariado
                                </button>
                            </div>
                        </>
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

                    {showCreateSession && (
                        <CreateSessionModal
                            isOpen={showCreateSession}
                            onClose={() => setShowCreateSession(false)}
                            gardenId={Number(id)}
                        />
                    )}

                    {showEditProductModal && (
                        <EditProductModal
                            isOpen={showEditProductModal}
                            onClose={() => {
                                setShowEditProductModal(false);
                                setProductToEdit(null);
                            }}
                            gardenId={Number(id)}
                            product={productToEdit}
                        />
                    )}

                    {/* Modal de confirmación para eliminar */}
                    {showDeleteModal && (
                        <Modal
                            title="Confirmar eliminación"
                            text={`¿Estás seguro que quieres eliminar este ${itemToDelete?.type === 'garden' ? 'huerto' : 'producto'}?`}
                            onConfirm={handleConfirmDelete}
                            onCancel={() => {
                                setShowDeleteModal(false);
                                setItemToDelete(null);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default GardenOwnerView;
