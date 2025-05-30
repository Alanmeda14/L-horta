import { useState } from "react";
import { Lock, Mail, Sprout, User, Users } from 'lucide-react';
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError(t("passwords_do_not_match"));
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
                <Sprout className="w-12 h-12 text-green-700" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">{t("create_account")}</h2>
            <p className="text-center text-gray-600 mb-8">{t("join_community")}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                            <User className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder={t("name")}
                            required
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                            <Users  className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder={t("surname")}
                            required
                        />
                    </div>
                </div>

                <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                        <Mail  className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder={t("email")}
                        required
                    />
                </div>

                <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder={t("password")}
                        required
                    />
                </div>

                <div className="relative mt-4">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder={t("confirm_new_password")}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="cursor-pointer w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                    {loading ? t("registering") : t("create_account_")}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;