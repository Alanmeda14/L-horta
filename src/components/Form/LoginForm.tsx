import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type LoginFormProps = {
    onSubmit: (data: { email: string; password: string }) => void;
    isLoading?: boolean;
};

const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            await onSubmit({ email, password });
        } catch (err) {
            setError(t("login_error"));
        }
    };

    return (
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("email")}
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-lg">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder={t("email")}
                        required
                        disabled={isLoading}
                    />
                </div>

                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("password")}
                </label>
                <div className="relative">
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
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full py-2 rounded-lg transition-colors ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-700 hover:bg-green-800 cursor-pointer'
                    } text-white`}
                    disabled={isLoading}
                >
                    {isLoading ? t('loading') : t('login')}
                </button>
            </form>
    );
};

export default LoginForm;


