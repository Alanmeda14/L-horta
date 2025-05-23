const API_URL = 'http://localhost:8080/api';

// Login
export const loginRequest = async (email: string, password: string): Promise<string> => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    return data.token; // Asegúrate de que el backend responde con { token: "..." }
};

// Registro
export const registerRequest = async (
    name: string,
    surname: string,
    email: string,
    password: string,
    location: string
): Promise<void> => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            surname,
            email,
            password,
            location,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al registrar');
    }
};
