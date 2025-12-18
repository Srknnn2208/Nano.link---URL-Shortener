import type { ShortenRequest, ShortenResponse, ActivityLog } from '../types';

// API Base URL
const API_URL = 'http://localhost:8080/api';



export const api = {
    shorten: async (data: ShortenRequest): Promise<ShortenResponse> => {
        const response = await fetch(`${API_URL}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create link');
        }

        return await response.json();
    },

    getActivity: async (userId: string): Promise<ActivityLog[]> => {
        const response = await fetch(`${API_URL}/activity?userId=${userId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch activity');
        }
        return await response.json();
    },

    deleteActivity: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/activity/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete link');
        }
    },

    getUrl: async (code: string): Promise<ActivityLog> => {
        const response = await fetch(`${API_URL}/url/${code}`, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error('Link not found');
        }
        return await response.json();
    },

    trackClick: async (code: string): Promise<void> => {
        await fetch(`${API_URL}/click/${code}`, { method: 'POST', cache: 'no-cache' });
    },

    auth: {
        login: async (credentials: any) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            if (!response.ok) {
                const error = await response.json();
                throw error; // Throw the full error object to handle "suggestion" etc.
            }
            return await response.json();
        },
        register: async (credentials: any) => {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }
            return await response.json();
        }
    }
};
