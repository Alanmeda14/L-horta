import { useState } from "react";

type RegisterFormProps = {
    onSubmit: (data: {
        name: string;
        surname: string;
        email: string;
        password: string;
        localizacion: string;
    }) => void;
};

const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localizacion, setLocalizacion] = useState("");
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
            await onSubmit({ name, surname, email, password, localizacion });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mt-4 text-gray-700">
                    Nombre
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                    Apellidos
                </label>
                <input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="mt-1 w-2/3 px-4 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo Electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            <div>
                <label htmlFor="localizacion" className="block text-sm font-medium text-gray-700">
                    Localización
                </label>
                <input
                    id="localizacion"
                    type="text"
                    value={localizacion}
                    onChange={(e) => setLocalizacion(e.target.value)}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-lime-500 text-white py-2 rounded-lg hover:bg-lime-700 transition-colors"
            >
                {loading ? "Registrando..." : "Registrarse"}
            </button>
        </form>
    );
};

export default RegisterForm;