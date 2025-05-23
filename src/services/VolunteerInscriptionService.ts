import api from './api';

const API_URL = '/volunteer-inscriptions';

// Tipo TypeScript para la inscripción
export interface VolunteerInscription {
  id?: number;
  sessionId: number;
  userId: number;
}

// Obtener todas las inscripciones (opcional)
export const getAllInscriptions = async (): Promise<VolunteerInscription[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

// Crear una inscripción de voluntario
export const createInscription = async (inscription: VolunteerInscription): Promise<VolunteerInscription> => {
  const payload = {
    session: { id: inscription.sessionId },
    user: { id: inscription.userId }
  };

  const res = await api.post(API_URL, payload);
  return res.data;
};

// Eliminar una inscripción
export const deleteInscription = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};
