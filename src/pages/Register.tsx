import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerRequest } from "../services/authService";
import { Link } from "react-router-dom";
import RegisterForm from "../components/Form/RegisterForm";

const Register = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async ({
        name,
        surname,
        email,
        password,
    }: {
        name: string;
        surname: string;
        email: string;
        password: string;
    }) => {
        setError(null);
        try {
            const user = await registerRequest(name, surname, email, password);
            localStorage.setItem('userId', user.id);
            navigate("/usuario");
        } catch (err: any) {
            setError(err.message || "Error al registrarse");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('../img/Fondo.png')] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-md w-full bg-white rounded-xl rounded-bl-2xl shadow-lg p-8 relative">
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full"></div>
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full"></div>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <RegisterForm onSubmit={handleRegister} />
                <div className="flex items-center justify-center my-6">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <p className="mt-4 text-center text-gray-600 text-sm">
                    Already have an account?{" "}
                    <Link to="/" className="text-green-700 hover:text-green-800 font-medium">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;