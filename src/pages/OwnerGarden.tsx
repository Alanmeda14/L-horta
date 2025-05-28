import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, PlusCircle } from 'lucide-react';
import { getGardenById, Product, Garden } from '../services/gardenService';
import { getSessionsByGardenId, VolunteerSession } from '../services/volunteerSessionService';

const OwnerGarden = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [garden, setGarden] = useState<Garden | null>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [products, setProducts] = useState<Product[]>([]);
    const [sessions, setSessions] = useState<VolunteerSession[]>([]);
    const [newSession, setNewSession] = useState<VolunteerSession>({
        taskDescription: '',
        datetime: '',
        maxVolunteers: 1,
        gardenId: Number(id),
    });

    useEffect(() => {
        const fetchGardenAndSessions = async () => {
            try {
                const data = await getGardenById(Number(id));
                setGarden(data);
                if (data.products) setProducts(data.products);

                const sessionData = await getSessionsByGardenId(Number(id));
                setSessions(sessionData);
            } catch (err) {
                console.error('Error fetching garden or sessions:', err);
            }
        };

        fetchGardenAndSessions();
    }, [id]);

    const updateProductField = (index: number, field: string, value: any) => {
        setProducts(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const updateSessionField = (index: number, field: string, value: any) => {
        setSessions(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const deleteSession = (index: number) => {
        setSessions(prev => prev.filter((_, i) => i !== index));
    };

    const addNewSession = () => {
        setSessions(prev => [...prev, { ...newSession }]);
        setNewSession({ taskDescription: '', datetime: '', maxVolunteers: 1, gardenId: Number(id) });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6 border-b">
                    <button
                        className={`px-4 py-2 font-medium ${activeTab === 'productos' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('productos')}
                    >
                        Productos
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ml-4 ${activeTab === 'voluntariado' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('voluntariado')}
                    >
                        Voluntariado
                    </button>
                </div>

                {activeTab === 'productos' && (
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={product.id} className="border rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                <div className="flex gap-4">
                                    <label className="flex flex-col">
                                        Precio por kg (€)
                                        <input
                                            type="number"
                                            value={product.unitPrice}
                                            onChange={e => updateProductField(index, 'unitPrice', parseFloat(e.target.value))}
                                            className="border px-2 py-1 rounded"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        Cantidad disponible (g)
                                        <input
                                            type="number"
                                            value={(product as any).availableQuantity || 0}
                                            onChange={e => updateProductField(index, 'availableQuantity', parseInt(e.target.value))}
                                            className="border px-2 py-1 rounded"
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'voluntariado' && (
                    <div className="space-y-6">
                        {sessions.map((session, index) => (
                            <div key={index} className="border rounded-lg p-4 relative">
                                <button
                                    onClick={() => deleteSession(index)}
                                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <label className="block mb-2">
                                    Descripción
                                    <input
                                        type="text"
                                        value={session.taskDescription}
                                        onChange={e => updateSessionField(index, 'taskDescription', e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                </label>
                                <label className="block mb-2">
                                    Fecha y hora
                                    <input
                                        type="datetime-local"
                                        value={session.datetime}
                                        onChange={e => updateSessionField(index, 'datetime', e.target.value)}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                </label>
                                <label className="block">
                                    Plazas disponibles
                                    <input
                                        type="number"
                                        value={session.maxVolunteers}
                                        onChange={e => updateSessionField(index, 'maxVolunteers', parseInt(e.target.value))}
                                        className="border px-2 py-1 rounded w-full"
                                    />
                                </label>
                            </div>
                        ))}

                        <div className="border rounded-lg p-4 bg-gray-50">
                            <h3 className="font-semibold mb-2">Añadir nueva sesión</h3>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Descripción"
                                    value={newSession.taskDescription}
                                    onChange={e => setNewSession(prev => ({ ...prev, taskDescription: e.target.value }))}
                                    className="border px-2 py-1 rounded w-full"
                                />
                                <input
                                    type="datetime-local"
                                    value={newSession.datetime}
                                    onChange={e => setNewSession(prev => ({ ...prev, datetime: e.target.value }))}
                                    className="border px-2 py-1 rounded w-full"
                                />
                                <input
                                    type="number"
                                    placeholder="Plazas"
                                    value={newSession.maxVolunteers}
                                    onChange={e => setNewSession(prev => ({ ...prev, maxVolunteers: parseInt(e.target.value) }))}
                                    className="border px-2 py-1 rounded w-full"
                                />
                                <button
                                    onClick={addNewSession}
                                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                                >
                                    <PlusCircle size={18} /> Añadir sesión
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OwnerGarden;
