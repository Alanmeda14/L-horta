import { createContext, useContext, useState } from 'react';
import type {ReactNode} from 'react';
interface AuthContextType {
    isAuthenticated: boolean;
    /* Tot el que estigui comentat a aquesta pàgina és per afegir posteriorment el token */
    /* token: string | null;
    login: (token: string) => void; */
    login: (email: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    /* const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const isAuthenticated = !!token;
 */
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    /* const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    }; */

    const login = (email: string, password: string) => {
        // For now, just do a simple check. You can replace this with your actual authentication logic later
        if (email && password) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
        }
    };

    const logout = () => {
        /* setToken(null);
        localStorage.removeItem('token'); */
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    useState(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        if (storedAuth === 'true') {
            setIsAuthenticated(true);
        }
    });

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}> {/* <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}> */}
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

