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

export const registerRequest = async (
    name: string,
    surname: string,
    email: string,
    password: string,
    localizacion: string
): Promise<void> => {
    const response = await fetch("https://tu-backend.com/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            surname,
            email,
            password,
            localizacion
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al registrar");
    }
};