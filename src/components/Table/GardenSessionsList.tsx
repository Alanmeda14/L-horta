import React from 'react';
import { Session } from '../../types/types';

interface Props {
    sessions: Session[];
    volunteerStatus: Record<number, boolean>;
    availableSpots: Record<number, number>;
    onToggleVolunteerStatus?: (sessionId: number) => void;
    isOwner?: boolean;
    onNavigate: (path: string) => void;
}

export const GardenSessionsList: React.FC<Props> = ({
    sessions,
    volunteerStatus,
    availableSpots,
    onToggleVolunteerStatus,
    isOwner,
    onNavigate
}) => {
    if (sessions.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 text-lg">Este huerto no tiene opciones de voluntariado disponibles actualmente.</p>
                <button
                    onClick={() => onNavigate('/home')}
                    className="mt-4 px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 transition-all hover:shadow-md">
                    <h3 className="font-semibold">{session.taskDescription}</h3>
                    <p className="text-gray-600">{new Date(session.datetime).toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600">Plazas disponibles: {availableSpots[session.id]}</p>
                        {availableSpots[session.id] === 0 && (
                            <span className="text-red-600 text-sm">No hay plazas disponibles</span>
                        )}
                    </div>
                    {isOwner && (
                        !volunteerStatus[session.id] ? (
                            <button
                            onClick={() => onToggleVolunteerStatus?.(session.id)}
                            disabled={availableSpots[session.id] === 0}
                            className={`mt-3 px-4 py-2 rounded-lg transition-colors ${
                                availableSpots[session.id] === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            >
                            Inscribirse
                            </button>
                        ) : (
                            <button
                            onClick={() => onToggleVolunteerStatus?.(session.id)}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                            Desinscribirse
                            </button>
                        )
                    )}
                </div>
            ))}
        </div>
    );
}; 