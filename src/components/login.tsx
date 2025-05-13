// src/components/Login.tsx
import React from 'react';

const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('../img/Fondo.png')] bg-cover bg-center">

            <div className="w-[600px] h-[500px] mt-[100px] max-w-none bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-[#4E342E]">Iniciar Sesion</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gay-600">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-400 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                        Iniciar Sesión 
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-500">
                    ¿No tienes cuenta? <a href="#" className="text-green-600 hover:underline">Regístrate</a>
                </p>

            </div>
        </div>
    );
};

export default Login;
