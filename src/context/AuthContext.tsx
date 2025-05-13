import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthContextType = {
    login: (token: string) => void;
    logout: () => void;
    token: string | null;
};

type AuthProviderProps = {
    children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);

    const login = (token: string) => setToken(token);
    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

