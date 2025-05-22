import axios from 'axios';

const API_URL = 'http://localhost:8080/volunteer-inscriptions';

// Tipo TypeScript para la inscripción
export interface VolunteerInscription {
  id?: number;
  sessionId: number;
  userId: number;
}

// Obtener todas las inscripciones (opcional)
export const getAllInscriptions = async (): Promise<VolunteerInscription[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Crear una inscripción de voluntario
export const createInscription = async (inscription: VolunteerInscription): Promise<VolunteerInscription> => {
  const payload = {
    session: { id: inscription.sessionId },
    user: { id: inscription.userId }
  };

  const res = await axios.post(API_URL, payload);
  return res.data;
};

// Eliminar una inscripción
export const deleteInscription = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
