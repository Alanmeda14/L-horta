import { useState } from "react";
import { Sprout } from 'lucide-react';

type RegisterFormProps = {
    onSubmit: (data: {
        name: string;
        surname: string;
        email: string;
        password: string;
    }) => void;
};

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            await onSubmit({ name, surname, email, password });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-6">
                <Sprout className="w-10 h-10 text-green-700" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Crear tu cuenta</h2>
            <p className="text-center text-gray-600 mb-8">Únete a nuestra comunidad</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">👤</span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Nombre"
                            required
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">👥</span>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Apellidos"
                            required
                        />
                    </div>
                </div>

                <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">📧</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">🔒</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder="Contraseña"
                        required
                    />
                </div>

                <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">🔒</span>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder="Confirmar Contraseña"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                    {loading ? "Registrando..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;