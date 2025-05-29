import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { getGardenById } from '../services/gardenService';
import { CreateSessionModal } from '../components/Modal/CreateSessionModal';

const GardenOwnerView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [garden, setGarden] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
    const [showCreateSession, setShowCreateSession] = useState(false);


    useEffect(() => {
        const fetchGarden = async () => {
            try {
                const data = await getGardenById(Number(id));
                console.log(data);
                setGarden(data);
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
                                onClick={() => navigate(`/editar-huerto/${garden.id}`)}
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

                    {activeTab === 'productos' && garden.products && (
                        <div className="space-y-4">
                            {garden.products.map((product: any) => (
                                <div key={product.id} className="border p-4 rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover" />
                                        <div>
                                            <h3 className="font-semibold">{product.name}</h3>
                                            <p>{product.unitPrice} €/kg - {product.quantity}g</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                                        >Editar</button>
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'voluntariado' && (
                        <div className="space-y-4">
                            {garden.sessions?.map((session: any) => (
                                <div key={session.id} className="border p-4 rounded-lg">
                                    <h3 className="font-semibold">{session.taskDescription}</h3>
                                    <p>{session.date} | {session.startTime} - {session.endTime}</p>
                                    <p>Voluntarios necesarios: {session.requiredVolunteers}</p>
                                </div>
                            ))}
                            <div className="flex justify-end">
                                <button
                                    onClick={() =>setShowCreateSession(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                                >
                                    <PlusCircle size={20} /> Crear sesión de voluntariado
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modales: editar producto, eliminar huerto, crear sesión de voluntariado */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    {/* Modal contenido edición producto */}
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    {/* Modal contenido eliminación huerto */}
                </div>
            )}

            {volunteerModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    {/* Modal contenido creación voluntariado */}
                </div>
            )}
        </div>
    );
};

export default GardenOwnerView;
