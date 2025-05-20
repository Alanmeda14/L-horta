import React, { useState } from 'react';
import { Lock, Mail, User, Users } from 'lucide-react';
import Avatar from '../Avatar';
import { DEFAULT_AVATAR } from '../../constants/defaults';

interface RegisterFormProps {
    onSubmit: (data: {
        name: string;
        surname: string;
        email: string;
        password: string;
    }) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.surname.trim()) {
            newErrors.surname = 'El apellido es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            onSubmit({
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                password: formData.password,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
                <Avatar size={80} src={DEFAULT_AVATAR} alt="Default profile" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <User className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder="Nombre"
                        />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Users className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.surname ? 'border-red-300' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                            placeholder="Apellidos"
                        />
                    </div>
                    {errors.surname && <p className="mt-1 text-sm text-red-600">{errors.surname}</p>}
                </div>
            </div>

            <div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Email"
                    />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.password ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Contraseña"
                    />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-2 rounded-lg border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Confirmar Contraseña"
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
            </div>

            <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Registrarse
            </button>
        </form>
    );
};

export default RegisterForm;