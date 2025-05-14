import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../services/authService";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async ({ email, password }: { email: string; password: string }) => {
        setError(null); // Limpiar errores anteriores
        try {
            const token = await loginRequest(email, password);
            login(token); // Iniciar sesión con el token
            navigate("/home"); // Redirigir a la página principal después del login exitoso
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión");
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-[url('/img/Fondo.png')] bg-cover bg-center">
            <div className="relative w-full sm:w-[400px] md:w-[500px] lg:w-[600px] h-auto max-w-none bg-white p-8 rounded-2xl shadow-lg">
                <div className="absolute w-[200px] h-[200px] -top-[100px] -right-[100px] rounded-full bg-lime-50"></div>
                <div className="absolute w-[150px] h-[150px] -bottom-[75px] -left-[75px] rounded-full bg-lime-100"></div>
                <div className="text-center relative py-4">
                    <h1 className="text-6xl md:text-4xl font-semibold text-lime-600 mb-6 leading-tight tracking-tight">L'horta</h1>
                    <p className="text-gray-600 text-base md:text-lg font-light mb-8 max-w-md mx-auto">Inicia sesión para acceder a tu huerto</p>

                    {/* Mostrar el error si existe */}
                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    {/* Componente LoginForm */}
                    <LoginForm onSubmit={handleLogin} />
                    <p className="mt-6 text-gray-600">
                        ¿No eres miembro?{" "}
                        <Link to="/register" className="text-lime-600 font-medium no-underline">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;