import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import { getGardenById } from '../services/gardenService';
import Modal from '../components/common/Modal'; // Asegúrate que esta ruta sea correcta
import { CreateSessionModal } from '../components/Modal/CreateSessionModal';

const GardenOwnerView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [garden, setGarden] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToEdit, setProductToEdit] = useState<any>(null);
    const [showCreateSession, setShowCreateSession] = useState(false);

    // Nuevo estado para controlar qué se quiere eliminar (huerto o producto)
    const [itemToDelete, setItemToDelete] = useState<{ type: 'garden' | 'product'; id: number | null }>({ type: 'garden', id: null });

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

    // Función para abrir modal de eliminar huerto
    const handleOpenDeleteGardenModal = () => {
        setItemToDelete({ type: 'garden', id: garden.id });
        setShowDeleteModal(true);
    };

    // Función para abrir modal de eliminar producto
    const handleOpenDeleteProductModal = (productId: number) => {
        setItemToDelete({ type: 'product', id: productId });
        setShowDeleteModal(true);
    };

    // Confirmar eliminación: puede eliminar huerto o producto según itemToDelete
    const handleConfirmDelete = () => {
        if (itemToDelete.type === 'garden') {
            // Aquí pones la lógica para eliminar huerto
            console.log('Eliminar huerto con id:', itemToDelete.id);
            // Luego cerrar modal y redirigir o actualizar estado
            setShowDeleteModal(false);
            // Ejemplo: navigate('/mis-huertos');
        } else if (itemToDelete.type === 'product') {
            // Lógica para eliminar producto
            console.log('Eliminar producto con id:', itemToDelete.id);
            // Aquí elimina producto del estado garden.products, o llama API, etc.
            if (garden) {
                const updatedProducts = garden.products.filter((p: any) => p.id !== itemToDelete.id);
                setGarden({ ...garden, products: updatedProducts });
            }
            setShowDeleteModal(false);
        }
    };

    const handleEditProduct = (product: any) => {
        setProductToEdit(product);
        setShowEditModal(true);
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
                                onClick={handleOpenDeleteGardenModal}
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
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleOpenDeleteProductModal(product.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Eliminar
                                        </button>
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
                                    <p>
                                        {session.date} | {session.startTime} - {session.endTime}
                                    </p>
                                    <p>Voluntarios necesarios: {session.requiredVolunteers}</p>
                                </div>
                            ))}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowCreateSession(true)}
                                    className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
                                >
                                    <PlusCircle size={20} /> Crear sesión de voluntariado
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modales */}

            {/* Modal editar producto (a completar) */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    {/* Aquí va contenido del modal de edición */}
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
                        {/* Formulario de edición (no definido aquí) */}
                        <button onClick={() => setShowEditModal(false)} className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cerrar</button>
                    </div>
                </div>
            )}

            {/* Modal confirmar eliminación */}
            {showDeleteModal && (
                <Modal
                    title="Confirmar eliminación"
                    text={
                        itemToDelete.type === "garden"
                            ? "¿Seguro que quieres eliminar este huerto? Esta acción no se puede deshacer."
                            : "¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer."
                    }
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}

            {/* Modal crear sesión voluntariado */}
            {showCreateSession && (
                <CreateSessionModal
                    isOpen={showCreateSession}
                    onClose={() => setShowCreateSession(false)}
                    gardenId={garden.id}
                />
            )}
        </div>
    );
};

export default GardenOwnerView;
