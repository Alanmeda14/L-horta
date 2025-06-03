import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, PlusCircle, Calendar, Clock, Users } from 'lucide-react';
import { getGardenById, Product, Garden } from '../services/gardenService';
import { getSessionsByGardenId, VolunteerSession } from '../services/volunteerSessionService';
import { useTranslation } from 'react-i18next';

const OwnerGarden = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [garden, setGarden] = useState<Garden | null>(null);
    const [activeTab, setActiveTab] = useState('productos');
    const [products, setProducts] = useState<Product[]>([]);
    const [sessions, setSessions] = useState<VolunteerSession[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newSession, setNewSession] = useState<VolunteerSession>({
        taskDescription: '',
        startDateTime: '',
        endDateTime: '',
        maxVolunteers: 1,
        gardenId: Number(id),
    });

    const unitOptions = [
        { value: 'kg', label: 'Kilogramos' },
        { value: 'g', label: 'Gramos' },
        { value: 'unit', label: 'Unidades' }
    ];

    useEffect(() => {
        const fetchGardenAndSessions = async () => {
            try {
                const data = await getGardenById(Number(id));
                setGarden(data);
                if (data.products) {
                    const updatedProducts = data.products.map(product => ({
                        ...product,
                        unitType: (product as any).unitType || 'g'
                    }));
                    setProducts(updatedProducts);
                }

                const sessionData = await getSessionsByGardenId(Number(id));
                setSessions(sessionData);
            } catch (err) {
                console.error('Error fetching garden or sessions:', err);
            }
        };

        fetchGardenAndSessions();
    }, [id]);

    const updateProductField = (index: number, field: keyof Product, value: any) => {
        const updated = [...products];
        updated[index] = { ...updated[index], [field]: value };
        setProducts(updated);
        setHasChanges(true);
    };

    const updateSessionField = (index: number, field: keyof VolunteerSession, value: any) => {
        const updated = [...sessions];
        updated[index] = { ...updated[index], [field]: value };
        setSessions(updated);
        setHasChanges(true);
    };

    const deleteSession = (index: number) => {
        setSessions(prev => prev.filter((_, i) => i !== index));
        setHasChanges(true);
    };

    const addNewSession = () => {
        if (new Date(newSession.endDateTime) <= new Date(newSession.startDateTime)) {
            alert('La hora de finalización debe ser posterior a la hora de inicio');
            return;
        }

        if (!newSession.taskDescription || !newSession.startDateTime || !newSession.endDateTime) {
            alert('Por favor, complete todos los campos obligatorios');
            return;
        }

        setSessions(prev => [...prev, { ...newSession }]);
        setNewSession({
            taskDescription: '',
            startDateTime: '',
            endDateTime: '',
            maxVolunteers: 1,
            gardenId: Number(id),
        });
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!garden) return;

        setIsSaving(true);
        try {
            // In a real app, you would save both products and sessions here
            await Promise.all([
                // Save products
                new Promise(resolve => setTimeout(resolve, 1000)), // Simulated API call
                // Save sessions
                new Promise(resolve => setTimeout(resolve, 1000)), // Simulated API call
            ]);

            setHasChanges(false);
            alert('Cambios guardados correctamente');
        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error al guardar los cambios');
        } finally {
            setIsSaving(false);
        }
    };
  const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{garden?.name || 'Mi Huerto'}</h1>
                            <p className="text-gray-600">{garden?.description || 'Sin descripción'}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/home')}
                                className="px-4 py-2 flex items-center gap-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                <ArrowLeft size={18} />
                                <span>Volver</span>
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                className={`px-4 py-2 flex items-center gap-2 rounded-md text-white ${hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <Save size={18} />
                                <span>{isSaving ? 'Guardando...' : 'Guardar cambios'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="border-b mb-6">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === 'productos'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('productos')}
                        >
                            {t('products')}
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ml-4 ${activeTab === 'voluntariado'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => setActiveTab('voluntariado')}
                        >
                            Voluntariado
                        </button>
                    </div>

                    {activeTab === 'productos' && (
                        <div className="space-y-6">
                            {products.map((product, index) => (
                                <div key={product.id} className="bg-white border rounded-lg p-5 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4">{product.name}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo de unidad
                                            </label>
                                            <select
                                                value={product.unitType}
                                                onChange={(e) => updateProductField(index, 'unitType', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            >
                                                {unitOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Precio por {product.unitType === 'kg' ? 'kg' : product.unitType === 'g' ? '100g' : 'unidad'} (€)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={product.unitPrice}
                                                onChange={(e) => updateProductField(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cantidad disponible ({product.unitType === 'unit' ? 'unidades' : product.unitType})
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={product.availableQuantity}
                                                onChange={(e) => updateProductField(index, 'availableQuantity', parseInt(e.target.value) || 0)}
                                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'voluntariado' && (
                        <div className="space-y-6">
                            {sessions.map((session, index) => (
                                <div key={index} className="bg-white border rounded-lg p-5 shadow-sm relative">
                                    <button
                                        onClick={() => deleteSession(index)}
                                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>

                                    <div className="pr-8">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Descripción de la tarea
                                            </label>
                                            <input
                                                type="text"
                                                value={session.taskDescription}
                                                onChange={(e) => updateSessionField(index, 'taskDescription', e.target.value)}
                                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Fecha y hora de inicio
                                                </label>
                                                <div className="flex items-center">
                                                    <Calendar size={18} className="text-gray-500 mr-2" />
                                                    <input
                                                        type="datetime-local"
                                                        value={session.startDateTime}
                                                        onChange={(e) => updateSessionField(index, 'startDateTime', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Fecha y hora de finalización
                                                </label>
                                                <div className="flex items-center">
                                                    <Clock size={18} className="text-gray-500 mr-2" />
                                                    <input
                                                        type="datetime-local"
                                                        value={session.endDateTime}
                                                        onChange={(e) => updateSessionField(index, 'endDateTime', e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Número máximo de voluntarios
                                                </label>
                                                <div className="flex items-center">
                                                    <Users size={18} className="text-gray-500 mr-2" />
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={session.maxVolunteers}
                                                        onChange={(e) => updateSessionField(index, 'maxVolunteers', parseInt(e.target.value) || 1)}
                                                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="bg-gray-50 border rounded-lg p-5">
                                <h3 className="font-semibold text-gray-800 mb-4">Añadir nueva sesión de voluntariado</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción de la tarea *
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Plantación de tomates"
                                            value={newSession.taskDescription}
                                            onChange={(e) => setNewSession(prev => ({ ...prev, taskDescription: e.target.value }))}
                                            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Número máximo de voluntarios *
                                        </label>
                                        <div className="flex items-center">
                                            <Users size={18} className="text-gray-500 mr-2" />
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Número de plazas"
                                                value={newSession.maxVolunteers}
                                                onChange={(e) => setNewSession(prev => ({ ...prev, maxVolunteers: parseInt(e.target.value) || 1 }))}
                                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha y hora de inicio *
                                        </label>
                                        <div className="flex items-center">
                                            <Calendar size={18} className="text-gray-500 mr-2" />
                                            <input
                                                type="datetime-local"
                                                value={newSession.startDateTime}
                                                onChange={(e) => setNewSession(prev => ({ ...prev, startDateTime: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Fecha y hora de finalización *
                                        </label>
                                        <div className="flex items-center">
                                            <Clock size={18} className="text-gray-500 mr-2" />
                                            <input
                                                type="datetime-local"
                                                value={newSession.endDateTime}
                                                onChange={(e) => setNewSession(prev => ({ ...prev, endDateTime: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={addNewSession}
                                    className="mt-5 w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                                >
                                    <PlusCircle size={18} />
                                    <span>Añadir sesión</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerGarden;