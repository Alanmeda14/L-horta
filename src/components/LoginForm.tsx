import { useState } from 'react';
import { Sprout } from 'lucide-react';


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
        setError("");

        try {
            await onSubmit({ email, password });
        } catch (err) {
            setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-6">
                <Sprout className="w-8 h-8 text-green-700" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">Bienvenido</h2>
            <p className="text-center text-gray-600 mb-8">Accede a tu comunidad</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                        📧
                    </span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                        🔒
                    </span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder="Password"
                        required
                    />
                </div>


                <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;


