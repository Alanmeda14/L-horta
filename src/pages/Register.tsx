import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerRequest } from "../services/authService";
import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async ({
        name,
        surname,
        email,
        password,
        localizacion,
    }: {
        name: string;
        surname: string;
        email: string;
        password: string;
        localizacion: string;
    }) => {
        setError(null);
        try {
            await registerRequest(name, surname, email, password, localizacion);
            navigate("/login");
        } catch (err: any) {
            setError(err.message || "Error al registrarse");
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-[url('/img/Fondo.png')] bg-cover bg-center">
            <div className="relative w-full sm:w-[400px] md:w-[500px] lg:w-[600px] bg-white p-2 rounded-    xl shadow-lg">
                <div className="text-center relative py-4">
                    <h1 className="text-3xl md:text-4xl font-semibold text-lime-600 mb-2">
                        Crear cuenta
                    </h1>
                    {/* <p className="text-gray-600 text-base md:text-lg font-light mb-2 max-w-md mx-auto">
                        Regístrate para algo....
                    </p> */}
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <RegisterForm onSubmit={handleRegister} />
                    <p className="mt-2 text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="text-lime-600 font-medium">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;