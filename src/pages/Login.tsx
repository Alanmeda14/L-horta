import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import LoginForm from "../components/Form/LoginForm";
import { Sprout } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setError(null);
    try {
      if (!email || !password) {
        throw new Error(
          "Sisplau, introdueix el correu electrònic i la contrasenya."
        );
      }

      await login(email, password); // ✅ ESPERAR login
      navigate("/home"); // ✅ Solo si el login fue exitoso
    } catch (err: any) {
      setError(err.message || "Error a l'iniciar sessió");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('../img/Fondo.png')] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex justify-center mb-6">
            <Sprout className="w-12 h-12 text-green-700" />
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Bienvenido
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Accede a tu comunidad
          </p>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <LoginForm onSubmit={handleLogin} />
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 hover:text-green-800 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
