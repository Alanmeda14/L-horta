import { Session } from 'types/types';
import api from './api';

const API_URL = '/sessions';

export type VolunteerSession = Session;

export interface CreateSessionData {
    date: string;
    startTime: string;
    endTime: string;
    maxParticipants: number;
    description: string;
    gardenId: number;
}

export const getAllSessions = async (): Promise<VolunteerSession[]> => {
  const res = await api.get(API_URL);
  return res.data;
};

export const createSession = async (sessionData: CreateSessionData): Promise<VolunteerSession> => {
    const payload = {
        ...sessionData,
        garden: { id: sessionData.gardenId }
    };
    const res = await api.post(API_URL, payload);
    return res.data;
};

export const getSessionsByGardenId = async (gardenId: number): Promise<VolunteerSession[]> => {
  const res = await api.get(`${API_URL}?gardenId=${gardenId}`);
  return res.data;
};

export const deleteSession = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/${id}`);
};