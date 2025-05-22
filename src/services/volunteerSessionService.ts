import axios from 'axios';

const API_URL = 'http://localhost:8080/sessions';

export interface VolunteerSession {
  id?: number;
  gardenId: number;
  datetime: string; // ISO string
  maxVolunteers: number;
  taskDescription: string;
}

export const getAllSessions = async (): Promise<VolunteerSession[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createSession = async (session: VolunteerSession): Promise<VolunteerSession> => {
  const payload = {
    datetime: session.datetime,
    maxVolunteers: session.maxVolunteers,
    taskDescription: session.taskDescription,
    garden: { id: session.gardenId }
  };
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export const deleteSession = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// ✅ NUEVO: filtrar por gardenId
export const getSessionsByGardenId = async (gardenId: number): Promise<VolunteerSession[]> => {
  const res = await axios.get(`${API_URL}?gardenId=${gardenId}`);
  return res.data;
};
