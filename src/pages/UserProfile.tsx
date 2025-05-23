import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById } from '../services/userService';
import Avatar from '../components/Avatar';

interface UserData {
    name: string;
    lastName: string;
    email: string;
    location: string;
    profileImage: string;
}

const UserProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { userId } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState<UserData>({
        name: 'Usuario',
        lastName: 'Ejemplo',
        email: 'usuario@ejemplo.com',
        location: 'Barcelona',
        profileImage: '',
    });
    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!userId) return;
                const user = await getUserById(userId);
                setUserData(prev => ({
                    ...prev,
                    name: user.name,
                    lastName: user.surname,
                    email: user.email,
                    location: user.location,
                    profileImage: user.profileImage || prev.profileImage
                }));
            } catch (err) {
                console.error("Error cargando usuario:", err);
            }
        };
        fetchUser();
    }, [userId]);

    const handleImageClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prev => ({
                    ...prev,
                    profileImage: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPassword(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // Aquí iría la lógica para guardar los cambios en el backend
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-32">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Perfil de Usuario</h1>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            {isEditing ? 'Cancelar' : 'Editar Perfil'}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex flex-col items-center">
                            <div 
                                className="relative" 
                                onClick={handleImageClick}
                            >
                                <Avatar
                                    src={userData.profileImage}
                                    alt="Foto de perfil"
                                    size={192}
                                    className="shadow-md"
                                />
                                
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white rounded-full cursor-pointer">
                                        <span className="text-sm font-medium">Cambiar foto</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Apellidos
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Población
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={userData.location}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-6 border-t pt-6">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Cambiar Contraseña</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Contraseña Actual
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="current"
                                                    value={password.current}
                                                    onChange={handlePasswordChange}
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                >
                                                    {showPassword ? "Ocultar" : "Mostrar"}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nueva Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                name="new"
                                                value={password.new}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirmar Nueva Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                name="confirm"
                                                value={password.confirm}
                                                onChange={handlePasswordChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isEditing && (
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;