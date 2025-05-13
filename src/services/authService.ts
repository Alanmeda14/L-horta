export const loginRequest = async (email: string, password: string): Promise<string> => {
    const response = await fetch('https://tu-backend.com/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Error al iniciar sesión');
    }

    const data = await response.json();
    return data.token;
};