import api from './api';

const API_URL = '/sessions';

export interface VolunteerSession {
  gardenId: number;
  startDatetime: string;
  endDatetime: string;
  maxVolunteers: number;
  taskDescription: string;
}

export const getAllSessions = async (): Promise<VolunteerSession[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const createSession = async (session: VolunteerSession): Promise<VolunteerSession> => {
  const payload = {
    datetime: session.startDatetime,
    maxVolunteers: session.maxVolunteers,
    taskDescription: session.taskDescription,
    garden: { id: session.gardenId }
  };
  console.log(payload);
  const res = await api.post(API_URL, payload);
  return res.data;
};

export const deleteSession = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};


export const getSessionsByGardenId = async (gardenId: number): Promise<VolunteerSession[]> => {
  const res = await api.get(`${API_URL}?gardenId=${gardenId}`);
  return res.data;
};
