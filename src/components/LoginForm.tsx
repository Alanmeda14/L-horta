import { useState } from 'react';

type LoginFormProps = {
    onSubmit: (data: { email: string; password: string }) => void;
};

const LoginForm = ({ onSubmit }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");  // Limpiar error antes de intentar iniciar sesión

        try {
            await onSubmit({ email, password });
        } catch (err) {
            setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                    Correo Electrónico
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-green-400 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                disabled={loading}
            >
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
        </form>
    );
};

export default LoginForm;


